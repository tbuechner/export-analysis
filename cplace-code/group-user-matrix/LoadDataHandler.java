/*
 * Copyright 2016, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.groupusermatrix.GroupUserMatrixFilters;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.station.json.GsonAnswerStation;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state.Data;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state.Edge;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state.Node;

public class LoadDataHandler extends Handler implements PostOnlyHandler {
    public static final int PAGE_SIZE = 50;
    private static final Pattern WHITESPACE = Pattern.compile("\\s");

    final Station DATA = new GsonAnswerStation() {
        @Override
        protected String getString() {
            return data.toJson();
        }
    };
    private Data data;

    private int groupPage;
    private int userPage;
    public int maxUsers;
    public int maxGroups;
    protected GroupUserMatrixFilters groupUserMatrixFilters;

    @Override
    public final void checkAccess() {
        groupPage = Parameters.getInt("groupPage", 1);
        userPage = Parameters.getInt("userPage", 1);

        maxUsers = PAGE_SIZE * userPage;
        maxGroups = PAGE_SIZE * groupPage;

        setupMatrixFilters();
        additionalCheckAccess();
    }

    protected void additionalCheckAccess() {
    }

    private void setupMatrixFilters() {
        groupUserMatrixFilters = GroupUserMatrixFilters.SCHEMA.createRegisteredSessionEntity();

        groupUserMatrixFilters._userFilters().set(Parameters.getString("userFilters", ""));
        groupUserMatrixFilters._groupFilters().set(Parameters.getString("groupFilters", ""));
        groupUserMatrixFilters._onlyUnassignedUsers().set(Parameters.getBoolean("onlyUnassignedUsers", false));
        groupUserMatrixFilters._filterGroupsByUsers().set(Parameters.getBoolean("filterGroupsByUsers", false));
        groupUserMatrixFilters._filterUsersByGroups().set(Parameters.getBoolean("filterUsersByGroups", false));
    }

    @Override
    protected Station doBusinessLogic() {
        CandidateUsersAndGroups usersAndGroups = new CandidateUserAndGroupSearch(groupUserMatrixFilters).getUsersAndGroups();

        Iterable<Group> groups = Group.SCHEMA.getEntitiesById(usersAndGroups.getGroupIds(), false);
        Iterable<Person> persons = Person.SCHEMA.getEntitiesById(usersAndGroups.getUserIds(), false);
        data = createData(persons, usersAndGroups.getUserIds().size(), groups, usersAndGroups.getGroupIds().size(), usersAndGroups.getUserMemberships(), maxUsers, maxGroups);
        data.groupPage = groupPage;
        data.userPage = userPage;
        return DATA;
    }

    public static Data createData(Iterable<Person> users, int totalUserCount, Iterable<Group> groups, int totalGroupCount, SetMultimap<String, String> userMemberships, int maxUsers, int maxGroups) {
        final Data data = new Data();
        List<Person> selectedPersons = Lists.newArrayList();
        List<Group> selectedGroups = Lists.newArrayList();
        selectDataAndGroups(users, totalUserCount, groups, totalGroupCount, data, selectedPersons, selectedGroups, maxUsers, maxGroups);

        if (totalGroupCount == 0 || totalUserCount == 0) {
            return data;
        }

        for (Person user : selectedPersons) {
            final Set<String> userGroups = userMemberships.get(user.getId());
            for (Group group : selectedGroups) {
                Edge edge = getEdge(group, user, userGroups);
                String userId = user.getId();
                Map<String, Edge> groupId2edge = data.userId2groupId2edge.computeIfAbsent(userId, k -> Maps.newHashMap());
                groupId2edge.put(group.getId(), edge);
            }
        }
        return data;
    }

    private static void selectDataAndGroups(Iterable<Person> users, int totalUserCount, Iterable<Group> groups, int totalGroupCount, Data data,
                                            List<Person> selectedPersons, List<Group> selectedGroups, int maxUsers, int maxGroups) {
        data.numberOfFilteredUsers = totalUserCount;
        data.numberOfFilteredGroups = totalGroupCount;
        int userCount = 0;
        for (Person person : users) {
            if (userCount == maxUsers) {
                data.excessiveData = true;
                data.excessiveDataUsers = true;
                break;
            }
            data.users.add(new Node(person));
            selectedPersons.add(person);
            userCount++;
        }

        int groupCount = 0;
        for (Group group : groups) {
            if (groupCount == maxGroups) {
                data.excessiveData = true;
                data.excessiveDataGroups = true;
                break;
            }
            data.groups.add(new Node(group));
            selectedGroups.add(group);
            groupCount++;
        }
    }

    public static Edge getEdge(Group group, Person user, Set<String> userGroups) {
        boolean isGroupAdmin = false;
        if (group.isAdministratorOfThisGroup(user)) {
            isGroupAdmin = true;
        }
        if (group.isActiveMemberInThisGroup(user)) {
            return Edge.createDirectMembershipEdge(user, group, isGroupAdmin);
        } else {
            if (userGroups.contains(group.getId())) {
                Iterable<Group.MemberInGroup> allActivePersonsAndInWhichGroupTheyAreMember;
                allActivePersonsAndInWhichGroupTheyAreMember = group.getAllActivePersonsAndInWhichGroupTheyAreMember();
                for (Group.MemberInGroup memberInGroup : allActivePersonsAndInWhichGroupTheyAreMember) {
                    if (Objects.equals(memberInGroup.member, user)) {
                        return Edge.createInheritedMembershipEdge(user, memberInGroup.group, group, isGroupAdmin);
                    }
                }
            }
        }

        if (isGroupAdmin) {
            return Edge.createIsAdminEdge(user, group);
        }
        return null;
    }

    public static Map<String, Edge> getGroupId2Edge(Person user) {
        Map<String, Edge> groupId2edge = Maps.newHashMap();
        final String idsString = user._groupMembershipIds().get();
        if (idsString == null) {
            return groupId2edge;
        }
        Set<String> userGroups = Sets.newHashSet(WHITESPACE.split(idsString));
        userGroups.remove(user.getId());
        for (Group group : Group.SCHEMA.getEntities()) {
            Edge edge = getEdge(group, user, userGroups);
            if (edge != null) {
                groupId2edge.put(group.getId(), edge);
            }
        }
        return groupId2edge;
    }
}
