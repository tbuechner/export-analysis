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
    
    // not equals
    search.add(Filters.not(Filters.customAttribute('attributeName').eq(value)));

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

function readFromObjective(objective) {
    const number = objective.get('cf.cplace.solution.okr.number');
    const title = objective.get('cf.cplace.solution.okr.title');
    const set = objective.get('cf.cplace.solution.okr.set');
    const accomplished = objective.get('cf.cplace.solution.okr.accomplished');
    const cycle = objective.get('cf.cplace.solution.okr.cycle');
    const description = objective.get('cf.cplace.solution.okr.description');
}


