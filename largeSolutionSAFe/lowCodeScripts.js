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

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.solution
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the timeline with Programm Increments, Safe Events and Safe Milestones. Chart is zoomable and draggable
 */

// set the distinguishing log name
cplace.setLogName("Highcharts - Timeline Overview");

/***** Start configuration *****/
const chartBackgroundColor = "#FFFFFF";
const lineColor = "#303038";

const piColor = "#dddddd";
const safeMilestoneColor = "#3D8F8C";
const eventColor = "#366C81";

const milestonePlotBandColor = "#E2F3F2";
const eventPlotBandColor = "#E2EEF3";
const todayPlotline = "lightgrey";

const showMonthsBeforeToday = 3;
const showMonthsAfterToday = 9;
/***** End configuration *****/

const MILESTONE = {
    TYPE: "cf.milestone",
    ATTR: {
        SCHEDULE: "containingSchedule",
        DATE: "date",
        FEATURE_DEPENDENCY: "cf.cplace.solution.safe.dependency",
        TASKCLASS: "activityClass",
    },
};
const FEATURE = {
    TYPE: "cf.cplace.solution.safe.feature",
    ATTR: {
        PROGRAM: "cf.cplace.solution.safe.program",
    },
};
const SCHEDULE = {
    TYPE: "cf.schedule",
    ATTR: {},
};
const TASK_CLASS = {
    TYPE: "cf.activityClass",
    ATTR: {
        COLOR: "barColor",
        BORDERCOLOR: "borderColor",
        SHAPE: "milestoneShape",
    },
};
const SAFE_MILESTONE = {
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        DATE: "cf.cplace.solution.safe.date",
    },
};
const PI = {
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START: "cf.cplace.solution.safe.startDate",
        END: "cf.cplace.solution.safe.endDate",
    },
};
const EVENT = {
    TYPE: "cf.cplace.solution.safe.event",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
};

function main() {
    /** @type {ChartContext} */
    const context = {
        today: new Date(),
        start: getStartDate(showMonthsBeforeToday),
        end: getEndDate(showMonthsAfterToday),
        solution: embeddingPage,
        schedules: [],
        programIncrements: [],
        events: [],
        safeMilestones: [],
        series: [],
        plotlines: [],
        categories: ["<b>Program Increments</b>", "<b>Events</b>", "<b>SAFe Milestones</b>"],
        yIndex: 0,
    };

    categorizeData(pages, context);
    createPiSeries(context);
    createEventSeries(context);
    createMilestoneSeries(context);
    //create plotline between SAFe parts and schedules
    //ctx.plotLines.push(createPlotline(yIndex - 0.5, 1.25));
    createScheduleSeries(context);

    return createChartConfig(context);
}

/**
 * Sort pages by their type and them to the context
 * @param {Page[]} pages
 * @param {ChartContext} ctx
 */
function categorizeData(pages, ctx) {
    cplace.each(pages, (page) => {
        let type = page.getBuiltinFeatureValue("customType");
        if (type === SCHEDULE.TYPE) {
            ctx.schedules.push(page);
        } else if (type === PI.TYPE) {
            ctx.programIncrements.push(page);
        } else if (type === SAFE_MILESTONE.TYPE) {
            ctx.safeMilestones.push(page);
        } else if (type === EVENT.TYPE) {
            ctx.events.push(page);
        }
    });
}

/**
 * Create pi series
 * @param {ChartContext} ctx
 */
function createPiSeries(ctx) {
    const piData = [];
    cplace.each(ctx.programIncrements, (pi) => {
        piData.push(createDataItem(pi.getName(), pi.get(PI.ATTR.START), pi.get(PI.ATTR.END), ctx.yIndex, piColor));
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Program Increments",
        showInLegend: false,
          tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br/>Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
            useHTML: true,
        },
        data: piData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
    return piData;
}

/**
 * Create event series
 * @param {ChartContext} ctx
 */
function createEventSeries(ctx) {
    let eventData = [];
    cplace.each(ctx.events, (event) => {
        eventData.push(
            createDataItem(
                event.getName(),
                event.get(EVENT.ATTR.START_DATE),
                event.get(EVENT.ATTR.END_DATE),
                ctx.yIndex,
                eventColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Events",
        showInLegend: false,
          tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br/>Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
            useHTML: true,
        },
        data: eventData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
}

/**
 * Create safe milestone series
 * @param {ChartContext} ctx
 */
function createMilestoneSeries(ctx) {
    let safeMilestoneData = [];
    cplace.each(ctx.safeMilestones, (safeMilestone) => {
        safeMilestoneData.push(
            createMilestoneDataItem(
                safeMilestone.getName(),
                safeMilestone.get(SAFE_MILESTONE.ATTR.DATE),
                ctx.yIndex,
                safeMilestoneColor,
                safeMilestoneColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push(createMilestoneSerie("SAFe Milestones", safeMilestoneData));
}
/**
 * Create Chart configuration
 * @param {ChartContext} ctx
 * @returns
 */
function createChartConfig(ctx) {
    return {
        chart: {
            type: "xrange",
            backgroundColor: chartBackgroundColor,
            panning: true,
            panKey: "shift",
            zoomType: "x",
        },
        title: {
            text: "",
        },
        yAxis: {
            title: {
                text: "",
            },
            categories: ctx.categories,
            reversed: true,
            type: "category",
            plotBands: [
                {
                    color: eventPlotBandColor,
                    from: 0.5,
                    to: 1.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
                {
                    color: milestonePlotBandColor,
                    from: 1.5,
                    to: 2.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
            ],
        },
        xAxis: {
            type: "datetime",
            min: Date.UTC(ctx.start.getFullYear(), ctx.start.getMonth(), ctx.start.getDate(), 0, 0, 0, 0),
            max: Date.UTC(ctx.end.getFullYear(), ctx.end.getMonth(), ctx.end.getDate(), 23, 59, 59, 59),
            plotLines: [
                {
                    dashStyle: "dash",
                    color: todayPlotline,
                    width: 2,
                    value: Date.UTC(ctx.today.getFullYear(), ctx.today.getMonth(), ctx.today.getDate(), 0, 0, 0, 0),
                    zIndex: 1,
                },
                ...ctx.plotlines,
            ],
        },
        tooltip: {
            enabled: true,
        },
        series: ctx.series,
    };
}

/**
 * Create schedule series
 * @param {ChartContext} ctx
 */
function createScheduleSeries(ctx) {
    cplace.each(ctx.schedules, (schedule) => {
        let relevantSchedule = false;
        let scheduleData = [];
        let milestones = schedule.getIncomingPages(MILESTONE.TYPE, MILESTONE.ATTR.SCHEDULE);
        cplace.each(milestones, (milestone) => {
            let featureDependency = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
            let isProgramRelevant = false;
            cplace.each(featureDependency, (feature) => {
                let featureProgram = feature.get(FEATURE.ATTR.PROGRAM);
                if (featureProgram && featureProgram.getId() === ctx.solution.getId()) {
                    isProgramRelevant = true;
                }
            });
            if (isProgramRelevant) {
                relevantSchedule = true;
                scheduleData.push(createScheduleMilestoneDataItem(milestone, ctx.yIndex));
            }
        });
        if (relevantSchedule) {
            ctx.categories.push(createCategory(schedule));
            ctx.series.push(createMilestoneSerieSchedule(schedule.getName(), scheduleData));
            ctx.yIndex++;
        }
    });
}

//FUNCTIONS
function createDataItem(name, start, end, y, color) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    return {
        name: name,
        x: Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0),
        x2: Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 99),
        y: y,
        color: color,
    };
}

function getMilestoneShape(milestoneShape) {
    if (milestoneShape === "Diamond") return "diamond";
    if (milestoneShape === "Arrow Up") return "diamond";
    if (milestoneShape === "Arrow Down") return "diamond";
    if (milestoneShape === "Triangle Up") return "triangle";
    if (milestoneShape === "Triangle Down") return "triangle-down";
    if (milestoneShape === "Triangle Left") return "triangle";
    if (milestoneShape === "Triangle Right") return "triangle";
    if (milestoneShape === "Circle") return "circle";
    if (milestoneShape === "Square") return "square";
    if (milestoneShape === "Star") return "diamond";
    if (milestoneShape === "Ramp Down") return "diamond";
    if (milestoneShape === "Ramp Up") return "diamond";
}

function createMilestoneDataItem(name, date, y, color, borderColor) {
    let milestoneDate = new Date(date);
    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
        },
    };
}

function createScheduleMilestoneDataItem(milestone, y) {
    let name = milestone.getName();
    let milestoneDate = new Date(milestone.get(MILESTONE.ATTR.DATE));
    let color = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.COLOR);
    let borderColor = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.BORDERCOLOR);
    let milestoneShape = getMilestoneShape(milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.SHAPE));
    let features = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
    let featureList = "<b>Requested Features:</b>";
    cplace.each(features, (feature) => {
        featureList = featureList + "<br>" + feature.getName();
    });

    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        features: featureList,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
            symbol: milestoneShape,
        },
    };
}

function createMilestoneSerie(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createMilestoneSerieSchedule(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            useHTML: true,
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}<br>{point.features}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createPlotline(value, width) {
    return {
        color: lineColor,
        width: width,
        value: value,
        dashStyle: "solid",
    };
}

function getStartDate(months) {
    let today = new Date();
    let startDate = today;
    startDate.setMonth(today.getMonth() - months);
    return startDate;
}

function getEndDate(months) {
    let today = new Date();
    let endDate = today;
    endDate.setMonth(today.getMonth() + months);
    return endDate;
}

function createCategory(object) {
    let name = object.getName();
    let url = object.getUrl();
    return '<a href="' + url + '">' + name + "</a>";
}

/**
 * Object containing context information for the chart.
 * @typedef {Object} ChartContext
 * @property {Date} today - The current date.
 * @property {Date} start - The start date for the chart.
 * @property {Date} end - The end date for the chart.
 * @property {Page} solution - The embeddingPage object representing the current solution.
 * @property {Page[]} schedules - An array of pages representing schedules.
 * @property {Page[]} programIncrements - An array of pages representing program increments.
 * @property {Page[]} events - An array of pages representing events.
 * @property {Page[]} safeMilestones - An array of pages representing SAFe milestones.
 * @property {any[]} series - An array of series
 * @property {any[]} plotlines - An array of plotlines
 * @property {string[]} categories - An array of categories
 * @property {number} yIndex - y-index
 */

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

cplace.setLogName('Current PI');
//Configurations
const PI_DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.currentPiDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let piDashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(PI_DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(PI_DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(piDashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Current PI Dashboard</a>';

//------------------------------------------------------------------------------------------------------

/**
 * Solution -> Solution Train Engineer [0..1]
 * Solution -> Solution Train Architect [0..1]
 * Solution -> Solution Management [0..1]
 * 
 */

const SOLUTION = {
    TYPE: 'cf.cplace.solution.safe.solution',
    ATTR: {
        ST_ENGINEER: 'cf.cplace.solution.safe.solutionTrainEngineer',
        ST_ARCHITECT: 'cf.cplace.solution.safe.solutionTrainArchitect',
        SOL_MANAGEMENT: 'cf.cplace.solution.safe.solutionManagement'
    }
}

const THUMBNAIL_SIZE = '60px';


//find all relevant roles / responsibles

let solution = embeddingPage;

let users = [];

let ste = solution.get(SOLUTION.ATTR.ST_ENGINEER);
let sta = solution.get(SOLUTION.ATTR.ST_ARCHITECT);
let solMan = solution.get(SOLUTION.ATTR.SOL_MANAGEMENT);


if (ste) {
    addUser(ste, "Solution Train Engineer")
}
if (sta) {
    addUser(sta, "Solution Train Architect")
}
if (solMan) {
    addUser(solMan, "Solution Management")
}

//users.sort((user1, user2) => user1.name > user2.name ? 1 : -1);


let output = '';


for (let i = 0; i < users.length; i++) {
  output += generateUserMarkupNew(users[i]);
}

return '<div style="display:flex;flex-flow:row wrap;">' + output + '</div>';


function addUser(member, title) {
    users.push({
        name: member.getName(),
        id: member.getId().split('/').pop(),
        url: member.getUrl(),
        title: title
    })
}

function getTenantName(page){
 let url=embeddingPage.getUrl().split('/pages/')[0];
 let tenantName= url.split('/')[3];
  return tenantName;
}

function generateUserMarkup (user) {
    return '<div style="margin:8px;text-align: center;">'
        + '<img class="cplace-person__image" style="margin: 5px" src="/person/downloadThumbnail?id=' + user.id + '" width="' + THUMBNAIL_SIZE + '" height="' + THUMBNAIL_SIZE + '" title="' + user.name + '"/>'
        + '<div style="font-size: 9pt;margin:3px;">' + user.name + '</div>'
        + '<div style="font-size: 8pt;margin:3px;">' + user.title + '</div>'
      + '</div>';
  }

//<img class="custom-profile-image" src='+ tenantUrl +'person/downloadThumbnail?id=' + userHref + '>'

function generateUserMarkupNew (user) {
    return '<div style="margin:8px;text-align: center;">'
        + '<img class="cplace-person__image" style="margin: 5px;height:60px;width:60px" src="/'+getTenantName(embeddingPage)+'/person/downloadThumbnail?id=' + user.id + '" width="' + THUMBNAIL_SIZE + '" height="' + THUMBNAIL_SIZE + '" title="' + user.name + '"/>'
        + '<div style="font-size: 10pt;margin:3px;">' + user.name + '</div>'
        + '<div style="font-size: 9pt;margin:3px;">' + user.title + '</div>'
      + '</div>';
  }

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.currentIterationDashboard
 * @layout cf.cplace.solution.safe.iterationStatistics
 * @author Bastian Rang
 * @version 1.0
 * @description
 */

const DEBUG = false;

const PROGRAM_INCREMENT = {
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        STATISTICS: "cf.cplace.solution.safe.statsJson",
    },
};

const CAPABILITY = {
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATUS: "",
    },
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
    STATUS_MAP: {
        "#10 - Draft": "Draft",
        "#15 - Funnel": "Funnel",
        "#25 - Analyzing": "Analyzing",
        "#35 - Backlog": "Backlog",
        "#45 - Implementing": "Implementing",
        "#55 - Validating": "Validating",
        "#65 - Deploying": "Deploying",
        "#75 - Releasing": "Releasing",
        "#85 - Done": "Done",
        "#95 - Obsolete": "Obsolete",
    },
    CLASSIFICATION: {
        ENABLER: "#15 - enabler",
        STORY: "#25 - story",
        MAINTENANCE: "#35 - maintenance",
    },
};

const pi = Array.from(pages)[0];

if (pi?.getBuiltinFeatureValue("customType") !== PROGRAM_INCREMENT.TYPE) {
    throw new Error("Please provide a single program increment in the chart search.");
}

const startDate = pi.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay();
const endDate = pi.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay();

let statistics = null;
try {
    statistics = JSON.parse(pi.get(PROGRAM_INCREMENT.ATTR.STATISTICS));
    DEBUG && cplace.log(statistics);
} catch (e) {
    // @ts-ignore
    return {
        title: {
            text: null,
        },
    };
}

if (!statistics || !statistics.archive || !statistics.current) {
    // @ts-ignore
    return {
        title: {
            text: null,
        },
    };
}

const today = DateTime.parse(statistics.current.date).withTimeAtStartOfDay();

// Define the data for Release Burndown
/**
 * @type {Array}
 */
let data = statistics.archive.map((element) => {
    const currentDate = DateTime.parse(element.date);

    const currentData = {
        day: currentDayNumber(startDate, currentDate),
    };

    DEBUG && cplace.log(element.cumulativeFlow);
    Object.values(CAPABILITY.STATUS).forEach((statusName) => (currentData[statusName] = element.cumulativeFlow[statusName] || 0));

    return currentData;
});

DEBUG && cplace.log(data);

data = sortByKey(data, "day");

const series = [];

Object.values(CAPABILITY.STATUS).forEach((statusName) => {
    series.push({
        name: CAPABILITY.STATUS_MAP[statusName],
        data: data.map((e) => e[statusName]),
    });
});

// Create the chart
// @ts-ignore
return {
    chart: {
        type: "area",
    },
    title: {
        text: "Cumulative Flow Diagram",
    },
    xAxis: {
        categories: data.map((data) => data.day),
    },
    yAxis: {
        title: {
            text: "Number of Capabilities",
        },
    },
    plotOptions: {
        area: {
            stacking: "normal",
        },
    },
    series: series,
};

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
    });
}

function currentDayNumber(startDate, currentDate) {
    return Days.daysBetween(startDate.withTimeAtStartOfDay(), currentDate.withTimeAtStartOfDay()).getDays();
}

//------------------------------------------------------------------------------------------------------

/**
 *
 */

const DEBUG = false;

const PROGRAM_INCREMENT = {
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        STATISTICS: "cf.cplace.solution.safe.statsJson",
    },
};

const pi = Array.from(pages)[0];

if (pi?.getBuiltinFeatureValue("customType") !== PROGRAM_INCREMENT.TYPE) {
    throw new Error("Please provide a single team iteration in the chart search.");
}

const startDate = pi.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay();
const endDate = pi.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay();
/** @type {Statistics} */
let statistics = null;
try {
    statistics = JSON.parse(pi.get(PROGRAM_INCREMENT.ATTR.STATISTICS));
    DEBUG && cplace.log(statistics);
} catch (e) {
    return {
        title: {
            text: null,
        },
    };
}

if (!statistics || !statistics.archive || !statistics.current) {
    return {
        title: {
            text: null,
        },
    };
}

const today = DateTime.parse(statistics.current.date).withTimeAtStartOfDay();

// Sort statistics by Date
const sortedStatistics = statistics.archive.sort((a, b) => Days.daysBetween(new DateTime(Date.parse(b.date)), new DateTime(Date.parse(a.date))).getDays());

// Define the data for Release Burndown
let data = sortedStatistics
    .map((element) => {
        const currentDate = DateTime.parse(element.date);
        return {
            day: currentDayNumber(startDate, currentDate),
            planned: linearPercentageDegression(element.burndown.planned, currentDate, startDate, endDate),
            actual: element.burndown.planned - element.burndown.done,
            forecast: null,
        };
    })
    .sort((a, b) => a.day - b.day);

const lastDataPoint = sortedStatistics[sortedStatistics.length - 1];

let currentDate = new DateTime(Date.parse(lastDataPoint.date));

while (!currentDate.isAfter(endDate.plusSeconds(5))) {
    const currentDateKey = currentDayNumber(startDate, currentDate);

    // DEBUG && cplace.log(currentDateKey)

    if (!data.some((el) => currentDateKey === el.day)) {
        data.push({
            day: currentDateKey,
            planned: linearPercentageDegression(statistics.current.burndown.planned, currentDate, startDate, endDate),
            actual: null,
            forecast: linearPercentageDegressionForecast(statistics.current.burndown.planned, statistics.current.burndown.done, currentDate, today, endDate),
        });
    }

    currentDate = currentDate.plusDays(1);
}

data = sortByKey(data, "day");

// Create the chart
return {
    chart: {
        type: "line",
    },
    title: {
        text: "Program Increment Burn-Down Chart",
    },
    xAxis: {
        title: {
            text: "Day",
        },
        categories: data.map((data) => data.day),
    },
    yAxis: {
        title: {
            text: "Story Points",
        },
    },
    plotLines: [
        {
            color: "#33ff33",
            width: 1,
            zIndex: 9999,
            value: 12,
        },
    ],
    series: [
        {
            name: "Ideal Burndown",
            data: data.map((data) => data.planned),
            color: "lightblue",
        },
        {
            name: "Forecast",
            data: data.map((data) => data.forecast || data.actual),
            color: {
                pattern: {
                    color: "#ccccff",
                    opacity: 0.5,
                },
            },
        },
        {
            name: "Remaining Storypoints",
            data: data.map((data) => data.actual),
            color: "#6666ff",
        },
    ],
};

function linearPercentageDegression(planned, currentDate, startDate, endDate) {
    const daysFullIteration = Days.daysBetween(startDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();
    const daysLeft = Days.daysBetween(currentDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();

    DEBUG && cplace.log("daysfull: " + daysFullIteration);
    DEBUG && cplace.log("daysleft: " + daysLeft);

    return planned * (daysLeft / daysFullIteration);
}

function linearPercentageDegressionForecast(planned, done, currentDate, startDate, endDate) {
    const daysFullIteration = Days.daysBetween(startDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();
    const daysLeft = Days.daysBetween(currentDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();

    DEBUG && cplace.log("daysfull: " + daysFullIteration);
    DEBUG && cplace.log("daysleft: " + daysLeft);

    if (daysFullIteration === 0) {
        return done;
    }

    return (planned - done) * (daysLeft / daysFullIteration);
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
    });
}

function currentDayNumber(startDate, currentDate) {
    return Days.daysBetween(startDate.withTimeAtStartOfDay(), currentDate.withTimeAtStartOfDay()).getDays();
}

//------------------------------------------------------------------------------------------------------

/**
 *
 */

const DEBUG = false;

const PROGRAM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        STATISTICS: "cf.cplace.solution.safe.statsJson",
    },
});

function main() {
    const teamIteration = Array.from(pages)[0];

    if (teamIteration?.getBuiltinFeatureValue("customType") !== PROGRAM_INCREMENT.TYPE) {
        throw new Error("Please provide a single team iteration in the chart search.");
    }

    let statistics = null;
    try {
        statistics = JSON.parse(teamIteration.get(PROGRAM_INCREMENT.ATTR.STATISTICS));
        DEBUG && cplace.log(statistics);
    } catch (e) {
        return {
            title: {
                text: null,
            },
        };
    }

    if (!statistics || !statistics.archive || !statistics.current) {
        return {
            title: {
                text: null,
            },
        };
    }
    const data = createData(teamIteration, statistics);

    // Create the chart
    return {
        chart: {
            type: "line",
        },
        title: {
            text: "Team Iteration Burn-Up Chart",
        },
        xAxis: {
            title: {
                text: "Day",
            },
            categories: data.map((data) => data.day),
        },
        yAxis: {
            title: {
                text: "Story Points",
            },
        },
        plotLines: [
            {
                color: "#33ff33",
                width: 1,
                zIndex: 9999,
                value: 12,
            },
        ],
        series: [
            {
                name: "Ideal Burn-Up",
                data: data.map((data) => data.planned),
                color: "lightblue",
            },
            {
                name: "Forecast",
                data: data.map((data) => data.forecast || data.actual),
                color: {
                    pattern: {
                        color: "#ccccff",
                        opacity: 0.5,
                    },
                },
            },
            {
                name: "Done Storypoints",
                data: data.map((data) => data.actual),
                color: "#6666ff",
            },
        ],
    };
}
/**
 * Create the data for the chart
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} pi
 * @param {Statistics} statistics
 * @returns
 */
function createData(pi, statistics) {
    const today = DateTime.parse(statistics.current.date).withTimeAtStartOfDay();

    const startDate = pi.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay();
    const endDate = pi.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay();

    // Define the data for Release Burn-Up

    const sortedStatistics = statistics.archive.sort((a, b) => Days.daysBetween(new DateTime(Date.parse(b.date)), new DateTime(Date.parse(a.date))).getDays());

    let data = sortedStatistics.map((element) => {
        const currentDate = DateTime.parse(element.date);
        return {
            day: currentDayNumber(startDate, currentDate),
            planned: linearPercentageDegression(element.burndown.planned, currentDate, startDate, endDate),
            actual: element.burndown.done,
            forecast: null,
        };
    });

    const lastDataPoint = sortedStatistics[sortedStatistics.length - 1];

    let currentDate = new DateTime(Date.parse(lastDataPoint.date));

    while (!currentDate.isAfter(endDate.plusSeconds(5))) {
        const currentDateKey = currentDayNumber(startDate, currentDate);

        DEBUG && cplace.log(currentDateKey);

        if (!data.some((el) => currentDateKey === el.day)) {
            const entry = {
                day: currentDateKey,
                planned: linearPercentageDegression(statistics.current.burndown.planned, currentDate, startDate, endDate),
                actual: null,
                forecast:
                    linearPercentageDegressionForecast(statistics.current.burndown.planned, statistics.current.burndown.done, currentDate, today, endDate) +
                    statistics.current.burndown.done,
            };
            data.push(entry);
        }

        currentDate = currentDate.plusDays(1);
    }

    DEBUG && cplace.log(data);

    data = sortByKey(data, "day");

    return data;
}

/**
 * Calculates linear percentage degression based on the given parameters.
 * The function calculates the percentage degression from the initial value (`planned`) to 0
 * over a specific period between `startDate` and `endDate`, based on the `currentDate`.
 *
 * @param {number} planned - The initial value or planned value at the `startDate`.
 * @param {DateTime} currentDate - The current date for which the degression needs to be calculated.
 * @param {DateTime} startDate - The start date of the degression period.
 * @param {DateTime} endDate - The end date of the degression period.
 * @returns {number} The calculated value after linear percentage degression.
 *
 */
function linearPercentageDegression(planned, currentDate, startDate, endDate) {
    const daysFullIteration = Days.daysBetween(startDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();
    const daysLeft = Days.daysBetween(currentDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();

    DEBUG && cplace.log("daysfull: " + daysFullIteration);
    DEBUG && cplace.log("daysleft: " + daysLeft);

    return planned * (1 - daysLeft / daysFullIteration);
}
/**
 * Calculates linear percentage degression based on the given parameters.
 * The function calculates the percentage degression from the initial value (`planned`) to 0
 * over a specific period between `startDate` and `endDate`, based on the `currentDate`.
 *
 * @param {number} planned - The initial value or planned value at the `startDate`.
 * @param {number} done - The done value at the `startDate`.
 * @param {DateTime} currentDate - The current date for which the degression needs to be calculated.
 * @param {DateTime} startDate - The start date of the degression period.
 * @param {DateTime} endDate - The end date of the degression period.
 * @returns {number} The calculated value after linear percentage degression.
 *
 */
function linearPercentageDegressionForecast(planned, done, currentDate, startDate, endDate) {
    const daysFullIteration = Days.daysBetween(startDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();
    const daysLeft = Days.daysBetween(currentDate.withTimeAtStartOfDay(), endDate.withTimeAtStartOfDay()).getDays();

    DEBUG && cplace.log("daysfull: " + daysFullIteration);
    DEBUG && cplace.log("daysleft: " + daysLeft);

    if (daysFullIteration === 0) {
        return done;
    }

    return (planned - done) * (1 - daysLeft / daysFullIteration);
}

/**
 * Sorts an array of objects based on the values of a specified key in each object.
 * The function sorts the array in ascending order based on the values of the specified `key`.
 *
 * @template T
 * @param {T[]} array - The array of objects to be sorted.
 * @param {keyof T} key - The key based on which the objects should be sorted.
 * @returns {T[]} The sorted array of objects.
 */
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
    });
}

/**
 * Calulcates the amount of days after the start date for the currentDate provided
 * @param {DateTime} startDate
 * @param {DateTime} currentDate
 * @returns
 */
function currentDayNumber(startDate, currentDate) {
    return Days.daysBetween(startDate.withTimeAtStartOfDay(), currentDate.withTimeAtStartOfDay()).getDays();
}

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

cplace.setLogName('Current PI');
//Configurations
const PI_DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.currentPiDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let piDashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(PI_DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(PI_DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(piDashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Current PI Dashboard</a>';

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

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
cplace.setLogName('highchart-programIncrement-progress');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

//CHART COLOURS
const COLOURS = {
    TEXT_COLOR : '#003653',
    BACKGROUND_COLOR : '#ffffff',
    GREY : 'gray',
    RED: '#f30000',
    DARK_RED : '#9e0000',
    YELLOW: '#ffc700',
    GREEN: '#5ab500',
    BLUE : '#A6CAD8'
}

//CHART SETTINGS
const TOTAL_NUMBER_OF_KPIS = 4
const Y_POSITION = '40%'

//LANGUAGE SETTINGS
const NAMINGS = {
    de: {
        CHART_TITLE: '',
    },
    en: {
        CHART_TITLE: '',
    }
};

//PLACEHOLDER
const PROGRAM_INCREMENT = {
    TYPE : 'cf.cplace.solution.safe.programIncrement',
    ATTR : {
        TITLE : 'cf.cplace.solution.safe.title',
        PROGRAM : 'cf.cplace.solution.safe.program',
        START_DATE : 'cf.cplace.solution.safe.startDate',
        END_DATE : 'cf.cplace.solution.safe.endDate',
        PREDECESSOR : 'cf.cplace.solution.safe.predecessor',
        PERIOD_STATUS : 'cf.cplace.solution.safe.periodStatus',
        CAPACITY : 'cf.cplace.solution.safe.capacity'
    }
}

const TEAM = {
    TYPE : 'cf.cplace.solution.safe.team',
    ATTR : {
        VELOCITY : 'cf.cplace.solution.safe.velocity',
        CAPACITY : 'cf.cplace.solution.safe.capacity',
    }
}

const STORY = {
    TYPE : 'cf.cplace.solution.safe.story',
    ATTR : {
        ITERATION : 'cf.cplace.solution.safe.iteration',
        STATUS : 'cf.cplace.solution.safe.status',
        STORY_POINTS : 'cf.cplace.solution.safe.storyPoints'
    },
    ENUM_STATUS : {
        ANALYSIS : '#10 - analysis',
        BACKLOG : '#20 - backlog',
        IN_PROGRESS : '#40 - in progress',
        DONE : '#50 - done',
        OBSOLETE : '#60 - obsolete'
    }
}

const ITERATION = {
    TYPE : 'cf.cplace.solution.safe.iteration',
    ATTR: {
        ITERATION : 'cf.cplace.solution.safe.iteration',
        PI: 'cf.cplace.solution.safe.programIncrement',
    }
}



//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
log('Start...')
let currentUser = cplace.utils().getCurrentUser()
const userLanguage = currentUser.getUserLanguage()
let programIncrement = embeddingPage;
let chartIndex = 0

//Container
let teams = []
let stories = []

let series = []
let yAxis = []
let pane = []

//Dates
let piStartDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay()
let piEndDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay()
let today = new DateTime().withTimeAtStartOfDay()

//KPIs
let totalDaysOfPI = Days.daysBetween(piStartDate,piEndDate).getDays();
let passedDaysOfPI = getPassedDays (piStartDate, piEndDate, today, totalDaysOfPI)



//let totalCapacity = 0;
let velocityOfLastPI = 0
let totalLoad = 0
let spDone = 0


//--------------------------------------------------------------------------------------//
//                                       PROCESSING STAGE                               //
//--------------------------------------------------------------------------------------//

//Group pages
cplace.each(pages, page => {
    switch (page.getBuiltinFeatureValue('customType')) {
        case TEAM.TYPE:
            teams.push(page)
            break;
        case STORY.TYPE:
            stories.push(page)
            break;
        default:
            break;
    }
})

//calculate velocity
let lastPI = programIncrement.get(PROGRAM_INCREMENT.ATTR.PREDECESSOR)
if (lastPI) {
    log('Last PI: ' + lastPI.getName())
    let iterations = lastPI.getIncomingPages(ITERATION.TYPE, ITERATION.ATTR.PI)
    cplace.each(iterations, iteration => {
        log('Check iteration: ' + iteration.getName())
        let storiesOfIteration = iteration.getIncomingPagesFromAllSpaces(STORY.TYPE, STORY.ATTR.ITERATION)
        cplace.each(storiesOfIteration, storyOfIteration => {
            log('Check story: ' + storyOfIteration.getName())
            if (storyOfIteration.get(STORY.ATTR.STATUS) === STORY.ENUM_STATUS.DONE) {
                velocityOfLastPI += (storyOfIteration.get(STORY.ATTR.STORY_POINTS) || 0)
            }
        })
    })
}




//Load + SP done
cplace.each(stories, story => {
    let storyPoints = story.get(STORY.ATTR.STORY_POINTS) || 0
    totalLoad += storyPoints

    if (story.get(STORY.ATTR.STATUS) === STORY.ENUM_STATUS.DONE) {
        spDone += storyPoints
    }

})



//--------------------------------------------------------------------------------------//
//                                       KPIs & CHART                                   //
//--------------------------------------------------------------------------------------//

//Chart 1 - passed days
const C1_TITLE = 'Days passed'
const C1_ACTUAL = passedDaysOfPI
const C1_ACTUAL_PERCENTAGE = Math.round((passedDaysOfPI / totalDaysOfPI) * 100)  ? Math.round((passedDaysOfPI / totalDaysOfPI) * 100) : 0;
const C1_DISPLAY_NUMBER = C1_ACTUAL_PERCENTAGE + '%'
const C1_DISPLAY_TEXT = '<b>DAYS PASSED</b><br>' + passedDaysOfPI + '/' + totalDaysOfPI
const C1_COLOR = COLOURS.GREEN

createChart(C1_TITLE, C1_ACTUAL_PERCENTAGE, C1_DISPLAY_NUMBER, C1_DISPLAY_TEXT, C1_COLOR)


//KPI 2 - Load vs Capacity
//Capacity + Velocity
let totalCapacity = programIncrement.get(PROGRAM_INCREMENT.ATTR.CAPACITY);
if(totalCapacity){
const C2_TITLE = 'Load vs. Capacity'
const C2_ACTUAL = totalLoad
const C2_ACTUAL_PERCENTAGE= Math.round((totalLoad / totalCapacity) * 100) || 0
const C2_DISPLAY_NUMBER = C2_ACTUAL_PERCENTAGE + '%'
const C2_DISPLAY_TEXT = '<b>LOAD VS. CAPACITY</b><br>' + totalLoad + '/' + totalCapacity

let c2_color = COLOURS.GREEN
if (Math.round((totalLoad / totalCapacity) * 100) >= 90) {
    c2_color = COLOURS.YELLOW
    if (Math.round((totalLoad / totalCapacity) * 100) > 100) {
        c2_color = COLOURS.RED
    }    
}    

createChart(C2_TITLE, C2_ACTUAL_PERCENTAGE, C2_DISPLAY_NUMBER, C2_DISPLAY_TEXT, c2_color)
}

//KPI 3 - Story Points done
const C3_TITLE = 'Done SP'
const C3_ACTUAL = spDone
const C3_ACTUAL_PERCENTAGE = Math.round((spDone / totalLoad) * 100) || 0
const C3_DISPLAY_NUMBER = C3_ACTUAL_PERCENTAGE + '%'
const C3_DISPLAY_TEXT = '<b>DONE SP</b><br>' + spDone + '/' + totalLoad
const C3_COLOR = COLOURS.GREEN

createChart(C3_TITLE, C3_ACTUAL_PERCENTAGE, C3_DISPLAY_NUMBER, C3_DISPLAY_TEXT, C3_COLOR)


//KPI 4 - Velocity
const C4_TITLE = 'Velocity of Last PI'
const C4_ACTUAL = 100
const C4_ACTUAL_PERCENTAGE = 100
const C4_DISPLAY_NUMBER = Math.round(velocityOfLastPI)
const C4_DISPLAY_TEXT = '<b>VELOCITY OF LAST PI</b><br>over all Teams'
const C4_COLOR = COLOURS.BLUE

createChart(C4_TITLE, C4_ACTUAL_PERCENTAGE, C4_DISPLAY_NUMBER, C4_DISPLAY_TEXT, C4_COLOR)




log('End...')
return {
    chart: {
        type: 'solidgauge',
    },
    
    title: {
        text: NAMINGS[userLanguage].CHART_TITLE
    },
    series: series,
    yAxis: yAxis,
    pane: pane,
    tooltip : {
        enabled: false
    },
    plotOptions: {
        solidgauge : {
            enableMouseTracking: false,
        }
    },
}


//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

function createChart(title, actualRel, displayNumber, displayText, color) {
    series.push(getSeriesObject(title, actualRel, displayNumber, chartIndex, color))
    yAxis.push(getYAxisObject(displayText, chartIndex, 0, 100))
    pane.push(getPaneObject(getXAxisPosition(chartIndex), Y_POSITION))
    chartIndex++;
}

function getXAxisPosition (kpiIndex) {
    return 120 * (kpiIndex + 1) / (TOTAL_NUMBER_OF_KPIS + 1) -10 + '%'
}

function getPassedDays (piStartDate, piEndDate, today, totalDaysOfPI) {
    if (today.isBefore(piStartDate)) {
        return 0
    }
    if (piEndDate.isBefore(today)) {
        return totalDaysOfPI
    }
    return Days.daysBetween(piStartDate,today).getDays()
}

function getSeriesObject (title, actual, label, index, color) {
    return {
        name : title,
        data : [{
            name : title,
            color : color,
            y : actual,
            innerRadius: '80%',
            radius: '100%',
            dataLabels : {
                format :  '<h1 style="font-size:13">' + label+ '</h1>',
                borderWidth: 0,
                color: COLOURS.GREY,
                verticalAlign: 'middle',
                useHTML: true
            },
        }],
        yAxis: index,
    }
}


function getYAxisObject (axisTitle, index, min, max) {
    return {
        min: min,
        max: max,
        pane : index,
        title: {
            text: axisTitle,
            useHTML: true,
            y: 110,
        },
        labels: {
            enabled : false
        },
        /*stops: [
            [0.1, COLOURS.GREEN], // green
            [0.9, COLOURS.YELLOW], // yellow
            [0.99, COLOURS.RED] // red
        ],*/
        lineWidth: 0,
        tickWidth: 0,
        tickAmount : 0,
        minorTickWidth: 0
    }
}

function getPaneObject (xPosition, yPosition) {
    return {
        center: [xPosition, yPosition],
        size: '50%',
        startAngle: 0,
        endAngle: 360,
        background: {
            backgroundColor: '#EEE',
            borderColor: null,
            innerRadius: '80%',
            outerRadius: '100%',
            shape: 'arc'
        }
    }
}

//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//


/**
 * Log to cplace
 * @param {any} text 
 */
function log(text) {
    if (!DEBUG) {
        return
    }
    let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;

    cplace.log(logOutput);
}

/**
 * 
 * @param {any} msg 
 * @returns 
 */
function timeSinceStart(msg) {
    if (!DEBUG) {
        return
    }
    let now = new Date().getTime();
    cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
    LAST_TIME = now;
}

//------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------

cplace.setLogName('HC: Prioritization Matrix')

/**
 * Define colors for the chart
 */
 const CHART_LABELS = {
   XAXIS_TITLE: '<- Cost of Delay ->',
   YAXIS_TITLE: '<- Job Duration ->'
 }
 const CHART_COLORS = {
  PLOTLINES: '#b5b5b5',
  DONT_DO_TEXT: '#EC7E80',
  DO_NEXT_TEXT: '#3A4454',
  DO_LATER_TEXT: '#313C4E',
  DO_NOW_TEXT:  '#7EC587',
  ENABLER: '#E6D32B',
  FEATURE: '#0CA2D4',
}

const FEATURE = {
    ATTR: {
      JOB_SIZE: 'cf.cplace.solution.safe.jobSize',
      BUSINESS_VALUE: 'cf.cplace.solution.safe.businessValue',
      TIME_CRITICALITY: 'cf.cplace.solution.safe.timeCriticality',
      RISK_REDUCTION: 'cf.cplace.solution.safe.riskReduction',
      WSJF: 'cf.cplace.solution.safe.wsjf',
      STATUS: '',
      TYPE: 'cf.cplace.solution.safe.featureType'
    },
    ENUM_STATUS: {

    },
    ENUM_TYPE: {
        ENABLER: 'enabler',
        FEATURE: 'feature'
    }
  }

/*//find colors for types
let typeColorConfigurations = new Search()
  .add(Filters.type('de.visualistik.visualRoadmap.visualRoadmapConfiguration'))
  .add(Filters.customAttribute('de.visualistik.visualRoadmap.configurationTypeMap').eq('colorMap'))
  .add(Filters.customAttribute('de.visualistik.visualRoadmap.propertyKey').eq('cf.cplace.solution.safe.type'))
  .findAllPages();

  cplace.each(typeColorConfigurations, configuration => {
    let values = configuration.get('de.visualistik.visualRoadmap.propertyKeyValues');
    let color = configuration.get('de.visualistik.visualRoadmap.displayedValue');
    if (values.indexOf('#15 - Enabler') > -1){
      CHART_COLORS.ENABLER = color
    }
    if (values.indexOf('#25 - Epic') > -1){
      CHART_COLORS.EPIC = color
    }
  })*/

  const language = cplace.utils().getCurrentUser().getUserLanguage();

/**
 * create serie and data items
 */
let serie = createBubbleSerie()
let maxBubbleSize = 0;

cplace.each(pages, function (feature) {
    let z = feature.get(FEATURE.ATTR.WSJF);
    if (z) {
        let time = feature.get(FEATURE.ATTR.TIME_CRITICALITY);
        let business = feature.get(FEATURE.ATTR.BUSINESS_VALUE);
        let risk = feature.get(FEATURE.ATTR.RISK_REDUCTION);
        let x = time + business + risk;
        let jobSize = feature.get(FEATURE.ATTR.JOB_SIZE);
        let y = switchSize(jobSize);
        let type = feature.get(FEATURE.ATTR.TYPE);
    
        if (z > maxBubbleSize) {
            maxBubbleSize = z;
        }
        serie.data.push(createDataItem(feature, x, y, z, type));
    }
});

serie.data.push(createHiddenDataItem(0, 0, maxBubbleSize));
serie.data.push(createHiddenDataItem(0, 20, maxBubbleSize));
serie.data.push(createHiddenDataItem(60, 0, maxBubbleSize));
serie.data.push(createHiddenDataItem(60, 20, maxBubbleSize));

let xAxisPlotLines = [];
let yAxisPlotLines = [];

// Create quadrant divider
xAxisPlotLines.push(createQuadrantPlotline(30));
yAxisPlotLines.push(createQuadrantPlotline(10));

// Create labels for each quadrant
let label = createLabelPlotline('DON\'\T DO', 0, 'left',  CHART_COLORS.DONT_DO_TEXT, -10, 37);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO NEXT', 0, 'right',  CHART_COLORS.DO_NEXT_TEXT, 0, 37);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO LATER', 20, 'left',  CHART_COLORS.DO_LATER_TEXT, -10, -25);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO NOW', 20, 'right',  CHART_COLORS.DO_NOW_TEXT, 0, -25);
yAxisPlotLines.push(label);

/**
 * BUILD CHART
 */
let config = {
    chart: {
        type: 'bubble',
    },

    legend: {
        enabled: false
    },

    title: {
        text: ''
    },

    xAxis: {
        title: {
            text: CHART_LABELS.XAXIS_TITLE
        },
        lineWidth: 0,
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        tickWidth: 0,
        tickInterval: 5,
        startOnTick: false,
        endOnTick: false,
        showLastLabel: true,
        plotLines: xAxisPlotLines
    },

    yAxis: {
        title: {
            text: CHART_LABELS.YAXIS_TITLE
        },
        lineWidth: 0,
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        tickWidth: 0,
        tickInterval: 5,
        startOnTick: false,
        endOnTick: false,
        plotLines: yAxisPlotLines
    },

    tooltip: {
        useHTML: true,
        headerFormat: '',
        pointFormat: '{point.tooltip}',
        style: {
            pointerEvents: 'auto'
        }
    },

    plotOptions: {
        bubble: {
            dataLabels: {
                enabled: false,
            },
            minSize: 1,
            maxSize: 50
        }
    },
    series: [serie]
};

return config;

/**
 * ================
 * HELPER FUNCTIONS
 * ================
 */

function createBubbleSerie() {
    return {
        data: [],
        marker: {
            fillOpacity: 0.13,
            lineWidth: 0
        }
    };
}

function createDataItem(page, x, y, z, type) {
    let color = getColor(type);
    let rgba = hexToRGBA(color, 0.1);
    return {
        name: page.getName(),
        url: page.getUrl(),
        x: x,
        y: y,
        z: z,
        tooltip: getTooltip(page),
        color: rgba,
        marker: {
            lineColor: color,
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
                textOutline: false,
                color: color
            }
        }
    }
}

function getTooltip(page) {
    let tooltip = '<a style="font-weight:bold" href=' + page.getUrl()+ 'target="_blank">' + page.getName() + '</a><br/>'+
    'Time Criticality: ' + page.get(FEATURE.ATTR.TIME_CRITICALITY) + '<br/>' +
    'Business Value: ' + page.get(FEATURE.ATTR.BUSINESS_VALUE) + '<br/>' +
    'Risk Reduction: ' + page.get(FEATURE.ATTR.RISK_REDUCTION) + '<br/>' +
    'Job Size: ' + page.get(FEATURE.ATTR.JOB_SIZE) + '<br/>' +
    '<b> WSJF: ' + page.get(FEATURE.ATTR.WSJF) + '<br/>';
    //'Status: ' + page.get(FEATURE.ATTR.STATUS, language) + '</b>';
    return tooltip;
}

function createHiddenDataItem(x, y, z) {
    return {
        x: x,
        y: y,
        z: z,
        enableMouseTracking: false,
        marker: {
            enabled: false
        }
    }
}

function createQuadrantPlotline(value) {
    return {
        color: CHART_COLORS.PLOTLINES,
        dashStyle: 'solid',
        width: 1,
        value: value,
        zIndex: 3
    }
}

function createLabelPlotline(text, value, align, color, xOffset, yOffset) {
    return {
        width: 0,
        value: value,
        zIndex: 3,
        label: {
            text: text,
            align: align,
            style: {
                color: color,
                fontWeight: 'bold'
            },
            x: xOffset,
            y: yOffset
        }
    }
}

function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

function switchSize(size){
    let switchedSize
    switch (size) {
        case 20:
            switchedSize = 1;
            break;
        case 13:
            switchedSize = 8;
            break;
        case 8:
            switchedSize = 13;
            break;
        case 5:
            switchedSize = 16;
            break;
        case 3:
            switchedSize = 18;
            break;
        case 2:
            switchedSize = 19;
            break;
        case 1:
            switchedSize = 20;
            break;
    }
    return switchedSize;
}

function getColor(type){
    switch (type) {
        case FEATURE.ENUM_TYPE.ENABLER:
            return CHART_COLORS.ENABLER;
        case FEATURE.ENUM_TYPE.FEATURE:
            return CHART_COLORS.FEATURE
        default: 
            return '#b5b5b5'
    }
}

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.solution
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the timeline with Programm Increments, Safe Events and Safe Milestones. Chart is zoomable and draggable
 */

// set the distinguishing log name
cplace.setLogName("Highcharts - Timeline Overview");

/***** Start configuration *****/
const chartBackgroundColor = "#FFFFFF";
const lineColor = "#303038";

const piColor = "#dddddd";
const safeMilestoneColor = "#3D8F8C";
const eventColor = "#366C81";

const milestonePlotBandColor = "#E2F3F2";
const eventPlotBandColor = "#E2EEF3";
const todayPlotline = "lightgrey";

const showMonthsBeforeToday = 3;
const showMonthsAfterToday = 9;
/***** End configuration *****/

const MILESTONE = {
    TYPE: "cf.milestone",
    ATTR: {
        SCHEDULE: "containingSchedule",
        DATE: "date",
        FEATURE_DEPENDENCY: "cf.cplace.solution.safe.dependency",
        TASKCLASS: "activityClass",
    },
};
const FEATURE = {
    TYPE: "cf.cplace.solution.safe.feature",
    ATTR: {
        PROGRAM: "cf.cplace.solution.safe.program",
    },
};
const SCHEDULE = {
    TYPE: "cf.schedule",
    ATTR: {},
};
const TASK_CLASS = {
    TYPE: "cf.activityClass",
    ATTR: {
        COLOR: "barColor",
        BORDERCOLOR: "borderColor",
        SHAPE: "milestoneShape",
    },
};
const SAFE_MILESTONE = {
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        DATE: "cf.cplace.solution.safe.date",
    },
};
const PI = {
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START: "cf.cplace.solution.safe.startDate",
        END: "cf.cplace.solution.safe.endDate",
    },
};
const EVENT = {
    TYPE: "cf.cplace.solution.safe.event",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
};

const CAPABILITY = ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
});

function main() {
    /** @type {ChartContext} */
    const context = {
        today: new Date(),
        start: getStartDate(showMonthsBeforeToday),
        end: getEndDate(showMonthsAfterToday),
        solution: embeddingPage.get(CAPABILITY.ATTR.SOLUTION),
        schedules: [],
        programIncrements: [],
        events: [],
        safeMilestones: [],
        series: [],
        plotlines: [],
        categories: ["<b>Program Increments</b>", "<b>Events</b>", "<b>SAFe Milestones</b>"],
        yIndex: 0,
    };

    categorizeData(pages, context);
    createPiSeries(context);
    createEventSeries(context);
    createMilestoneSeries(context);
    //create plotline between SAFe parts and schedules
    //ctx.plotLines.push(createPlotline(yIndex - 0.5, 1.25));
    createScheduleSeries(context);

    return createChartConfig(context);
}

/**
 * Sort pages by their type and them to the context
 * @param {Page[]} pages
 * @param {ChartContext} ctx
 */
function categorizeData(pages, ctx) {
    cplace.each(pages, (page) => {
        let type = page.getBuiltinFeatureValue("customType");
        if (type === SCHEDULE.TYPE) {
            ctx.schedules.push(page);
        } else if (type === PI.TYPE) {
            ctx.programIncrements.push(page);
        } else if (type === SAFE_MILESTONE.TYPE) {
            ctx.safeMilestones.push(page);
        } else if (type === EVENT.TYPE) {
            ctx.events.push(page);
        }
    });
}

/**
 * Create pi series
 * @param {ChartContext} ctx
 */
function createPiSeries(ctx) {
    const piData = [];
    cplace.each(ctx.programIncrements, (pi) => {
        piData.push(createDataItem(pi.getName(), pi.get(PI.ATTR.START), pi.get(PI.ATTR.END), ctx.yIndex, piColor));
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Program Increments",
        showInLegend: false,
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
        },
        data: piData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
    return piData;
}

/**
 * Create event series
 * @param {ChartContext} ctx
 */
function createEventSeries(ctx) {
    let eventData = [];
    cplace.each(ctx.events, (event) => {
        eventData.push(
            createDataItem(
                event.getName(),
                event.get(EVENT.ATTR.START_DATE),
                event.get(EVENT.ATTR.END_DATE),
                ctx.yIndex,
                eventColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Events",
        showInLegend: false,
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
        },
        data: eventData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
}

/**
 * Create safe milestone series
 * @param {ChartContext} ctx
 */
function createMilestoneSeries(ctx) {
    let safeMilestoneData = [];
    cplace.each(ctx.safeMilestones, (safeMilestone) => {
        safeMilestoneData.push(
            createMilestoneDataItem(
                safeMilestone.getName(),
                safeMilestone.get(SAFE_MILESTONE.ATTR.DATE),
                ctx.yIndex,
                safeMilestoneColor,
                safeMilestoneColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push(createMilestoneSerie("SAFe Milestones", safeMilestoneData));
}
/**
 * Create Chart configuration
 * @param {ChartContext} ctx
 * @returns
 */
function createChartConfig(ctx) {
    return {
        chart: {
            type: "xrange",
            backgroundColor: chartBackgroundColor,
            panning: true,
            panKey: "shift",
            zoomType: "x",
        },
        title: {
            text: "",
        },
        yAxis: {
            title: {
                text: "",
            },
            categories: ctx.categories,
            reversed: true,
            type: "category",
            plotBands: [
                {
                    color: eventPlotBandColor,
                    from: 0.5,
                    to: 1.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
                {
                    color: milestonePlotBandColor,
                    from: 1.5,
                    to: 2.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
            ],
        },
        xAxis: {
            type: "datetime",
            min: Date.UTC(ctx.start.getFullYear(), ctx.start.getMonth(), ctx.start.getDate(), 0, 0, 0, 0),
            max: Date.UTC(ctx.end.getFullYear(), ctx.end.getMonth(), ctx.end.getDate(), 23, 59, 59, 59),
            plotLines: [
                {
                    dashStyle: "dash",
                    color: todayPlotline,
                    width: 2,
                    value: Date.UTC(ctx.today.getFullYear(), ctx.today.getMonth(), ctx.today.getDate(), 0, 0, 0, 0),
                    zIndex: 1,
                },
                ...ctx.plotlines,
            ],
        },
        tooltip: {
            enabled: true,
        },
        series: ctx.series,
    };
}

/**
 * Create schedule series
 * @param {ChartContext} ctx
 */
function createScheduleSeries(ctx) {
    cplace.each(ctx.schedules, (schedule) => {
        let relevantSchedule = false;
        let scheduleData = [];
        let milestones = schedule.getIncomingPages(MILESTONE.TYPE, MILESTONE.ATTR.SCHEDULE);
        cplace.each(milestones, (milestone) => {
            let featureDependency = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
            let isProgramRelevant = false;
            cplace.each(featureDependency, (feature) => {
                let featureProgram = feature.get(FEATURE.ATTR.PROGRAM);
                if (featureProgram && featureProgram.getId() === ctx.solution.getId()) {
                    isProgramRelevant = true;
                }
            });
            if (isProgramRelevant) {
                relevantSchedule = true;
                scheduleData.push(createScheduleMilestoneDataItem(milestone, ctx.yIndex));
            }
        });
        if (relevantSchedule) {
            ctx.categories.push(createCategory(schedule));
            ctx.series.push(createMilestoneSerieSchedule(schedule.getName(), scheduleData));
            ctx.yIndex++;
        }
    });
}

//FUNCTIONS
function createDataItem(name, start, end, y, color) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    return {
        name: name,
        x: Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0),
        x2: Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 99),
        y: y,
        color: color,
    };
}

function getMilestoneShape(milestoneShape) {
    if (milestoneShape === "Diamond") return "diamond";
    if (milestoneShape === "Arrow Up") return "diamond";
    if (milestoneShape === "Arrow Down") return "diamond";
    if (milestoneShape === "Triangle Up") return "triangle";
    if (milestoneShape === "Triangle Down") return "triangle-down";
    if (milestoneShape === "Triangle Left") return "triangle";
    if (milestoneShape === "Triangle Right") return "triangle";
    if (milestoneShape === "Circle") return "circle";
    if (milestoneShape === "Square") return "square";
    if (milestoneShape === "Star") return "diamond";
    if (milestoneShape === "Ramp Down") return "diamond";
    if (milestoneShape === "Ramp Up") return "diamond";
}

function createMilestoneDataItem(name, date, y, color, borderColor) {
    let milestoneDate = new Date(date);
    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
        },
    };
}

function createScheduleMilestoneDataItem(milestone, y) {
    let name = milestone.getName();
    let milestoneDate = new Date(milestone.get(MILESTONE.ATTR.DATE));
    let color = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.COLOR);
    let borderColor = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.BORDERCOLOR);
    let milestoneShape = getMilestoneShape(milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.SHAPE));
    let features = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
    let featureList = "<b>Requested Features:</b>";
    cplace.each(features, (feature) => {
        featureList = featureList + "<br>" + feature.getName();
    });

    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        features: featureList,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
            symbol: milestoneShape,
        },
    };
}

function createMilestoneSerie(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createMilestoneSerieSchedule(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            useHTML: true,
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}<br>{point.features}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createPlotline(value, width) {
    return {
        color: lineColor,
        width: width,
        value: value,
        dashStyle: "solid",
    };
}

function getStartDate(months) {
    let today = new Date();
    let startDate = today;
    startDate.setMonth(today.getMonth() - months);
    return startDate;
}

function getEndDate(months) {
    let today = new Date();
    let endDate = today;
    endDate.setMonth(today.getMonth() + months);
    return endDate;
}

function createCategory(object) {
    let name = object.getName();
    let url = object.getUrl();
    return '<a href="' + url + '">' + name + "</a>";
}

/**
 * Object containing context information for the chart.
 * @typedef {Object} ChartContext
 * @property {Date} today - The current date.
 * @property {Date} start - The start date for the chart.
 * @property {Date} end - The end date for the chart.
 * @property {Page} solution - The embeddingPage object representing the current solution.
 * @property {Page[]} schedules - An array of pages representing schedules.
 * @property {Page[]} programIncrements - An array of pages representing program increments.
 * @property {Page[]} events - An array of pages representing events.
 * @property {Page[]} safeMilestones - An array of pages representing SAFe milestones.
 * @property {any[]} series - An array of series
 * @property {any[]} plotlines - An array of plotlines
 * @property {string[]} categories - An array of categories
 * @property {number} yIndex - y-index
 */

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

cplace.setLogName('PI Dashboard');
//Configurations
const DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.breakdownDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let dashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(dashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Capablities Dashboard</a>';

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

cplace.setLogName('PI Dashboard');
//Configurations
const DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.solutionRoadmapDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let dashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(dashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Solution Roadmap Dashboard</a>';

//------------------------------------------------------------------------------------------------------

cplace.setLogName('Current PI');
//Configurations
const TIMELINE_DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.timelineDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let piDashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(TIMELINE_DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(TIMELINE_DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(piDashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Timeline Dashboard</a>';

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/**
 * Displays all items grouped by Solution and PI.
 * Dependencies between items are displayed as a line.
 *
 * Milestones that lie within the period of the PIs are displayed in a separate row.
 *
 * @author Christopher Wölfle
 * @version 15.03.2023
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName("highcharts-solution-dependency-map");

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY_HEIGHT = 0.3;

const TYPE_CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        TYPE: "cf.cplace.solution.safe.capabilityType",
        FEATURES: "cf.cplace.solution.safe.feature",
        PROGRAM: "cf.cplace.solution.safe.program",
        SOLUTION: "cf.cplace.solution.safe.solution.reference",
        PROGRAM_INCREMENT: "cf.cplace.solution.safe.programIncrement",
        EPIC: "cf.cplace.solution.safe.portfolioEpic",
        TEMP_ITERATIONS: "cf.cplace.solution.safe.iteration",
    },
    ENUM: {
        TYPE: {
            CAPABILITY: "capability",
            ENABLER: "enabler",
        },
    },
});

const TYPE_MILESTONE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        DATE: "cf.cplace.solution.safe.date",
        TYPE: "cf.cplace.solution.safe.type",
        RELEVANT_FOR: "cf.cplace.solution.safe.relevantFor", // refers to Program
    },
    ENUM: {
        TYPE: {
            PI_MILESTONE: "#15 - PI Meilenstein",
            FIXED_DATE: "#25 - Fixiertes Datum",
            LEARNING_MILESTONE: "#35 - Learning Meilenstein",
        },
    },
});

const TYPE_DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        B: "cf.cplace.solution.safe.predecessor",
        TYPE: "cf.cplace.solution.safe.type",
        STATUS: "cf.cplace.solution.safe.status",
        DESCRIPTION: "cf.cplace.solution.safe.description",
    },
    ENUM: {
        TYPE: {
            RELATED_TO: "related to",
            BLOCKED_BY: "blocked by",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            RESOLVED: "35 - resolved",
        },
    },
});

const TYPE_PROGRAM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        START: "cf.cplace.solution.safe.startDate",
        END: "cf.cplace.solution.safe.endDate",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor", // Program Increment
    },
});

const COLORS = {
    INACTIVE: "#88bbee",
    ACTIVE: "#4488aa",
    DEPEND: "#888888",
    DEPEND_HIGHLIGHT: "#A21622",
    DEPEND_RESOLVED: "#19ad48",
    SAFE_MILESTONE: "#3D8F8C",
    RELEASE: "#366C81",
    MILESTONE_PLOTBAND: "#E2F3F2",
    RELEASE_PLOTBAND: "#E2EEF3",
    CAPABILITY: "#0aa5ff",
    ENABLER: "#ffc80c",
    TODAY_PLOTLINE: "lightgrey",
};

const CATEGORY = {
    SAFE_MILESTONE: "SAFe Milestones",
};

const ROW_SIZE = {
    PERIOD: 2,
    ITEM: 1,
};

const HEIGHTS = {
    HEADER: 40,
    ITEM: 25,
};

const MAX_DATA_LABEL_LENGTH = 25;
const DATA_LABEL_PADDING = 0.05;

const SEPARATOR = {
    V: " //VSEP// ",
    H: " --HSEP-- ",
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

function main() {
    const ctx = fetchData(Array.from(pages));

    if (ctx.capabilities.length === 0 || ctx.periods.length === 0) {
        return {
            title: {
                text: null,
            },
        };
    }

    generateMatrix(ctx);

    const chart = generateChartConfig(ctx);

    return chart;
}
// @ts-ignore
return main();
//--------------------------------------------------------------------------------------//
//                                    Data Fetching                                     //
//--------------------------------------------------------------------------------------//

/**
 * Fetches all required data
 * @param {Page[]} searchResults
 * @returns {Context}
 */
function fetchData(searchResults) {
    const capabilities = searchResults.filter((page) => page.getBuiltinFeatureValue("customType") === TYPE_CAPABILITY.TYPE);
    const missinCapabilities = getMissingCapabilities(capabilities);
    capabilities.push(...missinCapabilities);
    log(`Added ${missinCapabilities.length} missing items that the input items depend on.`);

    const periods = getAllPeriods(capabilities);
    log("Periods: " + periods.length);

    const programs = getPrograms(capabilities);
    const milestones = getSafeMilestones(periods);
    const dependencies = getDependencies(capabilities);

    const capabilitiesById = capabilities.reduce((acc, capability) => {
        acc[capability.getId()] = { x: 0, y: 0, capability };
        return acc;
    }, {});

    const ctx = {
        matrixData: undefined,
        capabilities,
        capabilitiesById,
        periods,
        programs,
        milestones,
        dependencies,
        maxHeight: 1,
    };
    return ctx;
}

/**
 * Searches dependencies of the capabilities and returns those capabilities that are not yet included
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @return {Page<'cf.cplace.solution.safe.capability'>[]}
 */
function getMissingCapabilities(capabilities) {
    // @ts-ignore
    const newCapabilities = new HashSet();
    capabilities.forEach((item) => {
        // @ts-ignore
        const dependencies = Array.from(item.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []);
        dependencies.forEach((itemDependency) => {
            const capability = itemDependency.get(TYPE_DEPENDENCY.ATTR.B);
            if (isPageOfType(capability, TYPE_CAPABILITY.TYPE)) {
                newCapabilities.add(capability);
            }
        });
    });
    return Array.from(newCapabilities).filter((a) => !capabilities.some((b) => b.getId() === a.getId()));
}

/**
 * Determines the periods used as columns of the board
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities Capabilities
 * @returns {Page<'cf.cplace.solution.safe.programIncrement'>[]} PIs in chronological order
 */
function getAllPeriods(capabilities) {
    // @ts-ignore
    const periodsSet = new HashSet();
    capabilities.forEach((item) => {
        const pi = item.get(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT);
        if (!pi) {
            return;
        }
        periodsSet.add(pi);
    });
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const periods = Array.from(periodsSet);
    return periods.sort((a, b) =>
        // @ts-ignore
        a.get(TYPE_PROGRAM_INCREMENT.ATTR.START).isBefore(b.get(TYPE_PROGRAM_INCREMENT.ATTR.START)) ? -1 : 1
    );
}
/**
 * Gets all dependencies of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities Capabilities
 * @returns {Page<'cf.cplace.solution.safe.dependency'>[]} PIs in chronological order
 */
function getDependencies(capabilities) {
    const dependencies = [];
    capabilities.forEach((capabilitiy) => {
        const itemDependencies = Array.from(
            // @ts-ignore
            capabilitiy.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []
        );
        dependencies.push(...itemDependencies);
    });
    return dependencies;
}
/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>[]} programmIncrements
 * @returns
 */
function getSafeMilestones(programmIncrements) {
    const periodStartDate =
        // @ts-ignore
        programmIncrements.length > 0 ? programmIncrements[0].get(TYPE_PROGRAM_INCREMENT.ATTR.START) : new DateTime();
    const periodEndDate =
        programmIncrements.length > 0
            ? programmIncrements[programmIncrements.length - 1].get(TYPE_PROGRAM_INCREMENT.ATTR.END)
            : // @ts-ignore
              new DateTime();
    const safeMilestoneSearch = new Search();
    safeMilestoneSearch.add(Filters.embeddingSpace());
    safeMilestoneSearch.add(Filters.type(TYPE_MILESTONE.TYPE));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).gte(periodStartDate));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).lte(periodEndDate));
    safeMilestoneSearch.addBuiltinAttributeSort(TYPE_MILESTONE.ATTR.DATE, true);
    const safeMilestones = safeMilestoneSearch.findAllPages();
    // @ts-ignore
    return Array.from(safeMilestones);
}
/**
 * Get all the programs of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @returns {Page<'cf.cplace.solution.safe.program'>[]}
 */
function getPrograms(capabilities) {
    // @ts-ignore
    const programSet = new HashSet();
    capabilities.forEach((item) => {
        const programs = item.get(TYPE_CAPABILITY.ATTR.PROGRAM);
        if (!programs) {
            return;
        }
        cplace.each(programs, (program) => programSet.add(program));
    });
    /** @type {Page<'cf.cplace.solution.safe.program'>[]} */
    const programms = Array.from(programSet)
    return programms.sort((a,b) => a.getName().localeCompare(b.getName()));
}

/**
 * Generate the matrix
 * @param {Context} ctx
 */
function generateMatrix(ctx) {
    /** @type {MatrixData} */
    const matrixData = {
        headerRow: ctx.periods.map((pi, index) => ({ programIncrement: pi, x: index + 2, y: 1 })),
        milestoneRow: ctx.milestones,
        programms: {},
        capabilities: {},
    };
    let yOffset = 3;
    ctx.programs.forEach((program) => {
        let maxNumberOfCapabilitiesPerProgram = 0;

        const capabilitiesByPi = ctx.periods.map((programIncrement, indexPI) => {
            const filteredCapabilities = ctx.capabilities.filter((capability) => {
                const programIds = capability.get(TYPE_CAPABILITY.ATTR.PROGRAM)?.map((p) => p.getId()) || [];
                // Get all capabilities that are associated to the current programm & the current program increment
                return programIds.includes(program.getId()) && capability.getOptional(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT).getId() === programIncrement.getId();
            });
            // Check if the number of capabilities for this PI is the largest
            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }

            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        // Iterate over the programm Increments to put the capabilities in the right place
        matrixData.programms[program.getName()] = {
            program,
            data: capabilitiesByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: program.getId(),
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: program.getId(),
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight; //+ (rowHeight - 1) / 2;
    });

    const capabilitiesWithoutProgram = ctx.capabilities.filter(
        (capability) =>
            // @ts-ignore
            !capability.get(TYPE_CAPABILITY.ATTR.PROGRAM) || capability.get(TYPE_CAPABILITY.ATTR.PROGRAM).length === 0
    );

    // Check if there are any capabilities without a programm and add them to the matrix
    if (capabilitiesWithoutProgram.length > 0) {
        let maxNumberOfCapabilitiesPerProgram = 0;
        // Ad capabilities without a program
        const capabilitiesWithoutProgrammByPi = ctx.periods.map((programIncrement) => {
            const filteredCapabilities = capabilitiesWithoutProgram.filter(
                (capability) => capability.getOptional(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT).getId() === programIncrement.getId()
            );

            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }
            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        matrixData.programms["w/o Program"] = {
            program: null,
            data: capabilitiesWithoutProgrammByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesWithoutProgrammByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: "w/o Program",
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: "w/o Program",
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight;
    }
    ctx.maxHeight = yOffset;
    ctx.matrixData = matrixData;
}
/**
 *
 * @param {Context} ctx
 */
function transformMatrixDataIntoSeries(ctx) {
    const matrixData = ctx.matrixData;

    const series = [];

    if (!matrixData) {
        return series;
    }

    // 1. Add PIs
    series.push(
        ...matrixData.headerRow.map((headerEntry, index) => {
            return {
                name: headerEntry.programIncrement.getName(),
                colsize: 1,
                rowsize: 1,
                dataLabels: { rotation: 0, color: "#000000" },
                enableMouseTracking: false,
                data: [
                    {
                        x: headerEntry.x,
                        y: headerEntry.y,
                        value: 1,
                        name: `<a href="${headerEntry.programIncrement.getUrl()}">${headerEntry.programIncrement.getName()}</a>`,
                        color: "#dddddd",
                    },
                ],
            };
        })
    );

    // 2. Add Milestones
    series.push({
        name: "SAFe Milestones",
        colsize: 1,
        rowsize: 1,
        dataLabels: { rotation: 0, color: "#000000" },
        enableMouseTracking: false,
        data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
    });

    let top = true;
    const safeMilestoneData = [];

    matrixData.milestoneRow.forEach((safeMilestone) => {
        const safeMilestoneName = safeMilestone.getName();
        const safeMilestoneDate = safeMilestone.get(TYPE_MILESTONE.ATTR.DATE);
        // @ts-ignore
        const safeMilestoneDateString = safeMilestoneDate?.toString("dd.MM.yyyy");
        // get milestone Position
        // @ts-ignore
        const safeMilestonePosition = getDatePosition(safeMilestoneDate.getMillis(), ctx);
        // add milestone only if position is not null
        if (safeMilestonePosition > 0) {
            safeMilestoneData.push({
                x: safeMilestonePosition,
                y: 2,
                name: '<a href="' + safeMilestone.getUrl() + '">' + safeMilestoneName + "</a>",
                value: safeMilestoneDateString,
                dataLabels: {
                    verticalAlign: top ? "top" : "bottom",
                },
            });
            top = !top;
        }
    });

    series.push({
        type: "scatter",
        lineWidth: 0,
        findNearestPointBy: "xy",
        data: safeMilestoneData,
        marker: {
            fillColor: COLORS.SAFE_MILESTONE,
        },
    });

    // 3. Add Programms
    let rowHeight = 2.5;
    Object.keys(matrixData.programms).forEach((programName) => {
        const data = matrixData.programms[programName];
        // Add the Programms
        series.push({
            name: programName,
            rowsize: data.rowHeight,
            dataLabels: { rotation: 0, color: "#000000" },
            enableMouseTracking: false,
            data: [
                {
                    x: data.x,
                    y: data.y,
                    value: 1,
                    name: `<a href=\"${data.program?.getUrl() || "wip"}\">${programName}</a>`,
                    color: "#dddddd",
                },
            ],
        });
        // Add the capabilities of the programm
        data.data.map((capabilitiesByPI, indexPI) => {
            series.push({
                name: programName + indexPI,
                rowsize: CAPABILITY_HEIGHT,
                colsize: 0.8,
                dataLabels: { rotation: 0, color: "#000000", overflow: "justify" },
                enableMouseTracking: false,
                data: capabilitiesByPI.map((capabilityId, indexCapability) => {
                    const capabilityData = matrixData.capabilities[capabilityId].filter((c) => c.programId === (data.program ? data.program.getId() : "w/o Program"))[0];
                    const capability = capabilityData.capability;
                    const isEnabler = capability.get(TYPE_CAPABILITY.ATTR.TYPE) === "enabler";
                    return {
                        x: capabilityData.x,
                        y: capabilityData.y,
                        value: 1,
                        name: `<a href=\"${capability.getUrl() || "wip"}\">${limitStringSize(capability.getName(), 40)}</a>`,
                        color: isEnabler ? "#ffc80c" : "#0aa5ff",
                    };
                }),
            });
        });
        rowHeight += data.rowHeight;
    });

    // 4. Add Dependencies
    ctx.dependencies.forEach((dependency) => {
        const from = dependency.get(TYPE_DEPENDENCY.ATTR.B);
        const to = dependency.get(TYPE_DEPENDENCY.ATTR.A);
        if (!from || !to) {
            return;
        }
        const fromId = from.getId();
        const toId = to.getId();

        const fromCapabilities = ctx.matrixData?.capabilities[fromId];
        const toCapabilities = ctx.matrixData?.capabilities[toId];

        if (!fromCapabilities) {
            return;
        }
        const maxValue = ctx.maxHeight;
        fromCapabilities.forEach((fromCapabilityData) => {
            let x1 = fromCapabilityData.x;
            let y1 = fromCapabilityData.y;
            // y1 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

            if (!toCapabilities) {
                return;
            }
            toCapabilities.forEach((toCapabilityData) => {
                let x2 = toCapabilityData.x;
                let y2 = toCapabilityData.y;
                // y2 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

                const description = dependency.get(TYPE_DEPENDENCY.ATTR.DESCRIPTION) || " ";
                const dependencyType = dependency.get(TYPE_DEPENDENCY.ATTR.TYPE);
                const status = dependency.get(TYPE_DEPENDENCY.ATTR.STATUS);
                const dependencySeries = {
                    type: "spline",
                    name: "<b>" + to.getName() + "</b><br/>relates to:<br/>" + from.getName() + "<br>" + description,
                    lineWidth: 1.5,
                    color: COLORS.DEPEND,
                    dashStyle: "shortdot",
                    findNearestPointBy: "xy",
                    data: [
                        { x: x1 + 0.4, y: y1 },
                        { x: x1 + 0.45, y: y1 === y2 ? y1 + 0.02 : y1 },
                        { x: x2 - 0.45, y: y1 === y2 ? y2 - 0.02 : y2 },
                        { x: x2 - 0.4, y: y2, marker: { enabled: true, symbol: "diamond" } },
                    ],
                };
                if (dependencyType === TYPE_DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
                    dependencySeries.name = "<b>" + to.getName() + "</b><br/>blocked by:<br/>" + from.getName() + "<br>" + description;
                    // @ts-ignore
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

    return series;
}

//--------------------------------------------------------------------------------------//
//                                     Chart Config                                     //
//--------------------------------------------------------------------------------------//

/**
 *
 * @param {Context} ctx
 */
function generateChartConfig(ctx) {
    if (!ctx.matrixData) {
        return;
    }
    const series = transformMatrixDataIntoSeries(ctx);
    // @ts-ignore
    const today = new DateTime();
    let todayPosition = getDatePosition(today.getMillis(), ctx);

    return {
        chart: {
            type: "heatmap",
            marginTop: 0,
            marginBottom: 0,
            plotBorderWidth: 0,
            scrollablePlotArea: {
                minHeight: 1200,
                minWidth: 2200,
            },
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: [],
            title: null,
            gridLineWidth: 0,
            lineWidth: 0,
            labels: {
                enabled: false,
            },
            plotLines: [
                {
                    dashStyle: "dash",
                    color: COLORS.TODAY_PLOTLINE,
                    width: 2,
                    value: todayPosition,
                    zIndex: 1,
                },
            ],
        },
        yAxis: {
            categories: [],
            title: null,
            gridLineWidth: 1,
            tickInterval: 1,
            lineWidth: 0,
            min: 1,
            max: ctx.maxHeight,
            labels: {
                enabled: false,
            },
            reversed: true,
            scrollbar: {
                enabled: true,
            },
            plotBands: [
                {
                    color: COLORS.MILESTONE_PLOTBAND,
                    borderColor: "white",
                    borderWidth: 2,
                    from: 1.5,
                    to: 2.5,
                    zIndex: 0,
                },
                // {
                //     color: COLORS.RELEASE_PLOTBAND,
                //     borderColor: 'white',
                //     borderWidth: 2,
                //     from: 1.5,
                //     to: 2.5,
                //     zIndex: 0
                // }
            ],
        },
        colors: ["#D5001C", "#92D050"],
        colorAxis: {
            dataClassColor: "category",
            dataClasses: [
                {
                    to: 0.5,
                },
                {
                    from: 0.5,
                },
            ],
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
                borderColor: "#ffffff",
                borderWidth: 2,
                dataLabels: {
                    allowOverlap: false,
                    inside: true,
                    crop: true,
                    overflow: "justify",
                    position: "left",
                    shape: "circle",
                    enabled: true,
                    color: "#000000",
                    format: "{point.name}",
                    style: {
                        textOutline: "none",
                        textOverflow: "clip",
                    },
                },
                stickyTracking: false,
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b>",
                    findNearestPointBy: "xy",
                },
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
            },
            spline: {
                tooltip: {
                    headerFormat: "{series.name}",
                    pointFormat: "",
                    findNearestPointBy: "xy",
                },
                marker: {
                    enabled: false,
                    fillColor: COLORS.DEPEND,
                    radius: 6,
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
            },
            scatter: {
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b><br>{point.value}",
                    findNearestPointBy: "xy",
                },
                dataLabels: {
                    enabled: true,
                },
                marker: {
                    enabled: true,
                    symbol: "diamond",
                    radius: 10,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: series,
        // series: [
        //     {
        //         name: "PI 22.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 2,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/1bk9kpxn7s36vz3w80ji7t5oo/PI-22.4">PI 22.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 3,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4l6jbaa8qgzinif5qetj499g5/PI-23.1">PI 23.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.2",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 4,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/tksr708c2119mek2pzzopu9qb/PI-23.2">PI 23.2</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.3",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 5,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/i4o8azmi8m0oqvqqu3hejgu80/PI-23.3">PI 23.3</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 6,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/nrymz33xo7ew3x6qcgdk3fl7l/PI-23.4">PI 23.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 24.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 7,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/0wtzrg3m4bdpfhut5xbgiza73/PI-24.1">PI 24.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "SAFe Milestones",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
        //     },
        //     {
        //         name: "Smart Infotainment",
        //         rowsize: 2,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 3.5,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/qg000odouviwwtx4rz2bvaoi8/Smart-Infotainment">Smart Infotainment</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "Powertrain and Safety",
        //         rowsize: 4,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 5 + (4-1)/2,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4flf7a0349c5ximei6olrhife/Powertrain-and-Safety">Powertrain and Safety</a>',
        //                 color: "red",
        //             },
        //         ],
        //     },
        // ],
    };
}

//--------------------------------------------------------------------------------------//
//                                        Utils                                         //
//--------------------------------------------------------------------------------------//

/**
 * Limit string to specified size
 * @param {string} str
 * @param {number} maxSize
 * @returns
 */
function limitStringSize(str, maxSize) {
    if (str.length > maxSize) {
        return str.substring(0, maxSize - 3) + "...";
    }
    return str;
}

/**
 *
 * @param {number} date
 * @param {Context} ctx
 * @returns
 */
function getDatePosition(date, ctx) {
    let xPosition = 0;
    ctx.periods.every((pi, idx) => {
        // @ts-ignore
        let categoryStartDate = pi.get(TYPE_PROGRAM_INCREMENT.ATTR.START)?.getMillis();
        // @ts-ignore
        let categoryEndDate = pi.get(TYPE_PROGRAM_INCREMENT.ATTR.END)?.getMillis();

        // Check whether release date lies in between start and end date of category
        if (categoryStartDate && categoryEndDate && date >= categoryStartDate && date <= categoryEndDate) {
            // find x-Value of category and subtract 0.5 for starting point as offset
            let x = idx + 2 - 0.5;
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

/**
 * Checks if a cplace page is of the specified type
 * @param {Page} page
 * @param {string} type
 * @returns {boolean}
 */
function isPageOfType(page, type) {
    return page.getBuiltinFeatureValue("customType") === type;
}

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    const logOutput = typeof text !== "string" ? JSON.stringify(text) : text;
    cplace.log(logOutput);
}

//------------------------------------------------------------------------------------------------------

/**
 * Set to false to suspend logging
 * @type {Boolean}
 */
 const DEBUG = true;

 /**
  * Get millisecond starting time of the script
  * @type {Number}
  */
 const START_TIME = new Date().getTime()
 
 /** @type {Number} */
 let LAST_TIME = START_TIME;
 
 /**
  * Hint: set a declarative name for all of your logs
  */
 cplace.setLogName('Roadmap: Solution Roadmap');
 
 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 
 const CUSTOM_SETTINGS = {
   UNDEFINED_GROUP_TITLE: 'No Portfolio Epics defined', // if the ROADMAP_STRUCTURE.BASEITEM.GROUP value is changed, adjust this title
   UNDEFINED_SWIMLANE_TITLE: '',
   UNDEFINED_SUBSWIMLANE_TITLE: ''
 }
 const ROADMAP_STRUCTURE = {
   CONFIGURATION: {
     TYPE: 'de.visualistik.visualRoadmap.visualRoadmapConfiguration',
     TYPE_MAP: 'de.visualistik.visualRoadmap.configurationTypeMap',
     ITEM_TYPE: 'de.visualistik.visualRoadmap.itemType',
     DISPLAYED_VALUE: 'de.visualistik.visualRoadmap.displayedValue',
     ATTRIBUTE: 'de.visualistik.visualRoadmap.propertyKey',
     PROPERTY_KEY_VALUES: 'de.visualistik.visualRoadmap.propertyKeyValues'
   },
   BASEITEM: {
     TYPE: 'cf.cplace.solution.safe.capability',
     GROUP: 'cf.cplace.solution.safe.portfolioEpic',
     LABEL_PREFIX: 'cf.cplace.solution.safe.progressOfFeatures',
     LABEL: 'cf.cplace.solution.safe.title', // not used
     SWIMLANE: 'cf.cplace.solution.safe.solution.reference',
 
     START_DATE: 'cf.cplace.solution.safe.plannedStart',
     END_DATE: 'cf.cplace.solution.safe.plannedEnd',
 
     STATE: 'cf.cplace.solution.safe.state',
 
     // state values
     IMPLEMENTING: '#45 - Implementing',
     FUNNEL: '#15 - Funnel',
     
   },
   SUBITEM: {
     TYPE: 'cf.cplace.solution.safe.feature',
     SWIMLANE: 'cf.cplace.solution.safe.program',
     LABEL: 'cf.cplace.solution.roadmap.title',
     PART_OF: 'cf.cplace.solution.safe.capability',
     START_DATE: 'cf.cplace.solution.safe.plannedStart',
     END_DATE: 'cf.cplace.solution.safe.plannedEnd',
 
     //STATE: 'cf.cplace.solution.roadmap.workflow',
   },
   QUALITY_LINES: {
     TYPE: 'cf.cplace.solution.safe.safeMilestone',
     DATE: 'cf.cplace.solution.safe.date',
     IS_ROADMAP_RELEVANT : 'cf.cplace.solution.safe.isRoadmapRelevant'
   }
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       INITIALIZATION                                  //
 //--------------------------------------------------------------------------------------//
 
 const enableLinks = true; // enable links on items and subitems
 const branding = true; // display branding visualistik
 const allGroupsOpen = true; // true if all groups are open on default
 
 /**
  * @type {import("../templates/data-model").Configuration}
  */
 let config = null;
 
 /**
  * @type {Object}
  */
 let groups = {}
 
 /** @type {import("../templates/data-model").QualityLine[]} */
 let qualityLines = null;
 
 //--------------------------------------------------------------------------------------//
 //                                       OUTPUT                                         //
 //--------------------------------------------------------------------------------------//
 
 cplace.each(pages, function (page) {
   if (page.getBuiltinFeatureValue('customType') !== ROADMAP_STRUCTURE.BASEITEM.TYPE || page.get(ROADMAP_STRUCTURE.BASEITEM.START_DATE) == null || page.get(ROADMAP_STRUCTURE.BASEITEM.END_DATE) == null) {
     return;
   }
 
   if (config === null) {
     config = loadConfiguration(enableLinks, branding, page);
   }
 
   if (qualityLines === null) {
     qualityLines = createQualityLines(page);
   }
 
   let groupPages = preparePages(page, ROADMAP_STRUCTURE.BASEITEM.GROUP);
   
   cplace.each(groupPages, function(groupPage) {
     cplace.log('groupPages'+groupPage)
     let group = null;
     let groupName = CUSTOM_SETTINGS.UNDEFINED_GROUP_TITLE;
     let groupId = CUSTOM_SETTINGS.UNDEFINED_GROUP_TITLE;
 
     if (groupPage != null) {
       groupName = groupPage.getName();
       groupId = groupPage.getId();
     }
 
     if (groups.hasOwnProperty(groupId)) {
       group = groups[groupId]
     } else {
       group = {
         name: groupName,
         id: groupId,
         swimlanes: [],
         swimlaneObject: {}
       }
       if (allGroupsOpen) {
         config.groupsOpen.push(groupId);
       }
 
       groups[groupId] = group;
     }
 
     let swimlanePages = preparePages(page, ROADMAP_STRUCTURE.BASEITEM.SWIMLANE);
     cplace.log('swimlanePages'+swimlanePages)
 
     cplace.each(swimlanePages, function (swimlanePage) {
       cplace.log('swimlanePage'+swimlanePage)
       let swimlane = null;
       let swimlaneId = CUSTOM_SETTINGS.UNDEFINED_SWIMLANE_TITLE;
       let swimlaneName = CUSTOM_SETTINGS.UNDEFINED_SWIMLANE_TITLE;
 
       if (swimlanePage != null) { // using !== null does not work for some reason.
         swimlaneId = swimlanePage.getId();
         swimlaneName = swimlanePage.getName();
       }
 
       if (group.swimlaneObject.hasOwnProperty(swimlaneId)) {
         swimlane = group.swimlaneObject[swimlaneId]
       } else {
         swimlane = {
           name: '', //swimlaneName,
           baseItemElements: []
         }
         group.swimlaneObject[swimlaneId] = swimlane;
       }
 
       let baseItem = baseItemElement(page);
       if (baseItem === null) {
         return;
       }
 
       let subItemPages = page.getIncomingPagesFromAllSpaces(ROADMAP_STRUCTURE.SUBITEM.TYPE, ROADMAP_STRUCTURE.SUBITEM.PART_OF);
       cplace.log('subItemPages'+subItemPages);
       cplace.log('pageName'+page.getName());
       let features = page.get('cf.cplace.solution.safe.features');
       cplace.log('features'+features)
       buildSubItems(baseItem, subItemPages);
 
       swimlane.baseItemElements.push(baseItem);
     });
   })
 
 });
 
 return roadmap(config, qualityLines, groups);
 
 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                             //
 //--------------------------------------------------------------------------------------//
 
 /**
  * prepare pages for swimlane creation
  * @param {Page} page
  * @param {Attribute} attribute
  * @returns {Page[]}
  */
 function preparePages(page, attribute) {
   let result = [];
   let value = page.get(attribute, false);
 
   if (value == null || value.length === 0) {
     return [null];
   }
 
   const className = typeof value === 'object' ? String(value.getClass()) : 'String'
   switch (className) {
     case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
     case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
       result.push(page.get(attribute));
       break;
     case 'class com.google.common.collect.SingletonImmutableList':
     case 'class com.google.common.collect.RegularImmutableList':
       result = page.get(attribute);
       break;
     default:
       cplace.log('Class of ' + value + ' is "' + value.class + '"');
       cplace.log(typeof value.class);
       cplace.log(typeof value);
   }
 
   return result;
 }
 
 /**
  * create subItems for base items
  * @param {Object} baseItem
  * @param {Page[]} subItems
  */
 function buildSubItems(baseItem, subItems) {
 
   // iterate through all sub items
   cplace.each(subItems, function (subItem) {
     if (subItem === null) {
       return;
     }
 
     /**
      * Show only certain sub items
      */
     /*if ([ROADMAP_STRUCTURE.BASEITEM.PLANNED,ROADMAP_STRUCTURE.BASEITEM.DEVELOPMENT,ROADMAP_STRUCTURE.BASEITEM.LAUNCHED].indexOf(subItem.get(ROADMAP_STRUCTURE.SUBITEM.STATE)) === -1) {
       return;
     }*/
 
     let subSwimlane = null;
     let subItemCategory = null;
     let subItemCategoryName = CUSTOM_SETTINGS.UNDEFINED_SUBSWIMLANE_TITLE;
     let subItemCategoryId = CUSTOM_SETTINGS.UNDEFINED_SUBSWIMLANE_TITLE;
     
     // get swimlane of subitem
     subItemCategory = subItem.get(ROADMAP_STRUCTURE.SUBITEM.SWIMLANE);
     // if not null save id. If null, a fallback subSwimlane should be used
     if (subItemCategory) {
       subItemCategoryId = subItemCategory.getId();
       subItemCategoryName = subItemCategory.getName();
     }
 
     if (baseItem.subSwimlaneObject.hasOwnProperty(subItemCategoryId)) {
       // if the subSwimlane for subItem exist get this subSwimlane
       subSwimlane = baseItem.subSwimlaneObject[subItemCategoryId];
     } else {
       // if there is no subSwimlane -> create the subSwimlane
       subSwimlane = {
         name: subItemCategoryName,
         subItemElements: []
       }
       baseItem.subSwimlaneObject[subItemCategoryId] = subSwimlane;
     }
     // create the subItem object and push to subSwimlane
     let createdSubItem = subItemElement(subItem);
 
     if (createdSubItem === null) {
       return;
     }
 
     subSwimlane.subItemElements.push(createdSubItem);
   });
 }
 
 /**
  * create roadmap output
  * @param {import("../templates/data-model").Configuration} config
  * @param {import("../templates/data-model").QualityLine[]} qualityLines
  * @param {Object} groups
  * @returns
  */
 function roadmap(config, qualityLines, groups) {
   let groupArray = [];
   for (let key in groups) {
     for (let keys in groups[key].swimlaneObject) {
 
       cplace.each(groups[key].swimlaneObject[keys].baseItemElements, function (baseItemElement) {
         for (let subSwimlaneKey in baseItemElement.subSwimlaneObject) {
           let subSwimlane = JSON.stringify(baseItemElement.subSwimlaneObject[subSwimlaneKey]);
           baseItemElement.subSwimlanes.push(JSON.parse(subSwimlane));
         }
       });
 
       let swimlane = JSON.stringify(groups[key].swimlaneObject[keys]);
       groups[key].swimlanes.push(JSON.parse(swimlane));
     }
     groupArray.push(groups[key])
   }
   return {
     configuration: config,
     qualityLines: qualityLines,
     groups: groupArray
   }
 }
 
 /**
  * create baseItemElement
  * @param {Page} page
  */
 function baseItemElement(page) {
   if (page === null) {
     return null;
   }
 
   let startDate = null;
   let endDate = null;
 
   startDate = page.get(ROADMAP_STRUCTURE.BASEITEM.START_DATE);
   endDate = page.get(ROADMAP_STRUCTURE.BASEITEM.END_DATE);
 
   // if start or end date not set -> nothing to do
   if (startDate === null || endDate === null) {
     return null;
   }
 
   const labelPrefix = page.get(ROADMAP_STRUCTURE.BASEITEM.LABEL_PREFIX);
   let baseItem = {
     name:page.getName(),
     id: page.getId(),
     url: page.getUrl(),
     startDate: startDate.toString('MM-dd-yyyy'),
     endDate: endDate.toString('MM-dd-yyyy'),
     subSwimlanes: [],
     subSwimlaneObject: {}
   }
 
   if (config !== null) {
 
     if (config.colorMap !== null && config.colorMap.baseItem !== null && config.colorMap.baseItem.length > 0) {
       const attribute = config.colorMap.baseItem[0].attribute;
       // baseItem.color = page.get(attribute).get('cf.cplace.solution.roadmap.color');
       baseItem.color = page.get(attribute);
     }
     if (config.hatchingMap !== null && config.hatchingMap.baseItem !== null && config.hatchingMap.baseItem.length > 0) {
       const attribute = config.hatchingMap.baseItem[0].attribute;
       baseItem.hatching = page.get(attribute);
     }
 
     if (config.iconMap !== null && config.iconMap.baseItem !== null && config.iconMap.baseItem.length > 0) {
       const attribute = config.iconMap.baseItem[0].attribute;
       baseItem.icon = page.get(attribute);
     }
   }
 
   return baseItem;
 }
 
 /**
  * create subItemElement
  * @param {Page} page
  */
 function subItemElement(page) {
   cplace.log('subItemElement'+page)
   if (page === null) {
     return null;
   }
 
   let startDate = page.get(ROADMAP_STRUCTURE.SUBITEM.START_DATE);
   let endDate = page.get(ROADMAP_STRUCTURE.SUBITEM.END_DATE);
 
   // if start or end date not set -> nothing to do
   if (startDate === null || endDate === null) {
     return null;
   }
 
   let subItem = {
     name: page.getName(),
     id: page.getId(),
     url: page.getUrl(),
     startDate: startDate.toString('MM-dd-yyyy'),
     endDate: endDate.toString('MM-dd-yyyy'),
   }
 
   if (config !== null) {
 
     if (config.colorMap !== null && config.colorMap.subItem !== null && config.colorMap.subItem.length > 0) {
       const attribute = config.colorMap.subItem[0].attribute;
       subItem.color = page.get(attribute);
     }
     if (config.hatchingMap !== null && config.hatchingMap.subItem !== null && config.hatchingMap.subItem.length > 0) {
       const attribute = config.hatchingMap.subItem[0].attribute;
       subItem.hatching = page.get(attribute);
     }
     if (config.iconMap !== null && config.iconMap.subItem !== null && config.iconMap.subItem.length > 0) {
       const attribute = config.iconMap.subItem[0].attribute;
       subItem.icon = page.get(attribute);
     }
   }
   cplace.log('subItem'+subItem)
   return subItem;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       QUALITY LINES.                                 //
 //--------------------------------------------------------------------------------------//
 
 function createQualityLines(page) {
   let result = [];
 
   cplace.each(getPages(ROADMAP_STRUCTURE.QUALITY_LINES.TYPE, page), function (event) {
     let date = event.get(ROADMAP_STRUCTURE.QUALITY_LINES.DATE);
     let isRoadmapRelevant = true //!!event.get(ROADMAP_STRUCTURE.QUALITY_LINES.IS_ROADMAP_RELEVANT)
 
     if (date === null || !isRoadmapRelevant) {
       return;
     }
 
     result.push({
       name: event.getName(),
       date: date.toString('MM-dd-yyyy')
     });
   });
 
   return result;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION.                                 //
 //--------------------------------------------------------------------------------------//
 
 function loadConfiguration(enableLinks, branding, page) {
   let result = {
     hatchingMap: {
       baseItem: [],
       subItem: []
     },
     colorMap: {
       baseItem: [],
       subItem: []
     },
     iconMap: {
       baseItem: [],
       subItem: []
     },
     groupsOpen: [],
     enableLinks: enableLinks,
     branding: branding
   };
 
   cplace.each(getPages(ROADMAP_STRUCTURE.CONFIGURATION.TYPE, page), function (configurationPage) {
     let configurationType = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.TYPE_MAP);
     let itemType = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.ITEM_TYPE);
     let displayedValue = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.DISPLAYED_VALUE);
     let attribute = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.ATTRIBUTE);
     let values = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.PROPERTY_KEY_VALUES);
 
     result[configurationType][itemType].push({
       key: displayedValue,
       value: values,
       attribute: attribute
     });
   });
 
   return result;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       HELPER FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//
 
 function getPages(type, page) {
   return new Search()
     .setEmbeddingEntity(page)
     .add(Filters.embeddingSpace())
     .add(Filters.type(type))
     .findAllPages();
 }
 
 /**
  * Log to cplace
  * @param {any} text
  */
 function log(text) {
   if (!DEBUG) {
     return
   }
   let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;
 
   cplace.log(logOutput);
 }
 
 
 function timeSinceStart(msg) {
   if (!DEBUG) {
     return
   }
   let now = new Date().getTime();
   cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
   LAST_TIME = now;
 }

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#15 - Funnel";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#25 - Analyzing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#35 - Backlog";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#45 - Implementing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#55 - Validating";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#65 - Deploying";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#75 - Releasing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#15 - Funnel";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#25 - Analyzing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#35 - Backlog";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#45 - Implementing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#55 - Validating";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#65 - Deploying";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

/** @type {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} */
const STATE = "#75 - Releasing";

const WIP_MAP = /** @type {const} */ ({
    "#15 - Funnel": "cf.cplace.solution.safe.funnelWIPLimit",
    "#25 - Analyzing": "cf.cplace.solution.safe.analyzingWIPLimit",
    "#35 - Backlog": "cf.cplace.solution.safe.backlogWIPLimit",
    "#45 - Implementing": "cf.cplace.solution.safe.implementingWIPLimit",
    "#55 - Validating": "cf.cplace.solution.safe.validatingWIPLimit",
    "#65 - Deploying": "cf.cplace.solution.safe.deployingWIPLimit",
    "#75 - Releasing": "cf.cplace.solution.safe.releasingWIPLimit",
});

const SOLUTION = /** @type {const} */({
    TYPE: "cf.cplace.solution.safe.solution",
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        STATE: "cf.cplace.solution.safe.state",
    },
});

function main() {
    const solution = getSolution(embeddingPage.getSpaceId());
    /** @type {number | null} */
    const wipLimit = solution.get(WIP_MAP[STATE]);

    if (wipLimit === null) {
        // No WIP limit set
        return "-";
    }

    const numberOfCapabilities = getNumberOfCapabilitiesInState(solution, STATE);

    return `${numberOfCapabilities.toString(10)}/${wipLimit.toString(10)}`;
}

/**
 * Get the solution of the embedding workspace
 * @param {string} workspace
 * @returns {Page<'cf.cplace.solution.safe.solution'>}
 */
function getSolution(workspace) {
    const result = new Search().add(Filters.type(SOLUTION.TYPE)).add(Filters.space(workspace)).findAllPages();
    return Iterables.getFirst(result, null);
}

/**
 * Get the number of capabilities of the solution in the provided state
 * @param {Page<'cf.cplace.solution.safe.solution'>} solution
 * @param {CplaceTypes['cf.cplace.solution.safe.capability']["cf.cplace.solution.safe.state"]} state
 */
function getNumberOfCapabilitiesInState(solution, state) {
    const numberOfCapabilities = new Search()
        .add(Filters.space(solution.getSpaceId()))
        .add(Filters.type(CAPABILITY.TYPE))
        .add(Filters.customAttribute(CAPABILITY.ATTR.STATE).eq(state))
        .getHitCount();
    return numberOfCapabilities;
}


return main()

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

cplace.setLogName('HC: Prioritization Matrix')

/**
 * Define colors for the chart
 */
 const CHART_LABELS = {
   XAXIS_TITLE: '<- Cost of Delay ->',
   YAXIS_TITLE: '<- Job Duration ->'
 }
 const CHART_COLORS = {
  PLOTLINES: '#b5b5b5',
  DONT_DO_TEXT: '#EC7E80',
  DO_NEXT_TEXT: '#3A4454',
  DO_LATER_TEXT: '#313C4E',
  DO_NOW_TEXT:  '#7EC587',
  ENABLER: '#E6D32B',
  CAPABILITY: '#0CA2D4',
}

const CAPABILITY = {
    TYPE:'cf.cplace.solution.safe.capability',
    ATTR: {
      JOB_SIZE: 'cf.cplace.solution.safe.jobSize',
      BUSINESS_VALUE: 'cf.cplace.solution.safe.businessValue',
      TIME_CRITICALITY: 'cf.cplace.solution.safe.timeCriticality',
      RISK_REDUCTION: 'cf.cplace.solution.safe.riskReduction',
      WSJF: 'cf.cplace.solution.safe.wsjf',
      STATUS: '',
      TYPE: 'cf.cplace.solution.safe.capabilityType'
    },
    ENUM_STATUS: {

    },
    ENUM_TYPE: {
        ENABLER: 'enabler',
        CAPABILITY: 'capability'
    }
  }

/*//find colors for types
let typeColorConfigurations = new Search()
  .add(Filters.type('de.visualistik.visualRoadmap.visualRoadmapConfiguration'))
  .add(Filters.customAttribute('de.visualistik.visualRoadmap.configurationTypeMap').eq('colorMap'))
  .add(Filters.customAttribute('de.visualistik.visualRoadmap.propertyKey').eq('cf.cplace.solution.safe.type'))
  .findAllPages();

  cplace.each(typeColorConfigurations, configuration => {
    let values = configuration.get('de.visualistik.visualRoadmap.propertyKeyValues');
    let color = configuration.get('de.visualistik.visualRoadmap.displayedValue');
    if (values.indexOf('#15 - Enabler') > -1){
      CHART_COLORS.ENABLER = color
    }
    if (values.indexOf('#25 - Epic') > -1){
      CHART_COLORS.EPIC = color
    }
  })*/

  const language = cplace.utils().getCurrentUser().getUserLanguage();

/**
 * create serie and data items
 */
let serie = createBubbleSerie()
let maxBubbleSize = 0;

cplace.each(pages, function (capability) {
    let z = capability.get(CAPABILITY.ATTR.WSJF);
    if (z) {
        let time = capability.get(CAPABILITY.ATTR.TIME_CRITICALITY);
        let business = capability.get(CAPABILITY.ATTR.BUSINESS_VALUE);
        let risk = capability.get(CAPABILITY.ATTR.RISK_REDUCTION);
        let x = time + business + risk;
        let jobSize = capability.get(CAPABILITY.ATTR.JOB_SIZE);
        let y = switchSize(jobSize);
        let type = capability.get(CAPABILITY.ATTR.TYPE);
    
        if (z > maxBubbleSize) {
            maxBubbleSize = z;
        }
        serie.data.push(createDataItem(capability, x, y, z, type));
    }
});

serie.data.push(createHiddenDataItem(0, 0, maxBubbleSize));
serie.data.push(createHiddenDataItem(0, 20, maxBubbleSize));
serie.data.push(createHiddenDataItem(60, 0, maxBubbleSize));
serie.data.push(createHiddenDataItem(60, 20, maxBubbleSize));

let xAxisPlotLines = [];
let yAxisPlotLines = [];

// Create quadrant divider
xAxisPlotLines.push(createQuadrantPlotline(30));
yAxisPlotLines.push(createQuadrantPlotline(10));

// Create labels for each quadrant
let label = createLabelPlotline('DON\'\T DO', 0, 'left',  CHART_COLORS.DONT_DO_TEXT, -10, 37);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO NEXT', 0, 'right',  CHART_COLORS.DO_NEXT_TEXT, 0, 37);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO LATER', 20, 'left',  CHART_COLORS.DO_LATER_TEXT, -10, -25);
yAxisPlotLines.push(label);
label = createLabelPlotline('DO NOW', 20, 'right',  CHART_COLORS.DO_NOW_TEXT, 0, -25);
yAxisPlotLines.push(label);

/**
 * BUILD CHART
 */
let config = {
    chart: {
        type: 'bubble',
    },

    legend: {
        enabled: false
    },

    title: {
        text: ''
    },

    xAxis: {
        title: {
            text: CHART_LABELS.XAXIS_TITLE
        },
        lineWidth: 0,
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        tickWidth: 0,
        tickInterval: 5,
        startOnTick: false,
        endOnTick: false,
        showLastLabel: true,
        plotLines: xAxisPlotLines
    },

    yAxis: {
        title: {
            text: CHART_LABELS.YAXIS_TITLE
        },
        lineWidth: 0,
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        tickWidth: 0,
        tickInterval: 5,
        startOnTick: false,
        endOnTick: false,
        plotLines: yAxisPlotLines
    },

    tooltip: {
        useHTML: true,
        headerFormat: '',
        pointFormat: '{point.tooltip}',
        style: {
            pointerEvents: 'auto'
        }
    },

    plotOptions: {
        bubble: {
            dataLabels: {
                enabled: false,
            },
            minSize: 1,
            maxSize: 50
        }
    },
    series: [serie]
};

return config;

/**
 * ================
 * HELPER FUNCTIONS
 * ================
 */

function createBubbleSerie() {
    return {
        data: [],
        marker: {
            fillOpacity: 0.13,
            lineWidth: 0
        }
    };
}

function createDataItem(page, x, y, z, type) {
    let color = getColor(type);
    let rgba = hexToRGBA(color, 0.1);
    return {
        name: page.getName(),
        url: page.getUrl(),
        x: x,
        y: y,
        z: z,
        tooltip: getTooltip(page),
        color: rgba,
        marker: {
            lineColor: color,
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
                textOutline: false,
                color: color
            }
        }
    }
}

function getTooltip(page) {
    let tooltip = '<a style="font-weight:bold" href=' + page.getUrl()+ 'target="_blank">' + page.getName() + '</a><br/>'+
    'Time Criticality: ' + page.get(CAPABILITY.ATTR.TIME_CRITICALITY) + '<br/>' +
    'Business Value: ' + page.get(CAPABILITY.ATTR.BUSINESS_VALUE) + '<br/>' +
    'Risk Reduction: ' + page.get(CAPABILITY.ATTR.RISK_REDUCTION) + '<br/>' +
    'Job Size: ' + page.get(CAPABILITY.ATTR.JOB_SIZE) + '<br/>' +
    '<b> WSJF: ' + page.get(CAPABILITY.ATTR.WSJF) + '<br/>';
    //'Status: ' + page.get(FEATURE.ATTR.STATUS, language) + '</b>';
    return tooltip;
}

function createHiddenDataItem(x, y, z) {
    return {
        x: x,
        y: y,
        z: z,
        enableMouseTracking: false,
        marker: {
            enabled: false
        }
    }
}

function createQuadrantPlotline(value) {
    return {
        color: CHART_COLORS.PLOTLINES,
        dashStyle: 'solid',
        width: 1,
        value: value,
        zIndex: 3
    }
}

function createLabelPlotline(text, value, align, color, xOffset, yOffset) {
    return {
        width: 0,
        value: value,
        zIndex: 3,
        label: {
            text: text,
            align: align,
            style: {
                color: color,
                fontWeight: 'bold'
            },
            x: xOffset,
            y: yOffset
        }
    }
}

function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

function switchSize(size){
    let switchedSize
    switch (size) {
        case 20:
            switchedSize = 1;
            break;
        case 13:
            switchedSize = 8;
            break;
        case 8:
            switchedSize = 13;
            break;
        case 5:
            switchedSize = 16;
            break;
        case 3:
            switchedSize = 18;
            break;
        case 2:
            switchedSize = 19;
            break;
        case 1:
            switchedSize = 20;
            break;
    }
    return switchedSize;
}

function getColor(type){
    switch (type) {
        case CAPABILITY.ENUM_TYPE.ENABLER:
            return CHART_COLORS.ENABLER;
        case CAPABILITY.ENUM_TYPE.CAPABILITY:
            return CHART_COLORS.CAPABILITY
        default: 
            return '#b5b5b5'
    }
}

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.currentPiDashboard
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the confidence vote of a single PI which is passed in via search results as as bar chart
 */

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

const red = "#FF0000";
const orange = "#FFA500";
const yellow = "#FFFF00";
const lightgreen = "#9ACD32";
const green = "#008000";

function main() {
    // @ts-ignore
    const confidenceVote = Iterables.getFirst(pages, null);

    if (!confidenceVote) {
        return;
    }

    const oneFinger = confidenceVote.get(CONFIDENCE_VOTE.ATTR.ONE_FINGER);
    const twoFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.TWO_FINGERS);
    const threeFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.THREE_FINGERS);
    const fourFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FOUR_FINGERS);
    const fiveFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FIVE_FINGERS);
    const totalFingers = oneFinger + 2 * twoFingers + 3 * threeFingers + 4 * fourFingers + 5 * fiveFingers;
    const numberOfConvidenceVotes = oneFinger + twoFingers + threeFingers + fourFingers + fiveFingers;

    const averageConfidenceVote = totalFingers / numberOfConvidenceVotes;

    // Create the chart
    const config = {
        chart: {
            type: "pie",
        },
        title: {
            text: averageConfidenceVote.toFixed(1),
            align: "center",
            verticalAlign: "middle",
            margin: 0,
            useHtml: true,
            style: {
                fontSize: "3vw",
                margin: 0,
                padding: 0,
                fontWeight: "bold",
                lineHeight: 1,
            },
        },
        subtitle: {
            text: "Average",
            align: "center",
            verticalAlign: "middle",
            y: -30,
            style: {
                fontWeight: "normal",
                fontSize: "1vw",
            },
        },
        legend: {
            enabled: false,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontWeight: "normal",
            },
        },
        plotOptions: {
            pie: {
                borderWidth: 10,
                cursor: "pointer",
                dataLabels: {
                    enabled: false,
                },
                colors: [red, orange, yellow, lightgreen, green],
            },
        },
        series: [
            {
                name: "Count",
                cursor: "pointer",
                innerSize: "70%",
                data: [
                    { name: "One Finger", y: oneFinger },
                    { name: "Two Fingers", y: twoFingers },
                    { name: "Three Fingers", y: threeFingers },
                    { name: "Four Fingers", y: fourFingers },
                    { name: "Five Fingers", y: fiveFingers },
                ],
            },
        ],
    };
    return config;
}

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

/**
 * Displays all items grouped by Solution and PI.
 * Dependencies between items are displayed as a line.
 *
 * Milestones that lie within the period of the PIs are displayed in a separate row.
 *
 * @author Christopher Wölfle
 * @version 15.03.2023
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName("highcharts-solution-dependency-map");

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY_HEIGHT = 0.3;

const TYPE_CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        TYPE: "cf.cplace.solution.safe.capabilityType",
        FEATURES: "cf.cplace.solution.safe.feature",
        PROGRAM: "cf.cplace.solution.safe.program",
        SOLUTION: "cf.cplace.solution.safe.solution.reference",
        PROGRAM_INCREMENT: "cf.cplace.solution.safe.programIncrement",
        EPIC: "cf.cplace.solution.safe.portfolioEpic",
        ITERATIONS: "cf.cplace.solution.safe.iteration",
    },
    ENUM: {
        TYPE: {
            CAPABILITY: "capability",
            ENABLER: "enabler",
        },
    },
});

const TYPE_MILESTONE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        DATE: "cf.cplace.solution.safe.date",
        TYPE: "cf.cplace.solution.safe.type",
        RELEVANT_FOR: "cf.cplace.solution.safe.relevantFor", // refers to Program
    },
    ENUM: {
        TYPE: {
            PI_MILESTONE: "#15 - PI Meilenstein",
            FIXED_DATE: "#25 - Fixiertes Datum",
            LEARNING_MILESTONE: "#35 - Learning Meilenstein",
        },
    },
});

const TYPE_DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        B: "cf.cplace.solution.safe.predecessor",
        TYPE: "cf.cplace.solution.safe.type",
        STATUS: "cf.cplace.solution.safe.status",
        DESCRIPTION: "cf.cplace.solution.safe.description",
    },
    ENUM: {
        TYPE: {
            RELATED_TO: "related to",
            BLOCKED_BY: "blocked by",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            RESOLVED: "35 - resolved",
        },
    },
});


const TYPE_ITERATION = /** @type {const} */ ({
    TYPE: 'cf.cplace.solution.safe.iteration',
    ATTR: {
        TITLE: 'cf.cplace.solution.safe.title',
        PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
        START: 'cf.cplace.solution.safe.startDate',
        END: 'cf.cplace.solution.safe.endDate',
        PREDECESSOR: 'cf.cplace.solution.safe.predecessor' // Iteration
    }
});

const COLORS = {
    INACTIVE: "#88bbee",
    ACTIVE: "#4488aa",
    DEPEND: "#888888",
    DEPEND_HIGHLIGHT: "#A21622",
    DEPEND_RESOLVED: "#19ad48",
    SAFE_MILESTONE: "#3D8F8C",
    RELEASE: "#366C81",
    MILESTONE_PLOTBAND: "#E2F3F2",
    RELEASE_PLOTBAND: "#E2EEF3",
    CAPABILITY: "#0aa5ff",
    ENABLER: "#ffc80c",
    TODAY_PLOTLINE: "lightgrey",
};

const CATEGORY = {
    SAFE_MILESTONE: "SAFe Milestones",
};

const ROW_SIZE = {
    PERIOD: 2,
    ITEM: 1,
};

const HEIGHTS = {
    HEADER: 40,
    ITEM: 25,
};

const MAX_DATA_LABEL_LENGTH = 25;
const DATA_LABEL_PADDING = 0.05;

const SEPARATOR = {
    V: " //VSEP// ",
    H: " --HSEP-- ",
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

function main() {
    const ctx = fetchData(Array.from(pages));

    if (ctx.capabilities.length === 0 || ctx.periods.length === 0) {
        return {
            title: {
                text: null,
            },
        };
    }

    generateMatrix(ctx);

    const chart = generateChartConfig(ctx);

    return chart;
}
// @ts-ignore
return main();
//--------------------------------------------------------------------------------------//
//                                    Data Fetching                                     //
//--------------------------------------------------------------------------------------//

/**
 * Fetches all required data
 * @param {Page<any>[]} searchResults
 * @returns {Context<"cf.cplace.solution.safe.iteration">}
 */
function fetchData(searchResults) {
    /** @type {Page<'cf.cplace.solution.safe.capability'>[]} */
    const capabilities = searchResults.filter((page) => page.getBuiltinFeatureValue("customType") === TYPE_CAPABILITY.TYPE);
    const missinCapabilities = getMissingCapabilities(capabilities);
    capabilities.push(...missinCapabilities);
    log(`Added ${missinCapabilities.length} missing items that the input items depend on.`);
    log(capabilities.length)
    const periods = getAllPeriods(capabilities);
    log("Periods: " + periods.length);

    const programs = getPrograms(capabilities);
    const milestones = getSafeMilestones(periods);
    const dependencies = getDependencies(capabilities);

    const capabilitiesById = capabilities.reduce((acc, capability) => {
        acc[capability.getId()] = { x: 0, y: 0, capability };
        return acc;
    }, {});

    const ctx = {
        matrixData: undefined,
        capabilities,
        capabilitiesById,
        periods,
        programs,
        milestones,
        dependencies,
        maxHeight: 1,
    };
    return ctx;
}

/**
 * Searches dependencies of the capabilities and returns those capabilities that are not yet included
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @return {Page<'cf.cplace.solution.safe.capability'>[]}
 */
function getMissingCapabilities(capabilities) {
    // @ts-ignore
    const newCapabilities = new HashSet();
    capabilities.forEach((item) => {
        // @ts-ignore
        const dependencies = Array.from(item.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []);
        dependencies.forEach((itemDependency) => {
            const capability = itemDependency.get(TYPE_DEPENDENCY.ATTR.B);
            if (isPageOfType(capability, TYPE_CAPABILITY.TYPE)) {
                newCapabilities.add(capability);
            }
        });
    });
    return Array.from(newCapabilities).filter((a) => !capabilities.some((b) => b.getId() === a.getId()));
}

/**
 * Determines the periods used as columns of the board
 * @param {Page<"cf.cplace.solution.safe.capability">[]} items Capabilities
 * @returns {Page<"cf.cplace.solution.safe.iteration">[]} Iterations in chronological order
 */
function getAllPeriods(items) {
    // @ts-ignore
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
    /** @type {Page<'cf.cplace.solution.safe.iteration'>[]} */
    const periods = Array.from(periodsSet);
    return periods.sort((a, b) => a.get(TYPE_ITERATION.ATTR.START).isBefore(b.get(TYPE_ITERATION.ATTR.START)) ? -1 : 1);
}
/**
 * Gets all dependencies of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities Capabilities
 * @returns {Page<'cf.cplace.solution.safe.dependency'>[]} PIs in chronological order
 */
function getDependencies(capabilities) {
    const dependencies = [];
    capabilities.forEach((capabilitiy) => {
        const itemDependencies = Array.from(
            // @ts-ignore
            capabilitiy.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []
        );
        dependencies.push(...itemDependencies);
    });
    return dependencies;
}
/**
 * @param {Page<"cf.cplace.solution.safe.iteration">[]} iterations
 * @returns
 */
function getSafeMilestones(iterations) {
    const periodStartDate = iterations.length > 0 ? iterations[0].get(TYPE_ITERATION.ATTR.START) : new DateTime();
    const periodEndDate = iterations.length > 0 ? iterations[iterations.length - 1].get(TYPE_ITERATION.ATTR.END) : new DateTime();
    const safeMilestoneSearch = new Search();
    safeMilestoneSearch.add(Filters.embeddingSpace());
    safeMilestoneSearch.add(Filters.type(TYPE_MILESTONE.TYPE));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).gte(periodStartDate));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).lte(periodEndDate));
    safeMilestoneSearch.addBuiltinAttributeSort(TYPE_MILESTONE.ATTR.DATE, true);
    const safeMilestones = safeMilestoneSearch.findAllPages();
    // @ts-ignore
    return Array.from(safeMilestones);
}
/**
 * Get all the programs of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @returns {Page<'cf.cplace.solution.safe.program'>[]}
 */
function getPrograms(capabilities) {
    // @ts-ignore
    const programSet = new HashSet();
    capabilities.forEach(item => {
        const programs = item.get(TYPE_CAPABILITY.ATTR.PROGRAM);
        if (!programs) {
            return;
        }
        cplace.each(programs, program => programSet.add(program));
    });
    /** @type {Page<'cf.cplace.solution.safe.program'>[]} */
    const programms = Array.from(programSet)
    return programms.sort((a,b) => a.getName().localeCompare(b.getName()));
}

/**
 * Generate the matrix
 * @param {Context<"cf.cplace.solution.safe.iteration">} ctx
 */
function generateMatrix(ctx) {
    /** @type {MatrixData<"cf.cplace.solution.safe.iteration">} */
    const matrixData = {
        headerRow: ctx.periods.map((pi, index) => ({ programIncrement: pi, x: index + 2, y: 1 })),
        milestoneRow: ctx.milestones,
        programms: {},
        capabilities: {},
    };
    let yOffset = 3;
    ctx.programs.forEach((program) => {
        let maxNumberOfCapabilitiesPerProgram = 0;

        const capabilitiesByPi = ctx.periods.map((period, indexPI) => {
            const filteredCapabilities = ctx.capabilities.filter((capability) => {
                const programIds = capability.get(TYPE_CAPABILITY.ATTR.PROGRAM)?.map((p) => p.getId()) || [];
                // Get all capabilities that are associated to the current programm & the current program increment
                return programIds.includes(program.getId()) && getLastIteration(capability)?.getId() === period.getId();
            });
            // Check if the number of capabilities for this PI is the largest
            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }

            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        // Iterate over the programm Increments to put the capabilities in the right place
        matrixData.programms[program.getName()] = {
            program,
            data: capabilitiesByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: program.getId(),
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: program.getId(),
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight; //+ (rowHeight - 1) / 2;
    });

    const capabilitiesWithoutProgram = ctx.capabilities.filter(
        (capability) =>
            // @ts-ignore
            !capability.get(TYPE_CAPABILITY.ATTR.PROGRAM) || capability.get(TYPE_CAPABILITY.ATTR.PROGRAM).length === 0
    );

    // Check if there are any capabilities without a programm and add them to the matrix
    if (capabilitiesWithoutProgram.length > 0) {
        let maxNumberOfCapabilitiesPerProgram = 0;
        // Ad capabilities without a program
        const capabilitiesWithoutProgrammByPi = ctx.periods.map((programIncrement) => {
            const filteredCapabilities = capabilitiesWithoutProgram.filter(
                (capability) => getLastIteration(capability)?.getId() === programIncrement.getId()
            );

            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }
            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        matrixData.programms["w/o Program"] = {
            program: null,
            data: capabilitiesWithoutProgrammByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesWithoutProgrammByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: "w/o Program",
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: "w/o Program",
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight;
    }
    ctx.maxHeight = yOffset;
    ctx.matrixData = matrixData;
}
/**
 *
 * @param {Context<"cf.cplace.solution.safe.iteration">} ctx
 */
function transformMatrixDataIntoSeries(ctx) {
    const matrixData = ctx.matrixData;

    const series = [];

    if (!matrixData) {
        return series;
    }

    // 1. Add PIs
    series.push(
        ...matrixData.headerRow.map((headerEntry, index) => {
            return {
                name: headerEntry.programIncrement.getName(),
                colsize: 1,
                rowsize: 1,
                dataLabels: { rotation: 0, color: "#000000" },
                enableMouseTracking: false,
                data: [
                    {
                        x: headerEntry.x,
                        y: headerEntry.y,
                        value: 1,
                        name: `<a href="${headerEntry.programIncrement.getUrl()}">${headerEntry.programIncrement.getName()}</a>`,
                        color: "#dddddd",
                    },
                ],
            };
        })
    );

    // 2. Add Milestones
    series.push({
        name: "SAFe Milestones",
        colsize: 1,
        rowsize: 1,
        dataLabels: { rotation: 0, color: "#000000" },
        enableMouseTracking: false,
        data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
    });

    let top = true;
    const safeMilestoneData = [];

    matrixData.milestoneRow.forEach((safeMilestone) => {
        const safeMilestoneName = safeMilestone.getName();
        const safeMilestoneDate = safeMilestone.get(TYPE_MILESTONE.ATTR.DATE);
        // @ts-ignore
        const safeMilestoneDateString = safeMilestoneDate?.toString("dd.MM.yyyy");
        // get milestone Position
        // @ts-ignore
        const safeMilestonePosition = getDatePosition(safeMilestoneDate.getMillis(), ctx);
        // add milestone only if position is not null
        if (safeMilestonePosition > 0) {
            safeMilestoneData.push({
                x: safeMilestonePosition,
                y: 2,
                name: '<a href="' + safeMilestone.getUrl() + '">' + safeMilestoneName + "</a>",
                value: safeMilestoneDateString,
                dataLabels: {
                    verticalAlign: top ? "top" : "bottom",
                },
            });
            top = !top;
        }
    });

    series.push({
        type: "scatter",
        lineWidth: 0,
        findNearestPointBy: "xy",
        data: safeMilestoneData,
        marker: {
            fillColor: COLORS.SAFE_MILESTONE,
        },
    });

    // 3. Add Programms
    let rowHeight = 2.5;
    Object.keys(matrixData.programms).forEach((programName) => {
        const data = matrixData.programms[programName];
        // Add the Programms
        series.push({
            name: programName,
            rowsize: data.rowHeight,
            dataLabels: { rotation: 0, color: "#000000" },
            enableMouseTracking: false,
            data: [
                {
                    x: data.x,
                    y: data.y,
                    value: 1,
                    name: `<a href=\"${data.program?.getUrl() || "wip"}\">${programName}</a>`,
                    color: "#dddddd",
                },
            ],
        });
        // Add the capabilities of the programm
        data.data.map((capabilitiesByPI, indexPI) => {
            series.push({
                name: programName + indexPI,
                rowsize: CAPABILITY_HEIGHT,
                colsize: 0.8,
                dataLabels: { rotation: 0, color: "#000000", overflow: 'justify' },
                enableMouseTracking: false,
                data: capabilitiesByPI.map((capabilityId, indexCapability) => {
                    const capabilityData = matrixData.capabilities[capabilityId].filter((c) => c.programId === (data.program ? data.program.getId() : "w/o Program"))[0];
                    const capability = capabilityData.capability;
                    const isEnabler = capability.get(TYPE_CAPABILITY.ATTR.TYPE) === "enabler";
                    return {
                        x: capabilityData.x,
                        y: capabilityData.y,
                        value: 1,
                        name: `<a href=\"${capability.getUrl() || "wip"}\">${limitStringSize(capability.getName(), 40)}</a>`,
                        color: isEnabler ? "#ffc80c" : "#0aa5ff",
                    };
                }),
            });
        });
        rowHeight += data.rowHeight;
    });

    // 4. Add Dependencies
    ctx.dependencies.forEach((dependency) => {
        const from = dependency.get(TYPE_DEPENDENCY.ATTR.B);
        const to = dependency.get(TYPE_DEPENDENCY.ATTR.A);
        if (!from || !to) {
            return;
        }
        const fromId = from.getId();
        const toId = to.getId();

        const fromCapabilities = ctx.matrixData?.capabilities[fromId];
        const toCapabilities = ctx.matrixData?.capabilities[toId];

        if (!fromCapabilities) {
            return;
        }
        const maxValue = ctx.maxHeight;
        fromCapabilities.forEach((fromCapabilityData) => {
            let x1 = fromCapabilityData.x;
            let y1 = fromCapabilityData.y;
            // y1 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

            if (!toCapabilities) {
                return;
            }
            toCapabilities.forEach((toCapabilityData) => {
                let x2 = toCapabilityData.x;
                let y2 = toCapabilityData.y;
                // y2 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

                const description = dependency.get(TYPE_DEPENDENCY.ATTR.DESCRIPTION) || " ";
                const dependencyType = dependency.get(TYPE_DEPENDENCY.ATTR.TYPE);
                const status = dependency.get(TYPE_DEPENDENCY.ATTR.STATUS);
                const dependencySeries = {
                    type: "spline",
                    name: "<b>" + to.getName() + "</b><br/>relates to:<br/>" + from.getName() + "<br>" + description,
                    lineWidth: 1.5,
                    color: COLORS.DEPEND,
                    dashStyle: "shortdot",
                    findNearestPointBy: "xy",
                    data: [
                        { x: x1 + 0.4, y: y1 },
                        { x: x1 + 0.45, y: y1 === y2 ? y1 + 0.02 : y1 },
                        { x: x2 - 0.45, y: y1 === y2 ? y2 - 0.02 : y2 },
                        { x: x2 - 0.4, y: y2, marker: { enabled: true, symbol: "diamond" } },
                    ],
                };
                if (dependencyType === TYPE_DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
                    dependencySeries.name = "<b>" + to.getName() + "</b><br/>blocked by:<br/>" + from.getName() + "<br>" + description;
                    // @ts-ignore
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

    return series;
}

//--------------------------------------------------------------------------------------//
//                                     Chart Config                                     //
//--------------------------------------------------------------------------------------//

/**
 *
 * @param {Context<"cf.cplace.solution.safe.iteration">} ctx
 */
function generateChartConfig(ctx) {
    if (!ctx.matrixData) {
        return;
    }
    const series = transformMatrixDataIntoSeries(ctx);
    // @ts-ignore
    const today = new DateTime();
    let todayPosition = getDatePosition(today.getMillis(), ctx);

    return {
        chart: {
            type: "heatmap",
            marginTop: 0,
            marginBottom: 0,
            plotBorderWidth: 0,
            scrollablePlotArea: {
                minHeight: 400,
                minWidth: 1000,
            },
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: [],
            title: null,
            gridLineWidth: 0,
            lineWidth: 0,
            labels: {
                enabled: false,
            },
            plotLines: [
                {
                    dashStyle: "dash",
                    color: COLORS.TODAY_PLOTLINE,
                    width: 2,
                    value: todayPosition,
                    zIndex: 1,
                },
            ],
        },
        yAxis: {
            categories: [],
            title: null,
            gridLineWidth: 1,
            tickInterval: 1,
            lineWidth: 0,
            min: 1,
            max: ctx.maxHeight,
            labels: {
                enabled: false,
            },
            reversed: true,
            scrollbar: {
                enabled: true,
            },
            plotBands: [
                {
                    color: COLORS.MILESTONE_PLOTBAND,
                    borderColor: "white",
                    borderWidth: 2,
                    from: 1.5,
                    to: 2.5,
                    zIndex: 0,
                },
                // {
                //     color: COLORS.RELEASE_PLOTBAND,
                //     borderColor: 'white',
                //     borderWidth: 2,
                //     from: 1.5,
                //     to: 2.5,
                //     zIndex: 0
                // }
            ],
        },
        colors: ["#D5001C", "#92D050"],
        colorAxis: {
            dataClassColor: "category",
            dataClasses: [
                {
                    to: 0.5,
                },
                {
                    from: 0.5,
                },
            ],
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
                borderColor: "#ffffff",
                borderWidth: 2,
                dataLabels: {
                    allowOverlap: false,
                    inside: true,
                    crop: true,
                    overflow: "justify",
                    position: "left",
                    shape: "circle",
                    enabled: true,
                    color: "#000000",
                    format: "{point.name}",
                    style: {
                        textOutline: "none",
                        textOverflow: "clip",
                    },
                },
                stickyTracking: false,
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b>",
                    findNearestPointBy: "xy",
                },
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
            },
            spline: {
                tooltip: {
                    headerFormat: "{series.name}",
                    pointFormat: "",
                    findNearestPointBy: "xy",
                },
                marker: {
                    enabled: false,
                    fillColor: COLORS.DEPEND,
                    radius: 6,
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
            },
            scatter: {
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b><br>{point.value}",
                    findNearestPointBy: "xy",
                },
                dataLabels: {
                    enabled: true,
                },
                marker: {
                    enabled: true,
                    symbol: "diamond",
                    radius: 10,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: series,
        // series: [
        //     {
        //         name: "PI 22.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 2,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/1bk9kpxn7s36vz3w80ji7t5oo/PI-22.4">PI 22.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 3,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4l6jbaa8qgzinif5qetj499g5/PI-23.1">PI 23.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.2",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 4,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/tksr708c2119mek2pzzopu9qb/PI-23.2">PI 23.2</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.3",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 5,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/i4o8azmi8m0oqvqqu3hejgu80/PI-23.3">PI 23.3</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 6,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/nrymz33xo7ew3x6qcgdk3fl7l/PI-23.4">PI 23.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 24.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 7,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/0wtzrg3m4bdpfhut5xbgiza73/PI-24.1">PI 24.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "SAFe Milestones",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
        //     },
        //     {
        //         name: "Smart Infotainment",
        //         rowsize: 2,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 3.5,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/qg000odouviwwtx4rz2bvaoi8/Smart-Infotainment">Smart Infotainment</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "Powertrain and Safety",
        //         rowsize: 4,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 5 + (4-1)/2,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4flf7a0349c5ximei6olrhife/Powertrain-and-Safety">Powertrain and Safety</a>',
        //                 color: "red",
        //             },
        //         ],
        //     },
        // ],
    };
}

//--------------------------------------------------------------------------------------//
//                                        Utils                                         //
//--------------------------------------------------------------------------------------//

/**
 * Limit string to specified size
 * @param {string} str
 * @param {number} maxSize
 * @returns
 */
function limitStringSize(str, maxSize) {
    if (str.length > maxSize) {
        return str.substring(0, maxSize - 3) + "...";
    }
    return str;
}

/**
 *
 * @param {number} date
 * @param {Context<"cf.cplace.solution.safe.iteration">} ctx
 * @returns
 */
function getDatePosition(date, ctx) {
    let xPosition = 0;
    ctx.periods.every((pi, idx) => {
        // @ts-ignore
        let categoryStartDate = pi.get(TYPE_ITERATION.ATTR.START)?.getMillis();
        // @ts-ignore
        let categoryEndDate = pi.get(TYPE_ITERATION.ATTR.END)?.getMillis();

        // Check whether release date lies in between start and end date of category
        if (categoryStartDate && categoryEndDate && date >= categoryStartDate && date <= categoryEndDate) {
            // find x-Value of category and subtract 0.5 for starting point as offset
            let x = idx + 2 - 0.5;
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

/**
 * Checks if a cplace page is of the specified type
 * @param {Page} page
 * @param {string} type
 * @returns {boolean}
 */
function isPageOfType(page, type) {
    return page.getBuiltinFeatureValue("customType") === type;
}

function getLastIteration(item) {
    const iterations = Array.from(item.get(TYPE_CAPABILITY.ATTR.ITERATIONS));
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

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    const logOutput = typeof text !== "string" ? JSON.stringify(text) : text;
    cplace.log(logOutput);
}

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType ccf.cplace.solution.safe.currentPiDashboard
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

const CURRENT_PI_DASHBOARD = {
    TYPE: "cf.cplace.solution.safe.currentPiDashboard",
    ATTR: {
        CURRENT_PI: "cf.cplace.solution.safe.currentPi"
    }
}

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
        CAPACITY: "cf.cplace.solution.safe.capacity",
    },
});

const CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        ACTUAL_START_DATE: "cf.cplace.solution.safe.actualStartDate",
        ACTUAL_END_DATE: "cf.cplace.solution.safe.actualEndDate",
        PROGRAM_INCREMENT: "cf.cplace.solution.safe.programIncrement",
        STATE: "cf.cplace.solution.safe.state",
    },
    ENUM: {
        STATE: {
            DONE: "#85 - Done",
        },
    },
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


let programIncrement = embeddingPage.get(CURRENT_PI_DASHBOARD.ATTR.CURRENT_PI)

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

totalCapabilities = capabilities.length;
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

//------------------------------------------------------------------------------------------------------

/**
 * LOWCODE BUTTON
 * @customType cf.cplace.solution.safe.solution
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Set previous current and next pi
 */

cplace.setLogName("lowcodebutton_setAsCurrentPi");

const DEBUG = true;

const PROGRAMM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        SOLUTION: "cf.cplace.solution.safe.solution",
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        PERIOD_STATUS: "cf.cplace.solution.safe.periodStatus",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor",
    },
    ENUM: {
        PERIOD_STATUS: {
            DONE: "#15 - done",
            ACTIVE: "#25 - active",
        },
    },
});

const SOLUTION = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.solution",
});

function checkAccess() {
    return true;
}

function call() {
    const newState = {
        "cf.cplace.solution.safe.previousPi": {},
        "cf.cplace.solution.safe.currentPi": {},
        "cf.cplace.solution.safe.nextPi": {},
    };
    /** @type {Page<'cf.cplace.solution.safe.solution'> | null} */
    const solution = Iterables.getFirst(pages, null);
    if (!solution) {
        DEBUG && cplace.log("No solution provided");
        return {
            message: {
                de: "Keine Solution in der Suche gefunden",
                en: "No solution provided via Search",
            },
        };
    }

    const currentPi = solution.get("cf.cplace.solution.safe.currentPi");
    if (!currentPi) {
        DEBUG && cplace.log("No current PI");
        log.logText({
            de: "Kein aktuelles PI gesetzt",
            en: "No current PI",
        });
        return;
    }

    const newPreviousPi = currentPi;
    let newCurrentPi = solution.get("cf.cplace.solution.safe.nextPi");

    if (!newCurrentPi) {
        // If we don't have a next PI specified yet on the solution, we try to get the next PI where the predecessor is set to the current PI (newPreviousPi)
        newCurrentPi = getNextPi(newPreviousPi);
        if (!newCurrentPi) {
            DEBUG && cplace.log("No next PI defined");
            log.logText({
                de: "Kein nächstes PI definiert",
                en: "No next PI defined",
            });
            return;
        }
    }
    const newNextPi = getNextPi(newCurrentPi);

    if (!newNextPi) {
        DEBUG && cplace.log("No next PI defined");
        log.logText({
            de: "Kein übernächstes PI definiert",
            en: "No PI defined after next PI",
        });
        return;
    }
    cplace.log(`New next PI: ${newNextPi.getName()}`);

    newState["cf.cplace.solution.safe.previousPi"] = newPreviousPi;
    newState["cf.cplace.solution.safe.currentPi"] = newCurrentPi;
    newState["cf.cplace.solution.safe.nextPi"] = newNextPi;

    cplace.actions().updatePage(solution, {
        customAttributes: newState,
    });

    // Set new previous PI to done
    cplace.actions().updatePage(currentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.DONE,
        },
    });

    // Set new current PI to active
    cplace.actions().updatePage(newCurrentPi, {
        customAttributes: {
            [PROGRAMM_INCREMENT.ATTR.PERIOD_STATUS]: PROGRAMM_INCREMENT.ENUM.PERIOD_STATUS.ACTIVE,
        },
    });
    cplace.actions().refresh();

    return {
        message: {
            de: `Das nächste PI wurde erfolgreich auf ${newCurrentPi.getName()} gesetzt`,
            en: `Successfully set the current PI to ${newCurrentPi.getName()}`,
        },
    };
}

/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>} programIncrement
 */
function getNextPi(programIncrement) {
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const results = Array.from(
        programIncrement.getIncomingPages(PROGRAMM_INCREMENT.TYPE, PROGRAMM_INCREMENT.ATTR.PREDECESSOR)
    );

    if (results.length > 1) {
        log.logText({
            de: `Es gibt mehr als ein PI (${results
                .map((pi) => pi.getName())
                .join(", ")}) bei dem der Vorgänger ${programIncrement.getName()} ist`,
            en: `There is more than one PI (${results
                .map((pi) => pi.getName())
                .join(", ")}) where the predecessor is: ${programIncrement.getName()}`,
        });
        return null;
    }
    if (results.length === 0) {
        return null;
    }
    return results[0];
}


return { checkAccess, call };

//------------------------------------------------------------------------------------------------------

/**
 * Displays all items grouped by Solution and PI.
 * Dependencies between items are displayed as a line.
 *
 * Milestones that lie within the period of the PIs are displayed in a separate row.
 *
 * @author Christopher Wölfle
 * @version 15.03.2023
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName("highcharts-solution-dependency-map");

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY_HEIGHT = 0.3;

const TYPE_CAPABILITY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.capability",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        TYPE: "cf.cplace.solution.safe.capabilityType",
        FEATURES: "cf.cplace.solution.safe.feature",
        PROGRAM: "cf.cplace.solution.safe.program",
        SOLUTION: "cf.cplace.solution.safe.solution.reference",
        PROGRAM_INCREMENT: "cf.cplace.solution.safe.programIncrement",
        EPIC: "cf.cplace.solution.safe.portfolioEpic",
        TEMP_ITERATIONS: "cf.cplace.solution.safe.iteration",
    },
    ENUM: {
        TYPE: {
            CAPABILITY: "capability",
            ENABLER: "enabler",
        },
    },
});

const TYPE_MILESTONE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        DATE: "cf.cplace.solution.safe.date",
        TYPE: "cf.cplace.solution.safe.type",
        RELEVANT_FOR: "cf.cplace.solution.safe.relevantFor", // refers to Program
    },
    ENUM: {
        TYPE: {
            PI_MILESTONE: "#15 - PI Meilenstein",
            FIXED_DATE: "#25 - Fixiertes Datum",
            LEARNING_MILESTONE: "#35 - Learning Meilenstein",
        },
    },
});

const TYPE_DEPENDENCY = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.dependency",
    ATTR: {
        A: "cf.cplace.solution.safe.successor",
        B: "cf.cplace.solution.safe.predecessor",
        TYPE: "cf.cplace.solution.safe.type",
        STATUS: "cf.cplace.solution.safe.status",
        DESCRIPTION: "cf.cplace.solution.safe.description",
    },
    ENUM: {
        TYPE: {
            RELATED_TO: "related to",
            BLOCKED_BY: "blocked by",
        },
        STATUS: {
            IDENTIFIED: "15 - identified",
            CONFLICT: "25 - conflict",
            RESOLVED: "35 - resolved",
        },
    },
});

const TYPE_PROGRAM_INCREMENT = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        TITLE: "cf.cplace.solution.safe.title",
        START: "cf.cplace.solution.safe.startDate",
        END: "cf.cplace.solution.safe.endDate",
        PREDECESSOR: "cf.cplace.solution.safe.predecessor", // Program Increment
    },
});

const COLORS = {
    INACTIVE: "#88bbee",
    ACTIVE: "#4488aa",
    DEPEND: "#888888",
    DEPEND_HIGHLIGHT: "#A21622",
    DEPEND_RESOLVED: "#19ad48",
    SAFE_MILESTONE: "#3D8F8C",
    RELEASE: "#366C81",
    MILESTONE_PLOTBAND: "#E2F3F2",
    RELEASE_PLOTBAND: "#E2EEF3",
    CAPABILITY: "#0aa5ff",
    ENABLER: "#ffc80c",
    TODAY_PLOTLINE: "lightgrey",
};

const CATEGORY = {
    SAFE_MILESTONE: "SAFe Milestones",
};

const ROW_SIZE = {
    PERIOD: 2,
    ITEM: 1,
};

const HEIGHTS = {
    HEADER: 40,
    ITEM: 25,
};

const MAX_DATA_LABEL_LENGTH = 25;
const DATA_LABEL_PADDING = 0.05;

const SEPARATOR = {
    V: " //VSEP// ",
    H: " --HSEP-- ",
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

function main() {
    const ctx = fetchData(Array.from(pages));

    if (ctx.capabilities.length === 0 || ctx.periods.length === 0) {
        return {
            title: {
                text: null,
            },
        };
    }

    generateMatrix(ctx);

    const chart = generateChartConfig(ctx);

    return chart;
}
// @ts-ignore
return main();
//--------------------------------------------------------------------------------------//
//                                    Data Fetching                                     //
//--------------------------------------------------------------------------------------//

/**
 * Fetches all required data
 * @param {Page[]} searchResults
 * @returns {Context}
 */
function fetchData(searchResults) {
    const capabilities = searchResults.filter((page) => page.getBuiltinFeatureValue("customType") === TYPE_CAPABILITY.TYPE);
    const missinCapabilities = getMissingCapabilities(capabilities);
    capabilities.push(...missinCapabilities);
    log(`Added ${missinCapabilities.length} missing items that the input items depend on.`);

    const periods = getAllPeriods(capabilities);
    log("Periods: " + periods.length);

    const programs = getPrograms(capabilities);
    const milestones = getSafeMilestones(periods);
    const dependencies = getDependencies(capabilities);

    const capabilitiesById = capabilities.reduce((acc, capability) => {
        acc[capability.getId()] = { x: 0, y: 0, capability };
        return acc;
    }, {});

    const ctx = {
        matrixData: undefined,
        capabilities,
        capabilitiesById,
        periods,
        programs,
        milestones,
        dependencies,
        maxHeight: 1,
    };
    return ctx;
}

/**
 * Searches dependencies of the capabilities and returns those capabilities that are not yet included
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @return {Page<'cf.cplace.solution.safe.capability'>[]}
 */
function getMissingCapabilities(capabilities) {
    // @ts-ignore
    const newCapabilities = new HashSet();
    capabilities.forEach((item) => {
        // @ts-ignore
        const dependencies = Array.from(item.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []);
        dependencies.forEach((itemDependency) => {
            const capability = itemDependency.get(TYPE_DEPENDENCY.ATTR.B);
            if (isPageOfType(capability, TYPE_CAPABILITY.TYPE)) {
                newCapabilities.add(capability);
            }
        });
    });
    return Array.from(newCapabilities).filter((a) => !capabilities.some((b) => b.getId() === a.getId()));
}

/**
 * Determines the periods used as columns of the board
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities Capabilities
 * @returns {Page<'cf.cplace.solution.safe.programIncrement'>[]} PIs in chronological order
 */
function getAllPeriods(capabilities) {
    // @ts-ignore
    const periodsSet = new HashSet();
    capabilities.forEach((item) => {
        const pi = item.get(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT);
        if (!pi) {
            return;
        }
        periodsSet.add(pi);
    });
    /** @type {Page<'cf.cplace.solution.safe.programIncrement'>[]} */
    const periods = Array.from(periodsSet);
    return periods.sort((a, b) =>
        // @ts-ignore
        a.get(TYPE_PROGRAM_INCREMENT.ATTR.START).isBefore(b.get(TYPE_PROGRAM_INCREMENT.ATTR.START)) ? -1 : 1
    );
}
/**
 * Gets all dependencies of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities Capabilities
 * @returns {Page<'cf.cplace.solution.safe.dependency'>[]} PIs in chronological order
 */
function getDependencies(capabilities) {
    const dependencies = [];
    capabilities.forEach((capabilitiy) => {
        const itemDependencies = Array.from(
            // @ts-ignore
            capabilitiy.getIncomingPages(TYPE_DEPENDENCY.TYPE, TYPE_DEPENDENCY.ATTR.A) || []
        );
        dependencies.push(...itemDependencies);
    });
    return dependencies;
}
/**
 *
 * @param {Page<'cf.cplace.solution.safe.programIncrement'>[]} programmIncrements
 * @returns
 */
function getSafeMilestones(programmIncrements) {
    const periodStartDate =
        // @ts-ignore
        programmIncrements.length > 0 ? programmIncrements[0].get(TYPE_PROGRAM_INCREMENT.ATTR.START) : new DateTime();
    const periodEndDate =
        programmIncrements.length > 0
            ? programmIncrements[programmIncrements.length - 1].get(TYPE_PROGRAM_INCREMENT.ATTR.END)
            : // @ts-ignore
              new DateTime();
    const safeMilestoneSearch = new Search();
    safeMilestoneSearch.add(Filters.embeddingSpace());
    safeMilestoneSearch.add(Filters.type(TYPE_MILESTONE.TYPE));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).gte(periodStartDate));
    safeMilestoneSearch.add(Filters.customAttribute(TYPE_MILESTONE.ATTR.DATE).lte(periodEndDate));
    safeMilestoneSearch.addBuiltinAttributeSort(TYPE_MILESTONE.ATTR.DATE, true);
    const safeMilestones = safeMilestoneSearch.findAllPages();
    // @ts-ignore
    return Array.from(safeMilestones);
}
/**
 * Get all the programs of the capabilities
 * @param {Page<'cf.cplace.solution.safe.capability'>[]} capabilities
 * @returns {Page<'cf.cplace.solution.safe.program'>[]}
 */
function getPrograms(capabilities) {
    // @ts-ignore
    const programSet = new HashSet();
    capabilities.forEach((item) => {
        const programs = item.get(TYPE_CAPABILITY.ATTR.PROGRAM);
        if (!programs) {
            return;
        }
        cplace.each(programs, (program) => programSet.add(program));
    });
    /** @type {Page<'cf.cplace.solution.safe.program'>[]} */
    const programms = Array.from(programSet)
    return programms.sort((a,b) => a.getName().localeCompare(b.getName()));
}

/**
 * Generate the matrix
 * @param {Context} ctx
 */
function generateMatrix(ctx) {
    /** @type {MatrixData} */
    const matrixData = {
        headerRow: ctx.periods.map((pi, index) => ({ programIncrement: pi, x: index + 2, y: 1 })),
        milestoneRow: ctx.milestones,
        programms: {},
        capabilities: {},
    };
    let yOffset = 3;
    ctx.programs.forEach((program) => {
        let maxNumberOfCapabilitiesPerProgram = 0;

        const capabilitiesByPi = ctx.periods.map((programIncrement, indexPI) => {
            const filteredCapabilities = ctx.capabilities.filter((capability) => {
                const programIds = capability.get(TYPE_CAPABILITY.ATTR.PROGRAM)?.map((p) => p.getId()) || [];
                // Get all capabilities that are associated to the current programm & the current program increment
                return programIds.includes(program.getId()) && capability.getOptional(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT).getId() === programIncrement.getId();
            });
            // Check if the number of capabilities for this PI is the largest
            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }

            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        // Iterate over the programm Increments to put the capabilities in the right place
        matrixData.programms[program.getName()] = {
            program,
            data: capabilitiesByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: program.getId(),
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: program.getId(),
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight; //+ (rowHeight - 1) / 2;
    });

    const capabilitiesWithoutProgram = ctx.capabilities.filter(
        (capability) =>
            // @ts-ignore
            !capability.get(TYPE_CAPABILITY.ATTR.PROGRAM) || capability.get(TYPE_CAPABILITY.ATTR.PROGRAM).length === 0
    );

    // Check if there are any capabilities without a programm and add them to the matrix
    if (capabilitiesWithoutProgram.length > 0) {
        let maxNumberOfCapabilitiesPerProgram = 0;
        // Ad capabilities without a program
        const capabilitiesWithoutProgrammByPi = ctx.periods.map((programIncrement) => {
            const filteredCapabilities = capabilitiesWithoutProgram.filter(
                (capability) => capability.getOptional(TYPE_CAPABILITY.ATTR.PROGRAM_INCREMENT).getId() === programIncrement.getId()
            );

            if (filteredCapabilities.length > maxNumberOfCapabilitiesPerProgram) {
                maxNumberOfCapabilitiesPerProgram = filteredCapabilities.length;
            }
            return filteredCapabilities;
        });

        const rowHeight = Math.ceil(maxNumberOfCapabilitiesPerProgram * CAPABILITY_HEIGHT);
        const x = 1;
        const y = yOffset + (rowHeight - 1) / 2;

        matrixData.programms["w/o Program"] = {
            program: null,
            data: capabilitiesWithoutProgrammByPi.map((c) => c.map((c) => c.getId())),
            x,
            y,
            rowHeight,
        };
        capabilitiesWithoutProgrammByPi.map((capabilities, indexPI) => {
            capabilities.map((capability, indexCapability) => {
                if (matrixData.capabilities[capability.getId()]) {
                    matrixData.capabilities[capability.getId()].push({
                        x: x + 1 + indexPI,
                        y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                        capability,
                        programId: "w/o Program",
                    });
                } else {
                    matrixData.capabilities[capability.getId()] = [
                        {
                            x: x + 1 + indexPI,
                            y: y - (rowHeight - 1) / 2 + CAPABILITY_HEIGHT * (indexCapability - 1),
                            capability,
                            programId: "w/o Program",
                        },
                    ];
                }
            });
        });
        yOffset += rowHeight;
    }
    ctx.maxHeight = yOffset;
    ctx.matrixData = matrixData;
}
/**
 *
 * @param {Context} ctx
 */
function transformMatrixDataIntoSeries(ctx) {
    const matrixData = ctx.matrixData;

    const series = [];

    if (!matrixData) {
        return series;
    }

    // 1. Add PIs
    series.push(
        ...matrixData.headerRow.map((headerEntry, index) => {
            return {
                name: headerEntry.programIncrement.getName(),
                colsize: 1,
                rowsize: 1,
                dataLabels: { rotation: 0, color: "#000000" },
                enableMouseTracking: false,
                data: [
                    {
                        x: headerEntry.x,
                        y: headerEntry.y,
                        value: 1,
                        name: `<a href="${headerEntry.programIncrement.getUrl()}">${headerEntry.programIncrement.getName()}</a>`,
                        color: "#dddddd",
                    },
                ],
            };
        })
    );

    // 2. Add Milestones
    series.push({
        name: "SAFe Milestones",
        colsize: 1,
        rowsize: 1,
        dataLabels: { rotation: 0, color: "#000000" },
        enableMouseTracking: false,
        data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
    });

    let top = true;
    const safeMilestoneData = [];

    matrixData.milestoneRow.forEach((safeMilestone) => {
        const safeMilestoneName = safeMilestone.getName();
        const safeMilestoneDate = safeMilestone.get(TYPE_MILESTONE.ATTR.DATE);
        // @ts-ignore
        const safeMilestoneDateString = safeMilestoneDate?.toString("dd.MM.yyyy");
        // get milestone Position
        // @ts-ignore
        const safeMilestonePosition = getDatePosition(safeMilestoneDate.getMillis(), ctx);
        // add milestone only if position is not null
        if (safeMilestonePosition > 0) {
            safeMilestoneData.push({
                x: safeMilestonePosition,
                y: 2,
                name: '<a href="' + safeMilestone.getUrl() + '">' + safeMilestoneName + "</a>",
                value: safeMilestoneDateString,
                dataLabels: {
                    verticalAlign: top ? "top" : "bottom",
                },
            });
            top = !top;
        }
    });

    series.push({
        type: "scatter",
        lineWidth: 0,
        findNearestPointBy: "xy",
        data: safeMilestoneData,
        marker: {
            fillColor: COLORS.SAFE_MILESTONE,
        },
    });

    // 3. Add Programms
    let rowHeight = 2.5;
    Object.keys(matrixData.programms).forEach((programName) => {
        const data = matrixData.programms[programName];
        // Add the Programms
        series.push({
            name: programName,
            rowsize: data.rowHeight,
            dataLabels: { rotation: 0, color: "#000000" },
            enableMouseTracking: false,
            data: [
                {
                    x: data.x,
                    y: data.y,
                    value: 1,
                    name: `<a href=\"${data.program?.getUrl() || "wip"}\">${programName}</a>`,
                    color: "#dddddd",
                },
            ],
        });
        // Add the capabilities of the programm
        data.data.map((capabilitiesByPI, indexPI) => {
            series.push({
                name: programName + indexPI,
                rowsize: CAPABILITY_HEIGHT,
                colsize: 0.8,
                dataLabels: { rotation: 0, color: "#000000", overflow: "justify" },
                enableMouseTracking: false,
                data: capabilitiesByPI.map((capabilityId, indexCapability) => {
                    const capabilityData = matrixData.capabilities[capabilityId].filter((c) => c.programId === (data.program ? data.program.getId() : "w/o Program"))[0];
                    const capability = capabilityData.capability;
                    const isEnabler = capability.get(TYPE_CAPABILITY.ATTR.TYPE) === "enabler";
                    return {
                        x: capabilityData.x,
                        y: capabilityData.y,
                        value: 1,
                        name: `<a href=\"${capability.getUrl() || "wip"}\">${limitStringSize(capability.getName(), 40)}</a>`,
                        color: isEnabler ? "#ffc80c" : "#0aa5ff",
                    };
                }),
            });
        });
        rowHeight += data.rowHeight;
    });

    // 4. Add Dependencies
    ctx.dependencies.forEach((dependency) => {
        const from = dependency.get(TYPE_DEPENDENCY.ATTR.B);
        const to = dependency.get(TYPE_DEPENDENCY.ATTR.A);
        if (!from || !to) {
            return;
        }
        const fromId = from.getId();
        const toId = to.getId();

        const fromCapabilities = ctx.matrixData?.capabilities[fromId];
        const toCapabilities = ctx.matrixData?.capabilities[toId];

        if (!fromCapabilities) {
            return;
        }
        const maxValue = ctx.maxHeight;
        fromCapabilities.forEach((fromCapabilityData) => {
            let x1 = fromCapabilityData.x;
            let y1 = fromCapabilityData.y;
            // y1 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

            if (!toCapabilities) {
                return;
            }
            toCapabilities.forEach((toCapabilityData) => {
                let x2 = toCapabilityData.x;
                let y2 = toCapabilityData.y;
                // y2 += -0.4 + 0.4 / maxValue + ((x1-1) * 0.8) / maxValue;

                const description = dependency.get(TYPE_DEPENDENCY.ATTR.DESCRIPTION) || " ";
                const dependencyType = dependency.get(TYPE_DEPENDENCY.ATTR.TYPE);
                const status = dependency.get(TYPE_DEPENDENCY.ATTR.STATUS);
                const dependencySeries = {
                    type: "spline",
                    name: "<b>" + to.getName() + "</b><br/>relates to:<br/>" + from.getName() + "<br>" + description,
                    lineWidth: 1.5,
                    color: COLORS.DEPEND,
                    dashStyle: "shortdot",
                    findNearestPointBy: "xy",
                    data: [
                        { x: x1 + 0.4, y: y1 },
                        { x: x1 + 0.45, y: y1 === y2 ? y1 + 0.02 : y1 },
                        { x: x2 - 0.45, y: y1 === y2 ? y2 - 0.02 : y2 },
                        { x: x2 - 0.4, y: y2, marker: { enabled: true, symbol: "diamond" } },
                    ],
                };
                if (dependencyType === TYPE_DEPENDENCY.ENUM.TYPE.BLOCKED_BY) {
                    dependencySeries.name = "<b>" + to.getName() + "</b><br/>blocked by:<br/>" + from.getName() + "<br>" + description;
                    // @ts-ignore
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

    return series;
}

//--------------------------------------------------------------------------------------//
//                                     Chart Config                                     //
//--------------------------------------------------------------------------------------//

/**
 *
 * @param {Context} ctx
 */
function generateChartConfig(ctx) {
    if (!ctx.matrixData) {
        return;
    }
    const series = transformMatrixDataIntoSeries(ctx);
    // @ts-ignore
    const today = new DateTime();
    let todayPosition = getDatePosition(today.getMillis(), ctx);

    return {
        chart: {
            type: "heatmap",
            marginTop: 0,
            marginBottom: 0,
            plotBorderWidth: 0,
            scrollablePlotArea: {
                minHeight: 1200,
                minWidth: 1000,
            },
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: [],
            title: null,
            gridLineWidth: 0,
            lineWidth: 0,
            labels: {
                enabled: false,
            },
            plotLines: [
                {
                    dashStyle: "dash",
                    color: COLORS.TODAY_PLOTLINE,
                    width: 2,
                    value: todayPosition,
                    zIndex: 1,
                },
            ],
        },
        yAxis: {
            categories: [],
            title: null,
            gridLineWidth: 1,
            tickInterval: 1,
            lineWidth: 0,
            min: 1,
            max: ctx.maxHeight,
            labels: {
                enabled: false,
            },
            reversed: true,
            scrollbar: {
                enabled: true,
            },
            plotBands: [
                {
                    color: COLORS.MILESTONE_PLOTBAND,
                    borderColor: "white",
                    borderWidth: 2,
                    from: 1.5,
                    to: 2.5,
                    zIndex: 0,
                },
                // {
                //     color: COLORS.RELEASE_PLOTBAND,
                //     borderColor: 'white',
                //     borderWidth: 2,
                //     from: 1.5,
                //     to: 2.5,
                //     zIndex: 0
                // }
            ],
        },
        colors: ["#D5001C", "#92D050"],
        colorAxis: {
            dataClassColor: "category",
            dataClasses: [
                {
                    to: 0.5,
                },
                {
                    from: 0.5,
                },
            ],
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
                borderColor: "#ffffff",
                borderWidth: 2,
                dataLabels: {
                    allowOverlap: false,
                    inside: true,
                    crop: true,
                    overflow: "justify",
                    position: "left",
                    shape: "circle",
                    enabled: true,
                    color: "#000000",
                    format: "{point.name}",
                    style: {
                        textOutline: "none",
                        textOverflow: "clip",
                    },
                },
                stickyTracking: false,
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b>",
                    findNearestPointBy: "xy",
                },
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
            },
            spline: {
                tooltip: {
                    headerFormat: "{series.name}",
                    pointFormat: "",
                    findNearestPointBy: "xy",
                },
                marker: {
                    enabled: false,
                    fillColor: COLORS.DEPEND,
                    radius: 6,
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
            },
            scatter: {
                tooltip: {
                    headerFormat: "",
                    pointFormat: "<b>{point.name}</b><br>{point.value}",
                    findNearestPointBy: "xy",
                },
                dataLabels: {
                    enabled: true,
                },
                marker: {
                    enabled: true,
                    symbol: "diamond",
                    radius: 10,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: series,
        // series: [
        //     {
        //         name: "PI 22.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 2,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/1bk9kpxn7s36vz3w80ji7t5oo/PI-22.4">PI 22.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 3,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4l6jbaa8qgzinif5qetj499g5/PI-23.1">PI 23.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.2",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 4,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/tksr708c2119mek2pzzopu9qb/PI-23.2">PI 23.2</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.3",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 5,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/i4o8azmi8m0oqvqqu3hejgu80/PI-23.3">PI 23.3</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 23.4",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 6,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/nrymz33xo7ew3x6qcgdk3fl7l/PI-23.4">PI 23.4</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "PI 24.1",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 7,
        //                 y: 1,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/0wtzrg3m4bdpfhut5xbgiza73/PI-24.1">PI 24.1</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "SAFe Milestones",
        //         colsize: 1,
        //         rowsize: 1,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [{ x: 1, y: 2, value: 1, name: '<a href="wip">SAFe Milestones</a>', color: "#E2F3F2" }],
        //     },
        //     {
        //         name: "Smart Infotainment",
        //         rowsize: 2,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 3.5,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/qg000odouviwwtx4rz2bvaoi8/Smart-Infotainment">Smart Infotainment</a>',
        //                 color: "#dddddd",
        //             },
        //         ],
        //     },
        //     {
        //         name: "Powertrain and Safety",
        //         rowsize: 4,
        //         dataLabels: { rotation: 0, color: "#000000" },
        //         enableMouseTracking: false,
        //         data: [
        //             {
        //                 x: 1,
        //                 y: 5 + (4-1)/2,
        //                 value: 1,
        //                 name: '<a href="https://solution-templates.cplace.de/large-solution-safe/pages/4flf7a0349c5ximei6olrhife/Powertrain-and-Safety">Powertrain and Safety</a>',
        //                 color: "red",
        //             },
        //         ],
        //     },
        // ],
    };
}

//--------------------------------------------------------------------------------------//
//                                        Utils                                         //
//--------------------------------------------------------------------------------------//

/**
 * Limit string to specified size
 * @param {string} str
 * @param {number} maxSize
 * @returns
 */
function limitStringSize(str, maxSize) {
    if (str.length > maxSize) {
        return str.substring(0, maxSize - 3) + "...";
    }
    return str;
}

/**
 *
 * @param {number} date
 * @param {Context} ctx
 * @returns
 */
function getDatePosition(date, ctx) {
    let xPosition = 0;
    ctx.periods.every((pi, idx) => {
        // @ts-ignore
        let categoryStartDate = pi.get(TYPE_PROGRAM_INCREMENT.ATTR.START)?.getMillis();
        // @ts-ignore
        let categoryEndDate = pi.get(TYPE_PROGRAM_INCREMENT.ATTR.END)?.getMillis();

        // Check whether release date lies in between start and end date of category
        if (categoryStartDate && categoryEndDate && date >= categoryStartDate && date <= categoryEndDate) {
            // find x-Value of category and subtract 0.5 for starting point as offset
            let x = idx + 2 - 0.5;
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

/**
 * Checks if a cplace page is of the specified type
 * @param {Page} page
 * @param {string} type
 * @returns {boolean}
 */
function isPageOfType(page, type) {
    return page.getBuiltinFeatureValue("customType") === type;
}

/**
 * Log to cplace
 * @param {any} text
 */
function log(text) {
    if (!DEBUG) {
        return;
    }
    const logOutput = typeof text !== "string" ? JSON.stringify(text) : text;
    cplace.log(logOutput);
}

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.solution
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the timeline with Programm Increments, Safe Events and Safe Milestones. Chart is zoomable and draggable
 */

// set the distinguishing log name
cplace.setLogName("Highcharts - Timeline Overview");

/***** Start configuration *****/
const chartBackgroundColor = "#FFFFFF";
const lineColor = "#303038";

const piColor = "#dddddd";
const safeMilestoneColor = "#3D8F8C";
const eventColor = "#366C81";

const milestonePlotBandColor = "#E2F3F2";
const eventPlotBandColor = "#E2EEF3";
const todayPlotline = "lightgrey";

const showMonthsBeforeToday = 3;
const showMonthsAfterToday = 9;
/***** End configuration *****/

const MILESTONE = {
    TYPE: "cf.milestone",
    ATTR: {
        SCHEDULE: "containingSchedule",
        DATE: "date",
        FEATURE_DEPENDENCY: "cf.cplace.solution.safe.dependency",
        TASKCLASS: "activityClass",
    },
};
const FEATURE = {
    TYPE: "cf.cplace.solution.safe.feature",
    ATTR: {
        PROGRAM: "cf.cplace.solution.safe.program",
    },
};
const SCHEDULE = {
    TYPE: "cf.schedule",
    ATTR: {},
};
const TASK_CLASS = {
    TYPE: "cf.activityClass",
    ATTR: {
        COLOR: "barColor",
        BORDERCOLOR: "borderColor",
        SHAPE: "milestoneShape",
    },
};
const SAFE_MILESTONE = {
    TYPE: "cf.cplace.solution.safe.safeMilestone",
    ATTR: {
        DATE: "cf.cplace.solution.safe.date",
    },
};
const PI = {
    TYPE: "cf.cplace.solution.safe.programIncrement",
    ATTR: {
        START: "cf.cplace.solution.safe.startDate",
        END: "cf.cplace.solution.safe.endDate",
    },
};
const EVENT = {
    TYPE: "cf.cplace.solution.safe.event",
    ATTR: {
        START_DATE: "cf.cplace.solution.safe.startDate",
        END_DATE: "cf.cplace.solution.safe.endDate",
        SOLUTION: "cf.cplace.solution.safe.solution",
    },
};

function main() {
    /** @type {ChartContext} */
    const context = {
        today: new Date(),
        start: getStartDate(showMonthsBeforeToday),
        end: getEndDate(showMonthsAfterToday),
        solution: embeddingPage.get('cf.cplace.solution.safe.parent'),
        schedules: [],
        programIncrements: [],
        events: [],
        safeMilestones: [],
        series: [],
        plotlines: [],
        categories: ["<b>Program Increments</b>", "<b>Events</b>", "<b>SAFe Milestones</b>"],
        yIndex: 0,
    };

    categorizeData(pages, context);
    createPiSeries(context);
    createEventSeries(context);
    createMilestoneSeries(context);
    //create plotline between SAFe parts and schedules
    //ctx.plotLines.push(createPlotline(yIndex - 0.5, 1.25));
    createScheduleSeries(context);

    return createChartConfig(context);
}

/**
 * Sort pages by their type and them to the context
 * @param {Page[]} pages
 * @param {ChartContext} ctx
 */
function categorizeData(pages, ctx) {
    cplace.each(pages, (page) => {
        let type = page.getBuiltinFeatureValue("customType");
        if (type === SCHEDULE.TYPE) {
            ctx.schedules.push(page);
        } else if (type === PI.TYPE) {
            ctx.programIncrements.push(page);
        } else if (type === SAFE_MILESTONE.TYPE) {
            ctx.safeMilestones.push(page);
        } else if (type === EVENT.TYPE) {
            ctx.events.push(page);
        }
    });
}

/**
 * Create pi series
 * @param {ChartContext} ctx
 */
function createPiSeries(ctx) {
    const piData = [];
    cplace.each(ctx.programIncrements, (pi) => {
        piData.push(createDataItem(pi.getName(), pi.get(PI.ATTR.START), pi.get(PI.ATTR.END), ctx.yIndex, piColor));
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Program Increments",
        showInLegend: false,
          tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br/>Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
            useHTML: true,
        },
        data: piData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
    return piData;
}

/**
 * Create event series
 * @param {ChartContext} ctx
 */
function createEventSeries(ctx) {
    let eventData = [];
    cplace.each(ctx.events, (event) => {
        eventData.push(
            createDataItem(
                event.getName(),
                event.get(EVENT.ATTR.START_DATE),
                event.get(EVENT.ATTR.END_DATE),
                ctx.yIndex,
                eventColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push({
        name: "Events",
        showInLegend: false,
          tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br/>Start: {point.x: %Y-%m-%d}<br/> End: {point.x2: %Y-%m-%d}",
            useHTML: true,
        },
        data: eventData,
        dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>",
        },
        states: {
            inactive: {
                opacity: 1,
            },
        },
    });
}

/**
 * Create safe milestone series
 * @param {ChartContext} ctx
 */
function createMilestoneSeries(ctx) {
    let safeMilestoneData = [];
    cplace.each(ctx.safeMilestones, (safeMilestone) => {
        safeMilestoneData.push(
            createMilestoneDataItem(
                safeMilestone.getName(),
                safeMilestone.get(SAFE_MILESTONE.ATTR.DATE),
                ctx.yIndex,
                safeMilestoneColor,
                safeMilestoneColor
            )
        );
    });
    ctx.yIndex++;
    ctx.series.push(createMilestoneSerie("SAFe Milestones", safeMilestoneData));
}
/**
 * Create Chart configuration
 * @param {ChartContext} ctx
 * @returns
 */
function createChartConfig(ctx) {
    return {
        chart: {
            type: "xrange",
            backgroundColor: chartBackgroundColor,
            panning: true,
            panKey: "shift",
            zoomType: "x",
        },
        title: {
            text: "",
        },
        yAxis: {
            title: {
                text: "",
            },
            categories: ctx.categories,
            reversed: true,
            type: "category",
            plotBands: [
                {
                    color: eventPlotBandColor,
                    from: 0.5,
                    to: 1.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
                {
                    color: milestonePlotBandColor,
                    from: 1.5,
                    to: 2.5,
                    borderColor: "white",
                    borderWidth: 2,
                    zIndex: 0,
                },
            ],
        },
        xAxis: {
            type: "datetime",
            min: Date.UTC(ctx.start.getFullYear(), ctx.start.getMonth(), ctx.start.getDate(), 0, 0, 0, 0),
            max: Date.UTC(ctx.end.getFullYear(), ctx.end.getMonth(), ctx.end.getDate(), 23, 59, 59, 59),
            plotLines: [
                {
                    dashStyle: "dash",
                    color: todayPlotline,
                    width: 2,
                    value: Date.UTC(ctx.today.getFullYear(), ctx.today.getMonth(), ctx.today.getDate(), 0, 0, 0, 0),
                    zIndex: 1,
                },
                ...ctx.plotlines,
            ],
        },
        tooltip: {
            enabled: true,
        },
        series: ctx.series,
    };
}

/**
 * Create schedule series
 * @param {ChartContext} ctx
 */
function createScheduleSeries(ctx) {
    cplace.each(ctx.schedules, (schedule) => {
        let relevantSchedule = false;
        let scheduleData = [];
        let milestones = schedule.getIncomingPages(MILESTONE.TYPE, MILESTONE.ATTR.SCHEDULE);
        cplace.each(milestones, (milestone) => {
            let featureDependency = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
            let isProgramRelevant = false;
            cplace.each(featureDependency, (feature) => {
                let featureProgram = feature.get(FEATURE.ATTR.PROGRAM);
                if (featureProgram && featureProgram.getId() === ctx.solution.getId()) {
                    isProgramRelevant = true;
                }
            });
            if (isProgramRelevant) {
                relevantSchedule = true;
                scheduleData.push(createScheduleMilestoneDataItem(milestone, ctx.yIndex));
            }
        });
        if (relevantSchedule) {
            ctx.categories.push(createCategory(schedule));
            ctx.series.push(createMilestoneSerieSchedule(schedule.getName(), scheduleData));
            ctx.yIndex++;
        }
    });
}

//FUNCTIONS
function createDataItem(name, start, end, y, color) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    return {
        name: name,
        x: Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0),
        x2: Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 99),
        y: y,
        color: color,
    };
}

function getMilestoneShape(milestoneShape) {
    if (milestoneShape === "Diamond") return "diamond";
    if (milestoneShape === "Arrow Up") return "diamond";
    if (milestoneShape === "Arrow Down") return "diamond";
    if (milestoneShape === "Triangle Up") return "triangle";
    if (milestoneShape === "Triangle Down") return "triangle-down";
    if (milestoneShape === "Triangle Left") return "triangle";
    if (milestoneShape === "Triangle Right") return "triangle";
    if (milestoneShape === "Circle") return "circle";
    if (milestoneShape === "Square") return "square";
    if (milestoneShape === "Star") return "diamond";
    if (milestoneShape === "Ramp Down") return "diamond";
    if (milestoneShape === "Ramp Up") return "diamond";
}

function createMilestoneDataItem(name, date, y, color, borderColor) {
    let milestoneDate = new Date(date);
    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
        },
    };
}

function createScheduleMilestoneDataItem(milestone, y) {
    let name = milestone.getName();
    let milestoneDate = new Date(milestone.get(MILESTONE.ATTR.DATE));
    let color = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.COLOR);
    let borderColor = milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.BORDERCOLOR);
    let milestoneShape = getMilestoneShape(milestone.getOptional(MILESTONE.ATTR.TASKCLASS).get(TASK_CLASS.ATTR.SHAPE));
    let features = milestone.get(MILESTONE.ATTR.FEATURE_DEPENDENCY);
    let featureList = "<b>Requested Features:</b>";
    cplace.each(features, (feature) => {
        featureList = featureList + "<br>" + feature.getName();
    });

    return {
        name: name,
        x: Date.UTC(milestoneDate.getFullYear(), milestoneDate.getMonth(), milestoneDate.getDate(), 0, 0, 0, 0),
        y: y,
        features: featureList,
        marker: {
            fillColor: color,
            lineColor: borderColor,
            lineWidth: 1,
            symbol: milestoneShape,
        },
    };
}

function createMilestoneSerie(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createMilestoneSerieSchedule(name, dataSeries) {
    return {
        name: name,
        type: "scatter",
        //stickyTracking: false,
        showInLegend: false,
        marker: {
            enabled: true,
            symbol: "diamond",
            lineWidth: 5,
            radius: 12,
        },
        tooltip: {
            useHTML: true,
            headerFormat: "<b>{point.key}</b><br>",
            pointFormat: "{point.x: %Y-%m-%d}<br>{point.features}",
        },
        data: dataSeries,
        states: {
            inactive: {
                opacity: 1,
            },
        },
    };
}

function createPlotline(value, width) {
    return {
        color: lineColor,
        width: width,
        value: value,
        dashStyle: "solid",
    };
}

function getStartDate(months) {
    let today = new Date();
    let startDate = today;
    startDate.setMonth(today.getMonth() - months);
    return startDate;
}

function getEndDate(months) {
    let today = new Date();
    let endDate = today;
    endDate.setMonth(today.getMonth() + months);
    return endDate;
}

function createCategory(object) {
    let name = object.getName();
    let url = object.getUrl();
    return '<a href="' + url + '">' + name + "</a>";
}

/**
 * Object containing context information for the chart.
 * @typedef {Object} ChartContext
 * @property {Date} today - The current date.
 * @property {Date} start - The start date for the chart.
 * @property {Date} end - The end date for the chart.
 * @property {Page} solution - The embeddingPage object representing the current solution.
 * @property {Page[]} schedules - An array of pages representing schedules.
 * @property {Page[]} programIncrements - An array of pages representing program increments.
 * @property {Page[]} events - An array of pages representing events.
 * @property {Page[]} safeMilestones - An array of pages representing SAFe milestones.
 * @property {any[]} series - An array of series
 * @property {any[]} plotlines - An array of plotlines
 * @property {string[]} categories - An array of categories
 * @property {number} yIndex - y-index
 */

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Creates Flow Distribution highchart
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('highchart-flow-distribution');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
    CAPABILITY_TYPE: {
      INTERNAL_NAME: 'cf.cplace.solution.safe.capabilityType',
      ENUM_VALUES: {
        CAPABILITY: 'capability',
        ENABLER: 'enabler'
      }
    }
  }
};

const COLUMN_COLOR1 = '#26285d';
const COLUMN_COLOR2 = '#b8d4fa';

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
const flowDistributionSeries = getFlowDistributionSeries(pages);
const categories = getCategories(flowDistributionSeries);
const transformedSeries = transformSeries(flowDistributionSeries)

const config = {
  title: {
    text: 'Flow Distribution'
  },
  chart: {
    type: 'column',
    spacingBottom: 25,
    spacingTop: 20
  },
  legend: {
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}'
  },
  xAxis: {
    categories: categories
  },
  yAxis: {
    title: '',
    labels: {
      format: '{value}%',
    },
    allowDecimals: false,
    max: 100
  },
  plotOptions: {
    series: {
      pointWidth: 40,
    },
    column: {
      stacking: 'normal',
    }
  },
  colors: [COLUMN_COLOR1, COLUMN_COLOR2],
  series: transformedSeries
}

return config;

/**
 * Creates a map of Capability and Enabler count for each Program Iteration
 */
function getFlowDistributionSeries(pages) {
  let series = [];
  cplace.each(pages, programIncrement => {
    const capabilities = programIncrement.getIncomingPages(CAPABILITY.TYPE, CAPABILITY.ATTR.PROGRAM_INCREMENT);
    let enablerCount = 0;
    let capabilitiesCount = 0;
    cplace.each(capabilities, capability => {
      const capabilityType = capability.get(CAPABILITY.ATTR.CAPABILITY_TYPE.INTERNAL_NAME);

      if (capabilityType === CAPABILITY.ATTR.CAPABILITY_TYPE.ENUM_VALUES.ENABLER) {
        enablerCount++
      }
      if (capabilityType === CAPABILITY.ATTR.CAPABILITY_TYPE.ENUM_VALUES.CAPABILITY) {
        capabilitiesCount++
      }
    });

    let seriesObject = {};
    seriesObject['name'] = programIncrement.getName();
    let totalCount = capabilitiesCount + enablerCount;
    seriesObject['data'] = totalCount ? [(capabilitiesCount / totalCount) * 100, (enablerCount / totalCount) * 100] :
      [0, 0]
    series.push(seriesObject);
  });

  return series.sort(function (a, b) {
    let x = a['name'];
    let y = b['name'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/**
 * Computes the name of all Program Iterations
 */
function getCategories(flowDistributionSeries) {
  let categories = [];
  flowDistributionSeries.forEach(seriesObject => {
    categories.push(seriesObject['name']);
  })
  return categories;
}

/**
 * Transforms the Flow Distribution series to count of Capabilities and Enablers
 */
function transformSeries(sortedFlowDistributionSeries) {
  let series = [{'name': 'Capabilities', data: []}, {'name': 'Enablers', data: []}];
  sortedFlowDistributionSeries.forEach(seriesObject => {
    series[0]['data'].push(seriesObject['data'][0]);
    series[1]['data'].push(seriesObject['data'][1]);
  });
  return series;
}

//------------------------------------------------------------------------------------------------------

/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.metricsDashboard
 * @layout cf.cplace.solution.safe.layout.flowEfficiency
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays a dummy flow efficiency chart
 */

const SEED = 1234;

function generateDummyData() {
    const efficiencies = [];
    // Generate numbers in 0.05 intervals from 0 to 1
    for (let i = 0; i <= 20; i++) {
        efficiencies.push(i * 0.05);
    }
    const data = efficiencies.map((e) => ({
        x: e*100,
        y: getRandomNumber(0, Math.round(20 * (e + 0.01))),
    }));

    return data;
}

function main() {
    const data = generateDummyData();
    return generateConfig(data);
}

function generateConfig(data) {
    return {
        chart: {
            type: "column",
        },
        title: {
            text: "Flow Efficiency",
        },
        xAxis: {
            title: {
                text: "Flow Efficiency",
            },
            labels: {format: "{value:.1f}%"}
        },
        yAxis: {
            title: {
                text: "Number of Capabilities",
            },
            
        },
        tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.y}</b><br/>capabilities with a flow efficiency of {point.x:.1f}%",
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.y}",
                },
            },
        },
        series: [{ name: "Flow Efficiency", data }],
    };
}

class PseudoRandomNumberGenerator {
    constructor(seed) {
        this.a = 1664525;
        this.c = 1013904223;
        this.m = Math.pow(2, 32);
        this.seed = seed;
    }

    random() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}

const prng = new PseudoRandomNumberGenerator(SEED);

function getRandomNumber(min, max) {
    // Calculate the range of the random number
    const range = max - min;

    // Generate a random number within the range
    const randomNumber = prng.random() * range + min;

    // Round the random number to the nearest integer
    const roundedNumber = Math.round(randomNumber);

    return roundedNumber;
}

// @ts-ignore
return main();

//------------------------------------------------------------------------------------------------------

/**
 * @author Nepomuk Heimberger
 * @description Creates Flow Predictability highchart
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('highchart-flow-predictability');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const OBJECTIVE = {
  TYPE: 'cf.cplace.solution.safe.objective',
  ATTR: {
    PROGRAM_INCREMENT: 'cf.cplace.solution.safe.timebox',
    BUSINESS_VALUE: 'cf.cplace.solution.safe.businessValue',
    ACTUAL_VALUE: 'cf.cplace.solution.safe.actualValue',
    COMMITMENT: {
      INTERNAL_NAME: 'cf.cplace.solution.safe.commitment',
      ENUM_VALUES: {
        COMMITTED: '#15 - Committed',
        UNCOMMITTED: '#25 - Uncommitted'
      }
    },
     SAFE_LEVEL: {
      INTERNAL_NAME: 'cf.cplace.solution.safe.SAFeLevel',
      ENUM_VALUES: {
        SOLUTION: '#15 - Solution',
        PROGRAM: '#25 - Program',
        TEAM: '#35 - Team'
      }
    }
  }
};


const COLUMN_COLOR1 = '#26285d';
const COLUMN_COLOR2 = '#b8d4fa';
const LINE_COLOR = '#368F8B';
const LINE_COLOR_2 = '#155451';

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

const flowPredictabilitySeries = getFlowPredictabilitySeries(pages);
const sortedSeries = sortSeriesByName(flowPredictabilitySeries);
const categories = getCategories(sortedSeries);
const transformedSeries = transformSeries(sortedSeries);

const config = {
  title: {
    text: 'Flow Predictability Measure'
  },
  xAxis: {
    categories: categories,
    title: {
      text: ''
    }
  },
  yAxis: [{
    title: {
      text: 'Objectives Achieved'
    },
    allowDecimals: false,
  },
  {
    title: {
      text: 'Predictability',
      style: {
        color: LINE_COLOR
      },
    },
    labels: {
      style: {
        color: LINE_COLOR
      },
    },    
    plotLines: [{
      color: LINE_COLOR_2,
      value: 80,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4
    },
    {
      color: LINE_COLOR_2,
      value: 100,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4
    }],
    opposite: true
  }],
  plotOptions: {
    series: {
      pointWidth: 50
    }
  },
  colors: [COLUMN_COLOR1, COLUMN_COLOR2],
  series: Object.values(transformedSeries)
}

return config;



/**
 * Creates an array of a map of Program Iteration names and program predictability measure
 */
function getFlowPredictabilitySeries(pages) {
  let piSeries = []; //[{'name': '', 'values': []}]

  cplace.each(pages, programIncrement => {
    const objectives = programIncrement.getIncomingPages(OBJECTIVE.TYPE, OBJECTIVE.ATTR.PROGRAM_INCREMENT);
    let totalBusinessValue = 0
    let totalActualValue = 0
    cplace.each(objectives, objective => {
      const safeLevel = objective.get(OBJECTIVE.ATTR.SAFE_LEVEL.INTERNAL_NAME);
      if (safeLevel === OBJECTIVE.ATTR.SAFE_LEVEL.ENUM_VALUES.SOLUTION) {
        const commitment = objective.get(OBJECTIVE.ATTR.COMMITMENT.INTERNAL_NAME);
        if (commitment === OBJECTIVE.ATTR.COMMITMENT.ENUM_VALUES.COMMITTED) {
          totalBusinessValue += objective.get(OBJECTIVE.ATTR.BUSINESS_VALUE);
        }
        totalActualValue += objective.get(OBJECTIVE.ATTR.ACTUAL_VALUE);
      }
    });

    let seriesObject = {};
    seriesObject['name'] = programIncrement.getName();
    const flowPredictabilityMeasure = totalBusinessValue ? Math.round((totalActualValue / totalBusinessValue) * 100) * 100 / 100 : 0;
    seriesObject['values'] = [flowPredictabilityMeasure, totalBusinessValue, totalActualValue]
    piSeries.push(seriesObject);
  });

  return piSeries;
}
/**
 * Computes the name of all Program Iterations
 */
function getCategories(flowDistributionSeries) {
  let categories = [];
  flowDistributionSeries.forEach(seriesObject => {
    categories.push(seriesObject['name']);
  })
  return categories;
}

/**
 * Transforms the array of series objects to the actual highchart configuration series
 */
function transformSeries(series) {
  let flowPredictabilitySeries = {
    flowPredictabilityMeasure: {type: 'spline', 'name': 'Flow Predictability Measure', yAxis:1, data: [],tooltip: {valueSuffix: ' %'}, color: LINE_COLOR},
    totalBusinessValue: {type: 'column', name: 'Planned Business Value', yAxis:0, data: []},
    actualBusinessValue: {type: 'column', name: 'Actual Business Value', yAxis:0, data: []},
    // percentageDottedLine80: {type: 'spline', dashStyle: 'shortdot', data: []},
    // percentageDottedLine100: {type: 'spline', dashStyle: 'shortdot', data: []}
  };

  series.forEach(seriesObject => {
    flowPredictabilitySeries['flowPredictabilityMeasure']['data'].push(seriesObject['values'][0]);
    flowPredictabilitySeries['totalBusinessValue']['data'].push(seriesObject['values'][1]);
    flowPredictabilitySeries['actualBusinessValue']['data'].push(seriesObject['values'][2]);
    // flowPredictabilitySeries['percentageDottedLine80']['data'].push(80);
    // flowPredictabilitySeries['percentageDottedLine100']['data'].push(100);
  });

  return flowPredictabilitySeries;
}

/**
 * Sorts the series by name
 */
function sortSeriesByName(series) {
  return series.sort(function (a, b) {
    let x = a['name'];
    let y = b['name'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
/**
 * Returns an array of all IDs of the pages
 */
function getPagesUids(pages) {
    let pagesUids = [];
    cplace.each(pages, page => {
        pagesUids.push(page.getId())
    })
    return pagesUids;
}

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Creates Flow Time highchart
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('highchart-flow-time');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    'FLOW_TIME': 'cf.cplace.solution.safe.flowTime'
  }
};

const COLUMN_COLOR = '#26285d';

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
const flowTimeData = getFlowTimeData(pages);
const sortedFlowTimeData = sortFlowTimeData(flowTimeData);
const seriesData = createSeriesData(sortedFlowTimeData);
const averageCapabilities = calculateAverageCapabilities(seriesData)

const config = {
  title: {
    text: 'Flow Time'
  },
  legend: {enabled: false},
  chart: {
    type: 'column',
    spacingBottom: 25,
    spacingTop: 20
  },
  tooltip: {
    headerFormat: null,
    pointFormat: 'Capability Count: {point.y}'
  },
  xAxis: {
    plotLines: [{
      color: 'red',
      value: averageCapabilities,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4,
      label: {
        x: -15,
        text: '<span style="font-size:12px;">Average: ' + averageCapabilities + '</span>'
      },
    }],
    title: {
      text: 'Flow Time (days)'
    },
    gridLineColor: '#68686CFF',
    gridLineWidth: 0.3,
    tickLength: 0,
    tickInterval: 5,
  },
  yAxis: {
    title: {
      text: 'Capability Count'
    },
    allowDecimals: false
  },
  plotOptions: {
    series: {
      pointWidth: 30,
      color: COLUMN_COLOR
    }
  },
  series: [{
    data: Object.values(seriesData)
  }]
}

return config;

/**
 * Creates a map of Flow Time values along with the number of occurrences
 * @returns An object with Flow Time values as keys and number of occurrences as values
 */
function getFlowTimeData(pages) {
  let data = {};
  cplace.each(pages, page => {
    const flowTime = round5(page.get(CAPABILITY.ATTR.FLOW_TIME));
    if (flowTime) {
      let value = data[flowTime];

      if (value) {
        data[flowTime] = ++value;
      } else {
        data[flowTime] = 1;
      }
    }
  });
  return data;
}

/**
 * Round the number to the previous multiple of 5
 */
function round5(x) {
  return Math.ceil(x / 5) * 5;
}

/**
 * Sorts the Flow Time data in ascending order
 */
function sortFlowTimeData(flowTimeData) {
  return Object.keys(flowTimeData).sort().reduce(
    (obj, key) => {
      obj[key] = flowTimeData[key];
      return obj;
    },
    {}
  );
}

/**
 * Creates the series data for the highchart
 */
function createSeriesData(data) {
  const formattedData = [];
  let keys = Object.keys(data), len = keys[keys.length - 1];

  for (let i = 0; i <= len; i++) {
    if (data[i]) {
      formattedData.push(data[i])
    } else {
      formattedData.push(0)
    }
  }

  return formattedData;
}

function calculateAverageCapabilities(transformedSeries) {
  let totalDays = 0;
  let capabilities = 0;
  Object.values(transformedSeries).forEach(seriesData => {
    if(seriesData) {
      totalDays++;
      capabilities+=seriesData;
    }
  });

  return (Math.round(capabilities/totalDays * 100) / 100).toFixed(2);
}

//------------------------------------------------------------------------------------------------------

/**
 * @author Rakshit Midha
 * @description Creates Flow Velocity highchart
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('highchart-flow-velocity');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const CAPABILITY = {
  TYPE: 'cf.cplace.solution.safe.capability',
  ATTR: {
    PROGRAM_INCREMENT: 'cf.cplace.solution.safe.programIncrement',
  }
};

const COLUMN_COLOR = '#26285d';

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
const flowDistributionSeries = getFlowVelocitySeries(pages);
const categories = getCategories(flowDistributionSeries);
const transformedSeries = transformSeries(flowDistributionSeries);
const averageCapabilities = calculateAverageCapabilities(transformedSeries);

const config = {
  title: {
    text: 'Flow Velocity'
  },
  chart: {
    type: 'column',
    spacingBottom: 25,
    spacingTop: 20
  },
  legend: {enabled: false},
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: 'Capabilities: {point.y}'
  },
  xAxis: {
    categories: categories,
    title: {
      text: 'Program Iteration'
    }
  },
  yAxis: {
    plotLines: [{
      color: 'red',
      value: averageCapabilities,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4,
      label: {
        text: '<span style="font-size:12px;">Average Velocity: ' + averageCapabilities + '</span>'
      },
    }],
    title: {
      text: 'Capabilities'
    },
    allowDecimals: false,
  },
  plotOptions: {
    series: {
      pointWidth: 40,
      color: COLUMN_COLOR
    },
    column: {
      dataLabels: {
        enabled: true,
        crop: false,
        overflow: 'none'
      }
    }
  },
  series: [{
    data: transformedSeries
  }]
}

return config;

/**
 * Creates an array of a map of Program Iteration names and Capability count
 */
function getFlowVelocitySeries(pages) {
  let series = [];
  cplace.each(pages, programIncrement => {
    const capabilities = programIncrement.getIncomingPages(CAPABILITY.TYPE, CAPABILITY.ATTR.PROGRAM_INCREMENT);
    let capabilitiesCount = 0;
    cplace.each(capabilities, () => capabilitiesCount++);

    let seriesObject = {};
    seriesObject['name'] = programIncrement.getName();
    seriesObject['count'] = capabilitiesCount;
    series.push(seriesObject);
  });

  return series.sort(function (a, b) {
    let x = a['name'];
    let y = b['name'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/**
 * Computes the name of all Program Iterations
 */
function getCategories(flowDistributionSeries) {
  let categories = [];
  flowDistributionSeries.forEach(seriesObject => {
    categories.push(seriesObject['name']);
  })
  return categories;
}

/**
 * Transforms the Flow Velocity series to count of Capabilities
 */
function transformSeries(sortedFlowDistributionSeries) {
  let transformedSeries = [];
  sortedFlowDistributionSeries.forEach(seriesObject => {
    transformedSeries.push(seriesObject['count']);
  });
  return transformedSeries;
}

function calculateAverageCapabilities(transformedSeries) {
  return (Math.round(transformedSeries.reduce( ( p, c ) => p + c, 0 ) / transformedSeries.length * 100) / 100).toFixed(2);
}

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

var layoutConfig = {
    layouts: selectedLayouts,
    active: selectedActiveLayout
};

return layoutConfig;

//------------------------------------------------------------------------------------------------------

cplace.setLogName('Current PI');
//Configurations
const TIMELINE_DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.timelineDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let piDashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(TIMELINE_DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(TIMELINE_DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(piDashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Timeline Dashboard</a>';

//------------------------------------------------------------------------------------------------------

