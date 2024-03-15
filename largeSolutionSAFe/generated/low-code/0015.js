/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.capability
 * @attribute cf.cplace.solution.safe.features
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Sets the cf.cplace.solution.safe.program attribute of a capability to the programms, which work on features of the capability.
 */
const FEATURE = {
    TYPE: "cf.cplace.solution.safe.feature",
    ATTR: {
        CAPABILITY: "cf.cplace.solution.safe.capability",
    },
};

/**
 * Get all features of a capability and store a unique list of the features Programms on the capability
 */
function main() {
    /** @type {Page<'cf.cplace.solution.safe.capability'>} */
    const capability = changeEvent.getEntity();
    /** @type {Page<'cf.cplace.solution.safe.feature'>[]} */
    // @ts-ignore
    const features = capability.get("cf.cplace.solution.safe.features")

    const programmIds = features.map((feature) => feature.get("cf.cplace.solution.safe.program")?.getId());
    const uniqueProgrammIdeas = [...new Set(programmIds)];
    cplace.log(`Capability ${capability.getName()} unique programms: ${uniqueProgrammIdeas}`);
    cplace.actions().updatePage(capability, {
        customAttributes: {
            // @ts-ignore
            "cf.cplace.solution.safe.program": uniqueProgrammIdeas,
        },
    });
  capability.registerAttributeForRefresh("cf.cplace.solution.safe.program");
}
main();