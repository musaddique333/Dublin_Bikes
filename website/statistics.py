from . import fetcher as session
import pandas as pd

def round_nearest(value):
    integer_part = int(value)
    fractional_part = value - integer_part
    if fractional_part >= 0.5:
        return integer_part + 1
    else:
        return integer_part
    
def get_data_for_statistics(id):
    df_bikes = session.fetch_availability_data_all()
    df_bikes = pd.DataFrame(df_bikes)
    df_bikes['time_stamp'] = pd.to_datetime(df_bikes['time_stamp']).dt.round('h')
    df_bikes = df_bikes.groupby(['id', 'time_stamp']).agg({'bikes': 'mean', 'bike_stands': 'mean'}).reset_index()
    df_bikes['bikes'] = df_bikes['bikes'].apply(lambda x: round_nearest(x))
    df_bikes['bike_stands'] = df_bikes['bike_stands'].apply(lambda x: round_nearest(x))

    df_weather = session.fetch_weather_data_all()
    df_weather = pd.DataFrame(df_weather)
    df_weather['time_stamp'] = pd.to_datetime(df_weather['time_stamp']).dt.round('h')
    df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')
    df['time_stamp'] = pd.to_datetime(df['time_stamp'])

    df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')
    df['time_stamp'] = pd.to_datetime(df['time_stamp'])
    df = df[df['id'] == id]

    return df
 