import { useEffect } from 'react'
import { readGithubTokenFromUrl, removeGithubTokenFromUrl, storeGithubToken } from '../utils/githubToken'

export function useGithubTokenSync() {
  useEffect(() => {
    const token = readGithubTokenFromUrl()

    if (token) {
      storeGithubToken(token)
      removeGithubTokenFromUrl()
    }
  }, [])
}
