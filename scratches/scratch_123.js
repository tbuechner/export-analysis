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

const objectiveTitle = objectiveType.assertStringAttribute({
    internalName: "cf.cplace.solution.okr.title",
    localizedNames: {
        "de": "Titel",
        "en": "Title"
    },
    multiplicity: "exactlyOne"
});

const objectiveAccomplished = objectiveType.assertBooleanAttribute({
    internalName: "cf.cplace.solution.okr.accomplished",
    localizedNames: {
        "de": "Erreicht",
        "en": "Accomplished"
    },
    multiplicity: "exactlyOne"
});

const keyResultType = workspace.assertType({
    internalName: "cf.cplace.solution.okr.keyResult",
    localizedNames: {
        "de": "Key Result",
        "en": "Key Result"
    },
    iconName: "fa-trophy"
});

const keyResultTitle = keyResultType.assertStringAttribute({
    internalName: "cf.cplace.solution.okr.title",
    localizedNames: {
        "de": "Titel",
        "en": "Title"
    },
    multiplicity: "exactlyOne"
});

const keyResultProgressIndicator = keyResultType.assertDoubleEnumAttribute({
    internalName: "cf.cplace.solution.okr.progressIndicator",
    localizedNames: {
        "de": "Fortschritt",
        "en": "Progress"
    },
    multiplicity: "exactlyOne",
    enumerationValues: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    enumerationDisplayValues: ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
});

const keyResultObjective = keyResultType.assertReferenceAttribute({
    internalName: "cf.cplace.solution.okr.objective",
    targetType: "cf.cplace.solution.okr.objective",
    localizedNames: {
        "de": "Zugehöriges Ziel",
        "en": "Associated Objective"
    },
    multiplicity: "exactlyOne"
});