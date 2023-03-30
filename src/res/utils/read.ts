import { parsePB } from './parsePB';
import { parseDMS } from './parseDMS';

const nominatimQ: string = 'https://nominatim.openstreetmap.org/search/?limit=1&format=json&q=';
const cidMatch: RegExp = /^0x[\da-f]+:0x[\da-f]+$/i;
const dmsMatch: RegExp = /^\d{1,2}°\d{1,2}'\d{1,2}\.\d"(N|S) \d{1,2}°\d{1,2}'\d{1,2}\.\d"(E|W)$/i;

export type Marker = object & {
    lat: number;
    lon: number;
    label?: string;
};

export type MapData = object & {
    area?: {
        lat: number;
        lon: number;
    };
    zoom?: number;

    markers?: Marker[];
};

export async function readPB(param: string): Promise<MapData> {
    // https://andrewwhitby.com/2014/09/09/google-maps-new-embed-format/
    // https://blog.themillhousegroup.com/2016/08/deep-diving-into-google-pb-embedded-map.html
    // https://stackoverflow.com/a/47042514

    let mapData: MapData = {
        markers: [],
    };

    let data = parsePB(param.split('!').slice(1));

    let mapArea: number[] = data[0][0][0];
    mapData.area = {
        lat: mapArea[2],
        lon: mapArea[1],
    };

    let currMarkers: any[] | string = data[0][1];
    if (typeof currMarkers !== 'string') {
        for (let markers of currMarkers[0] as string[]) {
            if (markers.match(cidMatch)) {
                // cid
                console.log(markers);
            } else if (markers.match(dmsMatch)) {
                let [lat, lon] = parseDMS(markers);
                if (lat && lon) {
                    mapData.markers?.push({
                        lat: lat,
                        lon: lon,
                    });
                }
            } else {
                let marker = await readQ(markers);
                if (marker) {
                    mapData.markers?.push(marker);
                }
            }
        }
    }
    return mapData;
}

export async function readQ(addr: string): Promise<Marker | null> {
    // https://medium.com/@sowmyaaji/how-to-build-a-backend-with-jquery-and-add-a-leaflet-js-frontend-e77f2079c852

    let uri = encodeURI(nominatimQ + addr);
    let res = await fetch(uri);

    if (!res.ok) {
        return null;
    }

    let json: {lat: string; lon: string}[] = await res.json();

    let body: { lat: string; lon: string } = json[0];

    let marker: Marker = {
        lat: parseFloat(body.lat),
        lon: parseFloat(body.lon),
        label: addr,
    };

    return marker;
}
