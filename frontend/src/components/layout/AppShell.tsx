import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Activity, GitBranch, History, ScanLine } from 'lucide-react'
import { Button } from '../ui/Button'

export function AppShell() {
  const navigate = useNavigate()
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? 'border border-zinc-800 bg-zinc-900 text-white'
        : 'text-zinc-500 hover:bg-zinc-900/70 hover:text-zinc-300'
    }`

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.16),transparent_55%)]" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-[#0c0c0f]/80 px-4 py-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300">
              <ScanLine className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">Code Analyzer</p>
              <p className="text-xs text-zinc-500">AI code review</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <NavLink className={navLinkClass} to="/">
              {({ isActive }) => (
                <>
                  <Activity className={`size-4 ${isActive ? 'text-blue-300' : ''}`} />
                  Analyze
                </>
              )}
            </NavLink>
            <NavLink className={navLinkClass} to="/github">
              {({ isActive }) => (
                <>
                  <GitBranch className={`size-4 ${isActive ? 'text-blue-300' : ''}`} />
                  GitHub
                </>
              )}
            </NavLink>
            <NavLink className={navLinkClass} to="/history">
              {({ isActive }) => (
                <>
                  <History className={`size-4 ${isActive ? 'text-blue-300' : ''}`} />
                  History
                </>
              )}
            </NavLink>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#09090B]/85 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="grid size-9 place-items-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300">
                  <ScanLine className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Code Analyzer</p>
                  <p className="text-xs text-zinc-500">Review workspace</p>
                </div>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-medium text-zinc-300">Review workspace</p>
                <p className="text-xs text-zinc-600">Paste code, select a language, and run AI analysis.</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  icon={<History className="size-4" />}
                  onClick={() => navigate('/history')}
                >
                  History
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<GitBranch className="size-4" />}
                  onClick={() => navigate('/github')}
                >
                  GitHub
                </Button>
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
