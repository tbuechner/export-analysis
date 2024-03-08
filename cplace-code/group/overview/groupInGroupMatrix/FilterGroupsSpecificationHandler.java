/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix;

import java.util.Collections;
import java.util.List;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.PersonSpace;
import cf.cplace.platform.core.datamodel.search.filter.Filters;
import cf.cplace.platform.core.datamodel.search.Search;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.TableSpecificationHandler;
import cf.cplace.platform.frontend.handler.group.NewHandler;

/**
 * Represents the filter dialog on the group dimension in the group vs group matrix.
 * <p>
 */
public class FilterGroupsSpecificationHandler extends TableSpecificationHandler {

    protected void buildSearch() {
        search = new Search();
        search.add(Filters.space(PersonSpace.getPersonSpace()));
        search.add(Filters.type(Group.getGroupTypeDefinition()));
    }

    @Override
    public boolean showActions() {
        return GlobalPermissions.mayEditAllTypes();
    }

    public FilterGroupsSpecificationHandler() {
        buildSearch();
    }

    @Override
    public String getEditNewUrl() {
        return Forwarder.getFullUrl(NewHandler.class);
    }

    @Override
    public boolean isAllowedToCreateNewPage() {
        return false;
    }

    @Override
    public void checkAccess() {
        columnNamesToBeDisplayed.addAll(getDefaultColumnNamesIfNoUserConfig());
        availableColumnNames.addAll(search.getCustomAttributeNames());
        availableColumnNames.addAll(search.getAvailableBuiltinAttributeNamesWithoutDummyAttributes());
    }

    @Override
    public String getFullUrl() {
        return Forwarder.getFullUrl(FilterGroupsSpecificationHandler.class);
    }

    @Override
    protected List<String> getDefaultColumnNamesIfNoUserConfig() {
        return Collections.emptyList();
    }
}
