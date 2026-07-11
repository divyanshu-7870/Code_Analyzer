import type { ReviewIssue, Severity } from '../types/review'

export const severityOrder: Severity[] = ['high', 'medium', 'low']

export const severityLabel: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const severityTone: Record<Severity, string> = {
  high: 'border-red-500/25 bg-red-500/10 text-red-300',
  medium: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  low: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
}

export function groupIssuesBySeverity(issues: ReviewIssue[]) {
  return severityOrder.map((severity) => ({
    severity,
    issues: issues.filter((issue) => issue.severity === severity),
  }))
}
