from .import db

class Station(db.Model):
    __tablename__ = 'station'

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    contract = db.Column(db.String(256))
    name = db.Column(db.String(256))
    address = db.Column(db.String(256))
    banking = db.Column(db.Integer)
    bonus = db.Column(db.Integer)
    stands = db.Column(db.Integer)
    position_lat = db.Column(db.Float)
    position_lng = db.Column(db.Float)
    status = db.Column(db.String(256))

class Availability(db.Model):
    __tablename__ = 'availability'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    time_stamp = db.Column(db.DateTime, primary_key=True)
    bikes = db.Column(db.Integer)
    bike_stands = db.Column(db.Integer)

class HourlyWeather(db.Model): #realtime
    __tablename__ = 'hourlyWeather'

    time_stamp = db.Column(db.DateTime, primary_key=True)
    temp_c = db.Column(db.Float)
    feelslike_c = db.Column(db.Float)
    wind_kph = db.Column(db.Float)
    humidity = db.Column(db.Float)
    precip_mm = db.Column(db.Float)
    gust_kph = db.Column(db.Float)
    wind_degree = db.Column(db.Integer)
    pressure_mb = db.Column(db.Float)
    cloud = db.Column(db.Float)
    uv = db.Column(db.Integer)

class DailyWeather(db.Model): #history
    __tablename__ = 'dailyWeather'

    time_stamp = db.Column(db.DateTime, primary_key=True)
    maxtemp_c = db.Column(db.Float)
    mintemp_c = db.Column(db.Float)
    avgtemp_c = db.Column(db.Float)
    maxwind_kph = db.Column(db.Float)
    totalprecip_mm = db.Column(db.Float)
    avgvis_km = db.Column(db.Float)
    avghumidity = db.Column(db.Float)    
    uv = db.Column(db.Float)
    sunrise = db.Column(db.DateTime, nullable=True)
    sunset = db.Column(db.DateTime, nullable=True)