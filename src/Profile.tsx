import type { ReactNode } from 'react'
import Shell from './Shell'
import './Profile.css'

import iconPlus from './assets/dash/plus.svg'
import iconCalendar from './assets/dash/calendar.svg'
import iconProfile from './assets/dash/nav-profile.svg'
import iconSparkle from './assets/dash/sparkle.svg'
import iconChartSquare from './assets/dash/chart-square.svg'

const tabs = [
  { label: 'Overview', href: '/profile' },
  { label: 'Research', href: '/profile/research' },
  { label: 'Publications', href: '/profile/publications' },
  { label: 'Projects', href: '/profile/projects' },
  { label: 'Achievements', href: '/profile/achievements' },
  { label: 'Teaching', href: '/profile/teaching' },
  { label: 'Service', href: '/profile/service' },
]

const stats = [
  { colour: '#007367', value: '48', label: 'Publications' },
  { colour: '#8bcbb7', value: '1,245', label: 'Citations' },
  { colour: '#5e95cd', value: '18', label: 'h-index' },
  { colour: '#a58255', value: '24', label: 'i10-index' },
  { colour: '#d8c08e', value: '5', label: 'Ongoing Projects' },
  { colour: '#dd736e', value: '9', label: 'Awards' },
]

const interests = ['Artificial Intelligence', 'Machine Learning', 'Data Mining', 'Big Data Analytics', 'Healthcare AI']

const expertise = [
  'Machine Learning',
  'Data Mining',
  'Big Data Analytics',
  'Natural Language Processing',
  'AI Ethics',
  'Deep Learning',
  'Cloud Computing',
]

const contact = [
  'ananya.rao@gitam.edu',
  '+91 98765 43210',
  'Bengaluru, Karnataka, India',
  'Block C, Room 214 · CSE Dept.',
]

const snapshot = [
  { label: 'Research', percent: 40 },
  { label: 'Teaching', percent: 30 },
  { label: 'Innovation', percent: 18 },
]

/** Identity card + tab row — the frame every profile tab renders inside. */
export function ProfilePage({
  subtitle,
  active,
  actions,
  children,
}: {
  subtitle: string
  active: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <Shell active="Profile">
      <div className="pagehead pagehead--score">
        <div>
          <h1>Faculty Profile</h1>
          <p>{subtitle}</p>
        </div>
        {actions ? <div className="profile__actions">{actions}</div> : null}
      </div>

      <section className="card identity">
        <div className="identity__row">
          <span className="identity__avatar">
            AR
            <span className="identity__online" />
          </span>
          <div className="identity__text">
            <h2>Dr. Ananya Rao</h2>
            <p className="identity__role">Professor</p>
            <p className="identity__line">Department of Computer Science &amp; Engineering</p>
            <p className="identity__line">School of Technology · GITAM Bengaluru</p>
            <p className="identity__meta">Faculty ID: FAC-CSE-1042 · Joined Jun 2011 · 15+ Years Experience</p>
            <p className="identity__meta">ananya.rao@gitam.edu · +91 98765 43210 · Bengaluru, Karnataka, India</p>
          </div>
        </div>

        {/* ponytail: only Overview has a design — the rest stay inert until they do */}
        <div className="profile__tabs">
          {tabs.map((t) => (
            <a
              className={`profile__tab${t.label === active ? ' profile__tab--active' : ''}`}
              href={t.href ?? `#${t.label}`}
              key={t.label}
            >
              {t.label}
            </a>
          ))}
        </div>
      </section>

      {children}
    </Shell>
  )
}

export default function Profile() {
  return (
    <ProfilePage
      subtitle="Your academic identity, career snapshot, and portfolio"
      active="Overview"
      actions={
        <>
          <button className="btn-solid btn-solid--icon" type="button">
            <img src={iconPlus} alt="" />
            Edit Profile
          </button>
          <button className="chip chip--lg" type="button">
            <img src={iconCalendar} alt="" />
            Download CV
          </button>
        </>
      }
    >

      <div className="stat-strip stat-strip--profile">
        {stats.map((s) => (
          <div className="card stat-mini" key={s.label}>
            <span className="dot" style={{ background: s.colour }} />
            <span className="stat-mini__big">{s.value}</span>
            <span className="stat-mini__meta">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card about">
            <h2 className="profile__heading">
              <img src={iconProfile} alt="" />
              About Me
            </h2>
            <p className="about__body">
              I am a Professor in the Department of Computer Science &amp; Engineering with 15+ years of teaching and
              research experience. My work focuses on Machine Learning, Data Mining, and Big Data Analytics, with an
              emphasis on real-world applications in healthcare and education technology. I actively mentor PhD scholars
              and collaborate with industry partners on applied AI research.
            </p>
            <p className="about__label">Research Interests</p>
            <ul className="tags">
              {interests.map((t) => (
                <li className="tag tag--solid" key={t}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="card about">
            <ul className="tags">
              {expertise.map((t) => (
                <li className="tag" key={t}>
                  {t}
                </li>
              ))}
            </ul>
            <h2 className="profile__heading">
              <img src={iconSparkle} alt="" />
              Expertise Areas
            </h2>
          </section>
        </div>

        <div className="profile__side">
          <section className="card">
            <h2 className="profile__heading">
              <img src={iconProfile} alt="" />
              Contact Information
            </h2>
            <ul className="contact">
              {contact.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="profile__heading">
              <img src={iconChartSquare} alt="" />
              Academic Snapshot
            </h2>
            <ul className="snapshot">
              {snapshot.map((s) => (
                <li key={s.label}>
                  <span className="snapshot__row">
                    <span>{s.label}</span>
                    <span className="snapshot__pct">{s.percent}%</span>
                  </span>
                  <span className="track">
                    <span style={{ width: `${s.percent}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </ProfilePage>
  )
}
