/**
 * Raise Hands / Lower Hands action on task
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName('pageaction-task-raise-hands');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const LABEL = {
    RAISE: {
        'en': 'Raise Hand',
        'de': 'Hand heben'
    },
    LOWER: {
        'en': 'Lower Hand',
        'de': 'Hand runter'
    }
}

const RESULT_MESSAGE = {
    RAISE: {
        'en': 'Hand raised',
        'de': 'Hand gehoben'
    },
    LOWER: {
        'en': 'Hand lowered',
        'de': 'Hand runter genommen'
    }
}

const ICON = {
    RAISE: 'fa-hand-stop-o',
    LOWER: 'fa-check'
}


const TASK = {
    TYPE: 'cf.cplace.digitalBoard.task',
    ATTR: {
        TITLE: 'cf.cplace.digitalBoard.title',
        DESCRIPTION: 'cf.cplace.digitalBoard.description',
        RESPONSIBLE: 'cf.cplace.digitalBoard.responsible',
        BOARD: 'cf.cplace.digitalBoard.board',
        SHARED_BOARDS: 'cf.cplace.digitalBoard.shareToOtherBoards',
        PRIORITY: 'cf.cplace.digitalBoard.priority',
        STATUS: 'cf.cplace.digitalBoard.status',
        IS_PRIVATE: 'cf.cplace.digitalBoard.privateTask',
        UPDATE_PERMISSIONS: 'cf.cplace.digitalBoard.updatePermissions',
        ESCALATE_BOARD: 'cf.cplace.digitalBoard.escalateToBoard',
        ESCALATION_LEVEL: 'cf.cplace.digitalBoard.escalationLevel',
    },
    STATUS: {
        OPEN: 'open',
        IN_PROGRESS: 'in progress',
        IN_REVIEW: 'in review',
        DONE: 'done',
        ARCHIVED: 'archived'
    },
    ESCALATION_LEVEL: {
        NONE: '#15 - none',
        HAND_RAISED: '#25 - handRaised',
        ESCALATED: '#35 - escalated',
    }
}



function checkAccess() {
    return true;
}

function label() {
    return (page.get(TASK.ATTR.ESCALATION_LEVEL) === TASK.ESCALATION_LEVEL.NONE) ?
        LABEL.RAISE : LABEL.LOWER
}

function icon() {
    return (page.get(TASK.ATTR.ESCALATION_LEVEL) === TASK.ESCALATION_LEVEL.NONE) ?
        ICON.RAISE : ICON.LOWER
}

function call() {
    return doBusinessAction(page)
}

function main(){
return {
    checkAccess,
    label,
    icon,
    call
}
}

return main();

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

/**
 * Do the business action
 * 
 * @param {Page} page 
 * @returns {Object}
 */
function doBusinessAction(page) {
    let result = (page.get(TASK.ATTR.ESCALATION_LEVEL) === TASK.ESCALATION_LEVEL.NONE) ?
        raiseHand(page) : lowerHand(page)
    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: result // Override the success message to be displayed to the user or provide error message.
    }
}

function raiseHand(task) {
    let customAttributes = {};
    customAttributes[TASK.ATTR.ESCALATION_LEVEL] = TASK.ESCALATION_LEVEL.HAND_RAISED;
    updatePage(task, customAttributes);
    return RESULT_MESSAGE.RAISE
}

function lowerHand(task) {
    let customAttributes = {};
    customAttributes[TASK.ATTR.ESCALATION_LEVEL] = TASK.ESCALATION_LEVEL.NONE;
    updatePage(task, customAttributes);
    return RESULT_MESSAGE.LOWER
}



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



//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//


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