/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.MembershipStates;
import cf.cplace.platform.core.datamodel.builtin.assets.links.Linkable;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;

public class CloneHandler extends Handler implements FullPageHandler {

    private static final Message targetLabel = new Message() {
    };

    private static final Message successMessage = new Message() {
    };

    private static final ParameterizedMessage cloneName = new ParameterizedMessage() {
    };

    Line NEXT = new Line() {
        @Override
        public void next(Forwarder f) {
            f.go(newGroup);
        }

        @Override
        public Message getConfirmationMessage() {
            return successMessage;
        }
    };

    private Group oldGroup;

    private Group newGroup;

    @Override
    public void checkAccess() {
        if (!GlobalPermissions.mayCreateGroup()) {
            throw new ProtectedActionException();
        }

        oldGroup = Group.SCHEMA.getEntityAndCheckMayEdit(Parameters.getString("id"));

        if (oldGroup._isTechnicalGroup().get()) {
            throw new ProtectedActionException();
        }
    }

    @Override
    public Station doBusinessLogic() {
        newGroup = Group.SCHEMA.createWritableEntity();
        newGroup.applyForAllButExclude(oldGroup,
                oldGroup._membershipsForVersioning(),
                oldGroup._memberships(),
                oldGroup._pageEditors(),
                oldGroup._pageReaders(),
                oldGroup._typeEditors(),
                oldGroup._typeReaders(),
                oldGroup._spaceAdmins(),
                oldGroup._spaceLayouters(),
                oldGroup._spaceEditors(),
                oldGroup._spaceReaders(),
                oldGroup._emailSentTo(),
                oldGroup._batchJobs());
        String name = oldGroup.adapt(Linkable.class).getName();
        String newName = cloneName.setParameters(name).get();
        newGroup.setValueOfNameProperty(newName);
        int count = 2;
        while (newGroup.getNamePropertyForQueries().preventWrite()) {
            newGroup.setValueOfNameProperty(newName + " - " + count++);
        }
        newGroup.persist();

        for (Membership mOld : oldGroup._memberships().getAssets()) {
            Membership m = Membership.SCHEMA.createWritableEntity();
            m._group().set(newGroup);
            m._state().set(MembershipStates.active);
            m._member().set(mOld._member().get());
            m.persist();
        }

        return NEXT;
    }

    @Override
    public String getActionIconName() {
        return "fa-clone";
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }
}
