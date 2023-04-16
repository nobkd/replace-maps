import { browserAction, webNavigation, type Tabs, tabs } from 'webextension-polyfill';
import { getHostname, invertHostState } from './utils/storage';
import { updateIcon } from './utils/actionIcon';
import { matcher, runtimeMapUrl } from './bg';

const replacedUrlMatcher = new RegExp(`^${runtimeMapUrl}\?`);

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url || !tab.id) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    updateIcon(hostname);

    let frames = (await webNavigation.getAllFrames({ tabId: tab.id })) ?? [];
    frames = frames.filter((frame) => {
        return frame.url.match(matcher) || frame.url.match(replacedUrlMatcher);
    });
    frames.forEach((frame) => {
        // TODO: currently only works "from maps to osm" and "not from osm to maps" => fix it...
        tabs.executeScript(tab.id, {
            frameId: frame.frameId,
            code: 'document.location.reload();',
        });
    });
});
