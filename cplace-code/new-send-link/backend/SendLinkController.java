package cf.cplace.platform.frontend.rest.dialogs.sendlink;

import static cf.cplace.platform.Constants.PLATFORM_PLUGIN_NAME;

import javax.annotation.ParametersAreNonnullByDefault;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cf.cplace.platform.core.frontend.controller.annotation.CplaceFrontendRequestMapping;
import cf.cplace.platform.frontend.rest.dialogs.DialogService;
import cf.cplace.platform.frontend.rest.dialogs.sendlink.dto.SendLinkGetRequest;
import cf.cplace.platform.frontend.rest.dialogs.sendlink.dto.SendLinkPostRequest;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderGetResponse;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderPostRequest;
import cf.cplace.platform.frontend.rest.shared.dto.form.CplaceFormProviderPostResponse;

@ParametersAreNonnullByDefault
@RestController
@CplaceFrontendRequestMapping(path = "/" + PLATFORM_PLUGIN_NAME + "/dialogs/send-link")
public class SendLinkController {
    private final DialogService<SendLinkGetRequest, SendLinkPostRequest> sendLinkService;

    public SendLinkController(DialogService<SendLinkGetRequest, SendLinkPostRequest> sendLinkService) {
        this.sendLinkService = sendLinkService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public CplaceFormProviderGetResponse getFormData(@RequestParam String entityUid, @RequestParam(required = false) String activeTabsInfo) {
        return sendLinkService.getFormData(new SendLinkGetRequest(entityUid, activeTabsInfo));
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public CplaceFormProviderPostResponse postFormData(@RequestBody CplaceFormProviderPostRequest<SendLinkPostRequest> request) {
        return sendLinkService.postFormData(request);
    }
}
