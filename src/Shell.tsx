import type { ReactNode } from 'react'
import './Dashboard.css'
import { currentUser } from './user'
import { signOut } from './auth'

import navHome from './assets/dash/nav-home.svg'
import navScore from './assets/dash/nav-score.svg'
import navProfile from './assets/dash/nav-profile.svg'
import navTeaching from './assets/dash/nav-teaching.svg'
import navResearch from './assets/dash/nav-research.svg'
import navAdmin from './assets/dash/nav-admin.svg'
import navAchievements from './assets/dash/nav-achievements.svg'
import navFdp from './assets/dash/nav-fdp.svg'
import navTodo from './assets/dash/nav-todo.svg'
import navLeaderboard from './assets/dash/nav-leaderboard.svg'
import navAi from './assets/dash/nav-ai.svg'
import navLogout from './assets/dash/nav-logout.svg'
import iconSearch from './assets/dash/search.svg'
import iconBell from './assets/dash/notifications.svg'
import prajnaLogo from './assets/PRAJNA-LOGO-CROP.jpeg'

/**
 * Sidebar entries.
 *
 * `href` means the page exists and its backing service is deployed.
 * `blocked` names the module that has to ship before the tab can do anything —
 * shown on hover and on the placeholder page, so a dead tab explains itself
 * instead of silently doing nothing when clicked.
 */
const nav: { icon: string; label: string; href?: string; blocked?: string }[] = [
  { icon: navHome, label: 'Home', href: '/dashboard' },
  { icon: navScore, label: 'PRAJNA Score', href: '/prajnascore' },
  { icon: navLeaderboard, label: 'Leaderboard', href: '/leaderboard' },
  { icon: navProfile, label: 'Profile', blocked: 'Module 7 (Profile) is deployed but its Lambda fails to start — missing bundled dependencies.' },
  { icon: navTeaching, label: 'Teaching', blocked: 'Module 8 (Course Deliverables & Teaching) is not deployed — its stack rolled back.' },
  { icon: navResearch, label: 'Research', blocked: 'Module 9 (Research & Innovation) is not deployed.' },
  { icon: navAdmin, label: 'Admin', blocked: 'Module 12 (Administrative & Lifecycle) is not deployed.' },
  { icon: navAchievements, label: 'Achievements', blocked: 'Module 10 (Achievements & Recognition) is not deployed.' },
  { icon: navFdp, label: 'FDP & Growth', blocked: 'Module 11 (Faculty Development & Growth) is not deployed.' },
  { icon: navTodo, label: 'To-Do', blocked: 'Module 23 (Dynamic To-Do Engine) is not deployed.' },
  { icon: navAi, label: 'AI Companion', blocked: 'Module 20 (AI Companion) is not deployed.' },
]

export { nav }

/** Sidebar + topbar chrome shared by every signed-in page. */
export default function Shell({ active, children }: { active: string; children: ReactNode }) {
  const user = currentUser()

  return (
    <div className="dash">
      <nav className="sidebar">
        <div className="sidebar__logo">
          <img src={prajnaLogo} alt="PRAJNA" style={{ maxHeight: '56px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <p className="sidebar__section">MENU</p>
        <ul className="sidebar__nav">
          {nav.map((item) => (
            <li key={item.label}>
              <a
                className={
                  `navitem${item.label === active ? ' navitem--active' : ''}` +
                  (item.blocked ? ' navitem--blocked' : '')
                }
                // Blocked tabs still route, to a page that explains which module
                // is missing. Previously they were `#Label` anchors that simply
                // did nothing when clicked.
                href={item.href ?? `/unavailable/${encodeURIComponent(item.label)}`}
                title={item.blocked ?? undefined}
                aria-disabled={item.blocked ? true : undefined}
              >
                <img src={item.icon} alt="" />
                {item.label}
                {item.blocked && <span className="navitem__soon">soon</span>}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="navitem sidebar__logout"
          href="/login"
          onClick={(e) => {
            // The old link navigated to /login but left the session in
            // localStorage, so the route guard let you straight back in.
            e.preventDefault()
            signOut()
            window.location.assign('/login')
          }}
        >
          <img src={navLogout} alt="" />
          Log out
        </a>
      </nav>

      <div className="main">
        <header className="topbar">
          <div className="search">
            <img src={iconSearch} alt="" />
            <input type="search" placeholder="Search publications, courses, tasks…" aria-label="Search" />
          </div>
          <button className="topbar__bell" type="button" aria-label="Notifications">
            <img src={iconBell} alt="" />
          </button>
          <div className="profile">
            <span className="avatar avatar--green">{user.initials}</span>
            <span className="profile__identity">
              <span className="profile__name">{user.name}</span>
              <span className="profile__meta">
                {[user.department, user.campus].filter(Boolean).join(' · ')}
              </span>
            </span>
          </div>
        </header>

        <div className="content">{children}</div>
      </div>
    </div>
  )
}
