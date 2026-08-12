import { FEI_CLUSTERS, FEI_TIER_BANDS, type DashboardScoreResponse, type FeiTierBand } from './fei1000.types'

// ponytail: one mock GET /score/{facultyId} payload. Swap for the real fetch —
// every screen already reads only this shape.
export const score: DashboardScoreResponse = {
  facultyId: 'mock-faculty',
  totalScore: 842.5,
  maxScore: 1000,
  academicYear: '2026-27',
  tier: 'Platinum',
  tierMeaning: 'High achiever — strong across teaching, research, and service',
  previousScore: 780,
  yearOnYearTrend: 8.0,
  pointsToNextTier: 58.5,
  nextTierName: 'Distinguished Fellow',
  campus: 'BENGALURU',
  department: 'CSE',
  clusters: [
    { ...FEI_CLUSTERS[0], score: 210, overflow: 0 },
    { ...FEI_CLUSTERS[1], score: 120, overflow: 0 },
    { ...FEI_CLUSTERS[2], score: 180, overflow: 0 },
    { ...FEI_CLUSTERS[3], score: 80, overflow: 15 },
    { ...FEI_CLUSTERS[4], score: 50, overflow: 0 },
    { ...FEI_CLUSTERS[5], score: 70, overflow: 0 },
    { ...FEI_CLUSTERS[6], score: 60, overflow: 0 },
    { ...FEI_CLUSTERS[7], score: 45, overflow: 0 },
    { ...FEI_CLUSTERS[8], score: 27.5, overflow: 0 },
  ],
  approvedCount: 31,
  lastRecalculatedAt: '2026-08-06T10:00:00.000Z',
  scoringConfigVersion: null,
  breakdown: {},
  categoryCount: {},
}

/** Bands are half-open: minScore <= score < maxScoreExclusive. */
export const bandOf = (value: number): FeiTierBand =>
  FEI_TIER_BANDS.find((b) => value >= b.minScore)!

/** Ladder order, lowest first — the tier list every screen renders. */
export const ladder = [...FEI_TIER_BANDS].reverse()

export const bandRange = (b: FeiTierBand) =>
  b.maxScoreExclusive === null ? `${b.minScore}+ pts` : `${b.minScore} – ${b.maxScoreExclusive - 1} pts`

/** Progress through the current band, 0–100. */
export const bandProgress = (value: number) => {
  const b = bandOf(value)
  if (b.maxScoreExclusive === null) return 100
  return ((value - b.minScore) / (b.maxScoreExclusive - b.minScore)) * 100
}

/**
 * `let`, not `const`, so it stays correct after {@link hydrateScore}.
 *
 * ES module live bindings mean importers see the updated value, provided they
 * read it at render time rather than copying it into a module-scope const.
 */
export let atTopTier = score.pointsToNextTier === 0

/** True once real API data has replaced the bundled mock. */
export let isLiveScore = false

/**
 * Replaces the mock payload with a real `GET /score/{facultyId}` response.
 *
 * Mutates in place via `Object.assign` rather than reassigning, because every
 * screen imports the `score` binding directly. Call this BEFORE the screen
 * modules are imported — some of them derive module-scope constants from
 * `score` (e.g. `bandOf(score.totalScore)`), which would otherwise capture the
 * mock. `main.tsx` does this by importing the screens dynamically after
 * hydration.
 */
export function hydrateScore(next: DashboardScoreResponse): void {
  Object.assign(score, next)
  atTopTier = next.pointsToNextTier === 0
  isLiveScore = true
}

// The nine cluster scores must add up to the total, and none may exceed its
// ceiling. Only meaningful for the bundled mock: a live response can legitimately
// omit clusters (the currently deployed score engine does), and the API is the
// authority on its own totals either way.
if (!isLiveScore) {
  console.assert(
    Math.abs(score.clusters.reduce((sum, c) => sum + c.score, 0) - score.totalScore) < 0.01 &&
      score.clusters.every((c) => c.score <= c.maxPoints),
    'cluster scores do not reconcile with totalScore',
  )
}
