from . import fetcher as session
import pandas as pd
import numpy as np

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
    df_weather['time_stamp'] = pd.to_datetime(df_weather['time_stamp'], format='%Y-%m-%d %H:%M:%S').dt.round('h')
    df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')

    df = df[df['id'] == id]
    df = df.drop('id', axis=1)
    df = df.drop('time_stamp', axis=1)

    temperature_df = df[['bikes', 'bike_stands', 'temp_c']].copy()
    temperature_df['temp_c'] = temperature_df['temp_c'].round().astype(int)
    temperature_df = temperature_df.groupby('temp_c').mean().reset_index()
    temperature_df['bikes'] = temperature_df['bikes'].apply(lambda x: round_nearest(x))
    temperature_df['bike_stands'] = temperature_df['bike_stands'].apply(lambda x: round_nearest(x))

    feelslike_df = df[['bikes', 'bike_stands', 'feelslike_c']].copy()
    feelslike_df['feelslike_c'] = feelslike_df['feelslike_c'].round().astype(int)
    feelslike_df = feelslike_df.groupby('feelslike_c').mean().reset_index()
    feelslike_df['bikes'] = feelslike_df['bikes'].apply(lambda x: round_nearest(x))
    feelslike_df['bike_stands'] = feelslike_df['bike_stands'].apply(lambda x: round_nearest(x))

    wind_df = df[['wind_kph', 'bikes', 'bike_stands']].copy()
    quartiles = df['wind_kph'].quantile([0.25, 0.5, 0.75])
    min_value = df['wind_kph'].min()
    max_value = df['wind_kph'].max()
    max_non_outlier_value = quartiles[0.75] + 1.5 * (quartiles[0.75] - quartiles[0.25])
    
    bins = [0, min_value, quartiles[0.25], quartiles[0.5], quartiles[0.75], max_non_outlier_value, max_value]
    labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme'] 
    wind_df['wind_kph'] = pd.cut(wind_df['wind_kph'], bins=bins, labels=labels, include_lowest=True)
    wind_df = wind_df.groupby('wind_kph', observed=True).mean().reset_index()
    wind_df['bikes'] = wind_df['bikes'].apply(lambda x: round_nearest(x))
    wind_df['bike_stands'] = wind_df['bike_stands'].apply(lambda x: round_nearest(x))

    gust_df = df[['gust_kph', 'bikes', 'bike_stands']].copy()
    quartiles = df['gust_kph'].quantile([0.25, 0.5, 0.75])
    min_value = df['gust_kph'].min()
    max_value = df['gust_kph'].max()
    max_non_outlier_value = quartiles[0.75] + 1.5 * (quartiles[0.75] - quartiles[0.25])
    bins = [0, min_value, quartiles[0.25], quartiles[0.5], quartiles[0.75], max_value]
    labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] 
    gust_df['gust_kph'] = pd.cut(gust_df['gust_kph'], bins=bins, labels=labels, include_lowest=True)
    gust_df = gust_df.groupby('gust_kph', observed=True).mean().reset_index()
    gust_df['bikes'] = gust_df['bikes'].apply(lambda x: round_nearest(x))
    gust_df['bike_stands'] = gust_df['bike_stands'].apply(lambda x: round_nearest(x))

    pressure_df = df[['pressure_mb', 'bikes', 'bike_stands']].copy()
    pressure_df = pressure_df.groupby('pressure_mb').mean().reset_index()
    pressure_df['bikes'] = pressure_df['bikes'].apply(lambda x: round_nearest(x))
    pressure_df['bike_stands'] = pressure_df['bike_stands'].apply(lambda x: round_nearest(x))

    precipitation_df = df[['precip_mm', 'bikes', 'bike_stands']].copy()
    precipitation_df = precipitation_df.groupby('precip_mm').mean().reset_index()
    precipitation_df['bikes'] = precipitation_df['bikes'].apply(lambda x: round_nearest(x))
    precipitation_df['bike_stands'] = precipitation_df['bike_stands'].apply(lambda x: round_nearest(x))

    output = {
        "temp" : {
            "temp" : temperature_df['temp_c'].values.tolist(),
            "bikes": temperature_df['bikes'].values.tolist(),
            "bike_stands": temperature_df['bike_stands'].values.tolist()
        },
        "feelslike" : {
            "feelslike" : feelslike_df['feelslike_c'].values.tolist(),
            "bikes": feelslike_df['bikes'].values.tolist(),
            "bike_stands": feelslike_df['bike_stands'].values.tolist()
        },
        "wind" : {
            "wind" : wind_df['wind_kph'].values.tolist(),
            "bikes": wind_df['bikes'].values.tolist(),
            "bike_stands": wind_df['bike_stands'].values.tolist()
        },
        "gust" : {
            "gust" : gust_df['gust_kph'].values.tolist(),
            "bikes": gust_df['bikes'].values.tolist(),
            "bike_stands": gust_df['bike_stands'].values.tolist()
        },
        "pressure" : {
            "pressure" : pressure_df['pressure_mb'].values.tolist(),
            "bikes": pressure_df['bikes'].values.tolist(),
            "bike_stands": pressure_df['bike_stands'].values.tolist()
        },
        "precipitation" : {
            "precipitation" : precipitation_df['precip_mm'].values.tolist(),
            "bikes": precipitation_df['bikes'].values.tolist(),
            "bike_stands": precipitation_df['bike_stands'].values.tolist()
        }
    }

    return output
 
