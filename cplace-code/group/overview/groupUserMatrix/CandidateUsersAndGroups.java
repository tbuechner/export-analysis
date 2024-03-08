/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Set;

import com.google.common.collect.SetMultimap;

/**
 * Generic result object for searches (e.g.  {@link CandidateUserSearch}, {@link CandidateGroupSearch}, {@link CandidateUserAndGroupSearch}) utilized in the context of the group user matrix.
 */
public class CandidateUsersAndGroups {
    private final Set<String> userIds;
    private final Set<String> groupIds;
    private final SetMultimap<String, String> userMemberships;

    public CandidateUsersAndGroups(Set<String> userIds, Set<String> groupIds, SetMultimap<String, String> userMemberships) {
        this.userIds = userIds;
        this.groupIds = groupIds;
        this.userMemberships = userMemberships;
    }

    public Set<String> getUserIds() {
        return userIds;
    }

    public Set<String> getGroupIds() {
        return groupIds;
    }

    public SetMultimap<String, String> getUserMemberships() {
        return userMemberships;
    }
}
