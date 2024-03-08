/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.datamodel.builtin.assets.taggable.Taggable;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;

public class NewHandler extends Handler {

    static final Message targetLabel = new Message() {
    };

    private Group group;

    private String[] tags;

    final Station EDIT = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(EditNewHandler.class, group);
        }
    };

    @Override
    public void checkAccess() {
        tags = Parameters.getStrings(Handler.PARAMETER_TAG);
        GlobalPermissions.checkMayCreateGroup();
    }

    @Override
    public Station doBusinessLogic() {
        group = Group.SCHEMA.createRegisteredWritableEntity();
        if (tags != null) {
            for (String tag : tags) {
                group.adapt(Taggable.class).assignTag(tag);
            }
        }
        Person current = SessionLocal.getUser();
        if (current != null) {
            group._administrators().create(current);
        }
        return EDIT;
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

}
