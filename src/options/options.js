import { storage } from 'webextension-polyfill'

import {
  KEY_DISABLED_HOSTS,
  KEY_RESIZABLE_STATE,
  disabledHosts,
  getHostname,
  invertHostState,
  resizableState,
  setResizableState,
  theme,
  setTheme,
  KEY_THEME,
} from '../bg/utils/storage.js'

// const resizable = document.getElementById('resizable')
// resizable.addEventListener('change', (e) => {
//   setResizableState(resizable.checked)
// })

const themeEl = document.getElementById('theme')
themeEl.addEventListener('change', (e) => {
  setTheme(themeEl.selectedOptions[0].value)
})


const table = document.querySelector('.table')

function setThemeOption() {
  [...themeEl.querySelectorAll('option')].filter(e => e.value == theme)?.pop()?.setAttribute('selected', true)
}

/**
 * (Re)Builds the list of diasabled hostnames
 */
function buildEntries() {
  // resizable.checked = resizableState
  setThemeOption()
  table.innerHTML = ''
  disabledHosts.forEach(createEntry)
}

/**
 * Async function to add a hostname (from the form / URL Search Params) to the displayed list and the storage list of disabled hosts
 * If the entry is already present in the stored hosts, no entry is added to the display list
 */
async function addEntry() {
  const search = new URLSearchParams(document.location.search)
  let hostname = search.get('hostname')
  if (hostname === null) return

  hostname = getHostname(hostname)
  if (disabledHosts.includes(hostname)) return

  await invertHostState(hostname)
  createEntry(hostname)
}

/**
 * Creates a new entry for the displayed list of disabled hostnames and appends it to the view
 * @param {string} hostname Hostname to add to the list
 */
function createEntry(hostname) {
  const div = document.createElement('div')

  let span = document.createElement('span')
  span.innerText = hostname

  let button = document.createElement('button')
  button.onclick = removeEntry

  div.append(span, button)
  table.appendChild(div)
}

/**
 * Async funtion to remove an entry at click of its button.
 * Takes the index in the table to remove it from the list of stored hostnames
 * @param {MouseEvent} click Button click
 */
async function removeEntry(click) {
  const target = click.target
  if (target === null) return

  let index = getIndex(target)
  if (index === -1) return

  await invertHostState(disabledHosts[index])
}

/**
 * Gets the index of a list entry using its clicked button
 * @param {HTMLButtonElement} button Button that was clicked to remove an entry
 * @returns {number} Index of the list entry
 */
function getIndex(button) {
  let div = button.parentElement
  if (div === null) return -1

  let index = Array.from(table.children).indexOf(div)
  div.remove()

  return index
}

storage.local.onChanged.addListener((changes) => {
  if (KEY_DISABLED_HOSTS in changes) buildEntries()
  // if (KEY_RESIZABLE_STATE in changes) resizable.checked = resizableState
  if (KEY_THEME in changes) setThemeOption()
})

buildEntries()
addEntry()
