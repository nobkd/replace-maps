import browser from 'webextension-polyfill';

browser.browserAction.onClicked.addListener(async (tab: browser.Tabs.Tab) => {
    console.log(tab);

    /*
    let disabled: any = await browser.storage.managed.get('disabled');
    disabled = !(typeof disabled === 'boolean' ? disabled : false);

    console.log(disabled);

    browser.storage.managed.set({ disabled: disabled });
    */

    browser.tabs.reload(tab.id);
});
