function initMap() {
    const centerMap = { lat: 53.3470411, lng: -6.2787019 };
    const mapOptions = {
        center: centerMap,
        zoom: 14,
    };
    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

    const station_data = JSON.parse(document.getElementById('stationData').getAttribute('data-station'));
    const availability_data = JSON.parse(document.getElementById('availabilityData').getAttribute('data-availability'));
    
    const infoWindow = new google.maps.InfoWindow()

    station_data.forEach((markerData, index) => {
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(markerData.lat), lng: parseFloat(markerData.lng) },
            map: map,
        });

        const infoWindowContent = `
            <div class="marker-content">
            ${markerData.locationName}<br>
            ${'🚲 '}${availability_data[index].bikes}<br>
            ${'🛑 '} ${availability_data[index].stands}<br>
            ${availability_data[index].lastUpdate}<br>
            ${markerData.address}
            </div>
            `;
            
        marker.addListener('click', function(){
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker)
        });
    });
}
