# Reports

**Route:** `/reports` (accepts `?companyId=` to scope to one company)
**Source:** [`Reports.tsx`](../../src/pages/reports/Reports.tsx) · [`report-data.ts`](../../src/pages/reports/report-data.ts)

Abuse triage. Reports are complaints filed by respondents against companies; admins investigate and resolve them by **dismiss / warn / suspend**.

## Data model

```ts
type ReportStatus     = 'New' | 'Under review' | 'Resolved' | 'Dismissed';
type ReportSeverity   = 'Low' | 'Medium' | 'High';
type ReportReason     = 'Harassment' | 'Misleading survey' | 'Non-payment'
                      | 'Privacy violation' | 'Spam' | 'Other';
type ReportResolution = 'Dismissed' | 'Warned' | 'Suspended' | 'Escalated';

type Report = {
  id; companyId; companyName; companyInitial;
  respondentId; respondentName; respondentInitial;
  surveyId?; surveyTitle?;
  reason: ReportReason; severity: ReportSeverity; status: ReportStatus;
  description; submittedAt; resolvedAt?; resolution?: ReportResolution;
};
```

`DEMO_REPORTS` seeds 10 reports (`rp-001`…`rp-010`). Helper `countOpenReportsByCompanyId()` (open = `New` or `Under review`) is used by the Companies list/detail badges.

## Layout

- **Header** — title + Export CSV.
- **Company scope chip** — when `?companyId=` is set, an orange banner shows the scoped company (link to its detail page) with a clear button.
- **4 summary tiles** — New · Under review · High-severity open · Resolved.
- **Filter bar** — search (company/respondent/description), Reason, Severity, Status, Clear.
- **Table** — Reported company · Respondent · Reason · Severity · Submitted · Status · Actions.
- **Report detail drawer** — opens on row click; full report text, [Admin notes](settings.md#admin-notes-widget) (seeded for `rp-003`, `rp-007`), and action buttons when status is `New`/`Under review`.
- **Confirm modal** — for warn/suspend/dismiss, with tone variants.

## Resolution workflow

From `New` / `Under review`:

| Action | Effect |
|---|---|
| **Dismiss** | status → `Dismissed`, resolution → `Dismissed` (no action against company) |
| **Warn** | status → `Resolved`, resolution → `Warned` (formal warning, account stays active) |
| **Suspend** | status → `Resolved`, resolution → `Suspended` (company loses access; active surveys pause) |

Once `Resolved`/`Dismissed`, the drawer shows the final outcome instead of action buttons.

**Severity** drives prioritisation: the "High-severity open" tile counts `High` reports still in `New`/`Under review`, and feeds the dashboard. Status, severity, and reason each have their own hardcoded badge colours.

## Notes

- Resolutions are local state; they reset on reload.
- `Escalated` exists in the `ReportResolution` type but isn't produced by any current action.
</content>
