const KEY_RESULT = {
  TYPE : 'cf.cplace.solution.okr.keyResult',
  ATTR :{
    PROGRESS : 'cf.cplace.solution.okr.progress',
    CONFIDENCE_LEVEL :'cf.cplace.solution.okr.confidenceLevel',
  }
}

const PROGRESS = {
  TYPE : 'cf.cplace.solution.okr.progress',
  ATTR : {
    KEY_RESULT:'cf.cplace.solution.okr.keyResult',
    CONFIDENCE_LEVEL:'cf.cplace.solution.okr.confidenceLevel',
  }
}


function main(){
  let page = changeEvent.getEntity();
  let confidenceLevel = page.get(KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
  let progress = page.get(KEY_RESULT.ATTR.PROGRESS);
  if (!isSet(progress) || !isSet(confidenceLevel)) {
    // Nothing to sync with
    return;
  }
  let processConfidence = progress.get(PROGRESS.ATTR.CONFIDENCE_LEVEL);
  if (confidenceLevel === processConfidence)  {
    return;
  }
  cplace.actions().updatePage(progress, {
    customAttributes: {
      'cf.cplace.solution.okr.confidenceLevel': confidenceLevel
    }
  }
                             );
  progress.registerAttributeForRefresh('cf.cplace.solution.okr.confidenceLevel');
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
}