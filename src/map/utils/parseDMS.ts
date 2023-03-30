export function parseDMS(input: string): [number, number] {
    let parts: string[] = input.split(/[^\d\w\.]+/);
    let lat = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    let lng = convertDMSToDD(parts[4], parts[5], parts[6], parts[7]);

    return [lat, lng];
}

function convertDMSToDD(
    degrees: string,
    minutes: string,
    seconds: string,
    direction: string
): number {
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == 'S' || direction == 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}
