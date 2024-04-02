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