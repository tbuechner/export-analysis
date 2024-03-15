/*
*Highchart
*Displays the strategic priorities of different dimensions
*/


/***** Start configuration *****/

const PRIORITY = {
    TYPE: 'cf.cplace.solution.okr.priority',
    ATTR: {
        DATE: 'cf.cplace.solution.okr.date',
        TITLE: 'cf.cplace.solution.okr.title',
        DIMENSION: 'cf.cplace.solution.okr.dimension',
        STRATEGY: 'cf.cplace.solution.okr.strategyDashboard'
    }
}

const chartBackgroundColor = '#F2F4FA';
const todayPlotLineColor = '#244761';
const roadmapDimensions = ['Marketing', 'Sales', 'Engineering', 'Product', 'Company'];
const roadmapDimensionColors = ['#2364AA', '#3DA5D9', '#73BFB8', '#FEC601', '#f72585'];
const plotBandColorSuffix = '40';	// alpha value in hex
const plotLineColor = '#ffffff';
const milestoneSize = 7;

/***** End configuration *****/

function generateData(pages) {

    let dataObj = {
        categories: [], plotLines: [], plotBands: [], series: createSeries(), firstDate: null,
        lastDate: null
    }
    let yIndex = 0,
        yIndexStart = 0,
        lastRoadmapItemGroup = null;


    // loop each roadmap dimension and roadmap item
    roadmapDimensions.forEach(function (roadmapDimension, idx) {
        // Prepare roadmap items for current dimension
        let roadmapItemsByDimension = [];
        cplace.each(pages, function (roadmapItem) {
            if (roadmapDimension == roadmapItem.get(PRIORITY.ATTR.DIMENSION).getName()) {
                roadmapItemsByDimension.push(roadmapItem);
                // eval maximum axis extent
                let date = roadmapItem.get(PRIORITY.ATTR.DATE);
                dataObj.firstDate = (dataObj.firstDate == null || date.isBefore(dataObj.firstDate) ? date : dataObj.firstDate);
                dataObj.lastDate = (dataObj.lastDate == null || date.isAfter(dataObj.lastDate) ? date : dataObj.lastDate);
            }
        });

        /*
        // quarters as categories for x-axis (if *not* using datetime)
        let quarterDate = firstDate.withDayOfMonth(1).withMonthOfYear((((firstDate.getMonthOfYear() - 1) / 3) * 3) + 1);
        let lastDateShown = lastDate.plusMonths(5).plusWeeks(2);
        while (quarterDate.isBefore(lastDateShown)) {
          categories.push(quarterDate);
          quarterDate = quarterDate.plusMonths(3);
        }
        */

        yIndex++;
        yIndexStart = yIndex;
        yIndex++;

        roadmapItemsByDimension.sort(function (a, b) {
            let dateA = Date.parse(a.get('cf.cplace.solution.okr.date'));
            let dateB = Date.parse(b.get('cf.cplace.solution.okr.date'));

            const groupA = a.get('cf.cplace.solution.okr.roadmapItemGroup');
            const groupB = b.get('cf.cplace.solution.okr.roadmapItemGroup');
            if (groupA != null && groupB == null) {
                return -1;
            }
            if (groupA == null && groupB != null) {
                return 1;
            }
            if (groupA != null && groupB != null && groupA.getId() != groupB.getId()) {
                dateA = Date.parse(groupA.getBuiltinFeatureValue("createdAt"));
                dateB = Date.parse(groupB.getBuiltinFeatureValue("createdAt"));
            }

            return dateA - dateB;
        });

        lastRoadmapItemGroup = null;
        roadmapItemsByDimension.forEach(function (roadmapItem, idx2) {
            let date = roadmapItem.get(PRIORITY.ATTR.DATE);

            if (date) {
                let name = roadmapItem.getName();
                let url = roadmapItem.getUrl();

                // separate item groups by a line
                let roadmapItemGroup = roadmapItem.get('cf.cplace.solution.okr.roadmapItemGroup');
                let group = (roadmapItemGroup != null ? roadmapItemGroup.getName() : null);
                if ((lastRoadmapItemGroup == null && roadmapItemGroup != null && idx2 > 0)
                    || (lastRoadmapItemGroup != null && roadmapItemGroup == null)
                    || lastRoadmapItemGroup != null && roadmapItemGroup != null && lastRoadmapItemGroup.getId() != roadmapItemGroup.getId()) {
                    dataObj.plotLines.push(createPlotline(yIndex));
                    yIndex++;
                }

                /*
                let q = 0;
                while (q < categories.length && categories[q].isBefore(date)) {
                  q++;
                }
                */

                let dataItem = createDataItem(group, name, url, new Date(date), yIndex, roadmapDimensionColors[idx]);
                dataObj.series.data.push(dataItem);

                // remember last item group for pairing/separating them
                lastRoadmapItemGroup = roadmapItemGroup;
                yIndex++;
            }
        });

        // group whole dimension into a band
        if (roadmapItemsByDimension.length > 0) {
            dataObj.plotBands.push(createPlotband(roadmapDimension, yIndexStart, yIndex, roadmapDimensionColors[idx]));
        }

    });
    return dataObj;
}

function createSeries() {
    return {
        showInLegend: false,
        type: 'scatter',
        data: []
    };
}

function createDataItem(group, name, url, date, y, color) {
    return {
        tooltip: (group != null ? group + " - " : "") + name,
        name: name,
        url: url,
        x: Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
        y: y,
        color: color
    }
}

function createPlotline(value) {
    return {
        color: plotLineColor,
        width: 1,
        zIndex: 1,
        value: value
    }
}

function createPlotband(name, from, to, color) {
    return {
        from: from,
        to: to,
        label: {
            useHTML: true,
            text: "<h4>" + name + "</h4>",
            rotation: 0,
            x: 5,
            y: -10,
            textAlign: 'left'
        },
        color: color + plotBandColorSuffix
    }
}

function main() {
    let dataObj = generateData(pages);
    // add some months/weeks for displaying enough space on the right for longer labels
    let lastAxisDate = new Date(dataObj.lastDate.plusMonths(5).plusWeeks(2));

    let chart = {
        chart: {
            type: 'xrange',
            backgroundColor: chartBackgroundColor,
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            opposite: true,
            lineColor: chartBackgroundColor,
            tickInterval: 3 * 30 * 24 * 3600 * 1000, // 3 Months
            startOnTick: true,
            max: Date.UTC(lastAxisDate.getFullYear(), lastAxisDate.getMonth(), lastAxisDate.getDate(), 0, 0, 0, 0),
            labels: {
                useHTML: true,
                format: '<h3 style="text-align:center;">{value: %Y<br>Q%Q}</h3>',
                distance: 20,
                x: 50,
                style: {
                    color: '#234965'
                }
            },
            tickLength: 5,
            gridLineWidth: 1,
            gridLineColor: '#ccd6eb',
            gridLineDashStyle: 'Dash',
            plotLines: [{
                value: Date.now(),
                dashStyle: 'dot',
                width: 3,
                color: todayPlotLineColor,
                zIndex: 1,
                label: {
                    align: 'right',
                    y: 36
                }
            }],
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false
            },
            reversed: true,
            gridLineWidth: 0,
            plotLines: dataObj.plotLines,
            plotBands: dataObj.plotBands
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.tooltip}</b><br/>{point.x: %d.%m.%Y}',
            style: {
                pointerEvents: 'auto',
                color: '#234965'
            }
        },
        plotOptions: {
            scatter: {
                findNearestPointBy: 'xy',
                marker: {
                    enabled: true,
                    symbol: 'diamond',
                    radius: milestoneSize
                },
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    color: '#234965',
                    style: {
                        textOutline: 0
                    },
                    format: "<a href='{point.url}'>{point.name}</a>",
                    align: 'left',
                    verticalAlign: 'middle',
                    x: milestoneSize
                },
            }
        },
        series: [dataObj.series]
    };

    return chart;
}

return main();