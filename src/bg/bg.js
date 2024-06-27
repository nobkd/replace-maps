import { runtime, tabs, windows, webRequest, WebRequest } from 'webextension-polyfill'
import { disabledHosts, getHostname } from './utils/storage'
import { updateActiveTabIcon } from './utils/actionIcon'
import { domainEnds } from './utils/domainEnds'

const gLocales = domainEnds.join('|') // TODO: collect more locales
export const matcher = new RegExp(
  // TODO: fix regex to fit more patterns
  `^(https?:\/\/)?(maps\.google\.(${gLocales})\/maps.*\?.*output=embed|(www\.)?google\.(${gLocales})\/maps\/embed.*\?)`
)
export const runtimeMapUrl = runtime.getURL('map.html')

/**
 * Checks if `frames` send a request to Maps.
 * If they do and the extension isn't disabled for the current site, then the request is redirected to the extension leaflet map with all URL search params.
 * Else the request is'nt blocked.
 * @param {WebRequest.OnBeforeRequestDetailsType} req Web Request from frame
 * @returns {WebRequest.BlockingResponse} Redirect to extension map or pass through if extension disabled for website
 */
function redirect(req) {
  // TODO: check if originUrl always matches current tab url -> e.g. in frames with subframes
  if (req.originUrl && req.url.match(matcher)) {
    if (!disabledHosts.includes(getHostname(req.originUrl))) {
      return {
        redirectUrl: runtimeMapUrl + '?' + req.url.split('?')[1],
      }
    }
  }
  return {}
}

// Listens to web requests from frames, redirects when fitting `matcher`
webRequest.onBeforeRequest.addListener(
  redirect,
  {
    urls: ['<all_urls>'],
    types: ['sub_frame'],
  },
  ['blocking']
)

// listen to tab URL changes
tabs.onUpdated.addListener(updateActiveTabIcon)

// listen to tab switching
tabs.onActivated.addListener(updateActiveTabIcon)

// listen for window switching
windows.onFocusChanged.addListener(updateActiveTabIcon)

// update icon at startup
updateActiveTabIcon()
