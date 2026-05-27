import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Quality thresholds map a response's 0–100 quality score to a reward outcome.
 * The superadmin can tune the three cutoffs (Settings → Platform → Policies);
 * the four *outcomes* (paid / held / invalidated / flagged) are fixed because
 * they are wired into payout logic. Editing re-bands existing responses.
 */
export interface QualityThresholds {
  /** score ≥ instant → paid instantly */
  instant: number;
  /** score ≥ hold → held for the review window */
  hold: number;
  /** score ≥ invalid → invalidated; below this → flagged for fraud */
  invalid: number;
}

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = { instant: 80, hold: 50, invalid: 20 };

interface QualityState {
  thresholds: QualityThresholds;
  setThresholds: (t: QualityThresholds) => void;
  resetToDefaults: () => void;
}

export const useQualityStore = create<QualityState>()(
  persist(
    (set) => ({
      thresholds: { ...DEFAULT_QUALITY_THRESHOLDS },
      setThresholds: (t) => set({ thresholds: { ...t } }),
      resetToDefaults: () => set({ thresholds: { ...DEFAULT_QUALITY_THRESHOLDS } }),
    }),
    { name: 'idap-quality-thresholds' },
  ),
);

export function useQualityThresholds(): QualityThresholds {
  return useQualityStore((s) => s.thresholds);
}

export type QualityBand = 'paid_instant' | 'held_24h' | 'invalidated' | 'flagged';

/** Map a 0–100 score to its band using the supplied thresholds. */
export function qualityBandFor(score: number, t: QualityThresholds): QualityBand {
  if (score >= t.instant) return 'paid_instant';
  if (score >= t.hold) return 'held_24h';
  if (score >= t.invalid) return 'invalidated';
  return 'flagged';
}
