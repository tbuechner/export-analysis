/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

/**
 * pojo utilized to store filters set by a user in the group vs group matrix.
 */
public class GroupInGroupMatrixFilters {

    private String nestedGroupFilters;

    private String groupFilters;

    public String getNestedGroupFilters() {
        return nestedGroupFilters;
    }

    public void setNestedGroupFilters(String nestedGroupFilters) {
        this.nestedGroupFilters = nestedGroupFilters;
    }

    public String getGroupFilters() {
        return groupFilters;
    }

    public void setGroupFilters(String groupFilters) {
        this.groupFilters = groupFilters;
    }
}
