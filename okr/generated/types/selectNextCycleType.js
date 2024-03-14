let selectNextCycleType = workspace.assertType("cf.cplace.solution.okr.selectNextCycle");
selectNextCycleType.setLocalizedNames({"de": "Select next Cycle", "en": "Select next Cycle"});

let nextCycleAttribute = selectNextCycleType.assertAttribute("cf.cplace.solution.okr.nextCycle");
nextCycleAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
nextCycleAttribute.setLocalizedNames({"de": "N\u00e4chster Zyklus", "en": "Next Cycle"});
nextCycleAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);