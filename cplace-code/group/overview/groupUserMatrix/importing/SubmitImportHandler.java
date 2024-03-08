/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.importing;

import java.io.File;
import java.io.IOException;

import org.apache.poi.xssf.usermodel.XSSFWorkbookType;
import org.springframework.web.multipart.MultipartFile;

import cf.cplace.platform.core.application.job.assets.PersistentJob;
import cf.cplace.platform.core.server.request.RequestLocal;
import cf.cplace.platform.core.frontend.handler.Forwarder;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JobCreatedJsonPage;
import cf.cplace.platform.core.frontend.handler.station.Line;
import cf.cplace.platform.core.frontend.handler.PostOnlyHandler;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.ViewHandler;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.core.server.TenantResources;
import cf.cplace.platform.commonlib.util.Utilities;

/**
 * Subsequently to the {@link ImportFromExcelHandler}, creates and starts the {@link ImportFromExcelJob}.
 */
public class SubmitImportHandler extends Handler implements PostOnlyHandler {

    private static final Message noFile = new Message() {
    };

    final Station SUCCESS = new JobCreatedJsonPage() {
        @Override
        protected PersistentJob getJob() {
            return job;
        }

        @Override
        protected String getTargetUrl() {
            return Forwarder.getFullUrl(ViewHandler.class);
        }
    };
    final Station INVALID = new Line() {
        @Override
        public void next(Forwarder f) {
            f.go(ImportFromExcelHandler.class);
        }
    };

    private MultipartFile uploadedFile;

    private PersistentJob job;

    @Override
    public void checkAccess() {
        uploadedFile = RequestLocal.getUploadedFile();
    }

    @Override
    public Station doBusinessLogic() {
        if (!isValidAndAddGenerateErrorMessagesIfNot()) {
            return INVALID;
        }

        String name = String.format("group_membership_import_%s.%s", Utilities.randomId(), XSSFWorkbookType.XLSX.getExtension());
        File destinationFile = new File(TenantResources.INSTANCE().getOrCreateUploadDirectory(), name);

        try {
            uploadedFile.transferTo(destinationFile.toPath());
        } catch (IOException e) {
            throw new IllegalStateException("failed to copy uploaded file", e);
        }

        job = PersistentJob.createJobAndStartInSeparateThread(ImportFromExcelJob.class, ImportFromExcelJob.paramsAsJson(destinationFile.getAbsolutePath()));
        return SUCCESS;

    }

    private static final Message wrongType = new Message() {
    };

    private boolean isValidAndAddGenerateErrorMessagesIfNot() {
        if (uploadedFile == null) {
            RequestLocal.addErrorMessage(noFile.get());
            return false;
        }

        if (!uploadedFile.getOriginalFilename().endsWith(".xlsx")) {
            RequestLocal.addErrorMessage(wrongType.get());
            return false;
        }
        return true;
    }
}
