function currentLocation (map, markers){
    // Current Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            
            // Create a marker for the user's location
            const userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Your Location",
                animation: google.maps.Animation.DROP,
                // icon :
            });

            const hoverContent = `<div class="marker-content"><br>You are here</div>`;
            const hoverInfoWindow = new google.maps.InfoWindow({
                content: hoverContent
            });

            // Open InfoWindow on mouseover
            google.maps.event.addListener(userMarker, 'mouseover', function() {
                hoverInfoWindow.open(map, userMarker);
            });

            // Close InfoWindow on mouseout
            google.maps.event.addListener(userMarker, 'mouseout', function() {
                hoverInfoWindow.close();
            });

            // Optionally, center the map on the user's location
            map.setCenter(userLocation);
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

export { currentLocation };