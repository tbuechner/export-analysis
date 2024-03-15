/*
*Highchart
*Displays the cycle timeline
*/


const CYCLE = {
    TYPE: 'cf.cplace.solution.okr.cycle',
    ATTR: {
        START: 'cf.cplace.solution.okr.start',
        END: 'cf.cplace.solution.okr.end',
        YEAR: 'cf.cplace.solution.okr.year',
        STATUS: 'cf.cplace.solution.okr.status'
    }
}

const MEETING = {
    TYPE: 'cf.cplace.solution.okr.meeting',
    ATTR: {
        TITLE: 'cf.cplace.solution.okr.title',
        MEETING_TYPE: 'cf.cplace.solution.okr.meetingType',
        DATE: 'cf.cplace.solution.okr.date',
        CYCLE: 'cf.cplace.solution.okr.cycle'
    }
}

/*************INITIALIZATION************* */
const dataObj = { cycleNames: [], seriesCyclePhase: [], seriesInputPhase: [], seriesWorkshop: [], seriesStrategy: [] }
const counterArray = [];
const row = 0;
const values = [];
const sortedPages = []

let workshop;
let workshopDate;
let messages = {
    inputPhase: {
        en: 'Input Phase ',
        de: 'Input-Phase '
    },
    cyclePhase: {
        en: 'Cycle Implementation Phase ',
        de: 'Cycle Umsetzungs-Phase '
    },
    workshop: {
        en: 'Workshop ',
        de: 'Workshop '
    },
    strategy: {
        en: 'Strategy Update ',
        de: 'Strategie Update '
    }
};

function genearteData(embeddingPage) {
    const cycle = embeddingPage;
    const cycleName = cycle.getName();
    const cycleStart = cycle.get(CYCLE.ATTR.START);
    const cycleEnd = cycle.get(CYCLE.ATTR.END);
    const lang = cplace.utils().getCurrentUser().getUserLanguage();
    const meetings = cycle.getIncomingPages(MEETING.TYPE, MEETING.ATTR.CYCLE);
    cplace.each(meetings, function (meeting) {
        if (meeting.get('cf.cplace.solution.okr.meetingType') == "Workshop") {
            workshop = meeting;
        };
    })

    if (workshop) {
        workshopDate = workshop.get(MEETING.ATTR.DATE);
    }

    if (cycleStart && cycleEnd && workshop) {

        dataObj.cycleNames.push(cycleName);
        dataObj.seriesCyclePhase.push({
            x: cycleStart.getMillis(),
            x2: cycleEnd.getMillis(),
            y: row,
            color: '#006ae5',
            dataLabels: {
                format: messages.cyclePhase[lang] + cycleName
            },
            name: messages.cyclePhase[lang] + cycleName
        });
        dataObj.seriesInputPhase.push({
            x: workshopDate.minusDays(21).getMillis(),
            x2: workshopDate.getMillis(),
            color: '#00ffcd',
            y: row,
            dataLabels: {
                format: messages.inputPhase[lang]
            },
            name: messages.inputPhase[lang] + cycleName
        });
        dataObj.seriesWorkshop.push({
            x: workshopDate.getMillis(),
            y: row,
            date: cycleStart.toString("MMM/dd"),
            dataLabels: {
                format: messages.workshop[lang]
            },
            color: '#151821',
            name: messages.inputPhase[lang]
        })
        dataObj.seriesStrategy.push({
            x: cycleEnd.minusDays(28).getMillis(),
            y: row,
            date: cycleStart.toString("MMM/dd"),
            color: '#151821',
            dataLabels: {
                format: messages.strategy[lang]
            },
            name: messages.strategy[lang]
        })
    }

    return dataObj;

}
function main() {
    const data = genearteData(embeddingPage);

    const chart = {
        chart: {
            type: 'xrange',
            zoomType: 'x',
            backgroundColor: '#F2F4FA',
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            plotLines: [{
                value: new Date().setHours(0),
                dashStyle: 'dash',
                width: 2,
                zIndex: 5,
            }],
            lineColor: '#F2F4FA',
            tickLength: 1,
        },
        yAxis: {
            title: '',
            labels: {
                enabled: false
            },
            gridLineColor: 'rgba(255,255,255,0)',
            lineColor: '#F2F4FA',
            categories: data.cycleNames,
            reversed: true,
            max: 0
        },
        plotOptions: {
            series: {
                borderRadius: 5,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: '',
            data: data.seriesCyclePhase,
            dataLabels: {
                enabled: true
            }
        }, {
            name: '',
            data: data.seriesInputPhase,
            dataLabels: {
                enabled: true
            }
        }, {
            type: 'scatter',
            stickyTracking: false,
            marker: {
                enabled: true,
                symbol: 'diamond',
                lineColor: 'white',
                lineWidth: 1,
                radius: 13
            },
            data: data.seriesWorkshop
        }, {
            type: 'scatter',
            stickyTracking: false,
            marker: {
                enabled: true,
                symbol: 'diamond',
                lineColor: 'white',
                lineWidth: 1,
                radius: 13
            },
            data: data.seriesStrategy
        }],
        tooltip: {
            enabled: false
        }
    };
    return chart
}

return main();