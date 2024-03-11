package cf.cplace.platform.frontend.rest.dialogs.sendlink.dto;

import javax.annotation.Nullable;
import javax.annotation.ParametersAreNonnullByDefault;

@ParametersAreNonnullByDefault
public record SendLinkGetRequest(String entityUid, @Nullable String activeTabInfo) {
}
