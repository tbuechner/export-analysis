/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.TableButton;
import cf.cplace.platform.frontend.handler.flexigrid.AbstractButtonsHandler;

public class GroupsTableButtonsHandler extends AbstractButtonsHandler {

    @Override
    protected void doDoBusinessLogic() {
        buttons.add(TableButton.modalButton("create-new-button",
                Forwarder.getFullUrl(NewHandler.class),
                "fa-plus",
                NewHandler.targetLabel,
                false,
                TableButton.ButtonType.PRIMARY)
        );
    }
}
