import { tabs, browserAction, /*webNavigation*/ } from 'webextension-polyfill'

import { getHostname, invertHostState } from './utils/storage.js'
//import { matcher as mapsUrlMatcher, runtimeMapUrl } from './bg';

//const replacedUrlMatcher = new RegExp(`^${runtimeMapUrl}\?`);

/**
 * Async function to react to clicks on the browser action icon.
 * Takes the current tab, takes its hostname and inverts the state of the hostname.
 *
 * Requests all frames from the current tab, filters them for extension Leaflet frames and Maps frames.
 * Reloads the full tab on extension Leaflet or Maps frame match.
 * @param {browser.Tabs.Tab} tab Currently active tab
 */
async function actionClick(tab) {
  if (!tab.url || !tab.id) return

  let hostname = getHostname(tab.url)
  await invertHostState(hostname)

  /*
    // TODO: try to only reload necessary parts!!!
    let frames = (await webNavigation.getAllFrames({ tabId: tab.id })) ?? [];

    if (
        frames.some((frame) => {
            frame.url.match(replacedUrlMatcher) || frame.url.match(mapsUrlMatcher);
        })
    )
    */
  tabs.reload(tab.id, { bypassCache: true })
}

browserAction.onClicked.addListener(actionClick)
