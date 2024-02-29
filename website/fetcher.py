from .models import Station, Availability, Weather
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from .import db


def fetch_station_data():
    try:
        station_data = db.session.query(
            Station.id,
            Station.name,
            Station.address,
            Station.banking,
            Station.bonus,
            Station.stands,
            Station.position_lat.label('lat'),
            Station.position_lng.label('lng'),
            Station.status
        ).all()
        stations = [{
            'id': station.id, 
            'locationName': station.name.replace('\'', ''),
            'lat': station.lat,
            'lng': station.lng,
            'address': station.address.replace('\'', ''),
            'banking': station.banking,
            'bonus': station.bonus,
            'total': station.stands,
            'status': station.status
        } for station in station_data]

        return stations
    
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def fetch_availability_data():
    try:
        availability_data = db.session.query(
            Availability.id,
            Availability.bikes,
            Availability.bike_stands,
            db.func.max(Availability.time_stamp).label('time_stamp')
        ).group_by(Availability.id).all()
        availability = [{
            'id': availability.id,
            'bikes': availability.bikes,
            'stands': availability.bike_stands,
            'lastUpdate': datetime.utcfromtimestamp(availability.time_stamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
        } for availability in availability_data]

        return availability
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []
    
def fetch_weather_data():
    try:
        latest_weather_timestamp = db.session.query(db.func.max(Weather.time_stamp)).scalar()
        weather_data = db.session.query(Weather).filter(Weather.time_stamp == latest_weather_timestamp).first()
        weather = {
            'lastUpdate': datetime.utcfromtimestamp(weather_data.time_stamp / 1000).strftime('%Y-%m-%d %H:%M:%S'),
            'temp_c': float(weather_data.temp_c),
            'feelslike_c': float(weather_data.feelslike_c),
            'condition_text': weather_data.condition_text,
            'condition_icon': weather_data.condition_icon,
            'condition_code': weather_data.condition_code,
            'wind_kph': float(weather_data.wind_kph),
            'wind_degree': weather_data.wind_degree,
            'wind_dir': weather_data.wind_dir,
            'pressure_mb': float(weather_data.pressure_mb),
            'precip_mm': float(weather_data.precip_mm),
            'humidity': weather_data.humidity,
            'cloud': weather_data.cloud,
            'is_day': weather_data.is_day,
            'uv': float(weather_data.uv),
            'gust_kph': float(weather_data.gust_kph)
        }

        return weather
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return {}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {}