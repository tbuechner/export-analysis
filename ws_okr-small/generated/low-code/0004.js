/*
*Changelistener
*Type:Keyresult
*Triggering attributes:
*Description: whenever the confidencelevel o the keyResult is changed this changelistener updates the same in progress 
*Author: Laxmi udapudi
*/
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

cplace.setLogName('sync_gf_on_progress')

function main() {

  let keyresult = changeEvent.getEntity();
  let gradingForecast = keyresult.get(KEY_RESULT.ATTR.GRADING_FORECAST);
  let progress = keyresult.get(KEY_RESULT.ATTR.PROGRESS);
  let processGrading = progress.get(PROGRESS.ATTR.GRADING_FORECAST);

  if (!isSet(progress) || !isSet(gradingForecast)) {
    // Nothing to sync with
    return;
  }

  if (gradingForecast === processGrading) {
    return;
  }

  updatePage(progress, {
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