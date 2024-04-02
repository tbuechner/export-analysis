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