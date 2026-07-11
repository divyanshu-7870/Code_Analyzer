import { ScanSearch } from 'lucide-react'
import { Card } from '../ui/Card'

export function EmptyReviewState() {
  return (
    <Card className="grid min-h-[360px] place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-blue-300">
          <ScanSearch className="size-5" />
        </div>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">Ready when your code is.</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Run an analysis to see score, summary, and issues grouped by severity.
        </p>
      </div>
    </Card>
  )
}
