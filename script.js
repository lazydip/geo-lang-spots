'use strict';

const form = document.querySelector('.form');
const busissnesesList = document.querySelector('businesses');
const inputName = document.querySelector('.form__input--name');
const inputType = document.querySelector('.form__input--type');
const inputLanguage = document.querySelector('.form__input--language');
const inputLocation = document.querySelector('.form__input--location');
const btnSave = document.querySelector('.form_btn--save');
const btnAdd = document.querySelector('.form_btn--add');

let busisnesses = [];
let locationCoords;
let map;

function getPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadMap.bind(this), function () {
      alert('Could not get your position');
    });
  }
}

function loadMap(position) {
  const apiKey =
    'AAPK8010778b0f5f4125aaab7a3400c5fdabUVgNVHKxZ2mKDOhlZS881By7lT4g8u5N3VM-PmayJSt4lJ4RyxDA2WdBFPorPcod';
  const basemapEnum = 'ArcGIS:Navigation';
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const coords = [latitude, longitude];

  map = L.map('map', {
    minZoom: 2,
  }).setView(coords, 14);

  L.esri.Vector.vectorBasemapLayer(basemapEnum, {
    apiKey: apiKey,
  }).addTo(map);

  const searchControl = L.esri.Geocoding.geosearch({
    position: 'topleft',
    placeholder: 'Enter an address or place',
    useMapBounds: false,
    providers: [
      L.esri.Geocoding.arcgisOnlineProvider({
        apikey: apiKey,
        nearby: {
          lat: coords[0],
          lng: coords[1],
        },
      }),
    ],
  }).addTo(map);

  var results = L.layerGroup().addTo(map);

  searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      const marker = L.marker(data.results[i].latlng).bindPopup(
        data.results[i].properties.LongLabel
      );
      results.addLayer(marker);
      marker.openPopup();

      const shortAdress = data.results[i].properties.LongLabel.split(',');

      locationCoords = data.results[i].latlng;
      inputLocation.value = shortAdress[0];
    }
  });
}

btnAdd.addEventListener('click', addNewForm);
btnSave.addEventListener('click', renderBusiness);

let formSaved = false;

function renderBusiness() {
  if (
    locationCoords != null &&
    inputName.value != '' &&
    inputType.value != '' &&
    inputLanguage.options[inputLanguage.selectedIndex].text !=
      'Select language' &&
    inputLocation.value != ''
  ) {
    renderBusinessOnList();
    saveBusiness();
    renderBusinessMarker();
    claerInputs();
    hideForm();

    formSaved = true;
  } else {
    alert(
      '!!WARNING!! INVALID INPUT! You must fill in all parametres to save them!'
    );
  }
}

function saveBusiness() {
  const business = {
    coords: locationCoords,
    name: inputName.value,
    type: inputType.value,
    language: inputLanguage.options[inputLanguage.selectedIndex].text,
    location: inputLocation.value,
  };

  busisnesses.push(business);
}

function renderBusinessOnList() {
  const addBusiness = `
      <li class="business" >
      <h2 class="business_name">${inputName.value}</h2>
      <div class="business_details">
        <h3 class="business_type">${inputType.value}</h3>
      </div>
      <div class="business_details">
        <h3 class="business_language">${
          inputLanguage.options[inputLanguage.selectedIndex].text
        }</h3>
      </div>
      <div class="business_details">
        <h3 id = "${'businessAdress'}" class="business_location">${
    inputLocation.value
  }
        <button type="button" id="${
          'btnShowOnMap' + busisnesses.length
        }" class="form_btn business_btn--map" onclick="showOnMap(this.id)">
          <span class="business_btn--map_icon">
            <ion-icon name="map-outline" role="img" class="md hydrated" aria-label="map outline"></ion-icon>
          </span>
        </button>
        </h3>
      </div>
      <div class="business_details">
        <button id="${
          'openGm' + busisnesses.length
        }" type="button" class="form__btn business_btn--opengm" onclick="openGm(this.id)">
        Open Google maps
        </button>
      </div>
    </li>
    `;

  form.insertAdjacentHTML('beforebegin', addBusiness);
}

function addNewForm() {
  if (formSaved == true) {
    showForm();
    formSaved = false;
  } else {
    if (
      locationCoords != null &&
      inputName.value != '' &&
      inputType.value != '' &&
      inputLanguage.options[inputLanguage.selectedIndex].text !=
        'Select language' &&
      inputLocation.value != ''
    ) {
      renderBusinessOnList();
      saveBusiness();
      renderBusinessMarker();
      claerInputs();
    } else {
      alert(
        '!!WARNING!! INVALID INPUT! You must finish previous form before adding a new one!'
      );
    }
  }
}

function claerInputs() {
  inputName.value = '';
  inputType.value = '';
  inputLanguage.selectedIndex = 0;
  inputLocation.value = '';
  locationCoords = null;
}

function hideForm() {
  form.classList.add('hidden');
}

function showForm() {
  form.classList.remove('hidden');
}

function renderBusinessMarker() {
  const marker = L.marker(locationCoords)
    .addTo(map)
    .bindPopup(
      L.popup({
        autoClose: false,
        closeOnClick: false,
        className: `business-popup`,
      })
    )
    .setPopupContent(
      `Name: ${inputName.value}<br/>Type: ${inputType.value}<br/>Language: ${
        inputLanguage.options[inputLanguage.selectedIndex].text
      }<br/>Adress: ${inputLocation.value}`
    )
    .openPopup();
}

function showOnMap(btnID) {
  const id = btnID.replace(/\D/g, '');

  map.flyTo(busisnesses[id].coords, 18);
}

function openGm(btnID) {
  const id = btnID.replace(/\D/g, '');

  window.open(
    `https://www.google.com/maps/place/${busisnesses[id].location}/@${busisnesses[id].coords.lat}, ${busisnesses[id].coords.lng}`
  );
}

getPosition();
