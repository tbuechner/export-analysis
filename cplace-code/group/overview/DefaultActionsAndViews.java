/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview;

import javax.annotation.Nonnull;

import cf.cplace.platform.commonlib.apiannotation.CplaceInternal;
import cf.cplace.platform.core.frontend.handler.navigation.Action;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.navigation.TargetProvider;
import cf.cplace.platform.core.frontend.handler.navigation.View;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.ViewHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting.Export2ExcelHandler;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.importing.ImportFromExcelHandler;
import cf.cplace.platform.commonlib.internationalization.Message;

public class DefaultActionsAndViews implements TargetProvider {
    @CplaceInternal
    public static final Message overviewTitle = new Message() {
    };

    final View USERS = new View() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-users";
        }

        @Override
        public void target(Forwarder f) {
            f.go(UsersHandler.class);
        }
    };

    final View ALL_GROUPS = new View() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-all-groups";
        }

        @Override
        public void target(Forwarder f) {
            f.go(GroupsHandler.class);
        }
    };

    final View MATRIX = new View() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-matrix";
        }

        @Override
        public void target(Forwarder f) {
            f.go(ViewHandler.class);
        }
    };

    final View GROUP_IN_GROUP_MATRIX = new View() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-group-vs-group-matrix";
        }

        @Override
        public void target(Forwarder f) {
            f.go(cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.ViewHandler.class);
        }
    };

    final Action IMPORT_MATRIX = new Action() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-import-matrix";
        }

        @Override
        public void target(Forwarder f) {
            f.go(ImportFromExcelHandler.class);
        }
    };

    final Action EXPORT_MATRIX = new Action() {

        @Nonnull
        @Override
        public String getId() {
            return "cf-cplace-platform-export-matrix";
        }

        @Override
        public void target(Forwarder f) {
            f.go(Export2ExcelHandler.class);
        }
    };

}
