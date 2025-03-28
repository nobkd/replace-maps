import { storage } from 'webextension-polyfill'

import { updateIcon } from './actionIcon.js'

export const KEY_DISABLED_HOSTS = 'disabled_hosts'
export const KEY_RESIZABLE_STATE = 'resizable_state'
export const KEY_THEME = 'theme'

// Listens to changes on the storage. Updates disabled hosts list, if stored list changes
/** @type {string[]} */
export let disabledHosts = await getDisabledHosts()
export let resizableState = await getResizableState()
export let theme = await getTheme()

storage.local.onChanged.addListener((changes) => {
  if (KEY_DISABLED_HOSTS in changes) disabledHosts = changes[KEY_DISABLED_HOSTS].newValue ?? []
  if (KEY_RESIZABLE_STATE in changes) resizableState = changes[KEY_RESIZABLE_STATE].newValue ?? false
  if (KEY_THEME in changes) theme = changes[KEY_THEME].newValue ?? 'system'
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

async function getTheme() {
  return (await storage.local.get(KEY_THEME))[KEY_THEME] ?? 'system'
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

export async function setTheme(state) {
  return (await storage.local.set({
    [KEY_THEME]: state
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
