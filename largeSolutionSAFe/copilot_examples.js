function accessBuiltInPageAttributes(page) {
    const absoluteUrl = page.getBuiltinFeatureValue("absoluteUrl");
    const comments = page.getBuiltinFeatureValue("comments");
    const commentsForVersioning = page.getBuiltinFeatureValue("commentsForVersioning");
    const content = page.getBuiltinFeatureValue("content");
    const creator = page.getBuiltinFeatureValue("creator");
    const created = page.getBuiltinFeatureValue("created");
    const customType = page.getBuiltinFeatureValue("customType");
    const documents = page.getBuiltinFeatureValue("documents");
    const id = page.getBuiltinFeatureValue("id");
    const localizedName = page.getBuiltinFeatureValue("localizedName");
    const name = page.getBuiltinFeatureValue("name");
    const orderIndex = page.getBuiltinFeatureValue("orderIndex");
    const readers = page.getBuiltinFeatureValue("readers");
    const readersAreDefault = page.getBuiltinFeatureValue("readersAreDefault");
    const space = page.getBuiltinFeatureValue("space");
    const writersAreDefault = page.getBuiltinFeatureValue("writersAreDefault");
}

function readFromSolution(solution) {
    const description = solution.get(ATTR_SOLUTION_DESCRIPTION);
    const solutionTrainEngineer = solution.get(ATTR_SOLUTION_SOLUTION_TRAIN_ENGINEER);
    const solutionTrainArchitect = solution.get(ATTR_SOLUTION_SOLUTION_TRAIN_ARCHITECT);
    const solutionManagement = solution.get(ATTR_SOLUTION_SOLUTION_MANAGEMENT);
    const previousPi = solution.get(ATTR_SOLUTION_PREVIOUS_PI);
    const currentPi = solution.get(ATTR_SOLUTION_CURRENT_PI);
    const nextPi = solution.get(ATTR_SOLUTION_NEXT_PI);
    const funnelWIPLimit = solution.get(ATTR_SOLUTION_FUNNEL_W_I_P_LIMIT);
    const analyzingWIPLimit = solution.get(ATTR_SOLUTION_ANALYZING_W_I_P_LIMIT);
    const backlogWIPLimit = solution.get(ATTR_SOLUTION_BACKLOG_W_I_P_LIMIT);
    const implementingWIPLimit = solution.get(ATTR_SOLUTION_IMPLEMENTING_W_I_P_LIMIT);
    const validatingWIPLimit = solution.get(ATTR_SOLUTION_VALIDATING_W_I_P_LIMIT);
    const deployingWIPLimit = solution.get(ATTR_SOLUTION_DEPLOYING_W_I_P_LIMIT);
    const releasingWIPLimit = solution.get(ATTR_SOLUTION_RELEASING_W_I_P_LIMIT);
    const shortName = solution.get(ATTR_SOLUTION_SHORT_NAME);
    const horizon = solution.get(ATTR_SOLUTION_HORIZON);
}

const TYPE_SOLUTION = 'cf.cplace.solution.safe.solution';
const ATTR_SOLUTION_DESCRIPTION = 'cf.cplace.solution.safe.description';
const ATTR_SOLUTION_SOLUTION_TRAIN_ENGINEER = 'cf.cplace.solution.safe.solutionTrainEngineer';
const ATTR_SOLUTION_SOLUTION_TRAIN_ARCHITECT = 'cf.cplace.solution.safe.solutionTrainArchitect';
const ATTR_SOLUTION_SOLUTION_MANAGEMENT = 'cf.cplace.solution.safe.solutionManagement';
const ATTR_SOLUTION_PREVIOUS_PI = 'cf.cplace.solution.safe.previousPi';
const ATTR_SOLUTION_CURRENT_PI = 'cf.cplace.solution.safe.currentPi';
const ATTR_SOLUTION_NEXT_PI = 'cf.cplace.solution.safe.nextPi';
const ATTR_SOLUTION_FUNNEL_W_I_P_LIMIT = 'cf.cplace.solution.safe.funnelWIPLimit';
const ATTR_SOLUTION_ANALYZING_W_I_P_LIMIT = 'cf.cplace.solution.safe.analyzingWIPLimit';
const ATTR_SOLUTION_BACKLOG_W_I_P_LIMIT = 'cf.cplace.solution.safe.backlogWIPLimit';
const ATTR_SOLUTION_IMPLEMENTING_W_I_P_LIMIT = 'cf.cplace.solution.safe.implementingWIPLimit';
const ATTR_SOLUTION_VALIDATING_W_I_P_LIMIT = 'cf.cplace.solution.safe.validatingWIPLimit';
const ATTR_SOLUTION_DEPLOYING_W_I_P_LIMIT = 'cf.cplace.solution.safe.deployingWIPLimit';
const ATTR_SOLUTION_RELEASING_W_I_P_LIMIT = 'cf.cplace.solution.safe.releasingWIPLimit';
const ATTR_SOLUTION_SHORT_NAME = 'cf.cplace.solution.safe.shortName';
const ATTR_SOLUTION_HORIZON = 'cf.cplace.solution.safe.horizon';

function readFromProgramIncrement(programIncrement) {
    const title = programIncrement.get(ATTR_PROGRAM_INCREMENT_TITLE);
    const solution = programIncrement.get(ATTR_PROGRAM_INCREMENT_SOLUTION);
    const startDate = programIncrement.get(ATTR_PROGRAM_INCREMENT_START_DATE);
    const endDate = programIncrement.get(ATTR_PROGRAM_INCREMENT_END_DATE);
    const predecessor = programIncrement.get(ATTR_PROGRAM_INCREMENT_PREDECESSOR);
    const periodStatus = programIncrement.get(ATTR_PROGRAM_INCREMENT_PERIOD_STATUS);
    const confidenceVote = programIncrement.get(ATTR_PROGRAM_INCREMENT_CONFIDENCE_VOTE);
    const capacity = programIncrement.get(ATTR_PROGRAM_INCREMENT_CAPACITY);
    const Result = programIncrement.get(ATTR_PROGRAM_INCREMENT__RESULT);
    const statsJson = programIncrement.get(ATTR_PROGRAM_INCREMENT_STATS_JSON);
}

const TYPE_PROGRAM_INCREMENT = 'cf.cplace.solution.safe.programIncrement';
const ATTR_PROGRAM_INCREMENT_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_PROGRAM_INCREMENT_SOLUTION = 'cf.cplace.solution.safe.solution';
const ATTR_PROGRAM_INCREMENT_START_DATE = 'cf.cplace.solution.safe.startDate';
const ATTR_PROGRAM_INCREMENT_END_DATE = 'cf.cplace.solution.safe.endDate';
const ATTR_PROGRAM_INCREMENT_PREDECESSOR = 'cf.cplace.solution.safe.predecessor';
const ATTR_PROGRAM_INCREMENT_PERIOD_STATUS = 'cf.cplace.solution.safe.periodStatus';
const ATTR_PROGRAM_INCREMENT_CONFIDENCE_VOTE = 'cf.cplace.solution.safe.confidenceVote';
const ATTR_PROGRAM_INCREMENT_CAPACITY = 'cf.cplace.solution.safe.capacity';
const ATTR_PROGRAM_INCREMENT__RESULT = 'cf.cplace.solution.safe.confidenceVote.Result';
const ATTR_PROGRAM_INCREMENT_STATS_JSON = 'cf.cplace.solution.safe.statsJson';

function readFromIteration(iteration) {
    const title = iteration.get(ATTR_ITERATION_TITLE);
    const programIncrement = iteration.get(ATTR_ITERATION_PROGRAM_INCREMENT);
    const startDate = iteration.get(ATTR_ITERATION_START_DATE);
    const endDate = iteration.get(ATTR_ITERATION_END_DATE);
    const predecessor = iteration.get(ATTR_ITERATION_PREDECESSOR);
}

const TYPE_ITERATION = 'cf.cplace.solution.safe.iteration';
const ATTR_ITERATION_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_ITERATION_PROGRAM_INCREMENT = 'cf.cplace.solution.safe.programIncrement';
const ATTR_ITERATION_START_DATE = 'cf.cplace.solution.safe.startDate';
const ATTR_ITERATION_END_DATE = 'cf.cplace.solution.safe.endDate';
const ATTR_ITERATION_PREDECESSOR = 'cf.cplace.solution.safe.predecessor';

function readFromCapability(capability) {
    const title = capability.get(ATTR_CAPABILITY_TITLE);
    const reference = capability.get(ATTR_CAPABILITY_REFERENCE);
    const description = capability.get(ATTR_CAPABILITY_DESCRIPTION);
    const capabilityType = capability.get(ATTR_CAPABILITY_CAPABILITY_TYPE);
    const state = capability.get(ATTR_CAPABILITY_STATE);
    const wsjf = capability.get(ATTR_CAPABILITY_WSJF);
    const businessValue = capability.get(ATTR_CAPABILITY_BUSINESS_VALUE);
    const timeCriticality = capability.get(ATTR_CAPABILITY_TIME_CRITICALITY);
    const riskReduction = capability.get(ATTR_CAPABILITY_RISK_REDUCTION);
    const jobSize = capability.get(ATTR_CAPABILITY_JOB_SIZE);
    const programIncrement = capability.get(ATTR_CAPABILITY_PROGRAM_INCREMENT);
    const actualStartDate = capability.get(ATTR_CAPABILITY_ACTUAL_START_DATE);
    const actualEndDate = capability.get(ATTR_CAPABILITY_ACTUAL_END_DATE);
    const flowTime = capability.get(ATTR_CAPABILITY_FLOW_TIME);
    const program = capability.get(ATTR_CAPABILITY_PROGRAM);
    const capabilityowner = capability.get(ATTR_CAPABILITY_CAPABILITYOWNER);
    const portfolioEpic = capability.get(ATTR_CAPABILITY_PORTFOLIO_EPIC);
    const solutionShortName = capability.get(ATTR_CAPABILITY_SOLUTION_SHORT_NAME);
    const plannedStart = capability.get(ATTR_CAPABILITY_PLANNED_START);
    const plannedEnd = capability.get(ATTR_CAPABILITY_PLANNED_END);
    const iteration = capability.get(ATTR_CAPABILITY_ITERATION);
    const definitionOfReady = capability.get(ATTR_CAPABILITY_DEFINITION_OF_READY);
    const definitionOfDone = capability.get(ATTR_CAPABILITY_DEFINITION_OF_DONE);
    const acceptanceCriteria = capability.get(ATTR_CAPABILITY_ACCEPTANCE_CRITERIA);
    const benefitHypothesis = capability.get(ATTR_CAPABILITY_BENEFIT_HYPOTHESIS);
    const conflictState = capability.get(ATTR_CAPABILITY_CONFLICT_STATE);
    const features = capability.get(ATTR_CAPABILITY_FEATURES);
}

const TYPE_CAPABILITY = 'cf.cplace.solution.safe.capability';
const ATTR_CAPABILITY_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_CAPABILITY_REFERENCE = 'cf.cplace.solution.safe.solution.reference';
const ATTR_CAPABILITY_DESCRIPTION = 'cf.cplace.solution.safe.description';
const ATTR_CAPABILITY_CAPABILITY_TYPE = 'cf.cplace.solution.safe.capabilityType';
const ATTR_CAPABILITY_STATE = 'cf.cplace.solution.safe.state';
const ATTR_CAPABILITY_WSJF = 'cf.cplace.solution.safe.wsjf';
const ATTR_CAPABILITY_BUSINESS_VALUE = 'cf.cplace.solution.safe.businessValue';
const ATTR_CAPABILITY_TIME_CRITICALITY = 'cf.cplace.solution.safe.timeCriticality';
const ATTR_CAPABILITY_RISK_REDUCTION = 'cf.cplace.solution.safe.riskReduction';
const ATTR_CAPABILITY_JOB_SIZE = 'cf.cplace.solution.safe.jobSize';
const ATTR_CAPABILITY_PROGRAM_INCREMENT = 'cf.cplace.solution.safe.programIncrement';
const ATTR_CAPABILITY_ACTUAL_START_DATE = 'cf.cplace.solution.safe.actualStartDate';
const ATTR_CAPABILITY_ACTUAL_END_DATE = 'cf.cplace.solution.safe.actualEndDate';
const ATTR_CAPABILITY_FLOW_TIME = 'cf.cplace.solution.safe.flowTime';
const ATTR_CAPABILITY_PROGRAM = 'cf.cplace.solution.safe.program';
const ATTR_CAPABILITY_CAPABILITYOWNER = 'cf.cplace.solution.safe.capabilityowner';
const ATTR_CAPABILITY_PORTFOLIO_EPIC = 'cf.cplace.solution.safe.portfolioEpic';
const ATTR_CAPABILITY_SOLUTION_SHORT_NAME = 'cf.cplace.solution.safe.solutionShortName';
const ATTR_CAPABILITY_PLANNED_START = 'cf.cplace.solution.safe.plannedStart';
const ATTR_CAPABILITY_PLANNED_END = 'cf.cplace.solution.safe.plannedEnd';
const ATTR_CAPABILITY_ITERATION = 'cf.cplace.solution.safe.iteration';
const ATTR_CAPABILITY_DEFINITION_OF_READY = 'cf.cplace.solution.safe.definitionOfReady';
const ATTR_CAPABILITY_DEFINITION_OF_DONE = 'cf.cplace.solution.safe.definitionOfDone';
const ATTR_CAPABILITY_ACCEPTANCE_CRITERIA = 'cf.cplace.solution.safe.acceptanceCriteria';
const ATTR_CAPABILITY_BENEFIT_HYPOTHESIS = 'cf.cplace.solution.safe.benefitHypothesis';
const ATTR_CAPABILITY_CONFLICT_STATE = 'cf.cplace.solution.safe.conflictState';
const ATTR_CAPABILITY_FEATURES = 'cf.cplace.solution.safe.features';

function readFromDependency(dependency) {
    const title = dependency.get(ATTR_DEPENDENCY_TITLE);
    const successor = dependency.get(ATTR_DEPENDENCY_SUCCESSOR);
    const type = dependency.get(ATTR_DEPENDENCY_TYPE);
    const predecessor = dependency.get(ATTR_DEPENDENCY_PREDECESSOR);
    const status = dependency.get(ATTR_DEPENDENCY_STATUS);
    const description = dependency.get(ATTR_DEPENDENCY_DESCRIPTION);
    const plannedStartA = dependency.get(ATTR_DEPENDENCY_PLANNED_START_A);
    const plannedEndB = dependency.get(ATTR_DEPENDENCY_PLANNED_END_B);
}

const TYPE_DEPENDENCY = 'cf.cplace.solution.safe.dependency';
const ATTR_DEPENDENCY_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_DEPENDENCY_SUCCESSOR = 'cf.cplace.solution.safe.successor';
const ATTR_DEPENDENCY_TYPE = 'cf.cplace.solution.safe.type';
const ATTR_DEPENDENCY_PREDECESSOR = 'cf.cplace.solution.safe.predecessor';
const ATTR_DEPENDENCY_STATUS = 'cf.cplace.solution.safe.status';
const ATTR_DEPENDENCY_DESCRIPTION = 'cf.cplace.solution.safe.description';
const ATTR_DEPENDENCY_PLANNED_START_A = 'cf.cplace.solution.safe.plannedStartA';
const ATTR_DEPENDENCY_PLANNED_END_B = 'cf.cplace.solution.safe.plannedEndB';

function readFromSafeMilestone(safeMilestone) {
    const title = safeMilestone.get(ATTR_SAFE_MILESTONE_TITLE);
    const date = safeMilestone.get(ATTR_SAFE_MILESTONE_DATE);
    const type = safeMilestone.get(ATTR_SAFE_MILESTONE_TYPE);
    const relevantFor = safeMilestone.get(ATTR_SAFE_MILESTONE_RELEVANT_FOR);
    const plannedStart = safeMilestone.get(ATTR_SAFE_MILESTONE_PLANNED_START);
    const plannedEnd = safeMilestone.get(ATTR_SAFE_MILESTONE_PLANNED_END);
}

const TYPE_SAFE_MILESTONE = 'cf.cplace.solution.safe.safeMilestone';
const ATTR_SAFE_MILESTONE_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_SAFE_MILESTONE_DATE = 'cf.cplace.solution.safe.date';
const ATTR_SAFE_MILESTONE_TYPE = 'cf.cplace.solution.safe.type';
const ATTR_SAFE_MILESTONE_RELEVANT_FOR = 'cf.cplace.solution.safe.relevantFor';
const ATTR_SAFE_MILESTONE_PLANNED_START = 'cf.cplace.solution.safe.plannedStart';
const ATTR_SAFE_MILESTONE_PLANNED_END = 'cf.cplace.solution.safe.plannedEnd';

function readFromPeriodStatus(periodStatus) {
    const order = periodStatus.get(ATTR_PERIOD_STATUS_ORDER);
}

const TYPE_PERIOD_STATUS = 'cf.cplace.solution.safe.periodStatus';
const ATTR_PERIOD_STATUS_ORDER = 'cf.cplace.solution.safe.order';

function readFromFlowMetric(flowMetric) {
    const artifactType = flowMetric.get(ATTR_FLOW_METRIC_ARTIFACT_TYPE);
    const snapshotDate = flowMetric.get(ATTR_FLOW_METRIC_SNAPSHOT_DATE);
    const Reference = flowMetric.get(ATTR_FLOW_METRIC__REFERENCE);
    const timebox = flowMetric.get(ATTR_FLOW_METRIC_TIMEBOX);
    const jsonMetricData = flowMetric.get(ATTR_FLOW_METRIC_JSON_METRIC_DATA);
}

const TYPE_FLOW_METRIC = 'cf.cplace.solution.safe.flowMetric';
const ATTR_FLOW_METRIC_ARTIFACT_TYPE = 'cf.cplace.solution.safe.artifactType';
const ATTR_FLOW_METRIC_SNAPSHOT_DATE = 'cf.cplace.solution.safe.snapshotDate';
const ATTR_FLOW_METRIC__REFERENCE = 'cf.cplace.solution.safe.SAFeLevel.Reference';
const ATTR_FLOW_METRIC_TIMEBOX = 'cf.cplace.solution.safe.timebox';
const ATTR_FLOW_METRIC_JSON_METRIC_DATA = 'cf.cplace.solution.safe.jsonMetricData';

function readFromObjective(objective) {
    const objectivetitle = objective.get(ATTR_OBJECTIVE_OBJECTIVETITLE);
    const timebox = objective.get(ATTR_OBJECTIVE_TIMEBOX);
    const SAFeLevel = objective.get(ATTR_OBJECTIVE__S_A_FE_LEVEL);
    const Reference = objective.get(ATTR_OBJECTIVE__REFERENCE);
    const businessValue = objective.get(ATTR_OBJECTIVE_BUSINESS_VALUE);
    const actualValue = objective.get(ATTR_OBJECTIVE_ACTUAL_VALUE);
    const commitment = objective.get(ATTR_OBJECTIVE_COMMITMENT);
    const statement = objective.get(ATTR_OBJECTIVE_STATEMENT);
}

const TYPE_OBJECTIVE = 'cf.cplace.solution.safe.objective';
const ATTR_OBJECTIVE_OBJECTIVETITLE = 'cf.cplace.solution.safe.objectivetitle';
const ATTR_OBJECTIVE_TIMEBOX = 'cf.cplace.solution.safe.timebox';
const ATTR_OBJECTIVE__S_A_FE_LEVEL = 'cf.cplace.solution.safe.SAFeLevel';
const ATTR_OBJECTIVE__REFERENCE = 'cf.cplace.solution.safe.SAFeLevel.Reference';
const ATTR_OBJECTIVE_BUSINESS_VALUE = 'cf.cplace.solution.safe.businessValue';
const ATTR_OBJECTIVE_ACTUAL_VALUE = 'cf.cplace.solution.safe.actualValue';
const ATTR_OBJECTIVE_COMMITMENT = 'cf.cplace.solution.safe.commitment';
const ATTR_OBJECTIVE_STATEMENT = 'cf.cplace.solution.safe.statement';

function readFromEvent(event) {
    const title = event.get(ATTR_EVENT_TITLE);
    const startDate = event.get(ATTR_EVENT_START_DATE);
    const endDate = event.get(ATTR_EVENT_END_DATE);
    const solution = event.get(ATTR_EVENT_SOLUTION);
}

const TYPE_EVENT = 'cf.cplace.solution.safe.event';
const ATTR_EVENT_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_EVENT_START_DATE = 'cf.cplace.solution.safe.startDate';
const ATTR_EVENT_END_DATE = 'cf.cplace.solution.safe.endDate';
const ATTR_EVENT_SOLUTION = 'cf.cplace.solution.safe.solution';

function readFromConfidenceVote(confidenceVote) {
    const PI = confidenceVote.get(ATTR_CONFIDENCE_VOTE__P_I);
    const result = confidenceVote.get(ATTR_CONFIDENCE_VOTE_RESULT);
    const oneFinger = confidenceVote.get(ATTR_CONFIDENCE_VOTE_ONE_FINGER);
    const twoFingers = confidenceVote.get(ATTR_CONFIDENCE_VOTE_TWO_FINGERS);
    const threeFingers = confidenceVote.get(ATTR_CONFIDENCE_VOTE_THREE_FINGERS);
    const fourFingers = confidenceVote.get(ATTR_CONFIDENCE_VOTE_FOUR_FINGERS);
    const fiveFingers = confidenceVote.get(ATTR_CONFIDENCE_VOTE_FIVE_FINGERS);
    const solution = confidenceVote.get(ATTR_CONFIDENCE_VOTE_SOLUTION);
}

const TYPE_CONFIDENCE_VOTE = 'cf.cplace.solution.safe.confidenceVote';
const ATTR_CONFIDENCE_VOTE__P_I = 'cf.cplace.solution.safe.confidenceVote.PI';
const ATTR_CONFIDENCE_VOTE_RESULT = 'cf.cplace.solution.safe.confidenceVote.result';
const ATTR_CONFIDENCE_VOTE_ONE_FINGER = 'cf.cplace.solution.safe.confidenceVote.oneFinger';
const ATTR_CONFIDENCE_VOTE_TWO_FINGERS = 'cf.cplace.solution.safe.confidenceVote.twoFingers';
const ATTR_CONFIDENCE_VOTE_THREE_FINGERS = 'cf.cplace.solution.safe.confidenceVote.threeFingers';
const ATTR_CONFIDENCE_VOTE_FOUR_FINGERS = 'cf.cplace.solution.safe.confidenceVote.fourFingers';
const ATTR_CONFIDENCE_VOTE_FIVE_FINGERS = 'cf.cplace.solution.safe.confidenceVote.fiveFingers';
const ATTR_CONFIDENCE_VOTE_SOLUTION = 'cf.cplace.solution.safe.confidenceVote.solution';

