package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.MembershipVisibility;
import cf.cplace.platform.core.server.request.Parameters;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.core.frontend.handler.Handler;
import cf.cplace.platform.core.frontend.handler.station.template.JsonPage;
import cf.cplace.platform.core.frontend.handler.station.Station;
import cf.cplace.platform.commonlib.template.ConditionalSubstitution;
import cf.cplace.platform.commonlib.template.SimpleListSubstitution;
import cf.cplace.platform.commonlib.template.Template;

public class LoadGroupChildrenHandler extends Handler {

    final Station SHOW = new JsonPage() {
        @Override
        public void putSubstitutions(Template template) {
            template.put("membershipsAreVisible", ConditionalSubstitution.testing(() -> {
                if (group.getEntityPermissions().mayEdit()) {
                    return true;
                } else if (group._membershipVisibility().isEquals(MembershipVisibility.thisGroup)) {
                    return group.isActiveMemberInThisGroup(SessionLocal.getUser());
                } else {
                    return true;
                }
            }));
            template.put("children", SimpleListSubstitution.forItems(() ->
                    group.getActiveMembersSortedByNameIgnoringMembershipReadAccess()));
        }
    };

    Group group;

    @Override
    protected void checkAccess() {
        group = Group.SCHEMA.getEntityNotNull(Parameters.getString("id"));
    }

    @Override
    protected Station doBusinessLogic() {
        return SHOW;
    }
}
