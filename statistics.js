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
