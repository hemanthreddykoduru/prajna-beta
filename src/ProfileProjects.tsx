import { ProfilePage } from './Profile'
import { ResearchForm, RecordStrip, PeopleList, FileList, type FormSpec } from './ProfileResearch'
import './ProfileResearch.css'

const stats = [
  ['9', 'TOTAL PROJECTS'],
  ['4', 'ACTIVE PROJECTS'],
  ['5', 'COMPLETED PROJECTS'],
  ['3', 'INDUSTRY PROJECTS'],
  ['4', 'GOVERNMENT PROJECTS'],
  ['2', 'INTERNAL PROJECTS'],
  ['₹2.3 Cr', 'TOTAL FUNDING'],
  ['11', 'STUDENTS INVOLVED'],
]

const filters = [
  ['Project Type', 'All Types'],
  ['Funding Agency', 'All Agencies'],
  ['Status', 'All Statuses'],
  ['Department', 'Computer Science & Engineering'],
  ['Year', '2026'],
]

const table = [
  { title: 'Federated Learning for Healthcare Analytics', role: 'PI', agency: 'DST-SERB', amount: '₹62 L', type: 'Government', duration: '2024–27', progress: 65, status: 'In Progress' },
]

/** 2019:15461 — Projects tab landing */
export function ProfileProjects() {
  return (
    <ProfilePage subtitle="Project management workspace — track funding, milestones, and teams" active="Projects">
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
          <input type="search" placeholder="Search projects by title, agency…" />
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
        <a className="btn-solid" href="/profile/projects/new">
          + Add Project
        </a>
        <a className="chip chip--lg" href="/profile/projects/analytics">
          Project Analytics
        </a>
      </div>

      <section className="card form-card">
        <h2 className="form-card__title">Project Table</h2>
        <p className="muted-12">Scroll horizontally to view all columns →</p>
        <div className="project-table-wrap">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Role</th>
                <th>Funding Agency</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.title}>
                  <td>
                    <a className="project-table__link" href="/profile/research/project">
                      {row.title}
                    </a>
                  </td>
                  <td>{row.role}</td>
                  <td>{row.agency}</td>
                  <td>{row.amount}</td>
                  <td>{row.type}</td>
                  <td>{row.duration}</td>
                  <td>
                    <span className="track track--cell">
                      <span style={{ width: `${row.progress}%` }} />
                    </span>
                  </td>
                  <td>
                    <span className="badge badge--progress">
                      <span className="dot" />
                      {row.status}
                    </span>
                  </td>
                  <td>4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ProfilePage>
  )
}

/** 2019:14975 — Projects tab: Add Project */
const newProjectForm: FormSpec = {
  route: '/profile/projects/new',
  subtitle: 'Register a new research or consultancy project',
  title: 'Project Details',
  active: 'Projects',
  backHref: '/profile/projects',
  fields: [
    { label: 'Project Title', value: 'Quantum-Resilient Cryptography for IoT Networks', wide: true },
    { label: 'Project Type', value: 'Government', kind: 'select' },
    { label: 'Funding Agency', value: 'DST-SERB', kind: 'select' },
    { label: 'Funding Amount', value: '₹45,00,000' },
    { label: 'Role', value: 'Principal Investigator', kind: 'select' },
    { label: 'Principal Investigator', value: 'Dr. Ananya Rao' },
    { label: 'Co-Investigators', value: 'Dr. Vikram Kumar' },
    { label: 'Department', value: 'Computer Science & Engineering', kind: 'select' },
    { label: 'Start Date', value: '1 Sep 2026', kind: 'date' },
    { label: 'End Date', value: '31 Aug 2029', kind: 'date' },
    { label: 'Objectives', value: 'Design post-quantum cryptographic protocols suitable for resource-constrained IoT devices.', wide: true },
  ],
  buttons: ['Back', 'Save Project'],
  back: true,
}

export const AddProjectRecord = () => <ResearchForm spec={newProjectForm} />

// ── full project record (Projects-tab variant) ──────────────────────────────

const project2 = {
  name: 'Federated Learning for Healthcare Analytics',
  status: 'In Progress',
  role: 'Principal Investigator',
  funding: '₹62 L',
  progress: '65%',
  overview:
    'A multi-institutional project developing federated aggregation techniques that allow hospitals to jointly train diagnostic ML models without sharing raw patient data.',
  facts: [
    ['Department', 'Computer Science & Engineering'],
    ['Duration', '2024–2027'],
  ] as [string, string][],
  objectives: [
    'Develop federated aggregation protocol with differential privacy',
    'Deploy pilot with 2 partner hospitals',
    'Publish results in top-tier venues',
  ],
  fundingDetails: [
    ['Agency', 'DST-SERB'],
    ['Total Amount', '₹62,00,000'],
    ['Utilized', '₹40,30,000 (65%)'],
    ['Remaining', '₹21,70,000'],
  ] as [string, string][],
  team: [
    ['Dr. Ananya Rao', 'Principal Investigator'],
    ['Dr. Vikram Kumar', 'Co-Investigator'],
    ['Kavya Menon', 'PhD Scholar'],
    ['Arjun Nair', 'PhD Scholar'],
  ] as [string, string][],
  documents: [
    ['Project_Proposal.pdf', '1.2 MB'],
    ['Ethics_Approval.pdf', '340 KB'],
    ['Progress_Report_Y1.pdf', '890 KB'],
  ] as [string, string][],
}

/** 2019:16090 — Projects tab: full project record */
export function ProjectFullRecord() {
  return (
    <ProfilePage subtitle={`${project2.name} — full project record`} active="Projects">
      <RecordStrip
        kicker="PROJECT"
        name={project2.name}
        status={project2.status}
        cells={[
          ['ROLE', project2.role],
          ['FUNDING', project2.funding],
          ['PROGRESS', project2.progress],
        ]}
      />

      <div className="row row--profile">
        <div className="profile__main">
          <section className="card form-card">
            <h2 className="form-card__title">Project Overview</h2>
            <p className="about__body">{project2.overview}</p>
            <dl className="kv kv--inline">
              {project2.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="field-lg__label">Objectives</p>
            <ul className="bullets bullets--plain">
              {project2.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Funding Details</h2>
            <dl className="kv kv--inline">
              {project2.fundingDetails.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="profile__side">
          <section className="card form-card">
            <h2 className="form-card__title">Team Members</h2>
            <PeopleList people={project2.team} />
          </section>

          <section className="card form-card">
            <h2 className="form-card__title">Project Documents</h2>
            <FileList files={project2.documents} />
          </section>
        </div>
      </div>
    </ProfilePage>
  )
}
