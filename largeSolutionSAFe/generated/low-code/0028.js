/**
 * Displays all work items of the backlog as Pie grouped by the classification of their type
 *
 * @author Daniel Fader
 * @version 12.07.2023
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName('highchart_capacity-allocation');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//
const COLORS = {
    TYPE_CLASSIFICATION: {
        CAPABILITIY: '#61a89d',
        ENABLER: '#ffb600'
    }
};

const NAMES = {
    TYPE_CLASSIFICATION: {
        CAPABILITY: 'Capability',
        ENABLER: 'Enabler'
    }
};

const CAPABILITIY = /** @type {const} */ ({
    TYPE: 'cf.cplace.solution.safe.capability',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        TYPE: 'cf.cplace.solution.safe.capabilityType', // TYPE_WORK_ITEM_TYPE
        STATE: 'cf.cplace.solution.safe.state' // ENUM
    },
    ENUMS: {
        STATUS: {
            DRAFT: "#10 - Draft",
            FUNNEL: "#15 - Funnel",
            DEFINING: "#25 - Analyzing",
            REDAY: "#35 - Backlog",
            IMPLEMENTING: "#45 - Implementing",
            READYFORTESTING: "#55 - Validating",
            INTEGRATING: "#65 - Deploying",
            READY: "#75 - Releasing",
            DONE: "#85 - Done",
            OBSOLETE: "#95 - Obsolete",
        },
        TYPE: {
            ENABLER: 'enabler',
            CAPABILITY: 'capability',
        }
    }
});



//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
const items = Array.from(pages);

//--------------------------------------------------------------------------------------//
//                                       PROCESSING STAGE                               //
//--------------------------------------------------------------------------------------//
const series = createPieSeries(items);

const chart = {
    chart: {
        type: 'pie'
    },
    title: {
        text: null,
    },
    legend: {
        enabled: false,
    },
    tooltip: {
        useHTML: true,
        followPointer: false,
    },
    plotOptions: {
        series: {
            borderColor: '#ffffff',
            borderWidth: 2,
            stickyTracking: false,
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>{point.y} ({point.custom.percent:.0f} %)',
                findNearestPointBy: 'xy'
            }
        }
    },
    series: [series]
};

// noinspection JSAnnotator
return chart;

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//
/**
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} items
 * @return {Object}
 */
function createPieSeries(items) {
    const classifications = Object.keys(CAPABILITIY.ENUMS.TYPE);
    const data = classifications.map(classification => {
        const itemsWithClassification = items.filter(item => {
            const itemType = item.get(CAPABILITIY.ATTR.TYPE);
            return itemType && itemType === CAPABILITIY.ENUMS.TYPE[classification];
        });
        const percent = Math.min(100, (itemsWithClassification.length === 0 || items.length === 0) ? 0 : (itemsWithClassification.length / items.length * 100));
        return {
            name: NAMES.TYPE_CLASSIFICATION[classification],
            color: COLORS.TYPE_CLASSIFICATION[classification],
            y: itemsWithClassification.length,
            custom: {
                percent: percent
            }
        };
    });
    return {
        name: 'Work items by classification',
        data: data
    };
}

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    const logOutput = typeof text !== 'string' ? JSON.stringify(text) : text;
    cplace.log(logOutput);
}