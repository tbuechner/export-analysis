/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.importing;

import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONObject;

import com.google.common.base.Predicates;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Streams;

import cf.cplace.platform.core.application.job.assets.PersistentJob;
import cf.cplace.platform.core.application.job.QueuedBatchJob;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.Principal;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.frontend.handler.custom.ExcelUtilities;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.CandidateGroupSearch;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.UserExcelSheetDefinition;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.core.datamodel.builtin.PersistentSchema;
import cf.cplace.platform.commonlib.util.log.CountAndThrottleLog;
import cf.cplace.platform.core.application.job.data.DistributionType;
import cf.cplace.platform.core.application.job.data.ShutdownCancellationType;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.util.text.SafeHtml;
import cf.cplace.platform.commonlib.util.collect.MoreCollectors;

/**
 * Imports direct group memberships from an excel file.
 * The format of the excel file to be imported is described in {@link UserExcelSheetDefinition}.
 */
public class ImportFromExcelJob extends QueuedBatchJob {

    private static final Message jobName = new Message() {
    };
    private static final ParameterizedMessage notAllowed = new ParameterizedMessage() {
    };
    private static final long TIME_STEPS_IN_MILLIS = 5_000;
    private static final int COUNT_STEPS = 1;
    private static final String PATH_KEY = "path";

    private final UserExcelSheetDefinition userExcelSheetDefinition = new UserExcelSheetDefinition();

    private PersistentJob job;

    private List<@SafeHtml String> messagesToAppend =  new ArrayList<>();

    @Nullable
    @Override
    protected Message getJobName(String parameter) {
        return jobName;
    }

    @Nonnull
    @Override
    public DistributionType getDistributionType(@Nullable String parameter) {
        return DistributionType.DISTRIBUTED;
    }

    /**
     * Encodes the job parameters.
     * @param pathToExcel path to the excel file that contains users, groups and group memberships to be imported. The file will be deleted at the end of the job, so only provide temporary files!
     * @return created string containing the parameters formated as Json.
     */
    @Nonnull
    public static String paramsAsJson(String pathToExcel) {
        JSONObject jo = new JSONObject();
        jo.put(PATH_KEY, pathToExcel);
        return jo.toString();
    }

    @Override
    protected void execute(PersistentJob job) throws Exception {
        this.job = job;
        this.job.logText("Info: Reading input file...");
        JSONObject jo = new JSONObject(job._parameter().get());
        final File importFile = new File(jo.getString(PATH_KEY));

        try(final Workbook wb = ExcelUtilities.createWorkbookFromFileWithType(importFile, ExcelUtilities.WORKBOOK_TYPE_XSSF)) {
            final Sheet firstSheet = wb.getSheetAt(0);

            final Map<String, Group> groupsMatrixMap = getGroups(firstSheet);
            final Map<String, Person> personsMatrixMap = getPersons(firstSheet);
            final Map<String, List<String>> personWithMemberships = createPersonsWithMemberships(firstSheet, personsMatrixMap);

            this.job.logText(String.format("Info: Updating memberships: Looking at '%s' memberships...", groupsMatrixMap.entrySet().size() * personsMatrixMap.entrySet().size()));
            CountAndThrottleLog countAndThrottleLog = new CountAndThrottleLog(TIME_STEPS_IN_MILLIS, COUNT_STEPS);
            personsMatrixMap.values().forEach(person -> updateGroupMembershipsForPerson(groupsMatrixMap, personWithMemberships, countAndThrottleLog, person));
            if (countAndThrottleLog.hasUnloggedInc()) {
                this.job.logHtml(String.format("Processed %s memberships in total: Changes done: <br>%s", countAndThrottleLog.getCount(), String.join("<br>", messagesToAppend)));
            }
        } finally {
            importFile.delete();
        }
    }

    private void updateGroupMembershipsForPerson(Map<String, Group> groupsMatrixMap, Map<String, List<String>> personWithMemberships, CountAndThrottleLog countAndThrottleLog, Person person) {
        final Set<String> groupsWithMembership = new HashSet<>(personWithMemberships.get(person.getUid()));
        groupsMatrixMap.values().forEach(group -> {
            membershipUpdate(person, groupsWithMembership, group, countAndThrottleLog);
        });
    }

    @Override
    public boolean isUserJob() {
        return true;
    }

    @Nonnull
    @Override
    public ShutdownCancellationType getShutdownCancellationType(@Nullable String parameter) {
        return ShutdownCancellationType.NOT_SUPPORTED;
    }

    @Nonnull
    private Map<String, List<String>> createPersonsWithMemberships(Sheet firstSheet, Map<String, Person> personsMatrixMap) {
        final Row headerRowWithGroupNames = firstSheet.getRow(0);
        final Iterator<Row> rowIterator = firstSheet.rowIterator();
        skipRowWithGroupNames(rowIterator);
        Map<String, List<String>> personWithMemberships = Maps.newHashMap();
        // for each row - were row is list of memberships for user
        while (rowIterator.hasNext()) {
            Row rowWithMemberships = rowIterator.next();
            Optional.ofNullable(getPersonEmail(rowWithMemberships)).map(personsMatrixMap::get).ifPresent(person -> {
                final List<String> userMemberships = collectSinglePersonMemberships(headerRowWithGroupNames, rowWithMemberships, person.getName());
                personWithMemberships.put(person.getUid(), userMemberships);
            });
        }
        return personWithMemberships;
    }

    @Nullable
    private String getPersonEmail(Row rowWithMemberships) {
        return Optional
                .ofNullable(rowWithMemberships
                        .getCell(userExcelSheetDefinition.getLastColumnIndex()))
                .map(Cell::getStringCellValue)
                .map(String::trim)
                .orElse(null);
    }

    @Nonnull
    private List<String> collectSinglePersonMemberships(Row headerRowWithGroupNames, Row rowWithMemberships, String personName) {
        final List<String> activeUserMemberships = Lists.newArrayList();
        final Iterator<Cell> cellsWithMemberships = rowWithMemberships.iterator();
        skipUserItems(cellsWithMemberships);
        while (cellsWithMemberships.hasNext()) {
            final Cell membershipValue = cellsWithMemberships.next();
            final int columnIndex = membershipValue.getColumnIndex();
            final Cell groupName = headerRowWithGroupNames.getCell(columnIndex);
            boolean isMember;
            try {
                isMember = membershipValue.getBooleanCellValue();
            } catch (IllegalStateException e) {
                this.job.logText(String.format("Error: Membership cell for user: '%s' and group: '%s' contains an invalid value. Please enter a valid value", personName, groupName != null ? groupName.getStringCellValue() : "undefined"));
                throw e;
            }
            if (groupName != null && isMember) {
                activeUserMemberships.add(groupName.getStringCellValue());
            }
        }
        return activeUserMemberships;
    }

    private void membershipUpdate(Person person, Set<String> groupsWithMembership, Group group, CountAndThrottleLog countAndThrottleLog) {
        final String groupName = group.getName();
        final String personName = person.getName();
        if (group.getEntityPermissions().mayEdit()) {
            final Membership existingMembership = Membership.getMembership(group, person);
            final boolean shouldBecomeDirectMember = groupsWithMembership.contains(groupName);

            if (shouldBecomeDirectMember && existingMembership == null) {
                Person.createMembership(person, group, "Imported from excel");
                messagesToAppend.add(String.format("Created: %s to: %s", Escaping.html.escape(personName), Escaping.html.escape(groupName)));
            } else if (!shouldBecomeDirectMember && existingMembership != null && existingMembership.canBeDeleted() == null) {
                messagesToAppend.add(String.format("Removed: %s from: %s", Escaping.html.escape(personName), Escaping.html.escape(groupName)));
                existingMembership.remove();
            }
        } else {
            messagesToAppend.add(notAllowed.setParameters(groupName).getHtmlSafe());
        }
        if (countAndThrottleLog.incAndShouldLog()) {
            this.job.logHtml(String.format("Processed %s memberships in total: Changes done: <br>%s", countAndThrottleLog.getCount() - 1, String.join("<br>", messagesToAppend)));
            messagesToAppend.clear();
        }
    }

    @Nonnull
    private Map<String, Group> getGroups(Sheet firstSheet) {
        final Row headerRowWithGroupNames = firstSheet.getRow(0);
        final List<String> groupsNamesFromExcel = groupNamesFromExcel(headerRowWithGroupNames);
        final List<Group> existingGroupsFromExcel = new ArrayList<>();
        for (Iterable<String> batch : Iterables.partition(groupsNamesFromExcel, PersistentSchema.QUERY_ENTITIES_BATCH_SIZE)) {
            existingGroupsFromExcel.addAll(Group.SCHEMA.createQuery().where(Group.SCHEMA.prototype()._name().isIn(Lists.newArrayList(batch))).findList());
        }
        final Set<String> allVisibleForCurrentUser = new CandidateGroupSearch().findAll();
        Person user = SessionLocal.getUser();
        if (user == null) {
            this.job.logText("Error: Session has no user defined");
            throw new IllegalStateException("Session has no user defined");
        }
        final List<Group> filteredGroups = existingGroupsFromExcel.stream()
                .filter(group -> allVisibleForCurrentUser.contains(group.getId()))
                .filter(group -> group.isAdministratorOfThisGroup(user))
                .collect(Collectors.toList());
        final Map<String, Group> groupsMatrixMap = mapToNameOrdered(filteredGroups, group -> group._name().get());
        validateExcelGroups(groupsNamesFromExcel, groupsMatrixMap);

        return groupsMatrixMap;
    }

    @Nonnull
    private Map<String, Person> getPersons(Sheet firstSheet) {
        final List<String> personEmailFromExcel = personEmailFromExcel(firstSheet);
        final List<Person> existingPersonsFromExcel = new ArrayList<>();
        for (Iterable<String> batch : Iterables.partition(personEmailFromExcel, PersistentSchema.QUERY_ENTITIES_BATCH_SIZE)) {
            existingPersonsFromExcel.addAll(Person.SCHEMA.createQuery().where(Person.SCHEMA.prototype()._login().isIn(Lists.newArrayList(batch))).findList());
        }
        final Map<String, Person> personsMatrixMap = mapToNameOrdered(existingPersonsFromExcel, person -> person._login().get());
        validateExcelPersons(personEmailFromExcel, personsMatrixMap);
        return personsMatrixMap;
    }

    @Nonnull
    private List<String> personEmailFromExcel(Sheet firstSheet) {
        final Iterator<Row> rowIterator = firstSheet.rowIterator();
        skipRowWithGroupNames(rowIterator);
        return Streams.stream(rowIterator)
                .map(row -> row.getCell(userExcelSheetDefinition.getLastColumnIndex()))
                .filter(Objects::nonNull)
                .map(Cell::getStringCellValue).filter(StringUtils::isNotBlank)
                .map(String::trim)
                .collect(Collectors.toList());
    }

    @Nonnull
    private List<String> groupNamesFromExcel(Row headerRowWithGroupNames) {
        List<String> groupsNamesFromExcel = Lists.newArrayList();

        final Iterator<Cell> hederRowCellsIterator = headerRowWithGroupNames.iterator();
        // skip first cell in first row
        skipUserItems(hederRowCellsIterator);

        while (hederRowCellsIterator.hasNext()) {
            Cell cellWithGroupName = hederRowCellsIterator.next();
            final String groupName = cellWithGroupName.getStringCellValue().trim();
            if (StringUtils.isNotBlank(groupName))
                groupsNamesFromExcel.add(groupName);
        }
        return groupsNamesFromExcel;
    }

    private void skipRowWithGroupNames(Iterator<?> item) {
        if(item.hasNext())
            item.next();
    }

    private void skipUserItems(Iterator<?> item) {
        for(int i = 0; i <= userExcelSheetDefinition.getLastColumnIndex() && item.hasNext(); ++i)
            item.next();
    }

    @Nonnull
    private <T extends Principal> Map<String, T> mapToNameOrdered(List<T> itemsToMap, Function<T, String> functor) {
        return itemsToMap.stream()
                .sorted(Comparator.comparing(functor))
                .collect(MoreCollectors.toLinkedMap(functor, i -> i));
    }

    private void validateExcelGroups(List<String> groupsFromExcel, final Map<String, Group> groupsMatrixMap) {
        if (groupsFromExcel.stream().distinct().count() != groupsFromExcel.size()) {
            this.job.logText("Error: Multiple entries in the excel for same group are not allowed");
            throw new IllegalStateException("Multiple entries in the excel for same group are not allowed");
        }
        if (groupsFromExcel.size() != groupsMatrixMap.size()) {
            job.logText("Following groups doesn't exist or are misspelled or your are not permitted: ");
            final List<String> notValid = validate(groupsFromExcel, groupsMatrixMap);
            if (!notValid.isEmpty()) {
                job.logHtmlWithoutTimestamp(notValid.stream().map(Escaping.html::escape).collect(Collectors.joining("<br/>")));
            }
        }
    }

    private void validateExcelPersons(List<String> personsFromExcel, final Map<String, Person> personsMatrixMap) {
        if (personsFromExcel.stream().distinct().count() != personsFromExcel.size()) {
            this.job.logText("Error: Multiple entries in the excel for same login are not allowed");
            throw new IllegalStateException("Multiple entries in the excel for same login are not allowed");
        }
        if (personsFromExcel.size() != personsMatrixMap.size()) {
            job.logText("Following persons doesn't exist or are misspelled: ");
            final List<String> notValid = validate(personsFromExcel, personsMatrixMap);
            if (!notValid.isEmpty()) {
                job.logHtmlWithoutTimestamp(notValid.stream().map(Escaping.html::escape).collect(Collectors.joining("<br/>")));
            }
        }
    }

    @Nonnull
    private List<String> validate(List<String> personsFromExcel, final Map<String, ?> personsMatrixMap) {
        return personsFromExcel.stream()
            .filter(Predicates.not(personsMatrixMap::containsKey))
            .collect(Collectors.toList());
    }
}
