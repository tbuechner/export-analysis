let iterationType = workspace.assertType("cf.cplace.solution.safe.iteration");
iterationType.setLocalizedNames({"de": "Iteration", "en": "Iteration"});

let titleAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let programIncrementAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.programIncrement").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Programminkrement", "en": "Program Increment"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let startDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.startDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.endDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.predecessor").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);