const station_data = JSON.parse(document.getElementById('stationData').getAttribute('data-station'));
const availability_data = JSON.parse(document.getElementById('availabilityData').getAttribute('data-availability'));

function loadDataAndCreateMarkers(markers, map) {
    const station_info_bar = document.getElementById('station-info-bar');
    station_info_bar.style.display = 'none'

    station_data.forEach((markerData, index) => {
        const markerDict = {
            id: markerData.id,
            location_name: markerData.locationName,
            lat: markerData.lat,
            lng: markerData.lng,
            address: markerData.address,
            banking: markerData.banking,
            bonus: markerData.bonus,
            total_stands: markerData.total,
            status: markerData.status,
            ava_bikes: availability_data[index].bikes,
            ava_stands: availability_data[index].stands,
            last_update: availability_data[index].lastUpdate
        };

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(markerData.lat), lng: parseFloat(markerData.lng) },
            map: null,
            title: markerData.locationName,
            markerDict: markerDict,
            animation: google.maps.Animation.DROP,
            icon: {
                url: '../static/img/icons/marker.png',
                scaledSize: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16)
            },
        });

        addInfoWindow(marker, map);

        marker.addListener("click", () => {
            station_info_bar.style.display = 'flex';
        });

        markers.push(marker);
    });
}

function addInfoWindow(marker, map) {
    const infoWindow = new google.maps.InfoWindow();
    const infoWindowContent = `
    <div class="marker-content">
        <strong>${marker.markerDict.location_name}</strong><br>
        Address: ${marker.markerDict.address}<br>
        Bikes Available: ${marker.markerDict.ava_bikes}<br>
        Stands Available: ${marker.markerDict.ava_stands}<br>
        Last Update: ${marker.markerDict.last_update}
    </div>
    `;

    marker.addListener('mouseover', function () {
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', function () {
        infoWindow.close();
    });
}

export { loadDataAndCreateMarkers, addInfoWindow };