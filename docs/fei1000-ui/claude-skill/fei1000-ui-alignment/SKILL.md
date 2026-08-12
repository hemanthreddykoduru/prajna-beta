---
name: fei1000-ui-alignment
description: Align THIS frontend repository with the PRAJNA FEI-1000 scoring system (Module 14 Score Engine). Use when the UI needs to render faculty scores, tier badges, the nine-cluster breakdown, or build evidence-submission forms. Triggers: "FEI-1000", "align with the score engine", "update tiers", "score dashboard", "faculty excellence index", "why is my score showing wrong".
---

# FEI-1000 Frontend Alignment

You are aligning the **current repository** (a PRAJNA frontend) with the FEI-1000 scoring
system owned by the Business Logic layer (Module 14, Bhanu).

## Step 0 — Load the contract

Three files should have been handed over. Find them in this repo (check `docs/`, `contracts/`,
`src/types/`, or the repo root):

| File | What it is |
|---|---|
| `fei1000.registry.json` | **Machine-readable.** All 70 parameters, rubrics, form inputs, enum values, tier bands. Codegen from this. |
| `fei1000.types.ts` | **Drop-in TypeScript.** Tier unions, `DashboardScoreResponse`, and `FeiAttributes` — a typed submission body per parameter. Zero imports. |
| `FEI1000_UI_CONTRACT.md` | Human-readable spec, API shapes, worked examples. |

**If they are not in this repo, STOP and ask for them.** Do not reconstruct the framework from
memory or from this file — the registry is the only source of truth and it changes.

Read `fei1000.registry.json` first. Everything below is derived from it.

## Step 1 — Find what the score system touches

Search this repo for:

- Tier names: `Platinum`, `Gold`, `Silver`, `Bronze`, `PRAJNA Fellow`, `Distinguished`, `Emerging`
- Score handling: `totalScore`, `maxScore`, `pointsToNextTier`, `nextTierName`, `yearOnYearTrend`
- The legacy breakdown: `breakdown`, `categoryCount`, and the category names
  `research` / `teaching` / `fdp` / `achievements` / `admin` / `profile`
- Any `* 10`, `/ 10`, `* 100`, or `toFixed` near a score
- Evidence submission forms posting to `/approval/start`

Build a file:line inventory before changing anything.

## Step 2 — Check against the four breaking changes

| # | Change | What breaks | How to verify |
|---|---|---|---|
| 1 | **Six tiers, not four.** `Distinguished Fellow` (901+) and `Emerging Faculty` (<400) are new; the other four bands all moved. | Hardcoded tier arrays, tier→colour maps, `switch` on tier, badge components | Every tier list must have 6 entries and match `FEI_TIER_BANDS` |
| 2 | **`totalScore` is native 0–1000.** The API no longer scales an internal 0–100 by 10. | Any `score * 10` or `/ 10` now double-scales | No arithmetic on `totalScore` before display |
| 3 | **`nextTierName` never returns `"PRAJNA Fellow"`.** Top tier is `"Distinguished Fellow"`, and at the top `nextTierName` equals the current tier with `pointsToNextTier: 0`. | "next tier" UI showing a tier that does not exist | Render "highest tier reached" when `pointsToNextTier === 0` |
| 4 | **`clusters[]` replaces `breakdown`.** Nine entries, always all nine, in id order, each with `score`, `maxPoints`, `weightPercent`, `overflow`. | Charts built on the 5-category `breakdown` | `breakdown` still works but is `@deprecated` and lossy |

## Step 3 — Generate, do not hand-write

The registry exists so the UI is generated. Prefer codegen over hand-authored constants.

- **Tier badge / colour map** — derive from `FEI_TIER_BANDS` in `fei1000.types.ts`. Assign colours
  by `tier` key, never by array index or score threshold.
- **Cluster chart** — iterate `clusters` from the API response, not a local cluster list. Each bar's
  ceiling is `maxPoints` (they differ: 240, 150, 200, 80, 80, 90, 70, 60, 30 — do NOT use a shared
  y-axis max).
- **Submission forms** — generate from `registry.parameters[].inputs`. Each input carries `key`,
  `type` (`number` | `percent` | `currencyInr` | `enum` | `boolean`), `label`, `options`, `min`,
  `max`, `helpText`. Submit as `{ feiParameterId, feiAttributes: { <key>: <value> } }`.
- **Live points preview** — `rungs` is a serialised decision list, evaluated top-down, first match
  wins. Implement the four condition kinds (`gte`, `gt`, `range`, `eq`, plus `always`) once and the
  form can show "this will earn you N points" before submitting. Then apply `quality` and `impact`
  multipliers if present.

## Step 4 — Behaviours to get right

- **`pendingSource !== null` means no live data source.** 14 of the 70 parameters are fed by systems
  that do not publish yet (Scopus, LMS, COE, placement, M20). Render those **greyed / "coming soon"**,
  never as a live `0` — a faculty member seeing 0 out of 45 for "Student feedback" will think they
  lost points they never had a way to earn.
- **`mode: 'AUTO'` parameters have no submission form.** Faculty cannot upload evidence for them.
  Only build forms for `mode: 'UPLOAD'`.
- **`overflow > 0` means the cluster is maxed.** Surface it ("You've maxed Innovation & IP — further
  patents this year won't add points") so faculty invest effort elsewhere. This is real guidance, not
  an error state.
- **Scores are fractional.** Multipliers produce values like `54` and `900.5`. Do not assume integers.
  Tier bands are half-open: `900.5` is Platinum, not Distinguished Fellow.
- **Counters reset each academic year** (July–June, e.g. `"2026-27"`). Annual caps like `max 5/yr`
  are per academic year, not rolling.
- **A missing attribute under-scores, it does not error.** The engine falls through to the lowest
  rung. So form-level validation matters: an incomplete submission silently scores less.

## Step 5 — Output

Produce:

1. **Inventory table** — `FILE:LINE | WHAT IT DOES | STATUS (ALIGNED / BROKEN / MISSING) | FIX`
2. **Prioritised fix list**, with the four breaking changes first — those produce visibly wrong
   numbers on screen, not just missing features.
3. **New work** — cluster chart, submission forms, points preview, pending-parameter states.
4. **Questions for Bhanu** — anything in the contract that is ambiguous or looks wrong.

Then apply the fixes if the user asks. Re-run the app and confirm a real score renders end to end.

## Do not

- Do not hand-edit `fei1000.registry.json`, `fei1000.types.ts`, or `FEI1000_UI_CONTRACT.md` —
  they are generated in the BL repo and regenerating overwrites you. Contract changes go to Bhanu.
- Do not hardcode tier thresholds, cluster ceilings, or rubric values anywhere in the frontend.
- Do not scale `totalScore`.
- Do not invent rubric values for parameters whose data source is pending.
