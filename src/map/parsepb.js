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

pb = '!1m18!1m12!1m3!1d2430.8881547480214!2d10.197357316209178!3d52.463052979803535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b01d1b9af65f4b:0x225da8e03e242ad1!2sBaarsweg 9, 31311 Uetze!5e0!3m2!1sde!2sde!4v1557583694739!5m2!1sde!2sde';
console.log(fromPB(pb.split('!').slice(1)));
