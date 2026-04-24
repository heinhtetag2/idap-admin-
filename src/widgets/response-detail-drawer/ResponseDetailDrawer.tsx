import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  X,
  ShieldCheck,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  Wallet,
  TrendingUp,
  ClipboardList,
  CheckCircle2,
  Clock,
  BarChart3,
  DollarSign,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/* ──────────────────────────────────── Types & constants ─────────────────────────────────────────── */

export type QualityTier = 'High' | 'Medium' | 'Low';

export interface DrawerQuestion {
  id: string;
  text: string;
  type: 'single' | 'rating' | 'text';
  options?: string[];
  /** 10-item deterministic cycle for demo distribution */
  pattern: string[];
  timeSec: number;
}

export const QUESTIONS: DrawerQuestion[] = [
  {
    id: 'q1',
    text: 'Which mobile banking app do you use most frequently?',
    type: 'single',
    options: ['TDB Digital', 'Khan Bank', 'Xac Bank', 'State Bank', 'Other'],
    pattern: ['TDB Digital', 'TDB Digital', 'TDB Digital', 'TDB Digital', 'Khan Bank', 'Khan Bank', 'Khan Bank', 'Xac Bank', 'State Bank', 'Other'],
    timeSec: 9,
  },
  {
    id: 'q2',
    text: 'How often do you make digital payments per week?',
    type: 'single',
    options: ['0 times', '1–5 times', '6–10 times', '11–20 times', '20+ times'],
    pattern: ['1–5 times', '1–5 times', '6–10 times', '6–10 times', '6–10 times', '6–10 times', '11–20 times', '11–20 times', '20+ times', '0 times'],
    timeSec: 13,
  },
  {
    id: 'q3',
    text: 'What is your primary reason for using digital payments?',
    type: 'single',
    options: ['No cash available', 'Convenience', 'Security', 'Discount offers', 'Other'],
    pattern: ['Convenience', 'Convenience', 'Convenience', 'No cash available', 'No cash available', 'No cash available', 'Security', 'Security', 'Discount offers', 'Other'],
    timeSec: 11,
  },
  {
    id: 'q4',
    text: 'Rate your overall satisfaction',
    type: 'rating',
    pattern: ['5', '5', '4', '4', '4', '4', '3', '3', '2', '1'],
    timeSec: 7,
  },
  {
    id: 'q5',
    text: 'Would you recommend this service to others?',
    type: 'single',
    options: ['Yes, definitely', 'Probably', 'Not sure', 'No'],
    pattern: ['Yes, definitely', 'Yes, definitely', 'Yes, definitely', 'Yes, definitely', 'Probably', 'Probably', 'Probably', 'Not sure', 'Not sure', 'No'],
    timeSec: 10,
  },
  {
    id: 'q6',
    text: 'What is the most useful feature?',
    type: 'single',
    options: ['Quick transfers', 'Bill payments', 'QR scan', 'International', 'Investment'],
    pattern: ['Quick transfers', 'Quick transfers', 'Quick transfers', 'Bill payments', 'Bill payments', 'QR scan', 'QR scan', 'International', 'Investment', 'Bill payments'],
    timeSec: 15,
  },
  {
    id: 'q7',
    text: 'Any suggestions for improvement?',
    type: 'text',
    pattern: [
      'Add more languages',
      'Better customer support',
      'Faster app performance',
      'Reduce transaction fees',
      'More payment options',
      'Add dark mode',
      '',
      '',
      'Support Apple Pay',
      '',
    ],
    timeSec: 23,
  },
];

export function answerForResponse(questionIndex: number, responseIndex: number): string {
  const q = QUESTIONS[questionIndex];
  return q.pattern[(responseIndex + questionIndex * 3) % q.pattern.length];
}

export function synthesizeAnswers(responseIndex: number): Record<string, string> {
  const answers: Record<string, string> = {};
  QUESTIONS.forEach((q, qi) => {
    answers[q.id] = answerForResponse(qi, responseIndex);
  });
  return answers;
}

interface QualityFactor {
  label: string;
  detail: string;
}

const QUALITY_FACTORS: QualityFactor[] = [
  { label: 'Response speed',   detail: 'Avg 12.4s/question — normal' },
  { label: 'Straight-lining',  detail: 'No straight-lining detected' },
  { label: 'Attention check',  detail: 'Passed all attention checks' },
  { label: 'Position bias',    detail: 'Answer distribution looks natural' },
  { label: 'Tab visibility',   detail: 'Stayed on tab throughout survey' },
];

export function qualityScoreFor(tier: QualityTier): number {
  return tier === 'High' ? 83 : tier === 'Medium' ? 62 : 28;
}

export function multiplierFor(score: number): number {
  if (score >= 90) return 1.2;
  if (score >= 85) return 1.1;
  if (score >= 80) return 1.0;
  if (score >= 75) return 0.9;
  return 0.8;
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s}s`;
}

/* ──────────────────────────────────── Respondent profile generation ─────────────────────────────── */

interface RespondentProfile {
  trustLevel: 1 | 2 | 3 | 4 | 5;
  trustLabel: string;
  memberLabel: string;
  ageRange: string;
  gender: 'Female' | 'Male';
  region: string;
  education: string;
  employment: string;
  incomeBand: string;
  surveysCompleted: number;
  avgQuality: number;
}

const AGE_RANGES   = ['18–24', '25–34', '35–44', '45–54', '55+'] as const;
const GENDERS      = ['Female', 'Male'] as const;
const REGIONS      = [
  'Ulaanbaatar · Sukhbaatar',
  'Ulaanbaatar · Chingeltei',
  'Ulaanbaatar · Bayanzurkh',
  'Ulaanbaatar · Khan-Uul',
  'Erdenet · Khoroo 12',
  'Darkhan · Center',
  'Choibalsan · Khoroo 3',
] as const;
const EDUCATIONS   = ["Bachelor's", "Master's", 'High school', 'Trade school', 'Other'] as const;
const EMPLOYMENTS  = ['Full-time', 'Part-time', 'Self-employed', 'Student', 'Retired'] as const;
const INCOME_BANDS = ['< ₮500K', '₮500K – 1M', '₮1M – 2M', '₮2M – 5M', '> ₮5M'] as const;
const TRUST_LABELS = ['Newcomer', 'Verified', 'Trusted', 'Elite', 'Partner'] as const;

export function generateProfile(seed: string, index: number): RespondentProfile {
  const base =
    seed.charCodeAt(0) +
    seed.charCodeAt(Math.max(0, seed.length - 1)) +
    index;
  const trustLevel = ((base % 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const memberMonths = ((base * 3) % 24) + 1;
  const memberLabel =
    memberMonths < 12
      ? `Member for ${memberMonths} month${memberMonths === 1 ? '' : 's'}`
      : `Member for ${Math.floor(memberMonths / 12)} year${Math.floor(memberMonths / 12) === 1 ? '' : 's'}`;
  return {
    trustLevel,
    trustLabel: TRUST_LABELS[trustLevel - 1],
    memberLabel,
    ageRange: AGE_RANGES[base % AGE_RANGES.length],
    gender: GENDERS[base % GENDERS.length],
    region: REGIONS[base % REGIONS.length],
    education: EDUCATIONS[(base + 1) % EDUCATIONS.length],
    employment: EMPLOYMENTS[(base + 2) % EMPLOYMENTS.length],
    incomeBand: INCOME_BANDS[(base + 3) % INCOME_BANDS.length],
    surveysCompleted: 1 + ((base * 7) % 120),
    avgQuality: 50 + (base % 50),
  };
}

/* ──────────────────────────────────── Drawer component ──────────────────────────────────────────── */

export interface ResponseDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Respondent display name (shown as the subtitle). */
  respondentName: string;
  /** Seed for deterministic profile generation. Pass the respondent id or similar. */
  respondentSeed: string;
  /** Response index within the respondent's history. Used for seed + answer synthesis. */
  responseIndex: number;
  /** Quality tier drives the score, multiplier, and reward. */
  qualityTier: QualityTier;
  /** Marks the top-right "Anonymized" badge. */
  anonymized?: boolean;
  /** Base reward used to compute the earned stat tile. Defaults to 5,000 ₮. */
  baseReward?: number;
  /** Answers keyed by question id. If omitted, synthesized from `responseIndex`. */
  answers?: Record<string, string>;
  /** If provided, shows an "Open survey" link in the header. */
  openSurveyHref?: string;
}

export function ResponseDetailDrawer({
  open,
  onClose,
  respondentName,
  respondentSeed,
  responseIndex,
  qualityTier,
  anonymized,
  baseReward = 5_000,
  answers,
  openSurveyHref,
}: ResponseDetailDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAnswersOpen, setIsAnswersOpen] = useState(true);

  const resolvedAnswers = answers ?? synthesizeAnswers(responseIndex);
  const profile = generateProfile(respondentSeed, responseIndex);
  const score = qualityScoreFor(qualityTier);
  const mult = multiplierFor(score);
  const earned = Math.round(baseReward * mult);
  const totalSec = QUESTIONS.reduce((acc, q) => acc + q.timeSec, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1A1A1A]/30 z-50 flex justify-end"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="w-full max-w-md bg-white h-full flex flex-col border-l border-[#E3E3E3]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E3E3E3] flex items-start justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <h2 className="text-base font-medium text-[#1A1A1A]">{t('Response Detail')}</h2>
                <p className="text-sm text-[#8A8A8A] mt-0.5 truncate">{respondentName}</p>
                {openSurveyHref && (
                  <button
                    onClick={() => navigate(openSurveyHref)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#FF3C21] hover:text-[#E63419] transition-colors cursor-pointer"
                  >
                    {t('Open survey')}
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0"
                aria-label={t('Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — scrollable, outlined cards on white */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Respondent Profile */}
              <section className="bg-white border border-[#E3E3E3] rounded-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
                    {t('Respondent Profile')}
                  </h3>
                  {anonymized && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F3F3] text-[#4A4A4A] text-xs font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      {t('Anonymized')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {t('Level')} {profile.trustLevel} — {t(profile.trustLabel)}
                    </div>
                    <div className="text-xs text-[#8A8A8A] mt-0.5">{t(profile.memberLabel)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <ProfileCell icon={Users}         label={t('Demographics')}             value={`${profile.ageRange} · ${t(profile.gender)}`} />
                  <ProfileCell icon={MapPin}        label={t('Region')}                   value={profile.region} />
                  <ProfileCell icon={GraduationCap} label={t('Education')}                value={t(profile.education)} />
                  <ProfileCell icon={Briefcase}     label={t('Employment')}               value={t(profile.employment)} />
                  <ProfileCell icon={Wallet}        label={t('Monthly household income')} value={profile.incomeBand} />
                  <ProfileCell icon={ClipboardList} label={t('Surveys completed')}        value={String(profile.surveysCompleted)} />
                  <ProfileCell icon={TrendingUp}    label={t('Avg quality')}              value={`${profile.avgQuality} / 100`} />
                </div>
              </section>

              {/* Quality Score */}
              <section className="bg-white border border-[#E3E3E3] rounded-md p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#8A8A8A]">{t('Quality Score')}</h3>
                  <span className="text-3xl font-semibold text-[#1A1A1A] tabular-nums leading-none">
                    {score}
                  </span>
                </div>
                <div className="h-1.5 bg-[#F3F3F3] rounded-full overflow-hidden mb-4">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      score >= 80 ? 'bg-[#047857]' : score >= 50 ? 'bg-[#B45309]' : 'bg-[#DC2626]',
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <StatTile icon={<Clock className="w-4 h-4" />}       tone="neutral" value={formatDuration(totalSec)} label={t('Time taken')} />
                  <StatTile icon={<BarChart3 className="w-4 h-4" />}   tone="brand"   value={`×${mult.toFixed(1)}`}     label={t('Multiplier')} />
                  <StatTile icon={<DollarSign className="w-4 h-4" />}  tone="amber"   value={`₮${earned.toLocaleString()}`} label={t('Reward')} />
                </div>
              </section>

              {/* Quality Factors */}
              <section className="bg-white border border-[#E3E3E3] rounded-md p-5">
                <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-4">
                  {t('Quality Factors')}
                </h3>
                <div className="space-y-4">
                  {QUALITY_FACTORS.map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#1A1A1A]">{t(f.label)}</div>
                        <div className="text-xs text-[#8A8A8A] mt-0.5">{t(f.detail)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Answers */}
              <section className="bg-white border border-[#E3E3E3] rounded-md p-5">
                <button
                  onClick={() => setIsAnswersOpen((o) => !o)}
                  className="w-full flex items-center justify-between mb-4 cursor-pointer"
                >
                  <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider">
                    {t('Answers')} ({QUESTIONS.length} {t('Questions')})
                  </h3>
                  {isAnswersOpen
                    ? <ChevronUp className="w-4 h-4 text-[#8A8A8A]" />
                    : <ChevronDown className="w-4 h-4 text-[#8A8A8A]" />}
                </button>
                {isAnswersOpen && (
                  <div className="space-y-5">
                    {QUESTIONS.map((q, i) => {
                      const answer = resolvedAnswers[q.id] ?? '';
                      return (
                        <div key={q.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#F3F3F3] text-[#1A1A1A] text-xs font-medium flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[#1A1A1A] mb-2 leading-relaxed">{t(q.text)}</div>
                            <div className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                              <MessageSquare className="w-4 h-4 text-[#8A8A8A] shrink-0 mt-0.5" />
                              <span>
                                {answer || (
                                  <span className="italic text-[#8A8A8A]">{t('(no answer)')}</span>
                                )}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#8A8A8A] mt-1 tabular-nums">
                              {q.timeSec}s
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────── Small helpers ─────────────────────────────────────────────── */

interface ProfileCellProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function ProfileCell({ icon: Icon, label, value }: ProfileCellProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] mb-1">
        <Icon className="w-3.5 h-3.5" />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm text-[#1A1A1A] truncate">{value}</div>
    </div>
  );
}

interface StatTileProps {
  icon: React.ReactNode;
  tone: 'neutral' | 'brand' | 'amber';
  value: string;
  label: string;
}

function StatTile({ icon, tone, value, label }: StatTileProps) {
  const tones: Record<StatTileProps['tone'], string> = {
    neutral: 'bg-[#F3F3F3] text-[#4A4A4A]',
    brand:   'bg-[#F3F3F3] text-[#1A1A1A]',
    amber:   'bg-[#FFFBEB] text-[#B45309]',
  };
  return (
    <div className="flex flex-col items-center justify-center p-3 border border-[#F3F3F3] rounded-md text-center">
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center mb-2', tones[tone])}>
        {icon}
      </div>
      <div className="text-sm font-medium text-[#1A1A1A] tabular-nums">{value}</div>
      <div className="text-[11px] text-[#8A8A8A] mt-0.5">{label}</div>
    </div>
  );
}
