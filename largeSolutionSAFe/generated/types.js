const solution = workspace.assertType("cf.cplace.solution.safe.solution");
solution.setLocalizedNames({"de": "Solution", "en": "Solution"});

const description = solution.assertAttribute("cf.cplace.solution.safe.description");
description.setType(Type.RICHSTRING);
description.setMultiplicity(Multiplicity.AT_MOST_ONE);
description.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

const solutionTrainEngineer = solution.assertAttribute("cf.cplace.solution.safe.solutionTrainEngineer");
solutionTrainEngineer.setType(Type.LINK);
solutionTrainEngineer.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainEngineer.setLocalizedNames({"de": "Solution Train Engineer", "en": "Solution Train Engineer"});

const solutionTrainArchitect = solution.assertAttribute("cf.cplace.solution.safe.solutionTrainArchitect");
solutionTrainArchitect.setType(Type.LINK);
solutionTrainArchitect.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionTrainArchitect.setLocalizedNames({"de": "Solution Train Architekt", "en": "Solution Train Architect"});

const solutionManagement = solution.assertAttribute("cf.cplace.solution.safe.solutionManagement");
solutionManagement.setType(Type.LINK);
solutionManagement.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionManagement.setLocalizedNames({"de": "Solution Management", "en": "Solution Management"});

const previousPi = solution.assertAttribute("cf.cplace.solution.safe.previousPi");
previousPi.setType(Type.LINK);
previousPi.setMultiplicity(Multiplicity.AT_MOST_ONE);
previousPi.setLocalizedNames({"de": "Vorheriges PI", "en": "Previous PI"});

const currentPi = solution.assertAttribute("cf.cplace.solution.safe.currentPi");
currentPi.setType(Type.LINK);
currentPi.setMultiplicity(Multiplicity.EXACTLY_ONE);
currentPi.setLocalizedNames({"de": "Laufendes PI", "en": "Current PI"});

const nextPi = solution.assertAttribute("cf.cplace.solution.safe.nextPi");
nextPi.setType(Type.LINK);
nextPi.setMultiplicity(Multiplicity.AT_MOST_ONE);
nextPi.setLocalizedNames({"de": "N\u00e4chstes PI", "en": "Next PI"});

const funnelWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.funnelWIPLimit");
funnelWIPLimit.setType(Type.NUMBER);
funnelWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
funnelWIPLimit.setLocalizedNames({"de": "Funnel WIP Limit", "en": "Funnel WIP Limit"});

const analyzingWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.analyzingWIPLimit");
analyzingWIPLimit.setType(Type.NUMBER);
analyzingWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
analyzingWIPLimit.setLocalizedNames({"de": "Analyzing WIP Limit", "en": "Analyzing WIP Limit"});

const backlogWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.backlogWIPLimit");
backlogWIPLimit.setType(Type.NUMBER);
backlogWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
backlogWIPLimit.setLocalizedNames({"de": "Backlog WIP Limit", "en": "Backlog WIP Limit"});

const implementingWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.implementingWIPLimit");
implementingWIPLimit.setType(Type.NUMBER);
implementingWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
implementingWIPLimit.setLocalizedNames({"de": "Implementing WIP Limit", "en": "Implementing WIP Limit"});

const validatingWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.validatingWIPLimit");
validatingWIPLimit.setType(Type.NUMBER);
validatingWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
validatingWIPLimit.setLocalizedNames({"de": "Validating WIP Limit", "en": "Validating WIP Limit"});

const deployingWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.deployingWIPLimit");
deployingWIPLimit.setType(Type.NUMBER);
deployingWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
deployingWIPLimit.setLocalizedNames({"de": "Deploying WIP Limit", "en": "Deploying WIP Limit"});

const releasingWIPLimit = solution.assertAttribute("cf.cplace.solution.safe.releasingWIPLimit");
releasingWIPLimit.setType(Type.NUMBER);
releasingWIPLimit.setMultiplicity(Multiplicity.AT_MOST_ONE);
releasingWIPLimit.setLocalizedNames({"de": "Releasing WIP Limit", "en": "Releasing WIP Limit"});

const shortName = solution.assertAttribute("cf.cplace.solution.safe.shortName");
shortName.setType(Type.TEXT);
shortName.setMultiplicity(Multiplicity.EXACTLY_ONE);
shortName.setLocalizedNames({"de": "K\u00fcrzel", "en": "Short Name"});

const horizon = solution.assertAttribute("cf.cplace.solution.safe.horizon");
horizon.setType(Type.LINK);
horizon.setMultiplicity(Multiplicity.AT_MOST_ONE);
horizon.setLocalizedNames({"de": "Horizon", "en": "Horizon"});

const programIncrement = workspace.assertType("cf.cplace.solution.safe.programIncrement");
programIncrement.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

const title = programIncrement.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.EXACTLY_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const solution = programIncrement.assertAttribute("cf.cplace.solution.safe.solution");
solution.setType(Type.LINK);
solution.setMultiplicity(Multiplicity.EXACTLY_ONE);
solution.setLocalizedNames({"de": "Solution", "en": "Solution"});

const startDate = programIncrement.assertAttribute("cf.cplace.solution.safe.startDate");
startDate.setType(Type.DATE);
startDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDate.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

const endDate = programIncrement.assertAttribute("cf.cplace.solution.safe.endDate");
endDate.setType(Type.DATE);
endDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDate.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

const predecessor = programIncrement.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessor.setType(Type.LINK);
predecessor.setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessor.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});

const periodStatus = programIncrement.assertAttribute("cf.cplace.solution.safe.periodStatus");
periodStatus.setType(Type.TEXTENUMERATION);
periodStatus.setMultiplicity(Multiplicity.EXACTLY_ONE);
periodStatus.setLocalizedNames({"de": "Period Status", "en": "Period Status"});

const confidenceVote = programIncrement.assertAttribute("cf.cplace.solution.safe.confidenceVote");
confidenceVote.setType(Type.LINK);
confidenceVote.setMultiplicity(Multiplicity.AT_MOST_ONE);
confidenceVote.setLocalizedNames({"en": "Confidence Vote"});

const capacity = programIncrement.assertAttribute("cf.cplace.solution.safe.capacity");
capacity.setType(Type.NUMBER);
capacity.setMultiplicity(Multiplicity.AT_MOST_ONE);
capacity.setLocalizedNames({"de": "Capacity", "en": "Capacity"});

const Result = programIncrement.assertAttribute("cf.cplace.solution.safe.confidenceVote.Result");
Result.setType(Type.TEXT);
Result.setMultiplicity(Multiplicity.AT_MOST_ONE);
Result.setLocalizedNames({"de": "Confidence Vote Result", "en": "Confidence Vote Result"});

const statsJson = programIncrement.assertAttribute("cf.cplace.solution.safe.statsJson");
statsJson.setType(Type.LONGTEXT);
statsJson.setMultiplicity(Multiplicity.AT_MOST_ONE);
statsJson.setLocalizedNames({"en": "Statistics JSON"});

const iteration = workspace.assertType("cf.cplace.solution.safe.iteration");
iteration.setLocalizedNames({"de": "Iteration", "en": "Iteration"});

const title = iteration.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.EXACTLY_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const programIncrement = iteration.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrement.setType(Type.LINK);
programIncrement.setMultiplicity(Multiplicity.EXACTLY_ONE);
programIncrement.setLocalizedNames({"de": "Programminkrement", "en": "Program Increment"});

const startDate = iteration.assertAttribute("cf.cplace.solution.safe.startDate");
startDate.setType(Type.DATE);
startDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDate.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

const endDate = iteration.assertAttribute("cf.cplace.solution.safe.endDate");
endDate.setType(Type.DATE);
endDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDate.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

const predecessor = iteration.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessor.setType(Type.LINK);
predecessor.setMultiplicity(Multiplicity.AT_MOST_ONE);
predecessor.setLocalizedNames({"de": "Vorg\u00e4nger", "en": "Predecessor"});

const capability = workspace.assertType("cf.cplace.solution.safe.capability");
capability.setLocalizedNames({"de": "Capability", "en": "Capability"});

const title = capability.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const reference = capability.assertAttribute("cf.cplace.solution.safe.solution.reference");
reference.setType(Type.LINK);
reference.setMultiplicity(Multiplicity.AT_MOST_ONE);
reference.setLocalizedNames({"de": "Solution", "en": "Solution"});

const description = capability.assertAttribute("cf.cplace.solution.safe.description");
description.setType(Type.RICHSTRING);
description.setMultiplicity(Multiplicity.AT_MOST_ONE);
description.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

const capabilityType = capability.assertAttribute("cf.cplace.solution.safe.capabilityType");
capabilityType.setType(Type.TEXTENUMERATION);
capabilityType.setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityType.setLocalizedNames({"de": "Capability Type", "en": "Capability Type"});

const state = capability.assertAttribute("cf.cplace.solution.safe.state");
state.setType(Type.TEXTENUMERATION);
state.setMultiplicity(Multiplicity.EXACTLY_ONE);
state.setLocalizedNames({"de": "Status", "en": "State"});

const wsjf = capability.assertAttribute("cf.cplace.solution.safe.wsjf");
wsjf.setType(Type.NUMBER);
wsjf.setMultiplicity(Multiplicity.AT_MOST_ONE);
wsjf.setLocalizedNames({"de": "WSJF", "en": "WSJF"});

const businessValue = capability.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValue.setType(Type.NUMBERENUMERATION);
businessValue.setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValue.setLocalizedNames({"de": "User Business Value", "en": "User Business Value"});

const timeCriticality = capability.assertAttribute("cf.cplace.solution.safe.timeCriticality");
timeCriticality.setType(Type.NUMBERENUMERATION);
timeCriticality.setMultiplicity(Multiplicity.AT_MOST_ONE);
timeCriticality.setLocalizedNames({"de": "Zeitliche Kritikalit\u00e4t", "en": "Time Criticality"});

const riskReduction = capability.assertAttribute("cf.cplace.solution.safe.riskReduction");
riskReduction.setType(Type.NUMBERENUMERATION);
riskReduction.setMultiplicity(Multiplicity.AT_MOST_ONE);
riskReduction.setLocalizedNames({"de": "Risk Reduction", "en": "Risk Reduction"});

const jobSize = capability.assertAttribute("cf.cplace.solution.safe.jobSize");
jobSize.setType(Type.NUMBERENUMERATION);
jobSize.setMultiplicity(Multiplicity.AT_MOST_ONE);
jobSize.setLocalizedNames({"de": "Job Size", "en": "Job Size"});

const programIncrement = capability.assertAttribute("cf.cplace.solution.safe.programIncrement");
programIncrement.setType(Type.LINK);
programIncrement.setMultiplicity(Multiplicity.AT_MOST_ONE);
programIncrement.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

const actualStartDate = capability.assertAttribute("cf.cplace.solution.safe.actualStartDate");
actualStartDate.setType(Type.DATE);
actualStartDate.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualStartDate.setLocalizedNames({"de": "Actual Start Date", "en": "Actual Start Date"});

const actualEndDate = capability.assertAttribute("cf.cplace.solution.safe.actualEndDate");
actualEndDate.setType(Type.DATE);
actualEndDate.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualEndDate.setLocalizedNames({"de": "Actual End Date", "en": "Actual End Date"});

const flowTime = capability.assertAttribute("cf.cplace.solution.safe.flowTime");
flowTime.setType(Type.NUMBER);
flowTime.setMultiplicity(Multiplicity.AT_MOST_ONE);
flowTime.setLocalizedNames({"de": "Flow time", "en": "Flow time"});

const program = capability.assertAttribute("cf.cplace.solution.safe.program");
program.setType(Type.LINK);
program.setMultiplicity(Multiplicity.ANY_NUMBER);
program.setLocalizedNames({"de": "Program", "en": "Program"});

const capabilityowner = capability.assertAttribute("cf.cplace.solution.safe.capabilityowner");
capabilityowner.setType(Type.LINK);
capabilityowner.setMultiplicity(Multiplicity.EXACTLY_ONE);
capabilityowner.setLocalizedNames({"de": "Capability Owner", "en": "Capability Owner"});

const portfolioEpic = capability.assertAttribute("cf.cplace.solution.safe.portfolioEpic");
portfolioEpic.setType(Type.LINK);
portfolioEpic.setMultiplicity(Multiplicity.AT_MOST_ONE);
portfolioEpic.setLocalizedNames({"en": "Portfolio Epic"});

const solutionShortName = capability.assertAttribute("cf.cplace.solution.safe.solutionShortName");
solutionShortName.setType(Type.TEXT);
solutionShortName.setMultiplicity(Multiplicity.AT_MOST_ONE);
solutionShortName.setLocalizedNames({"de": "Solution K\u00fcrzel", "en": "Solution Short Name"});

const plannedStart = capability.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStart.setType(Type.DATE);
plannedStart.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStart.setLocalizedNames({"de": "Geplanter Start", "en": "Planned Start"});

const plannedEnd = capability.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEnd.setType(Type.DATE);
plannedEnd.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEnd.setLocalizedNames({"de": "Geplantes Ende", "en": "Planned End"});

const iteration = capability.assertAttribute("cf.cplace.solution.safe.iteration");
iteration.setType(Type.LINK);
iteration.setMultiplicity(Multiplicity.ANY_NUMBER);
iteration.setLocalizedNames({"de": "Iterations", "en": "Iterations"});

const definitionOfReady = capability.assertAttribute("cf.cplace.solution.safe.definitionOfReady");
definitionOfReady.setType(Type.BOOLEAN);
definitionOfReady.setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfReady.setLocalizedNames({"de": "Definition of Ready", "en": "Definition of Ready"});

const definitionOfDone = capability.assertAttribute("cf.cplace.solution.safe.definitionOfDone");
definitionOfDone.setType(Type.BOOLEAN);
definitionOfDone.setMultiplicity(Multiplicity.EXACTLY_ONE);
definitionOfDone.setLocalizedNames({"de": "Definition of Done", "en": "Definition of Done"});

const acceptanceCriteria = capability.assertAttribute("cf.cplace.solution.safe.acceptanceCriteria");
acceptanceCriteria.setType(Type.RICHSTRING);
acceptanceCriteria.setMultiplicity(Multiplicity.AT_MOST_ONE);
acceptanceCriteria.setLocalizedNames({"de": "Akzeptanzkriterien", "en": "Acceptance Criteria"});

const benefitHypothesis = capability.assertAttribute("cf.cplace.solution.safe.benefitHypothesis");
benefitHypothesis.setType(Type.RICHSTRING);
benefitHypothesis.setMultiplicity(Multiplicity.AT_MOST_ONE);
benefitHypothesis.setLocalizedNames({"de": "Benefit Hypothesis", "en": "Benefit Hypothesis"});

const conflictState = capability.assertAttribute("cf.cplace.solution.safe.conflictState");
conflictState.setType(Type.TEXTENUMERATION);
conflictState.setMultiplicity(Multiplicity.AT_MOST_ONE);
conflictState.setLocalizedNames({"de": "Datumskonflikt", "en": "Conflict State"});

const features = capability.assertAttribute("cf.cplace.solution.safe.features");
features.setType(Type.LINK);
features.setMultiplicity(Multiplicity.ANY_NUMBER);
features.setLocalizedNames({"de": "Features", "en": "Features"});

const dependency = workspace.assertType("cf.cplace.solution.safe.dependency");
dependency.setLocalizedNames({"de": "Abh\u00e4ngigkeit", "en": "Dependency"});

const title = dependency.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const successor = dependency.assertAttribute("cf.cplace.solution.safe.successor");
successor.setType(Type.LINK);
successor.setMultiplicity(Multiplicity.EXACTLY_ONE);
successor.setLocalizedNames({"de": "A", "en": "A"});

const type = dependency.assertAttribute("cf.cplace.solution.safe.type");
type.setType(Type.TEXTENUMERATION);
type.setMultiplicity(Multiplicity.EXACTLY_ONE);
type.setLocalizedNames({"de": "Typ", "en": "Type"});

const predecessor = dependency.assertAttribute("cf.cplace.solution.safe.predecessor");
predecessor.setType(Type.LINK);
predecessor.setMultiplicity(Multiplicity.EXACTLY_ONE);
predecessor.setLocalizedNames({"de": "B", "en": "B"});

const status = dependency.assertAttribute("cf.cplace.solution.safe.status");
status.setType(Type.TEXTENUMERATION);
status.setMultiplicity(Multiplicity.EXACTLY_ONE);
status.setLocalizedNames({"de": "Status", "en": "Status"});

const description = dependency.assertAttribute("cf.cplace.solution.safe.description");
description.setType(Type.TEXT);
description.setMultiplicity(Multiplicity.AT_MOST_ONE);
description.setLocalizedNames({"de": "Beschreibung", "en": "Description"});

const plannedStartA = dependency.assertAttribute("cf.cplace.solution.safe.plannedStartA");
plannedStartA.setType(Type.DATE);
plannedStartA.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedStartA.setLocalizedNames({"de": "Geplanter Start A", "en": "Planned Start A"});

const plannedEndB = dependency.assertAttribute("cf.cplace.solution.safe.plannedEndB");
plannedEndB.setType(Type.DATE);
plannedEndB.setMultiplicity(Multiplicity.AT_MOST_ONE);
plannedEndB.setLocalizedNames({"de": "Geplantes Ende B", "en": "Planned End B"});

const safeMilestone = workspace.assertType("cf.cplace.solution.safe.safeMilestone");
safeMilestone.setLocalizedNames({"de": "SAFe Meilenstein", "en": "SAFe Milestone"});

const title = safeMilestone.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.EXACTLY_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const date = safeMilestone.assertAttribute("cf.cplace.solution.safe.date");
date.setType(Type.DATE);
date.setMultiplicity(Multiplicity.AT_MOST_ONE);
date.setLocalizedNames({"de": "Datum", "en": "Date"});

const type = safeMilestone.assertAttribute("cf.cplace.solution.safe.type");
type.setType(Type.TEXTENUMERATION);
type.setMultiplicity(Multiplicity.EXACTLY_ONE);
type.setLocalizedNames({"de": "Typ", "en": "Type"});

const relevantFor = safeMilestone.assertAttribute("cf.cplace.solution.safe.relevantFor");
relevantFor.setType(Type.LINK);
relevantFor.setMultiplicity(Multiplicity.AT_MOST_ONE);
relevantFor.setLocalizedNames({"de": "Relevant F\u00fcr", "en": "Relevant For"});

const plannedStart = safeMilestone.assertAttribute("cf.cplace.solution.safe.plannedStart");
plannedStart.setType(Type.DATE);
plannedStart.setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedStart.setLocalizedNames({"de": "Startdatum", "en": "Start Date"});

const plannedEnd = safeMilestone.assertAttribute("cf.cplace.solution.safe.plannedEnd");
plannedEnd.setType(Type.DATE);
plannedEnd.setMultiplicity(Multiplicity.EXACTLY_ONE);
plannedEnd.setLocalizedNames({"de": "Enddatum", "en": "End Date"});

const periodStatus = workspace.assertType("cf.cplace.solution.safe.periodStatus");
periodStatus.setLocalizedNames({"en": "Period Status", "de": "Period Status"});

const order = periodStatus.assertAttribute("cf.cplace.solution.safe.order");
order.setType(Type.NUMBER);
order.setMultiplicity(Multiplicity.AT_MOST_ONE);
order.setLocalizedNames({"en": "Order"});

const flowMetric = workspace.assertType("cf.cplace.solution.safe.flowMetric");
flowMetric.setLocalizedNames({"de": "Durchflussmetrik", "en": "Flow Metric"});

const artifactType = flowMetric.assertAttribute("cf.cplace.solution.safe.artifactType");
artifactType.setType(Type.TEXT);
artifactType.setMultiplicity(Multiplicity.EXACTLY_ONE);
artifactType.setLocalizedNames({"de": "Artefakttyp", "en": "Artifact type"});

const snapshotDate = flowMetric.assertAttribute("cf.cplace.solution.safe.snapshotDate");
snapshotDate.setType(Type.DATE);
snapshotDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
snapshotDate.setLocalizedNames({"de": "Schnappschuss-Datum", "en": "Snapshot date"});

const Reference = flowMetric.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
Reference.setType(Type.LINK);
Reference.setMultiplicity(Multiplicity.EXACTLY_ONE);
Reference.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});

const timebox = flowMetric.assertAttribute("cf.cplace.solution.safe.timebox");
timebox.setType(Type.LINK);
timebox.setMultiplicity(Multiplicity.AT_MOST_ONE);
timebox.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});

const jsonMetricData = flowMetric.assertAttribute("cf.cplace.solution.safe.jsonMetricData");
jsonMetricData.setType(Type.LONGTEXT);
jsonMetricData.setMultiplicity(Multiplicity.AT_MOST_ONE);
jsonMetricData.setLocalizedNames({"de": "JSON Metric Data", "en": "JSON Metric Data"});

const objective = workspace.assertType("cf.cplace.solution.safe.objective");
objective.setLocalizedNames({"de": "Zielsetzung", "en": "Objective"});

const objectivetitle = objective.assertAttribute("cf.cplace.solution.safe.objectivetitle");
objectivetitle.setType(Type.TEXT);
objectivetitle.setMultiplicity(Multiplicity.AT_MOST_ONE);
objectivetitle.setLocalizedNames({"de": "Titel", "en": "Title"});

const timebox = objective.assertAttribute("cf.cplace.solution.safe.timebox");
timebox.setType(Type.LINK);
timebox.setMultiplicity(Multiplicity.AT_MOST_ONE);
timebox.setLocalizedNames({"de": "Program Increment/Iteration", "en": "Program Increment/Iteration"});

const SAFeLevel = objective.assertAttribute("cf.cplace.solution.safe.SAFeLevel");
SAFeLevel.setType(Type.TEXTENUMERATION);
SAFeLevel.setMultiplicity(Multiplicity.AT_MOST_ONE);
SAFeLevel.setLocalizedNames({"de": "SAFe Level", "en": "SAFe Level"});

const Reference = objective.assertAttribute("cf.cplace.solution.safe.SAFeLevel.Reference");
Reference.setType(Type.LINK);
Reference.setMultiplicity(Multiplicity.AT_MOST_ONE);
Reference.setLocalizedNames({"de": "SAFe Level Reference", "en": "SAFe Level Reference"});

const businessValue = objective.assertAttribute("cf.cplace.solution.safe.businessValue");
businessValue.setType(Type.NUMBERENUMERATION);
businessValue.setMultiplicity(Multiplicity.AT_MOST_ONE);
businessValue.setLocalizedNames({"de": "Planned Business Value", "en": "Planned Business Value"});

const actualValue = objective.assertAttribute("cf.cplace.solution.safe.actualValue");
actualValue.setType(Type.NUMBERENUMERATION);
actualValue.setMultiplicity(Multiplicity.AT_MOST_ONE);
actualValue.setLocalizedNames({"de": "Actual Business Value", "en": "Actual Business Value"});

const commitment = objective.assertAttribute("cf.cplace.solution.safe.commitment");
commitment.setType(Type.TEXTENUMERATION);
commitment.setMultiplicity(Multiplicity.AT_MOST_ONE);
commitment.setLocalizedNames({"de": "Commitment", "en": "Commitment"});

const statement = objective.assertAttribute("cf.cplace.solution.safe.statement");
statement.setType(Type.RICHSTRING);
statement.setMultiplicity(Multiplicity.AT_MOST_ONE);
statement.setLocalizedNames({"de": "Statement", "en": "Statement"});

const event = workspace.assertType("cf.cplace.solution.safe.event");
event.setLocalizedNames({"de": "Event", "en": "Event"});

const title = event.assertAttribute("cf.cplace.solution.safe.title");
title.setType(Type.TEXT);
title.setMultiplicity(Multiplicity.AT_MOST_ONE);
title.setLocalizedNames({"de": "Titel", "en": "Title"});

const startDate = event.assertAttribute("cf.cplace.solution.safe.startDate");
startDate.setType(Type.DATE);
startDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
startDate.setLocalizedNames({"de": "Start Datum", "en": "Start Date"});

const endDate = event.assertAttribute("cf.cplace.solution.safe.endDate");
endDate.setType(Type.DATE);
endDate.setMultiplicity(Multiplicity.EXACTLY_ONE);
endDate.setLocalizedNames({"de": "End-Datum", "en": "End Date"});

const solution = event.assertAttribute("cf.cplace.solution.safe.solution");
solution.setType(Type.LINK);
solution.setMultiplicity(Multiplicity.EXACTLY_ONE);
solution.setLocalizedNames({"de": "Solution", "en": "Solution"});

const confidenceVote = workspace.assertType("cf.cplace.solution.safe.confidenceVote");
confidenceVote.setLocalizedNames({"de": "Confidence Vote", "en": "Confidence Vote"});

const PI = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.PI");
PI.setType(Type.LINK);
PI.setMultiplicity(Multiplicity.AT_MOST_ONE);
PI.setLocalizedNames({"de": "Program Increment", "en": "Program Increment"});

const result = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.result");
result.setType(Type.TEXTENUMERATION);
result.setMultiplicity(Multiplicity.AT_MOST_ONE);
result.setLocalizedNames({"de": "Ergebnis", "en": "Result"});

const oneFinger = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.oneFinger");
oneFinger.setType(Type.NUMBER);
oneFinger.setMultiplicity(Multiplicity.AT_MOST_ONE);
oneFinger.setLocalizedNames({"de": "One Finger", "en": "One Finger"});

const twoFingers = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.twoFingers");
twoFingers.setType(Type.NUMBER);
twoFingers.setMultiplicity(Multiplicity.AT_MOST_ONE);
twoFingers.setLocalizedNames({"de": "Two Fingers", "en": "Two Fingers"});

const threeFingers = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.threeFingers");
threeFingers.setType(Type.NUMBER);
threeFingers.setMultiplicity(Multiplicity.AT_MOST_ONE);
threeFingers.setLocalizedNames({"de": "Three Fingers", "en": "Three Fingers"});

const fourFingers = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.fourFingers");
fourFingers.setType(Type.NUMBER);
fourFingers.setMultiplicity(Multiplicity.AT_MOST_ONE);
fourFingers.setLocalizedNames({"de": "Four Fingers", "en": "Four Fingers"});

const fiveFingers = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.fiveFingers");
fiveFingers.setType(Type.NUMBER);
fiveFingers.setMultiplicity(Multiplicity.AT_MOST_ONE);
fiveFingers.setLocalizedNames({"de": "Five Fingers", "en": "Five Fingers"});

const solution = confidenceVote.assertAttribute("cf.cplace.solution.safe.confidenceVote.solution");
solution.setType(Type.LINK);
solution.setMultiplicity(Multiplicity.AT_MOST_ONE);
solution.setLocalizedNames({"de": "Solution", "en": "Solution"});