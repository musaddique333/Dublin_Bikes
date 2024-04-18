let windBikesChart;
let windStandsChart;

let gustBikesChart;
let gustStandsChart;

let temperatureChart;
let feelslikeChart;

let precipBikesChart;

let pressureChart;

async function get_data() {
    let dataToSend = {
        id: station_id.textContent,
    };
    fetch('/show_weather_stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.prediction.temp);
            plot_wind(data.prediction.wind.bikes, data.prediction.wind.bike_stands, data.prediction.wind.wind);
            plot_gust(data.prediction.gust.bikes, data.prediction.gust.bike_stands, data.prediction.gust.gust);
            plot_temprature(data.prediction.temp.bikes, data.prediction.temp.bike_stands, data.prediction.temp.temp, data.prediction.feelslike.bikes, data.prediction.feelslike.bike_stands, data.prediction.feelslike.feelslike);
            plot_precipitation(data.prediction.precipitation.bikes, data.prediction.precipitation.bike_stands, data.prediction.precipitation.precipitation);
            plot_pressure(data.prediction.pressure.bikes, data.prediction.pressure.bike_stands, data.prediction.pressure.pressure);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    get_data();
});
function plot_wind(bikes, bike_stands, X) {
    const wind_bikes = document.querySelector(".wind-bikes").getContext('2d');
    const wind_stands = document.querySelector(".wind-stands").getContext('2d');

    const labels = X;

    const data = (plot, plotData) => ({
        labels: labels,
        datasets: [{
            label: plot,
            data: plotData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)'
            ],
            borderWidth: 1
        }]
    });

    var bikesData = data('bikes', bikes);
    var bikesConfig = {
        type: 'bar',
        data: bikesData,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Wind Speeds`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Of Bikes Based On Wind Speeds`,
                    font: {
                        size: 30,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
        }
    };

    if (windBikesChart) windBikesChart.destroy();
    windBikesChart = new Chart(wind_bikes, bikesConfig);

    var standsData = data('Stands', bike_stands);
    var standsConfig = {
        type: 'bar',
        data: standsData,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Wind Speeds`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Of Stands Based On Wind Speeds`,
                    font: {
                        size: 30,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
        },
    };

    if (windStandsChart) windStandsChart.destroy();
    windStandsChart = new Chart(wind_stands, standsConfig);
}
function plot_gust(bikes, bike_stands, X) {
    const gust_bikes = document.querySelector(".gust-bikes").getContext('2d');
    const gust_stands = document.querySelector(".gust-stands").getContext('2d');

    const labels = X;

    const data = (plot, plotData) => ({
        labels: labels,
        datasets: [{
            label: plot,
            data: plotData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 205, 86, 0.5)',
                'rgba(201, 203, 207, 0.5)',
                'rgba(54, 162, 235, 0.5)'
            ]
        }]
    });

    var bikesData = data('Bikes', bikes);
    var bikesConfig = {
        type: 'polarArea',
        data: bikesData,
        options: {
            responsive: true,
            scales: {
                r: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        font: {
                            size: 18
                        }
                    }
                },
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Gust Speeds`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Of Bikes Based On Gust Speeds`,
                    font: {
                        size: 25,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
        }
    };

    if (gustBikesChart) gustBikesChart.destroy();
    gustBikesChart = new Chart(gust_bikes, bikesConfig);

    var standsData = data('Stands', bike_stands);
    var standsConfig = {
        type: 'polarArea',
        data: standsData,
        options: {
            responsive: true,
            scales: {
                r: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        font: {
                            size: 18
                        }
                    }
                },
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Gust Speeds`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Of Stands Based On Gust Speeds`,
                    font: {
                        size: 25,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
        },
    };

    if (gustStandsChart) gustStandsChart.destroy();
    gustStandsChart = new Chart(gust_stands, standsConfig);
}
function plot_temprature(temp_b, temp_s, Xt, feel_b, feel_s, Xf) {
    let bikesData = temp_b;
    let standsData = temp_s;

    let x_axis = Xt
    let XtWithCelsius = Xt.map(element => `${element}°C`);
    const canvas = document.querySelector('.temp');
    let x_label = {
        short: x_axis,
        long: XtWithCelsius,
    }

    if (temperatureChart) {
        temperatureChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_label.short,
            datasets: [{
                label: 'Bikes',
                data: bikesData,
                borderColor: '#7eb0d5',
                backgroundColor: '#7eb0d5cc',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 10,
                pointBackgroundColor: '#7eb0d5cc',
                yAxisID: 'y',
            }, {
                label: 'Stands',
                data: standsData,
                borderColor: '#fd7f6f',
                backgroundColor: '#fd7f6fcc',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 10,
                pointBackgroundColor: '#fd7f6fcc',
                yAxisID: 'y1',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Temperatures in (°C)`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Based on Temperature`,
                    font: {
                        size: 30,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: (ctx) => {
                            return x_label.long[ctx[0].dataIndex];
                        }
                    }
                }
            },
        }
    });

    bikesData = feel_b;
    standsData = feel_s;

    x_axis = Xf
    let XfWithCelsius = Xf.map(element => `${element}°C`);

    const canvas2 = document.querySelector('.feelslike');
    x_label = {
        short: x_axis,
        long: XfWithCelsius,
    }

    if (feelslikeChart) {
        feelslikeChart.destroy();
    }

    const ctx2 = canvas2.getContext('2d');
    feelslikeChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: x_label.short,
            datasets: [{
                label: 'Bikes',
                data: bikesData,
                borderColor: '#7eb0d5',
                backgroundColor: '#7eb0d5cc',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 10,
                pointBackgroundColor: '#7eb0d5cc',
                yAxisID: 'y',
            }, {
                label: 'Stands',
                data: standsData,
                borderColor: '#fd7f6f',
                backgroundColor: '#fd7f6fcc',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 10,
                pointBackgroundColor: '#fd7f6fcc',
                yAxisID: 'y1',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Temperatures in (°C)`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        },
                        color: "#bd7ebe",
                    }
                },
                title: {
                    display: true,
                    text: `Availability Based on Feels-Like Temperature`,
                    font: {
                        size: 30,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                    position: 'top',
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: (ctx) => {
                            return x_label.long[ctx[0].dataIndex];
                        }
                    }
                }
            },
        }
    });
}
function plot_pressure(bikes, bike_stands, X) {

    const pressure = document.querySelector(".pressure").getContext('2d');
    const bikesData = bikes.map((y, index) => ({ x: X[index], y }));
    const bikeStandsData = bike_stands.map((y, index) => ({ x: X[index], y }));
    function transparentize(color, opacity) {
        const alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    }
    const data = {
        datasets: [
            {
                label: 'Bikes',
                data: bikesData,
                pointRadius: 6,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: transparentize('rgb(255, 99, 132)', 0.5),
                borderWidth: 2,
                yAxisID: 'y',
            },
            {
                label: 'Stands',
                data: bikeStandsData,
                pointRadius: 6,
                borderWidth: 2,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: transparentize('rgb(255, 159, 64)', 0.5),
                yAxisID: 'y2',
            }
        ]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Availability Based on Pressure',
                    font: {
                        size: 25,
                        weight: 'bold',
                    },
                    color: 'rgba(255, 255, 255, 1)',
                }
            },
            scales: {
                x: {
                    position: 'bottom',
                    title: {
                        display: true,
                        text: `Precipitation (mm)`,
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Bikes Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgb(255, 99, 132)',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.6)',
                    },
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Stands Availability',
                        color: '#bd7ebe',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        color: 'rgb(255, 159, 64)',
                        font: {
                            size: 12
                        }
                    },
                },
            },
            tooltip: {
                mode: 'point',
                intersect: true,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `${context.parsed.y}`;
                        }
                        if (context.parsed.x !== null) {
                            label += ` at ${context.parsed.x} mb`;
                        }
                        return label;
                    }
                }
            }
        },
    };

    if (pressureChart) pressureChart.destroy();
    pressureChart = new Chart(pressure, config);
}