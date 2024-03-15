/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.safeMilestone
 * @attribute cf.cplace.solution.safe.date
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Syncs the milestone date to the start and end date (these are needed for dependencies)
 */

function main() {
    /** @type {Page<'cf.cplace.solution.safe.safeMilestone'>} */
    const safeMilestone = changeEvent.getEntity();

    const date = safeMilestone.get("cf.cplace.solution.safe.date");

    cplace.actions().updatePage(safeMilestone, {
        customAttributes: {
            "cf.cplace.solution.safe.plannedStart": date,
            "cf.cplace.solution.safe.plannedEnd": date,
        },
    });
  safeMilestone.registerAttributeForRefresh('cf.cplace.solution.safe.plannedStart')
  safeMilestone.registerAttributeForRefresh('cf.cplace.solution.safe.plannedEnd')
}
main();