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

function updatePage(page) {
    cplace.actions().updatePage(page, {
        customAttributes: {
            ['attributeName1']: value1,
            ['attributeName2']: value2
        },
    });
}

function createPage() {
    return cplace.actions().createPage({
        customType: TYPE_NAME,
        customAttributes: {
            ['attributeName1']: value1,
            ['attributeName2']: value2
        }
    }, {
        setGeneratedName: true
    });
}

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
    const programIncrements = solution.getIncomingPages('cf.cplace.solution.safe.programIncrement', 'cf.cplace.solution.safe.solution');
}


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


function readFromIteration(iteration) {
    const title = iteration.get('cf.cplace.solution.safe.title');
    const programIncrement = iteration.get('cf.cplace.solution.safe.programIncrement');
    const startDate = iteration.get('cf.cplace.solution.safe.startDate');
    const endDate = iteration.get('cf.cplace.solution.safe.endDate');
    const predecessor = iteration.get('cf.cplace.solution.safe.predecessor');
}


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


function readFromSafeMilestone(safeMilestone) {
    const title = safeMilestone.get('cf.cplace.solution.safe.title');
    const date = safeMilestone.get('cf.cplace.solution.safe.date');
    const type = safeMilestone.get('cf.cplace.solution.safe.type');
    const relevantFor = safeMilestone.get('cf.cplace.solution.safe.relevantFor');
    const plannedStart = safeMilestone.get('cf.cplace.solution.safe.plannedStart');
    const plannedEnd = safeMilestone.get('cf.cplace.solution.safe.plannedEnd');
}


function readFromPeriodStatus(periodStatus) {
    const order = periodStatus.get('cf.cplace.solution.safe.order');
}


function readFromFlowMetric(flowMetric) {
    const artifactType = flowMetric.get('cf.cplace.solution.safe.artifactType');
    const snapshotDate = flowMetric.get('cf.cplace.solution.safe.snapshotDate');
    const Reference = flowMetric.get('cf.cplace.solution.safe.SAFeLevel.Reference');
    const timebox = flowMetric.get('cf.cplace.solution.safe.timebox');
    const jsonMetricData = flowMetric.get('cf.cplace.solution.safe.jsonMetricData');
}


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


function readFromEvent(event) {
    const title = event.get('cf.cplace.solution.safe.title');
    const startDate = event.get('cf.cplace.solution.safe.startDate');
    const endDate = event.get('cf.cplace.solution.safe.endDate');
    const solution = event.get('cf.cplace.solution.safe.solution');
}


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


