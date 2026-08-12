import { useEffect, useState } from 'react'
import Shell from './Shell'
import { currentUser } from './user'
import { ApiError, fetchLeaderboard, fetchMyRanking, type LeaderboardScope, type LeaderboardPeriod } from './api'
import { bandOf } from './score'
import './Dashboard.css'

/**
 * Leaderboard — Module 15.
 *
 * `GET /leaderboard` requires `scope` and `period`, plus `scopeKey` for every
 * scope except CROSS_CAMPUS; a bare call returns 400. Scope options are
 * limited by role: a FACULTY user is not permitted cross-campus.
 */

interface Entry {
  facultyId?: string
  name?: string
  rank?: number
  totalScore?: number
  tier?: string
  department?: string
  campus?: string
}

const PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'ALL_TIME', label: 'All time' },
  { id: 'MONTHLY', label: 'This month' },
]

export default function Leaderboard() {
  const user = currentUser()
  const [period, setPeriod] = useState<LeaderboardPeriod>('ALL_TIME')
  const [scope] = useState<LeaderboardScope>('DEPARTMENT')
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [mine, setMine] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const scopeKey = user.isReal ? (user.facultyId ? undefined : undefined) : undefined
  // Department code, not the display name — the API keys buckets off the code.
  const deptCode = (user.department.match(/^[A-Z]{2,4}$/) ? user.department : '') || 'CSE'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const board = await fetchLeaderboard({ scope, period, scopeKey: scopeKey ?? deptCode })
        if (!cancelled) setEntries((board as any)?.entries ?? [])
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof ApiError && e.status === 403
              ? 'Your role cannot view this leaderboard scope.'
              : e instanceof Error
                ? e.message
                : 'Could not load the leaderboard.',
          )
          setEntries([])
        }
      }

      // A 404 here just means this user has no ranking yet.
      try {
        const r = await fetchMyRanking(user.facultyId)
        if (!cancelled) setMine(r)
      } catch {
        if (!cancelled) setMine(null)
      }

      if (!cancelled) setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [period, scope, deptCode, user.facultyId, scopeKey])

  return (
    <Shell active="Leaderboard">
      <div className="pagehead">
        <h1>Leaderboard</h1>
        <p>
          {deptCode} department · {PERIODS.find((p) => p.id === period)?.label} · live from Module 15
        </p>
      </div>

      <div className="lb-tabs">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`lb-tab${period === p.id ? ' lb-tab--on' : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {mine && (
        <section className="card" style={{ marginBottom: 16 }}>
          <h2>Your standing</h2>
          <p className="muted-13">
            Rank {mine.rank ?? '—'}
            {mine.departmentTotalFaculty ? ` of ${mine.departmentTotalFaculty}` : ''} in {deptCode}
            {typeof mine.universityPercentile === 'number'
              ? ` · ${mine.universityPercentile}th percentile university-wide`
              : ''}
          </p>
        </section>
      )}

      <section className="card">
        {loading && <p className="muted-13">Loading…</p>}

        {!loading && error && <p className="muted-13">{error}</p>}

        {!loading && !error && entries && entries.length === 0 && (
          <div className="panel-empty">
            <p className="panel-empty__title">No rankings yet</p>
            <p className="panel-empty__detail">
              Module 15 is live and responding, but no faculty in {deptCode} have scored
              submissions for this period yet. Rankings appear once approvals are finalised.
            </p>
          </div>
        )}

        {!loading && entries && entries.length > 0 && (
          <table className="lb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Faculty</th>
                <th>Score</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const isMe = e.facultyId && e.facultyId === user.facultyId
                const tier = e.tier ?? (typeof e.totalScore === 'number' ? bandOf(e.totalScore).displayName : '—')
                return (
                  <tr key={e.facultyId ?? i} className={isMe ? 'lb-row--me' : undefined}>
                    <td>{e.rank ?? i + 1}</td>
                    <td>{e.name ?? e.facultyId ?? '—'}</td>
                    <td>{typeof e.totalScore === 'number' ? e.totalScore : '—'}</td>
                    <td>{tier}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </Shell>
  )
}
