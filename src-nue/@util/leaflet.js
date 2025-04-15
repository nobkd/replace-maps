import L from 'leaflet'
import 'leaflet-fullscreen'

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

export function init(el, state) {
  const { q, z, pb } = state
  const data = { zoom: z ?? 2, tile: 'roadmap' }

  const map = L.map(el, {
    fullscreenControl: true,
    scrollWheelZoom: true,
    touchZoom: true,
    zoomSnap: 0.1,
    zoomDelta: 0.5,
    minZoom: 0.5,
    maxZoom: 19,
    center: [0, 0],
    ...data,
  })

  L.control.scale().addTo(map)
  L.tileLayer(tiles[data.tile].layer, tiles[data.tile].data).addTo(map)

}
