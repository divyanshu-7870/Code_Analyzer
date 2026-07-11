import { ChevronDown, FileCode2, Folder, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import type { GithubTreeItem } from '../../types/github'
import { buildFileTree, type FileTreeNode } from '../../utils/fileTree'
import { Skeleton } from '../ui/Skeleton'

type FileTreeProps = {
  files: GithubTreeItem[]
  selectedPath?: string
  isLoading: boolean
  onSelectFile: (file: GithubTreeItem) => void
}

const maxVisibleFiles = 700

export function FileTree({ files, selectedPath, isLoading, onSelectFile }: FileTreeProps) {
  const [query, setQuery] = useState('')
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set())
  const deferredQuery = useDeferredValue(query)

  const filteredFiles = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return files
    return files.filter((file) => file.path.toLowerCase().includes(normalized))
  }, [deferredQuery, files])

  const tree = useMemo(() => buildFileTree(filteredFiles.slice(0, maxVisibleFiles)), [filteredFiles])
  const hiddenCount = Math.max(filteredFiles.length - maxVisibleFiles, 0)

  function toggleFolder(path: string) {
    setCollapsedFolders((current) => {
      const next = new Set(current)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-zinc-800 bg-[#111113]/95">
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Files</p>
            <p className="mt-1 text-xs text-zinc-500">{files.length} blobs indexed</p>
          </div>
        </div>
        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter files"
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="m-2 rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
            Select a repository to load its files.
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="m-2 rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
            No files match that filter.
          </div>
        ) : (
          <>
            {tree.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                level={0}
                selectedPath={selectedPath}
                collapsedFolders={collapsedFolders}
                onToggleFolder={toggleFolder}
                onSelectFile={onSelectFile}
              />
            ))}
            {hiddenCount > 0 ? (
              <div className="m-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-500">
                Showing first {maxVisibleFiles} matches. Refine the filter to narrow {hiddenCount} more files.
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}

type TreeNodeProps = {
  node: FileTreeNode
  level: number
  selectedPath?: string
  collapsedFolders: Set<string>
  onToggleFolder: (path: string) => void
  onSelectFile: (file: GithubTreeItem) => void
}

function TreeNode({ node, level, selectedPath, collapsedFolders, onToggleFolder, onSelectFile }: TreeNodeProps) {
  const isCollapsed = collapsedFolders.has(node.path)
  const isSelected = selectedPath === node.path
  const paddingLeft = 10 + level * 14

  if (node.type === 'folder') {
    return (
      <div>
        <button
          type="button"
          className="flex h-8 w-full items-center gap-2 rounded-lg pr-2 text-left text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
          style={{ paddingLeft }}
          onClick={() => onToggleFolder(node.path)}
        >
          <ChevronDown className={`size-3.5 shrink-0 transition ${isCollapsed ? '-rotate-90' : ''}`} />
          <Folder className="size-4 shrink-0 text-zinc-500" />
          <span className="truncate">{node.name}</span>
        </button>
        {!isCollapsed
          ? node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                level={level + 1}
                selectedPath={selectedPath}
                collapsedFolders={collapsedFolders}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
              />
            ))
          : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`flex h-8 w-full items-center gap-2 rounded-lg pr-2 text-left text-sm transition ${
        isSelected ? 'bg-blue-500/10 text-blue-200' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
      }`}
      style={{ paddingLeft }}
      onClick={() => node.file && onSelectFile(node.file)}
    >
      <FileCode2 className="size-4 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  )
}
