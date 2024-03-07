from flask import Blueprint, render_template, request, redirect, jsonify
from . import fetcher as session
import json

routes = Blueprint('routes', __name__)

from sqlalchemy import text


@routes.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@routes.route('/home')
def home():

    station_data = session.fetch_station_data()
    availability_data = session.fetch_availability_data()
    return render_template('home.html', station_data=json.dumps(station_data), availability_data=json.dumps(availability_data))
