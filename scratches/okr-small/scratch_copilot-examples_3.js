const TYPES = {
    CYCLE: {
        TYPE: 'cf.cplace.solution.okr.cycle',
        ATTR: {
            YEAR: 'cf.cplace.solution.okr.year',
            QUARTER: 'cf.cplace.solution.okr.quarter',
            STATUS: 'cf.cplace.solution.okr.status',
            CYCLES_DASHBOARD: 'cf.cplace.solution.okr.cyclesDashboard',
            START: 'cf.cplace.solution.okr.start',
            END: 'cf.cplace.solution.okr.end',
            STATUS_FOR_NAME_GENERATION_PATTERN: 'cf.cplace.solution.okr.statusForNameGenerationPattern'
        },
    },
    OBJECTIVE: {
        TYPE: 'cf.cplace.solution.okr.objective',
        ATTR: {
            NUMBER: 'cf.cplace.solution.okr.number',
            TITLE: 'cf.cplace.solution.okr.title',
            SET: 'cf.cplace.solution.okr.set',
            ACCOMPLISHED: 'cf.cplace.solution.okr.accomplished',
            CYCLE: 'cf.cplace.solution.okr.cycle',
            DESCRIPTION: 'cf.cplace.solution.okr.description'
        }
    },
    KEY_RESULT: {
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
}

function readFromCycle(order) {
    const year = order.get(TYPES.CYCLE.ATTR.YEAR);
    const quarter = order.get(TYPES.CYCLE.ATTR.QUARTER);
    const status = order.get(TYPES.CYCLE.ATTR.STATUS);
    const cyclesDashboard = order.get(TYPES.CYCLE.ATTR.CYCLES_DASHBOARD);
    const start = order.get(TYPES.CYCLE.ATTR.START);
    const end = order.get(TYPES.CYCLE.ATTR.END);
    const statusForNameGenerationPattern = order.get(TYPES.CYCLE.ATTR.STATUS_FOR_NAME_GENERATION_PATTERN);
}

function createCycle(year, quarter, status, cyclesDashboard, start, end, statusForNameGenerationPattern) {
    return cplace.actions().createPage( {
        customType: TYPES.CYCLE.TYPE,
        customAttributes: {
            [TYPES.CYCLE.ATTR.YEAR]: year,
            [TYPES.CYCLE.ATTR.QUARTER]: quarter,
            [TYPES.CYCLE.ATTR.STATUS]: status,
            [TYPES.CYCLE.ATTR.CYCLES_DASHBOARD]: cyclesDashboard,
            [TYPES.CYCLE.ATTR.START]: start,
            [TYPES.CYCLE.ATTR.END]: end,
            [TYPES.CYCLE.ATTR.STATUS_FOR_NAME_GENERATION_PATTERN]: statusForNameGenerationPattern
        }
    }, {
        setGeneratedName: true
    });
}

function readFromObjective(order) {
    const number = order.get(TYPES.OBJECTIVE.ATTR.NUMBER);
    const title = order.get(TYPES.OBJECTIVE.ATTR.TITLE);
    const set = order.get(TYPES.OBJECTIVE.ATTR.SET);
    const accomplished = order.get(TYPES.OBJECTIVE.ATTR.ACCOMPLISHED);
    const cycle = order.get(TYPES.OBJECTIVE.ATTR.CYCLE);
    const description = order.get(TYPES.OBJECTIVE.ATTR.DESCRIPTION);
}

function createObjective(number, title, set, accomplished, cycle, description) {
    return cplace.actions().createPage( {
        customType: TYPES.OBJECTIVE.TYPE,
        customAttributes: {
            [TYPES.OBJECTIVE.ATTR.NUMBER]: number,
            [TYPES.OBJECTIVE.ATTR.TITLE]: title,
            [TYPES.OBJECTIVE.ATTR.SET]: set,
            [TYPES.OBJECTIVE.ATTR.ACCOMPLISHED]: accomplished,
            [TYPES.OBJECTIVE.ATTR.CYCLE]: cycle,
            [TYPES.OBJECTIVE.ATTR.DESCRIPTION]: description
        }
    }, {
        setGeneratedName: true
    });
}

function readFromKeyResult(order) {
    const number = order.get(TYPES.KEY_RESULT.ATTR.NUMBER);
    const title = order.get(TYPES.KEY_RESULT.ATTR.TITLE);
    const progressIndicator = order.get(TYPES.KEY_RESULT.ATTR.PROGRESS_INDICATOR);
    const confidenceLevel = order.get(TYPES.KEY_RESULT.ATTR.CONFIDENCE_LEVEL);
    const gradingForecast = order.get(TYPES.KEY_RESULT.ATTR.GRADING_FORECAST);
    const smallSupport = order.get(TYPES.KEY_RESULT.ATTR.SMALL_SUPPORT);
    const bigSupport = order.get(TYPES.KEY_RESULT.ATTR.BIG_SUPPORT);
    const giveBigSupport = order.get(TYPES.KEY_RESULT.ATTR.GIVE_BIG_SUPPORT);
    const receiveBigSupport = order.get(TYPES.KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT);
    const objective = order.get(TYPES.KEY_RESULT.ATTR.OBJECTIVE);
    const progress = order.get(TYPES.KEY_RESULT.ATTR.PROGRESS);
    const set = order.get(TYPES.KEY_RESULT.ATTR.SET);
    const cycle = order.get(TYPES.KEY_RESULT.ATTR.CYCLE);
    const organizationalUnit = order.get(TYPES.KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT);
    const lastUpdate = order.get(TYPES.KEY_RESULT.ATTR.LAST_UPDATE);
}

function createKeyResult(number, title, progressIndicator, confidenceLevel, gradingForecast, smallSupport, bigSupport, giveBigSupport, receiveBigSupport, objective, progress, set, cycle, organizationalUnit, lastUpdate) {
    return cplace.actions().createPage( {
        customType: TYPES.KEY_RESULT.TYPE,
        customAttributes: {
            [TYPES.KEY_RESULT.ATTR.NUMBER]: number,
            [TYPES.KEY_RESULT.ATTR.TITLE]: title,
            [TYPES.KEY_RESULT.ATTR.PROGRESS_INDICATOR]: progressIndicator,
            [TYPES.KEY_RESULT.ATTR.CONFIDENCE_LEVEL]: confidenceLevel,
            [TYPES.KEY_RESULT.ATTR.GRADING_FORECAST]: gradingForecast,
            [TYPES.KEY_RESULT.ATTR.SMALL_SUPPORT]: smallSupport,
            [TYPES.KEY_RESULT.ATTR.BIG_SUPPORT]: bigSupport,
            [TYPES.KEY_RESULT.ATTR.GIVE_BIG_SUPPORT]: giveBigSupport,
            [TYPES.KEY_RESULT.ATTR.RECEIVE_BIG_SUPPORT]: receiveBigSupport,
            [TYPES.KEY_RESULT.ATTR.OBJECTIVE]: objective,
            [TYPES.KEY_RESULT.ATTR.PROGRESS]: progress,
            [TYPES.KEY_RESULT.ATTR.SET]: set,
            [TYPES.KEY_RESULT.ATTR.CYCLE]: cycle,
            [TYPES.KEY_RESULT.ATTR.ORGANIZATIONAL_UNIT]: organizationalUnit,
            [TYPES.KEY_RESULT.ATTR.LAST_UPDATE]: lastUpdate
        }
    }, {
        setGeneratedName: true
    });
}
