let eventType = workspace.assertType("cf.cplace.solution.safe.event");
eventType.setLocalizedNames({"de": "Event", "en": "Event"});

let titleAttribute = eventType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let startDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Start Datum", "en": "Start Date"});

let endDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "End-Datum", "en": "End Date"});

let solutionAttribute = eventType.assertAttribute("cf.cplace.solution.safe.solution");
solutionAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);