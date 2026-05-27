# Settings

**Route:** `/settings`
**Source:** [`Settings.tsx`](../../src/pages/settings/Settings.tsx) · platform stores: [`categories`](../../src/shared/config/categories.ts), [`trust-levels`](../../src/shared/config/trust-levels.ts), [`quality-thresholds`](../../src/shared/config/quality-thresholds.ts), [`question-types`](../../src/shared/config/question-types.ts)

Platform and account configuration, organised as a searchable left-nav with eight sections. Platform-level sections (Policies, Categories, Question types) are gated to **Super admins**.

```ts
type SectionId = 'account' | 'admins' | 'policies' | 'categories' | 'question-types'
              | 'notifications' | 'region' | 'sessions';
```

Nav groups: **Personal** (Account) · **Workspace** (Admins & Roles) · **Platform** (Policies, Categories, Question types) · **Preferences** (Notifications, Language & region) · **Privacy & Security** (Sessions). Section switching is `motion`-animated; the left nav has a live search filter.

## Sections

### Account
Profile image upload (JPG/PNG ≤5MB), personal info (first/last name, job title), country/city, email (change via drawer), password (change via drawer, shows last-changed), a Sign-out row (confirm modal), and a danger-zone Delete account (type `DELETE` + acknowledge checkbox).

### Admins & Roles
Team-member list (demo: 4 active + 1 invited) with role + status + last-active; an Invite drawer. Roles:
```ts
role: 'Super admin' | 'Moderator' | 'Read-only';
status: 'Active' | 'Invited';
```
Read-only permission summary per role with member counts. *See [overview.md](../overview.md#who-uses-this-console) for what each role can do.*

### Policies *(Super admin only)*
Editable platform rules backed by [`business.ts`](../domain-model.md):
- **Platform fee** — % input, 0–20%, default 4%.
- **Rewards** — min/max per response (₮), hold window (hours).
- **Quality thresholds** — **editable** cutoffs for the four [quality bands](../domain-model.md#quality-bands) (≥80 paid instantly · ≥50 held 24h · ≥20 invalidated · <20 flagged); the four outcomes are fixed, and Save is blocked unless the cutoffs stay in descending order.
- **Trust levels** — the five [trust tiers](../domain-model.md#trust-levels) (L1 Newcomer → L5 Partner); thresholds + labels are **editable**.
- **Withdrawals & gateways** — min withdrawal + toggles for QPay, Bonum, Social Pay, Bank Transfer.

The Save / Restore-defaults bar persists **Trust levels and Quality thresholds** (via their stores). Fee, rewards, and gateways are still UI-only.

### Categories *(Super admin only)*
The single source of truth for survey categories, backed by the persisted Zustand store [`useCategoryStore`](../../src/shared/config/categories.ts) (key `idap-survey-categories`). This list is what every company's **Survey Builder** reads via `useActiveCategories()`.

```ts
interface SurveyCategory { id; name; description?; status: 'active'|'archived'; order: number }
```

Seeded: Social · Product · Brand · Market Research · Other. UI supports add, edit (drawer), archive/unarchive, delete (confirm), and reorder (up/down); the default **Other** is pinned last and can't be deleted. Store actions: `addCategory`, `updateCategory`, `setStatus`, `removeCategory`, `reorder`. It **persists** to localStorage (one of several Platform stores that do).

### Question types *(Super admin only)*
An **enable/disable allowlist** over the builder's built-in question types, backed by the persisted store [`useQuestionTypeStore`](../../src/shared/config/question-types.ts) (key `idap-question-types`). Question types are *code* (each needs a builder editor, a respondent renderer, a data shape), so this curates the built-in set rather than creating new types.

Built-in: Single Choice · Multiple Choice · Short Text · Long Text · Rating. Toggling one off hides it from every company's Survey Builder (`useEnabledQuestionTypeKeys()`); at least one must stay enabled.

### Notifications
Master Email + In-app toggles, then per-event channel toggles for 8 event types:
```ts
type NotificationKey =
  'companyApplied' | 'companyFlagged' | 'surveyDraft' | 'surveyRejected'
  | 'respondentFraud' | 'respondentWarned' | 'payoutFailed' | 'payoutHighValue';
```

### Language & region
Display language (en/es/fr/ko → `i18n.changeLanguage()`), timezone (Ulaanbaatar default + 4 others), date format (mdy/dmy/iso).

### Sessions
Active-session list (device, location, last-active, current flag) with per-session sign-out (disabled for current) and "Sign out everywhere", each behind a confirm modal.

## Shared building blocks

Settings defines several local components reused across sections: `FormSection`, `Field`, `Input`, `MntInput` (₮ prefix), `Toggle`, plus a right-side `SettingsDrawer` and a portal-based `SettingsConfirmModal`. The shared [`BrandSelect`](../../src/shared/ui/brand-select.tsx) powers dropdowns.

---

## Admin Notes widget

**Source:** [`widgets/admin-notes/AdminNotes.tsx`](../../src/widgets/admin-notes/AdminNotes.tsx)

A reusable internal-notes block embedded in detail pages and drawers (Company, Respondent, Survey, Report). Header (icon, title, count) + composer (current-admin avatar, textarea, ⌘/Ctrl+Enter or Send) + reverse-chronological list.

```ts
type AdminNote = { id; author; authorInitial; content; createdAt };
// Props: storageKey, seedNotes?, title?, description?, placeholder?
```

The current admin is hardcoded (*Hein Htet*); `seedNotes` pre-populates per record (e.g. suspended companies, warned respondents, specific reports). Notes are **local state only** — not persisted across reload.

## Notes

- The Platform stores — **Categories, Trust levels, Quality thresholds, Question types** — persist to localStorage; other Settings changes (Account, Notifications, plus the fee/rewards/gateways fields) are not persisted and have no backend.
- The "current admin" identity is hardcoded in multiple places rather than coming from auth.
</content>
