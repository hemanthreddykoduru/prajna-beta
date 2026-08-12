# FEI-1000 — Frontend Handoff

**From:** Komma Bhanu Teja (Business Logic Layer Lead — Modules 13–18)
**To:** Hemanth Reddy (M24 Faculty Dashboard) — please forward to anyone building submission forms
**Date:** 2026-08-06
**Priority:** 🔴 Four breaking changes. The dashboard will render **visibly wrong numbers** until they land.

Module 14 has been rewritten onto **FEI-1000** — the Faculty Excellence Index from Dr. Kishore Budda:
9 clusters, 70 parameters, 1000 points. This document is everything the frontend needs.

---

## 0. TL;DR — what to hand over

Send these **three files**. They are generated from the engine, so they cannot drift from it.

| File | Purpose | Who consumes it |
|---|---|---|
| [`fei1000.types.ts`](fei1000.types.ts) | Drop-in TypeScript. Tier unions, `DashboardScoreResponse`, and `FeiAttributes` — a fully-typed submission body per parameter. **Zero imports, compiles standalone under `--strict`.** | Copy straight into the frontend repo |
| [`fei1000.registry.json`](fei1000.registry.json) | Machine-readable: all 70 parameters, rubrics, form inputs, enum values, tier bands, example payloads. | Codegen — forms, previews, charts |
| [`CONTRACT.md`](CONTRACT.md) | Human-readable spec: API shapes, worked examples, full parameter tables. | Humans |

Plus **this document**, [`README.md`](README.md), and the agent skill in [`claude-skill/`](claude-skill/) (§7).

> ⚠️ All three, and the skill, are **generated** by `node scripts/generate-fei-ui-contract.mjs` in the
> BL repo. Do not hand-edit them — regenerating overwrites changes. Contract corrections come to me.

---

## 1. 🔴 The four breaking changes

Everything else in this document is additive. These four will produce wrong numbers on screen.

### 1.1 Six tiers, not four

| Tier | Score range | Status |
|---|---|---|
| Distinguished Fellow | 901 – 1000 | 🆕 **new** |
| Platinum | 801 – 900 | band moved |
| Gold | 701 – 800 | band moved |
| Silver | 551 – 700 | band moved |
| Bronze | 400 – 550 | band moved |
| Emerging Faculty | below 400 | 🆕 **new** |

Every hardcoded tier list, tier→colour map, badge component, and `switch` on tier needs updating.
Use `FEI_TIER_BANDS` from `fei1000.types.ts` rather than re-declaring them.

**Bands are half-open.** Scores are fractional — multipliers produce `54`, `900.5` — so a score is in
a band while `minScore <= score < maxScoreExclusive`. `900.5` is **Platinum**.

### 1.2 `totalScore` is native 0–1000

It used to be an internal 0–100 that the API multiplied by 10 at the edge. **That scaling is gone.**

```diff
- <span>{score.totalScore * 10}</span>
+ <span>{score.totalScore}</span>
```

Search for `* 10`, `/ 10`, and `* 100` anywhere near a score. Same applies to `previousScore` and
`pointsToNextTier`, which were also scaled.

### 1.3 `"PRAJNA Fellow"` no longer exists

The top tier is `"Distinguished Fellow"`. At the top band, `nextTierName` returns the **current**
tier's name with `pointsToNextTier: 0` — render "highest tier reached", not a target.

```ts
const atTop = score.pointsToNextTier === 0;
```

### 1.4 `clusters[]` replaces `breakdown`

`breakdown` and `categoryCount` are still populated and still work, but they are `@deprecated` and
**lossy** — nine clusters get folded into five legacy categories (clusters 1+2 both become `teaching`;
4, 5 and 8 all become `achievements`). Build the real breakdown from `clusters`.

**Existing faculty scores will move.** The arithmetic underneath is entirely different — this is not
a rescaling, it is a different framework. Worth a heads-up in release notes.

---

## 2. The API

`GET /score/{facultyId}` — unchanged route, unchanged auth.

```jsonc
{
  "facultyId":        "<cognito-sub>",
  "totalScore":       842.5,        // 0–1000 native. Do NOT scale.
  "maxScore":         1000,
  "academicYear":     "2026-27",    // July–June
  "tier":             "Platinum",
  "tierMeaning":      "High achiever — strong across teaching, research, and service",
  "previousScore":    780,
  "yearOnYearTrend":  8.0,          // percent, positive = improved
  "pointsToNextTier": 58.5,
  "nextTierName":     "Distinguished Fellow",

  "campus":     "BENGALURU",
  "department": "CSE",

  "clusters": [                     // always all nine, in id order, even at zero
    {
      "id": 3,
      "name": "Research, Publications, Grants & Scholarly Impact",
      "score": 180,
      "maxPoints": 200,             // ⚠️ DIFFERS PER CLUSTER — see below
      "weightPercent": 20,
      "overflow": 0                 // >0 ⇒ cluster maxed
    }
    // … 8 more
  ],

  "approvedCount": 9,
  "lastRecalculatedAt": "2026-08-06T10:00:00.000Z",

  // @deprecated — prefer `clusters`
  "breakdown":     { "research": 180, "teaching": 200, "fdp": 0, "achievements": 0, "admin": 0, "profile": 25 },
  "categoryCount": { "research": 6, "teaching": 3, "fdp": 0, "achievements": 0, "admin": 0, "profile": 0 }
}
```

**Cluster ceilings differ:** 240, 150, 200, 80, 80, 90, 70, 60, 30. Do **not** put the nine bars on a
shared y-axis max — a cluster-9 score of 25 is 83% complete, while a cluster-1 score of 25 is 10%.
Chart `score / maxPoints`.

---

## 3. Step-by-step migration

### Step 1 — Drop in the types (15 min)

Copy `fei1000.types.ts` into the frontend as-is. It has no imports. Replace your local
`DashboardScoreResponse` with the one it exports and let the compiler find every break.

### Step 2 — Fix the tier map (30 min)

```ts
import { FEI_TIER_BANDS, type FeiTier } from './fei1000.types';

const TIER_COLOURS: Record<FeiTier, string> = {
  DISTINGUISHED_FELLOW: '…',
  PLATINUM:             '…',
  GOLD:                 '…',
  SILVER:               '…',
  BRONZE:               '…',
  EMERGING_FACULTY:     '…',
};
```

Keying the record by `FeiTier` means the compiler fails the build if a tier is ever added or renamed,
instead of silently rendering an unstyled badge. Do the same for icons and labels.

### Step 3 — Remove the ×10 scaling (15 min)

Grep for `* 10` / `/ 10` near score fields. Delete.

### Step 4 — Build the cluster chart (half a day)

Nine bars from `response.clusters`, each `score / maxPoints`. Show `weightPercent` in the tooltip so
faculty understand why Research moves their total more than AI Companion does.

When `overflow > 0`, mark the bar as maxed. This is genuinely useful guidance — "You've maxed
Innovation & IP; further patents this year won't add points" tells someone where to spend effort.

### Step 5 — Generate the submission forms (1–2 days)

From `fei1000.registry.json`. For each parameter where `mode === "UPLOAD"`:

```ts
import registry from './fei1000.registry.json';

const uploadable = registry.parameters.filter(p => p.mode === 'UPLOAD' && !p.pendingSource);

// Each input maps to one form field:
//   type 'enum'        → <select>, options from input.options ({ value, label })
//   type 'number'      → <input type="number"> with min/max
//   type 'percent'     → number field, 0–100, suffix '%'
//   type 'currencyInr' → number field, ₹ prefix
//   type 'boolean'     → checkbox
```

Submit alongside the existing `/approval/start` body:

```jsonc
{
  "feiParameterId": 20,
  "feiAttributes": { "quartile": "Q1", "authorPosition": "FIRST", "citations": 40 }
}
```

`registry.parameters[].exampleAttributes` has a ready-made example for every parameter that takes
inputs — useful for fixtures and Storybook.

**`mode === "AUTO"` parameters get no form.** Faculty cannot submit evidence for them; a system
supplies the value.

### Step 6 — Live points preview (optional, high value)

`rungs` is a serialised decision list: evaluate top-down, **first match wins**, `points` is the award.
Four condition kinds — `gte`, `gt`, `range`, `eq`, plus an unconditional `always` fallback. Roughly 30
lines to implement, and then the form can tell a faculty member what a submission is worth *before*
they submit.

Then apply `quality` and `impact` if present:

```
final = rungPoints × qualityFactor × impactFactor
```

Worth checking against the framework's own worked example: a Q1 paper, first author, 25+ citations
→ `30 × 1.5 × 1.2 = 54`.

### Step 7 — Handle pending parameters (2 hours)

14 of 70 parameters have `pendingSource !== null` — Scopus H-index, LMS usage, student feedback, exam
duty, placements, AI Companion metrics. No system feeds them yet.

**Render these greyed / "coming soon", never as a live `0`.** A faculty member seeing `0 / 45` for
"Student feedback score" will believe they lost 45 points they were never given a way to earn.

---

## 4. Acceptance checklist

Ask the UI team to confirm each line:

- [ ] All six tiers render, with distinct styling
- [ ] `Distinguished Fellow` and `Emerging Faculty` appear correctly
- [ ] A score of `900.5` renders as **Platinum**
- [ ] No arithmetic is applied to `totalScore`, `previousScore`, or `pointsToNextTier`
- [ ] At the top tier the UI says "highest tier reached", not a next-tier target
- [ ] Nine cluster bars, each scaled to its **own** `maxPoints`
- [ ] `overflow > 0` is surfaced as "cluster maxed"
- [ ] Submission forms are generated from the registry, not hand-authored
- [ ] Enum dropdowns use `input.options` values verbatim (they are case-sensitive)
- [ ] `mode: 'AUTO'` parameters have no submission form
- [ ] `pendingSource` parameters are greyed, not showing a live 0
- [ ] No tier threshold, cluster ceiling, or rubric value is hardcoded anywhere in the frontend
- [ ] Fractional scores render sensibly (no assumption of integers)

---

## 5. Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Keeping `× 10` | Scores show as 8425 / 1000 | Delete the scaling |
| Shared y-axis on cluster chart | Cluster 9 looks permanently empty | Scale each bar to its own `maxPoints` |
| Hardcoding 4 tiers | Top and bottom performers get no badge | Use `FEI_TIER_BANDS` |
| Lowercase enum values | Submission silently scores 0 | Values are case-sensitive — use `input.options` verbatim |
| Building forms for `AUTO` parameters | Faculty submit evidence that is ignored | Filter on `mode === 'UPLOAD'` |
| Rendering pending parameters as 0 | Support tickets about "lost points" | Grey them out |
| Treating a missing attribute as an error | — | It is legal; it just scores the lowest rung. Validate on the form |

---

## 6. Open questions with Dr. Budda

These are encoded with a stated assumption on the BL side. If a ruling changes one, I will regenerate
the three files and tell you — no frontend change should be needed unless the UI hardcoded something.

| Ref | Question | Current assumption |
|---|---|---|
| B-072 | The impact multiplier has exactly one documented data point (`25+ citations → ×1.2`). Full ladder? | Only that rung is encoded. Nothing invented. |
| B-073 | Per-parameter maxes sum to 1072, not 1000; 5 of 9 clusters disagree with their ceiling. | Cluster ceiling is authoritative; parameter max is per-instance. |
| B-074 | The framework cover says 63 parameters; the tables number 1–70. | 70. |
| B-077 | Parameter 67 scores leaderboard rank — but the leaderboard ranks by this score. | Fed only from the frozen prior-year archive at year rollover. |

---

## 7. For the UI team's AI agent

Copy [`claude-skill/fei1000-ui-alignment/`](claude-skill/fei1000-ui-alignment/) to
`.claude/skills/fei1000-ui-alignment/` in the frontend repo. Their agent then picks it up
automatically on prompts like *"align with the score engine"* or *"update the tier badges"*.

If they are not using Claude Code skills, this single prompt works standalone once the three files are
in their repo:

> Read `fei1000.registry.json`, `fei1000.types.ts`, and `FEI1000_UI_CONTRACT.md` in this repo — they
> are the generated contract for the PRAJNA FEI-1000 scoring system and the only source of truth.
>
> Audit this frontend against them. Specifically check: (1) tier handling — there are now SIX tiers
> (`Distinguished Fellow` 901+, `Platinum` 801–900, `Gold` 701–800, `Silver` 551–700, `Bronze`
> 400–550, `Emerging Faculty` <400) where there used to be four, and `"PRAJNA Fellow"` no longer
> exists; (2) any arithmetic applied to `totalScore` — it is now native 0–1000 and must NOT be scaled;
> (3) score breakdown UI — the nine-entry `clusters[]` array replaces the five-category `breakdown`,
> and each cluster has its OWN `maxPoints` (240/150/200/80/80/90/70/60/30), so do not chart them on a
> shared axis; (4) evidence-submission forms — they should be generated from
> `registry.parameters[].inputs` and post `{ feiParameterId, feiAttributes }`, only for parameters
> where `mode === "UPLOAD"` and `pendingSource === null`.
>
> Report a table of `FILE:LINE | WHAT IT DOES | STATUS | FIX`, then a prioritised fix list with the
> breaking changes first. Do not hardcode tier thresholds, cluster ceilings, or rubric values — read
> them from the contract files. Do not edit the three contract files; they are generated upstream.

---

## 8. Questions back to me

Anything ambiguous, anything that looks wrong in the contract, or any field the dashboard needs that
is not there — send it over. Adding a computed field to the response is cheap; discovering three weeks
in that the UI worked around a missing one is not.

---

*Tracked as B-080 in the BL blocker registry (`docs/BL_STATUS_AND_BLOCKERS.md`, business-logic repo).*
*Engine: `src/modules/score-engine/` · 645 tests / 51 suites green · 7-stack synth green.*
