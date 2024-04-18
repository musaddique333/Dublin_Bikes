let currentMarker = null;
async function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser.');
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
}

async function currentLocation(map) {
    try {
        const position = await getLocation();
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        if (currentMarker) {
            currentMarker.setMap(null);
        }

        currentMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
                url: '../static/img/icons/current.svg',
                scaledSize: new google.maps.Size(40, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16)
            },
        });

        const hoverContent = `<div class="marker-content"><br>You are here</div>`;
        const hoverInfoWindow = new google.maps.InfoWindow({
            content: hoverContent
        });

        google.maps.event.addListener(currentMarker, 'mouseover', function () {
            hoverInfoWindow.open(map, currentMarker);
        });

        google.maps.event.addListener(currentMarker, 'mouseout', function () {
            hoverInfoWindow.close();
        });

        initialSetup(userLocation);
    } catch (error) {
        handleLocationError(true, map.getCenter());
    }
}

async function currentLocationUCD(map) {
    const ucdLocation = {
        lat: 53.3089, // Latitude for UCD
        lng: -6.2237  // Longitude for UCD
    };

    if (currentMarker) {
        currentMarker.setMap(null);
    }

    currentMarker = new google.maps.Marker({
        position: ucdLocation,
        map: map,
        title: "UCD Dublin",
        icon: {
            url: '../static/img/icons/current.svg',
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 20)
        },
    });

    const hoverContent = `<div class="marker-content"><br>UCD Dublin</div>`;
    const hoverInfoWindow = new google.maps.InfoWindow({
        content: hoverContent
    });

    google.maps.event.addListener(currentMarker, 'mouseover', function () {
        hoverInfoWindow.open(map, currentMarker);
    });

    google.maps.event.addListener(currentMarker, 'mouseout', function () {
        hoverInfoWindow.close();
    });

    initialSetup(ucdLocation);
}

function initialSetup(userLocation) {
    const lat = document.querySelector('.start-loc .lat');
    const lng = document.querySelector('.start-loc .lng');

    lat.textContent = userLocation.lat;
    lng.textContent = userLocation.lng;;
}

function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow({ map: map });
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


// export { currentLocation };
export { currentLocationUCD as currentLocation };