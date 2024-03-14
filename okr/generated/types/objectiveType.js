let objectiveType = workspace.assertType("cf.cplace.solution.okr.objective");
objectiveType.setLocalizedNames({"de": "Objective", "en": "Objective"});

let numberAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.number").setType(Type.NUMBER).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Nummer", "en": "Number"});

let titleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let setAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.set").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Set", "en": "Set"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(true);

let accomplishedAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.accomplished").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Erreicht", "en": "Accomplished"});

let cycleAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.cycle").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Zyklus", "en": "Cycle"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);.setDerivableReferencingAttributeName("cf.cplace.solution.okr.set").setDerivableReferencedAttributeName("cf.cplace.solution.okr.cycle");

let descriptionAttribute = objectiveType.assertAttribute("cf.cplace.solution.okr.description").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Beschreibung", "en": "Description"});