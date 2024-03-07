import { dropdownNearest } from "./dropdownNearest.js";

function showNearestMarkers(searchLocation, markers, map) {
    // First, hide all markers
    markers.forEach(marker => marker.setMap(null));

    // Calculate distance for each marker from the search location
    const distances = markers.map(marker => ({
        marker: marker,
        distance: google.maps.geometry.spherical.computeDistanceBetween(searchLocation, marker.getPosition())
    }));

    // Sort markers by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Get the 5 nearest markers
    const nearestMarkers = distances.slice(0, 5).map(item => item.marker);

    // Display the 5 nearest markers
    // nearestMarkers.forEach(nearest => {
    //     nearest.marker.setMap(map);
    // });

    // // Optionally, adjust the map view. For simplicity, center on the nearest marker.
    // You might want to adjust this to better fit all 5 markers.
    // if (nearestMarkers.length > 0) {
    //     map.setCenter(nearestMarkers[0].marker.getPosition());
    //     map.setZoom(14); // You might adjust this zoom level
    // }
    // return nearestMarkers.map(nearest => ({
    //     position: nearest.marker.getPosition(),
    //     title: nearest.marker.getTitle(),
    //     element: nearest.marker // Assuming getTitle() gives you the name or ID
    // }));
    dropdownNearest(nearestMarkers, map, markers)
    return nearestMarkers;

}

export { showNearestMarkers };
