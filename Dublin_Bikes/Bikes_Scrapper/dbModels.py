import sqlalchemy
import pymysql
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float,ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.engine.url import URL
from sqlalchemy import inspect


Base = declarative_base()
uname='admin'
pword='Qwerty123'
dbname='dublinbikesdb'
dbendpoint="dublinbikesdb.cbqs0wkquo5p.eu-north-1.rds.amazonaws.com"
dbport=3306
# engine = create_engine('mysql+pymysql://admin:qwerty123@dublinbikesdb.cbqs0wkquo5p.eu-north-1.rds.amazonaws.com/dublinbikesdb')
# engine = create_engine('mysql+pymysql://root:Qwerty_12345678@localhost:3306/dublinbikesdb',echo=True)
db_url = URL.create(
    drivername='mysql+pymysql',
    username=uname,
    password=pword,
    host=dbendpoint,
    port=dbport,
    database=dbname
)

engine = create_engine(db_url, echo=False)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)


class Station(Base):
    __tablename__ = 'station'
    number = Column(Integer, primary_key=True)
    address = Column(String(255))
    banking = Column(Boolean)
    bonus = Column(Boolean)
    bike_stands = Column(Integer)
    name = Column(String(255))
    position_lat = Column(Float)
    position_lng = Column(Float)

    availability = relationship('Availability', back_populates='station')

    def __init__(self, number, address, banking, bonus, bike_stands, name, position_lat, position_lng):
        self.number = number
        self.address = address
        self.banking = banking
        self.bonus = bonus
        self.bike_stands = bike_stands
        self.name = name
        self.position_lat = position_lat
        self.position_lng = position_lng

class Availability(Base):
    __tablename__ = 'availability'
    id = Column(Integer, primary_key=True, autoincrement=True)
    number_id = Column(Integer, ForeignKey('station.number', ondelete='CASCADE'))
    last_update = Column(DateTime)
    available_bikes = Column(Integer)
    available_bike_stands = Column(Integer)
    status = Column(String(255))

    
    station = relationship('Station', back_populates='availability')

    def __init__(self, number, last_update, available_bikes, available_bike_stands, status):
        self.number_id = number
        self.last_update = last_update
        self.available_bikes = available_bikes
        self.available_bike_stands = available_bike_stands
        self.status = status

def create_tables():
    try:
        with Session() as session:
            inspector = inspect(engine)
            if not inspector.has_table('station'):
                Base.metadata.create_all(engine)

            if not inspector.has_table('availability'):
                Base.metadata.create_all(engine)
    except Exception as e:
        print(f"Error: {e}")

create_tables()

def addStationToDataBase(data):
    try:
        with Session() as session:
            exisitng_station = session.query(Station).filter_by(number=data.number).first()
            if not exisitng_station:
                session.add(data)
                session.commit()
    except Exception as e:
        print(f"Error: {e}")
 

def addAvailabilityToDataBase(data):
    try:
        with Session() as session:
            session.add(data)
            session.commit()
    except Exception as e:
        print(f"Error: {e}")