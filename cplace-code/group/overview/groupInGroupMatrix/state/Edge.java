/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;

@ParametersAreNonnullByDefault
public class Edge {

    private static final ParameterizedMessage indirectMembershipInfo = new ParameterizedMessage() {
    };

    public String toJson() {
        return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
    }

    String nestedGroupId;

    String groupId;

    boolean directMembership;

    String iconClass;

    String tooltip;

    @Nonnull
    private static Edge createEdge(String nestedGroupId, String groupId) {
        Edge edge = new Edge();
        edge.nestedGroupId = nestedGroupId;
        edge.groupId = groupId;
        return edge;
    }

    @Nonnull
    public static Edge createDirectMembershipEdge(String nestedGroupId, String groupId) {
        final Edge edge = createEdge(nestedGroupId, groupId);
        edge.directMembership = true;
        edge.iconClass = "fa-check";
        return edge;
    }

    @Nonnull
    public static Edge createInheritedMembershipEdge(String nestedGroupId, String indirectGroupName, String groupId) {
        final Edge edge = createEdge(nestedGroupId, groupId);
        edge.directMembership = false;
        edge.tooltip = indirectMembershipInfo.setParameters(indirectGroupName).get();
        edge.iconClass = "fa-check-square";
        return edge;
    }
}
