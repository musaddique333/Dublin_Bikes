import { dropdownNearest } from "./dropdownNearest.js";
import { getNearestInfo } from './predictionsFromHour.js';

function showNearestMarkers(searchLocation, markers, map) {
    markers.forEach(marker => marker.setMap(null));
    const distances = markers.map(marker => ({
        marker: marker,
        distance: google.maps.geometry.spherical.computeDistanceBetween(searchLocation, marker.getPosition())
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const nearestMarkers = distances.slice(0, 5).map(item => item.marker);
    getNearestInfo(nearestMarkers[0], markers);
    nearestMarkers[0].setAnimation(google.maps.Animation.BOUNCE);
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
    dropdownNearest(nearestMarkers, map, markers);
    return nearestMarkers;

}

export { showNearestMarkers };