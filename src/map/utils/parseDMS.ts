export function parseDMS(input: string): [number, number] {
    let parts: string[] = input.split(/[^\d\w\.]+/);
    let lat = convertDMSToDD(parts.slice(0, 4));
    let lng = convertDMSToDD(parts.slice(4));

    return [lat, lng];
}

function convertDMSToDD(dmsd: string[]): number {
    const [degrees, minutes, seconds, direction] = dmsd;
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}
