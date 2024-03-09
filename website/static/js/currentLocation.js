let currentMarker = null; // Add this line outside of your function to keep track of the current marker

function currentLocation(map) {
    // Check for Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // If a marker already exists, remove it
            if (currentMarker) {
                currentMarker.setMap(null);
            }

            // Create a new marker for the user's location
            currentMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Your Location",
                animation: google.maps.Animation.DROP,
                icon: {
                    url: '../static/img/icons/current.svg', // URL to the SVG or image file
                    scaledSize: new google.maps.Size(40, 40), // The size you want the icon to be
                    origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0)
                    anchor: new google.maps.Point(16, 16) // The anchor for this image is the base at (16, 16)
                },
            });

            // Center the map on the user's location
            map.setCenter(userLocation);

            const hoverContent = `<div class="marker-content"><br>You are here</div>`;
            const hoverInfoWindow = new google.maps.InfoWindow({
                content: hoverContent
            });

            // Open InfoWindow on mouseover
            google.maps.event.addListener(currentMarker, 'mouseover', function() {
                hoverInfoWindow.open(map, currentMarker);
            });

            // Close InfoWindow on mouseout
            google.maps.event.addListener(currentMarker, 'mouseout', function() {
                hoverInfoWindow.close();
            });
            return userLocation;
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Handle the case where the browser doesn't support Geolocation
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