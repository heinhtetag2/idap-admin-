export const PLATFORM_FEE = {
  defaultPct: 4.0,
  minPct: 0,
  maxPct: 20,
  fallbackPct: 4.0,
} as const;

export const REWARD = {
  minMnt: 0,
  maxMnt: 100_000,
  holdWindowHours: 24,
} as const;

export const WITHDRAWAL = {
  minMnt: 10_000,
  gateways: ['qpay', 'bonum'] as const,
} as const;

export type QualityBand =
  | 'paid_instant'
  | 'held_24h'
  | 'invalidated'
  | 'flagged';

export function qualityBand(score: number): QualityBand {
  if (score >= 80) return 'paid_instant';
  if (score >= 50) return 'held_24h';
  if (score >= 20) return 'invalidated';
  return 'flagged';
}

export function rewardMultiplier(avgScore: number): number {
  if (avgScore >= 90) return 1.2;
  if (avgScore >= 85) return 1.1;
  if (avgScore >= 80) return 1.0;
  if (avgScore >= 75) return 0.9;
  return 0.8;
}

export type TrustLevel = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  minResponses: number;
  minAvgQuality: number | null;
};

export const TRUST_LEVELS: readonly TrustLevel[] = [
  { level: 1, label: 'Newcomer', minResponses: 0, minAvgQuality: null },
  { level: 2, label: 'Verified', minResponses: 3, minAvgQuality: 75 },
  { level: 3, label: 'Trusted', minResponses: 10, minAvgQuality: 80 },
  { level: 4, label: 'Elite', minResponses: 30, minAvgQuality: 85 },
  { level: 5, label: 'Partner', minResponses: 100, minAvgQuality: 90 },
] as const;
