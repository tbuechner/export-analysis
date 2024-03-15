/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.capability
 * @attribute cf.cplace.solution.safe.state
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.1
 * @description Sets the start date of the capability once it has entered the funnel and sets the end date once it has been marked as done
 */

const STATUS = /** @type {const} */ ({
    ATTR: "cf.cplace.solution.safe.state",
});

/**
 * Update start and end date depending on the capability status
 */
function main() {
    /** @type {Page<'cf.cplace.solution.safe.capability'>} */
    const page = changeEvent.getEntity();
    const status = page.get(STATUS.ATTR);

    if (status === "#15 - Funnel") {
        cplace.actions().updatePage(page, {
            customAttributes: {
                "cf.cplace.solution.safe.actualStartDate": new DateTime(),
            },
        });
        page.registerAttributeForRefresh("cf.cplace.solution.safe.actualStartDate");
    }
    if (status === "#85 - Done") {
        cplace.actions().updatePage(page, {
            customAttributes: {
                "cf.cplace.solution.safe.actualEndDate": new DateTime(),
            },
        });
        page.registerAttributeForRefresh("cf.cplace.solution.safe.actualEndDate");
    }
}

main();