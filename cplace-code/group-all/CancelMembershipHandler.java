/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.Principal;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.navigation.Action;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.station.SubmitLine;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;

public class CancelMembershipHandler extends Handler implements FullPageHandler {

    private static final Message successMessage = new Message() {
    };

    private static final Message targetLabel = new Message() {
    };

    final Station VALID = new SubmitLine() {
        @Override
        public void doNext(Forwarder f) {
            f.go(group);
        }

        @Override
        public Message getConfirmationMessage() {
            return successMessage;
        }
    };

    private Group group;

    private Person p;

    private Membership m;

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("id"));
        p = checkLoggedIn();
        m = Membership.getMembership(group, p);

        if (m == null) {
            throw new ProtectedActionException();
        }

        if (group._isTechnicalGroup().get()) {
            throw new ProtectedActionException("Members are not allowed to manually leave a technical group");
        }

        if (Principal.sessionUserMatchesOneOfThese(group._administrators())) {
            // If the user is a group admin, we need to check whether removing him from the group would also remove him from the group admins,
            // which would not be allowed for the last admin, and may be unwanted otherwise.
            // For now, we just forbid it completely.
            throw new ProtectedActionException("A group admin cannot simply cancel its membership.");
        }
    }

    @Override
    public Station doBusinessLogic() {
        m.remove();
        return VALID;
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

    public abstract static class CancelMembershipAction extends Action {

        protected abstract Group getGroup();

        @Override
        public void target(Forwarder f) {
            f.goWithId(CancelMembershipHandler.class, getGroup());
        }
    }
}
