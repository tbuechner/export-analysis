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


//------------------------------------------------------------------------------------------------------

