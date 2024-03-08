/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.json.JsonSuccessStation;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.GroupsHandler;
import cf.cplace.platform.commonlib.internationalization.Message;

public class SubmitDeleteHandler extends Handler {

    private static final Message successMessage = new Message() {
    };

    final Station VALID = new JsonSuccessStation() {
        @Override
        public Message getConfirmationMessage() {
            return successMessage;
        }

        @Override
        protected String getTargetUrl() {
            return Forwarder.getFullUrl(GroupsHandler.class);
        }
    };

    Group group;

    String gotoLocation;

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityAndCheckMayRemove(Parameters.getString("id"));
    }

    @Override
    public Station doBusinessLogic() {
        group.remove();
        return VALID;
    }
}
