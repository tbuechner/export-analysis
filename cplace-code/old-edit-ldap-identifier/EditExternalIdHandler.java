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
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;

@CplaceApi
public class EditExternalIdHandler extends Handler {

    public static final Message targetLabel = new Message() {
    };

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(() -> Forwarder.getFullUrl(SubmitLdapIdentifierHandler.class, person)));
        }

        @Override
        public Person getScopeObject() {
            return person;
        }
    };

    private Person person;

    @Override
    public void checkAccess() {
        person = Person.SCHEMA.getEntityNotNull(Parameters.getString("id"));
        // person may be read-only or writable, depending on how this handler is called

        if (!GlobalPermissions.mayCreateAndEditPerson()) {
            throw new ProtectedActionException("Not allowed to edit");
        }
        if (!person.hasLdapIdentifier()) {
            throw new ProtectedActionException("User has no LDAP identifier");
        }
    }

    @Override
    public Station doBusinessLogic() {
        if (person.isReadOnlyEntity()) {
            person = person.createRegisteredWritableCopy();
        }
        return SHOW;
    }

    @Override
    public String getActionIconName() {
        return "fa-edit";
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

}
