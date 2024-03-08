/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import javax.annotation.Nullable;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.HistoryEntryNameProvider;
import cf.cplace.platform.core.frontend.handler.station.template.MainPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.navigation.TargetProvider;
import cf.cplace.platform.core.frontend.handler.TitleAndHeadingProvider;
import cf.cplace.platform.frontend.handler.group.overview.DefaultActionsAndViews;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state.State;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;

@CplaceApi
public class ViewHandler extends Handler implements FullPageHandler, TitleAndHeadingProvider, HistoryEntryNameProvider {

    final Station SHOW = new MainPage() {
        @Override
        public TargetProvider getViewsProvider() {
            return new DefaultActionsAndViews();
        }

        @Override
        public TargetProvider getActionsProvider() {
            return new DefaultActionsAndViews();
        }

        @Override
        protected void putContentBodySubstitutions(Template template) {
            template.put("state", PrintSubstitution.printing(Escaping.htmlAttribute, () -> {
                State state = new State();
                return state.toJson();
            }));
        }
    };

    public static final Message title = new Message() {
    };

    @Override
    public void checkAccess() {
        checkLoggedIn();
    }

    @Override
    public Station doBusinessLogic() {
        return SHOW;
    }

    @Override
    public Message getHistoryEntryName() {
        return title;
    }

    @Override
    public Message getTargetLabel() {
        return title;
    }

    @Override
    public Message getTitleAndHeading() {
        return DefaultActionsAndViews.overviewTitle;
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "fa-check-square-o";
    }
}
