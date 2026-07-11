import type { ReviewIssue } from './review'

export type ReviewHistoryItem = {
  id: number
  code: string
  language: string
  issues: ReviewIssue[]
  score: number
  summary: string
  created_at: string
}
