# DUBLIN_BIKES Project

## Environment Setup

Set the Flask environment variable according to your setup:

**For production:**

\```bash
export FLASK_ENVIRONMENT=Production
\```

**For debugging:**

\```bash
export FLASK_ENVIRONMENT=Debug
\```

To check the current Flask environment setting, run:

\```bash
echo $FLASK_ENVIRONMENT
\```

## Project Structure

Below is the structure of the project detailing the directories and files contained within:

\```
DUBLIN_BIKES/
├── data/
│   ├── availability_data/
│   ├── stations_data/
│   ├── weather_data/
│   ├── dailyWeather.py
│   └── hourlyWeather.py
├── models/
│   ├── ava_time/
│   │   ├── bikes/
│   │   │   └── KNearestNeighbors.pkl
│   │   └── bike_stands/
│   │       └── KNearestNeighbors.pkl
│   ├── ava_weather/
│   │   ├── ANN.keras
│   │   └── preprocessor.pkl
│   ├── dir/
│   │   └── trials...
│   ├── ava_time.py
│   ├── ava_daily.py
│   ├── ava_time.ipynb
│   ├── ava_daily_weather.ipynb
│   └── statistics.ipynb
├── website/
│   ├── static/
│   │   ├── css/
│   │   │   ├── home.css
│   │   │   ├── index.css
│   │   │   ├── planFuture.css
│   │   │   ├── side_info_bar.css
│   │   │   └── weather_stats.css
│   │   ├── img/
│   │   │   ├── icons/
│   │   │   │   └── images...
│   │   │   └── background_images/
│   │   │       └── images...
│   │   └── js/
│   │       ├── home.js
│   │       ├── dataFetcher.js
│   │       ├── dropdownNearest.js
│   │       ├── currentLocation.js
│   │       ├── nearestMarker.js
│   │       ├── predictionFromWeather.js
│   │       ├── predictionFromHour.js
│   │       ├── route.js
│   │       ├── searchBox.js
│   │       ├── statistics.js
│   │       └── weather.js
│   ├── templates/
│   │   ├── layouts/
│   │   │   └── base.html
│   │   ├── home.html
│   │   ├── weather.html
│   │   └── index.html
│   ├── __init__.py
│   ├── fetcher.py
│   ├── models.py
│   ├── routes.py
│   ├── predict_from_time.py
│   ├── predict_from_weather.py
│   ├── statistics.py
│   └── scrapper.py
├── .gitignore
├── .env
├── config.py
├── conda_packages.txt
├── environment.yml
├── requirements.txt
├── README.md
├── LICENSE
└── app.py
\```
