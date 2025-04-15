const earthCircumference = 40_075_000.017 // in m
const factor = 1.25

/**
 * Converts *altitude over the map* to *zoom level of the map*
 * https://stackoverflow.com/a/37142662
 *
 * @param {number} alt Altitude in m
 * @returns {number} Zoom level
 */
export function altitude2zoom(alt) {
  return (Math.log2(earthCircumference / alt) + 1) * factor
}
