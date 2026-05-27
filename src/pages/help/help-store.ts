import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  HELP_CATEGORIES,
  HELP_ARTICLES,
  POPULAR_ARTICLE_SLUGS,
  type HelpIconKey,
} from './help-data';

/**
 * In-app Help CMS (prototype). The superadmin manages categories + articles here;
 * the /help reader renders only *published* content from this store. Seeded from
 * the original static help-data and persisted to localStorage so edits survive
 * refresh. (Delivering this to the company portal would need the real backend.)
 */
export type { HelpIconKey };
export type ArticleStatus = 'published' | 'draft';

export interface HelpCategory {
  slug: string; // stable id — not regenerated on rename
  title: string;
  description: string;
  iconKey: HelpIconKey;
  order: number;
}

export interface HelpArticle {
  slug: string; // stable id
  categorySlug: string;
  title: string;
  description: string;
  body: string; // light markdown / plain text
  readTime: string;
  status: ArticleStatus;
  popular: boolean;
  order: number;
  updatedAt: string;
}

const SEED_CATEGORIES: HelpCategory[] = HELP_CATEGORIES.map((c, i) => ({ ...c, order: i }));
const SEED_ARTICLES: HelpArticle[] = HELP_ARTICLES.map((a, i) => ({
  ...a,
  body: '',
  status: 'published' as const,
  popular: POPULAR_ARTICLE_SLUGS.includes(a.slug),
  order: i,
}));

const cloneCats = () => SEED_CATEGORIES.map((c) => ({ ...c }));
const cloneArts = () => SEED_ARTICLES.map((a) => ({ ...a }));

function makeSlug(title: string, prefix: string) {
  const s = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${prefix}-${s || 'item'}-${Math.random().toString(36).slice(2, 6)}`;
}
function today() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

interface HelpState {
  categories: HelpCategory[];
  articles: HelpArticle[];
  addCategory: (input: { title: string; description: string; iconKey: HelpIconKey }) => void;
  updateCategory: (slug: string, patch: Partial<Pick<HelpCategory, 'title' | 'description' | 'iconKey'>>) => void;
  removeCategory: (slug: string) => void;
  reorderCategories: (orderedSlugs: string[]) => void;
  addArticle: (input: Omit<HelpArticle, 'slug' | 'order' | 'updatedAt'>) => void;
  updateArticle: (
    slug: string,
    patch: Partial<Omit<HelpArticle, 'slug' | 'order' | 'updatedAt'>>,
  ) => void;
  removeArticle: (slug: string) => void;
  reorderArticles: (categorySlug: string, orderedSlugs: string[]) => void;
  resetToDefaults: () => void;
}

export const useHelpStore = create<HelpState>()(
  persist(
    (set) => ({
      categories: cloneCats(),
      articles: cloneArts(),
      addCategory: ({ title, description, iconKey }) =>
        set((st) => ({
          categories: [
            ...st.categories,
            { slug: makeSlug(title, 'cat'), title: title.trim(), description: description.trim(), iconKey, order: st.categories.length },
          ],
        })),
      updateCategory: (slug, patch) =>
        set((st) => ({
          categories: st.categories.map((c) =>
            c.slug === slug
              ? {
                  ...c,
                  ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
                  ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
                  ...(patch.iconKey !== undefined ? { iconKey: patch.iconKey } : {}),
                }
              : c,
          ),
        })),
      removeCategory: (slug) =>
        set((st) => ({
          categories: st.categories.filter((c) => c.slug !== slug),
          articles: st.articles.filter((a) => a.categorySlug !== slug),
        })),
      reorderCategories: (orderedSlugs) =>
        set((st) => ({
          categories: orderedSlugs
            .map((s, i) => {
              const f = st.categories.find((c) => c.slug === s);
              return f ? { ...f, order: i } : null;
            })
            .filter((c): c is HelpCategory => c !== null),
        })),
      addArticle: (input) =>
        set((st) => ({
          articles: [
            ...st.articles,
            {
              ...input,
              title: input.title.trim(),
              description: input.description.trim(),
              readTime: input.readTime.trim() || '3 min',
              slug: makeSlug(input.title, 'art'),
              order: st.articles.length,
              updatedAt: today(),
            },
          ],
        })),
      updateArticle: (slug, patch) =>
        set((st) => ({
          articles: st.articles.map((a) =>
            a.slug === slug ? { ...a, ...patch, updatedAt: today() } : a,
          ),
        })),
      removeArticle: (slug) =>
        set((st) => ({ articles: st.articles.filter((a) => a.slug !== slug) })),
      reorderArticles: (categorySlug, orderedSlugs) =>
        set((st) => {
          const others = st.articles.filter((a) => a.categorySlug !== categorySlug);
          const reordered = orderedSlugs
            .map((s, i) => {
              const f = st.articles.find((a) => a.slug === s);
              return f ? { ...f, order: i } : null;
            })
            .filter((a): a is HelpArticle => a !== null);
          return { articles: [...others, ...reordered] };
        }),
      resetToDefaults: () => set({ categories: cloneCats(), articles: cloneArts() }),
    }),
    { name: 'idap-help-content' },
  ),
);

/** Categories in display order. */
export function useHelpCategories(): HelpCategory[] {
  const categories = useHelpStore((s) => s.categories);
  return useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);
}

/** Only published articles — what the reader shows. */
export function usePublishedArticles(): HelpArticle[] {
  const articles = useHelpStore((s) => s.articles);
  return useMemo(
    () => articles.filter((a) => a.status === 'published').sort((a, b) => a.order - b.order),
    [articles],
  );
}
