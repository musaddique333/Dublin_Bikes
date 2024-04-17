import requests
import json
import dbModels
import time
def formatdate(value):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(value))
def scrapeData():
    while True:
        r=requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=ac533d614546a710671afb77efe8e3e5a9ae9902' )
        stations = r.json()
        # print(stations)

        for station in stations:
            s = dbModels.Station(station['number'], station['address'], station['banking'], station['bonus'],station['bike_stands'], station['name'], station['position']['lat'], station['position']['lng'])
            
            dbModels.addStationToDataBase(s)
            last_updated = formatdate( station['last_update']//1000)

            a = dbModels.Availability(station['number'],last_updated,station['available_bikes'], station['available_bike_stands'], station['status'])

            dbModels.addAvailabilityToDataBase(a)
        print("Next load starts in 5 minutes")
        time.sleep(5*60 )
            

scrapeData()