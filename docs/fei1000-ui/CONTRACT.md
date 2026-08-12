# FEI-1000 — Frontend / UI Integration Contract

> **GENERATED FILE — do not edit by hand.**
> Produced by `scripts/generate-fei-ui-contract.mjs` from
> `src/modules/score-engine/fei1000/registry.ts`. Re-run after any rubric change:
> ```bash
> node scripts/generate-fei-ui-contract.mjs
> ```

**Framework source:** `docs/templates/PRAJNA_FEI1000_Final_Table.docx` — Dr. Kishore Budda,
Director – Core Engineering, GITAM University Bengaluru.

**Audience:** Module 24 (Faculty Dashboard), Modules 8–12 (Faculty Data submission forms),
Module 20 (AI Companion).

---

## 1. What the framework is

- **9 clusters**, **70 parameters**, **1000 points**.
- Every faculty member is scored on the same 0–1000 scale, per academic year (July–June).
- A cluster is capped at its own ceiling. Points earned beyond that ceiling are **discarded**,
  which is what guarantees the total can never exceed 1000.

| # | Cluster | Params | Max pts | Weight | Frameworks |
|---|---|---|---|---|---|
| 1 | Teaching Excellence & Outcome-Based Education | 9 | 240 | 24% | UGC Cat-I · NAAC Cr-II · NBA Cr-2,3,4 · NIRF TLR 30% · ABET · QS FSR |
| 2 | Student Success, Mentoring & Development | 9 | 150 | 15% | NAAC Cr-V · NBA Cr-4 · NIRF GO 20% · QS Employer · ABET Student Outcomes |
| 3 | Research, Publications, Grants & Scholarly Impact | 9 | 200 | 20% | UGC Cat-III · NAAC Cr-III · NIRF RP 30% · QS Citations/Faculty · THE Research · Washington Accord |
| 4 | Innovation, Intellectual Property & Entrepreneurship | 6 | 80 | 8% | NIRF IPR · NAAC III.4 · AICTE Innovation Mission · Startup India |
| 5 | Industry Engagement, Consultancy & Employability | 7 | 80 | 8% | NAAC III.5, III.6 · NBA Cr-7 · NIRF OI · QS Employer Reputation · AICTE Industry-Academia |
| 6 | Institutional Governance, Quality Assurance & Compliance | 9 | 90 | 9% | UGC Cat-II · NAAC Cr-VI · NBA Cr-1,7 · AICTE PBAS · ISO · NIRF Data · NSS/NCC |
| 7 | Professional Development, Upskilling & Digital Scholarly Identity | 7 | 70 | 7% | UGC Cat-II · NAAC II.4 · NBA Cr-5 · AICTE FDP Mandate · QS Academic Reputation |
| 8 | Internationalisation & Global Academic Visibility | 7 | 60 | 6% | QS IRN 2024 · THE International Outlook · Washington Accord · NAAC III.7 |
| 9 | PRAJNA AI Companion Score & Profile Completeness | 7 | 30 | 3% | PRAJNA AI Companion · NAAC Cr-VI · AICTE Digital Mandate · QS Academic Profile |
| | **Total** | **70** | **1000** | **100%** | |

## 2. Tier bands

The dashboard must render exactly these six. Two are new as of the FEI-1000 migration
(`Distinguished Fellow`, `Emerging Faculty`) and the bands for the other four all moved —
any hardcoded tier list or tier→colour map needs updating.

| Tier | Score range | What it means |
|---|---|---|
| Distinguished Fellow | 901 – 1000 | Exceptional performer — top academic and research leader |
| Platinum | 801 – 900 | High achiever — strong across teaching, research, and service |
| Gold | 701 – 800 | Consistent contributor — meeting institutional and national benchmarks |
| Silver | 551 – 700 | Developing contributor — solid base with room to grow |
| Bronze | 400 – 550 | Getting started — foundational activities in place |
| Emerging Faculty | below 400 | New joiner — building the foundation |

> **Fractional scores.** Quality and impact multipliers produce non-integers (30 × 1.5 × 1.2 = 54),
> so the published bands are implemented as half-open intervals `[floor, nextFloor)`.
> A score of 900.5 is **Platinum**, not Distinguished Fellow.

## 3. Scoring formula

```
Final Score = Quantity Score × Quality Multiplier × Impact Multiplier
```

- **Quantity** — the rubric rung the submission's attributes select.
- **Quality** — applied only where the framework states one explicitly
  (today: parameter 20, `1st author ×1.5`).
- **Impact** — applied only where documented (today: `≥25 citations → ×1.2`).

Worked examples from the source document, both covered by unit tests:

| Submission | Calculation | Points |
|---|---|---|
| Q1 SCI paper, 1st author, 25+ citations | 30 × 1.5 × 1.2 | **54** |
| Q4 journal, co-author, 1 citation | 8 × 1.0 × 1.0 | **8** |

Then, per academic year:

```
clusterScore = min( Σ parameterScores in cluster , clusterCeiling )
totalScore   = Σ clusterScores                                  // ≤ 1000
```

## 4. Submitting a contribution (Modules 8–12)

Post to M13 `/approval/start` as today. On approval, M13 emits `ApprovalFinalized`,
which must carry two new **optional** fields for the submission to be scored on its own merits:

```jsonc
{
  "requestId":   "req-abc123",
  "status":      "APPROVED",
  "facultyId":   "<cognito-sub>",
  "moduleId":    "research",
  "entityId":    "pub-998877",
  "campus":      "BENGALURU",
  "department":  "CSE",

  // ── FEI-1000 ──
  "feiParameterId": 20,                    // which of the 70 parameters
  "feiAttributes": {                       // the rubric inputs for that parameter
    "quartile":       "Q1",
    "authorPosition": "FIRST",
    "citations":      40
  }
}
```

**If `feiParameterId` is omitted**, M14 falls back to a conservative legacy mapping
(`src/modules/score-engine/fei1000/legacyBridge.ts`) that scores the submission at the
lowest rung its parameter offers, with a floor equal to the pre-FEI points. Nothing breaks,
but faculty are under-credited — so migrating is worth doing.

**Missing attribute keys under-score rather than over-score.** An absent key makes its rung
unmatchable, so the submission falls through to the parameter's lowest rung. Validate on the
form, not in the engine.

## 5. Reading a score (Module 24)

`GET /score/{facultyId}` returns:

```jsonc
{
  "facultyId":        "<cognito-sub>",
  "totalScore":       842.5,          // 0–1000, native — NO ×10 scaling any more
  "maxScore":         1000,
  "academicYear":     "2026-27",
  "tier":             "Platinum",
  "tierMeaning":      "High achiever — strong across teaching, research, and service",
  "previousScore":    780,
  "yearOnYearTrend":  8.0,            // percent
  "pointsToNextTier": 58.5,
  "nextTierName":     "Distinguished Fellow",

  "campus":     "BENGALURU",
  "department": "CSE",

  // Nine bars for the score-breakdown chart. Always all nine, even at zero.
  "clusters": [
    {
      "id":            3,
      "name":          "Research, Publications, Grants & Scholarly Impact",
      "score":         180,
      "maxPoints":     200,
      "weightPercent": 20,
      "overflow":      0     // >0 means "cluster maxed — invest effort elsewhere"
    }
    // … 8 more
  ],

  // LEGACY — still populated for backward compatibility. Prefer `clusters`.
  "breakdown":     { "research": 180, "teaching": 200, "fdp": 0, "achievements": 0, "admin": 0, "profile": 25 },
  "categoryCount": { "research": 6, "teaching": 3, "fdp": 0, "achievements": 0, "admin": 0, "profile": 0 },
  "approvedCount": 9,
  "lastRecalculatedAt": "2026-08-06T10:00:00.000Z",
  "scoringConfigVersion": 7,   // null = published defaults; a NEW number means an admin re-weighted
}
```

### Breaking changes for M24

| Field | Before | Now |
|---|---|---|
| `totalScore` | internal 0–100, multiplied by 10 at the API edge | native 0–1000 |
| `tier` | 4 values | 6 values — `Distinguished Fellow` and `Emerging Faculty` are new |
| `nextTierName` | could be `"PRAJNA Fellow"` | now `"Distinguished Fellow"` |
| `breakdown` | the only breakdown | still present, but `clusters` is the real one |

Existing faculty scores **will move** — the arithmetic underneath is entirely different.

## 6. Which parameters can actually be scored today

**56 of 70** parameters are scoreable now from faculty-submitted evidence.
**14** need an upstream system that does not publish to BL yet — the UI should render
these read-only or greyed, not as a live zero, or faculty will think they have lost points.

| # | Parameter | Pts | Blocked on |
|---|---|---|---|
| 1 | Syllabus completion rate | 35 | No LMS/academic-calendar feed publishes syllabus completion to BL yet (B-075). |
| 2 | Student feedback score | 45 | IQAC feedback system does not publish to BL yet (B-075). |
| 3 | Result performance | 25 | Requires COE result data keyed by faculty-taught course (B-075). |
| 7 | LMS usage & digital content | 20 | No LMS integration exists in the PRAJNA platform (B-075). |
| 9 | Continuous assessment quality | 25 | Requires an examination/assessment schedule feed (B-075). |
| 13 | Student placement support | 20 | Placement cell system does not publish per-faculty attribution to BL (B-075). |
| 23 | H-Index (Scopus / Google Scholar) | 30 | No Scopus/Scholar API integration exists yet (B-075). |
| 24 | Annual citation increment | 20 | No Scopus/Scholar API integration exists yet (B-075). |
| 36 | Student internships facilitated | 10 | Placement cell system does not publish per-faculty attribution to BL (B-075). |
| 43 | Exam duty compliance | 15 | COE duty roster does not publish to BL (B-075). |
| 57 | Foreign co-authored research paper | 10 | No Scopus/Scholar API integration exists yet (B-075). |
| 65 | Daily / weekly active usage of PRAJNA | 5 | Module 20 (AI Companion) — see docs/action-requests/M20_AI_COMPANION.md (B-076). |
| 66 | AI Companion interaction quality | 5 | Module 20 (AI Companion) — see docs/action-requests/M20_AI_COMPANION.md (B-076). |
| 67 | Leaderboard rank improvement (annual) | 10 | Module 15 prior-year archive; only safe to compute at AY rollover, not live (B-077). |

Together those are **275 points** of per-instance ceiling that no system currently feeds.

## 7. Full parameter reference

`Mode` — `UPLOAD` means the faculty submits evidence and a verifier approves it;
`AUTO` means a system supplies the value.
`Accrual` — `SUM` adds each verified instance; `BEST` keeps the higher of old and new,
so a later weaker submission can never reduce a score mid-year.

### Cluster 1 — Teaching Excellence & Outcome-Based Education

_9 parameters · 240 points · 24% of the total_

UGC Cat-I · NAAC Cr-II · NBA Cr-2,3,4 · NIRF TLR 30% · ABET · QS FSR

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 1 | Syllabus completion rate | 35 | HOD | AUTO | BEST | 100%=35 · 90–99%=25 · 80–89%=15 · <80%=0 | — | `syllabusCompletionPercent` · _percent_ · range 0–100 |
| 2 | Student feedback score | 45 | IQAC | AUTO | BEST | ≥4.5=45 · 4.0–4.4=36 · 3.5–3.9=22 · 3.0–3.4=10 · <3.0=0 | — | `feedbackScore` · _number_ · range 0–5 |
| 3 | Result performance | 25 | HOD | AUTO | BEST | ≥10% above avg=25 · at avg=18 · below=8 | — | `resultVsDeptAvgPercent` · _number_ |
| 4 | CO attainment (course outcome) | 25 | NBA_COORD | UPLOAD | BEST | All COs ≥60%=25 · partial=12 · nil=0 | — | `coAttainmentLevel` · _enum_ · `"ALL"` \| `"PARTIAL"` \| `"NIL"` |
| 5 | PO mapping completeness | 20 | NBA_COORD | UPLOAD | BEST | 100% mapped=20 · partial=10 · nil=0 | — | `poMappingLevel` · _enum_ · `"FULL"` \| `"PARTIAL"` \| `"NIL"` |
| 6 | Innovative teaching methods | 20 | HOD | UPLOAD | BEST | 2+ documented=20 · 1=10 · 0=0 | — | `methodsDocumented` · _number_ · range 0–∞ |
| 7 | LMS usage & digital content | 20 | SYSTEM | AUTO | BEST | Active weekly=20 · monthly=10 · none=0 | — | `lmsActivity` · _enum_ · `"WEEKLY"` \| `"MONTHLY"` \| `"NONE"` |
| 8 | Course file & lesson plan quality | 25 | IQAC | UPLOAD | BEST | On time & complete=25 · late=12 · absent=0 | — | `courseFileStatus` · _enum_ · `"ON_TIME"` \| `"LATE"` \| `"ABSENT"` |
| 9 | Continuous assessment quality | 25 | HOD | AUTO | BEST | All timely=25 · partial=12 · nil=0 | — | `assessmentTimeliness` · _enum_ · `"ALL"` \| `"PARTIAL"` \| `"NIL"` |

### Cluster 2 — Student Success, Mentoring & Development

_9 parameters · 150 points · 15% of the total_

NAAC Cr-V · NBA Cr-4 · NIRF GO 20% · QS Employer · ABET Student Outcomes

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 10 | Mentoring sessions logged | 15 | HOD | AUTO | BEST | ≥8 sessions/yr=15 · 4–7=8 · <4=0 | — | `sessionCount` · _number_ · range 0–∞ |
| 11 | Student project guidance (UG/PG) | 15 | HOD | UPLOAD | BEST | ≥5=15 · 3–4=10 · 1–2=5 · max 10/yr | max 10/yr | `projectCount` · _number_ · range 0–∞ |
| 12 | Remedial & advanced learner support | 15 | HOD | UPLOAD | BEST | Both tracked with outcome=15 · one=8 · nil=0 | — | `supportCoverage` · _enum_ · `"BOTH"` \| `"ONE"` \| `"NIL"` |
| 13 | Student placement support | 20 | PLACEMENT | AUTO | BEST | ≥5 placed=20 · 3–4=12 · 1–2=6 | — | `placedCount` · _number_ · range 0–∞ |
| 14 | Higher education / abroad guidance | 15 | PLACEMENT | UPLOAD | BEST | ≥3 students=15 · 1–2=8 | — | `studentCount` · _number_ · range 0–∞ |
| 15 | Competitive exam guidance (GATE/GRE) | 12 | HOD | UPLOAD | BEST | ≥3 qualified=12 · 1–2=6 | — | `qualifiedCount` · _number_ · range 0–∞ |
| 16 | Student publications / patents guided | 10 | RDC | UPLOAD | SUM | 10 pts each · max 3/yr | max 3/yr | _none — the submission itself is the evidence_ |
| 17 | Student startup mentored | 10 | DEAN | UPLOAD | BEST | Funded startup=10 · Registered=6 · Ideation=3 | — | `startupStage` · _enum_ · `"FUNDED"` \| `"REGISTERED"` \| `"IDEATION"` |
| 18 | Ph.D. supervision (all stages) | 25 | DOAA | UPLOAD | BEST | Awarded=25 · Submitted=15 · Registered=8 · M.Tech guided=5 | — | `supervisionStage` · _enum_ · `"AWARDED"` \| `"SUBMITTED"` \| `"REGISTERED"` \| `"MTECH"` |

### Cluster 3 — Research, Publications, Grants & Scholarly Impact

_9 parameters · 200 points · 20% of the total_

UGC Cat-III · NAAC Cr-III · NIRF RP 30% · QS Citations/Faculty · THE Research · Washington Accord

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 19 | Scopus-indexed journal paper | 20 | SYSTEM | AUTO | SUM | 20 pts each · max 5/yr · quality multiplier applies | max 5/yr | `citations` · _number_ · range 0–∞ |
| 20 | SCI / SCIE / WoS journal paper | 30 | RDC | UPLOAD | SUM | Q1=30 · Q2=22 · Q3=15 · Q4=8 · max 5/yr · 1st author ×1.5 | max 5/yr | `quartile` · _enum_ · `"Q1"` \| `"Q2"` \| `"Q3"` \| `"Q4"`<br>`authorPosition` · _enum_ · `"FIRST"` \| `"CORRESPONDING"` \| `"CO"`<br>`citations` · _number_ · range 0–∞ |
| 21 | Book / book chapter (Scopus publisher) | 15 | RDC | UPLOAD | SUM | Book=15 · Chapter=8 · max 2/yr | max 2/yr | `publicationType` · _enum_ · `"BOOK"` \| `"CHAPTER"` |
| 22 | Conference paper (indexed proceedings) | 8 | RDC | UPLOAD | SUM | International=8 · National=4 · max 4/yr | max 4/yr | `scope` · _enum_ · `"INTERNATIONAL"` \| `"NATIONAL"` |
| 23 | H-Index (Scopus / Google Scholar) | 30 | SYSTEM | AUTO | BEST | H≥15=30 · H10–14=24 · H7–9=18 · H4–6=10 · H1–3=4 | — | `hIndex` · _number_ · range 0–∞ |
| 24 | Annual citation increment | 20 | SYSTEM | AUTO | BEST | ≥100 new=20 · 50–99=15 · 20–49=10 · 5–19=5 | — | `newCitations` · _number_ · range 0–∞ |
| 25 | Research seminar organised/presented | 7 | HOD | UPLOAD | SUM | Organised=7 · Presented at=4 · max 3/yr | max 3/yr | `seminarRole` · _enum_ · `"ORGANISED"` \| `"PRESENTED"` |
| 26 | Central govt. funded project (PI) | 40 | RDC | UPLOAD | SUM | >₹10L=40 · ₹5–10L=28 · ₹1–5L=16 · <₹1L=8 | — | `fundingAmountInr` · _currencyInr_ · range 0–∞ |
| 27 | State / industry funded project | 30 | RDC | UPLOAD | SUM | >₹5L=30 · ₹2–5L=20 · <₹2L=10 | — | `fundingAmountInr` · _currencyInr_ · range 0–∞ |

### Cluster 4 — Innovation, Intellectual Property & Entrepreneurship

_6 parameters · 80 points · 8% of the total_

NIRF IPR · NAAC III.4 · AICTE Innovation Mission · Startup India

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 28 | Patent published / filed | 12 | RDC | UPLOAD | BEST | Published=12 · Filed=6 | — | `patentStage` · _enum_ · `"PUBLISHED"` \| `"FILED"` |
| 29 | Patent granted (Indian) | 25 | RDC | UPLOAD | SUM | 25 pts each · max 2 at full · additional at 50% | max 2 at full · additional at 50% | _none — the submission itself is the evidence_ |
| 30 | Patent granted (International) | 35 | RDC | UPLOAD | SUM | 35 pts each | — | _none — the submission itself is the evidence_ |
| 31 | Copyright / design registration | 8 | RDC | UPLOAD | SUM | 8 pts each · max 2/yr | max 2/yr | _none — the submission itself is the evidence_ |
| 32 | Technology transfer / commercialisation | 15 | RDC | UPLOAD | BEST | Commercialised=15 · Transfer agreement=10 | — | `transferStage` · _enum_ · `"COMMERCIALISED"` \| `"AGREEMENT"` |
| 33 | Startup founded / mentored / incubated | 15 | DEAN | UPLOAD | BEST | Funded startup=15 · Registered=10 · Ideation=5 | — | `startupStage` · _enum_ · `"FUNDED"` \| `"REGISTERED"` \| `"IDEATION"` |

### Cluster 5 — Industry Engagement, Consultancy & Employability

_7 parameters · 80 points · 8% of the total_

NAAC III.5, III.6 · NBA Cr-7 · NIRF OI · QS Employer Reputation · AICTE Industry-Academia

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 34 | Industry expert sessions organised | 15 | HOD | UPLOAD | BEST | ≥3/yr=15 · 2=10 · 1=5 · max 5/yr | max 5/yr | `sessionCount` · _number_ · range 0–∞ |
| 35 | Industry visits organised | 5 | HOD | UPLOAD | BEST | ≥2/yr=5 · 1=3 | — | `visitCount` · _number_ · range 0–∞ |
| 36 | Student internships facilitated | 10 | PLACEMENT | AUTO | BEST | ≥5 students=10 · 3–4=6 · 1–2=3 | — | `studentCount` · _number_ · range 0–∞ |
| 37 | MoU facilitated (active & functional) | 20 | DEAN | UPLOAD | SUM | International=20 · National=12 · Regional=6 · max 2/yr | max 2/yr | `mouScope` · _enum_ · `"INTERNATIONAL"` \| `"NATIONAL"` \| `"REGIONAL"` |
| 38 | Consultancy projects (revenue) | 20 | FINANCE | UPLOAD | SUM | >₹5L=20 · ₹2–5L=12 · ₹0.5–2L=7 · <₹0.5L=3 | — | `revenueInr` · _currencyInr_ · range 0–∞ |
| 39 | Industry certifications earned | 5 | HR | UPLOAD | SUM | 5 pts each · max 2/yr | max 2/yr | _none — the submission itself is the evidence_ |
| 40 | Alumni engagement activities | 10 | ALUMNI | UPLOAD | BEST | ≥2 events/yr=10 · 1=5 | — | `eventCount` · _number_ · range 0–∞ |

### Cluster 6 — Institutional Governance, Quality Assurance & Compliance

_9 parameters · 90 points · 9% of the total_

UGC Cat-II · NAAC Cr-VI · NBA Cr-1,7 · AICTE PBAS · ISO · NIRF Data · NSS/NCC

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 41 | Committee leadership (convener/chair) | 20 | REGISTRAR | UPLOAD | SUM | Convener=20 · Co-convener=12 · Member=6 · max 2 roles | max 2 roles | `committeeRole` · _enum_ · `"CONVENER"` \| `"CO_CONVENER"` \| `"MEMBER"` |
| 42 | Dept / institution events organised | 15 | HOD | UPLOAD | BEST | ≥2/yr=15 · 1=8 | — | `eventCount` · _number_ · range 0–∞ |
| 43 | Exam duty compliance | 15 | COE | AUTO | BEST | 100%=15 · 80–99%=9 · <80%=0 | — | `compliancePercent` · _percent_ · range 0–100 |
| 44 | Admission support activities | 10 | ADMISSIONS | UPLOAD | BEST | Active=10 · partial=5 | — | `participation` · _enum_ · `"ACTIVE"` \| `"PARTIAL"` \| `"NIL"` |
| 45 | NSS / NCC / social extension activity | 10 | HOD | UPLOAD | BEST | Active coordinator=10 · Participant=5 · Nil=0 | — | `extensionRole` · _enum_ · `"COORDINATOR"` \| `"PARTICIPANT"` \| `"NIL"` |
| 46 | NAAC documentation contribution | 10 | IQAC | UPLOAD | BEST | Lead contributor=10 · Active=6 · Passive=0 | — | `contributionLevel` · _enum_ · `"LEAD"` \| `"ACTIVE"` \| `"PASSIVE"` |
| 47 | NBA documentation contribution | 10 | NBA_COORD | UPLOAD | BEST | Lead contributor=10 · Active=6 · Passive=0 | — | `contributionLevel` · _enum_ · `"LEAD"` \| `"ACTIVE"` \| `"PASSIVE"` |
| 48 | NIRF data submission & audit compliance | 15 | IQAC | AUTO | BEST | Complete & on time + zero observations=15 · partial=8 · nil=0 | — | `nirfCompliance` · _enum_ · `"COMPLETE"` \| `"PARTIAL"` \| `"NIL"` |
| 49 | Timely internal report submission | 10 | IQAC | AUTO | BEST | All on time=10 · 1 delay=5 · 2+ delays=0 | — | `delayCount` · _number_ · range 0–∞ |

### Cluster 7 — Professional Development, Upskilling & Digital Scholarly Identity

_7 parameters · 70 points · 7% of the total_

UGC Cat-II · NAAC II.4 · NBA Cr-5 · AICTE FDP Mandate · QS Academic Reputation

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 50 | FDP attended (≥5 days, AICTE/TEQIP) | 15 | HR | UPLOAD | SUM | 15 pts each · max 2 at full · additional at 50% | max 2 at full · additional at 50% | _none — the submission itself is the evidence_ |
| 51 | FDP attended (1–4 days, workshop) | 8 | HR | UPLOAD | SUM | 8 pts each · max 3/yr | max 3/yr | _none — the submission itself is the evidence_ |
| 52 | NPTEL / SWAYAM / MOOC certification | 10 | HR | UPLOAD | BEST | Elite+Gold=10 · Elite=7 · Completion=3 | — | `certificationGrade` · _enum_ · `"ELITE_GOLD"` \| `"ELITE"` \| `"COMPLETION"` |
| 53 | AI / Data Science upskilling | 10 | HR | UPLOAD | BEST | Course with assessment=10 · audit only=4 | — | `courseMode` · _enum_ · `"ASSESSED"` \| `"AUDIT"` |
| 54 | Higher qualification in progress | 8 | HR | UPLOAD | BEST | PhD registered=8 · Coursework complete=5 | — | `qualificationStage` · _enum_ · `"PHD_REGISTERED"` \| `"COURSEWORK_COMPLETE"` |
| 55 | Professional body membership (active) | 5 | HR | UPLOAD | BEST | Fellow=5 · Senior Member=4 · Member=2 | — | `membershipGrade` · _enum_ · `"FELLOW"` \| `"SENIOR_MEMBER"` \| `"MEMBER"` |
| 56 | Academic profiles (ORCID/Scholar/Scopus) | 14 | SYSTEM | AUTO | BEST | All 3 complete & linked=14 · 2=8 · 1=3 | — | `linkedProfileCount` · _number_ · range 0–3 |

### Cluster 8 — Internationalisation & Global Academic Visibility

_7 parameters · 60 points · 6% of the total_

QS IRN 2024 · THE International Outlook · Washington Accord · NAAC III.7

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 57 | Foreign co-authored research paper | 10 | SYSTEM | AUTO | BEST | ≥3 papers with foreign co-authors/yr=10 · 1–2=5 | — | `paperCount` · _number_ · range 0–∞ |
| 58 | International research collaboration | 12 | DEAN | UPLOAD | BEST | Active joint project=12 · Research MoU=7 | — | `collaborationType` · _enum_ · `"JOINT_PROJECT"` \| `"RESEARCH_MOU"` |
| 59 | Visiting lecture at foreign institution | 10 | HOD | UPLOAD | SUM | 10 pts each · max 2/yr | max 2/yr | _none — the submission itself is the evidence_ |
| 60 | International conference presented | 8 | HR | UPLOAD | SUM | 8 pts · max 2/yr | max 2/yr | _none — the submission itself is the evidence_ |
| 61 | Faculty exchange programme (outbound) | 10 | DEAN | UPLOAD | BEST | ≥2 weeks=10 · 1 week=6 | — | `durationWeeks` · _number_ · range 0–∞ |
| 62 | International certification / award | 5 | DEAN | UPLOAD | BEST | International award=5 · Global cert=3 | — | `recognitionType` · _enum_ · `"AWARD"` \| `"CERTIFICATION"` |
| 63 | International student / scholar mentored | 5 | DEAN | UPLOAD | SUM | 5 pts each · max 2/yr | max 2/yr | _none — the submission itself is the evidence_ |

### Cluster 9 — PRAJNA AI Companion Score & Profile Completeness

_7 parameters · 30 points · 3% of the total_

PRAJNA AI Companion · NAAC Cr-VI · AICTE Digital Mandate · QS Academic Profile

| # | Parameter | Pts | Verifier | Mode | Accrual | Rubric | Annual cap | `feiAttributes` keys |
|---|---|---|---|---|---|---|---|---|
| 64 | PRAJNA profile completeness | 15 | SYSTEM | AUTO | BEST | 100%=15 · 90–99%=10 · 75–89%=5 · <75%=0 | — | `profileCompleteness` · _percent_ · range 0–100 |
| 65 | Daily / weekly active usage of PRAJNA | 5 | SYSTEM | AUTO | BEST | Daily active=5 · Weekly=3 · Monthly=1 | — | `usageCadence` · _enum_ · `"DAILY"` \| `"WEEKLY"` \| `"MONTHLY"` \| `"INACTIVE"` |
| 66 | AI Companion interaction quality | 5 | SYSTEM | AUTO | BEST | Goals + reflections active=5 · Partial=2 | — | `interactionQuality` · _enum_ · `"FULL"` \| `"PARTIAL"` \| `"NONE"` |
| 67 | Leaderboard rank improvement (annual) | 10 | SYSTEM | AUTO | BEST | Top 10% dept=10 · Top 25%=6 · Improved rank=3 | — | `rankBand` · _enum_ · `"TOP_10"` \| `"TOP_25"` \| `"IMPROVED"` \| `"NONE"` |
| 68 | MOOC / course created (published) | 7 | DEAN | UPLOAD | BEST | Published with enrolled learners=7 · Draft=3 | — | `courseStatus` · _enum_ · `"PUBLISHED"` \| `"DRAFT"` |
| 69 | Educational videos / OER created | 5 | HOD | UPLOAD | BEST | ≥5 verified resources=5 · 2–4=3 | — | `resourceCount` · _number_ · range 0–∞ |
| 70 | Invited / expert talk (national level) | 8 | HOD | UPLOAD | BEST | National=8 · State/Regional=4 · Invited webinar=2 | — | `talkScope` · _enum_ · `"NATIONAL"` \| `"STATE_REGIONAL"` \| `"WEBINAR"` |

## 8. Example submission payloads

One `feiAttributes` example per parameter that takes inputs, so the form can be built
field-by-field without reading the engine.

| # | Parameter | Example `feiAttributes` |
|---|---|---|
| 1 | Syllabus completion rate | `{"syllabusCompletionPercent":95}` |
| 2 | Student feedback score | `{"feedbackScore":3}` |
| 3 | Result performance | `{"resultVsDeptAvgPercent":3}` |
| 4 | CO attainment (course outcome) | `{"coAttainmentLevel":"ALL"}` |
| 5 | PO mapping completeness | `{"poMappingLevel":"FULL"}` |
| 6 | Innovative teaching methods | `{"methodsDocumented":3}` |
| 7 | LMS usage & digital content | `{"lmsActivity":"WEEKLY"}` |
| 8 | Course file & lesson plan quality | `{"courseFileStatus":"ON_TIME"}` |
| 9 | Continuous assessment quality | `{"assessmentTimeliness":"ALL"}` |
| 10 | Mentoring sessions logged | `{"sessionCount":3}` |
| 11 | Student project guidance (UG/PG) | `{"projectCount":3}` |
| 12 | Remedial & advanced learner support | `{"supportCoverage":"BOTH"}` |
| 13 | Student placement support | `{"placedCount":3}` |
| 14 | Higher education / abroad guidance | `{"studentCount":3}` |
| 15 | Competitive exam guidance (GATE/GRE) | `{"qualifiedCount":3}` |
| 17 | Student startup mentored | `{"startupStage":"FUNDED"}` |
| 18 | Ph.D. supervision (all stages) | `{"supervisionStage":"AWARDED"}` |
| 19 | Scopus-indexed journal paper | `{"citations":3}` |
| 20 | SCI / SCIE / WoS journal paper | `{"quartile":"Q1","authorPosition":"FIRST","citations":3}` |
| 21 | Book / book chapter (Scopus publisher) | `{"publicationType":"BOOK"}` |
| 22 | Conference paper (indexed proceedings) | `{"scope":"INTERNATIONAL"}` |
| 23 | H-Index (Scopus / Google Scholar) | `{"hIndex":3}` |
| 24 | Annual citation increment | `{"newCitations":3}` |
| 25 | Research seminar organised/presented | `{"seminarRole":"ORGANISED"}` |
| 26 | Central govt. funded project (PI) | `{"fundingAmountInr":750000}` |
| 27 | State / industry funded project | `{"fundingAmountInr":750000}` |
| 28 | Patent published / filed | `{"patentStage":"PUBLISHED"}` |
| 32 | Technology transfer / commercialisation | `{"transferStage":"COMMERCIALISED"}` |
| 33 | Startup founded / mentored / incubated | `{"startupStage":"FUNDED"}` |
| 34 | Industry expert sessions organised | `{"sessionCount":3}` |
| 35 | Industry visits organised | `{"visitCount":3}` |
| 36 | Student internships facilitated | `{"studentCount":3}` |
| 37 | MoU facilitated (active & functional) | `{"mouScope":"INTERNATIONAL"}` |
| 38 | Consultancy projects (revenue) | `{"revenueInr":750000}` |
| 40 | Alumni engagement activities | `{"eventCount":3}` |
| 41 | Committee leadership (convener/chair) | `{"committeeRole":"CONVENER"}` |
| 42 | Dept / institution events organised | `{"eventCount":3}` |
| 43 | Exam duty compliance | `{"compliancePercent":95}` |
| 44 | Admission support activities | `{"participation":"ACTIVE"}` |
| 45 | NSS / NCC / social extension activity | `{"extensionRole":"COORDINATOR"}` |
| 46 | NAAC documentation contribution | `{"contributionLevel":"LEAD"}` |
| 47 | NBA documentation contribution | `{"contributionLevel":"LEAD"}` |
| 48 | NIRF data submission & audit compliance | `{"nirfCompliance":"COMPLETE"}` |
| 49 | Timely internal report submission | `{"delayCount":3}` |
| 52 | NPTEL / SWAYAM / MOOC certification | `{"certificationGrade":"ELITE_GOLD"}` |
| 53 | AI / Data Science upskilling | `{"courseMode":"ASSESSED"}` |
| 54 | Higher qualification in progress | `{"qualificationStage":"PHD_REGISTERED"}` |
| 55 | Professional body membership (active) | `{"membershipGrade":"FELLOW"}` |
| 56 | Academic profiles (ORCID/Scholar/Scopus) | `{"linkedProfileCount":3}` |
| 57 | Foreign co-authored research paper | `{"paperCount":3}` |
| 58 | International research collaboration | `{"collaborationType":"JOINT_PROJECT"}` |
| 61 | Faculty exchange programme (outbound) | `{"durationWeeks":3}` |
| 62 | International certification / award | `{"recognitionType":"AWARD"}` |
| 64 | PRAJNA profile completeness | `{"profileCompleteness":95}` |
| 65 | Daily / weekly active usage of PRAJNA | `{"usageCadence":"DAILY"}` |
| 66 | AI Companion interaction quality | `{"interactionQuality":"FULL"}` |
| 67 | Leaderboard rank improvement (annual) | `{"rankBand":"TOP_10"}` |
| 68 | MOOC / course created (published) | `{"courseStatus":"PUBLISHED"}` |
| 69 | Educational videos / OER created | `{"resourceCount":3}` |
| 70 | Invited / expert talk (national level) | `{"talkScope":"NATIONAL"}` |

## 9. Open questions for Dr. Budda

These are encoded with a stated assumption and a failing-loud test, but need a ruling.

| Ref | Question | BL's working assumption |
|---|---|---|
| B-072 | The master formula cites an impact multiplier but gives only one data point (`25+ citations → ×1.2`). What is the full ladder? | Only the documented rung is encoded. No ladder invented. |
| B-072 | Parameter 19 says "quality multiplier applies" without naming the attribute. Which one? | No quality multiplier applied to parameter 19. |
| B-073 | Per-parameter `Max Pts` sum to 1072, not 1000; 5 of 9 clusters disagree with their stated ceiling. | Cluster ceiling is authoritative; parameter max is per-instance. |
| B-074 | The cover says 63 parameters; the tables number 1–70. | 70. The 63 omits Cluster 9. |
| B-077 | Parameter 67 scores leaderboard rank, but the leaderboard ranks by this very score. | Fed only from M15's frozen prior-year archive at year rollover, never live. |
| — | Parameter 11 reads `≥5=15 … max 10/yr`. Is the 10 a project count or a point ceiling? | Treated as informational; the `≥5` rung already maxes the parameter. |
