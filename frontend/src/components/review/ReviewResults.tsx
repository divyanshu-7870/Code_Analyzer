import { AnimatePresence, motion } from 'framer-motion'
import type { ReviewIssue, ReviewResponse } from '../../types/review'
import { groupIssuesBySeverity, severityLabel } from '../../utils/severity'
import { IssueCard } from './IssueCard'
import { ScoreCard } from './ScoreCard'
import { SummaryCard } from './SummaryCard'

type ReviewResultsProps = {
  result: ReviewResponse
  onApplyFix?: (issue: ReviewIssue) => void
  applyingIssueKey?: string | null
}

export function ReviewResults({ result, onApplyFix, applyingIssueKey }: ReviewResultsProps) {
  const groupedIssues = groupIssuesBySeverity(result.issues).filter((group) => group.issues.length > 0)

  return (
    <div className="space-y-4">
      <ScoreCard score={result.score} />
      <SummaryCard summary={result.summary} />

      <AnimatePresence>
        {groupedIssues.map((group) => (
          <motion.section
            key={group.severity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {severityLabel[group.severity]} severity
              </h2>
              <span className="text-xs text-zinc-600">{group.issues.length}</span>
            </div>
            {group.issues.map((issue) => (
              <IssueCard
                key={`${issue.line_number}-${issue.description}`}
                issue={issue}
                onApplyFix={onApplyFix}
                isApplying={applyingIssueKey === `${issue.line_number}-${issue.description}`}
              />
            ))}
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  )
}
