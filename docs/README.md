# iDap Admin Console — Documentation

The control room for the **iDap** survey platform. This web app is the **internal admin / superadmin console** used by the iDap operations team to moderate companies, surveys, and respondents, release respondent payouts, and configure platform-wide policy.

> **Status: front-end prototype.** Every screen is wired to in-memory **demo data**, not a live backend. Auth is a `localStorage` flag (any email/password signs you in), the mock-API layer (MSW) is installed but has **no handlers registered**, and most "save"/action buttons mutate local component state only. See [architecture.md](architecture.md#what-is--isnt-wired) for the precise boundary between what's real and what's mocked.

## Read this first

| Doc | What it covers |
|---|---|
| [overview.md](overview.md) | What iDap is, the four portals, who uses this console, and what they do here |
| [architecture.md](architecture.md) | Tech stack, Feature-Sliced project layout, routing, auth, state, mock API, i18n, theming, env, build |
| [domain-model.md](domain-model.md) | Core entities (Company, Respondent, Survey, Report, Payout) and the platform business rules (fees, rewards, quality bands, trust levels) |
| [conventions.md](conventions.md) | Coding patterns, design tokens, and known inconsistencies / tech debt |

## Feature reference

One doc per area of the console, mapped to the sidebar:

| Section | Doc | Routes |
|---|---|---|
| Overview → Dashboard | [features/dashboard.md](features/dashboard.md) | `/`, `/dashboard` |
| Users → Companies | [features/companies.md](features/companies.md) | `/companies`, `/companies/:id` |
| Users → Respondents | [features/respondents.md](features/respondents.md) | `/respondents`, `/respondents/:id` |
| Content → Surveys | [features/surveys.md](features/surveys.md) | `/surveys`, `/surveys/new`, `/surveys/:id` |
| Moderation → Reports | [features/reports.md](features/reports.md) | `/reports` |
| Payments → Payouts | [features/payouts.md](features/payouts.md) | `/payouts` |
| (Billing) | [features/billing.md](features/billing.md) | `/billing` |
| Account → Settings | [features/settings.md](features/settings.md) | `/settings` |
| Help & Auth | [features/help-and-auth.md](features/help-and-auth.md) | `/help`, `/login`, `/forgot-password`, `*` |

## Quick start

```bash
npm install
npm run dev          # → http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # production bundle (vite build)
npm run preview      # serve the built bundle
```

On first load you'll hit `/login`. Any email + password signs in (demo auth).

## A note on the older docs

The repo's root [`README.md`](../README.md) and [`FOUNDATION.md`](../FOUNDATION.md) describe an earlier incarnation of this project (a **client portal** with expenses / funding / scribe pages, Mongolian default locale, etc.). The product has since pivoted to the admin console documented here. Where the two disagree, **this `docs/` set reflects the current code**; the root docs are kept for history. See [conventions.md](conventions.md#stale-docs) for the specifics.
</content>
</invoke>
