var keyResult = embeddingPage;
var objective = keyResult.get('cf.cplace.solution.okr.objective');
var set = objective.get('cf.cplace.solution.okr.set');
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>"+objective.getName()+"</div>"