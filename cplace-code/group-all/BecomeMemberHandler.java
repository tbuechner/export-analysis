/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cf.cplace.platform.commonlib.mail.api.MailSenderException;
import cf.cplace.platform.commonlib.mail.api.TemplateMail;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Group.GroupApplicationState;
import cf.cplace.platform.core.application.principal.Membership;
import cf.cplace.platform.core.application.principal.MembershipStates;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.Principal;
import cf.cplace.platform.core.datamodel.builtin.assets.links.Linkable;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.navigation.Action;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.station.SubmitLine;
import cf.cplace.platform.PlatformComponentRegistry;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.core.server.TenantResources;
import cf.cplace.platform.core.frontend.handler.ErrorMessageException;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;

public class BecomeMemberHandler extends Handler implements FullPageHandler {

    class ValidLine extends SubmitLine {
        @Override
        public void doNext(Forwarder f) {
            f.go(group);
        }
    }

    private static final Logger log = LoggerFactory.getLogger(BecomeMemberHandler.class);

    private static final Message requestSaved = new Message() {
    };

    private static final Message isMember = new Message() {
    };

    private static final Message applyForMembershipTargetLabel = new Message() {
    };

    private static final Message becomeMemberTargetLabel = new Message() {
    };

    private static final Message notLoggedInError = new Message() {
    };

    private static final Message cannotBecomeMemberError = new Message() {
    };

    private static final ParameterizedMessage alreadyMemberError = new ParameterizedMessage() {
    };

    final Station VALID_APPLIES = new ValidLine() {
        @Override
        public Message getConfirmationMessage() {
            return requestSaved;
        }
    };

    final Station VALID_MEMBER = new ValidLine() {
        @Override
        public Message getConfirmationMessage() {
            return isMember;
        }
    };

    protected Message errorMessage;

    final Station IN_VALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.go(group);
        }

        @Override
        public Message getErrorMessage() {
            return errorMessage;
        }
    };

    private Group group;

    private Person p;

    private GroupApplicationState canBecomeMember;

    @Override
    public void checkAccess() {
        checkLoggedIn();
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("id"));

        if (group._isTechnicalGroup().get()) {
            throw new ProtectedActionException();
        }

        canBecomeMember = group.canBecomeMember();
        if (Group.GroupApplicationState.NOT_LOGGED_IN.equals(canBecomeMember)) {
            throw new MyErrormessageException(notLoggedInError);
        }
        p = SessionLocal.getUser();
        if (Group.GroupApplicationState.YES_APPLY.equals(canBecomeMember) || Group.GroupApplicationState.YES_BECOME_MEMBER.equals(canBecomeMember)) {
            Membership existingMembership = Membership.getMembership(group, p);
            if (existingMembership != null) {
                throwAlreadyMemberException();
            } else {
                return;
            }
        } else {
            if (canBecomeMember.equals(Group.GroupApplicationState.ALREADY_MEMBER)) {
                throwAlreadyMemberException();
            } else if (canBecomeMember.equals(Group.GroupApplicationState.NOT_AUTO_APPLY_OR_BECOME_MEMBER)) {
                throw new MyErrormessageException(cannotBecomeMemberError);
            }
        }
    }

    private void throwAlreadyMemberException() {
        throw new MyErrormessageException(alreadyMemberError.setParameters(group.adapt(Linkable.class).getName()));
    }

    class MyErrormessageException extends ErrorMessageException {

        public MyErrormessageException(Message m) {
            super(m);
        }

        private static final long serialVersionUID = 1L;

        @Override
        public void go(Forwarder f) {
            f.go(group);
        }
    }

    @Override
    public Station doBusinessLogic() {
        Membership m = Membership.SCHEMA.createWritableEntity();
        m._group().set(group);
        m._member().set(p);
        if (Group.GroupApplicationState.YES_APPLY.equals(canBecomeMember)) {
            m._state().set(MembershipStates.appliesFor);
            m.persist();
            sendMails(BecomeMemberMailBuilder::buildApplyForMembershipMail);
            return VALID_APPLIES;
        } else {
            m._state().set(MembershipStates.active);
            m.persist();
            sendMails(BecomeMemberMailBuilder::buildRegisterMembershipMail);
            return VALID_MEMBER;
        }
    }

    private void sendMails(Function<BecomeMemberMailBuilder, TemplateMail> builderFunction) {
        Principal.getAllActivePersons(group._notified()).forEach(person -> sendMail(person, builderFunction));
    }

    private void sendMail(Person recepient, Function<BecomeMemberMailBuilder, TemplateMail> builderFunction) {
        TemplateMail mail = builderFunction.apply(createMailBuilder(recepient));
        try {
            PlatformComponentRegistry.INSTANCE().getMailSender().sendMail(mail);
        } catch (MailSenderException e) {
            log.error("Error sending become membership mail", e);
        }
    }

    private BecomeMemberMailBuilder createMailBuilder(Person recepient) {
        return new BecomeMemberMailBuilder()
                .withRecepient(recepient.getMailAddress())
                .withLocale(recepient.getLanguage(TenantResources.getTenantDefaultLocale()))
                .withGroupName(group.getName())
                .withGroupUrl(group.getAbsoluteUrl())
                .withUserName(p.getName())
                .withUserUrl(p.getAbsoluteUrl())
                .withPendingRequests(group.getPendingRequestsCount())
                .withActiveMembers(group.getActiveMembershipCount());
    }

    @Override
    public String getActionIconName() {
        return "fa-cog";
    }

    public abstract static class BecomeMemberAction extends Action {

        protected abstract Group getGroup();

        @Override
        public Message overrideHandlerTargetLabel() {
            return becomeMemberTargetLabel;
        }

        @Override
        protected boolean show() {
            GroupApplicationState cbm = getGroup().canBecomeMember();
            return cbm.equals(GroupApplicationState.NOT_LOGGED_IN) || cbm.equals(GroupApplicationState.YES_BECOME_MEMBER);
        }

        @Override
        public void target(Forwarder f) {
            f.goWithId(BecomeMemberHandler.class, getGroup());
        }
    }

    public abstract static class ApplyForMembershipAction extends Action {

        protected abstract Group getGroup();

        @Override
        public Message overrideHandlerTargetLabel() {
            return applyForMembershipTargetLabel;
        }

        @Override
        protected boolean show() {
            GroupApplicationState cbm = getGroup().canBecomeMember();
            return cbm.equals(GroupApplicationState.YES_APPLY);
        }

        @Override
        public void target(Forwarder f) {
            f.goWithId(BecomeMemberHandler.class, getGroup());
        }
    }
}
