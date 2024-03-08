/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JsonPage;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.util.NameValue;

/**
 * Entry point for the export of group memberships. Shows the user a modal that allows a user to only export memberships in groups in which the user is admin.
 * Subsequently forwards to the {@link SubmitExportHandler}.
 */
public class Export2ExcelHandler extends Handler implements PostOnlyHandler {

    private static final Message label = new Message() {
    };

    private static final Message notAllowedToExport = new Message() {
    };

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> Forwarder.getFullUrl(
                SubmitExportHandler.class,
                NameValue.fromInt("groupPage", Parameters.getInt("groupPage", 1)),
                NameValue.fromInt("userPage", Parameters.getInt("userPage", 1)),
                NameValue.fromBoolean("onlyUnassignedUsers", Parameters.getBoolean("onlyUnassignedUsers", false)),
                NameValue.fromBoolean("filterGroupsByUsers", Parameters.getBoolean("filterGroupsByUsers", false)),
                NameValue.fromBoolean("filterUsersByGroups", Parameters.getBoolean("filterUsersByGroups", false)),
                NameValue.fromParameter("mayExportGroupMemberships")
            )));
            template.put("userFilters", PrintSubstitution.printing(Escaping.htmlAttribute, () -> NameValue.fromParameter("userFilters").getValue()));
            template.put("groupFilters", PrintSubstitution.printing(Escaping.htmlAttribute, () -> NameValue.fromParameter("groupFilters").getValue()));
        }
    };

    @Override
    public void checkAccess() {
        SessionLocal.checkLoggedIn();
        if (!GlobalPermissions.mayExportGroupMemberships()) {
            throw new ProtectedActionException(notAllowedToExport.get());
        }
    }

    @Override
    public Station doBusinessLogic() {
        return SHOW;
    }

    @Override
    public String getActionIconName() {
        return "fa-download";
    }

    @Override
    public Message getTargetLabel() {
        return label;
    }
}
