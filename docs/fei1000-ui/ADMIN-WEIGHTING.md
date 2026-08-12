# FEI-1000 — Changing the Weighting

**For:** Dr. Kishore Budda, and whoever builds the admin screen
**Status:** Implemented and tested. No deploy needed to change a weighting.

---

## What you asked for

> *"I want a system where, in future, if I want to change the grade or weightage of a task — an
> assignment submission, a research paper — I can do that, and the total score is still normalised
> to 1000."*

That is what this is. Two levels of change are possible, and **the total is always exactly 1000** —
not by convention, but because the system recomputes the ceilings so they add up.

---

## The two things you can change

### 1. Cluster weights — "Research should count for more"

Give the nine clusters any relative numbers you like. **They do not have to add up to anything.**
The system normalises them.

Say Research should go from 20% to 30%:

```jsonc
{
  "effectiveFromAcademicYear": "2027-28",
  "clusterWeights": { "3": 300 },
  "note": "Raising research emphasis for the NIRF cycle"
}
```

You named one cluster. The other eight keep their **relative proportions to each other** and shrink
to make room — Teaching stays 1.6× Student Success, exactly as it is today. The nine new ceilings
sum to 1000.

### 2. Parameter points — "An assignment submission is worth 30, not 20"

```jsonc
{
  "effectiveFromAcademicYear": "2027-28",
  "parameterMaxPoints": { "8": 40, "20": 45 },
  "note": "Course files and WoS papers were under-weighted"
}
```

The parameter's whole rubric **scales proportionally**. If WoS papers go from 30 to 45, then
`Q1=30 · Q2=22 · Q3=15 · Q4=8` becomes `Q1=45 · Q2=33 · Q3=22.5 · Q4=12` — the shape of your rubric
is preserved, only its magnitude changes. You do not have to re-author four numbers and risk making
them internally inconsistent.

This can never change the grand total, because the cluster ceiling still clamps the cluster.

---

## Why the total is guaranteed

The score is computed as:

```
clusterScore = min( sum of parameter points in that cluster , clusterCeiling )
totalScore   = sum of the nine clusterScores
```

Since the nine ceilings are normalised to sum to exactly 1000, `totalScore ≤ 1000` **cannot** be
violated by any weighting you enter. It is arithmetic, not a rule someone has to remember to follow.

The normalisation uses the largest-remainder method, so the ceilings are whole numbers that sum to
1000 exactly — not 999 or 1001. There is a test that runs 500 random weightings and asserts the
total every time.

---

## Past years are frozen

A weighting is **effective-dated** to an academic year and applies from that year onward.

- Publish a change for `2027-28`, and 2027-28 onward uses it.
- **2026-27 keeps whatever it was scored under.** Faculty already ranked in a completed year cannot
  have their scores or tiers moved underneath them, and year-on-year trend comparisons stay honest.
- The system **refuses to backdate** into a completed year and tells you why.

Publishing for the *current* year is allowed — the year is still in progress.

---

## Every change is audited

Each published weighting is stored permanently with:

- **who** changed it (Cognito identity, from the auth token)
- **when**
- **why** — a rationale of at least 10 characters is **required**; the request is rejected without one
- a monotonic version number

Nothing is ever overwritten. `GET /scoring-config` returns the full history. This is the NAAC/NBA
evidence trail for how the framework's weighting has evolved.

---

## Preview before you publish

Because normalisation means **raising one cluster silently lowers the other eight**, you can dry-run
any change:

```
POST /scoring-config/preview
```

Same body, nothing stored. You get back the before/after ceiling for all nine clusters, the delta,
the new weight percentages, and every parameter whose points would change.

The system also warns you about changes that are legal but probably not what you meant:

- *"Cluster 9 has a ceiling of 270 but its parameters can only award 55 points, so no faculty member
  can fill it."*
- *"Cluster 9 is switched off — it will award no points and its share has been redistributed."*

Warnings do not block the change. Errors do.

---

## The API

All three routes are restricted to **ADMIN and IQAC** roles. Re-weighting moves every faculty
member's score for the year, so it is not a self-service faculty operation.

| Method | Route | Does |
|---|---|---|
| `GET` | `/scoring-config` | Current weighting in force + full publication history |
| `POST` | `/scoring-config/preview` | Validate and show the effect. Stores nothing. |
| `PUT` | `/scoring-config` | Publish |

### `PUT` request

```jsonc
{
  "effectiveFromAcademicYear": "2027-28",   // required, cannot be in the past
  "note": "Raising research emphasis for the NIRF cycle",  // required, ≥10 chars
  "clusterWeights":     { "3": 300, "1": 200 },   // optional, any scale
  "parameterMaxPoints": { "20": 45 }              // optional
}
```

Omit `clusterWeights` to change only parameter points, or vice versa. Omitted clusters and
parameters keep their current values — you never have to restate the whole framework.

### Responses

| Code | Meaning |
|---|---|
| `200` | Published (or previewed). Body includes the full before/after. |
| `400` | Rejected. `issues[]` lists **every** problem at once, each with the field and a plain-English reason. |
| `403` | Not an ADMIN/IQAC role. |
| `409` | Someone else published while you were preparing. Re-read and retry — nobody's change is silently lost. |

---

## What this deliberately does *not* let you change

**The rubric rungs themselves** — the `Q1=30 · Q2=22` bands, the score thresholds, the quality and
impact multipliers.

Not an oversight. Changing a rung retroactively would require re-evaluating past submissions against
their original evidence, and the score record stores accumulated points, not each submission's
underlying details. Supporting it needs a per-submission ledger, which is a schema change (tracked as
**B-082**).

Cluster weights and parameter points need no ledger — both are pure re-aggregation of data already
stored — which is precisely why they are the two levels offered. If you need rung-level editing, say
so and I will scope the ledger.

Changing a rung today is still possible; it is a one-line edit to the registry plus a deploy, which
is a change I make rather than one you make yourself.

---

## For whoever builds the admin screen

- Nine sliders or number inputs for cluster weights. **Do not make the user balance them to 100** —
  that is the whole point of normalisation. Show the resulting percentage live from the preview
  endpoint.
- A searchable parameter list with an editable points field, filtered by cluster.
- Call `POST /scoring-config/preview` on every change and render the before/after table it returns.
  Users should see "Research 200 → 300, Teaching 240 → 210" before they commit.
- Surface `issues[]` inline. Warnings are yellow and non-blocking; errors are red and block submit.
- Show the history from `GET /scoring-config` — who, when, why — on the same screen.
- Handle `409` by re-fetching and asking the user to re-apply, not by force-writing.
