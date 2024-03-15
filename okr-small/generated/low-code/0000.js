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