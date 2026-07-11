import { motion } from 'framer-motion'
import { AlertTriangle, Eraser, Play, Sparkles, WandSparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CodeEditor } from '../components/editor/CodeEditor'
import { LanguageSelect } from '../components/editor/LanguageSelect'
import { EmptyReviewState } from '../components/review/EmptyReviewState'
import { ReviewResults } from '../components/review/ReviewResults'
import { ReviewSkeleton } from '../components/review/ReviewSkeleton'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { getApiErrorMessage } from '../services/apiClient'
import { applyFix, reviewCode } from '../services/reviewService'
import type { ReviewIssue, ReviewResponse } from '../types/review'
import { sampleCode } from '../utils/sampleCode'

const initialCode = `function calculateTotal(items) {
  let total = 0;

  for (var i = 0; i <= items.length; i++) {
    total += items[i].price;
  }

  return total;
}`

export function HomePage() {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState<ReviewResponse | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [applyingIssueKey, setApplyingIssueKey] = useState<string | null>(null)

  const canAnalyze = useMemo(() => code.trim().length > 0 && !isReviewing, [code, isReviewing])

  async function handleAnalyze() {
    if (!code.trim()) {
      setError('Paste code before running analysis.')
      return
    }

    setError(null)
    setNotice(null)
    setIsReviewing(true)

    try {
      const result = await reviewCode({ code, language })
      setReview(result)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsReviewing(false)
    }
  }

  function handleClear() {
    setCode('')
    setReview(null)
    setError(null)
    setNotice(null)
  }

  function handleSampleCode() {
    setCode(sampleCode)
    setLanguage('javascript')
    setReview(null)
    setError(null)
    setNotice('Sample code loaded.')
  }

  async function handleApplyFix(issue: ReviewIssue) {
    const key = `${issue.line_number}-${issue.description}`
    setApplyingIssueKey(key)
    setError(null)
    setNotice(null)

    try {
      const result = await applyFix({
        original_code: code,
        language,
        issue_description: issue.description,
        suggestion: issue.suggestion,
        fixed_code_snippet: issue.fixed_code_snippet,
      })
      setCode(result.fixed_code)
      setNotice(result.message || 'Fix applied to the editor.')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setApplyingIssueKey(null)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.65fr)]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
                <Sparkles className="size-3.5 text-blue-300" />
                Gemini-powered static review
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Analyze code quality</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Paste a function, component, or file and get a structured review with severity, category, and exact fixes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LanguageSelect value={language} onChange={setLanguage} />
              <Button type="button" variant="ghost" icon={<Sparkles className="size-4" />} onClick={handleSampleCode}>
                Sample
              </Button>
              <Button type="button" variant="danger" icon={<Eraser className="size-4" />} onClick={handleClear}>
                Clear
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={isReviewing ? <WandSparkles className="size-4 animate-pulse" /> : <Play className="size-4" />}
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                {isReviewing ? 'Analyzing' : 'Analyze'}
              </Button>
            </div>
          </div>

          {(error || notice) && (
            <div
              className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                error
                  ? 'border-red-500/25 bg-red-500/10 text-red-200'
                  : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error ?? notice}</span>
            </div>
          )}

          <Card className="overflow-hidden p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <p className="text-sm font-medium text-zinc-300">Editor</p>
                <p className="text-xs text-zinc-600">Changes stay local until you run analysis.</p>
              </div>
              <div className="hidden rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-500 sm:block">
                {code.split('\n').length} lines
              </div>
            </div>
            <CodeEditor value={code} language={language} onChange={setCode} />
          </Card>
        </motion.section>

        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-white">Review output</h2>
            <p className="mt-1 text-sm text-zinc-500">Issues are grouped by severity after each analysis.</p>
          </div>

          {isReviewing ? (
            <ReviewSkeleton />
          ) : review ? (
            <ReviewResults result={review} onApplyFix={handleApplyFix} applyingIssueKey={applyingIssueKey} />
          ) : (
            <EmptyReviewState />
          )}
        </aside>
      </div>
    </div>
  )
}
