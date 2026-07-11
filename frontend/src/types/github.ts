import type { ReviewResponse } from './review'

export type GithubRepository = {
  name: string
  full_name: string
  private: boolean
  language: string | null
  updated_at: string
}

export type GithubTreeItem = {
  path: string
  mode: string
  type: 'blob'
  sha: string
  size: number
  url: string
}

export type GithubFileContent = {
  name: string
  path: string
  content: string
}

export type GithubReviewResponse = ReviewResponse
