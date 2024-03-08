/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.frontend.handler.flexigrid.TableColumnFilterDialogHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.FilterGroupsSpecificationHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.LoadDataHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.ToggleMembershipHandler;
import cf.cplace.platform.frontend.handler.page.NewPageConfig;
import cf.cplace.platform.commonlib.util.io.gson.GsonUtil;
import cf.cplace.platform.commonlib.util.NameValue;

public class State {

    public Data data;

    public boolean nestedGroupFiltersEnabled = true;

    public final String toggleMembershipUrl = Forwarder.getFullUrl(ToggleMembershipHandler.class);

    public final String filterNestedGroupsDialogUrl = Forwarder.getFullUrl(TableColumnFilterDialogHandler.class,
            new NameValue(NewPageConfig.FLEXI_COMPONENT_IDENTIFIER, Forwarder.getFullUrl(FilterGroupsSpecificationHandler.class)),
            new NameValue("columnName", Group.SCHEMA.prototype()._name().getName())
    );

    public final String filterGroupsDialogUrl = Forwarder.getFullUrl(TableColumnFilterDialogHandler.class,
            new NameValue(NewPageConfig.FLEXI_COMPONENT_IDENTIFIER, Forwarder.getFullUrl(FilterGroupsSpecificationHandler.class)),
            new NameValue("columnName", Group.SCHEMA.prototype()._name().getName())
    );

    public final String loadDataUrl = Forwarder.getFullUrl(LoadDataHandler.class);

    public String toJson() {
        return GsonUtil.getGsonWithModifiedDateSerializer().toJson(this, this.getClass());
    }
}
