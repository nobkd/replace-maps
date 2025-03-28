import L from 'leaflet'
import 'leaflet-fullscreen'

import { theme, KEY_THEME } from '../bg/utils/storage.js'
import { readPB, readQ } from './utils/read.js'
import { tileTypes } from './utils/parsePB.js'

import { storage } from 'webextension-polyfill'
document.body.dataset.theme = theme
storage.local.onChanged.addListener((changes) => { if (KEY_THEME in changes) document.body.dataset.theme = theme })

/**
 * @typedef {object} Tile
 * @property {string} layer
 * @property {string} attr
 */

// https://leaflet-extras.github.io/leaflet-providers/preview/
/** @type {{TileTypes: Tile}} */
const tileProviders = {
  roadmap: {
    layer: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap.Mapnik
    attr: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    layer:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // Esri.WorldImagery
    attr: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }, // TODO: add street layer etc to satellite
}

const gPos = 'pb'
const gQuery = 'q'
const gZoom = 'z'
const params = new URLSearchParams(document.location.search)

/** @type {MapData} */
let mapData = {}

if (params.has(gPos)) {
  mapData = await readPB(params.get(gPos))
} else if (params.has(gQuery)) {
  let marker = await readQ(params.get(gQuery))

  if (marker) {
    mapData.markers = [marker]
  }
}

if (params.has(gZoom)) {
  mapData.zoom = parseInt(params.get(gZoom))
}

const map = L.map('map', {
  fullscreenControl: true,
  scrollWheelZoom: true,
  touchZoom: true,
  zoom: mapData.zoom ?? 17,
  zoomSnap: 0.1,
  zoomDelta: 0.5,
  minZoom: 0.5,
})

if (mapData.markers?.length == 0 && mapData.area) {
  map.setView([mapData.area.lat, mapData.area.lon])
}

if (mapData.markers) {
  if (mapData.markers.length === 1) {
    let mapMarker = mapData.markers[0]
    map.setView([mapMarker.lat, mapMarker.lon])
  }

  mapData.markers.forEach((marker) => {
    let mapMarker = L.marker([marker.lat, marker.lon]).addTo(map)
    mapMarker.bindPopup(marker.label, { closeButton: false }).openPopup()
  })
}

L.tileLayer(tileProviders[mapData.tile || tileTypes[0]].layer, {
  maxZoom: 19,
  attribution: tileProviders[mapData.tile || tileTypes[0]].attr,
}).addTo(map)

L.control.scale().addTo(map)
// TODO: fix layer loading
//L.control.layers({}, {}, { hideSingleBase: true }).addTo(map)
