/**
 * Identifier: highchart-programIncrement-progress
 * Type of chart: multi pie chart
 * Type of search pages: cf.cplace.solution.safe.team, cf.cplace.solution.safe.story
 * Functionality: visualizes different kinds of kpis
 * 
 * INSTRUCTIONS TO ADD CHARTS
 * 1. Increase TOTAL_NUMBER_OF_KPIS +1
 * 2. Define Following Values
 *      - CX_TITLE 
 *      - CX_ACTUAL
 *      - CX_ACTUAL_PERCENTAGE
 *      - CX_DISPLAY_NUMBER 
 *      - CX_DISPLAY_TEXT 
 *      - CX_COLOR 
 * 3. Create chart
 *      - createChart(CX_TITLE, CX_ACTUAL_PERCENTAGE, CX_DISPLAY_NUMBER, CX_DISPLAY_TEXT, CX_COLOR) {
 * 
 * 
 * @author Lukas Scheiring (cF)
 * Last edited: 18.08.2022
 */

//--------------------------------------------------------------------------------------//
//                                       LOG AND DEBUG                                  //
//--------------------------------------------------------------------------------------//
const DEBUG = false;
cplace.setLogName('highchart-programIncrement-progress');

//--------------------------------------------------------------------------------------//
//                                       CONFIGURATION                                  //
//--------------------------------------------------------------------------------------//

//CHART COLOURS
const COLOURS = {
    TEXT_COLOR : '#003653',
    BACKGROUND_COLOR : '#ffffff',
    GREY : 'gray',
    RED: '#f30000',
    DARK_RED : '#9e0000',
    YELLOW: '#ffc700',
    GREEN: '#5ab500',
    BLUE : '#A6CAD8'
}

//CHART SETTINGS
const TOTAL_NUMBER_OF_KPIS = 4
const Y_POSITION = '40%'

//LANGUAGE SETTINGS
const NAMINGS = {
    de: {
        CHART_TITLE: '',
    },
    en: {
        CHART_TITLE: '',
    }
};

//PLACEHOLDER
const PROGRAM_INCREMENT = {
    TYPE : 'cf.cplace.solution.safe.programIncrement',
    ATTR : {
        TITLE : 'cf.cplace.solution.safe.title',
        PROGRAM : 'cf.cplace.solution.safe.program',
        START_DATE : 'cf.cplace.solution.safe.startDate',
        END_DATE : 'cf.cplace.solution.safe.endDate',
        PREDECESSOR : 'cf.cplace.solution.safe.predecessor',
        PERIOD_STATUS : 'cf.cplace.solution.safe.periodStatus',
        CAPACITY : 'cf.cplace.solution.safe.capacity'
    }
}

const TEAM = {
    TYPE : 'cf.cplace.solution.safe.team',
    ATTR : {
        VELOCITY : 'cf.cplace.solution.safe.velocity',
        CAPACITY : 'cf.cplace.solution.safe.capacity',
    }
}

const STORY = {
    TYPE : 'cf.cplace.solution.safe.story',
    ATTR : {
        ITERATION : 'cf.cplace.solution.safe.iteration',
        STATUS : 'cf.cplace.solution.safe.status',
        STORY_POINTS : 'cf.cplace.solution.safe.storyPoints'
    },
    ENUM_STATUS : {
        ANALYSIS : '#10 - analysis',
        BACKLOG : '#20 - backlog',
        IN_PROGRESS : '#40 - in progress',
        DONE : '#50 - done',
        OBSOLETE : '#60 - obsolete'
    }
}

const ITERATION = {
    TYPE : 'cf.cplace.solution.safe.iteration',
    ATTR: {
        ITERATION : 'cf.cplace.solution.safe.iteration',
        PI: 'cf.cplace.solution.safe.programIncrement',
    }
}



//--------------------------------------------------------------------------------------//
//                                       INITIALIZATION                                 //
//--------------------------------------------------------------------------------------//
log('Start...')
let currentUser = cplace.utils().getCurrentUser()
const userLanguage = currentUser.getUserLanguage()
let programIncrement = embeddingPage;
let chartIndex = 0

//Container
let teams = []
let stories = []

let series = []
let yAxis = []
let pane = []

//Dates
let piStartDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.START_DATE).withTimeAtStartOfDay()
let piEndDate = programIncrement.get(PROGRAM_INCREMENT.ATTR.END_DATE).withTimeAtStartOfDay()
let today = new DateTime().withTimeAtStartOfDay()

//KPIs
let totalDaysOfPI = Days.daysBetween(piStartDate,piEndDate).getDays();
let passedDaysOfPI = getPassedDays (piStartDate, piEndDate, today, totalDaysOfPI)



//let totalCapacity = 0;
let velocityOfLastPI = 0
let totalLoad = 0
let spDone = 0


//--------------------------------------------------------------------------------------//
//                                       PROCESSING STAGE                               //
//--------------------------------------------------------------------------------------//

//Group pages
cplace.each(pages, page => {
    switch (page.getBuiltinFeatureValue('customType')) {
        case TEAM.TYPE:
            teams.push(page)
            break;
        case STORY.TYPE:
            stories.push(page)
            break;
        default:
            break;
    }
})

//calculate velocity
let lastPI = programIncrement.get(PROGRAM_INCREMENT.ATTR.PREDECESSOR)
if (lastPI) {
    log('Last PI: ' + lastPI.getName())
    let iterations = lastPI.getIncomingPages(ITERATION.TYPE, ITERATION.ATTR.PI)
    cplace.each(iterations, iteration => {
        log('Check iteration: ' + iteration.getName())
        let storiesOfIteration = iteration.getIncomingPagesFromAllSpaces(STORY.TYPE, STORY.ATTR.ITERATION)
        cplace.each(storiesOfIteration, storyOfIteration => {
            log('Check story: ' + storyOfIteration.getName())
            if (storyOfIteration.get(STORY.ATTR.STATUS) === STORY.ENUM_STATUS.DONE) {
                velocityOfLastPI += (storyOfIteration.get(STORY.ATTR.STORY_POINTS) || 0)
            }
        })
    })
}




//Load + SP done
cplace.each(stories, story => {
    let storyPoints = story.get(STORY.ATTR.STORY_POINTS) || 0
    totalLoad += storyPoints

    if (story.get(STORY.ATTR.STATUS) === STORY.ENUM_STATUS.DONE) {
        spDone += storyPoints
    }

})



//--------------------------------------------------------------------------------------//
//                                       KPIs & CHART                                   //
//--------------------------------------------------------------------------------------//

//Chart 1 - passed days
const C1_TITLE = 'Days passed'
const C1_ACTUAL = passedDaysOfPI
const C1_ACTUAL_PERCENTAGE = Math.round((passedDaysOfPI / totalDaysOfPI) * 100)  ? Math.round((passedDaysOfPI / totalDaysOfPI) * 100) : 0;
const C1_DISPLAY_NUMBER = C1_ACTUAL_PERCENTAGE + '%'
const C1_DISPLAY_TEXT = '<b>DAYS PASSED</b><br>' + passedDaysOfPI + '/' + totalDaysOfPI
const C1_COLOR = COLOURS.GREEN

createChart(C1_TITLE, C1_ACTUAL_PERCENTAGE, C1_DISPLAY_NUMBER, C1_DISPLAY_TEXT, C1_COLOR)


//KPI 2 - Load vs Capacity
//Capacity + Velocity
let totalCapacity = programIncrement.get(PROGRAM_INCREMENT.ATTR.CAPACITY);
if(totalCapacity){
const C2_TITLE = 'Load vs. Capacity'
const C2_ACTUAL = totalLoad
const C2_ACTUAL_PERCENTAGE= Math.round((totalLoad / totalCapacity) * 100) || 0
const C2_DISPLAY_NUMBER = C2_ACTUAL_PERCENTAGE + '%'
const C2_DISPLAY_TEXT = '<b>LOAD VS. CAPACITY</b><br>' + totalLoad + '/' + totalCapacity

let c2_color = COLOURS.GREEN
if (Math.round((totalLoad / totalCapacity) * 100) >= 90) {
    c2_color = COLOURS.YELLOW
    if (Math.round((totalLoad / totalCapacity) * 100) > 100) {
        c2_color = COLOURS.RED
    }    
}    

createChart(C2_TITLE, C2_ACTUAL_PERCENTAGE, C2_DISPLAY_NUMBER, C2_DISPLAY_TEXT, c2_color)
}

//KPI 3 - Story Points done
const C3_TITLE = 'Done SP'
const C3_ACTUAL = spDone
const C3_ACTUAL_PERCENTAGE = Math.round((spDone / totalLoad) * 100) || 0
const C3_DISPLAY_NUMBER = C3_ACTUAL_PERCENTAGE + '%'
const C3_DISPLAY_TEXT = '<b>DONE SP</b><br>' + spDone + '/' + totalLoad
const C3_COLOR = COLOURS.GREEN

createChart(C3_TITLE, C3_ACTUAL_PERCENTAGE, C3_DISPLAY_NUMBER, C3_DISPLAY_TEXT, C3_COLOR)


//KPI 4 - Velocity
const C4_TITLE = 'Velocity of Last PI'
const C4_ACTUAL = 100
const C4_ACTUAL_PERCENTAGE = 100
const C4_DISPLAY_NUMBER = Math.round(velocityOfLastPI)
const C4_DISPLAY_TEXT = '<b>VELOCITY OF LAST PI</b><br>over all Teams'
const C4_COLOR = COLOURS.BLUE

createChart(C4_TITLE, C4_ACTUAL_PERCENTAGE, C4_DISPLAY_NUMBER, C4_DISPLAY_TEXT, C4_COLOR)




log('End...')
return {
    chart: {
        type: 'solidgauge',
    },
    
    title: {
        text: NAMINGS[userLanguage].CHART_TITLE
    },
    series: series,
    yAxis: yAxis,
    pane: pane,
    tooltip : {
        enabled: false
    },
    plotOptions: {
        solidgauge : {
            enableMouseTracking: false,
        }
    },
}


//--------------------------------------------------------------------------------------//
//                                       BUSINESS FUNCTIONS                             //
//--------------------------------------------------------------------------------------//

function createChart(title, actualRel, displayNumber, displayText, color) {
    series.push(getSeriesObject(title, actualRel, displayNumber, chartIndex, color))
    yAxis.push(getYAxisObject(displayText, chartIndex, 0, 100))
    pane.push(getPaneObject(getXAxisPosition(chartIndex), Y_POSITION))
    chartIndex++;
}

function getXAxisPosition (kpiIndex) {
    return 120 * (kpiIndex + 1) / (TOTAL_NUMBER_OF_KPIS + 1) -10 + '%'
}

function getPassedDays (piStartDate, piEndDate, today, totalDaysOfPI) {
    if (today.isBefore(piStartDate)) {
        return 0
    }
    if (piEndDate.isBefore(today)) {
        return totalDaysOfPI
    }
    return Days.daysBetween(piStartDate,today).getDays()
}

function getSeriesObject (title, actual, label, index, color) {
    return {
        name : title,
        data : [{
            name : title,
            color : color,
            y : actual,
            innerRadius: '80%',
            radius: '100%',
            dataLabels : {
                format :  '<h1 style="font-size:13">' + label+ '</h1>',
                borderWidth: 0,
                color: COLOURS.GREY,
                verticalAlign: 'middle',
                useHTML: true
            },
        }],
        yAxis: index,
    }
}


function getYAxisObject (axisTitle, index, min, max) {
    return {
        min: min,
        max: max,
        pane : index,
        title: {
            text: axisTitle,
            useHTML: true,
            y: 110,
        },
        labels: {
            enabled : false
        },
        /*stops: [
            [0.1, COLOURS.GREEN], // green
            [0.9, COLOURS.YELLOW], // yellow
            [0.99, COLOURS.RED] // red
        ],*/
        lineWidth: 0,
        tickWidth: 0,
        tickAmount : 0,
        minorTickWidth: 0
    }
}

function getPaneObject (xPosition, yPosition) {
    return {
        center: [xPosition, yPosition],
        size: '50%',
        startAngle: 0,
        endAngle: 360,
        background: {
            backgroundColor: '#EEE',
            borderColor: null,
            innerRadius: '80%',
            outerRadius: '100%',
            shape: 'arc'
        }
    }
}

//--------------------------------------------------------------------------------------//
//                                       HELPER FUNCTIONS                               //
//--------------------------------------------------------------------------------------//


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

/**
 * 
 * @param {any} msg 
 * @returns 
 */
function timeSinceStart(msg) {
    if (!DEBUG) {
        return
    }
    let now = new Date().getTime();
    cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
    LAST_TIME = now;
}