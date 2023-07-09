import { browserAction, webNavigation, type Tabs, tabs } from 'webextension-polyfill';
import { getHostname, invertHostState } from './utils/storage';
import { matcher, runtimeMapUrl } from './bg';

const replacedUrlMatcher = new RegExp(`^${runtimeMapUrl}\?`);

/**
 * Async function to react to clicks on the browser action icon.
 * Takes the current tab, takes its hostname and inverts the state of the hostname.
 *
 * Requests all frames from the current tab, filters them for extension Leaflet frames and Maps frames.
 * Reloads the full tab on extension Leaflet frame match.
 * If no extension Leaflet frames were found it just reloads the Maps frames
 * @param tab Currently active tab
 */
async function actionClick(tab: Tabs.Tab): Promise<void> {
    if (!tab.url || !tab.id) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    let frames = (await webNavigation.getAllFrames({ tabId: tab.id })) ?? [];
    
    // Added instead of commented below, as map currently isn't loaded properly on just frame reload...
    if (frames.some((frame) => frame.url.match(replacedUrlMatcher) || frame.url.match(matcher))) {
        tabs.reload(tab.id, { bypassCache: true });
        return;
    }

    // TODO: check if reusable
    /*
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
    */
}

browserAction.onClicked.addListener(actionClick);
