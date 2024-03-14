let eventType = workspace.assertType("cf.cplace.solution.safe.event");
eventType.setLocalizedNames({"de": "Event", "en": "Event"});

let titleAttribute = eventType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let startDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.startDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Start Datum", "en": "Start Date"});

let endDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.endDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "End-Datum", "en": "End Date"});

let solutionAttribute = eventType.assertAttribute("cf.cplace.solution.safe.solution").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Solution", "en": "Solution"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);