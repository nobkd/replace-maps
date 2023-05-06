/**
 * Converts DMS coordinates to Lat and Lon
 * @param input String containing DMS coordinates
 * @returns Array containing Latitude and Longitude
 */
export function parseDMS(input: string): [number, number] {
    let parts: string[] = input.split(/[^\d\w\.]+/);
    let lat = convertDMSToDD(parts.slice(0, 4));
    let lon = convertDMSToDD(parts.slice(4));

    return [lat, lon];
}
/**
 * Converts DMS part to Lat/Lon
 * @param dms Array of four strings representing: Degree Minutes Seconds Direction
 * @returns DMS part converted to Latitude / Longitude
 */
function convertDMSToDD(dms: string[]): number {
    const [degrees, minutes, seconds, direction] = dms;
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}
