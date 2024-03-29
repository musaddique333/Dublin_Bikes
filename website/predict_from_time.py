import pickle
import pandas as pd
from datetime import datetime, timedelta
import os
import sys
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))
sys.path.append(project_root)

def round_nearest(value):
    integer_part = int(value)
    fractional_part = value - integer_part
    if fractional_part >= 0.5:
        return integer_part + 1
    else:
        return integer_part

def predict_from_time(id):
    with open('models/ava_time/bikes/KNearestNeighbors.pkl', 'rb') as model_file:
        model_data = pickle.load(model_file)

    preprocessor = model_data['preprocessor']
    scalar1 = model_data['scalar']
    regressor_knn = model_data['model']

    with open('models/ava_time/bike_stands/KNearestNeighbors.pkl', 'rb') as model_file:
        model_data = pickle.load(model_file)

    scalar2 = model_data['scalar']
    regressor_knn2 = model_data['model']

    output = predict_hourly(id, preprocessor, scalar1, scalar2, regressor_knn, regressor_knn2)

    return output

def predict_hourly(id, preprocessor, scalar1, scalar2, model_bikes, model_stands):
    hours = [i for i in range(24)]

    now = datetime.now()
    now = now.strftime('%Y:%m:%d %H:%M:%S')

    stands_res = []
    bikes_res = []
    for hour in hours:
        input_data = pd.DataFrame()
        input_data['id'] = [id]
        input_data['time_stamp'] = pd.to_datetime([now])
        input_data['date_only'] = input_data['time_stamp'].dt.day
        input_data['day_of_week'] = input_data['time_stamp'].dt.dayofweek
        input_data['month_number'] = input_data['time_stamp'].dt.month
        input_data = input_data.drop('time_stamp', axis=1)
        input_data['hour'] = [hour]

        input_data_processed = preprocessor.transform(input_data)
        bike = round_nearest(scalar1.inverse_transform(model_bikes.predict(input_data_processed).reshape(-1, 1)).item())
        stand = round_nearest(scalar2.inverse_transform(model_stands.predict(input_data_processed).reshape(-1, 1)).item())
        bikes_res.append(bike)
        stands_res.append(stand)
    
    output = {
        'bikes' : bikes_res,
        'stands' : stands_res
    }

    return output

def predict_range_from_time(id, date, start, end):
    with open('models/ava_time/bikes/KNearestNeighbors.pkl', 'rb') as model_file:
        model_data = pickle.load(model_file)

    preprocessor = model_data['preprocessor']
    scalar1 = model_data['scalar']
    regressor_knn = model_data['model']

    with open('models/ava_time/bike_stands/KNearestNeighbors.pkl', 'rb') as model_file:
        model_data = pickle.load(model_file)

    scalar2 = model_data['scalar']
    regressor_knn2 = model_data['model']

    output = predict_range_hourly(id, date, start, end, preprocessor, scalar1, scalar2, regressor_knn, regressor_knn2)

    return output


def predict_range_hourly(id, date, start, end, preprocessor, scalar1, scalar2, model_bikes, model_stands):

    now = datetime.strptime(f"{date} {start}", "%Y-%m-%d %H:%M")
    hours, minutes = map(int, start.split(':'))
    start = hours + minutes / 60.0
    hours, minutes = map(int, end.split(':'))
    end = hours + minutes / 60.0

    if start == end:
        hours = [int(start)]
    else:
        hours = [start+i for i in range(int(start), int(end))]

    stands_res = []
    bikes_res = []
    for hour in hours:
        input_data = pd.DataFrame()
        input_data['id'] = [id]
        input_data['time_stamp'] = pd.to_datetime([now])
        input_data['date_only'] = input_data['time_stamp'].dt.day
        input_data['day_of_week'] = input_data['time_stamp'].dt.dayofweek
        input_data['month_number'] = input_data['time_stamp'].dt.month
        input_data = input_data.drop('time_stamp', axis=1)
        input_data['hour'] = [hour]

        input_data_processed = preprocessor.transform(input_data)
        bike = round_nearest(scalar1.inverse_transform(model_bikes.predict(input_data_processed).reshape(-1, 1)).item())
        stand = round_nearest(scalar2.inverse_transform(model_stands.predict(input_data_processed).reshape(-1, 1)).item())
        bikes_res.append(bike)
        stands_res.append(stand)
    
    output = {
        'bikes' : bikes_res,
        'stands' : stands_res
    }


    return output