import { parsePB, tileTypes } from './parsePB.js'
import { parseDMS } from './parseDMS.js'
import { altitude2zoom } from './zoom.js'

export const nominatimQ = 'https://nominatim.openstreetmap.org/search?limit=1&format=json&q='
const cidMatch = /^0x[\da-f]+:0x[\da-f]+$/i
const dmsMatch = /^\d{1,2}°\d{1,2}'\d{1,2}\.\d"(N|S) \d{1,2}°\d{1,2}'\d{1,2}\.\d"(E|W)$/i

/**
 * @typedef {object} LatLon
 * @property {number} lat
 * @property {number} lon
 */

/**
 * @typedef {object} Marker
 * @property {number} lat
 * @property {number} lon
 * @property {string} label
 */

/**
 * @typedef {object} MapData
 * @property {LatLon?} area
 * @property {number?} zoom
 * @property {TileType?} tile
 * @property {Marker[]?} markers
 */

/**
 * Decodes the `pb` parameter with the help of `parsePB` and `readQ`
 * @param {string} param Content of the `pb` parameter as a string
 * @returns {Promise<MapData>} MapData with area, zoom, tile type and markers
 */
export async function readPB(param) {
  /** @type {MapData} */
  const mapData = {
    markers: [],
  }

  let data = parsePB(param.split('!').slice(1))[0]

  /** @type {number[]} */
  let mapArea = data[0][0].reverse()
  mapData.area = {
    lat: mapArea[0],
    lon: mapArea[1],
  }

  mapData.zoom = altitude2zoom(mapArea[2])

  /** @type {any[] | string} */
  let currMarkers = data[1]
  if (typeof currMarkers !== 'string') {
    for (let markers of currMarkers[0]) {
      if (markers.match(cidMatch)) {
        // TODO: understand CID
        console.log(markers)
      } else if (markers.match(dmsMatch)) {
        let [lat, lon] = parseDMS(markers)
        if (lat && lon) {
          mapData.markers?.push({
            lat: lat,
            lon: lon,
            label: `${lat} ${lon}`,
          })
        }
      } else {
        let marker = await readQ(markers)
        if (marker) {
          mapData.markers?.push(marker)
        }
      }
    }
  }

  if (tileTypes.includes(data[data.length - 1])) {
    mapData.tile = data[data.length - 1]
  }

  return mapData
}

/**
 * Makes a request to the Nominatim API to get the coordinates of an address
 *
 * Reference: https://medium.com/@sowmyaaji/how-to-build-a-backend-with-jquery-and-add-a-leaflet-js-frontend-e77f2079c852
 * @param {string} addr An address or place
 * @returns {Promise<Marker | null>} The Latitude and Logitude of the address or place
 */
export async function readQ(addr) {
  const uri = encodeURI(nominatimQ + addr)
  const res = await fetch(uri)

  if (!res.ok) {
    return null
  }

  /** @type {LatLon[]} */
  const json = await res.json()
  if (!json.length) return null
  
  /** @type {LatLon} */
  const body = json[0]

  /** @type {Marker} */
  const marker = {
    lat: parseFloat(body.lat),
    lon: parseFloat(body.lon),
    label: addr,
  }

  return marker
}
