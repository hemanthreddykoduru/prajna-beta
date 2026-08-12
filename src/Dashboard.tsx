import Shell from './Shell'
import { currentUser } from './user'
import { useLiveData } from './useLiveData'
import { useModuleData } from './useModuleData'
import { MODULES, type ModuleSpec } from './modules'
import { score } from './score'
import type { DashboardScoreResponse } from './fei1000.types'

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

/**
 * The KPI row.
 *
 * Only two of these have a deployed service behind them today: the PRAJNA
 * score (M14) and the pending-approval count (M13). Publications would need
 * M9 and active courses M8, neither of which is deployed — so rather than
 * showing invented numbers those tiles say so.
 */
function buildStats(
  score: DashboardScoreResponse,
  pendingCount: number | null,
  reportCount: number | null,
) {
  return [
    {
      label: 'PRAJNA Score',
      value: Number.isInteger(score.totalScore) ? `${score.totalScore}` : score.totalScore.toFixed(1),
      caption: `${score.tier} · of ${score.maxScore}`,
      highlighted: true,
      live: true,
    },
    {
      label: 'Pending Approvals',
      value: pendingCount === null ? '—' : `${pendingCount}`,
      caption: pendingCount === null ? 'Unavailable' : pendingCount === 0 ? 'Nothing awaiting you' : 'Needs review',
      live: pendingCount !== null,
    },
    {
      label: 'Reports Generated',
      value: reportCount === null ? '—' : `${reportCount}`,
      caption: reportCount === null ? 'Unavailable' : 'This campus',
      live: reportCount !== null,
    },
    {
      label: 'Publications',
      value: '—',
      caption: 'Module 9 not deployed',
      live: false,
    },
  ]
}

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

/**
 * A dashboard panel backed by one of the registry modules.
 *
 * Calls the service for real on every load. Until that module is deployed it
 * explains which one is missing; the moment it goes live the same panel starts
 * showing real rows, with no change here.
 */
function ModulePanel({ spec }: { spec: ModuleSpec }) {
  const status = useModuleData(spec)

  if (status.state === 'loading') return <p className="muted-13">Loading…</p>

  if (status.state === 'ready') {
    if (!status.rows.length) {
      return (
        <div className="panel-empty">
          <p className="panel-empty__title">Nothing yet</p>
          <p className="panel-empty__detail">
            {spec.moduleNo} is live — you have no records here yet.
          </p>
        </div>
      )
    }
    return (
      <ul className="list">
        {status.rows.slice(0, 4).map((row, i) => {
          const r = (row ?? {}) as Record<string, unknown>
          const title = r.title ?? r.name ?? r.awardName ?? `Item ${i + 1}`
          const meta = r.journalName ?? r.organizer ?? r.status ?? r.achievementDate ?? ''
          return (
            <li className="row-item" key={i}>
              <span className="row-item__text">
                <span className="row-item__title">{String(title)}</span>
                {meta ? <span className="row-item__meta">{String(meta)}</span> : null}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }

  const detail =
    status.state === 'forbidden'
      ? status.reason
      : status.state === 'unhealthy'
        ? `${spec.moduleNo} is deployed but not responding.`
        : `${spec.moduleName} (${spec.moduleNo}) is not deployed yet. This panel is already wired to it.`

  return (
    <div className="panel-empty">
      <p className="panel-empty__title">
        {status.state === 'forbidden' ? 'Not available to your role' : `Waiting on ${spec.moduleNo}`}
      </p>
      <p className="panel-empty__detail">{detail}</p>
    </div>
  )
}

/** "Good morning" before noon, "Good afternoon" to 17:00, else "Good evening". */
function greeting(d: Date): string {
  const h = d.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const user = currentUser()
  const live = useLiveData()
  const now = new Date()

  const stats = buildStats(score, live.pendingCount, live.reports?.length ?? null)

  return (
    <Shell active="Home">
      <div className="pagehead">
            <h1>
              {greeting(now)}, {user.name}
            </h1>
            <p>
              {now.toLocaleDateString(undefined, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {" · Here's what needs you today."}
            </p>
          </div>

          {!user.isReal && (
            <p className="demo-banner">
              Demo mode — no backend configured. Figures below are sample data.
            </p>
          )}

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
              <div className="chart">
                {chart.map((b, i) => (
                  <div className="chart__col" key={i}>
                    {b.badge && <span className="chart__badge">{b.badge}</span>}
                    <span className={`chart__bar chart__bar--${b.tone}`} style={{ height: b.h }} />
                    <span className="chart__day">{b.day}</span>
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
              {user.isReal ? (
                // Driven by the module registry: this calls M9 for real and
                // renders whatever comes back, so it starts working by itself
                // once Research is deployed.
                <ModulePanel spec={MODULES.research} />
              ) : (
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
              )}
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
              {user.isReal ? (
                <ModulePanel spec={MODULES.teaching} />
              ) : (
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
              )}
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
                  <span className="dot dot--light" />
                  Running
                </span>
              </div>
              <div className="focus__clock">
                <p className="focus__time">01:24:08</p>
                <p className="focus__sub">Today's deep work</p>
              </div>
              <div className="focus__actions">
                <button className="focus__btn focus__btn--primary" type="button" aria-label="Pause">
                  <img src={iconPause} alt="" />
                </button>
                <button className="focus__btn" type="button" aria-label="Stop">
                  <img src={iconStop} alt="" />
                </button>
                <span className="focus__hint">Pause session</span>
              </div>
            </section>
          </div>
    </Shell>
  )
}
