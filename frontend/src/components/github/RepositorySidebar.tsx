import { Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import type { GithubRepository } from '../../types/github'
import { Skeleton } from '../ui/Skeleton'
import { RepositoryCard } from './RepositoryCard'

type RepositorySidebarProps = {
  repos: GithubRepository[]
  selectedRepo: GithubRepository | null
  isLoading: boolean
  onSelectRepo: (repo: GithubRepository) => void
}

export function RepositorySidebar({ repos, selectedRepo, isLoading, onSelectRepo }: RepositorySidebarProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredRepos = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return repos
    return repos.filter((repo) => repo.full_name.toLowerCase().includes(normalized))
  }, [deferredQuery, repos])

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-[#111113]/95">
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Repositories</p>
            <p className="mt-1 text-xs text-zinc-500">{repos.length} available</p>
          </div>
        </div>
        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search repositories"
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24" />)
        ) : filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.full_name}
              repo={repo}
              isSelected={selectedRepo?.full_name === repo.full_name}
              onSelect={onSelectRepo}
            />
          ))
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
            No repositories match that search.
          </div>
        )}
      </div>
    </aside>
  )
}
