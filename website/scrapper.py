from apscheduler.schedulers.background import BackgroundScheduler
from .models import Station, Availability, Weather
from config import JCDecaux_dict, WeatherAPI_dict
from datetime import datetime
from . import db
import pandas as pd
import requests
import logging
import json
import os

def fetch_station(app):
    try:
        now = datetime.now()
        response = requests.get(JCDecaux_dict['STATIONS'], 
                                params={"apiKey": JCDecaux_dict['API_KEY'], 
                                        "contract": JCDecaux_dict['NAME']})
        response.raise_for_status()

        data = response.text
        data = json.loads(data)
        data = pd.json_normalize(data)
        data['banking'] = data['banking'].astype(int)
        data['bonus'] = data['bonus'].astype(int)

        filename = f"data/stations_data/station.csv"
        if os.path.exists(filename):
            data.to_csv(filename, mode='a', index=False, header=False)
        else:
            data.to_csv(filename, index=False)
        
        with app.app_context():
            for index, row in data.iterrows():
                existing_station = Station.query.get(row['number'])
                if existing_station:
                    logging.info(f"Station with id {row['number']} already exists. Skipping or updating...")
                    continue
                else:
                    station = Station(
                        id=row['number'],
                        contract=row['contract_name'],
                        name=row['name'],
                        address=row['address'],
                        banking=row['banking'],
                        bonus=row['bonus'],
                        stands=row['bike_stands'],
                        position_lat=row['position.lat'],
                        position_lng=row['position.lng'],
                        status=row['status']
                    )
                    db.session.add(station)
            db.session.commit()


        logging.info(f"Static data fetched and written to DB successfully. at {now}")
    
    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
    except requests.exceptions.ConnectionError:
        logging.error("Connection error occurred")
    except requests.exceptions.Timeout:
        logging.error("The request timed out")
    except requests.exceptions.RequestException as e:
        logging.error(f"An error occurred while fetching data: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
    

def fetch_availability(app):
    try:
        response = requests.get(JCDecaux_dict['STATIONS'], 
                                params={"apiKey": JCDecaux_dict['API_KEY'], 
                                        "contract": JCDecaux_dict['NAME']})
        response.raise_for_status()
        now = datetime.now()
        data = response.text
        data = json.loads(data)
        data = pd.json_normalize(data)

        now_ = now.strftime('%d-%m-%Y_and_%H:%M')
        filename = f"data/availability_data/{now_}-availability.csv"
        data.to_csv(filename, index=True)


        with app.app_context():
            for index, row in data.iterrows():
                availability = Availability(
                    id=row['number'],
                    bikes=row['available_bikes'],
                    bike_stands=row['available_bike_stands'],
                    time_stamp=now.timestamp()
                )
                db.session.add(availability)
            db.session.commit()

        logging.info(f"Dynamic data fetched and written to DB successfully. at {now}")
    
    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
    except requests.exceptions.ConnectionError:
        logging.error("Connection error occurred")
    except requests.exceptions.Timeout:
        logging.error("The request timed out")
    except requests.exceptions.RequestException as e:
        logging.error(f"An error occurred while fetching data: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

def fetch_weather_data(app):
    try:
        now = datetime.now()
        response = requests.get(WeatherAPI_dict['WeatherAPI'], 
                                params={"key": WeatherAPI_dict['API_KEY'], 
                                        "q": WeatherAPI_dict['q']})
        response.raise_for_status()
        now = datetime.now()
        data = response.text
        data = json.loads(data)
        data = pd.json_normalize(data)

        filename = "data/weather_data/weather.csv"

        if os.path.exists(filename):
            data.to_csv(filename, mode='a', index=False, header=False)
        else:
            data.to_csv(filename, index=False)

        weather_data = {
            'time_stamp': now.timestamp(),
            'temp_c': data['current.temp_c'].iloc[0],
            'feelslike_c': data['current.feelslike_c'].iloc[0],
            'condition_text': data['current.condition.text'].iloc[0],
            'condition_icon': data['current.condition.icon'].iloc[0],
            'condition_code': data['current.condition.code'].iloc[0],
            'wind_kph': data['current.wind_kph'].iloc[0],
            'wind_degree': data['current.wind_degree'].iloc[0],
            'wind_dir': data['current.wind_dir'].iloc[0],
            'pressure_mb': data['current.pressure_mb'].iloc[0],
            'precip_mm': data['current.precip_mm'].iloc[0],
            'humidity': data['current.humidity'].iloc[0],
            'cloud': data['current.cloud'].iloc[0],
            'is_day': data['current.is_day'].iloc[0],
            'uv': data['current.uv'].iloc[0],
            'gust_kph': data['current.gust_kph'].iloc[0],
        }

        with app.app_context():
            weather_entry = Weather(**weather_data)
            db.session.add(weather_entry)
            db.session.commit()

        logging.info(f"Weather data fetched and written to DB successfully at {now}.")

    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
    except requests.exceptions.ConnectionError:
        logging.error("Connection error occurred")
    except requests.exceptions.Timeout:
        logging.error("The request timed out")
    except requests.exceptions.RequestException as e:
        logging.error(f"An error occurred while fetching weather data: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

def init_scheduler(app):
    scheduler = BackgroundScheduler()

    # , next_run_time=datetime.now()
    scheduler.add_job(func=lambda: fetch_station(app), trigger="interval", hours=24)
    scheduler.add_job(func=lambda: fetch_availability(app), trigger="interval", minutes=10)
    scheduler.add_job(func=lambda: fetch_weather_data(app), trigger="interval", minutes=10)

    scheduler.start()
    app.scheduler = scheduler
    
def shutdown_scheduler(app):
    if hasattr(app, 'scheduler'):
        app.scheduler.shutdown()
