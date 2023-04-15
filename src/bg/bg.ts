import { runtime, tabs, windows, webRequest, type WebRequest } from 'webextension-polyfill';
import { disabledHosts, getHostname } from './utils/storage';
import { updateActiveTabIcon } from './utils/actionIcon';

const patterns: string[] = [
    'http://*/maps/embed*?*',
    'https://*/maps/embed*?*',
    'http://*/maps*?*output=embed*',
    'https://*/maps*?*output=embed*',
];

const gLocales: string = ['com', 'de'].join('|'); // TODO: collect more locales
const matcher: RegExp = new RegExp(
    // TODO: fix regex to fit more patterns
    `^(https?:\/\/)?(maps\.google\.(${gLocales})\/maps.*\?.*output=embed|(www\.)?google\.(${gLocales})\/maps\/embed.*\?)`
);

function redirect(req: WebRequest.OnBeforeRequestDetailsType): WebRequest.BlockingResponse {
    if (req.originUrl && req.url.match(matcher)) {
        if (!disabledHosts.includes(getHostname(req.originUrl))) {
            return {
                redirectUrl: runtime.getURL('map.html?' + req.url.split('?')[1]),
            };
        }
    }
    return {};
}

webRequest.onBeforeRequest.addListener(
    redirect,
    {
        urls: patterns,
        types: ['sub_frame'],
    },
    ['blocking']
);

// listen to tab URL changes
tabs.onUpdated.addListener(updateActiveTabIcon);

// listen to tab switching
tabs.onActivated.addListener(updateActiveTabIcon);

// listen for window switching
windows.onFocusChanged.addListener(updateActiveTabIcon);

// run at startup
updateActiveTabIcon();
