import { currentLocation } from './currentLocation.js';
import { searchBox } from './searchBox.js';
import { loadDataAndCreateMarkers } from './dataFetcher.js';

let map, markers = [];

function initMap() {
    let centerMap = { lat: 53.3470411, lng: -6.2787019 };
    const mapOptions = { 
        center: centerMap,
        zoom: 11,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        // zoomControl: false,
        styles : [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#202c3e"
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
                        "color": "#193a55"
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
    map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    currentLocation(map)
    // map.setCenter(currentLocation(map));
    // map.setZoom(17);

    searchBox(markers, map);
    loadDataAndCreateMarkers(markers, map);

    const currentLocationbtn = document.getElementById('currentLocation');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(currentLocationbtn);
    currentLocationbtn.addEventListener('click', () => {
        map.setCenter(currentLocation(map));
    });
}

function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJgQ81odB2Zh5Esp0Ewbg1PydaUSttZVM&libraries=places,geometry&callback=initMap";
    document.head.appendChild(script);
}

// Explicitly expose initMap to the global scope
window.initMap = initMap;
loadGoogleMapsAPI();