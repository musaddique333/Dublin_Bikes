from datetime import timedelta
from dotenv import load_dotenv
import os

def configure():
    load_dotenv()

configure()

class Config:
    SECRET_KEY = os.getenv('rds_key')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = timedelta(seconds=3600)

config_dict = {
    'Production': ProductionConfig,
    'Debug'     : DevelopmentConfig
}


URL = os.getenv('URL')
PORT = os.getenv('PORT')
DB = os.getenv('DB')
USER = os.getenv('USER')
PASSWORD = os.getenv('rds_key')
URI = f'mysql+pymysql://{USER}:{PASSWORD}@{URL}:{PORT}/{DB}'


JCDecaux_dict = {
    'NAME' : "Dublin",
    'STATIONS' : "https://api.jcdecaux.com/vls/v1/stations",
    'API_KEY' : os.getenv('db_api')
}

WeatherAPI_dict = {
    'WeatherAPI' : "http://api.weatherapi.com/v1/current.json",
    'API_KEY' : os.getenv('weather_api'),
    'q' : '53.3510857,-6.2529918'
}
