const windowSize = {
  width: 600,
  height: 678
}
const parseObjectToUrlParam = (obj, ignoreFields) => {
  return Object.keys(obj)
    .filter((key) => ignoreFields.includes(key) === false)
    .map((key) => key + '=' + encodeURIComponent(obj[key]))
    .join('&')
}
export const awsFederatedLogin = (loginParams) => {
  const { awsAuthorizedUrl, mode, callback } = loginParams
  const query = parseObjectToUrlParam(loginParams, ['awsAuthorizedUrl', 'mode', 'callback'])
  const href = `${awsAuthorizedUrl}?${query}`
  if (typeof window !== 'undefined') {
    if (mode === 'popup') {
      const left = window.screen.width / 2 - windowSize.width / 2
      const top = window.screen.height / 2 - windowSize.height / 2
      // ,location=yes,scrollbars=yes,status=yes
      window.open(href, 'sub', `width=${windowSize.width},height=${windowSize.height},left=${left},top=${top}`)
      window.addEventListener('message', (event) => {
        callback && callback(event.data)
      })
    } else {
      window.location.href = href
    }
  }
}
export const awsRedirect = (redirectURL = 'http://localhost:3000') => {
  const search = location.search.substring(1)
  const searchObj = JSON.parse(
    '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
  )
  if (window.opener) {
    window.opener.postMessage(searchObj, '*')
    window.close()
  } else {
    window.location.href = redirectURL
  }
}
