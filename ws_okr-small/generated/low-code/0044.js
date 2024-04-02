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