from flask import Blueprint, render_template, request, redirect, jsonify, send_from_directory
from . import fetcher as session
import json
from dotenv import load_dotenv
from . import predict_from_time, predict_from_weather, statistics
import os
from datetime import datetime, timedelta

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

@routes.route('/hour_plot_id', methods=['POST'])
def hour_plot_id():
    data = request.json

    id = int(data.get('id'))

    if id is not None:
        prediction_result = predict_from_time.predict_from_time(id)
        return jsonify({'prediction': prediction_result})
    else:
        return jsonify({'error': 'error no id given'})

@routes.route('/weather_statistics', methods=['GET', 'POST'])
def weather_statistics():
    init_station = request.args.get('init_station')
    station_data = session.fetch_station_data()
    return render_template('weather.html', init_station=init_station, station_data=json.dumps(station_data))

@routes.route('/one_week_forecast', methods=['POST'])
def one_week_forecast():
    data = request.json
    id = int(data.get('id'))
    start = data.get('start')
    end = data.get('end')

    if id is not None:
        prediction_result = predict_from_weather.predict_range_from_weather(id, start, end)
        return jsonify({'prediction': prediction_result})
    else:
        return jsonify({'error': 'error no id given'})

@routes.route('/one_day_forecast', methods=['POST'])
def one_day_forecast():
    data = request.json
    id = int(data.get('id'))
    date = data.get('date')
    start = data.get('start')
    end = data.get('end')
    
    if id is not None:
        prediction_result = predict_from_time.predict_range_from_time(id, date, start, end)
        return jsonify({'prediction': prediction_result})
    else:
        return jsonify({'error': 'error no id given'})
    
@routes.route('/show_weather_stats', methods=['POST'])
def show_weather_stats():
    data = request.json
    id = int(data.get('id'))
    if id is not None:
        stats = statistics.get_data_for_statistics(id)
        return jsonify({'prediction': stats})
    else:
        return jsonify({'error': 'error no id given'})

@routes.route('/retrain', methods=['POST'])
def retrain():
       from . import ava_daily, ava_time
       return jsonify({'message': 'Models Retained Successfully'})