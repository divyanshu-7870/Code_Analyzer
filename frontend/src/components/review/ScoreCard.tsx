import { Gauge } from 'lucide-react'
import { Card } from '../ui/Card'

type ScoreCardProps = {
  score: number
}

export function ScoreCard({ score }: ScoreCardProps) {
  const tone = score >= 80 ? 'text-emerald-300' : score >= 60 ? 'text-amber-300' : 'text-red-300'

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Review score</p>
          <div className="mt-4 flex items-end gap-1">
            <span className={`text-5xl font-semibold tracking-tight ${tone}`}>{score}</span>
            <span className="pb-1.5 text-sm text-zinc-500">/100</span>
          </div>
        </div>
        <div className="grid size-11 place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-blue-300">
          <Gauge className="size-5" />
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-blue-500 transition-all duration-700" style={{ width: `${score}%` }} />
      </div>
    </Card>
  )
}
