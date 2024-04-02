/*
*Validator 
*checks for progressUpdated to be true
*/
function main() {
   let result = null;
   let updated = page.get('cf.cplace.solution.okr.progressUpdated');

   if (!updated) {
      result = 'The progess must be updated!';
   }

   return result;
}

return main();