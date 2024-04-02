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
  //const attributeToSync = 'cf.cplace.solution.okr.confidenceLevel';
  let page = changeEvent.getEntity();
  let confidenceLevel = page.get(PROGRESS.ATTR.CONFIDENCE_LEVEL);
  let keyResult = page.get(PROGRESS.ATTR.KEY_RESULT);
  if (!isSet(keyResult) || !isSet(confidenceLevel)) {
    // Nothing to sync with
    return;
  }
  let resultConfidence = keyResult.get(KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
  if (confidenceLevel === resultConfidence)  {
    return;
  }
  cplace.actions().updatePage(keyResult, {
    customAttributes: {
      'cf.cplace.solution.okr.confidenceLevel': confidenceLevel
    }
  }
                             );
  keyResult.registerAttributeForRefresh('cf.cplace.solution.okr.confidenceLevel');
}

return main();

// Check if a value is set
function isSet(value) {
  return !!value;
}