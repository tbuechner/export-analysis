package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.List;
import java.util.Set;

import javax.annotation.Nullable;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.gson.Gson;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.HistoryEntryNameProvider;
import cf.cplace.platform.core.frontend.handler.station.template.MainPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.navigation.TargetProvider;
import cf.cplace.platform.core.frontend.handler.TitleAndHeadingProvider;
import cf.cplace.platform.frontend.handler.group.overview.DefaultActionsAndViews;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state.State;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.commonlib.internationalization.ParameterizedMessage;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;

@CplaceApi
public class ViewHandler extends Handler implements FullPageHandler, TitleAndHeadingProvider, HistoryEntryNameProvider {

    private static final ParameterizedMessage htmlUnsafe_filtered = new ParameterizedMessage() {
    };

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
            template.put("filteredMessage", PrintSubstitution.printingMessageHtml(() -> {
                if (usersToBeFiltered.size() > 0) {
                    return htmlUnsafe_filtered.setParameters(Forwarder.getFullUrl(ViewHandler.class));
                } else {
                    return null;
                }
            }));
        }
    };

    public static final Message title = new Message() {
    };

    Set<Person> usersToBeFiltered = Sets.newHashSet();

    @Override
    public void checkAccess() {
        checkLoggedIn();
    }

    @Override
    public Station doBusinessLogic() {
        String userIdsJson = Parameters.getString("userIds");
        if (!Strings.isNullOrEmpty(userIdsJson)) {
            UserIds userIds = new Gson().fromJson(Preconditions.checkNotNull(userIdsJson, "json"), UserIds.class);
            for (String userId : userIds.userIds) {
                Person user = Person.SCHEMA.getEntity(userId);
                if (user != null) {
                    usersToBeFiltered.add(user);
                }
            }
        }
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

    @CplaceApi
    public static class UserIds {

        public String toJson() {
            return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
        }

        public List<String> userIds = Lists.newArrayList();
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "fa-check-square-o";
    }
}
