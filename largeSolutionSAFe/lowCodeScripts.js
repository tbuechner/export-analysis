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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.programIncrement
 * @attribute cf.cplace.solution.safe.title
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Automatically creates a Confidence Vote page upon creation of a Programm Increment
 */

cplace.setLogName("listener_createConfidenceVote")

const CONFIDENCE_VOTE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.confidenceVote",
    ATTR: {
        PROGRAMM_INCREMENT: "cf.cplace.solution.safe.confidenceVote.PI",
        SOLUTION: "cf.cplace.solution.safe.confidenceVote.solution",
    },
});

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
});

function main() {
    if (!changeEvent.isNew()) {
        return;
    }
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programmIncrement = changeEvent.getEntity();
    const solution = programmIncrement.get(PROGRAMM_INCREMENT.ATTR.SOLUTION);

    const confidenceVote = cplace.actions().createPage(
        {
            space: programmIncrement.getSpaceId(),
            customType: CONFIDENCE_VOTE.TYPE,
            customAttributes: {
                [CONFIDENCE_VOTE.ATTR.PROGRAMM_INCREMENT]: programmIncrement,
                [CONFIDENCE_VOTE.ATTR.SOLUTION]: solution,
            },
        },
        { setGeneratedName: true }
    );
    cplace.log(`${confidenceVote.getName()} created`);
}

main()

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.programIncrement
 * @attribute cf.cplace.solution.safe.title
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Automatically set the predecessor of a Program Increment upon creation
 */

cplace.setLogName("listener_setPredecessorOnCreation");

const DEBUG = true;

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor",
    },
    ENUM: {
        PERIOD_STATUS: {
            DONE: "#15 - done",
            ACTIVE: "#25 - active",
        },
    },
});

function main() {
    if (!changeEvent.isNew()) {
        return;
    }
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programmIncrement = changeEvent.getEntity();

    const predecessor = getPreviousPiByDate(programmIncrement);

    if (!predecessor) {
        DEBUG && cplace.log("No predecessor found");
        return;
    }

    DEBUG && cplace.log("Predecessor: " + predecessor);

    cplace.actions().updatePage(programmIncrement, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PREDECESSOR]: predecessor,
        },
    });
    programmIncrement.registerAttributeForRefresh(PROGRAMM_INCREMENT.ATTR.PREDECESSOR);
}

/**
 * Get the previous PI by date
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getPreviousPiByDate(programIncrement) {
    const solution = programIncrement.get("cf.cplace.solution.safe.solution");
    if (!solution) {
        return null;
    }
    const startDate = programIncrement.get(PROGRAMM_INCREMENT.ATTR.START_DATE);
    if (!startDate) {
        return null;
    }

    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const pisOfSolution = Array.from(
        solution.getIncomingPages(PROGRAMM_INCREMENT.TYPE, PROGRAMM_INCREMENT.ATTR.SOLUTION)
    );

    const piDateMap = {};
    pisOfSolution.forEach((pi) => {
        if (pi.getId() == programIncrement.getId()) {
            return;
        }
        piDateMap[pi.getId()] = { date: pi.get(PROGRAMM_INCREMENT.ATTR.START_DATE), page: pi };
    });

    let closestDateDiff = Infinity;
    let closestPageId = null;

    // Find the closest previous PI to the startDate of the programmIncrement
    for (const [pageId, data] of Object.entries(piDateMap)) {
        const pageDate = data.date;
        const dateDiff = Days.daysBetween(pageDate.withTimeAtStartOfDay(), startDate.withTimeAtStartOfDay()).getDays();

        if (dateDiff > 0 && dateDiff < closestDateDiff) {
            closestDateDiff = dateDiff;
            closestPageId = pageId;
        }
    }
    if (!closestPageId) {
        return null;
    }

    return piDateMap[closestPageId].page;
}

main();

//------------------------------------------------------------------------------------------------------

/*ChangeListener on attribute periodStatus of programIncrement type 
whenever the periodStatus of the PI is changed the periodStatus of the associated features are also updated
Steps followed to achieve this 
1.get the updated periodStatus of the PI
2.if the periodStatus is not null get the feature associated with the PI using Features as Program Increment 
3.set the updated periodStatus of the PI to its Features*/

cplace.setLogName('cF - syncProgramIncrementPeriodStatustoFeature');

// Configuration
const PI={
  TYPE:'cf.cplace.solution.safe.programIncrement',
  ATTR:{
    periodStatus:'cf.cplace.solution.safe.periodStatus'
  },
  refAttr:{
    pIReferenceAttr:'cf.cplace.solution.safe.programIncrement',
    mappingRefAttr:'cf.cplace.solution.safe.periodStatus',
    orderRefAttr:'cf.cplace.solution.safe.order'
  }
}

const FEATURE={
  TYPE:'cf.cplace.solution.safe.feature',
  ATTR:{
    PI:'cf.cplace.solution.safe.programIncrement',
    periodStatus:'cf.cplace.solution.safe.periodStatus'
  }
}

// get changed page
let page = changeEvent.getEntity();

let periodStatus=page.get(PI.ATTR.periodStatus);
cplace.log(periodStatus);

if(periodStatus == null){
  return
}

let features=page.getIncomingPages(FEATURE.TYPE,FEATURE.ATTR.PI);
//cplace.log('periodStatus of feature'+features);


cplace.each(features,function(feature){
  cplace.actions().updatePage(feature, {
	customAttributes: {
		[FEATURE.ATTR.periodStatus]: periodStatus
		}
    });
 
feature.registerAttributeForRefresh(FEATURE.ATTR.periodStatus);

})

//------------------------------------------------------------------------------------------------------

/**
 * PAGE ACTION
 * @customType cf.cplace.solution.safe.programIncrement
 * @author unknown
 * @version 1.1
 * @description Updating period status of a program increment
 */

cplace.setLogName("pageAction on PI-ProgramIncrement start");

//Configurations
const PI = /** @type {const} */ ({
  TYPE: "cf.cplace.solution.safe.programIncrement",
  ATTR: {
    periodStatus: "cf.cplace.solution.safe.periodStatus",
    predecessor: "cf.cplace.solution.safe.predecessor",
  },
  refAttr: {
    order: "cf.cplace.solution.safe.order",
  },
});
const PERIOD_STATUS = /** @type {const} */ ({
  TYPE: "cf.cplace.solution.safe.periodStatus",
  ATTR: {
    order: "cf.cplace.solution.safe.order",
  },
});

function checkAccess() {
  /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
  const programIncrement = embeddingPage;
  let orderarr = [];

  // action should be available only when the periodStatus is not running, not finished and no other PI should have running periodStatus
  //check all PIs for the periodStatus whether periodStatus 'Running' is present or not
  let piSearch = new Search();
  piSearch.add(Filters.space(programIncrement.getSpaceId()));
  piSearch.add(Filters.type(PI.TYPE));
  piSearch.add(Filters.customAttributeNonempty(PI.ATTR.periodStatus));
  /** @type {JIterable<Page<'cf.cplace.solution.safe.programIncrement'>>} */
  let result = piSearch.findAllPages();

  cplace.each(result, function (pi) {
    let pStatus = pi.get(PI.ATTR.periodStatus);
    let porder = pStatus.get(PERIOD_STATUS.ATTR.order);
    orderarr.push(porder);
  });
  cplace.log(orderarr);
  if (orderarr.indexOf(0) == -1) {
    return true;
  }

  return false;
}

function call() {
  /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
  const programIncrement = embeddingPage;
  let order = programIncrement.get(PI.ATTR.periodStatus)
    ? programIncrement.get(PI.ATTR.periodStatus).get(PI.refAttr.order)
    : null;
  let update = true;
  let orderarr1 = [];

  //orderMap is required to get the corresponding periodStatus of the order
  let orderSearch = new Search();
  orderSearch.add(Filters.space(programIncrement.getSpaceId()));
  orderSearch.add(Filters.type(PERIOD_STATUS.TYPE));
  orderSearch.add(Filters.customAttributeNonempty(PERIOD_STATUS.ATTR.order));
  /** @type {JIterable<Page<'cf.cplace.solution.safe.periodStatus'>>} */
  let result = orderSearch.findAllPages();

  let orderMap = new Map();
  if (result) {
    cplace.each(result, function (value) {
      orderMap.set(value.get(PERIOD_STATUS.ATTR.order), value);
      orderarr1.push(value.get(PERIOD_STATUS.ATTR.order)); // get the order array
    });
  }
  //find the highest order
  let highorder = Math.max(...orderarr1);
  cplace.log(highorder);
  let sarr = [];

  let arr = checkforPredecessorChain(sarr, programIncrement);

  for (let i = 0; i <= highorder; i++) {
    if (arr[i] == null) {
      update = false;
      return {
        success: false,
        message: {
          en: "Set the predeccessor chain properly",
        },
      };
    }
  }

  // update the periodStatus
  if (update) {
    updateperiodStatus(programIncrement, 1, orderMap);
  }
}

function updateperiodStatus(page, orderIncr, orderMap) {
  let newPeriodStatus = orderMap.get(orderIncr - 1);
  // update the periodStatus
  if (newPeriodStatus) {
    cplace.actions().updatePage(page, {
      customAttributes: {
        [PI.ATTR.periodStatus]: newPeriodStatus,
      },
    });

    orderIncr += 1;

    // check for the successor PI if successor is present then update its periodStatus
    // @ts-ignore
    let successor = Iterables.getFirst(
      page.getIncomingPages(PI.TYPE, PI.ATTR.predecessor),
      null
    );
    if (successor) {
      updateperiodStatus(successor, orderIncr, orderMap);
    }
  }
}

function checkforPredecessorChain(sarr, page) {
  // @ts-ignore
  let successor = Iterables.getFirst(
    page.getIncomingPages(PI.TYPE, PI.ATTR.predecessor),
    null
  );
  sarr.push(successor);
  if (successor != null) {
    cplace.log(successor.getName());
    checkforPredecessorChain(sarr, successor);
  } else {
    cplace.log("check the chain");
  }

  return sarr;
}

// @ts-ignore
return {
  checkAccess,
  call,
};

//------------------------------------------------------------------------------------------------------

cplace.setLogName('pageAction on PI-ProgramIncrement Progress');

//Configurations
const PI={
  TYPE:'cf.cplace.solution.safe.programIncrement',
  ATTR:{
    periodStatus:'cf.cplace.solution.safe.periodStatus',
    predecessor:'cf.cplace.solution.safe.predecessor'
  },
  refAttr:{
  	order:'cf.cplace.solution.safe.order'
}
}
const periodStatus={
  TYPE:'cf.cplace.solution.safe.periodStatus',
  ATTR:{
  	order:'cf.cplace.solution.safe.order'
}
}  

let orderarr=[];
let sarr=[];
let order = (page.get(PI.ATTR.periodStatus) ? page.get(PI.ATTR.periodStatus).get(PI.refAttr.order) : null);

 return {
   
   checkAccess: function() {
              // Pageaction should only be available when the periodStatus is 'Running'
                if (order == 0) {
                    return true;
                }
                return false;
            }, 
  	call: function() {
    	return doBusinessAction(page);
  	}
}
 
 
 function doBusinessAction(page){
   
   let order=(page.get(PI.ATTR.periodStatus) ? page.get(PI.ATTR.periodStatus).get(PI.refAttr.order) : null);
   let update=true; //setting the flag to check whether the update process should be performed or not
  
   
   /*orderMap is required to get the corresponding periodStatus of the order */
   let orderSearch=new Search();
   orderSearch.add(Filters.space(page.getSpaceId()));
   orderSearch.add(Filters.type(periodStatus.TYPE));
   orderSearch.add(Filters.customAttributeNonempty(periodStatus.ATTR.order));
   let result=orderSearch.findAllPages();
   
   let orderMap=new Map();
    if(result){
       cplace.each(result,function(value){
         orderMap.set(value.get(periodStatus.ATTR.order),value);
         orderarr.push(value.get(periodStatus.ATTR.order));
       });
    }
  
     /*Get the highest order */
     let highorder=Math.max(...orderarr);
     cplace.log(highorder);
     /*check the predecessor chain to be set properly or not*/
     let arr= checkforPredecessorChain(page); 
     for(let i=0;i<=highorder;i++){
        if(arr[i]==null){
          update=false;
    /*Return the error message if the predecessor chain is not set*/    
       return {
            success: false, // default is true
            message: {
                en: 'Set the predeccessor chain properly'
            } 
         }  
      }
   }   

     // update the periodStatus 
     if(update){
        updateperiodStatus(page, order, orderMap);  
     }
 }
     
  
 
 
function updateperiodStatus(page, orderIncr, orderMap) {
 
   let newPeriodStatus = orderMap.get(orderIncr - 1);
      
     if (newPeriodStatus) {
        cplace.actions().updatePage(page, {
           customAttributes: {
            [PI.ATTR.periodStatus]: newPeriodStatus //update the status to the one which comes next in the order (decreased by 1)
             }
         });
     orderIncr += 1;
            
     // check for the successor PI if successor is present then update its periodStatus
     let successor = Iterables.getFirst(page.getIncomingPages(PI.TYPE,PI.ATTR.predecessor), null);
       
     if (successor) {
            updateperiodStatus (successor, orderIncr, orderMap);
         }
	  }
}


 function checkforPredecessorChain(page){
    let successor = Iterables.getFirst(page.getIncomingPages(PI.TYPE,PI.ATTR.predecessor), null);
    sarr.push(successor);
    if(successor!=null){
       cplace.log(successor.getName());
       checkforPredecessorChain(successor,sarr);
    }else{
       cplace.log('check the chain');
    }
     
    return sarr;
 }

//------------------------------------------------------------------------------------------------------

/**
 * LOWCODE BUTTON
 * @customType cf.cplace.solution.safe.solution
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Set previous current and next pi
 */

cplace.setLogName("lowcodebutton_setAsCurrentPi");

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
    },
    ENUM: {
        PERIOD_STATUS: {
            DONE: "#15 - done",
            ACTIVE: "#25 - active",
        },
    },
});

const SOLUTION = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.solution",
});

function checkAccess() {
    return true;
}

function call() {
    const newState = {
        "cf.cplace.solution.safe.previousPi": {},
        "cf.cplace.solution.safe.currentPi": {},
        "cf.cplace.solution.safe.nextPi": {},
    };

    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
    const programIncrement = embeddingPage;
    const solution = programIncrement.get(PROGRAMM_INCREMENT.ATTR.SOLUTION);

    if (!solution) {
        return "No Solution";
    }
    const currentPi = solution.get("cf.cplace.solution.safe.currentPi");

    if (!currentPi) {
        return "No current PI";
    }

    newState["cf.cplace.solution.safe.previousPi"] = currentPi;
    newState["cf.cplace.solution.safe.currentPi"] = programIncrement;
    const nextPi = getNextPi(programIncrement);

    if (!nextPi) {
        cplace.error("No next PI");
        return;
    }

    cplace.log(`Next PI: ${nextPi}`);
    newState["cf.cplace.solution.safe.nextPi"] = nextPi;

    cplace.actions().updatePage(solution, {
        customAttributes: newState,
    });

    cplace.actions().updatePage(currentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.DONE,
        },
    });
    cplace.actions().updatePage(programIncrement, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.ACTIVE,
        },
    });
    programIncrement.registerAttributeForRefresh(PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS);
}

/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getNextPi(programIncrement) {
    const endDate = programIncrement.get(PROGRAMM_INCREMENT.ATTR.END_DATE);
    if (!endDate) {
        return null;
    }
    const result = new Search()
        .add(Filters.type(PROGRAMM_INCREMENT.TYPE))
        .add(Filters.customAttribute(PROGRAMM_INCREMENT.ATTR.START_DATE).gt(endDate))
        .addCustomFieldSort(PROGRAMM_INCREMENT.ATTR.START_DATE, false)
        .findAllPages();

    return Iterables.getFirst(result, null);
}

return { checkAccess, call };

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Calculates Flow Time metric
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('changelistener-calculate-flow-time-metric');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    'ACTUAL_START_DATE': 'cf.cplace.solution.safe.actualStartDate',
    'ACTUAL_END_DATE': 'cf.cplace.solution.safe.actualEndDate',
    'FLOW_TIME': 'cf.cplace.solution.safe.flowTime'
  }
};

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

function main(){
const capability = changeEvent.getEntity();

const flowMetric = calculateFlowTimeMetric(capability);

if (flowMetric !== -1) {
  setFlowTime(capability, flowMetric);
}
}
main();

function calculateFlowTimeMetric(capability) {
  const actualStartDate = capability.get(CAPABILITY.ATTR.ACTUAL_START_DATE);
  const actualEndDate = capability.get(CAPABILITY.ATTR.ACTUAL_END_DATE);

  if (!actualStartDate || !actualEndDate) {
    return -1;
  }

  if (actualStartDate.equals(actualEndDate)) {
    return 0;
  }

  if (actualEndDate.isAfter(actualStartDate)) {
    return Days.daysBetween(actualStartDate.withTimeAtStartOfDay(), actualEndDate.withTimeAtStartOfDay()).getDays();
  }
  
  return -1;
}

function setFlowTime(capability, flowMetric) {
  const attributes = {};
  attributes[CAPABILITY.ATTR.FLOW_TIME] = flowMetric;

  cplace.actions().updatePage(capability, {customAttributes: attributes});
  capability.registerAttributeForRefresh(CAPABILITY.ATTR.FLOW_TIME);
}

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.capability
 * @attribute cf.cplace.solution.safe.features
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Sets the cf.cplace.solution.safe.program attribute of a capability to the programms, which work on features of the capability.
 */
const FEATURE = {
    TYPE: "cf.cplace.solution.safe.feature",
    ATTR: {
        CAPABILITY: "cf.cplace.solution.safe.capability",
    },
};

/**
 * Get all features of a capability and store a unique list of the features Programms on the capability
 */
function main() {
    /** @type {Page<'cf.cplace.solution.safe.capability'>} */
    const capability = changeEvent.getEntity();
    /** @type {Page<'cf.cplace.solution.safe.feature'>[]} */
    // @ts-ignore
    const features = capability.get("cf.cplace.solution.safe.features")

    const programmIds = features.map((feature) => feature.get("cf.cplace.solution.safe.program")?.getId());
    const uniqueProgrammIdeas = [...new Set(programmIds)];
    cplace.log(`Capability ${capability.getName()} unique programms: ${uniqueProgrammIdeas}`);
    cplace.actions().updatePage(capability, {
        customAttributes: {
            // @ts-ignore
            "cf.cplace.solution.safe.program": uniqueProgrammIdeas,
        },
    });
  capability.registerAttributeForRefresh("cf.cplace.solution.safe.program");
}
main();

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

/**
 * VALIDATOR
 * @customType cf.cplace.solution.safe.capability
 * @attribute cf.cplace.solution.safe.state
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.1
 * @description Checks if a state transition is allowed (a capability has to go through every state one-by-one, jumping, e.g., from "Funnel" to "Done" is not allowed)
 */

const DEBUG = false;

const SOLUTION = {
    TYPE: "cf.cplace.solution.safe.solution",
};

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});
/** Mapping of previous and next state */
const STATUS_MAP = /** @type {const} */ ({
    "#10 - Draft": "#15 - Funnel",
    "#15 - Funnel": "#25 - Analyzing",
    "#25 - Analyzing": "#35 - Backlog",
    "#35 - Backlog": "#45 - Implementing",
    "#45 - Implementing": "#55 - Validating",
    "#55 - Validating": "#65 - Deploying",
    "#65 - Deploying": "#75 - Releasing",
    "#75 - Releasing": "#85 - Done",
});

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

/**
 *
 * @param {Page<'cf.cplace.solution.safe.capability'>} page
 * @returns
 */
function checkIfTransitionIsAllowed(page) {
    /**
     * don't run on view only
     */
    if (!!page.getBuiltinFeatureValue("creator") && page.getId() === page.getRealId()) {
        return;
    }

    const newStatus = page.get(CAPABILITY.ATTR.STATE);

    DEBUG && cplace.log(page.getBuiltinFeatureValue("creator"));

    if (!page.getBuiltinFeatureValue("creator")) {
        // If page is created, only the draft state is allowed
        DEBUG && cplace.log("creation dialog: " + newStatus);
        if (newStatus === "#10 - Draft") {
            return;
        }
        return messages.get("creation-state-not-allowed");
    }

    DEBUG && cplace.log("New Status: " + newStatus);

    // Get the real page (with previous values)
    const search = new Search();
    search.add(Filters.uid(page.getRealId()));
    const realPage = Iterables.getFirst(search.findAllPages(), null);

    if (realPage === null) {
        return;
    }
    const currentStatus = realPage.get(CAPABILITY.ATTR.STATE);
    DEBUG && cplace.log(currentStatus);

    /**
     * Status hasn't changed
     */
    if (currentStatus === newStatus) {
        return;
    }
    if (newStatus === "#85 - Done") {
        return;
    }
    // If the new status is not defined as successor in the STATUS MAP, then return an error
    if (newStatus !== STATUS_MAP[currentStatus]) {
        return messages.get("statechange-not-allowed");
    }
    /** @type {number|null} */
    const wipLimit = getSolution(page.getSpaceId()).get(WIP_MAP[newStatus]);

    if (wipLimit === null) {
        // No WIP limit set
        return;
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(newStatus);
    if (wipLimit - numberOfCapabilities <= 0) {
        return messages.get("statechange-not-allowed");
    }
}

/**
 *
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(state) {
    const numberOfCapabilities = new Search()
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}

return checkIfTransitionIsAllowed(page);

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Validates actual start and end date of the capability
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('validator-actual-start-and-end-date-capability');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    'ACTUAL_START_DATE': 'cf.cplace.solution.safe.actualStartDate',
    'ACTUAL_END_DATE': 'cf.cplace.solution.safe.actualEndDate',
  }
};

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

const VALIDATE_START_AND_END_DATES = "validate-start-and-end-dates";
const capability = page;

return validateDates(capability);

function validateDates(capability) {
  let result = null;
  const actualStartDate = capability.get(CAPABILITY.ATTR.ACTUAL_START_DATE);
  const actualEndDate = capability.get(CAPABILITY.ATTR.ACTUAL_END_DATE);
  if (actualStartDate && actualEndDate && actualStartDate.isAfter(actualEndDate)) {
    result = messages.get(VALIDATE_START_AND_END_DATES);
  }

  return result;
}

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Validates actual start and end date of the capability
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('validator-actual-start-and-end-date-capability');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    'ACTUAL_START_DATE': 'cf.cplace.solution.safe.actualStartDate',
    'ACTUAL_END_DATE': 'cf.cplace.solution.safe.actualEndDate',
  }
};

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

const VALIDATE_START_AND_END_DATES = "validate-start-and-end-dates";
const capability = page;

return validateDates(capability);

function validateDates(capability) {
  let result = null;
  const actualStartDate = capability.get(CAPABILITY.ATTR.ACTUAL_START_DATE);
  const actualEndDate = capability.get(CAPABILITY.ATTR.ACTUAL_END_DATE);
  if (actualStartDate && actualEndDate && actualStartDate.isAfter(actualEndDate)) {
    result = messages.get(VALIDATE_START_AND_END_DATES);
  }

  return result;
}

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.plannedStartA, cf.cplace.solution.safe.dateA, cf.cplace.solution.safe.plannedEndB, cf.cplace.solution.safe.dateB, cf.cplace.solution.safe.type
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Conflict recognition
 */

cplace.setLogName("listener_conflictRecognition");

const DEBUG = true;

const DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        START_DATE_A: "cf.cplace.solution.safe.plannedStartA",
        B: "cf.cplace.solution.safe.predecessor",
        END_DATE_B: "cf.cplace.solution.safe.plannedEndB",
        STATUS: "cf.cplace.solution.safe.status",
        TYPE: "cf.cplace.solution.safe.type",
    },
    ENUM: {
        TYPE: {
            BLOCKED_BY: "blocked by",
            RELATED_TO: "related to",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            CONFLICT_RESOLVED: "35 - resolved",
        },
    },
});

function main() {
    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    // Check if dependency is blocking
    if (dependency.get(DEPENDENCY.ATTR.TYPE) !== DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
        DEBUG && cplace.log("No blocked by");
        
        // If the status is set to "related to" and the dependency type is still "25 - conflict" we should set the status to "15 - identified"
        if(dependency.get(DEPENDENCY.ATTR.STATUS) !== DEPENDENCY.ENUM.STATUS.CONFLICT){
            DEBUG && cplace.log("No conflict status");
            return
        }
        cplace.actions().updatePage(dependency, {
            customAttributes: {
                [DEPENDENCY.ATTR.STATUS]: DEPENDENCY.ENUM.STATUS.IDENTIFIED,
            },
        });
        dependency.registerAttributeForRefresh(DEPENDENCY.ATTR.STATUS);
        return;
    }

    if (!isConflict(dependency)) {
        DEBUG && cplace.log("No conflict");
        return;
    }
    // Dependency is a conflict
    cplace.actions().updatePage(dependency, {
        customAttributes: {
            [DEPENDENCY.ATTR.STATUS]: DEPENDENCY.ENUM.STATUS.CONFLICT,
        },
    });
    dependency.registerAttributeForRefresh(DEPENDENCY.ATTR.STATUS);
}
/**
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 */
function isConflict(dependency) {
    const dateA = dependency.get(DEPENDENCY.ATTR.START_DATE_A);

    const dateB = dependency.get(DEPENDENCY.ATTR.END_DATE_B);

    if (dateA && dateB && dateB.isAfter(dateA)) {
        return true;
    }
    return false;
}


main();

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.plannedStartA, cf.cplace.solution.safe.dateA, cf.cplace.solution.safe.plannedEndB, cf.cplace.solution.safe.dateB, cf.cplace.solution.safe.type
 * @author Anja Priglmeir
 * @version 1.0
 * @description setting conflict state on capabilities
 */

cplace.setLogName("listener_setConflictToCapabilities");

const DEBUG = true;

const DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        START_DATE_A: "cf.cplace.solution.safe.plannedStartA",
        DATE_A: "cf.cplace.solution.safe.dateA",
        B: "cf.cplace.solution.safe.predecessor",
        END_DATE_B: "cf.cplace.solution.safe.plannedEndB",
        DATE_B: "cf.cplace.solution.safe.dateB",
        STATUS: "cf.cplace.solution.safe.status",
        TYPE: "cf.cplace.solution.safe.type",
    },
    ENUM: {
        TYPE: {
            BLOCKED_BY: "blocked by",
            RELATED_TO: "related to",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            CONFLICT_RESOLVED: "35 - resolved",
        },
    },
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        CONFLICT_STATE: "cf.cplace.solution.safe.conflictState"
    },
    ENUM: {
        CONFLICT: '#25 - conflict'
    }
});

function main() {

    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    const a = dependency.get(DEPENDENCY.ATTR.A);
    const b = dependency.get(DEPENDENCY.ATTR.B);
    const status = dependency.get(DEPENDENCY.ATTR.STATUS);
    
    /*//case1: a or b changed; re-calculation only necessary if dependency has conflict
    if (changeEvent.didChange(DEPENDENCY.ATTR.A) && status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
        //tbd
        const old_a = '';
        checkForConflicts(old_a);
    }

    if (changeEvent.didChange(DEPENDENCY.ATTR.B) && status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
        //tbd
        const old_b = '';
        checkForConflicts(old_b);
    }*/

    //case2: dependency status changed
    if (changeEvent.didChange(DEPENDENCY.ATTR.STATUS)) {
        if (a.getBuiltinFeatureValue('customType') === CAPABILITY.TYPE) {
            checkForConflicts(a);
        }

        if (b.getBuiltinFeatureValue('customType') === CAPABILITY.TYPE) {
            checkForConflicts(b);
        }
    }
}

/**
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 */
function checkForConflicts(capability) {
    const dependenciesAsA = capability.getIncomingPages(DEPENDENCY.TYPE, DEPENDENCY.ATTR.A);
    const dependenciesAsB = capability.getIncomingPages(DEPENDENCY.TYPE, DEPENDENCY.ATTR.B);

    let conflictValue = null;

    cplace.each(dependenciesAsA, dependency => {
        const status = dependency.get(DEPENDENCY.ATTR.STATUS);
        if (status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
            conflictValue = CAPABILITY.ENUM.CONFLICT;
        }
    })
    cplace.each(dependenciesAsB, dependency => {
        const status = dependency.get(DEPENDENCY.ATTR.STATUS);
        if (status === DEPENDENCY.ENUM.STATUS.CONFLICT) {
            conflictValue = CAPABILITY.ENUM.CONFLICT;
        }
    })
    cplace.actions().updatePage(capability, {
        customAttributes: {
            [CAPABILITY.ATTR.CONFLICT_STATE]: conflictValue
        }
    })

    capability.registerAttributeForRefresh(CAPABILITY.ATTR.CONFLICT_STATE);
}


main();

//------------------------------------------------------------------------------------------------------

/**
 * CHANGE LISTENER
 * @customType cf.cplace.solution.safe.dependency
 * @attribute cf.cplace.solution.safe.status
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Sync the dependendy status to the capabilities
 */
cplace.setLogName("listener_syncConflicStateToCapabilities");

function main() {
    /** @type {Page<'cf.cplace.solution.safe.dependency'>} */
    const dependency = changeEvent.getEntity();

    const predecessor = dependency.get("cf.cplace.solution.safe.predecessor");
    const successor = dependency.get("cf.cplace.solution.safe.successor");

    if (!predecessor || !successor) {
        cplace.log("No predecessor or successor found for dependency " + dependency.getName());
        return;
    }
    cplace.log("Updating predecessor");
    updateCapabilityConflictState(dependency, predecessor);
    cplace.log("Updating successor");
    updateCapabilityConflictState(dependency, successor);
}

/**
 * Set the cf.cplace.solution.safe.conflictState parameter of the capabilities that are dependent
 * @param {Page<'cf.cplace.solution.safe.dependency'>} dependency
 * @param {Page<"cf.cplace.solution.safe.capability" | "cf.cplace.solution.safe.safeMilestone">} capabilityOrMilestone
 * @returns
 */
function updateCapabilityConflictState(dependency, capabilityOrMilestone) {
    const dependencyStatus = dependency.get("cf.cplace.solution.safe.status");
    /** @type {CplaceTypes["cf.cplace.solution.safe.capability"]["cf.cplace.solution.safe.conflictState"]} */
    let newConflictState;
    const isCapability =
        capabilityOrMilestone?.getBuiltinFeatureValue("customType") === "cf.cplace.solution.safe.capability";

    if (!isCapability) {
        // Only the capability has the conflictState
        return;
    }

    if (dependencyStatus === "25 - conflict") {
        newConflictState = "#25 - conflict";
    } else {
        // No conflict
        newConflictState = null;
    }

    cplace.actions().updatePage(capabilityOrMilestone, {
        customAttributes: {
            "cf.cplace.solution.safe.conflictState": newConflictState,
        },
    });
    capabilityOrMilestone.registerAttributeForRefresh("cf.cplace.solution.safe.conflictState");
}

main();

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

