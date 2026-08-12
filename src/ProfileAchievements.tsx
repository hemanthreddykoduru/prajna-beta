import { ProfilePage } from './Profile'
import { ResearchForm, RecordStrip, Line, Bars, type FormSpec } from './ProfileResearch'
import { Donut } from './ProfilePublications'
import './ProfileResearch.css'
import './ProfileAchievements.css'

// ── Projects tab: progress update + analytics ───────────────────────────────

const progressForm: FormSpec = {
  route: '/profile/projects/progress',
  subtitle: 'Update the current status of your project',
  title: 'Progress Update — Federated Learning for Healthcare Analytics',
  active: 'Projects',
  backHref: '/profile/projects',
  fields: [
    { label: 'Current Progress %', value: '65%' },
    { label: 'Budget Utilized', value: '₹40,30,000 (65%)' },
    { label: 'Completed Milestones', value: 'Architecture design finalized; Prototype federated aggregation module', wide: true },
    { label: 'Upcoming Milestones', value: 'Pilot deployment with partner hospital — due Dec 2025', wide: true },
    { label: 'Challenges', value: 'Partner hospital IT integration is taking longer than anticipated due to data governance review.', wide: true },
    { label: 'Risks', value: 'Regulatory approval timeline may slip by 4-6 weeks if governance review extends further.', wide: true },
    { label: 'Achievements', value: 'Prototype validated internally with 94% accuracy on synthetic multi-site dataset.', wide: true },
  ],
  upload: { label: 'Supporting Documents', text: 'Click or drag supporting documents here' },
  buttons: ['Back', 'Save Update'],
  back: true,
}

/** 2019:16409 — Projects tab: Progress Update */
export const ProjectProgressUpdate = () => <ResearchForm spec={progressForm} />

const fundingDist = [
  { label: 'Government (56%)', percent: 56, colour: '#007367' },
  { label: 'Industry (33%)', percent: 33, colour: '#5e95cd' },
  { label: 'Internal (11%)', percent: 11, colour: '#a58255' },
]
const statusDist = [
  { label: 'In Progress (44%)', percent: 44, colour: '#5e95cd' },
  { label: 'Completed (56%)', percent: 56, colour: '#007367' },
]
const successRate = [
  { label: 'On Track (78%)', percent: 78, colour: '#007367' },
  { label: 'At Risk (22%)', percent: 22, colour: '#dd736e' },
]
const budgetUtil = [30, 45, 55, 65, 70, 78]
const milestoneCompletion = [2, 4, 6, 8, 10, 12]
const projectTimeline = [1, 2, 3, 3, 4, 4, 4]
const deptComparison = [90, 70, 55, 35]
const fundingByAgency = [
  ['DST-SERB', 90],
  ['DRDO', 60],
  ['AICTE', 45],
  ['MeitY', 30],
]

console.assert(
  fundingDist.reduce((s, x) => s + x.percent, 0) === 100 &&
    statusDist.reduce((s, x) => s + x.percent, 0) === 100 &&
    successRate.reduce((s, x) => s + x.percent, 0) === 100,
  'project analytics donut shares must sum to 100',
)

/** 2019:16591 — Projects tab: Project Analytics */
export function ProjectAnalytics() {
  return (
    <ProfilePage subtitle="Visualize performance across your project portfolio" active="Projects">
      <section className="card form-card">
        <h2 className="form-card__title">Project Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Funding Distribution</p>
            <Donut slices={fundingDist} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Project Status Distribution</p>
            <Donut slices={statusDist} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Budget Utilization (%)</p>
            <Bars values={budgetUtil} colour="#a58255" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Milestone Completion</p>
            <Bars values={milestoneCompletion} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Project Timeline (active count)</p>
            <Line values={projectTimeline} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Department Comparison (funding ₹L)</p>
            <Bars values={deptComparison} colour="#dd736e" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Project Success Rate</p>
            <Donut slices={successRate} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Funding by Agency (₹L)</p>
            <ul className="hbars">
              {fundingByAgency.map(([label, value]) => (
                <li key={label}>
                  <span className="hbars__label">{label}</span>
                  <span className="hbars__track hbars__track--gold">
                    <span style={{ width: `${(Number(value) / 90) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/projects">
          Back
        </a>
        <span className="res-foot__right">
          <button className="chip chip--lg" type="button">
            Download PDF
          </button>
          <button className="btn-solid" type="button">
            Export Report
          </button>
        </span>
      </div>
    </ProfilePage>
  )
}

// ── Achievements tab ─────────────────────────────────────────────────────────

const stats = [
  ['28', 'TOTAL ACHIEVEMENTS'],
  ['9', 'AWARDS'],
  ['4', 'INTERNATIONAL AWARDS'],
  ['5', 'NATIONAL AWARDS'],
  ['11', 'INVITED TALKS'],
  ['6', 'PROFESSIONAL MEMBERSHIPS'],
  ['3', 'EDITORIAL ROLES'],
  ['7', 'REVIEWER ASSIGNMENTS'],
  ['5', 'CERTIFICATIONS'],
]

const filters = [
  ['Achievement Type', 'All Types'],
  ['Organization', 'All Organizations'],
  ['Year', '2026'],
  ['Category', 'All Categories'],
  ['Status', 'All Statuses'],
]

const table = [
  { title: 'Best Paper Award, ICDCS 2026', category: 'Award', org: 'IEEE ICDCS', level: 'International', date: 'Feb 2026', evidence: 'Certificate.pdf', status: 'Completed', visibility: 'Public' },
]

/** 2019:16853 — Achievements tab landing */
export function ProfileAchievements() {
  return (
    <ProfilePage subtitle="Achievement management workspace — awards, talks, memberships, and recognitions" active="Achievements">
      <div className="res-stats">
        {stats.map(([value, label]) => (
          <div className="card res-stat" key={label}>
            <span className="res-stat__value">{value}</span>
            <span className="res-stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="res-filters">
        <label className="field-sm">
          Search
          <input type="search" placeholder="Search achievements by title, organization…" />
        </label>
        {filters.map(([label, value]) => (
          <label className="field-sm" key={label}>
            {label}
            <select defaultValue={value}>
              <option>{value}</option>
            </select>
          </label>
        ))}
        <label className="field-sm">
          Sort By
          <select defaultValue="Most Recent">
            <option>Most Recent</option>
          </select>
        </label>
      </div>

      <div className="res-actions">
        <a className="btn-solid" href="/profile/achievements/new">
          + Add Achievement
        </a>
        <a className="chip chip--lg" href="/profile/achievements/analytics">
          Achievement Analytics
        </a>
        <a className="chip chip--lg" href="/profile/achievements/portfolio">
          Generate Achievement Portfolio
        </a>
      </div>

      <section className="card form-card">
        <h2 className="form-card__title">Achievement Table</h2>
        <p className="muted-12">Scroll horizontally to view all columns →</p>
        <div className="project-table-wrap">
          <table className="project-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Category</th>
                <th>Organization</th>
                <th>Level</th>
                <th>Award Date</th>
                <th>Evidence</th>
                <th>Verification Status</th>
                <th>Visibility</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.title}>
                  <td>
                    <a className="project-table__link" href="/profile/achievements/record">
                      {row.title}
                    </a>
                  </td>
                  <td>{row.category}</td>
                  <td>{row.org}</td>
                  <td>{row.level}</td>
                  <td>{row.date}</td>
                  <td>{row.evidence}</td>
                  <td>
                    <span className="badge badge--completed">
                      <span className="dot" />
                      {row.status}
                    </span>
                  </td>
                  <td>{row.visibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ProfilePage>
  )
}

/** 2019:17182 — Achievements tab: Add Achievement */
const achievementForm: FormSpec = {
  route: '/profile/achievements/new',
  subtitle: 'Register a new achievement to your portfolio',
  title: 'Achievement Details',
  active: 'Achievements',
  backHref: '/profile/achievements',
  fields: [
    { label: 'Achievement Title', value: 'Best Paper Award, ICDCS 2026', wide: true },
    { label: 'Achievement Category', value: 'Award', kind: 'select' },
    { label: 'Award Type', value: 'Best Paper Award', kind: 'select' },
    { label: 'Organization', value: 'IEEE ICDCS' },
    { label: 'Award Level', value: 'International', kind: 'select' },
    { label: 'Award Date', value: '20 Feb 2026', kind: 'date' },
    { label: 'Location', value: 'Singapore' },
    { label: 'Description', value: 'Awarded for the paper "Edge Anomaly Detection for IoT Networks" recognizing its contribution to distributed security research.', wide: true },
    { label: 'Recognition Details', value: 'Selected from 420 submissions; awarded to top 3 papers at the conference.', wide: true },
    { label: 'Website', value: 'icdcs2026.org/awards' },
    { label: 'Visibility', value: 'Public', kind: 'select' },
  ],
  buttons: ['Back', 'Save Achievement'],
  back: true,
}

export const AddAchievement = () => <ResearchForm spec={achievementForm} />

// ── full achievement record ──────────────────────────────────────────────────

const achievement = {
  title: 'Best Paper Award, ICDCS 2026',
  status: 'Completed',
  category: 'Award',
  level: 'International',
  date: '20 Feb 2026',
  overview: [
    ['Category', 'Award'],
    ['Award Type', 'Best Paper Award'],
    ['Award Level', 'International'],
    ['Award Date', '20 Feb 2026'],
    ['Location', 'Singapore'],
  ] as [string, string][],
  org: [
    ['Organization', 'IEEE ICDCS'],
    ['Website', 'icdcs2026.org/awards'],
  ] as [string, string][],
  description:
    'Awarded for the paper "Edge Anomaly Detection for IoT Networks" recognizing its contribution to distributed security research. Selected from 420 submissions; awarded to top 3 papers at the conference.',
  timeline: [
    ['Paper Submitted', 'Sep 2025'],
    ['Notified as Finalist', 'Jan 2026'],
    ['Award Announced at ICDCS 2026', 'Feb 2026'],
    ['Certificate Received', 'Mar 2026'],
  ] as [string, string][],
}

/** 2019:17376 — full achievement record */
export function AchievementRecord() {
  return (
    <ProfilePage subtitle={`${achievement.title} — full achievement record`} active="Achievements">
      <RecordStrip
        kicker="ACHIEVEMENT"
        name={achievement.title}
        status={achievement.status}
        cells={[
          ['CATEGORY', achievement.category],
          ['LEVEL', achievement.level],
          ['AWARD DATE', achievement.date],
        ]}
      />

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card form-card">
            <h2 className="form-card__title">Overview</h2>
            <dl className="kv">
              {achievement.overview.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="field-lg__label">Organization Details</p>
            <dl className="kv">
              {achievement.org.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="field-lg__label">Achievement Description</p>
            <p className="about__body">{achievement.description}</p>
          </section>
        </div>

        <div className="profile__side">
          <section className="card form-card">
            <h2 className="form-card__title">Timeline</h2>
            <ol className="timeline-steps">
              {achievement.timeline.map(([title, when]) => (
                <li key={title}>
                  <span className="timeline-steps__tick">✓</span>
                  <span>
                    <span className="timeline-steps__title">{title}</span>
                    <span className="muted-12">{when}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </ProfilePage>
  )
}
