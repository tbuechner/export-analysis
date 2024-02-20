const workspace = getWorkspace("OKR");

const objectiveType = workspace.assertType({
    internalName: "cf.cplace.solution.okr.cycle",
    localizedNames: {
        "de": "Zyklus",
        "en": "Cycle"
    },
});

const objectiveYear = objectiveType.assertStringAttribute({
    internalName: "cf.cplace.solution.okr.year",
    localizedNames: {
        "de": "Jahr",
        "en": "Year"
    },
    multiplicity: "exactlyOne"
});

const objectiveQuarter = objectiveType.assertStringAttribute({
    internalName: "cf.cplace.solution.okr.accomplished",
    localizedNames: {
        "de": "Quartal",
        "en": "Quarter"
    },
    multiplicity: "exactlyOne"
});
const objectiveState = objectiveType.assertStringAttribute({
    internalName: "cf.cplace.solution.okr.state",
    localizedNames: {
        "de": "Status",
        "en": "State"
    },
    multiplicity: "exactlyOne"
});
