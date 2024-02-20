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

const TYPE_KEY_RESULT = {
    TYPE: 'cf.cplace.solution.okr.keyResult',
    ATTR: {
        TITLE: 'cf.cplace.solution.okr.title',
        PROGRESS: 'cf.cplace.solution.okr.progress',
        NUMBER: 'cf.cplace.solution.okr.number',
        ORGANIZATIONAL_UNIT: 'cf.cplace.solution.okr.organizationalUnit',
        CYCLE: 'cf.cplace.solution.okr.cycle',
    },
}

const TYPE_PROGRESS = {
    TYPE: 'cf.cplace.solution.okr.progress',
    ATTR: {
        KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
        RESULT: 'cf.cplace.solution.okr.result',
        PROBLEM: 'cf.cplace.solution.okr.problem',
        LESSONS_LEARNED: 'cf.cplace.solution.okr.lessonsLearned',
        NEXT_STEPS: 'cf.cplace.solution.okr.nextSteps',
        CYCLE: 'cf.cplace.solution.okr.cycle',
        OBJECTIVE: 'cf.cplace.solution.okr.objective',
        SMALL_SUPPORT: 'cf.cplace.solution.okr.smallSupport',
        BIG_SUPPORT: 'cf.cplace.solution.okr.bigSupport',
        PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator',
        CONFIDENCE_LEVEL: 'cf.cplace.solution.okr.confidenceLevel',
        GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
        LAST_UPDATE: 'cf.cplace.solution.okr.lastUpdate',
        SET: 'cf.cplace.solution.okr.set',
    },
}

/**
 * ====================
 * INITIALIZATION STAGE
 * ====================
 */
const page = changeEvent.getEntity();

const keyResultProgress = page.get(TYPE_KEY_RESULT.ATTR.PROGRESS);
const currentUser = cplace.utils().getCurrentUser();


// Lege Progress Objekt an
if (pageIsNew() || keyResultProgress === null) {

    // ca['cf.cplace.solution.okr.keyResult'] = page;
    cplace.log('page: '+page);
    let newProgress = cplace.actions().createPage( {
        customType: TYPE_PROGRESS.TYPE,
        space: page.getSpaceId(),
        customAttributes: {
            [TYPE_PROGRESS.ATTR.KEY_RESULT] : page
        },
    }, {
        setGeneratedName: true
    });

    cplace.log('created page: ' + newProgress);

    //Ändere Progress von Key Result auf neues Objekt
    cplace.actions().updatePage(page, {
        customAttributes: {
            [TYPE_KEY_RESULT.ATTR.PROGRESS]: newProgress
        }
    });
    page.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.PROGRESS);
    cplace.log('updated page: ' + page);
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