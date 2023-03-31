export type TileType = 'roadmap' | 'satellite';
export const tileTypes = ['roadmap', 'satellite'];

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
            val = tileTypes[parseInt(item) ?? 0];
            break;
        case 'z': // base64 encoded coords
            val = atob(item).replace(/[^\d\s\-\.\'\"\°SNWE]/g, '');
    }

    return [val, type === 'm'];
}

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
