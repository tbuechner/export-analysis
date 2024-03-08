/*
 * Copyright 2015, collaboration Factory AG. All rights reserved.
 */
package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.Principal;
import cf.cplace.platform.core.application.principal.SystemGroup;
import cf.cplace.platform.commonlib.template.PrintSubstitution;
import cf.cplace.platform.commonlib.template.SubstitutionGenerator;
import cf.cplace.platform.commonlib.template.Template;

public abstract class GroupsSubstitutions extends SubstitutionGenerator {

    /**
     * might be a {@link SystemGroup}!
     */
    protected abstract Principal getCurrent();

    @Override
    public void putSubstitutions(Template template) {
        template.put("activeMembers", PrintSubstitution.printing(() -> {
            Principal current = getCurrent();
            if (current instanceof Group) {
                return Integer.toString(((Group) current).getActiveMembershipCount());
            } else {
                return "";
            }
        }));
        template.put("pendingRequests", PrintSubstitution.printing(() -> {
            Principal current = getCurrent();
            if (current instanceof Group) {
                return Integer.toString(((Group) current).getPendingRequestsCount());
            } else {
                return "";
            }
        }));
    }
}
