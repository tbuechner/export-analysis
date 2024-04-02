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