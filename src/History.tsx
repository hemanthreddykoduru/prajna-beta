import { ScorePage } from './PrajnaScore'
import './History.css'

const timelineEvents = [
  { dot: 'green', title: '+25 Research score added', body: 'Research paper published in IEEE TSE', date: 'Jul 4, 2026' },
  { dot: 'light', title: '+15 Teaching score added', body: 'Course feedback cycle updated', date: 'Jul 3, 2026' },
  { dot: 'green', title: 'Tier upgraded to Silver', body: 'Crossed 600 pts threshold', date: 'May 18, 2026' },
  { dot: 'muted', title: '+10 Profile score added', body: 'Profile fields completed', date: 'Apr 5, 2026' },
]

const allTimeEvents = [
  { dot: 'green', title: '+25 Research score added', body: 'Research paper published in IEEE TSE', date: 'Jul 4, 2026' },
  { dot: 'green', title: 'Tier upgraded to Silver', body: 'Crossed 600 pts threshold', date: 'May 18, 2026' },
  { dot: 'green', title: '+40 Research Grant score added', body: 'Major funded research project approved', date: 'Sep 14, 2024' },
  { dot: 'green', title: '+20 Patent score added', body: 'First patent filed', date: 'Feb 8, 2023' },
  { dot: 'muted', title: 'PRAJNA profile activated', body: 'Faculty contribution tracking started', date: 'Jul 12, 2021' },
]

type Point = { month: string; score: number; current?: boolean; note?: string }

const MONTH_GRID = [745, 680, 615, 550]

// everything that changes between range filters
const data: Record<'3m' | '6m' | '1y' | 'all', {
  label: string
  caption: string
  increase: string
  best: string
  biggest: string
  biggestMeta: string
  grid: number[]
  lastGlance: { label: string; value: string }
  series: Point[]
  events: typeof timelineEvents
}> = {
  '3m': {
    label: 'Last 3 Months',
    caption: 'Last 3 Months (May – Jul 2026)',
    increase: '+24 pts',
    best: '+43 pts in 3 months',
    biggest: 'Research (+25)',
    biggestMeta: 'Jul 2026',
    grid: MONTH_GRID,
    lastGlance: { label: 'Last Tier Upgrade', value: 'Silver · May 18, 2026' },
    series: [
      { month: 'May', score: 695 },
      { month: 'Jun', score: 712 },
      { month: 'Jul', score: 742, current: true },
    ],
    events: timelineEvents.slice(0, 3),
  },
  '6m': {
    label: 'Last 6 Months',
    caption: 'Last 6 Months (Feb – Jul 2026)',
    increase: '+25 pts',
    best: '+58 pts in 6 months',
    biggest: 'Research (+25)',
    biggestMeta: 'Jul 2026',
    grid: MONTH_GRID,
    lastGlance: { label: 'Last Tier Upgrade', value: 'Silver · May 18, 2026' },
    series: [
      { month: 'Feb', score: 615 },
      { month: 'Mar', score: 640 },
      { month: 'Apr', score: 665 },
      { month: 'May', score: 695, note: 'Paper Published' },
      { month: 'Jun', score: 712 },
      { month: 'Jul', score: 742, current: true },
    ],
    events: timelineEvents,
  },
  '1y': {
    label: 'This Academic Year',
    caption: 'This Academic Year (Jan – Jul 2026)',
    increase: '+25 pts',
    best: '+58 pts this year',
    biggest: 'Research (+58)',
    biggestMeta: 'This quarter',
    grid: MONTH_GRID,
    lastGlance: { label: 'Last Tier Upgrade', value: 'Silver · May 18, 2026' },
    series: [
      { month: 'Feb', score: 615 },
      { month: 'Mar', score: 640 },
      { month: 'Apr', score: 665, note: 'Paper Published' },
      { month: 'May', score: 695 },
      { month: 'Jun', score: 712 },
      { month: 'Jul', score: 742, current: true },
    ],
    events: timelineEvents,
  },
  all: {
    label: 'All Time',
    caption: 'All Time (2021 – 2026)',
    increase: '+18 pts',
    best: '+223 pts total',
    biggest: 'Research (+58)',
    biggestMeta: '2026',
    grid: [800, 700, 500, 300, 100],
    lastGlance: { label: 'Tracking Since', value: 'Jul 2021' },
    series: [
      { month: '2021', score: 180 },
      { month: '2022', score: 285 },
      { month: '2023', score: 410, note: 'First Major Research Grant' },
      { month: '2024', score: 525 },
      { month: '2025', score: 615, note: 'Tier Upgraded to Silver' },
      { month: '2026', score: 742, current: true },
    ],
    events: allTimeEvents,
  },
}

type Range = keyof typeof data

const filters: { label: string; range: Range }[] = [
  { label: 'Last 3 Months', range: '3m' },
  { label: 'Last 6 Months', range: '6m' },
  { label: 'This Academic Year', range: '1y' },
  { label: 'All Time', range: 'all' },
]

export default function History() {
  const param = new URLSearchParams(window.location.search).get('range')
  const range: Range = param && param in data ? (param as Range) : '3m'
  const view = data[range]

  // the range's own grid sets the scale — all-time spans 100–800, months 550–745
  const max = view.grid[0]
  const min = view.grid[view.grid.length - 1]
  const yOf = (score: number) => ((max - score) / (max - min)) * 100

  // plot coordinates in percent: periods spread evenly, score mapped onto the grid
  const points = view.series.map((p, i) => ({
    ...p,
    x: ((i + 0.5) / view.series.length) * 100,
    y: yOf(p.score),
  }))

  console.assert(
    points.every((p) => p.y >= 0 && p.y <= 100),
    `score out of the plotted range — widen the ${range} grid`,
  )

  const line = points.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `${points[0].x},100 ${line} ${points[points.length - 1].x},100`

  const stats = [
    { label: 'Highest Score', value: '742 pts', meta: 'Jul 2026' },
    { label: 'Average Monthly Increase', value: view.increase, meta: view.label },
    { label: 'Best Category', value: 'Research', meta: view.best },
    { label: 'Biggest Contribution', value: view.biggest, meta: view.biggestMeta },
  ]

  const glance = [
    { label: 'Highest Score', value: '742 pts' },
    { label: 'Average Monthly Increase', value: view.increase },
    { label: 'Biggest Contribution', value: view.biggest },
    view.lastGlance,
  ]

  return (
    <ScorePage
      title="Score History"
      subtitle="Track your PRAJNA score over time"
      meta="Academic Year 2025–26 · Last updated: Jul 5, 2026 10:45 AM"
      active="History"
    >
      <div className="tabs">
        {filters.map((f) => (
          <a
            className={`tab${f.range === range ? ' tab--active' : ''}`}
            href={`/prajnascore/history?range=${f.range}`}
            key={f.label}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="stat-strip">
        {stats.map((s) => (
          <div className="stat-mini" key={s.label}>
            <span className="stat-mini__label">{s.label}</span>
            <span className="stat-mini__value">{s.value}</span>
            <span className="stat-mini__meta">{s.meta}</span>
          </div>
        ))}
      </div>

      <section className="card card--raised trend">
        <div className="trend__head">
          <h2>Score Trend</h2>
          <span className="muted-12">{view.caption}</span>
        </div>
        {/* ponytail: hand-plotted SVG from `series` — no chart lib. Add one when
            this needs tooltips, zoom, or many more points. */}
        <div className="plot">
          <div className="plot__axis">
            {view.grid.map((g) => (
              <span key={g} style={{ top: `${yOf(g)}%` }}>
                {g}
              </span>
            ))}
          </div>
          <div className="plot__area">
            {view.grid.map((g) => (
              <span className="plot__grid" key={g} style={{ top: `${yOf(g)}%` }} />
            ))}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points={area} fill="rgba(0,115,103,0.08)" />
              <polyline points={line} fill="none" stroke="#007367" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            {points.map((p) => (
              <span key={p.month}>
                <span
                  className={`plot__dot${p.current ? ' plot__dot--current' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                />
                <span className="plot__value" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  {p.current ? <span className="plot__callout">{p.score} (Current)</span> : p.score}
                </span>
                {p.note && (
                  <span className="plot__note" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                    {p.note}
                  </span>
                )}
                <span className="plot__month" style={{ left: `${p.x}%` }}>
                  {p.month}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="row row--history">
        <section className="card card--raised history-timeline">
          <h2>Score History Timeline</h2>
          <ol className="events">
            {view.events.map((t) => (
              <li key={t.title}>
                <span className={`timeline__dot timeline__dot--${t.dot}`} />
                <span className="events__text">
                  <span className="events__title">{t.title}</span>
                  <span className="muted-12">{t.body}</span>
                </span>
                <span className="events__date">{t.date}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card card--raised glance">
          <h2>At a Glance</h2>
          <ul className="glance__list">
            {glance.map((g) => (
              <li key={g.label}>
                <span className="glance__label">{g.label}</span>
                <span className="glance__value">{g.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ScorePage>
  )
}
