const workspace = getWorkspace("OKR"); // use the proper workspace name from JSON

const Type = {
    NUMBER: 'Number',
    STRING: 'Text',
    TEXT_ENUMERATION: 'TextEnumeration', // assuming there's a type constant for TextEnumeration
};

const Multiplicity = {
    EXACTLY_ONE: 'exactlyOne',
    AT_MOST_ONE: 'maximalOne',
};

const objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({
    de: "Objective",
    en: "Objective"
});

const objectiveNumber = objectiveType.assertAttribute("cf.cplace.solution.okr.number");
objectiveNumber.setType(Type.NUMBER);
objectiveNumber.setMultiplicity(Multiplicity.EXACTLY_ONE);
objectiveNumber.setLocalizedNames({
    de: "Nummer",
    en: "Number"
});
objectiveNumber.setLocalizedShortName({
    de: "Nr.",
    en: "No."
});

const objectiveTitle = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
objectiveTitle.setType(Type.STRING);
objectiveTitle.setMultiplicity(Multiplicity.AT_MOST_ONE);
objectiveTitle.setLocalizedNames({
    de: "Titel",
    en: "Title"
});

const objectiveAccomplished = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
objectiveAccomplished.setType(Type.TEXT_ENUMERATION);
objectiveAccomplished.setMultiplicity(Multiplicity.AT_MOST_ONE);
objectiveAccomplished.setLocalizedNames({
    de: "Erreicht",
    en: "Accomplished"
});
