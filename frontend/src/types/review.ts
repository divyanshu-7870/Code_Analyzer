export type Severity = 'high' | 'medium' | 'low'
export type IssueCategory = 'bug' | 'security' | 'performance' | 'style'

export type ReviewIssue = {
  line_number: number
  severity: Severity
  category: IssueCategory
  description: string
  suggestion: string
  fixed_code_snippet: string
}

export type ReviewRequest = {
  code: string
  language: string
}

export type ReviewResponse = {
  issues: ReviewIssue[]
  score: number
  summary: string
}

export type ApplyFixRequest = {
  original_code: string
  language: string
  issue_description: string
  suggestion: string
  fixed_code_snippet: string
}

export type ApplyFixResponse = {
  fixed_code: string
  message: string
}
