const workspace = getWorkspace("Workspace 1");

const objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({
    "de": "Objective",
    "en": "Objective"
});

const objectiveTitle = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
objectiveTitle.setType(Type.STRING);
objectiveTitle.setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveTitle.setLocalizedNames({
    "de": "Titel",
    "en": "Title"
});

const objectiveAccomplished = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
objectiveAccomplished.setType(Type.BOOLEAN);
objectiveAccomplished.setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveAccomplished.setLocalizedNames({
    "de": "Erreicht",
    "en": "Accomplished"
});

const objectiveNumber = objectiveType.assertAttribute("cf.cplace.solution.okr.number");
objectiveNumber.setType(Type.NUMBER);
objectiveNumber.setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveNumber.setLocalizedNames({
    "de": "Nummer",
    "en": "Number"
});


