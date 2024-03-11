/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.handler.page;

import static cf.cplace.platform.assets.awareness.AwarenessSessionEntitiesExtension.SessionTypes.SEND_LINK_DATA;

import java.util.Set;

import cf.cplace.platform.assets.PersistentJob;
import cf.cplace.platform.assets.awareness.SendLinkData;
import cf.cplace.platform.assets.custom.CustomSessionEntity;
import cf.cplace.platform.assets.group.Person;
import cf.cplace.platform.client.Parameters;
import cf.cplace.platform.handler.Forwarder;
import cf.cplace.platform.handler.Handler;
import cf.cplace.platform.handler.JsonPage;
import cf.cplace.platform.handler.JsonSuccessStation;
import cf.cplace.platform.handler.Line;
import cf.cplace.platform.handler.PostOnlyHandler;
import cf.cplace.platform.handler.Station;
import cf.cplace.platform.handler.awareness.SendLinkJob;
import cf.cplace.platform.internationalization.Message;

public class SubmitSendLinkHandler extends Handler implements PostOnlyHandler {

    private static final Message successfulSentMessage = new Message() {
    };

    private static final Message noRecipientsMessage = new Message() {
    };

    final Station VALID = new JsonSuccessStation() {
        @Override
        protected String getTargetUrl() {
            return null;
        }

        @Override
        protected Message getConfirmationMessage() {
            return successfulSentMessage;
        }
    };

    final Station NO_RECIPIENTS = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(SendLinkHandler.class, sendLinkData, JsonPage.ERROR_PARAMETER);
        }

        @Override
        public Message getErrorMessage() {
            return noRecipientsMessage;
        }
    };

    final Station INVALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.goWithId(SendLinkHandler.class, sendLinkData, JsonPage.ERROR_PARAMETER);
        }

    };

    private CustomSessionEntity sendLinkData;

    @Override
    public void checkAccess() {
        this.sendLinkData = CustomSessionEntity.SCHEMA.getEntityAndCheckMayEdit(Parameters.getString("id"));
    }

    @Override
    public Station doBusinessLogic() {
        sendLinkData.applyParameters();

        if (sendLinkData.isUiSubmitValidAndNotModifiedAndGenerateErrorMessagesIfNot()) {
            // Even when the list of recipients is non-empty, it may contain no eligible mail recipients.
            Set<Person> recipients = SendLinkJob.getAllPeople(sendLinkData.get(SEND_LINK_DATA.RECIPIENTS), sendLinkData.get(SEND_LINK_DATA.SENDER));
            if (recipients.isEmpty()) {
                return NO_RECIPIENTS;
            }

            String jsonString = new SendLinkData(
                    sendLinkData.get(SEND_LINK_DATA.RECIPIENTS),
                    sendLinkData.optCustomReference(SEND_LINK_DATA.ENTITY.name).orElseThrow(() -> new IllegalArgumentException("entity")),
                    sendLinkData.getNotNull(SEND_LINK_DATA.SENDER),
                    sendLinkData.getNotEmpty(SEND_LINK_DATA.MESSAGE))
                    .toJson();
            PersistentJob.createJobAndStartInSeparateThread(SendLinkJob.class, jsonString);
            return VALID;
        } else {
            return INVALID;
        }
    }


}
