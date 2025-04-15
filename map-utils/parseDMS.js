/**
 * Converts DMS coordinates to Lat and Lon
 * @param {string} input String containing DMS coordinates
 * @returns {[number, number]} Array containing Latitude and Longitude
 */
export function parseDMS(input) {
  /** @type {string[]} */
  const parts = input.split(/[^\d\w\.]+/)
  const lat = convertDMSToDD(parts.slice(0, 4))
  const lon = convertDMSToDD(parts.slice(4))

  return [lat, lon]
}
/**
 * Converts DMS part to Lat/Lon
 * @param {string[]} dms Array of four strings representing: Degree Minutes Seconds Direction
 * @returns {number} DMS part converted to Latitude / Longitude
 */
function convertDMSToDD(dms) {
  const [degrees, minutes, seconds, direction] = dms
  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1
  } // Don't do anything for N or E
  return dd
}
