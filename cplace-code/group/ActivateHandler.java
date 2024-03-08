/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import javax.annotation.Nonnull;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.MembershipStates;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.Principal;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.Modality;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.groupActivation.EditHandler;
import cf.cplace.platform.frontend.handler.person.GroupActivationMail;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ErrorMessageException;
import cf.cplace.platform.core.datamodel.persistence.Join;
import cf.cplace.platform.core.datamodel.persistence.Queries;
import cf.cplace.platform.core.datamodel.persistence.Query;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.commonlib.template.TemplateSubstitution;

public class ActivateHandler extends Handler {

    final Station VALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(EditHandler.class, ga);
        }
    };

    private Group group;

    private GroupActivationMail ga;

    private Query query;

    private static final Message NO_INACTIVE_PERSONS = new Message() {
    };

    private static final Message targetLabel = new Message() {
    };

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityAndCheckMayEdit(Parameters.getString("id"));
        Query groupQuery = Queries.equals(Membership.SCHEMA.prototype()._group(), group);
        Query notActive = Queries.not(Queries.equals(Membership.SCHEMA.prototype()._state(), MembershipStates.active));
        Join j = new Join(Person.SCHEMA.prototype()._id(), Membership.SCHEMA.prototype()._member().getColumn());
        query = Queries.and(groupQuery, notActive);
        query.addJoin(j);
        if (Membership.SCHEMA.countEntities(query) == 0) {
            throw new ErrorMessageException(ActivateHandler.NO_INACTIVE_PERSONS);
        }
    }

    @Override
    public Station doBusinessLogic() {
        ga = GroupActivationMail.SCHEMA.createRegisteredSessionEntity();
        ga._sender().set(SessionLocal.getUser());
        for (Membership m : Membership.SCHEMA.queryEntities(query)) {
            Principal member = m._member().get();
            if (member instanceof Person) {
                ga._persons().create((Person) member);
            }
        }
        if (ga._persons().count() == 0) {
            throw new ErrorMessageException(ActivateHandler.NO_INACTIVE_PERSONS);
        } else {
            ga._subject().set(Template.getStringSubstituteOnlyMessages(activateMailSubject()));
            ga._body().set(Template.getStringSubstituteOnlyMessages(activateMail()));
            ga._group().set(group);
        }
        return VALID;
    }

    private TemplateSubstitution activateMail() {
        return new TemplateSubstitution() {
        };
    }

    private TemplateSubstitution activateMailSubject() {
        return new TemplateSubstitution() {
        };
    }

    @Override
    public String getActionIconName() {
        return "fa-cog";
    }

    @Nonnull
    @Override
    public Modality getModality() {
        return Modality.LARGE;
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

}
