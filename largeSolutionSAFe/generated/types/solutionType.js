let solutionType = workspace.assertType("cf.cplace.solution.safe.solution");
solutionType.setLocalizedNames({"de": "Solution", "en": "Solution"});

let descriptionAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.RICHSTRING).setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let solutionTrainEngineerAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainEngineer");
solutionTrainEngineerAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainEngineerAttribute.setLocalizedNames({"de": "Solution Train Engineer", "en": "Solution Train Engineer"});
solutionTrainEngineerAttribute.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionTrainArchitectAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainArchitect");
solutionTrainArchitectAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainArchitectAttribute.setLocalizedNames({"de": "Solution Train Architekt", "en": "Solution Train Architect"});
solutionTrainArchitectAttribute.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let solutionManagementAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionManagement");
solutionManagementAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionManagementAttribute.setLocalizedNames({"de": "Solution Management", "en": "Solution Management"});
solutionManagementAttribute.setEntityKind("person").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);

let previousPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.previousPi");
previousPiAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
previousPiAttribute.setLocalizedNames({"de": "Vorheriges PI", "en": "Previous PI"});
previousPiAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let currentPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.currentPi");
currentPiAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.EXACTLY_ONE);
currentPiAttribute.setLocalizedNames({"de": "Laufendes PI", "en": "Current PI"});
currentPiAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let nextPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.nextPi");
nextPiAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
nextPiAttribute.setLocalizedNames({"de": "N\u00e4chstes PI", "en": "Next PI"});
nextPiAttribute.setEntityKind("page").setReferenceSameWorkspace(true).setReferenceIsHierarchy(false);

let funnelWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.funnelWIPLimit");
funnelWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
funnelWIPLimitAttribute.setLocalizedNames({"de": "Funnel WIP Limit", "en": "Funnel WIP Limit"});

let analyzingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.analyzingWIPLimit");
analyzingWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
analyzingWIPLimitAttribute.setLocalizedNames({"de": "Analyzing WIP Limit", "en": "Analyzing WIP Limit"});

let backlogWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.backlogWIPLimit");
backlogWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
backlogWIPLimitAttribute.setLocalizedNames({"de": "Backlog WIP Limit", "en": "Backlog WIP Limit"});

let implementingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.implementingWIPLimit");
implementingWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
implementingWIPLimitAttribute.setLocalizedNames({"de": "Implementing WIP Limit", "en": "Implementing WIP Limit"});

let validatingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.validatingWIPLimit");
validatingWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
validatingWIPLimitAttribute.setLocalizedNames({"de": "Validating WIP Limit", "en": "Validating WIP Limit"});

let deployingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.deployingWIPLimit");
deployingWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
deployingWIPLimitAttribute.setLocalizedNames({"de": "Deploying WIP Limit", "en": "Deploying WIP Limit"});

let releasingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.releasingWIPLimit");
releasingWIPLimitAttribute.setType(Type.NUMBER).setMultiplicity(Multiplicity.AT_MOST_ONE);
releasingWIPLimitAttribute.setLocalizedNames({"de": "Releasing WIP Limit", "en": "Releasing WIP Limit"});

let shortNameAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.shortName");
shortNameAttribute.setType(Type.TEXT).setMultiplicity(Multiplicity.EXACTLY_ONE);
shortNameAttribute.setLocalizedNames({"de": "K\u00fcrzel", "en": "Short Name"});

let horizonAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.horizon");
horizonAttribute.setType(Type.LINK).setMultiplicity(Multiplicity.AT_MOST_ONE);
horizonAttribute.setLocalizedNames({"de": "Horizon", "en": "Horizon"});
horizonAttribute.setEntityKind("page").setReferenceSameWorkspace(false).setReferenceIsHierarchy(false);