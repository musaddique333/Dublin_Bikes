from .models import Station, Availability, HourlyWeather
from sqlalchemy.exc import SQLAlchemyError
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
            'lastUpdate': availability.time_stamp.strftime('%Y-%m-%d %H:%M:%S')
        } for availability in availability_data]

        return availability
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def fetch_availability_data_all():
    try:
        availability_data = db.session.query(
            Availability.id,
            Availability.bikes,
            Availability.bike_stands,
            Availability.time_stamp
        ).all()

        availability = [{
            'id': availability.id,
            'bikes': availability.bikes,
            'bike_stands': availability.bike_stands,
            'time_stamp': availability.time_stamp.strftime('%Y-%m-%d %H:%M:%S')
        } for availability in availability_data]

        return availability
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def fetch_weather_data_all():
    try:
        weather_data = db.session.query(
            HourlyWeather.time_stamp,
            HourlyWeather.temp_c,
            HourlyWeather.feelslike_c,
            HourlyWeather.wind_kph,
            HourlyWeather.humidity,
            HourlyWeather.precip_mm,
            HourlyWeather.gust_kph,
            HourlyWeather.wind_degree,
            HourlyWeather.pressure_mb,
            HourlyWeather.cloud,
            HourlyWeather.uv
            ).all()
        weather = [{
            'time_stamp': weather.time_stamp if isinstance(weather.time_stamp, str) else weather.time_stamp.strftime('%Y-%m-%d %H:%M:%S'),
            'temp_c': weather.temp_c,
            'feelslike_c': weather.feelslike_c,
            'wind_kph': weather.wind_kph,
            'humidity': weather.humidity,
            'precip_mm': weather.precip_mm,
            'gust_kph': weather.gust_kph,
            'wind_degree': weather.wind_degree,
            'pressure_mb': weather.pressure_mb,
            'cloud': weather.cloud,
            'uv': weather.uv
            } for weather in weather_data]

        return weather
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []