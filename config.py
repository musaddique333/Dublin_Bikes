from datetime import timedelta
from cryptography.fernet import Fernet

with open('keys/RDS.key', 'rb') as filekey:
    key = filekey.read()
with open('keys/RDS.enc', 'rb') as fileenc:
    cipher_text = fileenc.read()
cipher_suite = Fernet(key)

class Config:
    SECRET_KEY = cipher_suite.decrypt(cipher_text).decode()

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

with open('keys/RDS.key', 'rb') as filekey:
    key = filekey.read()
with open('keys/RDS.enc', 'rb') as fileenc:
    cipher_text = fileenc.read()
cipher_suite = Fernet(key)

URL = 'comp3080.cho0moo0yp7i.us-east-1.rds.amazonaws.com'
PORT = '3306'
DB = 'dublinBikes29'
USER = 'musaddique333'
PASSWORD = cipher_suite.decrypt(cipher_text).decode()
URI = f'mysql+pymysql://{USER}:{PASSWORD}@{URL}:{PORT}/{DB}'

with open('keys/JCDecaux.key', 'rb') as filekey:
    key = filekey.read()
with open('keys/JCDecaux.enc', 'rb') as fileenc:
    cipher_text = fileenc.read()
cipher_suite = Fernet(key)

JCDecaux_dict = {
    'NAME' : "Dublin",
    'STATIONS' : "https://api.jcdecaux.com/vls/v1/stations",
    'API_KEY' : cipher_suite.decrypt(cipher_text).decode()
}


with open('keys/WeatherAPI.key', 'rb') as filekey:
    key = filekey.read()
with open('keys/WeatherAPI.enc', 'rb') as fileenc:
    cipher_text = fileenc.read()
cipher_suite = Fernet(key)

WeatherAPI_dict = {
    'WeatherAPI' : "http://api.weatherapi.com/v1/current.json",
    'API_KEY' : cipher_suite.decrypt(cipher_text).decode(),
    'q' : '53.3510857,-6.2529918'
}