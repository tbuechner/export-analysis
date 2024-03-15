var objective = embeddingPage;
var set = objective.get('cf.cplace.solution.okr.set');
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>"+set.getName()+"</div>"