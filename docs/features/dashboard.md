# Dashboard

**Route:** `/`, `/dashboard` · **Source:** [`src/pages/dashboard/Dashboard.tsx`](../../src/pages/dashboard/Dashboard.tsx)

The platform's daily pulse. It aggregates the four demo data sets (companies, surveys, respondents, payouts) into KPIs, trend charts, an activity feed, and leaderboards — and acts as a launchpad into the detail pages.

## Layout

- **Header** — title + date-range selector with four presets: `7d`, `30d`, `this_month`, `last_month`.
- **Stats row (4 KPI cards)** — Active companies · Live surveys · Active respondents · Pending payouts. Each shows a value and a trend arrow; cards link to the relevant section.
- **Charts (recharts)** — two time series driven by the selected range:
  - **Response volume** across all surveys.
  - **Payout volume** released to respondents.
  Each carries a trend % vs. the previous period.
- **Platform activity feed** — up to 6 most-recent events blended across sources (company applied/approved, payout released, survey rejected, respondent warned), sorted by date desc, colour-coded by kind.
- **Leaderboards** — Top 5 companies by `totalSpentMnt`, Top 5 respondents by `earnedMnt`; rows link to detail pages.

## State & computed values

- `range` (`RangeKey`) selects which slice of `CHART_DATA` to show.
- KPIs are derived with `useMemo` from the demo arrays: approved vs pending companies, active surveys, active vs warned respondents, pending-payout count and summed amount (`status === 'Pending'`).
- Trend direction toggles colour (green ↑ / red ↓).

## Demo data

Chart series are hardcoded in `CHART_DATA: Record<RangeKey, RangeData>`:

```ts
type RangeKey = '7d' | '30d' | 'this_month' | 'last_month';
interface ChartPoint { name: string; value: number }
interface RangeData {
  response: ChartPoint[];
  payout: ChartPoint[];
  responseTrend: number;
  payoutTrend: number;
  subtitle: string;
}
```

KPIs and the activity feed/leaderboards are computed live from the same demo data the other pages use, so the dashboard stays consistent with the Companies / Respondents / Payouts / Surveys lists.

## Notes

- All figures are demo; nothing is fetched. Changing the range only swaps the hardcoded chart slice — KPIs don't re-scope to the period.
</content>
