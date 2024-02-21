function readFromCycle(cycle) {
    const year = cycle.get('cf.cplace.solution.okr.year');
    const quarter = cycle.get('cf.cplace.solution.okr.quarter');
    const status = cycle.get('cf.cplace.solution.okr.status');
    const cyclesDashboard = cycle.get('cf.cplace.solution.okr.cyclesDashboard');
    const start = cycle.get('cf.cplace.solution.okr.start');
    const end = cycle.get('cf.cplace.solution.okr.end');
    const statusForNameGenerationPattern = cycle.get('cf.cplace.solution.okr.statusForNameGenerationPattern');
}

const TYPE_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_CYCLE_YEAR = 'cf.cplace.solution.okr.year';
const ATTR_CYCLE_QUARTER = 'cf.cplace.solution.okr.quarter';
const ATTR_CYCLE_STATUS = 'cf.cplace.solution.okr.status';
const ATTR_CYCLE_CYCLES_DASHBOARD = 'cf.cplace.solution.okr.cyclesDashboard';
const ATTR_CYCLE_START = 'cf.cplace.solution.okr.start';
const ATTR_CYCLE_END = 'cf.cplace.solution.okr.end';
const ATTR_CYCLE_STATUS_FOR_NAME_GENERATION_PATTERN = 'cf.cplace.solution.okr.statusForNameGenerationPattern';


//------------------------------------------------------------------------------------------------------

function readFromObjective(objective) {
    const number = objective.get('cf.cplace.solution.okr.number');
    const title = objective.get('cf.cplace.solution.okr.title');
    const set = objective.get('cf.cplace.solution.okr.set');
    const accomplished = objective.get('cf.cplace.solution.okr.accomplished');
    const cycle = objective.get('cf.cplace.solution.okr.cycle');
    const description = objective.get('cf.cplace.solution.okr.description');
}

const TYPE_OBJECTIVE = 'cf.cplace.solution.okr.objective';
const ATTR_OBJECTIVE_NUMBER = 'cf.cplace.solution.okr.number';
const ATTR_OBJECTIVE_TITLE = 'cf.cplace.solution.okr.title';
const ATTR_OBJECTIVE_SET = 'cf.cplace.solution.okr.set';
const ATTR_OBJECTIVE_ACCOMPLISHED = 'cf.cplace.solution.okr.accomplished';
const ATTR_OBJECTIVE_CYCLE = 'cf.cplace.solution.okr.cycle';
const ATTR_OBJECTIVE_DESCRIPTION = 'cf.cplace.solution.okr.description';


//------------------------------------------------------------------------------------------------------

function readFromKeyResult(keyResult) {
    const number = keyResult.get('cf.cplace.solution.okr.number');
    const title = keyResult.get('cf.cplace.solution.okr.title');
    const progressIndicator = keyResult.get('cf.cplace.solution.okr.progressIndicator');
    const confidenceLevel = keyResult.get('cf.cplace.solution.okr.confidenceLevel');
    const gradingForecast = keyResult.get('cf.cplace.solution.okr.gradingForecast');
    const smallSupport = keyResult.get('cf.cplace.solution.okr.smallSupport');
    const bigSupport = keyResult.get('cf.cplace.solution.okr.bigSupport');
    const giveBigSupport = keyResult.get('cf.cplace.solution.okr.giveBigSupport');
    const receiveBigSupport = keyResult.get('cf.cplace.solution.okr.receiveBigSupport');
    const objective = keyResult.get('cf.cplace.solution.okr.objective');
    const progress = keyResult.get('cf.cplace.solution.okr.progress');
    const set = keyResult.get('cf.cplace.solution.okr.set');
    const cycle = keyResult.get('cf.cplace.solution.okr.cycle');
    const organizationalUnit = keyResult.get('cf.cplace.solution.okr.organizationalUnit');
    const lastUpdate = keyResult.get('cf.cplace.solution.okr.lastUpdate');
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


//------------------------------------------------------------------------------------------------------

function readFromProgress(progress) {
    const result = progress.get('cf.cplace.solution.okr.result');
    const problem = progress.get('cf.cplace.solution.okr.problem');
    const lessonsLearned = progress.get('cf.cplace.solution.okr.lessonsLearned');
    const nextSteps = progress.get('cf.cplace.solution.okr.nextSteps');
    const keyResult = progress.get('cf.cplace.solution.okr.keyResult');
    const cycle = progress.get('cf.cplace.solution.okr.cycle');
    const objective = progress.get('cf.cplace.solution.okr.objective');
    const smallSupport = progress.get('cf.cplace.solution.okr.smallSupport');
    const bigSupport = progress.get('cf.cplace.solution.okr.bigSupport');
    const progressIndicator = progress.get('cf.cplace.solution.okr.progressIndicator');
    const confidenceLevel = progress.get('cf.cplace.solution.okr.confidenceLevel');
    const gradingForecast = progress.get('cf.cplace.solution.okr.gradingForecast');
    const lastUpdate = progress.get('cf.cplace.solution.okr.lastUpdate');
    const set = progress.get('cf.cplace.solution.okr.set');
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


//------------------------------------------------------------------------------------------------------

function readFromTask(task) {
    const title = task.get('cf.cplace.digitalBoard.title');
    const responsible = task.get('cf.cplace.digitalBoard.responsible');
    const description = task.get('cf.cplace.digitalBoard.description');
    const status = task.get('cf.cplace.digitalBoard.status');
    const dueDate = task.get('cf.cplace.digitalBoard.dueDate');
    const keyResult = task.get('cf.cplace.solution.okr.keyResult');
    const escalationLevel = task.get('cf.cplace.digitalBoard.escalationLevel');
}

const TYPE_TASK = 'cf.cplace.solution.okr.task';
const ATTR_TASK_TITLE = 'cf.cplace.digitalBoard.title';
const ATTR_TASK_RESPONSIBLE = 'cf.cplace.digitalBoard.responsible';
const ATTR_TASK_DESCRIPTION = 'cf.cplace.digitalBoard.description';
const ATTR_TASK_STATUS = 'cf.cplace.digitalBoard.status';
const ATTR_TASK_DUE_DATE = 'cf.cplace.digitalBoard.dueDate';
const ATTR_TASK_KEY_RESULT = 'cf.cplace.solution.okr.keyResult';
const ATTR_TASK_ESCALATION_LEVEL = 'cf.cplace.digitalBoard.escalationLevel';


//------------------------------------------------------------------------------------------------------

function readFromSelectNextCycle(selectNextCycle) {
    const nextCycle = selectNextCycle.get('cf.cplace.solution.okr.nextCycle');
}

const TYPE_SELECT_NEXT_CYCLE = 'cf.cplace.solution.okr.selectNextCycle';
const ATTR_SELECT_NEXT_CYCLE_NEXT_CYCLE = 'cf.cplace.solution.okr.nextCycle';


//------------------------------------------------------------------------------------------------------

