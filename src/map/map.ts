import L from 'leaflet';
import { parsePB } from './parsepb';

const tileLayer: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const nominatimQ: string = 'https://nominatim.openstreetmap.org/search/?limit=1&format=json&q=';
const cidMatch: RegExp = /^0x[\da-f]+:0x[\da-f]+$/i;
const dmsMatch: RegExp = /^\d{1,2}°\d{1,2}'\d{1,2}\.\d"(N|S) \d{1,2}°\d{1,2}'\d{1,2}\.\d"(E|W)$/i;

const gPos: string = 'pb';
const gQuery: string = 'q';
const gZoom: string = 'z';
const params: URLSearchParams = new URLSearchParams(document.location.search);

console.log(params);

const mapArea: { lat: number; lng: number; zoom: number } = {
    lat: 0,
    lng: 0,
    zoom: 17, // as default, because leaflet and gmaps work somehow differently // TODO: get real num from gmaps
};

let markers: { latlon: number[]; label?: string }[] = [];

if (params.has(gPos)) {
    await readPB(params.get(gPos) as string);
} else if (params.has(gQuery)) {
    await readQ(params.get(gQuery) as string);
}

if (params.has(gZoom)) {
    // if zoom in params
    mapArea.zoom = parseInt(params.get(gZoom) as string) - 1;
}

const map: L.Map = L.map('map', {
    scrollWheelZoom: false, // TODO: on pc allow ctrl + scroll

    center: [mapArea.lat, mapArea.lng],
    zoom: mapArea.zoom,
});

markers.forEach((pos) => {
    let marker = L.marker(pos.latlon as L.LatLngExpression).addTo(map);
    if (pos.label) {
        marker.bindPopup(pos.label).openPopup();
    }
});

if (markers.length === 1) {
    map.setView(markers[0].latlon as L.LatLngExpression, mapArea.zoom);
}

L.tileLayer(tileLayer, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// ---

async function readQ(addr: string) {
    // https://medium.com/@sowmyaaji/how-to-build-a-backend-with-jquery-and-add-a-leaflet-js-frontend-e77f2079c852

    let uri = encodeURI(nominatimQ + addr);
    let body: { lat: string; lon: string }[] = await (await fetch(uri)).json();

    let pos = {
        latlon: [parseFloat(body[0].lat), parseFloat(body[0].lon)],
        label: addr,
    };

    markers.push(pos);
}

async function readPB(param: string) {
    // https://andrewwhitby.com/2014/09/09/google-maps-new-embed-format/
    // https://blog.themillhousegroup.com/2016/08/deep-diving-into-google-pb-embedded-map.html
    // https://stackoverflow.com/a/47042514

    let data = parsePB(param.split('!').slice(1));

    let currMapArea: number[] = data[0][0][0];
    [mapArea.lng, mapArea.lat] = currMapArea.slice(1);

    let currMarkers: any[] | string = data[0][1];
    if (typeof currMarkers !== 'string') {
        for (let marker of currMarkers[0] as string[]) {
            if (marker.match(cidMatch)) {
                // cid
                console.log(marker);
            } else if (marker.match(dmsMatch)) {
                markers.push({ latlon: parseDMS(marker) });
            } else {
                readQ(marker);
            }
        }
    }
}

// ---

function parseDMS(input: string): [number, number] {
    let parts: string[] = input.split(/[^\d\w\.]+/);
    let lat = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    let lng = convertDMSToDD(parts[4], parts[5], parts[6], parts[7]);

    return [lat, lng];
}

function convertDMSToDD(
    degrees: string,
    minutes: string,
    seconds: string,
    direction: string
): number {
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == 'S' || direction == 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}
