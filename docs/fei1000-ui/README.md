# PRAJNA FEI-1000 — Frontend Handoff Pack

**Send this entire folder to the UI team.** It is self-contained.

**From:** Komma Bhanu Teja — Business Logic Layer Lead (Modules 13–18)
**Date:** 2026-08-06
**Subject:** Module 14 has been rewritten onto FEI-1000. Four breaking changes for the dashboard.

---

> **Already received an earlier version of this pack?** Read
> **[CHANGELOG-2026-08-07.md](CHANGELOG-2026-08-07.md)** first — it lists what changed (one new
> field, nothing breaking). If this is your first time, skip it; everything is already folded in below.

## Read in this order

| # | File | Who | Time |
|---|---|---|---|
| 1 | **[HANDOFF.md](HANDOFF.md)** | Whoever owns the dashboard | 15 min |
| 2 | [CONTRACT.md](CONTRACT.md) | Reference — full spec, all 70 parameters | dip in as needed |
| 3 | [fei1000.types.ts](fei1000.types.ts) | Copy into the frontend repo, as-is | 5 min |
| 4 | [fei1000.registry.json](fei1000.registry.json) | Feed to codegen — forms, charts, previews | — |
| 5 | [claude-skill/](claude-skill/) | Drop into the repo so their AI agent picks it up | 2 min |
| 6 | [ADMIN-WEIGHTING.md](ADMIN-WEIGHTING.md) | Only if you're building the admin screen that re-weights the framework | 10 min |

**Start with `HANDOFF.md`.** Everything else is reference material it points into.

---

## What changed, in one paragraph

Module 14 now implements **FEI-1000** — Dr. Kishore Budda's Faculty Excellence Index: 9 clusters,
70 parameters, 1000 points. It replaces the old 5-category weighted model. Four things break in the
UI: there are now **six tiers instead of four**, `totalScore` is **native 0–1000** (the old ×10 at
the API edge is gone), `"PRAJNA Fellow"` no longer exists, and a nine-entry **`clusters[]` array**
replaces the five-category `breakdown`. Existing faculty scores **will move** — this is a different
framework, not a rescale.

---

## The files

### `HANDOFF.md` — start here
Breaking changes, step-by-step migration with time estimates, acceptance checklist, common mistakes,
and a copy-paste prompt for an AI agent.

### `CONTRACT.md` — the spec
Full API request/response shapes, the tier table, the scoring formula with worked examples, all 70
parameters with rubrics and verifiers, an example payload per parameter, and the list of parameters
that have no live data source yet.

### `fei1000.types.ts` — drop-in TypeScript
No imports, no dependencies, compiles standalone under `--strict`. Exports:

- `FeiTier` / `FeiTierDisplayName` — the six tiers as literal unions
- `FEI_TIER_BANDS` — thresholds and meanings
- `DashboardScoreResponse` / `ClusterBreakdown` — the `GET /score/{facultyId}` shape
- `FEI_CLUSTERS`, `FEI_TOTAL_POINTS`
- **`FeiAttributes`** — a fully-typed submission body per parameter. `FeiAttributes[20]` gives you
  `{ quartile?: 'Q1'|'Q2'|'Q3'|'Q4'; authorPosition?: 'FIRST'|'CORRESPONDING'|'CO'; citations?: number }`,
  so an enum typo is a build error rather than a silent zero score.

Copying this in and replacing the local response type is the fastest way to surface every break —
the compiler finds them.

### `fei1000.registry.json` — machine-readable
All 70 parameters with their rubrics (`rungs`), form fields (`inputs` with types, labels, enum
options, min/max), annual caps, multipliers, and a ready-made `exampleAttributes` for fixtures.
Generate the submission forms from this rather than hand-authoring 56 of them.

`rungs` is a serialised decision list — evaluate top-down, first match wins — so roughly 30 lines
gets you a live "this submission is worth N points" preview before the user submits.

### `ADMIN-WEIGHTING.md` — the tunable weighting
Dr. Budda asked for a system where the weighting of a cluster or an individual task can be changed
in future **without the total ceasing to be out of 1000**. That is built. This document covers the
three admin API routes, the effective-dating rule that freezes completed academic years, the audit
trail, and what an admin screen should look like. Only relevant if you are building that screen.

### `claude-skill/` — for their AI agent
Copy `claude-skill/fei1000-ui-alignment/` to `.claude/skills/fei1000-ui-alignment/` in the frontend
repo. Their agent then triggers automatically on prompts like *"align with the score engine"* or
*"update the tier badges"*, and walks the whole audit → fix cycle.

If they are not using Claude Code skills, `HANDOFF.md` §7 has an equivalent standalone prompt.

---

## Important

**`CONTRACT.md`, `fei1000.types.ts`, `fei1000.registry.json`, and `claude-skill/` are GENERATED**
from the live engine by `scripts/generate-fei-ui-contract.mjs` in the business-logic repo. They
cannot drift from the code that actually computes scores.

- Do not hand-edit them — the next regeneration silently overwrites the changes.
- Contract corrections, missing fields, ambiguities → send them to me and I will regenerate.
- If I send an updated pack, re-copy all four; regeneration is deterministic, so a diff shows exactly
  what moved.

---

## Status

- Engine: 645 tests / 51 suites green, 7-stack CDK synth green
- 56 of 70 parameters are scoreable today
- 14 have no upstream data source yet (Scopus, LMS, COE, placement, AI Companion) — these are marked
  `pendingSource` in the registry and **must be rendered greyed, not as a live `0`**

Questions → Bhanu.
