/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbookType;

import com.google.common.collect.Streams;

import cf.cplace.platform.core.application.job.assets.PersistentJob;
import cf.cplace.platform.core.application.job.QueuedBatchJob;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.frontend.handler.custom.DownloadExportHelper;
import cf.cplace.platform.frontend.handler.excel.ExcelExporter;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.UserExcelSheetDefinition;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.CandidateUserAndGroupSearch;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.CandidateUsersAndGroups;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.datamodel.builtin.PersistentEntity;
import cf.cplace.platform.core.server.TenantResources;
import cf.cplace.platform.core.application.job.data.DistributionType;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;
import cf.cplace.platform.commonlib.util.io.gson.Gsonable;
import cf.cplace.platform.commonlib.util.Utilities;

/**
 * Exports direct memberships of the group user matrix to an excel file.
 * The excel can be configured via {@link UserExcelSheetDefinition}.
 */
public class Export2ExcelJob extends QueuedBatchJob {

    private static final Message jobName = new Message() {
    };
    static final Message groupMembershipsTabName = new Message() {
    };
    private static final Message excelFileName = new Message() {
    };

    final UserExcelSheetDefinition userExcelSheetDefinition = new UserExcelSheetDefinition();

    @Nonnull
    @Override
    public DistributionType getDistributionType(@Nullable String parameter) {
        return DistributionType.DISTRIBUTED;
    }

    @Nullable
    @Override
    protected Message getJobName(String parameter) {
        return jobName;
    }

    private static class JobParameters extends Gsonable {
        @Nullable
        String userFilters;
        @Nullable
        String groupFilters;
        boolean onlyUnassignedUsers;
        boolean filterUsersByGroups;
        boolean filterGroupsByUsers;
        boolean filterForGroupAdmin;

        public static JobParameters fromJson(@Nonnull String serialized) {
            return GsonUtil.getGsonWithModifiedDateSerializer().fromJson(serialized, JobParameters.class);
        }
    }

    @Override
    public boolean isUserJob() {
        return true;
    }


    @Override
    protected void execute(PersistentJob job) throws Exception {
        final JobParameters params = JobParameters.fromJson(job._parameter().getNotEmpty());

        try (final SXSSFWorkbook wb = new SXSSFWorkbook()) {
            try {
                final ExcelExporter exporter = new ExcelExporter();

                wb.setCompressTempFiles(true);
                final Sheet sheetUsersGroupsMatrix = wb.createSheet(groupMembershipsTabName.get());
                userExcelSheetDefinition.setUserInfoColumnWidth(sheetUsersGroupsMatrix);

                final CandidateUsersAndGroups usersAndGroups = new CandidateUserAndGroupSearch(params.userFilters, params.groupFilters, params.onlyUnassignedUsers, params.filterUsersByGroups, params.filterGroupsByUsers).getUsersAndGroups();

                final List<Group> groups = Streams.stream(Group.SCHEMA.getEntitiesById(usersAndGroups.getGroupIds(), false))
                    .filter(params.filterForGroupAdmin ? group -> group.isAdministratorOfThisGroup(SessionLocal.getUser()) : group -> true)
                    .collect(Collectors.toList());
                Iterator<Person> persons = Person.SCHEMA.getEntitiesById(usersAndGroups.getUserIds(), false).iterator();

                createFirstRowWithGroupNames(sheetUsersGroupsMatrix, groups, getHeaderStyle(wb));

                for (int rowNumber = 1; persons.hasNext(); rowNumber++) {
                    Person user = persons.next();
                    final Row personMembershipRow = sheetUsersGroupsMatrix.createRow(rowNumber);
                    personNameInFirstCellsOfRow(personMembershipRow, user, getHeaderStyle(wb));
                    personMembershipsInRow(personMembershipRow, groups, user);
                }
                exporter.writeToWorkbook(wb);
                final File exportedFile = writeToFile(wb);

                PersistentEntity.doOnWritableCopyAndPersistIfModified(job, j -> j._downloadFileName().set(exportedFile.getAbsolutePath()));
                job.logHtml(Template.getString(DownloadExportHelper.downloadLink(job, exportedFile.getName())));
            } finally {
                wb.dispose();
            }
        }
    }

    @Nonnull
    private File writeToFile(Workbook wb) throws IOException {
        File dir = TenantResources.INSTANCE().makeTemporaryUploadFolder();
        File excel = Utilities.getPathFile(dir, excelFileName.get() + '.' + XSSFWorkbookType.XLSX.getExtension());
        try (FileOutputStream fileOutputStream = new FileOutputStream(excel)) {
            wb.write(fileOutputStream);
        }
        return excel;
    }

    private void createFirstRowWithGroupNames(Sheet sheetUsersGroupMatrix, List<Group> groups, CellStyle rowStyle) {
        headerCells(sheetUsersGroupMatrix.createRow(0), groups, rowStyle);
    }


    /**
     * Creates and starts an {@link Export2ExcelJob} in a separate thread.
     * @param userFilters set in the group user matrix
     * @param groupFilters set in the group user matrix
     * @param onlyUnassignedUsers filter set in the group user matrix
     * @param filterUsersByGroups filter set in the group user matrix
     * @param filterGroupsByUsers filter set in the group user matrix
     * @param filterForGroupAdmin allows to filter for groups in the export in which the user who triggered the export is admin.
     * @return the started {@link Export2ExcelJob} job.
     */
    @Nonnull
    public static PersistentJob createJobAndStartInSeparateThread(@Nullable String userFilters, @Nullable String groupFilters, boolean onlyUnassignedUsers, boolean filterUsersByGroups, boolean filterGroupsByUsers, boolean filterForGroupAdmin) {
        return PersistentJob.createJobAndStartInSeparateThread(Export2ExcelJob.class, encodeParams(userFilters, groupFilters, onlyUnassignedUsers, filterUsersByGroups, filterGroupsByUsers, filterForGroupAdmin));
    }
    /**
     * Encodes the job parameters.
     * @param userFilters set in the group user matrix
     * @param groupFilters set in the group user matrix
     * @param onlyUnassignedUsers filter set in the group user matrix
     * @param filterUsersByGroups filter set in the group user matrix
     * @param filterGroupsByUsers filter set in the group user matrix
     * @param filterForGroupAdmin allows to filter for groups in the export in which the user who triggered the export is admin.
     * @return created {@link JobParameters} as Json.
     */
    @Nonnull
    public static String encodeParams(@Nullable String userFilters, @Nullable String groupFilters, boolean onlyUnassignedUsers, boolean filterUsersByGroups, boolean filterGroupsByUsers, boolean filterForGroupAdmin) {
        final JobParameters params = new JobParameters();
        params.userFilters = userFilters;
        params.groupFilters = groupFilters;
        params.onlyUnassignedUsers = onlyUnassignedUsers;
        params.filterUsersByGroups = filterUsersByGroups;
        params.filterGroupsByUsers = filterGroupsByUsers;
        params.filterForGroupAdmin = filterForGroupAdmin;
        return params.toJson();
    }


    private void headerCells(Row row, List<Group> groups, CellStyle style) {
        userExcelSheetDefinition.createHeaderCells(row, style);
        int lastUserColumnIndex = userExcelSheetDefinition.getLastColumnIndex() + 1;
        for (int i = 0; i < groups.size(); i++) {
            Cell c = row.createCell(i + lastUserColumnIndex);
            c.setCellStyle(style);
            c.setCellValue(groups.get(i)._name().get());
        }
    }

    private void personNameInFirstCellsOfRow(Row row, Person person, CellStyle style) {
        userExcelSheetDefinition.createUserCells(row, style, person);
    }

    private void personMembershipsInRow(Row row, List<Group> groups, Person user) {
        int index = userExcelSheetDefinition.getLastColumnIndex() + 1;
        for (Group group : groups) {
            Cell singleMembership = row.createCell(index++);
            activeDirectPersonMembership(user, group, singleMembership);
        }
    }

    private void activeDirectPersonMembership(Person user, Group group, Cell singleMembership) {
        if (group.isActiveMemberInThisGroup(user)) {
            singleMembership.setCellValue(Boolean.TRUE);
        }
    }

    private CellStyle getHeaderStyle(SXSSFWorkbook wb) {
        Font font = wb.createFont();
        font.setBold(true);
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setWrapText(true);
        cellStyle.setFont(font);
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setVerticalAlignment(VerticalAlignment.BOTTOM);
        return cellStyle;
    }

}
