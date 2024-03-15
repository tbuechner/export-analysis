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