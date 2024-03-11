/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.handler.page;

import static cf.cplace.platform.assets.awareness.AwarenessSessionEntitiesExtension.SessionTypes.SEND_LINK_DATA;

import javax.annotation.Nonnull;

import cf.cplace.platform.api.CplaceApi;
import cf.cplace.platform.assets.custom.CustomEntity;
import cf.cplace.platform.assets.custom.CustomSessionEntity;
import cf.cplace.platform.client.Parameters;
import cf.cplace.platform.client.SessionLocal;
import cf.cplace.platform.handler.Forwarder;
import cf.cplace.platform.handler.Handler;
import cf.cplace.platform.handler.JsonPage;
import cf.cplace.platform.handler.Modality;
import cf.cplace.platform.handler.Station;
import cf.cplace.platform.handler.awareness.SendLinkMailBody;
import cf.cplace.platform.internationalization.Message;
import cf.cplace.platform.template.Escaping;
import cf.cplace.platform.template.PrintSubstitution;
import cf.cplace.platform.template.Template;

@CplaceApi
public class SendLinkHandler extends Handler {

    public static final Message targetLabel = new Message() {
    };

    private CustomSessionEntity data;
    private CustomEntity entity;

    @Override
    public void checkAccess() {
        checkLoggedIn();

        String id = Parameters.getString("id");
        if (id != null) {
            data = CustomSessionEntity.SCHEMA.getEntityAndCheckMayEdit(id);
            entity = data.getCustomReference(SEND_LINK_DATA.ENTITY.name);
        } else {
            String linkId = Parameters.getString("linkId");
            entity = CustomEntity.getCustomEntityByUidNotNull(linkId);
        }
    }

    @Override
    public Station doBusinessLogic() {
        if (data == null) {
            data = CustomSessionEntity.SCHEMA.create(SEND_LINK_DATA.TYPE);
            String messageBodyPart = Template.getString(new SendLinkMailBody(entity, SessionLocal.getUser().getValueOfNameProperty(), Parameters.getString("activeTabsInfo")));
            data.set(SEND_LINK_DATA.MESSAGE, messageBodyPart);
            data.setCustomReference(SEND_LINK_DATA.ENTITY.name, entity);
            data.set(SEND_LINK_DATA.SENDER, SessionLocal.getUser());
        }
        return SHOW;
    }

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("submitUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> Forwarder.getFullUrl(SubmitSendLinkHandler.class, data)));
        }

        @Override
        public CustomSessionEntity getScopeObject() {
            return data;
        }

    };

    @Nonnull
    @Override
    public Modality getModality() {
        return Modality.LARGE;
    }

    @Override
    public String getActionIconName() {
        return "fa-paper-plane";
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }
}
