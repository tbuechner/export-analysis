/**
 * LOWCODE BUTTON
 * @customType cf.cplace.solution.safe.solution
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Set previous current and next pi
 */

cplace.setLogName("lowcodebutton_setAsCurrentPi");

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
    },
    ENUM: {
        PERIOD_STATUS: {
            DONE: "#15 - done",
            ACTIVE: "#25 - active",
        },
    },
});

const SOLUTION = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.solution",
});

function checkAccess() {
    return true;
}

function call() {
    const newState = {
        "cf.cplace.solution.safe.previousPi": {},
        "cf.cplace.solution.safe.currentPi": {},
        "cf.cplace.solution.safe.nextPi": {},
    };

    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programIncrement = embeddingPage;
    const solution = programIncrement.get(PROGRAMM_INCREMENT.ATTR.SOLUTION);

    if (!solution) {
        return "No Solution";
    }
    const currentPi = solution.get("cf.cplace.solution.safe.currentPi");

    if (!currentPi) {
        return "No current PI";
    }

    newState["cf.cplace.solution.safe.previousPi"] = currentPi;
    newState["cf.cplace.solution.safe.currentPi"] = programIncrement;
    const nextPi = getNextPi(programIncrement);

    if (!nextPi) {
        cplace.error("No next PI");
        return;
    }

    cplace.log(`Next PI: ${nextPi}`);
    newState["cf.cplace.solution.safe.nextPi"] = nextPi;

    cplace.actions().updatePage(solution, {
        customAttributes: newState,
    });

    cplace.actions().updatePage(currentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.DONE,
        },
    });
    cplace.actions().updatePage(programIncrement, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.ACTIVE,
        },
    });
    programIncrement.registerAttributeForRefresh(PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS);
}

/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getNextPi(programIncrement) {
    const endDate = programIncrement.get(PROGRAMM_INCREMENT.ATTR.END_DATE);
    if (!endDate) {
        return null;
    }
    const result = new Search()
        .add(Filters.type(PROGRAMM_INCREMENT.TYPE))
        .add(Filters.customAttribute(PROGRAMM_INCREMENT.ATTR.START_DATE).gt(endDate))
        .addCustomFieldSort(PROGRAMM_INCREMENT.ATTR.START_DATE, false)
        .findAllPages();

    return Iterables.getFirst(result, null);
}

return { checkAccess, call };