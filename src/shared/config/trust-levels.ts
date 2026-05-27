import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRUST_LEVELS as DEFAULT_TRUST_LEVELS, type TrustLevel } from './business';

/**
 * Trust levels are the platform's respondent reputation tiers, owned by the
 * superadmin. The thresholds (minResponses / minAvgQuality) and labels are
 * editable in Settings → Platform → Policies; the *number* of levels stays
 * fixed at 5 because it is baked into the TrustMeter, the survey builder
 * dropdown, and respondent typing. Both the admin and the survey builder read
 * this store so label/threshold edits propagate everywhere.
 */
interface TrustLevelState {
  levels: TrustLevel[];
  setLevels: (levels: TrustLevel[]) => void;
  resetToDefaults: () => void;
}

const clone = () => DEFAULT_TRUST_LEVELS.map((l) => ({ ...l }));

export const useTrustLevelStore = create<TrustLevelState>()(
  persist(
    (set) => ({
      levels: clone(),
      setLevels: (levels) => set({ levels: levels.map((l) => ({ ...l })) }),
      resetToDefaults: () => set({ levels: clone() }),
    }),
    { name: 'idap-trust-levels' },
  ),
);

/** Ordered trust levels — what the survey builder dropdown should show. */
export function useTrustLevels(): TrustLevel[] {
  return useTrustLevelStore((s) => s.levels);
}
