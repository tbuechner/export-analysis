/**
 * LOWCODE BUTTON
 * @customType cf.cplace.solution.safe.solution
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Set previous current and next pi
 */

cplace.setLogName("lowcodebutton_setAsCurrentPi");

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
    /** @type {Page<'cf.cplace.solution.safe.solution'> | null} */
    const solution = Iterables.getFirst(pages, null);
    if (!solution) {
        DEBUG && cplace.log("No solution provided");
        return {
            message: {
                de: "Keine Solution in der Suche gefunden",
                en: "No solution provided via Search",
            },
        };
    }

    const currentPi = solution.get("cf.cplace.solution.safe.currentPi");
    if (!currentPi) {
        DEBUG && cplace.log("No current PI");
        log.logText({
            de: "Kein aktuelles PI gesetzt",
            en: "No current PI",
        });
        return;
    }

    const newPreviousPi = currentPi;
    let newCurrentPi = solution.get("cf.cplace.solution.safe.nextPi");

    if (!newCurrentPi) {
        // If we don't have a next PI specified yet on the solution, we try to get the next PI where the predecessor is set to the current PI (newPreviousPi)
        newCurrentPi = getNextPi(newPreviousPi);
        if (!newCurrentPi) {
            DEBUG && cplace.log("No next PI defined");
            log.logText({
                de: "Kein nächstes PI definiert",
                en: "No next PI defined",
            });
            return;
        }
    }
    const newNextPi = getNextPi(newCurrentPi);

    if (!newNextPi) {
        DEBUG && cplace.log("No next PI defined");
        log.logText({
            de: "Kein übernächstes PI definiert",
            en: "No PI defined after next PI",
        });
        return;
    }
    cplace.log(`New next PI: ${newNextPi.getName()}`);

    newState["cf.cplace.solution.safe.previousPi"] = newPreviousPi;
    newState["cf.cplace.solution.safe.currentPi"] = newCurrentPi;
    newState["cf.cplace.solution.safe.nextPi"] = newNextPi;

    cplace.actions().updatePage(solution, {
        customAttributes: newState,
    });

    // Set new previous PI to done
    cplace.actions().updatePage(currentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.DONE,
        },
    });

    // Set new current PI to active
    cplace.actions().updatePage(newCurrentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.ACTIVE,
        },
    });
    cplace.actions().refresh();

    return {
        message: {
            de: `Das nächste PI wurde erfolgreich auf ${newCurrentPi.getName()} gesetzt`,
            en: `Successfully set the current PI to ${newCurrentPi.getName()}`,
        },
    };
}

/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getNextPi(programIncrement) {
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const results = Array.from(
        programIncrement.getIncomingPages(PROGRAMM_INCREMENT.TYPE, PROGRAMM_INCREMENT.ATTR.PREDECESSOR)
    );

    if (results.length > 1) {
        log.logText({
            de: `Es gibt mehr als ein PI (${results
                .map((pi) => pi.getName())
                .join(", ")}) bei dem der Vorgänger ${programIncrement.getName()} ist`,
            en: `There is more than one PI (${results
                .map((pi) => pi.getName())
                .join(", ")}) where the predecessor is: ${programIncrement.getName()}`,
        });
        return null;
    }
    if (results.length === 0) {
        return null;
    }
    return results[0];
}


return { checkAccess, call };