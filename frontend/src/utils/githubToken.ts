const githubTokenKey = 'code_analyzer_github_token'

export function getStoredGithubToken() {
  return localStorage.getItem(githubTokenKey)
}

export function storeGithubToken(token: string) {
  localStorage.setItem(githubTokenKey, token)
}

export function clearGithubToken() {
  localStorage.removeItem(githubTokenKey)
}

export function readGithubTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('github_token')

  if (!token) return null

  return token.replace(/^=+/, '')
}

export function removeGithubTokenFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('github_token')
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)
}
