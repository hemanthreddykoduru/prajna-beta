import { useState, useEffect } from 'react'
import Shell from './Shell'

import iconPlus from './assets/dash/plus.svg'
import iconPause from './assets/dash/pause.svg'
import iconStop from './assets/dash/stop.svg'
import iconArrow from './assets/dash/arrow-up-right.svg'
import iconArrowLight from './assets/dash/arrow-up-right-light.svg'
import iconTrend from './assets/dash/trend.svg'
import iconTrendLight from './assets/dash/trend-light.svg'
import iconClock from './assets/dash/clock.svg'
import iconVideo from './assets/dash/video.svg'
import docBlue from './assets/dash/doc-blue.svg'
import docGold from './assets/dash/doc-gold.svg'
import docCoral from './assets/dash/doc-coral.svg'
import docGreen from './assets/dash/doc-green.svg'

const stats = [
  { label: 'Publications', value: '24', caption: '+3 this month', highlighted: true },
  { label: 'Active Courses', value: '6', caption: 'Spring semester' },
  { label: 'Research Projects', value: '4', caption: '2 ongoing' },
  { label: 'Pending Approvals', value: '2', caption: 'Needs review' },
]

// height in px, tone, weekday label — straight from the design
const chart = [
  { h: 60, tone: 'light', day: 'S' },
  { h: 110, tone: 'dark', day: 'M' },
  { h: 90, tone: 'light', day: 'T' },
  { h: 135, tone: 'dark', day: 'W', badge: '8h' },
  { h: 100, tone: 'light', day: 'T' },
  { h: 50, tone: 'light', day: 'F' },
  { h: 80, tone: 'light', day: 'S' },
]

const publications = [
  { icon: docBlue, tint: 'blue', title: 'Deep Learning for NLP', meta: 'IEEE · Dec 2025' },
  { icon: docGold, tint: 'gold', title: 'Graph Neural Networks', meta: 'Springer · Nov 2025' },
  { icon: docCoral, tint: 'coral', title: 'Edge Computing Survey', meta: 'Elsevier · Oct 2025' },
  { icon: docGreen, tint: 'green', title: 'Quantum ML Review', meta: 'ACM · Sep 2025' },
]

const mentees = [
  { initials: 'RV', avatar: 'green', name: 'Rahul Verma', work: 'Working on GNN Architectures', status: 'Completed' },
  { initials: 'PN', avatar: 'gold', name: 'Priya Nair', work: 'Distributed Systems Lab', status: 'In Progress' },
  { initials: 'AD', avatar: 'coral', name: 'Arjun Das', work: 'Edge AI Survey paper', status: 'Pending' },
  { initials: 'SI', avatar: 'blue', name: 'Sneha Iyer', work: 'NLP Pipeline project', status: 'In Progress' },
] as const

const statusTone: Record<string, string> = {
  Completed: 'completed',
  'In Progress': 'progress',
  Pending: 'pending',
}

const goals = [
  { tone: 'completed', label: 'Completed', value: 12 },
  { tone: 'progress', label: 'In Progress', value: 5 },
  { tone: 'pending', label: 'Pending', value: 3 },
]

const GOAL_PERCENT = 68

export default function Dashboard() {
  const [focusSeconds, setFocusSeconds] = useState(5048) // 01:24:08 initial
  const [isFocusRunning, setIsFocusRunning] = useState(true)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isFocusRunning) {
      interval = setInterval(() => {
        setFocusSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isFocusRunning])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <Shell active="Home">
      <div className="pagehead">
            <h1>Good morning, Dr. Ananya Rao</h1>
            <p>Sunday, 29 June 2026 · Here's what needs you today.</p>
          </div>

          <div className="row row--kpis">
            {stats.map((s) => (
              <div className={`card stat${s.highlighted ? ' stat--hl' : ''}`} key={s.label}>
                <div className="stat__head">
                  <span className="stat__label">{s.label}</span>
                  <span className="stat__btn">
                    <img src={s.highlighted ? iconArrowLight : iconArrow} alt="" />
                  </span>
                </div>
                <p className="stat__value">{s.value}</p>
                <p className="stat__caption">
                  <img src={s.highlighted ? iconTrendLight : iconTrend} alt="" />
                  {s.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="row row--insights">
            <section className="card analytics">
              <div className="card__head">
                <h2>Teaching &amp; Research Activity</h2>
                <span className="card__meta">This week</span>
              </div>
              <div className="analytics-chart">
                {chart.map((b, i) => (
                  <div className="analytics-chart__col" key={i}>
                    {b.badge && <span className="analytics-chart__badge">{b.badge}</span>}
                    <span className={`analytics-chart__bar analytics-chart__bar--${b.tone}`} style={{ height: b.h }} />
                    <span className="analytics-chart__day">{b.day}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card reminders">
              <h2>Reminders</h2>
              <div className="meeting">
                <p className="meeting__kicker">UPCOMING</p>
                <p className="meeting__title">Department Review Meeting</p>
                <p className="meeting__time">
                  <img src={iconClock} alt="" />
                  02:00 PM – 04:00 PM
                </p>
              </div>
              <button className="btn-pill" type="button">
                <img src={iconVideo} alt="" />
                Start Meeting
              </button>
            </section>

            <section className="card pubs">
              <div className="card__head">
                <h2>Recent Publications</h2>
                <button className="chip" type="button">
                  <img src={iconPlus} alt="" />
                  New
                </button>
              </div>
              <ul className="list">
                {publications.map((p) => (
                  <li className="row-item" key={p.title}>
                    <span className={`iconsq iconsq--${p.tint}`}>
                      <img src={p.icon} alt="" />
                    </span>
                    <span className="row-item__text">
                      <span className="row-item__title">{p.title}</span>
                      <span className="row-item__meta">{p.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="row row--activity">
            <section className="card mentees">
              <div className="card__head">
                <h2>Student Mentees</h2>
                <button className="chip" type="button">
                  <img src={iconPlus} alt="" />
                  Add Member
                </button>
              </div>
              <ul className="list">
                {mentees.map((m) => (
                  <li className="row-item" key={m.name}>
                    <span className={`avatar avatar--${m.avatar}`}>{m.initials}</span>
                    <span className="row-item__text">
                      <span className="row-item__title">{m.name}</span>
                      <span className="row-item__meta">{m.work}</span>
                    </span>
                    <span className={`badge badge--${statusTone[m.status]}`}>
                      <span className="dot" />
                      {m.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card goals">
              <h2>Goal Progress</h2>
              <div className="gauge-area">
                {/* ponytail: conic-gradient ring instead of the exported SVG arcs —
                    swap for an SVG if the cap shape or animation matters */}
                <div
                  className="gauge"
                  style={{ ['--pct' as string]: `${GOAL_PERCENT}%` }}
                  role="img"
                  aria-label={`${GOAL_PERCENT} percent of goals met`}
                >
                  <span className="gauge__value">{GOAL_PERCENT}%</span>
                  <span className="gauge__label">Goals met</span>
                </div>
              </div>
              <ul className="legend">
                {goals.map((g) => (
                  <li key={g.label}>
                    <span className={`dot dot--${g.tone}`} />
                    <span className="legend__label">{g.label}</span>
                    <span className="legend__value">{g.value}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card focus">
              <div className="card__head">
                <h2>Focus Timer</h2>
                <span className="focus__state">
                  <span className={`dot ${isFocusRunning ? 'dot--light' : 'dot--coral'}`} />
                  {isFocusRunning ? 'Running' : 'Paused'}
                </span>
              </div>
              <div className="focus__clock">
                <p className="focus__time">{formatTime(focusSeconds)}</p>
                <p className="focus__sub">Today's deep work</p>
              </div>
              <div className="focus__actions">
                <button 
                  className={`focus__btn ${isFocusRunning ? 'focus__btn--primary' : ''}`} 
                  type="button" 
                  aria-label={isFocusRunning ? "Pause" : "Start"}
                  onClick={() => setIsFocusRunning(!isFocusRunning)}
                  style={!isFocusRunning ? { background: 'var(--green)', color: 'white' } : {}}
                >
                  {isFocusRunning ? <img src={iconPause} alt="Pause" /> : '▶'}
                </button>
                <button 
                  className="focus__btn" 
                  type="button" 
                  aria-label="Stop"
                  onClick={() => { setIsFocusRunning(false); setFocusSeconds(0); }}
                >
                  <img src={iconStop} alt="Stop" />
                </button>
                <span className="focus__hint">{isFocusRunning ? 'Pause session' : 'Resume session'}</span>
              </div>
            </section>
          </div>
    </Shell>
  )
}
