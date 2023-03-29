'use strict';

const nominatimQ = 'https://nominatim.openstreetmap.org/search/?limit=1&format=json&q=';

const gPos = 'pb';
const gQuery = 'q';
const gZoom = 'z';
const params = new URLSearchParams(document.location.search);

console.log(params);

const mapArea = {
    lat: 0,
    lng: 0,
    zoom: 17 // as default, because leaflet and gmaps work somehow differently // TODO: get real num from gmaps
};

let markers = [];

if (params.has(gPos)) {
    await parsePB(params.get(gPos));
} else if (params.has(gQuery)) {
    await parseQ(params.get(gQuery));
}

if (params.has(gZoom)) { // if zoom unencoded in params
    mapArea.zoom = parseInt(params.get(gZoom));
}

const map = L.map('map', {
    scrollWheelZoom: false, // TODO: on pc allow ctrl + scroll

    center: [mapArea.lat, mapArea.lng],
    zoom: mapArea.zoom
});

markers.forEach((pos) => {
    let marker = L.marker(pos.latlon).addTo(map);
    if (pos.label) {
        marker.bindPopup(pos.label).openPopup();
    }
});

if (markers.length === 1) {
    map.setView(markers[0].latlon, mapArea.zoom);
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// ---

async function parseQ(addr) {
    // https://medium.com/@sowmyaaji/how-to-build-a-backend-with-jquery-and-add-a-leaflet-js-frontend-e77f2079c852

    let uri = encodeURI(nominatimQ + addr);
    let body = await (await fetch(uri)).json();

    let pos = {
        latlon: [
            parseFloat(body[0].lat),
            parseFloat(body[0].lon)
        ],
        label: addr
    };

    markers.push(pos);
}

async function parsePB(param) {
    // https://andrewwhitby.com/2014/09/09/google-maps-new-embed-format/
    // https://blog.themillhousegroup.com/2016/08/deep-diving-into-google-pb-embedded-map.html
    // https://stackoverflow.com/a/47042514

    let data = param.split('!');
    data = data.filter((val) => val.match(/^\d+(z|d|s).{3,}/));

    for (let val of data) {
        if (val.match(/^\d+d/)) { // finds approximate `lat lng zoom` of map
            let [i, floatVal] = val.split('d');
            i = parseInt(i);
            floatVal = parseFloat(floatVal);

            switch (i) {
                /**
                 case 1:
                     pos.zoom = floatVal; // somehow the zoom, but not correct for leaflet
                     /**/
                case 2:
                    mapArea.lng = floatVal;
                case 3:
                    mapArea.lat = floatVal;
            };
        } else if (val.match(/^\d+z/)) { // decode `base64` to `degrees minutes seconds direction` to `lat lng`
            let marker = atob(val.substring(2));
            marker.replace(/[^\d\s\-\.\'\"\°SNWE]/g, '');
            markers.push({ latlon: parseDMS(marker), label: '' });
        } else if (val.match(/^\d+s/)) {
            val = val.substring(2);

            if (val.match(/^0x[\da-f]+:0x[\da-f]+$/i)) {
                // two hex parts corresponding to ID of map object? -> FTID????
                console.log(val);
            } else { // might have to add more layers in between to filter out more
                await parseQ(val);
            }
        } else {
            console.log(val);
        }
    }
}

// ---

function parseDMS(input) {
    let parts = input.split(/[^\d\w\.]+/);
    let lat = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    let lng = convertDMSToDD(parts[4], parts[5], parts[6], parts[7]);

    return [lat, lng];
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}