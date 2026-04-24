export type HelpIconKey =
  | 'rocket'
  | 'building'
  | 'clipboard'
  | 'users'
  | 'wallet'
  | 'settings';

export interface HelpCategoryMeta {
  slug: string;
  title: string;
  description: string;
  iconKey: HelpIconKey;
}

export const HELP_CATEGORIES: HelpCategoryMeta[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Admin console overview, roles, and daily workflow.',
    iconKey: 'rocket',
  },
  {
    slug: 'company-moderation',
    title: 'Company Moderation',
    description: 'Review applications, approve, suspend, and reinstate companies.',
    iconKey: 'building',
  },
  {
    slug: 'survey-moderation',
    title: 'Survey Moderation',
    description: 'Pause, resume, reject, and monitor surveys across the platform.',
    iconKey: 'clipboard',
  },
  {
    slug: 'respondent-management',
    title: 'Respondent Management',
    description: 'Trust levels, quality scores, warnings, and suspensions.',
    iconKey: 'users',
  },
  {
    slug: 'payouts-compliance',
    title: 'Payouts & Compliance',
    description: 'Approve withdrawals, gateways, refunds, and fraud signals.',
    iconKey: 'wallet',
  },
  {
    slug: 'platform-operations',
    title: 'Platform Operations',
    description: 'Admin roles, exports, audit logs, and system settings.',
    iconKey: 'settings',
  },
];

export interface HelpArticleMeta {
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  readTime: string;
  updatedAt: string;
}

export const HELP_ARTICLES: HelpArticleMeta[] = [
  // Getting Started
  { slug: 'admin-console-tour', categorySlug: 'getting-started', title: 'A tour of the admin console', description: 'Dashboard, sidebar groups, and how the pages fit together.', readTime: '4 min', updatedAt: 'Apr 18, 2026' },
  { slug: 'platform-dashboard-guide', categorySlug: 'getting-started', title: 'Reading the Platform Dashboard', description: 'What every KPI, chart, and activity event tells you.', readTime: '5 min', updatedAt: 'Apr 15, 2026' },
  { slug: 'admin-terminology', categorySlug: 'getting-started', title: 'iDap platform terminology', description: 'Companies, respondents, trust levels, quality scores, and payouts.', readTime: '3 min', updatedAt: 'Apr 10, 2026' },
  { slug: 'daily-admin-workflow', categorySlug: 'getting-started', title: 'A recommended daily admin workflow', description: 'What to check first, what to batch, and when to escalate.', readTime: '4 min', updatedAt: 'Apr 08, 2026' },

  // Company Moderation
  { slug: 'review-pending-company', categorySlug: 'company-moderation', title: 'Reviewing a pending company application', description: 'What to verify before approving a new company onto the platform.', readTime: '5 min', updatedAt: 'Apr 20, 2026' },
  { slug: 'company-approval-criteria', categorySlug: 'company-moderation', title: 'Approval criteria for new companies', description: 'Identity, billing, and intent checks you should clear before approving.', readTime: '4 min', updatedAt: 'Apr 16, 2026' },
  { slug: 'suspend-company', categorySlug: 'company-moderation', title: 'Suspending a company and its impact', description: 'What happens to active surveys, billing, and team access.', readTime: '3 min', updatedAt: 'Apr 12, 2026' },
  { slug: 'reinstate-company', categorySlug: 'company-moderation', title: 'Reinstating a suspended company', description: 'Restoring access, surfacing paused surveys, and notifying the team.', readTime: '3 min', updatedAt: 'Apr 05, 2026' },

  // Survey Moderation
  { slug: 'survey-statuses', categorySlug: 'survey-moderation', title: 'Understanding survey statuses', description: 'Active, Draft, Paused, Completed, Rejected — and who can change them.', readTime: '3 min', updatedAt: 'Apr 19, 2026' },
  { slug: 'pause-survey', categorySlug: 'survey-moderation', title: 'Pausing a survey from moderation', description: 'When to pause, how the company is notified, and when responses resume.', readTime: '3 min', updatedAt: 'Apr 14, 2026' },
  { slug: 'reject-survey', categorySlug: 'survey-moderation', title: 'Rejecting a survey', description: 'Rejection reasons, respondent visibility, and the appeals process.', readTime: '4 min', updatedAt: 'Apr 11, 2026' },
  { slug: 'trust-requirements', categorySlug: 'survey-moderation', title: 'Setting trust-level requirements for surveys', description: 'How Level 1+ to Level 5+ gating affects respondent eligibility.', readTime: '3 min', updatedAt: 'Apr 07, 2026' },

  // Respondent Management
  { slug: 'trust-levels-explained', categorySlug: 'respondent-management', title: 'Trust levels L1–L5 explained', description: 'How iDap computes trust, and what level unlocks what.', readTime: '5 min', updatedAt: 'Apr 20, 2026' },
  { slug: 'quality-scores', categorySlug: 'respondent-management', title: 'Quality scores and thresholds', description: 'How scores are calculated and when low quality triggers review.', readTime: '4 min', updatedAt: 'Apr 17, 2026' },
  { slug: 'warn-vs-suspend', categorySlug: 'respondent-management', title: 'Warning vs. suspending a respondent', description: 'Pick the right escalation step, and what the respondent sees.', readTime: '3 min', updatedAt: 'Apr 13, 2026' },
  { slug: 'handling-fraud-signals', categorySlug: 'respondent-management', title: 'Handling fraud signals', description: 'Fast completion, straight-lining, and repeated low-quality submissions.', readTime: '5 min', updatedAt: 'Apr 09, 2026' },

  // Payouts & Compliance
  { slug: 'release-payouts', categorySlug: 'payouts-compliance', title: 'Releasing pending payouts', description: 'Single-row approval, bulk approval, and what to verify first.', readTime: '4 min', updatedAt: 'Apr 21, 2026' },
  { slug: 'gateway-options', categorySlug: 'payouts-compliance', title: 'Gateway options: QPay, Bonum, Social Pay, Bank Transfer', description: 'Processing times, limits, and when to escalate a transfer.', readTime: '4 min', updatedAt: 'Apr 16, 2026' },
  { slug: 'failed-payouts', categorySlug: 'payouts-compliance', title: 'Handling failed payouts and retries', description: 'Why payouts fail, retry strategies, and when to refund to balance.', readTime: '4 min', updatedAt: 'Apr 12, 2026' },
  { slug: 'reject-payout', categorySlug: 'payouts-compliance', title: 'Rejecting a withdrawal request', description: 'Legitimate rejection reasons and how the balance is restored.', readTime: '3 min', updatedAt: 'Apr 06, 2026' },

  // Platform Operations
  { slug: 'admin-roles', categorySlug: 'platform-operations', title: 'Admin roles and permissions', description: 'Super admin, moderator, and read-only — what each can do.', readTime: '3 min', updatedAt: 'Apr 18, 2026' },
  { slug: 'export-data', categorySlug: 'platform-operations', title: 'Exporting data as CSV', description: 'Companies, respondents, surveys, and payouts — format and scope.', readTime: '2 min', updatedAt: 'Apr 14, 2026' },
  { slug: 'audit-logs', categorySlug: 'platform-operations', title: 'Audit logs and the activity feed', description: 'Where admin actions are recorded and how to investigate.', readTime: '4 min', updatedAt: 'Apr 10, 2026' },
  { slug: 'notification-settings', categorySlug: 'platform-operations', title: 'Notification preferences for admins', description: 'Route moderation alerts to email, in-app, or nowhere.', readTime: '2 min', updatedAt: 'Apr 04, 2026' },
];

export function getCategoryBySlug(slug: string | undefined): HelpCategoryMeta | undefined {
  if (!slug) return undefined;
  return HELP_CATEGORIES.find((c) => c.slug === slug);
}

export function getArticleBySlug(slug: string | undefined): HelpArticleMeta | undefined {
  if (!slug) return undefined;
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesInCategory(slug: string | undefined): HelpArticleMeta[] {
  if (!slug) return [];
  return HELP_ARTICLES.filter((a) => a.categorySlug === slug);
}

export const POPULAR_ARTICLE_SLUGS = [
  'review-pending-company',
  'release-payouts',
  'trust-levels-explained',
  'reject-survey',
  'quality-scores',
];
