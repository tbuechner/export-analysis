/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import javax.annotation.Nullable;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.MainPage;
import cf.cplace.platform.core.frontend.handler.ShowTagsAndModificationDate;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.TitleAndHeadingProvider;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.datamodel.builtin.Entity;
import cf.cplace.platform.core.datamodel.builtin.EntityHandler;
import cf.cplace.platform.frontend.templating.FunctionsHelper;
import cf.cplace.platform.frontend.templating.ObjectFunctions;
import cf.cplace.platform.commonlib.template.ConditionalSubstitution;
import cf.cplace.platform.commonlib.template.Template;

public class ViewHandler extends Handler implements FullPageHandler, EntityHandler, TitleAndHeadingProvider, ShowTagsAndModificationDate {
    private static final Message targetLabel = new Message() {
    };

    private Group group;
    private boolean showAllMemberships;

    final Station SHOW = new MainPage() {
        @Override
        public Group getScopeObject() {
            return group;
        }

        @Override
        protected void putContentBodySubstitutions(Template template) {
            template.put("showAllMemberships", ConditionalSubstitution.testing(() -> showAllMemberships));
        }
    };

    @Override
    public void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("id"));
    }

    @Override
    public Station doBusinessLogic() {
        showAllMemberships = Parameters.getBoolean(ObjectFunctions.SHOW_ALL_MEMBERSHIPS_PARAM);
        return SHOW;
    }

    @Override
    public Entity getEntity() {
        return group;
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "cf-master-detail";
    }

    @Override
    public Message getTitleAndHeading() {
        return Message.dynamicHtmlUnsafeMessage(FunctionsHelper.proxy("titleAndHeading", group.getNamePropertyForQueries()));
    }
}
