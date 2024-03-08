/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import java.util.HashSet;
import java.util.Set;

import javax.annotation.Nonnull;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.station.json.GsonAnswerStation;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.monitor.MonitoringUtilities;
import cf.cplace.platform.commonlib.monitor.TriciaSplit;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;

public class ToggleMembershipHandler extends Handler implements PostOnlyHandler {

    final Station SUCCESS = new GsonAnswerStation() {
        @Override
        protected String getString() {
            return result.toJson();
        }
    };

    Result result = new Result();

    Group group;

    Group nestedGroup;

    private static final Message notAllowed = new Message() {
    };

    private static final Message cycleMembership = new Message() {
    };

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("groupId"));
        nestedGroup = Group.SCHEMA.getEntityNotNull(Parameters.getString("nestedGroupId"));
    }

    @Override
    public Station doBusinessLogic() {
        if (group.getEntityPermissions().mayEdit()) {
            Membership membership = Membership.getMembership(group, nestedGroup);
            if (membership == null) {
                if (isCycleMembership()) {
                    result.errorMessage = cycleMembership.get();
                } else {
                    Person.createMembership(nestedGroup, group, null);
                    result.success = true;
                }
            } else {
                if (membership.canBeDeleted() == null) {
                    membership.remove();
                    result.success = true;
                } else {
                    result.errorMessage = notAllowed.get();
                }
            }
        } else {
            result.errorMessage = notAllowed.get();
        }
        return SUCCESS;
    }

    private boolean isCycleMembership() {
        try (TriciaSplit ignored = MonitoringUtilities.start("groupInGroupMatrix.ToggleMembershipHandler.isCycleMembership")) {
            Set<String> parentMemberships = new HashSet<>();
            getDerivedGroups(group.getId(), getAllGroupsMembership(), parentMemberships);
            return parentMemberships.contains(nestedGroup.getId());
        }
    }

    @Nonnull
    private void getDerivedGroups(String groupId, SetMultimap<String, String> allGroupMemberships, Set<String> result) {
        result.add(groupId);
        for (String id : allGroupMemberships.get(groupId)) {
             getDerivedGroups(id, allGroupMemberships, result);
        }
    }

    @Nonnull
    private SetMultimap<String, String> getAllGroupsMembership() {
        SetMultimap<String, String> groupMemberships = HashMultimap.create();
        for (Membership membership : Group.getActiveMembershipsOfAllGroupsWithoutReadAccessCheck()) {
            if (membership._member().get() instanceof Group) {
                groupMemberships.put(membership._member().get().getId(), membership._group().get().getId());
            }
        }
        return groupMemberships;
    }

    public static class Result {

        public String toJson() {
            return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
        }

        boolean success = false;

        String errorMessage;
    }
}
