/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.currentPiDashboard
 * @layout default layout
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays the confidence vote of a single PI which is passed in via search results as as bar chart
 */

const CONFIDENCE_VOTE = /** @type {const} */ ({
    TYPE: "cf.cplace.solution.safe.confidenceVote",
    ATTR: {
        PROGRAMM_INCREMENT: "cf.cplace.solution.safe.confidenceVote.PI",
        RESULT: "cf.cplace.solution.safe.confidenceVote.result",
        ONE_FINGER: "cf.cplace.solution.safe.confidenceVote.oneFinger",
        TWO_FINGERS: "cf.cplace.solution.safe.confidenceVote.twoFingers",
        THREE_FINGERS: "cf.cplace.solution.safe.confidenceVote.threeFingers",
        FOUR_FINGERS: "cf.cplace.solution.safe.confidenceVote.fourFingers",
        FIVE_FINGERS: "cf.cplace.solution.safe.confidenceVote.fiveFingers",
    },
});

const red = "#FF0000";
const orange = "#FFA500";
const yellow = "#FFFF00";
const lightgreen = "#9ACD32";
const green = "#008000";

function main() {
    // @ts-ignore
    const confidenceVote = Iterables.getFirst(pages, null);

    if (!confidenceVote) {
        return;
    }

    const oneFinger = confidenceVote.get(CONFIDENCE_VOTE.ATTR.ONE_FINGER);
    const twoFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.TWO_FINGERS);
    const threeFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.THREE_FINGERS);
    const fourFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FOUR_FINGERS);
    const fiveFingers = confidenceVote.get(CONFIDENCE_VOTE.ATTR.FIVE_FINGERS);
    const totalFingers = oneFinger + 2 * twoFingers + 3 * threeFingers + 4 * fourFingers + 5 * fiveFingers;
    const numberOfConvidenceVotes = oneFinger + twoFingers + threeFingers + fourFingers + fiveFingers;

    const averageConfidenceVote = totalFingers / numberOfConvidenceVotes;

    // Create the chart
    const config = {
        chart: {
            type: "pie",
        },
        title: {
            text: averageConfidenceVote.toFixed(1),
            align: "center",
            verticalAlign: "middle",
            margin: 0,
            useHtml: true,
            style: {
                fontSize: "3vw",
                margin: 0,
                padding: 0,
                fontWeight: "bold",
                lineHeight: 1,
            },
        },
        subtitle: {
            text: "Average",
            align: "center",
            verticalAlign: "middle",
            y: -30,
            style: {
                fontWeight: "normal",
                fontSize: "1vw",
            },
        },
        legend: {
            enabled: false,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontWeight: "normal",
            },
        },
        plotOptions: {
            pie: {
                borderWidth: 10,
                cursor: "pointer",
                dataLabels: {
                    enabled: false,
                },
                colors: [red, orange, yellow, lightgreen, green],
            },
        },
        series: [
            {
                name: "Count",
                cursor: "pointer",
                innerSize: "70%",
                data: [
                    { name: "One Finger", y: oneFinger },
                    { name: "Two Fingers", y: twoFingers },
                    { name: "Three Fingers", y: threeFingers },
                    { name: "Four Fingers", y: fourFingers },
                    { name: "Five Fingers", y: fiveFingers },
                ],
            },
        ],
    };
    return config;
}

// @ts-ignore
return main();