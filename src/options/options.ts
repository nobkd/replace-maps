import { storage } from 'webextension-polyfill'
import {
  KEY_DISABLED_HOSTS,
  disabledHosts,
  getHostname,
  invertHostState,
} from '../bg/utils/storage'

const table = document.querySelector('.table')!

/**
 * (Re)Builds the list of diasabled hostnames
 */
function buildEntries(): void {
  table.innerHTML = ''
  disabledHosts.forEach(createEntry)
}

/**
 * Async function to add a hostname (from the form / URL Search Params) to the displayed list and the storage list of disabled hosts
 * If the entry is already present in the stored hosts, no entry is added to the display list
 */
async function addEntry(): Promise<void> {
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
 * @param hostname Hostname to add to the list
 */
function createEntry(hostname: string): void {
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
 * @param click Button click
 */
async function removeEntry(click: MouseEvent): Promise<void> {
  let target: EventTarget | null = click.target
  if (target === null) return

  let index = getIndex(target as HTMLButtonElement)
  if (index === -1) return

  await invertHostState(disabledHosts[index])
}

/**
 * Gets the index of a list entry using its clicked button
 * @param button Button that was clicked to remove an entry
 * @returns Index of the list entry
 */
function getIndex(button: HTMLButtonElement): number {
  let div: HTMLDivElement = button.parentElement as HTMLDivElement
  if (div === null) return -1

  let index = Array.from(table.children).indexOf(div)
  div.remove()

  return index
}

storage.local.onChanged.addListener((changes) => {
  if (KEY_DISABLED_HOSTS in changes) {
    buildEntries()
  }
})

buildEntries()
addEntry()
