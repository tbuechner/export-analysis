/*
*Changelistener
*type:Epic
*triggering attributes jobSize,businessValue,timeCriticality,riskReduction
*Calculates Weighted shortest job first
*/

cplace.setLogName('CL: calculate WSJF');

const CAPABILITY = {
    TYPE:'cf.cplace.solution.safe.capability',
    ATTR: {
        JOB_SIZE: 'cf.cplace.solution.safe.jobSize',
        BUSINESS_VALUE: 'cf.cplace.solution.safe.businessValue',
        TIME_CRITICALITY: 'cf.cplace.solution.safe.timeCriticality',
        RISK_REDUCTION: 'cf.cplace.solution.safe.riskReduction',
        WSJF: 'cf.cplace.solution.safe.wsjf'
    }
}

function main(){
const page = changeEvent.getEntity();

// get input parameters for calculation
const jobSize = page.get(CAPABILITY.ATTR.JOB_SIZE);
const businessValue = page.get(CAPABILITY.ATTR.BUSINESS_VALUE);
const timeCriticality = page.get(CAPABILITY.ATTR.TIME_CRITICALITY);
const riskReduction = page.get(CAPABILITY.ATTR.RISK_REDUCTION);

const wSJF = calculateWSJF(jobSize, businessValue, timeCriticality, riskReduction);
cplace.log('wsjf'+wSJF);
updatePage(page, {
    'cf.cplace.solution.safe.wsjf': wSJF
}
);
}

main();

/*
*Calculate the weighted shortest job first(wSJF)
*@template {keyof CplaceTypes} T
*@param {number} jobSizeOfEpic
*@param {number} businessValueOfEpic
*@param {number} timeCriticalityOfEpic
*@param {number} riskReductionOfEpic
*@returns {number} wSJF
*/
function calculateWSJF(jobSizeOfEpic, businessValueOfEpic, timeCriticalityOfEpic, riskReductionOfEpic) {
    let wSJF;
    if (!jobSizeOfEpic || !businessValueOfEpic || !timeCriticalityOfEpic || !riskReductionOfEpic) {
        //no value if any input parameter is missing
        wSJF = null;
    }
    else {
        // CoD = value + time + risk
        let costOfDelay = businessValueOfEpic + timeCriticalityOfEpic + riskReductionOfEpic;
        // WSJF = CoD / size
        wSJF = (jobSizeOfEpic > 0 ? Math.round(costOfDelay / jobSizeOfEpic * 100) / 100 : null);
    }
    return wSJF;
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