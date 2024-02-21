/*
*Changelistener
*Type:Cycle
*Triggering attribute: Status
*Sets the status for the name generation pattern 
*Author :Laxmi Udapudi
*/

cplace.setLogName('Set_the_Current_Status')
function main() {
    let cycle = changeEvent.getEntity();
    let status = cycle.get('cf.cplace.solution.okr.status');

    if (status == '#25 Current') {
        updatePage(cycle, {
            'cf.cplace.solution.okr.statusForNameGenerationPattern': 'Current'
        })
    } else {
        updatePage(cycle, {
            'cf.cplace.solution.okr.statusForNameGenerationPattern': undefined
        })

    }
}

main();


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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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
 
 const ATTRIBUTES = {
     KEY_RESULT: {
         TYPE: 'cf.cplace.solution.okr.keyResult',
         ATTR: {
             TITLE: 'cf.cplace.solution.okr.title',
             PROGRESS: 'cf.cplace.solution.okr.progress',
         },
     },
     PROGRESS: {
         TYPE: 'cf.cplace.solution.okr.progress',
         ATTR: {
            KEY_RESULT: 'cf.cplace.solution.okr.keyResult'
         }
     }

 }
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 const page = changeEvent.getEntity();
 
 const keyResultProgress = page.get(ATTRIBUTES.KEY_RESULT.ATTR.PROGRESS);
 const currentUser = cplace.utils().getCurrentUser();
 

 // Lege Progress Objekt an
 if (pageIsNew() || keyResultProgress === null) {
    let ca = {
      'cf.cplace.solution.okr.keyResult' : page
    };
   
   // ca['cf.cplace.solution.okr.keyResult'] = page;
   cplace.log('page'+page);
   cplace.log('ca'+JSON.stringify(ca));
    let newProgress = cplace.actions().createPage( {
        customType: ATTRIBUTES.PROGRESS.TYPE,
        space: page.getSpaceId(),
        customAttributes: ca,
        }, {
        setGeneratedName: true
    });
    
    //Ändere Progress von Key Result auf neues Objekt
    let ca2 = {};
    ca2[ATTRIBUTES.KEY_RESULT.ATTR.PROGRESS] = newProgress;
    cplace.actions().updatePage(page, {
        customAttributes: ca2
    });
    page.registerAttributeForRefresh(ATTRIBUTES.KEY_RESULT.ATTR.PROGRESS);
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

//------------------------------------------------------------------------------------------------------

const KEY_RESULT = {
  TYPE : 'cf.cplace.solution.okr.keyResult',
  ATTR :{
    PROGRESS : 'cf.cplace.solution.okr.progress',
    CONFIDENCE_LEVEL :'cf.cplace.solution.okr.confidenceLevel',
  }
}

const PROGRESS = {
  TYPE : 'cf.cplace.solution.okr.progress',
  ATTR : {
    KEY_RESULT:'cf.cplace.solution.okr.keyResult',
    CONFIDENCE_LEVEL:'cf.cplace.solution.okr.confidenceLevel',
  }
}


function main(){
  let page = changeEvent.getEntity();
  let confidenceLevel = page.get(KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
  let progress = page.get(KEY_RESULT.ATTR.PROGRESS);
  if (!isSet(progress) || !isSet(confidenceLevel)) {
    // Nothing to sync with
    return;
  }
  let processConfidence = progress.get(PROGRESS.ATTR.CONFIDENCE_LEVEL);
  if (confidenceLevel === processConfidence)  {
    return;
  }
  cplace.actions().updatePage(progress, {
    customAttributes: {
      'cf.cplace.solution.okr.confidenceLevel': confidenceLevel
    }
  }
                             );
  progress.registerAttributeForRefresh('cf.cplace.solution.okr.confidenceLevel');
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
}

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Keyresult
*Triggering attributes:
*Description: whenever the confidencelevel o the keyResult is changed this changelistener updates the same in progress 
*Author: Laxmi udapudi
*/
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}

cplace.setLogName('sync_gf_on_progress')

function main() {

  let keyresult = changeEvent.getEntity();
  let gradingForecast = keyresult.get(KEY_RESULT.ATTR.GRADING_FORECAST);
  let progress = keyresult.get(KEY_RESULT.ATTR.PROGRESS);
  let processGrading = progress.get(PROGRESS.ATTR.GRADING_FORECAST);

  if (!isSet(progress) || !isSet(gradingForecast)) {
    // Nothing to sync with
    return;
  }

  if (gradingForecast === processGrading) {
    return;
  }

  updatePage(progress, {
    'cf.cplace.solution.okr.gradingForecast': gradingForecast
  })
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
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

//------------------------------------------------------------------------------------------------------

const KEY_RESULT = {
  TYPE : 'cf.cplace.solution.okr.keyResult',
  ATTR :{
    PROGRESS : 'cf.cplace.solution.okr.progress',
    CONFIDENCE_LEVEL :'cf.cplace.solution.okr.confidenceLevel',
    PROGRESS_INDICATOR : 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE : 'cf.cplace.solution.okr.progress',
  ATTR : {
    KEY_RESULT:'cf.cplace.solution.okr.keyResult',
    CONFIDENCE_LEVEL:'cf.cplace.solution.okr.confidenceLevel',
    PROGRESS_INDICATOR :'cf.cplace.solution.okr.progressIndicator'
  }
}

cplace.setLogName('set _outdated_ProgressIndicator');

function main(){
  let page = changeEvent.getEntity();
  let indicator = page.get(KEY_RESULT.ATTR.PROGRESS_INDICATOR);
  let progress = page.get(KEY_RESULT.ATTR.PROGRESS);
  // only update outdated, all other indicators should be updated when sync of confidencelevel happens
  if (!isSet(progress) || !isSet(indicator)) {
    // Nothing to sync
    return;
  }
  let resultIndicator = progress.get(PROGRESS.ATTR.PROGRESS_INDICATOR);
  if (indicator === '#45 outdated' && resultIndicator !== '#45 outdated') {
    return updateIndicator(progress,indicator);
  }
  if (indicator !== '#45 outdated' && resultIndicator === '#45 outdated') {
    return updateIndicator(progress,indicator);
  }
}

return main();

function updateIndicator(progress,indicator) {
  cplace.log("Keyresult updates indicator")
  cplace.actions().updatePage(progress, {
    customAttributes: {
      'cf.cplace.solution.okr.progressIndicator': indicator
    }
  }
                             );
  progress.registerAttributeForRefresh('cf.cplace.solution.okr.progressIndicator');
}
// Check if a value is set
function isSet(value) {
  return !!value;
}

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Keyresult
*Description: whenever the progressIndicator of the keyResult is changed this changelistener updates the confidencelvel
*Author: Laxmi udapudi
*/
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}
cplace.setLogName('sync_ProgressIndicator_on_progress');

function main() {
  let keyResult = changeEvent.getEntity();
  let progressIndicator = keyResult.get(KEY_RESULT.ATTR.PROGRESS_INDICATOR);
  let confidenceLevel = keyResult.get(KEY_RESULT.ATTR.CONFIDENCELEVEL);

  switch (progressIndicator) {
    case '#45 outdated':
      // Do nothing
      break;
    case '#15 green':
      if (parseFloat(confidenceLevel) < 0.7) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.7'
        })
      }
      break;
    case '#25 yellow':
      if (parseFloat(confidenceLevel) < 0.4 || parseFloat(confidenceLevel) > 0.6) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.5'
        })
      }
      break;
    case '#35 red':
      if (parseFloat(confidenceLevel) > 0.3) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.3'
        })
      }
      break;
    default:
      updatePage(keyResult, {
        'cf.cplace.solution.okr.confidenceLevel': '1'
      })
      break;
  }
}

main();
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

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Keyresult
*Description: whenever the confidencelevel of the keyresult is changed this changelistener updates the progressIndicator
*Author: Laxmi udapudi
*/
//cplace.setLogName('sync_cf_on_progress');

const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}

function main() {
  let keyresult = changeEvent.getEntity();
  let confidenceLevel = keyresult.get(KEY_RESULT.ATTR.CONFIDENCELEVEL);

  if (isSet(confidenceLevel)) {
    cplace.log("Confidence set");
    let indicator = getIndicator(parseFloat(confidenceLevel));
    let setIndicator = keyresult.get(KEY_RESULT.ATTR.PROGRESS_INDICATOR);

    if (setIndicator === indicator) {
      return;
    }

    cplace.log("confidence notequal indicator");
    updatePage(keyresult, {
      'cf.cplace.solution.okr.progressIndicator': indicator
    })
  } else {
    updatePage(keyresult, {
      'cf.cplace.solution.okr.progressIndicator': '#35 red'
    })

  }
}

return main();

function getIndicator(confidenceLevel) {
  if (confidenceLevel < 0.4) {
    return '#35 red';
  }
  if (confidenceLevel < 0.7) {
    return '#25 yellow';
  }
  return '#15 green';
}

// Check if a value is set
function isSet(value) {
  return !!value;
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

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Triggering Attribute : Give Big Support
*Updates the receiveBigSupport on change of giveBigSupport
*Author:laxmi Udapudi
*/


/*Set the distinguish name for log*/
cplace.setLogName('cl_update_receive_big _Support')
const DEBUG = true;

const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator',
    BIG_SUPPORT: 'cf.cplace.solution.okr.giveBigSupport',
    RECEIVE_SUPPORT: 'cf.cplace.solution.okr.receiveBigSupport'
  }
}

function main() {
  let keyResult = changeEvent.getEntity();
  let currentSupports = keyResult.get(KEY_RESULT.ATTR.BIG_SUPPORT);
  let oldSupports = changeEvent.getOldValues(KEY_RESULT.ATTR.BIG_SUPPORT);
  let addedSupports = [];
  let removedSupports = [];

  currentSupports.forEach(function (support) {
    if (!oldSupports.contains(support)) {
      addedSupports.push(support);
    }
  });
  oldSupports.forEach(function (support) {
    if (!currentSupports.contains(support)) {
      removedSupports.push(support);
    }
  });

  log('Added: ' + addedSupports);
  log('Removed: ' + removedSupports);

  if (addedSupports.length === 0 && removedSupports.length === 0) {
    return;
  }

  addedSupports.forEach(function (support) {
    addReference(keyResult, support);
  });
  removedSupports.forEach(function (support) {
    removeReference(keyResult, support);
  })
}

return main();

/*
*function checks for the duplicates and updates the receive big support 
*@params{provider,recevier}
*/
function addReference(provider, receiver) {
  let receiverValues = receiver.get(KEY_RESULT.ATTR.RECEIVE_SUPPORT) || [];

  // Avoid duplication
  if (receiverValues.contains(provider)) {
    return;
  }

  let newValues = [...receiverValues, provider];
  updatePage(receiver, {
    'cf.cplace.solution.okr.receiveBigSupport': newValues
  })

}

/*
*function removes the reference and updates the receive big support 
*@params{provider,recevier}
*/

function removeReference(provider, receiver) {
  let receiverValues = receiver.get(KEY_RESULT.ATTR.RECEIVE_SUPPORT) || [];
  let newValues = [];

  receiverValues.forEach(function (element) {
    if (element.getId() !== provider.getId()) {
      newValues.push(element);
    }
  });

  updatePage(receiver, {
    'cf.cplace.solution.okr.receiveBigSupport': newValues
  })
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

//------------------------------------------------------------------------------------------------------

const KEY_RESULT = {
  TYPE : 'cf.cplace.solution.okr.keyResult',
  ATTR :{
    PROGRESS : 'cf.cplace.solution.okr.progress',
    CONFIDENCE_LEVEL :'cf.cplace.solution.okr.confidenceLevel',
  }
}
const PROGRESS = {
  TYPE : 'cf.cplace.solution.okr.progress',
  ATTR : {
    KEY_RESULT:'cf.cplace.solution.okr.keyResult',
    CONFIDENCE_LEVEL:'cf.cplace.solution.okr.confidenceLevel',
  }
}
function main(){
  //const attributeToSync = 'cf.cplace.solution.okr.confidenceLevel';
  let page = changeEvent.getEntity();
  let confidenceLevel = page.get(PROGRESS.ATTR.CONFIDENCE_LEVEL);
  let keyResult = page.get(PROGRESS.ATTR.KEY_RESULT);
  if (!isSet(keyResult) || !isSet(confidenceLevel)) {
    // Nothing to sync with
    return;
  }
  let resultConfidence = keyResult.get(KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
  if (confidenceLevel === resultConfidence)  {
    return;
  }
  cplace.actions().updatePage(keyResult, {
    customAttributes: {
      'cf.cplace.solution.okr.confidenceLevel': confidenceLevel
    }
  }
                             );
  keyResult.registerAttributeForRefresh('cf.cplace.solution.okr.confidenceLevel');
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
}

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Progress
*Description: whenever the gradingForecast of the progress is changed this changelistener updates the same in keyResult
*Triggering attribute : 
*Author: Laxmi udapudi
*/

cplace.setLogName('set_gf_on_progress')
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}

function main() {

  let progress = changeEvent.getEntity();
  let gradingForecast = progress.get(PROGRESS.ATTR.GRADING_FORECAST);
  let keyResult = progress.get(PROGRESS.ATTR.KEY_RESULT);
  let processGrading = keyResult.get(KEY_RESULT.ATTR.GRADING_FORECAST);

  if (!isSet(progress) || !isSet(gradingForecast)) {
    // Nothing to sync with
    return;
  }

  if (gradingForecast === processGrading) {
    return;
  }

  updatePage(keyResult, {
    'cf.cplace.solution.okr.gradingForecast': gradingForecast
  })
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
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

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Progress
*Description: whenever the progressIndicator of the progress is changed this changelistener updates the same in keyResult
*Triggering attribute : 
*Author: Laxmi udapudi
*/
cplace.setLogName('sync_progressIndicator_on_keyresult')

const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'

  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}

function main() {

  let progress = changeEvent.getEntity();
  let progressIndicator = progress.get(PROGRESS.ATTR.PROGRESS_INDICATOR);
  let keyResult = progress.get(PROGRESS.ATTR.KEY_RESULT);
  let processIndicator = keyResult.get(PROGRESS.ATTR.PROGRESS_INDICATOR);

  if (!isSet(progress) || !isSet(progressIndicator)) {
    // Nothing to sync with
    return;
  }

  if (progressIndicator === processIndicator) {
    return;
  }

  updatePage(keyResult, {
    'cf.cplace.solution.okr.progressIndicator': progressIndicator
  })
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
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

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Keyresult
*Description: whenever the progressIndicator of the progress is changed this changelistener updates the confidencelvel
*Author: Laxmi udapudi
*/

cplace.setLogName('sync_PI_on_KR')
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}

function main() {
  let progress = changeEvent.getEntity();
  let progressIndicator = progress.get(PROGRESS.ATTR.PROGRESS_INDICATOR);
  let confidenceLevel = progress.get(PROGRESS.ATTR.CONFIDENCELEVEL);

  switch (progressIndicator) {
    case '#45 outdated':
      // Do nothing
      break;
    case '#15 green':
      if (parseFloat(confidenceLevel) < 0.7) {
        updatePage(progress, {
          'cf.cplace.solution.okr.confidenceLevel': '0.7'
        })
      }
      break;
    case '#25 yellow':
      if (parseFloat(confidenceLevel) < 0.4 || parseFloat(confidenceLevel) > 0.6) {
        updatePage(progress, {
          'cf.cplace.solution.okr.confidenceLevel': '0.5'
        })
      }
      break;
    case '#35 red':
      if (parseFloat(confidenceLevel) > 0.3) {
        updatePage(progress, {
          'cf.cplace.solution.okr.confidenceLevel': '0.3'
        })
      }
      break;
    default:
      updatePage(progress, {
        'cf.cplace.solution.okr.confidenceLevel': '1'
      })
      break;
  }
}

main();
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

//------------------------------------------------------------------------------------------------------

/*
*Changelistener
*Type:Keyresult
*Description: whenever the confidencelevel of the progress is changed this changelistener updates the progressIndicator
*Author: Laxmi udapudi
*/
cplace.setLogName('sync_cf_on_KR')
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}

function main() {
  let progress = changeEvent.getEntity();
  let confidenceLevel = progress.get(PROGRESS.ATTR.CONFIDENCELEVEL);

  if (isSet(confidenceLevel)) {
    cplace.log("Confidence set");
    let indicator = getIndicator(parseFloat(confidenceLevel));
    let setIndicator = progress.get('cf.cplace.solution.okr.progressIndicator');

    if (setIndicator === indicator) {
      return;
    }

    cplace.log("confidence notequal indicator");
    updatePage(progress, {
      'cf.cplace.solution.okr.progressIndicator': indicator
    })
  } else {
    updatePage(progress, {
      'cf.cplace.solution.okr.progressIndicator': '#35 red'
    })

  }
}

main()

function getIndicator(confidenceLevel) {
  if (confidenceLevel < 0.4) {
    return '#35 red';
  }
  if (confidenceLevel < 0.7) {
    return '#25 yellow';
  }
  return '#15 green';
}

// Check if a value is set
function isSet(value) {
  return !!value;
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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

/*
*Validator 
*checks for progressUpdated to be true
*/
function main() {
   let result = null;
   let updated = page.get('cf.cplace.solution.okr.progressUpdated');

   if (!updated) {
      result = 'The progess must be updated!';
   }

   return result;
}

return main();

//------------------------------------------------------------------------------------------------------

/// <reference path="./typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 * 
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 * 
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *   
 * 
 * 
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
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
 cplace.setLogName("highchart-template");
 
 /**
  * ===================
  * CONFIGURATION STAGE
  * ===================
  */
 
 /**
  * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
  */
 const CHART_DEFINITION = {
     PIE: {
         chart: {
             type: 'pie'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     SEMICIRCLE: {
         chart: {
             type: 'pie'
         },
         plotOptions: {
             startAngle: -90,
             endAngle: 90,
             center: ['50%', '75%'],
             size: '110%',
             innerSize: '70%'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     BAR: {
         chart: {
             type: 'bar'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
     COLUMN: {
         chart: {
             type: 'column'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
 }
 
 
 
 /**
  * ==================================================================================
  * !!!! CHANGE FROM HERE !!!!
  */
 
 /**
  * Optional: Show a title inside of the chart area
  */
 const CHART_TITLE = ''
 
 /**
  * Set to null or leave blank to use the Pagename
  * 
  * TODO builtinFeatureValue starts with underscore: '_creator'
  */
 const BASE_ATTRIBUTE = 'cf.cplace.solution.okr.progressIndicator';
 
 /**
  * Optional: Stacking is only possible for bar and column charts
  * 
  */
 const STACK_ATTRIBUTE = null;
 
 /**
  * Optional: Define an attribute of the page that acts as weight. If null, each entry has a weight of 1.
  * The weight is used as sum of each datapoint.
  */
 const WEIGHT_ATTRIBUTE = null;
 
 /**
  * Define the base type of the chart: 
  * - CHART_DEFINITION.PIE
  * - CHART_DEFINITION.SEMICIRCLE
  * - CHART_DEFINITION.BAR
  * - CHART_DEFINITION.COLUMN
  */
 const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;
 
 /**
  * Define colors for the chart
  */
 const CHART_COLORS = {
     BACKGROUND: '#F2F4FA',
     TEXT: 'var(--text-color)',
     SERIES: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
     CATEGORY: {
         '#15 green': '#AEDB3C',
         '#25 yellow': '#FFBA00',
         '#35 red': '#DB0F35',
         '#45 outdated': '#bcbcbc'
     }
 }
 
 /**
  * @type {Boolean} sort axes ascending (true) or descending (false)
  */
 const CHART_SORT_ASCENDING = true;
 
 /**
  * @type {Boolean} show legend under chart
  */
 const CHART_SHOW_LEGEND = false;
 
 /**
  * @type {Boolean} show labels on all datapoints
  */
 const CHART_SHOW_LABELS = false;
 
 /**
  * @type {Boolean} show values as percentage
  */
 const CHART_SHOW_PERCENTAGE = false;
 
 /**
  * @type {null|String} override tooltip text
  * - use {point.y} as placeholder for absolute values
  * - use {point.percentage:.1f}% as placeholder for percantage
  * - use {point.stackTotal} for sum of stack
  * - use {point.name} for name of data point
  * - use {series.name} for name of data series
  */
 const CHART_TOOLTIP_OVERRIDE = null;
 
 
 /**
  * DO NOT CHANGE AFTER THIS LINE
  * ==================================================================================
  */
 
 const CHART_IS_STACKED = !!STACK_ATTRIBUTE && CHART_TYPE_SELECTED.isStackable;
 
 const CHART_POINT_FORMAT = (CHART_TYPE_SELECTED.isPercentageAvailable && CHART_SHOW_PERCENTAGE) ? '{point.percentage:.1f}%' : '{point.y}'
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 
 let config = {
     title: {
         text: CHART_TITLE,
         align: 'center',
         verticalAlign: 'middle',
         margin: 0,
         useHtml: true,
         style: {
             color: CHART_COLORS.TEXT,
             fontSize: "2em",
             fontWeight: "bold"
         }
     },
     chart: CHART_TYPE_SELECTED.chart,
     legend: {
         enabled: CHART_SHOW_LEGEND,
         layout: 'horizontal',
         align: 'center',
         verticalAlign: 'bottom',
         itemStyle: {
             color: CHART_COLORS.TEXT,
             fontWeight: "normal"
         }
     },
     pane: {
         size: '100%'
     },
     tooltip: {
         pointFormat: '<b>' + CHART_POINT_FORMAT + '</b>'
     },
     plotOptions: {
         pie: {
            borderWidth: 10,
            borderColor: 'var(--body-bg)',
         },
         series: {
             showInLegend: CHART_SHOW_LEGEND,
             dataLabels: {
                 enabled: CHART_SHOW_LABELS,
                 format: '<b>{point.name}</b>: ' + CHART_POINT_FORMAT
             },
             cursor: 'pointer',
             stacking: (CHART_IS_STACKED && CHART_SHOW_PERCENTAGE) ? 'percent' : CHART_IS_STACKED
         }
     },
     colors: CHART_COLORS.SERIES,
     series: [],
     xAxis: {
         type: 'category'
     },
     yAxis: {
         allowDecimals: false,
         title: ''
     }
 }
 
 config.chart.backgroundColor = CHART_COLORS.BACKGROUND
 config.chart.spacingBottom = 0
 config.chart.spacingTop = 0
 
 if (CHART_TITLE && CHART_SHOW_LEGEND && CHART_TYPE_SELECTED.hasFloatingTitle) {
     config.title.verticalAlign = 'top'
 }
 
 if (CHART_TYPE_SELECTED.plotOptions) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type] = CHART_TYPE_SELECTED.plotOptions;
 }
 
 if (CHART_IS_STACKED) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type].colorByPoint = false;
     config.tooltip.pointFormat = '{series.name}: ' + CHART_POINT_FORMAT + '<br/>Total: {point.stackTotal}'
     config.plotOptions.series.dataLabels.format = '{series.name}: ' + CHART_POINT_FORMAT
 }
 
 if (CHART_TOOLTIP_OVERRIDE !== null) {
     config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
 }
 
 
 /**
  * ================
  * PROCESSING STAGE
  * ================ 
  */
 if (pages.length === 0) {
     return config
 }
 
 let datasetSize = pages.length;
 let series = [];
 let series_labels = {};
 let categories = {};
 let data = {};
 let pageCounter = 0;
 pages.forEach(function (page) {
     let value = getValueAndLabelOfAttribute(page, BASE_ATTRIBUTE)
     let weight = 1;
     if (value === null) {
         return
     }
 
     let series = getValueAndLabelOfAttribute(page, STACK_ATTRIBUTE);
 
     if (!CHART_IS_STACKED || series === null) {
         series = {
             value: '',
             label: CHART_TITLE
         }
     }
 
     if (WEIGHT_ATTRIBUTE) {
         weight = page.get(WEIGHT_ATTRIBUTE) || 1
     }
 
     if (value.length) {
         value.forEach(function (item) {
             addSeriesData(item, weight, series, data, categories, series_labels)
         })
     } else {
         addSeriesData(value, weight, series, data, categories, series_labels)
     }
     pageCounter++;
 });

 // This will display the number of pages in the center
 config.title.text += pageCounter;
 
 /**
  * TODO Sort stacked series, too
  */
 
 Object.keys(series_labels).sort().forEach(function (series_label) {
     series_labels[series_label] = series.length
 
     series.push({
         name: series_label,
         type: CHART_TYPE_SELECTED.chart.type,
         data: [],
         innerSize: '50%'
     })
 
 })
 
 Object.keys(data).forEach(function (key) {
     let currentDataItem = {
         name: data[key].name,
         y: data[key].count
     }
     let seriesId = series_labels[data[key].series]
 
     if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series_internal)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series_internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].internal)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].name)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].name]
     }
 
     series[seriesId].data.push(currentDataItem)
 })
 
 /**
  * Add empty entries to series and sort them
  */
  let allDataKeys = [];
  Object.keys(data).forEach(function (key) {
      let label = data[key].name;
      if (allDataKeys.indexOf(label) !== -1) {
          return;
      }
  
      series.forEach(function (serie) {
          if (!serie.data.some(function (data) {
                  return data.name === label
              })) {
              serie.data.push({
                  name: label,
                  y: 0
              })
          }
      })
      allDataKeys.push(label)
  })
 
 /**
  * sort series.data by name
  */
 series.forEach(function (serie) {
     serie.data.sort(function (a, b) {
         if (!a.hasOwnProperty('name') || a.name == b.name) {
             return 0
         }
         /**
          * sort depending on CHART_SORT_ASCENDING
          */
         return ((CHART_SORT_ASCENDING && a.name > b.name) || (!CHART_SORT_ASCENDING && a.name < b.name)) ? 1 : -1
     })
 })
 
 /**
  * ============
  * OUTPUT STAGE
  * ============ 
  */
 
 config.series = series;
 return config;
 
 /**
  * ==================
  * BUSINESS FUNCTIONS
  * ==================
  */
 
 /**
  * ================
  * HELPER FUNCTIONS
  * ================
  */
 
 /**
  * 
  * @param {object} value 
  * @param {Number} weight 
  * @param {object} series 
  * @param {object[]} data 
  * @param {object[]} categories 
  * @param {String[]} series_labels 
  */
 function addSeriesData(value, weight, series, data, categories, series_labels) {
     let key = value.value + series.value;
 
     if (data[key] === undefined) {
         data[key] = {
             count: 0,
             name: value.label,
             internal: value.value,
             series: series.label,
             series_internal: series.value
         }
     }
 
     data[key].count += weight || 1;
 
     if (!categories.hasOwnProperty(data[key].name)) {
         categories[data[key].name] = 0
     }
 
     if (!series_labels.hasOwnProperty(data[key].series)) {
         series_labels[data[key].series] = 0
     }
 }
 
 
 /**
  * 
  * @param {Page} page 
  * @param {object} attribute 
  * @returns 
  */
 function getValueAndLabelOfAttribute(page, attribute) {
     let result = null;
     if (!page) {
         return result;
     }
     if (!attribute) {
         return {
             value: page.getRealUid(),
             label: page.getName()
         };
     }
 
     let value = page.get(attribute, false);
     if (value === null) {
         return result;
     }
     let value_label = page.get(attribute, true) || value;
 
     let className = typeof value === 'object' ? String(value.getClass()) : 'String'
 
     switch (className) {
         case 'String':
         case 'class java.lang.String':
             result = {
                 value: value,
                 label: value_label
             }
             break;
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedGroup':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
             result = {
                 value: value.getRealUid(),
                 label: value.getName()
             }
             break;
         case 'class java.util.ArrayList':
         case 'class com.google.common.collect.SingletonImmutableList':
         case 'class com.google.common.collect.RegularImmutableList':
             /**
              * TODO Multi-Value
              */
             result = [];
             cplace.each(value, function (item) {
                 if (typeof item !== 'object' || String(item.getClass()) === 'class java.lang.String') {
                     /**
                      * FIXME enum label / enum internal name
                      */
                     result.push({
                         value: item,
                         label: item
                     })
                 } else {
                     result.push({
                         value: item.getRealUid(),
                         label: item.getName()
                     })
                 }
             })
             break;
         default:
             /**
              * TODO Reference
              */
             log('Class of ' + value + ' is "' + value.class + '"')
             log(typeof value.class)
             log(typeof value)
     }
 
     return result
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

//------------------------------------------------------------------------------------------------------

/*
*Highchart
*Displays the cycle timeline
*/


const CYCLE = {
    TYPE: 'cf.cplace.solution.okr.cycle',
    ATTR: {
        START: 'cf.cplace.solution.okr.start',
        END: 'cf.cplace.solution.okr.end',
        YEAR: 'cf.cplace.solution.okr.year',
        STATUS: 'cf.cplace.solution.okr.status'
    }
}

const MEETING = {
    TYPE: 'cf.cplace.solution.okr.meeting',
    ATTR: {
        TITLE: 'cf.cplace.solution.okr.title',
        MEETING_TYPE: 'cf.cplace.solution.okr.meetingType',
        DATE: 'cf.cplace.solution.okr.date',
        CYCLE: 'cf.cplace.solution.okr.cycle'
    }
}

/*************INITIALIZATION************* */
const dataObj = { cycleNames: [], seriesCyclePhase: [], seriesInputPhase: [], seriesWorkshop: [], seriesStrategy: [] }
const counterArray = [];
const row = 0;
const values = [];
const sortedPages = []

let workshop;
let workshopDate;
let messages = {
    inputPhase: {
        en: 'Input Phase ',
        de: 'Input-Phase '
    },
    cyclePhase: {
        en: 'Cycle Implementation Phase ',
        de: 'Cycle Umsetzungs-Phase '
    },
    workshop: {
        en: 'Workshop ',
        de: 'Workshop '
    },
    strategy: {
        en: 'Strategy Update ',
        de: 'Strategie Update '
    }
};

function genearteData(embeddingPage) {
    const cycle = embeddingPage;
    const cycleName = cycle.getName();
    const cycleStart = cycle.get(CYCLE.ATTR.START);
    const cycleEnd = cycle.get(CYCLE.ATTR.END);
    const lang = cplace.utils().getCurrentUser().getUserLanguage();
    const meetings = cycle.getIncomingPages(MEETING.TYPE, MEETING.ATTR.CYCLE);
    cplace.each(meetings, function (meeting) {
        if (meeting.get('cf.cplace.solution.okr.meetingType') == "Workshop") {
            workshop = meeting;
        };
    })

    if (workshop) {
        workshopDate = workshop.get(MEETING.ATTR.DATE);
    }

    if (cycleStart && cycleEnd && workshop) {

        dataObj.cycleNames.push(cycleName);
        dataObj.seriesCyclePhase.push({
            x: cycleStart.getMillis(),
            x2: cycleEnd.getMillis(),
            y: row,
            color: '#006ae5',
            dataLabels: {
                format: messages.cyclePhase[lang] + cycleName
            },
            name: messages.cyclePhase[lang] + cycleName
        });
        dataObj.seriesInputPhase.push({
            x: workshopDate.minusDays(21).getMillis(),
            x2: workshopDate.getMillis(),
            color: '#00ffcd',
            y: row,
            dataLabels: {
                format: messages.inputPhase[lang]
            },
            name: messages.inputPhase[lang] + cycleName
        });
        dataObj.seriesWorkshop.push({
            x: workshopDate.getMillis(),
            y: row,
            date: cycleStart.toString("MMM/dd"),
            dataLabels: {
                format: messages.workshop[lang]
            },
            color: '#151821',
            name: messages.inputPhase[lang]
        })
        dataObj.seriesStrategy.push({
            x: cycleEnd.minusDays(28).getMillis(),
            y: row,
            date: cycleStart.toString("MMM/dd"),
            color: '#151821',
            dataLabels: {
                format: messages.strategy[lang]
            },
            name: messages.strategy[lang]
        })
    }

    return dataObj;

}
function main() {
    const data = genearteData(embeddingPage);

    const chart = {
        chart: {
            type: 'xrange',
            zoomType: 'x',
            backgroundColor: '#F2F4FA',
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            plotLines: [{
                value: new Date().setHours(0),
                dashStyle: 'dash',
                width: 2,
                zIndex: 5,
            }],
            lineColor: '#F2F4FA',
            tickLength: 1,
        },
        yAxis: {
            title: '',
            labels: {
                enabled: false
            },
            gridLineColor: 'rgba(255,255,255,0)',
            lineColor: '#F2F4FA',
            categories: data.cycleNames,
            reversed: true,
            max: 0
        },
        plotOptions: {
            series: {
                borderRadius: 5,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: '',
            data: data.seriesCyclePhase,
            dataLabels: {
                enabled: true
            }
        }, {
            name: '',
            data: data.seriesInputPhase,
            dataLabels: {
                enabled: true
            }
        }, {
            type: 'scatter',
            stickyTracking: false,
            marker: {
                enabled: true,
                symbol: 'diamond',
                lineColor: 'white',
                lineWidth: 1,
                radius: 13
            },
            data: data.seriesWorkshop
        }, {
            type: 'scatter',
            stickyTracking: false,
            marker: {
                enabled: true,
                symbol: 'diamond',
                lineColor: 'white',
                lineWidth: 1,
                radius: 13
            },
            data: data.seriesStrategy
        }],
        tooltip: {
            enabled: false
        }
    };
    return chart
}

return main();

//------------------------------------------------------------------------------------------------------

var cycle = embeddingPage;
var meetings = cycle.getIncomingPages('cf.cplace.solution.okr.meeting', 'cf.cplace.solution.okr.cycle');
var workshop;
cplace.each(meetings, function(meeting) {
  if (meeting.get('cf.cplace.solution.okr.meetingType') == "Workshop") {
    workshop = meeting;
  };
})

var cycleNames = [];
var counterArray = [];
var row = 0;
var values = [];
var sortedPages = []
var seriesCyclePhase = [];
var seriesInputPhase = [];
var seriesWorkshop = [];
var seriesStrategy = [];
var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  inputPhase: {
    en: 'Input Phase ',
    de: 'Input-Phase '
  },
  cyclePhase: {
    en: 'Cycle Implementation Phase ',
    de: 'Cycle Umsetzungs-Phase '
  },
  workshop: {
    en: 'Workshop ',
    de: 'Workshop '
  },
  strategy: {
    en: 'Strategy Update ',
    de: 'Strategie Update '
  }
};


var cycleName = cycle.getName();
var cycleStart = cycle.get('cf.cplace.solution.okr.start');
var cycleEnd = cycle.get('cf.cplace.solution.okr.end');
var workshopDate;
if (workshop) {
  workshopDate = workshop.get('cf.cplace.solution.okr.date');  
}

if (cycleStart && cycleEnd && workshop) {

  cycleNames.push(cycleName);
  seriesCyclePhase.push({
    x: cycleStart.getMillis(),
    x2: cycleEnd.getMillis(),
    y: row,
    color: '#006ae5',
    dataLabels: {
      format: messages.cyclePhase[lang] + cycleName
    },
    name: messages.cyclePhase[lang] + cycleName
  });
  seriesInputPhase.push({
    x: workshopDate.minusDays(21).getMillis(),
    x2: workshopDate.getMillis(),
    color: '#151821',
    y: row,
    dataLabels: {
      format: messages.inputPhase[lang]
    },
    name: messages.inputPhase[lang] + cycleName
  });
  seriesWorkshop.push({
    x: workshopDate.getMillis(),
    y: row,
    date: cycleStart.toString("MMM/dd"),
    dataLabels: {
      format: messages.workshop[lang]
    },
    color: '#a5ffd6',
    name: messages.inputPhase[lang]
  })
  seriesStrategy.push({
    x: cycleEnd.minusDays(28).getMillis(),
    y: row,
    date: cycleStart.toString("MMM/dd"),
    color: '#a5ffd6',
    dataLabels: {
      format: messages.strategy[lang]
    },
    name: messages.strategy[lang]
  })


}

var chart = {
  chart: {
    type: 'xrange',
    zoomType: 'x',
	backgroundColor: '#F2F4FA',
  },
  legend: {
    enabled: false
  },
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    plotLines: [{
      value: new Date().setHours(0),
      dashStyle: 'dash',
      width: 2,
      zIndex: 5,
    }],
    lineColor: '#F2F4FA',
    tickLength: 1,
  },
  yAxis: {
    title: '',
    labels: {
      enabled: false
    },
    gridLineColor: 'rgba(255,255,255,0)',
    lineColor: '#F2F4FA',
    categories: cycleNames,
    reversed: true,
    max: 0
  },
  plotOptions: {
    series: {
      borderRadius: 5,
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [{
    name: '',
    data: seriesCyclePhase,
    dataLabels: {
      enabled: true
    }
  }, {
    name: '',
    data: seriesInputPhase,
    dataLabels: {
      enabled: true
    }
  }, {
    type: 'scatter',
    stickyTracking: false,
    marker: {
      enabled: true,
      symbol: 'diamond',
      lineColor: 'white',
      lineWidth: 1,
      radius: 13
    },
    data: seriesWorkshop
  }, {
    type: 'scatter',
    stickyTracking: false,
    marker: {
      enabled: true,
      symbol: 'diamond',
      lineColor: 'white',
      lineWidth: 1,
      radius: 13
    },
    data: seriesStrategy
  }],
  tooltip: {
    enabled: false
  }
};
return chart

//------------------------------------------------------------------------------------------------------

/// <reference path="./typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 * 
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 * 
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *   
 * 
 * 
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
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
 cplace.setLogName("highchart-template");
 
 /**
  * ===================
  * CONFIGURATION STAGE
  * ===================
  */
 
 /**
  * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
  */
 const CHART_DEFINITION = {
     PIE: {
         chart: {
             type: 'pie'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     SEMICIRCLE: {
         chart: {
             type: 'pie'
         },
         plotOptions: {
             startAngle: -90,
             endAngle: 90,
             center: ['50%', '75%'],
             size: '110%',
             innerSize: '50%'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     BAR: {
         chart: {
             type: 'bar'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
     COLUMN: {
         chart: {
             type: 'column'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
 }
 
 
 
 /**
  * ==================================================================================
  * !!!! CHANGE FROM HERE !!!!
  */
 
 /**
  * Optional: Show a title inside of the chart area
  */
 const CHART_TITLE = ''
 
 /**
  * Set to null or leave blank to use the Pagename
  * 
  * TODO builtinFeatureValue starts with underscore: '_creator'
  */
 const BASE_ATTRIBUTE = 'cf.cplace.solution.okr.progressIndicator';
 
 /**
  * Optional: Stacking is only possible for bar and column charts
  * 
  */
 const STACK_ATTRIBUTE = null;
 
 /**
  * Optional: Define an attribute of the page that acts as weight. If null, each entry has a weight of 1.
  * The weight is used as sum of each datapoint.
  */
 const WEIGHT_ATTRIBUTE = null;
 
 /**
  * Define the base type of the chart: 
  * - CHART_DEFINITION.PIE
  * - CHART_DEFINITION.SEMICIRCLE
  * - CHART_DEFINITION.BAR
  * - CHART_DEFINITION.COLUMN
  */
 const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;
 
 /**
  * Define colors for the chart
  */
 const CHART_COLORS = {
     BACKGROUND: '#F2F4FA',
     TEXT: 'var(--text-color)',
     SERIES: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
     CATEGORY: {
         '#15 green': '#AEDB3C',
         '#25 yellow': '#FFBA00',
         '#35 red': '#DB0F35',
         '#45 outdated': '#bcbcbc'
     }
 }
 
 /**
  * @type {Boolean} sort axes ascending (true) or descending (false)
  */
 const CHART_SORT_ASCENDING = true;
 
 /**
  * @type {Boolean} show legend under chart
  */
 const CHART_SHOW_LEGEND = false;
 
 /**
  * @type {Boolean} show labels on all datapoints
  */
 const CHART_SHOW_LABELS = false;
 
 /**
  * @type {Boolean} show values as percentage
  */
 const CHART_SHOW_PERCENTAGE = false;
 
 /**
  * @type {null|String} override tooltip text
  * - use {point.y} as placeholder for absolute values
  * - use {point.percentage:.1f}% as placeholder for percantage
  * - use {point.stackTotal} for sum of stack
  * - use {point.name} for name of data point
  * - use {series.name} for name of data series
  */
 const CHART_TOOLTIP_OVERRIDE = null;
 
 
 /**
  * DO NOT CHANGE AFTER THIS LINE
  * ==================================================================================
  */
 
 const CHART_IS_STACKED = !!STACK_ATTRIBUTE && CHART_TYPE_SELECTED.isStackable;
 
 const CHART_POINT_FORMAT = (CHART_TYPE_SELECTED.isPercentageAvailable && CHART_SHOW_PERCENTAGE) ? '{point.percentage:.1f}%' : '{point.y}'
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 
 let config = {
     title: {
         text: CHART_TITLE,
         align: 'center',
         verticalAlign: 'middle',
         margin: 0,
         y: 10,
         useHtml: true,
         style: {
             color: CHART_COLORS.TEXT,
             fontSize: "2em",
             fontWeight: "bold"
         }
     },
     chart: CHART_TYPE_SELECTED.chart,
     legend: {
         enabled: CHART_SHOW_LEGEND,
         layout: 'horizontal',
         align: 'center',
         verticalAlign: 'bottom',
         itemStyle: {
             color: CHART_COLORS.TEXT,
             fontWeight: "normal"
         }
     },
     pane: {
         size: '100%'
     },
     tooltip: {
         pointFormat: '<b>' + CHART_POINT_FORMAT + '</b>'
     },
     plotOptions: {
         pie: {
            borderWidth: 10,
            borderColor: 'var(--body-bg)',
         },
         series: {
             showInLegend: CHART_SHOW_LEGEND,
             dataLabels: {
                 enabled: CHART_SHOW_LABELS,
                 format: '<b>{point.name}</b>: ' + CHART_POINT_FORMAT
             },
             cursor: 'pointer',
             stacking: (CHART_IS_STACKED && CHART_SHOW_PERCENTAGE) ? 'percent' : CHART_IS_STACKED
         }
     },
     colors: CHART_COLORS.SERIES,
     series: [],
     xAxis: {
         type: 'category'
     },
     yAxis: {
         allowDecimals: false,
         title: ''
     }
 }
 
 config.chart.backgroundColor = CHART_COLORS.BACKGROUND
 config.chart.spacingBottom = 0
 config.chart.spacingTop = 0
 
 if (CHART_TITLE && CHART_SHOW_LEGEND && CHART_TYPE_SELECTED.hasFloatingTitle) {
     config.title.verticalAlign = 'top'
 }
 
 if (CHART_TYPE_SELECTED.plotOptions) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type] = CHART_TYPE_SELECTED.plotOptions;
 }
 
 if (CHART_IS_STACKED) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type].colorByPoint = false;
     config.tooltip.pointFormat = '{series.name}: ' + CHART_POINT_FORMAT + '<br/>Total: {point.stackTotal}'
     config.plotOptions.series.dataLabels.format = '{series.name}: ' + CHART_POINT_FORMAT
 }
 
 if (CHART_TOOLTIP_OVERRIDE !== null) {
     config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
 }
 
 
 /**
  * ================
  * PROCESSING STAGE
  * ================ 
  */
 if (pages.length === 0) {
     return config
 }
 
 let datasetSize = pages.length;
 let series = [];
 let series_labels = {};
 let categories = {};
 let data = {};
 let pageCounter = 0;
 pages.forEach(function (page) {
     let value = getValueAndLabelOfAttribute(page, BASE_ATTRIBUTE)
     let weight = 1;
     if (value === null) {
         return
     }
 
     let series = getValueAndLabelOfAttribute(page, STACK_ATTRIBUTE);
 
     if (!CHART_IS_STACKED || series === null) {
         series = {
             value: '',
             label: CHART_TITLE
         }
     }
 
     if (WEIGHT_ATTRIBUTE) {
         weight = page.get(WEIGHT_ATTRIBUTE) || 1
     }
 
     if (value.length) {
         value.forEach(function (item) {
             addSeriesData(item, weight, series, data, categories, series_labels)
         })
     } else {
         addSeriesData(value, weight, series, data, categories, series_labels)
     }
     pageCounter++;
 });

 // This will display the number of pages in the center
 config.title.text += pageCounter;
 
 /**
  * TODO Sort stacked series, too
  */
 
 Object.keys(series_labels).sort().forEach(function (series_label) {
     series_labels[series_label] = series.length
 
     series.push({
         name: series_label,
         type: CHART_TYPE_SELECTED.chart.type,
         data: [],
         innerSize: '50%'
     })
 
 })
 
 Object.keys(data).forEach(function (key) {
     let currentDataItem = {
         name: data[key].name,
         y: data[key].count
     }
     let seriesId = series_labels[data[key].series]
 
     if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series_internal)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series_internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].internal)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].name)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].name]
     }
 
     series[seriesId].data.push(currentDataItem)
 })
 
 /**
  * Add empty entries to series and sort them
  */
  let allDataKeys = [];
  Object.keys(data).forEach(function (key) {
      let label = data[key].name;
      if (allDataKeys.indexOf(label) !== -1) {
          return;
      }
  
      series.forEach(function (serie) {
          if (!serie.data.some(function (data) {
                  return data.name === label
              })) {
              serie.data.push({
                  name: label,
                  y: 0
              })
          }
      })
      allDataKeys.push(label)
  })
 
 /**
  * sort series.data by name
  */
 series.forEach(function (serie) {
     serie.data.sort(function (a, b) {
         if (!a.hasOwnProperty('name') || a.name == b.name) {
             return 0
         }
         /**
          * sort depending on CHART_SORT_ASCENDING
          */
         return ((CHART_SORT_ASCENDING && a.name > b.name) || (!CHART_SORT_ASCENDING && a.name < b.name)) ? 1 : -1
     })
 })
 
 /**
  * ============
  * OUTPUT STAGE
  * ============ 
  */
 
 config.series = series;
 return config;
 
 /**
  * ==================
  * BUSINESS FUNCTIONS
  * ==================
  */
 
 /**
  * ================
  * HELPER FUNCTIONS
  * ================
  */
 
 /**
  * 
  * @param {object} value 
  * @param {Number} weight 
  * @param {object} series 
  * @param {object[]} data 
  * @param {object[]} categories 
  * @param {String[]} series_labels 
  */
 function addSeriesData(value, weight, series, data, categories, series_labels) {
     let key = value.value + series.value;
 
     if (data[key] === undefined) {
         data[key] = {
             count: 0,
             name: value.label,
             internal: value.value,
             series: series.label,
             series_internal: series.value
         }
     }
 
     data[key].count += weight || 1;
 
     if (!categories.hasOwnProperty(data[key].name)) {
         categories[data[key].name] = 0
     }
 
     if (!series_labels.hasOwnProperty(data[key].series)) {
         series_labels[data[key].series] = 0
     }
 }
 
 
 /**
  * 
  * @param {Page} page 
  * @param {object} attribute 
  * @returns 
  */
 function getValueAndLabelOfAttribute(page, attribute) {
     let result = null;
     if (!page) {
         return result;
     }
     if (!attribute) {
         return {
             value: page.getRealUid(),
             label: page.getName()
         };
     }
 
     let value = page.get(attribute, false);
     if (value === null) {
         return result;
     }
     let value_label = page.get(attribute, true) || value;
 
     let className = typeof value === 'object' ? String(value.getClass()) : 'String'
 
     switch (className) {
         case 'String':
         case 'class java.lang.String':
             result = {
                 value: value,
                 label: value_label
             }
             break;
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedGroup':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
             result = {
                 value: value.getRealUid(),
                 label: value.getName()
             }
             break;
         case 'class java.util.ArrayList':
         case 'class com.google.common.collect.SingletonImmutableList':
         case 'class com.google.common.collect.RegularImmutableList':
             /**
              * TODO Multi-Value
              */
             result = [];
             cplace.each(value, function (item) {
                 if (typeof item !== 'object' || String(item.getClass()) === 'class java.lang.String') {
                     /**
                      * FIXME enum label / enum internal name
                      */
                     result.push({
                         value: item,
                         label: item
                     })
                 } else {
                     result.push({
                         value: item.getRealUid(),
                         label: item.getName()
                     })
                 }
             })
             break;
         default:
             /**
              * TODO Reference
              */
             log('Class of ' + value + ' is "' + value.class + '"')
             log(typeof value.class)
             log(typeof value)
     }
 
     return result
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

//------------------------------------------------------------------------------------------------------

var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  message: {
    en: '<p style="font-size: 14px; margin-left: 5px;color:#343C4C">Check the actuality of the Key Result Confidence Levels.</p> ',
    de: 'Überprüfen Sie die Aktualität der Key Result Confidence Levels. '
  }
}

return messages.message[lang]

//------------------------------------------------------------------------------------------------------

/// <reference path="../../typeDefinitions/globals.d.ts" />

/**
 * Description
 * @author 
 */

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
 
 const REF_ATTRIBUTE = 'cf.cplace.solution.okr.set';

 // Everything older than this will be flaged als "outdated"
 const THRESHOLD_DAYS = 14;
 
 const ACTIONS = {
    DEFAULT: 'DEFAULT',
 }
 //--------------------------------------------------------------------------------------//
 //                                       INITIALIZATION                                 //
 //--------------------------------------------------------------------------------------//
 
return {
    // "checkAccess" function will check if the button should be enabled given the current context
    checkAccess: function() {
        return true; // Allowed for all users
    },
    // "call" function contains the actual business logic and can optionally return an object
    // containing a success message
    call: function() {
        log('Starting Low-Code button script execution');

        doBusinessAction(embeddingPage)
        
        return {
           message: {
             de: 'Erfolgreich beendet',
             en: 'Finished successfully'
           }
        }
    }
}

//--------------------------------------------------------------------------------------//
//                                       BUSINESS LOGIC                                 //
//--------------------------------------------------------------------------------------//
 /**
  * Do the business action
  * 
  * @param {Page} page 
  * @returns {Object}
  */
  function doBusinessAction(page) {
    let allResults = page.getIncomingPages('cf.cplace.solution.okr.progress', REF_ATTRIBUTE);

    allResults.forEach(function(result) {
       checkAndUpdatePage(result);
    });
    cplace.actions().refresh();

    return {
        success: true, // default is true
        //job: jobId, //if your action starts a job and you want to show job modal
        message: 'Outdated results have been flagged.'
    }
}

function checkAndUpdatePage(page) {
   let lastModified = page.get('cf.cplace.solution.okr.lastUpdate');
   let now = new DateTime();

   let refDate = now.minusDays(THRESHOLD_DAYS);

   if (lastModified && refDate.isAfter(lastModified)) {
       updatePage(page);
   }
}

function updatePage(page) {
   log(page.getName());
   cplace.actions().updatePage(page, {
       customAttributes: {
           'cf.cplace.solution.okr.progressIndicator': '#45 outdated'
       }
   });

   page.registerAttributeForRefresh('cf.cplace.solution.okr.progressIndicator');
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

//------------------------------------------------------------------------------------------------------

var set = embeddingPage;
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + orgUnit.getName() + "</div>"

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/// <reference path="./typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 * 
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 * 
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *   
 * 
 * 
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
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
 cplace.setLogName("highchart-template");
 
 /**
  * ===================
  * CONFIGURATION STAGE
  * ===================
  */
 
 /**
  * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
  */
 const CHART_DEFINITION = {
     PIE: {
         chart: {
             type: 'pie'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     SEMICIRCLE: {
         chart: {
             type: 'pie'
         },
         plotOptions: {
             startAngle: -90,
             endAngle: 90,
             center: ['50%', '75%'],
             size: '110%',
             innerSize: '50%'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     BAR: {
         chart: {
             type: 'bar'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
     COLUMN: {
         chart: {
             type: 'column'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
 }
 
 
 
 /**
  * ==================================================================================
  * !!!! CHANGE FROM HERE !!!!
  */
 
 /**
  * Optional: Show a title inside of the chart area
  */
 const CHART_TITLE = ''
 
 /**
  * Set to null or leave blank to use the Pagename
  * 
  * TODO builtinFeatureValue starts with underscore: '_creator'
  */
 const BASE_ATTRIBUTE = 'cf.cplace.solution.okr.progressIndicator';
 
 /**
  * Optional: Stacking is only possible for bar and column charts
  * 
  */
 const STACK_ATTRIBUTE = null;
 
 /**
  * Optional: Define an attribute of the page that acts as weight. If null, each entry has a weight of 1.
  * The weight is used as sum of each datapoint.
  */
 const WEIGHT_ATTRIBUTE = null;
 
 /**
  * Define the base type of the chart: 
  * - CHART_DEFINITION.PIE
  * - CHART_DEFINITION.SEMICIRCLE
  * - CHART_DEFINITION.BAR
  * - CHART_DEFINITION.COLUMN
  */
 const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;
 
 /**
  * Define colors for the chart
  */
 const CHART_COLORS = {
     BACKGROUND: '#F2F4FA',
     TEXT: 'var(--text-color)',
     SERIES: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
     CATEGORY: {
         '#15 green': '#AEDB3C',
         '#25 yellow': '#FFBA00',
         '#35 red': '#DB0F35',
         '#45 outdated': '#bcbcbc'
     }
 }
 
 /**
  * @type {Boolean} sort axes ascending (true) or descending (false)
  */
 const CHART_SORT_ASCENDING = true;
 
 /**
  * @type {Boolean} show legend under chart
  */
 const CHART_SHOW_LEGEND = false;
 
 /**
  * @type {Boolean} show labels on all datapoints
  */
 const CHART_SHOW_LABELS = false;
 
 /**
  * @type {Boolean} show values as percentage
  */
 const CHART_SHOW_PERCENTAGE = false;
 
 /**
  * @type {null|String} override tooltip text
  * - use {point.y} as placeholder for absolute values
  * - use {point.percentage:.1f}% as placeholder for percantage
  * - use {point.stackTotal} for sum of stack
  * - use {point.name} for name of data point
  * - use {series.name} for name of data series
  */
 const CHART_TOOLTIP_OVERRIDE = null;
 
 
 /**
  * DO NOT CHANGE AFTER THIS LINE
  * ==================================================================================
  */
 
 const CHART_IS_STACKED = !!STACK_ATTRIBUTE && CHART_TYPE_SELECTED.isStackable;
 
 const CHART_POINT_FORMAT = (CHART_TYPE_SELECTED.isPercentageAvailable && CHART_SHOW_PERCENTAGE) ? '{point.percentage:.1f}%' : '{point.y}'
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 
 let config = {
     title: {
         text: CHART_TITLE,
         align: 'center',
         verticalAlign: 'middle',
         margin: 0,
         y: 10,
         useHtml: true,
         style: {
             color: CHART_COLORS.TEXT,
             fontSize: "2em",
             fontWeight: "bold"
         }
     },
     chart: CHART_TYPE_SELECTED.chart,
     legend: {
         enabled: CHART_SHOW_LEGEND,
         layout: 'horizontal',
         align: 'center',
         verticalAlign: 'bottom',
         itemStyle: {
             color: CHART_COLORS.TEXT,
             fontWeight: "normal"
         }
     },
     pane: {
         size: '100%'
     },
     tooltip: {
         pointFormat: '<b>' + CHART_POINT_FORMAT + '</b>'
     },
     plotOptions: {
         pie: {
            borderWidth: 10,
            borderColor: 'var(--body-bg)',
         },
         series: {
             showInLegend: CHART_SHOW_LEGEND,
             dataLabels: {
                 enabled: CHART_SHOW_LABELS,
                 format: '<b>{point.name}</b>: ' + CHART_POINT_FORMAT
             },
             cursor: 'pointer',
             stacking: (CHART_IS_STACKED && CHART_SHOW_PERCENTAGE) ? 'percent' : CHART_IS_STACKED
         }
     },
     colors: CHART_COLORS.SERIES,
     series: [],
     xAxis: {
         type: 'category'
     },
     yAxis: {
         allowDecimals: false,
         title: ''
     }
 }
 
 config.chart.backgroundColor = CHART_COLORS.BACKGROUND
 config.chart.spacingBottom = 0
 config.chart.spacingTop = 0
 
 if (CHART_TITLE && CHART_SHOW_LEGEND && CHART_TYPE_SELECTED.hasFloatingTitle) {
     config.title.verticalAlign = 'top'
 }
 
 if (CHART_TYPE_SELECTED.plotOptions) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type] = CHART_TYPE_SELECTED.plotOptions;
 }
 
 if (CHART_IS_STACKED) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type].colorByPoint = false;
     config.tooltip.pointFormat = '{series.name}: ' + CHART_POINT_FORMAT + '<br/>Total: {point.stackTotal}'
     config.plotOptions.series.dataLabels.format = '{series.name}: ' + CHART_POINT_FORMAT
 }
 
 if (CHART_TOOLTIP_OVERRIDE !== null) {
     config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
 }
 
 
 /**
  * ================
  * PROCESSING STAGE
  * ================ 
  */
 if (pages.length === 0) {
     return config
 }
 
 let datasetSize = pages.length;
 let series = [];
 let series_labels = {};
 let categories = {};
 let data = {};
 let pageCounter = 0;
 pages.forEach(function (page) {
     let value = getValueAndLabelOfAttribute(page, BASE_ATTRIBUTE)
     let weight = 1;
     if (value === null) {
         return
     }
 
     let series = getValueAndLabelOfAttribute(page, STACK_ATTRIBUTE);
 
     if (!CHART_IS_STACKED || series === null) {
         series = {
             value: '',
             label: CHART_TITLE
         }
     }
 
     if (WEIGHT_ATTRIBUTE) {
         weight = page.get(WEIGHT_ATTRIBUTE) || 1
     }
 
     if (value.length) {
         value.forEach(function (item) {
             addSeriesData(item, weight, series, data, categories, series_labels)
         })
     } else {
         addSeriesData(value, weight, series, data, categories, series_labels)
     }
     pageCounter++;
 });

 // This will display the number of pages in the center
 config.title.text += pageCounter;
 
 /**
  * TODO Sort stacked series, too
  */
 
 Object.keys(series_labels).sort().forEach(function (series_label) {
     series_labels[series_label] = series.length
 
     series.push({
         name: series_label,
         type: CHART_TYPE_SELECTED.chart.type,
         data: [],
         innerSize: '50%'
     })
 
 })
 
 Object.keys(data).forEach(function (key) {
     let currentDataItem = {
         name: data[key].name,
         y: data[key].count
     }
     let seriesId = series_labels[data[key].series]
 
     if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series_internal)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series_internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].internal)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].name)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].name]
     }
 
     series[seriesId].data.push(currentDataItem)
 })
 
 /**
  * Add empty entries to series and sort them
  */
  let allDataKeys = [];
  Object.keys(data).forEach(function (key) {
      let label = data[key].name;
      if (allDataKeys.indexOf(label) !== -1) {
          return;
      }
  
      series.forEach(function (serie) {
          if (!serie.data.some(function (data) {
                  return data.name === label
              })) {
              serie.data.push({
                  name: label,
                  y: 0
              })
          }
      })
      allDataKeys.push(label)
  })
 
 /**
  * sort series.data by name
  */
 series.forEach(function (serie) {
     serie.data.sort(function (a, b) {
         if (!a.hasOwnProperty('name') || a.name == b.name) {
             return 0
         }
         /**
          * sort depending on CHART_SORT_ASCENDING
          */
         return ((CHART_SORT_ASCENDING && a.name > b.name) || (!CHART_SORT_ASCENDING && a.name < b.name)) ? 1 : -1
     })
 })
 
 /**
  * ============
  * OUTPUT STAGE
  * ============ 
  */
 
 config.series = series;
 return config;
 
 /**
  * ==================
  * BUSINESS FUNCTIONS
  * ==================
  */
 
 /**
  * ================
  * HELPER FUNCTIONS
  * ================
  */
 
 /**
  * 
  * @param {object} value 
  * @param {Number} weight 
  * @param {object} series 
  * @param {object[]} data 
  * @param {object[]} categories 
  * @param {String[]} series_labels 
  */
 function addSeriesData(value, weight, series, data, categories, series_labels) {
     let key = value.value + series.value;
 
     if (data[key] === undefined) {
         data[key] = {
             count: 0,
             name: value.label,
             internal: value.value,
             series: series.label,
             series_internal: series.value
         }
     }
 
     data[key].count += weight || 1;
 
     if (!categories.hasOwnProperty(data[key].name)) {
         categories[data[key].name] = 0
     }
 
     if (!series_labels.hasOwnProperty(data[key].series)) {
         series_labels[data[key].series] = 0
     }
 }
 
 
 /**
  * 
  * @param {Page} page 
  * @param {object} attribute 
  * @returns 
  */
 function getValueAndLabelOfAttribute(page, attribute) {
     let result = null;
     if (!page) {
         return result;
     }
     if (!attribute) {
         return {
             value: page.getRealUid(),
             label: page.getName()
         };
     }
 
     let value = page.get(attribute, false);
     if (value === null) {
         return result;
     }
     let value_label = page.get(attribute, true) || value;
 
     let className = typeof value === 'object' ? String(value.getClass()) : 'String'
 
     switch (className) {
         case 'String':
         case 'class java.lang.String':
             result = {
                 value: value,
                 label: value_label
             }
             break;
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedGroup':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
             result = {
                 value: value.getRealUid(),
                 label: value.getName()
             }
             break;
         case 'class java.util.ArrayList':
         case 'class com.google.common.collect.SingletonImmutableList':
         case 'class com.google.common.collect.RegularImmutableList':
             /**
              * TODO Multi-Value
              */
             result = [];
             cplace.each(value, function (item) {
                 if (typeof item !== 'object' || String(item.getClass()) === 'class java.lang.String') {
                     /**
                      * FIXME enum label / enum internal name
                      */
                     result.push({
                         value: item,
                         label: item
                     })
                 } else {
                     result.push({
                         value: item.getRealUid(),
                         label: item.getName()
                     })
                 }
             })
             break;
         default:
             /**
              * TODO Reference
              */
             log('Class of ' + value + ' is "' + value.class + '"')
             log(typeof value.class)
             log(typeof value)
     }
 
     return result
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

//------------------------------------------------------------------------------------------------------

var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  message: {
    en: '<p style="font-size: 14px; margin-left: 5px;color:#343C4C">Enter your progress and submit your Key Result Updates. </p>',
    de: 'Tragen sie Ihren Fortschritt ein und reichen Sie Ihr Key Result Updates ein. '
  }
}

return messages.message[lang]

//------------------------------------------------------------------------------------------------------

/// <reference path="../../typeDefinitions/cplaceJS_type.js" />

 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 const DEBUG = true;

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

 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//

function updatePage(progress) {

  cplace.actions().updatePage(progress, {
    customAttributes: {
        'cf.cplace.solution.okr.lastUpdate': new DateTime()
    }
  });
}

return {
    // "checkAccess" function will check if the button should be enabled given the current context
    checkAccess: function() {
        return true; // Allowed for all users
    },
    // "call" function contains the actual business logic and can optionally return an object
    // containing a success message
    call: function() {
        log('Starting Low-Code button script "okr-submitResults" execution');
        let allResults = embeddingPage.getIncomingPages('cf.cplace.solution.okr.progress', 'cf.cplace.solution.okr.objective');

        allResults.forEach(function(result) {
          updatePage(result);
       });
       cplace.actions().refresh();

        return {
           message: {
             de: 'Erfolgreich beendet',
             en: 'Finished successfully'
           }
        }
    }
}

//------------------------------------------------------------------------------------------------------

var objective = embeddingPage;
var set = objective.get('cf.cplace.solution.okr.set');
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>"+set.getName()+"</div>"

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/// <reference path="./typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 * 
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 * 
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *   
 * 
 * 
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
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
 cplace.setLogName("highchart-template");
 
 /**
  * ===================
  * CONFIGURATION STAGE
  * ===================
  */
 
 /**
  * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
  */
 const CHART_DEFINITION = {
     PIE: {
         chart: {
             type: 'pie'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     SEMICIRCLE: {
         chart: {
             type: 'pie'
         },
         plotOptions: {
             startAngle: -90,
             endAngle: 90,
             center: ['50%', '75%'],
             size: '110%',
             innerSize: '50%'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     BAR: {
         chart: {
             type: 'bar'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
     COLUMN: {
         chart: {
             type: 'column'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
 }
 
 
 
 /**
  * ==================================================================================
  * !!!! CHANGE FROM HERE !!!!
  */
 
 /**
  * Optional: Show a title inside of the chart area
  */
 const CHART_TITLE = ''
 
 /**
  * Set to null or leave blank to use the Pagename
  * 
  * TODO builtinFeatureValue starts with underscore: '_creator'
  */
 const BASE_ATTRIBUTE = 'cf.cplace.solution.okr.progressIndicator';
 
 /**
  * Optional: Stacking is only possible for bar and column charts
  * 
  */
 const STACK_ATTRIBUTE = null;
 
 /**
  * Optional: Define an attribute of the page that acts as weight. If null, each entry has a weight of 1.
  * The weight is used as sum of each datapoint.
  */
 const WEIGHT_ATTRIBUTE = null;
 
 /**
  * Define the base type of the chart: 
  * - CHART_DEFINITION.PIE
  * - CHART_DEFINITION.SEMICIRCLE
  * - CHART_DEFINITION.BAR
  * - CHART_DEFINITION.COLUMN
  */
 const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;
 
 /**
  * Define colors for the chart
  */
 const CHART_COLORS = {
     BACKGROUND: '#F2F4FA',
     TEXT: 'var(--text-color)',
     SERIES: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
     CATEGORY: {
         '#15 green': '#AEDB3C',
         '#25 yellow': '#FFBA00',
         '#35 red': '#DB0F35',
         '#45 outdated': '#bcbcbc'
     }
 }
 
 /**
  * @type {Boolean} sort axes ascending (true) or descending (false)
  */
 const CHART_SORT_ASCENDING = true;
 
 /**
  * @type {Boolean} show legend under chart
  */
 const CHART_SHOW_LEGEND = false;
 
 /**
  * @type {Boolean} show labels on all datapoints
  */
 const CHART_SHOW_LABELS = false;
 
 /**
  * @type {Boolean} show values as percentage
  */
 const CHART_SHOW_PERCENTAGE = false;
 
 /**
  * @type {null|String} override tooltip text
  * - use {point.y} as placeholder for absolute values
  * - use {point.percentage:.1f}% as placeholder for percantage
  * - use {point.stackTotal} for sum of stack
  * - use {point.name} for name of data point
  * - use {series.name} for name of data series
  */
 const CHART_TOOLTIP_OVERRIDE = null;
 
 
 /**
  * DO NOT CHANGE AFTER THIS LINE
  * ==================================================================================
  */
 
 const CHART_IS_STACKED = !!STACK_ATTRIBUTE && CHART_TYPE_SELECTED.isStackable;
 
 const CHART_POINT_FORMAT = (CHART_TYPE_SELECTED.isPercentageAvailable && CHART_SHOW_PERCENTAGE) ? '{point.percentage:.1f}%' : '{point.y}'
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 
 let config = {
     title: {
         text: CHART_TITLE,
         align: 'center',
         verticalAlign: 'middle',
         margin: 0,
         y: 10,
         useHtml: true,
         style: {
             color: CHART_COLORS.TEXT,
             fontSize: "2em",
             fontWeight: "bold"
         }
     },
     chart: CHART_TYPE_SELECTED.chart,
     legend: {
         enabled: CHART_SHOW_LEGEND,
         layout: 'horizontal',
         align: 'center',
         verticalAlign: 'bottom',
         itemStyle: {
             color: CHART_COLORS.TEXT,
             fontWeight: "normal"
         }
     },
     pane: {
         size: '100%'
     },
     tooltip: {
         pointFormat: '<b>' + CHART_POINT_FORMAT + '</b>'
     },
     plotOptions: {
         pie: {
            borderWidth: 10,
            borderColor: 'var(--body-bg)',
         },
         series: {
             showInLegend: CHART_SHOW_LEGEND,
             dataLabels: {
                 enabled: CHART_SHOW_LABELS,
                 format: '<b>{point.name}</b>: ' + CHART_POINT_FORMAT
             },
             cursor: 'pointer',
             stacking: (CHART_IS_STACKED && CHART_SHOW_PERCENTAGE) ? 'percent' : CHART_IS_STACKED
         }
     },
     colors: CHART_COLORS.SERIES,
     series: [],
     xAxis: {
         type: 'category'
     },
     yAxis: {
         allowDecimals: false,
         title: ''
     }
 }
 
 config.chart.backgroundColor = CHART_COLORS.BACKGROUND
 config.chart.spacingBottom = 0
 config.chart.spacingTop = 0
 
 if (CHART_TITLE && CHART_SHOW_LEGEND && CHART_TYPE_SELECTED.hasFloatingTitle) {
     config.title.verticalAlign = 'top'
 }
 
 if (CHART_TYPE_SELECTED.plotOptions) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type] = CHART_TYPE_SELECTED.plotOptions;
 }
 
 if (CHART_IS_STACKED) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type].colorByPoint = false;
     config.tooltip.pointFormat = '{series.name}: ' + CHART_POINT_FORMAT + '<br/>Total: {point.stackTotal}'
     config.plotOptions.series.dataLabels.format = '{series.name}: ' + CHART_POINT_FORMAT
 }
 
 if (CHART_TOOLTIP_OVERRIDE !== null) {
     config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
 }
 
 
 /**
  * ================
  * PROCESSING STAGE
  * ================ 
  */
 if (pages.length === 0) {
     return config
 }
 
 let datasetSize = pages.length;
 let series = [];
 let series_labels = {};
 let categories = {};
 let data = {};
 let pageCounter = 0;
 pages.forEach(function (page) {
     let value = getValueAndLabelOfAttribute(page, BASE_ATTRIBUTE)
     let weight = 1;
     if (value === null) {
         return
     }
 
     let series = getValueAndLabelOfAttribute(page, STACK_ATTRIBUTE);
 
     if (!CHART_IS_STACKED || series === null) {
         series = {
             value: '',
             label: CHART_TITLE
         }
     }
 
     if (WEIGHT_ATTRIBUTE) {
         weight = page.get(WEIGHT_ATTRIBUTE) || 1
     }
 
     if (value.length) {
         value.forEach(function (item) {
             addSeriesData(item, weight, series, data, categories, series_labels)
         })
     } else {
         addSeriesData(value, weight, series, data, categories, series_labels)
     }
     pageCounter++;
 });

 // This will display the number of pages in the center
 config.title.text += pageCounter;
 
 /**
  * TODO Sort stacked series, too
  */
 
 Object.keys(series_labels).sort().forEach(function (series_label) {
     series_labels[series_label] = series.length
 
     series.push({
         name: series_label,
         type: CHART_TYPE_SELECTED.chart.type,
         data: [],
         innerSize: '50%'
     })
 
 })
 
 Object.keys(data).forEach(function (key) {
     let currentDataItem = {
         name: data[key].name,
         y: data[key].count
     }
     let seriesId = series_labels[data[key].series]
 
     if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series_internal)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series_internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].internal)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].name)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].name]
     }
 
     series[seriesId].data.push(currentDataItem)
 })
 
 /**
  * Add empty entries to series and sort them
  */
  let allDataKeys = [];
  Object.keys(data).forEach(function (key) {
      let label = data[key].name;
      if (allDataKeys.indexOf(label) !== -1) {
          return;
      }
  
      series.forEach(function (serie) {
          if (!serie.data.some(function (data) {
                  return data.name === label
              })) {
              serie.data.push({
                  name: label,
                  y: 0
              })
          }
      })
      allDataKeys.push(label)
  })
 
 /**
  * sort series.data by name
  */
 series.forEach(function (serie) {
     serie.data.sort(function (a, b) {
         if (!a.hasOwnProperty('name') || a.name == b.name) {
             return 0
         }
         /**
          * sort depending on CHART_SORT_ASCENDING
          */
         return ((CHART_SORT_ASCENDING && a.name > b.name) || (!CHART_SORT_ASCENDING && a.name < b.name)) ? 1 : -1
     })
 })
 
 /**
  * ============
  * OUTPUT STAGE
  * ============ 
  */
 
 config.series = series;
 return config;
 
 /**
  * ==================
  * BUSINESS FUNCTIONS
  * ==================
  */
 
 /**
  * ================
  * HELPER FUNCTIONS
  * ================
  */
 
 /**
  * 
  * @param {object} value 
  * @param {Number} weight 
  * @param {object} series 
  * @param {object[]} data 
  * @param {object[]} categories 
  * @param {String[]} series_labels 
  */
 function addSeriesData(value, weight, series, data, categories, series_labels) {
     let key = value.value + series.value;
 
     if (data[key] === undefined) {
         data[key] = {
             count: 0,
             name: value.label,
             internal: value.value,
             series: series.label,
             series_internal: series.value
         }
     }
 
     data[key].count += weight || 1;
 
     if (!categories.hasOwnProperty(data[key].name)) {
         categories[data[key].name] = 0
     }
 
     if (!series_labels.hasOwnProperty(data[key].series)) {
         series_labels[data[key].series] = 0
     }
 }
 
 
 /**
  * 
  * @param {Page} page 
  * @param {object} attribute 
  * @returns 
  */
 function getValueAndLabelOfAttribute(page, attribute) {
     let result = null;
     if (!page) {
         return result;
     }
     if (!attribute) {
         return {
             value: page.getRealUid(),
             label: page.getName()
         };
     }
 
     let value = page.get(attribute, false);
     if (value === null) {
         return result;
     }
     let value_label = page.get(attribute, true) || value;
 
     let className = typeof value === 'object' ? String(value.getClass()) : 'String'
 
     switch (className) {
         case 'String':
         case 'class java.lang.String':
             result = {
                 value: value,
                 label: value_label
             }
             break;
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedGroup':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
             result = {
                 value: value.getRealUid(),
                 label: value.getName()
             }
             break;
         case 'class java.util.ArrayList':
         case 'class com.google.common.collect.SingletonImmutableList':
         case 'class com.google.common.collect.RegularImmutableList':
             /**
              * TODO Multi-Value
              */
             result = [];
             cplace.each(value, function (item) {
                 if (typeof item !== 'object' || String(item.getClass()) === 'class java.lang.String') {
                     /**
                      * FIXME enum label / enum internal name
                      */
                     result.push({
                         value: item,
                         label: item
                     })
                 } else {
                     result.push({
                         value: item.getRealUid(),
                         label: item.getName()
                     })
                 }
             })
             break;
         default:
             /**
              * TODO Reference
              */
             log('Class of ' + value + ' is "' + value.class + '"')
             log(typeof value.class)
             log(typeof value)
     }
 
     return result
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

//------------------------------------------------------------------------------------------------------

var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  message: {
    en: '<p style="font-size: 14px; margin-left: 10px;color:#343C4C">Enter your progress and submit your Key Result Update. </p>',
    de: 'Tragen sie Ihren Fortschritt ein und reichen Sie Ihr Key Result Update ein. '
  }
}

return messages.message[lang]

//------------------------------------------------------------------------------------------------------

/// <reference path="../../typeDefinitions/cplaceJS_type.js" />

 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 const DEBUG = true;

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

 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//

 

return {
    // "checkAccess" function will check if the button should be enabled given the current context
    checkAccess: function() {
        return true; // Allowed for all users
    },
    // "call" function contains the actual business logic and can optionally return an object
    // containing a success message
    call: function() {
        log('Starting Low-Code button script "submitResult" execution');
        let progress = embeddingPage.get('cf.cplace.solution.okr.progress');

        cplace.actions().updatePage(progress, {
            customAttributes: {
                'cf.cplace.solution.okr.lastUpdate': new DateTime()
            }
        });
        progress.registerAttributeForRefresh('cf.cplace.solution.okr.lastUpdate');
        return {
           message: {
             de: 'Erfolgreich beendet',
             en: 'Finished successfully'
           }
        }
    }
}

//------------------------------------------------------------------------------------------------------

/// <reference path="../../typeDefinitions/cplaceJS_type.js" />

 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 const DEBUG = true;

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

 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//

 

return {
    // "checkAccess" function will check if the button should be enabled given the current context
    checkAccess: function() {
        return true; // Allowed for all users
    },
    // "call" function contains the actual business logic and can optionally return an object
    // containing a success message
    call: function() {
        log('Starting Low-Code button script execution');


        cplace.actions().updatePage(embeddingPage, {
            customAttributes: {
                'cf.cplace.solution.okr.lastUpdate': new DateTime()
            }
        });
        
        return {
           message: {
             de: 'Erfolgreich beendet',
             en: 'Finished successfully'
           }
        }
    }
}

//------------------------------------------------------------------------------------------------------

var keyResult = embeddingPage;
var objective = keyResult.get('cf.cplace.solution.okr.objective');
var set = objective.get('cf.cplace.solution.okr.set');
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>"+objective.getName()+"</div>"

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/*
*Highchart
*Displays the version history of the confidencelevel of keyResult type
*/

function generateData(embeddingPage) {
    let data = [];

    let confidenceValue = embeddingPage.getVersionHistoryOfAttribute('cf.cplace.solution.okr.confidenceLevel');
    if (confidenceValue.length > 1) {
        data = [{ y: 0, date: null }];
        cplace.each(confidenceValue, function (cv) {
            // cplace.log(cv.getNewValue());
            let cvValue = cv.getNewValue() ? cv.getNewValue().toString() : '';
            let cvDate = cv.getWhen();
            let lastThree = cvValue.substr(cvValue.length - 3);
            if (cvValue) {
                data.push({
                    y: parseFloat(lastThree),
                    date: cvDate.toString()
                });
            } else {
                data.push({
                    y: 0.5,
                    date: cvDate.toString()
                })
            }
        })
        data.push({ y: 1, date: null })
    }
    //cplace.log(data);
    return data;
}


function main() {
    const dataObj = generateData(embeddingPage);
    return {
        chart: {
            height: 200,
            backgroundColor: '#F2F4FA'
        },
        title: {
            text: '<b>Confidence Value: ' + embeddingPage.get('cf.cplace.solution.okr.confidenceLevel') + '</b>',
            align: 'center',
            useHtml: true
        },
        xAxis: {
            reversed: true,
            min: 1,
            max: dataObj.length - 2,
            labels: {
                enabled: false
            },
            lineColor: '#fcfcfc',
            tickLength: 1,
            showLastLabel: false,
        },
        yAxis: {
            title: '',
            min: 0,
            max: 1,
            labels: {
                enabled: false
            },
            gridLineColor: 'rgba(255,255,255,0)',
            lineColor: '#ffffff',
        },
        plotOptions: {
            series: {
                lineWidth: 7,
                tickWidth: 10,
                marker: {
                    fillColor: 'rgba(0,0,0,.1)',
                    radius: 6
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            data: dataObj,
            name: 'Confidence Levels',
            color: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgba(174,219,60,1)'],
                    [0.5, 'rgba(255,186,0,1)'],
                    [1, 'rgba(219,15,53,1)']
                ]
            },
        }],
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: 'Confidence Level: ' + '<b>{point.y}</b><br>',
            pointFormat: '--<br>{point.date}',
        }
    }
}

return main();

//------------------------------------------------------------------------------------------------------

/*
*Highcahrt
*Displays the organisation chart
*/

cplace.setLogName('hc_organisation_chart');


/// <reference path="../../typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 *
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 *
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *
 *
 *
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
 */

/**
 * ======================
 * LOG AND DEBUG SETTINGS
 * ======================
 */
const DEBUG = false;

/**
 * Hint: set a declarative name for all of your logs
 */
cplace.setLogName("highchart-template");

/**
 * ===================
 * CONFIGURATION STAGE
 * ===================
 */

/**
 * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
 */
const CHART_DEFINITION = {
    PIE: {
        chart: {
            type: "pie",
        },
        isPercentageAvailable: true,
        isStackable: false,
        hasFloatingTitle: false,
    },
    SEMICIRCLE: {
        chart: {
            type: "pie",
        },
        plotOptions: {
            startAngle: -90,
            endAngle: 90,
            center: ["50%", "75%"],
            size: "110%",
            innerSize: "50%",
        },
        isPercentageAvailable: true,
        isStackable: false,
        hasFloatingTitle: false,
    },
    BAR: {
        chart: {
            type: "bar",
        },
        plotOptions: {
            colorByPoint: true,
        },
        isPercentageAvailable: true,
        isStackable: true,
        hasFloatingTitle: true,
    },
    COLUMN: {
        chart: {
            type: "column",
        },
        plotOptions: {
            colorByPoint: true,
        },
        isPercentageAvailable: true,
        isStackable: true,
        hasFloatingTitle: true,
    },
};

/**
 * ==================================================================================
 * !!!! CHANGE FROM HERE !!!!
 */

/**
 * Optional: Show a title inside of the chart area
 */
const CHART_TITLE = "";

/**
 * Define the base type of the chart:
 * - CHART_DEFINITION.PIE
 * - CHART_DEFINITION.SEMICIRCLE
 * - CHART_DEFINITION.BAR
 * - CHART_DEFINITION.COLUMN
 */
const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;

/**
 * Define the color of a node by it's ID.
 */
const PAGE_COLOR_MAP = {
    "Company": "var(--color-company)",
    "Engineering": "var(--color-engineering)",
    "Product": "var(--color-product)",
    "Marketing": "var(--color-marketing)",
    "Sales": "var(--color-sales)",
};
/**
 * Define colors for the chart
 */
const CHART_COLORS = {
    BACKGROUND: "var(--body-bg)",
    TEXT: "var(--text-color)",
    SERIES: ["#e31a1c", "#fdbf6f", "#ff7f00", "#6a3d9a"],
    CATEGORY: {
        "#15 green": "#AEDB3C",
        "#25 yellow": "#FFBA00",
        "#35 red": "#DB0F35",
        "#45 outdated": "#bcbcbc",
    },
};

/**
 * @type {Boolean} show legend under chart
 */
const CHART_SHOW_LEGEND = false;

/**
 * @type {Boolean} show labels on all datapoints
 */
const CHART_SHOW_LABELS = true;

/**
 * @type {null|String} override tooltip text
 * - use {point.y} as placeholder for absolute values
 * - use {point.percentage:.1f}% as placeholder for percantage
 * - use {point.stackTotal} for sum of stack
 * - use {point.name} for name of data point
 * - use {series.name} for name of data series
 */
const CHART_TOOLTIP_OVERRIDE = null;

/**
 * DO NOT CHANGE AFTER THIS LINE
 * ==================================================================================
 */

const CHART_POINT_FORMAT = "{point.y}";

/**
 * ====================
 * INITIALIZATION STAGE
 * ====================
 */
const levelConfig = [
    {
        level: 0,
        color: "silver",
    },
    {
        level: 1,
        color: "#980104",
    },
    {
        level: 2,
        color: "#359154",
    },
];
    let nodes = [];
    let data = [];
    let series = [];
/**
 * ================
 * PROCESSING STAGE
 * ================
 */


function generateData(pages) {


    pages.forEach(function (page) {
        nodes.push(mapToDataNode(page));
        loadChildren(page);
    });
  
  
  
    series.push({
        type: "organization",
        name: "",
        keys: ["from", "to"],
        // Hierarchy definition
        data: data,
        // Styling definiton
        levels: levelConfig,
        // Content definiton (getting matched to "data" by "id")
        nodes: nodes,
    });

    return series
}

function main() {
    let series = generateData(pages);

    if (CHART_TOOLTIP_OVERRIDE !== null) {
        config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
    }

    let config = {
        chart: {
            inverted: true,
            backgroundColor: "#f3f4fa",
        },
        title: {
            text: CHART_TITLE,
            useHtml: true,
            style: {
                color: CHART_COLORS.TEXT,
                fontSize: "2em",
                fontWeight: "bold",
            },
        },
        legend: {
            enabled: CHART_SHOW_LEGEND,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: CHART_COLORS.TEXT,
                fontWeight: "normal",
            },
        },
        pane: {
            size: "100%",
        },
        tooltip: false,
        plotOptions: {
            pie: {
                borderWidth: 10,
                borderColor: "var(--body-bg)",
            },
            series: {
                showInLegend: CHART_SHOW_LEGEND,
                dataLabels: {
                    enabled: CHART_SHOW_LABELS,
                    format: "<b>{point.name}</b><br/><span><b>Set Lead: </b><span>{point.leads}</span></span>",
                },
                cursor: "default",
            },
        },
        colors: CHART_COLORS.SERIES,
        series: series,
    };

    return config

}

return main();

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

function loadChildren(page) {
    let children = page.getIncomingPages(
        "cf.cplace.solution.okr.organizationalUnit",
        "cf.cplace.solution.okr.organizationalUnit"
    );
    
  
    children.forEach(function (child) {
        nodes.push(mapToDataNode(child));
        data.push([page.getId(), child.getId()]);

        // go on
        loadChildren(child);
    });
}

function mapToDataNode(page) {
    let map = {
        id: page.getId(),
        name: page.getName(),
        height: 75,
    };

    let color = PAGE_COLOR_MAP[page.getName()];
    if (color) {
        map.color = color;
    }

    let set = getCurrentSet(page);
    let leads = set.get("cf.cplace.solution.okr.setLead");
    let leadNames = "";
    leads.forEach(function (lead) {
        if (leadNames) {
            leadNames += "<br/>";
        }
        leadNames += lead.getName();
    });

    map.leads = leadNames;
    return map;
  
}



/**
 * ================
 * HELPER FUNCTIONS
 * ================
 */

function getCurrentCycle(page) {
    let search = new Search();
    search
        .add(Filters.type("cf.cplace.solution.okr.cycle"))
        .add(Filters.space(page.getSpace()))
        .add(Filters.customAttribute("cf.cplace.solution.okr.status").eq("#25 Current"));

    return search.findAllPages();
}

function getCurrentSet(unit) {
    let currentCycle = getCurrentCycle(unit);
    let result = null;

    currentCycle.forEach(function (cycle) {
        let search = new Search();
        search
            .add(Filters.type("cf.cplace.solution.okr.set"))
            .add(Filters.space(unit.getSpace()))
            .add(Filters.customAttribute("cf.cplace.solution.okr.cycle").references(cycle))
            .add(Filters.customAttribute("cf.cplace.solution.okr.organizationalUnit").references(unit));

        let sets = search.findAllPages();

        sets.forEach(function (set) {
            result = set;
        });

        return;
    });

    return result;
}
/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    let logOutput = typeof text !== "string" ? JSON.stringify(text) : text;

    cplace.log(logOutput);
}

//------------------------------------------------------------------------------------------------------

var currentUser = cplace.utils().getCurrentUser();

var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
    var messages = {
        message: {
            en: 'Welcome ' + currentUser.getName() + '. You are assigned to the Org. Unit <b>' + orgUnit.getName() +'</b>.',
            de: 'Hallo ' + currentUser.getName() + '. Sie sind der Org. Einheit <b>' + orgUnit.getName() + '</b> zugewiesen.'
        }
    }

    result += "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"
    cplace.log('result'+result)
});

return result;

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/*
*Highchart
*Displays the strategic priorities of different dimensions
*/


/***** Start configuration *****/

const PRIORITY = {
    TYPE: 'cf.cplace.solution.okr.priority',
    ATTR: {
        DATE: 'cf.cplace.solution.okr.date',
        TITLE: 'cf.cplace.solution.okr.title',
        DIMENSION: 'cf.cplace.solution.okr.dimension',
        STRATEGY: 'cf.cplace.solution.okr.strategyDashboard'
    }
}

const chartBackgroundColor = '#F2F4FA';
const todayPlotLineColor = '#244761';
const roadmapDimensions = ['Marketing', 'Sales', 'Engineering', 'Product', 'Company'];
const roadmapDimensionColors = ['#2364AA', '#3DA5D9', '#73BFB8', '#FEC601', '#f72585'];
const plotBandColorSuffix = '40';	// alpha value in hex
const plotLineColor = '#ffffff';
const milestoneSize = 7;

/***** End configuration *****/

function generateData(pages) {

    let dataObj = {
        categories: [], plotLines: [], plotBands: [], series: createSeries(), firstDate: null,
        lastDate: null
    }
    let yIndex = 0,
        yIndexStart = 0,
        lastRoadmapItemGroup = null;


    // loop each roadmap dimension and roadmap item
    roadmapDimensions.forEach(function (roadmapDimension, idx) {
        // Prepare roadmap items for current dimension
        let roadmapItemsByDimension = [];
        cplace.each(pages, function (roadmapItem) {
            if (roadmapDimension == roadmapItem.get(PRIORITY.ATTR.DIMENSION).getName()) {
                roadmapItemsByDimension.push(roadmapItem);
                // eval maximum axis extent
                let date = roadmapItem.get(PRIORITY.ATTR.DATE);
                dataObj.firstDate = (dataObj.firstDate == null || date.isBefore(dataObj.firstDate) ? date : dataObj.firstDate);
                dataObj.lastDate = (dataObj.lastDate == null || date.isAfter(dataObj.lastDate) ? date : dataObj.lastDate);
            }
        });

        /*
        // quarters as categories for x-axis (if *not* using datetime)
        let quarterDate = firstDate.withDayOfMonth(1).withMonthOfYear((((firstDate.getMonthOfYear() - 1) / 3) * 3) + 1);
        let lastDateShown = lastDate.plusMonths(5).plusWeeks(2);
        while (quarterDate.isBefore(lastDateShown)) {
          categories.push(quarterDate);
          quarterDate = quarterDate.plusMonths(3);
        }
        */

        yIndex++;
        yIndexStart = yIndex;
        yIndex++;

        roadmapItemsByDimension.sort(function (a, b) {
            let dateA = Date.parse(a.get('cf.cplace.solution.okr.date'));
            let dateB = Date.parse(b.get('cf.cplace.solution.okr.date'));

            const groupA = a.get('cf.cplace.solution.okr.roadmapItemGroup');
            const groupB = b.get('cf.cplace.solution.okr.roadmapItemGroup');
            if (groupA != null && groupB == null) {
                return -1;
            }
            if (groupA == null && groupB != null) {
                return 1;
            }
            if (groupA != null && groupB != null && groupA.getId() != groupB.getId()) {
                dateA = Date.parse(groupA.getBuiltinFeatureValue("createdAt"));
                dateB = Date.parse(groupB.getBuiltinFeatureValue("createdAt"));
            }

            return dateA - dateB;
        });

        lastRoadmapItemGroup = null;
        roadmapItemsByDimension.forEach(function (roadmapItem, idx2) {
            let date = roadmapItem.get(PRIORITY.ATTR.DATE);

            if (date) {
                let name = roadmapItem.getName();
                let url = roadmapItem.getUrl();

                // separate item groups by a line
                let roadmapItemGroup = roadmapItem.get('cf.cplace.solution.okr.roadmapItemGroup');
                let group = (roadmapItemGroup != null ? roadmapItemGroup.getName() : null);
                if ((lastRoadmapItemGroup == null && roadmapItemGroup != null && idx2 > 0)
                    || (lastRoadmapItemGroup != null && roadmapItemGroup == null)
                    || lastRoadmapItemGroup != null && roadmapItemGroup != null && lastRoadmapItemGroup.getId() != roadmapItemGroup.getId()) {
                    dataObj.plotLines.push(createPlotline(yIndex));
                    yIndex++;
                }

                /*
                let q = 0;
                while (q < categories.length && categories[q].isBefore(date)) {
                  q++;
                }
                */

                let dataItem = createDataItem(group, name, url, new Date(date), yIndex, roadmapDimensionColors[idx]);
                dataObj.series.data.push(dataItem);

                // remember last item group for pairing/separating them
                lastRoadmapItemGroup = roadmapItemGroup;
                yIndex++;
            }
        });

        // group whole dimension into a band
        if (roadmapItemsByDimension.length > 0) {
            dataObj.plotBands.push(createPlotband(roadmapDimension, yIndexStart, yIndex, roadmapDimensionColors[idx]));
        }

    });
    return dataObj;
}

function createSeries() {
    return {
        showInLegend: false,
        type: 'scatter',
        data: []
    };
}

function createDataItem(group, name, url, date, y, color) {
    return {
        tooltip: (group != null ? group + " - " : "") + name,
        name: name,
        url: url,
        x: Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
        y: y,
        color: color
    }
}

function createPlotline(value) {
    return {
        color: plotLineColor,
        width: 1,
        zIndex: 1,
        value: value
    }
}

function createPlotband(name, from, to, color) {
    return {
        from: from,
        to: to,
        label: {
            useHTML: true,
            text: "<h4>" + name + "</h4>",
            rotation: 0,
            x: 5,
            y: -10,
            textAlign: 'left'
        },
        color: color + plotBandColorSuffix
    }
}

function main() {
    let dataObj = generateData(pages);
    // add some months/weeks for displaying enough space on the right for longer labels
    let lastAxisDate = new Date(dataObj.lastDate.plusMonths(5).plusWeeks(2));

    let chart = {
        chart: {
            type: 'xrange',
            backgroundColor: chartBackgroundColor,
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            opposite: true,
            lineColor: chartBackgroundColor,
            tickInterval: 3 * 30 * 24 * 3600 * 1000, // 3 Months
            startOnTick: true,
            max: Date.UTC(lastAxisDate.getFullYear(), lastAxisDate.getMonth(), lastAxisDate.getDate(), 0, 0, 0, 0),
            labels: {
                useHTML: true,
                format: '<h3 style="text-align:center;">{value: %Y<br>Q%Q}</h3>',
                distance: 20,
                x: 50,
                style: {
                    color: '#234965'
                }
            },
            tickLength: 5,
            gridLineWidth: 1,
            gridLineColor: '#ccd6eb',
            gridLineDashStyle: 'Dash',
            plotLines: [{
                value: Date.now(),
                dashStyle: 'dot',
                width: 3,
                color: todayPlotLineColor,
                zIndex: 1,
                label: {
                    align: 'right',
                    y: 36
                }
            }],
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false
            },
            reversed: true,
            gridLineWidth: 0,
            plotLines: dataObj.plotLines,
            plotBands: dataObj.plotBands
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.tooltip}</b><br/>{point.x: %d.%m.%Y}',
            style: {
                pointerEvents: 'auto',
                color: '#234965'
            }
        },
        plotOptions: {
            scatter: {
                findNearestPointBy: 'xy',
                marker: {
                    enabled: true,
                    symbol: 'diamond',
                    radius: milestoneSize
                },
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    color: '#234965',
                    style: {
                        textOutline: 0
                    },
                    format: "<a href='{point.url}'>{point.name}</a>",
                    align: 'left',
                    verticalAlign: 'middle',
                    x: milestoneSize
                },
            }
        },
        series: [dataObj.series]
    };

    return chart;
}

return main();

//------------------------------------------------------------------------------------------------------

var currentUser = cplace.utils().getCurrentUser();
cplace.log(currentUser);
var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
  cplace.log(orgUnit.getName());
  var messages = {
    message: {
      en: 'Strategy',
      de: 'Strategy'
    }
  }

  result += "<div class='custom-stm-dashboard-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"

});

return result;

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

var currentUser = cplace.utils().getCurrentUser();
cplace.log(currentUser);
var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
  cplace.log(orgUnit.getName());
  var messages = {
    message: {
      en: 'Meetings',
      de: 'Meetings'
    }
  }

  result += "<div class='custom-stm-dashboard-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"

});

return result;

//------------------------------------------------------------------------------------------------------

var currentUser = cplace.utils().getCurrentUser();
cplace.log(currentUser);
var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
  cplace.log(orgUnit.getName());
  var messages = {
    message: {
      en: 'OKR Manual',
      de: 'OKR Manual'
    }
  }

  result += "<div class='custom-stm-dashboard-banner' " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"

});

return result;

//------------------------------------------------------------------------------------------------------

/// <reference path="../../typeDefinitions/cplaceJS_type.js" />

 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 const DEBUG = true;

 const preventChange = false;

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

 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//

 function updateCurrentCycle(page, settingsPage) {
   let editorGroups = settingsPage.get('cf.cplace.solution.okr.editors');

   if (preventChange) {
     return;
   }
    cplace.actions().updatePage(page, {
        writers:  {
            'additiveInheritance': false,
            '-': editorGroups // remove these editors
        },
        customAttributes: {
            'cf.cplace.solution.okr.status': '#35 Closed'
        }
    });
 }

 function updateNextCycle(page) {

  if (preventChange) {
    return;
  }
    setInitialDateOnKRs(page);
    cplace.actions().updatePage(page, {
        customAttributes: {
            'cf.cplace.solution.okr.status': '#25 Current'
        }
    });
 }

 function setInitialDateOnKRs(cycle) {
    let results = cycle.getIncomingPages('cf.cplace.solution.okr.progress', 'cf.cplace.solution.okr.cycle');

    let now = new DateTime();
    results.forEach(function(page) {
      if (preventChange) {
        return;
      }
        cplace.actions().updatePage(page, {
            customAttributes: {
                'cf.cplace.solution.okr.lastUpdate': now
            }
        });
    });
 }


return {
    // "checkAccess" function will check if the button should be enabled given the current context
    checkAccess: function() {
        return true; // Allowed for all users
    },
    // "call" function contains the actual business logic and can optionally return an object
    // containing a success message
    call: function() {
        log('Starting switch-to-next-cycle-script');

        let settingsPage = embeddingPage.get('cf.cplace.solution.okr.settings');
        log('Settings:' + settingsPage.getName());

        let currentCycle = settingsPage.get('cf.cplace.solution.okr.currentCycle');
        let nextCycle = additionalData.get('cf.cplace.solution.okr.nextCycle');

        if (!currentCycle) {
            return {
                message: {
                    de: 'Fehler in den Einstellungen, der aktuelle Zyklus ist nicht bekannt.',
                    en: 'Error found in settings - the current cycle is not set.'
                }
            }
        }

        log('Current: ' + currentCycle.getName());
        log('Next: ' + nextCycle.getName());

        updateCurrentCycle(currentCycle, settingsPage);
        updateNextCycle(nextCycle);


        // Everything done, update internal reference
        log('Update reference to next cycle');

        if (!preventChange) {
          cplace.actions().updatePage(settingsPage, {
            customAttributes: {
              'cf.cplace.solution.okr.currentCycle': nextCycle
            }
          });
        }

        return {
           message: {
             de: 'Erfolgreich beendet',
             en: 'Finished successfully'
           }
        }
    }
}

//------------------------------------------------------------------------------------------------------

var currentUser = cplace.utils().getCurrentUser();
cplace.log(currentUser);
var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
  cplace.log(orgUnit.getName());
  var messages = {
    message: {
      en: 'Administration',
      de: 'Administration'
    }
  }

  result += "<div class='custom-stm-dashboard-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"

});

return result;

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

const ATTRIBUTES = {
    MEETING: {
        TYPE: 'cf.cplace.solution.okr.meeting',
        ATTR: {
            MEETING_TYPE: 'cf.cplace.solution.okr.meetingType'
        },
        MEETING_TYPE: {
            ONE_ON_ONE: '#15 - 1on1',
            LEADERASHIP: '#25 - leadership',
            WORKSHOP: '#35 - workshop'
        }
    },
    LAYOUTS: {
        ONE_ON_ONE: 'cf.cplace.solution.okr.layout.1on1',
        LEADERASHIP: 'cf.cplace.solution.okr.layout.leadership',
        WORKSHOP: 'cf.cplace.solution.okr.layout.workshop',
        FILES: 'cf.cplace.solution.okr.layout.files'
    }
}




let layouts = [];
let meetingType = page.get(ATTRIBUTES.MEETING.ATTR.MEETING_TYPE);

switch (meetingType) {
    case ATTRIBUTES.MEETING.MEETING_TYPE.ONE_ON_ONE:
        layouts.push(ATTRIBUTES.LAYOUTS.ONE_ON_ONE);
        break;
    case ATTRIBUTES.MEETING.MEETING_TYPE.LEADERASHIP:
        layouts.push(ATTRIBUTES.LAYOUTS.LEADERASHIP);
        break;
        case ATTRIBUTES.MEETING.MEETING_TYPE.WORKSHOP:
            layouts.push(ATTRIBUTES.LAYOUTS.WORKSHOP);
        break;
    default:
  }

  layouts.push(ATTRIBUTES.LAYOUTS.FILES);


let layoutConfig = {
    layouts: layouts,
    active: layouts[0],
  }
  
  return layoutConfig;

//------------------------------------------------------------------------------------------------------

