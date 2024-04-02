/*
*Changelistener
*Triggering Attribute : Give Big Support
*Updates the receiveBigSupport on change of giveBigSupport
*Author:laxmi Udapudi
*/


/*Set the distinguish name for log*/
cplace.setLogName('cl_update_receive_big _Support')
const DEBUG = true;

const KEY_RESULT = {
  TYPE: 'cf.cplace.solution.okr.keyResult',
  ATTR: {
    TITLE: 'cf.cplace.solution.okr.title',
    PROGRESS: 'cf.cplace.solution.okr.progress',
    CONFIDENCELEVEL: 'cf.cplace.solution.okr.confidenceLevel',
    GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
    PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator',
    BIG_SUPPORT: 'cf.cplace.solution.okr.giveBigSupport',
    RECEIVE_SUPPORT: 'cf.cplace.solution.okr.receiveBigSupport'
  }
}

function main() {
  let keyResult = changeEvent.getEntity();
  let currentSupports = keyResult.get(KEY_RESULT.ATTR.BIG_SUPPORT);
  let oldSupports = changeEvent.getOldValues(KEY_RESULT.ATTR.BIG_SUPPORT);
  let addedSupports = [];
  let removedSupports = [];

  currentSupports.forEach(function (support) {
    if (!oldSupports.contains(support)) {
      addedSupports.push(support);
    }
  });
  oldSupports.forEach(function (support) {
    if (!currentSupports.contains(support)) {
      removedSupports.push(support);
    }
  });

  log('Added: ' + addedSupports);
  log('Removed: ' + removedSupports);

  if (addedSupports.length === 0 && removedSupports.length === 0) {
    return;
  }

  addedSupports.forEach(function (support) {
    addReference(keyResult, support);
  });
  removedSupports.forEach(function (support) {
    removeReference(keyResult, support);
  })
}

return main();

/*
*function checks for the duplicates and updates the receive big support 
*@params{provider,recevier}
*/
function addReference(provider, receiver) {
  let receiverValues = receiver.get(KEY_RESULT.ATTR.RECEIVE_SUPPORT) || [];

  // Avoid duplication
  if (receiverValues.contains(provider)) {
    return;
  }

  let newValues = [...receiverValues, provider];
  updatePage(receiver, {
    'cf.cplace.solution.okr.receiveBigSupport': newValues
  })

}

/*
*function removes the reference and updates the receive big support 
*@params{provider,recevier}
*/

function removeReference(provider, receiver) {
  let receiverValues = receiver.get(KEY_RESULT.ATTR.RECEIVE_SUPPORT) || [];
  let newValues = [];

  receiverValues.forEach(function (element) {
    if (element.getId() !== provider.getId()) {
      newValues.push(element);
    }
  });

  updatePage(receiver, {
    'cf.cplace.solution.okr.receiveBigSupport': newValues
  })
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

/**
* Log to cplace
* @param {any} text
*/
function log(text) {
  if (!DEBUG) {
    return
  }
  let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;

  cplace.log(logOutput);
}