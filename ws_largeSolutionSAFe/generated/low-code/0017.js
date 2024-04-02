/**
 * VALIDATOR
 * @customType cf.cplace.solution.safe.capability
 * @attribute cf.cplace.solution.safe.state
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.1
 * @description Checks if a state transition is allowed (a capability has to go through every state one-by-one, jumping, e.g., from "Funnel" to "Done" is not allowed)
 */

const DEBUG = false;

const SOLUTION = {
    TYPE: "cf.cplace.solution.safe.solution",
};

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});
/** Mapping of previous and next state */
const STATUS_MAP = /** @type {const} */ ({
    "#10 - Draft": "#15 - Funnel",
    "#15 - Funnel": "#25 - Analyzing",
    "#25 - Analyzing": "#35 - Backlog",
    "#35 - Backlog": "#45 - Implementing",
    "#45 - Implementing": "#55 - Validating",
    "#55 - Validating": "#65 - Deploying",
    "#65 - Deploying": "#75 - Releasing",
    "#75 - Releasing": "#85 - Done",
});

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

/**
 *
 * @param {Page<'cf.cplace.solution.safe.capability'>} page
 * @returns
 */
function checkIfTransitionIsAllowed(page) {
    /**
     * don't run on view only
     */
    if (!!page.getBuiltinFeatureValue("creator") && page.getId() === page.getRealId()) {
        return;
    }

    const newStatus = page.get(CAPABILITY.ATTR.STATE);

    DEBUG && cplace.log(page.getBuiltinFeatureValue("creator"));

    if (!page.getBuiltinFeatureValue("creator")) {
        // If page is created, only the draft state is allowed
        DEBUG && cplace.log("creation dialog: " + newStatus);
        if (newStatus === "#10 - Draft") {
            return;
        }
        return messages.get("creation-state-not-allowed");
    }

    DEBUG && cplace.log("New Status: " + newStatus);

    // Get the real page (with previous values)
    const search = new Search();
    search.add(Filters.uid(page.getRealId()));
    const realPage = Iterables.getFirst(search.findAllPages(), null);

    if (realPage === null) {
        return;
    }
    const currentStatus = realPage.get(CAPABILITY.ATTR.STATE);
    DEBUG && cplace.log(currentStatus);

    /**
     * Status hasn't changed
     */
    if (currentStatus === newStatus) {
        return;
    }
    if (newStatus === "#85 - Done") {
        return;
    }
    // If the new status is not defined as successor in the STATUS MAP, then return an error
    if (newStatus !== STATUS_MAP[currentStatus]) {
        return messages.get("statechange-not-allowed");
    }
    /** @type {number|null} */
    const wipLimit = getSolution(page.getSpaceId()).get(WIP_MAP[newStatus]);

    if (wipLimit === null) {
        // No WIP limit set
        return;
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(newStatus);
    if (wipLimit - numberOfCapabilities <= 0) {
        return messages.get("statechange-not-allowed");
    }
}

/**
 *
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(state) {
    const numberOfCapabilities = new Search()
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}

return checkIfTransitionIsAllowed(page);