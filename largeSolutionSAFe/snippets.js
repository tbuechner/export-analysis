function readFromSolution(solution) {
    const description = solution.get('cf.cplace.solution.safe.description');
    const solutionTrainEngineer = solution.get('cf.cplace.solution.safe.solutionTrainEngineer');
    const solutionTrainArchitect = solution.get('cf.cplace.solution.safe.solutionTrainArchitect');
    const solutionManagement = solution.get('cf.cplace.solution.safe.solutionManagement');
    const previousPi = solution.get('cf.cplace.solution.safe.previousPi');
    const currentPi = solution.get('cf.cplace.solution.safe.currentPi');
    const nextPi = solution.get('cf.cplace.solution.safe.nextPi');
    const funnelWIPLimit = solution.get('cf.cplace.solution.safe.funnelWIPLimit');
    const analyzingWIPLimit = solution.get('cf.cplace.solution.safe.analyzingWIPLimit');
    const backlogWIPLimit = solution.get('cf.cplace.solution.safe.backlogWIPLimit');
    const implementingWIPLimit = solution.get('cf.cplace.solution.safe.implementingWIPLimit');
    const validatingWIPLimit = solution.get('cf.cplace.solution.safe.validatingWIPLimit');
    const deployingWIPLimit = solution.get('cf.cplace.solution.safe.deployingWIPLimit');
    const releasingWIPLimit = solution.get('cf.cplace.solution.safe.releasingWIPLimit');
    const shortName = solution.get('cf.cplace.solution.safe.shortName');
    const horizon = solution.get('cf.cplace.solution.safe.horizon');
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


//------------------------------------------------------------------------------------------------------

function readFromProgramIncrement(programIncrement) {
    const title = programIncrement.get('cf.cplace.solution.safe.title');
    const solution = programIncrement.get('cf.cplace.solution.safe.solution');
    const startDate = programIncrement.get('cf.cplace.solution.safe.startDate');
    const endDate = programIncrement.get('cf.cplace.solution.safe.endDate');
    const predecessor = programIncrement.get('cf.cplace.solution.safe.predecessor');
    const periodStatus = programIncrement.get('cf.cplace.solution.safe.periodStatus');
    const confidenceVote = programIncrement.get('cf.cplace.solution.safe.confidenceVote');
    const capacity = programIncrement.get('cf.cplace.solution.safe.capacity');
    const Result = programIncrement.get('cf.cplace.solution.safe.confidenceVote.Result');
    const statsJson = programIncrement.get('cf.cplace.solution.safe.statsJson');
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


//------------------------------------------------------------------------------------------------------

function readFromIteration(iteration) {
    const title = iteration.get('cf.cplace.solution.safe.title');
    const programIncrement = iteration.get('cf.cplace.solution.safe.programIncrement');
    const startDate = iteration.get('cf.cplace.solution.safe.startDate');
    const endDate = iteration.get('cf.cplace.solution.safe.endDate');
    const predecessor = iteration.get('cf.cplace.solution.safe.predecessor');
}

const TYPE_ITERATION = 'cf.cplace.solution.safe.iteration';
const ATTR_ITERATION_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_ITERATION_PROGRAM_INCREMENT = 'cf.cplace.solution.safe.programIncrement';
const ATTR_ITERATION_START_DATE = 'cf.cplace.solution.safe.startDate';
const ATTR_ITERATION_END_DATE = 'cf.cplace.solution.safe.endDate';
const ATTR_ITERATION_PREDECESSOR = 'cf.cplace.solution.safe.predecessor';


//------------------------------------------------------------------------------------------------------

function readFromCapability(capability) {
    const title = capability.get('cf.cplace.solution.safe.title');
    const reference = capability.get('cf.cplace.solution.safe.solution.reference');
    const description = capability.get('cf.cplace.solution.safe.description');
    const capabilityType = capability.get('cf.cplace.solution.safe.capabilityType');
    const state = capability.get('cf.cplace.solution.safe.state');
    const wsjf = capability.get('cf.cplace.solution.safe.wsjf');
    const businessValue = capability.get('cf.cplace.solution.safe.businessValue');
    const timeCriticality = capability.get('cf.cplace.solution.safe.timeCriticality');
    const riskReduction = capability.get('cf.cplace.solution.safe.riskReduction');
    const jobSize = capability.get('cf.cplace.solution.safe.jobSize');
    const programIncrement = capability.get('cf.cplace.solution.safe.programIncrement');
    const actualStartDate = capability.get('cf.cplace.solution.safe.actualStartDate');
    const actualEndDate = capability.get('cf.cplace.solution.safe.actualEndDate');
    const flowTime = capability.get('cf.cplace.solution.safe.flowTime');
    const program = capability.get('cf.cplace.solution.safe.program');
    const capabilityowner = capability.get('cf.cplace.solution.safe.capabilityowner');
    const portfolioEpic = capability.get('cf.cplace.solution.safe.portfolioEpic');
    const solutionShortName = capability.get('cf.cplace.solution.safe.solutionShortName');
    const plannedStart = capability.get('cf.cplace.solution.safe.plannedStart');
    const plannedEnd = capability.get('cf.cplace.solution.safe.plannedEnd');
    const iteration = capability.get('cf.cplace.solution.safe.iteration');
    const definitionOfReady = capability.get('cf.cplace.solution.safe.definitionOfReady');
    const definitionOfDone = capability.get('cf.cplace.solution.safe.definitionOfDone');
    const acceptanceCriteria = capability.get('cf.cplace.solution.safe.acceptanceCriteria');
    const benefitHypothesis = capability.get('cf.cplace.solution.safe.benefitHypothesis');
    const conflictState = capability.get('cf.cplace.solution.safe.conflictState');
    const features = capability.get('cf.cplace.solution.safe.features');
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


//------------------------------------------------------------------------------------------------------

function readFromDependency(dependency) {
    const title = dependency.get('cf.cplace.solution.safe.title');
    const successor = dependency.get('cf.cplace.solution.safe.successor');
    const type = dependency.get('cf.cplace.solution.safe.type');
    const predecessor = dependency.get('cf.cplace.solution.safe.predecessor');
    const status = dependency.get('cf.cplace.solution.safe.status');
    const description = dependency.get('cf.cplace.solution.safe.description');
    const plannedStartA = dependency.get('cf.cplace.solution.safe.plannedStartA');
    const plannedEndB = dependency.get('cf.cplace.solution.safe.plannedEndB');
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


//------------------------------------------------------------------------------------------------------

function readFromSafeMilestone(safeMilestone) {
    const title = safeMilestone.get('cf.cplace.solution.safe.title');
    const date = safeMilestone.get('cf.cplace.solution.safe.date');
    const type = safeMilestone.get('cf.cplace.solution.safe.type');
    const relevantFor = safeMilestone.get('cf.cplace.solution.safe.relevantFor');
    const plannedStart = safeMilestone.get('cf.cplace.solution.safe.plannedStart');
    const plannedEnd = safeMilestone.get('cf.cplace.solution.safe.plannedEnd');
}

const TYPE_SAFE_MILESTONE = 'cf.cplace.solution.safe.safeMilestone';
const ATTR_SAFE_MILESTONE_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_SAFE_MILESTONE_DATE = 'cf.cplace.solution.safe.date';
const ATTR_SAFE_MILESTONE_TYPE = 'cf.cplace.solution.safe.type';
const ATTR_SAFE_MILESTONE_RELEVANT_FOR = 'cf.cplace.solution.safe.relevantFor';
const ATTR_SAFE_MILESTONE_PLANNED_START = 'cf.cplace.solution.safe.plannedStart';
const ATTR_SAFE_MILESTONE_PLANNED_END = 'cf.cplace.solution.safe.plannedEnd';


//------------------------------------------------------------------------------------------------------

function readFromPeriodStatus(periodStatus) {
    const order = periodStatus.get('cf.cplace.solution.safe.order');
}

const TYPE_PERIOD_STATUS = 'cf.cplace.solution.safe.periodStatus';
const ATTR_PERIOD_STATUS_ORDER = 'cf.cplace.solution.safe.order';


//------------------------------------------------------------------------------------------------------

function readFromFlowMetric(flowMetric) {
    const artifactType = flowMetric.get('cf.cplace.solution.safe.artifactType');
    const snapshotDate = flowMetric.get('cf.cplace.solution.safe.snapshotDate');
    const Reference = flowMetric.get('cf.cplace.solution.safe.SAFeLevel.Reference');
    const timebox = flowMetric.get('cf.cplace.solution.safe.timebox');
    const jsonMetricData = flowMetric.get('cf.cplace.solution.safe.jsonMetricData');
}

const TYPE_FLOW_METRIC = 'cf.cplace.solution.safe.flowMetric';
const ATTR_FLOW_METRIC_ARTIFACT_TYPE = 'cf.cplace.solution.safe.artifactType';
const ATTR_FLOW_METRIC_SNAPSHOT_DATE = 'cf.cplace.solution.safe.snapshotDate';
const ATTR_FLOW_METRIC__REFERENCE = 'cf.cplace.solution.safe.SAFeLevel.Reference';
const ATTR_FLOW_METRIC_TIMEBOX = 'cf.cplace.solution.safe.timebox';
const ATTR_FLOW_METRIC_JSON_METRIC_DATA = 'cf.cplace.solution.safe.jsonMetricData';


//------------------------------------------------------------------------------------------------------

function readFromObjective(objective) {
    const objectivetitle = objective.get('cf.cplace.solution.safe.objectivetitle');
    const timebox = objective.get('cf.cplace.solution.safe.timebox');
    const SAFeLevel = objective.get('cf.cplace.solution.safe.SAFeLevel');
    const Reference = objective.get('cf.cplace.solution.safe.SAFeLevel.Reference');
    const businessValue = objective.get('cf.cplace.solution.safe.businessValue');
    const actualValue = objective.get('cf.cplace.solution.safe.actualValue');
    const commitment = objective.get('cf.cplace.solution.safe.commitment');
    const statement = objective.get('cf.cplace.solution.safe.statement');
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


//------------------------------------------------------------------------------------------------------

function readFromEvent(event) {
    const title = event.get('cf.cplace.solution.safe.title');
    const startDate = event.get('cf.cplace.solution.safe.startDate');
    const endDate = event.get('cf.cplace.solution.safe.endDate');
    const solution = event.get('cf.cplace.solution.safe.solution');
}

const TYPE_EVENT = 'cf.cplace.solution.safe.event';
const ATTR_EVENT_TITLE = 'cf.cplace.solution.safe.title';
const ATTR_EVENT_START_DATE = 'cf.cplace.solution.safe.startDate';
const ATTR_EVENT_END_DATE = 'cf.cplace.solution.safe.endDate';
const ATTR_EVENT_SOLUTION = 'cf.cplace.solution.safe.solution';


//------------------------------------------------------------------------------------------------------

function readFromConfidenceVote(confidenceVote) {
    const PI = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.PI');
    const result = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.result');
    const oneFinger = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.oneFinger');
    const twoFingers = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.twoFingers');
    const threeFingers = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.threeFingers');
    const fourFingers = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.fourFingers');
    const fiveFingers = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.fiveFingers');
    const solution = confidenceVote.get('cf.cplace.solution.safe.confidenceVote.solution');
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


//------------------------------------------------------------------------------------------------------

