import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, GitBranch, Loader2, LogOut, Play, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Breadcrumb } from '../components/github/Breadcrumb'
import { ConnectGithubState } from '../components/github/ConnectGithubState'
import { FileTree } from '../components/github/FileTree'
import { RepositorySidebar } from '../components/github/RepositorySidebar'
import { CodeEditor } from '../components/editor/CodeEditor'
import { EmptyReviewState } from '../components/review/EmptyReviewState'
import { ReviewResults } from '../components/review/ReviewResults'
import { ReviewSkeleton } from '../components/review/ReviewSkeleton'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { getApiErrorMessage } from '../services/apiClient'
import { fetchGithubFile, fetchGithubRepos, fetchGithubTree, reviewGithubFile } from '../services/githubService'
import type { GithubFileContent, GithubRepository, GithubTreeItem } from '../types/github'
import type { ReviewResponse } from '../types/review'
import { getLanguageFromPath } from '../utils/fileLanguage'
import {
  clearGithubToken,
  getStoredGithubToken,
  readGithubTokenFromUrl,
  removeGithubTokenFromUrl,
  storeGithubToken,
} from '../utils/githubToken'

export function GitHubPage() {
  const [token, setToken] = useState(() => readGithubTokenFromUrl() ?? getStoredGithubToken())
  const [repos, setRepos] = useState<GithubRepository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<GithubRepository | null>(null)
  const [tree, setTree] = useState<GithubTreeItem[]>([])
  const [selectedFile, setSelectedFile] = useState<GithubFileContent | null>(null)
  const [review, setReview] = useState<ReviewResponse | null>(null)
  const [isLoadingRepos, setIsLoadingRepos] = useState(false)
  const [isLoadingTree, setIsLoadingTree] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const language = useMemo(() => getLanguageFromPath(selectedFile?.path ?? ''), [selectedFile?.path])

  useEffect(() => {
    const tokenFromUrl = readGithubTokenFromUrl()
    if (!tokenFromUrl) return

    storeGithubToken(tokenFromUrl)
    setToken(tokenFromUrl)
    removeGithubTokenFromUrl()
  }, [])

  useEffect(() => {
    if (!token) return
    void loadRepos(token)
  }, [token])

  async function loadRepos(nextToken = token) {
    if (!nextToken) return
    setIsLoadingRepos(true)
    setError(null)

    try {
      const result = await fetchGithubRepos(nextToken)
      setRepos(result)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoadingRepos(false)
    }
  }

  async function handleSelectRepo(repo: GithubRepository) {
    setSelectedRepo(repo)
    setSelectedFile(null)
    setReview(null)
    setTree([])
    setIsLoadingTree(true)
    setError(null)

    try {
      const result = await fetchGithubTree(token!, repo.full_name)
      setTree(result)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoadingTree(false)
    }
  }

  async function handleSelectFile(file: GithubTreeItem) {
    if (!selectedRepo || !token) return
    setIsLoadingFile(true)
    setError(null)
    setReview(null)

    try {
      const result = await fetchGithubFile(token, selectedRepo.full_name, file.path)
      setSelectedFile(result)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoadingFile(false)
    }
  }

  async function handleAnalyzeSelectedFile() {
    if (!token || !selectedRepo || !selectedFile) return
    setIsReviewing(true)
    setError(null)

    try {
      const result = await reviewGithubFile(token, selectedRepo.full_name, selectedFile.path)
      setReview(result)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsReviewing(false)
    }
  }

  function handleDisconnect() {
    clearGithubToken()
    setToken(null)
    setRepos([])
    setSelectedRepo(null)
    setTree([])
    setSelectedFile(null)
    setReview(null)
    setError(null)
  }

  if (!token) return <ConnectGithubState />

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1700px] flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
              <GitBranch className="size-3.5 text-blue-300" />
              GitHub workspace
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Analyze repository files</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Search repositories, inspect file trees, preview code, and run AI review on a selected file.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              icon={<RefreshCw className="size-4" />}
              disabled={isLoadingRepos}
              onClick={() => void loadRepos()}
            >
              Refresh
            </Button>
            <Button type="button" variant="ghost" icon={<LogOut className="size-4" />} onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid min-h-[calc(100vh-210px)] gap-5 xl:grid-cols-[330px_minmax(300px,390px)_minmax(0,1fr)]">
          <RepositorySidebar
            repos={repos}
            selectedRepo={selectedRepo}
            isLoading={isLoadingRepos}
            onSelectRepo={handleSelectRepo}
          />

          <FileTree
            files={tree}
            selectedPath={selectedFile?.path}
            isLoading={isLoadingTree}
            onSelectFile={handleSelectFile}
          />

          <section className="flex min-w-0 flex-col gap-5">
            <Card className="p-4">
              <div className="mb-4 grid gap-3 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
                <div className="min-w-0">
                  <Breadcrumb repoName={selectedRepo?.full_name} path={selectedFile?.path} />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  icon={isReviewing ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                  disabled={!selectedFile || isReviewing}
                  onClick={handleAnalyzeSelectedFile}
                  className="h-10 w-full whitespace-nowrap px-4 text-sm 2xl:w-auto"
                >
                  {isReviewing ? 'Analyzing' : 'Analyze file'}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {isLoadingFile ? (
                  <motion.div
                    key="loading-file"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid h-[560px] place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-500"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-blue-300" />
                      Loading file content
                    </span>
                  </motion.div>
                ) : selectedFile ? (
                  <motion.div key={selectedFile.path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CodeEditor value={selectedFile.content} language={language} onChange={(content) => setSelectedFile({ ...selectedFile, content })} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid h-[560px] place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-center"
                  >
                    <div className="max-w-sm px-6">
                      <div className="mx-auto grid size-12 place-items-center rounded-xl border border-zinc-800 bg-[#111113] text-blue-300">
                        <GitBranch className="size-5" />
                      </div>
                      <h2 className="mt-5 text-lg font-semibold text-white">Select a file</h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Choose a repository, then open a file from the tree to preview it here.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <div>
              {isReviewing ? <ReviewSkeleton /> : review ? <ReviewResults result={review} /> : <EmptyReviewState />}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
