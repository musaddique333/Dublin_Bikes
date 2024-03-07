from .models import Station, Availability
from sqlalchemy.exc import SQLAlchemyError
from .import db


def fetch_station_data():
    try:
        # station_data = pd.read_csv('data/stations_data/station.csv')
        # stations = [{
        #     'id': station_data['number'][i], 
        #     'locationName': station_data['name'][i].replace('\'', ''),
        #     'lat': station_data['position.lat'][i],
        #     'lng': station_data['position.lng'][i],
        #     'address': station_data['address'][i].replace('\'', ''),
        #     'banking': station_data['banking'][i],
        #     'bonus': station_data['bonus'][i],
        #     'total': station_data['bike_stands'][i],
        #     'status': station_data['status'][i]
        # } for i in range(114)]
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
        # station_data = pd.read_csv('data/stations_data/station.csv')
        # stations = [{
        #     'id': station_data['number'][i], 
        #     'bikes': station_data['available_bikes'][i],
        #     'stands': station_data['available_bike_stands'][i],
        #     'lastUpdate': station_data['last_update'][i]
        # } for i in range(len(station_data))]
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
        return stations
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []