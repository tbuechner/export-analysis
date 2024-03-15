/*
*Changelistener
*Type:Keyresult
*Description: whenever the confidencelevel of the progress is changed this changelistener updates the progressIndicator
*Author: Laxmi udapudi
*/
cplace.setLogName('sync_cf_on_KR')
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
  let confidenceLevel = progress.get(PROGRESS.ATTR.CONFIDENCELEVEL);

  if (isSet(confidenceLevel)) {
    cplace.log("Confidence set");
    let indicator = getIndicator(parseFloat(confidenceLevel));
    let setIndicator = progress.get('cf.cplace.solution.okr.progressIndicator');

    if (setIndicator === indicator) {
      return;
    }

    cplace.log("confidence notequal indicator");
    updatePage(progress, {
      'cf.cplace.solution.okr.progressIndicator': indicator
    })
  } else {
    updatePage(progress, {
      'cf.cplace.solution.okr.progressIndicator': '#35 red'
    })

  }
}

main()

function getIndicator(confidenceLevel) {
  if (confidenceLevel < 0.4) {
    return '#35 red';
  }
  if (confidenceLevel < 0.7) {
    return '#25 yellow';
  }
  return '#15 green';
}

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