function convertType(item) {
    item = item.replace(/^\d+/, '');
    const type = item.charAt();
    item = item.substring(1);

    // s: string || v: timestamp || b: boolean?/byte?
    let val = item;

    switch (type) {
        case 'f': case 'd': // float || double
            val = parseFloat(item);
            break;
        case 'i': case 'm': // int || matrix1d
            val = parseInt(item);
            break;
        case 'e': // enum
            switch (item) {
                case '0':
                    val = 'roadmap';
                    break;
                case '1':
                    val = 'satellite';
            };
            break;
        case 'z': // base64 encoded coords
            val = atob(item).replace(/[^\d\s\-\.\'\"\°SNWE]/g, '');
    };

    return [val, type === 'm'];
}

function parsePB(items, out = []) {
    let i = 0;
    while (i < items.length) {
        let [val, isNew] = convertType(items[i]);

        if (!isNew) {
            out.push(val);
        } else {
            let itemsPart = items.slice(i + 1, i + val + 1);
            out.push(parsePB(itemsPart));
            i += val;
        }
        i++;
    }

    return out;
}


pb = '';
console.log(parsePB(pb.split('!').slice(1)));
