cplace.setLogName('pageAction on PI-ProgramIncrement Progress');

//Configurations
const PI={
  TYPE:'cf.cplace.solution.safe.programIncrement',
  ATTR:{
    periodStatus:'cf.cplace.solution.safe.periodStatus',
    predecessor:'cf.cplace.solution.safe.predecessor'
  },
  refAttr:{
  	order:'cf.cplace.solution.safe.order'
}
}
const periodStatus={
  TYPE:'cf.cplace.solution.safe.periodStatus',
  ATTR:{
  	order:'cf.cplace.solution.safe.order'
}
}  

let orderarr=[];
let sarr=[];
let order = (page.get(PI.ATTR.periodStatus) ? page.get(PI.ATTR.periodStatus).get(PI.refAttr.order) : null);

 return {
   
   checkAccess: function() {
              // Pageaction should only be available when the periodStatus is 'Running'
                if (order == 0) {
                    return true;
                }
                return false;
            }, 
  	call: function() {
    	return doBusinessAction(page);
  	}
}
 
 
 function doBusinessAction(page){
   
   let order=(page.get(PI.ATTR.periodStatus) ? page.get(PI.ATTR.periodStatus).get(PI.refAttr.order) : null);
   let update=true; //setting the flag to check whether the update process should be performed or not
  
   
   /*orderMap is required to get the corresponding periodStatus of the order */
   let orderSearch=new Search();
   orderSearch.add(Filters.space(page.getSpaceId()));
   orderSearch.add(Filters.type(periodStatus.TYPE));
   orderSearch.add(Filters.customAttributeNonempty(periodStatus.ATTR.order));
   let result=orderSearch.findAllPages();
   
   let orderMap=new Map();
    if(result){
       cplace.each(result,function(value){
         orderMap.set(value.get(periodStatus.ATTR.order),value);
         orderarr.push(value.get(periodStatus.ATTR.order));
       });
    }
  
     /*Get the highest order */
     let highorder=Math.max(...orderarr);
     cplace.log(highorder);
     /*check the predecessor chain to be set properly or not*/
     let arr= checkforPredecessorChain(page); 
     for(let i=0;i<=highorder;i++){
        if(arr[i]==null){
          update=false;
    /*Return the error message if the predecessor chain is not set*/    
       return {
            success: false, // default is true
            message: {
                en: 'Set the predeccessor chain properly'
            } 
         }  
      }
   }   

     // update the periodStatus 
     if(update){
        updateperiodStatus(page, order, orderMap);  
     }
 }
     
  
 
 
function updateperiodStatus(page, orderIncr, orderMap) {
 
   let newPeriodStatus = orderMap.get(orderIncr - 1);
      
     if (newPeriodStatus) {
        cplace.actions().updatePage(page, {
           customAttributes: {
            [PI.ATTR.periodStatus]: newPeriodStatus //update the status to the one which comes next in the order (decreased by 1)
             }
         });
     orderIncr += 1;
            
     // check for the successor PI if successor is present then update its periodStatus
     let successor = Iterables.getFirst(page.getIncomingPages(PI.TYPE,PI.ATTR.predecessor), null);
       
     if (successor) {
            updateperiodStatus (successor, orderIncr, orderMap);
         }
	  }
}


 function checkforPredecessorChain(page){
    let successor = Iterables.getFirst(page.getIncomingPages(PI.TYPE,PI.ATTR.predecessor), null);
    sarr.push(successor);
    if(successor!=null){
       cplace.log(successor.getName());
       checkforPredecessorChain(successor,sarr);
    }else{
       cplace.log('check the chain');
    }
     
    return sarr;
 }