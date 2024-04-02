let safeMilestoneType = workspace.assertType("cf.cplace.solution.safe.safeMilestone");
safeMilestoneType.setLocalizedNames({"de": "SAFe Meilenstein", "en": "SAFe Milestone"});

let titleAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let dateAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.date");
dateAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE);
dateAttribute.setLocalizedNames({"de": "Datum", "en": "Date"});

let typeAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.type");
typeAttribute.setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE);
typeAttribute.setLocalizedNames({"de": "Typ", "en": "Type"});

let relevantForAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.relevantFor");
relevantForAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
relevantForAttribute.setLocalizedNames({"de": "Relevant F\u00fcr", "en": "Relevant For"});
relevantForAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let plannedStartAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStartAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedStartAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let plannedEndAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEndAttribute.setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedEndAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});