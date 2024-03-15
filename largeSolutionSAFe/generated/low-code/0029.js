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