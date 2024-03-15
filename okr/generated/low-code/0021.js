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