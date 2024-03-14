let safeMilestoneType = workspace.assertType("cf.cplace.solution.safe.safeMilestone");
safeMilestoneType.setLocalizedNames({"de": "SAFe Meilenstein", "en": "SAFe Milestone"});

let titleAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.title").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Titel", "en": "Title"});

let dateAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.date").setType(Type.DATE).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Datum", "en": "Date"});

let typeAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.type").setType(Type.TEXTENUMERATION).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Typ", "en": "Type"});

let relevantForAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.relevantFor").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Relevant F\u00fcr", "en": "Relevant For"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let plannedStartAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedStart").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let plannedEndAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedEnd").setType(Type.DATE).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Enddatum", "en": "End Date"});