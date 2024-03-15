/**
 * HIGHCHART
 * @customType cf.cplace.solution.safe.metricsDashboard
 * @layout cf.cplace.solution.safe.layout.flowEfficiency
 * @author Christopher Wölfle <christopher.woelfle@cplace.com>
 * @version 1.0
 * @description Displays a dummy flow efficiency chart
 */

const SEED = 1234;

function generateDummyData() {
    const efficiencies = [];
    // Generate numbers in 0.05 intervals from 0 to 1
    for (let i = 0; i <= 20; i++) {
        efficiencies.push(i * 0.05);
    }
    const data = efficiencies.map((e) => ({
        x: e*100,
        y: getRandomNumber(0, Math.round(20 * (e + 0.01))),
    }));

    return data;
}

function main() {
    const data = generateDummyData();
    return generateConfig(data);
}

function generateConfig(data) {
    return {
        chart: {
            type: "column",
        },
        title: {
            text: "Flow Efficiency",
        },
        xAxis: {
            title: {
                text: "Flow Efficiency",
            },
            labels: {format: "{value:.1f}%"}
        },
        yAxis: {
            title: {
                text: "Number of Capabilities",
            },
            
        },
        tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.y}</b><br/>capabilities with a flow efficiency of {point.x:.1f}%",
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.y}",
                },
            },
        },
        series: [{ name: "Flow Efficiency", data }],
    };
}

class PseudoRandomNumberGenerator {
    constructor(seed) {
        this.a = 1664525;
        this.c = 1013904223;
        this.m = Math.pow(2, 32);
        this.seed = seed;
    }

    random() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}

const prng = new PseudoRandomNumberGenerator(SEED);

function getRandomNumber(min, max) {
    // Calculate the range of the random number
    const range = max - min;

    // Generate a random number within the range
    const randomNumber = prng.random() * range + min;

    // Round the random number to the nearest integer
    const roundedNumber = Math.round(randomNumber);

    return roundedNumber;
}

// @ts-ignore
return main();