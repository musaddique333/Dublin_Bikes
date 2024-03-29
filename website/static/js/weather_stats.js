const station_data = JSON.parse(document.getElementById("stationData").getAttribute("data-station"));
const station_name = document.querySelector("#station-name p");
const station_id = document.querySelector("#station-number p");
const dropdown_station_number = document.querySelector(".dropdown_station_number");
const dropdown_station_name = document.querySelector(".dropdown_station_name");
const daily_btn = document.getElementById('daily_submit_btn');
const hourly_btn = document.getElementById('hourly_submit_btn');
let drp_name = document.querySelector(".name");
let drp_number = document.querySelector(".id");
let markers = {};
let hourlyChart;
let dailyChart;

document.addEventListener("DOMContentLoaded", () => {
  station_data.forEach((markerData, index) => {
    const markerDict = {
      id: markerData.id,
      location_name: markerData.locationName,
      lat: markerData.lat,
      lng: markerData.lng,
      address: markerData.address,
      banking: markerData.banking,
      bonus: markerData.bonus,
      total_stands: markerData.total,
      status: markerData.status,
    };
    markers[`station_${markerData.id}`] = markerDict;
  });
  station_id.textContent = `${init_station}`;
  station_name.textContent = `${markers[`station_${station_id.textContent}`]["location_name"]}`;

  drp_name.addEventListener("click", () => {
    dropdown_station_name.classList.toggle("active_name");
  });
  drp_number.addEventListener("click", () => {
    dropdown_station_number.classList.toggle("active_id");
  });
  set_dropdown(markers);

  document.querySelectorAll('.dropdown_station_number .option').forEach(element => {
    element.addEventListener('click', function () {
      station_id.textContent = `${this.textContent}`;
      station_name.textContent = `${markers[`station_${this.textContent}`]["location_name"]}`;
      drp_number.click();
    });
  });

  document.querySelectorAll('.dropdown_station_name .option').forEach(element => {
    element.addEventListener('click', function () {
      Object.keys(markers).forEach(key => {
        const marker = markers[key];;
        if (marker.location_name === this.textContent) {
          station_id.textContent = marker.id;
          station_name.textContent = marker.location_name;
          drp_name.click();
        }
      });    
    });
  });
});

function set_dropdown() {
  Object.keys(markers).forEach(key => {
    const marker = markers[key];
    const name = document.createElement("div");
    name.classList.add("option");
    name.innerHTML = marker.location_name;
    dropdown_station_name.appendChild(name);

    const number = document.createElement("div");
    number.classList.add("option");
    number.innerHTML = marker.id;
    dropdown_station_number.appendChild(number);
  });

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  document.getElementById('from_date_search').value = formatDate(today);
  document.getElementById('to_date_search').value = formatDate(nextWeek);
  document.getElementById('date_search').value = formatDate(today);

  daily_btn.addEventListener('click', () => {
    daily_plot_predictions();
  });
  daily_btn.click();

  hourly_btn.addEventListener('click', () => {
    hourly_plot_predictions();
  });
  hourly_btn.click();
}

function daily_plot_predictions() {
  var dataToSend = {
    id: station_id.textContent,
    start: document.getElementById('from_date_search').value,
    end: document.getElementById('to_date_search').value,
  };
  fetch('/one_week_forecast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
    .then(response => response.json())
    .then(data => {
      show_daily_graph(data.prediction);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function hourly_plot_predictions() {
  var dataToSend = {
    id: station_id.textContent,
    date: document.getElementById('date_search').value,
    start: document.getElementById('start_time_search').value,
    end: document.getElementById('end_time_search').value,
  };
  fetch('/one_day_forecast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
    .then(response => response.json())
    .then(data => {
      show_hourly_graph(data.prediction);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function show_hourly_graph(data) {
  const bikesData = data.bikes;
  const standsData = data.stands;

  let date = document.getElementById('date_search').value;
  let start = document.getElementById('start_time_search').value;
  let end = document.getElementById('end_time_search').value;
  const x_axis = generateHourlyArray(start, end, date);
  const hourStrings = x_axis.map(hour => {
    let formattedHour = hour < 10 ? `0${hour}` : hour;
    const amPm = hour < 12 ? 'AM' : 'PM';
    if (formattedHour === 12) {
      formattedHour = 12;
    } else {
      formattedHour %= 12;
    }
    return `${formattedHour}:00 ${amPm}`;
  });
  const canvas = document.querySelector('.plot_hourly');
  const x_label = {
    short: x_axis,
    long: hourStrings,
  }

  if (hourlyChart) {
    hourlyChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x_label.short,
      datasets: [{
        label: 'Bikes',
        data: bikesData,
        borderColor: 'red',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 8,
        pointBackgroundColor: 'green'
      }, {
        label: 'Stands',
        data: standsData,
        borderColor: 'blue',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 8,
        pointBackgroundColor: 'green'
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
            text: `Hours From ${start} To ${end}`,
            color: 'red',
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'blue',
            font: {
              size: 10
            }
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Predictions',
            color: 'red',
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'blue',
            font: {
              size: 10
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
              size: 20
            },
            color: "black"
          }
        },
        title: {
          display: true,
          text: `Hourly Forecast on ${date} From ${start} To ${end}`,
          font: {
            size: 30
          },
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
          callbacks: {
            title: (ctx) => {
              return x_label.long[ctx[0].dataIndex]
            }
          }
        }
      }
    }
  });
}

function show_daily_graph(data) {
  const bikesData = data.bikes;
  const standsData = data.stands;

  let start = document.getElementById('from_date_search').value;
  let end = document.getElementById('to_date_search').value;
  const x_axis = generateDateArray(start, end);
  const canvas = document.querySelector('.plot_daily');

  const x_label = {
    short: x_axis,
    long: x_axis,
  }

  if (dailyChart) {
    dailyChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x_label.short,
      datasets: [{
        label: 'Bikes',
        data: bikesData,
        borderColor: 'red',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 8,
        pointBackgroundColor: 'green'
      }, {
        label: 'Stands',
        data: standsData,
        borderColor: 'blue',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 8,
        pointBackgroundColor: 'green'
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
            text: `Dates From ${start} To ${end}`,
            color: 'red',
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'blue',
            font: {
              size: 10
            }
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Predictions',
            color: 'red',
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'blue',
            font: {
              size: 10
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
              size: 20
            },
            color: "black"
          }
        },
        title: {
          display: true,
          text: `Availability Forecast From ${start} To ${end}`,
          font: {
            size: 30
          },
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
          callbacks: {
            title: (ctx) => {
              return x_label.long[ctx[0].dataIndex]
            }
          }
        }
      }
    }
  });
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function generateDateArray(startDateStr, endDateStr) {
  const dateArray = [];
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate = addDays(currentDate, 1);
  }

  return dateArray;
}

function generateHourlyArray(startHour, endHour, dateString) {
  let start = new Date(`${dateString}T${startHour}`);
  let end = new Date(`${dateString}T${endHour}`);
  let datetimeList = [];
  let currentDatetime = new Date(start.getTime());

  while (currentDatetime <= end) {
    datetimeList.push(currentDatetime.getHours());
    currentDatetime.setHours(currentDatetime.getHours() + 1);
  }

  return datetimeList;
}
