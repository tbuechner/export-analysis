const KEY_RESULT = {
  TYPE : 'cf.cplace.solution.okr.keyResult',
  ATTR :{
    PROGRESS : 'cf.cplace.solution.okr.progress',
    CONFIDENCE_LEVEL :'cf.cplace.solution.okr.confidenceLevel',
    PROGRESS_INDICATOR : 'cf.cplace.solution.okr.progressIndicator'
  }
}
const PROGRESS = {
  TYPE : 'cf.cplace.solution.okr.progress',
  ATTR : {
    KEY_RESULT:'cf.cplace.solution.okr.keyResult',
    CONFIDENCE_LEVEL:'cf.cplace.solution.okr.confidenceLevel',
    PROGRESS_INDICATOR :'cf.cplace.solution.okr.progressIndicator'
  }
}

cplace.setLogName('set _outdated_ProgressIndicator');

function main(){
  let page = changeEvent.getEntity();
  let indicator = page.get(KEY_RESULT.ATTR.PROGRESS_INDICATOR);
  let progress = page.get(KEY_RESULT.ATTR.PROGRESS);
  // only update outdated, all other indicators should be updated when sync of confidencelevel happens
  if (!isSet(progress) || !isSet(indicator)) {
    // Nothing to sync
    return;
  }
  let resultIndicator = progress.get(PROGRESS.ATTR.PROGRESS_INDICATOR);
  if (indicator === '#45 outdated' && resultIndicator !== '#45 outdated') {
    return updateIndicator(progress,indicator);
  }
  if (indicator !== '#45 outdated' && resultIndicator === '#45 outdated') {
    return updateIndicator(progress,indicator);
  }
}

return main();

function updateIndicator(progress,indicator) {
  cplace.log("Keyresult updates indicator")
  cplace.actions().updatePage(progress, {
    customAttributes: {
      'cf.cplace.solution.okr.progressIndicator': indicator
    }
  }
                             );
  progress.registerAttributeForRefresh('cf.cplace.solution.okr.progressIndicator');
}
// Check if a value is set
function isSet(value) {
  return !!value;
}