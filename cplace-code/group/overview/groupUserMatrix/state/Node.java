/*
 * Copyright 2016, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.state;

import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.application.principal.Principal;

public class Node {
    public final String id;

    public final String name;

    public final String url;

    public boolean active = false;

    public Node(Principal p) {
        id = p.getId();
        name = p.getName();
        url = p.getUrl();
        if (p instanceof Person person) {
            active = person.isActiveAccount();
        }
    }
}
