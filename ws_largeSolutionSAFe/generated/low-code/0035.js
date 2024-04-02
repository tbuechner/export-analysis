/**
 * Displays all items grouped by Program (ART/Agile Release Train) and iteration.
 * Items can be of type Capability (Feature is a missing feature).
 * Dependencies between items are displayed as a line.
 *
 * Milestones that lie within the period of the iterations are displayed in a separate row.
 *
 * @author Daniel Fader
 * @version 15.03.2023
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName('highcharts-dependency-map-capability');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const TYPE_CAPABILITY = {
    TYPE: 'cf.cplace.solution.safe.capability',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        TYPE: 'cf.cplace.solution.safe.capabilityType',
        FEATURES: 'cf.cplace.solution.safe.feature',
        PROGRAM: 'cf.cplace.solution.safe.program',
        SOLUTION: 'cf.cplace.solution.safe.solution.reference',
        PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
        TEMP_ITERATIONS: 'cf.cplace.solution.safe.iteration'
    },
    ENUM: {
        TYPE: {
            CAPABILITY: 'capability',
            ENABLER: 'enabler'
        }
    }
};

const TYPE_FEATURE = {
    TYPE: 'cf.cplace.solution.safe.feature',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        ITERATIONS: 'cf.cplace.solution.safe.iterations',
        PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
        CAPABILITY: 'cf.cplace.solution.safe.capability',
        PROGRAM: 'cf.cplace.solution.safe.program'
    }
};

const TYPE_MILESTONE = {
    TYPE: 'cf.cplace.solution.safe.safeMilestone',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        DATE: 'cf.cplace.solution.safe.date',
        TYPE: 'cf.cplace.solution.safe.type',
        RELEVANT_FOR: 'cf.cplace.solution.safe.relevantFor' // refers to Program
    },
    ENUM: {
        TYPE: {
            PI_MILESTONE: '#15 - PI Meilenstein',
            FIXED_DATE: '#25 - Fixiertes Datum',
            LEARNING_MILESTONE: '#35 - Learning Meilenstein'
        }
    }
};

const TYPE_DEPENDENCY = {
    TYPE: 'cf.cplace.solution.safe.dependency',
    ATTR: {
        A: 'cf.cplace.solution.safe.successor',
        B: 'cf.cplace.solution.safe.predecessor',
        TYPE: 'cf.cplace.solution.safe.type',
        STATUS: 'cf.cplace.solution.safe.status',
        DESCRIPTION: 'cf.cplace.solution.safe.description'
    },
    ENUM: {
        TYPE: {
            RELATED_TO: 'related to',
            BLOCKED_BY: 'blocked by'
        },
        STATUS: {
            IDENTIFIED: '15 - identified',
            CONFLICT: '25 - conflict',
            RESOLVED: '35 - resolved'
        }
    }
};

const TYPE_PROGRAM_INCREMENT = {
    TYPE: 'cf.cplace.solution.safe.programIncrement',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        START: 'cf.cplace.solution.safe.startDate',
        END: 'cf.cplace.solution.safe.endDate',
        PREDECESSOR: 'cf.cplace.solution.safe.predecessor' // Program Increment
    }
};

const TYPE_ITERATION = {
    TYPE: 'cf.cplace.solution.safe.iteration',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
        START: 'cf.cplace.solution.safe.startDate',
        END: 'cf.cplace.solution.safe.endDate',
        PREDECESSOR: 'cf.cplace.solution.safe.predecessor' // Iteration
    }
};

const COLORS = {
    INACTIVE: '#88bbee',
    ACTIVE: '#4488aa',
    DEPEND: '#888888',
    DEPEND_HIGHLIGHT: '#A21622',
    DEPEND_RESOLVED: '#19ad48',
    SAFE_MILESTONE: '#3D8F8C',
    RELEASE: '#366C81',
    MILESTONE_PLOTBAND: '#E2F3F2',
    RELEASE_PLOTBAND: '#E2EEF3',
    CAPABILITY: '#0aa5ff',
    ENABLER: '#ffc80c',
    TODAY_PLOTLINE: 'lightgrey'
};

const CATEGORY = {
    SAFE_MILESTONE: 'SAFe Milestones'
};

const ROW_SIZE = {
    PERIOD: 2,
    ITEM: 1
};

const HEIGHTS = {
    HEADER: 40,
    ITEM: 25
};

const MAX_DATA_LABEL_LENGTH = 25;
const DATA_LABEL_PADDING = 0.05;

const SEPARATOR = {
    V: ' //VSEP// ',
    H: ' --HSEP-- '
};

const EMPTY_DIAGRAM = {
    title: {
        text: 'No data to display'
    }
};

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
/*
*****************
This highchart is based on a heatmap, i.e. the chart is divided into a set of X * Y equally sized cells.
* The first column(s) of the cells are used to show the vertical categories (categoriesVertical), which are provided as separate "category" series
* The first row(s) of the cells are used to show the horizontal categories (categoriesHorizontal), which are provided as separate "category" series
* The rest of the cells represent the data itself
    * each cell can be identified by its set of vertical and horizontal categories saved as 'key' in the 'keys'-array in the form of a string like "X Cat Level 1 - X Cat Level 2 / Y Cat Level 1 - Y Cat Level 2 - Y Cat Level 3" (in theory the levels can be "dynamic", which is not used in this specific example. In this example only 1 level is used)
    * for each cell the number of entities to be shown is counted as 'value' in the 'values'-array.
    * the entities for each cell are represented as boxes/cards within the cell and are pushed as separate serie to the main data series
    * dependencies between entities are represented as separate spline series, whereas start and end point of the splines are the left or right edge of the corresponding entity boxes/cards on the map

/***** config options *****/

// 1) category colors horizontal (for each level)
let catColorsH = ['#000000', '#dddddd', '#dddddd', '#cccccc', '#cccccc'];

// 2) category colors vertical (for each level)
let catColorsV = ['#000000', '#dddddd', '#dddddd', '#cccccc', '#cccccc'];
let catColors = ['#dddddd', '#dddddd', '#dddddd', '#dddddd'];

// 3) sort category names on this order
const sortOrders = [CATEGORY.SAFE_MILESTONE];

const maxCols = 1;
const maxRows = 1;


/***** build up our category structures *****/
let categoriesHorizontal = { names: [], subs: [], startDates: [], endDates: [], colors: [], links: [] };
let categoriesVertical = { names: [], subs: [], startDates: [], endDates: [], colors: [], links: [] };
let keys = [];
let values = [];
let tooltips = [];
let shortNameMap = new Map();
let nameMap = new Map();
let titleMap = new Map();
let colorMap = new Map();
let depends = [];
let itemValues = [];
let itemCats = [];

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

// If embedding page is Capability then itself is the item. Otherwise, use pages from connected table
const items = isPageOfTypeCapability(embeddingPage) ? [embeddingPage] : Array.from(pages);
log('items :'+items)
log('Items in pages: ' + items.length);
if (items.length === 0) {
    // noinspection JSAnnotator
    return EMPTY_DIAGRAM;
}

const missingDependencies = getMissingDependencies(items);
items.push(...missingDependencies);
log(`Added ${missingDependencies.length} missing items that the input items depend on.`);

const allPeriods = getAllPeriods(items);
log('allPeriods'+allPeriods)
if (allPeriods.length === 0) {
    // noinspection JSAnnotator
    return EMPTY_DIAGRAM;
}
// const allPeriodNames = allPeriods.map(period => period.getName());
const allPeriodIds = allPeriods.map(period => period.getId());
log('Periods: ' + allPeriods.length);

const allPrograms = getPrograms(items);
log('Programs: ' + allPrograms.length);


// Find release planning dashboard, needed for link in the release swimlane
// const releasePlanningDashboard = Iterables.getFirst(solution.getIncomingPages(RELEASE_DASHBOARD.TYPE, RELEASE_DASHBOARD.ATTR.PROGRAM), null);
// const releasesLink = releasePlanningDashboard.getUrl();
const releasesLink = 'wip';
// Find PI Planning dashboard, needed for link in the safe milestone swimlane
// const piManagementDashboard = Iterables.getFirst(solution.getIncomingPages(PI_PLANNING_DASHBOARD.TYPE, PI_PLANNING_DASHBOARD.ATTR.PROGRAM), null);
// const piManagementLink = piManagementDashboard.getUrl();
const piManagementLink = 'wip';
// Find solution train, needed for finding all programs
// const solutionTrain = Iterables.getFirst(solution.getIncomingPages(TYPE_CAPABILITY.TYPE, TYPE_CAPABILITY.ATTR.SOLUTION), null);

//find relevant Pis of the program
// const piSearch = new Search();
// piSearch.add(Filters.embeddingSpace());
// piSearch.add(Filters.type(PI.TYPE));
// piSearch.add(Filters.customAttribute(PI.ATTR.PROGRAM).references(solution));
// let allPeriods = [];
// cplace.each(pis, pi => {
//     const periodStatus = pi.get(PI.ATTR.PERIOD_STATUS);
//     if (periodStatus && periodStatus.get(PERIOD_STATUS.ATTR.ORDER) != null && periodStatus.get(PERIOD_STATUS.ATTR.ORDER) > -1) {
//         relevantPiIds.push(pi.getId());
//         allPeriods.push(pi);
//     }
// })

// Create categories based on items
cplace.each(items, item => {
    let itemName = item.getName();
    let itemTitle = item.get(TYPE_CAPABILITY.ATTR.TITLE);

    // Determine dependencies
    const itemDependencies = Array.from(item.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []);
    log('dependencies'+itemDependencies)
    const lastItemIteration = getLastIteration(item);
    const itemIterations = [];
    if (lastItemIteration !== null) {
        //only continue with feature, if it is in a relevant PI
        const iterationId = lastItemIteration.getId();
        if (allPeriodIds.includes(iterationId)) {
            itemIterations.push(lastItemIteration);
        } else {
            return;
        }
    }

    let itemPrograms = item.get(TYPE_CAPABILITY.ATTR.PROGRAM);

    cplace.each(itemIterations, iteration => {
        const iterationName = iteration.getName();
        const iterationUrl = iteration.getUrl();

        // a) format/drilldown of horizontal (xAxis) categories
        let catX = [
            (iterationName == null ? ' ' : iterationName)
        ];
        // b) format/drilldown of vertical (yAxis) categories
        let catYs = [];

        cplace.each(itemPrograms, program => {
            catYs.push({
                name: [program.getName()],
                link: program.getUrl()
            })
        })

        if (catYs.length === 0) {
            catYs.push({
                name: ['w/o Program'],
                link: null
            });
        }

        // c) common keys across both axes (= name of cell within the chart)
        const categories = [];
        catYs.forEach(catY => {
            const cat = [catX.join(SEPARATOR.H), catY.name.join(SEPARATOR.H)].join(SEPARATOR.V);
            categories.push(cat)
        });

        // now add them to internal category model
        categoriesHorizontal = addCategories(categoriesHorizontal, catX, 1, iteration, null, null, (iterationUrl == null ? ' ' : iterationUrl));
        cplace.each(catYs, catY => {
            categoriesVertical = addCategories(categoriesVertical, catY.name, 1, null, null, null, (catY.link == null ? ' ' : catY.link));
        });

        cplace.each(categories, cat => {
            let idx = keys.indexOf(cat);
            if (idx < 0) {
                // key (category) not found -> add a new value
                keys.push(cat);
                values.push(1);
                tooltips.push([itemName]);
                // add feature name to name Map
                nameMap.set(cat + 1, '<a href="' + item.getUrl() + '">' + itemName + '</a>');
                shortNameMap.set(cat + 1, '<a href="' + item.getUrl() + '">' + item.getName().replace(itemTitle, '') + '</a>');
                titleMap.set(cat + 1, itemTitle);
                colorMap.set(cat + 1, (item.get(TYPE_CAPABILITY.ATTR.TYPE) === TYPE_CAPABILITY.ENUM.TYPE.CAPABILITY ? COLORS.CAPABILITY : COLORS.ENABLER));
                //cplace.log ('1st entry nameMap: ' + nameMap.get(cat+1));
                idx = keys.length - 1;
            } else {
                // found -> just update value
                values[idx] = (values[idx] + 1);
                tooltips[idx].push(itemName);
                nameMap.set(cat + values[idx], '<a href="' + item.getUrl() + '">' + itemName + '</a>');
                shortNameMap.set(cat + values[idx], '<a href="' + item.getUrl() + '">' + item.getName().replace(itemTitle, '') + '</a>');
                titleMap.set(cat + values[idx], itemTitle);
                colorMap.set(cat + values[idx], (item.get(TYPE_CAPABILITY.ATTR.TYPE) === TYPE_CAPABILITY.ENUM.TYPE.CAPABILITY ? COLORS.CAPABILITY : COLORS.ENABLER));
                //cplace.log ('additional entry nameMap: ' + nameMap.get(cat+values[idx]));
            }

            // add dependencies
            const itemId = item.getId();
            if (itemCats[itemId] != null) {
                itemCats[itemId].push(cat);
                itemValues[itemId].push(values[idx]);
            } else {
                itemCats[itemId] = [cat];
                itemValues[itemId] = [values[idx]];
            }
            itemDependencies.forEach(itemDependency => {
                const from = itemDependency.get(TYPE_DEPENDENCY.ATTR.B);
                if (from && isPageOfTypeCapability(from)) {
                    depends.push({ to: item, from: from, dependency: itemDependency });
                }
            });
        });
    });
});

// Manually add categories for missing ARTs and iterations (if no capability is in there, they were not added so far)
cplace.each(allPeriods, period => {
    let name = period.getName();
    let url = period.getUrl();
    let catX = [
        (name == null ? ' ' : name)
    ];
    categoriesHorizontal = addCategories(categoriesHorizontal, catX, 1, period, null, null, (url == null ? ' ' : url));
});
cplace.each(allPrograms, program => {
    let name = program.getName();
    let url = program.getUrl();
    let catY = [
        (name == null ? ' ' : name)
    ];
    categoriesVertical = addCategories(categoriesVertical, catY, 1, null, null, null, (url == null ? ' ' : url));
})

// Add categories as swimlanes for the releases and SAFe milestones
// categoriesVertical = addCategories(categoriesVertical, ['Releases'], 1, null, COLORS.RELEASE_PLOTBAND, 0, releasesLink);
categoriesVertical = addCategories(categoriesVertical, [CATEGORY.SAFE_MILESTONE], 1, null, COLORS.MILESTONE_PLOTBAND, 0, piManagementLink);

log('result H: ' + JSON.stringify(categoriesHorizontal));
log('result V: ' + JSON.stringify(categoriesVertical));
log('keys: ' + JSON.stringify(keys));
log('values: ' + JSON.stringify(values));
log('depends: ' + JSON.stringify(depends));
log('itemCats: ' + JSON.stringify(itemCats));

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//
/**
 * Determines the periods used as columns of the board
 * @param {Page[]} items Capabilities
 * @returns {Page[]} Iterations in chronological order
 */
function getAllPeriods(items) {
    const periodsSet = new HashSet();
    items.forEach(item => {
        const pi = item.get(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT);
        if (!pi) {
            return;
        }
        const iterations = pi.getIncomingPagesFromAllSpaces(TYPE_ITERATION.TYPE, TYPE_ITERATION.ATTR.PROGRAM_INCREMENT);
        cplace.each(iterations, iteration => {
            periodsSet.add(iteration);
        });
    });
    const periods = Array.from(periodsSet);
    return periods.sort((a, b) => a.get(TYPE_ITERATION.ATTR.START).isBefore(b.get(TYPE_ITERATION.ATTR.START)) ? -1 : 1);
}

/**
 * Determines all programs/ARTs that are included in the input data.
 * These elements are used to define the rows of the boards
 * @param {Page[]} items
 * @returns {Page[]} Programs
 */
function getPrograms(items) {
    const programSet = new HashSet();
    items.forEach(item => {
        const programs = item.get(TYPE_CAPABILITY.ATTR.PROGRAM);
        if (!programs) {
            return;
        }
        cplace.each(programs, program => programSet.add(program));
    });
    return Array.from(programSet);
}

/**
 * Searches dependencies of the items and returns those that are not yet included
 * @param {Page[]} items
 * @return {Page[]}
 */
function getMissingDependencies(items) {
    const dependencies = new HashSet();
    items.forEach(item => {
        const itemDependencies = Array.from(item.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []);
        itemDependencies.forEach(itemDependency => {
            const dependency = itemDependency.get(TYPE_DEPENDENCY.ATTR.B);
            if (isPageOfTypeCapability(dependency)) {
                dependencies.add(dependency);
            }
        });
    });
    return Array.from(dependencies).filter(a => !items.some(b => b.getId() === a.getId()));
}

/**
 * Determines the last iteration
 * @param {Page} item Category
 */
function getLastIteration(item) {
    const iterations = Array.from(item.get(TYPE_CAPABILITY.ATTR.TEMP_ITERATIONS));
    // log(`Found ${iterations.length} iterations for item "${item.getName()}"`);
    // TODO Use references of features to iterations once the data (model) is cleared
    // const features = item.get(TYPE_CAPABILITY.ATTR.FEATURES);
    // const iterationsSet = new HashSet();
    // cplace.each(features, feature => {
    //     const featureIterations = feature.get(TYPE_FEATURE.ATTR.ITERATIONS);
    //     cplace.each(featureIterations, iteration => {
    //         iterationsSet.add(iteration);
    //     });
    // });
    //const iterations = Array.from(iterationsSet);
    //log(`Found ${Iterables.size(features)} features and ${iterations.length} iterations for item "${item.getName()}"`);
    let lastIteration = iterations.length > 0 ? iterations[0] : null;
    iterations.forEach(iteration => {
        if (lastIteration.get(TYPE_ITERATION.ATTR.END).isBefore(iteration.get(TYPE_ITERATION.ATTR.END))) {
            lastIteration = iteration;
        }
    });
    log(`Found ${iterations.length} iterations for item "${item.getName()}"`);
    if (lastIteration) {
        log(`Last iteration "${lastIteration.getName()}" ending ${lastIteration.get(TYPE_ITERATION.ATTR.END).toString()}`);
    }
    return lastIteration;
}

// helper function - insert new category into data structure (recursively)
function addCategories(categories, names, level, iteration, color, order, link) {
    // pop first name from stack and search
    const categoryName = names.shift();
    const idx = categories.names.indexOf(categoryName);
    if (idx < 0) {
        // not found yet -> insert new category name
        let inserted = false;
        const newOrder = sortOrders.indexOf(categoryName);
        // now loop all current names and insert at right position (ordered!)
        if (order != null) {
            categories.names.forEach(cat => {
                let currOrder = sortOrders.indexOf(cat);
                if ((!inserted && newOrder >= 0 && currOrder >= 0 && newOrder < currOrder)
                    || (!inserted && newOrder >= 0 && currOrder < 0) // if order of new category is specified and others are not
                    || (!inserted && categoryName !== '' && categoryName < cat)) {
                    categories.names.splice(order, 0, categoryName);

                    // If there is an iteration, add StartDate and Enddate at catIdx Position
                    categories.startDates.splice(order, 0, (iteration ? iteration.get(TYPE_ITERATION.ATTR.START) : null));
                    categories.endDates.splice(order, 0, (iteration ? iteration.get(TYPE_ITERATION.ATTR.END) : null));

                    // If there is a color, add it at catIdx Position
                    categories.colors.splice(order, 0, (color ? color : null));

                    // Add link for the category
                    categories.links.splice(order, 0, (link ? link : null));

                    if (names.length > 0) {
                        // If there is more to check, go one level deeper
                        categories.subs.splice(order, 0, addCategories({
                            names: [],
                            subs: [],
                            startDates: [],
                            endDates: [],
                            colors: [],
                            links: []
                        }, names, level + 1, iteration, color, link));
                    }
                    inserted = true;
                }
            });
        } else {
            categories.names.forEach((cat, catIdx) => {
                let currOrder = sortOrders.indexOf(cat);
                if ((!inserted && newOrder >= 0 && currOrder >= 0 && newOrder < currOrder)
                    || (!inserted && categoryName !== '' && categoryName < cat)) {
                    categories.names.splice(catIdx, 0, categoryName);

                    // if there is an iteration, add StartDate and Enddate at catIdx Position
                    categories.startDates.splice(catIdx, 0, (iteration ? iteration.get(TYPE_ITERATION.ATTR.START) : null));
                    categories.endDates.splice(catIdx, 0, (iteration ? iteration.get(TYPE_ITERATION.ATTR.END) : null));

                    // if there is a color, add it at catIdx Position
                    categories.colors.splice(catIdx, 0, (color ? color : null));

                    // add link for the category
                    categories.links.splice(catIdx, 0, (link ? link : null));

                    if (names.length > 0) {
                        // if there is more to check, go one level deeper
                        categories.subs.splice(catIdx, 0, addCategories({
                            names: [],
                            subs: [],
                            startDates: [],
                            endDates: [],
                            colors: [],
                            links: []
                        }, names, level + 1, iteration, color, link));
                    }
                    inserted = true;
                }
            });
        }
        // nothing found -> add as last element in array
        if (!inserted) {
            log('Category not inserted');
            categories.names.push(categoryName);

            // there is an iteration, push new StartDate and Enddate
            categories.startDates.push((iteration ? iteration.get(TYPE_ITERATION.ATTR.START) : null));
            categories.endDates.push((iteration ? iteration.get(TYPE_ITERATION.ATTR.END) : null));

            // if there is a color, add it at catIdx Position
            categories.colors.push((color ? color : null));

            // add link for the category
            categories.links.push((link ? link : null));

            if (names.length > 0) {
                // if there is more to check, go one level deeper
                categories.subs.push(addCategories({
                    names: [],
                    subs: [],
                    startDates: [],
                    endDates: [],
                    colors: [],
                    links: []
                }, names, level + 1, iteration, color, link));
            }
        }
    } else {
        // found -> just go one level deeper
        if (names.length > 0) {
            // if there is more to check, go one level deeper
            categories.subs[idx] = addCategories(categories.subs[idx], names, level + 1, iteration, color);
        }
    }
    return categories;
}

// now build up highcharts data series
const series = [];

// helper function - count (sub-) categories to derive x- and y-offsets (recursively)
function countCategories(categories, xOffset, yOffset, level, maxLevel, dir) {
    let cnt = 0;
    // starting coordinate (depending on direction, vertical/horizontal)
    if (dir === 'H') {
        categories.start = xOffset;
    } else {
        categories.start = yOffset;
    }

    // loop all category names
    categories.names.forEach((name, idx) => {
        let subCnt = 1;
        // go one level deeper, if there is more, and add up sub-categories
        if (categories.subs && idx < categories.subs.length) {
            categories.subs[idx] = countCategories(categories.subs[idx], xOffset, yOffset, level + 1, maxLevel, dir);
            subCnt = categories.subs[idx].cnt;
        }

        // calc coordinates
        let colSize = 1;//(level == maxLevel ? maxCols : 1);		// last level will be size 2x1
        let rowSize = 1;//(level == maxLevel ? maxRows : 1);		// last level will be size 1x2
        let rotation = 0;
        let x = xOffset;
        let y = yOffset;
        let color = categories.colors[idx] !== null ? categories.colors[idx] : catColors[level]; //'#ffffff';		// coloring by level
        let fontColor = '#000000';
        if (dir === 'H') {
            // horizontal categories
            colSize = subCnt;								// span multiple columns
            rotation = 0;                                 // no rotation (level == maxLevel ? -90 : 0);		// rotate only on max level
            x += (subCnt - 1) / 2;
            y += level + (level === maxLevel ? (maxRows - 1) / 2.0 : 0);
            //color = catColorsH[1+xOffset%2];				// alternating colors from config object (1 or 2)
            //fontColor = catColorsH[0];					// first color from config object
        } else {
            // vertical categories
            rowSize = subCnt;								// span multiple rows
            rotation = (level === maxLevel ? 0 : -90);		// rotate all but max level
            x += level + (level === maxLevel ? (maxCols - 1) / 2.0 : 0);
            y += (subCnt - 1) / 2;
            //color = catColorsV[1+yOffset%2];				// alternating colors from config object (1 or 2)
            //fontColor = catColorsV[0];					// first color from config object
        }

        // Find link to the page the category should lead to
        let link = categories.links[idx];

        if (name != null && name.length > 1) {
            // now add categories cell to series
            series.push({
                name: name,
                colsize: colSize,
                rowsize: rowSize,
                dataLabels: { rotation: rotation, color: fontColor },
                enableMouseTracking: false,
                data: [{ x: x, y: y, value: level, name: '<a href="' + link + '">' + name + '</a>', color: color }]
            });
        }

        // update coordinates
        if (dir === 'H') {
            xOffset += subCnt;
        } else {
            yOffset += subCnt;
        }
        cnt += subCnt;
    });
    categories.cnt = cnt;
    categories.end = categories.start + cnt;
    return categories;
}


// helper function - maximum depth of categories
function findMaxLevel(categories, level) {
    let maxLevel = level;
    if (categories.subs) {
        categories.subs.forEach(sub => {
            maxLevel = findMaxLevel(sub, level + 1);
        });
    }
    return maxLevel;
}

// find maximum depth in both directions
let maxLevelV = findMaxLevel(categoriesVertical, 1);
let maxLevelH = findMaxLevel(categoriesHorizontal, 1);

// count and build series objects for categories
categoriesVertical = countCategories(categoriesVertical, 0, maxLevelH + maxRows, 1, maxLevelV, 'V');
//let maxOffsetV = categoriesVertical.cnt;
categoriesHorizontal = countCategories(categoriesHorizontal, maxLevelV + maxCols, 0, 1, maxLevelH, 'H');
//let maxOffsetH = categoriesHorizontal.cnt;

log('result H: ' + JSON.stringify(categoriesHorizontal));
log('result V: ' + JSON.stringify(categoriesVertical));


const maxValue = Math.max(...values);

// finally add cells for each value of the matrix
// loop all keys (= joined category for both axes)
keys.forEach((key, idx) => {
    // split key into categories and names
    const cat = key.split(SEPARATOR.V);
    const catX = cat[0].split(SEPARATOR.H);
    const catY = cat[1].split(SEPARATOR.H);
    const x = findCategory(categoriesHorizontal, catX);
    const y = findCategory(categoriesVertical, catY);

    let val = values[idx];

    // special build up name of cell for tooltip
    let name = '<b>' + key + '</b><br>';

    const data = [];
    let offset = -0.4 + 0.4 / maxValue;
    for (let n = 0; n < val; n++) {
        let mapKey = n + 1;
        data.push({
            x: x,
            y: y + offset,
            value: n,
            name: nameMap.get(key + mapKey),
            shortName: shortNameMap.get(key + mapKey),
            color: colorMap.get(key + mapKey),
            title: titleMap.get(key + mapKey)
        });
        offset += 0.8 / maxValue;
    }

    // add series for new data value (= single cell in matrix) ///TO DO: linking with same capability in other program swimlane
    series.push({
        name: tooltips[idx].join('<br>'),
        colsize: 0.8,
        rowsize: 0.7 / maxValue, //1,
        pointPadding: 0,
        borderRadius: 0, //25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        dataLabels: {
            enabled: true,
            color: '#000000',
            format: '{point.shortName}'
        },
        enableMouseTracking: true,
        data: data //[{ x: x, y: y, value: val, name: val, color: color }]
    });
});


// helper function - evaluate coordinates of given key (= category along both axes)
function findCategory(categories, names) {
    const categoryName = names.shift();
    const idx = categories.names.indexOf(categoryName);
    if (names.length > 0 && idx >= 0 && categories.subs && categories.subs.length > 0) {
        return findCategory(categories.subs[idx], names);
    }
    return categories.start + idx;
}

// Iterate through all dependencies in order to draw them
depends.forEach(depend => {
    const fromId = depend.from.getId();
    const toId = depend.to.getId();
    // split key into categories and names
    const fromCats = itemCats[fromId];
    if (!fromCats) {
        return;
    }
    fromCats.forEach((fromCat, idx1) => {
        const cat1 = fromCat.split(SEPARATOR.V);
        const catX1 = [cat1[0]];//.split(" - ");
        //catX1.push(cat1[0]);
        const catY1 = [cat1[1]];//.split(" - ");
        //catY1.push(cat1[1]);
        const x1 = findCategory(categoriesHorizontal, catX1);
        let y1 = findCategory(categoriesVertical, catY1);
        y1 += -0.4 + 0.4 / maxValue + (itemValues[depend.from.getId()][idx1] - 1) * 0.8 / maxValue;

        const toCats = itemCats[toId];
        if (!toCats) {
            // Dependency is not included in diagram scope and cannot be drawn
            return;
        }
        toCats.forEach((toCat, idx2) => {
            const cat2 = toCat.split(SEPARATOR.V);
            const catX2 = [cat2[0]];
            const catY2 = [cat2[1]];
            const x2 = findCategory(categoriesHorizontal, catX2);
            let y2 = findCategory(categoriesVertical, catY2);
            y2 += -0.4 + 0.4 / maxValue + (itemValues[depend.to.getId()][idx2] - 1) * 0.8 / maxValue;
            const description = depend.dependency.get(TYPE_DEPENDENCY.ATTR.DESCRIPTION) || ' ';
            const dependencyType = depend.dependency.get(TYPE_DEPENDENCY.ATTR.TYPE);
            const status = depend.dependency.get(TYPE_DEPENDENCY.ATTR.STATUS);

            const dependencySeries = {
                type: 'spline',
                name: '<b>' + depend.to.getName() + '</b><br/>relates to:<br/>' + depend.from.getName() + '<br>' + description,
                lineWidth: 1.5,
                color: COLORS.DEPEND,
                dashStyle: 'shortdot',
                findNearestPointBy: 'xy',
                data: [
                    { x: x1 + 0.4, y: y1 },
                    { x: x1 + 0.45, y: (y1 === y2 ? y1 + 0.02 : y1) },
                    { x: x2 - 0.45, y: (y1 === y2 ? y2 - 0.02 : y2) },
                    { x: x2 - 0.4, y: y2, marker: { enabled: true, symbol: 'diamond' } }
                ]
            };
            if (dependencyType === TYPE_DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
                dependencySeries.name = '<b>' + depend.to.getName() + '</b><br/>blocked by:<br/>' + depend.from.getName() + '<br>' + description;
                dependencySeries.dashStyle = null;
            }
            if (status === TYPE_DEPENDENCY.ENUM.STATUS.CONFLICT) {
                dependencySeries.color = COLORS.DEPEND_HIGHLIGHT;
            } else if (status === TYPE_DEPENDENCY.ENUM.STATUS.RESOLVED) {
                dependencySeries.color = COLORS.DEPEND_RESOLVED;
            }
            series.push(dependencySeries);
        });
    });
});


// Add releases
// let releaseDateSearch = new Search();
// releaseDateSearch.add(Filters.embeddingSpace());
// releaseDateSearch.add(Filters.type(TYPE_RELEASE.TYPE));
// releaseDateSearch.add(Filters.customAttribute(RELEASE.ATTR.PROGRAM).references(solution));
// let releases = releaseDateSearch.findAllPages();
//  let releaseData = [];
//
// cplace.each(releases, function (release) {
//     let releaseName = release.getName();
//     let releaseDate = release.get(RELEASE.ATTR.DATE);
//     let releaseDateString = releaseDate.toString('dd.MM.yyyy');
//     // get release Position
//     let releasePosition = getDatePosition(releaseDate.getMillis());
//     // add release only if releasePosition is not null
//     if (releasePosition > 0) {
//         releaseData.push({
//             x: releasePosition,
//             y: 2,
//             name: '<a href="' + release.getUrl() + '">' + releaseName + '</a>',
//             value: releaseDateString
//         });
//     }
// });
//
// series.push({
//     type: 'scatter',
//     lineWidth: 0,
//     findNearestPointBy: 'xy',
//     data: releaseData,
//     marker: {
//         fillColor: COLORS.RELEASE
//     }
// });

// Add SAFe milestones
const periodStartDate = allPeriods.length > 0 ? allPeriods[0].get(TYPE_ITERATION.ATTR.START) : new DateTime();
const periodEndDate = allPeriods.length > 0 ? allPeriods[allPeriods.length - 1].get(TYPE_ITERATION.ATTR.END) : new DateTime();
const safeMilestoneSearch = new Search();
safeMilestoneSearch.add(Filters.embeddingSpace());
safeMilestoneSearch.add(Filters.type(TYPE_MILESTONE.TYPE));
safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).gte(periodStartDate));
safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).lte(periodEndDate));
const safeMilestones = safeMilestoneSearch.findAllPages();
const safeMilestoneData = [];

log('Milestones: ' + safeMilestones.length);

cplace.each(safeMilestones, safeMilestone => {
    const safeMilestoneName = safeMilestone.getName();
    const safeMilestoneDate = safeMilestone.get(TYPE_MILESTONE.ATTR.DATE);
    const safeMilestoneDateString = safeMilestoneDate.toString('dd.MM.yyyy');
    // get milestone Position
    const safeMilestonePosition = getDatePosition(safeMilestoneDate.getMillis());
    // add milestone only if position is not null
    if (safeMilestonePosition > 0) {
        safeMilestoneData.push({
            x: safeMilestonePosition,
            y: 2,
            name: '<a href="' + safeMilestone.getUrl() + '">' + safeMilestoneName + '</a>',
            value: safeMilestoneDateString
        });
    }
});

series.push({
    type: 'scatter',
    lineWidth: 0,
    findNearestPointBy: 'xy',
    data: safeMilestoneData,
    marker: {
        fillColor: COLORS.SAFE_MILESTONE
    }
});

//define today line position
const today = new DateTime();
let todayPosition = getDatePosition(today.getMillis());


//helper function for finding milestone/today line position
function getDatePosition(date) {
    let xPosition = 0;
    categoriesHorizontal.names.every((categoryName, idx) => {
        let categoryStartDate = categoriesHorizontal.startDates[idx].getMillis();
        let categoryEndDate = categoriesHorizontal.endDates[idx].getMillis();
        // Check whether release date lies in between start and end date of category
        if (date >= categoryStartDate && date <= categoryEndDate) {
            // find x-Value of category and substract 0.5 for starting point as offset
            let x = findCategory(categoriesHorizontal, [categoryName]) - 0.5;
            // calculate the relative position of date between Category StartDate and EndDate and add it to the offset value
            xPosition = x + (date - categoryStartDate) / (categoryEndDate - categoryStartDate);
            // exit the every loop
            return false;
        }
        // continue the every loop
        return true;
    });
    // if there was no match, just return null
    return xPosition;
}


// Build the Highcharts configuration object
const chart = {
    chart: {
        type: 'heatmap',
        marginTop: 0,
        marginBottom: 0,
        plotBorderWidth: 0
    },
    title: {
        text: null
    },
    xAxis: {
        categories: [],
        title: null,
        gridLineWidth: 0,
        lineWidth: 0,
        labels: {
            enabled: false
        },
        //min: -1,
        //max: Math.max(categoriesVertical.end,categoriesHorizontal.end)-1
        plotLines: [{
            dashStyle: 'dash',
            color: COLORS.TODAY_PLOTLINE,
            width: 2,
            value: todayPosition,
            zIndex: 1
        }]
    },
    yAxis: {
        categories: [],
        title: null,
        gridLineWidth: 0,
        lineWidth: 0,
        labels: {
            enabled: false
        },
        reversed: true,
        // min: -1,
        // max: Math.max(categoriesVertical.end, categoriesHorizontal.end) - 1,
        plotBands: [
            {
                color: COLORS.MILESTONE_PLOTBAND,
                borderColor: 'white',
                borderWidth: 2,
                from: 1.5,
                to: 2.5,
                zIndex: 0
            }
            // {
            //     color: COLORS.RELEASE_PLOTBAND,
            //     borderColor: 'white',
            //     borderWidth: 2,
            //     from: 1.5,
            //     to: 2.5,
            //     zIndex: 0
            // }
        ]
    },
    colors: ['#D5001C', '#92D050'],
    colorAxis: {
        dataClassColor: 'category',
        dataClasses: [{
            to: 0.5
        }, {
            from: 0.5
        }]
    },
    legend: {
        enabled: false
    },
    tooltip: {
        useHTML: true,
        followPointer: false
    },
    plotOptions: {
        series: {
            borderColor: '#ffffff',
            borderWidth: 2,
            dataLabels: {
                allowOverlap: false,
                inside: true,
                crop: true,
                overflow: 'justify',
                position: 'left',
                shape: 'circle',
                enabled: true,
                color: '#000000',
                format: '{point.name}',
                style: {
                    textOutline: 'none',
                    textOverflow: 'clip'
                }
            },
            stickyTracking: false,
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b>',
                findNearestPointBy: 'xy',
            },
            states: {
                inactive: {
                    opacity: 1
                }
            }
        },
        spline: {
            tooltip: {
                headerFormat: '{series.name}',
                pointFormat: '',
                findNearestPointBy: 'xy',
            },
            marker: {
                enabled: false,
                fillColor: COLORS.DEPEND,
                radius: 6,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        scatter: {
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>{point.value}',
                findNearestPointBy: 'xy'
            },
            dataLabels: {
                enabled: true
            },
            marker: {
                enabled: true,
                symbol: 'diamond',
                radius: 10,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: series
};

// noinspection JSAnnotator
return chart;

//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//

function isPageOfTypeCapability(page) {
    return page.getBuiltinFeatureValue('customType') === TYPE_CAPABILITY.TYPE;
}

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    const logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;
    cplace.log(logOutput);
}