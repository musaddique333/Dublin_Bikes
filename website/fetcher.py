from .models import Station, Availability
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
        print(len(availability_data))
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
    