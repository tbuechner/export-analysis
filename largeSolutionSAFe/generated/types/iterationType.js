let iterationType = workspace.assertType("cf.cplace.solution.safe.iteration");
iterationType.setLocalizedNames({"de": "Iteration", "en": "Iteration"});

let titleAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let programIncrementAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrementAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
programIncrementAttribute.setLocalizedNames({"de": "Programminkrement", "en": "Program Increment"});
programIncrementAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let startDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessorAttribute.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});
predecessorAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);