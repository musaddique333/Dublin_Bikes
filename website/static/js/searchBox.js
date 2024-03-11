import { showNearestMarkers } from './nearestMarker.js';

let searchLocation = { lat: 53.3470411, lng: -6.2787019 };
function searchBox(markers, map) {
    const checkbox = document.getElementById('toggle-markers');
    const label = document.querySelector('.toggle-label');

    const input = document.getElementById('map-search');
    const searchBox = new google.maps.places.SearchBox(input);
    const search_container = document.getElementById('search-container')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_container);

    const searchBarContainerEl = document.querySelector(".search-bar-container");
    const magnifierEl = document.querySelector(".magnifier");

    magnifierEl.addEventListener("click", () => {
        searchBarContainerEl.classList.toggle("active");
        if (searchBarContainerEl.classList.contains('active')) {
            const dropdown = document.getElementById('search-dropdown')
            if (dropdown != null) {
                dropdown.style.display = 'none';
            }
        }
        else {
            const dropdown = document.getElementById('search-dropdown')
            if (dropdown != null) {
                setTimeout(() => {
                    dropdown.style.display = 'flex';
                }, 900);
            }
        }
    });

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    let searchMarkers = [];
    let nearestMarkersarr = [];

    searchBox.addListener('places_changed', function () {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        searchLocation = places[0].geometry.location;

        // Clear out the old markers.
        searchMarkers.forEach(marker => marker.setMap(null));
        searchMarkers = [];
        nearestMarkersarr.forEach(marker => marker.setMap(null));
        nearestMarkersarr = [];
        checkbox.checked = false;

        // Mark the search location on the map
        const searchMarker = new google.maps.Marker({
            position: searchLocation,
            map: map,
            title: places[0].name, // Use the name of the place as the marker title
            animation: google.maps.Animation.DROP,
            icon: {
                url: '../static/img/icons/search.svg', // URL to the SVG or image file
                scaledSize: new google.maps.Size(40, 40), // The size you want the icon to be
                origin: new google.maps.Point(0, 0), // The origin for this image is (0, 0)
                anchor: new google.maps.Point(16, 16) // The anchor for this image is the base at (16, 16)
            },
        });
        searchMarkers.push(searchMarker); // Add the new marker to the array

        // Optionally center the map on the search location and adjust zoom
        map.setCenter(searchLocation);
        map.setZoom(15); // Zoom in closer to the search location


        // const nearestMarkersData = showNearestMarkers(searchLocation, markers, map);
        nearestMarkersarr = showNearestMarkers(searchLocation, markers, map);
    });

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            label.style.color = '#ff0000';
        } else {
            label.style.color = '#fff';
        }
    });

    // Add a listener to the toggle button
    checkbox.addEventListener('click', function () {
        markers.forEach(marker => {
            if (marker.getMap()) {
                marker.setMap(null);
                if (searchLocation.lat === 53.3470411 && searchLocation.lng === -6.2787019) {
                    console.log('true')
                    map.setZoom(11);
                }
                else {
                    map.setZoom(16);
                }
                if (nearestMarkersarr.length !== 0) {
                    nearestMarkersarr.forEach(element => {
                        element.setAnimation(google.maps.Animation.DROP)
                        element.setMap(map);
                    });
                }
            } else {
                map.setCenter(searchLocation);
                map.setZoom(14);
                marker.setMap(map);
                marker.setAnimation(google.maps.Animation.DROP)
                if (nearestMarkersarr.length !== 0) {
                    nearestMarkersarr.forEach(element => {
                        element.setAnimation(google.maps.Animation.DROP)
                        element.setMap(map);
                    });
                }
            }
        });
    });


    const dublinBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(53.298810877564875, -6.387438537597656),
        new google.maps.LatLng(53.41058064672438, -6.114489196777343)
    );
}

export { searchBox };