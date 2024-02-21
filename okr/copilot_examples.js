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
            [ATTRIBUTE_NAME_1]: value1,
            [ATTRIBUTE_NAME_2]: value2
        },
    });
}

function createPage() {
    return cplace.actions().createPage({
        customType: TYPE_NAME,
        customAttributes: {
            [ATTRIBUTE_NAME_1]: value1,
            [ATTRIBUTE_NAME_2]: value2
        }
    }, {
        setGeneratedName: true
    });
}
    
function readFromCycle(cycle) {
    const year = cycle.get(ATTR_CYCLE_YEAR);
    const quarter = cycle.get(ATTR_CYCLE_QUARTER);
    const status = cycle.get(ATTR_CYCLE_STATUS);
    const cyclesDashboard = cycle.get(ATTR_CYCLE_CYCLES_DASHBOARD);
    const start = cycle.get(ATTR_CYCLE_START);
    const end = cycle.get(ATTR_CYCLE_END);
    const statusForNameGenerationPattern = cycle.get(ATTR_CYCLE_STATUS_FOR_NAME_GENERATION_PATTERN);
}

const TYPE_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_CYCLE_YEAR = 'cf.cplace.solution.okr.year';
const ATTR_CYCLE_QUARTER = 'cf.cplace.solution.okr.quarter';
const ATTR_CYCLE_STATUS = 'cf.cplace.solution.okr.status';
const ATTR_CYCLE_CYCLES_DASHBOARD = 'cf.cplace.solution.okr.cyclesDashboard';
const ATTR_CYCLE_START = 'cf.cplace.solution.okr.start';
const ATTR_CYCLE_END = 'cf.cplace.solution.okr.end';
const ATTR_CYCLE_STATUS_FOR_NAME_GENERATION_PATTERN = 'cf.cplace.solution.okr.statusForNameGenerationPattern';

function readFromObjective(objective) {
    const number = objective.get(ATTR_OBJECTIVE_NUMBER);
    const title = objective.get(ATTR_OBJECTIVE_TITLE);
    const set = objective.get(ATTR_OBJECTIVE_SET);
    const accomplished = objective.get(ATTR_OBJECTIVE_ACCOMPLISHED);
    const cycle = objective.get(ATTR_OBJECTIVE_CYCLE);
    const description = objective.get(ATTR_OBJECTIVE_DESCRIPTION);
}

const TYPE_OBJECTIVE = 'cf.cplace.solution.okr.objective';
const ATTR_OBJECTIVE_NUMBER = 'cf.cplace.solution.okr.number';
const ATTR_OBJECTIVE_TITLE = 'cf.cplace.solution.okr.title';
const ATTR_OBJECTIVE_SET = 'cf.cplace.solution.okr.set';
const ATTR_OBJECTIVE_ACCOMPLISHED = 'cf.cplace.solution.okr.accomplished';
const ATTR_OBJECTIVE_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_OBJECTIVE_DESCRIPTION = 'cf.cplace.solution.okr.description';

function readFromKeyResult(keyResult) {
    const number = keyResult.get(ATTR_KEY_RESULT_NUMBER);
    const title = keyResult.get(ATTR_KEY_RESULT_TITLE);
    const progressIndicator = keyResult.get(ATTR_KEY_RESULT_PROGRESS_INDICATOR);
    const confidenceLevel = keyResult.get(ATTR_KEY_RESULT_CONFIDENCE_LEVEL);
    const gradingForecast = keyResult.get(ATTR_KEY_RESULT_GRADING_FORECAST);
    const smallSupport = keyResult.get(ATTR_KEY_RESULT_SMALL_SUPPORT);
    const bigSupport = keyResult.get(ATTR_KEY_RESULT_BIG_SUPPORT);
    const giveBigSupport = keyResult.get(ATTR_KEY_RESULT_GIVE_BIG_SUPPORT);
    const receiveBigSupport = keyResult.get(ATTR_KEY_RESULT_RECEIVE_BIG_SUPPORT);
    const objective = keyResult.get(ATTR_KEY_RESULT_OBJECTIVE);
    const progress = keyResult.get(ATTR_KEY_RESULT_PROGRESS);
    const set = keyResult.get(ATTR_KEY_RESULT_SET);
    const cycle = keyResult.get(ATTR_KEY_RESULT_CYCLE);
    const organizationalUnit = keyResult.get(ATTR_KEY_RESULT_ORGANIZATIONAL_UNIT);
    const lastUpdate = keyResult.get(ATTR_KEY_RESULT_LAST_UPDATE);
}

const TYPE_KEY_RESULT = 'cf.cplace.solution.okr.keyResult';
const ATTR_KEY_RESULT_NUMBER = 'cf.cplace.solution.okr.number';
const ATTR_KEY_RESULT_TITLE = 'cf.cplace.solution.okr.title';
const ATTR_KEY_RESULT_PROGRESS_INDICATOR = 'cf.cplace.solution.okr.progressIndicator';
const ATTR_KEY_RESULT_CONFIDENCE_LEVEL = 'cf.cplace.solution.okr.confidenceLevel';
const ATTR_KEY_RESULT_GRADING_FORECAST = 'cf.cplace.solution.okr.gradingForecast';
const ATTR_KEY_RESULT_SMALL_SUPPORT = 'cf.cplace.solution.okr.smallSupport';
const ATTR_KEY_RESULT_BIG_SUPPORT = 'cf.cplace.solution.okr.bigSupport';
const ATTR_KEY_RESULT_GIVE_BIG_SUPPORT = 'cf.cplace.solution.okr.giveBigSupport';
const ATTR_KEY_RESULT_RECEIVE_BIG_SUPPORT = 'cf.cplace.solution.okr.receiveBigSupport';
const ATTR_KEY_RESULT_OBJECTIVE = 'cf.cplace.solution.okr.objective';
const ATTR_KEY_RESULT_PROGRESS = 'cf.cplace.solution.okr.progress';
const ATTR_KEY_RESULT_SET = 'cf.cplace.solution.okr.set';
const ATTR_KEY_RESULT_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_KEY_RESULT_ORGANIZATIONAL_UNIT = 'cf.cplace.solution.okr.organizationalUnit';
const ATTR_KEY_RESULT_LAST_UPDATE = 'cf.cplace.solution.okr.lastUpdate';

function readFromProgress(progress) {
    const result = progress.get(ATTR_PROGRESS_RESULT);
    const problem = progress.get(ATTR_PROGRESS_PROBLEM);
    const lessonsLearned = progress.get(ATTR_PROGRESS_LESSONS_LEARNED);
    const nextSteps = progress.get(ATTR_PROGRESS_NEXT_STEPS);
    const keyResult = progress.get(ATTR_PROGRESS_KEY_RESULT);
    const cycle = progress.get(ATTR_PROGRESS_CYCLE);
    const objective = progress.get(ATTR_PROGRESS_OBJECTIVE);
    const smallSupport = progress.get(ATTR_PROGRESS_SMALL_SUPPORT);
    const bigSupport = progress.get(ATTR_PROGRESS_BIG_SUPPORT);
    const progressIndicator = progress.get(ATTR_PROGRESS_PROGRESS_INDICATOR);
    const confidenceLevel = progress.get(ATTR_PROGRESS_CONFIDENCE_LEVEL);
    const gradingForecast = progress.get(ATTR_PROGRESS_GRADING_FORECAST);
    const lastUpdate = progress.get(ATTR_PROGRESS_LAST_UPDATE);
    const set = progress.get(ATTR_PROGRESS_SET);
}

const TYPE_PROGRESS = 'cf.cplace.solution.okr.progress';
const ATTR_PROGRESS_RESULT = 'cf.cplace.solution.okr.result';
const ATTR_PROGRESS_PROBLEM = 'cf.cplace.solution.okr.problem';
const ATTR_PROGRESS_LESSONS_LEARNED = 'cf.cplace.solution.okr.lessonsLearned';
const ATTR_PROGRESS_NEXT_STEPS = 'cf.cplace.solution.okr.nextSteps';
const ATTR_PROGRESS_KEY_RESULT = 'cf.cplace.solution.okr.keyResult';
const ATTR_PROGRESS_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_PROGRESS_OBJECTIVE = 'cf.cplace.solution.okr.objective';
const ATTR_PROGRESS_SMALL_SUPPORT = 'cf.cplace.solution.okr.smallSupport';
const ATTR_PROGRESS_BIG_SUPPORT = 'cf.cplace.solution.okr.bigSupport';
const ATTR_PROGRESS_PROGRESS_INDICATOR = 'cf.cplace.solution.okr.progressIndicator';
const ATTR_PROGRESS_CONFIDENCE_LEVEL = 'cf.cplace.solution.okr.confidenceLevel';
const ATTR_PROGRESS_GRADING_FORECAST = 'cf.cplace.solution.okr.gradingForecast';
const ATTR_PROGRESS_LAST_UPDATE = 'cf.cplace.solution.okr.lastUpdate';
const ATTR_PROGRESS_SET = 'cf.cplace.solution.okr.set';

function readFromTask(task) {
    const title = task.get(ATTR_TASK_TITLE);
    const responsible = task.get(ATTR_TASK_RESPONSIBLE);
    const description = task.get(ATTR_TASK_DESCRIPTION);
    const status = task.get(ATTR_TASK_STATUS);
    const dueDate = task.get(ATTR_TASK_DUE_DATE);
    const keyResult = task.get(ATTR_TASK_KEY_RESULT);
    const escalationLevel = task.get(ATTR_TASK_ESCALATION_LEVEL);
}

const TYPE_TASK = 'cf.cplace.solution.okr.task';
const ATTR_TASK_TITLE = 'cf.cplace.digitalBoard.title';
const ATTR_TASK_RESPONSIBLE = 'cf.cplace.digitalBoard.responsible';
const ATTR_TASK_DESCRIPTION = 'cf.cplace.digitalBoard.description';
const ATTR_TASK_STATUS = 'cf.cplace.digitalBoard.status';
const ATTR_TASK_DUE_DATE = 'cf.cplace.digitalBoard.dueDate';
const ATTR_TASK_KEY_RESULT = 'cf.cplace.solution.okr.keyResult';
const ATTR_TASK_ESCALATION_LEVEL = 'cf.cplace.digitalBoard.escalationLevel';

function readFromSelectNextCycle(selectNextCycle) {
    const nextCycle = selectNextCycle.get(ATTR_SELECT_NEXT_CYCLE_NEXT_CYCLE);
}

const TYPE_SELECT_NEXT_CYCLE = 'cf.cplace.solution.okr.selectNextCycle';
const ATTR_SELECT_NEXT_CYCLE_NEXT_CYCLE = 'cf.cplace.solution.okr.nextCycle';

