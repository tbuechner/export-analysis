let programIncrementType = workspace.assertType("cf.cplace.solution.safe.programIncrement");
programIncrementType.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

let titleAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let solutionAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.solution").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Solution", "en": "Solution"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let startDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.startDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.endDate").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.predecessor").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let periodStatusAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.periodStatus").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Period Status", "en": "Period Status"});

let confidenceVoteAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"en": "Confidence Vote"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let capacityAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.capacity").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Capacity", "en": "Capacity"});

let resultAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote.Result").setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Confidence Vote Result", "en": "Confidence Vote Result"});.setDerivableReferencingAttributeName("cf.cplace.solution.safe.confidenceVote").setDerivableReferencedAttributeName("cf.cplace.solution.safe.confidenceVote.result");

let statsJsonAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.statsJson").setType(Type.LONGTEXT).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"en": "Statistics JSON"});