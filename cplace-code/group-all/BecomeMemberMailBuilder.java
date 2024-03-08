package cf.cplace.platform.frontend.handler.group;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableSet;

import cf.cplace.platform.commonlib.mail.api.TemplateMail;
import cf.cplace.platform.core.server.TenantResources;

/**
 * Builds a {@link TemplateMail} for the use cases:
 * <ul>
 *     <li>A user self-registers for a group membership</li>
 *     <li>A user applies for a group membership</li>
 * </ul>
 */
@ParametersAreNonnullByDefault
class BecomeMemberMailBuilder {

    private final String applicationTitle;

    private String recepient;
    private Locale locale;
    private String groupName;
    private String groupUrl;
    private String userName;
    private String userUrl;
    private int pendingRequests;
    private int activeMembers;

    BecomeMemberMailBuilder() {
        this(TenantResources.INSTANCE().getTitleMessage());
    }

    BecomeMemberMailBuilder(String applicationTitle) {
        this.applicationTitle = applicationTitle;
    }

    @Nonnull
    BecomeMemberMailBuilder withRecepient(String recepient) {
        this.recepient = recepient;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withLocale(Locale locale) {
        this.locale = locale;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withGroupName(String groupName) {
        this.groupName = groupName;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withGroupUrl(String groupUrl) {
        this.groupUrl = groupUrl;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withUserName(String userName) {
        this.userName = userName;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withUserUrl(String userUrl) {
        this.userUrl = userUrl;
        return this;
    }

    @Nonnull
    BecomeMemberMailBuilder withPendingRequests(int pendingRequests) {
        this.pendingRequests = pendingRequests;
        return this;
    }

    @Nonnull
    public BecomeMemberMailBuilder withActiveMembers(int activeMembers) {
        this.activeMembers = activeMembers;
        return this;
    }

    @Nonnull
    TemplateMail buildApplyForMembershipMail() {
        return getGeneralBuilder()
                .withSubjectTemplatePath("cf/cplace/platform/handler/group/templates/applyForMembershipMailSubject.txt")
                .withBodyTemplatePath("cf/cplace/platform/handler/group/templates/applyForMembershipMailContent.html")
                .build();
    }

    @Nonnull
    TemplateMail buildRegisterMembershipMail() {
        return getGeneralBuilder()
                .withSubjectTemplatePath("cf/cplace/platform/handler/group/templates/registerMembershipMailSubject.txt")
                .withBodyTemplatePath("cf/cplace/platform/handler/group/templates/registerMembershipMailContent.html")
                .build();
    }

    @Nonnull
    private TemplateMail.TemplateMailBuilder getGeneralBuilder() {
        return new TemplateMail.TemplateMailBuilder()
                .withRecipients(ImmutableSet.of(Preconditions.checkNotNull(recepient, "recepient must not be null")))
                .withLocale(Preconditions.checkNotNull(locale, "locale must not be null"))
                .withContext(getContext());
    }

    @Nonnull
    private Map<String, Object> getContext() {
        Map<String, Object> context = new HashMap<>();
        context.put("application_title", Preconditions.checkNotNull(applicationTitle, "applicationTitle must not be null"));
        context.put("group_name", Preconditions.checkNotNull(groupName, "groupName must not be null"));
        context.put("group_url", Preconditions.checkNotNull(groupUrl, "groupUrl must not be null"));
        context.put("user_name", Preconditions.checkNotNull(userName, "userName must not be null"));
        context.put("user_url", Preconditions.checkNotNull(userUrl, "userUrl must not be null"));
        context.put("pending_requests", pendingRequests);
        context.put("active_members", activeMembers);
        return context;
    }
}
