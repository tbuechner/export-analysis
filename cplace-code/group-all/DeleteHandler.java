/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JsonPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;

public class DeleteHandler extends Handler {

    private static final Message targetLabel = new Message() {
    };

    private static final Message successMessage = new Message() {
    };

    final Station VALID = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(Escaping.html, () -> Forwarder.getFullUrl(SubmitDeleteHandler.class, group)));
            template.put("errorMessage", PrintSubstitution.printing(() -> errorMessage == null ? "" : errorMessage.get()));
        }

        @Override
        public Group getScopeObject() {
            return group;
        }
    };

    private Group group;

    private Message errorMessage;

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("id"));

        if (group._isTechnicalGroup().get()) {
            throw new ProtectedActionException();
        }

        checkMayRemove(group);
    }

    @Override
    public Station doBusinessLogic() {
        errorMessage = group.canBeDeleted();
        return VALID;
    }

    @Override
    public String getActionIconName() {
        return "fa-trash";
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }
}
