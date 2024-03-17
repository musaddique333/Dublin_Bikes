import os
import sys
import pickle
import pandas as pd
from sqlalchemy import create_engine
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import warnings

warnings.filterwarnings("ignore")

def save_model(model, scaler, preprocessor, location):
    model_data = {
        'model': model,
        'scalar': scaler,
        'preprocessor': preprocessor
    }
    with open(location, 'wb') as model_file:
        pickle.dump(model_data, model_file)

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))
sys.path.append(project_root)

from config import URI

engine = create_engine(URI)
query = "SELECT * FROM availability"
df = pd.read_sql(query, engine)
engine.dispose()

result = df.groupby([df['time_stamp'], df['id']]).mean().reset_index()
X = result[['time_stamp', 'id']]
X['time_stamp'] = pd.to_datetime(X['time_stamp'])
X['hour'] = X['time_stamp'].dt.hour
X['date_only'] = X['time_stamp'].dt.day
X['day_of_week'] = X['time_stamp'].dt.dayofweek
X['month_number'] = X['time_stamp'].dt.month
X = X.drop('time_stamp', axis=1)

numeric_features = ['hour', 'date_only', 'day_of_week', 'month_number']
numeric_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_features = ['id']
categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder())
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

X_processed = preprocessor.fit_transform(X)

def transform_target(y):
    scaler = StandardScaler()
    y_processed = scaler.fit_transform(y.values.reshape(-1, 1))
    return y_processed, scaler

y_bikes_processed, scaler_bikes = transform_target(result['bikes'])
y_bike_stands_processed, scaler_bike_stands = transform_target(result['bike_stands'])

regressor = KNeighborsRegressor(algorithm='brute', n_neighbors=2, p=1, weights='distance')
regressor.fit(X_processed, y_bikes_processed)
save_model(regressor, scaler_bikes, preprocessor, 'models/ava_time/bikes/KNearestNeighbors.pkl')

regressor = KNeighborsRegressor(algorithm='brute', n_neighbors=2, p=1, weights='distance')
regressor.fit(X_processed, y_bike_stands_processed)
save_model(regressor, scaler_bike_stands, preprocessor, 'models/ava_time/bike_stands/KNearestNeighbors.pkl')