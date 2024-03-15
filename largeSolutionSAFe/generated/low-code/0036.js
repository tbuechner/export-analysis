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