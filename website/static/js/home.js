function initMap() {
    const centerMap = { lat: 53.3470411, lng: -6.2787019 };
    const mapOptions = { 
        center: centerMap,
        zoom: 14,
        disableDefaultUI: true
        // styles:[
        //     {
        //         "featureType": "all",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "administrative",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "administrative",
        //         "elementType": "labels.text.fill",
        //         "stylers": [
        //             {
        //                 "color": "#444444"
        //             },
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "administrative.neighborhood",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "landscape",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "visibility": "on"
        //             },
        //             {
        //                 "color": "#e0dfe0"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "landscape",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "poi",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "poi",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "poi.park",
        //         "elementType": "geometry",
        //         "stylers": [
        //             {
        //                 "color": "#a8a9a8"
        //             },
        //             {
        //                 "visibility": "on"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "saturation": -100
        //             },
        //             {
        //                 "lightness": 45
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road",
        //         "elementType": "geometry.fill",
        //         "stylers": [
        //             {
        //                 "visibility": "on"
        //             },
        //             {
        //                 "color": "#5b5b5a"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road.highway",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "visibility": "simplified"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road.highway",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "road.arterial",
        //         "elementType": "labels.icon",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "transit",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "transit",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "water",
        //         "elementType": "all",
        //         "stylers": [
        //             {
        //                 "color": "#ffffff"
        //             },
        //             {
        //                 "visibility": "on"
        //             }
        //         ]
        //     },
        //     {
        //         "featureType": "water",
        //         "elementType": "labels",
        //         "stylers": [
        //             {
        //                 "visibility": "off"
        //             }
        //         ]
        //     }
        // ]
    };
    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

    const station_data = JSON.parse(document.getElementById('stationData').getAttribute('data-station'));
    const availability_data = JSON.parse(document.getElementById('availabilityData').getAttribute('data-availability'));
    const weather_data = JSON.parse(document.getElementById('weatherData').getAttribute('data-weather'));
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
            ${' '} ${availability_data[index].stands}<br>
            ${availability_data[index].lastUpdate}<br>
            ${markerData.address}<br>
            ${weather_data.temp_c} 'C
            </div>
            `;
            
        marker.addListener('click', function(){
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker)
        });
    });
}
