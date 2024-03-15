/*
*Changelistener
*Type:Progress
*Description: whenever the gradingForecast of the progress is changed this changelistener updates the same in keyResult
*Triggering attribute : 
*Author: Laxmi udapudi
*/

cplace.setLogName('set_gf_on_progress')
const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast'
  }
}

function main() {

  let progress = changeEvent.getEntity();
  let gradingForecast = progress.get(PROGRESS.ATTR.GRADING_FORECAST);
  let keyResult = progress.get(PROGRESS.ATTR.KEY_RESULT);
  let processGrading = keyResult.get(KEY_RESULT.ATTR.GRADING_FORECAST);

  if (!isSet(progress) || !isSet(gradingForecast)) {
    // Nothing to sync with
    return;
  }

  if (gradingForecast === processGrading) {
    return;
  }

  updatePage(keyResult, {
    'cf.cplace.solution.okr.gradingForecast': gradingForecast
  })
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
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