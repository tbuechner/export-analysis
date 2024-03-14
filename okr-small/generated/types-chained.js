let objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({"de": "Objective", "en": "Objective"});

let numberAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.number");
numberAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.EXACTLY_ONE);
numberAttribute.setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let setAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.set");
setAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
setAttribute.setLocalizedNames({"de": "Set", "en": "Set"});
setAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let accomplishedAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished");
accomplishedAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE);
accomplishedAttribute.setLocalizedNames({"de": "Erreicht", "en": "Accomplished"});

let cycleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.cycle");
cycleAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
cycleAttribute.setLocalizedNames({"de": "Zyklus", "en": "Cycle"});
cycleAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);
cycleAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let descriptionAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.description");
descriptionAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});