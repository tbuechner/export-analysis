/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.programIncrement
 * @attribute cf.cplace.solution.safe.title
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Automatically set the predecessor of a Program Increment upon creation
 */

cplace.setLogName("listener_setPredecessorOnCreation");

const DEBUG = true;

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor",
    },
    ENUM: {
        PERIOD_STATUS: {
            DONE: "#15 - done",
            ACTIVE: "#25 - active",
        },
    },
});

function main() {
    if (!changeEvent.isNew()) {
        return;
    }
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programmIncrement = changeEvent.getEntity();

    const predecessor = getPreviousPiByDate(programmIncrement);

    if (!predecessor) {
        DEBUG && cplace.log("No predecessor found");
        return;
    }

    DEBUG && cplace.log("Predecessor: " + predecessor);

    cplace.actions().updatePage(programmIncrement, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PREDECESSOR]: predecessor,
        },
    });
    programmIncrement.registerAttributeForRefresh(PROGRAMM_INCREMENT.ATTR.PREDECESSOR);
}

/**
 * Get the previous PI by date
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getPreviousPiByDate(programIncrement) {
    const solution = programIncrement.get("cf.cplace.solution.safe.solution");
    if (!solution) {
        return null;
    }
    const startDate = programIncrement.get(PROGRAMM_INCREMENT.ATTR.START_DATE);
    if (!startDate) {
        return null;
    }

    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const pisOfSolution = Array.from(
        solution.getIncomingPages(PROGRAMM_INCREMENT.TYPE, PROGRAMM_INCREMENT.ATTR.SOLUTION)
    );

    const piDateMap = {};
    pisOfSolution.forEach((pi) => {
        if (pi.getId() == programIncrement.getId()) {
            return;
        }
        piDateMap[pi.getId()] = { date: pi.get(PROGRAMM_INCREMENT.ATTR.START_DATE), page: pi };
    });

    let closestDateDiff = Infinity;
    let closestPageId = null;

    // Find the closest previous PI to the startDate of the programmIncrement
    for (const [pageId, data] of Object.entries(piDateMap)) {
        const pageDate = data.date;
        const dateDiff = Days.daysBetween(pageDate.withTimeAtStartOfDay(), startDate.withTimeAtStartOfDay()).getDays();

        if (dateDiff > 0 && dateDiff < closestDateDiff) {
            closestDateDiff = dateDiff;
            closestPageId = pageId;
        }
    }
    if (!closestPageId) {
        return null;
    }

    return piDateMap[closestPageId].page;
}

main();