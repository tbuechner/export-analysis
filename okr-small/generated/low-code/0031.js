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