/*
 * Copyright 2023, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupInGroupMatrix.state;

import javax.annotation.ParametersAreNonnullByDefault;

import cf.cplace.platform.core.application.principal.Principal;

@ParametersAreNonnullByDefault
public class Node {
    public final String id;

    public final String name;

    public final String url;

    public Node(Principal p) {
        id = p.getId();
        name = p.getName();
        url = p.getUrl();
    }
}
