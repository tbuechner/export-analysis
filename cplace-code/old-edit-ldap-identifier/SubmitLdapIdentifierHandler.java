/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.person;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.application.principal.Person;
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
import cf.cplace.platform.core.datamodel.builtin.ServerMode;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;

@CplaceApi
public class SubmitLdapIdentifierHandler extends Handler implements PostOnlyHandler {

    final Station VALID = new JsonSuccessStation() {
        @Override
        protected String getTargetUrl() {
            return person.getUrl();
        }

        @Override
        protected Message getConfirmationMessage() {
            return SubmitLine.confirmationMessage;
        }
    };

    final Line INVALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(EditExternalIdHandler.class, person, JsonPage.ERROR_PARAMETER);
        }
    };

    private Person person;

    @Override
    public void checkAccess() {
        person = Person.SCHEMA.getEntityNotNull(Parameters.getString("id"));
        checkIsWritableCopy(person);
        if (!GlobalPermissions.mayCreateAndEditPerson()) {
            throw new ProtectedActionException("Not allowed to edit");
        }
        if (!person.hasLdapIdentifier()) {
            throw new ProtectedActionException("User has no LDAP identifier");
        }
    }

    @Override
    public Station doBusinessLogic() {
        person.applyParameters();
        if (person.isUiSubmitValidAndNotModifiedAndGenerateErrorMessagesIfNot()) {
            ServerMode.noWriteAccessCheck(() -> {
                person.persist();
            });
            return VALID;
        } else {
            return INVALID;
        }
    }
}
