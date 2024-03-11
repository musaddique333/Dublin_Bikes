import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt
# Load your dataset
# Assuming your dataset is stored in a DataFrame called 'df'
df = pd.read_csv('availability.csv')
df.drop('bike_stands', axis=1)
# Make sure 'time_stamp' is in datetime format

# Load your dataset
# Assuming your dataset is stored in a DataFrame called 'df'
# Make sure 'time_stamp' is in datetime format
df['time_stamp'] = pd.to_datetime(df['time_stamp'])

# Choose a specific station (e.g., station number 1)
station_id = 1
station_data = df[df['id'] == station_id][['time_stamp', 'bikes']].set_index('time_stamp')

# Fit ARIMA model
p, d, q = 1, 1, 1  # Adjust as needed
model = ARIMA(station_data, order=(p, d, q))
results = model.fit()

# Forecast future values
forecast_steps = 10  # Adjust as needed
forecast = results.get_forecast(steps=forecast_steps)

# Get forecasted values and confidence intervals
forecast_values = forecast.predicted_mean
confidence_intervals = forecast.conf_int()

# Plot the results
plt.figure(figsize=(12, 6))
plt.plot(station_data.index, station_data['bikes'], label='Actual')
plt.plot(forecast_values.index, forecast_values, color='red', label='Forecast')
plt.fill_between(confidence_intervals.index, confidence_intervals['lower bikes'], confidence_intervals['upper bikes'], color='pink', alpha=0.3)
plt.title(f'Bike Availability Forecast - Station {station_id}')
plt.xlabel('Time Stamp')
plt.ylabel('Bikes')
plt.legend()
plt.show()
