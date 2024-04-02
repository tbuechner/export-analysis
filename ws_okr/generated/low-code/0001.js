/// <reference path="../typeDefinitions/globals.d.ts" />

/**
 * Description : checks the Current Cycle for the key results 
 * @author 
 */


//14-14
//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//

/**
 * Set to false to suspend logging
 * @type {Boolean}
 */
const DEBUG = true;

/**
 * Set to false, to disable this page action
 * @type {Boolean}
 */
const ENABLED = true;

/**
* Get millisecond starting time of the script
* @type {Number}
*/
const START_TIME = new Date().getTime()

/** @type {Number} */
let LAST_TIME = START_TIME;

/**
 * Hint: set a declarative name for all of your logs
 */
cplace.setLogName('pageaction-task-');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

// Everything older than this will be flaged als "outdated"
const THRESHOLD_DAYS = 14;

const ACTIONS = {
    DEFAULT: 'DEFAULT',
}
//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

/**
 * TODO check which action should be performed.
 * For instance if you want a toggle like archive / restore, you can define both actions in one page action easily.
 */
const ACTION = ACTIONS.DEFAULT;

const RESULT_MESSAGE = {
    DEFAULT: {
        'de': 'Aktion erfolgreich ausgeführt',
        'en': 'Action successfull',
    }
}

function main() {
    return { checkAccess, call }
}

function checkAccess() {
    try {
        return ENABLED ? isActionAllowed(page) : false
    } catch (e) {
        cplace.error(e)
        return false;
    }
}

function call() {
    try {
        return doBusinessAction(page)
    } catch (e) {
        cplace.error(e)
        if (DEBUG) {
            throw e
        }

        return {
            success: false,
            message: e
        }
    }
}

return main();
//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//


/**
 * Return true if the action is allowed and visible
 * @param {Page} page 
 * @returns {Boolean}
 */
function isActionAllowed(page) {
    let status = page.get('cf.cplace.solution.okr.status');

    return status == '#25 Current';
}

/**
 * Do the business action
 * 
 * @param {Page} page 
 * @returns {Object}
 */
function doBusinessAction(page) {
    timeSinceStart('start')

    let allResults = page.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.cycle');

    allResults.forEach(function (result) {
        log('resulting key results :'+result);
        checkAndUpdatePage(result);
    });

    timeSinceStart('final');
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: RESULT_MESSAGE[ACTION]
    }
}

function checkAndUpdatePage(page) {
    let lastModified = page.get('cf.cplace.solution.okr.lastUpdate');
    let now = new DateTime();

    let refDate = now.minusDays(THRESHOLD_DAYS);

    if (lastModified && refDate.isAfter(lastModified)) {
        updatePage(page, {
            'cf.cplace.solution.okr.progressIndicator': '#45 outdated'
        });
    }
}


//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//
/*
*Update the cplace page whenever there is change in attributes
* @param {Page<T>} page
* @param {(keyof CplaceTypes[T])[]} attributes
*/
function updatePage(page, customAttributes) {
    let key = null;
    for (key in customAttributes) {
        if (customAttributes.hasOwnProperty(key)) {
            page.registerAttributeForRefresh(key)
        }
    }
    return cplace.actions().updatePage(page, {
        customAttributes: customAttributes,
    }
        , {
            setGeneratedName: true
        }
    );
}

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


function timeSinceStart(msg) {
    if (!DEBUG) {
        return
    }
    let now = new Date().getTime();
    cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
    LAST_TIME = now;
}