/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JsonPage;
import cf.cplace.platform.core.frontend.handler.station.json.JsonSuccessStation;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.station.SubmitLine;
import cf.cplace.platform.commonlib.internationalization.Message;

public class SubmitNewHandler extends Handler implements PostOnlyHandler {

    Group group;

    final Station VALID = new JsonSuccessStation() {
        @Override
        protected String getTargetUrl() {
            return group.getUrl();
        }

        @Override
        protected Message getConfirmationMessage() {
            return SubmitLine.confirmationMessage;
        }
    };

    final Station INVALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(EditNewHandler.class, group, JsonPage.ERROR_PARAMETER);
        }
    };

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityAndCheckMayEdit(Parameters.getString("id"));
        checkIsWritableCopy(group);
    }

    @Override
    public Station doBusinessLogic() {
        group.applyParameters();
        if (group.isUiSubmitValidAndNotModifiedAndGenerateErrorMessagesIfNot()) {
            group.persist();
            return VALID;
        } else {
            return INVALID;
        }
    }
}
