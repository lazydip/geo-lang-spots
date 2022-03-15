'use strict';
let currentPos;
let coords;
let map;
let businessAdress = [];
let formAmount = 1;
let markers = {};

const showOnMap = function (formID) {
  const businessID = formID.replace(/\D/g, '');

  markers[businessID].openPopup();
};

const openGm = function (formID) {
  const businessID = formID.replace(/\D/g, '');
  const businessLocation = document.getElementById(
    'businessAdress' + businessID
  );

  console.log(businessLocation.textContent);

  console.log(businessAdress);

  window.open(
    `https://www.google.com/maps/place/${businessLocation.textContent}/@${businessAdress[businessID][0]}, ${businessAdress[businessID][1]}`
  );
};

const apiKey =
  'AAPK8010778b0f5f4125aaab7a3400c5fdabUVgNVHKxZ2mKDOhlZS881By7lT4g8u5N3VM-PmayJSt4lJ4RyxDA2WdBFPorPcod';
const basemapEnum = 'ArcGIS:Navigation';

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    coords = [latitude, longitude];
    map = L.map('map', {
      minZoom: 2,
    }).setView(coords, 14);

    console.log(coords);

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
        results.addLayer(L.marker(data.results[i].latlng));

        currentPos = [data.results[i].latlng.lat, data.results[i].latlng.lng];
        console.log(currentPos);
      }
    });
  });
}

const form = document.querySelector('.form');
const containerBusinesses = document.querySelector('.businesses');
const inputName = document.querySelector('.form__input--name');
const inputType = document.querySelector('.form__input--type');

const inputLocation = document.querySelector('.form__input--location');
const btnMap = document.querySelector('.form_btn--map');
const btnOpenGM = document.querySelector('.form_btn--opengm');
const btnAdd = document.getElementById('btnAdd');

const businessesList = document.getElementById('businessesList');
const formRowBtnAdd = document.getElementById('formRowBtnAdd');
const btnSave = document.querySelector('.form_btn--save');

const newFormData = function (formID) {
  const form = document.getElementById('form' + formID);
  const inputName = document.getElementById('inputName' + formID);

  const inputType = document.getElementById('inputType' + formID);
  const inputLanguage = document.getElementById('inputLanguage' + formID);
  const inputLocation = document.getElementById('inputLocation' + formID);

  if (
    inputName.value != '' &&
    inputType.value != '' &&
    inputLanguage.options[inputLanguage.selectedIndex].text !=
      'Select language' &&
    inputLocation.value != ''
  ) {
    const newBusiness = `
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
    <h3 id = "${'businessAdress' + formID}" class="business_location">${
      inputLocation.value
    }
    <button id="${
      'showOnMap' + formID
    }" type="button" class="form_btn business_btn--map" onclick="showOnMap(this.id)">
      <span class="business_btn--map_icon">
        <ion-icon name="map-outline" role="img" class="md hydrated" aria-label="map outline"></ion-icon>
      </span>
    </button>
    </h3>
  </div>
  <div class="business_details">
    <button id="${
      'openGm' + formID
    }" type="button" class="form__btn business_btn--opengm" onclick="openGm(this.id)">
    Open Google maps
    </button>
  </div>
</li>
`;

    form.insertAdjacentHTML('afterend', newBusiness);

    form.remove();

    businessAdress[formID] = currentPos;

    console.log(businessAdress[formID]);

    markers[formID] = L.marker(currentPos)
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
  } else {
    alert(
      '!!WARNING!! INVALID INPUT! You must fill in all parametres to save them!'
    );
  }
};

btnAdd.onclick = function () {
  formAmount++;

  const newForm = `
<form class="form_hidden" id = "${'form' + formAmount}">
          <div class="form__row">
            <label class="form__label">Business name:</label>
            <input id = "${
              'inputName' + formAmount
            }" class="form__input form__input--name" />
          </div>
          <div class="form__row">
            <label class="form__label">Business type:</label>
            <input id = "${
              'inputType' + formAmount
            }" class="form__input form__input--type" />
          </div>
          <div class="form__row">
            <label class="form__label">Business language:</label>
            <select class="form__input form__input--language" id = "${
              'inputLanguage' + formAmount
            }">
              <option value="" disabled selected>Select language</option>
              <option value="af">Afrikaans</option>
              <option value="sq">Albanian</option>
              <option value="am">Amharic</option>
              <option value="ar">Arabic</option>
              <option value="an">Aragonese</option>
              <option value="hy">Armenian</option>
              <option value="ast">Asturian</option>
              <option value="az">Azerbaijani</option>
              <option value="eu">Basque</option>
              <option value="be">Belarusian</option>
              <option value="bn">Bengali</option>
              <option value="bs">Bosnian</option>
              <option value="br">Breton</option>
              <option value="bg">Bulgarian</option>
              <option value="ca">Catalan</option>
              <option value="ckb">Central Kurdish</option>
              <option value="zh">Chinese</option>
              <option value="zh-HK">Chinese (Hong Kong)</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="zh-TW">Chinese (Traditional)</option>
              <option value="co">Corsican</option>
              <option value="hr">Croatian</option>
              <option value="cs">Czech</option>
              <option value="da">Danish</option>
              <option value="nl">Dutch</option>
              <option value="en">English</option>
              <option value="en-AU">English (Australia)</option>
              <option value="en-CA">English (Canada)</option>
              <option value="en-IN">English (India)</option>
              <option value="en-NZ">English (New Zealand)</option>
              <option value="en-ZA">English (South Africa)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="en-US">English (United States)</option>
              <option value="eo">Esperanto</option>
              <option value="et">Estonian</option>
              <option value="fo">Faroese</option>
              <option value="fil">Filipino</option>
              <option value="fi">Finnish</option>
              <option value="fr">French</option>
              <option value="fr-CA">French (Canada)</option>
              <option value="fr-FR">French (France)</option>
              <option value="fr-CH">French (Switzerland)</option>
              <option value="gl">Galician</option>
              <option value="ka">Georgian</option>
              <option value="de">German</option>
              <option value="de-AT">German (Austria)</option>
              <option value="de-DE">German (Germany)</option>
              <option value="de-LI">German (Liechtenstein)</option>
              <option value="de-CH">German (Switzerland)</option>
              <option value="el">Greek - Ελληνικά</option>
              <option value="gn">Guarani</option>
              <option value="gu">Gujarati</option>
              <option value="ha">Hausa</option>
              <option value="haw">Hawaiian</option>
              <option value="he">Hebrew</option>
              <option value="hi">Hindi</option>
              <option value="hu">Hungarian</option>
              <option value="is">Icelandic</option>
              <option value="id">Indonesian</option>
              <option value="ia">Interlingua</option>
              <option value="ga">Irish</option>
              <option value="it">Italian</option>
              <option value="it-IT">Italian (Italy)</option>
              <option value="it-CH">Italian (Switzerland)</option>
              <option value="ja">Japanese</option>
              <option value="kn">Kannada</option>
              <option value="kk">Kazakh</option>
              <option value="km">Khmer</option>
              <option value="ko">Korean</option>
              <option value="ku">Kurdish</option>
              <option value="ky">Kyrgyz</option>
              <option value="lo">Lao</option>
              <option value="la">Latin</option>
              <option value="lv">Latvian</option>
              <option value="ln">Lingala</option>
              <option value="lt">Lithuanian</option>
              <option value="mk">Macedonian</option>
              <option value="ms">Malay</option>
              <option value="ml">Malayalam</option>
              <option value="mt">Maltese</option>
              <option value="mr">Marathi</option>
              <option value="mn">Mongolian</option>
              <option value="ne">Nepali</option>
              <option value="no">Norwegian</option>
              <option value="nb">Norwegian Bokmål</option>
              <option value="nn">Norwegian Nynorsk</option>
              <option value="oc">Occitan</option>
              <option value="or">Oriya</option>
              <option value="om">Oromo</option>
              <option value="ps">Pashto</option>
              <option value="fa">Persian</option>
              <option value="pl">Polish</option>
              <option value="pt">Portuguese</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
              <option value="pt-PT">Portuguese (Portugal)</option>
              <option value="pa">Punjabi</option>
              <option value="qu">Quechua</option>
              <option value="ro">Romanian</option>
              <option value="mo">Romanian (Moldova)</option>
              <option value="rm">Romansh</option>
              <option value="ru">Russian</option>
              <option value="gd">Scottish Gaelic</option>
              <option value="sr">Serbian</option>
              <option value="sh">Serbo-Croatian</option>
              <option value="sn">Shona</option>
              <option value="sd">Sindhi</option>
              <option value="si">Sinhala</option>
              <option value="sk">Slovak</option>
              <option value="sl">Slovenian</option>
              <option value="so">Somali</option>
              <option value="st">Southern Sotho</option>
              <option value="es">Spanish</option>
              <option value="es-AR">Spanish (Argentina)</option>
              <option value="es-419">Spanish (Latin America)</option>
              <option value="es-MX">Spanish (Mexico)</option>
              <option value="es-ES">Spanish (Spain)</option>
              <option value="es-US">Spanish (United States)</option>
              <option value="su">Sundanese</option>
              <option value="sw">Swahili</option>
              <option value="sv">Swedish</option>
              <option value="tg">Tajik</option>
              <option value="ta">Tamil</option>
              <option value="tt">Tatar</option>
              <option value="te">Telugu</option>
              <option value="th">Thai</option>
              <option value="ti">Tigrinya</option>
              <option value="to">Tongan</option>
              <option value="tr">Turkish</option>
              <option value="tk">Turkmen</option>
              <option value="tw">Twi</option>
              <option value="uk">Ukrainian</option>
              <option value="ur">Urdu</option>
              <option value="ug">Uyghur</option>
              <option value="uz">Uzbek</option>
              <option value="vi">Vietnamese</option>
              <option value="wa">Walloon</option>
              <option value="cy">Welsh</option>
              <option value="fy">Western Frisian</option>
              <option value="xh">Xhosa</option>
              <option value="yi">Yiddish</option>
              <option value="yo">Yoruba</option>
              <option value="zu">Zulu</option>
            </select>
          </div>
          <div class="form__row">
            <label class="form__label">Business location:</label>
            <input id = "${
              'inputLocation' + formAmount
            }" class="form__input form__input--location" />
            <button type="button" class="form_btn form_btn--map" >
              <span class="form_btn--map_icon">
                <ion-icon name="map-outline"></ion-icon>
              </span>
            </button>
          </div>
          <div class="form__row">
            <button type="button" class="form__btn form_btn--opengm">
              Open Google maps
            </button>
          </div>
          <div class="form__row">
            <button id = "${formAmount}" type="button" class="form__btn form_btn--save" onclick="newFormData(this.id)">Save</button>
          </div>
        </form>
`;

  formRowBtnAdd.insertAdjacentHTML('beforebegin', newForm);
};
