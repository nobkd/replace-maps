import { browserAction, tabs, type Tabs } from 'webextension-polyfill';
import { getHostname, invertHostState } from './utils/storage';
import { updateIcon } from './utils/actionIcon';

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    updateIcon(hostname);

    // TODO: reload only frames (that have gmaps url), not full page
    tabs.reload(tab.id, { bypassCache: true });
});
