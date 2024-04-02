/**
 * @author Nepomuk Heimberger
 * @description Creates Flow Predictability highchart
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
cplace.setLogName('highchart-flow-predictability');


//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

const OBJECTIVE = {
  TYPE: 'cf.cplace.solution.safe.objective',
  ATTR: {
    PROGRAM_INCREMENT: 'cf.cplace.solution.safe.timebox',
    BUSINESS_VALUE: 'cf.cplace.solution.safe.businessValue',
    ACTUAL_VALUE: 'cf.cplace.solution.safe.actualValue',
    COMMITMENT: {
      INTERNAL_NAME: 'cf.cplace.solution.safe.commitment',
      ENUM_VALUES: {
        COMMITTED: '#15 - Committed',
        UNCOMMITTED: '#25 - Uncommitted'
      }
    },
     SAFE_LEVEL: {
      INTERNAL_NAME: 'cf.cplace.solution.safe.SAFeLevel',
      ENUM_VALUES: {
        SOLUTION: '#15 - Solution',
        PROGRAM: '#25 - Program',
        TEAM: '#35 - Team'
      }
    }
  }
};


const COLUMN_COLOR1 = '#26285d';
const COLUMN_COLOR2 = '#b8d4fa';
const LINE_COLOR = '#368F8B';
const LINE_COLOR_2 = '#155451';

//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//

const flowPredictabilitySeries = getFlowPredictabilitySeries(pages);
const sortedSeries = sortSeriesByName(flowPredictabilitySeries);
const categories = getCategories(sortedSeries);
const transformedSeries = transformSeries(sortedSeries);

const config = {
  title: {
    text: 'Flow Predictability Measure'
  },
  xAxis: {
    categories: categories,
    title: {
      text: ''
    }
  },
  yAxis: [{
    title: {
      text: 'Objectives Achieved'
    },
    allowDecimals: false,
  },
  {
    title: {
      text: 'Predictability',
      style: {
        color: LINE_COLOR
      },
    },
    labels: {
      style: {
        color: LINE_COLOR
      },
    },    
    plotLines: [{
      color: LINE_COLOR_2,
      value: 80,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4
    },
    {
      color: LINE_COLOR_2,
      value: 100,
      width: '1',
      dashStyle: 'LongDash',
      zIndex: 4
    }],
    opposite: true
  }],
  plotOptions: {
    series: {
      pointWidth: 50
    }
  },
  colors: [COLUMN_COLOR1, COLUMN_COLOR2],
  series: Object.values(transformedSeries)
}

return config;



/**
 * Creates an array of a map of Program Iteration names and program predictability measure
 */
function getFlowPredictabilitySeries(pages) {
  let piSeries = []; //[{'name': '', 'values': []}]

  cplace.each(pages, programIncrement => {
    const objectives = programIncrement.getIncomingPages(OBJECTIVE.TYPE, OBJECTIVE.ATTR.PROGRAM_INCREMENT);
    let totalBusinessValue = 0
    let totalActualValue = 0
    cplace.each(objectives, objective => {
      const safeLevel = objective.get(OBJECTIVE.ATTR.SAFE_LEVEL.INTERNAL_NAME);
      if (safeLevel === OBJECTIVE.ATTR.SAFE_LEVEL.ENUM_VALUES.SOLUTION) {
        const commitment = objective.get(OBJECTIVE.ATTR.COMMITMENT.INTERNAL_NAME);
        if (commitment === OBJECTIVE.ATTR.COMMITMENT.ENUM_VALUES.COMMITTED) {
          totalBusinessValue += objective.get(OBJECTIVE.ATTR.BUSINESS_VALUE);
        }
        totalActualValue += objective.get(OBJECTIVE.ATTR.ACTUAL_VALUE);
      }
    });

    let seriesObject = {};
    seriesObject['name'] = programIncrement.getName();
    const flowPredictabilityMeasure = totalBusinessValue ? Math.round((totalActualValue / totalBusinessValue) * 100) * 100 / 100 : 0;
    seriesObject['values'] = [flowPredictabilityMeasure, totalBusinessValue, totalActualValue]
    piSeries.push(seriesObject);
  });

  return piSeries;
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
 * Transforms the array of series objects to the actual highchart configuration series
 */
function transformSeries(series) {
  let flowPredictabilitySeries = {
    flowPredictabilityMeasure: {type: 'spline', 'name': 'Flow Predictability Measure', yAxis:1, data: [],tooltip: {valueSuffix: ' %'}, color: LINE_COLOR},
    totalBusinessValue: {type: 'column', name: 'Planned Business Value', yAxis:0, data: []},
    actualBusinessValue: {type: 'column', name: 'Actual Business Value', yAxis:0, data: []},
    // percentageDottedLine80: {type: 'spline', dashStyle: 'shortdot', data: []},
    // percentageDottedLine100: {type: 'spline', dashStyle: 'shortdot', data: []}
  };

  series.forEach(seriesObject => {
    flowPredictabilitySeries['flowPredictabilityMeasure']['data'].push(seriesObject['values'][0]);
    flowPredictabilitySeries['totalBusinessValue']['data'].push(seriesObject['values'][1]);
    flowPredictabilitySeries['actualBusinessValue']['data'].push(seriesObject['values'][2]);
    // flowPredictabilitySeries['percentageDottedLine80']['data'].push(80);
    // flowPredictabilitySeries['percentageDottedLine100']['data'].push(100);
  });

  return flowPredictabilitySeries;
}

/**
 * Sorts the series by name
 */
function sortSeriesByName(series) {
  return series.sort(function (a, b) {
    let x = a['name'];
    let y = b['name'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
/**
 * Returns an array of all IDs of the pages
 */
function getPagesUids(pages) {
    let pagesUids = [];
    cplace.each(pages, page => {
        pagesUids.push(page.getId())
    })
    return pagesUids;
}