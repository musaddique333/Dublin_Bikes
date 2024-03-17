import { currentLocation } from './currentLocation.js';
import { searchBox } from './searchBox.js';
import { loadDataAndCreateMarkers } from './dataFetcher.js';

let map, markers = [];
let currentLocationValue = null;
async function initMap() {
    let centerMap = { lat: 53.3470411, lng: -6.2787019 };
    const mapOptions = {
        center: centerMap,
        zoom: 11,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        // zoomControl: false,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#072a47"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "gamma": 0.01
                    },
                    {
                        "lightness": 20
                    },
                    {
                        "weight": "1.39"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "weight": "0.96"
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 30
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "color": "#29446b"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": 20
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 20
                    },
                    {
                        "saturation": -20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 10
                    },
                    {
                        "saturation": -30
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#001526"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": 25
                    },
                    {
                        "lightness": 25
                    },
                    {
                        "weight": "0.01"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": -20
                    }
                ]
            }
        ]
    };

    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("google-map"), mapOptions);

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
    const station_info_bar = document.getElementById('station-info-bar');
    close_info_bar.addEventListener('click', () => {
        station_info_bar.style.display = 'none';
    });
}

function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJgQ81odB2Zh5Esp0Ewbg1PydaUSttZVM&libraries=places,geometry&callback=initMap&loading=async";
    document.head.appendChild(script);
}

let timeoutId;

function firstNearStartion(markers) {
    const lat = document.querySelector('.start-loc .lat');
    const lng = document.querySelector('.start-loc .lng');
    const name = document.querySelector('.name');

    let currentLocation = {
        lat: parseFloat(lat.textContent),
        lng: parseFloat(lng.textContent)
    };

    if (!isNaN(currentLocation.lat) && !isNaN(currentLocation.lng)) {

        if (typeof markers !== 'undefined'){

            const distances = markers.map(marker => ({
                marker: marker,
                distance: google.maps.geometry.spherical.computeDistanceBetween(currentLocation, marker.getPosition())
            }));
        
            distances.sort((a, b) => a.distance - b.distance);
        
            const nearestMarkers = distances.slice(0, 1).map(item => item.marker);
            nearestMarkers.forEach(element => {
                lat.textContent = element.markerDict.lat;
                lng.textContent = element.markerDict.lng;
                name.textContent = element.markerDict.location_name;

            });
        }

        clearTimeout(timeoutId);
    } else {
        timeoutId = setTimeout(() => firstNearStartion(markers), 1000);
    }
}

// Explicitly expose initMap to the global scope
window.initMap = initMap;
loadGoogleMapsAPI();