import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import type { ReviewIssue } from '../../types/review'
import { severityLabel, severityTone } from '../../utils/severity'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { CopyButton } from '../ui/CopyButton'

type IssueCardProps = {
  issue: ReviewIssue
  onApplyFix?: (issue: ReviewIssue) => void
  isApplying?: boolean
}

export function IssueCard({ issue, onApplyFix, isApplying }: IssueCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={severityTone[issue.severity]}>{severityLabel[issue.severity]}</Badge>
        <Badge className="border-zinc-700 bg-zinc-950 text-zinc-300">{issue.category}</Badge>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-500">
          Line {issue.line_number}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold leading-6 text-white">{issue.description}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{issue.suggestion}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3 text-xs"
          icon={<ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} />}
          onClick={() => setIsOpen((current) => !current)}
        >
          Corrected snippet
        </Button>
        <CopyButton text={issue.fixed_code_snippet} label="Copy snippet" />
        {onApplyFix ? (
          <Button
            type="button"
            variant="primary"
            className="h-9 px-3 text-xs"
            icon={isApplying ? <WandSparkles className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
            disabled={isApplying}
            onClick={() => onApplyFix(issue)}
          >
            {isApplying ? 'Applying' : 'Apply Fix'}
          </Button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <pre className="mt-4 max-h-72 overflow-auto rounded-lg border border-zinc-800 bg-[#0d0d10] p-4 text-xs leading-5 text-zinc-300">
              <code>{issue.fixed_code_snippet}</code>
            </pre>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  )
}
