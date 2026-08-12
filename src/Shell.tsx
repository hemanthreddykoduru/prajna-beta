import type { ReactNode } from 'react'
import './Dashboard.css'
import { currentUser } from './user'

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

const nav = [
  { icon: navHome, label: 'Home', href: '/dashboard' },
  { icon: navScore, label: 'PRAJNA Score', href: '/prajnascore' },
  { icon: navProfile, label: 'Profile' },
  { icon: navTeaching, label: 'Teaching' },
  { icon: navResearch, label: 'Research' },
  { icon: navAdmin, label: 'Admin' },
  { icon: navAchievements, label: 'Achievements' },
  { icon: navFdp, label: 'FDP & Growth' },
  { icon: navTodo, label: 'To-Do' },
  { icon: navLeaderboard, label: 'Leaderboard' },
  { icon: navAi, label: 'AI Companion' },
]

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
                className={`navitem${item.label === active ? ' navitem--active' : ''}`}
                href={item.href ?? `#${item.label}`}
              >
                <img src={item.icon} alt="" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="navitem sidebar__logout" href="/login">
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
