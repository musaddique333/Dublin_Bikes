async function fetchWeatherForDublin() {
    const apiKey = weather_api;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=dublin`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        insertWeatherData(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchForecastForDublin() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const apiKey = weather_api;
    const forecast_url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=dublin&dt${formattedDate}`;
    const sunrise = document.querySelector(".sunrise");
    const sunset = document.querySelector(".sunset")

    try {
        const response = await fetch(forecast_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        sunrise.innerHTML = `<img src="../static/img/icons/sunrise.png" alt="sunrise">&nbsp${data.forecast.forecastday[0].astro.sunrise}`;
        sunset.innerHTML = `<img src="../static/img/icons/sunset.png" alt="sunset">&nbsp${data.forecast.forecastday[0].astro.sunset}`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function insertWeatherData(data) {
    const weather_text = document.querySelector('.weather-text');
    const wind_speed = document.querySelector('.wind-speed');
    const weather_ico = document.querySelector('.weather-ico');
    const act_temp = document.querySelector('.temp .temp-value');
    const feel_temp = document.querySelector('.feel-temp .temp-value');
    const humidity = document.querySelector(".humidity");
    const pressure = document.querySelector(".pressure");
    const uv_index = document.querySelector(".uv");

    pressure.innerHTML = `<i class="fa-solid fa-arrow-down-short-wide"></i>&nbsp${data.current.pressure_mb}mb`;
    humidity.innerHTML = `<i class="fa-solid fa-droplet-slash"></i>&nbsp${data.current.humidity}%`;

    weather_text.textContent = data.current.condition.text;

    wind_speed.innerHTML = `<i class="fa-solid fa-wind"></i>&nbsp${parseFloat(data.current.wind_kph).toFixed(2)} km/h`;

    let locationIcon = String(data.current.condition.icon).replace('64x64', '128x128');
    weather_ico.innerHTML = `<img src="${locationIcon}" alt="weather-icon">`;

    act_temp.innerHTML = `${parseFloat(data.current.temp_c).toFixed(0)}&deg;C`;
    feel_temp.innerHTML = `${parseFloat(data.current.feelslike_c).toFixed(0)}&deg;C`;
}

function updateDateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    var dateString = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    var dayString = now.toLocaleDateString(undefined, { weekday: 'long' });

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var timeString = `<span class="hours">${hours}</span>:<span class="minutes">${minutes}</span>:<span class="seconds">${seconds}</span>`;
    document.querySelector('.time').innerHTML = timeString;
    document.querySelector('.date').innerHTML = `${dateString}&nbsp&nbsp&nbsp`;
    document.querySelector('.day-name').textContent = dayString;
}

updateDateTime();

setInterval(updateDateTime, 1000);
setInterval(fetchWeatherForDublin, 1000)

fetchWeatherForDublin();
fetchForecastForDublin();
