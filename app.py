from flask import Flask, jsonify
import requests
import datetime
import os

app = Flask(__name__)

# Replace 'your_api_key' with your actual API key, or better yet,
# use an environment variable as shown in the previous example.
# API_KEY = os.environ.get('JCDECAUX_API_KEY', 'your_api_key')
API_KEY = '681b757e032447abea03a11443b614d0ba3cf5ef'
NAME = "Dublin"
STATIONS = "https://api.jcdecaux.com/vls/v1/stations"

def write_to_file(data):
    now = datetime.datetime.now()
    filename = f"data/bikes_{now.strftime('%Y-%m-%d_%H-%M-%S')}.txt"
    with open(filename, "w") as f:
        f.write(data)
    return filename

@app.route('/fetch-bike-data')
def fetch_bike_data():
    try:
        response = requests.get(STATIONS, params={"apiKey": API_KEY, "contract": NAME})
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.text
        filename = write_to_file(data)
        return jsonify({"message": "Data fetched successfully", "file": filename})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)