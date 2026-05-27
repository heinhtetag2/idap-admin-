import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Question types are a *developer-defined capability* — each one needs a builder
 * editor, a respondent-side renderer, a response shape, and analytics. New types
 * require code. The superadmin can only **enable/disable** which of the built-in
 * types companies may use in the survey builder (an allowlist, like payout
 * gateways). At least one type must stay enabled.
 */
export type QuestionTypeKey =
  | 'single_choice'
  | 'multiple_choice'
  | 'short_text'
  | 'long_text'
  | 'rating';

export interface QuestionTypeDef {
  key: QuestionTypeKey;
  label: string;
  description: string;
  enabled: boolean;
  order: number;
}

const SEED: QuestionTypeDef[] = [
  { key: 'single_choice',   label: 'Single Choice',   description: 'Pick one option from a list (radio).',           enabled: true, order: 0 },
  { key: 'multiple_choice', label: 'Multiple Choice', description: 'Pick several options from a list (checkboxes).', enabled: true, order: 1 },
  { key: 'short_text',      label: 'Short Text',      description: 'A single-line free-text answer.',                enabled: true, order: 2 },
  { key: 'long_text',       label: 'Long Text',       description: 'A multi-line free-text answer.',                 enabled: true, order: 3 },
  { key: 'rating',          label: 'Rating (1–5)',    description: 'A 1–5 numeric / star rating.',                   enabled: true, order: 4 },
];

interface QuestionTypeState {
  types: QuestionTypeDef[];
  setEnabled: (key: QuestionTypeKey, enabled: boolean) => void;
  resetToDefaults: () => void;
}

export const useQuestionTypeStore = create<QuestionTypeState>()(
  persist(
    (set) => ({
      types: SEED.map((t) => ({ ...t })),
      setEnabled: (key, enabled) =>
        set((s) => {
          // Never let the last enabled type be turned off.
          if (!enabled) {
            const enabledCount = s.types.filter((t) => t.enabled).length;
            const target = s.types.find((t) => t.key === key);
            if (target?.enabled && enabledCount <= 1) return s;
          }
          return { types: s.types.map((t) => (t.key === key ? { ...t, enabled } : t)) };
        }),
      resetToDefaults: () => set({ types: SEED.map((t) => ({ ...t })) }),
    }),
    { name: 'idap-question-types' },
  ),
);

/** Enabled type keys in display order — what the builder's Type dropdown should offer. */
export function useEnabledQuestionTypeKeys(): QuestionTypeKey[] {
  const types = useQuestionTypeStore((s) => s.types);
  return useMemo(
    () => types.filter((t) => t.enabled).sort((a, b) => a.order - b.order).map((t) => t.key),
    [types],
  );
}
