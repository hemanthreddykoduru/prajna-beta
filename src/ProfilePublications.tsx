import { ProfilePage } from './Profile'
import { ResearchForm, type FormSpec } from './ProfileResearch'
import './ProfileResearch.css'
import './ProfilePublications.css'

const stats = [
  ['47', 'TOTAL PUBLICATIONS'],
  ['28', 'JOURNAL ARTICLES'],
  ['12', 'CONFERENCE PAPERS'],
  ['4', 'BOOK CHAPTERS'],
  ['3', 'BOOKS'],
  ['6', 'PREPRINTS'],
  ['31', 'SCOPUS INDEXED'],
  ['24', 'SCI/SCIE INDEXED'],
  ['9', 'UGC CARE'],
  ['1,286', 'TOTAL CITATIONS'],
  ['19', 'H-INDEX'],
  ['28', 'I10-INDEX'],
  ['27.4', 'AVERAGE CITATIONS'],
]

const filters = [
  ['Publication Type', 'All Types'],
  ['Year', '2026'],
  ['Journal', 'All Journals'],
  ['Publisher', 'All Publishers'],
  ['Quartile', 'All Quartiles'],
  ['Indexing', 'All Indexes'],
  ['Status', 'All Statuses'],
  ['Sort By', 'Most Recent'],
]

const actions = [
  { label: '+ Add Publication', href: '/profile/publications/new', primary: true },
  { label: 'Import from Scopus', href: '/profile/publications/scopus' },
  { label: 'Import ORCID', href: '/profile/publications/orcid' },
  { label: 'Import Google Scholar', href: '/profile/publications/scholar' },
  { label: 'Publication Analytics', href: '/profile/publications/analytics' },
]

/** 2019:13220 — Publications tab landing */
export function ProfilePublications() {
  return (
    <ProfilePage subtitle="Publication management, impact tracking, and portfolio workspace" active="Publications">
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
          Search Publications
          <input type="search" placeholder="Search by title, author, keyword…" />
        </label>
        {filters.map(([label, value]) => (
          <label className="field-sm" key={label}>
            {label}
            <select defaultValue={value}>
              <option>{value}</option>
            </select>
          </label>
        ))}
      </div>

      <div className="res-actions">
        {actions.map((a) => (
          <a className={a.primary ? 'btn-solid' : 'chip chip--lg'} href={a.href ?? `#${a.label}`} key={a.label}>
            {a.label}
          </a>
        ))}
        <a className="link" href="/profile/publications/report">
          Generate Publication Report
        </a>
      </div>

      <div className="res-links">
        <a className="link" href="/profile/publications/portfolio">
          Export Publication Portfolio
        </a>
        <a className="link" href="/profile/publications/sync">
          Sync External Profiles
        </a>
      </div>
    </ProfilePage>
  )
}

/** 2019:13868 — Add Publication */
const publicationForm: FormSpec = {
  route: '/profile/publications/new',
  subtitle: 'Submit a new publication to your portfolio',
  title: 'Publication Details',
  fields: [
    { label: 'Publication Title', value: 'Edge-based Differential Privacy for Federated Learning', wide: true },
    { label: 'Authors', value: 'Rao, A.; Kumar, V.' },
    { label: 'Faculty Position', value: '1st Author', kind: 'select' },
    { label: 'Publication Type', value: 'Journal Article', kind: 'select' },
    { label: 'Journal', value: 'ACM TIST' },
    { label: 'Conference', value: 'N/A' },
    { label: 'Publisher', value: 'ACM' },
    { label: 'Volume', value: '17' },
    { label: 'Issue', value: '2' },
    { label: 'Pages', value: '1-24' },
    { label: 'DOI', value: '10.1145/tist.2026.01' },
    { label: 'ISSN', value: '2157-6904' },
    { label: 'ISBN', value: 'N/A' },
    { label: 'Visibility', value: 'Public', kind: 'select' },
  ],
  buttons: ['Save', 'Submit'],
}

export const AddPublication = () => <ResearchForm spec={publicationForm} />

// ── imports ──────────────────────────────────────────────────────────────────

type ImportRow = { title: string; meta: string; badge: string; checked?: boolean }

function ImportList({ heading, rows, selectable }: { heading: string; rows: ImportRow[]; selectable?: boolean }) {
  return (
    <>
      <p className="import__heading">{heading}</p>
      <ul className="import__list">
        {rows.map((r) => (
          <li key={r.title}>
            {selectable ? <input type="checkbox" defaultChecked={r.checked} aria-label={r.title} /> : null}
            <span className="import__text">
              <span className="import__title">{r.title}</span>
              <span className="import__meta">{r.meta}</span>
            </span>
            <span className="import__badge">{r.badge}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

const scopusNew: ImportRow[] = [
  { title: 'Edge-based Differential Privacy for Federated Learning', meta: 'ACM TIST, 2026 · DOI: 10.1145/tist.2026.01', badge: 'New', checked: true },
  { title: 'Consensus Protocols for Low-Power Mesh Networks', meta: 'IEEE INFOCOM, 2024', badge: 'New', checked: true },
  { title: 'Edge Anomaly Detection for IoT Networks', meta: 'ICDCS 2026', badge: 'New', checked: true },
  { title: 'Privacy-Preserving ML: A Survey', meta: 'ACM Computing Surveys (submitted)', badge: 'New' },
]

/** 2019:14078 — Import from Scopus */
export function ImportScopus() {
  return (
    <ProfilePage subtitle="Import and reconcile publications from your Scopus profile" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">Scopus Profile</h2>
        <label className="field-lg field-lg--wide">
          Scopus Author ID
          <input placeholder="57201234567" />
        </label>
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Publication Search Results</h2>
        <p className="import__notice">
          Duplicate Detection: 3 publications already exist in your portfolio and are pre-excluded below.
        </p>
        <ImportList selectable heading={`New Publications (${scopusNew.length})`} rows={scopusNew} />
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/publications">
          Back
        </a>
        <button className="btn-solid" type="button">
          Import Selected
        </button>
      </div>
    </ProfilePage>
  )
}

const orcidProfile = [
  ['ORCID ID', '0000-0002-1825-0097'],
  ['Profile Status', 'Connected & Verified'],
  ['Last Synced', '2 hours ago'],
]

const orcidMissing: ImportRow[] = [
  { title: 'Consensus Protocols for Low-Power Mesh Networks', meta: 'IEEE INFOCOM, 2024', badge: 'Missing' },
  { title: 'Edge Anomaly Detection for IoT Networks', meta: 'ICDCS 2026', badge: 'Missing' },
]

const syncHistory = [
  'Synced successfully — 27 Jul 2026, 09:12 AM (5 matched, 2 missing)',
  'Synced successfully — 15 Jun 2026, 02:30 PM (5 matched, 3 missing)',
  'Initial connection established — 3 Jan 2025',
]

/** 2019:20978 — Sync with ORCID */
export function ImportOrcid() {
  return (
    <ProfilePage subtitle="Synchronize your publication list with ORCID" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">ORCID Profile</h2>
        <dl className="kv">
          {orcidProfile.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Publication List</h2>
        <p className="import__notice">Duplicate Detection: 5 publications matched with your existing portfolio.</p>
        <ImportList heading={`Missing Publications (${orcidMissing.length}) — in ORCID but not in portfolio`} rows={orcidMissing} />

        <p className="import__heading">Sync History</p>
        <ul className="import__history">
          {syncHistory.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/publications">
          Back
        </a>
        <button className="btn-solid" type="button">
          Sync Now
        </button>
      </div>
    </ProfilePage>
  )
}

const scholarProfile = [
  ['Profile URL', 'scholar.google.com/citations?user=AR2026'],
  ['H-index (Scholar)', '21'],
  ['Last Synced', '1 day ago'],
]

const citationUpdates = [
  { title: 'Federated Learning at Scale', meta: '312 → 318 citations (+6)', badge: 'Updated' },
  { title: 'Consensus Protocols for Low-Power Mesh Networks', meta: '27 → 29 citations (+2)', badge: 'Updated' },
]

const scholarNew: ImportRow[] = [
  { title: 'Privacy-Preserving ML: A Survey', meta: 'ACM Computing Surveys (submitted)', badge: 'New' },
]

/** 2019:21178 — Import Google Scholar */
export function ImportScholar() {
  return (
    <ProfilePage subtitle="Synchronize citations and publications with Google Scholar" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">Scholar Profile</h2>
        <dl className="kv">
          {scholarProfile.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Citation Updates</h2>
        <ImportList heading="" rows={citationUpdates} />
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Publication Updates</h2>
        <p className="import__notice">Duplicate Detection: 1 new publication found that is not yet in your portfolio.</p>
        <ImportList heading="" rows={scholarNew} />
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/publications">
          Back
        </a>
        <button className="btn-solid" type="button">
          Sync Now
        </button>
      </div>
    </ProfilePage>
  )
}

// ── analytics ────────────────────────────────────────────────────────────────

import { Line, Bars, RecordStrip, FileList } from './ProfileResearch'

const pubGrowth = [4, 6, 8, 10, 13, 16, 18]
const citationGrowth = [40, 90, 160, 260, 400, 620, 900, 1286]
const topJournals = [
  ['IEEE TDSC', 88],
  ['Elsevier JBI', 34],
  ['ACM TIST', 12],
]
const researchAreas = [
  ['ML', 90],
  ['Systems', 62],
  ['Security', 48],
]
const pubTypes = [
  { label: 'Journal (60%)', percent: 60, colour: '#007367' },
  { label: 'Conference (25%)', percent: 25, colour: '#5e95cd' },
  { label: 'Book/Chapter (15%)', percent: 15, colour: '#a58255' },
]
const quartiles = [
  { label: 'Q1 (45%)', percent: 45, colour: '#007367' },
  { label: 'Q2 (30%)', percent: 30, colour: '#5e95cd' },
  { label: 'Q3 (18%)', percent: 18, colour: '#a58255' },
  { label: 'Q4 (7%)', percent: 7, colour: '#dd736e' },
]
const hIndexTrend = [10, 12, 14, 16, 17, 18, 19]
const i10Trend = [12, 15, 18, 21, 24, 26, 28]
const intlCollab = [
  ['Singapore', 70],
  ['Germany', 45],
]

function donutOf(slices: { colour: string; percent: number }[]) {
  return slices
    .reduce<string[]>((stops, s, i, all) => {
      const from = all.slice(0, i).reduce((sum, p) => sum + p.percent, 0)
      return [...stops, `${s.colour} ${from}% ${from + s.percent}%`]
    }, [])
    .join(', ')
}

export function Donut({ slices }: { slices: { label: string; percent: number; colour: string }[] }) {
  return (
    <div className="impact">
      <span className="impact__donut" style={{ background: `conic-gradient(${donutOf(slices)})` }} />
      <ul className="impact__legend">
        {slices.map((s) => (
          <li key={s.label}>
            <span className="dot" style={{ background: s.colour }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

console.assert(
  pubTypes.reduce((sum, s) => sum + s.percent, 0) === 100 && quartiles.reduce((sum, s) => sum + s.percent, 0) === 100,
  'publication donut shares must sum to 100',
)

/** 2019:14310 — Publication Analytics */
export function PublicationAnalytics() {
  return (
    <ProfilePage subtitle="Deep-dive analytics across your publication portfolio" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">Publication Analytics Dashboard</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Publication Growth</p>
            <Bars values={pubGrowth} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Citation Growth</p>
            <Line values={citationGrowth} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Top Journals (by citations)</p>
            <ul className="hbars hbars--gold">
              {topJournals.map(([label, value]) => (
                <li key={label}>
                  <span className="hbars__label">{label}</span>
                  <span className="hbars__track hbars__track--gold">
                    <span style={{ width: `${(Number(value) / 88) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Research Areas</p>
            <ul className="hbars hbars--coral">
              {researchAreas.map(([label, value]) => (
                <li key={label}>
                  <span className="hbars__label">{label}</span>
                  <span className="hbars__track hbars__track--coral">
                    <span style={{ width: `${(Number(value) / 90) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Publication Types</p>
            <Donut slices={pubTypes} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Quartile Distribution</p>
            <Donut slices={quartiles} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">H-index Trend</p>
            <Line values={hIndexTrend} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">i10-index Trend</p>
            <Line values={i10Trend} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">International Collaborations</p>
            <ul className="hbars">
              {intlCollab.map(([place, value]) => (
                <li key={place}>
                  <span className="hbars__label">{place}</span>
                  <span className="hbars__track">
                    <span style={{ width: `${value}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/publications">
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

// ── report / portfolio / sync ───────────────────────────────────────────────

const pubReportIncludes = ['Include Citations', 'Include DOI', 'Include Abstract']

/** 2019:14589 — Generate Publication Report */
export function PublicationReport() {
  return (
    <ProfilePage subtitle="Generate a customized publication summary report" active="Publications">
      <div className="row row--profile">
        <section className="card form-card report-options">
          <h2 className="form-card__title">Report Options</h2>
          <label className="field-lg">
            Academic Year
            <select defaultValue="2025–26">
              <option>2025–26</option>
            </select>
          </label>
          <label className="field-lg">
            Publication Type
            <select defaultValue="All Types">
              <option>All Types</option>
            </select>
          </label>
          <label className="field-lg">
            Department
            <input placeholder="Computer Science & Engineering" />
          </label>
          <label className="field-lg">
            Indexing
            <select defaultValue="All Indexes">
              <option>All Indexes</option>
            </select>
          </label>
          <p className="field-lg__label">Include in Report</p>
          <ul className="checklist checklist--report">
            {pubReportIncludes.map((item, i) => (
              <li key={item}>
                <label>
                  <input type="checkbox" defaultChecked={i < 2} />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="card form-card report-preview" />
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

const pubTemplates = [
  ['Promotion Portfolio', 'Structured for academic promotion and tenure review committees.'],
  ['NAAC', 'Formatted per NAAC accreditation publication criteria.'],
  ['NBA', 'Formatted per NBA program accreditation research metrics.'],
  ['Research Portfolio', 'Comprehensive portfolio covering the full publication record.'],
  ['Academic CV', 'Concise CV-style list of publications with citation counts.'],
  ['Custom Portfolio', 'Manually select which publications and fields to include.'],
]

/** 2019:14785 — Export Publication Portfolio */
export function PublicationPortfolio() {
  return (
    <ProfilePage subtitle="Choose a template to export your publication portfolio" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">Select a Template</h2>
        <div className="template-grid">
          {pubTemplates.map(([name, body], i) => (
            <label className="template" key={name}>
              <input type="radio" name="pub-template" defaultChecked={i === 0} />
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

const connectedProfiles = [
  { name: 'Scopus', meta: 'Author ID: 57201234567', synced: 'Last sync: 2 hours ago', status: 'Completed' },
  { name: 'ORCID', meta: '0000-0002-1825-0097', synced: 'Last sync: 2 hours ago', status: 'Completed' },
  { name: 'Google Scholar', meta: 'scholar.google.com/citations?user=AR2026', synced: 'Last sync: 1 day ago', status: 'Completed' },
  { name: 'Web of Science', meta: 'AAB-1234-2020', synced: 'Last sync: 3 days ago', status: 'Completed' },
  { name: 'ResearchGate', meta: 'researchgate.net/profile/Ananya-Rao-CSE', synced: 'Last sync: Not synced yet', status: 'Pending' },
]

/** 2019:14975 — Sync External Profiles */
export function SyncProfiles() {
  return (
    <ProfilePage subtitle="Manage connections to your external academic profiles" active="Publications">
      <section className="card form-card">
        <h2 className="form-card__title">Connected Profiles</h2>
        <ul className="connections">
          {connectedProfiles.map((p) => (
            <li key={p.name}>
              <span className="connections__text">
                <span className="connections__name">{p.name}</span>
                <span className="muted-12">{p.meta}</span>
              </span>
              <span className="connections__sync">{p.synced}</span>
              <span className={`badge badge--${p.status === 'Completed' ? 'completed' : 'pending'}`}>
                <span className="dot" />
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="res-foot res-foot--right">
        <button className="chip chip--lg chip--danger" type="button">
          Disconnect
        </button>
        <button className="chip chip--lg" type="button">
          Manage Connections
        </button>
        <button className="btn-solid" type="button">
          Sync All
        </button>
      </div>
    </ProfilePage>
  )
}

// ── full publication record ─────────────────────────────────────────────────

const publication = {
  title: 'Federated Learning at Scale',
  status: 'Completed',
  citations: '312',
  impactFactor: '7.2',
  quartile: 'Q1',
  facts: [
    ['Authors', 'Rao, A.; Krishnan, M.'],
    ['Faculty Contribution', '1st Author — conceptualization, methodology, writing'],
    ['Journal Information', 'IEEE Transactions on Dependable and Secure Computing, Vol. 22, Issue 4'],
    ['Publisher Information', 'IEEE — publisher.ieee.org'],
    ['DOI', '10.1109/tdsc.2025.11'],
    ['Research Area', 'Machine Learning — Federated Learning'],
  ] as [string, string][],
  abstract:
    'This paper presents a federated learning framework capable of scaling to thousands of participating institutions while maintaining formal differential-privacy guarantees and sub-linear communication overhead.',
  keywords: 'federated learning, scalability, differential privacy, distributed systems',
  files: [
    ['Manuscript_Final.pdf', '1.8 MB'],
    ['Acceptance_Letter.pdf', '210 KB'],
    ['Copyright_Form.pdf', '180 KB'],
  ] as [string, string][],
  reviews: [
    { author: 'Reviewer 2', date: 'Feb 2025', body: 'Please clarify the communication complexity analysis in Section 4.2 and add a comparison against FedAvg baselines.' },
    { author: 'Dr. Ananya Rao', date: 'Mar 2025', tag: 'Author response', body: 'Added Section 4.3 with the requested complexity analysis and FedAvg comparison table.' },
  ],
}

/** 2019:15175 — full publication record */
export function PublicationRecord() {
  return (
    <ProfilePage subtitle={`${publication.title} — full publication record`} active="Publications">
      <RecordStrip
        kicker="PUBLICATION"
        name={publication.title}
        status={publication.status}
        cells={[
          ['CITATIONS', publication.citations],
          ['IMPACT FACTOR', publication.impactFactor],
          ['QUARTILE', publication.quartile],
        ]}
      />

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card form-card">
            <h2 className="form-card__title">Publication Overview</h2>
            <dl className="kv">
              {publication.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>Abstract</dt>
                <dd className="kv__prose">{publication.abstract}</dd>
              </div>
              <div>
                <dt>Keywords</dt>
                <dd className="muted-12">{publication.keywords}</dd>
              </div>
            </dl>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Citation Metrics</h2>
            <Line values={citationGrowth} colour="#007367" />
          </section>
        </div>

        <div className="profile__side">
          <section className="card form-card">
            <h2 className="form-card__title">Supporting Files</h2>
            <FileList files={publication.files} />
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Reviewer Comments</h2>
            <ul className="reviews">
              {publication.reviews.map((r) => (
                <li key={r.author + r.date}>
                  <p className="reviews__meta">
                    <span className="reviews__author">{r.tag ?? r.author}</span>
                    {r.tag ? <span className="reviews__by"> · {r.author}</span> : null}
                    <span className="muted-12"> · {r.date}</span>
                  </p>
                  <p className="reviews__body">{r.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </ProfilePage>
  )
}
