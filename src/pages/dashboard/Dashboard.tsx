import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  ClipboardList,
  UsersRound,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { BrandSelect } from '@/shared/ui/brand-select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

import { DEMO_SURVEYS } from '@/pages/surveys/survey-data';
import { DEMO_COMPANIES } from '@/pages/companies/company-data';
import { DEMO_RESPONDENTS } from '@/pages/respondents/respondent-data';
import { DEMO_PAYOUTS } from '@/pages/payouts/payout-data';

type RangeKey = '7d' | '30d' | 'this_month' | 'last_month';

interface ChartPoint { name: string; value: number; }
interface RangeData {
  response: ChartPoint[];
  payout: ChartPoint[];
  responseTrend: number;
  payoutTrend: number;
  subtitle: string;
}

const CHART_DATA: Record<RangeKey, RangeData> = {
  '7d': {
    response: [
      { name: 'Mon', value: 420 }, { name: 'Tue', value: 512 }, { name: 'Wed', value: 388 },
      { name: 'Thu', value: 604 }, { name: 'Fri', value: 731 }, { name: 'Sat', value: 489 }, { name: 'Sun', value: 556 },
    ],
    payout: [
      { name: 'Mon', value: 180_000 }, { name: 'Tue', value: 240_000 }, { name: 'Wed', value: 130_000 },
      { name: 'Thu', value: 320_000 }, { name: 'Fri', value: 410_000 }, { name: 'Sat', value: 260_000 }, { name: 'Sun', value: 220_000 },
    ],
    responseTrend: 12.4,
    payoutTrend: 8.1,
    subtitle: 'in the last 7 days',
  },
  '30d': {
    response: [
      { name: 'Week 1', value: 2_480 }, { name: 'Week 2', value: 3_120 }, { name: 'Week 3', value: 2_870 }, { name: 'Week 4', value: 3_940 },
    ],
    payout: [
      { name: 'Week 1', value: 920_000 }, { name: 'Week 2', value: 1_180_000 }, { name: 'Week 3', value: 1_040_000 }, { name: 'Week 4', value: 1_420_000 },
    ],
    responseTrend: 8.7,
    payoutTrend: 14.2,
    subtitle: 'in the last 30 days',
  },
  this_month: {
    response: [
      { name: 'W1', value: 2_100 }, { name: 'W2', value: 2_980 }, { name: 'W3', value: 3_410 }, { name: 'W4', value: 1_760 },
    ],
    payout: [
      { name: 'W1', value: 780_000 }, { name: 'W2', value: 1_120_000 }, { name: 'W3', value: 1_280_000 }, { name: 'W4', value: 620_000 },
    ],
    responseTrend: 6.1,
    payoutTrend: 9.4,
    subtitle: 'this month',
  },
  last_month: {
    response: [
      { name: 'W1', value: 1_880 }, { name: 'W2', value: 2_540 }, { name: 'W3', value: 3_010 }, { name: 'W4', value: 2_290 },
    ],
    payout: [
      { name: 'W1', value: 980_000 }, { name: 'W2', value: 1_240_000 }, { name: 'W3', value: 1_380_000 }, { name: 'W4', value: 1_100_000 },
    ],
    responseTrend: -2.3,
    payoutTrend: 5.8,
    subtitle: 'last month',
  },
};

function formatMntCompact(value: number): string {
  if (value >= 1_000_000) return `₮${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₮${Math.round(value / 1_000)}K`;
  return `₮${value}`;
}

function formatMntExact(value: number): string {
  return `₮${value.toLocaleString('en-US')}`;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<RangeKey>('7d');
  const range = CHART_DATA[dateRange];

  const responseTotal = range.response.reduce((sum, d) => sum + d.value, 0);
  const payoutTotal = range.payout.reduce((sum, d) => sum + d.value, 0);

  const platformStats = useMemo(() => {
    const approvedCompanies = DEMO_COMPANIES.filter((c) => c.status === 'Approved').length;
    const pendingCompanies = DEMO_COMPANIES.filter((c) => c.status === 'Pending').length;
    const activeSurveys = DEMO_SURVEYS.filter((s) => s.status === 'Active').length;
    const activeRespondents = DEMO_RESPONDENTS.filter((r) => r.status === 'Active').length;
    const warnedRespondents = DEMO_RESPONDENTS.filter((r) => r.status === 'Warned').length;
    const pendingPayouts = DEMO_PAYOUTS.filter((p) => p.status === 'Pending');
    const pendingPayoutAmount = pendingPayouts.reduce((acc, p) => acc + p.amountMnt, 0);
    return {
      approvedCompanies,
      pendingCompanies,
      activeSurveys,
      activeRespondents,
      warnedRespondents,
      pendingPayoutCount: pendingPayouts.length,
      pendingPayoutAmount,
    };
  }, []);

  const stats = [
    {
      title: 'Active companies',
      value: String(platformStats.approvedCompanies),
      Icon: Building2,
      trend: platformStats.pendingCompanies > 0 ? `${platformStats.pendingCompanies} pending` : undefined,
      tone: 'neutral' as const,
      subtitle: `${DEMO_COMPANIES.length} total on the platform`,
      href: '/companies',
    },
    {
      title: 'Live surveys',
      value: String(platformStats.activeSurveys),
      Icon: ClipboardList,
      trend: '+6.2%',
      tone: 'positive' as const,
      subtitle: `${DEMO_SURVEYS.length} total across companies`,
      href: '/surveys',
    },
    {
      title: 'Active respondents',
      value: String(platformStats.activeRespondents),
      Icon: UsersRound,
      trend: platformStats.warnedRespondents > 0 ? `${platformStats.warnedRespondents} warned` : undefined,
      tone: platformStats.warnedRespondents > 0 ? 'warning' as const : 'neutral' as const,
      subtitle: `${DEMO_RESPONDENTS.length} total respondents`,
      href: '/respondents',
    },
    {
      title: 'Pending payouts',
      value: String(platformStats.pendingPayoutCount),
      Icon: Wallet,
      trend: formatMntCompact(platformStats.pendingPayoutAmount),
      tone: 'neutral' as const,
      subtitle: t('Awaiting release'),
      href: '/payouts',
    },
  ];

  const pendingCompanies = DEMO_COMPANIES.filter((c) => c.status === 'Pending').slice(0, 3);
  const pendingPayouts = DEMO_PAYOUTS.filter((p) => p.status === 'Pending').slice(0, 3);

  // Top companies by lifetime spend
  const topCompanies = [...DEMO_COMPANIES]
    .filter((c) => c.status === 'Approved')
    .sort((a, b) => b.totalSpentMnt - a.totalSpentMnt)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto w-full px-6 md:px-8 xl:px-12 py-8 bg-[#FAFAFA]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif text-[#0A0A0A]">{t('Platform Dashboard')}</h1>
          <p className="text-sm text-[#71717A] mt-1">
            {t('Overview of companies, surveys, respondents, and payouts across the platform.')}
          </p>
        </div>
        <div className="flex gap-3">
          <BrandSelect
            value={dateRange}
            onValueChange={(v) => setDateRange(v as RangeKey)}
            leftIcon={<Calendar />}
            ariaLabel={t('Chart range')}
            options={[
              { value: '7d', label: t('Last 7 days') },
              { value: '30d', label: t('Last 30 days') },
              { value: 'this_month', label: t('This month') },
              { value: 'last_month', label: t('Last month') },
            ]}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.button
            key={stat.title}
            onClick={() => navigate(stat.href)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="text-left bg-white border border-[#E4E4E7] rounded-md p-5 flex flex-col justify-center shadow-none hover:border-[#D4D4D8] transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[#71717A]">{t(stat.title)}</span>
              <div className="p-2 bg-[#F4F4F5] rounded-md text-[#52525B] group-hover:bg-[#FF3C21] group-hover:text-white transition-colors">
                <stat.Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#0A0A0A] tabular-nums">{stat.value}</div>
            <div className="text-xs flex items-center gap-1.5 font-medium mt-2">
              {stat.trend && (
                <>
                  <span
                    className={
                      stat.tone === 'positive'
                        ? 'text-[#047857] flex items-center gap-0.5'
                        : stat.tone === 'warning'
                          ? 'text-[#B45309]'
                          : 'text-[#52525B]'
                    }
                  >
                    {stat.tone === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                  <span className="text-[#D4D4D8]">•</span>
                </>
              )}
              <span className="text-[#71717A] font-normal">{t(stat.subtitle)}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Moderation queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending companies */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white border border-[#E4E4E7] rounded-md shadow-none overflow-hidden"
        >
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#FFFBEB] text-[#B45309] rounded-md shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#0A0A0A]">
                  {t('Companies awaiting review')}
                </h2>
                <p className="text-xs text-[#71717A] mt-0.5">
                  {platformStats.pendingCompanies} {t('pending applications')}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/companies')}
              className="flex items-center gap-1 text-xs font-medium text-[#FF3C21] hover:text-[#E63419] transition-colors cursor-pointer shrink-0"
            >
              {t('Review all')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F4F4F5] border-t border-[#F4F4F5]">
            {pendingCompanies.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[#71717A]">
                {t('Nothing pending. All caught up.')}
              </div>
            ) : pendingCompanies.map((company) => (
              <button
                key={company.id}
                onClick={() => navigate(`/companies/${company.id.toLowerCase()}`)}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-semibold shrink-0">
                  {company.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#0A0A0A] truncate">
                    {company.name}
                  </div>
                  <div className="text-xs text-[#71717A] mt-0.5 truncate">
                    {company.plan} · {company.industry}
                  </div>
                </div>
                <span className="text-xs text-[#71717A] tabular-nums hidden sm:inline">
                  {formatDistanceToNow(new Date(company.joined), { addSuffix: true })}
                </span>
                <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#52525B] transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pending payouts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white border border-[#E4E4E7] rounded-md shadow-none overflow-hidden"
        >
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#FFF1EE] text-[#FF3C21] rounded-md shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#0A0A0A]">{t('Pending payouts')}</h2>
                <p className="text-xs text-[#71717A] mt-0.5">
                  {formatMntCompact(platformStats.pendingPayoutAmount)} {t('awaiting release')}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/payouts')}
              className="flex items-center gap-1 text-xs font-medium text-[#FF3C21] hover:text-[#E63419] transition-colors cursor-pointer shrink-0"
            >
              {t('Release all')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F4F4F5] border-t border-[#F4F4F5]">
            {pendingPayouts.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[#71717A]">
                {t('No payouts waiting.')}
              </div>
            ) : pendingPayouts.map((payout) => (
              <button
                key={payout.id}
                onClick={() => navigate('/payouts')}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-semibold shrink-0">
                  {payout.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#0A0A0A] truncate">
                    {payout.respondentName}
                  </div>
                  <div className="text-xs text-[#71717A] mt-0.5 truncate">
                    {payout.gateway} · {payout.account}
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#0A0A0A] tabular-nums shrink-0">
                  {formatMntExact(payout.amountMnt)}
                </div>
                <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#52525B] transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Response Collection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white border border-[#E4E4E7] rounded-md p-6 shadow-none"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#0A0A0A]">
                {t('Response volume')}
              </h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                {t('All surveys')} {t(range.subtitle)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                {responseTotal.toLocaleString()}
              </div>
              <div
                className={`text-xs font-medium flex items-center gap-0.5 justify-end ${
                  range.responseTrend >= 0 ? 'text-[#047857]' : 'text-[#DC2626]'
                }`}
              >
                {range.responseTrend >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(range.responseTrend).toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={range.response} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3C21" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF3C21" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#A1A1AA' }}
                  formatter={(value: number) => [`${value.toLocaleString()} responses`, '']}
                  cursor={{ stroke: '#E4E4E7', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="value" stroke="#FF3C21" strokeWidth={2} fillOpacity={1} fill="url(#colorResponses)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payout Volume */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white border border-[#E4E4E7] rounded-md p-6 shadow-none"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#0A0A0A]">{t('Payout volume')}</h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                {t('Released to respondents')} {t(range.subtitle)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-[#0A0A0A] tabular-nums">
                {formatMntCompact(payoutTotal)}
              </div>
              <div
                className={`text-xs font-medium flex items-center gap-0.5 justify-end ${
                  range.payoutTrend >= 0 ? 'text-[#047857]' : 'text-[#DC2626]'
                }`}
              >
                {range.payoutTrend >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(range.payoutTrend).toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={range.payout} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} tickFormatter={(v: number) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#A1A1AA' }}
                  formatter={(value: number) => [formatMntExact(value), '']}
                  cursor={{ fill: '#F4F4F5' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {range.payout.map((entry, index) => (
                    <Cell
                      key={`cell-${index}-${entry.name}`}
                      fill={index === range.payout.length - 1 ? '#FF3C21' : '#E4E4E7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top companies */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white border border-[#E4E4E7] rounded-md shadow-none overflow-hidden"
      >
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A]">{t('Top companies by spend')}</h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              {t('Ranked by lifetime platform spend')}
            </p>
          </div>
          <button
            onClick={() => navigate('/companies')}
            className="flex items-center gap-1 text-xs font-medium text-[#FF3C21] hover:text-[#E63419] transition-colors cursor-pointer shrink-0"
          >
            {t('View all')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F4F4F5] border-t border-[#F4F4F5]">
          {topCompanies.map((company) => {
            const companySurveys = DEMO_SURVEYS.filter((s) => s.companyId === company.id).length;
            return (
              <button
                key={company.id}
                onClick={() => navigate(`/companies/${company.id.toLowerCase()}`)}
                className="w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 px-6 py-4 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-semibold shrink-0">
                  {company.initial}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-[#0A0A0A] truncate">{company.name}</div>
                  <div className="text-xs text-[#71717A] mt-0.5">{company.industry}</div>
                </div>
                <div className="hidden sm:block text-xs text-[#71717A] tabular-nums">
                  {companySurveys} {t('surveys')}
                </div>
                <div className="text-sm font-semibold text-[#0A0A0A] tabular-nums">
                  {formatMntCompact(company.totalSpentMnt)}
                </div>
                <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#52525B] transition-colors" />
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
