import { ChevronRight, Home } from 'lucide-react'

type BreadcrumbProps = {
  repoName?: string
  path?: string
}

export function Breadcrumb({ repoName, path }: BreadcrumbProps) {
  const parts = path ? path.split('/') : []

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-500">
      <Home className="size-3.5 shrink-0 text-zinc-400" />
      <span className="truncate text-zinc-300">{repoName ?? 'Select repository'}</span>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`} className="flex min-w-0 items-center gap-2">
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="truncate">{part}</span>
        </span>
      ))}
    </div>
  )
}
