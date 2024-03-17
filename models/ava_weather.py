import os
import sys
import pickle
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM, Dropout

import warnings
warnings.filterwarnings("ignore")

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))
sys.path.append(project_root)


from config import URI

engine = create_engine(URI)
query = "SELECT * FROM availability"
df_bikes = pd.read_sql(query, engine)

query = "SELECT * FROM HourlyWeather"
df_weather = pd.read_sql(query, engine)

engine.dispose()

df_bikes['time_stamp'] = pd.to_datetime(df_bikes['time_stamp']).dt.round('H')
df_bikes = df_bikes.groupby(['id', 'time_stamp']).agg({'bikes': 'mean', 'bike_stands': 'mean'}).reset_index()
df_weather['time_stamp'] = pd.to_datetime(df_weather['time_stamp']).dt.round('H')

df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')
df['time_stamp'] = pd.to_datetime(df['time_stamp'])

def create_sequences(data, target, seq_length):
    X, y = [], []
    for i in range(data.shape[0] - seq_length):
        X.append(data[i:i + seq_length])
        y.append(target[i + seq_length])
    return np.array(X), np.array(y)

for i in df['id']:
    df_rnn = df[df['id'] == i]
    df_rnn['time_stamp'] = pd.to_datetime(df_rnn['time_stamp'])
    df_rnn.set_index('time_stamp', inplace=True)
    df_rnn = df_rnn.drop('id', axis=1)
    X = df_rnn.drop(columns=['bikes', 'bike_stands'])
    y = df_rnn[['bikes', 'bike_stands']]

    scaler_X = StandardScaler()
    scaler_y = StandardScaler()
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y)

    sequence_length = 24
    X_seq, y_seq = create_sequences(X_scaled, y_scaled, sequence_length)

    X_train_rnn, X_test_rnn, y_train_rnn, y_test_rnn = train_test_split(X_seq, y_seq, test_size=0.2, random_state=42)

    model = Sequential([
        LSTM(units=128, return_sequences=True, input_shape=(X_train_rnn.shape[1], X_train_rnn.shape[2])),
        Dropout(0.1),
        LSTM(units=128, return_sequences=False),
        Dense(units=2)
    ])

    model.compile(optimizer='adam', loss='mse')

    model.fit(X_train_rnn, y_train_rnn, epochs=10, batch_size=16)

    model_data = {
        'model': model,
        'scaler_X': scaler_X,
        'scaler_y': scaler_y
    }

    location = "models/ava_weather/RNN/rnn{i}.pkl"
    with open(location, 'wb') as model_file:
        pickle.dump(model_data, model_file)