# Help & Auth

Covers the remaining screens: the internal Help center and the public auth flow.

## Help center

**Route:** `/help` · **Source:** [`Help.tsx`](../../src/pages/help/Help.tsx) · [`help-data.ts`](../../src/pages/help/help-data.ts) · [`icon-map.ts`](../../src/pages/help/icon-map.ts)

A searchable, internal help center for the moderation team.

**Layout:** header · live search (filters article titles + descriptions, top 6 results) · "Browse by topic" (6 category cards with article counts) · "Popular articles" list · contact-support card (chat/email, "under 4 hours" response) · resources strip.

**Data:**
```ts
interface HelpCategoryMeta { slug; title; description; iconKey: HelpIconKey }
interface HelpArticleMeta  { slug; categorySlug; title; description; readTime; updatedAt }
```

6 categories (Getting Started · Company Moderation · Survey Moderation · Respondent Management · Payouts & Compliance · Platform Operations), 4 articles each (24 total). `icon-map.ts` maps `iconKey` → a lucide icon. Helpers: `getCategoryBySlug`, `getArticleBySlug`, `getArticlesInCategory`. Popular articles are a hardcoded slug list.

**Interaction:** category card → category drawer (article list); article → article drawer (read time, updated date, a generic templated body, related articles, helpful-feedback prompt). A back button returns to the category panel.

```ts
type DrawerView =
  | { kind: 'category'; slug: string }
  | { kind: 'article'; slug: string; backToCategory?: string };
```

Article bodies are a single generic template (steps, tips, "good to know"), not unique per article.

## Login

**Route:** `/login` · **Source:** [`Login.tsx`](../../src/pages/login/Login.tsx)

Split layout: a dark marketing panel (headline, demo stats — Companies 12, Respondents 2.4K, Paid out ₮38M) + a sign-in form (email, password with show/hide, remember-me, submit with spinner).

**Behavior:** if already authed → redirect `/`. On submit, calls [`signIn()`](../../src/shared/lib/auth.ts) and navigates to `/` after ~450ms. A demo hint states **any email and password work**. Links to `/forgot-password`.

## Forgot password

**Route:** `/forgot-password` · **Source:** [`ForgotPassword.tsx`](../../src/pages/forgot-password/ForgotPassword.tsx)

Same split layout, two views via `AnimatePresence`:
1. **Form** — email input → "Send reset link".
2. **Sent** — confirmation + a resend button with a 30s cooldown timer.

On submit it flips to the sent view after ~500ms and starts the cooldown. No email is actually sent (demo). Both views link back to `/login`; if already authed → redirect `/`.

## Not found

**Route:** `*` · **Source:** [`NotFound.tsx`](../../src/pages/not-found/NotFound.tsx)

Minimal centered 404 ("404" / "This page could not be found.") with a fade/scale-in animation. Rendered inside the authenticated `Layout`, so it still requires sign-in.
</content>
