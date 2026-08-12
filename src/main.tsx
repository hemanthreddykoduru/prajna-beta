import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { isBackendConfigured } from './config'
import { getSession } from './auth'
import { fetchScore } from './api'
import { hydrateScore } from './score'

/**
 * Bootstrap.
 *
 * The screen modules derive module-scope constants from the `score` binding
 * (e.g. `const current = bandOf(score.totalScore)` in TierProgress), so they
 * must not be imported until the real score is in place — otherwise they
 * capture the bundled mock. Hence: hydrate first, THEN dynamically import the
 * screens, then render.
 *
 * With no backend configured, or no session, the app renders on the bundled
 * mock exactly as before. Losing the API must never mean a blank page.
 */
async function bootstrap() {
  const session = getSession()

  if (isBackendConfigured && session) {
    try {
      hydrateScore(await fetchScore(session.facultyId))
    } catch (err) {
      // A failed score fetch degrades to mock data rather than blocking sign-in.
      console.error('[prajna] score fetch failed; rendering bundled sample data', err)
    }
  }

  const [
    { default: App },
    { default: Dashboard },
    { default: PrajnaScore },
    { default: TierProgress },
    { default: History },
    { default: Leaderboard },
    { default: ModulePage },
  ] = await Promise.all([
    import('./App.tsx'),
    import('./Dashboard.tsx'),
    import('./PrajnaScore.tsx'),
    import('./TierProgress.tsx'),
    import('./History.tsx'),
    import('./Leaderboard.tsx'),
    import('./ModulePage.tsx'),
  ])

  /** Sends unauthenticated visitors to the login screen. */
  function Protected({ children }: { children: React.ReactNode }) {
    // Backend not configured -> demo mode, everything is viewable.
    if (!isBackendConfigured) return <>{children}</>
    return getSession() ? <>{children}</> : <Navigate to="/login" replace />
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<App />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/prajnascore" element={<Protected><PrajnaScore /></Protected>} />
          <Route path="/prajnascore/tier" element={<Protected><TierProgress /></Protected>} />
          <Route path="/prajnascore/history" element={<Protected><History /></Protected>} />
          <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="/m/:label" element={<Protected><ModulePage /></Protected>} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  )
}

void bootstrap()
