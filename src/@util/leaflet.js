import L from 'leaflet'
import 'leaflet-fullscreen'

import { readPB, readQ } from '../../map-utils/read.js'


const tiles = {
  roadmap: {
    layer: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap.Mapnik
    data: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  satellite: {
    layer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // Esri.WorldImagery
    data: {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  },
}

export async function init(el, { q, z, pb }) {
  const data = { zoom: z ?? 15, tile: 'roadmap' }

  /* process params */
  if (pb) Object.assign(data, await readPB(pb))
  else if (q) {
    const marker = await readQ(q)
    if (marker) data.markers = [marker]
  }

  data.tile = 'roadmap' // TODO: re-enable satellite in the future again.

  /* leaflet */

  const map = L.map(el, {
    fullscreenControl: true,
    scrollWheelZoom: true,
    touchZoom: true,
    zoomSnap: 0.1,
    zoomDelta: 0.5,
    minZoom: 1,
    maxZoom: 18,
    center: [0, 0],
    ...data,
  })

  L.control.scale().addTo(map)
  L.tileLayer(tiles[data.tile].layer, tiles[data.tile].data).addTo(map)

  if (data.markers?.length == 0 && data.area) map.setView([data.area.lat, data.area.lon])
  if (data.markers) {
    if (data.markers.length === 1) {
      const mapMarker = data.markers[0]
      map.setView([mapMarker.lat, mapMarker.lon])
    }
  
    data.markers.forEach((marker) => {
      const mapMarker = L.marker([marker.lat, marker.lon]).addTo(map)
      mapMarker.bindPopup(marker.label, { closeButton: false }).openPopup()
    })
  }

  return data
}
