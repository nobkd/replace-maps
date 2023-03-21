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

let iframes = Array.from(document.getElementsByTagName('iframe'));
let gMaps = iframes.filter((item) => item.src.match(matcher));

console.log(gMaps);

// TODO: the hard part will be to interpret the real request params after the `?` and translate it for OSM

// document.replaceChild(prev_map_iframe, new_map_iframe);
// ^ can be problematic if we are'nt transferring all the iframe args

// another way would be to just replace the `src` but i don't know if the browser updates / overwrites the iframe
// ^ we might have to intercept and discard the request to gmaps
