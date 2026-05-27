# Respondents

**Routes:** `/respondents` (list), `/respondents/:id` (detail)
**Source:** [`Respondents.tsx`](../../src/pages/respondents/Respondents.tsx) · [`RespondentDetail.tsx`](../../src/pages/respondent-detail/RespondentDetail.tsx) · [`respondent-data.ts`](../../src/pages/respondents/respondent-data.ts)

Managing the survey-taker side: monitor quality and trust, issue warnings, suspend bad actors, and inspect participation, payouts, and activity history.

## Data model

```ts
type RespondentStatus = 'Active' | 'Warned' | 'Suspended';
type TrustLevel       = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
type Gender           = 'Female' | 'Male' | 'Other';
type DevicePref       = 'Mobile' | 'Web' | 'Mixed';

type RespondentSurvey = { id; title; company; completedAt; rewardMnt; qualityScore; status: 'Accepted'|'Rejected' };
type RespondentPayout = { id; amountMnt; method: 'QPay'|'Bank Transfer'|'Social Pay'; status: 'Paid'|'Pending'|'Failed'; date };
type RespondentEvent  = { kind: 'joined'|'survey'|'payout'|'warning'|'suspended'|'milestone'; label; detail?; date };

type Respondent = {
  id; name; email; initial; status: RespondentStatus; trustLevel: TrustLevel;
  surveys: number; qualityScore: number; earnedMnt: number; lastActive; warnings: number;
  // detail fields:
  phone; age; gender: Gender; district; occupation; joined; devicePref: DevicePref;
  preferredPayout; avgCompletionMin; rejectedResponses;
  recentSurveys: RespondentSurvey[]; recentPayouts: RespondentPayout[]; events: RespondentEvent[];
};
```

`DEMO_RESPONDENTS` seeds 20 respondents (`rs-001`…`rs-020`). Note `qualityScore` here is a **0–100 percentage** (distinct from the survey `avgQuality`, which is a 0–5 rating).

## List page (`/respondents`)

**Layout:** header + Export CSV · 4 summary tiles (Total · Active accounts · Avg quality score · Total earnings) · filter bar · table · pagination · confirm modal.

**Filters:** search (name/email), Trust level (`All|L1…L5`), Earnings range (`under-100k | 100k-300k | 300k-500k | over-500k`, via `EARN_RANGES`), Status (`All|Active|Warned|Suspended`).

**Table columns:** User · Trust · Surveys · Quality score · Earned · Last active · Warnings · Status · Actions.
- **Trust** renders as a 5-dot meter coloured per level (L1 red → L5 green).
- **Quality score** is a progress bar: ≥80 green, ≥60 amber, <60 red.
- **Warnings** are red when > 0.

**Row actions (status-driven), confirmed via modal:**

| Status | Actions |
|---|---|
| Active / Warned | Warn (→ Warned, `warnings += 1`) · Suspend (→ Suspended) |
| Suspended | Reinstate (→ Active) |

## Detail page (`/respondents/:id`)

**Header:** avatar, name, status badge, trust meter, email, and status-driven actions (Warn/Suspend or Reinstate).

**Tabs:** Overview · Surveys (count) · Payouts.

- **Overview** — 4 KPI cards (Surveys completed · Quality score · Total earned · Member since); profile grid (email, phone, age/gender, location, occupation, device pref, payout method, avg completion); [Admin notes](settings.md#admin-notes-widget) (seeded for warned respondents); a **trust & quality** card (trust meter, quality bar, warnings, rejected responses); and a recent **activity** card with a "View all N events" → activity drawer.
- **Surveys** — table of completed surveys (title, company, quality bar, reward, completed date, Accepted/Rejected badge). Clicking a row opens the [Response Detail Drawer](surveys.md#response-detail-drawer) with the response's quality tier and reward.
- **Payouts** — table of payouts (ID, method, date, amount, Paid/Pending/Failed); preferred-method badge in the header.

**Activity drawer** — full timeline with a search box, filter pills (All · Surveys · Payouts · Warnings · Milestones · Suspensions · Account) and date buckets (Today · Yesterday · This week · This month · Earlier). Event icons are colour-coded by `kind`.

## Notes

- Trust level here is the string form `L1`…`L5`; the numeric `1`…`5` form appears on surveys and in generated profiles. The thresholds behind both are in [domain-model.md](../domain-model.md#trust-levels).
- All actions and notes are local state; they reset on reload.
</content>
