/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.status
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Sync the dependendy status to the capabilities
 */
cplace.setLogName("listener_syncConflicStateToCapabilities");

function main() {
    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    const predecessor = dependency.get("cf.cplace.solution.safe.predecessor");
    const successor = dependency.get("cf.cplace.solution.safe.successor");

    if (!predecessor || !successor) {
        cplace.log("No predecessor or successor found for dependency " + dependency.getName());
        return;
    }
    cplace.log("Updating predecessor");
    updateCapabilityConflictState(dependency, predecessor);
    cplace.log("Updating successor");
    updateCapabilityConflictState(dependency, successor);
}

/**
 * Set the cf.cplace.solution.safe.conflictState parameter of the capabilities that are dependent
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 * @param {Page<"cf.cplace.solution.safe.capability" | "cf.cplace.solution.safe.safeMilestone">} capabilityOrMilestone
 * @returns
 */
function updateCapabilityConflictState(dependency, capabilityOrMilestone) {
    const dependencyStatus = dependency.get("cf.cplace.solution.safe.status");
    /** @type {CplaceTypes["cf.cplace.solution.safe.capability"]["cf.cplace.solution.safe.conflictState"]} */
    let newConflictState;
    const isCapability =
        capabilityOrMilestone?.getBuiltinFeatureValue("customType") === "cf.cplace.solution.safe.capability";

    if (!isCapability) {
        // Only the capability has the conflictState
        return;
    }

    if (dependencyStatus === "25 - conflict") {
        newConflictState = "#25 - conflict";
    } else {
        // No conflict
        newConflictState = null;
    }

    cplace.actions().updatePage(capabilityOrMilestone, {
        customAttributes: {
            "cf.cplace.solution.safe.conflictState": newConflictState,
        },
    });
    capabilityOrMilestone.registerAttributeForRefresh("cf.cplace.solution.safe.conflictState");
}

main();