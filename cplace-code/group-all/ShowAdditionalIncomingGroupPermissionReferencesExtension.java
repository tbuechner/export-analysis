package cf.cplace.platform.frontend.handler.group;

import cf.cplace.platform.commonlib.apiannotation.CplaceApi;
import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.commonlib.pluginextension.PluginExtension;
import cf.cplace.platform.commonlib.template.IgnoreTemplateSubstitutionTestFailure;
import cf.cplace.platform.commonlib.template.TemplateFinder;
import cf.cplace.platform.commonlib.template.TemplateSubstitution;

@CplaceApi
@IgnoreTemplateSubstitutionTestFailure("No concrete subclass in the platform")
public abstract class ShowAdditionalIncomingGroupPermissionReferencesExtension extends PluginExtension {
    public TemplateSubstitution content(final Group group){
        return new TemplateSubstitution() {
            @Override
            public void specifyTemplate(TemplateFinder tf) {
                tf.use(ShowAdditionalIncomingGroupPermissionReferencesExtension.this);
            }

            @Override
            public Object getScopeObject() {
                return group;
            }
        };
    }
}
