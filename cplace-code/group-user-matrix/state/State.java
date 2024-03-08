/*
 * Copyright 2016, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state;

import cf.cplace.platform.core.application.application.Application;
import cf.cplace.platform.core.datamodel.builtin.assets.readaccess.ReadProtected;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.frontend.handler.flexigrid.TableColumnFilterDialogHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.FilterGroupsSpecificationHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.FilterUsersSpecificationHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.LoadDataHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.ToggleMembershipHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting.Export2ExcelHandler;
import cf.cplace.platform.frontend.handler.page.NewPageConfig;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;
import cf.cplace.platform.commonlib.util.NameValue;

public class State {

    public Data data;

    public boolean userFiltersEnabled = true;

    public final String toggleMembershipUrl = Forwarder.getFullUrl(ToggleMembershipHandler.class);

    public final String filterUsersDialogUrl = Forwarder.getFullUrl(TableColumnFilterDialogHandler.class,
            new NameValue(NewPageConfig.FLEXI_COMPONENT_IDENTIFIER, Forwarder.getFullUrl(FilterUsersSpecificationHandler.class)),
            new NameValue("columnName", Person.SCHEMA.prototype()._name().getName())
    );

    public final String filterGroupsDialogUrl = Forwarder.getFullUrl(TableColumnFilterDialogHandler.class,
            new NameValue(NewPageConfig.FLEXI_COMPONENT_IDENTIFIER, Forwarder.getFullUrl(FilterGroupsSpecificationHandler.class)),
            new NameValue("columnName", Group.SCHEMA.prototype()._name().getName())
    );

    public final String loadDataUrl = Forwarder.getFullUrl(LoadDataHandler.class);

    public final String exportDataUrl = Forwarder.getFullUrl(Export2ExcelHandler.class);

    public final boolean mayExportGroupMemberships = ReadProtected.sessionUserMatchesOneOfThese(Application.getApplication()._mayExportGroupMemberships().getAssets());

    public String toJson() {
        return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
    }
}
