import { ProfilePage } from './Profile'
import { RecordStrip, Line, Bars } from './ProfileResearch'
import { Donut } from './ProfilePublications'
import './ProfileResearch.css'

// ── Achievements tab: Analytics + Portfolio ─────────────────────────────────

const achByYear = [4, 5, 6, 7, 8, 9, 10]
const awardsByCategory = [
  { label: 'Award (32%)', percent: 32, colour: '#007367' },
  { label: 'Talk (39%)', percent: 39, colour: '#5e95cd' },
  { label: 'Membership (14%)', percent: 14, colour: '#a58255' },
  { label: 'Other (15%)', percent: 15, colour: '#dd736e' },
]
const nationalIntl = [
  { label: 'International (57%)', percent: 57, colour: '#007367' },
  { label: 'National (43%)', percent: 43, colour: '#5e95cd' },
]
const invitedTalks = [3, 4, 5, 7, 9, 11]
const membershipGrowth = [2, 3, 4, 4, 5, 6]
const reviewerAssignments = [1, 2, 3, 4, 5, 7]
const growthTimeline = [10, 14, 18, 22, 26, 28]
const recognitionDist = [
  { label: 'University (25%)', percent: 25, colour: '#a58255' },
  { label: 'National (36%)', percent: 36, colour: '#5e95cd' },
  { label: 'International (39%)', percent: 39, colour: '#007367' },
]

console.assert(
  awardsByCategory.reduce((s, x) => s + x.percent, 0) === 100 &&
    nationalIntl.reduce((s, x) => s + x.percent, 0) === 100 &&
    recognitionDist.reduce((s, x) => s + x.percent, 0) === 100,
  'achievement analytics donut shares must sum to 100',
)

/** 2019:17627 — Achievements tab: Achievement Analytics */
export function AchievementAnalytics() {
  return (
    <ProfilePage subtitle="Visualize your achievements, recognitions, and professional growth" active="Achievements">
      <section className="card form-card">
        <h2 className="form-card__title">Achievement Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Achievements by Year</p>
            <Bars values={achByYear} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Awards by Category</p>
            <Donut slices={awardsByCategory} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">National vs International</p>
            <Donut slices={nationalIntl} />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Invited Talks (per year)</p>
            <Bars values={invitedTalks} colour="#a58255" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Membership Growth</p>
            <Line values={membershipGrowth} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Reviewer Assignments</p>
            <Bars values={reviewerAssignments} colour="#dd736e" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Professional Growth Timeline</p>
            <Line values={growthTimeline} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Recognition Distribution</p>
            <Donut slices={recognitionDist} />
          </div>
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/achievements">
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

const achTemplates = [
  ['Promotion Portfolio', 'Structured for academic promotion and tenure review committees.'],
  ['Academic CV', 'Concise CV-style list of achievements and recognitions.'],
  ['NAAC', 'Formatted per NAAC accreditation criteria.'],
  ['NBA', 'Formatted per NBA program accreditation metrics.'],
  ['Annual Report', 'Summary suitable for department annual reporting.'],
  ['Custom Portfolio', 'Manually select which achievements and fields to include.'],
]

const achIncludes = [
  ['Include Awards', 'Include Talks', 'Include Memberships'],
  ['Include Certifications', 'Include Reviewer Roles', 'Include Editorial Roles'],
]

/** 2019:17894 — Achievements tab: Generate Portfolio */
export function AchievementPortfolio() {
  return (
    <ProfilePage subtitle="Generate a professional achievement portfolio" active="Achievements">
      <section className="card form-card">
        <h2 className="form-card__title">Select a Template</h2>
        <div className="template-grid">
          {achTemplates.map(([name, body], i) => (
            <label className="template" key={name}>
              <input type="radio" name="ach-template" defaultChecked={i === 0} />
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
          {achIncludes.map((col, i) => (
            <ul className="checklist checklist--report" key={i}>
              {col.map((item, j) => (
                <li key={item}>
                  <label>
                    <input type="checkbox" defaultChecked={!(i === 1 && j === 1)} />
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
          Generate DOCX
        </button>
        <button className="btn-solid" type="button">
          Generate PDF
        </button>
      </div>
    </ProfilePage>
  )
}

// ── Teaching tab ─────────────────────────────────────────────────────────────

const teachStats = [
  ['15+ Years', 'TEACHING EXPERIENCE'],
  ['24', 'COURSES DELIVERED'],
  ['3,120', 'STUDENTS TAUGHT'],
  ['47', 'PROJECTS GUIDED'],
  ['4.6 / 5', 'AVERAGE FEEDBACK'],
  ['93%', 'PASS PERCENTAGE'],
  ['2', 'TEACHING AWARDS'],
  ['878', 'TEACHING SCORE'],
]

const teachFilters = [
  ['Academic Year', '2025–26'],
  ['Semester', 'All Semesters'],
  ['Program', 'All Programs'],
  ['Course Type', 'All Types'],
  ['Department', 'Computer Science & Engineering'],
]

const expertiseAreas = ['Distributed Systems', 'Cloud Computing', 'Operating Systems', 'Machine Learning']

/** 2019:18121 — Teaching tab landing */
export function ProfileTeaching() {
  return (
    <ProfilePage subtitle="Teaching portfolio — philosophy, performance, mentoring, and excellence" active="Teaching">
      <div className="res-stats">
        {teachStats.map(([value, label]) => (
          <div className="card res-stat" key={label}>
            <span className="res-stat__value">{value}</span>
            <span className="res-stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="res-filters">
        <label className="field-sm">
          Search
          <input type="search" placeholder="Search courses by name, code…" />
        </label>
        {teachFilters.map(([label, value]) => (
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
        <a className="btn-solid" href="/profile/teaching/analytics">
          Teaching Analytics
        </a>
        <a className="chip chip--lg" href="/profile/teaching/portfolio">
          Teaching Portfolio
        </a>
      </div>

      <section className="card form-card">
        <h2 className="form-card__title">Teaching Profile</h2>
        <p className="field-lg__label">Teaching Philosophy</p>
        <p className="about__body">
          I believe in learning through building — students grasp distributed systems concepts best when they design,
          break, and fix real systems, not just read about them.
        </p>
        <p className="field-lg__label">Areas of Expertise</p>
        <ul className="tags">
          {expertiseAreas.map((t) => (
            <li className="tag tag--solid" key={t}>
              {t}
            </li>
          ))}
        </ul>
      </section>
    </ProfilePage>
  )
}

// ── full course record ───────────────────────────────────────────────────────

const course = {
  title: 'Distributed Systems (CSE301)',
  program: 'B.Tech CSE',
  semester: 'Sem V, 2025–26',
  students: '120',
  feedback: '4.7 / 5',
  overview: [
    ['Course Code', 'CSE301'],
    ['Credits', '4'],
    ['Program', 'B.Tech CSE'],
    ['Academic Year', '2025–26'],
  ] as [string, string][],
  objectives: [
    'Understand core distributed systems concepts: consensus, replication, consistency',
    'Design and implement a small distributed key-value store',
    'Analyze fault-tolerance trade-offs in real deployments',
  ],
  strength: [
    ['Student Strength', '120 enrolled'],
    ['Teaching Hours', '60 hours (45 lecture + 15 lab)'],
  ] as [string, string][],
}

/** 2019:18588 — full course record */
export function CourseRecord() {
  return (
    <ProfilePage subtitle={`${course.title} — complete teaching profile`} active="Teaching">
      <RecordStrip
        kicker="COURSE"
        name={course.title}
        cells={[
          ['PROGRAM', course.program],
          ['SEMESTER', course.semester],
          ['STUDENTS', course.students],
          ['AVG FEEDBACK', course.feedback],
        ]}
      />

      <section className="card form-card">
        <h2 className="form-card__title">Course Overview</h2>
        <dl className="kv">
          {course.overview.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>Course Objectives</dt>
            <dd>
              <ul className="bullets--plain">
                {course.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      <section className="card form-card">
        <h2 className="form-card__title">Student Strength &amp; Teaching Hours</h2>
        <dl className="kv kv--inline">
          {course.strength.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ProfilePage>
  )
}

// ── Teaching Analytics ───────────────────────────────────────────────────────

const teachingHours = [8, 10, 9, 11, 12, 10]
const studentFeedback = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7]
const passPercentage = [82, 85, 87, 89, 91, 93]
const projectsGuided = [4, 6, 7, 8, 10, 12]
const semesterComparison = [
  ['Sem V', 82],
  ['Sem VI', 74],
  ['Sem VII', 78],
]
const teachingScore = [700, 740, 780, 810, 840, 878]
const studentPerformance = [70, 76, 81, 85, 89, 93]

/** 2019:18843 — Teaching tab: Teaching Analytics */
export function TeachingAnalytics() {
  return (
    <ProfilePage subtitle="Detailed analytics across your teaching portfolio" active="Teaching">
      <section className="card form-card">
        <h2 className="form-card__title">Teaching Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <p className="chart-card__title">Teaching Hours</p>
            <Bars values={teachingHours} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Student Feedback</p>
            <Line values={studentFeedback} colour="#5e95cd" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Pass Percentage</p>
            <Line values={passPercentage} colour="#a58255" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Projects Guided</p>
            <Bars values={projectsGuided} colour="#dd736e" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Semester Comparison (avg feedback)</p>
            <ul className="hbars">
              {semesterComparison.map(([label, value]) => (
                <li key={label}>
                  <span className="hbars__label">{label}</span>
                  <span className="hbars__track">
                    <span style={{ width: `${value}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Teaching Score</p>
            <Line values={teachingScore} colour="#007367" />
          </div>
          <div className="chart-card">
            <p className="chart-card__title">Student Performance (avg score)</p>
            <Line values={studentPerformance} colour="#a58255" />
          </div>
        </div>
      </section>

      <div className="res-foot res-foot--right">
        <a className="chip chip--lg" href="/profile/teaching">
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

const teachTemplates = [
  ['Promotion Portfolio', 'Structured for academic promotion and tenure review committees.'],
  ['Academic CV', 'Concise CV-style summary of teaching record.'],
  ['Annual Faculty Report', 'Summary suitable for department annual reporting.'],
  ['Teaching Dossier', 'Comprehensive teaching philosophy, methods, and outcomes.'],
  ['NAAC', 'Formatted per NAAC accreditation teaching criteria.'],
  ['NBA', 'Formatted per NBA program accreditation metrics.'],
]

const teachIncludes = [
  ['Teaching Experience', 'Projects Guided', 'Mentoring'],
  ['Courses', 'Teaching Awards', 'Teaching Certifications'],
  ['Student Feedback', 'Teaching Innovations'],
]

/** 2019:19082 — Teaching tab: Generate Portfolio */
export function TeachingPortfolio() {
  return (
    <ProfilePage subtitle="Generate a promotion-ready teaching portfolio" active="Teaching">
      <section className="card form-card">
        <h2 className="form-card__title">Select a Template</h2>
        <div className="template-grid">
          {teachTemplates.map(([name, body], i) => (
            <label className="template" key={name}>
              <input type="radio" name="teach-template" defaultChecked={i === 0} />
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
          {teachIncludes.map((col, i) => (
            <ul className="checklist checklist--report" key={i}>
              {col.map((item) => (
                <li key={item}>
                  <label>
                    <input type="checkbox" defaultChecked={item !== 'Teaching Certifications' && item !== 'Teaching Innovations'} />
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
