let solutionType = workspace.assertType("cf.cplace.solution.safe.solution");
solutionType.setLocalizedNames({"de": "Solution", "en": "Solution"});

let descriptionAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.RICHSTRING);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let solutionTrainEngineerAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainEngineer");
solutionTrainEngineerAttribute.setType(Type.LINK);
solutionTrainEngineerAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainEngineerAttribute.setLocalizedNames({"de": "Solution Train Engineer", "en": "Solution Train Engineer"});
solutionTrainEngineerAttribute.setEntityKind("person");
solutionTrainEngineerAttribute.setReferenceSameWorkspace(false);
solutionTrainEngineerAttribute.setReferenceIsHierarchy(false);

let solutionTrainArchitectAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionTrainArchitect");
solutionTrainArchitectAttribute.setType(Type.LINK);
solutionTrainArchitectAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainArchitectAttribute.setLocalizedNames({"de": "Solution Train Architekt", "en": "Solution Train Architect"});
solutionTrainArchitectAttribute.setEntityKind("person");
solutionTrainArchitectAttribute.setReferenceSameWorkspace(false);
solutionTrainArchitectAttribute.setReferenceIsHierarchy(false);

let solutionManagementAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.solutionManagement");
solutionManagementAttribute.setType(Type.LINK);
solutionManagementAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionManagementAttribute.setLocalizedNames({"de": "Solution Management", "en": "Solution Management"});
solutionManagementAttribute.setEntityKind("person");
solutionManagementAttribute.setReferenceSameWorkspace(false);
solutionManagementAttribute.setReferenceIsHierarchy(false);

let previousPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.previousPi");
previousPiAttribute.setType(Type.LINK);
previousPiAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
previousPiAttribute.setLocalizedNames({"de": "Vorheriges PI", "en": "Previous PI"});
previousPiAttribute.setEntityKind("page");
previousPiAttribute.setReferenceSameWorkspace(true);
previousPiAttribute.setReferenceIsHierarchy(false);

let currentPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.currentPi");
currentPiAttribute.setType(Type.LINK);
currentPiAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
currentPiAttribute.setLocalizedNames({"de": "Laufendes PI", "en": "Current PI"});
currentPiAttribute.setEntityKind("page");
currentPiAttribute.setReferenceSameWorkspace(true);
currentPiAttribute.setReferenceIsHierarchy(false);

let nextPiAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.nextPi");
nextPiAttribute.setType(Type.LINK);
nextPiAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
nextPiAttribute.setLocalizedNames({"de": "N\u00e4chstes PI", "en": "Next PI"});
nextPiAttribute.setEntityKind("page");
nextPiAttribute.setReferenceSameWorkspace(true);
nextPiAttribute.setReferenceIsHierarchy(false);

let funnelWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.funnelWIPLimit");
funnelWIPLimitAttribute.setType(Type.NUMBER);
funnelWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
funnelWIPLimitAttribute.setLocalizedNames({"de": "Funnel WIP Limit", "en": "Funnel WIP Limit"});

let analyzingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.analyzingWIPLimit");
analyzingWIPLimitAttribute.setType(Type.NUMBER);
analyzingWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
analyzingWIPLimitAttribute.setLocalizedNames({"de": "Analyzing WIP Limit", "en": "Analyzing WIP Limit"});

let backlogWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.backlogWIPLimit");
backlogWIPLimitAttribute.setType(Type.NUMBER);
backlogWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
backlogWIPLimitAttribute.setLocalizedNames({"de": "Backlog WIP Limit", "en": "Backlog WIP Limit"});

let implementingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.implementingWIPLimit");
implementingWIPLimitAttribute.setType(Type.NUMBER);
implementingWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
implementingWIPLimitAttribute.setLocalizedNames({"de": "Implementing WIP Limit", "en": "Implementing WIP Limit"});

let validatingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.validatingWIPLimit");
validatingWIPLimitAttribute.setType(Type.NUMBER);
validatingWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
validatingWIPLimitAttribute.setLocalizedNames({"de": "Validating WIP Limit", "en": "Validating WIP Limit"});

let deployingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.deployingWIPLimit");
deployingWIPLimitAttribute.setType(Type.NUMBER);
deployingWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
deployingWIPLimitAttribute.setLocalizedNames({"de": "Deploying WIP Limit", "en": "Deploying WIP Limit"});

let releasingWIPLimitAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.releasingWIPLimit");
releasingWIPLimitAttribute.setType(Type.NUMBER);
releasingWIPLimitAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
releasingWIPLimitAttribute.setLocalizedNames({"de": "Releasing WIP Limit", "en": "Releasing WIP Limit"});

let shortNameAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.shortName");
shortNameAttribute.setType(Type.TEXT);
shortNameAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
shortNameAttribute.setLocalizedNames({"de": "K\u00fcrzel", "en": "Short Name"});

let horizonAttribute = solutionType.assertAttribute("cf.cplace.solution.safe.horizon");
horizonAttribute.setType(Type.LINK);
horizonAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
horizonAttribute.setLocalizedNames({"de": "Horizon", "en": "Horizon"});
horizonAttribute.setEntityKind("page");
horizonAttribute.setReferenceSameWorkspace(false);
horizonAttribute.setReferenceIsHierarchy(false);

let programIncrementType = workspace.assertType("cf.cplace.solution.safe.programIncrement");
programIncrementType.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

let titleAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let solutionAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.solution");
solutionAttribute.setType(Type.LINK);
solutionAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page");
solutionAttribute.setReferenceSameWorkspace(true);
solutionAttribute.setReferenceIsHierarchy(false);

let startDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE);
startDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE);
endDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK);
predecessorAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessorAttribute.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});
predecessorAttribute.setEntityKind("page");
predecessorAttribute.setReferenceSameWorkspace(true);
predecessorAttribute.setReferenceIsHierarchy(false);

let periodStatusAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.periodStatus");
periodStatusAttribute.setType(Type.TEXTENUMERATION);
periodStatusAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
periodStatusAttribute.setLocalizedNames({"de": "Period Status", "en": "Period Status"});

let confidenceVoteAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote");
confidenceVoteAttribute.setType(Type.LINK);
confidenceVoteAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceVoteAttribute.setLocalizedNames({"en": "Confidence Vote"});
confidenceVoteAttribute.setEntityKind("page");
confidenceVoteAttribute.setReferenceSameWorkspace(true);
confidenceVoteAttribute.setReferenceIsHierarchy(false);

let capacityAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.capacity");
capacityAttribute.setType(Type.NUMBER);
capacityAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
capacityAttribute.setLocalizedNames({"de": "Capacity", "en": "Capacity"});

let resultAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.confidenceVote.Result");
resultAttribute.setType(Type.TEXT);
resultAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Confidence Vote Result", "en": "Confidence Vote Result"});
resultAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.confidenceVote");
resultAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.confidenceVote.result");

let statsJsonAttribute = programIncrementType.assertAttribute("cf.cplace.solution.safe.statsJson");
statsJsonAttribute.setType(Type.LONGTEXT);
statsJsonAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
statsJsonAttribute.setLocalizedNames({"en": "Statistics JSON"});

let iterationType = workspace.assertType("cf.cplace.solution.safe.iteration");
iterationType.setLocalizedNames({"de": "Iteration", "en": "Iteration"});

let titleAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let programIncrementAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrementAttribute.setType(Type.LINK);
programIncrementAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
programIncrementAttribute.setLocalizedNames({"de": "Programminkrement", "en": "Program Increment"});
programIncrementAttribute.setEntityKind("page");
programIncrementAttribute.setReferenceSameWorkspace(true);
programIncrementAttribute.setReferenceIsHierarchy(false);

let startDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE);
startDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let endDateAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE);
endDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let predecessorAttribute = iterationType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK);
predecessorAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessorAttribute.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});
predecessorAttribute.setEntityKind("page");
predecessorAttribute.setReferenceSameWorkspace(true);
predecessorAttribute.setReferenceIsHierarchy(false);

let capabilityType = workspace.assertType("cf.cplace.solution.safe.capability");
capabilityType.setLocalizedNames({"de": "Capability", "en": "Capability"});

let titleAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let referenceAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solution.reference");
referenceAttribute.setType(Type.LINK);
referenceAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
referenceAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
referenceAttribute.setEntityKind("page");
referenceAttribute.setReferenceSameWorkspace(true);
referenceAttribute.setReferenceIsHierarchy(false);

let descriptionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.RICHSTRING);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let capabilityTypeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityType");
capabilityTypeAttribute.setType(Type.TEXTENUMERATION);
capabilityTypeAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityTypeAttribute.setLocalizedNames({"de": "Capability Type", "en": "Capability Type"});

let stateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.state");
stateAttribute.setType(Type.TEXTENUMERATION);
stateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
stateAttribute.setLocalizedNames({"de": "Status", "en": "State"});

let wsjfAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.wsjf");
wsjfAttribute.setType(Type.NUMBER);
wsjfAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
wsjfAttribute.setLocalizedNames({"de": "WSJF", "en": "WSJF"});

let businessValueAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValueAttribute.setType(Type.NUMBERENUMERATION);
businessValueAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValueAttribute.setLocalizedNames({"de": "User Business Value", "en": "User Business Value"});

let timeCriticalityAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.timeCriticality");
timeCriticalityAttribute.setType(Type.NUMBERENUMERATION);
timeCriticalityAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
timeCriticalityAttribute.setLocalizedNames({"de": "Zeitliche Kritikalit\u00e4t", "en": "Time Criticality"});

let riskReductionAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.riskReduction");
riskReductionAttribute.setType(Type.NUMBERENUMERATION);
riskReductionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
riskReductionAttribute.setLocalizedNames({"de": "Risk Reduction", "en": "Risk Reduction"});

let jobSizeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.jobSize");
jobSizeAttribute.setType(Type.NUMBERENUMERATION);
jobSizeAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
jobSizeAttribute.setLocalizedNames({"de": "Job Size", "en": "Job Size"});

let programIncrementAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrementAttribute.setType(Type.LINK);
programIncrementAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
programIncrementAttribute.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});
programIncrementAttribute.setEntityKind("page");
programIncrementAttribute.setReferenceSameWorkspace(true);
programIncrementAttribute.setReferenceIsHierarchy(false);

let actualStartDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualStartDate");
actualStartDateAttribute.setType(Type.DATE);
actualStartDateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualStartDateAttribute.setLocalizedNames({"de": "Actual Start Date", "en": "Actual Start Date"});

let actualEndDateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.actualEndDate");
actualEndDateAttribute.setType(Type.DATE);
actualEndDateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualEndDateAttribute.setLocalizedNames({"de": "Actual End Date", "en": "Actual End Date"});

let flowTimeAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.flowTime");
flowTimeAttribute.setType(Type.NUMBER);
flowTimeAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
flowTimeAttribute.setLocalizedNames({"de": "Flow time", "en": "Flow time"});

let programAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.program");
programAttribute.setType(Type.LINK);
programAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
programAttribute.setLocalizedNames({"de": "Program", "en": "Program"});
programAttribute.setEntityKind("page");
programAttribute.setReferenceSameWorkspace(false);
programAttribute.setReferenceIsHierarchy(false);

let capabilityownerAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.capabilityowner");
capabilityownerAttribute.setType(Type.LINK);
capabilityownerAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityownerAttribute.setLocalizedNames({"de": "Capability Owner", "en": "Capability Owner"});
capabilityownerAttribute.setEntityKind("person");
capabilityownerAttribute.setReferenceSameWorkspace(false);
capabilityownerAttribute.setReferenceIsHierarchy(false);

let portfolioEpicAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.portfolioEpic");
portfolioEpicAttribute.setType(Type.LINK);
portfolioEpicAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
portfolioEpicAttribute.setLocalizedNames({"en": "Portfolio Epic"});
portfolioEpicAttribute.setEntityKind("page");
portfolioEpicAttribute.setReferenceSameWorkspace(false);
portfolioEpicAttribute.setReferenceIsHierarchy(false);

let solutionShortNameAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.solutionShortName");
solutionShortNameAttribute.setType(Type.TEXT);
solutionShortNameAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionShortNameAttribute.setLocalizedNames({"de": "Solution K\u00fcrzel", "en": "Solution Short Name"});
solutionShortNameAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.solution.reference");
solutionShortNameAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.shortName");

let plannedStartAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStartAttribute.setType(Type.DATE);
plannedStartAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStartAttribute.setLocalizedNames({"de": "Geplanter Start", "en": "Planned Start"});
plannedStartAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement");
plannedStartAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.startDate");

let plannedEndAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEndAttribute.setType(Type.DATE);
plannedEndAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEndAttribute.setLocalizedNames({"de": "Geplantes Ende", "en": "Planned End"});
plannedEndAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.programIncrement");
plannedEndAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.endDate");

let iterationAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.iteration");
iterationAttribute.setType(Type.LINK);
iterationAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
iterationAttribute.setLocalizedNames({"de": "Iterations", "en": "Iterations"});
iterationAttribute.setEntityKind("page");
iterationAttribute.setReferenceSameWorkspace(true);
iterationAttribute.setReferenceIsHierarchy(false);

let definitionOfReadyAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfReady");
definitionOfReadyAttribute.setType(Type.BOOLEAN);
definitionOfReadyAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfReadyAttribute.setLocalizedNames({"de": "Definition of Ready", "en": "Definition of Ready"});

let definitionOfDoneAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.definitionOfDone");
definitionOfDoneAttribute.setType(Type.BOOLEAN);
definitionOfDoneAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfDoneAttribute.setLocalizedNames({"de": "Definition of Done", "en": "Definition of Done"});

let acceptanceCriteriaAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.acceptanceCriteria");
acceptanceCriteriaAttribute.setType(Type.RICHSTRING);
acceptanceCriteriaAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
acceptanceCriteriaAttribute.setLocalizedNames({"de": "Akzeptanzkriterien", "en": "Acceptance Criteria"});

let benefitHypothesisAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.benefitHypothesis");
benefitHypothesisAttribute.setType(Type.RICHSTRING);
benefitHypothesisAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
benefitHypothesisAttribute.setLocalizedNames({"de": "Benefit Hypothesis", "en": "Benefit Hypothesis"});

let conflictStateAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.conflictState");
conflictStateAttribute.setType(Type.TEXTENUMERATION);
conflictStateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
conflictStateAttribute.setLocalizedNames({"de": "Datumskonflikt", "en": "Conflict State"});

let featuresAttribute = capabilityType.assertAttribute("cf.cplace.solution.safe.features");
featuresAttribute.setType(Type.LINK);
featuresAttribute.setMultiplicity(Multiplicity.ANY_NUMBER);
featuresAttribute.setLocalizedNames({"de": "Features", "en": "Features"});
featuresAttribute.setEntityKind("page");
featuresAttribute.setReferenceSameWorkspace(false);
featuresAttribute.setReferenceIsHierarchy(false);

let dependencyType = workspace.assertType("cf.cplace.solution.safe.dependency");
dependencyType.setLocalizedNames({"de": "Abh\u00e4ngigkeit", "en": "Dependency"});

let titleAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let successorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.successor");
successorAttribute.setType(Type.LINK);
successorAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
successorAttribute.setLocalizedNames({"de": "A", "en": "A"});
successorAttribute.setEntityKind("page");
successorAttribute.setReferenceSameWorkspace(false);
successorAttribute.setReferenceIsHierarchy(false);

let typeAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.type");
typeAttribute.setType(Type.TEXTENUMERATION);
typeAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
typeAttribute.setLocalizedNames({"de": "Typ", "en": "Type"});

let predecessorAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessorAttribute.setType(Type.LINK);
predecessorAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
predecessorAttribute.setLocalizedNames({"de": "B", "en": "B"});
predecessorAttribute.setEntityKind("page");
predecessorAttribute.setReferenceSameWorkspace(false);
predecessorAttribute.setReferenceIsHierarchy(false);

let statusAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.status");
statusAttribute.setType(Type.TEXTENUMERATION);
statusAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
statusAttribute.setLocalizedNames({"de": "Status", "en": "Status"});

let descriptionAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.description");
descriptionAttribute.setType(Type.TEXT);
descriptionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
descriptionAttribute.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

let plannedStartAAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedStartA");
plannedStartAAttribute.setType(Type.DATE);
plannedStartAAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStartAAttribute.setLocalizedNames({"de": "Geplanter Start A", "en": "Planned Start A"});
plannedStartAAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.successor");
plannedStartAAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedStart");

let plannedEndBAttribute = dependencyType.assertAttribute("cf.cplace.solution.safe.plannedEndB");
plannedEndBAttribute.setType(Type.DATE);
plannedEndBAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEndBAttribute.setLocalizedNames({"de": "Geplantes Ende B", "en": "Planned End B"});
plannedEndBAttribute.setDerivableReferencingAttributeName("cf.cplace.solution.safe.predecessor");
plannedEndBAttribute.setDerivableReferencedAttributeName("cf.cplace.solution.safe.plannedEnd");

let safeMilestoneType = workspace.assertType("cf.cplace.solution.safe.safeMilestone");
safeMilestoneType.setLocalizedNames({"de": "SAFe Meilenstein", "en": "SAFe Milestone"});

let titleAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let dateAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.date");
dateAttribute.setType(Type.DATE);
dateAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
dateAttribute.setLocalizedNames({"de": "Datum", "en": "Date"});

let typeAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.type");
typeAttribute.setType(Type.TEXTENUMERATION);
typeAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
typeAttribute.setLocalizedNames({"de": "Typ", "en": "Type"});

let relevantForAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.relevantFor");
relevantForAttribute.setType(Type.LINK);
relevantForAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
relevantForAttribute.setLocalizedNames({"de": "Relevant F\u00fcr", "en": "Relevant For"});
relevantForAttribute.setEntityKind("page");
relevantForAttribute.setReferenceSameWorkspace(false);
relevantForAttribute.setReferenceIsHierarchy(false);

let plannedStartAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStartAttribute.setType(Type.DATE);
plannedStartAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedStartAttribute.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

let plannedEndAttribute = safeMilestoneType.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEndAttribute.setType(Type.DATE);
plannedEndAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedEndAttribute.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

let periodStatusType = workspace.assertType("cf.cplace.solution.safe.periodStatus");
periodStatusType.setLocalizedNames({"en": "Period Status", "de": "Period Status"});

let orderAttribute = periodStatusType.assertAttribute("cf.cplace.solution.safe.order");
orderAttribute.setType(Type.NUMBER);
orderAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
orderAttribute.setLocalizedNames({"en": "Order"});

let flowMetricType = workspace.assertType("cf.cplace.solution.safe.flowMetric");
flowMetricType.setLocalizedNames({"de": "Durchflussmetrik", "en": "Flow Metric"});

let artifactTypeAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.artifactType");
artifactTypeAttribute.setType(Type.TEXT);
artifactTypeAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
artifactTypeAttribute.setLocalizedNames({"de": "Artefakttyp", "en": "Artifact type"});

let snapshotDateAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.snapshotDate");
snapshotDateAttribute.setType(Type.DATE);
snapshotDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
snapshotDateAttribute.setLocalizedNames({"de": "Schnappschuss-Datum", "en": "Snapshot date"});

let referenceAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
referenceAttribute.setType(Type.LINK);
referenceAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
referenceAttribute.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});
referenceAttribute.setEntityKind("page");
referenceAttribute.setReferenceSameWorkspace(false);
referenceAttribute.setReferenceIsHierarchy(false);

let timeboxAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.timebox");
timeboxAttribute.setType(Type.LINK);
timeboxAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
timeboxAttribute.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});
timeboxAttribute.setEntityKind("page");
timeboxAttribute.setReferenceSameWorkspace(false);
timeboxAttribute.setReferenceIsHierarchy(false);

let jsonMetricDataAttribute = flowMetricType.assertAttribute("cf.cplace.solution.safe.jsonMetricData");
jsonMetricDataAttribute.setType(Type.LONGTEXT);
jsonMetricDataAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
jsonMetricDataAttribute.setLocalizedNames({"de": "JSON Metric Data", "en": "JSON Metric Data"});

let objectiveType = workspace.assertType("cf.cplace.solution.safe.objective");
objectiveType.setLocalizedNames({"de": "Zielsetzung", "en": "Objective"});

let objectivetitleAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.objectivetitle");
objectivetitleAttribute.setType(Type.TEXT);
objectivetitleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
objectivetitleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let timeboxAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.timebox");
timeboxAttribute.setType(Type.LINK);
timeboxAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
timeboxAttribute.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});
timeboxAttribute.setEntityKind("page");
timeboxAttribute.setReferenceSameWorkspace(false);
timeboxAttribute.setReferenceIsHierarchy(false);

let sAFeLevelAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel");
sAFeLevelAttribute.setType(Type.TEXTENUMERATION);
sAFeLevelAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
sAFeLevelAttribute.setLocalizedNames({"de": "SAFe Level", "en": "SAFe Level"});

let referenceAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
referenceAttribute.setType(Type.LINK);
referenceAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
referenceAttribute.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});
referenceAttribute.setEntityKind("page");
referenceAttribute.setReferenceSameWorkspace(false);
referenceAttribute.setReferenceIsHierarchy(false);

let businessValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValueAttribute.setType(Type.NUMBERENUMERATION);
businessValueAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValueAttribute.setLocalizedNames({"de": "Planned Business Value", "en": "Planned Business Value"});

let actualValueAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.actualValue");
actualValueAttribute.setType(Type.NUMBERENUMERATION);
actualValueAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualValueAttribute.setLocalizedNames({"de": "Actual Business Value", "en": "Actual Business Value"});

let commitmentAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.commitment");
commitmentAttribute.setType(Type.TEXTENUMERATION);
commitmentAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
commitmentAttribute.setLocalizedNames({"de": "Commitment", "en": "Commitment"});

let statementAttribute = objectiveType.assertAttribute("cf.cplace.solution.safe.statement");
statementAttribute.setType(Type.RICHSTRING);
statementAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
statementAttribute.setLocalizedNames({"de": "Statement", "en": "Statement"});

let eventType = workspace.assertType("cf.cplace.solution.safe.event");
eventType.setLocalizedNames({"de": "Event", "en": "Event"});

let titleAttribute = eventType.assertAttribute("cf.cplace.solution.safe.title");
titleAttribute.setType(Type.TEXT);
titleAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
titleAttribute.setLocalizedNames({"de": "Titel", "en": "Title"});

let startDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.startDate");
startDateAttribute.setType(Type.DATE);
startDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDateAttribute.setLocalizedNames({"de": "Start Datum", "en": "Start Date"});

let endDateAttribute = eventType.assertAttribute("cf.cplace.solution.safe.endDate");
endDateAttribute.setType(Type.DATE);
endDateAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDateAttribute.setLocalizedNames({"de": "End-Datum", "en": "End Date"});

let solutionAttribute = eventType.assertAttribute("cf.cplace.solution.safe.solution");
solutionAttribute.setType(Type.LINK);
solutionAttribute.setMultiplicity(Multiplicity.EXACTLY_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page");
solutionAttribute.setReferenceSameWorkspace(true);
solutionAttribute.setReferenceIsHierarchy(false);

let confidenceVoteType = workspace.assertType("cf.cplace.solution.safe.confidenceVote");
confidenceVoteType.setLocalizedNames({"de": "Confidence Vote", "en": "Confidence Vote"});

let pIAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.PI");
pIAttribute.setType(Type.LINK);
pIAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
pIAttribute.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});
pIAttribute.setEntityKind("page");
pIAttribute.setReferenceSameWorkspace(true);
pIAttribute.setReferenceIsHierarchy(false);

let resultAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.result");
resultAttribute.setType(Type.TEXTENUMERATION);
resultAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
resultAttribute.setLocalizedNames({"de": "Ergebnis", "en": "Result"});

let oneFingerAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.oneFinger");
oneFingerAttribute.setType(Type.NUMBER);
oneFingerAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
oneFingerAttribute.setLocalizedNames({"de": "One Finger", "en": "One Finger"});

let twoFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.twoFingers");
twoFingersAttribute.setType(Type.NUMBER);
twoFingersAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
twoFingersAttribute.setLocalizedNames({"de": "Two Fingers", "en": "Two Fingers"});

let threeFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.threeFingers");
threeFingersAttribute.setType(Type.NUMBER);
threeFingersAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
threeFingersAttribute.setLocalizedNames({"de": "Three Fingers", "en": "Three Fingers"});

let fourFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fourFingers");
fourFingersAttribute.setType(Type.NUMBER);
fourFingersAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
fourFingersAttribute.setLocalizedNames({"de": "Four Fingers", "en": "Four Fingers"});

let fiveFingersAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.fiveFingers");
fiveFingersAttribute.setType(Type.NUMBER);
fiveFingersAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
fiveFingersAttribute.setLocalizedNames({"de": "Five Fingers", "en": "Five Fingers"});

let solutionAttribute = confidenceVoteType.assertAttribute("cf.cplace.solution.safe.confidenceVote.solution");
solutionAttribute.setType(Type.LINK);
solutionAttribute.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionAttribute.setLocalizedNames({"de": "Solution", "en": "Solution"});
solutionAttribute.setEntityKind("page");
solutionAttribute.setReferenceSameWorkspace(true);
solutionAttribute.setReferenceIsHierarchy(false);