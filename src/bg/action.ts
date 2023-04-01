import { browserAction, tabs, type Tabs } from 'webextension-polyfill';
import { getDisabled, setDisabled } from './utils/storage';

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    const hostname = getHostname(tab.url);
    if (!hostname) return;

    console.log(hostname);

    // TODO

    tabs.reload(tab.id);
});

function getHostname(url?: string): string | undefined {
    if (!url) return;

    url = url.replace(/^\w+:\/\//, '');
    url = url.split(/[\/#]/, 1)[0];
    return url;
}
