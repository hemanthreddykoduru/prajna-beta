# FEI-1000 — Update for the UI team, 2026-08-07

**From:** Komma Bhanu Teja — Business Logic Layer Lead
**Re:** Changes since the handoff pack you received

**Read this if you have already started on the FEI-1000 migration.** If you have not opened
[HANDOFF.md](HANDOFF.md) yet, skip this file — the pack already includes everything below.

---

## TL;DR

| # | Change | Impact on you |
|---|---|---|
| 1 | **One new field** on `GET /score/{facultyId}`: `scoringConfigVersion` | Additive. Nothing breaks. Worth rendering — see §1. |
| 2 | Cluster `maxPoints` can now **differ per campus/department** | You were already told not to hardcode them. This is why. |
| 3 | Weighting changes are now blocked mid-year by default | No UI impact. Context in §3. |
| 4 | A **contribution ledger** now exists behind the score | Unlocks a "why is my score X?" screen. Not built — see §4. |

**Nothing in this update is breaking.** The four breaking changes in `HANDOFF.md` §1 are still the
four breaking changes. Re-copy the three generated files and carry on.

---

## 1. New field: `scoringConfigVersion`

```jsonc
{
  "facultyId": "abc-123",
  "totalScore": 842.5,
  "tier": "Platinum",
  // …
  "scoringConfigVersion": 7    // ← new. null = scored on the published defaults.
}
```

**Why it exists.** An administrator can now re-weight the framework — make Research count for more,
change what an assignment submission is worth — without a deploy. That means a faculty member's score
can move for a reason that has nothing to do with their own work.

Without this field, a score going from 780 → 810 is indistinguishable from the faculty member simply
doing more. With it, you can tell them the truth.

**What to do with it:** if the version differs from the previous render, say so:

> *"The scoring weighting was updated (v7). Your score reflects the new weighting."*

That one line will prevent a meaningful number of support tickets. It is optional, but it is the
whole reason the field exists.

`null` means the published FEI-1000 framework — which is what every faculty member will show until an
administrator publishes a weighting, so treat `null` as the normal case and render nothing.

Already in the regenerated `fei1000.types.ts`.

---

## 2. Cluster ceilings can now vary by campus and department

`HANDOFF.md` §2 already told you: *do not put the nine cluster bars on a shared y-axis, chart
`score / maxPoints`, and read `maxPoints` from the response.*

That guidance is now load-bearing rather than merely tidy. A weighting can be published at three
levels — university-wide, per campus, or per department — and the engine resolves most-specific-first.

A Management professor will essentially never file a patent or publish in an SCI journal, so Cluster 3
(Research) and Cluster 4 (Innovation & IP) are 280 points that are structurally harder for them than
for an Engineering professor. Per-school weighting is how that gets addressed.

**Concretely:** two faculty members in the same campus, in different departments, can legitimately
return **different `maxPoints` for the same cluster id**. The nine bars are per-faculty, not global.

The total is always 1000 — the engine renormalises so it cannot be otherwise.

**Only the university-wide level is in use today.** Nothing you can observe right now will vary. But
if the chart caches ceilings globally, or derives them from a constant instead of the response, it
will silently render wrong numbers the day someone publishes a departmental weighting. Read them from
`clusters[].maxPoints`, per response.

---

## 3. Weighting changes are blocked mid-year by default

Publishing a new weighting now takes effect from the **next academic year**. Changing it during a year
in progress requires an explicit `allowMidYearChange: true`, and that flag is recorded permanently in
the audit trail.

Reason: a mid-year change moves live scores under faculty who had no chance to respond to it.

**No UI impact** unless you are building the admin screen, in which case
[ADMIN-WEIGHTING.md](ADMIN-WEIGHTING.md) covers it — you will get a `400` with a plain-English
explanation if you try to publish into the current year without the flag.

---

## 4. There is now a contribution ledger

Every scored submission now writes an audit record alongside the score:

```jsonc
{
  "parameterId": 20,
  "parameterName": "SCI / SCIE / WoS journal paper",
  "attributes": { "quartile": "Q1", "authorPosition": "FIRST", "citations": 40 },
  "rungMatched": "Q1",
  "basePoints": 30,
  "qualityFactor": 1.5,
  "impactFactor": 1.2,
  "pointsAwarded": 54,
  "notes": ["Rubric \"Q1\" → 30 pts", "Quality ×1.5 …", "Impact ×1.2 …"]
}
```

Previously the engine stored only the running total per parameter — *"parameter 20 earned 54 points"* —
and discarded what the submission actually was. So *"why is my score 842?"* was unanswerable.

**There is no endpoint for this yet, and no work for you right now.** I am flagging it because it
makes a genuinely useful screen possible:

- An itemised score breakdown: every submission, what it was worth, and why
- The `notes` array is already human-readable and can be rendered verbatim
- A basis for appeals — *"my paper was scored Q2, it's actually Q1"* is now checkable

**If you want that screen, say so and I will add the endpoint.** It is a small piece of work now that
the data is being captured. I built the capture first because attributes that were never written down
cannot be recovered later — every day without it was a day of unrecoverable history.

---

## What to re-copy

Re-copy all four generated files from this folder — regeneration is deterministic, so a diff shows
exactly what moved:

- `fei1000.types.ts` ← has `scoringConfigVersion`
- `fei1000.registry.json`
- `CONTRACT.md`
- `claude-skill/fei1000-ui-alignment/SKILL.md`

`HANDOFF.md` is unchanged and still correct.

---

## Status

- 698 tests / 53 suites green, 7-stack CDK synth green
- No breaking changes in this update
- Questions → Bhanu
