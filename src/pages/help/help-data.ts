export type HelpIconKey =
  | 'rocket'
  | 'clipboard'
  | 'message'
  | 'credit'
  | 'settings'
  | 'shield';

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
    description: 'First survey, workspace setup, and basics.',
    iconKey: 'rocket',
  },
  {
    slug: 'creating-surveys',
    title: 'Creating Surveys',
    description: 'Question types, logic, targeting, and rewards.',
    iconKey: 'clipboard',
  },
  {
    slug: 'responses-quality',
    title: 'Responses & Quality',
    description: 'Review responses, quality scores, and export.',
    iconKey: 'message',
  },
  {
    slug: 'billing-credits',
    title: 'Billing & Credits',
    description: 'Plans, top-ups, invoices, and payment methods.',
    iconKey: 'credit',
  },
  {
    slug: 'account-team',
    title: 'Account & Team',
    description: 'Profile, members, permissions, and notifications.',
    iconKey: 'settings',
  },
  {
    slug: 'privacy-trust',
    title: 'Privacy & Trust',
    description: 'Anonymous surveys, data retention, and compliance.',
    iconKey: 'shield',
  },
];

export interface HelpArticleMeta {
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  readTime: string; // e.g. "4 min"
  updatedAt: string; // display string
}

export const HELP_ARTICLES: HelpArticleMeta[] = [
  // Getting Started
  { slug: 'create-first-survey', categorySlug: 'getting-started', title: 'How to create your first survey', description: 'A 10-minute walkthrough from draft to launch.', readTime: '4 min', updatedAt: 'Apr 12, 2026' },
  { slug: 'workspace-setup', categorySlug: 'getting-started', title: 'Setting up your workspace', description: 'Invite teammates, pick a plan, connect a payment method.', readTime: '3 min', updatedAt: 'Mar 28, 2026' },
  { slug: 'dashboard-tour', categorySlug: 'getting-started', title: 'A tour of the Dashboard', description: 'Understand every card, chart, and what they mean.', readTime: '5 min', updatedAt: 'Apr 02, 2026' },
  { slug: 'terminology', categorySlug: 'getting-started', title: 'iDap terminology and concepts', description: 'Credits, responses, quality scores, and trust levels.', readTime: '3 min', updatedAt: 'Mar 22, 2026' },

  // Creating Surveys
  { slug: 'reward-and-targeting', categorySlug: 'creating-surveys', title: 'Setting reward amounts and targeting respondents', description: 'Choose rewards that attract quality answers from the right audience.', readTime: '6 min', updatedAt: 'Apr 15, 2026' },
  { slug: 'question-types', categorySlug: 'creating-surveys', title: 'All available question types', description: 'Single choice, multi-choice, matrix, free text, and more.', readTime: '7 min', updatedAt: 'Apr 10, 2026' },
  { slug: 'survey-logic', categorySlug: 'creating-surveys', title: 'Branching, skip logic, and quotas', description: 'Build surveys that adapt to each respondent.', readTime: '5 min', updatedAt: 'Apr 08, 2026' },
  { slug: 'categories-and-tags', categorySlug: 'creating-surveys', title: 'Using categories and tags', description: 'Organize your surveys for faster filtering.', readTime: '2 min', updatedAt: 'Apr 05, 2026' },

  // Responses & Quality
  { slug: 'quality-scores', categorySlug: 'responses-quality', title: 'Understanding response quality scores', description: 'How iDap scores responses and what to do with low scores.', readTime: '5 min', updatedAt: 'Apr 16, 2026' },
  { slug: 'export-csv', categorySlug: 'responses-quality', title: 'Exporting survey responses as CSV', description: 'Download raw or quality-filtered responses for analysis.', readTime: '2 min', updatedAt: 'Apr 11, 2026' },
  { slug: 'completion-rate', categorySlug: 'responses-quality', title: 'Improving your completion rate', description: 'Common reasons respondents drop off — and fixes.', readTime: '4 min', updatedAt: 'Apr 03, 2026' },

  // Billing & Credits
  { slug: 'top-up-credits', categorySlug: 'billing-credits', title: 'Topping up credits and bonus packages', description: 'How packages work and when bonus credits apply.', readTime: '3 min', updatedAt: 'Apr 14, 2026' },
  { slug: 'invoices', categorySlug: 'billing-credits', title: 'Where to find your invoices', description: 'Download PDFs and view billing history.', readTime: '2 min', updatedAt: 'Apr 09, 2026' },
  { slug: 'plans-overview', categorySlug: 'billing-credits', title: 'Comparing plans (Starter, Growth, Enterprise)', description: 'Which plan fits your team and budget.', readTime: '4 min', updatedAt: 'Apr 01, 2026' },

  // Account & Team
  { slug: 'invite-members', categorySlug: 'account-team', title: 'Inviting teammates and setting permissions', description: 'Owner, admin, and viewer roles explained.', readTime: '3 min', updatedAt: 'Apr 13, 2026' },
  { slug: 'notifications-prefs', categorySlug: 'account-team', title: 'Notification preferences', description: 'Choose what triggers email, in-app, and digest alerts.', readTime: '2 min', updatedAt: 'Apr 07, 2026' },

  // Privacy & Trust
  { slug: 'anonymous-surveys', categorySlug: 'privacy-trust', title: 'Running anonymous surveys', description: 'When to use anonymity and how iDap enforces it.', readTime: '4 min', updatedAt: 'Apr 06, 2026' },
  { slug: 'data-retention', categorySlug: 'privacy-trust', title: 'Data retention and deletion', description: 'How long response data lives, and how to purge it.', readTime: '3 min', updatedAt: 'Mar 30, 2026' },
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
  'create-first-survey',
  'reward-and-targeting',
  'quality-scores',
  'top-up-credits',
  'export-csv',
];
