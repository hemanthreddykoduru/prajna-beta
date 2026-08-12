import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'
import PrajnaScore from './PrajnaScore.tsx'
import TierProgress from './TierProgress.tsx'
import History from './History.tsx'

// ponytail: pathname switch instead of a router — no back/forward-aware
// navigation, links do full page loads. Add react-router when a route needs
// params or client-side transitions.
const routes: Record<string, typeof App> = {
  '/login': App,
  '/dashboard': Dashboard,
  '/prajnascore': PrajnaScore,
  '/prajnascore/tier': TierProgress,
  '/prajnascore/history': History,
}
const Page = routes[window.location.pathname] ?? App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
