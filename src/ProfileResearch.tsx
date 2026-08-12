import { ProfilePage } from './Profile'
import './ProfileResearch.css'

const SUB = 'Enterprise research management workspace'

const stats = [
  ['842', 'RESEARCH SCORE'],
  ['47', 'TOTAL PUBLICATIONS'],
  ['1,286', 'TOTAL CITATIONS'],
  ['19', 'H-INDEX'],
  ['28', 'I10-INDEX'],
  ['9', 'RESEARCH PROJECTS'],
  ['4', 'ACTIVE GRANTS'],
  ['₹1.8 Cr', 'RESEARCH FUNDING'],
  ['6', 'PATENTS FILED'],
  ['3', 'PATENTS GRANTED'],
  ['11', 'RESEARCH COLLABORATIONS'],
  ['5', 'PHD SCHOLARS'],
]

const filters = [
  { label: 'Research Area', options: ['All Areas'] },
  { label: 'Funding Agency', options: ['All Agencies'] },
  { label: 'Year', options: ['2026'] },
  { label: 'Grant Status', options: ['All Statuses'] },
  { label: 'Project Status', options: ['All Statuses'] },
]

const actions = [
  { label: '+ Add Research', href: '/profile/research/new', primary: true },
  { label: 'Research Analytics', href: '/profile/research/analytics' },
  { label: '+ Add Grant', href: '/profile/research/grant' },
  { label: '+ Add Patent', href: '/profile/research/patent' },
  { label: '+ Add Project', href: '/profile/research/project' },
  { label: '+ Add Collaboration', href: '/profile/research/collaboration' },
  { label: '+ Add PhD Scholar', href: '/profile/research/scholar' },
]

/** 2019:10474 — Research tab landing */
export function ProfileResearch() {
  return (
    <ProfilePage subtitle={SUB} active="Research">
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
          Search Research
          <input type="search" placeholder="Search publications, grants, patents…" />
        </label>
        {filters.map((f) => (
          <label className="field-sm" key={f.label}>
            {f.label}
            <select defaultValue={f.options[0]}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
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
        {actions.map((a) => (
          <a
            className={a.primary ? 'btn-solid' : 'chip chip--lg'}
            href={a.href ?? `#${a.label}`}
            key={a.label}
          >
            {a.label}
          </a>
        ))}
      </div>

      <div className="res-links">
        <a className="link" href="/profile/research/report">
          Generate Research Report
        </a>
        <a className="link" href="/profile/research/portfolio">
          Export Research Portfolio
        </a>
      </div>
    </ProfilePage>
  )
}

// ── forms ────────────────────────────────────────────────────────────────────
// Every "+ Add …" screen is the same card: a title, a two-column field grid, an
// optional upload zone and two buttons. So they are data, not six components.

type FieldSpec = {
  label: string
  /** shown as placeholder — the design's sample text is not a real value */
  value: string
  kind?: 'select' | 'date'
  wide?: boolean
}

type FormSpec = {
  route: string
  subtitle: string
  title: string
  fields: FieldSpec[]
  upload?: { label: string; text: string; hint?: string; accept?: string }
  buttons: [secondary: string, primary: string]
  /** research + grant put a Back link on the left; the rest are right-aligned */
  back?: boolean
  /** which profile tab this form belongs to — defaults to Research */
  active?: string
  backHref?: string
}

export type { FormSpec }

export const forms: Record<string, FormSpec> = {
  research: {
    route: '/profile/research/new',
    subtitle: 'Add a new research entry to your portfolio',
    title: 'Research Entry Details',
    fields: [
      { label: 'Research Title', value: 'Federated Learning for Privacy-Preserving Healthcare Analytics', wide: true },
      { label: 'Research Area', value: 'Machine Learning', kind: 'select' },
      { label: 'Research Type', value: 'Applied Research', kind: 'select' },
      { label: 'Abstract', value: 'This work proposes a federated aggregation method that preserves patient privacy while enabling cross-institutional model training…', wide: true },
      { label: 'Keywords', value: 'federated learning, privacy, healthcare, differential privacy', wide: true },
      { label: 'Collaborators', value: 'Dr. Meera Krishnan (NUS), Dr. Vikram Kumar (CSE)', wide: true },
      { label: 'Funding', value: 'DST-SERB Core Research Grant' },
      { label: 'Duration', value: '2024–2027' },
    ],
    upload: { label: 'Upload Documents', text: 'Click or drag documents here' },
    buttons: ['Back', 'Save Research'],
    back: true,
  },
  grant: {
    route: '/profile/research/grant',
    subtitle: 'Register a new research grant',
    title: 'Grant Details',
    fields: [
      { label: 'Grant Name', value: 'DST-SERB Core Research Grant', wide: true },
      { label: 'Funding Agency', value: 'DST-SERB', kind: 'select' },
      { label: 'Grant Type', value: 'Core Research Grant', kind: 'select' },
      { label: 'Amount', value: '₹62,00,000' },
      { label: 'Duration', value: '2024–2027' },
      { label: 'PI', value: 'Dr. Ananya Rao' },
      { label: 'Co-PI', value: 'Dr. Vikram Kumar' },
      { label: 'Description', value: 'Core research grant supporting federated learning infrastructure for privacy-preserving healthcare analytics.', wide: true },
    ],
    upload: { label: 'Upload Proposal', text: 'Click or drag file here', hint: 'PDF up to 25MB', accept: 'application/pdf' },
    buttons: ['Back', 'Save Grant'],
    back: true,
  },
  patent: {
    route: '/profile/research/patent',
    subtitle: 'Register a new patent filing',
    title: 'Patent Details',
    fields: [
      { label: 'Patent Title', value: 'Federated Aggregation Method for Privacy-Preserving ML', wide: true },
      { label: 'Technology Area', value: 'Machine Learning', kind: 'select' },
      { label: 'Inventors', value: 'Dr. Ananya Rao, Dr. Vikram Kumar' },
      { label: 'Patent Office', value: 'Indian Patent Office', kind: 'select' },
      { label: 'Country', value: 'India', kind: 'select' },
      { label: 'Filed Date', value: '12 Mar 2025', kind: 'date' },
      { label: 'Grant Date', value: 'Pending', kind: 'date' },
    ],
    upload: { label: 'Upload Documents', text: 'Click or drag documents here', hint: 'PDF, JPG up to 25MB' },
    buttons: ['Save', 'Submit'],
  },
  project: {
    route: '/profile/research/project',
    subtitle: 'Create a new research project',
    title: 'Project Details',
    fields: [
      { label: 'Project Name', value: 'Edge Computing for Smart Campus', wide: true },
      { label: 'Funding Agency', value: 'AICTE', kind: 'select' },
      { label: 'Budget', value: '₹28,00,000' },
      { label: 'Objectives', value: 'Develop a low-latency edge inference framework for campus IoT deployments, reducing cloud dependency by 40%.', wide: true },
      { label: 'Milestones', value: 'M1: Architecture design (Q1) · M2: Prototype (Q3) · M3: Pilot deployment (Q4)', wide: true },
      { label: 'Timeline', value: '2023–2026' },
      { label: 'Team Members', value: 'Dr. Vikram Kumar, 3 PhD scholars' },
      { label: 'Deliverables', value: 'Edge inference SDK, deployment report, 2 conference papers', wide: true },
    ],
    buttons: ['Save', 'Create'],
  },
  collaboration: {
    route: '/profile/research/collaboration',
    subtitle: 'Register a new research collaboration',
    title: 'Collaboration Details',
    fields: [
      { label: 'Partner Institution', value: 'National University of Singapore' },
      { label: 'Country', value: 'Singapore', kind: 'select' },
      { label: 'Research Area', value: 'Federated Learning', kind: 'select' },
      { label: 'Duration', value: '2024–2026' },
      { label: 'Principal Contact', value: 'Prof. Meera Krishnan' },
      { label: 'Agreement', value: 'MoU Signed', kind: 'select' },
    ],
    upload: { label: 'Upload MoU', text: 'Click or drag MoU document here', hint: 'PDF up to 25MB', accept: 'application/pdf' },
    buttons: ['Save', 'Submit'],
  },
  scholar: {
    route: '/profile/research/scholar',
    subtitle: 'Register a new PhD scholar under your supervision',
    title: 'Scholar Details',
    fields: [
      { label: 'Student Name', value: 'Kavya Menon' },
      { label: 'Registration Number', value: 'GITAM-PHD-2023-0142' },
      { label: 'Program', value: 'PhD (Full-time)', kind: 'select' },
      { label: 'Topic', value: 'Privacy-preserving federated aggregation' },
      { label: 'Supervisor', value: 'Dr. Ananya Rao' },
      { label: 'Co-Supervisor', value: 'Dr. Vikram Kumar' },
      { label: 'Admission Date', value: '1 Aug 2023', kind: 'date' },
      { label: 'Expected Completion', value: 'Jul 2027', kind: 'date' },
    ],
    buttons: ['Save', 'Register'],
  },
}

export function ResearchForm({ spec }: { spec: FormSpec }) {
  const [secondary, primary] = spec.buttons
  return (
    <ProfilePage subtitle={spec.subtitle} active={spec.active ?? 'Research'}>
      <section className="card form-card">
        <h2 className="form-card__title">{spec.title}</h2>
        <div className="form-grid">
          {spec.fields.map((f) => (
            <label className={`field-lg${f.wide ? ' field-lg--wide' : ''}`} key={f.label}>
              {f.label}
              {f.kind === 'select' ? (
                <select defaultValue={f.value}>
                  <option>{f.value}</option>
                </select>
              ) : (
                // ponytail: design text is sample data, so it lands in the
                // placeholder — a pre-filled ₹62,00,000 is how bad data gets saved
                <input placeholder={f.value} />
              )}
            </label>
          ))}
        </div>

        {spec.upload ? (
          <>
            <p className="field-lg__label">{spec.upload.label}</p>
            <label className="dropzone">
              <input type="file" accept={spec.upload.accept} multiple={!spec.upload.accept} />
              {spec.upload.text}
              {spec.upload.hint ? <span className="dropzone__hint">{spec.upload.hint}</span> : null}
            </label>
          </>
        ) : null}
      </section>

      <div className={`res-foot${spec.back ? '' : ' res-foot--right'}`}>
        {spec.back ? (
          <a className="chip chip--lg" href={spec.backHref ?? '/profile/research'}>
            {secondary}
          </a>
        ) : (
          <button className="chip chip--lg" type="button">
            {secondary}
          </button>
        )}
        <button className="btn-solid" type="button">
          {primary}
        </button>
      </div>
    </ProfilePage>
  )
}

export const AddResearch = () => <ResearchForm spec={forms.research} />
export const AddGrant = () => <ResearchForm spec={forms.grant} />
export const AddPatent = () => <ResearchForm spec={forms.patent} />
export const AddProject = () => <ResearchForm spec={forms.project} />
export const AddCollaboration = () => <ResearchForm spec={forms.collaboration} />
export const AddScholar = () => <ResearchForm spec={forms.scholar} />

// ── report + portfolio ───────────────────────────────────────────────────────

const reportIncludes = ['Include Publications', 'Include Grants', 'Include Patents', 'Include Projects', 'Include Scholars']

const preview = [
  '47 Publications · 1,286 Citations',
  '4 Active Grants · ₹1.8 Cr Research Funding',
  '6 Patents Filed · 3 Granted',
  '9 Research Projects in Portfolio',
]

/** 2019:12516 — Generate Research Report */
export function ResearchReport() {
  return (
    <ProfilePage subtitle="Generate a customized research summary report" active="Research">
      <div className="row row--profile">
        <section className="card form-card report-options">
          <h2 className="form-card__title">Report Options</h2>
          <label className="field-lg">
            Academic Year
            <select defaultValue="2025–26">
              <option>2025–26</option>
            </select>
          </label>
          <p className="field-lg__label">Include in Report</p>
          <ul className="checklist checklist--report">
            {reportIncludes.map((item, i) => (
              <li key={item}>
                <label>
                  <input type="checkbox" defaultChecked={i < 4} />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="card form-card report-preview">
          <h2 className="form-card__title">Preview</h2>
          <div className="preview">
            <p className="preview__title">Research Report — Dr. Ananya Rao (2025–26)</p>
            <ul>
              {preview.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="res-foot res-foot--right">
        <button className="chip chip--lg" type="button">
          Download
        </button>
        <button className="btn-solid" type="button">
          Generate PDF
        </button>
      </div>
    </ProfilePage>
  )
}

const templates = [
  ['Promotion Portfolio', 'Structured for academic promotion and tenure review committees.'],
  ['NAAC', 'Formatted per NAAC accreditation research output criteria.'],
  ['NBA', 'Formatted per NBA program accreditation research metrics.'],
  ['Academic CV', 'Concise CV-style summary of publications, grants and patents.'],
  ['Research Portfolio', 'Comprehensive portfolio covering the full research record.'],
]

/** 2019:12718 — Export Research Portfolio */
export function ResearchPortfolio() {
  return (
    <ProfilePage subtitle="Choose a template to export your research portfolio" active="Research">
      <section className="card form-card">
        <h2 className="form-card__title">Select a Template</h2>
        <div className="template-grid">
          {templates.map(([name, body], i) => (
            <label className="template" key={name}>
              <input type="radio" name="template" defaultChecked={i === 0} />
              <span className="template__name">{name}</span>
              <span className="template__body">{body}</span>
              <span className="template__selected">✓ Selected</span>
            </label>
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
          Export PDF
        </button>
      </div>
    </ProfilePage>
  )
}


// ── charts ───────────────────────────────────────────────────────────────────
// ponytail: hand-plotted SVG/CSS from the numbers below — no chart library for
// eight thumbnails. Add one when these need axes, tooltips or live data.

const line = (values: number[]) => {
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 90 - 5}`)
    .join(' ')
}

export function Line({ values, colour }: { values: number[]; colour: string }) {
  return (
    <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={line(values)} fill="none" stroke={colour} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {values.map((_, i) => {
        const [x, y] = line(values).split(' ')[i].split(',')
        return <circle cx={x} cy={y} r="1.4" fill={colour} key={i} vectorEffect="non-scaling-stroke" />
      })}
    </svg>
  )
}

export function Bars({ values, colour }: { values: number[]; colour: string }) {
  const max = Math.max(...values)
  return (
    <div className="chart chart--bars">
      {values.map((v, i) => (
        <span key={i} style={{ height: `${(v / max) * 100}%`, background: colour }} />
      ))}
    </div>
  )
}

const citations = [20, 28, 34, 45, 52, 63, 74, 88]
const publications = [3, 4, 5, 6, 7, 8, 9, 9]
const grants = [1, 2, 2, 3, 4, 5, 6, 8]
const funding = [10, 14, 20, 26, 34, 44, 58, 72]
const researchScore = [520, 580, 640, 700, 760, 810, 842]
const departments = [88, 80, 74, 70, 66]
const collaborations = [
  ['Singapore', 62],
  ['Germany', 38],
  ['USA', 30],
  ['India', 92],
] as const

const impact = [
  { label: 'High Impact (45%)', percent: 45, colour: '#007367' },
  { label: 'Medium Impact (35%)', percent: 35, colour: '#5e95cd' },
  { label: 'Emerging (20%)', percent: 20, colour: '#a58255' },
]

const donut = impact
  .reduce<string[]>((stops, s, i, all) => {
    const from = all.slice(0, i).reduce((sum, p) => sum + p.percent, 0)
    return [...stops, `${s.colour} ${from}% ${from + s.percent}%`]
  }, [])
  .join(', ')

console.assert(
  impact.reduce((sum, s) => sum + s.percent, 0) === 100,
  'research impact shares must sum to 100',
)

/** 2019:11344 — Research Analytics */
export function ResearchAnalytics() {
  return (
    <ProfilePage subtitle="Deep-dive analytics across your entire research portfolio" active="Research">
      <section className="card form-card">
        <h2 className="form-card__title">Research Analytics Dashboard</h2>

        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Citation Analytics</p>
            <Line values={citations} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Publication Growth</p>
            <Bars values={publications} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Grant Analytics (₹L)</p>
            <Bars values={grants} colour="#a58255" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Funding Analytics (₹L)</p>
            <Line values={funding} colour="#dd736e" />
          </div>

          <div className="chart-card">
            <p className="chart-card__title">Research Impact</p>
            <div className="impact">
              <span className="impact__donut" style={{ background: `conic-gradient(${donut})` }} />
              <ul className="impact__legend">
                {impact.map((s) => (
                  <li key={s.label}>
                    <span className="dot" style={{ background: s.colour }} />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Research Score</p>
            <Line values={researchScore} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">International Collaboration Map</p>
            <ul className="hbars">
              {collaborations.map(([place, value]) => (
                <li key={place}>
                  <span className="hbars__label">{place}</span>
                  <span className="hbars__track">
                    <span style={{ width: `${value}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Department Comparison (Score)</p>
            <Bars values={departments} colour="#a58255" />
          </div>
        </div>
      </section>

      <div className="res-foot">
        <a className="chip chip--lg" href="/profile/research">
          Back
        </a>
        <span className="res-foot__right">
          <button className="chip chip--lg" type="button">
            Download
          </button>
          <button className="btn-solid" type="button">
            Export
          </button>
        </span>
      </div>
    </ProfilePage>
  )
}

// ── project record ───────────────────────────────────────────────────────────

const project: {
  name: string
  status: string
  pi: string
  budget: string
  progress: string
  overview: string
  facts: [string, string][]
  funding: [string, string][]
  team: [string, string][]
  timeline: [string, string][]
} = {
  name: 'Federated Learning for Healthcare Analytics',
  status: 'In Progress',
  pi: 'Dr. Ananya Rao',
  budget: '₹62 L',
  progress: '65%',
  overview:
    'A multi-institutional project developing federated aggregation techniques that allow hospitals to jointly train diagnostic ML models without sharing raw patient data, preserving privacy under differential-privacy guarantees.',
  facts: [
    ['Role', 'Principal Investigator'],
    ['Funding Agency', 'DST-SERB'],
    ['Duration', '2024–2027'],
  ],
  funding: [
    ['Agency', 'DST-SERB'],
    ['Total Amount', '₹62,00,000'],
    ['Utilized', '₹40,30,000 (65%)'],
    ['Remaining', '₹21,70,000'],
  ],
  team: [
    ['Dr. Ananya Rao', 'Principal Investigator'],
    ['Dr. Vikram Kumar', 'Co-Investigator'],
    ['Kavya Menon', 'PhD Scholar'],
    ['Arjun Nair', 'PhD Scholar'],
  ],
  timeline: [
    ['Project Kickoff', 'Mar 2024'],
    ['Phase I: Architecture Design', 'Sep 2024'],
  ],
}

// Shared by every "full record" screen: a strip header (kicker + name, a
// status badge, N label/value cells) over a two-column body of cards.
export function RecordStrip({
  kicker,
  name,
  status,
  statusTone = 'progress',
  cells,
}: {
  kicker: string
  name: string
  status?: string
  statusTone?: 'progress' | 'completed'
  cells: [string, string][]
}) {
  return (
    <section className="card project-strip">
      <span className="project-strip__main">
        <span className="res-stat__label">{kicker}</span>
        <span className="project-strip__name">{name}</span>
      </span>
      {status ? (
        <span className="project-strip__cell">
          <span className="res-stat__label">STATUS</span>
          <span className={`badge badge--${statusTone}`}>
            <span className="dot" />
            {status}
          </span>
        </span>
      ) : null}
      {cells.map(([label, value]) => (
        <span className="project-strip__cell" key={label}>
          <span className="res-stat__label">{label}</span>
          <span className="project-strip__value">{value}</span>
        </span>
      ))}
    </section>
  )
}

export function PeopleList({ people }: { people: [string, string][] }) {
  return (
    <ul className="team">
      {people.map(([name, role]) => (
        <li key={name}>
          <span className="avatar avatar--green">
            {name
              .split(' ')
              .slice(-2)
              .map((w) => w[0])
              .join('')}
          </span>
          <span className="team__name">{name}</span>
          <span className="team__role">{role}</span>
        </li>
      ))}
    </ul>
  )
}

export function FileList({ files }: { files: [string, string][] }) {
  return (
    <ul className="files">
      {files.map(([name, size]) => (
        <li key={name}>
          <span className="files__name">{name}</span>
          <span className="files__size">{size}</span>
        </li>
      ))}
    </ul>
  )
}

/** 2019:12904 — full project record */
export function ProjectRecord() {
  return (
    <ProfilePage subtitle={`${project.name} — full project record`} active="Research">
      <RecordStrip
        kicker="PROJECT"
        name={project.name}
        status={project.status}
        cells={[
          ['PI', project.pi],
          ['BUDGET', project.budget],
          ['PROGRESS', project.progress],
        ]}
      />

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card form-card">
            <h2 className="form-card__title">Overview</h2>
            <p className="about__body">{project.overview}</p>
            <dl className="kv kv--inline">
              {project.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Timeline</h2>
            <ol className="timeline-steps">
              {project.timeline.map(([title, when]) => (
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

        <div className="profile__side">
          <section className="card form-card">
            <h2 className="form-card__title">Funding</h2>
            <dl className="kv kv--inline">
              {project.funding.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Team</h2>
            <PeopleList people={project.team} />
          </section>
        </div>
      </div>
    </ProfilePage>
  )
}
