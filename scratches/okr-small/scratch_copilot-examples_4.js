const TYPE_CYCLE = {
    TYPE: 'cf.cplace.solution.okr.cycle',
    ATTR: {
        QUARTER: 'cf.cplace.solution.okr.quarter',
        STATUS: 'cf.cplace.solution.okr.status',
        CYCLES_DASHBOARD: 'cf.cplace.solution.okr.cyclesDashboard',
        START: 'cf.cplace.solution.okr.start',
        END: 'cf.cplace.solution.okr.end',
        STATUS_FOR_NAME_GENERATION_PATTERN: 'cf.cplace.solution.okr.statusForNameGenerationPattern'
    },
}

function readFromCycle(cycle) {
    const year = cycle.get(TYPE_CYCLE.ATTR.YEAR);
    const quarter = cycle.get(TYPE_CYCLE.ATTR.QUARTER);
    const status = cycle.get(TYPE_CYCLE.ATTR.STATUS);
    const cyclesDashboard = cycle.get(TYPE_CYCLE.ATTR.CYCLES_DASHBOARD);
    const start = cycle.get(TYPE_CYCLE.ATTR.START);
    const end = cycle.get(TYPE_CYCLE.ATTR.END);
    const statusForNameGenerationPattern = cycle.get(TYPE_CYCLE.ATTR.STATUS_FOR_NAME_GENERATION_PATTERN);
}

function createCycleWithAllAttributes(year, quarter, status, cyclesDashboard, start, end, statusForNameGenerationPattern) {
    return cplace.actions().createPage({
        customType: TYPE_CYCLE.TYPE,
        customAttributes: {
            [TYPE_CYCLE.ATTR.YEAR]: year,
            [TYPE_CYCLE.ATTR.QUARTER]: quarter,
            [TYPE_CYCLE.ATTR.STATUS]: status,
            [TYPE_CYCLE.ATTR.CYCLES_DASHBOARD]: cyclesDashboard,
            [TYPE_CYCLE.ATTR.START]: start,
            [TYPE_CYCLE.ATTR.END]: end,
            [TYPE_CYCLE.ATTR.STATUS_FOR_NAME_GENERATION_PATTERN]: statusForNameGenerationPattern
        }
    }, {
        setGeneratedName: true
    });
}

function createCycleWithSingleAttribute(start) {
    return cplace.actions().createPage({
        customType: TYPE_CYCLE.TYPE,
        customAttributes: {
            [TYPE_CYCLE.ATTR.START]: start
        }
    }, {
        setGeneratedName: true
    });
}

function updateSingleAttributeOfCycle(cycle, start) {
    cplace.actions().updatePage(cycle, {
        customAttributes: {
            [TYPE_CYCLE.ATTR.START]: start,
        }
    });
    cycle.registerAttributeForRefresh(TYPE_CYCLE.ATTR.START);
}

const TYPE_OBJECTIVE = {
    TYPE: 'cf.cplace.solution.okr.objective',
    ATTR: {
        NUMBER: 'cf.cplace.solution.okr.number',
        TITLE: 'cf.cplace.solution.okr.title',
        SET: 'cf.cplace.solution.okr.set',
        ACCOMPLISHED: 'cf.cplace.solution.okr.accomplished',
        CYCLE: 'cf.cplace.solution.okr.cycle',
        DESCRIPTION: 'cf.cplace.solution.okr.description'
    }
}

function readFromObjective(objective) {
    const number = objective.get(TYPE_OBJECTIVE.ATTR.NUMBER);
    const title = objective.get(TYPE_OBJECTIVE.ATTR.TITLE);
    const set = objective.get(TYPE_OBJECTIVE.ATTR.SET);
    const accomplished = objective.get(TYPE_OBJECTIVE.ATTR.ACCOMPLISHED);
    const cycle = objective.get(TYPE_OBJECTIVE.ATTR.CYCLE);
    const description = objective.get(TYPE_OBJECTIVE.ATTR.DESCRIPTION);
}

function createObjective(number, title, set, accomplished, cycle, description) {
    return cplace.actions().createPage({
        customType: TYPE_OBJECTIVE.TYPE,
        customAttributes: {
            [TYPE_OBJECTIVE.ATTR.NUMBER]: number,
            [TYPE_OBJECTIVE.ATTR.TITLE]: title,
            [TYPE_OBJECTIVE.ATTR.SET]: set,
            [TYPE_OBJECTIVE.ATTR.ACCOMPLISHED]: accomplished,
            [TYPE_OBJECTIVE.ATTR.CYCLE]: cycle,
            [TYPE_OBJECTIVE.ATTR.DESCRIPTION]: description
        }
    }, {
        setGeneratedName: true
    });
}

function updateObjective(objective, number, title, set, accomplished, cycle, description) {
    cplace.actions().updatePage(objective, {
        customAttributes: {
            [TYPE_OBJECTIVE.ATTR.NUMBER]: number,
            [TYPE_OBJECTIVE.ATTR.TITLE]: title,
            [TYPE_OBJECTIVE.ATTR.SET]: set,
            [TYPE_OBJECTIVE.ATTR.ACCOMPLISHED]: accomplished,
            [TYPE_OBJECTIVE.ATTR.CYCLE]: cycle,
            [TYPE_OBJECTIVE.ATTR.DESCRIPTION]: description
        }
    });
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.NUMBER);
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.TITLE);
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.SET);
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.ACCOMPLISHED);
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.CYCLE);
    objective.registerAttributeForRefresh(TYPE_OBJECTIVE.ATTR.DESCRIPTION);
}

const TYPE_KEY_RESULT = {
    TYPE: 'cf.cplace.solution.okr.keyResult',
    ATTR: {
        NUMBER: 'cf.cplace.solution.okr.number',
        TITLE: 'cf.cplace.solution.okr.title',
        PROGRESS_INDICATOR: 'cf.cplace.solution.okr.progressIndicator',
        CONFIDENCE_LEVEL: 'cf.cplace.solution.okr.confidenceLevel',
        GRADING_FORECAST: 'cf.cplace.solution.okr.gradingForecast',
        SMALL_SUPPORT: 'cf.cplace.solution.okr.smallSupport',
        BIG_SUPPORT: 'cf.cplace.solution.okr.bigSupport',
        GIVE_BIG_SUPPORT: 'cf.cplace.solution.okr.giveBigSupport',
        RECEIVE_BIG_SUPPORT: 'cf.cplace.solution.okr.receiveBigSupport',
        OBJECTIVE: 'cf.cplace.solution.okr.objective',
        PROGRESS: 'cf.cplace.solution.okr.progress',
        SET: 'cf.cplace.solution.okr.set',
        CYCLE: 'cf.cplace.solution.okr.cycle',
        ORGANIZATIONAL_UNIT: 'cf.cplace.solution.okr.organizationalUnit',
        LAST_UPDATE: 'cf.cplace.solution.okr.lastUpdate'
    }
}

function readFromKeyResult(keyResult) {
    const number = keyResult.get(TYPE_KEY_RESULT.ATTR.NUMBER);
    const title = keyResult.get(TYPE_KEY_RESULT.ATTR.TITLE);
    const progressIndicator = keyResult.get(TYPE_KEY_RESULT.ATTR.PROGRESS_INDICATOR);
    const confidenceLevel = keyResult.get(TYPE_KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
    const gradingForecast = keyResult.get(TYPE_KEY_RESULT.ATTR.GRADING_FORECAST);
    const smallSupport = keyResult.get(TYPE_KEY_RESULT.ATTR.SMALL_SUPPORT);
    const bigSupport = keyResult.get(TYPE_KEY_RESULT.ATTR.BIG_SUPPORT);
    const giveBigSupport = keyResult.get(TYPE_KEY_RESULT.ATTR.GIVE_BIG_SUPPORT);
    const receiveBigSupport = keyResult.get(TYPE_KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT);
    const objective = keyResult.get(TYPE_KEY_RESULT.ATTR.OBJECTIVE);
    const progress = keyResult.get(TYPE_KEY_RESULT.ATTR.PROGRESS);
    const set = keyResult.get(TYPE_KEY_RESULT.ATTR.SET);
    const cycle = keyResult.get(TYPE_KEY_RESULT.ATTR.CYCLE);
    const organizationalUnit = keyResult.get(TYPE_KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT);
    const lastUpdate = keyResult.get(TYPE_KEY_RESULT.ATTR.LAST_UPDATE);
}

function createKeyResult(number, title, progressIndicator, confidenceLevel, gradingForecast, smallSupport, bigSupport, giveBigSupport, receiveBigSupport, objective, progress, set, cycle, organizationalUnit, lastUpdate) {
    return cplace.actions().createPage({
        customType: TYPE_KEY_RESULT.TYPE,
        customAttributes: {
            [TYPE_KEY_RESULT.ATTR.NUMBER]: number,
            [TYPE_KEY_RESULT.ATTR.TITLE]: title,
            [TYPE_KEY_RESULT.ATTR.PROGRESS_INDICATOR]: progressIndicator,
            [TYPE_KEY_RESULT.ATTR.CONFIDENCE_LEVEL]: confidenceLevel,
            [TYPE_KEY_RESULT.ATTR.GRADING_FORECAST]: gradingForecast,
            [TYPE_KEY_RESULT.ATTR.SMALL_SUPPORT]: smallSupport,
            [TYPE_KEY_RESULT.ATTR.BIG_SUPPORT]: bigSupport,
            [TYPE_KEY_RESULT.ATTR.GIVE_BIG_SUPPORT]: giveBigSupport,
            [TYPE_KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT]: receiveBigSupport,
            [TYPE_KEY_RESULT.ATTR.OBJECTIVE]: objective,
            [TYPE_KEY_RESULT.ATTR.PROGRESS]: progress,
            [TYPE_KEY_RESULT.ATTR.SET]: set,
            [TYPE_KEY_RESULT.ATTR.CYCLE]: cycle,
            [TYPE_KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT]: organizationalUnit,
            [TYPE_KEY_RESULT.ATTR.LAST_UPDATE]: lastUpdate
        }
    }, {
        setGeneratedName: true
    });
}

function updateKeyResult(keyResult, number, title, progressIndicator, confidenceLevel, gradingForecast, smallSupport, bigSupport, giveBigSupport, receiveBigSupport, objective, progress, set, cycle, organizationalUnit, lastUpdate) {
    cplace.actions().updatePage(keyResult, {
        customAttributes: {
            [TYPE_KEY_RESULT.ATTR.NUMBER]: number,
            [TYPE_KEY_RESULT.ATTR.TITLE]: title,
            [TYPE_KEY_RESULT.ATTR.PROGRESS_INDICATOR]: progressIndicator,
            [TYPE_KEY_RESULT.ATTR.CONFIDENCE_LEVEL]: confidenceLevel,
            [TYPE_KEY_RESULT.ATTR.GRADING_FORECAST]: gradingForecast,
            [TYPE_KEY_RESULT.ATTR.SMALL_SUPPORT]: smallSupport,
            [TYPE_KEY_RESULT.ATTR.BIG_SUPPORT]: bigSupport,
            [TYPE_KEY_RESULT.ATTR.GIVE_BIG_SUPPORT]: giveBigSupport,
            [TYPE_KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT]: receiveBigSupport,
            [TYPE_KEY_RESULT.ATTR.OBJECTIVE]: objective,
            [TYPE_KEY_RESULT.ATTR.PROGRESS]: progress,
            [TYPE_KEY_RESULT.ATTR.SET]: set,
            [TYPE_KEY_RESULT.ATTR.CYCLE]: cycle,
            [TYPE_KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT]: organizationalUnit,
            [TYPE_KEY_RESULT.ATTR.LAST_UPDATE]: lastUpdate
        }
    });
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.NUMBER);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.TITLE);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.PROGRESS_INDICATOR);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.GRADING_FORECAST);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.SMALL_SUPPORT);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.BIG_SUPPORT);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.GIVE_BIG_SUPPORT);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.OBJECTIVE);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.PROGRESS);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.SET);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.CYCLE);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT);
    keyResult.registerAttributeForRefresh(TYPE_KEY_RESULT.ATTR.LAST_UPDATE);
}
