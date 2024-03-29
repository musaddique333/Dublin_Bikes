let bike_stands = [];
let bikes = [];
let cloud = [];
let feelslike_c = [];
let gust_kph = [];
let humidity = [];
let id = [];
let precip_mm = [];
let pressure_mb = [];
let temp_c = [];
let uv = [];
let wind_degree = [];
let wind_kph = [];


    async function get_data() {
        var dataToSend = {
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
                bike_stands = [], bikes = [], cloud = [], feelslike_c = [], gust_kph = [], humidity = [], id = [], precip_mm = [], pressure_mb = [], temp_c = [], uv = [], wind_degree = [], wind_kph = [];
                data['prediction'].forEach(element => {
                    bike_stands.push(parseInt(element.bike_stands));
                    bikes.push(parseInt(element.bikes));
                    cloud.push(parseFloat(element.cloud));
                    feelslike_c.push(parseFloat(element.feelslike_c));
                    gust_kph.push(parseFloat(element.gust_kph));
                    humidity.push(parseFloat(element.humidity));
                    id.push(parseInt(element.id));
                    precip_mm.push(parseFloat(element.precip_mm));
                    pressure_mb.push(parseFloat(element.pressure_mb));
                    temp_c.push(parseFloat(element.temp_c));
                    uv.push(parseInt(element.uv));
                    wind_degree.push(parseInt(element.wind_degree));
                    wind_kph.push(parseFloat(element.wind_kph));
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

document.addEventListener("DOMContentLoaded", () => {
    get_data();
});

function 