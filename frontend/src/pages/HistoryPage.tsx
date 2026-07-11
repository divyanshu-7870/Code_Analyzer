import { motion } from 'framer-motion'
import { AlertTriangle, CalendarClock, FileCode2, History, RefreshCw, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CodeEditor } from '../components/editor/CodeEditor'
import { ReviewResults } from '../components/review/ReviewResults'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { getApiErrorMessage } from '../services/apiClient'
import { fetchReviewHistory } from '../services/historyService'
import type { ReviewHistoryItem } from '../types/history'

export function HistoryPage() {
  const [items, setItems] = useState<ReviewHistoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ReviewHistoryItem | null>(null)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((item) =>
      [item.language, item.summary, item.code].some((value) => value.toLowerCase().includes(normalized)),
    )
  }, [items, query])

  useEffect(() => {
    void loadHistory()
  }, [])

  async function loadHistory() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchReviewHistory()
      setItems(result)
      setSelectedItem((current) => current ?? result[0] ?? null)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              <History className="size-3.5 text-blue-300" />
              Persistent review history
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Review history</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Revisit previous AI reviews, inspect saved code, and compare issue details.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            icon={<RefreshCw className="size-4" />}
            disabled={isLoading}
            onClick={() => void loadHistory()}
          >
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid min-h-[calc(100vh-210px)] gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-[#111113]/95">
            <div className="border-b border-zinc-800 p-4">
              <p className="text-sm font-semibold text-white">Saved reviews</p>
              <p className="mt-1 text-xs text-zinc-500">{items.length} total</p>
              <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search history"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
              {isLoading ? (
                Array.from({ length: 7 }).map((_, index) => <Skeleton key={index} className="h-28" />)
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedItem?.id === item.id
                        ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,0.12)]'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{item.language}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{item.summary}</p>
                      </div>
                      <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300">
                        {item.score}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
                      <span>{item.issues.length} issues</span>
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                  No saved reviews match that search.
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 space-y-5">
            {selectedItem ? (
              <>
                <Card className="p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <FileCode2 className="size-4 text-blue-300" />
                        {selectedItem.language}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                        <CalendarClock className="size-3.5" />
                        {new Date(selectedItem.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <CodeEditor value={selectedItem.code} language={selectedItem.language} onChange={() => undefined} />
                </Card>
                <ReviewResults result={selectedItem} />
              </>
            ) : (
              <Card className="grid min-h-[520px] place-items-center p-8 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto grid size-12 place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-blue-300">
                    <History className="size-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">No reviews yet.</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Run an analysis from the Home or GitHub page and it will appear here.
                  </p>
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  )
}
