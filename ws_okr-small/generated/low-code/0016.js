/// <reference path="./typeDefinitions/cplaceJS_type.js" />
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
 const DEBUG = true;

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
             type: 'pie'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     SEMICIRCLE: {
         chart: {
             type: 'pie'
         },
         plotOptions: {
             startAngle: -90,
             endAngle: 90,
             center: ['50%', '75%'],
             size: '110%',
             innerSize: '70%'
         },
         isPercentageAvailable: true,
         isStackable: false,
         hasFloatingTitle: false
     },
     BAR: {
         chart: {
             type: 'bar'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
     COLUMN: {
         chart: {
             type: 'column'
         },
         plotOptions: {
             colorByPoint: true
         },
         isPercentageAvailable: true,
         isStackable: true,
         hasFloatingTitle: true
     },
 }
 
 
 
 /**
  * ==================================================================================
  * !!!! CHANGE FROM HERE !!!!
  */
 
 /**
  * Optional: Show a title inside of the chart area
  */
 const CHART_TITLE = ''
 
 /**
  * Set to null or leave blank to use the Pagename
  * 
  * TODO builtinFeatureValue starts with underscore: '_creator'
  */
 const BASE_ATTRIBUTE = 'cf.cplace.solution.okr.progressIndicator';
 
 /**
  * Optional: Stacking is only possible for bar and column charts
  * 
  */
 const STACK_ATTRIBUTE = null;
 
 /**
  * Optional: Define an attribute of the page that acts as weight. If null, each entry has a weight of 1.
  * The weight is used as sum of each datapoint.
  */
 const WEIGHT_ATTRIBUTE = null;
 
 /**
  * Define the base type of the chart: 
  * - CHART_DEFINITION.PIE
  * - CHART_DEFINITION.SEMICIRCLE
  * - CHART_DEFINITION.BAR
  * - CHART_DEFINITION.COLUMN
  */
 const CHART_TYPE_SELECTED = CHART_DEFINITION.PIE;
 
 /**
  * Define colors for the chart
  */
 const CHART_COLORS = {
     BACKGROUND: '#F2F4FA',
     TEXT: 'var(--text-color)',
     SERIES: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'],
     CATEGORY: {
         '#15 green': '#AEDB3C',
         '#25 yellow': '#FFBA00',
         '#35 red': '#DB0F35',
         '#45 outdated': '#bcbcbc'
     }
 }
 
 /**
  * @type {Boolean} sort axes ascending (true) or descending (false)
  */
 const CHART_SORT_ASCENDING = true;
 
 /**
  * @type {Boolean} show legend under chart
  */
 const CHART_SHOW_LEGEND = false;
 
 /**
  * @type {Boolean} show labels on all datapoints
  */
 const CHART_SHOW_LABELS = false;
 
 /**
  * @type {Boolean} show values as percentage
  */
 const CHART_SHOW_PERCENTAGE = false;
 
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
 
 const CHART_IS_STACKED = !!STACK_ATTRIBUTE && CHART_TYPE_SELECTED.isStackable;
 
 const CHART_POINT_FORMAT = (CHART_TYPE_SELECTED.isPercentageAvailable && CHART_SHOW_PERCENTAGE) ? '{point.percentage:.1f}%' : '{point.y}'
 
 /**
  * ====================
  * INITIALIZATION STAGE
  * ====================
  */
 
 let config = {
     title: {
         text: CHART_TITLE,
         align: 'center',
         verticalAlign: 'middle',
         margin: 0,
         useHtml: true,
         style: {
             color: CHART_COLORS.TEXT,
             fontSize: "2em",
             fontWeight: "bold"
         }
     },
     chart: CHART_TYPE_SELECTED.chart,
     legend: {
         enabled: CHART_SHOW_LEGEND,
         layout: 'horizontal',
         align: 'center',
         verticalAlign: 'bottom',
         itemStyle: {
             color: CHART_COLORS.TEXT,
             fontWeight: "normal"
         }
     },
     pane: {
         size: '100%'
     },
     tooltip: {
         pointFormat: '<b>' + CHART_POINT_FORMAT + '</b>'
     },
     plotOptions: {
         pie: {
            borderWidth: 10,
            borderColor: 'var(--body-bg)',
         },
         series: {
             showInLegend: CHART_SHOW_LEGEND,
             dataLabels: {
                 enabled: CHART_SHOW_LABELS,
                 format: '<b>{point.name}</b>: ' + CHART_POINT_FORMAT
             },
             cursor: 'pointer',
             stacking: (CHART_IS_STACKED && CHART_SHOW_PERCENTAGE) ? 'percent' : CHART_IS_STACKED
         }
     },
     colors: CHART_COLORS.SERIES,
     series: [],
     xAxis: {
         type: 'category'
     },
     yAxis: {
         allowDecimals: false,
         title: ''
     }
 }
 
 config.chart.backgroundColor = CHART_COLORS.BACKGROUND
 config.chart.spacingBottom = 0
 config.chart.spacingTop = 0
 
 if (CHART_TITLE && CHART_SHOW_LEGEND && CHART_TYPE_SELECTED.hasFloatingTitle) {
     config.title.verticalAlign = 'top'
 }
 
 if (CHART_TYPE_SELECTED.plotOptions) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type] = CHART_TYPE_SELECTED.plotOptions;
 }
 
 if (CHART_IS_STACKED) {
     config.plotOptions[CHART_TYPE_SELECTED.chart.type].colorByPoint = false;
     config.tooltip.pointFormat = '{series.name}: ' + CHART_POINT_FORMAT + '<br/>Total: {point.stackTotal}'
     config.plotOptions.series.dataLabels.format = '{series.name}: ' + CHART_POINT_FORMAT
 }
 
 if (CHART_TOOLTIP_OVERRIDE !== null) {
     config.tooltip.pointFormat = CHART_TOOLTIP_OVERRIDE;
 }
 
 
 /**
  * ================
  * PROCESSING STAGE
  * ================ 
  */
 if (pages.length === 0) {
     return config
 }
 
 let datasetSize = pages.length;
 let series = [];
 let series_labels = {};
 let categories = {};
 let data = {};
 let pageCounter = 0;
 pages.forEach(function (page) {
     let value = getValueAndLabelOfAttribute(page, BASE_ATTRIBUTE)
     let weight = 1;
     if (value === null) {
         return
     }
 
     let series = getValueAndLabelOfAttribute(page, STACK_ATTRIBUTE);
 
     if (!CHART_IS_STACKED || series === null) {
         series = {
             value: '',
             label: CHART_TITLE
         }
     }
 
     if (WEIGHT_ATTRIBUTE) {
         weight = page.get(WEIGHT_ATTRIBUTE) || 1
     }
 
     if (value.length) {
         value.forEach(function (item) {
             addSeriesData(item, weight, series, data, categories, series_labels)
         })
     } else {
         addSeriesData(value, weight, series, data, categories, series_labels)
     }
     pageCounter++;
 });

 // This will display the number of pages in the center
 config.title.text += pageCounter;
 
 /**
  * TODO Sort stacked series, too
  */
 
 Object.keys(series_labels).sort().forEach(function (series_label) {
     series_labels[series_label] = series.length
 
     series.push({
         name: series_label,
         type: CHART_TYPE_SELECTED.chart.type,
         data: [],
         innerSize: '50%'
     })
 
 })
 
 Object.keys(data).forEach(function (key) {
     let currentDataItem = {
         name: data[key].name,
         y: data[key].count
     }
     let seriesId = series_labels[data[key].series]
 
     if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series_internal)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series_internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].internal)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].internal]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].series)) {
         series[seriesId].color = CHART_COLORS.CATEGORY[data[key].series]
     } else if (CHART_COLORS.CATEGORY.hasOwnProperty(data[key].name)) {
         currentDataItem.color = CHART_COLORS.CATEGORY[data[key].name]
     }
 
     series[seriesId].data.push(currentDataItem)
 })
 
 /**
  * Add empty entries to series and sort them
  */
  let allDataKeys = [];
  Object.keys(data).forEach(function (key) {
      let label = data[key].name;
      if (allDataKeys.indexOf(label) !== -1) {
          return;
      }
  
      series.forEach(function (serie) {
          if (!serie.data.some(function (data) {
                  return data.name === label
              })) {
              serie.data.push({
                  name: label,
                  y: 0
              })
          }
      })
      allDataKeys.push(label)
  })
 
 /**
  * sort series.data by name
  */
 series.forEach(function (serie) {
     serie.data.sort(function (a, b) {
         if (!a.hasOwnProperty('name') || a.name == b.name) {
             return 0
         }
         /**
          * sort depending on CHART_SORT_ASCENDING
          */
         return ((CHART_SORT_ASCENDING && a.name > b.name) || (!CHART_SORT_ASCENDING && a.name < b.name)) ? 1 : -1
     })
 })
 
 /**
  * ============
  * OUTPUT STAGE
  * ============ 
  */
 
 config.series = series;
 return config;
 
 /**
  * ==================
  * BUSINESS FUNCTIONS
  * ==================
  */
 
 /**
  * ================
  * HELPER FUNCTIONS
  * ================
  */
 
 /**
  * 
  * @param {object} value 
  * @param {Number} weight 
  * @param {object} series 
  * @param {object[]} data 
  * @param {object[]} categories 
  * @param {String[]} series_labels 
  */
 function addSeriesData(value, weight, series, data, categories, series_labels) {
     let key = value.value + series.value;
 
     if (data[key] === undefined) {
         data[key] = {
             count: 0,
             name: value.label,
             internal: value.value,
             series: series.label,
             series_internal: series.value
         }
     }
 
     data[key].count += weight || 1;
 
     if (!categories.hasOwnProperty(data[key].name)) {
         categories[data[key].name] = 0
     }
 
     if (!series_labels.hasOwnProperty(data[key].series)) {
         series_labels[data[key].series] = 0
     }
 }
 
 
 /**
  * 
  * @param {Page} page 
  * @param {object} attribute 
  * @returns 
  */
 function getValueAndLabelOfAttribute(page, attribute) {
     let result = null;
     if (!page) {
         return result;
     }
     if (!attribute) {
         return {
             value: page.getRealUid(),
             label: page.getName()
         };
     }
 
     let value = page.get(attribute, false);
     if (value === null) {
         return result;
     }
     let value_label = page.get(attribute, true) || value;
 
     let className = typeof value === 'object' ? String(value.getClass()) : 'String'
 
     switch (className) {
         case 'String':
         case 'class java.lang.String':
             result = {
                 value: value,
                 label: value_label
             }
             break;
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedGroup':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
         case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
             result = {
                 value: value.getRealUid(),
                 label: value.getName()
             }
             break;
         case 'class java.util.ArrayList':
         case 'class com.google.common.collect.SingletonImmutableList':
         case 'class com.google.common.collect.RegularImmutableList':
             /**
              * TODO Multi-Value
              */
             result = [];
             cplace.each(value, function (item) {
                 if (typeof item !== 'object' || String(item.getClass()) === 'class java.lang.String') {
                     /**
                      * FIXME enum label / enum internal name
                      */
                     result.push({
                         value: item,
                         label: item
                     })
                 } else {
                     result.push({
                         value: item.getRealUid(),
                         label: item.getName()
                     })
                 }
             })
             break;
         default:
             /**
              * TODO Reference
              */
             log('Class of ' + value + ' is "' + value.class + '"')
             log(typeof value.class)
             log(typeof value)
     }
 
     return result
 }
 
 
 /**
  * Log to cplace
  * @param {any} text 
  */
 function log(text) {
     if (!DEBUG) {
         return
     }
     let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;
 
     cplace.log(logOutput);
 }