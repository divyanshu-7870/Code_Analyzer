import { FileText } from 'lucide-react'
import { Card } from '../ui/Card'

type SummaryCardProps = {
  summary: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-300">
        <FileText className="size-4 text-blue-300" />
        Summary
      </div>
      <p className="text-sm leading-6 text-zinc-400">{summary}</p>
    </Card>
  )
}
