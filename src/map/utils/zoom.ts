const factor: number = 35200000
const precision: number = 10

/**
 * Converts *altitude over the map* to *zoom level of the map*
 * TODO: Should be rewritten!!!
 *
 * Reference: https://groups.google.com/g/google-earth-browser-plugin/c/eSL9GlAkWBk/m/T4mdToJz_FgJ
 * @param alt Altitude as number
 * @returns Zoom level between 0 and 19
 */
export function getMapZoom(alt: number): number {
  let zoom = Math.log2(factor / alt) * 1.225
  zoom = Math.round((zoom + Number.EPSILON) * precision) / precision

  if (zoom < 0) {
    zoom = 0
  } else if (zoom > 19) {
    zoom = 19
  }
  return zoom
}
