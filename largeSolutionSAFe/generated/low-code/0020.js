/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.plannedStartA, cf.cplace.solution.safe.dateA, cf.cplace.solution.safe.plannedEndB, cf.cplace.solution.safe.dateB, cf.cplace.solution.safe.type
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Conflict recognition
 */

cplace.setLogName("listener_conflictRecognition");

const DEBUG = true;

const DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        START_DATE_A: "cf.cplace.solution.safe.plannedStartA",
        B: "cf.cplace.solution.safe.predecessor",
        END_DATE_B: "cf.cplace.solution.safe.plannedEndB",
        STATUS: "cf.cplace.solution.safe.status",
        TYPE: "cf.cplace.solution.safe.type",
    },
    ENUM: {
        TYPE: {
            BLOCKED_BY: "blocked by",
            RELATED_TO: "related to",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            CONFLICT_RESOLVED: "35 - resolved",
        },
    },
});

function main() {
    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    // Check if dependency is blocking
    if (dependency.get(DEPENDENCY.ATTR.TYPE) !== DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
        DEBUG && cplace.log("No blocked by");
        
        // If the status is set to "related to" and the dependency type is still "25 - conflict" we should set the status to "15 - identified"
        if(dependency.get(DEPENDENCY.ATTR.STATUS) !== DEPENDENCY.ENUM.STATUS.CONFLICT){
            DEBUG && cplace.log("No conflict status");
            return
        }
        cplace.actions().updatePage(dependency, {
            customAttributes: {
                [DEPENDENCY.ATTR.STATUS]: DEPENDENCY.ENUM.STATUS.IDENTIFIED,
            },
        });
        dependency.registerAttributeForRefresh(DEPENDENCY.ATTR.STATUS);
        return;
    }

    if (!isConflict(dependency)) {
        DEBUG && cplace.log("No conflict");
        return;
    }
    // Dependency is a conflict
    cplace.actions().updatePage(dependency, {
        customAttributes: {
            [DEPENDENCY.ATTR.STATUS]: DEPENDENCY.ENUM.STATUS.CONFLICT,
        },
    });
    dependency.registerAttributeForRefresh(DEPENDENCY.ATTR.STATUS);
}
/**
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 */
function isConflict(dependency) {
    const dateA = dependency.get(DEPENDENCY.ATTR.START_DATE_A);

    const dateB = dependency.get(DEPENDENCY.ATTR.END_DATE_B);

    if (dateA && dateB && dateB.isAfter(dateA)) {
        return true;
    }
    return false;
}


main();