let objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({"de": "Objective", "en": "Objective"});

let numberAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.number");
numberAttribute.setType(Type.NUMBER);
numberAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
numberAttribute.setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let setAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type.LINK);
setAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});

let accomplishedAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
accomplishedAttribute.setType(Type.TEXTENUMERATION);
accomplishedAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
accomplishedAttribute.setLocalizedNames({"de": "Erreicht", "en": "Accomplished"});

let cycleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type.LINK);
cycleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});

let descriptionAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.description");
descriptionAttribute.setType(Type.RICHSTRING);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});