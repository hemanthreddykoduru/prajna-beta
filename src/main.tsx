import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'
import PrajnaScore from './PrajnaScore.tsx'
import TierProgress from './TierProgress.tsx'
import History from './History.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prajnascore" element={<PrajnaScore />} />
        <Route path="/prajnascore/tier" element={<TierProgress />} />
        <Route path="/prajnascore/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
