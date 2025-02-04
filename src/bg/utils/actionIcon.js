import { browserAction, tabs } from 'webextension-polyfill'

import { disabledHosts, getHostname } from './storage.js'

/**
 * Updates the action icon
 * @param {string} hostname Hostname
 */
export function updateIcon(hostname) {
  let disabled = disabledHosts.includes(hostname)

  browserAction.setIcon({
    path: !disabled ? {
      48: '/icons/48-icon.png',
      96: '/icons/96-icon.png',
    } : {
      48: '/icons/48-icon-grey.png',
      96: '/icons/96-icon-grey.png',
    },
  })
}

/**
 * Async function to update the icon of the currently active tab. Uses `updateIcon` internally
 */
export async function updateActiveTabIcon() {
  let browserTabs = await tabs.query({ active: true, currentWindow: true })

  let tab = browserTabs[0]
  if (tab && tab.url) {
    updateIcon(getHostname(tab.url))
  }
}
