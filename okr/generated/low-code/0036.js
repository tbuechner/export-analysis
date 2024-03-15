/*
*Highcahrt
*Displays the organisation chart
*/

cplace.setLogName('hc_organisation_chart');


/// <reference path="../../typeDefinitions/cplaceJS_type.js" />
/**
 * Template for Highchart
 *
 * Instructions:
 * - configure a highchart widget with a search or connected table
 * - look in this script for the following line: !!!! CHANGE FROM HERE !!!! and change your options there
 * - the main options are: BASE_ATTRIBUTE and CHART_TYPE_SELECTED
 *
 * TODO:
 * - Color Attribute
 * - builtin Attributes
 * - more charts
 * - date format for series / data points
 * - multi language
 * - Alias label for internal names
 * - sort of series
 *
 *
 *
 * @author Bastian Rang <bastian.rang@collaboration-factory.de>
 * @version 2021-08-05
 */

/**
 * ======================
 * LOG AND DEBUG SETTINGS
 * ======================
 */
const DEBUG = false;

/**
 * Hint: set a declarative name for all of your logs
 */
cplace.setLogName("highchart-template");

/**
 * ===================
 * CONFIGURATION STAGE
 * ===================
 */

/**
 * DO NOT CHANGE THESE CONFIGURATIONS WITHOUT STRONG REASON !!!!!
 */
const CHART_DEFINITION = {
    PIE: {
        chart: {
            type: "pie",
        },
        isPercentageAvailable: true,
        isStackable: false,
        hasFloatingTitle: false,
    },
    SEMICIRCLE: {
        chart: {
            type: "pie",
        },
        plotOptions: {
            startAngle: -90,
            endAngle: 90,
            center: ["50%", "75%"],
            size: "110%",
            innerSize: "50%",
        },
        isPercentageAvailable: true,
        isStackable: false,
        hasFloatingTitle: false,
    },
    BAR: {
        chart: {
            type: "bar",
        },
        plotOptions: {
            colorByPoint: true,
        },
        isPercentageAvailable: true,
        isStackable: true,
        hasFloatingTitle: true,
    },
    COLUMN: {
        chart: {
            type: "column",
        },
        plotOptions: {
            colorByPoint: true,
        },
        isPercentageAvailable: true,
        isStackable: true,
        hasFloatingTitle: true,
    },
};

/**
 * ==================================================================================
 * !!!! CHANGE FROM HERE !!!!
 */

/**
 * Optional: Show a title inside of the chart area
 */
const CHART_TITLE = "";

/**
 * Define the base type of the chart:
 * - CHART_DEFINITION.PIE
 * - CHART_DEFINITION.SEMICIRCLE
 * - CHART_DEFINITION.BAR
 * - CHART_DEFINITION.COLUMN
 */
const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;

/**
 * Define the color of a node by it's ID.
 */
const PAGE_COLOR_MAP = {
    "Company": "var(--color-company)",
    "Engineering": "var(--color-engineering)",
    "Product": "var(--color-product)",
    "Marketing": "var(--color-marketing)",
    "Sales": "var(--color-sales)",
};
/**
 * Define colors for the chart
 */
const CHART_COLORS = {
    BACKGROUND: "var(--body-bg)",
    TEXT: "var(--text-color)",
    SERIES: ["#e31a1c", "#fdbf6f", "#ff7f00", "#6a3d9a"],
    CATEGORY: {
        "#15 green": "#AEDB3C",
        "#25 yellow": "#FFBA00",
        "#35 red": "#DB0F35",
        "#45 outdated": "#bcbcbc",
    },
};

/**
 * @type {Boolean} show legend under chart
 */
const CHART_SHOW_LEGEND = false;

/**
 * @type {Boolean} show labels on all datapoints
 */
const CHART_SHOW_LABELS = true;

/**
 * @type {null|String} override tooltip text
 * - use {point.y} as placeholder for absolute values
 * - use {point.percentage:.1f}% as placeholder for percantage
 * - use {point.stackTotal} for sum of stack
 * - use {point.name} for name of data point
 * - use {series.name} for name of data series
 */
const CHART_TOOLTIP_OVERRIDE = null;

/**
 * DO NOT CHANGE AFTER THIS LINE
 * ==================================================================================
 */

const CHART_POINT_FORMAT = "{point.y}";

/**
 * ====================
 * INITIALIZATION STAGE
 * ====================
 */
const levelConfig = [
    {
        level: 0,
        color: "silver",
    },
    {
        level: 1,
        color: "#980104",
    },
    {
        level: 2,
        color: "#359154",
    },
];
    let nodes = [];
    let data = [];
    let series = [];
/**
 * ================
 * PROCESSING STAGE
 * ================
 */


function generateData(pages) {


    pages.forEach(function (page) {
        nodes.push(mapToDataNode(page));
        loadChildren(page);
    });
  
  
  
    series.push({
        type: "organization",
        name: "",
        keys: ["from", "to"],
        // Hierarchy definition
        data: data,
        // Styling definiton
        levels: levelConfig,
        // Content definiton (getting matched to "data" by "id")
        nodes: nodes,
    });

    return series
}

function main() {
    let series = generateData(pages);

    if (CHART_TOOLTIP_OVERRIDE !== null) {
        config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
    }

    let config = {
        chart: {
            inverted: true,
            backgroundColor: "#f3f4fa",
        },
        title: {
            text: CHART_TITLE,
            useHtml: true,
            style: {
                color: CHART_COLORS.TEXT,
                fontSize: "2em",
                fontWeight: "bold",
            },
        },
        legend: {
            enabled: CHART_SHOW_LEGEND,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: CHART_COLORS.TEXT,
                fontWeight: "normal",
            },
        },
        pane: {
            size: "100%",
        },
        tooltip: false,
        plotOptions: {
            pie: {
                borderWidth: 10,
                borderColor: "var(--body-bg)",
            },
            series: {
                showInLegend: CHART_SHOW_LEGEND,
                dataLabels: {
                    enabled: CHART_SHOW_LABELS,
                    format: "<b>{point.name}</b><br/><span><b>Set Lead: </b><span>{point.leads}</span></span>",
                },
                cursor: "default",
            },
        },
        colors: CHART_COLORS.SERIES,
        series: series,
    };

    return config

}

return main();

//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

function loadChildren(page) {
    let children = page.getIncomingPages(
        "cf.cplace.solution.okr.organizationalUnit",
        "cf.cplace.solution.okr.organizationalUnit"
    );
    
  
    children.forEach(function (child) {
        nodes.push(mapToDataNode(child));
        data.push([page.getId(), child.getId()]);

        // go on
        loadChildren(child);
    });
}

function mapToDataNode(page) {
    let map = {
        id: page.getId(),
        name: page.getName(),
        height: 75,
    };

    let color = PAGE_COLOR_MAP[page.getName()];
    if (color) {
        map.color = color;
    }

    let set = getCurrentSet(page);
    let leads = set.get("cf.cplace.solution.okr.setLead");
    let leadNames = "";
    leads.forEach(function (lead) {
        if (leadNames) {
            leadNames += "<br/>";
        }
        leadNames += lead.getName();
    });

    map.leads = leadNames;
    return map;
  
}



/**
 * ================
 * HELPER FUNCTIONS
 * ================
 */

function getCurrentCycle(page) {
    let search = new Search();
    search
        .add(Filters.type("cf.cplace.solution.okr.cycle"))
        .add(Filters.space(page.getSpace()))
        .add(Filters.customAttribute("cf.cplace.solution.okr.status").eq("#25 Current"));

    return search.findAllPages();
}

function getCurrentSet(unit) {
    let currentCycle = getCurrentCycle(unit);
    let result = null;

    currentCycle.forEach(function (cycle) {
        let search = new Search();
        search
            .add(Filters.type("cf.cplace.solution.okr.set"))
            .add(Filters.space(unit.getSpace()))
            .add(Filters.customAttribute("cf.cplace.solution.okr.cycle").references(cycle))
            .add(Filters.customAttribute("cf.cplace.solution.okr.organizationalUnit").references(unit));

        let sets = search.findAllPages();

        sets.forEach(function (set) {
            result = set;
        });

        return;
    });

    return result;
}
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