import { browserAction, webNavigation, type Tabs, tabs } from 'webextension-polyfill';
import { getHostname, invertHostState } from './utils/storage';
import { matcher, runtimeMapUrl } from './bg';

const replacedUrlMatcher = new RegExp(`^${runtimeMapUrl}\?`);

/**
 *
 */
browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url || !tab.id) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    let frames = (await webNavigation.getAllFrames({ tabId: tab.id })) ?? [];

    // matches osm frames (just reloading the frame ist not working for some reason, so in case of replaced maps the whole tab is reloaded)
    if (frames.some((frame) => frame.url.match(replacedUrlMatcher))) {
        tabs.reload(tab.id, { bypassCache: true });
        return;
    }

    // matches maps frames (finds the frames that have maps and reloads only them)
    frames = frames.filter((frame) => frame.url.match(matcher));
    frames.forEach((frame) => {
        tabs.executeScript(tab.id, {
            frameId: frame.frameId,
            code: 'document.location.reload();',
        });
    });
});
