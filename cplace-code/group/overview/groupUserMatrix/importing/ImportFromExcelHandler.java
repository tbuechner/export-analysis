/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.importing;

import javax.annotation.Nullable;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JsonPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;

/**
 * Entry point for the import of group memberships. Shows the user a modal that allows a user to select an excel file to be imported.
 * Subsequently forwards to the {@link SubmitImportHandler}.
 */
public class ImportFromExcelHandler extends Handler {

    private static final Message label = new Message() {
    };

    private static final Message notAllowedToImport = new Message() {
    };

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> Forwarder.getFullUrl(SubmitImportHandler.class)));
        }
    };

    @Override
    public void checkAccess() {
        SessionLocal.checkLoggedIn();
        if (!GlobalPermissions.mayImportGroupMemberships()) {
            throw new ProtectedActionException(notAllowedToImport.get());
        }
    }

    @Override
    public Station doBusinessLogic() {
        return SHOW;
    }

    @Override
    public Message getTargetLabel() {
        return label;
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "fa-upload";
    }
}
