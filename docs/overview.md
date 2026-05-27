# Product Overview

## What is iDap?

**iDap** ("Intelligent Data Analytics Platform") is a paid-survey marketplace. The model has two sides:

- **Companies** buy survey credits, build surveys, target an audience, and collect quality-scored responses.
- **Respondents** browse a feed of surveys, answer them, and get paid a per-response **reward** (in Mongolian tugrik, ₮) into a wallet they can withdraw.

The platform's value is **quality control**: each response is scored, low-quality answers are invalidated or held, and respondents accumulate a **trust level** that gates which surveys they can take and multiplies their reward.

## The four portals

iDap is designed as four separate front-ends (see the path namespaces in [`src/shared/config/routes.ts`](../src/shared/config/routes.ts)):

| Portal | Audience | Purpose |
|---|---|---|
| **Client** | Companies | Create/manage surveys, analytics, billing |
| **Respondent** | Survey takers | Survey feed, player, wallet, payout history |
| **Admin** | iDap staff | Moderate everything, release payouts, set policy |
| **Marketing** | Public | Landing/about |

**This repository is the Admin portal** (and only the Admin portal). The other three are referenced in route constants but not implemented here.

## Who uses this console

A single role hierarchy operates the admin console (see [Settings → Admins & Roles](features/settings.md#admins--roles)):

- **Super admin** — full access, including platform policy and categories. The signed-in demo user (*Hein Htet*) is a Super admin.
- **Moderator** — review companies/surveys/respondents, action reports and payouts.
- **Read-only** — view dashboards and records, no actions.

## What an admin does here

The console is organised by the sidebar into functional groups. Each maps to a lifecycle the admin shepherds:

1. **Dashboard** — daily pulse: pending payouts, live surveys, applications awaiting review, response & payout volume trends, top companies/respondents.
2. **Companies** — gatekeeping the supply of buyers: approve/reject new company applications, suspend/reinstate accounts, inspect spend, surveys, reports, and billing.
3. **Respondents** — managing the supply of survey-takers: monitor quality and trust, issue warnings, suspend bad actors, inspect participation and earnings history.
4. **Surveys** — content moderation: pause/resume/reject/reinstate surveys submitted by companies; drill into per-survey response quality and aggregate results.
5. **Reports** — abuse triage: respondent-filed complaints against companies (harassment, non-payment, privacy, spam…), resolved by dismiss / warn / suspend.
6. **Payouts** — money out: review respondent withdrawal requests across gateways (QPay, Bonum, Social Pay, Bank Transfer), approve/reject/retry, individually or in bulk, with an action audit trail.
7. **Billing** — credits & subscription view (top-up packages, plan, invoices) — largely a company-facing surface surfaced in the admin shell.
8. **Settings** — platform configuration: fees, reward limits, quality thresholds, trust levels, withdrawal gateways, **survey categories** (the list companies pick from), admin team & roles, notifications, sessions.
9. **Help** — internal help center: searchable playbooks and articles for the moderation team.

## Cross-cutting concepts

These appear across many screens; the full rules live in [domain-model.md](domain-model.md):

- **Quality score (0–100)** per response → decides whether the reward is paid instantly, held 24h, invalidated, or flagged.
- **Reward multiplier** — a respondent's rolling average quality scales their per-response reward (0.8×–1.2×).
- **Trust level (1–5: Newcomer → Partner)** — earned by volume + sustained quality; surveys set a minimum trust level to participate.
- **Platform fee** — a percentage on top of respondent payouts that the company pays (default 4%).
- **MNT (₮)** — all money is Mongolian tugrik, usually shown abbreviated (₮500K, ₮1.2M).
</content>
