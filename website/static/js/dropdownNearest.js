import { addInfoWindow } from "./dataFetcher.js";

function dropdownNearest(nearestMarkersData, map, markers) {
    const searchBarContainerEl = document.querySelector(".search-bar-container");
    const magnifierEl = document.querySelector(".magnifier");

    const searchContainer = document.getElementById('search-container');
    // Check if the dropdown already exists, if not create it
    let dropdown = document.getElementById('search-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.setAttribute('id', 'search-dropdown');
        searchContainer.appendChild(dropdown);
    }

    dropdown.classList.add('active2')

    // Clear the dropdown and set its properties
    dropdown.innerHTML = '';

    dropdown.style.display = 'flex';
    dropdown.style.flexDirection = 'column';
    dropdown.style.gap = '7px';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = 3;
    dropdown.style.top = '15px';
    dropdown.style.left = 0;
    dropdown.style.width = '290px';
    dropdown.style.padding = '10px';
    dropdown.style.backgroundColor = '#6d74a0c1';
    dropdown.style.boxShadow = '-2px 2px 10px rgba(0, 0, 0, 0.5);';
    dropdown.style.borderRadius = '0px 0px 10px 10px';
    dropdown.style.paddingTop = '30px';

    let dropdown_head = document.createElement('div');
    dropdown_head.setAttribute('class', 'dropdown-head');
    dropdown_head.classList.add('option');
    dropdown_head.innerHTML = `<strong>Nearest Stations:</strong>`;
    dropdown.appendChild(dropdown_head);

    let station_info_bar = document.getElementById('station-info-bar');
    station_info_bar.style.display = 'none'

    // Populate the dropdown with nearest stations
    let nearestMarkersarr = [];
    nearestMarkersData.forEach(station => {
        const option = document.createElement('div');
        option.setAttribute('class', 'option');
        option.textContent = station.title;

        const nearMarker = new google.maps.Marker({
            map: null,
            animation: google.maps.Animation.DROP,
            position: station.position,
            zoom: 17,
            markerDict: station.element.markerDict,
        });

        addInfoWindow(nearMarker, map);

        nearestMarkersarr.push(nearMarker);
        nearMarker.addListener("click", () => {
            console.log(station_info_bar.style.display)
            if (station_info_bar.style.display == 'none') {
                station_info_bar.style.display = 'flex';
            } else {
                station_info_bar.style.display = 'none';
            }
        });

        option.onmouseover = function () {
            this.style.backgroundColor = '#f0f0f0';
        };
        option.onmouseout = function () {
            this.style.backgroundColor = '#22a8eb';
        };
        option.onclick = function () {
            station.element.setMap(null);

            station.element.animation = google.maps.Animation.DROP;
            station.element.zoom = 17;
            map.setCenter(station.position);

            station.element.setMap(map);
        };
        dropdown.appendChild(option);
    });

    let dropdown_close = document.createElement('div');
    dropdown_close.classList.add('option');
    dropdown_close.innerHTML = `⏏︎`;
    dropdown.appendChild(dropdown_close);

    dropdown_close.addEventListener('click', () => {
        dropdown.innerHTML = '';
        dropdown.style.padding = 0;
        searchBarContainerEl.classList.toggle("active");
    });
    magnifierEl.addEventListener("click", () => {
        dropdown.innerHTML = '';
        dropdown.style.padding = 0;
    });

    return nearestMarkersarr;
}

export { dropdownNearest };