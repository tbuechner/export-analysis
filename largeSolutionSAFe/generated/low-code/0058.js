/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#65 - Deploying";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()