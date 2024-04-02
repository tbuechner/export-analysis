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