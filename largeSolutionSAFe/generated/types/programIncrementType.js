let programIncrementType = workspace.assertType("cf.cplace.solution.safe.programIncrement");
programIncrementType.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

let titleAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let solutionAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.solution");
solutionAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let startDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessorAttribute.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});
predecessorAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let periodStatusAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.periodStatus");
periodStatusAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
periodStatusAttribute.setLocalizedNames({"de": "Period Status", "en": "Period Status"});

let confidenceVoteAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote");
confidenceVoteAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceVoteAttribute.setLocalizedNames({"en": "Confidence Vote"});
confidenceVoteAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let capacityAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.capacity");
capacityAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
capacityAttribute.setLocalizedNames({"de": "Capacity", "en": "Capacity"});

let resultAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote.Result");
resultAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Confidence Vote Result", "en": "Confidence Vote Result"});
resultAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.confidenceVote").setDerivableReferencedAttributeName("cf.cplace.solution.safe.confidenceVote.result");

let statsJsonAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.statsJson");
statsJsonAttribute.setType(Type.LONGTEXT).setMultiplicity(Multiplicity.AT_MOST_ONE);
statsJsonAttribute.setLocalizedNames({"en": "Statistics JSON"});