let map, markers = [];
let currentLocationValue = null;
async function initMap() {
    let centerMap = { lat: 53.3470411, lng: -6.2787019 };
    const mapOptions = {
        center: centerMap,
        zoom: 11,
        disableDefaultUI: true,
        mapTypeControl: false,
        streetViewControl: false,
        // zoomControl: false,
        styles: [
            {
                "stylers": [
                    {
                        "hue": "#dd0d0d"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            }
        ]
        
        
    };

    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("google-map"), mapOptions);
    directionsService = new google.maps.DirectionsService();
    var polylineOptions = {
        strokeColor: 'rgb(50, 100, 200)',
        strokeOpacity: 0.8,
        strokeWeight: 6
    };
    directionsRenderer = new google.maps.DirectionsRenderer({ map, polylineOptions, panel: document.getElementById("directions") });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        document.getElementById('search-container').style.display = 'flex';
        document.getElementById('currentLocation').style.display = 'flex';

        const currentLocationbtn = document.getElementById('currentLocation');
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(currentLocationbtn);

        currentLocationbtn.addEventListener('click', () => {
            const lat = document.querySelector('.start-loc .lat');
            const lng = document.querySelector('.start-loc .lng');

            currentLocationValue = {
                lat: parseFloat(lat.textContent),
                lng: parseFloat(lng.textContent)
            };

            if (!isNaN(currentLocationValue.lat) && !isNaN(currentLocationValue.lng)) {
                map.setCenter(currentLocationValue);
                map.setZoom(16);
            }
        });

        const loader = document.querySelector(".loader");
        if (loader) {
            loader.classList.add("loader--hidden");
            document.body.removeChild(loader);
        }
    });

    loadDataAndCreateMarkers(markers, map);
    searchBox(markers, map);
    currentLocation(map);
    firstNearStartion(markers);

    setInterval(async () => { await currentLocation(map, markers); }, 10000);

    const close_info_bar = document.getElementById('close-info-bar');
    const weather = document.querySelector('.info-container');
    const station_info_bar = document.querySelector('aside');
    close_info_bar.addEventListener('click', () => {
        station_info_bar.style.display = 'none';
        weather.style.display = 'flex';
    });
}
