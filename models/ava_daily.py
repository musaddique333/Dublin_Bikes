import os
import sys
import pickle
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import Adam
import keras_tuner as kt

import warnings
warnings.filterwarnings("ignore")

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))
sys.path.append(project_root)


from config import URI

engine = create_engine(URI)
query = "SELECT * FROM availability"
df_bikes = pd.read_sql(query, engine)

query = "SELECT * FROM dailyWeather"
df_weather = pd.read_sql(query, engine)

engine.dispose()

def round_nearest(value):
    integer_part = int(value)
    fractional_part = value - integer_part
    if fractional_part >= 0.5:
        return integer_part + 1
    else:
        return integer_part

df_bikes['time_stamp'] = pd.to_datetime(df_bikes['time_stamp']).dt.round('D')
df_bikes = df_bikes.groupby(['id', 'time_stamp']).agg({'bikes': 'mean', 'bike_stands': 'mean'}).reset_index()
df_bikes['bikes'] = df_bikes['bikes'].apply(lambda x: round_nearest(x))
df_bikes['bike_stands'] = df_bikes['bike_stands'].apply(lambda x: round_nearest(x))
df_bikes = df_bikes[df_bikes['time_stamp'] != '2024-03-01']

df_weather['time_stamp'] = pd.to_datetime(df_weather['time_stamp']).dt.round('D')
df_weather['sunrise'] = pd.to_datetime(df_weather['sunrise']).dt.time
df_weather['sunset'] = pd.to_datetime(df_weather['sunset']).dt.time

df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')
df['time_stamp'] = pd.to_datetime(df['time_stamp'])

df['sunrise'] = df['sunrise'].apply(lambda x: x.hour * 3600 + x.minute * 60 + x.second)
df['sunset'] = df['sunset'].apply(lambda x: x.hour * 3600 + x.minute * 60 + x.second)

df['date_only'] = df['time_stamp'].dt.day
df['day_of_week'] = df['time_stamp'].dt.dayofweek
df = df.drop('time_stamp', axis=1)

X = df[['id', 'maxtemp_c', 'mintemp_c', 'avgtemp_c', 'maxwind_kph', 'totalprecip_mm', 'avgvis_km', 'avghumidity', 'uv', 'sunrise', 'sunset', 'date_only', 'day_of_week']]
y = df[['bikes', 'bike_stands']]

preprocessor_ann = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['maxtemp_c', 'mintemp_c', 'avgtemp_c', 'maxwind_kph', 'totalprecip_mm', 'avgvis_km', 'avghumidity', 'uv', 'sunrise', 'sunset', 'date_only', 'day_of_week']),
        ('cat', OneHotEncoder(), ['id'])
    ])
X_processed = preprocessor_ann.fit_transform(X)
scalar = StandardScaler()
y_processed = scalar.fit_transform(y.values)

input_shape = X_processed.shape[1:]

def model_builder(hp):
    model = Sequential()
    hp_activation1 = hp.Choice('activation', values=['relu', 'tanh'])
    hp_activation2 = hp.Choice('activation', values=['relu', 'tanh'])
    hp_activation3 = hp.Choice('activation', values=['relu', 'tanh'])
    hp_layer_1 = hp.Int('layer_1', min_value=64, max_value=512, step=64)
    hp_layer_2 = hp.Int('layer_2', min_value=64, max_value=512, step=64)
    hp_layer_3 = hp.Int('layer_3', min_value=64, max_value=512, step=64)
    hp_learning_rate = hp.Choice('learning_rate', values=[1e-2, 1e-3, 1e-4])

    model.add(Dense(units=hp_layer_1, activation=hp_activation1, input_shape=input_shape))
    model.add(Dense(units=hp_layer_2, activation=hp_activation2))
    model.add(Dense(units=hp_layer_3, activation=hp_activation3))
    model.add(Dense(2))

    model.compile(optimizer=Adam(learning_rate=hp_learning_rate), loss='mse', metrics=['mean_squared_error'])
    return model

objective = kt.Objective('mean_squared_error', direction='min')
tuner = kt.Hyperband(model_builder,
                     objective=objective,
                     max_epochs=50,
                     factor=3,
                     directory='models/dir',
                     project_name='ann_trials')
tuner.search(X_processed.toarray(), y_processed, epochs=50, callbacks=[keras.callbacks.EarlyStopping(patience=3)])
best_hps = tuner.get_best_hyperparameters(num_trials=1)[0]
ann_model = tuner.hypermodel.build(best_hps)
ann_model.fit(X_processed.toarray(), y_processed, epochs=50, callbacks=[keras.callbacks.EarlyStopping(patience=5)])

model_data = {
    'preprocessor': preprocessor_ann,
    'scaler': scalar
}

ann_model.save(f"models/ava_weather/ANN.keras")

location = f"models/ava_weather/preprocessors.pkl"
with open(location, 'wb') as model_file:
    pickle.dump(model_data, model_file)