"use strict";

const gLocales = ['com', 'de']; // TODO: collect more locales
const matcher = new RegExp(
    `^(https?:\/\/)?(maps\.google\.(${gLocales.join('|')})\/maps\/?\?.*output=embed|(www\.)?google\.(${gLocales.join('|')})\/maps\/embed\/?\?)`
);

function matchMaps(iframeNode) {
    return iframeNode.src.match(matcher);
}

function replaceMaps(iframeNode) {
    const url_params = new URLSearchParams(iframeNode.src.split('?')[1]);
    iframeNode.src = '';

    // TODO: the hard part will be to interpret the real request params after the `?` and translate it for OSM
    // Also we might have to intercept and discard the possible request to gmaps because they're not needed, because the gmap is replaced

    iframeNode.id = iframeNode.id || 'map-' + `${Math.random()}`.split('.')[0];
}

function changeMaps(iframeNode) {
    if (matchMaps(iframeNode)) {
        iframeNode.contentWindow.stop();
        replaceMaps(iframeNode);
    }
}

Array.from(document.getElementsByTagName('iframe')).forEach(changeMaps);

const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.nodeName === 'iframe') {
                changeMaps(node);
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });
