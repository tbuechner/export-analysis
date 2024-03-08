/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting;

import javax.annotation.Nullable;

import cf.cplace.platform.core.application.authorization.GlobalPermissions;
import cf.cplace.platform.core.application.job.assets.PersistentJob;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.station.template.JobCreatedJsonPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.LoadDataHandler;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.frontend.handler.ProtectedActionException;

/**
 * Subsequently to the {@link Export2ExcelHandler}, creates and starts the {@link Export2ExcelJob}.
 */
public class SubmitExportHandler extends LoadDataHandler {

    private static final Message label = new Message() {
    };

    private Station EXPORT = new JobCreatedJsonPage() {
        @Override
        protected PersistentJob getJob() {
            return job;
        }
    };

    private PersistentJob job;

    @Override
    protected void additionalCheckAccess() {
        SessionLocal.checkLoggedIn();
        if (!GlobalPermissions.mayExportGroupMemberships()) {
            throw new ProtectedActionException();
        }
    }

    @Override
    public Station doBusinessLogic() {
        boolean filterForGroupAdmin = Parameters.getBoolean("filterForGroupAdmin", false);
        job = Export2ExcelJob.createJobAndStartInSeparateThread(groupUserMatrixFilters._userFilters().isEmpty() ? null : groupUserMatrixFilters._userFilters().get(),
            groupUserMatrixFilters._groupFilters().isEmpty() ? null : groupUserMatrixFilters._groupFilters().get(),
            groupUserMatrixFilters._onlyUnassignedUsers().get(),
            groupUserMatrixFilters._filterUsersByGroups().get(),
            groupUserMatrixFilters._filterGroupsByUsers().get(),
            filterForGroupAdmin);
        return EXPORT;
    }

    @Nullable
    @Override
    public Message getTargetLabel() {
        return label;
    }

    @Nullable
    @Override
    public String getActionIconName() {
        return "fa-download";
    }
}
