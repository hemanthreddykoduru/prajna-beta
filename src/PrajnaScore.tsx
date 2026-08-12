import { useRef, useState, type ReactNode } from 'react'
import Shell from './Shell'
import './PrajnaScore.css'

import { atTopTier, bandOf, bandProgress, score } from './score'

import iconSparkle from './assets/dash/sparkle.svg'
import iconCalendar from './assets/dash/calendar.svg'
import iconChartSquare from './assets/dash/chart-square.svg'
import iconActivity from './assets/dash/activity.svg'
import iconDownload from './assets/dash/download.svg'
import iconDoc from './assets/dash/doc-green.svg'

const tabs = [
  { label: 'Breakdown', href: '/prajnascore' },
  { label: 'Tier Progress', href: '/prajnascore/tier' },
  { label: 'History', href: '/prajnascore/history' },
]

const reportRanges = {
  '3m': { label: 'Last 3 Months', span: 'May – Jul 2026', slug: 'May-Jul-2026' },
  '6m': { label: 'Last 6 Months', span: 'Feb – Jul 2026', slug: 'Feb-Jul-2026' },
  '1y': { label: 'This Academic Year', span: 'Jan – Jul 2026', slug: '2025-26' },
  all: { label: 'All Time', span: '2021 – 2026', slug: '2021-2026' },
}

type ReportRange = keyof typeof reportRanges

const reportTypes = [
  { title: 'Detailed History Report', body: 'Complete score history including trend, contributions, tier milestones, and score events.' },
  { title: 'Score Summary Report', body: 'Compact overview of score growth, highest score, and key contribution metrics.' },
  { title: 'Activity Timeline Report', body: 'Chronological record of PRAJNA score changes and contribution events.' },
]

const includes = [
  ['Score Trend', 'Tier Upgrade History'],
  ['Summary Metrics', 'Contribution History'],
  ['Score History Timeline', 'At a Glance Summary'],
]

const breakdownReportTypes = [
  { title: 'Detailed Score Report', body: 'Complete breakdown of your PRAJNA score' },
  { title: 'Summary Report', body: 'Brief overview of your score and rank' },
  { title: 'Category-wise Report', body: 'Detailed report by each category' },
]

function BreakdownReportDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog className="report report--slim" ref={ref}>
      <form method="dialog" className="report__form">
        <header className="report__head">
          <div>
            <h2 className="report__title-sm">Download Report</h2>
            <p>Choose the type of report you want to download.</p>
          </div>
          <button className="report__close" type="submit" aria-label="Close">
            ×
          </button>
        </header>

        <div className="report__list">
          {breakdownReportTypes.map((t, i) => (
            <label className="report__list-row" key={t.title}>
              <input type="radio" name="breakdownReportType" defaultChecked={i === 0} />
              <span>
                <span className="report__type-title">{t.title}</span>
                <span className="report__type-body">{t.body}</span>
              </span>
            </label>
          ))}
        </div>

        <p className="report__section">Format</p>
        <hr />
        {/* checkboxes, not radios — the design draws ticks here */}
        <div className="report__formats">
          <label>
            <input type="checkbox" name="format" value="PDF" defaultChecked /> PDF
          </label>
          <label>
            <input type="checkbox" name="format" value="Excel" /> Excel
          </label>
        </div>

        <footer className="report__actions report__actions--tall">
          <button className="tab" type="submit">
            Cancel
          </button>
          <button className="btn-solid btn-solid--icon" type="submit">
            Download Report
          </button>
        </footer>
      </form>
    </dialog>
  )
}

const eligibleActivities = {
  Research: [
    ['Publish Research Paper', 'In Scopus / WoS indexed journal', 25, 'Per Paper'],
    ['Conference Paper', 'In Scopus / WoS indexed conference', 15, 'Per Paper'],
    ['Research Grant', 'Principal Investigator (PI)', 40, 'Per Grant'],
    ['Patent Filed', 'Indian Patent Office', 20, 'Per Patent'],
    ['PhD Scholar Guided', 'Per scholar registered', 20, 'Per Scholar'],
  ],
  Teaching: [
    ['Course Feedback Score', 'Average student feedback rating above institutional benchmark', 20, 'Per Course'],
    ['Innovative Teaching Method', 'Approved use of active learning / digital pedagogy', 15, 'Per Method'],
    ['Course Material Development', 'Developed approved lecture notes, LMS content, or learning resources', 20, 'Per Course'],
    ['Student Mentoring', 'Mentored assigned students through academic or project guidance', 10, 'Per Semester'],
    ['Outcome Attainment Improvement', 'Improved CO attainment based on course assessment data', 25, 'Per Course'],
  ],
  FDP: [
    ['Attend Faculty Development Programme', 'Completed approved FDP related to teaching or research', 15, 'Per FDP'],
    ['Complete Professional Certification', 'Completed recognized academic or industry certification', 20, 'Per Certification'],
    ['Attend Workshop', 'Participated in approved academic or technical workshop', 10, 'Per Workshop'],
    ['Complete Online Course', 'Completed approved NPTEL, SWAYAM, MOOC, or equivalent course', 15, 'Per Course'],
    ['Conduct FDP / Workshop', 'Organized or served as resource person for an approved programme', 25, 'Per Programme'],
  ],
  Achievements: [
    ['Best Paper Award', 'Received best paper recognition at an academic conference', 25, 'Per Award'],
    ['Teaching Excellence Award', 'Received recognized award for excellence in teaching', 30, 'Per Award'],
    ['Research Excellence Award', 'Received institutional or external research recognition', 30, 'Per Award'],
    ['Professional Recognition', 'Received recognized academic or professional distinction', 20, 'Per Recognition'],
    ['Student Mentorship Award', 'Recognized for outstanding student mentoring or guidance', 20, 'Per Award'],
  ],
  Admin: [
    ['Committee Responsibility', 'Served as chairperson, coordinator, or member of an institutional committee', 15, 'Per Committee'],
    ['Exam Duty', 'Completed assigned examination or invigilation responsibility', 10, 'Per Duty Cycle'],
    ['Administrative Coordination', 'Coordinated approved departmental or institutional administrative activity', 20, 'Per Assignment'],
    ['Accreditation Contribution', 'Contributed to NAAC, NBA, NIRF, IQAC, or accreditation documentation', 25, 'Per Cycle'],
    ['Institutional Event Coordination', 'Organized or coordinated an approved university or departmental event', 15, 'Per Event'],
  ],
  Profile: [
    ['Complete Profile Information', 'Complete all required faculty profile details', 5, 'One Time'],
    ['Add ORCID ID', 'Connect and verify your ORCID researcher identifier', 5, 'One Time'],
    ['Upload Updated CV', 'Upload your latest academic and professional CV', 3, 'Per Update'],
    ['Add Publications', 'Update missing publication records in your faculty profile', 3, 'Per Update'],
    ['Add Awards & Patents', 'Update verified awards, recognitions, or patent information', 2, 'Per Update'],
  ],
} as const

type ActivityCategory = keyof typeof eligibleActivities

function EligibleActivitiesDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  const [category, setCategory] = useState<ActivityCategory>('Research')

  return (
    <dialog className="report activities" ref={ref}>
      <form method="dialog" className="report__form">
        <header className="report__head">
          <div>
            <h2 className="report__title-sm">Eligible Activities</h2>
            <p>Activities you can perform to earn more PRAJNA points.</p>
          </div>
          <button className="report__close" type="submit" aria-label="Close">
            ×
          </button>
        </header>

        <div className="tabs">
          {(Object.keys(eligibleActivities) as ActivityCategory[]).map((key) => (
            <button
              className={`tab${key === category ? ' tab--active' : ''}`}
              type="button"
              key={key}
              onClick={() => setCategory(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <table className="activities__table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Description</th>
              <th>Points</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {eligibleActivities[category].map(([activity, description, points, frequency]) => (
              <tr key={activity}>
                <td className="activities__name">{activity}</td>
                <td className="activities__desc">{description}</td>
                <td className="activities__pts">{points}</td>
                <td>{frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="activities__foot">
          <span className="activities__note">Points are subject to verification and approval.</span>
          <button className="tab" type="submit">
            Close
          </button>
        </footer>
      </form>
    </dialog>
  )
}

const tierReportTypes = [
  { icon: iconDoc, title: 'Detailed Progress Report', body: 'Complete breakdown of your PRAJNA score, current tier, progress, activities, and recommendations.' },
  { icon: iconChartSquare, title: 'Tier Summary Report', body: 'Quick overview of your current tier, score, and progress toward the next tier.' },
  { icon: iconActivity, title: 'Activity Report', body: 'Detailed record of activities and points contributing to your PRAJNA score.' },
]

const tierIncludes = [
  'Current PRAJNA Score',
  'Tier Progress',
  'Category-wise Score Breakdown',
  'Achievement Checklist',
  'Suggested Actions',
  'Recent Activity',
]

const tierInfo = [
  { icon: iconCalendar, label: 'Academic Year', value: score.academicYear },
  { glyph: score.tier[0], label: 'Current Tier', value: score.tier },
  { icon: iconChartSquare, label: 'Current Score', value: `${score.totalScore} / ${score.maxScore}` },
  { glyph: score.nextTierName[0], gold: true, label: 'Next Tier', value: atTopTier ? '—' : score.nextTierName },
  { icon: iconActivity, label: 'Points Required', value: atTopTier ? '0' : `${score.pointsToNextTier} pts` },
]

function TierReportDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog className="report report--tier" ref={ref}>
      <form method="dialog" className="report__form">
        <header className="report__head">
          <div>
            <h2>Download Tier Progress Report</h2>
            <p>Choose the report type and format you want to download.</p>
          </div>
          <button className="report__close" type="submit" aria-label="Close">
            ×
          </button>
        </header>

        <div className="report__rows">
          {tierReportTypes.map((t, i) => (
            <label className="report__row" key={t.title}>
              <input type="radio" name="tierReportType" defaultChecked={i === 0} />
              <span className="report__chip">
                <img src={t.icon} alt="" />
              </span>
              <span>
                <span className="report__type-title">{t.title}</span>
                <span className="report__type-body">{t.body}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="report__cols">
          <div>
            <p className="report__section">Include in Report</p>
            <div className="report__includes report__includes--one">
              <div>
                {tierIncludes.map((item) => (
                  <label key={item}>
                    <input type="checkbox" name="include" value={item} defaultChecked />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="report__section">Format</p>
            <div className="report__formats report__formats--stacked">
              <label>
                <input type="radio" name="format" defaultChecked /> PDF
              </label>
              <label>
                <input type="radio" name="format" /> Excel
              </label>
            </div>
          </div>
        </div>

        <hr />
        <p className="report__section">Report Information</p>
        <div className="report__info report__info--bare">
          {tierInfo.map((cell) => (
            <div key={cell.label}>
              <span className={`report__chip${cell.gold ? ' report__chip--gold' : ''}`}>
                {cell.icon ? <img src={cell.icon} alt="" /> : cell.glyph}
              </span>
              <span>
                <span className="report__info-label">{cell.label}</span>
                <span className="report__info-value">{cell.value}</span>
              </span>
            </div>
          ))}
        </div>

        <hr />
        <footer className="report__actions">
          <button className="tab" type="submit">
            Cancel
          </button>
          {/* ponytail: same as the history report — closing is the whole action
              until an export endpoint exists. */}
          <button className="btn-solid btn-solid--icon" type="submit">
            Download Report
          </button>
        </footer>
      </form>
    </dialog>
  )
}

function DownloadReportDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  const param = new URLSearchParams(window.location.search).get('range')
  const [range, setRange] = useState<ReportRange>(param && param in reportRanges ? (param as ReportRange) : 'all')
  const info = reportRanges[range]

  const infoStrip = [
    { icon: iconCalendar, label: 'History Range', value: `${info.label}\n${info.span}` },
    { icon: iconChartSquare, label: 'Current Score', value: `${score.totalScore} pts` },
    { glyph: score.tier[0], label: 'Current Tier', value: score.tier },
    { glyph: 'H', gold: true, label: 'Highest Score', value: `${score.totalScore} pts` },
    { icon: iconActivity, label: 'Tracking Since', value: 'Jul 2021' },
  ]

  return (
    <dialog className="report" ref={ref}>
      <form method="dialog" className="report__form">
        <header className="report__head">
          <div>
            <h2>Download Score History Report</h2>
            <p>Choose the history range, report content, and format you want to download.</p>
          </div>
          <button className="report__close" type="submit" aria-label="Close">
            ×
          </button>
        </header>

        <p className="report__section">History Range</p>
        <div className="tabs">
          {(Object.keys(reportRanges) as ReportRange[]).map((key) => (
            <button
              className={`tab${key === range ? ' tab--active' : ''}`}
              type="button"
              key={key}
              onClick={() => setRange(key)}
            >
              {reportRanges[key].label}
            </button>
          ))}
        </div>

        <p className="report__section">Report Type</p>
        <div className="report__types">
          {reportTypes.map((t, i) => (
            <label className="report__type" key={t.title}>
              <input type="radio" name="reportType" defaultChecked={i === 0} />
              <span>
                <span className="report__type-title">{t.title}</span>
                <span className="report__type-body">{t.body}</span>
              </span>
            </label>
          ))}
        </div>

        <p className="report__section">Include in Report</p>
        <div className="report__includes">
          {includes.map((column) => (
            <div key={column[0]}>
              {column.map((item) => (
                <label key={item}>
                  <input type="checkbox" name="include" value={item} defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          ))}
        </div>

        <p className="report__section">Format</p>
        <div className="report__formats">
          <label>
            <input type="radio" name="format" defaultChecked /> PDF
          </label>
          <label>
            <input type="radio" name="format" /> Excel
          </label>
        </div>

        <hr />
        <p className="report__section">Report Information</p>
        <div className="report__info">
          {infoStrip.map((cell) => (
            <div key={cell.label}>
              <span className={`report__chip${cell.gold ? ' report__chip--gold' : ''}`}>
                {cell.icon ? <img src={cell.icon} alt="" /> : cell.glyph}
              </span>
              <span>
                <span className="report__info-label">{cell.label}</span>
                <span className="report__info-value">{cell.value}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="report__section">File Name</p>
        <input className="report__file" key={range} defaultValue={`PRAJNA_Score_History_${info.slug}`} />

        <hr />
        <footer className="report__actions">
          <button className="tab" type="submit">
            Cancel
          </button>
          {/* ponytail: no backend to render a PDF — closing is the whole action.
              Wire the export endpoint here. */}
          <button className="btn-solid btn-solid--icon" type="submit">
            <img src={iconDownload} alt="" />
            Download Report
          </button>
        </footer>
      </form>
    </dialog>
  )
}

/** Page header + module tabs, shared by every PRAJNA Score tab. */
export function ScorePage({
  title,
  subtitle,
  meta,
  active,
  children,
}: {
  title: string
  subtitle: string
  meta: string
  active: string
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  // each tab's report modal is designed separately; Breakdown has none yet
  const report =
    active === 'History' ? (
      <DownloadReportDialog ref={dialog} />
    ) : active === 'Tier Progress' ? (
      <TierReportDialog ref={dialog} />
    ) : active === 'Breakdown' ? (
      <BreakdownReportDialog ref={dialog} />
    ) : null

  return (
    <Shell active="PRAJNA Score">
      <div className="pagehead pagehead--score">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <p className="pagehead__meta">{meta}</p>
        </div>
        <button
          className="btn-solid"
          type="button"
          onClick={() => dialog.current?.showModal()}
          disabled={!report}
        >
          Download Report
        </button>
      </div>

      {report}

      <div className="tabs">
        {tabs.map((t) => (
          <a
            className={`tab${t.label === active ? ' tab--active' : ''}`}
            href={t.href ?? `#${t.label}`}
            key={t.label}
          >
            {t.label}
          </a>
        ))}
      </div>

      {children}
    </Shell>
  )
}

// FEI-1000 cluster palette — one colour per cluster id, in id order
const clusterColours = ['#007367', '#8bcbb7', '#004740', '#5e95cd', '#a58255', '#d8c08e', '#dd736e', '#2f7f6f', '#b8d8c9']

const clusters = score.clusters.map((c, i) => ({
  ...c,
  colour: clusterColours[i],
  /** share of the total score — what the donut slices */
  share: (c.score / score.totalScore) * 100,
  /** how full this cluster is against its OWN ceiling */
  fill: (c.score / c.maxPoints) * 100,
}))

const insights = [
  `Research, Publications, Grants & Scholarly Impact contributes ${score.clusters[2].score} of your ${score.totalScore} points.`,
  `Teaching Excellence & OBE is your largest cluster at ${score.clusters[0].weightPercent}% of the framework.`,
  'Innovation, IP & Entrepreneurship is maxed — further patents this year will not add points.',
]

const checklist = ['Add ORCID ID', 'Upload CV', 'Add Publications', 'Add Awards', 'Add Patents']

const updates = [
  { dot: 'green', title: '+54 Research score added', body: 'Q1 paper, first author, 25+ citations', date: 'Jul 2, 2026' },
  { dot: 'light', title: '+15 Teaching score added', body: 'Course feedback cycle updated', date: 'Jun 10, 2026' },
  { dot: 'green', title: `Tier upgraded to ${score.tier}`, body: `Crossed ${bandOf(score.totalScore).minScore} pts threshold`, date: 'May 18, 2026' },
  { dot: 'muted', title: '+10 Profile score added', body: 'Profile fields completed', date: 'Apr 5, 2026' },
]

const PROFILE_PCT = 82

// conic-gradient needs cumulative stops, so fold the shares into ranges once
const donut = clusters
  .reduce<string[]>((stops, c, i, all) => {
    const from = all.slice(0, i).reduce((sum, p) => sum + p.share, 0)
    return [...stops, `${c.colour} ${from}% ${from + c.share}%`]
  }, [])
  .join(', ')

export default function PrajnaScore() {
  const activities = useRef<HTMLDialogElement>(null)

  return (
    <ScorePage
      title="PRAJNA Score"
      subtitle="Track your performance score across academic and professional contributions"
      meta={`Academic Year ${score.academicYear} · ${score.campus} · Last recalculated ${new Date(score.lastRecalculatedAt).toDateString()}`}
      active="Breakdown"
    >
      <div className="row row--overview">
        <section className="card card--raised summary">
          <h2>Total PRAJNA Score</h2>
          <div className="summary__score">
            <span className="summary__value">{score.totalScore}</span>
            <span className="pill">+{(score.totalScore - score.previousScore).toFixed(1)} pts</span>
          </div>
          <p className="muted-12">
            of {score.maxScore} · {score.tier} · {score.yearOnYearTrend > 0 ? '+' : ''}
            {score.yearOnYearTrend}% year on year
          </p>
          <hr />
          <div>
            <p className="summary__tier">{atTopTier ? 'Highest tier reached' : `Next Tier: ${score.nextTierName}`}</p>
            <p className="muted-12">
              {atTopTier ? score.tierMeaning : `${score.pointsToNextTier} pts to reach ${score.nextTierName}`}
            </p>
          </div>
          <div className="track">
            <span style={{ width: `${bandProgress(score.totalScore)}%` }} />
          </div>
          <button className="link link--button" type="button" onClick={() => activities.current?.showModal()}>
            How can I earn more points? →
          </button>
          <EligibleActivitiesDialog ref={activities} />
        </section>

        <section className="card card--raised breakdown">
          <h2>Score Breakdown</h2>
          <div className="breakdown__body">
            {/* ponytail: conic-gradient donut, no chart lib. Add one when a
                segment needs a tooltip or an entry animation. */}
            <div
              className="donut"
              style={{ background: `conic-gradient(${donut})` }}
              role="img"
              aria-label={`Score breakdown, ${score.totalScore} of ${score.maxScore} points`}
            >
              <span className="donut__center">
                <span className="donut__value">{score.totalScore}</span>
                <span className="donut__unit">of {score.maxScore}</span>
              </span>
            </div>
            <ul className="legend legend--score">
              {clusters.map((c) => (
                <li key={c.id}>
                  <span className="dot" style={{ background: c.colour }} />
                  <span className="legend__label" title={c.name}>
                    {c.name}
                  </span>
                  <span className="legend__value">
                    {c.score} / {c.maxPoints}
                  </span>
                  <span className="legend__pct">{c.weightPercent}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="section">
        <h2 className="section__title">Cluster Breakdown</h2>
        <div className="cat-grid">
          {clusters.map((c) => (
            <div className="card card--raised cat" key={c.id}>
              <p className="cat__head">
                <span className="dot dot--lg" style={{ background: c.colour }} />
                <span title={c.name}>{c.name}</span>
              </p>
              <p className="cat__value">
                {c.score} <span className="cat__max">/ {c.maxPoints}</span>
              </p>
              {/* each bar is scaled to its OWN maxPoints — ceilings differ per cluster */}
              <div className="track">
                <span style={{ width: `${c.fill}%`, background: c.colour }} />
              </div>
              <p className="muted-12">
                {c.overflow > 0 ? 'Cluster maxed — further points this year will not count' : `${c.weightPercent}% of the framework`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="row row--insight">
        <section className="card card--raised insight">
          <span className="insight__chip">
            <img src={iconSparkle} alt="" />
          </span>
          <div className="insight__text">
            <h2>AI Insights</h2>
            <ul className="bullets">
              {insights.map((line) => (
                <li key={line}>
                  <span className="dot dot--sm dot--green" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card completion">
          <h2 className="completion__title">Profile Completion</h2>
          <div className="completion__body">
            <div
              className="ring"
              style={{ ['--pct' as string]: `${PROFILE_PCT}%` }}
              role="img"
              aria-label={`Profile ${PROFILE_PCT} percent complete`}
            >
              <span>{PROFILE_PCT}%</span>
            </div>
            <ul className="bullets">
              {checklist.map((item) => (
                <li key={item}>
                  <span className="dot dot--sm dot--green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="card card--raised updates">
        <h2>Recent Updates</h2>
        <ol className="timeline">
          {updates.map((u) => (
            <li key={u.title}>
              <span className={`timeline__dot timeline__dot--${u.dot}`} />
              <p className="timeline__title">{u.title}</p>
              <p className="muted-12">{u.body}</p>
              <p className="timeline__date">{u.date}</p>
            </li>
          ))}
        </ol>
        <p className="updates__footer">
          <a className="link" href="#updates">
            View Full Updates →
          </a>
        </p>
      </section>
    </ScorePage>
  )
}
