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