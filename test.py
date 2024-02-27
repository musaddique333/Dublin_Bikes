from datetime import datetime

def convert_timestamp(timestamp_ms):
    timestamp_sec = timestamp_ms / 1000
    datetime_object = datetime.utcfromtimestamp(timestamp_sec)
    return datetime_object.isoformat()

# Example usage
timestamp_ms = 1708951351000
readable_date_time = convert_timestamp(timestamp_ms)

print(readable_date_time)

datetime_object = datetime.strptime(readable_date_time, '%Y-%m-%dT%H:%M:%S')

print(datetime_object, type(datetime_object))

# Format the datetime object to the desired format
formatted_datetime_str = datetime_object.strftime('%Y-%m-%d %H:%M:%S')

print(formatted_datetime_str, type(formatted_datetime_str))
