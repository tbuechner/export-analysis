/**
 * PAGE ACTION
 * @customType cf.cplace.solution.safe.programIncrement
 * @author unknown
 * @version 1.1
 * @description Updating period status of a program increment
 */

cplace.setLogName("pageAction on PI-ProgramIncrement start");

//Configurations
const PI = /** @type {const} */ ({
  TYPE: "cf.cplace.solution.safe.programIncrement",
  ATTR: {
    periodStatus: "cf.cplace.solution.safe.periodStatus",
    predecessor: "cf.cplace.solution.safe.predecessor",
  },
  refAttr: {
    order: "cf.cplace.solution.safe.order",
  },
});
const PERIOD_STATUS = /** @type {const} */ ({
  TYPE: "cf.cplace.solution.safe.periodStatus",
  ATTR: {
    order: "cf.cplace.solution.safe.order",
  },
});

function checkAccess() {
  /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
  const programIncrement = embeddingPage;
  let orderarr = [];

  // action should be available only when the periodStatus is not running, not finished and no other PI should have running periodStatus
  //check all PIs for the periodStatus whether periodStatus 'Running' is present or not
  let piSearch = new Search();
  piSearch.add(Filters.space(programIncrement.getSpaceId()));
  piSearch.add(Filters.type(PI.TYPE));
  piSearch.add(Filters.customAttributeNonempty(PI.ATTR.periodStatus));
  /** @type {JIterable<Page<'cf.cplace.solution.safe.programIncrement'>>} */
  let result = piSearch.findAllPages();

  cplace.each(result, function (pi) {
    let pStatus = pi.get(PI.ATTR.periodStatus);
    let porder = pStatus.get(PERIOD_STATUS.ATTR.order);
    orderarr.push(porder);
  });
  cplace.log(orderarr);
  if (orderarr.indexOf(0) == -1) {
    return true;
  }

  return false;
}

function call() {
  /** @type {Page<'cf.cplace.solution.safe.programIncrement'>} */
  const programIncrement = embeddingPage;
  let order = programIncrement.get(PI.ATTR.periodStatus)
    ? programIncrement.get(PI.ATTR.periodStatus).get(PI.refAttr.order)
    : null;
  let update = true;
  let orderarr1 = [];

  //orderMap is required to get the corresponding periodStatus of the order
  let orderSearch = new Search();
  orderSearch.add(Filters.space(programIncrement.getSpaceId()));
  orderSearch.add(Filters.type(PERIOD_STATUS.TYPE));
  orderSearch.add(Filters.customAttributeNonempty(PERIOD_STATUS.ATTR.order));
  /** @type {JIterable<Page<'cf.cplace.solution.safe.periodStatus'>>} */
  let result = orderSearch.findAllPages();

  let orderMap = new Map();
  if (result) {
    cplace.each(result, function (value) {
      orderMap.set(value.get(PERIOD_STATUS.ATTR.order), value);
      orderarr1.push(value.get(PERIOD_STATUS.ATTR.order)); // get the order array
    });
  }
  //find the highest order
  let highorder = Math.max(...orderarr1);
  cplace.log(highorder);
  let sarr = [];

  let arr = checkforPredecessorChain(sarr, programIncrement);

  for (let i = 0; i <= highorder; i++) {
    if (arr[i] == null) {
      update = false;
      return {
        success: false,
        message: {
          en: "Set the predeccessor chain properly",
        },
      };
    }
  }

  // update the periodStatus
  if (update) {
    updateperiodStatus(programIncrement, 1, orderMap);
  }
}

function updateperiodStatus(page, orderIncr, orderMap) {
  let newPeriodStatus = orderMap.get(orderIncr - 1);
  // update the periodStatus
  if (newPeriodStatus) {
    cplace.actions().updatePage(page, {
      customAttributes: {
        [PI.ATTR.periodStatus]: newPeriodStatus,
      },
    });

    orderIncr += 1;

    // check for the successor PI if successor is present then update its periodStatus
    // @ts-ignore
    let successor = Iterables.getFirst(
      page.getIncomingPages(PI.TYPE, PI.ATTR.predecessor),
      null
    );
    if (successor) {
      updateperiodStatus(successor, orderIncr, orderMap);
    }
  }
}

function checkforPredecessorChain(sarr, page) {
  // @ts-ignore
  let successor = Iterables.getFirst(
    page.getIncomingPages(PI.TYPE, PI.ATTR.predecessor),
    null
  );
  sarr.push(successor);
  if (successor != null) {
    cplace.log(successor.getName());
    checkforPredecessorChain(sarr, successor);
  } else {
    cplace.log("check the chain");
  }

  return sarr;
}

// @ts-ignore
return {
  checkAccess,
  call,
};