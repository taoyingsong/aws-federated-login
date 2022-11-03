interface LoginParams {
  awsAuthorizedUrl: string
  client_id: string
  identity_provider: string
  redirect_uri: string
  response_type: string
  scope: string
  mode?: 'popup' | 'redirect' // 默认 'redirect'
  callback?: (params: any) => void
}

const windowSize = {
  width: 500,
  height: 549
}

const parseObjectToUrlParam = (obj: Record<string, any>, ignoreFields: string[]): string => {
  return Object.keys(obj)
    .filter((key) => ignoreFields.includes(key) === false)
    .map((key) => key + '=' + encodeURIComponent(obj[key]))
    .join('&')
}

export const awsFederatedLogin = (loginParams: LoginParams) => {
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
