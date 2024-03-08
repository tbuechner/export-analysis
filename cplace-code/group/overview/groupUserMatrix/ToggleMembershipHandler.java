package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Map;

import com.google.common.collect.Maps;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.station.json.GsonAnswerStation;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state.Edge;
import cf.cplace.platform.commonlib.internationalization.Message;
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

    Person user;

    private static final Message notAllowed = new Message() {
    };

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("groupId"));
        user = Person.SCHEMA.getEntityNotNull(Parameters.getString("userId"));
    }

    @Override
    public Station doBusinessLogic() {
        if (group.getEntityPermissions().mayEdit()) {
                Membership membership = Membership.getMembership(group, user);
                if (membership == null) {
                    Person.createMembership(user, group, null);
                    result.groupId2edge = LoadDataHandler.getGroupId2Edge(user);
                    result.success = true;
                } else {
                    if (membership.canBeDeleted() == null) {
                        membership.remove();
                        result.groupId2edge = LoadDataHandler.getGroupId2Edge(user);
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

    public static class Result {

        public String toJson() {
            return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
        }

        boolean success = false;

        Map<String, Edge> groupId2edge = Maps.newHashMap();

        String errorMessage;
    }
}
