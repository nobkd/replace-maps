'use strict';

const gPos = 'pb';
const gQuery = 'q';
const params = new URLSearchParams(document.location.search);

const mapArea = {
    lat: 0,
    lng: 0,
    zoom: 17 // as default, because leaflet and gmaps work somehow differently
};

let markers = [];

if (params.has(gPos)) {
    parsePB(params.get(gPos));
} else if (params.has(gQuery)) {
    parseQ(params.get(gQuery));
}

const map = L.map('map').setView([mapArea.lat, mapArea.lng], mapArea.zoom);

markers.forEach((val) => {
    let marker = L.marker(val).addTo(map);
    marker.bindPopup('Position').openPopup();
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// ---

function parseQ(param) {
    console.log(param);
}

function parsePB(param) {
    // https://andrewwhitby.com/2014/09/09/google-maps-new-embed-format/
    // https://blog.themillhousegroup.com/2016/08/deep-diving-into-google-pb-embedded-map.html
    // https://stackoverflow.com/a/47042514

    let data = param.split('!');
    data = data.filter((val) => val.match(/^\d+(z|d|s).{3,}/));

    data.forEach((val) => { // finds approximate `lat lng zoom` of map
        if (val.match(/^\d+d/)) {
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
        }
        else if (val.match(/^\d+z/)) { // decode `base64` to `degrees minutes seconds direction` to `lat lng`
            let marker = atob(val.substring(2));
            marker.replace(/[^\d\s\-\.\'\"\°SNWE]/g, '');

            markers.push(parseDMS(marker));
        }
        else if (val.match(/^\d+s/)) {
            val = val.substring(2);

            if (val.match(/^0x[\da-f]+:0x[\da-f]+$/i)) {
                // two hex parts corresponding to ID of map object? -> FTID????
                console.log(val);
            }
            else { // might have to add more layers in betwwen to filter out more
                parseQ(val);
            }
        }
        else {
            console.log(val);
        }
    });
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