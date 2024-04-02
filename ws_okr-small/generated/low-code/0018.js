var cycle = embeddingPage;
var meetings = cycle.getIncomingPages('cf.cplace.solution.okr.meeting', 'cf.cplace.solution.okr.cycle');
var workshop;
cplace.each(meetings, function(meeting) {
  if (meeting.get('cf.cplace.solution.okr.meetingType') == "Workshop") {
    workshop = meeting;
  };
})

var cycleNames = [];
var counterArray = [];
var row = 0;
var values = [];
var sortedPages = []
var seriesCyclePhase = [];
var seriesInputPhase = [];
var seriesWorkshop = [];
var seriesStrategy = [];
var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
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


var cycleName = cycle.getName();
var cycleStart = cycle.get('cf.cplace.solution.okr.start');
var cycleEnd = cycle.get('cf.cplace.solution.okr.end');
var workshopDate;
if (workshop) {
  workshopDate = workshop.get('cf.cplace.solution.okr.date');  
}

if (cycleStart && cycleEnd && workshop) {

  cycleNames.push(cycleName);
  seriesCyclePhase.push({
    x: cycleStart.getMillis(),
    x2: cycleEnd.getMillis(),
    y: row,
    color: '#006ae5',
    dataLabels: {
      format: messages.cyclePhase[lang] + cycleName
    },
    name: messages.cyclePhase[lang] + cycleName
  });
  seriesInputPhase.push({
    x: workshopDate.minusDays(21).getMillis(),
    x2: workshopDate.getMillis(),
    color: '#151821',
    y: row,
    dataLabels: {
      format: messages.inputPhase[lang]
    },
    name: messages.inputPhase[lang] + cycleName
  });
  seriesWorkshop.push({
    x: workshopDate.getMillis(),
    y: row,
    date: cycleStart.toString("MMM/dd"),
    dataLabels: {
      format: messages.workshop[lang]
    },
    color: '#a5ffd6',
    name: messages.inputPhase[lang]
  })
  seriesStrategy.push({
    x: cycleEnd.minusDays(28).getMillis(),
    y: row,
    date: cycleStart.toString("MMM/dd"),
    color: '#a5ffd6',
    dataLabels: {
      format: messages.strategy[lang]
    },
    name: messages.strategy[lang]
  })


}

var chart = {
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
    categories: cycleNames,
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
    data: seriesCyclePhase,
    dataLabels: {
      enabled: true
    }
  }, {
    name: '',
    data: seriesInputPhase,
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
    data: seriesWorkshop
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
    data: seriesStrategy
  }],
  tooltip: {
    enabled: false
  }
};
return chart