const workspace = getWorkspace("Workspace 1");

const objectiveType = workspace.assertType({
    internalName: "cf.cplace.solution.okr.objective",
    localizedNames: {
        "de": "Objective",
        "en": "Objective"
    },
    // a font awesome icon name
    iconName: "fa-bullseye"
});

const objectiveTitle = objectiveType.assertAttribute({
    internalName: "cf.cplace.solution.okr.title",
    type: Type.STRING,
    localizedNames: {
        "de": "Titel",
        "en": "Title"
    }
});

const objectiveAccomplished = objectiveType.assertAttribute({
    internalName: "cf.cplace.solution.okr.accomplished",
    type: Type.BOOLEAN,
    localizedNames: {
        "de": "Erreicht",
        "en": "Accomplished"
    }
});

const keyResultType = workspace.assertType({
    internalName: "cf.cplace.solution.okr.keyResult",
    localizedNames: {
        "de": "Key Result",
        "en": "Key Result"
    },
    iconName: "fa-trophy"
});

const keyResultTitle = keyResultType.assertAttribute({
    internalName: "cf.cplace.solution.okr.title",
    type: Type.STRING,
    localizedNames: {
        "de": "Titel",
        "en": "Title"
    }
});

const keyResultProgressIndicator = keyResultType.assertAttribute({
    internalName: "cf.cplace.solution.okr.progressIndicator",
    type: Type.DOUBLE_ENUMERATION,
    localizedNames: {
        "de": "Fortschritt",
        "en": "Progress"
    },
    enumerationValues: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    enumerationDisplayValues: ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
});

const keyResultObjective = keyResultType.assertAttribute({
    internalName: "cf.cplace.solution.okr.objective",
    type: Type.REFERENCE,
    targetType: "cf.cplace.solution.okr.objective",
    localizedNames: {
        "de": "Zugehöriges Ziel",
        "en": "Associated Objective"
    }
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

