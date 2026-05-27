# Domain Model

This is the conceptual core of iDap: the entities the admin moderates and the rules that govern rewards, quality, trust, and money. Platform rules are codified in [`src/shared/config/business.ts`](../src/shared/config/business.ts); entity shapes live in each page's co-located `*-data.ts`.

## Money & currency

All amounts are **Mongolian tugrik (MNT, ₮)**, stored as integers (whole tugrik) in `*Mnt` fields. UI helpers abbreviate for display (`₮500K`, `₮1.2M`) and a separate "exact" formatter shows full localized numbers where precision matters (e.g. payout confirmation).

## Platform business rules

From `business.ts`:

```ts
PLATFORM_FEE = { defaultPct: 4.0, minPct: 0, maxPct: 20, fallbackPct: 4.0 }
REWARD       = { minMnt: 0, maxMnt: 100_000, holdWindowHours: 24 }
WITHDRAWAL   = { minMnt: 10_000, gateways: ['qpay', 'bonum'] }
```

- **Platform fee** — companies pay an extra percentage on top of total respondent payouts. Default **4%**, configurable 0–20% in Settings → Policies. Used by the Survey Builder cost estimate: `fee = round(reward × maxResponses × pct/100)`.
- **Reward bounds** — a per-response reward is 0–100,000 ₮. `holdWindowHours: 24` is how long a medium-quality reward is held before release.
- **Withdrawal** — minimum withdrawal is 10,000 ₮. (Note: `gateways` here lists only `qpay`/`bonum`, while the Payouts screen and Settings actually use four gateways — see [conventions.md](conventions.md#known-inconsistencies).)

### Quality bands

Every response gets a **quality score 0–100**. `qualityBand(score)` maps it to an outcome:

| Score | Band | Meaning |
|---|---|---|
| ≥ 80 | `paid_instant` | reward paid immediately |
| ≥ 50 | `held_24h` | reward held for the 24h window |
| ≥ 20 | `invalidated` | response rejected, no reward |
| < 20 | `flagged` | flagged for fraud |

These cutoffs are **editable** in **Settings → Policies → Quality thresholds** (persisted via the `quality-thresholds` store, key `idap-quality-thresholds`); the four outcomes themselves are fixed.

### Reward multiplier

A respondent's **rolling average quality** scales their per-response reward. `rewardMultiplier(avgScore)`:

| Avg score | Multiplier |
|---|---|
| ≥ 90 | 1.2× |
| ≥ 85 | 1.1× |
| ≥ 80 | 1.0× |
| ≥ 75 | 0.9× |
| < 75 | 0.8× |

Applied in the [Response Detail Drawer](features/surveys.md#response-detail-drawer): `earned = round(baseReward × multiplier)`.

### Trust levels

`TRUST_LEVELS` — five tiers earned by **response volume** and **sustained average quality**. A survey sets a minimum trust level to gate who can take it. Thresholds + labels are **editable** in Settings → Policies → Trust levels (persisted via the `trust-levels` store).

| Level | Label | Min responses | Min avg quality |
|---|---|---|---|
| 1 | Newcomer | 0 | — |
| 2 | Verified | 3 | 75 |
| 3 | Trusted | 10 | 80 |
| 4 | Elite | 30 | 85 |
| 5 | Partner | 100 | 90 |

In respondent-facing data, trust is encoded as `'L1'`…`'L5'`; in surveys/profiles it's the numeric `1`…`5`.

## Entities

Each entity's authoritative TypeScript shape lives in its `*-data.ts`. Summaries below; field-level detail is in the per-feature docs.

### Company — `pages/companies/company-data.ts`

A buyer account. Lifecycle status drives the available admin actions.

```ts
type CompanyStatus = 'Pending' | 'Approved' | 'Suspended';
type CompanyPlan   = 'Starter' | 'Growth' | 'Enterprise';
```

Key fields: `id, name, email, initial, status, plan, surveys, totalSpentMnt, joined` plus detail fields `industry, teamSize, phone, website, address, contactPerson, contactRole, responses, creditsBalanceMnt, renewalDate, activity[]`. `activity` is a timeline of `CompanyActivity` events (`joined | approved | survey-launched | payout | topup | suspended`).

**Status lifecycle:**
```
Pending ──approve──▶ Approved ──suspend──▶ Suspended
   │                    ▲                       │
   └──reject──▶ Suspended└──────reinstate───────┘
```

### Respondent — `pages/respondents/respondent-data.ts`

A survey-taker account.

```ts
type RespondentStatus = 'Active' | 'Warned' | 'Suspended';
type TrustLevel       = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
type Gender           = 'Female' | 'Male' | 'Other';
type DevicePref       = 'Mobile' | 'Web' | 'Mixed';
```

Key fields: `id, name, email, initial, status, trustLevel, surveys, qualityScore, earnedMnt, lastActive, warnings` plus detail fields (`phone, age, gender, district, occupation, joined, devicePref, preferredPayout, avgCompletionMin, rejectedResponses`) and nested history: `recentSurveys[]` (`RespondentSurvey`), `recentPayouts[]` (`RespondentPayout`), `events[]` (`RespondentEvent`).

**Status lifecycle:**
```
Active ──warn──▶ Warned ──suspend──▶ Suspended ──reinstate──▶ Active
  └────────────suspend───────────────▲
```
`warn` increments `warnings`; `suspend`/`reinstate` flip status.

### Survey — `pages/surveys/survey-data.ts`

Content created by a company, moderated by admins.

```ts
type SurveyStatus   = 'Active' | 'Draft' | 'Paused' | 'Completed' | 'Rejected';
type SurveyCategory = 'Social' | 'Product' | 'Brand' | 'Other';
```

Key fields: `id, title, category, status, responsesCurrent, responsesTarget, rewardMnt, lengthMinutes, companyId, companyName, createdAt`, plus detail fields `description, endDate, trustLevel (1–5), anonymous, completionRate, avgQuality`.

**Status lifecycle (admin actions):**
```
Active ⇄ Paused        (pause / resume)
Active|Paused|Draft ──reject──▶ Rejected ──reinstate──▶ Active
Active ──(target met)──▶ Completed   (terminal; no admin action)
```
`Draft` is company-side pre-submission; `Completed` is terminal.

### Report — `pages/reports/report-data.ts`

A complaint filed by a respondent against a company.

```ts
type ReportStatus     = 'New' | 'Under review' | 'Resolved' | 'Dismissed';
type ReportSeverity   = 'Low' | 'Medium' | 'High';
type ReportReason     = 'Harassment' | 'Misleading survey' | 'Non-payment'
                      | 'Privacy violation' | 'Spam' | 'Other';
type ReportResolution = 'Dismissed' | 'Warned' | 'Suspended' | 'Escalated';
```

Links a `companyId`/`respondentId` (and optional `surveyId`) with `reason, severity, status, description, submittedAt` and, once closed, `resolvedAt, resolution`.

**Resolution workflow:**
```
New / Under review ──dismiss──▶ Dismissed (resolution: Dismissed)
                   ──warn─────▶ Resolved  (resolution: Warned)
                   ──suspend──▶ Resolved  (resolution: Suspended)  ← also suspends the company
```

### Payout — `pages/payouts/payout-data.ts`

A respondent withdrawal request that the admin releases.

```ts
type PayoutStatus  = 'Pending' | 'Processing' | 'Completed' | 'Failed';
type PayoutGateway = 'QPay' | 'Bonum' | 'Social Pay' | 'Bank Transfer';
```

Fields: `id, respondentId, respondentName, respondentEmail, initial, amountMnt, gateway, account, requestedAt, status`, plus an optional `lastAction` (`PayoutActionLog`: `action (Approved|Rejected|Retried), note?, actor, actorInitial, at`) forming an audit trail.

**Payout workflow:**
```
Pending ──approve──▶ Processing ──(gateway)──▶ Completed
   └─────reject────▶ Failed ──retry──▶ Processing
```

### Survey category — `shared/config/categories.ts` (Zustand, persisted)

Platform-wide config owned by the superadmin; companies only **consume** it in the builder.

```ts
interface SurveyCategory { id; name; description?; status: 'active'|'archived'; order: number }
```

Seeded with Social, Product, Brand, Market Research, Other. Managed in Settings → Categories; read by the Survey Builder via `useActiveCategories()`.

### Question types — `shared/config/question-types.ts` (Zustand, persisted)

An **enable/disable allowlist** over the builder's built-in question types (Single Choice, Multiple Choice, Short Text, Long Text, Rating). Types are code, so the superadmin curates which are available rather than creating new ones; at least one must stay enabled. Managed in Settings → Question types; the Survey Builder offers only enabled types via `useEnabledQuestionTypeKeys()`.

### Admin note — `widgets/admin-notes/AdminNotes.tsx`

Internal, team-only annotations attached to a record (survey, company, report, respondent).

```ts
type AdminNote = { id; author; authorInitial; content; createdAt }
```

Composer + reverse-chronological list, seeded per-record. Notes are local state only (not persisted).
</content>
