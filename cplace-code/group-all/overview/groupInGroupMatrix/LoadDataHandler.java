/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.annotation.ParametersAreNonnullByDefault;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.ImmutableSetMultimap;
import com.google.common.collect.Iterators;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.SetMultimap;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.station.json.GsonAnswerStation;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state.Data;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state.Edge;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state.Node;
import cf.cplace.platform.commonlib.monitor.MonitoringUtilities;
import cf.cplace.platform.commonlib.monitor.TriciaSplit;

@ParametersAreNonnullByDefault
public class LoadDataHandler extends Handler implements PostOnlyHandler {
    public static final int PAGE_SIZE = 50;

    final Station DATA = new GsonAnswerStation() {
        @Override
        protected String getString() {
            return data.toJson();
        }
    };
    private Data data;

    private int groupPage;
    private int nestedGroupPage;
    private int maxNestedGroups;
    private int maxGroups;
    private GroupInGroupMatrixFilters groupInGroupMatrixFilters;
    private CandidateGroupsAndGroups nestedGroupsAndGroups;

    @Override
    public final void checkAccess() {
        groupPage = Parameters.getInt("groupPage", 1);
        nestedGroupPage = Parameters.getInt("nestedGroupPage", 1);

        maxNestedGroups = PAGE_SIZE * nestedGroupPage;
        maxGroups = PAGE_SIZE * groupPage;

        setupMatrixFilters();
    }

    private void setupMatrixFilters() {
        groupInGroupMatrixFilters = new GroupInGroupMatrixFilters();

        groupInGroupMatrixFilters.setNestedGroupFilters(Parameters.getString("nestedGroupFilters", null));
        groupInGroupMatrixFilters.setGroupFilters(Parameters.getString("groupFilters", null));
    }

    @Override
    protected Station doBusinessLogic() {
        nestedGroupsAndGroups = new CandidateGroupAndGroupSearch(groupInGroupMatrixFilters).getNestedGroupsAndGroups();
        Iterable<Group> allGroups = Group.SCHEMA.getEntities();//get all groups for derived membership
        Iterable<Group> groups = Group.SCHEMA.getEntitiesById(nestedGroupsAndGroups.getGroupIds(),false);
        Iterable<Group> nestedGroups = Group.SCHEMA.getEntitiesById(nestedGroupsAndGroups.getNestedGroupIds(), false);
        data = createData(nestedGroups, groups, allGroups, maxNestedGroups, maxGroups);
        data.groupPage = groupPage;
        data.nestedGroupPage = nestedGroupPage;
        return DATA;
    }

    @Nonnull
    private Data createData(Iterable<Group> nestedGroups, Iterable<Group> groups, Iterable<Group> allGroups, int maxNestedGroups, int maxGroups) {
        final Data data = new Data();
        List<Group> selectedNestedGroups = Lists.newArrayList();
        List<Group> selectedGroups = Lists.newArrayList();
        int totalNestedGroupCount = Iterators.size(nestedGroups.iterator());
        int totalGroupCount =  Iterators.size(groups.iterator());

        Map<String, Group> groupId2Group = Maps.newHashMap();
        for (Group group : allGroups) {
            groupId2Group.put(group.getId(), group);
        }
        SetMultimap<String, String> groupMemberships = HashMultimap.create();
        for (Membership membership : Group.getActiveMembershipsOfAllGroupsWithoutReadAccessCheck()) {
            if(membership._member().get() instanceof Group) {
                groupMemberships.put(membership._member().get().getId(), membership._group().get().getId());
            }
        }

        SetMultimap<String, String> immutableGroupMemberships = ImmutableSetMultimap.copyOf(groupMemberships);

        selectDataAndGroups(nestedGroups, totalNestedGroupCount, groups, totalGroupCount, data, selectedNestedGroups, selectedGroups, maxNestedGroups, maxGroups);

        if (totalGroupCount == 0 || totalNestedGroupCount == 0) {
            return data;
        }
        try (TriciaSplit ignored = MonitoringUtilities.start("groupInGroupMatrix.LoadDataHandler.createEdges")) {
            for (Group nestedGroup : allGroups) {
                for (Group group : allGroups) {
                    if ((nestedGroupsAndGroups.getNestedGroupIds().contains(nestedGroup.getId()) && nestedGroupsAndGroups.getGroupIds().contains(group.getId())) ||
                            (nestedGroupsAndGroups.getNestedGroupIds().contains(group.getId()) && nestedGroupsAndGroups.getGroupIds().contains(nestedGroup.getId()))) {
                        Edge edge = getEdge(group.getId(), nestedGroup.getId(), immutableGroupMemberships, groupId2Group);
                        Map<String, Edge> groupId2edge = data.nestedGroupId2groupId2edge.computeIfAbsent(nestedGroup.getId(), k -> Maps.newHashMap());
                        groupId2edge.put(group.getId(), edge);
                    }
                }
            }
        }
        return data;
    }

    private void selectDataAndGroups(Iterable<Group> nestedGroups, int totalNestedGroupCount, Iterable<Group> groups, int totalGroupCount, Data data,
                                            List<Group> selectedNestedGroups, List<Group> selectedGroups, int maxNestedGroups, int maxGroups) {
        data.numberOfFilteredNestedGroups = totalNestedGroupCount;
        data.numberOfFilteredGroups = totalGroupCount;
        int nestedGroupCount = 0;
        for (Group group : nestedGroups) {
            if (nestedGroupCount == maxNestedGroups) {
                data.excessiveData = true;
                data.excessiveDataNestedGroups = true;
                break;
            }
            data.nestedGroups.add(new Node(group));
            selectedNestedGroups.add(group);
            nestedGroupCount++;
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

    @Nullable
    private String getParentFromWhichItDerivesGroup(String groupId, String currentGroupId, SetMultimap<String, String> groupMemberships) {
        try (TriciaSplit ignored = MonitoringUtilities.start("groupInGroupMatrix.LoadDataHandler.getParentFromWhichItDerivesGroup")) {
            return getParentFromWhichItDerivesGroup(groupId, currentGroupId, groupMemberships, new HashSet<>());
        }
    }

    @Nullable
    private String getParentFromWhichItDerivesGroup(String groupId, String currentGroupId, SetMultimap<String, String> groupMemberships, Set<String> nodesChecked) {
        if (nodesChecked.contains(currentGroupId)) {
            return null; //already checked and not there
        }
        if (groupId.equals(currentGroupId)) {
            return null; //group and nested group are the same
        }
        //check all parents first
        for (String parent : groupMemberships.get(currentGroupId)) {
            if (parent.equals(groupId)) {
                return currentGroupId;
            }
        }
        //use recursion to search deeper
        for(String parent : groupMemberships.get(currentGroupId)) {
            String parentGroup =  getParentFromWhichItDerivesGroup(groupId, parent, groupMemberships, nodesChecked);
            if (parentGroup != null) {
                return parentGroup;
            }
        }
        nodesChecked.add(currentGroupId);
        return null;
    }

    @Nullable
    private Edge getEdge(String groupId, String nestedGroupId, SetMultimap<String, String> groupMemberships, Map<String, Group> groupId2Group) {
        if (groupMemberships.get(nestedGroupId).contains(groupId)) {
            return Edge.createDirectMembershipEdge(nestedGroupId, groupId);
        } else {
            String parent = getParentFromWhichItDerivesGroup(groupId, nestedGroupId, groupMemberships);
            if (parent != null) {
                return Edge.createInheritedMembershipEdge(nestedGroupId, groupId2Group.get(parent).getName(), groupId);
            }
        }
        return null;
    }
}
