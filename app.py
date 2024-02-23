from flask import Flask, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
import mysql.connector
from sqlalchemy import create_engine, exc
from sqlalchemy import text
import requests
from datetime import datetime
import pandas as pd
import json
from cryptography.fernet import Fernet
import logging
import time
import os

app = Flask(__name__)

with open('keys/JCDecaux.key', 'rb') as filekey:
    key = filekey.read()
with open('keys/JCDecaux.enc', 'rb') as fileenc:
    cipher_text = fileenc.read()
cipher_suite = Fernet(key)
API_KEY = cipher_suite.decrypt(cipher_text).decode()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

NAME = "Dublin"
STATIONS = "https://api.jcdecaux.com/vls/v1/stations"

def connect_to_db():
    URL='comp3080.cho0moo0yp7i.us-east-1.rds.amazonaws.com'
    PORT='3306'
    DB='dublinBikes29'
    USER='musaddique333'
    
    with open('keys/RDS.key', 'rb') as filekey:
        key = filekey.read()
    with open('keys/RDS.enc', 'rb') as fileenc:
        cipher_text = fileenc.read()

    cipher_suite = Fernet(key)
    PASSWORD = cipher_suite.decrypt(cipher_text).decode()

    try:
        connection = mysql.connector.connect(
            host=URL,
            user=USER,
            password=PASSWORD,
            database=DB
        )
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print(f"Successfully connected to MySQL Server version {db_Info}")
            connection.close()
        else:
            print("Failed to connect to the database.")
    except mysql.connector.Error as e:
        print(f"Error while connecting to MySQL: {e}")
    
    engine=create_engine(f'mysql+mysqldb://{USER}:{PASSWORD}@{URL}:{PORT}/{DB}', echo=True)

    return engine

def create_new_table(query, engine, tablename):
    try:
        with engine.connect() as conn:
            conn.execute(text(f'''DROP TABLE IF EXISTS {tablename}'''))
            result = conn.execute(text(query))
            print(result.fetchall())
    except exc.SQLAlchemyError as e:
        print(f"SQLAlchemy Error during table creation: {e}")
    except Exception as e:
        print(f"Error creating table: {e}")

def write_static(data, engine):
    query = '''CREATE TABLE IF NOT EXISTS station 
        (ID INTEGER,
        contract VARCHAR (256),
        name VARCHAR (256),
        address VARCHAR (256), 
        banking INTEGER,
        bonus INTEGER,
        stands INTEGER,    
        position_lat REAL, 
        position_lng REAL, 
        status VARCHAR (256))'''

    create_new_table(query, engine, 'station')

    df = data.copy()
    columns = ['number', 'contract_name', 'name', 'address', 
               'banking', 'bonus', 'bike_stands', 
               'position.lat', 'position.lng', 'status']
    df = df[columns]
    df = df.rename(columns={
        'number': 'ID',
        'contract_name': 'contract',
        'name': 'name',
        'address': 'address',
        'banking': 'banking',
        'bonus': 'bonus',
        'bike_stands': 'stands',
        'position.lat': 'position_lat',
        'position.lng': 'position_lng',
        'status': 'status'
    })
    df.sort_values(by='ID', ascending=True)
    df['banking'] = df['banking'].astype(int)
    df['bonus'] = df['bonus'].astype(int)

    filename = f"data/static_data.csv"
    df.to_csv(filename, index=True)

    try:
        df.to_sql('station', con=engine, index=False, if_exists='append', method='multi')
    except exc.SQLAlchemyError as e:
        print(f"SQLAlchemy Error during insert: {e}")
    except Exception as e:
        print(f"Unexpected error during insert: {e}")
    
def write_dynamic(data, engine):
    query = '''CREATE TABLE IF NOT EXISTS availability 
        (ID INTEGER, 
        bikes INTEGER, 
        bike_stands INTEGER, 
        last_update INTEGER)'''
    
    create_new_table(query, engine, 'availability')

    df = data.copy()
    columns = ['number', 'available_bikes', 'available_bike_stands', 'last_update']
    df = df[columns]
    df = df.rename(columns={
        'number': 'ID',
        'available_bikes': 'bikes',
        'available_bike_stands': 'bike_stands'
    })
    df.sort_values(by='ID', ascending=True)

    now = datetime.now()
    now = now.strftime('%d-%m-%Y_and_%H:%M')
    filename = f"data/{now}-availability.csv"
    df.to_csv(filename, index=True)

    try:
        df.to_sql('availability', con=engine, index=False, if_exists='append', method='multi')
    except exc.SQLAlchemyError as e:
        print(f"SQLAlchemy Error during insert: {e}")
    except Exception as e:
        print(f"Unexpected error during insert: {e}")

def write_to_db(data):
    data = json.loads(data)
    data = pd.json_normalize(data)
    engine = connect_to_db()

    # write_static(data, engine) #Need to be done only one, no problem even if done cause it will overrite

    write_dynamic(data, engine)

def fetch_bike_data():
    try:
        now = datetime.now()
        response = requests.get(STATIONS, params={"apiKey": API_KEY, "contract": NAME})
        response.raise_for_status()

        data = response.text
        write_to_db(data)
        
        logging.info(f"Data fetched successfully at {now}")
        
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

scheduler = BackgroundScheduler()
scheduler.add_job(func=fetch_bike_data, trigger="interval", minutes=5)
scheduler.start()

@app.route('/')
def home():
    return jsonify({"message": "The Flask app with APScheduler is running. Data fetch is scheduled every 5 minutes."})

if __name__ == '__main__':
    app.run(debug=True)
    try:
        app.run(debug=True, use_reloader=False)
    except (KeyboardInterrupt, SystemExit):
        pass
    finally:
        scheduler.shutdown()