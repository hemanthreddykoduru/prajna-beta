/**
 * Platform API client.
 *
 * Every request carries the Cognito ID token. Routes and their auth modes were
 * verified against the deployed gateway — see the notes on each call.
 */
import { config } from './config'
import { getSession, signOut } from './auth'
import {
  FEI_CLUSTERS,
  FEI_TIER_BANDS,
  FEI_TOTAL_POINTS,
  type ClusterBreakdown,
  type DashboardScoreResponse,
  type FeiTierDisplayName,
} from './fei1000.types'

export class ApiError extends Error {
  // Declared explicitly rather than as constructor parameter properties:
  // this project builds with `erasableSyntaxOnly`.
  readonly status: number
  readonly path: string

  constructor(message: string, status: number, path: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.path = path
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getSession()
  if (!session) throw new ApiError('Not signed in', 401, path)

  const res = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.idToken}`,
      ...init.headers,
    },
  })

  if (res.status === 401) {
    // Token rejected — clear it so the app falls back to the login screen
    // rather than looping on a dead session.
    signOut()
    throw new ApiError('Session expired. Please sign in again.', 401, path)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any))
    throw new ApiError(body.message || body.error || `Request failed (${res.status})`, res.status, path)
  }

  return res.json() as Promise<T>
}

/**
 * Authenticated GET for any platform path.
 *
 * Exposed so module screens can be driven from the registry in `modules.ts`
 * rather than each needing a bespoke client function — that is what lets a
 * newly deployed service light up with no code change here.
 */
export const apiGet = <T,>(path: string): Promise<T> => request<T>(path)

// ── Score (Module 14) ────────────────────────────────────────────────────────

/** Half-open bands: the first band whose minScore you meet is yours. */
function bandFor(score: number) {
  return FEI_TIER_BANDS.find((b) => score >= b.minScore) ?? FEI_TIER_BANDS[FEI_TIER_BANDS.length - 1]
}

/**
 * Fills in whatever the API omits so screens can rely on the full
 * `DashboardScoreResponse` shape.
 *
 * This is not defensive padding for its own sake: the currently deployed score
 * engine predates the FEI-1000 migration and returns no `clusters`, no
 * `tierMeaning` and no `scoringConfigVersion`. Rendering nine cluster bars
 * straight off `raw.clusters` would throw on that response. When the engine is
 * redeployed the real values simply pass through untouched.
 */
export function normalizeScore(raw: any, fallbackFacultyId: string): DashboardScoreResponse {
  const totalScore = Number(raw?.totalScore ?? 0)
  const band = bandFor(totalScore)

  const clusters: ClusterBreakdown[] = Array.isArray(raw?.clusters) && raw.clusters.length
    ? raw.clusters
    : FEI_CLUSTERS.map((c) => ({
        id: c.id,
        name: c.name,
        score: 0,
        maxPoints: c.maxPoints,
        weightPercent: c.weightPercent,
        overflow: 0,
      }))

  return {
    facultyId: raw?.facultyId ?? fallbackFacultyId,
    totalScore,
    maxScore: Number(raw?.maxScore ?? FEI_TOTAL_POINTS),
    academicYear: raw?.academicYear ?? '',
    // Trust the numeric score over a stale label — the deployed engine can
    // still emit the retired "PRAJNA Fellow" tier.
    tier: (raw?.tier && FEI_TIER_BANDS.some((b) => b.displayName === raw.tier)
      ? raw.tier
      : band.displayName) as FeiTierDisplayName,
    tierMeaning: raw?.tierMeaning ?? band.meaning,
    previousScore: Number(raw?.previousScore ?? 0),
    yearOnYearTrend: Number(raw?.yearOnYearTrend ?? 0),
    pointsToNextTier: Number(raw?.pointsToNextTier ?? 0),
    nextTierName: (raw?.nextTierName ?? band.displayName) as FeiTierDisplayName,
    campus: raw?.campus ?? '',
    department: raw?.department ?? '',
    clusters,
    approvedCount: Number(raw?.approvedCount ?? 0),
    lastRecalculatedAt: raw?.lastRecalculatedAt ?? '',
    scoringConfigVersion: raw?.scoringConfigVersion ?? null,
    breakdown: raw?.breakdown ?? {},
    categoryCount: raw?.categoryCount ?? {},
  }
}

/**
 * `GET /score/{facultyId}` — Module 14.
 *
 * A 404 means "no score record yet" (a new faculty member), not an error, so
 * it resolves to a zeroed scorecard rather than throwing.
 */
export async function fetchScore(facultyId: string): Promise<DashboardScoreResponse> {
  try {
    const raw = await request<any>(`/score/${encodeURIComponent(facultyId)}`)
    return normalizeScore(raw, facultyId)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return normalizeScore({ facultyId }, facultyId)
    }
    throw e
  }
}

// ── Approvals (Module 13) ────────────────────────────────────────────────────

/**
 * Pending-approval count for the signed-in user.
 * This lives on M13 — it is NOT part of the leaderboard response.
 */
export async function fetchPendingCount(): Promise<number> {
  const r = await request<any>('/approval/pending/me/count')
  return Number(r?.count ?? r?.pendingEvidenceItems ?? 0)
}

// ── Leaderboard (Module 15) ──────────────────────────────────────────────────

export type LeaderboardScope = 'DEPARTMENT' | 'SCHOOL' | 'CAMPUS' | 'CROSS_CAMPUS'
export type LeaderboardPeriod = 'MONTHLY' | 'ALL_TIME'

/**
 * `GET /leaderboard` requires `scope` and `period`, plus `scopeKey` for every
 * scope except CROSS_CAMPUS. A bare call returns 400.
 */
export async function fetchLeaderboard(params: {
  scope: LeaderboardScope
  period: LeaderboardPeriod
  scopeKey?: string
}): Promise<any> {
  const qs = new URLSearchParams({ scope: params.scope, period: params.period })
  if (params.scope !== 'CROSS_CAMPUS') {
    if (!params.scopeKey) throw new Error(`scopeKey is required for scope=${params.scope}`)
    qs.set('scopeKey', params.scopeKey)
  }
  return request<any>(`/leaderboard?${qs.toString()}`)
}

/** `GET /leaderboard/rankings/{facultyId}` — this user's standing. */
export const fetchMyRanking = (facultyId: string) =>
  request<any>(`/leaderboard/rankings/${encodeURIComponent(facultyId)}`)

// ── Reports (Module 17) ──────────────────────────────────────────────────────

/** `GET /reports` — generated reports for the caller's campus. */
export const fetchReports = () => request<any>('/reports')

/**
 * `GET /reports/readiness` — inspection readiness score.
 * Role-gated: a FACULTY user gets 403 ("FACULTY role cannot view readiness
 * score"). Treat that as "not for this role", not as a failure.
 */
export const fetchReadiness = () => request<any>('/reports/readiness')

// ── Profile (Module 7) ───────────────────────────────────────────────────────

/**
 * `GET /faculty/me` — the signed-in user's profile.
 *
 * Note `GET /faculty/profile` does NOT exist (that path is PUT-only), and
 * `/faculty/{facultyId}`, `/faculty/{facultyId}/contact` and
 * `/faculty/approver` are AWS_IAM (SigV4) service-to-service routes that a
 * browser cannot call.
 */
export const fetchMyProfile = () => request<any>('/faculty/me')
