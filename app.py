from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy import create_engine, exc
from sqlalchemy import text
import requests
import datetime
import pandas as pd
import json
import os

app = Flask(__name__)
API_KEY = '681b757e032447abea03a11443b614d0ba3cf5ef'
NAME = "Dublin"
STATIONS = "https://api.jcdecaux.com/vls/v1/stations"

def connect_to_db():
    URL='comp3080.cho0moo0yp7i.us-east-1.rds.amazonaws.com'
    PORT='3306'
    DB='dublinBikes29'
    USER='musaddique333'
    PASSWORD='7483854963Mus#'
    engine=create_engine(f'mysql+mysqldb://{USER}:{PASSWORD}@{URL}:{PORT}/{DB}', echo=True)
    return engine

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
    
    try:
        with engine.connect() as conn:
            conn.execute(text('''DROP TABLE IF EXISTS station'''))
            result = conn.execute(text(query))
            print(result.fetchall())
    except exc.SQLAlchemyError as e:
        print(f"SQLAlchemy Error during table creation: {e}")
    except Exception as e:
        print(f"Error creating table: {e}")


    df = data.copy()
    columns = ['number', 'contract_name', 'name', 'address', 
               'banking', 'bonus', 'bike_stands', 'last_update', 
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
    df.drop(columns=['last_update'], inplace=True)
    df.sort_values(by='ID', ascending=True)

    filename = f"data/static_data.csv"
    df.to_csv(filename, index=True)

    try:
        df.to_sql('station', con=engine, index=False, if_exists='append', method='multi')
    except exc.SQLAlchemyError as e:
        print(f"SQLAlchemy Error during insert: {e}")
    except Exception as e:
        print(f"Unexpected error during insert: {e}")
    

def write_to_db(data):
    now = datetime.datetime.now()
    data = json.loads(data)
    data = pd.json_normalize(data)
    engine = connect_to_db()
    write_static(data, engine)


@app.route('/fetch-bike-data')
def fetch_bike_data():
    try:
        response = requests.get(STATIONS, params={"apiKey": API_KEY, "contract": NAME})
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.text
        write_to_db(data)
        return jsonify({"message": "Data fetched successfully"})
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": "HTTP error occurred", "details": str(e)}), e.response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Connection error occurred"}), 503
    except requests.exceptions.Timeout:
        return jsonify({"error": "The request timed out"}), 408
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "An error occurred while fetching data", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
