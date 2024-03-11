package cf.cplace.platform.frontend.rest.dialogs.sendlink.dto;

import javax.annotation.ParametersAreNonnullByDefault;

@ParametersAreNonnullByDefault
public record SendLinkPostRequest(String sessionEntityId) {}
