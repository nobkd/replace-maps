
import { router } from '/@nue/app-router.js'

/*** nue ***/

export function nueStateChange(fn) {
  window.addEventListener('storage', ({ key }) =>  key == '$nue_state' && fn())
}


/*** general ***/

function getHostname(url) {
  url = url.replace(/^\w+:\/\//, '')
  url = url.split(/[\/#\?]/, 1)[0]
  return url
}

export function changeHostnameState(url, add) {
  const hostname = getHostname(url)
  const hosts = new Set(router.state.disabled_hosts || [])

  if (add) hosts.add(hostname)
  else hosts.has(hostname) ? hosts.delete(hostname) : hosts.add(hostname)

  router.set({ disabled_hosts: [...hosts] })
}

export function getHostnameState(url) {
  return (router.state.disabled_hosts || []).includes(getHostname(url))
}
