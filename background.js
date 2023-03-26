"use strict";

const patterns = [
    'http://*/maps/embed?*',
    'https://*/maps/embed?*',
    'http://*/maps?*output=embed*',
    'https://*/maps?*output=embed*'
];

const gLocales = ['com', 'de']; // TODO: collect more locales
const matcher = new RegExp(
    `^(https?:\/\/)?(maps\.google\.(${gLocales.join('|')})\/maps\?.*output=embed|(www\.)?google\.(${gLocales.join('|')})\/maps\/embed\?)`
);


function redirect(req) {
    if (req.url.match(matcher)) {
        return { redirectUrl: browser.extension.getURL('map/map.html?' + req.url.split('?')[1]) };
    }
}

browser.webRequest.onBeforeRequest.addListener(
    redirect,
    {
        urls: patterns,
        types: ['sub_frame']
    },
    ['blocking']
);
