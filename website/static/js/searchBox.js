import { showNearestMarkers } from './nearestMarker.js';

function searchBox(markers, map){
    // Create a search box and link it to the UI element.
    const input = document.getElementById('map-search');
    const searchBox = new google.maps.places.SearchBox(input);
    const search_container = document.getElementById('search-container')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_container);

    const searchBarContainerEl = document.querySelector(".search-bar-container");
    const magnifierEl = document.querySelector(".magnifier");

    magnifierEl.addEventListener("click", () => {
        searchBarContainerEl.classList.toggle("active");
    });

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    let searchMarkers = [];
    let nearestMarkersarr = [];
    // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        const searchLocation = places[0].geometry.location;
        
        // Clear out the old markers.
        searchMarkers.forEach(marker => marker.setMap(null));
        searchMarkers = [];
        
        // Mark the search location on the map
        const searchMarker = new google.maps.Marker({
            position: searchLocation,
            map: map,
            title: places[0].name // Use the name of the place as the marker title
        });
        searchMarkers.push(searchMarker); // Add the new marker to the array

         // Optionally center the map on the search location and adjust zoom
        map.setCenter(searchLocation);
        map.setZoom(17); // Zoom in closer to the search location


        // const nearestMarkersData = showNearestMarkers(searchLocation, markers, map);
        nearestMarkersarr = [];
        nearestMarkersarr = showNearestMarkers(searchLocation, markers, map);
    });

    const checkbox = document.getElementById('toggle-markers');
    const label = document.querySelector('.toggle-label');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked){
            label.textContent = 'Markers on'
        } else {
            label.textContent = 'Markers off'
        }
    });

    // Add a listener to the toggle button
    document.getElementById('toggle-markers').addEventListener('click', function() {
        markers.forEach(marker => {
            if (marker.getMap()) {
                marker.setMap(null);
                if(nearestMarkersarr.length !== 0){
                    nearestMarkersarr.forEach(element => {
                        element.setMap(null);
                    });
                }
            } else {
                marker.setMap(map);
                if(nearestMarkersarr.length !== 0){
                    nearestMarkersarr.forEach(element => {
                        element.setMap(map);
                    });
                }
            }
        });
    });

    // Limit the search box to Dublin area
    const dublinBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(53.298810877564875, -6.387438537597656), // Southwest corner of Dublin
        new google.maps.LatLng(53.41058064672438, -6.114489196777343) // Northeast corner of Dublin
    );
}

export { searchBox };