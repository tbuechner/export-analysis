var currentUser = cplace.utils().getCurrentUser();

var orgUnits = currentUser.getIncomingPages('cf.cplace.solution.okr.organizationalUnit', 'cf.cplace.solution.okr.assignedEmployee');

var lang = currentUser.getUserLanguage();
var result = "";
cplace.each(orgUnits, function(orgUnit) {
    var messages = {
        message: {
            en: 'Welcome ' + currentUser.getName() + '. You are assigned to the Org. Unit <b>' + orgUnit.getName() +'</b>.',
            de: 'Hallo ' + currentUser.getName() + '. Sie sind der Org. Einheit <b>' + orgUnit.getName() + '</b> zugewiesen.'
        }
    }

    result += "<div class='custom-stm-set-banner " + orgUnit.getName().replace(/\W+(.)/g) + "'>" + messages.message[lang] + "</div>"
    cplace.log('result'+result)
});

return result;