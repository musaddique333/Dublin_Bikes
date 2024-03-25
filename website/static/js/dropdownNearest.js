import  { getNearestInfo } from "./statistics.js";

function dropdownNearest(nearestMarkers, map, markers) {
    const searchBarContainerEl = document.querySelector(".search-bar-container");

    const searchContainer = document.getElementById('search-container');
    // Check if the dropdown already exists, if not create it
    let dropdown = document.getElementById('search-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.setAttribute('id', 'search-dropdown');
        searchContainer.appendChild(dropdown);
    }

    // Clear the dropdown and set its properties
    dropdown.innerHTML = '';

    styleDropdown(dropdown);

    let dropdown_head = document.createElement('div');
    dropdown_head.setAttribute('class', 'dropdown-head');
    dropdown_head.classList.add('option');
    dropdown_head.innerHTML = `<strong>Nearest Stations:</strong>`;
    dropdown.appendChild(dropdown_head);

    let station_info_bar = document.getElementById('station-info-bar');
    station_info_bar.style.display = 'none'

    // Populate the dropdown with nearest stations
    nearestMarkers.forEach(station => {
        const option = document.createElement('div');
        option.setAttribute('class', 'option');

        let inner_part = `<strong>${station.markerDict.location_name}</strong>`;
        optionContent(option, 'option-name', inner_part);

        var status = station.markerDict.status.toUpperCase() == 'OPEN' ? 'open' : 'close';
        inner_part = `<img src="../static/img/icons/${status}.svg" style="width:30px;">`;
        optionContent(option, 'option-status', inner_part);

        var ava_bikes = station.markerDict.ava_bikes;
        inner_part = `<img src="../static/img/icons/bike.svg" style="width:20px;"> <sub>${ava_bikes}</sub>`;
        optionContent(option, 'option-bikes', inner_part);

        var ava_stands = station.markerDict.ava_stands;
        inner_part = `<img src="../static/img/icons/stand.svg" style="width:20px";> <sub>${ava_stands}</sub>`;
        optionContent(option, 'option-stands', inner_part);

        var banking = parseInt(station.markerDict.banking) === 1 ? 'Yes' : 'No';
        inner_part = `<img src="../static/img/icons/banking.svg" style="width:20px";> <sub>${banking}</sub>`;
        optionContent(option, 'option-banking', inner_part);

        station.setMap(map);

        option.onmouseover = function () {
            this.style.backgroundColor = '#f0f0f0';
        };
        option.onmouseout = function () {
            this.style.backgroundColor = 'var(--options)';
        };
        option.onclick = function () {
            getNearestInfo(station);
            station.setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(station.position);
            nearestMarkers.forEach(marker => {
                if (marker !== station){
                    marker.setAnimation(null)
                }
            });
        };
        dropdown.appendChild(option);
    });

    let dropdown_close = document.createElement('div');
    dropdown_close.classList.add('option');
    dropdown_close.innerHTML = `⏏︎`;
    dropdown.appendChild(dropdown_close);

    dropdown_close.addEventListener('click', () => {
        dropdown.style.display = 'none';
        searchBarContainerEl.classList.toggle("active");
    });
}

function styleDropdown(dropdown){
    dropdown.style.display = 'flex';
    dropdown.style.flexDirection = 'column';
    dropdown.style.gap = '7px';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = 3;
    dropdown.style.top = '15px';
    dropdown.style.left = 0;
    dropdown.style.width = '290px';
    dropdown.style.padding = '10px';
    dropdown.style.backgroundColor = 'var(--optionsWrapper)';
    dropdown.style.boxShadow = '-2px 2px 10px rgba(0, 0, 0, 0.5);';
    dropdown.style.borderRadius = '0px 0px 10px 10px';
    dropdown.style.paddingTop = '30px';
}

function optionContent(option, class_name, inner_part){
    const option_sub = document.createElement('div');
    option_sub.setAttribute('class', class_name);
    option_sub.innerHTML = `${inner_part}`;
    option.appendChild(option_sub);
}

export { dropdownNearest };