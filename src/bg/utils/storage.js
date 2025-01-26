import { storage } from 'webextension-polyfill'

import { updateIcon } from './actionIcon.js'

export const KEY_DISABLED_HOSTS = 'disabled_hosts'
export const KEY_RESIZABLE_STATE = 'resizable_state'

// Listens to changes on the storage. Updates disabled hosts list, if stored list changes
/** @type {string[]} */
export let disabledHosts = await getDisabledHosts()
export let resizableState = await getResizableState()

storage.local.onChanged.addListener((changes) => {
  if (KEY_DISABLED_HOSTS in changes) {
    disabledHosts = changes[KEY_DISABLED_HOSTS].newValue ?? []
  }
  if (KEY_RESIZABLE_STATE in changes) resizableState = changes[KEY_RESIZABLE_STATE].newValue ?? false
})

/**
 * Async function to get the list of disabled hostnames
 * @returns {Promise<string[]>} List of disabled hostnames
 */
async function getDisabledHosts() {
  return (await storage.local.get(KEY_DISABLED_HOSTS))[KEY_DISABLED_HOSTS] ?? []
}

async function getResizableState() {
  return (await storage.local.get(KEY_RESIZABLE_STATE))[KEY_RESIZABLE_STATE] ?? false
}

/**
 * Async function to invert the state of a hostname.
 * Adds new entry if not disabled, removes entry, if already disabled
 * @param {string} hostname Hostname to invert the state of
 */
export async function invertHostState(hostname) {
  if (disabledHosts.includes(hostname)) {
    disabledHosts.splice(disabledHosts.indexOf(hostname), 1)
  } else {
    disabledHosts.push(hostname)
  }

  await storage.local.set({
    [KEY_DISABLED_HOSTS]: disabledHosts,
  })

  updateIcon(hostname)
}

export async function setResizableState(state) {
  return (await storage.local.set({
    [KEY_RESIZABLE_STATE]: state
  }))
}

/**
 * Retrieves the hostname from a URL
 * @param {string} url Full URL string
 * @returns {string} Hostname string
 */
export function getHostname(url) {
  url = url.replace(/^\w+:\/\//, '')
  url = url.split(/[\/#\?]/, 1)[0]
  return url
}
