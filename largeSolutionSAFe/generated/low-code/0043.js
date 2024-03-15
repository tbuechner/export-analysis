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