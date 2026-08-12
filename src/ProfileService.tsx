import { ProfilePage } from './Profile'
import { RecordStrip, Line, Bars, FileList } from './ProfileResearch'
import { Donut } from './ProfilePublications'
import './ProfileResearch.css'

const stats = [
  ['6', 'COMMITTEE ROLES'],
  ['3', 'ADMINISTRATIVE RESPONSIBILITIES'],
  ['4', 'PROFESSIONAL MEMBERSHIPS'],
  ['1', 'EDITORIAL BOARDS'],
  ['18', 'JOURNAL REVIEWS'],
  ['9', 'CONFERENCE SERVICES'],
  ['5', 'COMMUNITY OUTREACH'],
  ['2', 'LEADERSHIP ROLES'],
]

const filters = [
  ['Service Category', 'All Categories'],
  ['Academic Year', '2025–26'],
  ['Organization', 'All Organizations'],
  ['Role', 'All Roles'],
  ['Status', 'All Statuses'],
]

/** 2019:19319 — Service tab landing */
export function ProfileService() {
  return (
    <ProfilePage subtitle="Institutional, professional, and community service portfolio" active="Service">
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
          <input type="search" placeholder="Search by committee, organization…" />
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
        <a className="btn-solid" href="/profile/service/analytics">
          Service Analytics
        </a>
        <a className="chip chip--lg" href="/profile/service/portfolio">
          Generate Service Portfolio
        </a>
      </div>

      <section className="card form-card">
        <h2 className="form-card__title">Service Overview</h2>
        <p className="field-lg__label">Service Philosophy</p>
        <p className="about__body">
          I view institutional and professional service as an extension of teaching and research — strengthening
          governance, mentoring peers, and giving back to the wider academic and local community.
        </p>
      </section>
    </ProfilePage>
  )
}

// ── full service record ─────────────────────────────────────────────────────

const service = {
  name: 'Anti-Ragging Committee',
  status: 'Active',
  role: 'Chairperson',
  department: 'CSE',
  duration: '2023–Present',
  overview: [
    ['Organization', 'GITAM University — Dept. of CSE'],
    ['Role', 'Chairperson'],
    ['Duration', '2023–Present'],
  ] as [string, string][],
  responsibilities: [
    'Enforce anti-ragging policy across department orientation programs',
    'Chair monthly committee meetings and maintain compliance records',
    'Coordinate with university-level anti-ragging cell on reporting',
  ],
  contributions: [
    'Redesigned department orientation module reducing incidents to zero for 2 consecutive years',
    'Introduced anonymous reporting channel adopted university-wide',
    'Trained 12 faculty coordinators across department',
  ],
  files: [
    ['Appointment_Letter.pdf', '210 KB'],
    ['Annual_Compliance_Report.pdf', '640 KB'],
  ] as [string, string][],
  activities: ['Department orientation session — 3 Aug 2025', 'Anti-ragging awareness workshop — 12 Feb 2026'],
  timeline: [['Appointed Chairperson', 'Jul 2023']] as [string, string][],
}

/** 2019:19781 — full service record */
export function ServiceRecord() {
  return (
    <ProfilePage subtitle={`${service.name} — complete service record`} active="Service">
      <RecordStrip
        kicker="SERVICE"
        name={service.name}
        status={service.status}
        statusTone="completed"
        cells={[
          ['ROLE', service.role],
          ['DEPARTMENT', service.department],
          ['DURATION', service.duration],
        ]}
      />

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card form-card">
            <h2 className="form-card__title">Overview</h2>
            <dl className="kv">
              {service.overview.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="field-lg__label">Responsibilities</p>
            <ul className="bullets--plain">
              {service.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Key Contributions</h2>
            <ul className="bullets--plain">
              {service.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="profile__side">
          <section className="card form-card">
            <h2 className="form-card__title">Supporting Documents</h2>
            <FileList files={service.files} />
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Related Activities</h2>
            <ul className="bullets--plain">
              {service.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Timeline</h2>
            <ol className="timeline-steps">
              {service.timeline.map(([title, when]) => (
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

// ── Service Analytics ────────────────────────────────────────────────────────

const serviceDist = [
  { label: 'Institutional (40%)', percent: 40, colour: '#007367' },
  { label: 'Professional (25%)', percent: 25, colour: '#5e95cd' },
  { label: 'Editorial/Reviewer (20%)', percent: 20, colour: '#a58255' },
  { label: 'Community (15%)', percent: 15, colour: '#dd736e' },
]
const committeeParticipation = [3, 4, 5, 6, 6, 6]
const membershipGrowth = [1, 2, 2, 3, 3, 4]
const reviewerActivity = [3, 4, 6, 8, 10, 12]
const conferenceContributions = [2, 3, 4, 5, 6]
const communityOutreach = [1, 2, 3, 4, 5]
const leadershipTimeline = [1, 1, 2, 2, 2, 2]

console.assert(
  serviceDist.reduce((s, x) => s + x.percent, 0) === 100,
  'service distribution donut shares must sum to 100',
)

/** 2019:20019 — Service Analytics */
export function ServiceAnalytics() {
  return (
    <ProfilePage subtitle="Analytics across your institutional and professional service record" active="Service">
      <section className="card form-card">
        <h2 className="form-card__title">Service Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Service Distribution</p>
            <Donut slices={serviceDist} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Committee Participation</p>
            <Bars values={committeeParticipation} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Professional Membership Growth</p>
            <Line values={membershipGrowth} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Reviewer Activity (reviews/year)</p>
            <Bars values={reviewerActivity} colour="#a58255" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Conference Contributions</p>
            <Bars values={conferenceContributions} colour="#dd736e" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Community Outreach (activities/year)</p>
            <Bars values={communityOutreach} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Leadership Timeline (cumulative roles)</p>
            <Line values={leadershipTimeline} colour="#5e95cd" />
          </div>
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/service">
          Back
        </a>
        <span className="res-foot__right">
          <button className="chip chip--lg" type="button">
            Download PDF
          </button>
          <button className="btn-solid" type="button">
            Export Analytics
          </button>
        </span>
      </div>
    </ProfilePage>
  )
}

// ── Generate Service Portfolio ──────────────────────────────────────────────

const templates = [
  ['Promotion Portfolio', 'Structured for academic promotion and tenure review committees.'],
  ['NAAC SSR', 'Formatted per NAAC Self-Study Report service criteria.'],
  ['NBA SAR', 'Formatted per NBA Self-Assessment Report metrics.'],
  ['Annual Faculty Report', 'Summary suitable for department annual reporting.'],
  ['Academic CV', 'Concise CV-style summary of service record.'],
  ['Custom Portfolio', 'Manually select which service contributions to include.'],
]

const includes = [
  ['Include Institutional Service', 'Include Reviewer Contributions'],
  ['Include Professional Memberships', 'Include Community Outreach'],
  ['Include Editorial Roles', 'Include Leadership Roles'],
]

/** 2019:20267 — Service tab: Generate Portfolio */
export function ServicePortfolio() {
  return (
    <ProfilePage subtitle="Generate a promotion-ready service portfolio" active="Service">
      <section className="card form-card">
        <h2 className="form-card__title">Select a Template</h2>
        <div className="template-grid">
          {templates.map(([name, body], i) => (
            <label className="template" key={name}>
              <input type="radio" name="service-template" defaultChecked={i === 0} />
              <span className="template__name">{name}</span>
              <span className="template__body">{body}</span>
              <span className="template__selected">✓ Selected</span>
            </label>
          ))}
        </div>
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Include in Portfolio</h2>
        <div className="checklist-cols">
          {includes.map((col, i) => (
            <ul className="checklist checklist--report" key={i}>
              {col.map((item) => (
                <li key={item}>
                  <label>
                    <input type="checkbox" defaultChecked={item !== 'Include Community Outreach'} />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <button className="chip chip--lg" type="button">
          Preview
        </button>
        <button className="chip chip--lg" type="button">
          Export DOCX
        </button>
        <button className="btn-solid" type="button">
          Generate PDF
        </button>
      </div>
    </ProfilePage>
  )
}
