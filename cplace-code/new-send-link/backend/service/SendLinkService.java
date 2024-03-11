package cf.cplace.platform.frontend.rest.dialogs.sendlink.service;

import java.util.List;
import java.util.Objects;

import javax.annotation.ParametersAreNonnullByDefault;

import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.core.application.job.assets.PersistentJob;
import cf.cplace.platform.core.application.page.assets.Page;
import cf.cplace.platform.core.application.versioning.AwarenessSessionEntitiesExtension.SessionTypes.SEND_LINK_DATA;
import cf.cplace.platform.core.application.versioning.SendLinkData;
import cf.cplace.platform.core.datamodel.custom.CustomSessionEntity;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.frontend.handler.awareness.SendLinkJob;
import cf.cplace.platform.frontend.handler.awareness.SendLinkMailBody;
import cf.cplace.platform.frontend.rest.dialogs.DialogService;
import cf.cplace.platform.frontend.rest.dialogs.sendlink.dto.SendLinkGetRequest;
import cf.cplace.platform.frontend.rest.dialogs.sendlink.dto.SendLinkGetResponse;
import cf.cplace.platform.frontend.rest.dialogs.sendlink.dto.SendLinkPostRequest;
import cf.cplace.platform.frontend.rest.shared.dto.control.change.ControlChangeConflict;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderGetResponse;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderPostRequest;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderPostResponse;

/**
 * Provides the form data for the Send Link dialog.
 */
@ParametersAreNonnullByDefault
public class SendLinkService implements DialogService<SendLinkGetRequest, SendLinkPostRequest> {
    private static final Message sendLinkErrorMessage = new Message() {
    };
    private static final Message sendLinkSuccessMessage = new Message() {
    };

    @Override
    public CplaceFormProviderGetResponse getFormData(SendLinkGetRequest getRequest) {
        Page pageByUid = Page.getPageByUid(getRequest.entityUid());
        CustomSessionEntity data = CustomSessionEntity.SCHEMA.create(SEND_LINK_DATA.TYPE);
        String currentUserName = Objects.requireNonNull(SessionLocal.getUser()).getValueOfNameProperty();
        String messageBodyPart = Template.getString(new SendLinkMailBody(pageByUid, currentUserName, getRequest.activeTabInfo()));
        data.set(SEND_LINK_DATA.MESSAGE, messageBodyPart);
        data.setCustomReference(SEND_LINK_DATA.ENTITY.name, pageByUid);
        data.set(SEND_LINK_DATA.SENDER, SessionLocal.getUser());
        return CplaceFormProviderGetResponse.Builder.getInstance()
                .setControlStates(
                        data.getControlState(SEND_LINK_DATA.RECIPIENTS), data.getControlState(SEND_LINK_DATA.MESSAGE))
                .setData(new SendLinkGetResponse(data.getId()))
                .build();
    }

    @Override
    public CplaceFormProviderPostResponse postFormData(CplaceFormProviderPostRequest<SendLinkPostRequest> request) {
        CustomSessionEntity customSessionEntity = CustomSessionEntity.SCHEMA.getEntityNotNull(request.getData().sessionEntityId());
        List<ControlChangeConflict> conflicts = customSessionEntity.applyControlChanges(request.getControlChanges());
        if (conflicts != null) {
            return CplaceFormProviderPostResponse.Builder.getInstance()
                    .setConflicts(conflicts)
                    .setErrorMessage(sendLinkErrorMessage.get())
                    .build();
        }

        String jobParam = new SendLinkData(
                customSessionEntity.get(SEND_LINK_DATA.RECIPIENTS),
                customSessionEntity.optCustomReference(SEND_LINK_DATA.ENTITY.name).orElseThrow(() -> new IllegalArgumentException("entity")),
                customSessionEntity.getNotNull(SEND_LINK_DATA.SENDER),
                customSessionEntity.getNotEmpty(SEND_LINK_DATA.MESSAGE))
                .toJson();
        PersistentJob.createJobAndStartInSeparateThread(SendLinkJob.class, jobParam);

        return CplaceFormProviderPostResponse.Builder.getInstance()
                .setSuccessMessage(sendLinkSuccessMessage.get())
                .build();
    }
}
