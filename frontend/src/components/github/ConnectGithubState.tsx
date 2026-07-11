import { motion } from 'framer-motion'
import { GitBranch, LockKeyhole, Sparkles } from 'lucide-react'
import { githubLoginUrl } from '../../services/githubService'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function ConnectGithubState() {
  return (
    <div className="grid min-h-[calc(100vh-86px)] place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl"
      >
        <Card className="overflow-hidden p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
            <GitBranch className="size-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">Connect GitHub</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Browse repositories, open files in Monaco, and send selected code to the analyzer without leaving the workspace.
          </p>

          <div className="mt-6 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-left">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Sparkles className="size-4 text-blue-300" />
              Repository search and fast file filtering
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <LockKeyhole className="size-4 text-emerald-300" />
              Token stored locally in this browser
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            className="mt-7 w-full sm:w-auto"
            icon={<GitBranch className="size-4" />}
            onClick={() => {
              window.location.href = githubLoginUrl
            }}
          >
            Continue with GitHub
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}
