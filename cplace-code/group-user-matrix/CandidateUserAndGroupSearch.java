/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Set;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.json.JSONObject;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;

import cf.cplace.platform.core.application.principal.groupusermatrix.GroupUserMatrixFilters;

/**
 * Search to be utilized to find users, groups and group memberships of users according to filters set in the group user matrix.
 */
public class CandidateUserAndGroupSearch {

    private JSONObject userFilters;
    private JSONObject groupFilters;

    private boolean onlyUnassignedUsers;
    private boolean filterUsersByGroups;
    private boolean filterGroupsByUsers;

    public CandidateUserAndGroupSearch(GroupUserMatrixFilters groupUserMatrixFilters) {
        this(groupUserMatrixFilters._userFilters().get(),
            groupUserMatrixFilters._groupFilters().get(),
            groupUserMatrixFilters._onlyUnassignedUsers().get(),
            groupUserMatrixFilters._filterUsersByGroups().get(),
            groupUserMatrixFilters._filterGroupsByUsers().get());
    }

    public CandidateUserAndGroupSearch(@Nullable String userFilters, @Nullable String groupFilters, boolean onlyUnassignedUsers, boolean filterUsersByGroups, boolean filterGroupsByUsers) {
        if (userFilters != null) {
            this.userFilters = new JSONObject(userFilters);
        }
        if (groupFilters != null) {
            this.groupFilters = new JSONObject(groupFilters);
        }
        this.onlyUnassignedUsers = onlyUnassignedUsers;
        this.filterUsersByGroups = filterUsersByGroups;
        this.filterGroupsByUsers = filterGroupsByUsers;
    }

    /**
     * Finds users, groups and group memberships of users according to filters set in the group user matrix.
     * @return resulting users, groups and group memberships of the users stored in a {@link CandidateUsersAndGroups}.
     */
    @Nonnull
    public CandidateUsersAndGroups getUsersAndGroups() {
        Set<String> candidateUsers = Sets.newLinkedHashSet();
        Set<String> candidateGroups = Sets.newLinkedHashSet();
        SetMultimap<String, String> userMemberships = HashMultimap.create();

        CandidateUsersAndGroups candidateGroupsResult = new CandidateGroupSearch(groupFilters).getCandidateGroups();
        if (filterUsersByGroups) {
            CandidateUsersAndGroups candidateUsersResult = new CandidateUserSearch(userFilters).getCandidateUsers(candidateGroupsResult.getGroupIds(), false);
            candidateGroups = candidateGroupsResult.getGroupIds();
            candidateUsers = candidateUsersResult.getUserIds();
            userMemberships = candidateUsersResult.getUserMemberships();
        }
        if (filterGroupsByUsers) {
            CandidateUsersAndGroups candidateUsersResult = new CandidateUserSearch(userFilters).getCandidateUsers(null, false);
            if (filterUsersByGroups) {
                candidateGroups = Sets.intersection(candidateUsersResult.getGroupIds(), candidateGroupsResult.getGroupIds());
            } else {
                candidateGroups = candidateUsersResult.getGroupIds();
                candidateUsers = candidateUsersResult.getUserIds();
            }
            userMemberships = candidateUsersResult.getUserMemberships();
        }
        if (!filterUsersByGroups && !filterGroupsByUsers) {
            CandidateUsersAndGroups candidateUsersResult = new CandidateUserSearch(userFilters).getCandidateUsers(null, onlyUnassignedUsers);
            candidateGroups = candidateGroupsResult.getGroupIds();
            candidateUsers = candidateUsersResult.getUserIds();
            userMemberships = candidateUsersResult.getUserMemberships();
        }
        return new CandidateUsersAndGroups(candidateUsers, candidateGroups, userMemberships);
    }
}
