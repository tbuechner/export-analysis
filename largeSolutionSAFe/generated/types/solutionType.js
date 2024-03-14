let solutionType = workspace.assertType("cf.cplace.solution.safe.solution");
solutionType.setLocalizedNames({"de": "Solution", "en": "Solution"});

let descriptionAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.description").setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let solutionTrainEngineerAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainEngineer").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution Train Engineer", "en": "Solution Train Engineer"});.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionTrainArchitectAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainArchitect").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution Train Architekt", "en": "Solution Train Architect"});.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionManagementAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionManagement").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Solution Management", "en": "Solution Management"});.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let previousPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.previousPi").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Vorheriges PI", "en": "Previous PI"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let currentPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.currentPi").setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "Laufendes PI", "en": "Current PI"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let nextPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.nextPi").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "N\u00e4chstes PI", "en": "Next PI"});.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let funnelWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.funnelWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Funnel WIP Limit", "en": "Funnel WIP Limit"});

let analyzingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.analyzingWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Analyzing WIP Limit", "en": "Analyzing WIP Limit"});

let backlogWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.backlogWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Backlog WIP Limit", "en": "Backlog WIP Limit"});

let implementingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.implementingWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Implementing WIP Limit", "en": "Implementing WIP Limit"});

let validatingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.validatingWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Validating WIP Limit", "en": "Validating WIP Limit"});

let deployingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.deployingWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Deploying WIP Limit", "en": "Deploying WIP Limit"});

let releasingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.releasingWIPLimit").setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Releasing WIP Limit", "en": "Releasing WIP Limit"});

let shortNameAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.shortName").setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE).setLocalizedNames({"de": "K\u00fcrzel", "en": "Short Name"});

let horizonAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.horizon").setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE).setLocalizedNames({"de": "Horizon", "en": "Horizon"});.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);