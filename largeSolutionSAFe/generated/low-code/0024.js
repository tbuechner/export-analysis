/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.solution
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the PI statistics
 */

/**
 * Identifier: highchart-programIncrement-progress
 * Type of chart: multi pie chart
 * Type of search pages: cf.cplace.solution.safe.team, cf.cplace.solution.safe.story
 * Functionality: visualizes different kinds of kpis
 *
 * INSTRUCTIONS TO ADD CHARTS
 * 1. Increase TOTAL_NUMBER_OF_KPIS +1
 * 2. Define Following Values
 *      - CX_TITLE
 *      - CX_ACTUAL
 *      - CX_ACTUAL_PERCENTAGE
 *      - CX_DISPLAY_NUMBER
 *      - CX_DISPLAY_TEXT
 *      - CX_COLOR
 * 3. Create chart
 *      - createChart(CX_TITLE, CX_ACTUAL_PERCENTAGE, CX_DISPLAY_NUMBER, CX_DISPLAY_TEXT, CX_COLOR) {
 *
 *
 * @author Lukas Scheiring (cF)
 * Last edited: 18.08.2022
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName("highchart-programStartPage-statistics");

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

//CHART COLOURS
const COLOURS = {
    TEXT_COLOR: "#003653",
    BACKGROUND_COLOR: "#ffffff",
    GREY: "gray",
    RED: "#f30000",
    DARK_RED: "#9e0000",
    YELLOW: "#ffc700",
    GREEN: "#5ab500",
    BLUE: "#A6CAD8",
};

//CHART SETTINGS
const TOTAL_NUMBER_OF_KPIS = 5;
const Y_POSITION = "40%";

//LANGUAGE SETTINGS
const NAMINGS = {
    de: {
        CHART_TITLE: "",
    },
    en: {
        CHART_TITLE: "",
    },
};

//PLACEHOLDER
const PROGRAM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
        CAPACITY: "cf.cplace.solution.safe.capacity"
    },
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        ACTUAL_START_DATE: "cf.cplace.solution.safe.actualStartDate",
        ACTUAL_END_DATE: "cf.cplace.solution.safe.actualEndDate",
        PROGRAM_INCREMENT: "cf.cplace.solution.safe.programIncrement",
        STATE: "cf.cplace.solution.safe.state"
    },
    ENUM: {
        STATE: {
            DONE: "#85 - Done"
        }
    }
});

const CONFIDENCE_VOTE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.confidenceVote",
    ATTR: {
        PROGRAMM_INCREMENT: "cf.cplace.solution.safe.confidenceVote.PI",
        RESULT: "cf.cplace.solution.safe.confidenceVote.result",
        ONE_FINGER: "cf.cplace.solution.safe.confidenceVote.oneFinger",
        TWO_FINGERS: "cf.cplace.solution.safe.confidenceVote.twoFingers",
        THREE_FINGERS: "cf.cplace.solution.safe.confidenceVote.threeFingers",
        FOUR_FINGERS: "cf.cplace.solution.safe.confidenceVote.fourFingers",
        FIVE_FINGERS: "cf.cplace.solution.safe.confidenceVote.fiveFingers",
    },
});

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
log("Start...");
let currentUser = cplace.utils().getCurrentUser();
const userLanguage = currentUser.getUserLanguage();

/** @type {Page<'cf.cplace.solution.safe.solution'>} */
let solution = embeddingPage;

let programIncrement = solution.get("cf.cplace.solution.safe.currentPi");

let chartIndex = 0;

//Container
let capabilities = [];
/** @type {Page<'cf.cplace.solution.safe.confidenceVote'> | undefined} */
let confidenceVote;

let series = [];
let yAxis = [];
let pane = [];

//Dates
let piStartDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay();
let piEndDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay();
let today = new DateTime().withTimeAtStartOfDay();

//KPIs
let totalDaysOfPI = Days.daysBetween(piStartDate, piEndDate).getDays();
let passedDaysOfPI = getPassedDays(piStartDate, piEndDate, today, totalDaysOfPI);

let totalCapacity = programIncrement.get(PROGRAM_INCREMENT.ATTR.CAPACITY);
let velocityOfLastPI = 0;
let totalCapabilities = 0;
let capabilitiesDone = 0;
let confidenceVoteAverage = 0;

//--------------------------------------------------------------------------------------//
//                                       PROCESSING STAGE                               //
//--------------------------------------------------------------------------------------//

// Group pages
cplace.each(pages, (page) => {
    switch (page.getBuiltinFeatureValue("customType")) {
        case CAPABILITY.TYPE:
            capabilities.push(page);
            break;
        case CONFIDENCE_VOTE.TYPE:
            confidenceVote = page;
            break;
        default:
            break;
    }
});

totalCapabilities = capabilities.length
velocityOfLastPI = calculateVelocityOfLastPi(programIncrement);
confidenceVoteAverage = calculateConfidenceVoteAverage(confidenceVote);

capabilitiesDone = capabilities.filter(
    (/** @type {Page<'cf.cplace.solution.safe.capability'>} */ c) =>
        c.get(CAPABILITY.ATTR.STATE) === CAPABILITY.ENUM.STATE.DONE
).length;

//--------------------------------------------------------------------------------------//
//                                       KPIs & CHART                                   //
//--------------------------------------------------------------------------------------//

//KPI 1 - Story Points done
const C1_TITLE = "Done Capabilities Last PI";
const C1_ACTUAL_VALUE = velocityOfLastPI || 0;
const C1_DISPLAY_NUMBER = C1_ACTUAL_VALUE;
const C1_DISPLAY_TEXT = "<b>VELOCITY LAST PI</b><br>";
const C1_COLOR = COLOURS.GREEN;

createChart(C1_TITLE, C1_ACTUAL_VALUE, C1_DISPLAY_NUMBER, C1_DISPLAY_TEXT, C1_COLOR);

// KPI 2 - Done Capabilities
const C2_TITLE = "Done Capabilities";
const C2_ACTUAL_PERCENTAGE = Math.round((capabilitiesDone / totalCapabilities) * 100) || 0;
const C2_DISPLAY_NUMBER = C2_ACTUAL_PERCENTAGE + "%";
const C2_DISPLAY_TEXT = "<b>DONE CAPABILITIES</b><br>" + capabilitiesDone + "/" + totalCapabilities;
const C2_COLOR = COLOURS.GREEN;

createChart(C2_TITLE, C2_ACTUAL_PERCENTAGE, C2_DISPLAY_NUMBER, C2_DISPLAY_TEXT, C2_COLOR);

// KPI 3 - Load vs Capacity
const C3_TITLE = "Load vs. Capacity";
const C3_ACTUAL_PERCENTAGE = (totalCapacity && Math.round((totalCapabilities / totalCapacity) * 100)) || 0;
const C3_DISPLAY_NUMBER = C3_ACTUAL_PERCENTAGE + "%";
const C3_DISPLAY_TEXT = "<b>LOAD VS. CAPACITY</b><br>" + totalCapabilities + "/" + totalCapacity;

let c3_color = COLOURS.GREEN;
if (Math.round((totalCapabilities / totalCapacity) * 100) >= 90) {
    c3_color = COLOURS.YELLOW;
    if (Math.round((totalCapabilities / totalCapacity) * 100) > 100) {
        c3_color = COLOURS.RED;
    }
}

createChart(C3_TITLE, C3_ACTUAL_PERCENTAGE, C3_DISPLAY_NUMBER, C3_DISPLAY_TEXT, c3_color);

// KPI 4 - passed days
const C4_TITLE = "Days passed";
const C4_ACTUAL_PERCENTAGE = Math.round((passedDaysOfPI / totalDaysOfPI) * 100) || 0;
const C4_DISPLAY_NUMBER = C4_ACTUAL_PERCENTAGE + "%";
const C4_DISPLAY_TEXT = "<b>DAYS PASSED</b><br>" + passedDaysOfPI + "/" + totalDaysOfPI;
const C4_COLOR = COLOURS.GREEN;

createChart(C4_TITLE, C4_ACTUAL_PERCENTAGE, C4_DISPLAY_NUMBER, C4_DISPLAY_TEXT, C4_COLOR);

// KPI 5 - Confidence Vote
const C5_TITLE = "Average Confidence Vote";
const C5_ACTUAL_PERCENTAGE = Math.round((confidenceVoteAverage / 5) * 100) || 0;
const C5_DISPLAY_NUMBER = confidenceVoteAverage.toFixed(1);
const C5_DISPLAY_TEXT = "<b>AVG. CONFIDENCE VOTE</b><br>";
const C5_COLOR = getConvidenceVoteColors(confidenceVoteAverage);

createChart(C5_TITLE, C5_ACTUAL_PERCENTAGE, C5_DISPLAY_NUMBER, C5_DISPLAY_TEXT, C5_COLOR);

log("End...");

// @ts-ignore
return {
    chart: {
        type: "solidgauge",
    },

    title: {
        text: NAMINGS[userLanguage].CHART_TITLE,
    },
    series: series,
    yAxis: yAxis,
    pane: pane,
    tooltip: {
        enabled: false,
    },
    plotOptions: {
        solidgauge: {
            enableMouseTracking: false,
        },
    },
};

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

function createChart(title, actualRel, displayNumber, displayText, color) {
    series.push(getSeriesObject(title, actualRel, displayNumber, chartIndex, color));
    yAxis.push(getYAxisObject(displayText, chartIndex, 0, 100));
    pane.push(getPaneObject(getXAxisPosition(chartIndex), Y_POSITION));
    chartIndex++;
}

function getXAxisPosition(kpiIndex) {
    return (120 * (kpiIndex + 1)) / (TOTAL_NUMBER_OF_KPIS + 1) - 10 + "%";
}

function getPassedDays(piStartDate, piEndDate, today, totalDaysOfPI) {
    if (today.isBefore(piStartDate)) {
        return 0;
    }
    if (piEndDate.isBefore(today)) {
        return totalDaysOfPI;
    }
    // @ts-ignore
    return Days.daysBetween(piStartDate, today).getDays();
}

function getSeriesObject(title, actual, label, index, color) {
    return {
        name: title,
        data: [
            {
                name: title,
                color: color,
                y: actual,
                innerRadius: "80%",
                radius: "100%",
                dataLabels: {
                    format: '<span style="font-size:24px;font-wight: bold">' + label + "</span>",
                    borderWidth: 0,
                    color: COLOURS.GREY,
                    verticalAlign: "middle",
                    useHTML: true,
                },
            },
        ],
        yAxis: index,
    };
}

function getYAxisObject(axisTitle, index, min, max) {
    return {
        min: min,
        max: max,
        pane: index,
        title: {
            text: axisTitle,
            useHTML: true,
            y: 110,
        },
        labels: {
            enabled: false,
        },
        /*stops: [
            [0.1, COLOURS.GREEN], // green
            [0.9, COLOURS.YELLOW], // yellow
            [0.99, COLOURS.RED] // red
        ],*/
        lineWidth: 0,
        tickWidth: 0,
        tickAmount: 0,
        minorTickWidth: 0,
    };
}

function getPaneObject(xPosition, yPosition) {
    return {
        center: [xPosition, yPosition],
        size: "50%",
        startAngle: 0,
        endAngle: 360,
        background: {
            backgroundColor: "#EEE",
            borderColor: null,
            innerRadius: "80%",
            outerRadius: "100%",
            shape: "arc",
        },
    };
}

function getConvidenceVoteColors(value) {
    if (value <= 2) {
        return COLOURS.RED;
    } else if (value <= 3) {
        return COLOURS.YELLOW;
    } else {
        return COLOURS.GREEN;
    }
}

/**
 * Calculates the average confidence vote
 * @param {Page<'cf.cplace.solution.safe.confidenceVote'> | undefined | null} confidenceVote
 */
function calculateConfidenceVoteAverage(confidenceVote) {
    if (!confidenceVote) {
        return 0;
    }
    const oneFinger = confidenceVote.get(CONFIDENCE_VOTE.ATTR.ONE_FINGER);
    const twoFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.TWO_FINGERS);
    const threeFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.THREE_FINGERS);
    const fourFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FOUR_FINGERS);
    const fiveFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FIVE_FINGERS);
    const totalFingers = oneFinger + 2 * twoFingers + 3 * threeFingers + 4 * fourFingers + 5 * fiveFingers;
    const numberOfConvidenceVotes = oneFinger + twoFingers + threeFingers + fourFingers + fiveFingers;

    return totalFingers / numberOfConvidenceVotes;
}

/**
 * Calculate the velocity of last PI as number of capabilities that were done in the last PI
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} currentPi
 */
function calculateVelocityOfLastPi(currentPi) {
    let lastPI = currentPi.get(PROGRAM_INCREMENT.ATTR.PREDECESSOR);
    if (!lastPI) {
        return 0;
    }
    const velocity = Array.from(lastPI.getIncomingPages(CAPABILITY.TYPE, CAPABILITY.ATTR.PROGRAM_INCREMENT)).filter(
        (/** @type {Page<'cf.cplace.solution.safe.capability'>} */ c) =>
            c.get(CAPABILITY.ATTR.STATE) === CAPABILITY.ENUM.STATE.DONE
    ).length;
    return velocity;
}
// //--------------------------------------------------------------------------------------//
// //                                       HELPER FUNCTIONS                               //
// //--------------------------------------------------------------------------------------//

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    let logOutput = typeof text !== "string" ? JSON.stringify(text) : text;

    cplace.log(logOutput);
}