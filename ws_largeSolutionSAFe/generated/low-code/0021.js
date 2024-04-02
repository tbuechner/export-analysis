/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.plannedStartA, cf.cplace.solution.safe.dateA, cf.cplace.solution.safe.plannedEndB, cf.cplace.solution.safe.dateB, cf.cplace.solution.safe.type
 * @author Anja Priglmeir
 * @version 1.0
 * @description setting conflict state on capabilities
 */

cplace.setLogName("listener_setConflictToCapabilities");

const DEBUG = true;

const DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        START_DATE_A: "cf.cplace.solution.safe.plannedStartA",
        DATE_A: "cf.cplace.solution.safe.dateA",
        B: "cf.cplace.solution.safe.predecessor",
        END_DATE_B: "cf.cplace.solution.safe.plannedEndB",
        DATE_B: "cf.cplace.solution.safe.dateB",
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

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        CONFLICT_STATE: "cf.cplace.solution.safe.conflictState"
    },
    ENUM: {
        CONFLICT: '#25 - conflict'
    }
});

function main() {

    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    const a = dependency.get(DEPENDENCY.ATTR.A);
    const b = dependency.get(DEPENDENCY.ATTR.B);
    const status = dependency.get(DEPENDENCY.ATTR.STATUS);
    
    /*//case1: a or b changed; re-calculation only necessary if dependency has conflict
    if (changeEvent.didChange(DEPENDENCY.ATTR.A) && status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
        //tbd
        const old_a = '';
        checkForConflicts(old_a);
    }

    if (changeEvent.didChange(DEPENDENCY.ATTR.B) && status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
        //tbd
        const old_b = '';
        checkForConflicts(old_b);
    }*/

    //case2: dependency status changed
    if (changeEvent.didChange(DEPENDENCY.ATTR.STATUS)) {
        if (a.getBuiltinFeatureValue('customType') === CAPABILITY.TYPE) {
            checkForConflicts(a);
        }

        if (b.getBuiltinFeatureValue('customType') === CAPABILITY.TYPE) {
            checkForConflicts(b);
        }
    }
}

/**
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 */
function checkForConflicts(capability) {
    const dependenciesAsA = capability.getIncomingPages(DEPENDENCY.TYPE, DEPENDENCY.ATTR.A);
    const dependenciesAsB = capability.getIncomingPages(DEPENDENCY.TYPE, DEPENDENCY.ATTR.B);

    let conflictValue = null;

    cplace.each(dependenciesAsA, dependency => {
        const status = dependency.get(DEPENDENCY.ATTR.STATUS);
        if (status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
            conflictValue = CAPABILITY.ENUM.CONFLICT;
        }
    })
    cplace.each(dependenciesAsB, dependency => {
        const status = dependency.get(DEPENDENCY.ATTR.STATUS);
        if (status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
            conflictValue = CAPABILITY.ENUM.CONFLICT;
        }
    })
    cplace.actions().updatePage(capability, {
        customAttributes: {
            [CAPABILITY.ATTR.CONFLICT_STATE]: conflictValue
        }
    })

    capability.registerAttributeForRefresh(CAPABILITY.ATTR.CONFLICT_STATE);
}


main();