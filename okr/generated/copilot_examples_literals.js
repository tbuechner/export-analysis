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
    const spaceId = page.getSpaceId();
    const uid = page.getRealId();
}

function searchForPages() {
    let search = new Search();
    search.add(Filters.space(spaceId));
    search.add(Filters.embeddingSpace());
    search.add(Filters.type('type.name'));
    search.add(Filters.customAttributeNonempty('attributeName'));
    search.add(Filters.uid(uid));

    // greater or equals
    search.add(Filters.customAttribute('attributeName').gte(value));
    
    // greater than
    search.add(Filters.customAttribute('attributeName').gt(value));
    
    // less or equals
    search.add(Filters.customAttribute('attributeName').lte(value));
    
    // less than
    search.add(Filters.customAttribute('attributeName').lt(value));
    
    // equals
    search.add(Filters.customAttribute('attributeName').eq(value));
    
    let result = search.findAllPages();
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

function readFromCycle(cycle) {
    const year = cycle.get('cf.cplace.solution.okr.year');
    const quarter = cycle.get('cf.cplace.solution.okr.quarter');
    const status = cycle.get('cf.cplace.solution.okr.status');
    const cyclesDashboard = cycle.get('cf.cplace.solution.okr.cyclesDashboard');
    const start = cycle.get('cf.cplace.solution.okr.start');
    const end = cycle.get('cf.cplace.solution.okr.end');
    const statusForNameGenerationPattern = cycle.get('cf.cplace.solution.okr.statusForNameGenerationPattern');
    const objective = cycle.getIncomingPages('cf.cplace.solution.okr.objective', 'cf.cplace.solution.okr.cycle');
    const keyResult = cycle.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.cycle');
    const progress = cycle.getIncomingPages('cf.cplace.solution.okr.progress', 'cf.cplace.solution.okr.cycle');
    const selectNextCycle = cycle.getIncomingPages('cf.cplace.solution.okr.selectNextCycle', 'cf.cplace.solution.okr.nextCycle');
}


function readFromObjective(objective) {
    const number = objective.get('cf.cplace.solution.okr.number');
    const title = objective.get('cf.cplace.solution.okr.title');
    const set = objective.get('cf.cplace.solution.okr.set');
    const accomplished = objective.get('cf.cplace.solution.okr.accomplished');
    const cycle = objective.get('cf.cplace.solution.okr.cycle');
    const description = objective.get('cf.cplace.solution.okr.description');
    const keyResult = objective.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.objective');
    const progress = objective.getIncomingPages('cf.cplace.solution.okr.progress', 'cf.cplace.solution.okr.objective');
}


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
    const keyResult = keyResult.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.giveBigSupport');
    const keyResult = keyResult.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.receiveBigSupport');
    const progress = keyResult.getIncomingPages('cf.cplace.solution.okr.progress', 'cf.cplace.solution.okr.keyResult');
    const task = keyResult.getIncomingPages('cf.cplace.solution.okr.task', 'cf.cplace.solution.okr.keyResult');
}


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
    const keyResult = progress.getIncomingPages('cf.cplace.solution.okr.keyResult', 'cf.cplace.solution.okr.progress');
}


function readFromTask(task) {
    const title = task.get('cf.cplace.digitalBoard.title');
    const responsible = task.get('cf.cplace.digitalBoard.responsible');
    const description = task.get('cf.cplace.digitalBoard.description');
    const status = task.get('cf.cplace.digitalBoard.status');
    const dueDate = task.get('cf.cplace.digitalBoard.dueDate');
    const keyResult = task.get('cf.cplace.solution.okr.keyResult');
    const escalationLevel = task.get('cf.cplace.digitalBoard.escalationLevel');
}


function readFromSelectNextCycle(selectNextCycle) {
    const nextCycle = selectNextCycle.get('cf.cplace.solution.okr.nextCycle');
}


