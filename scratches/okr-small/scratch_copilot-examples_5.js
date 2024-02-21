const TYPE_CYCLE_TYPE = 'cf.cplace.solution.okr.cycle';
const TYPE_CYCLE_ATTR_YEAR = 'cf.cplace.solution.okr.year';
const TYPE_CYCLE_ATTR_QUARTER = 'cf.cplace.solution.okr.quarter';
const TYPE_CYCLE_ATTR_STATUS = 'cf.cplace.solution.okr.status';
const TYPE_CYCLE_ATTR_CYCLES_DASHBOARD = 'cf.cplace.solution.okr.cyclesDashboard';
const TYPE_CYCLE_ATTR_START = 'cf.cplace.solution.okr.start';
const TYPE_CYCLE_ATTR_END = 'cf.cplace.solution.okr.end';
const TYPE_CYCLE_ATTR_STATUS_FOR_NAME_GENERATION_PATTERN = 'cf.cplace.solution.okr.statusForNameGenerationPattern';

function readFromCycle(cycle) {
    const year = cycle.get(TYPE_CYCLE_ATTR_YEAR);
    const quarter = cycle.get(TYPE_CYCLE_ATTR_QUARTER);
    const status = cycle.get(TYPE_CYCLE_ATTR_STATUS);
    const cyclesDashboard = cycle.get(TYPE_CYCLE_ATTR_CYCLES_DASHBOARD);
    const start = cycle.get(TYPE_CYCLE_ATTR_START);
    const end = cycle.get(TYPE_CYCLE_ATTR_END);
    const statusForNameGenerationPattern = cycle.get(TYPE_CYCLE_ATTR_STATUS_FOR_NAME_GENERATION_PATTERN);
}

/**
 * Creates a cycle page with all attributes
 */
function createCycleWithAllAttributes(year, quarter, status, cyclesDashboard, start, end, statusForNameGenerationPattern) {
    return cplace.actions().createPage({
        customType: TYPE_CYCLE_TYPE,
        customAttributes: {
            [TYPE_CYCLE_ATTR_YEAR]: year,
            [TYPE_CYCLE_ATTR_QUARTER]: quarter,
            [TYPE_CYCLE_ATTR_STATUS]: status,
            [TYPE_CYCLE_ATTR_CYCLES_DASHBOARD]: cyclesDashboard,
            [TYPE_CYCLE_ATTR_START]: start,
            [TYPE_CYCLE_ATTR_END]: end,
            [TYPE_CYCLE_ATTR_STATUS_FOR_NAME_GENERATION_PATTERN]: statusForNameGenerationPattern
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Creates a cycle page with a single attribute
 */
function createCycleWithSingleAttribute(start) {
    return cplace.actions().createPage({
        customType: TYPE_CYCLE_TYPE,
        customAttributes: {
            [TYPE_CYCLE_ATTR_START]: start
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Updates a cycle with a single attribute
 */
function updateSingleAttributeOfCycle(cycle, start) {
    cplace.actions().updatePage(cycle, {
        customAttributes: {
            [TYPE_CYCLE_ATTR_START]: start,
        }
    });
    cycle.registerAttributeForRefresh(TYPE_CYCLE_ATTR_START);
}

const TYPE_OBJECTIVE_TYPE= 'cf.cplace.solution.okr.objective';
const TYPE_OBJECTIVE_ATTR_NUMBER = 'cf.cplace.solution.okr.number';
const TYPE_OBJECTIVE_ATTR_TITLE = 'cf.cplace.solution.okr.title';
const TYPE_OBJECTIVE_ATTR_SET = 'cf.cplace.solution.okr.set';
const TYPE_OBJECTIVE_ATTR_ACCOMPLISHED = 'cf.cplace.solution.okr.accomplished';
const TYPE_OBJECTIVE_ATTR_CYCLE = 'cf.cplace.solution.okr.cycle';
const TYPE_OBJECTIVE_ATTR_DESCRIPTION = 'cf.cplace.solution.okr.description';

function readFromObjective(objective) {
    const number = objective.get(TYPE_OBJECTIVE_ATTR_NUMBER);
    const title = objective.get(TYPE_OBJECTIVE_ATTR_TITLE);
    const set = objective.get(TYPE_OBJECTIVE_ATTR_SET);
    const accomplished = objective.get(TYPE_OBJECTIVE_ATTR_ACCOMPLISHED);
    const cycle = objective.get(TYPE_OBJECTIVE_ATTR_CYCLE);
    const description = objective.get(TYPE_OBJECTIVE_ATTR_DESCRIPTION);
}

/**
 * Creates an objective page with all attributes
 */
function createObjective(number, title, set, accomplished, cycle, description) {
    return cplace.actions().createPage({
        customType: TYPE_OBJECTIVE_TYPE,
        customAttributes: {
            [TYPE_OBJECTIVE_ATTR_NUMBER]: number,
            [TYPE_OBJECTIVE_ATTR_TITLE]: title,
            [TYPE_OBJECTIVE_ATTR_SET]: set,
            [TYPE_OBJECTIVE_ATTR_ACCOMPLISHED]: accomplished,
            [TYPE_OBJECTIVE_ATTR_CYCLE]: cycle,
            [TYPE_OBJECTIVE_ATTR_DESCRIPTION]: description
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Creates an objective page with a single attribute
 */
function createObjectiveWithSingleAttribute(number) {
    return cplace.actions().createPage({
        customType: TYPE_OBJECTIVE_TYPE,
        customAttributes: {
            [TYPE_OBJECTIVE_ATTR_NUMBER]: number
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Updates an objective with a single attribute
 */
function updateObjective(objective, number) {
    cplace.actions().updatePage(objective, {
        customAttributes: {
            [TYPE_OBJECTIVE_ATTR_NUMBER]: number,
        }
    });
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE_ATTR_NUMBER);
}

const TYPE_KEY_RESULT_TYPE = 'cf.cplace.solution.okr.keyResult';
const TYPE_KEY_RESULT_ATTR_NUMBER = 'cf.cplace.solution.okr.number';
const TYPE_KEY_RESULT_ATTR_TITLE = 'cf.cplace.solution.okr.title';
const TYPE_KEY_RESULT_ATTR_PROGRESS_INDICATOR = 'cf.cplace.solution.okr.progressIndicator';
const TYPE_KEY_RESULT_ATTR_CONFIDENCE_LEVEL = 'cf.cplace.solution.okr.confidenceLevel';
const TYPE_KEY_RESULT_ATTR_GRADING_FORECAST = 'cf.cplace.solution.okr.gradingForecast';
const TYPE_KEY_RESULT_ATTR_SMALL_SUPPORT = 'cf.cplace.solution.okr.smallSupport';
const TYPE_KEY_RESULT_ATTR_BIG_SUPPORT = 'cf.cplace.solution.okr.bigSupport';
const TYPE_KEY_RESULT_ATTR_GIVE_BIG_SUPPORT = 'cf.cplace.solution.okr.giveBigSupport';
const TYPE_KEY_RESULT_ATTR_RECEIVE_BIG_SUPPORT = 'cf.cplace.solution.okr.receiveBigSupport';
const TYPE_KEY_RESULT_ATTR_OBJECTIVE = 'cf.cplace.solution.okr.objective';
const TYPE_KEY_RESULT_ATTR_PROGRESS = 'cf.cplace.solution.okr.progress';
const TYPE_KEY_RESULT_ATTR_SET = 'cf.cplace.solution.okr.set';
const TYPE_KEY_RESULT_ATTR_CYCLE = 'cf.cplace.solution.okr.cycle';
const TYPE_KEY_RESULT_ATTR_ORGANIZATIONAL_UNIT = 'cf.cplace.solution.okr.organizationalUnit';
const TYPE_KEY_RESULT_ATTR_LAST_UPDATE = 'cf.cplace.solution.okr.lastUpdate';

function readFromKeyResult(keyResult) {
    const number = keyResult.get(TYPE_KEY_RESULT_ATTR_NUMBER);
    const title = keyResult.get(TYPE_KEY_RESULT_ATTR_TITLE);
    const progressIndicator = keyResult.get(TYPE_KEY_RESULT_ATTR_PROGRESS_INDICATOR);
    const confidenceLevel = keyResult.get(TYPE_KEY_RESULT_ATTR_CONFIDENCE_LEVEL);
    const gradingForecast = keyResult.get(TYPE_KEY_RESULT_ATTR_GRADING_FORECAST);
    const smallSupport = keyResult.get(TYPE_KEY_RESULT_ATTR_SMALL_SUPPORT);
    const bigSupport = keyResult.get(TYPE_KEY_RESULT_ATTR_BIG_SUPPORT);
    const giveBigSupport = keyResult.get(TYPE_KEY_RESULT_ATTR_GIVE_BIG_SUPPORT);
    const receiveBigSupport = keyResult.get(TYPE_KEY_RESULT_ATTR_RECEIVE_BIG_SUPPORT);
    const objective = keyResult.get(TYPE_KEY_RESULT_ATTR_OBJECTIVE);
    const progress = keyResult.get(TYPE_KEY_RESULT_ATTR_PROGRESS);
    const set = keyResult.get(TYPE_KEY_RESULT_ATTR_SET);
    const cycle = keyResult.get(TYPE_KEY_RESULT_ATTR_CYCLE);
    const organizationalUnit = keyResult.get(TYPE_KEY_RESULT_ATTR_ORGANIZATIONAL_UNIT);
    const lastUpdate = keyResult.get(TYPE_KEY_RESULT_ATTR_LAST_UPDATE);
}

/**
 * Create a key result page with all attributes
 */
function createKeyResult(number, title, progressIndicator, confidenceLevel, gradingForecast, smallSupport, bigSupport, giveBigSupport, receiveBigSupport, objective, progress, set, cycle, organizationalUnit, lastUpdate) {
    return cplace.actions().createPage({
        customType: TYPE_KEY_RESULT_TYPE,
        customAttributes: {
            [TYPE_KEY_RESULT_ATTR_NUMBER]: number,
            [TYPE_KEY_RESULT_ATTR_TITLE]: title,
            [TYPE_KEY_RESULT_ATTR_PROGRESS_INDICATOR]: progressIndicator,
            [TYPE_KEY_RESULT_ATTR_CONFIDENCE_LEVEL]: confidenceLevel,
            [TYPE_KEY_RESULT_ATTR_GRADING_FORECAST]: gradingForecast,
            [TYPE_KEY_RESULT_ATTR_SMALL_SUPPORT]: smallSupport,
            [TYPE_KEY_RESULT_ATTR_BIG_SUPPORT]: bigSupport,
            [TYPE_KEY_RESULT_ATTR_GIVE_BIG_SUPPORT]: giveBigSupport,
            [TYPE_KEY_RESULT_ATTR_RECEIVE_BIG_SUPPORT]: receiveBigSupport,
            [TYPE_KEY_RESULT_ATTR_OBJECTIVE]: objective,
            [TYPE_KEY_RESULT_ATTR_PROGRESS]: progress,
            [TYPE_KEY_RESULT_ATTR_SET]: set,
            [TYPE_KEY_RESULT_ATTR_CYCLE]: cycle,
            [TYPE_KEY_RESULT_ATTR_ORGANIZATIONAL_UNIT]: organizationalUnit,
            [TYPE_KEY_RESULT_ATTR_LAST_UPDATE]: lastUpdate
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Creates a key result page with a single attribute
 */
function createKeyResultWithSingleAttribute(number) {
    return cplace.actions().createPage({
        customType: TYPE_KEY_RESULT_TYPE,
        customAttributes: {
            [TYPE_KEY_RESULT_ATTR_NUMBER]: number
        }
    }, {
        setGeneratedName: true
    });
}

/**
 * Updates a key result page with a single attribute
 */
function updateKeyResult(keyResult, number) {
    cplace.actions().updatePage(keyResult, {
        customAttributes: {
            [TYPE_KEY_RESULT_ATTR_NUMBER]: number
        }
    });
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT_ATTR_NUMBER);
}
