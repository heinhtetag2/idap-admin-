# Surveys

**Routes:** `/surveys` (list), `/surveys/new` (builder), `/surveys/:id` (detail)
**Source:** [`Surveys.tsx`](../../src/pages/surveys/Surveys.tsx) · [`SurveyBuilder.tsx`](../../src/pages/survey-builder/SurveyBuilder.tsx) · [`SurveyDetail.tsx`](../../src/pages/survey-detail/SurveyDetail.tsx) · [`survey-data.ts`](../../src/pages/surveys/survey-data.ts) · [`mock-questions.ts`](../../src/shared/lib/mock-questions.ts) · [`ResponseDetailDrawer.tsx`](../../src/widgets/response-detail-drawer/ResponseDetailDrawer.tsx)

Content moderation plus per-survey analytics. The largest feature area: a moderation list, a full drag-and-drop builder, and a detail page with response-level quality inspection.

## Data model

```ts
type SurveyStatus   = 'Active' | 'Draft' | 'Paused' | 'Completed' | 'Rejected';
type SurveyCategory = 'Social' | 'Product' | 'Brand' | 'Other';

interface Survey {
  id; title; category: SurveyCategory; status: SurveyStatus;
  responsesCurrent; responsesTarget; rewardMnt; lengthMinutes; endsLabel;
  createdAt; companyId; companyName;
  // detail fields:
  description; endDate; trustLevel: 1|2|3|4|5; anonymous: boolean;
  completionRate; avgQuality; createdLabel;
}
```

`DEMO_SURVEYS` seeds 18 surveys (`SUR-001`…`SUR-018`) across all five statuses and 12 companies. `avgQuality` is a 0–5 rating. `findSurveyById(id)` looks one up.

## List page — moderation (`/surveys`)

**Layout:** header + Export CSV · 4 summary tiles (Active · Total responses · Reward paid · Awaiting review/Drafts) · filter bar · table · pagination · confirm modal.

**Filters:** search (title/company), Date range (7d/30d/90d/12m presets + custom, on `createdAt`), Category, Status.

**Table columns:** Survey (title + category badge) · Company (link) · Status (badge + icon) · Responses (progress bar `current/target`) · Reward · Trust req. (`Level X+`) · Created · Actions.

**Status styling** (`getStatusStyles`): Active = green/CheckCircle2 · Draft = grey/Clock · Paused = amber/Pause · Completed = blue/CheckCircle · Rejected = red/Ban.

**Row actions (status-driven), confirmed via modal:**

| Condition | Action → result |
|---|---|
| status = Active | Pause → Paused |
| status = Paused | Resume → Active |
| status ∉ {Rejected, Completed} | Reject → Rejected |
| status = Rejected | Reinstate → Active |

Each confirm modal has a title/description/CTA/tone (e.g. Reject is `tone: 'danger'`, removes from respondent feeds).

## Survey Builder (`/surveys/new`)

A two-column composer. Opening with `location.state` prefill puts it in **edit** mode; otherwise it's a new survey.

**Left column — settings:**
- *Survey settings:* Title, Description, Category (dropdown from [`useActiveCategories()`](settings.md#categories)).
- *Reward & limits:* Reward (₮), Max responses, Est. minutes, **Min trust level** (1–5), End date (calendar), Anonymous checkbox.
- *Estimated cost:* respondent payouts + platform fee + total.
- *Campaign health:* eligible pool, velocity, fill-time estimate.

**Right column — questions:** drag-and-drop reorderable cards (@dnd-kit, pointer + keyboard sensors), each with text, type, options (for choice types), required toggle, move up/down, delete (min 1 question). "Add question" appends a blank.

**Question types:**
```ts
type QuestionType = 'single_choice' | 'multiple_choice' | 'short_text' | 'long_text' | 'rating';
interface Question { id; text; type: QuestionType; options: string[]; required: boolean }
```

**Builder business logic:**
- **Reward fairness** — `perMinute = reward / estMinutes`: ≥150 "Generous", ≥100 "~ Fair", else "Low".
- **Cost** — `payout = reward × maxResponses`; `fee = round(payout × PLATFORM_FEE.defaultPct / 100)`; `total = payout + fee`.
- **Campaign health** — eligible pool by trust level `{1:8500, 2:5200, 3:3100, 4:1400, 5:420}`; `velocity ≈ pool × 1.2%/day`; `estDays = ceil(maxResponses / velocity)`; compares against days remaining to `endDate` to show a green/red buffer.

**Question templates** — [`mockQuestionsFor(category)`](../../src/shared/lib/mock-questions.ts) returns 4–5 starter `BuilderQuestion`s tailored per category (Social / Product / Brand / Market Research / Other), used to prefill the builder.

## Survey Detail (`/surveys/:id`)

**Header:** breadcrumb, title, status badge, company link, category, trust level, question count, duration, and pause/resume/reject/reinstate actions (a reduced lifecycle: `DetailStatus = 'Active' | 'Paused' | 'Rejected'`).

**Tabs:** Overview · Responses (count).

**Overview:** 4 KPI cards (Responses `X/Y` · Completion rate % · Avg quality 0–5 · Budget spent ₮) · response-progress bar · details grid (reward, trust, anonymous, dates) · **question summary** (expandable per-question aggregation) · recent responses (first 6) · [Admin notes](settings.md#admin-notes-widget) (seeded by status).

**Responses tab:** filters (search by respondent, Quality tier, Reward status) · response table (Respondent · Quality · Reward status · Submitted) · pagination (page size 10) · Export CSV. Clicking a row opens the Response Detail Drawer.

**Response/quality types:**
```ts
type QualityTier  = 'High' | 'Medium' | 'Low';
type RewardStatus = 'Earned' | 'Pending' | 'Invalidated';
interface Response { id; respondent; quality: QualityTier; rewardStatus: RewardStatus; submittedLabel; answers: Record<string,string> }
```

**Detail business logic:**
- Quality tier → score: High = 83, Medium = 62, Low = 28; → reward status: High = Earned, Medium = Pending, Low = Invalidated.
- `multiplierFor(score)` mirrors [`rewardMultiplier`](../domain-model.md#reward-multiplier) (0.8×–1.2×).
- Two CSV exporters: a **summary CSV** (per question: distributions & percentages) and a **responses CSV** (per respondent: all answers).
- Demo responses are synthesized deterministically from a 10-item rotating `pattern` per question.

## Response Detail Drawer

**Source:** [`widgets/response-detail-drawer/ResponseDetailDrawer.tsx`](../../src/widgets/response-detail-drawer/ResponseDetailDrawer.tsx). A reusable right-side sheet used by Survey Detail and Respondent Detail.

Shows: **respondent profile** (trust level + label, tenure, demographics, region, education, employment, income band, surveys completed, avg quality; optional "Anonymized" badge), **quality score** (0–100 bar + Time taken / Multiplier / Reward tiles), **quality factors** (5 fixed checks: response speed, straight-lining, attention check, position bias, tab visibility — all passing in demo), and a collapsible **answers** list (per-question answer + time).

```ts
interface ResponseDetailDrawerProps {
  open; onClose; respondentName; respondentSeed; responseIndex;
  qualityTier: QualityTier; anonymized?; baseReward?; answers?; openSurveyHref?;
}
```

The profile and answers are **deterministically generated** from `respondentSeed` + `responseIndex` (not stored). Default `baseReward = 5000`; `earned = round(baseReward × multiplier)`. Score-bar colour: ≥80 green, 50–79 amber, <50 red.

## Notes

- `SurveyCategory` is defined **twice** with different members — the survey union (`Social | Product | Brand | Other`) vs. the Settings/builder store (which adds *Market Research*). See [conventions.md](../conventions.md#known-inconsistencies).
- Quality-tier scores in Survey Detail (High 83 / Medium 62 / Low 28) are illustrative and don't map exactly onto the `qualityBand` cut-offs (80/50/20) in `business.ts`.
</content>
