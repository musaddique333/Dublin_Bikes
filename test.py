from . import fetcher as session
import pandas as pd
import numpy as np

def round_nearest_vectorized(values):
    """Round values to nearest integer, vectorized for efficiency."""
    return np.round(values).astype(int)

def process_weather_variable(df, variable_name, bins=None, labels=None, round=False):
    """Generic function to process a weather variable with optional binning."""
    column_name = f'{variable_name}_c' if variable_name in ['temp', 'feelslike'] else variable_name
    if bins is not None and labels is not None:
        df[column_name] = pd.cut(df[column_name], bins=bins, labels=labels, include_lowest=True)
    else:
        if round:
            df[column_name] = df[column_name].round(-1)
        else:
            df[column_name] = df[column_name].round().astype(int)
    
    grouped_df = df.groupby(column_name).mean()[['bikes', 'bike_stands']].reset_index()
    grouped_df['bikes'] = round_nearest_vectorized(grouped_df['bikes'])
    grouped_df['bike_stands'] = round_nearest_vectorized(grouped_df['bike_stands'])

    return {
        "bikes": grouped_df["bikes"].values,
        "stands": grouped_df["bike_stands"].values,
        "X": grouped_df[column_name].values
    }

def get_data_for_statistics(id):
    df_bikes = pd.DataFrame(session.fetch_availability_data_all())
    df_bikes['time_stamp'] = pd.to_datetime(df_bikes['time_stamp']).dt.round('h')
    df_bikes = df_bikes.groupby(['id', 'time_stamp']).mean().reset_index()
    df_bikes[['bikes', 'bike_stands']] = df_bikes[['bikes', 'bike_stands']].apply(round_nearest_vectorized)
    
    df_weather = pd.DataFrame(session.fetch_weather_data_all())
    df_weather['time_stamp'] = pd.to_datetime(df_weather['time_stamp']).dt.round('h')

    df = pd.merge(df_bikes, df_weather, on='time_stamp', how='inner')
    df = df[df['id']  == id]
    df = df.drop('id', axis=1)
    df = df.drop('time_stamp', axis=1)
    
    wind_bins = [0, 3.4, 13.5, 18.2, 24.2, 40.25, 56]
    wind_labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme']
    gust_bins = [0, 2.20, 20.20, 32.80, 45.40, 83.20, 97]
    
    data_to_send = {
        "temp": process_weather_variable(df[['bikes', 'bike_stands', 'temp_c']].copy(), 'temp'),
        "feelslike": process_weather_variable(df[['bikes', 'bike_stands', 'feelslike_c']].copy(), 'feelslike'),
        "wind": process_weather_variable(df[['wind_kph', 'bikes', 'bike_stands']].copy(), 'wind_kph', bins=wind_bins, labels=wind_labels),
        "gust": process_weather_variable(df[['gust_kph', 'bikes', 'bike_stands']].copy(), 'gust_kph', bins=gust_bins, labels=wind_labels),
        "pressure": process_weather_variable(df[['pressure_mb', 'bikes', 'bike_stands']].copy(), 'pressure_mb', round=True)
    }
    
    data_to_send["precipitation"] = {
        "bikes": df["bikes"].values,
        "stands": df["bike_stands"].values,
        "X": df["precip_mm"].values
    }

    return data_to_send
