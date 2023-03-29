function convertType(item) {
    item = item.replace(/^\d+/, '');
    const type = item.charAt();
    item = item.substring(1);

    let temp = undefined;

    switch (type) {
        case 'f': case 'd': // float or map pos
            temp = parseFloat(item);
            break;
        case 'i': case 'm': // int or new
            temp = parseInt(item);
            break;
        case 'e': case 's': case 'z': // enum (decode differently later) or string or timestamp
            temp = item;
            break;
        default:
            temp = item;
    };

    return [temp, type === 'm'];
}

function fromPB(items, idx = 0, out = []) {

    while (idx < items.length) {
        let [val, isNew] = convertType(items[idx]);

        if (!isNew) {
            out.push(val);
        } else {
            let range = items.slice(idx + 1, idx + val + 1);
            let newOut = fromPB(range);
            out.push(newOut);
            idx += val;
        }
        idx++;
    }

    return out;
}


let pb = '';
console.log(fromPB(pb.split('!').slice(1)));
