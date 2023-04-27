import { runtime, tabs, windows, webRequest, type WebRequest } from 'webextension-polyfill';
import { disabledHosts, getHostname } from './utils/storage';
import { updateActiveTabIcon } from './utils/actionIcon';
import { domainEnds } from './utils/domainEnds';

const gLocales: string = domainEnds.join('|'); // TODO: collect more locales
export const matcher: RegExp = new RegExp(
    // TODO: fix regex to fit more patterns
    `^(https?:\/\/)?(maps\.google\.(${gLocales})\/maps.*\?.*output=embed|(www\.)?google\.(${gLocales})\/maps\/embed.*\?)`
);
export const runtimeMapUrl = runtime.getURL('map.html');

function redirect(req: WebRequest.OnBeforeRequestDetailsType): WebRequest.BlockingResponse {
    // TODO: check if originUrl always matches current tab url -> e.g. in frames with subframes
    if (req.originUrl && req.url.match(matcher)) {
        if (!disabledHosts.includes(getHostname(req.originUrl))) {
            return {
                redirectUrl: runtimeMapUrl + '?' + req.url.split('?')[1],
            };
        }
    }
    return {};
}

webRequest.onBeforeRequest.addListener(
    redirect,
    {
        urls: ['<all_urls>'],
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
