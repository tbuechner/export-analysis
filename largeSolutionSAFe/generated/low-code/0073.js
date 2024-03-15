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