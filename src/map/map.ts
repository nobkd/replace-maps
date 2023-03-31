import L from 'leaflet';

import { readPB, readQ, type MapData } from './utils/read';
import { type TileType } from './utils/parsePB';

type Tiles = {
    [K in TileType]: {
        layer: string;
        attr: string;
    };
};

// https://leaflet-extras.github.io/leaflet-providers/preview/
const tileProviders: Tiles = {
    roadmap: {
        layer: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap.Mapnik
        attr: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
        layer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // Esri.WorldImagery
        attr: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
};

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
    mapData.zoom = Number(params.get(gZoom) as string);
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

L.tileLayer(tileProviders[mapData.tile ?? 'roadmap'].layer, {
    maxZoom: 19,
    //attribution: tileProviders[mapData.tile ?? 'roadmap'].attr,
}).addTo(map);
