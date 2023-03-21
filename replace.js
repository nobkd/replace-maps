const gLocales = ['com', 'de']; // TODO: collect more locales
const matcher = new RegExp(`^(https?:\/\/)?((maps|www)\.)?google\.(${gLocales.join('|')})\/maps(\/embed)?\/?\?`);
/*
Rules:
- with or without `http://` or `https://`
- with or without `/` before the `?`
- with `maps`, `www`, or no subdomain

Possible examples:
- google.com/maps?
- http://www.google.de/maps/?
- https://maps.google.com/maps/embed?

The capturing can match patterns that might not be correct in real life, but it does not matter, so we keep it like this (and it would become more complex)
*/

Array.from(
    document.getElementsByTagName('iframe')
).forEach((item) => {
    if (item.src.match(matcher)) {
        item.src = convert(item.src.split('?')[1]);
    }
});


function convert(url_params) {
    url_params = new URLSearchParams(url_params);
    console.log(url_params);

    // TODO: the hard part will be to interpret the real request params after the `?` and translate it for OSM
    // Also we might have to intercept and discard the possible request to gmaps because they're not needed, because the gmap is replaced

    return ''; // Full uri for the embed src
}
