import { parsePB, tileTypes, type TileType } from './parsePB';
import { parseDMS } from './parseDMS';
import { getMapZoom } from './zoom';

export const nominatimQ: string =
    'https://nominatim.openstreetmap.org/search?limit=1&format=json&q=';
const cidMatch: RegExp = /^0x[\da-f]+:0x[\da-f]+$/i;
const dmsMatch: RegExp = /^\d{1,2}°\d{1,2}'\d{1,2}\.\d"(N|S) \d{1,2}°\d{1,2}'\d{1,2}\.\d"(E|W)$/i;

export type Marker = {
    lat: number;
    lon: number;
    label: string;
};

export type MapData = {
    area?: {
        lat: number;
        lon: number;
    };
    zoom?: number;
    tile?: TileType;

    markers?: Marker[];
};

/**
 * Decodes the `pb` parameter with the help of `parsePB` and `readQ`
 * @param param Content of the `pb` parameter as a string
 * @returns MapData with area, zoom, tile type and markers
 */
export async function readPB(param: string): Promise<MapData> {
    let mapData: MapData = {
        markers: [],
    };

    let data = parsePB(param.split('!').slice(1))[0];

    let mapArea: number[] = data[0][0];
    mapData.area = {
        lat: mapArea[2],
        lon: mapArea[1],
    };

    mapData.zoom = getMapZoom(mapArea[0]);

    let currMarkers: any[] | string = data[1];
    if (typeof currMarkers !== 'string') {
        for (let markers of currMarkers[0] as string[]) {
            if (markers.match(cidMatch)) {
                // TODO: understand CID
                console.log(markers);
            } else if (markers.match(dmsMatch)) {
                let [lat, lon] = parseDMS(markers);
                if (lat && lon) {
                    mapData.markers?.push({
                        lat: lat,
                        lon: lon,
                        label: `${lat} ${lon}`,
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

    if (tileTypes.includes(data[data.length - 1])) {
        mapData.tile = data[data.length - 1];
    }

    return mapData;
}

/**
 * Makes a request to the Nominatim API to get the coordinates of an address
 *
 * Reference: https://medium.com/@sowmyaaji/how-to-build-a-backend-with-jquery-and-add-a-leaflet-js-frontend-e77f2079c852
 * @param addr An address or place
 * @returns The Latitude and Logitude of the address or place
 */
export async function readQ(addr: string): Promise<Marker | null> {
    let uri = encodeURI(nominatimQ + addr);
    let res = await fetch(uri);

    if (!res.ok) {
        return null;
    }

    let json: { lat: string; lon: string }[] = await res.json();

    let body: { lat: string; lon: string } = json[0];

    let marker: Marker = {
        lat: parseFloat(body.lat),
        lon: parseFloat(body.lon),
        label: addr,
    };

    return marker;
}
