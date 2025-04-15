import { changeHostnameState, getHostnameState, nueStateChange } from '/@util/helper.js'
import { browserAction, tabs, webRequest, windows, runtime } from '/@util/webext.js'


/*** action ***/

function updateIcon(url) {
  browserAction.setIcon({
    path: !getHostnameState(url) ? {
      48: '/icons/48-icon.png',
      96: '/icons/96-icon.png',
    } : {
      48: '/icons/48-icon-grey.png',
      96: '/icons/96-icon-grey.png',
    },
  })
}

async function updateActiveTabIcon() {
  let browserTabs = await tabs.query({ active: true, currentWindow: true })

  let tab = browserTabs[0]
  if (tab && tab.url) updateIcon(tab.url)
}

function actionClick(tab) {
  if (!tab.url || !tab.id) return
  else if (tab.url.startsWith('about:')) return

  changeHostnameState(tab.url)
  updateActiveTabIcon()
  tabs.reload(tab.id, { bypassCache: true })
}


/*** bg ***/

const gLocales = (await (await fetch('/domain-ends.json')).json()).join('|')

const matcher = new RegExp(
  // TODO: fix regex to fit more patterns
  `^(https?:\/\/)?(maps\.google\.(${gLocales})\/maps.*\?.*output=embed|(www\.)?google\.(${gLocales})\/maps\/embed.*\?)`
)

const runtimeMapUrl = runtime.getURL('map.html')

/**
 * Checks if `frames` send a request to Maps.
 * If they do and the extension isn't disabled for the current site, then the request is redirected to the extension leaflet map with all URL search params.
 * Else the request is'nt blocked.
 * @param {browser.WebRequest.OnBeforeRequestDetailsType} req Web Request from frame
 * @returns {browser.WebRequest.BlockingResponse} Redirect to extension map or pass through if extension disabled for website
 */
function redirect(req) {
  // TODO: check if originUrl always matches current tab url -> e.g. in frames with subframes
  if (req.originUrl && req.url.match(matcher)) {
    if (!getHostnameState(req.originUrl)) {
      return {
        redirectUrl: `${runtimeMapUrl}?${req.url.split('?').pop()}`,
      }
    }
  }
  return {}
}


/*** onload ***/

browserAction.onClicked.addListener(actionClick)

// Listens to web requests from frames, redirects when fitting `matcher`
webRequest.onBeforeRequest.addListener(
  redirect,
  {
    urls: ['<all_urls>'],
    types: ['sub_frame'],
  },
  ['blocking'],
)

// listen to tab URL changes
tabs.onUpdated.addListener(updateActiveTabIcon)

// listen to tab switching
tabs.onActivated.addListener(updateActiveTabIcon)

// listen for window switching
windows.onFocusChanged.addListener(updateActiveTabIcon)

// update icon at startup
updateActiveTabIcon()

nueStateChange(updateActiveTabIcon)
