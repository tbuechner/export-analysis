/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.annotation.ParametersAreNonnullByDefault;

import org.json.JSONObject;

/**
 * Search to be utilized to find groups and group memberships of groups according to filters set in the group vs group matrix.
 */
@ParametersAreNonnullByDefault
public class CandidateGroupAndGroupSearch {

    private JSONObject nestedGroupFilters;
    private JSONObject groupFilters;

    public CandidateGroupAndGroupSearch(GroupInGroupMatrixFilters groupInGroupMatrixFilters) {
        this(groupInGroupMatrixFilters.getNestedGroupFilters(), groupInGroupMatrixFilters.getGroupFilters());
    }

    public CandidateGroupAndGroupSearch(@Nullable String nestedGroupFilters, @Nullable String groupFilters) {
        if (nestedGroupFilters != null) {
            this.nestedGroupFilters = new JSONObject(nestedGroupFilters);
        }
        if (groupFilters != null) {
            this.groupFilters = new JSONObject(groupFilters);
        }
    }

    /**
     * Finds groups according to filters set in the group vs group matrix.
     * @return resulting users, groups and group memberships of the users stored in a {@link CandidateGroupsAndGroups}.
     */
    @Nonnull
    public CandidateGroupsAndGroups getNestedGroupsAndGroups() {
        CandidateGroupsAndGroups candidateGroupsResult = new CandidateGroupSearch(groupFilters).getCandidateGroups();
        CandidateGroupsAndGroups candidateNestedGroupsResult = new CandidateGroupSearch(nestedGroupFilters).getCandidateGroups();
        return new CandidateGroupsAndGroups(candidateNestedGroupsResult.getGroupIds(), candidateGroupsResult.getGroupIds());
    }
}
