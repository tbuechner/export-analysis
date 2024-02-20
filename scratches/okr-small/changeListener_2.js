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

const page = changeEvent.getEntity();

const keyResultProgress = page.get('cf.cplace.solution.okr.progress');
const currentUser = cplace.utils().getCurrentUser();


// Lege Progress Objekt an
if (changeEvent.isNew() || keyResultProgress === null) {
    cplace.log('page'+page);
    let newProgress = cplace.actions().createPage( {
        customType: 'cf.cplace.solution.okr.progress',
        space: page.getSpaceId(),
        customAttributes: {
            'cf.cplace.solution.okr.keyResult': page
        },
    }, {
        setGeneratedName: true
    });

    //Ändere Progress von Key Result auf neues Objekt
    cplace.actions().updatePage(page, {
        customAttributes: {
            'cf.cplace.solution.okr.progress': newProgress
        }
    });
    page.registerAttributeForRefresh('cf.cplace.solution.okr.progress');
}
return;
