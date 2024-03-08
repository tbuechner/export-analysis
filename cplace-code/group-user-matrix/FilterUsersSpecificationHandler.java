/*
 * Copyright 2016, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Collections;
import java.util.List;

import javax.annotation.Nullable;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.datamodel.custom.TypeDefinition;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.PersonSpace;
import cf.cplace.platform.core.datamodel.search.filter.Filters;
import cf.cplace.platform.core.datamodel.search.Search;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.TableSpecificationHandler;
import cf.cplace.platform.frontend.handler.page.AbstractActionHandler;
import cf.cplace.platform.frontend.handler.systemGroup.UsersActionsHandler;

/**
 * Represents the filter dialog on the user dimension in the user and group matrix.
 * <p>
 * See {@link FilterGroupsSpecificationHandler} for the filter dialog on the group dimension.
 */
@CplaceApi
public class FilterUsersSpecificationHandler extends TableSpecificationHandler {

    protected void buildSearch() {
        search = new Search();
        search.add(Filters.space(PersonSpace.getPersonSpace()));
        TypeDefinition userTypeDefinition = Person.getUserTypeDefinition();
        search.add(Filters.type(userTypeDefinition));
    }

    @Override
    public boolean showActions() {
        return GlobalPermissions.mayEditAllTypes();
    }

    @Nullable
    @Override
    public Class<? extends AbstractActionHandler> getActionsHandlerIfShown() {
        return UsersActionsHandler.class;
    }

    public FilterUsersSpecificationHandler() {
        buildSearch();
    }

    @Override
    public void checkAccess() {
        columnNamesToBeDisplayed.addAll(getDefaultColumnNamesIfNoUserConfig());
        availableColumnNames.addAll(search.getCustomAttributeNames());
        availableColumnNames.addAll(search.getAvailableBuiltinAttributeNamesWithoutDummyAttributes());
    }

    @Override
    public String getFullUrl() {
        return Forwarder.getFullUrl(FilterUsersSpecificationHandler.class);
    }

    @Override
    protected List<String> getDefaultColumnNamesIfNoUserConfig() {
        return Collections.emptyList();
    }
}
