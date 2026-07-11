import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useGithubTokenSync } from './hooks/useGithubTokenSync'
import { GitHubPage } from './pages/GitHubPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  useGithubTokenSync()

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/github" element={<GitHubPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}
