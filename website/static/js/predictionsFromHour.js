let myChart;

function getNearestInfo(nearest_station, markers){
    const stationName = document.querySelector(".station-name");
    stationName.textContent = nearest_station.markerDict.location_name;
    
    var dataToSend = {
        id : nearest_station.markerDict.id
    };

    const weather_stats = document.querySelector(".weather-ava");
    const init_station = encodeURIComponent(nearest_station.markerDict.id);
    weather_stats.href = `/weather_statistics?init_station=${init_station}`;  
    
    fetch('/hour_plot_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        show_hourly_graph(data.prediction)
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}

function show_hourly_graph(data) {
    const chartContainer = document.querySelector('.graph-hourly-container');
    const canvas = document.querySelector('.graph-hourly');

    const hours = Array.from(Array(24).keys()).map(x => x);
    const hourStrings = hours.map(hour => {
        let formattedHour = hour < 10 ? `0${hour}` : hour;
        const amPm = hour < 12 ? 'AM' : 'PM';
        if (formattedHour === 12) {
            formattedHour = 12;
        } else {
            formattedHour %= 12;
        }
        return `${formattedHour}:00 ${amPm}`;
    });

    const x_label = {
        short: hours,
        long: hourStrings
    }
    const bikesData = data.bikes;
    const standsData = data.stands;

    if (myChart) {
        myChart.destroy();
    }

 const ctx = canvas.getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_label.short.map((hour) => {
                return hour
            }),
            datasets: [{
                label: 'Bikes',
                data: bikesData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255)',
                borderWidth: 1
            }, {
                label: 'Stands',
                data: standsData,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Availability Forecast For Every Hour',
                        color: 'red',
                        font: {
                            size: 10
                        }
                    },
                    ticks: {
                        color: 'blue',
                        font: {
                            size: 6
                        }
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        color: 'blue',
                        font: {
                            size: 7
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    align: 'start',
                    labels: {
                        font: {
                            size: 10
                        },
                        color: "black"
                    }
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
                    callbacks: {
                        title: (ctx) => {
                            return x_label.long[ctx[0].dataIndex]
                        }
                    }
                }
            }
        }
    });


    const fullscreenButton = document.querySelector('.graph-hourly-button');
    fullscreenButton.addEventListener('click', () => {
        if (chartContainer.requestFullscreen) {
            chartContainer.requestFullscreen();
        } else if (chartContainer.webkitRequestFullscreen) {
            chartContainer.webkitRequestFullscreen();
        } else if (chartContainer.msRequestFullscreen) { 
            chartContainer.msRequestFullscreen();
        }
    });
}




export { getNearestInfo };
