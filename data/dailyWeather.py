# %%
import pandas as pd

# %%
data = pd.read_csv('data/weather_data/daily/dublin 2024-02-01 to 2024-02-29.csv')

# %%
data.columns

# %%
data['datetime'] = pd.to_datetime(data['datetime'])

# %%
data['datetime'] = data['datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
print(data[['datetime']].tail())

# %%
data['sunrise'] = pd.to_datetime(data['sunrise'])
data['sunrise'] = data['sunrise'].dt.strftime('%Y-%m-%d %H:%M:%S')
print(data[['sunrise']].tail())

# %%
data['sunset'] = pd.to_datetime(data['sunset'])
data['sunset'] = data['sunset'].dt.strftime('%Y-%m-%d %H:%M:%S')
print(data[['sunset']].tail())

# %%
colums = [
    'datetime',
    'tempmax',
    'tempmin',
    'temp',
    'windspeed',
    'precip',
    'visibility',
    'humidity',
    'uvindex',
    'sunrise',
    'sunset'
]

# %%
df_sql = data[colums].copy()

# %%
rename = {
    'datetime' : 'time_stamp',
    'tempmax' : 'maxtemp_c',
    'tempmin' : 'mintemp_c',
    'temp' : 'avgtemp_c',
    'windspeed' : 'maxwind_kph',
    'precip' : 'totalprecip_mm',
    'visibility' : 'avgvis_km',
    'humidity' : 'avghumidity',
    'uvindex' : 'uv',
    'sunrise' : 'sunrise',
    'sunset' : 'sunset'
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
filename = f"dailyWeather.csv"
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

csv_file_path = 'dailyWeather.csv'
df = pd.read_csv(csv_file_path)

df['time_stamp'] = pd.to_datetime(df['time_stamp'])
df['sunrise'] = pd.to_datetime(df['sunrise'])
df['sunset'] = pd.to_datetime(df['sunset'])
df.to_sql('dailyWeather', con=engine, if_exists='append', index=False, method='multi')


