from flask import Blueprint, render_template, request, redirect, jsonify, send_from_directory
from . import fetcher as session
import json
from dotenv import load_dotenv
from . import predict_from_time
import os

routes = Blueprint('routes', __name__)

from sqlalchemy import text

@routes.route('/favicon.ico')
def favicon():
    favicon_path = os.path.join(app.root_path, 'static', 'img', 'icons', 'favicon.ico')
    return send_from_directory(os.path.dirname(favicon_path), os.path.basename(favicon_path), mimetype='image/vnd.microsoft.icon')


@routes.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@routes.route('/home', methods=['GET', 'POST'])
def home():
    load_dotenv()
    station_data = session.fetch_station_data()
    availability_data = session.fetch_availability_data()
    return render_template('home.html', weather_api=os.getenv('weather_api'), maps_api=os.getenv('maps_api'), station_data=json.dumps(station_data), availability_data=json.dumps(availability_data))

@routes.route('/receive_variables', methods=['POST'])
def receive_variables():
    data = request.json

    id = int(data.get('id'))

    if id is not None:
        prediction_result = predict_from_time.predict_from_time(id)
        return jsonify({'prediction': prediction_result})
    else:
        return jsonify({'error': 'error no id given'})

@routes.route('/weather_statistics', methods=['GET', 'POST'])
def weather_statistics():
    variable1 = request.args.get('variable1')
    print("jdhkvdgjkhwhkdljhvkjwklakdklwkhklvdjkawahkjlvkdwhekljkdvhkljwkbj ====================", variable1)
    return render_template('weather.html', variable1=variable1)

@routes.route('/date_time_statistics', methods=['GET', 'POST'])
def date_time():
    return render_template('datetime.html')
