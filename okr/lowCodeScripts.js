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

