import { GitFork, Lock, Unlock } from 'lucide-react'
import type { GithubRepository } from '../../types/github'

type RepositoryCardProps = {
  repo: GithubRepository
  isSelected: boolean
  onSelect: (repo: GithubRepository) => void
}

export function RepositoryCard({ repo, isSelected, onSelect }: RepositoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(repo)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        isSelected
          ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,0.12)]'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{repo.name}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{repo.full_name}</p>
        </div>
        {repo.private ? <Lock className="size-4 text-zinc-500" /> : <Unlock className="size-4 text-zinc-500" />}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <GitFork className="size-3.5" />
          {repo.language ?? 'Mixed'}
        </span>
        <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </button>
  )
}
