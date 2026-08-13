import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'
import PrajnaScore from './PrajnaScore.tsx'
import TierProgress from './TierProgress.tsx'
import History from './History.tsx'
import Profile from './Profile.tsx'
import Achievements from './Achievements.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import { AuthProvider } from './AuthContext.tsx'
import {
  ProfileResearch,
  AddResearch,
  AddGrant,
  AddPatent,
  AddProject,
  AddCollaboration,
  AddScholar,
  ResearchAnalytics,
  ResearchReport,
  ResearchPortfolio,
  ProjectRecord,
} from './ProfileResearch.tsx'
import {
  ProfilePublications,
  AddPublication,
  ImportScopus,
  ImportOrcid,
  ImportScholar,
  PublicationAnalytics,
  PublicationReport,
  PublicationPortfolio,
  SyncProfiles,
  PublicationRecord,
} from './ProfilePublications.tsx'
import {
  ProfileProjects,
  AddProjectRecord,
  ProjectFullRecord,
} from './ProfileProjects.tsx'
import {
  ProjectProgressUpdate,
  ProjectAnalytics,
  ProfileAchievements,
  AddAchievement,
  AchievementRecord,
} from './ProfileAchievements.tsx'
import {
  AchievementAnalytics,
  AchievementPortfolio,
  ProfileTeaching,
  CourseRecord,
  TeachingAnalytics,
  TeachingPortfolio,
} from './ProfileTeaching.tsx'
import {
  ProfileService,
  ServiceRecord,
  ServiceAnalytics,
  ServicePortfolio,
} from './ProfileService.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<App />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
        <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile/research" element={<ProfileResearch />} />
            <Route path="/profile/research/new" element={<AddResearch />} />
            <Route path="/profile/research/grant" element={<AddGrant />} />
            <Route path="/profile/research/patent" element={<AddPatent />} />
            <Route path="/profile/research/project" element={<AddProject />} />
            <Route path="/profile/research/collaboration" element={<AddCollaboration />} />
            <Route path="/profile/research/scholar" element={<AddScholar />} />
            <Route path="/profile/research/analytics" element={<ResearchAnalytics />} />
            <Route path="/profile/research/report" element={<ResearchReport />} />
            <Route path="/profile/research/portfolio" element={<ResearchPortfolio />} />
            <Route path="/profile/research/project/:id" element={<ProjectRecord />} />
            <Route path="/profile/publications" element={<ProfilePublications />} />
            <Route path="/profile/publications/new" element={<AddPublication />} />
            <Route path="/profile/publications/scopus" element={<ImportScopus />} />
            <Route path="/profile/publications/orcid" element={<ImportOrcid />} />
            <Route path="/profile/publications/scholar" element={<ImportScholar />} />
            <Route path="/profile/publications/analytics" element={<PublicationAnalytics />} />
            <Route path="/profile/publications/report" element={<PublicationReport />} />
            <Route path="/profile/publications/portfolio" element={<PublicationPortfolio />} />
            <Route path="/profile/publications/sync" element={<SyncProfiles />} />
            <Route path="/profile/publications/record" element={<PublicationRecord />} />
            <Route path="/profile/projects" element={<ProfileProjects />} />
            <Route path="/profile/projects/new" element={<AddProjectRecord />} />
            <Route path="/profile/projects/record" element={<ProjectFullRecord />} />
            <Route path="/profile/projects/progress" element={<ProjectProgressUpdate />} />
            <Route path="/profile/projects/analytics" element={<ProjectAnalytics />} />
            <Route path="/profile/achievements" element={<ProfileAchievements />} />
            <Route path="/profile/achievements/new" element={<AddAchievement />} />
            <Route path="/profile/achievements/record" element={<AchievementRecord />} />
            <Route path="/profile/achievements/analytics" element={<AchievementAnalytics />} />
            <Route path="/profile/achievements/portfolio" element={<AchievementPortfolio />} />
            <Route path="/profile/teaching" element={<ProfileTeaching />} />
            <Route path="/profile/teaching/course" element={<CourseRecord />} />
            <Route path="/profile/teaching/analytics" element={<TeachingAnalytics />} />
            <Route path="/profile/teaching/portfolio" element={<TeachingPortfolio />} />
            <Route path="/profile/service" element={<ProfileService />} />
            <Route path="/profile/service/record" element={<ServiceRecord />} />
            <Route path="/profile/service/analytics" element={<ServiceAnalytics />} />
            <Route path="/profile/service/portfolio" element={<ServicePortfolio />} />
            <Route path="/prajnascore" element={<PrajnaScore />} />
            <Route path="/prajnascore/tier" element={<TierProgress />} />
            <Route path="/prajnascore/history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
