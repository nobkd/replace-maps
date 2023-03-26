"use strict";

const patterns = [
    'http://*/maps/embed*',
    'https://*/maps/embed*',
    'http://*/maps*output=embed*',
    'https://*/maps*output=embed*'
];

const gLocales = ['com', 'de']; // TODO: collect more locales
const matcher = new RegExp(
    `^(https?:\/\/)?(maps\.google\.(${gLocales.join('|')})\/maps\/?\?.*output=embed|(www\.)?google\.(${gLocales.join('|')})\/maps\/embed\/?\?)`
);

function editFrame(tabId, frameId) {
    browser.webNavigation.getFrame({
        tabId: tabId,
        frameId: frameId
    }).then(
        (frameDetails) => {
            console.log(frameDetails);
            frameDetails.scrolling = 'no'; // trying to manipulate iframes attributes: not working
        }
    );
}

function redirect(req) {
    if (req.url.match(matcher)) {
        const params = new URLSearchParams(req.url.split('?')[1]);
        
        console.log(req);
        console.log(params);
        //editFrame(req.tabId, req.frameId);
        
        return {
            redirectUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=-12.041015625000002%2C44.32384807250689%2C27.465820312500004%2C57.397624055000456&amp;layer=mapnik'
        };
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
