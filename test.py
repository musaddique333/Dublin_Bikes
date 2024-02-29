from datetime import datetime

# Assuming your timestamp is in seconds
timestamp = 1709210210

# Convert timestamp to datetime object
date_time = datetime.fromtimestamp(timestamp)

# Format the datetime object to a string in the format 'YYYY-MM-DD HH:MM:SS'
formatted_date_time = date_time.strftime('%Y-%m-%d %H:%M:%S')

print(f"Date and Time: {formatted_date_time}")