const gLocales = ['com', 'de']; // TODO: collect more locales
const matcher = new RegExp(
    `^(https?:\/\/)?(maps\.google\.(${gLocales.join('|')})\/maps\/?\?.*output=embed|(www\.)?google\.(${gLocales.join('|')})\/maps\/embed\/?\?)`
);

Array.from(
    document.getElementsByTagName('iframe')
).forEach((item) => {
    if (item.src.match(matcher)) {
        convert(item);
    }
});


function convert(item) {
    url_params = new URLSearchParams(item.src.split('?')[1]);

    // TODO: the hard part will be to interpret the real request params after the `?` and translate it for OSM
    // Also we might have to intercept and discard the possible request to gmaps because they're not needed, because the gmap is replaced

    item.id = item.id || 'map-' + Math.floor(Math.random() * 100000);
    item.src = '';
}
