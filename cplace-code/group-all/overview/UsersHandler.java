package cf.cplace.platform.frontend.handler.group.overview;

import javax.annotation.Nullable;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.datamodel.search.filter.Filters;
import cf.cplace.platform.core.datamodel.search.Search;
import cf.cplace.platform.core.frontend.handler.navigation.Action;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.FullPageHandler;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.HistoryEntryNameProvider;
import cf.cplace.platform.core.frontend.handler.station.template.MainPage;
import cf.cplace.platform.frontend.handler.SearchHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.core.frontend.handler.navigation.TargetProvider;
import cf.cplace.platform.core.frontend.handler.TitleAndHeadingProvider;
import cf.cplace.platform.frontend.handler.flexigrid.CustomSearchResultTable;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.FilterUsersSpecificationHandler;
import cf.cplace.platform.frontend.handler.person.NewHandler;
import cf.cplace.platform.frontend.handler.typeDefinition.SettingsHandler;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.frontend.templating.ActionAndHandler;
import cf.cplace.platform.frontend.templating.FunctionsHelper;
import cf.cplace.platform.core.frontend.handler.navigation.extension.AddUserActionExtension;
import cf.cplace.platform.commonlib.util.text.Escaping;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.SimpleListSubstitution;
import cf.cplace.platform.commonlib.template.Template;
import cf.cplace.platform.commonlib.util.NameValue;

@CplaceApi
public class UsersHandler extends Handler implements FullPageHandler, TitleAndHeadingProvider, HistoryEntryNameProvider {

    public static final Message targetLabel = new Message() {
    };

    final Station SHOW = new MainPage() {
        @Override
        public TargetProvider getViewsProvider() {
            return new DefaultActionsAndViews();
        }

        @Override
        protected void putContentBodySubstitutions(Template template) {
            template.put("searchUsersUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () -> {
                Search search = new Search();
                search.add(Filters.entityClass(Person.class));
                return Forwarder.getFullUrl(SearchHandler.class, new NameValue(SearchHandler.PARAMETER_SEARCH_AS_JSON, search.serializeAsJson()));
            }));
            template.put("userTypeUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () ->
                    Forwarder.getFullUrl(SettingsHandler.class, Person.getUserTypeDefinition())));
            template.put("newUserUrl", PrintSubstitution.printing(Escaping.htmlAttribute, () ->
                    Forwarder.getFullUrl(NewHandler.class)));
            template.put("addUserActionExtensions", new SimpleListSubstitution<Action>() {
                @Override
                protected Iterable<Action> getItems() {
                    return AddUserActionExtension.getAvailableActions();
                }

                @Override
                protected void putAdditionalSubstitutions(Template template) {
                    template.put("action", PrintSubstitution.printing(Escaping.none, () -> {
                        final ActionAndHandler actionAndHandler = new ActionAndHandler(getCurrentItem());
                        return FunctionsHelper.proxy("action", actionAndHandler, new NameValue("defaultClasses", "btn btn-primary"));
                    }));
                }
            });
            template.put("table", PrintSubstitution.printing(Escaping.none, () -> Template.getString(table)));
        }
    };

    CustomSearchResultTable table;

    @Override
    protected void checkAccess() {
        checkLoggedIn();
    }

    @Override
    public Station doBusinessLogic() {
        table = new CustomSearchResultTable(new FilterUsersSpecificationHandler());
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
        return "fa-user";
    }
}
