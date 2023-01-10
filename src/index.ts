interface LoginParams {
  awsAuthorizedUrl: string
  client_id: string
  identity_provider?: string
  redirect_uri: string
  response_type: string
  scope: string
  mode?: 'popup' | 'redirect' // 默认 'redirect'
  callback: (params: any) => void
}

interface EventElement {
  node: Window
  handler: any
  capture: boolean
}

const windowSize = {
  width: 600,
  height: 678
}

const parseObjectToUrlParam = (obj: Record<string, any>, ignoreFields: string[]): string => {
  return Object.keys(obj)
    .filter((key) => ignoreFields.indexOf(key) === -1)
    .map((key) => key + '=' + encodeURIComponent(obj[key]))
    .join('&')
}

const _eventHandlers: Record<string, EventElement[]> = {}
const addListener = (node: Window, event: string, handler: any, capture = false) => {
  if (Object.keys(_eventHandlers).indexOf(event) === -1) {
    _eventHandlers[event] = []
  }

  // here we track the events and their nodes (note that we cannot
  // use node as Object keys, as they'd get coerced into a string
  _eventHandlers[event].push({ node, handler, capture })
  node.addEventListener(event, handler, capture)
}

const removeAllListeners = (targetNode: Window, event: string) => {
  const _eventArr = _eventHandlers[event]
  if (_eventArr && _eventArr.length > 0) {
    // remove listeners from the matching nodes
    _eventArr
      .filter(({ node }) => node === targetNode)
      .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture))

    // update _eventHandlers global
    _eventHandlers[event] = _eventArr.filter(({ node }) => node !== targetNode)
  }
}

export const awsFederatedLogin = (loginParams: LoginParams) => {
  const { awsAuthorizedUrl, mode, callback } = loginParams
  const query = parseObjectToUrlParam(loginParams, ['awsAuthorizedUrl', 'mode', 'callback'])
  const href = `${awsAuthorizedUrl}?${query}`

  const _fn = (event: { data: { code: any } }) => {
    const newCode = event.data?.code
    if (newCode && newCode !== sessionStorage.getItem('code') && callback) {
      sessionStorage.setItem('code', newCode)
      callback(event.data)
      window.removeEventListener('message', _fn, false)
    }
  }

  if (typeof window !== 'undefined') {
    removeAllListeners(window, 'message')
    if (mode === 'popup') {
      const left = window.screen.width / 2 - windowSize.width / 2
      const top = window.screen.height / 2 - windowSize.height / 2
      // ,location=yes,scrollbars=yes,status=yes
      window.open(href, 'sub', `width=${windowSize.width},height=${windowSize.height},left=${left},top=${top}`)
    } else {
      window.open(href, '_blank')
    }
    addListener(window, 'message', _fn)
  }
}

export const awsRedirect = () => {
  // const _redirectURL = (location.hostname === 'localhost' ? 'http://' : 'https://') + location.host
  const search = location.search.substring(1)
  const searchObj = JSON.parse(
    '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
  )
  if (window?.opener) {
    window.opener.postMessage(searchObj, '*')
    window.close()
  }
}
