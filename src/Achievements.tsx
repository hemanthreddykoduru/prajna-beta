import Shell from './Shell'
import { Bars } from './ProfileResearch'
import './Achievements.css'

import iconPlus from './assets/dash/plus.svg'
import iconExport from './assets/dash/achv-export.svg'
import iconAward from './assets/dash/achv-stat-award.svg'
import iconNational from './assets/dash/achv-stat-national.svg'
import iconIntl from './assets/dash/achv-stat-intl.svg'
import iconGrant from './assets/dash/achv-stat-grant.svg'
import iconCert from './assets/dash/achv-stat-cert.svg'
import iconRecognition from './assets/dash/achv-stat-recognition.svg'
import iconTrophyBig from './assets/dash/achv-trophy-big.svg'
import iconCatResearch from './assets/dash/achv-cat-research.svg'
import iconCatTeaching from './assets/dash/achv-cat-teaching.svg'
import iconCatInnovation from './assets/dash/achv-cat-innovation.svg'
import iconCatFdp from './assets/dash/achv-cat-fdp.svg'
import iconCatCommunity from './assets/dash/achv-cat-community.svg'
import iconCatLeadership from './assets/dash/achv-cat-leadership.svg'

const tabs = ['Dashboard', 'Achievement Details', 'Analytics']

const stats = [
  { icon: iconAward, tint: 'green', value: '15', label: 'Total Awards', meta: '+3 this year' },
  { icon: iconNational, tint: 'gold', value: '7', label: 'National Awards', meta: '47% of total' },
  { icon: iconIntl, tint: 'blue', value: '3', label: 'International Awards', meta: 'IEEE, Springer +1' },
  { icon: iconGrant, tint: 'mint', value: '2', label: 'Grants Received', meta: '₹18.5L funded' },
  { icon: iconCert, tint: 'beige', value: '2', label: 'Certificates', meta: 'FDP + Reviewer' },
  { icon: iconRecognition, tint: 'coral', value: '2', label: 'Recognitions', meta: 'Editorial & peer review' },
]

const categories = [
  { icon: iconCatResearch, tint: 'green', name: 'Research', count: '6 Achievements', percent: 40 },
  { icon: iconCatTeaching, tint: 'mint', name: 'Teaching', count: '2 Achievements', percent: 13 },
  { icon: iconCatInnovation, tint: 'gold', name: 'Innovation', count: '2 Achievements', percent: 13 },
  { icon: iconCatFdp, tint: 'blue', name: 'FDP', count: '2 Achievements', percent: 13 },
  { icon: iconCatCommunity, tint: 'beige', name: 'Community Service', count: '1 Achievement', percent: 7 },
  { icon: iconCatLeadership, tint: 'coral', name: 'Leadership', count: '2 Achievements', percent: 13 },
]

/** 2029:23685 — Achievements (sidebar page) */
export default function Achievements() {
  return (
    <Shell active="Achievements">
      <div className="pagehead pagehead--score">
        <div>
          <h1>Achievements</h1>
          <p>Celebrate your recognitions, awards, and milestones</p>
        </div>
        <div className="profile__actions">
          <button className="btn-solid btn-solid--icon" type="button">
            <img src={iconPlus} alt="" />
            Add Achievement
          </button>
          <button className="chip chip--lg" type="button">
            <img src={iconExport} alt="" />
            Export
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t, i) => (
          <button className={`tab${i === 0 ? ' tab--active' : ''}`} type="button" key={t}>
            {t}
          </button>
        ))}
      </div>

      <div className="ach-stats">
        {stats.map((s) => (
          <div className="card ach-stat" key={s.label}>
            <span className={`ach-icon ach-icon--${s.tint}`}>
              <img src={s.icon} alt="" />
            </span>
            <span className="ach-stat__value">{s.value}</span>
            <span className="ach-stat__label">{s.label}</span>
            <span className="ach-stat__meta">{s.meta}</span>
          </div>
        ))}
      </div>

      <section className="card featured">
        <div className="featured__body">
          <div className="featured__badges">
            <span className="pill pill--star">★ FEATURED ACHIEVEMENT</span>
            <span className="pill pill--outline">International Level</span>
          </div>
          <h2 className="featured__title">IEEE Best Paper Award</h2>
          <p className="featured__meta">IEEE International Conference on Data Engineering · Research · January 2026</p>
          <p className="featured__desc">
            Recognized for "Graph Neural Networks for Real-Time Code Search", selected as Best Paper among 400+
            submissions from 32 countries.
          </p>
          <div className="featured__actions">
            <button className="chip chip--on-dark" type="button">
              View Full Details
            </button>
            <button className="chip chip--on-dark chip--solid" type="button">
              Download Certificate
            </button>
          </div>
        </div>
        <div className="featured__trophy">
          <span className="featured__trophy-circle">
            <img src={iconTrophyBig} alt="" />
          </span>
          <span className="featured__trophy-caption">Top Achievement · 2026</span>
        </div>
      </section>

      <section>
        <h2 className="section__title">Achievement Categories</h2>
        <div className="ach-cat-grid">
          {categories.map((c) => (
            <div className="card ach-cat" key={c.name}>
              <span className={`ach-icon ach-icon--${c.tint}`}>
                <img src={c.icon} alt="" />
              </span>
              <span className="ach-cat__text">
                <span className="ach-cat__name">{c.name}</span>
                <span className="muted-12">{c.count}</span>
              </span>
              <span className="ach-cat__percent">{c.percent}%</span>
              <span className="track ach-cat__track">
                <span className={`ach-fill ach-fill--${c.tint}`} style={{ width: `${c.percent}%` }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <AchievementsTimeline />
      <AnalyticsPreview />
      <QuickInsights />
    </Shell>
  )
}

const timeline = [
  { date: 'Mar 2026', title: 'Best Researcher Award', meta: 'Research · GITAM University', tag: 'National', dot: 'gold' },
  { date: 'Feb 2026', title: 'Best Teacher Award', meta: 'Teaching · GITAM University', tag: 'Institutional', dot: 'mint' },
  { date: 'Jan 2026', title: 'IEEE Best Paper Award', meta: 'Research · IEEE', tag: 'International', dot: 'green' },
  { date: 'Dec 2025', title: 'AICTE Recognition — Curriculum Design', meta: 'Teaching · AICTE', tag: 'National', dot: 'mint' },
  { date: 'Nov 2025', title: 'Springer Outstanding Reviewer', meta: 'Research · Springer Nature', tag: 'International', dot: 'green' },
  { date: 'Oct 2025', title: 'FDP Excellence Certificate', meta: 'FDP · GITAM FDC', tag: 'Institutional', dot: 'blue' },
]

const tagTone: Record<string, string> = { National: 'gold', Institutional: 'green', International: 'mint' }

const awardsByYear = [16, 24, 32, 80, 24]
const yearLabels = ["'22", "'23", "'24", "'25", "'26"]

const insights = [
  { badge: '✦ TOP CATEGORY', tone: 'green', title: 'Research leads your portfolio', body: '6 of 15 achievements (40%) are in Research — your strongest recognition area.' },
  { badge: '✦ MOST ACTIVE YEAR', tone: 'gold', title: '2025 was your peak year', body: "11 achievements recorded in 2025 — nearly 4× the prior year's pace." },
  { badge: '✦ OPPORTUNITY', tone: 'gold', title: 'AICTE Innovation Award opens soon', body: 'Nominations open August 2026 — your patent record strengthens eligibility.' },
]

function AchievementsTimeline() {
  return (
    <section className="card timeline-card">
      <div className="card__head">
        <h2>Recent Achievements</h2>
        <a className="link" href="#all-achievements">
          View All →
        </a>
      </div>
      <ol className="ach-timeline">
        {timeline.map((t, i) => (
          <li key={t.title}>
            <span className="ach-timeline__date">{t.date}</span>
            <span className="ach-timeline__rail">
              <span className={`ach-timeline__dot ach-timeline__dot--${t.dot}`} />
              {i < timeline.length - 1 ? <span className="ach-timeline__line" /> : null}
            </span>
            <span className="ach-timeline__text">
              <span className="ach-timeline__title">{t.title}</span>
              <span className="muted-12">{t.meta}</span>
            </span>
            <span className={`ach-tag ach-tag--${tagTone[t.tag]}`}>{t.tag}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function AnalyticsPreview() {
  return (
    <section className="card analytics-preview">
      <div className="analytics-preview__chart">
        <Bars values={awardsByYear} colour="rgba(0, 115, 103, 0.55)" />
        <div className="analytics-preview__years">
          {yearLabels.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
      </div>
      <div className="analytics-preview__body">
        <div>
          <h2>Analytics Snapshot</h2>
          <p className="muted-13">Awards by year — your recognition is accelerating</p>
        </div>
        <div className="analytics-preview__stats">
          <span>
            <span className="analytics-preview__value">268 pts</span>
            <span className="muted-12">Recognition Score</span>
          </span>
          <span>
            <span className="analytics-preview__value analytics-preview__value--gold">+83%</span>
            <span className="muted-12">YoY Growth</span>
          </span>
          <span>
            <span className="analytics-preview__value">#2 of 24</span>
            <span className="muted-12">Dept. Rank</span>
          </span>
        </div>
        <a className="btn-pill" href="#analytics">
          View Full Analytics →
        </a>
      </div>
    </section>
  )
}

function QuickInsights() {
  return (
    <section>
      <h2 className="section__title">Quick Insights</h2>
      <div className="insight-grid">
        {insights.map((i) => (
          <div className={`card insight insight--${i.tone}`} key={i.badge}>
            <span className={`insight__badge insight__badge--${i.tone}`}>{i.badge}</span>
            <p className="insight__title">{i.title}</p>
            <p className="muted-12">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
