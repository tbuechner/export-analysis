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