import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))
sys.path.append(project_root)

from config import URI
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pickle
import warnings
warnings.filterwarnings("ignore")

engine = create_engine(URI)
query = "SELECT * FROM availability"
df = pd.read_sql(query, engine)
engine.dispose()

for i in df['id'].unique():
    data = df[df['id'] == i]

    X = data[['time_stamp']]
    y = data[['bike_stands', 'bikes']]

    X['time_stamp'] = pd.to_datetime(X['time_stamp']).dt.round('30min')
    X['hour'] = X['time_stamp'].dt.hour
    X['day_of_week'] = X['time_stamp'].dt.dayofweek
    X['time_stamp'] = pd.to_datetime(X['time_stamp']).astype(int) // 10**9

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['time_stamp', 'hour']),
            ('cat', OneHotEncoder(), ['day_of_week'])
        ])

    X_processed = preprocessor.fit_transform(X)

    scalar = StandardScaler()
    y_processed = scalar.fit_transform(y['bikes'].values.reshape(-1, 1))

    regressor = KNeighborsRegressor(n_neighbors=2, n_jobs=-1)
    regressor.fit(X_processed, y_processed)

    model_data = {
        'regressor': regressor,
        'scaler': scalar,
        'preprocessor': preprocessor
    }

    location = f'models/ava_time/bikes/{i}.pkl'
    with open(location, 'wb') as model_file:
        pickle.dump(model_data, model_file)

    scalar = StandardScaler()
    y_processed = scalar.fit_transform(y['bike_stands'].values.reshape(-1, 1))

    regressor = KNeighborsRegressor(n_neighbors=2, n_jobs=-1)
    regressor.fit(X_processed, y_processed)

    model_data = {
        'regressor': regressor,
        'scaler': scalar,
        'preprocessor': preprocessor
    }

    location = f'models/ava_time/stands/{i}.pkl'
    with open(location, 'wb') as model_file:
        pickle.dump(model_data, model_file)
