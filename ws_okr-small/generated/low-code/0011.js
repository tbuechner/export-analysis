/*
*Changelistener
*Type:Progress
*Description: whenever the progressIndicator of the progress is changed this changelistener updates the same in keyResult
*Triggering attribute : 
*Author: Laxmi udapudi
*/
cplace.setLogName('sync_progressIndicator_on_keyresult')

const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'

  }
}
const PROGRESS = {
  TYPE: 'cf.cplace.solution.okr.progress',
  ATTR: {
    KEY_RESULT: 'cf.cplace.solution.okr.keyResult',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator'
  }
}

function main() {

  let progress = changeEvent.getEntity();
  let progressIndicator = progress.get(PROGRESS.ATTR.PROGRESS_INDICATOR);
  let keyResult = progress.get(PROGRESS.ATTR.KEY_RESULT);
  let processIndicator = keyResult.get(PROGRESS.ATTR.PROGRESS_INDICATOR);

  if (!isSet(progress) || !isSet(progressIndicator)) {
    // Nothing to sync with
    return;
  }

  if (progressIndicator === processIndicator) {
    return;
  }

  updatePage(keyResult, {
    'cf.cplace.solution.okr.progressIndicator': progressIndicator
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