/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview;

import javax.annotation.Nullable;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.SystemGroup;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.HistoryEntryNameProvider;
import cf.cplace.platform.core.frontend.handler.station.template.MainPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.navigation.TargetProvider;
import cf.cplace.platform.core.frontend.handler.TitleAndHeadingProvider;
import cf.cplace.platform.frontend.handler.flexigrid.CustomSearchResultTable;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.FilterGroupsSpecificationHandler;
import cf.cplace.platform.frontend.handler.typeDefinition.SettingsHandler;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.SimpleListSubstitution;
import cf.cplace.platform.commonlib.template.Template;

@CplaceApi
public class GroupsHandler extends Handler implements FullPageHandler, TitleAndHeadingProvider, HistoryEntryNameProvider {

    public static final Message targetLabel = new Message() {
    };

    CustomSearchResultTable table;

    final Station SHOW = new MainPage() {
        @Override
        public TargetProvider getViewsProvider() {
            return new DefaultActionsAndViews();
        }

        @SuppressWarnings("Convert2MethodRef")
        @Override
        protected void putContentBodySubstitutions(Template template) {
            template.put("systemGroups", SimpleListSubstitution.forItems(() -> SystemGroup.SCHEMA.getEntities()));
            template.put("table", PrintSubstitution.printing(Escaping.none, () -> Template.getString(table)));
            template.put("groupTypeUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> Forwarder.getFullUrl(SettingsHandler.class, Group.getGroupTypeDefinition())));
        }
    };

    @Override
    protected void checkAccess() {
        checkLoggedIn();
    }

    @Override
    public Station doBusinessLogic() {
        table = new CustomSearchResultTable(new FilterGroupsSpecificationHandler());
        return SHOW;
    }

    @Override
    public Message getHistoryEntryName() {
        return targetLabel;
    }

    @Override
    public Message getTargetLabel() {
        return targetLabel;
    }

    @Override
    public Message getTitleAndHeading() {
        return DefaultActionsAndViews.overviewTitle;
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "fa-users";
    }
}

