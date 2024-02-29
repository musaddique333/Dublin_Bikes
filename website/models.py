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
    bikes = db.Column(db.Integer)
    bike_stands = db.Column(db.Integer)
    time_stamp = db.Column(db.BIGINT, primary_key=True)
    
class Weather(db.Model):
    __tablename__ = 'weather'

    time_stamp = db.Column(db.BIGINT, primary_key=True, autoincrement=False)
    temp_c = db.Column(db.Numeric(5, 2))
    feelslike_c = db.Column(db.Numeric(5, 2))
    condition_text = db.Column(db.String(256))
    condition_icon = db.Column(db.String(256))
    condition_code = db.Column(db.Integer)
    wind_kph = db.Column(db.Numeric(5, 2))
    wind_degree = db.Column(db.Integer)
    wind_dir = db.Column(db.String(5))
    pressure_mb = db.Column(db.Numeric(6, 2))
    precip_mm = db.Column(db.Numeric(5, 2))
    humidity = db.Column(db.Integer)
    cloud = db.Column(db.Integer)
    is_day = db.Column(db.Boolean)
    uv = db.Column(db.Numeric(5, 2))
    gust_kph = db.Column(db.Numeric(5, 2))