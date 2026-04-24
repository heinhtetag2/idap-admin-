import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow, subDays, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarUI } from '@/shared/ui/calendar';
import {
  Search,
  Download,
  CheckCircle2,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  AlertCircle,
  Ban,
  Loader,
  Receipt,
  TrendingUp,
  Wallet,
  X,
  Check,
  Calendar,
  Building2,
  StickyNote,
} from 'lucide-react';

import { BrandSelect } from '@/shared/ui/brand-select';
import type { Payout, PayoutActionLog, PayoutGateway, PayoutStatus } from './payout-data';
import { DEMO_PAYOUTS } from './payout-data';

const CURRENT_ADMIN = { name: 'Hein Htet', initial: 'H' };

type StatusFilter = 'All' | PayoutStatus;
type GatewayFilter = 'All' | PayoutGateway;
type BulkAction = 'approve' | 'reject';
type RowAction = 'approve' | 'reject' | 'retry';

function formatMnt(value: number): string {
  if (value >= 1_000_000) return `₮${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₮${Math.round(value / 1_000)}K`;
  return `₮${value}`;
}

function formatMntExact(value: number): string {
  return `₮${value.toLocaleString('en-US')}`;
}

function getStatusStyles(status: PayoutStatus) {
  switch (status) {
    case 'Pending':    return { badge: 'bg-[#FFFBEB] text-[#B45309]', Icon: Clock };
    case 'Processing': return { badge: 'bg-[#EFF6FF] text-[#1D4ED8]', Icon: Loader };
    case 'Completed':  return { badge: 'bg-[#ECFDF5] text-[#047857]', Icon: CheckCircle2 };
    case 'Failed':     return { badge: 'bg-[#FEF2F2] text-[#B91C1C]', Icon: Ban };
  }
}

function getGatewayStyles(gateway: PayoutGateway) {
  switch (gateway) {
    case 'QPay':          return 'bg-[#EFF6FF] text-[#1D4ED8]';
    case 'Bonum':         return 'bg-[#FFF1EE] text-[#C2410C]';
    case 'Social Pay':    return 'bg-[#F5F3FF] text-[#5B21B6]';
    case 'Bank Transfer': return 'bg-[#F3F3F3] text-[#4A4A4A]';
  }
}

export default function Payouts() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [payouts, setPayouts] = useState<Payout[]>(DEMO_PAYOUTS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [gatewayFilter, setGatewayFilter] = useState<GatewayFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState<
    | { kind: 'bulk'; action: BulkAction; ids: string[] }
    | { kind: 'row'; action: RowAction; payout: Payout }
    | null
  >(null);
  const [note, setNote] = useState('');

  const counts = useMemo(
    () => ({
      total: payouts.length,
      pending: payouts.filter((p) => p.status === 'Pending').length,
      processing: payouts.filter((p) => p.status === 'Processing').length,
      completed: payouts.filter((p) => p.status === 'Completed').length,
      failed: payouts.filter((p) => p.status === 'Failed').length,
      pendingAmount: payouts
        .filter((p) => p.status === 'Pending')
        .reduce((acc, p) => acc + p.amountMnt, 0),
      completedToday: payouts.filter((p) => p.status === 'Completed').length,
      completedTodayAmount: payouts
        .filter((p) => p.status === 'Completed')
        .reduce((acc, p) => acc + p.amountMnt, 0),
    }),
    [payouts],
  );

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'All' ||
    gatewayFilter !== 'All' ||
    dateRange !== undefined;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setGatewayFilter('All');
    setDateRange(undefined);
    setSelectedPreset(null);
  };

  const visible = payouts.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (gatewayFilter !== 'All' && p.gateway !== gatewayFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !p.respondentName.toLowerCase().includes(q) &&
        !p.respondentEmail.toLowerCase().includes(q) &&
        !p.account.toLowerCase().includes(q)
      )
        return false;
    }
    if (dateRange?.from) {
      const requested = new Date(p.requestedAt);
      if (requested < dateRange.from) return false;
      if (dateRange.to && requested > dateRange.to) return false;
    }
    return true;
  });

  const selectablePendingIds = visible
    .filter((p) => p.status === 'Pending')
    .map((p) => p.id);
  const allSelectedInView =
    selectablePendingIds.length > 0 &&
    selectablePendingIds.every((id) => selected.has(id));

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelectedInView) selectablePendingIds.forEach((id) => next.delete(id));
      else selectablePendingIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applyAction = () => {
    if (!confirming) return;
    const ids =
      confirming.kind === 'bulk'
        ? confirming.ids
        : [confirming.payout.id];

    const trimmedNote = note.trim();
    const log: PayoutActionLog = {
      action:
        confirming.action === 'approve' ? 'Approved'
        : confirming.action === 'reject' ? 'Rejected'
        : 'Retried',
      note: trimmedNote || undefined,
      actor: CURRENT_ADMIN.name,
      actorInitial: CURRENT_ADMIN.initial,
      at: new Date().toISOString(),
    };

    setPayouts((prev) =>
      prev.map((p) => {
        if (!ids.includes(p.id)) return p;
        if (confirming.action === 'approve') return { ...p, status: 'Processing', lastAction: log };
        if (confirming.action === 'reject')  return { ...p, status: 'Failed', lastAction: log };
        if (confirming.action === 'retry')   return { ...p, status: 'Processing', lastAction: log };
        return p;
      }),
    );
    if (confirming.kind === 'bulk') setSelected(new Set());
    setConfirming(null);
    setNote('');
  };

  const confirmingPayout =
    confirming?.kind === 'row' ? confirming.payout : null;
  const confirmingCount =
    confirming?.kind === 'bulk' ? confirming.ids.length : 1;

  const actionMeta = confirming
    ? {
        approve: {
          title:
            confirming.kind === 'bulk'
              ? t('Approve {{n}} payouts?', { n: confirmingCount })
              : t('Approve payout?'),
          description: t('Funds will be released to the respondent via the selected gateway. This moves the payout to processing.'),
          cta: confirming.kind === 'bulk' ? t('Approve all') : t('Approve'),
          tone: 'success' as const,
        },
        reject: {
          title:
            confirming.kind === 'bulk'
              ? t('Reject {{n}} payouts?', { n: confirmingCount })
              : t('Reject payout?'),
          description: t('The payout will be marked as failed and the amount returned to the respondent balance.'),
          cta: confirming.kind === 'bulk' ? t('Reject all') : t('Reject'),
          tone: 'danger' as const,
        },
        retry: {
          title: t('Retry payout?'),
          description: t('The payout will be resubmitted to the gateway for processing.'),
          cta: t('Retry'),
          tone: 'success' as const,
        },
      }[confirming.action]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full px-6 md:px-8 xl:px-12 py-8 bg-[#FAFAFA]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#1A1A1A]">{t('Payout Management')}</h1>
          <p className="text-sm text-[#8A8A8A] mt-1">
            {t('Review and release respondent withdrawal requests')}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E3E3E3] rounded-md text-sm font-medium text-[#1A1A1A] hover:bg-[#F3F3F3] transition-colors bg-white shadow-none cursor-pointer">
            <Download className="w-4 h-4" />
            {t('Export CSV')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Pending requests',
            Icon: Clock,
            value: String(counts.pending),
            subtitle: formatMnt(counts.pendingAmount) + ' ' + t('awaiting release'),
          },
          {
            title: 'Pending amount',
            Icon: Wallet,
            value: formatMnt(counts.pendingAmount),
            subtitle: `${counts.pending} ${t('requests')}`,
          },
          {
            title: 'Released today',
            Icon: CheckCircle2,
            value: String(counts.completedToday),
            subtitle: formatMnt(counts.completedTodayAmount) + ' ' + t('paid out'),
          },
          {
            title: "Today's volume",
            Icon: TrendingUp,
            value: formatMnt(counts.completedTodayAmount),
            subtitle: t('Across all gateways'),
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-white border border-[#E3E3E3] rounded-md p-5 flex flex-col justify-center shadow-none hover:border-[#FFDED5] transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[#8A8A8A]">{t(card.title)}</span>
              <div className="p-2 bg-[#F3F3F3] rounded-md text-[#4A4A4A] group-hover:bg-[#FF3C21] group-hover:text-white transition-colors">
                <card.Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#1A1A1A]">{card.value}</div>
            <div className="text-xs text-[#4A4A4A] mt-2">{card.subtitle}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center flex-wrap">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search respondents or accounts...')}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative">
            <button
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E3E3E3] bg-white rounded-md text-sm font-medium text-[#4A4A4A] hover:bg-[#F3F3F3] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors shadow-none cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#8A8A8A]" />
              {dateRange?.from
                ? (dateRange.to ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}` : format(dateRange.from, 'MMM d, yyyy'))
                : t('Requested date')}
            </button>

            {isDateRangeOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#E3E3E3] rounded-md z-10 flex shadow-none">
                <div className="w-48 border-r border-[#E3E3E3] p-2 flex flex-col gap-1">
                  {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months', 'Custom date range'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSelectedPreset(preset);
                        if (preset === 'Last 7 days') setDateRange({ from: subDays(new Date(), 7), to: new Date() });
                        else if (preset === 'Last 30 days') setDateRange({ from: subDays(new Date(), 30), to: new Date() });
                        else if (preset === 'Last 90 days') setDateRange({ from: subDays(new Date(), 90), to: new Date() });
                        else if (preset === 'Last 12 months') setDateRange({ from: subMonths(new Date(), 12), to: new Date() });
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors shadow-none cursor-pointer ${
                        selectedPreset === preset
                          ? 'bg-[#F3F3F3] text-[#1A1A1A] font-medium'
                          : 'text-[#4A4A4A] hover:bg-white'
                      }`}
                    >
                      {t(preset)}
                      {selectedPreset === preset && <Check className="w-4 h-4 text-[#1A1A1A]" />}
                    </button>
                  ))}
                </div>
                <div className="p-4" style={{ '--primary': '#FF3C21', '--primary-foreground': '#FFFFFF' } as React.CSSProperties}>
                  <CalendarUI
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      setSelectedPreset('Custom date range');
                    }}
                    numberOfMonths={2}
                    className="border-0 shadow-none p-0"
                  />
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#F3F3F3]">
                    <button
                      onClick={() => {
                        setDateRange(undefined);
                        setSelectedPreset(null);
                        setIsDateRangeOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors shadow-none cursor-pointer"
                    >
                      {t('Clear')}
                    </button>
                    <button
                      onClick={() => setIsDateRangeOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none cursor-pointer"
                    >
                      {t('Apply')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <BrandSelect
            value={gatewayFilter}
            onValueChange={(v) => setGatewayFilter(v as GatewayFilter)}
            leftIcon={<Building2 />}
            className="sm:w-auto"
            options={[
              { value: 'All', label: t('All gateways') },
              { value: 'QPay', label: t('QPay') },
              { value: 'Bonum', label: t('Bonum') },
              { value: 'Social Pay', label: t('Social Pay') },
              { value: 'Bank Transfer', label: t('Bank Transfer') },
            ]}
          />

          <BrandSelect
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            leftIcon={<CheckCircle />}
            className="sm:w-auto"
            options={[
              { value: 'All', label: t('All Statuses') },
              { value: 'Pending', label: t('Pending') },
              { value: 'Processing', label: t('Processing') },
              { value: 'Completed', label: t('Completed') },
              { value: 'Failed', label: t('Failed') },
            ]}
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center w-9 h-9 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-full transition-colors border border-transparent hover:border-[#E3E3E3] shadow-none cursor-pointer flex-shrink-0"
              title={t('Clear filters')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between gap-3 mb-3 px-4 py-2.5 bg-[#FFF1EE] rounded-md"
          >
            <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
              <span className="font-medium tabular-nums">{selected.size}</span>
              <span className="text-[#4A4A4A]">{t('selected')}</span>
              <button
                onClick={() => setSelected(new Set())}
                className="ml-1 text-xs text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                {t('Clear')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setConfirming({ kind: 'bulk', action: 'reject', ids: [...selected] })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                {t('Reject selected')}
              </button>
              <button
                onClick={() =>
                  setConfirming({ kind: 'bulk', action: 'approve', ids: [...selected] })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#059669] text-white hover:bg-[#047857] transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('Approve selected')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#F3F3F3] overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E3E3E3] text-[#8A8A8A] font-medium bg-[#F7F7F7]">
                <th className="pl-6 pr-3 py-4 w-10">
                  <Checkbox
                    checked={allSelectedInView}
                    onChange={toggleSelectAll}
                    disabled={selectablePendingIds.length === 0}
                    ariaLabel={t('Select all pending')}
                  />
                </th>
                <th className="px-6 py-4 font-medium text-sm">{t('Respondent')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Amount')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Gateway')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Account')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Requested')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Status')}</th>
                <th className="px-6 py-4 font-medium text-sm text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F3F3]">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#8A8A8A]">
                    {t('No payouts match these filters.')}
                  </td>
                </tr>
              ) : (
                visible.map((p, index) => {
                  const statusStyle = getStatusStyles(p.status);
                  const isSelectable = p.status === 'Pending';
                  const isChecked = selected.has(p.id);
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      onClick={() => navigate(`/respondents/${p.respondentId.toLowerCase()}`)}
                      className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                    >
                      <td className="pl-6 pr-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          disabled={!isSelectable}
                          ariaLabel={t('Select payout')}
                        />
                      </td>

                      {/* Respondent */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
                            {p.initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#1A1A1A] truncate">{p.respondentName}</div>
                            <div className="text-xs text-[#8A8A8A] truncate mt-0.5">{p.respondentEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-semibold text-[#1A1A1A] tabular-nums">
                        {formatMntExact(p.amountMnt)}
                      </td>

                      {/* Gateway */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full ${getGatewayStyles(p.gateway)}`}>
                          {p.gateway}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="px-6 py-4 text-[#4A4A4A] tabular-nums text-sm">
                        {p.account}
                      </td>

                      {/* Requested */}
                      <td className="px-6 py-4 text-[#4A4A4A] tabular-nums">
                        <span title={format(new Date(p.requestedAt), 'MMM d, yyyy HH:mm')}>
                          {formatDistanceToNow(new Date(p.requestedAt), { addSuffix: true })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${statusStyle.badge}`}
                          >
                            <statusStyle.Icon className={`w-3 h-3 ${p.status === 'Processing' ? 'animate-spin' : ''}`} />
                            {t(p.status)}
                          </span>
                          {p.lastAction && (
                            <ActionTrail log={p.lastAction} />
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'Pending' && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirming({ kind: 'row', action: 'approve', payout: p }); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5] transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                {t('Approve')}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirming({ kind: 'row', action: 'reject', payout: p }); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-white text-[#4A4A4A] border border-[#E3E3E3] hover:bg-[#F3F3F3] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                {t('Reject')}
                              </button>
                            </>
                          )}
                          {p.status === 'Failed' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirming({ kind: 'row', action: 'retry', payout: p }); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#FFF1EE] text-[#C2410C] hover:bg-[#FED7AA] transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              {t('Retry')}
                            </button>
                          )}
                          {(p.status === 'Processing' || p.status === 'Completed') && (
                            <span className="text-xs text-[#B5B5B5]">—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F3F3] bg-white">
          <span className="text-sm text-[#8A8A8A]">
            {t('Showing')} 1 {t('to')} {visible.length} {t('of')} {counts.total} {t('payouts')}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E3E3E3] rounded-md bg-white text-[#8A8A8A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('Previous')}
            </button>
            <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-medium border border-[#FF3C21] rounded-md bg-[#FF3C21] text-white tabular-nums cursor-default">
              1
            </button>
            <button className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E3E3E3] rounded-md bg-white text-[#4A4A4A] hover:bg-[#F3F3F3] transition-colors cursor-pointer">
              {t('Next')}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirming && actionMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A1A]/30 flex items-center justify-center z-50 p-4"
            onClick={() => { setConfirming(null); setNote(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white rounded-md w-full max-w-sm shadow-none border border-[#F3F3F3] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F3F3]">
                <h2 className="text-lg font-medium text-[#1A1A1A]">{actionMeta.title}</h2>
                <button
                  onClick={() => { setConfirming(null); setNote(''); }}
                  className="text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{actionMeta.description}</p>
                {confirmingPayout && (
                  <div className="mt-3 p-3 bg-white border border-[#E3E3E3] rounded-md flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
                      {confirmingPayout.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#1A1A1A] text-sm truncate">
                        {confirmingPayout.respondentName}
                      </div>
                      <div className="text-[#8A8A8A] text-xs truncate">
                        {confirmingPayout.gateway} · {confirmingPayout.account}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-[#1A1A1A] tabular-nums">
                      {formatMntExact(confirmingPayout.amountMnt)}
                    </div>
                  </div>
                )}
                {confirming.kind === 'bulk' && (
                  <div className="mt-3 p-3 bg-[#FAFAFA] border border-[#E3E3E3] rounded-md">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4A4A4A]">{t('Total amount')}</span>
                      <span className="font-semibold text-[#1A1A1A] tabular-nums">
                        {formatMntExact(
                          payouts
                            .filter((p) => confirming.ids.includes(p.id))
                            .reduce((acc, p) => acc + p.amountMnt, 0),
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {actionMeta.tone === 'danger' && (
                  <p className="mt-4 text-[#B91C1C] text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {t('The amount will return to the respondent balance.')}
                  </p>
                )}

                <div className="mt-4">
                  <label className="text-xs font-medium text-[#4A4A4A] mb-1.5 block">
                    {t('Internal note')} <span className="text-[#8A8A8A] font-normal">({t('optional')})</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder={t('Why are you taking this action? Visible to admins only.')}
                    className="w-full resize-none px-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F3F3]">
                <button
                  onClick={() => { setConfirming(null); setNote(''); }}
                  className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={applyAction}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${
                    actionMeta.tone === 'danger'
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                      : 'bg-[#059669] hover:bg-[#047857]'
                  }`}
                >
                  {actionMeta.cta}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionTrail({ log }: { log: PayoutActionLog }) {
  return (
    <div className="relative group">
      <div className="w-5 h-5 rounded-full bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center cursor-default">
        <StickyNote className="w-3 h-3" />
      </div>
      <div className="absolute right-0 top-full mt-1.5 z-10 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none">
        <div className="bg-white border border-[#E3E3E3] rounded-md p-3 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-[#FF3C21] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
              {log.actorInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#1A1A1A] truncate">
                {log.action} · {log.actor}
              </div>
              <div className="text-[10px] text-[#8A8A8A] tabular-nums">
                {format(new Date(log.at), 'MMM d, yyyy · HH:mm')}
              </div>
            </div>
          </div>
          {log.note ? (
            <p className="text-xs text-[#4A4A4A] leading-relaxed whitespace-pre-wrap">
              {log.note}
            </p>
          ) : (
            <p className="text-xs text-[#8A8A8A] italic">No note left</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-checked={checked}
      role="checkbox"
      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
        checked
          ? 'bg-[#FF3C21] border-[#FF3C21]'
          : 'bg-white border-[#D4D4D4] hover:border-[#FF3C21]'
      }`}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  );
}
