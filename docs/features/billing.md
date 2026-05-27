# Billing

**Route:** `/billing`
**Source:** [`Billing.tsx`](../../src/pages/billing/Billing.tsx)

A credits & subscription surface (company-facing in nature, exposed within the admin shell). Shows available credits, top-up packages, the current plan, and a billing-activity history with invoice detail.

## Layout

- **Header** — "Billing & Credits".
- **Hero card** — dark gradient card showing Available Credits (demo ₮450,000) and a plan badge ("Growth plan").
- **Top up credits** — a grid of 4 selectable packages + a payment-method selector (QPay / Social Pay / Bank Transfer) + a purchase CTA.
- **Your plan** — plan name, renewal date, 6-feature checklist, "Upgrade plan".
- **Billing activity** — table (Date · Description · Status · Amount) mixing subscription invoices and credit top-ups, newest first; rows open the invoice drawer.
- **Invoice detail drawer** — status badge, meta grid (due date, status, invoice #, method), monthly cost breakdown (subscription + credits + top-ups), subtotal / VAT / total, and a Download button (disabled for `Upcoming`).

## Data model (local)

```ts
type PackageId = 'starter' | 'popular' | 'growth' | 'enterprise';
type PaymentId = 'qpay' | 'social' | 'bank';
interface Pkg { id: PackageId; name; amount; bonus?; badge? }

type InvoiceStatus = 'Paid' | 'Upcoming' | 'Overdue';
interface Invoice {
  id; dueDate; issueDate; description; status: InvoiceStatus;
  total: number | null; paymentMethod; periodStart; periodEnd;
}

type ActivityKind = 'subscription' | 'topup';
interface Activity { id; kind: ActivityKind; date; label; status: InvoiceStatus; amount: number|null; method; invoice: Invoice }
```

**Seed values:** packages Starter ₮100K · Popular ₮500K (Most Popular) · Growth ₮1M (+15% bonus) · Enterprise ₮5M (+20% bonus). Monthly subscription ₮500K including 5,000 response credits. `INVOICES` covers Jan–May 2026 (May = Upcoming). Renewal date is computed as **today + 23 days**.

## State

- One selected package and one selected payment method at a time (QPay default).
- Invoice drawer opens from any activity row.

## Notes

- Entirely demo/UI — selecting a package and purchasing does nothing; "Upgrade plan" is not wired.
- This differs from the Companies → Billing tab, which builds invoices per-company from plan tier; the two billing surfaces are separate implementations.
</content>
