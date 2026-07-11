import { API_BASE_URL, apiClient } from './apiClient'
import type { GithubFileContent, GithubRepository, GithubReviewResponse, GithubTreeItem } from '../types/github'

export const githubLoginUrl = `${API_BASE_URL}/api/github/login`

export async function fetchGithubRepos(token: string) {
  const response = await apiClient.get<GithubRepository[]>('/api/github/repos', {
    params: { token },
  })
  return response.data
}

export async function fetchGithubTree(token: string, repo: string) {
  const response = await apiClient.get<GithubTreeItem[]>('/api/github/tree', {
    params: { token, repo },
  })
  return response.data
}

export async function fetchGithubFile(token: string, repo: string, path: string) {
  const response = await apiClient.get<GithubFileContent>('/api/github/file', {
    params: { token, repo, path },
  })
  return response.data
}

export async function reviewGithubFile(token: string, repo: string, path: string) {
  const response = await apiClient.post<GithubReviewResponse>('/api/github/review-file', null, {
    params: { token, repo, path },
  })
  return response.data
}
