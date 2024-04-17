# DUBLIN_BIKES Project Setup Guide

## Overview
This guide provides detailed instructions for setting up the environment and deploying the DUBLIN_BIKES application on Windows, macOS, and Linux operating systems.

## Prerequisites
- Anaconda or Miniconda installed on your system. You can download it from [Anaconda's website](https://www.anaconda.com/products/distribution).

## Environment Setup
First, navigate to your project directory where the `environment.yml` file is located.

### Windows
Open Anaconda Prompt and run:
```bash
conda env create -f environment.yml
conda activate comp30830
```

### macOS and Linux
Open Terminal and run:
```bash
conda env create -f environment.yml
conda activate comp30830
```

## Configuration File Setup
Create a `.env` file in your project directory to store sensitive keys and configurations. Use your preferred text editor, for example:

### Windows
```bash
notepad .env
```

### macOS and Linux
```bash
nano .env
```

### Add the following to your `.env` file:
```plaintext
RDS_KEY=YOUR_AWS_RDS_KEY
DB_API=YOUR_JCDCUAX_API_KEY
WEATHER_API=YOUR_WEATHER_API_KEY_FROM http://weather.api.com
MAPS_API=YOUR_GOOGLE_MAPS_API
URL=YOUR_AWS_RDS_URL
PORT=3306 or YOUR_PREFERRED_PORT
DB=YOUR_AWS_RDS_DATABASE_NAME
USER=YOUR_AWS_RDS_USER_NAME
FLASK_ENVIRONMENT=Production
```

## Set Flask Environment
Configure the Flask environment variable according to your setup requirements.

### For production:
```bash
export FLASK_ENVIRONMENT=production
```

### For debugging:
```bash
export FLASK_ENVIRONMENT=development
```

### To verify the current Flask environment setting, run:
```bash
echo $FLASK_ENVIRONMENT
```

## Running the Application
Now that your environment and configuration files are set up, you can run the application.

```bash
python app.py
```

## Conclusion
After following these steps, your DUBLIN_BIKES application should be up and running. For further configurations and troubleshooting, consult the official Flask and Anaconda documentation.

## Project Structure

Below is the structure of the project detailing the directories and files contained within:

```
DUBLIN_BIKES/
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
├── environment.yml
├── README.md
├── LICENSE
└── app.py
```
