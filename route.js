let start, end;

function getDirections(map, markers, currentMarker) {
    const dropdown_start = document.querySelector('.start-drop');
    const dropdown_end = document.querySelector('.end-drop');
    const startInput = document.querySelector('.source');
    const endInput = document.querySelector('.destination');

    start = currentMarker.getPosition();
    startInput.textContent = currentMarker.markerDict.location_name;

    startInput.addEventListener('click', function () {
        dropdown_start.style.display = "flex";
    });

    const dir_top = document.createElement('div');
    dir_top.classList.add('dir-options');
    dropdown_start.appendChild(dir_top);

    Object.keys(markers).forEach(key => {
        const marker = markers[key];
        const name = document.createElement("div");
        name.classList.add("dir-options");
        name.innerHTML = marker.markerDict.location_name;
        dropdown_start.appendChild(name);

        name.addEventListener('click', function () {
            startInput.textContent = this.textContent;
            dropdown_start.style.display = "none";
            start = markers[key].getPosition();
        });
    });

    endInput.addEventListener('click', function () {
        dropdown_end.style.display = "flex";
    });

    const dir_bottom = document.createElement('div');
    dir_bottom.classList.add('dir-options');
    dropdown_end.appendChild(dir_bottom);
    Object.keys(markers).forEach(key => {
        const marker = markers[key];
        const name = document.createElement("div");
        name.classList.add("dir-options");
        name.innerHTML = marker.markerDict.location_name;
        dropdown_end.appendChild(name);

        name.addEventListener('click', function () {
            endInput.textContent = this.textContent;
            dropdown_end.style.display = "none";
            end = markers[key].getPosition();
        });
    });

    const get_directions = document.querySelector(".serch-route");
    get_directions.addEventListener('click', function () {
        if (endInput.textContent !== 'Destination...') {
            GetRoute(map, start.lat(), start.lng(), end.lat(), end.lng());
        }
        else {
            showAlert();
        }
    });
}


function GetRoute(map, lat, lng, destLat, destLng) {
    directionsRenderer.setDirections({ routes: [] });

    var start = new google.maps.LatLng(lat, lng);
    var end = new google.maps.LatLng(destLat, destLng);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.BICYCLING
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}

export { getDirections };