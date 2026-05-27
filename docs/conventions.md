# Conventions & Notes

Patterns to follow when extending the console, plus the rough edges to be aware of.

## Code organization

- **Feature-Sliced layering** — respect `app → pages → widgets → features → entities → shared`; never import upward. Use the `@/*` alias for all cross-layer imports.
- **One folder per page** under `pages/`, each with a barrel `index.ts` (default export) so routes can `import X from '@/pages/x'`.
- **Co-located data** — a page's demo data and its TypeScript types live in a sibling `*-data.ts` (e.g. `company-data.ts`), exporting a `DEMO_*` array, the entity types, and a `find*ById` helper. New entity work currently follows this pattern rather than the empty `entities/` layer.
- **Widgets** are cross-page composites (`sidebar`, `response-detail-drawer`, `admin-notes`); each has a barrel.

## UI patterns

- **`cn(...)`** ([`shared/lib/cn.ts`](../src/shared/lib/cn.ts)) for all conditional/merged class names.
- **Status → visual mapping** lives in a per-page `getStatusStyles()`-style function returning a badge class + a lucide icon. Reuse that shape.
- **Confirm modals** gate every state-changing action (approve/reject/suspend/pause/payout…), with a `{ title, description, cta, tone }` config and `tone ∈ {success, warning, danger}`.
- **Right-side drawers** are the standard detail/edit surface (response detail, billing history, report detail, settings editors, activity timeline). Built on `motion` + the shared [`drawer`](../src/shared/ui/drawer.tsx).
- **Filtering/search/pagination** are done client-side over the demo array with `useMemo`; page size is typically 10.
- **CSV export** is generated client-side from the in-memory rows.
- **i18n** — wrap every user-facing string in `t(...)` from `useTranslation()`.
- **Money** — store integers in `*Mnt` fields; display via a local `formatMnt` (abbreviated) and, where exactness matters, a `formatMntExact`.

## Design tokens

The de-facto palette is **hardcoded hex**, not the OKLCH theme tokens in `theme.css`. The canonical values are tabulated in [architecture.md](architecture.md#theming--design-system). The key one: brand/accent is **`#FF3C21`**. If you add a screen, match those hexes for visual consistency (or, better, start migrating to the theme tokens).

## Known inconsistencies

These are real mismatches in the current code — worth knowing before you "fix" something that's intentional, or rely on something that isn't consistent:

1. **`SurveyCategory` defined twice, differently.**
   - `pages/surveys/survey-data.ts`: `'Social' | 'Product' | 'Brand' | 'Other'` (no Market Research).
   - `shared/config/categories.ts`: full objects, seeded with Social/Product/Brand/**Market Research**/Other.
   The builder reads the store; the moderation list/types use the narrower union. They don't share a type.

2. **Withdrawal gateways disagree.** `business.ts → WITHDRAWAL.gateways` is `['qpay', 'bonum']`, but Payouts and Settings use four (`QPay | Bonum | Social Pay | Bank Transfer`).

3. **Quality numbers are illustrative.** `business.ts → qualityBand` cuts at 80/50/20, while Survey Detail maps tiers to fixed scores (High 83 / Medium 62 / Low 28). They're consistent in spirit, not in exact arithmetic.

4. **Default locale.** `.env.example`/`env.ts` say `VITE_DEFAULT_LOCALE=mn`, but `i18n.ts` hardcodes `lng: 'en'` and ships en/es/fr/ko (no Mongolian bundle). The env value is currently ignored.

5. **Two billing implementations.** The standalone `/billing` page and the Companies → Billing tab build invoices independently.

6. **Route constants vs. real routes.** `shared/config/routes.ts` defines portal-namespaced paths (`/admin/...`, `/client/...`) that the actual router (`app/routes.ts`, flat paths) does not use.

7. **Hardcoded current admin.** *Hein Htet* (and email/avatar) is hardcoded in the sidebar, admin notes, and payout action logs rather than derived from auth.

## <a id="stale-docs"></a>Stale root docs

The root [`README.md`](../README.md) and [`FOUNDATION.md`](../FOUNDATION.md) predate the pivot to the admin console. They describe a **client portal** with `expenses/`, `funding/`, `templates/`, `scribe/`, `employees/` pages and a Mongolian-first locale — none of which exist in the current `src/`. Treat this `docs/` set as authoritative for the current product; keep the root docs only as historical context (or refresh them to match).

## Prototype boundary

This is a front-end prototype. Before building on a screen, check [architecture.md → What is / isn't wired](architecture.md#what-is--isnt-wired): there is no backend, auth accepts anything, and only the survey-category store persists. When a real API arrives, the seams to fill are `shared/api/msw/handlers.ts` (mock handlers) and TanStack Query hooks replacing the `DEMO_*` reads.

## Tooling gaps

`package.json` has no test runner and no linter — `npm run typecheck` (strict `tsc --noEmit`) is the only automated check. Run it before committing.
</content>
