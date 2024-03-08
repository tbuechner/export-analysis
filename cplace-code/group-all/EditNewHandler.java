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
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;

public class EditNewHandler extends Handler {

    private Group group;

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> Forwarder.getFullUrl(SubmitNewHandler.class, group)));
        }

        @Override
        public Group getScopeObject() {
            return group;
        }
    };

    @Override
    public void checkAccess() {
        String id = Parameters.getString("id");
        group = Group.SCHEMA.getEntityAndCheckMayEdit(id);
        checkIsWritableCopy(group);
    }

    @Override
    public Station doBusinessLogic() {
        return SHOW;
    }
}
