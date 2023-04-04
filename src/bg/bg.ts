import { runtime, webRequest, type WebRequest } from 'webextension-polyfill';
//import { getDisabled } from './utils/storage';

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

/*async*/ function redirect(req: WebRequest.OnBeforeRequestDetailsType): /*Promise<*/WebRequest.BlockingResponse/*>*/ {
    if (req.originUrl && req.url.match(matcher)) {
        //if (!await getDisabled(req.originUrl)) {
        return {
            redirectUrl: runtime.getURL('map.html?' + req.url.split('?')[1]),
        };
        //}
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
