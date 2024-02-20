function examples_solution(order) {
    const description = order.get('cf.cplace.solution.safe.description');
    const solutionTrainEngineer = order.get('cf.cplace.solution.safe.solutionTrainEngineer');
    const solutionTrainArchitect = order.get('cf.cplace.solution.safe.solutionTrainArchitect');
    const solutionManagement = order.get('cf.cplace.solution.safe.solutionManagement');
    const previousPi = order.get('cf.cplace.solution.safe.previousPi');
    const currentPi = order.get('cf.cplace.solution.safe.currentPi');
    const nextPi = order.get('cf.cplace.solution.safe.nextPi');
    const funnelWIPLimit = order.get('cf.cplace.solution.safe.funnelWIPLimit');
    const analyzingWIPLimit = order.get('cf.cplace.solution.safe.analyzingWIPLimit');
    const backlogWIPLimit = order.get('cf.cplace.solution.safe.backlogWIPLimit');
    const implementingWIPLimit = order.get('cf.cplace.solution.safe.implementingWIPLimit');
    const validatingWIPLimit = order.get('cf.cplace.solution.safe.validatingWIPLimit');
    const deployingWIPLimit = order.get('cf.cplace.solution.safe.deployingWIPLimit');
    const releasingWIPLimit = order.get('cf.cplace.solution.safe.releasingWIPLimit');
    const shortName = order.get('cf.cplace.solution.safe.shortName');
    const horizon = order.get('cf.cplace.solution.safe.horizon');
}


//------------------------------------------------------------------------------------------------------

function examples_programIncrement(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const solution = order.get('cf.cplace.solution.safe.solution');
    const startDate = order.get('cf.cplace.solution.safe.startDate');
    const endDate = order.get('cf.cplace.solution.safe.endDate');
    const predecessor = order.get('cf.cplace.solution.safe.predecessor');
    const periodStatus = order.get('cf.cplace.solution.safe.periodStatus');
    const confidenceVote = order.get('cf.cplace.solution.safe.confidenceVote');
    const capacity = order.get('cf.cplace.solution.safe.capacity');
    const Result = order.get('cf.cplace.solution.safe.confidenceVote.Result');
    const statsJson = order.get('cf.cplace.solution.safe.statsJson');
}


//------------------------------------------------------------------------------------------------------

function examples_iteration(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const programIncrement = order.get('cf.cplace.solution.safe.programIncrement');
    const startDate = order.get('cf.cplace.solution.safe.startDate');
    const endDate = order.get('cf.cplace.solution.safe.endDate');
    const predecessor = order.get('cf.cplace.solution.safe.predecessor');
}


//------------------------------------------------------------------------------------------------------

function examples_capability(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const reference = order.get('cf.cplace.solution.safe.solution.reference');
    const description = order.get('cf.cplace.solution.safe.description');
    const capabilityType = order.get('cf.cplace.solution.safe.capabilityType');
    const state = order.get('cf.cplace.solution.safe.state');
    const wsjf = order.get('cf.cplace.solution.safe.wsjf');
    const businessValue = order.get('cf.cplace.solution.safe.businessValue');
    const timeCriticality = order.get('cf.cplace.solution.safe.timeCriticality');
    const riskReduction = order.get('cf.cplace.solution.safe.riskReduction');
    const jobSize = order.get('cf.cplace.solution.safe.jobSize');
    const programIncrement = order.get('cf.cplace.solution.safe.programIncrement');
    const actualStartDate = order.get('cf.cplace.solution.safe.actualStartDate');
    const actualEndDate = order.get('cf.cplace.solution.safe.actualEndDate');
    const flowTime = order.get('cf.cplace.solution.safe.flowTime');
    const program = order.get('cf.cplace.solution.safe.program');
    const capabilityowner = order.get('cf.cplace.solution.safe.capabilityowner');
    const portfolioEpic = order.get('cf.cplace.solution.safe.portfolioEpic');
    const solutionShortName = order.get('cf.cplace.solution.safe.solutionShortName');
    const plannedStart = order.get('cf.cplace.solution.safe.plannedStart');
    const plannedEnd = order.get('cf.cplace.solution.safe.plannedEnd');
    const iteration = order.get('cf.cplace.solution.safe.iteration');
    const definitionOfReady = order.get('cf.cplace.solution.safe.definitionOfReady');
    const definitionOfDone = order.get('cf.cplace.solution.safe.definitionOfDone');
    const acceptanceCriteria = order.get('cf.cplace.solution.safe.acceptanceCriteria');
    const benefitHypothesis = order.get('cf.cplace.solution.safe.benefitHypothesis');
    const conflictState = order.get('cf.cplace.solution.safe.conflictState');
    const features = order.get('cf.cplace.solution.safe.features');
}


//------------------------------------------------------------------------------------------------------

function examples_dependency(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const successor = order.get('cf.cplace.solution.safe.successor');
    const type = order.get('cf.cplace.solution.safe.type');
    const predecessor = order.get('cf.cplace.solution.safe.predecessor');
    const status = order.get('cf.cplace.solution.safe.status');
    const description = order.get('cf.cplace.solution.safe.description');
    const plannedStartA = order.get('cf.cplace.solution.safe.plannedStartA');
    const plannedEndB = order.get('cf.cplace.solution.safe.plannedEndB');
}


//------------------------------------------------------------------------------------------------------

function examples_safeMilestone(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const date = order.get('cf.cplace.solution.safe.date');
    const type = order.get('cf.cplace.solution.safe.type');
    const relevantFor = order.get('cf.cplace.solution.safe.relevantFor');
    const plannedStart = order.get('cf.cplace.solution.safe.plannedStart');
    const plannedEnd = order.get('cf.cplace.solution.safe.plannedEnd');
}


//------------------------------------------------------------------------------------------------------

function examples_periodStatus(order) {
    const order = order.get('cf.cplace.solution.safe.order');
}


//------------------------------------------------------------------------------------------------------

function examples_flowMetric(order) {
    const artifactType = order.get('cf.cplace.solution.safe.artifactType');
    const snapshotDate = order.get('cf.cplace.solution.safe.snapshotDate');
    const Reference = order.get('cf.cplace.solution.safe.SAFeLevel.Reference');
    const timebox = order.get('cf.cplace.solution.safe.timebox');
    const jsonMetricData = order.get('cf.cplace.solution.safe.jsonMetricData');
}


//------------------------------------------------------------------------------------------------------

function examples_objective(order) {
    const objectivetitle = order.get('cf.cplace.solution.safe.objectivetitle');
    const timebox = order.get('cf.cplace.solution.safe.timebox');
    const SAFeLevel = order.get('cf.cplace.solution.safe.SAFeLevel');
    const Reference = order.get('cf.cplace.solution.safe.SAFeLevel.Reference');
    const businessValue = order.get('cf.cplace.solution.safe.businessValue');
    const actualValue = order.get('cf.cplace.solution.safe.actualValue');
    const commitment = order.get('cf.cplace.solution.safe.commitment');
    const statement = order.get('cf.cplace.solution.safe.statement');
}


//------------------------------------------------------------------------------------------------------

function examples_event(order) {
    const title = order.get('cf.cplace.solution.safe.title');
    const startDate = order.get('cf.cplace.solution.safe.startDate');
    const endDate = order.get('cf.cplace.solution.safe.endDate');
    const solution = order.get('cf.cplace.solution.safe.solution');
}


//------------------------------------------------------------------------------------------------------

function examples_confidenceVote(order) {
    const PI = order.get('cf.cplace.solution.safe.confidenceVote.PI');
    const result = order.get('cf.cplace.solution.safe.confidenceVote.result');
    const oneFinger = order.get('cf.cplace.solution.safe.confidenceVote.oneFinger');
    const twoFingers = order.get('cf.cplace.solution.safe.confidenceVote.twoFingers');
    const threeFingers = order.get('cf.cplace.solution.safe.confidenceVote.threeFingers');
    const fourFingers = order.get('cf.cplace.solution.safe.confidenceVote.fourFingers');
    const fiveFingers = order.get('cf.cplace.solution.safe.confidenceVote.fiveFingers');
    const solution = order.get('cf.cplace.solution.safe.confidenceVote.solution');
}


//------------------------------------------------------------------------------------------------------

