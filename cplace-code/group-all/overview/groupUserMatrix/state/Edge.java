/*
 * Copyright 2016, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state;

import javax.annotation.Nonnull;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;

public class Edge {

    private static final Message isAdminInfo = new Message() {
    };

    private static final ParameterizedMessage indirectMembershipInfo = new ParameterizedMessage() {
    };

    public String toJson() {
        return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
    }

    String userId;

    String groupId;

    boolean directMembership;

    String iconClass;

    String tooltip;

    boolean isAdmin;

    private static Edge createEdge(Person user, Group group, boolean isGroupAdmin) {
        Edge edge = new Edge();
        edge.userId = user.getId();
        edge.groupId = group.getId();
        edge.isAdmin = isGroupAdmin;
        return edge;
    }

    @Nonnull
    public static Edge createDirectMembershipEdge(Person user, Group group, boolean isGroupAdmin) {
        final Edge edge = createEdge(user, group, isGroupAdmin);
        edge.directMembership = true;
        edge.iconClass = "fa-check";
        return edge;
    }

    @Nonnull
    public static Edge createIsAdminEdge(Person user, Group group) {
        final Edge edge = createEdge(user, group, true);
        edge.directMembership = false;
        edge.iconClass = "";
        edge.isAdmin = true;
        edge.tooltip = isAdminInfo.get();
        return edge;
    }

    @Nonnull
    public static Edge createInheritedMembershipEdge(Person user, Group indirectGroup, Group group, boolean isGroupAdmin) {
        final Edge edge = createEdge(user, group, isGroupAdmin);
        edge.directMembership = false;
        edge.isAdmin = isGroupAdmin;
        edge.tooltip = indirectMembershipInfo.setParameters(indirectGroup.getName()).get();
        edge.iconClass = "fa-check-square";
        return edge;
    }
}
