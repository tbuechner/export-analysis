/*
*Changelistener
*Type:Keyresult
*Description: whenever the progressIndicator of the keyResult is changed this changelistener updates the confidencelvel
*Author: Laxmi udapudi
*/
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
cplace.setLogName('sync_ProgressIndicator_on_progress');

function main() {
  let keyResult = changeEvent.getEntity();
  let progressIndicator = keyResult.get(KEY_RESULT.ATTR.PROGRESS_INDICATOR);
  let confidenceLevel = keyResult.get(KEY_RESULT.ATTR.CONFIDENCELEVEL);

  switch (progressIndicator) {
    case '#45 outdated':
      // Do nothing
      break;
    case '#15 green':
      if (parseFloat(confidenceLevel) < 0.7) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.7'
        })
      }
      break;
    case '#25 yellow':
      if (parseFloat(confidenceLevel) < 0.4 || parseFloat(confidenceLevel) > 0.6) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.5'
        })
      }
      break;
    case '#35 red':
      if (parseFloat(confidenceLevel) > 0.3) {
        updatePage(keyResult, {
          'cf.cplace.solution.okr.confidenceLevel': '0.3'
        })
      }
      break;
    default:
      updatePage(keyResult, {
        'cf.cplace.solution.okr.confidenceLevel': '1'
      })
      break;
  }
}

main();
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