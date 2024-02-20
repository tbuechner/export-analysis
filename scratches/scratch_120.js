const workspace = getWorkspace("Workspace 1");

const objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({
    "de": "Objective",
    "en": "Objective"
});

const objectiveTitle = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
objectiveTitle.setType(Type.STRING);
objectiveTitle.setLocalizedNames({
    "de": "Titel",
    "en": "Title"
});

const objectiveAccomplished = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
objectiveAccomplished.setType(Type.BOOLEAN);
objectiveAccomplished.setLocalizedNames({
    "de": "Erreicht",
    "en": "Accomplished"
});

const keyResultType = workspace.assertType("cf.cplace.solution.okr.keyResult");
keyResultType.setLocalizedNames({
    "de": "Key Result",
    "en": "Key Result"
});

const keyResultTitle = keyResultType.assertAttribute("cf.cplace.solution.okr.title");
keyResultTitle.setType(Type.STRING);
keyResultTitle.setLocalizedNames({
    "de": "Titel",
    "en": "Title"
});

const keyResultProgressIndicator = keyResultType.assertAttribute("cf.cplace.solution.okr.progressIndicator");
keyResultProgressIndicator.setType(Type.DOUBLE_ENUMERATION);
keyResultProgressIndicator.setLocalizedNames({
    "de": "Fortschritt",
    "en": "Progress"
});
keyResultProgressIndicator.setEnumerationValues([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
keyResultProgressIndicator.setEnumerationDisplayValues(["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]);

const keyResultObjective = keyResultType.assertAttribute("cf.cplace.solution.okr.objective");
keyResultObjective.setType(Type.REFERENCE);
keyResultObjective.setTargetType("cf.cplace.solution.okr.objective");
keyResultObjective.setLocalizedNames({
    "de": "Zugehöriges Ziel",
    "en": "Associated Objective"
});

// create example data
const objective1 = cplace.actions().createPage({
    customType: 'cf.cplace.solution.okr.objective',
    customAttributes: {
        'cf.cplace.solution.okr.title': 'Objective 1',
        'cf.cplace.solution.okr.accomplished': true
    }
}, {
    setGeneratedName: true
});

const keyResult1 = cplace.actions().createPage({
    customType: 'cf.cplace.solution.okr.keyResult',
    customAttributes: {
        'cf.cplace.solution.okr.title': 'Key Result 1',
        'cf.cplace.solution.okr.progressIndicator': 0.5,
        'cf.cplace.solution.okr.objective': objective1
    }
}, {
    setGeneratedName: true
});
const keyResult2 = cplace.actions().createPage({
    customType: 'cf.cplace.solution.okr.keyResult',
    customAttributes: {
        'cf.cplace.solution.okr.title': 'Key Result 2',
        'cf.cplace.solution.okr.progressIndicator': 0.3,
        'cf.cplace.solution.okr.objective': objective1
    }
}, {
    setGeneratedName: true
});

// example code for reading attributes
const objective1Title = objective1.get('cf.cplace.solution.okr.title');
const objective1Accomplished = objective1.get('cf.cplace.solution.okr.accomplished');

const keyResult1Title = keyResult1.get('cf.cplace.solution.okr.title');
const keyResult1ProgressIndicator = keyResult1.get('cf.cplace.solution.okr.progressIndicator');
const keyResult1Objective = keyResult1.get('cf.cplace.solution.okr.objective');

// search for key results of objective1 with progressIndicator >= 0.4
let search = new Search()
    .add(Filters.type('cf.cplace.solution.okr.keyResult'))
    .add(Filters.customAttribute('cf.cplace.solution.okr.progressIndicator').gt(0.4))
    .add(Filters.customAttribute('cf.cplace.solution.okr.objective').eq(objective1));
let results = search.findAllPages();
