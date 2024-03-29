import pickle
from keras.models import load_model
import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()

def round_nearest(value):
    integer_part = int(value)
    fractional_part = value - integer_part
    if fractional_part >= 0.5:
        return integer_part + 1
    else:
        return integer_part

def predict_hourly(id, date,start, end, preprocessor, scalar, model):
    link = 'http://api.weatherapi.com/v1/forecast.json'
    api = os.getenv('weather_api')
    contract = 'Dublin'
    response = requests.get(link, 
                                params={"key": api, 
                                        "q": contract,
                                        'dt': date})
    response.raise_for_status()
    data = response.text
    data = json.loads(data)
    data = pd.json_normalize(data['forecast']['forecastday'][0]['hour'])
    data['time'] = pd.to_datetime(data['time']).round('h')

    start = datetime.strptime(f"{date} {start}", "%Y-%m-%d %H:%M")
    end = datetime.strptime(f"{date} {end}", "%Y-%m-%d %H:%M")
    datetime_list = []
    current_datetime = start
    while current_datetime <= end:
        datetime_list.append(str(current_datetime.strftime("%Y-%m-%d %H:%M")))
        current_datetime += timedelta(hours=1)

    stands = []
    bikes = []

    for dtime in datetime_list:
        sample = data[data['time'] == dtime]
        sample = sample[['time', 'temp_c', 'feelslike_c', 'wind_kph', 'humidity', 'precip_mm', 'gust_kph', 'wind_degree', 'pressure_mb', 'cloud', 'uv']]
        sample = sample.rename(columns={'time': 'time_stamp'})
        sample.set_index('time_stamp', inplace=True)
        input_data_processed = preprocessor.transform(sample)
        input_data_processed = np.reshape(input_data_processed, (1, input_data_processed.shape[0], input_data_processed.shape[1]))
        predicted_scaled = model.predict(input_data_processed)
        predicted = np.vectorize(round_nearest)(scalar.inverse_transform(predicted_scaled))
        bikes.append(predicted[0][0])
        stands.append(predicted[0][1])
        
    output = {
        'bikes' : bikes,
       'stands' : stands
    }



model_path = f"models/ava_weather/RNN/rnn_{1}.keras"
scaler_path = f"models/ava_weather/RNN/model_data/scaler_{1}.pkl"
model = load_model(model_path)
with open(scaler_path, 'rb') as model_file:
    model_data = pickle.load(model_file)

preprocessor = model_data['scaler_X']
scalar = model_data['scaler_y']
output = predict_hourly(id, '2024-03-29', '00:00', '23:00', preprocessor, scalar, model)