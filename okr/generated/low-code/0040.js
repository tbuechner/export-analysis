var currentUser = cplace.utils().getCurrentUser();
cplace.log(currentUser);
var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
  cplace.log(orgUnit.getName());
  var messages = {
    message: {
      en: 'Strategy',
      de: 'Strategy'
    }
  }

  result += "<div class='custom-stm-dashboard-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"

});

return result;