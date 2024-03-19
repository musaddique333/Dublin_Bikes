# %%
import pandas as pd

# %%
data = pd.read_csv('data/weather_data/hourly/dublin 2024-02-01 to 2024-02-29.csv')

# %%
data.columns

# %%
data['datetime'] = pd.to_datetime(data['datetime'])

# %%
data['datetime'] = data['datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
print(data[['datetime']].tail())

# %%


# %%
colums = [
    'datetime',
    'temp',
    'feelslike',
    'windspeed',
    'humidity',
    'precip',
    'windgust',
    'winddir',
    'sealevelpressure',
    'cloudcover',
    'uvindex'
]

# %%
df_sql = data[colums].copy()

# %%
rename = {
    'datetime' : 'time_stamp',
    'temp' : 'temp_c',
    'feelslike' : 'feelslike_c',
    'windspeed' : 'wind_kph',
    'humidity' : 'humidity',
    'precip' : 'precip_mm',
    'windgust' : 'gust_kph',
    'winddir' : 'wind_degree',
    'sealevelpressure' : 'pressure_mb',
    'cloudcover' : 'cloud',
    'uvindex' : 'uv'
}

# %%
df_sql.rename(columns=rename, inplace=True)

# %%
df_sql.columns

# %%
duplicates = df_sql.duplicated(keep=False)

# %%
print(df_sql[duplicates])

# %%
df_sql = df_sql.drop_duplicates()

# %%
has_duplicates = duplicates.any()
print("Are there any duplicate rows?", has_duplicates)

# %%
filename = f"hourlyWeather.csv"
df_sql.to_csv(filename, index=False)

# %%
import pandas as pd
from sqlalchemy import create_engine

USER = 'musaddique333'
PASSWORD = '7483854963Mus#'
URL = 'comp3080.cho0moo0yp7i.us-east-1.rds.amazonaws.com'
PORT = '3306'
DB = 'dublinBikes29'

engine = create_engine(f'mysql+pymysql://{USER}:{PASSWORD}@{URL}:{PORT}/{DB}')

csv_file_path = 'hourlyWeather.csv'
df = pd.read_csv(csv_file_path)

df['time_stamp'] = pd.to_datetime(df['time_stamp'])
df.to_sql('hourlyWeather', con=engine, if_exists='append', index=False, method='multi')


