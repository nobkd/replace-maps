import { browserAction, tabs, type Tabs } from 'webextension-polyfill';
import { disabledHosts, getHostname, invertHostState } from './utils/storage';

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    if (disabledHosts.includes(hostname)) {
        // TODO: set icon to grayscale for tabs with hostname
    } else {
        // TODO: set icon to colored
    }

    // TODO: reload only frames (that have gmaps url), not full page
    tabs.reload(tab.id, { bypassCache: true });
});
