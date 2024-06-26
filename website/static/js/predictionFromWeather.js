const station_data = JSON.parse(document.getElementById("stationData").getAttribute("data-station"));
const station_name = document.querySelector("#station-name p");
const station_id = document.querySelector("#station-number p");
const dropdown_station_number = document.querySelector(".dropdown_station_number");
const dropdown_station_name = document.querySelector(".dropdown_station_name");
const daily_btn = document.getElementById('daily_submit_btn');
const hourly_btn = document.getElementById('hourly_submit_btn');
const only_pred_btn = document.getElementById('only_pred_submit_btn');
const op_container = document.querySelector(".header_op");
const bikes_op = document.querySelector(".bikes_op");
const stands_op = document.querySelector(".stands_op");
let drp_name = document.getElementById("station-name");
let drp_number = document.getElementById("station-number");
let markers = {};
let hourlyChart;
let dailyChart;

let titlesize = 30;
let tickssize = 12;
let labelsize = 20;
let borderwidthsize = 2;
let pointradiussize = 6;
let pointradiussizesmall = 6;
let scale_x = 1;
let scale_y = 0.3;

function updateVariables() {
  if (window.innerWidth <= 768) {
      titlesize = 12;
      tickssize = 6;
      labelsize = 8;
      borderwidthsize = 1;
      pointradiussize = 4;
      pointradiussizesmall = 3;
      scale_x = 0.5;
      scale_y = 0.15;
  } else {
      titlesize = 30;
      tickssize = 12;
      labelsize = 20;
      borderwidthsize = 2;
      pointradiussize = 8;
      pointradiussizesmall = 6;
      scale_x = 1;
      scale_y = 0.3;
  }
}

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
    updateVariables();
  window.addEventListener('resize', updateVariables);
  });
  station_id.textContent = `${init_station}`;
  station_name.textContent = `${markers[`station_${station_id.textContent}`]["location_name"]}`;

  drp_name.addEventListener("click", () => {
    dropdown_station_name.classList.toggle("active_name");
    const imageElement = document.querySelector(".name");
    if (imageElement.src.endsWith("/img/icons/up.png")) {
      imageElement.src = "../static/img/icons/down.png";
    } else {
      imageElement.src = "../static/img/icons/up.png";
    }
  });
  
  drp_number.addEventListener("click", () => {
    dropdown_station_number.classList.toggle("active_id");
    const imageElement = document.querySelector(".id");
    if (imageElement.src.endsWith("/img/icons/up.png")) {
      imageElement.src = "../static/img/icons/down.png";
    } else {
      imageElement.src = "../static/img/icons/up.png";
    }
  });
  set_dropdown(markers);

  document.querySelectorAll('.dropdown_station_number .option').forEach(element => {
    element.addEventListener('click', function () {
      station_id.textContent = `${this.textContent}`;
      station_name.textContent = `${markers[`station_${this.textContent}`]["location_name"]}`;
      get_data();
      daily_btn.click();
      hourly_btn.click();
      only_pred_btn.click();
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
          get_data();
          daily_btn.click();
          hourly_btn.click();
          only_pred_btn.click();
          drp_name.click();
        }
      });
    });
  });
});

function set_dropdown() {
  let first_drop = document.createElement('div');
  first_drop.setAttribute('class', 'first-option');
  first_drop.setAttribute('class', 'option');
  first_drop.innerHTML = 'select';
  // dropdown_station_name.appendChild(first_drop);
  // dropdown_station_number.appendChild(first_drop);
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
  document.getElementById('date_only').value = formatDate(today);

  daily_btn.addEventListener('click', () => {
    daily_plot_predictions();
  });
  daily_btn.click();

  hourly_btn.addEventListener('click', () => {
    hourly_plot_predictions();
  });
  hourly_btn.click();

  only_pred_btn.addEventListener('click', () => {
    hourly_plot_predictions(false);
  });
  only_pred_btn.click();
}

function daily_plot_predictions() {
  var dataToSend = {
    id: station_id.textContent,
    start: document.getElementById('from_date_search').value,
    end: document.getElementById('to_date_search').value,
  };

  if (checkEndDate()) {
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

  function checkEndDate() {

    var today = new Date();

    var endDate = new Date(document.getElementById("to_date_search").value);
    today.setDate(today.getDate() + 14);
    if (endDate > today) {
      endDate.setDate(endDate.getDate() + 14);
      document.getElementById("to_date_search").value = endDate.toISOString().split("T")[0];
      alert("End date can't exceed to 14 days from today's date");
      return false;
    }
    return true;
  }
}

function hourly_plot_predictions(plot = true) {
  var dataToSend = {
    id: station_id.textContent,
    date: plot ? document.getElementById('date_search').value : document.getElementById('date_only').value,
    start: plot ? document.getElementById('start_time_search').value : document.getElementById('time_only').value,
    end: plot ? document.getElementById('end_time_search').value : document.getElementById('time_only').value,
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
      if (plot) {
        show_hourly_graph(data.prediction);
      }
      else {
        op_container.innerHTML = `${markers[`station_${station_id.textContent}`]["location_name"]}`;
        bikes_op.innerHTML = `Predicted <img src="../static/img/icons/bike.svg" style="width:40px;"> Availability: <p style="color:red"><i class="fa-solid fa-${data.prediction.bikes.toString().padStart(2, '0').split('')[0]}"></i><i class="fa-solid fa-${data.prediction.bikes.toString().padStart(2, '0').split('')[1]}"></i></p>`;
        stands_op.innerHTML = `Predicted <img src="../static/img/icons/stand.svg" style="width:30px;"> Availability: <p style="color:blue"><i class="fa-solid fa-${data.prediction.stands.toString().padStart(2, '0').split('')[0]}"></i><i class="fa-solid fa-${data.prediction.stands.toString().padStart(2, '0').split('')[1]}"></i></p>`;
      }
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
        borderColor: '#7eb0d5',
        backgroundColor: '#7eb0d5cc',
        borderWidth: borderwidthsize,
        tension: 0.4,
        pointRadius: pointradiussize,
        pointBackgroundColor: '#7eb0d5cc',
        yAxisID: 'y',
      }, {
        label: 'Stands',
        data: standsData,
        borderColor: '#fd7f6f',
        backgroundColor: '#fd7f6fcc',
        borderWidth: borderwidthsize,
        tension: 0.4,
        pointRadius: pointradiussize,
        pointBackgroundColor: '#fd7f6fcc',
        yAxisID: 'y1',
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
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
            }
          },
          grid: {
            color: 'rgba(0, 0, 0)',
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Predictions',
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
            }
          },
          grid: {
            color: 'rgba(0, 0, 0)',
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
            text: 'Predictions',
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
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
              size: labelsize
            },
            color: "#4169e1",
          }
        },
        title: {
          display: true,
          text: `Hourly Forecast on ${date} From ${start} To ${end}`,
          font: {
            size: titlesize,
            weight: 'bold',
          },
          color: 'rgb(230, 74, 2)',
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
              return x_label.long[ctx[0].dataIndex];
            }
          }
        }
      },
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
        borderColor: '#7eb0d5',
        backgroundColor: '#7eb0d5cc',
        borderWidth: borderwidthsize,
        tension: 0.4,
        pointRadius: pointradiussize,
        pointBackgroundColor: '#7eb0d5cc',
        yAxisID: 'y',
      }, {
        label: 'Stands',
        data: standsData,
        borderColor: '#fd7f6f',
        backgroundColor: '#fd7f6fcc',
        borderWidth: borderwidthsize,
        tension: 0.4,
        pointRadius: pointradiussize,
        pointBackgroundColor: '#fd7f6fcc',
        yAxisID: 'y1',
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
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
            }
          },
          grid: {
            color: 'rgba(0, 0, 0)',
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Predictions',
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
            }
          },
          grid: {
            color: 'rgba(0, 0, 0)',
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
            text: 'Predictions',
            color: '#4169e1',
            font: {
              size: labelsize
            }
          },
          ticks: {
            color: 'rgba(0, 0, 0)',
            font: {
              size: tickssize
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
              size: labelsize
            },
            color: "#4169e1",
          }
        },
        title: {
          display: true,
          text: `Availability Forecast From ${start} To ${end}`,
          font: {
            size: titlesize,
            weight: 'bold',
          },
          color: 'rgb(230, 74, 2)',
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
              return x_label.long[ctx[0].dataIndex];
            }
          }
        }
      },
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

  while (currentDatetime < end) {
    datetimeList.push(currentDatetime.getHours());
    currentDatetime.setHours(currentDatetime.getHours() + 1);
  }

  return datetimeList;
}
