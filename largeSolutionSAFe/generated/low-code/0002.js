/**
 * VALIDATOR
 * @customType cf.cplace.solution.safe.solution
 * @attribute cf.cplace.solution.safe.*WIPLimit
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.1
 * @description Checks if the WIP limit is either null or larger than 1
 */

function checkIfWIPLimitIsCorrect() {
    if (page.get(customAttribute) === null) {
        return;
    }
    if (page.get(customAttribute) <= 0) {
        return "WIP Limit must be >= 1 or empty";
    }
}

return checkIfWIPLimitIsCorrect();