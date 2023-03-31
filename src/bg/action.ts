import browser from 'webextension-polyfill';

browser.browserAction.onClicked.addListener((tab: browser.Tabs.Tab) => {
    console.log(tab.url);
});