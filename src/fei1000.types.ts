/**
 * FEI-1000 — TypeScript contract for the PRAJNA frontend.
 *
 * GENERATED FILE — do not edit.
 * Source: prajna-business-logic `src/modules/score-engine/fei1000/registry.ts`
 * Regenerate with `node scripts/generate-fei-ui-contract.mjs` and re-copy.
 *
 * Copy this file into the frontend repo as-is. It has no imports and no runtime
 * dependencies beyond the two `const` tables at the bottom.
 */

// ── Tiers ────────────────────────────────────────────────────────────────────

/** The six FEI-1000 performance tiers. */
export type FeiTier =
  | 'DISTINGUISHED_FELLOW'
  | 'PLATINUM'
  | 'GOLD'
  | 'SILVER'
  | 'BRONZE'
  | 'EMERGING_FACULTY';

/** Exactly the strings the API returns in `tier`. */
export type FeiTierDisplayName =
  | 'Distinguished Fellow'
  | 'Platinum'
  | 'Gold'
  | 'Silver'
  | 'Bronze'
  | 'Emerging Faculty';

export interface FeiTierBand {
  readonly tier: FeiTier;
  readonly displayName: FeiTierDisplayName;
  /** Inclusive lower bound on the 0–1000 scale. */
  readonly minScore: number;
  /** Exclusive upper bound; `null` for the top band. */
  readonly maxScoreExclusive: number | null;
  readonly meaning: string;
}

/** Ordered highest-first, so the first band whose `minScore` you meet is yours. */
export const FEI_TIER_BANDS: readonly FeiTierBand[] = [
  { tier: 'DISTINGUISHED_FELLOW', displayName: 'Distinguished Fellow', minScore: 901, maxScoreExclusive: null, meaning: "Exceptional performer — top academic and research leader" },
  { tier: 'PLATINUM', displayName: 'Platinum', minScore: 801, maxScoreExclusive: 901, meaning: "High achiever — strong across teaching, research, and service" },
  { tier: 'GOLD', displayName: 'Gold', minScore: 701, maxScoreExclusive: 801, meaning: "Consistent contributor — meeting institutional and national benchmarks" },
  { tier: 'SILVER', displayName: 'Silver', minScore: 551, maxScoreExclusive: 701, meaning: "Developing contributor — solid base with room to grow" },
  { tier: 'BRONZE', displayName: 'Bronze', minScore: 400, maxScoreExclusive: 551, meaning: "Getting started — foundational activities in place" },
  { tier: 'EMERGING_FACULTY', displayName: 'Emerging Faculty', minScore: 0, maxScoreExclusive: 400, meaning: "New joiner — building the foundation" },
] as const;

// ── Clusters ─────────────────────────────────────────────────────────────────

export type FeiClusterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** One cluster's contribution, as returned in `GET /score/{facultyId}`. */
export interface ClusterBreakdown {
  id: FeiClusterId;
  name: string;
  /** Points earned, already clamped to `maxPoints`. */
  score: number;
  maxPoints: number;
  weightPercent: number;
  /** Points discarded by the clamp. `> 0` means the cluster is maxed. */
  overflow: number;
}

export interface FeiClusterMeta {
  readonly id: FeiClusterId;
  readonly name: string;
  readonly maxPoints: number;
  readonly weightPercent: number;
}

export const FEI_CLUSTERS: readonly FeiClusterMeta[] = [
  { id: 1, name: "Teaching Excellence & Outcome-Based Education", maxPoints: 240, weightPercent: 24 },
  { id: 2, name: "Student Success, Mentoring & Development", maxPoints: 150, weightPercent: 15 },
  { id: 3, name: "Research, Publications, Grants & Scholarly Impact", maxPoints: 200, weightPercent: 20 },
  { id: 4, name: "Innovation, Intellectual Property & Entrepreneurship", maxPoints: 80, weightPercent: 8 },
  { id: 5, name: "Industry Engagement, Consultancy & Employability", maxPoints: 80, weightPercent: 8 },
  { id: 6, name: "Institutional Governance, Quality Assurance & Compliance", maxPoints: 90, weightPercent: 9 },
  { id: 7, name: "Professional Development, Upskilling & Digital Scholarly Identity", maxPoints: 70, weightPercent: 7 },
  { id: 8, name: "Internationalisation & Global Academic Visibility", maxPoints: 60, weightPercent: 6 },
  { id: 9, name: "PRAJNA AI Companion Score & Profile Completeness", maxPoints: 30, weightPercent: 3 },
] as const;

export const FEI_TOTAL_POINTS = 1000;

// ── API response ─────────────────────────────────────────────────────────────

/** Response shape of `GET /score/{facultyId}`. */
export interface DashboardScoreResponse {
  facultyId: string;
  /** 0–1000, native. NOT scaled — do not multiply by 10. */
  totalScore: number;
  maxScore: number;
  /** e.g. "2026-27". Academic years run July–June. */
  academicYear: string;
  tier: FeiTierDisplayName;
  tierMeaning: string;
  previousScore: number;
  /** Percent. Positive = improved. */
  yearOnYearTrend: number;
  pointsToNextTier: number;
  /** Equals `tier` when already at the top band. */
  nextTierName: FeiTierDisplayName;
  campus: string;
  department: string;
  /** Always all nine, in id order, even at zero. */
  clusters: ClusterBreakdown[];
  approvedCount: number;
  lastRecalculatedAt: string;
  /**
   * Version of the runtime weighting that produced this score, or null when
   * scored on the published FEI-1000 defaults.
   *
   * Surface it wherever a faculty member might ask why their score changed:
   * a jump accompanied by a NEW version number is an administrative
   * re-weighting, not something they did.
   */
  scoringConfigVersion: number | null;
  /** @deprecated Legacy five-category map. Use `clusters`. */
  breakdown: Record<string, number>;
  /** @deprecated Legacy per-category counts. Use `clusters`. */
  categoryCount: Record<string, number>;
}

// ── Submission attributes, per parameter ─────────────────────────────────────

/** FEI parameter ids, 1–70. */
export type FeiParameterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70;

/**
 * The `feiAttributes` payload each parameter expects.
 *
 * Index by parameter id to get a fully-typed submission body:
 *   `const attrs: FeiAttributes[20] = { quartile: 'Q1', authorPosition: 'FIRST', citations: 40 };`
 *
 * All fields are optional because a missing key is legal — it simply makes its
 * rubric rung unmatchable, so the submission scores the parameter's lowest rung.
 * Validate completeness on the form, not at the type level.
 */
export interface FeiAttributes {
  /** 1. Syllabus completion rate — 100%=35 · 90–99%=25 · 80–89%=15 · <80%=0 */
  1: {
    /** Syllabus completion (%) */
    syllabusCompletionPercent?: number;
  };
  /** 2. Student feedback score — ≥4.5=45 · 4.0–4.4=36 · 3.5–3.9=22 · 3.0–3.4=10 · <3.0=0 */
  2: {
    /** Student feedback score (out of 5) */
    feedbackScore?: number;
  };
  /** 3. Result performance — ≥10% above avg=25 · at avg=18 · below=8 */
  3: {
    /** Pass % relative to department average (percentage points) */
    resultVsDeptAvgPercent?: number;
  };
  /** 4. CO attainment (course outcome) — All COs ≥60%=25 · partial=12 · nil=0 */
  4: {
    /** CO attainment level */
    coAttainmentLevel?: 'ALL' | 'PARTIAL' | 'NIL';
  };
  /** 5. PO mapping completeness — 100% mapped=20 · partial=10 · nil=0 */
  5: {
    /** PO mapping completeness */
    poMappingLevel?: 'FULL' | 'PARTIAL' | 'NIL';
  };
  /** 6. Innovative teaching methods — 2+ documented=20 · 1=10 · 0=0 */
  6: {
    /** Documented innovative methods */
    methodsDocumented?: number;
  };
  /** 7. LMS usage & digital content — Active weekly=20 · monthly=10 · none=0 */
  7: {
    /** LMS activity cadence */
    lmsActivity?: 'WEEKLY' | 'MONTHLY' | 'NONE';
  };
  /** 8. Course file & lesson plan quality — On time & complete=25 · late=12 · absent=0 */
  8: {
    /** Course file status */
    courseFileStatus?: 'ON_TIME' | 'LATE' | 'ABSENT';
  };
  /** 9. Continuous assessment quality — All timely=25 · partial=12 · nil=0 */
  9: {
    /** Continuous assessment timeliness */
    assessmentTimeliness?: 'ALL' | 'PARTIAL' | 'NIL';
  };
  /** 10. Mentoring sessions logged — ≥8 sessions/yr=15 · 4–7=8 · <4=0 */
  10: {
    /** Mentoring sessions logged this year */
    sessionCount?: number;
  };
  /** 11. Student project guidance (UG/PG) — ≥5=15 · 3–4=10 · 1–2=5 · max 10/yr */
  11: {
    /** Projects guided this year */
    projectCount?: number;
  };
  /** 12. Remedial & advanced learner support — Both tracked with outcome=15 · one=8 · nil=0 */
  12: {
    /** Learner support coverage */
    supportCoverage?: 'BOTH' | 'ONE' | 'NIL';
  };
  /** 13. Student placement support — ≥5 placed=20 · 3–4=12 · 1–2=6 */
  13: {
    /** Students placed with your support */
    placedCount?: number;
  };
  /** 14. Higher education / abroad guidance — ≥3 students=15 · 1–2=8 */
  14: {
    /** Students guided to higher education */
    studentCount?: number;
  };
  /** 15. Competitive exam guidance (GATE/GRE) — ≥3 qualified=12 · 1–2=6 */
  15: {
    /** Students who qualified */
    qualifiedCount?: number;
  };
  /** 16. Student publications / patents guided — no attributes; the submission itself is the evidence. */
  16: Record<string, never>;
  /** 17. Student startup mentored — Funded startup=10 · Registered=6 · Ideation=3 */
  17: {
    /** Startup stage */
    startupStage?: 'FUNDED' | 'REGISTERED' | 'IDEATION';
  };
  /** 18. Ph.D. supervision (all stages) — Awarded=25 · Submitted=15 · Registered=8 · M.Tech guided=5 */
  18: {
    /** Highest supervision stage reached */
    supervisionStage?: 'AWARDED' | 'SUBMITTED' | 'REGISTERED' | 'MTECH';
  };
  /** 19. Scopus-indexed journal paper — 20 pts each · max 5/yr · quality multiplier applies */
  19: {
    /** Citations to date */
    citations?: number;
  };
  /** 20. SCI / SCIE / WoS journal paper — Q1=30 · Q2=22 · Q3=15 · Q4=8 · max 5/yr · 1st author ×1.5 */
  20: {
    /** Journal quartile */
    quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    /** Your author position */
    authorPosition?: 'FIRST' | 'CORRESPONDING' | 'CO';
    /** Citations to date */
    citations?: number;
  };
  /** 21. Book / book chapter (Scopus publisher) — Book=15 · Chapter=8 · max 2/yr */
  21: {
    /** Publication type */
    publicationType?: 'BOOK' | 'CHAPTER';
  };
  /** 22. Conference paper (indexed proceedings) — International=8 · National=4 · max 4/yr */
  22: {
    /** Conference scope */
    scope?: 'INTERNATIONAL' | 'NATIONAL';
  };
  /** 23. H-Index (Scopus / Google Scholar) — H≥15=30 · H10–14=24 · H7–9=18 · H4–6=10 · H1–3=4 */
  23: {
    /** H-Index */
    hIndex?: number;
  };
  /** 24. Annual citation increment — ≥100 new=20 · 50–99=15 · 20–49=10 · 5–19=5 */
  24: {
    /** New citations this year */
    newCitations?: number;
  };
  /** 25. Research seminar organised/presented — Organised=7 · Presented at=4 · max 3/yr */
  25: {
    /** Your role */
    seminarRole?: 'ORGANISED' | 'PRESENTED';
  };
  /** 26. Central govt. funded project (PI) — >₹10L=40 · ₹5–10L=28 · ₹1–5L=16 · <₹1L=8 */
  26: {
    /** Sanctioned amount (₹) */
    fundingAmountInr?: number;
  };
  /** 27. State / industry funded project — >₹5L=30 · ₹2–5L=20 · <₹2L=10 */
  27: {
    /** Sanctioned amount (₹) */
    fundingAmountInr?: number;
  };
  /** 28. Patent published / filed — Published=12 · Filed=6 */
  28: {
    /** Patent stage */
    patentStage?: 'PUBLISHED' | 'FILED';
  };
  /** 29. Patent granted (Indian) — no attributes; the submission itself is the evidence. */
  29: Record<string, never>;
  /** 30. Patent granted (International) — no attributes; the submission itself is the evidence. */
  30: Record<string, never>;
  /** 31. Copyright / design registration — no attributes; the submission itself is the evidence. */
  31: Record<string, never>;
  /** 32. Technology transfer / commercialisation — Commercialised=15 · Transfer agreement=10 */
  32: {
    /** Transfer stage */
    transferStage?: 'COMMERCIALISED' | 'AGREEMENT';
  };
  /** 33. Startup founded / mentored / incubated — Funded startup=15 · Registered=10 · Ideation=5 */
  33: {
    /** Startup stage */
    startupStage?: 'FUNDED' | 'REGISTERED' | 'IDEATION';
  };
  /** 34. Industry expert sessions organised — ≥3/yr=15 · 2=10 · 1=5 · max 5/yr */
  34: {
    /** Expert sessions organised */
    sessionCount?: number;
  };
  /** 35. Industry visits organised — ≥2/yr=5 · 1=3 */
  35: {
    /** Industry visits organised */
    visitCount?: number;
  };
  /** 36. Student internships facilitated — ≥5 students=10 · 3–4=6 · 1–2=3 */
  36: {
    /** Students placed in internships */
    studentCount?: number;
  };
  /** 37. MoU facilitated (active & functional) — International=20 · National=12 · Regional=6 · max 2/yr */
  37: {
    /** MoU scope */
    mouScope?: 'INTERNATIONAL' | 'NATIONAL' | 'REGIONAL';
  };
  /** 38. Consultancy projects (revenue) — >₹5L=20 · ₹2–5L=12 · ₹0.5–2L=7 · <₹0.5L=3 */
  38: {
    /** Consultancy revenue (₹) */
    revenueInr?: number;
  };
  /** 39. Industry certifications earned — no attributes; the submission itself is the evidence. */
  39: Record<string, never>;
  /** 40. Alumni engagement activities — ≥2 events/yr=10 · 1=5 */
  40: {
    /** Alumni events */
    eventCount?: number;
  };
  /** 41. Committee leadership (convener/chair) — Convener=20 · Co-convener=12 · Member=6 · max 2 roles */
  41: {
    /** Committee role */
    committeeRole?: 'CONVENER' | 'CO_CONVENER' | 'MEMBER';
  };
  /** 42. Dept / institution events organised — ≥2/yr=15 · 1=8 */
  42: {
    /** Events organised */
    eventCount?: number;
  };
  /** 43. Exam duty compliance — 100%=15 · 80–99%=9 · <80%=0 */
  43: {
    /** Exam duty compliance (%) */
    compliancePercent?: number;
  };
  /** 44. Admission support activities — Active=10 · partial=5 */
  44: {
    /** Participation level */
    participation?: 'ACTIVE' | 'PARTIAL' | 'NIL';
  };
  /** 45. NSS / NCC / social extension activity — Active coordinator=10 · Participant=5 · Nil=0 */
  45: {
    /** Extension role */
    extensionRole?: 'COORDINATOR' | 'PARTICIPANT' | 'NIL';
  };
  /** 46. NAAC documentation contribution — Lead contributor=10 · Active=6 · Passive=0 */
  46: {
    /** Contribution level */
    contributionLevel?: 'LEAD' | 'ACTIVE' | 'PASSIVE';
  };
  /** 47. NBA documentation contribution — Lead contributor=10 · Active=6 · Passive=0 */
  47: {
    /** Contribution level */
    contributionLevel?: 'LEAD' | 'ACTIVE' | 'PASSIVE';
  };
  /** 48. NIRF data submission & audit compliance — Complete & on time + zero observations=15 · partial=8 · nil=0 */
  48: {
    /** NIRF compliance */
    nirfCompliance?: 'COMPLETE' | 'PARTIAL' | 'NIL';
  };
  /** 49. Timely internal report submission — All on time=10 · 1 delay=5 · 2+ delays=0 */
  49: {
    /** Number of late submissions */
    delayCount?: number;
  };
  /** 50. FDP attended (≥5 days, AICTE/TEQIP) — no attributes; the submission itself is the evidence. */
  50: Record<string, never>;
  /** 51. FDP attended (1–4 days, workshop) — no attributes; the submission itself is the evidence. */
  51: Record<string, never>;
  /** 52. NPTEL / SWAYAM / MOOC certification — Elite+Gold=10 · Elite=7 · Completion=3 */
  52: {
    /** Certification grade */
    certificationGrade?: 'ELITE_GOLD' | 'ELITE' | 'COMPLETION';
  };
  /** 53. AI / Data Science upskilling — Course with assessment=10 · audit only=4 */
  53: {
    /** Course mode */
    courseMode?: 'ASSESSED' | 'AUDIT';
  };
  /** 54. Higher qualification in progress — PhD registered=8 · Coursework complete=5 */
  54: {
    /** Qualification stage */
    qualificationStage?: 'PHD_REGISTERED' | 'COURSEWORK_COMPLETE';
  };
  /** 55. Professional body membership (active) — Fellow=5 · Senior Member=4 · Member=2 */
  55: {
    /** Membership grade */
    membershipGrade?: 'FELLOW' | 'SENIOR_MEMBER' | 'MEMBER';
  };
  /** 56. Academic profiles (ORCID/Scholar/Scopus) — All 3 complete & linked=14 · 2=8 · 1=3 */
  56: {
    /** Linked academic profiles (ORCID / Google Scholar / Scopus) */
    linkedProfileCount?: number;
  };
  /** 57. Foreign co-authored research paper — ≥3 papers with foreign co-authors/yr=10 · 1–2=5 */
  57: {
    /** Papers with foreign co-authors this year */
    paperCount?: number;
  };
  /** 58. International research collaboration — Active joint project=12 · Research MoU=7 */
  58: {
    /** Collaboration type */
    collaborationType?: 'JOINT_PROJECT' | 'RESEARCH_MOU';
  };
  /** 59. Visiting lecture at foreign institution — no attributes; the submission itself is the evidence. */
  59: Record<string, never>;
  /** 60. International conference presented — no attributes; the submission itself is the evidence. */
  60: Record<string, never>;
  /** 61. Faculty exchange programme (outbound) — ≥2 weeks=10 · 1 week=6 */
  61: {
    /** Exchange duration (weeks) */
    durationWeeks?: number;
  };
  /** 62. International certification / award — International award=5 · Global cert=3 */
  62: {
    /** Recognition type */
    recognitionType?: 'AWARD' | 'CERTIFICATION';
  };
  /** 63. International student / scholar mentored — no attributes; the submission itself is the evidence. */
  63: Record<string, never>;
  /** 64. PRAJNA profile completeness — 100%=15 · 90–99%=10 · 75–89%=5 · <75%=0 */
  64: {
    /** Profile completeness (%) */
    profileCompleteness?: number;
  };
  /** 65. Daily / weekly active usage of PRAJNA — Daily active=5 · Weekly=3 · Monthly=1 */
  65: {
    /** PRAJNA usage cadence */
    usageCadence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'INACTIVE';
  };
  /** 66. AI Companion interaction quality — Goals + reflections active=5 · Partial=2 */
  66: {
    /** AI Companion interaction quality */
    interactionQuality?: 'FULL' | 'PARTIAL' | 'NONE';
  };
  /** 67. Leaderboard rank improvement (annual) — Top 10% dept=10 · Top 25%=6 · Improved rank=3 */
  67: {
    /** Leaderboard standing */
    rankBand?: 'TOP_10' | 'TOP_25' | 'IMPROVED' | 'NONE';
  };
  /** 68. MOOC / course created (published) — Published with enrolled learners=7 · Draft=3 */
  68: {
    /** Course status */
    courseStatus?: 'PUBLISHED' | 'DRAFT';
  };
  /** 69. Educational videos / OER created — ≥5 verified resources=5 · 2–4=3 */
  69: {
    /** Verified resources created */
    resourceCount?: number;
  };
  /** 70. Invited / expert talk (national level) — National=8 · State/Regional=4 · Invited webinar=2 */
  70: {
    /** Talk scope */
    talkScope?: 'NATIONAL' | 'STATE_REGIONAL' | 'WEBINAR';
  };
}

/** Body to attach when submitting evidence for a parameter. */
export interface FeiSubmission<K extends FeiParameterId = FeiParameterId> {
  feiParameterId: K;
  feiAttributes: FeiAttributes[K];
}
