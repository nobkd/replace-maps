import L from 'leaflet';

import { readPB, readQ, type MapData } from './utils/read';

const tileLayer: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const gPos: string = 'pb';
const gQuery: string = 'q';
const gZoom: string = 'z';
const params: URLSearchParams = new URLSearchParams(document.location.search);

console.log(params);

let mapData: MapData = {};

if (params.has(gPos)) {
    mapData = await readPB(params.get(gPos) as string);
} else if (params.has(gQuery)) {
    let marker = await readQ(params.get(gQuery) as string);

    if (marker) {
        mapData.markers = [marker];
    }
}

if (params.has(gZoom)) {
    mapData.zoom = parseInt(params.get(gZoom) as string);
}

const map: L.Map = L.map('map', {
    scrollWheelZoom: false, // TODO: on pc allow ctrl + scroll
    zoom: mapData.zoom ?? 17,
});

if (mapData.area) {
    map.setView([mapData.area.lat, mapData.area.lon]);
}

if (mapData.markers) {
    mapData.markers.forEach((marker) => {
        let mapMarker = L.marker([marker.lat, marker.lon]).addTo(map);
        if (marker.label) {
            mapMarker.bindPopup(marker.label).openPopup();
        }
    });

    if (mapData.markers.length === 1) {
        let mapMarker = mapData.markers[0];
        map.setView([mapMarker.lat, mapMarker.lon]);
    }
}

L.tileLayer(tileLayer, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
