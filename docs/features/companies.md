# Companies

**Routes:** `/companies` (list), `/companies/:id` (detail)
**Source:** [`Companies.tsx`](../../src/pages/companies/Companies.tsx) · [`CompanyDetail.tsx`](../../src/pages/company-detail/CompanyDetail.tsx) · [`company-data.ts`](../../src/pages/companies/company-data.ts)

Gatekeeping the buyer side of the marketplace: approve/reject new company applications, suspend/reinstate accounts, and inspect a company's spend, surveys, reports, and billing.

## Data model

```ts
type CompanyStatus = 'Pending' | 'Approved' | 'Suspended';
type CompanyPlan   = 'Starter' | 'Growth' | 'Enterprise';
type CompanyActivityKind =
  'joined' | 'approved' | 'survey-launched' | 'payout' | 'topup' | 'suspended';

type CompanyActivity = { kind: CompanyActivityKind; label: string; detail?: string; date: string };

type Company = {
  id; name; email; initial; status: CompanyStatus; plan: CompanyPlan;
  surveys: number; totalSpentMnt: number; joined: string;
  // detail-page fields:
  industry; teamSize; phone; website; address; contactPerson; contactRole;
  responses: number; creditsBalanceMnt: number; renewalDate: string;
  activity: CompanyActivity[];
};
```

`DEMO_COMPANIES` seeds 12 companies (`co-001`…`co-012`). `findCompanyById(id)` looks one up. Helper `formatMnt()` abbreviates tugrik (₮806K, ₮1.5M).

## List page (`/companies`)

**Layout:** header + Export CSV · 4 summary tiles (Total companies · Awaiting review · Active accounts · Total lifetime spend) · filter bar · table · pagination · confirm modal.

**Filters:** text search (name/email), Status (`All|Pending|Approved|Suspended`), Plan (`All|Starter|Growth|Enterprise`). Combined with AND; a Clear-all appears when any filter is active.

**Table columns:** Company · Status · Plan · Surveys · Total spent · Joined · Actions. Each row links to `/companies/:id` and shows an **open-reports badge** (via `countOpenReportsByCompanyId()`).

**Row actions (status-driven), confirmed via modal:**

| Status | Actions |
|---|---|
| Pending | Approve → Approved · Reject → Suspended |
| Approved | Suspend → Suspended |
| Suspended | Reinstate → Approved |

Plan/status badge colours are hardcoded (Enterprise orange, Growth blue, Starter grey; Pending amber, Approved green, Suspended red).

## Detail page (`/companies/:id`)

**Header:** avatar (initial), name, status + plan badges, industry tag, and the same status-driven action buttons as the list.

**Tabs:** Overview · Surveys (count) · Reports (count + open-count badge) · Billing.

- **Overview** — 4 KPI cards (Total surveys · Total spent · Total responses · Member since); company-details grid (contact, email, phone, website, industry, team size, address); [Admin notes](settings.md#admin-notes-widget) (seeded for suspended accounts); a plan-summary card (renewal date, "Manage billing"); and a recent **activity feed** (5 newest events).
- **Surveys** — table of this company's surveys (title, status, reward, response progress bar); rows link to `/surveys/:id`.
- **Reports** — issues filed against the company (status, severity, reason, respondent link, survey link, resolution outcome); "open" = status `New` or `Under review`.
- **Billing** — plan/renewal, credit balance, lifetime spend, and a **billing-history drawer** with an invoices table (download PDF) + a credit-transactions timeline.

**Billing-detail types (local to the page):**

```ts
type InvoiceStatus = 'Paid' | 'Upcoming' | 'Overdue';
type Invoice = { id; issueDate; periodLabel; amountMnt; status: InvoiceStatus; method };
type CreditTx = { kind: 'topup'|'deduction'|'bonus'|'refund'; label; detail; amountMnt; date };
```

Invoices are generated for 6 months at a plan-based monthly rate (Enterprise ₮1M / Growth ₮500K / Starter ₮100K); IDs are `INV-YYYY-MM-<companyIdSegment>`.

## Notes

- Status changes are optimistic local state — they reset on reload.
- The open-reports count is computed from the shared Reports demo data, keeping the badge consistent with the Reports page.
</content>
