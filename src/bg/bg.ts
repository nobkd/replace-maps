import { storage, runtime, webRequest, type WebRequest } from 'webextension-polyfill';
import { getAllDisabled, getHostname, KEY_DISABLED } from './utils/storage';

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

let disabledUrls: string[] = await getAllDisabled();
storage.local.onChanged.addListener((changes) => {
    if (KEY_DISABLED in changes) {
        console.log(changes)
        disabledUrls = changes[KEY_DISABLED].newValue;
    }
});

function redirect(req: WebRequest.OnBeforeRequestDetailsType): WebRequest.BlockingResponse {
    if (req.originUrl && req.url.match(matcher)) {
        console.log(req.originUrl);
        if (!disabledUrls.includes(getHostname(req.originUrl))) {
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
