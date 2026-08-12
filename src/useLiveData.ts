/**
 * Loads everything the dashboard can genuinely source from the deployed
 * platform, in one pass.
 *
 * Calls run in parallel and settle independently: a module being unavailable
 * or forbidden must degrade one card, never blank the page. Several of these
 * legitimately fail for a FACULTY user — `/approval/pending` and
 * `/reports/readiness` are role-gated to HoD and IQAC respectively — so a 403
 * here is information, not an error to shout about.
 */
import { useEffect, useState } from 'react'
import { getSession } from './auth'
import { isBackendConfigured } from './config'
import {
  ApiError,
  fetchLeaderboard,
  fetchMyRanking,
  fetchPendingCount,
  fetchReports,
  fetchReadiness,
} from './api'

/** Why a panel has no data, so the UI can say something honest. */
export type Unavailable =
  | { kind: 'forbidden'; reason: string }
  | { kind: 'empty' }
  | { kind: 'error'; reason: string }
  | { kind: 'module-not-deployed'; module: string }

export interface LiveData {
  loading: boolean
  /** Approvals awaiting this user's action (M13). */
  pendingCount: number | null
  /** Department standing (M15). Null when the user has no ranking yet. */
  ranking: { rank?: number; total?: number } | null
  /** Department leaderboard entries (M15). */
  leaderboard: unknown[] | null
  /** Generated reports (M17). */
  reports: unknown[] | null
  /** Inspection readiness (M17) — IQAC/admin only. */
  readiness: number | null
  /** Per-panel explanation when data is absent. */
  unavailable: Record<string, Unavailable>
}

const EMPTY: LiveData = {
  loading: true,
  pendingCount: null,
  ranking: null,
  leaderboard: null,
  reports: null,
  readiness: null,
  unavailable: {},
}

function describe(e: unknown): Unavailable {
  if (e instanceof ApiError) {
    if (e.status === 403) {
      return { kind: 'forbidden', reason: e.message || 'Your role cannot view this.' }
    }
    if (e.status === 404) return { kind: 'empty' }
    if (e.status === 502 || e.status === 503) {
      return { kind: 'error', reason: 'The service is deployed but not responding.' }
    }
    return { kind: 'error', reason: e.message }
  }
  return { kind: 'error', reason: 'Could not load.' }
}

export function useLiveData(): LiveData {
  const [data, setData] = useState<LiveData>(EMPTY)

  useEffect(() => {
    const session = getSession()
    if (!isBackendConfigured || !session) {
      setData({ ...EMPTY, loading: false })
      return
    }

    let cancelled = false
    const unavailable: Record<string, Unavailable> = {}

    const guard = async <T,>(key: string, fn: () => Promise<T>): Promise<T | null> => {
      try {
        return await fn()
      } catch (e) {
        unavailable[key] = describe(e)
        return null
      }
    }

    void (async () => {
      const dept = session.department || 'CSE'

      const [pending, ranking, board, reports, readiness] = await Promise.all([
        guard('pendingCount', () => fetchPendingCount()),
        guard('ranking', () => fetchMyRanking(session.facultyId)),
        guard('leaderboard', () =>
          fetchLeaderboard({ scope: 'DEPARTMENT', period: 'ALL_TIME', scopeKey: dept }),
        ),
        guard('reports', () => fetchReports()),
        guard('readiness', () => fetchReadiness()),
      ])

      if (cancelled) return

      setData({
        loading: false,
        pendingCount: pending,
        ranking: ranking as LiveData['ranking'],
        leaderboard: (board as any)?.entries ?? null,
        reports: (reports as any)?.items ?? null,
        readiness: (readiness as any)?.readinessScore ?? (readiness as any)?.score ?? null,
        unavailable,
      })
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return data
}
