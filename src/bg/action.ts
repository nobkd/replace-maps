import { browserAction, tabs, type Tabs } from 'webextension-polyfill';
import { invertDisabled } from './utils/storage';

browserAction.onClicked.addListener(async (tab: Tabs.Tab) => {
    if (!tab.url) return;
    await invertDisabled(tab.url);
    tabs.reload(tab.id);
});
