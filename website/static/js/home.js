import { currentLocation } from './currentLocation.js';
import { searchBox } from './searchBox.js';
import { loadDataAndCreateMarkers } from './dataFetcher.js';
import { getNearestInfo } from './predictionsFromHour.js';

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
        styles: 

        [
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
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
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
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

function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${maps_api}&libraries=places,geometry&callback=initMap&loading=async`;
    document.head.appendChild(script);
}

let timeoutId;

function firstNearStartion(markers) {
    const lat = document.querySelector('.start-loc .lat');
    const lng = document.querySelector('.start-loc .lng');

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
        
            const nearestMarkers = distances.slice(0, 5).map(item => item.marker);
            nearestMarkers[0].setAnimation(google.maps.Animation.BOUNCE);
            // map.setCenter(nearestMarkers[0]);
            map.setZoom(14);
            nearestMarkers.forEach(marker => {
                marker.setMap(map);
            });
            getNearestInfo(nearestMarkers[0], markers);
        }

        clearTimeout(timeoutId);
    } else {
        timeoutId = setTimeout(() => firstNearStartion(markers), 1000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.initMap = initMap;
    loadGoogleMapsAPI();
});