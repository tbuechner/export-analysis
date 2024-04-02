/*ChangeListener on attribute periodStatus of programIncrement type 
whenever the periodStatus of the PI is changed the periodStatus of the associated features are also updated
Steps followed to achieve this 
1.get the updated periodStatus of the PI
2.if the periodStatus is not null get the feature associated with the PI using Features as Program Increment 
3.set the updated periodStatus of the PI to its Features*/

cplace.setLogName('cF - syncProgramIncrementPeriodStatustoFeature');

// Configuration
const PI={
  TYPE:'cf.cplace.solution.safe.programIncrement',
  ATTR:{
    periodStatus:'cf.cplace.solution.safe.periodStatus'
  },
  refAttr:{
    pIReferenceAttr:'cf.cplace.solution.safe.programIncrement',
    mappingRefAttr:'cf.cplace.solution.safe.periodStatus',
    orderRefAttr:'cf.cplace.solution.safe.order'
  }
}

const FEATURE={
  TYPE:'cf.cplace.solution.safe.feature',
  ATTR:{
    PI:'cf.cplace.solution.safe.programIncrement',
    periodStatus:'cf.cplace.solution.safe.periodStatus'
  }
}

// get changed page
let page = changeEvent.getEntity();

let periodStatus=page.get(PI.ATTR.periodStatus);
cplace.log(periodStatus);

if(periodStatus == null){
  return
}

let features=page.getIncomingPages(FEATURE.TYPE,FEATURE.ATTR.PI);
//cplace.log('periodStatus of feature'+features);


cplace.each(features,function(feature){
  cplace.actions().updatePage(feature, {
	customAttributes: {
		[FEATURE.ATTR.periodStatus]: periodStatus
		}
    });
 
feature.registerAttributeForRefresh(FEATURE.ATTR.periodStatus);

})