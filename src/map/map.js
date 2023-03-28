'use strict';

const gPos = 'pb';
const gQuery = 'q';
const params = new URLSearchParams(document.location.search);

if (params.has(gPos)) {
    
} else if (params.has(gQuery)) {
    
} else {

}

console.log(params);

const map = L.map('map').setView([51.505, -0.09], 13);
let marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup('Position').openPopup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
