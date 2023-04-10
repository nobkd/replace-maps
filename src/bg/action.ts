import { runtime, browserAction, tabs, type Tabs } from 'webextension-polyfill';
import { disabledHosts, getHostname, invertHostState } from './utils/storage';

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url) return;

    let hostname = getHostname(tab.url);
    await invertHostState(hostname);

    // TODO: having to fix that icon fits to current tab...
    if (disabledHosts.includes(hostname)) {
        browserAction.setIcon({
            path: {
                '48': runtime.getURL('/icons/48-grey.png'),
                '96': runtime.getURL('/icons/96-grey.png'),
            },
        });
    } else {
        browserAction.setIcon({
            path: {
                '48': runtime.getURL('/icons/48.png'),
                '96': runtime.getURL('/icons/96.png'),
            },
        });
    }

    // TODO: reload only frames (that have gmaps url), not full page
    tabs.reload(tab.id, { bypassCache: true });
});
