/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import java.util.Set;

import javax.annotation.ParametersAreNonnullByDefault;

/**
 * Generic result object for searches (e.g.  {@link CandidateGroupSearch}, {@link CandidateGroupAndGroupSearch}) utilized in the context of the group vs group matrix.
 */
@ParametersAreNonnullByDefault
public class CandidateGroupsAndGroups {
    private final Set<String> nestedGroupIds;
    private final Set<String> groupIds;

    public CandidateGroupsAndGroups(Set<String> nestedGroupIds, Set<String> groupIds) {
        this.nestedGroupIds = nestedGroupIds;
        this.groupIds = groupIds;
    }

    public Set<String> getNestedGroupIds() {
        return nestedGroupIds;
    }

    public Set<String> getGroupIds() {
        return groupIds;
    }

}
