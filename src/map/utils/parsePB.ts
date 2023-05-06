export type TileType = 'roadmap' | 'satellite';
export const tileTypes: TileType[] = ['roadmap', 'satellite'];

/**
 * Takes one bang operator and decodes it.
 *
 * Possible types are:
 * - `s`: string
 * - `v`: timestamp => keep as string
 * - `b`: boolean? / byte? => keep as string
 * - `f`: float
 * - `d`: double
 * - `i`: int
 * - `m`: matrix => length as int
 * - `e`: enum
 * - `z`: base64 encoded coordinates => Degrees Minutes Seconds Direction
 *
 * Unknown types are kept as string.
 *
 * @param item One bang operator with the structure: position, one character (data type), encoded data
 * @returns Array of two items. First is the decoded result. Second describes if the result is a new matrix.
 */
function convertType(item: string): [string | TileType | number, boolean] {
    item = item.replace(/^\d+/, '');
    const type: string = item.charAt(0);
    item = item.substring(1);

    // s: string || v: timestamp || b: boolean?/byte?
    let val: string | TileType | number = item;

    switch (type) {
        case 'f':
        case 'd': // float || double
            val = parseFloat(item);
            break;
        case 'i':
        case 'm': // int || matrix1d
            val = parseInt(item);
            break;
        case 'e': // enum
            let tileIndex = parseInt(item);
            val = tileTypes[tileIndex < tileTypes.length && tileIndex >= 0 ? tileIndex : 0];
            break;
        case 'z': // base64 encoded coords
            val = atob(item).replace(/[^\d\s\-\.\'\"\°SNWE]/g, '');
    }

    return [val, type === 'm'];
}

/**
 * Half iterative half recursive function that converts an array of split hashbangs and converts it into a fitting representation.
 * Multiple nested arrays possible.
 *
 * Example input:
 * ```ts
 * TODO: ['', '', '']
 * ```
 *
 * Example result:
 * ```ts
 * TODO:
 * ```
 *
 * References:
 * - https://andrewwhitby.com/2014/09/09/google-maps-new-embed-format/
 * - https://blog.themillhousegroup.com/2016/08/deep-diving-into-google-pb-embedded-map.html
 * - https://stackoverflow.com/a/47042514
 * @param items Bang operators (e.g. `!1m13`) split into pieces at `!`
 * @param out Array for top and recursion levels to save results and return
 * @returns Filled `out` array with bang operators converted into readable format
 */
export function parsePB(items: string[], out: any[] = []): any[] {
    let i = 0;
    while (i < items.length) {
        let [val, isNew] = convertType(items[i]);

        if (!isNew) {
            out.push(val);
        } else {
            let itemsPart = items.slice(i + 1, i + (val as number) + 1);
            out.push(parsePB(itemsPart));
            i += val as number;
        }
        i++;
    }

    return out;
}
