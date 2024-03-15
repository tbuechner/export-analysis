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