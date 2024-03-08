/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state;

import java.util.List;
import java.util.Map;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;

public class Data {
    public boolean excessiveData = false;

    public boolean excessiveDataNestedGroups = false;

    public boolean excessiveDataGroups = false;

    public final Map<String, Map<String, Edge>> nestedGroupId2groupId2edge = Maps.newHashMap();

    public final List<Node> nestedGroups = Lists.newArrayList();

    public final List<Node> groups = Lists.newArrayList();

    public int numberOfFilteredNestedGroups = -1;

    public int numberOfFilteredGroups = -1;

    public int groupPage = 1;

    public int nestedGroupPage = 1;

    public String toJson() {
        return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
    }
}
