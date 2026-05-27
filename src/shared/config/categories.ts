import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Survey categories are platform-wide config owned by the superadmin.
 * Companies only *consume* this list in the survey builder — they never
 * define their own. This store is the single source of truth read by both
 * the admin Settings → Platform → Categories surface and the survey builder.
 */
export interface SurveyCategory {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  order: number;
  /** Built-in catch-all ("Other"): always sorts last, cannot be reordered or deleted. */
  system?: boolean;
}

const SEED: SurveyCategory[] = [
  { id: 'cat_social',  name: 'Social',          description: 'Community, lifestyle, and social-impact surveys',  status: 'active', order: 0 },
  { id: 'cat_product', name: 'Product',         description: 'Product feedback, usability, and feature research', status: 'active', order: 1 },
  { id: 'cat_brand',   name: 'Brand',           description: 'Brand perception, awareness, and positioning',      status: 'active', order: 2 },
  { id: 'cat_market',  name: 'Market Research', description: 'Market sizing, pricing, and competitive studies',    status: 'active', order: 3 },
  { id: 'cat_other',   name: 'Other',           description: 'Anything that does not fit the categories above',    status: 'active', order: 4, system: true },
];

/** Display order: system categories ("Other") always sink to the bottom. */
export function byDisplayOrder(a: SurveyCategory, b: SurveyCategory): number {
  const as = a.system ? 1 : 0;
  const bs = b.system ? 1 : 0;
  if (as !== bs) return as - bs;
  return a.order - b.order;
}

interface CategoryState {
  categories: SurveyCategory[];
  addCategory: (input: { name: string; description?: string }) => void;
  updateCategory: (id: string, patch: { name?: string; description?: string }) => void;
  setStatus: (id: string, status: SurveyCategory['status']) => void;
  removeCategory: (id: string) => void;
  reorder: (orderedIds: string[]) => void;
}

function makeId(name: string) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `cat_${slug || 'category'}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: SEED,
      addCategory: ({ name, description }) =>
        set((s) => ({
          categories: [
            ...s.categories,
            {
              id: makeId(name),
              name: name.trim(),
              description: description?.trim() || undefined,
              status: 'active',
              order: s.categories.length,
            },
          ],
        })),
      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
                  ...(patch.description !== undefined
                    ? { description: patch.description.trim() || undefined }
                    : {}),
                }
              : c,
          ),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      removeCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => !(c.id === id && !c.system)),
        })),
      reorder: (orderedIds) =>
        set((s) => ({
          categories: orderedIds
            .map((id, i) => {
              const found = s.categories.find((c) => c.id === id);
              return found ? { ...found, order: i } : null;
            })
            .filter((c): c is SurveyCategory => c !== null),
        })),
    }),
    {
      name: 'idap-survey-categories',
      version: 1,
      // Older persisted state predates the `system` flag — re-tag the built-in
      // "Other" category so it pins to the bottom and is protected.
      migrate: (persisted: unknown) => {
        const state = persisted as { categories?: SurveyCategory[] };
        if (state?.categories) {
          state.categories = state.categories.map((c) =>
            c.id === 'cat_other' ? { ...c, system: true } : c,
          );
        }
        return state as CategoryState;
      },
    },
  ),
);

/** Active categories, ordered — what the survey builder dropdown should show. */
export function useActiveCategories(): SurveyCategory[] {
  const categories = useCategoryStore((s) => s.categories);
  return useMemo(
    () => categories.filter((c) => c.status === 'active').sort(byDisplayOrder),
    [categories],
  );
}
