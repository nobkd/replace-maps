import { browserAction, tabs } from 'webextension-polyfill';
import { disabledHosts, getHostname } from './storage';

/**
 * Updates the action icon
 * @param hostname Hostname
 */
export function updateIcon(hostname: string): void {
    let disabled = disabledHosts.includes(hostname);

    browserAction.setIcon({
        path: !disabled
            ? {
                  48: '/icons/48.png',
                  96: '/icons/96.png',
              }
            : {
                  48: '/icons/48-grey.png',
                  96: '/icons/96-grey.png',
              },
    });
}

/**
 * Async function to update the icon of the currently active tab. Uses `updateIcon` internally
 */
export async function updateActiveTabIcon(): Promise<void> {
    let browserTabs = await tabs.query({ active: true, currentWindow: true });

    let tab = browserTabs[0];
    if (tab && tab.url) {
        updateIcon(getHostname(tab.url));
    }
}
