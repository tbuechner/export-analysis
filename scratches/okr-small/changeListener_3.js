/**
 * Erstelle Progress Seite beim anlegen eines Key Results
 * Watched Attributes: 'cf.cplace.solution.okr.title'
 * @LukasScheiring
 */

/**
 * ======================
 * LOG AND DEBUG SETTINGS
 * ======================
 */
const DEBUG = true;

/**
 * Hint: set a declarative name for all of your logs
 */
cplace.setLogName("Create Progress Page");

/**
 * ===================
 * CONFIGURATION STAGE
 * ===================
 *
 */

const TYPES = {
    OBJECTIVE: {
        TYPE: 'cf.cplace.solution.okr.objective',
        ATTR: {
            TITLE: 'cf.cplace.solution.okr.title',
            ACCOMPLISHED: 'cf.cplace.solution.okr.accomplished',
            CYCLE: 'cf.cplace.solution.okr.cycle',
            NUMBER: 'cf.cplace.solution.okr.number',
        },
    },
    CYCLE: {
        TYPE: 'cf.cplace.solution.okr.cycle',
        ATTR: {
            YEAR: 'cf.cplace.solution.okr.year',
            QUARTER: 'cf.cplace.solution.okr.quarter',
            STATUS: 'cf.cplace.solution.okr.status',
            CYCLES_DASHBOARD: 'cf.cplace.solution.okr.cyclesDashboard',
            START: 'cf.cplace.solution.okr.start',
            END: 'cf.cplace.solution.okr.end',
            STATUS_FOR_NAME_GENERATION_PATTERN: 'cf.cplace.solution.okr.statusForNameGenerationPattern',
        },
    },
    KEY_RESULT: {
        TYPE: 'cf.cplace.solution.okr.keyResult',
        ATTR: {
            TITLE: 'cf.cplace.solution.okr.title',
            PROGRESS: 'cf.cplace.solution.okr.progress',
            GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
            CONFIDENCE_LEVEL: 'cf.cplace.solution.okr.confidenceLevel',
            PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator',
            BIG_SUPPORT: 'cf.cplace.solution.okr.bigSupport',
            SMALL_SUPPORT: 'cf.cplace.solution.okr.smallSupport',
            GIVE_BIG_SUPPORT: 'cf.cplace.solution.okr.giveBigSupport',
            RECEIVE_BIG_SUPPORT: 'cf.cplace.solution.okr.receiveBigSupport',
            OBJECTIVE: 'cf.cplace.solution.okr.objective',
            SET: 'cf.cplace.solution.okr.set',
            CYCLE: 'cf.cplace.solution.okr.cycle',
            ORGANIZATIONAL_UNIT: 'cf.cplace.solution.okr.organizationalUnit',
            LAST_UPDATE: 'cf.cplace.solution.okr.lastUpdate',
            NUMBER: 'cf.cplace.solution.okr.number',
        },
    },
}

/**
 * ====================
 * INITIALIZATION STAGE
 * ====================
 */
const page = changeEvent.getEntity();

const keyResultProgress = page.get(TYPES.KEY_RESULT.ATTR.PROGRESS);
const currentUser = cplace.utils().getCurrentUser();


// Lege Progress Objekt an
if (pageIsNew() || keyResultProgress === null) {
    let ca = {
        'cf.cplace.solution.okr.keyResult' : page
    };

    // ca['cf.cplace.solution.okr.keyResult'] = page;
    cplace.log('page'+page);
    let newProgress = cplace.actions().createPage( {
        customType: TYPES.PROGRESS.TYPE,
        space: page.getSpaceId(),
        customAttributes: ca,
    }, {
        setGeneratedName: true
    });

    //Ändere Progress von Key Result auf neues Objekt
    let ca2 = {};
    ca2[TYPES.KEY_RESULT.ATTR.PROGRESS] = newProgress;
    cplace.actions().updatePage(page, {
        customAttributes: ca2
    });
    page.registerAttributeForRefresh(TYPES.KEY_RESULT.ATTR.PROGRESS);
}
return;


/**
 * ==================
 * BUSINESS FUNCTIONS
 * ==================
 */

//Checke ob Seite neu angelegt wurde
function pageIsNew () {
    let bool = changeEvent.isNew();
    return bool;
};



/**
 * ================
 * HELPER FUNCTIONS
 * ================
 */

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return
    }
    let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;

    cplace.log(logOutput);
}