# Payouts

**Route:** `/payouts`
**Source:** [`Payouts.tsx`](../../src/pages/payouts/Payouts.tsx) · [`payout-data.ts`](../../src/pages/payouts/payout-data.ts)

Money out. Admins review respondent withdrawal requests across gateways and release, reject, or retry them — individually or in bulk — with an action audit trail.

## Data model

```ts
type PayoutStatus  = 'Pending' | 'Processing' | 'Completed' | 'Failed';
type PayoutGateway = 'QPay' | 'Bonum' | 'Social Pay' | 'Bank Transfer';

type PayoutActionLog = {
  action: 'Approved' | 'Rejected' | 'Retried';
  note?; actor; actorInitial; at;
};

type Payout = {
  id; respondentId; respondentName; respondentEmail; initial;
  amountMnt; gateway: PayoutGateway; account; requestedAt;
  status: PayoutStatus; lastAction?: PayoutActionLog;
};
```

`DEMO_PAYOUTS` seeds 16 payouts (`po-001`…`po-016`); amounts 10,000–120,000 ₮.

## Layout

- **Header** — "Payout Management" + Export CSV.
- **4 summary tiles** — Pending requests (count + amount) · Pending amount · Released today · Today's volume.
- **Filter bar** — search (respondent/email/account), Date range (presets + custom), Gateway, Status, Clear.
- **Bulk action bar** — appears when ≥1 pending row is selected; shows count + "Approve selected" / "Reject selected".
- **Table** — checkbox (pending only) · Respondent · Amount · Gateway · Account · Requested · Status · Actions.
- **Confirm modal** — approve/reject/retry, with amount summary (and bulk total), an optional internal note textarea, and confirm/cancel.

## Workflow & actions

| Row status | Action → result |
|---|---|
| Pending | Approve → Processing · Reject → Failed |
| Failed | Retry → Processing |
| Processing / Completed | none (shown as "—") |

Each action writes a `PayoutActionLog` (`action`, optional `note`, `actor`, timestamp). The actor is currently hardcoded as **Hein Htet**. The Status cell shows a hover tooltip with the last action's actor/time/note.

**Selection** is limited to `Pending` rows (header checkbox selects all pending in view); the bulk bar appears once `selected.size > 0`.

**Formatters:** `formatMnt()` abbreviates (₮50K, ₮1M); `formatMntExact()` shows the full localized amount (used in the confirm modal).

## Notes

- All transitions are local state and reset on reload; gateway processing (Processing → Completed) is not simulated automatically.
- Gateways here are four (`QPay | Bonum | Social Pay | Bank Transfer`), broader than `WITHDRAWAL.gateways` in `business.ts` (`qpay | bonum`). See [conventions.md](../conventions.md#known-inconsistencies).
- The platform fee is not deducted from displayed payout amounts; respondents are shown the full requested amount.
</content>
