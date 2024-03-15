var set = embeddingPage;
var orgUnit = set.get('cf.cplace.solution.okr.organizationalUnit');

return "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + orgUnit.getName() + "</div>"