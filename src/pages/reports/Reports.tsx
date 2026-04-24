import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Search,
  Download,
  CheckCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Ban,
  XCircle,
  AlertCircle,
  Shield,
  X,
  ClipboardList,
  Tag,
  ExternalLink,
  Building2,
} from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/shared/ui/drawer';
import { BrandSelect } from '@/shared/ui/brand-select';
import { AdminNotes, type AdminNote } from '@/widgets/admin-notes';
import type {
  Report,
  ReportReason,
  ReportResolution,
  ReportSeverity,
  ReportStatus,
} from './report-data';
import { DEMO_REPORTS } from './report-data';

type StatusFilter = 'All' | ReportStatus;
type ReasonFilter = 'All' | ReportReason;
type SeverityFilter = 'All' | ReportSeverity;
type RowAction = 'dismiss' | 'warn' | 'suspend';

function reportNoteSeedFor(reportId: string): AdminNote[] {
  if (reportId === 'rp-003') {
    return [{
      id: `seed-${reportId}-1`,
      author: 'Sarnai',
      authorInitial: 'S',
      content: 'Contacted Mongolian Telecom — they confirmed the ID request was from a partner vendor, not them. Waiting for proof.',
      createdAt: '2026-04-22T11:10:00',
    }];
  }
  if (reportId === 'rp-007') {
    return [{
      id: `seed-${reportId}-1`,
      author: 'Batbayar',
      authorInitial: 'B',
      content: 'Screenshots received from respondent. Escalating to TDB legal.',
      createdAt: '2026-04-21T09:40:00',
    }];
  }
  return [];
}

function getStatusStyles(status: ReportStatus) {
  switch (status) {
    case 'New':          return { badge: 'bg-[#FEF2F2] text-[#B91C1C]', Icon: ShieldAlert };
    case 'Under review': return { badge: 'bg-[#FFFBEB] text-[#B45309]', Icon: Clock };
    case 'Resolved':     return { badge: 'bg-[#ECFDF5] text-[#047857]', Icon: CheckCircle2 };
    case 'Dismissed':    return { badge: 'bg-[#F3F3F3] text-[#8A8A8A]', Icon: XCircle };
  }
}

function getSeverityStyles(severity: ReportSeverity) {
  switch (severity) {
    case 'Low':    return { badge: 'bg-[#F3F3F3] text-[#4A4A4A]', dot: 'bg-[#8A8A8A]' };
    case 'Medium': return { badge: 'bg-[#FFFBEB] text-[#B45309]', dot: 'bg-[#B45309]' };
    case 'High':   return { badge: 'bg-[#FEF2F2] text-[#B91C1C]', dot: 'bg-[#B91C1C]' };
  }
}

function getReasonStyles(reason: ReportReason) {
  switch (reason) {
    case 'Harassment':        return 'bg-[#FEF2F2] text-[#B91C1C]';
    case 'Misleading survey': return 'bg-[#FFFBEB] text-[#B45309]';
    case 'Non-payment':       return 'bg-[#FFF1EE] text-[#C2410C]';
    case 'Privacy violation': return 'bg-[#F5F3FF] text-[#5B21B6]';
    case 'Spam':              return 'bg-[#EFF6FF] text-[#1D4ED8]';
    case 'Other':             return 'bg-[#F3F3F3] text-[#4A4A4A]';
  }
}

export default function Reports() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const companyIdParam = searchParams.get('companyId');

  const [reports, setReports] = useState<Report[]>(DEMO_REPORTS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>('All');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openReport, setOpenReport] = useState<Report | null>(null);
  const [confirming, setConfirming] = useState<
    { action: RowAction; report: Report } | null
  >(null);

  const scoped = useMemo(
    () =>
      companyIdParam
        ? reports.filter(
            (r) => r.companyId.toLowerCase() === companyIdParam.toLowerCase(),
          )
        : reports,
    [reports, companyIdParam],
  );

  const counts = useMemo(
    () => ({
      total: scoped.length,
      newly: scoped.filter((r) => r.status === 'New').length,
      review: scoped.filter((r) => r.status === 'Under review').length,
      highSeverity: scoped.filter(
        (r) =>
          r.severity === 'High' &&
          (r.status === 'New' || r.status === 'Under review'),
      ).length,
      resolved: scoped.filter(
        (r) => r.status === 'Resolved' || r.status === 'Dismissed',
      ).length,
    }),
    [scoped],
  );

  const scopedCompanyName = useMemo(() => {
    if (!companyIdParam) return null;
    const match = reports.find(
      (r) => r.companyId.toLowerCase() === companyIdParam.toLowerCase(),
    );
    return match?.companyName ?? companyIdParam.toUpperCase();
  }, [companyIdParam, reports]);

  const clearCompanyScope = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('companyId');
    setSearchParams(next, { replace: true });
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'All' ||
    reasonFilter !== 'All' ||
    severityFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setReasonFilter('All');
    setSeverityFilter('All');
  };

  const visible = reports.filter((r) => {
    if (companyIdParam && r.companyId.toLowerCase() !== companyIdParam.toLowerCase()) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (reasonFilter !== 'All' && r.reason !== reasonFilter) return false;
    if (severityFilter !== 'All' && r.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !r.companyName.toLowerCase().includes(q) &&
        !r.respondentName.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const resolutionFor = (action: RowAction): ReportResolution => {
    if (action === 'dismiss') return 'Dismissed';
    if (action === 'warn') return 'Warned';
    return 'Suspended';
  };

  const applyAction = () => {
    if (!confirming) return;
    const { action, report } = confirming;
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== report.id) return r;
        return {
          ...r,
          status: action === 'dismiss' ? 'Dismissed' : 'Resolved',
          resolvedAt: new Date().toISOString(),
          resolution: resolutionFor(action),
        };
      }),
    );
    if (openReport?.id === report.id) {
      setOpenReport(null);
    }
    setConfirming(null);
  };

  const actionMeta = confirming
    ? {
        dismiss: {
          title: t('Dismiss report?'),
          description: t('The report will be marked as dismissed without action against the company. The respondent will be notified.'),
          cta: t('Dismiss'),
          tone: 'neutral' as const,
        },
        warn: {
          title: t('Warn company?'),
          description: t('A formal warning will be sent to the company. Their account status stays active but the warning is recorded.'),
          cta: t('Warn company'),
          tone: 'warning' as const,
        },
        suspend: {
          title: t('Suspend company?'),
          description: t('The company will lose platform access immediately. All active surveys will be paused until reinstated.'),
          cta: t('Suspend company'),
          tone: 'danger' as const,
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
          <h1 className="text-3xl font-serif text-[#1A1A1A]">{t('Reports')}</h1>
          <p className="text-sm text-[#8A8A8A] mt-1">
            {t('Review reports submitted by respondents against companies')}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E3E3E3] rounded-md text-sm font-medium text-[#1A1A1A] hover:bg-[#F3F3F3] transition-colors bg-white shadow-none cursor-pointer">
            <Download className="w-4 h-4" />
            {t('Export CSV')}
          </button>
        </div>
      </div>

      {/* Company scope chip */}
      {companyIdParam && scopedCompanyName && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-[#FFF1EE] rounded-md">
          <Building2 className="w-4 h-4 text-[#FF3C21]" />
          <span className="text-sm text-[#4A4A4A]">
            {t('Scoped to')}{' '}
            <button
              onClick={() => navigate(`/companies/${companyIdParam.toLowerCase()}`)}
              className="font-medium text-[#1A1A1A] hover:text-[#FF3C21] transition-colors cursor-pointer"
            >
              {scopedCompanyName}
            </button>
          </span>
          <button
            onClick={clearCompanyScope}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            {t('Show all companies')}
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'New reports',
            Icon: ShieldAlert,
            value: String(counts.newly),
            subtitle: t('Awaiting triage'),
          },
          {
            title: 'Under review',
            Icon: Clock,
            value: String(counts.review),
            subtitle: t('Currently investigating'),
          },
          {
            title: 'High severity open',
            Icon: AlertOctagon,
            value: String(counts.highSeverity),
            subtitle: t('Needs priority action'),
          },
          {
            title: 'Resolved',
            Icon: Shield,
            value: String(counts.resolved),
            subtitle: t('Dismissed or actioned'),
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
            placeholder={t('Search companies, respondents, description...')}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto flex-wrap">
          <BrandSelect
            value={reasonFilter}
            onValueChange={(v) => setReasonFilter(v as ReasonFilter)}
            leftIcon={<Tag />}
            className="sm:w-auto"
            options={[
              { value: 'All', label: t('All reasons') },
              { value: 'Harassment', label: t('Harassment') },
              { value: 'Misleading survey', label: t('Misleading survey') },
              { value: 'Non-payment', label: t('Non-payment') },
              { value: 'Privacy violation', label: t('Privacy violation') },
              { value: 'Spam', label: t('Spam') },
              { value: 'Other', label: t('Other') },
            ]}
          />

          <BrandSelect
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}
            leftIcon={<AlertTriangle />}
            className="sm:w-auto"
            options={[
              { value: 'All', label: t('All severities') },
              { value: 'High', label: t('High') },
              { value: 'Medium', label: t('Medium') },
              { value: 'Low', label: t('Low') },
            ]}
          />

          <BrandSelect
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            leftIcon={<CheckCircle />}
            className="sm:w-auto"
            options={[
              { value: 'All', label: t('All Statuses') },
              { value: 'New', label: t('New') },
              { value: 'Under review', label: t('Under review') },
              { value: 'Resolved', label: t('Resolved') },
              { value: 'Dismissed', label: t('Dismissed') },
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

      {/* Table */}
      <div className="bg-white rounded-md border border-[#F3F3F3] overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E3E3E3] text-[#8A8A8A] font-medium bg-[#F7F7F7]">
                <th className="pl-6 pr-3 py-4 font-medium text-sm">{t('Reported company')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Respondent')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Reason')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Severity')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Submitted')}</th>
                <th className="px-6 py-4 font-medium text-sm">{t('Status')}</th>
                <th className="px-6 py-4 font-medium text-sm text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F3F3]">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#8A8A8A]">
                    {t('No reports match these filters.')}
                  </td>
                </tr>
              ) : (
                visible.map((r, index) => {
                  const statusStyle = getStatusStyles(r.status);
                  const sevStyle = getSeverityStyles(r.severity);
                  const isOpen = r.status === 'New' || r.status === 'Under review';
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      onClick={() => setOpenReport(r)}
                      className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                    >
                      {/* Company */}
                      <td className="pl-6 pr-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
                            {r.companyInitial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#1A1A1A] truncate">{r.companyName}</div>
                            {r.surveyTitle && (
                              <div className="text-xs text-[#8A8A8A] truncate mt-0.5">{r.surveyTitle}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Respondent */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center text-xs font-medium shrink-0">
                            {r.respondentInitial}
                          </div>
                          <span className="text-sm text-[#1A1A1A] truncate">{r.respondentName}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full ${getReasonStyles(r.reason)}`}>
                          {t(r.reason)}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${sevStyle.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dot}`} />
                          {t(r.severity)}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-4 text-[#4A4A4A] tabular-nums">
                        <span title={format(new Date(r.submittedAt), 'MMM d, yyyy HH:mm')}>
                          {formatDistanceToNow(new Date(r.submittedAt), { addSuffix: true })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${statusStyle.badge}`}
                        >
                          <statusStyle.Icon className="w-3 h-3" />
                          {t(r.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {isOpen ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirming({ action: 'warn', report: r }); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#FFFBEB] text-[#B45309] hover:bg-[#FDE68A] transition-colors cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                {t('Warn')}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirming({ action: 'suspend', report: r }); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FECACA] transition-colors cursor-pointer"
                              >
                                <Ban className="w-3 h-3" />
                                {t('Suspend')}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirming({ action: 'dismiss', report: r }); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-white text-[#4A4A4A] border border-[#E3E3E3] hover:bg-[#F3F3F3] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                {t('Dismiss')}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-[#B5B5B5]">
                              {r.resolution ? t(r.resolution) : '—'}
                            </span>
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
            {t('Showing')} 1 {t('to')} {visible.length} {t('of')} {counts.total} {t('reports')}
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

      {/* Report Detail Drawer */}
      <Drawer
        direction="right"
        open={openReport !== null}
        onOpenChange={(v) => { if (!v) setOpenReport(null); }}
      >
        <DrawerContent className="!max-w-lg data-[vaul-drawer-direction=right]:sm:!max-w-lg bg-white border-l border-[#E3E3E3] p-0">
          {openReport && (
            <ReportDrawerBody
              report={openReport}
              onClose={() => setOpenReport(null)}
              onNavigate={(path) => { setOpenReport(null); navigate(path); }}
              onAction={(action) => {
                const r = openReport;
                setOpenReport(null);
                setConfirming({ action, report: r });
              }}
            />
          )}
        </DrawerContent>
      </Drawer>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirming && actionMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A1A]/30 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirming(null)}
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
                  onClick={() => setConfirming(null)}
                  className="text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{actionMeta.description}</p>
                <div className="mt-3 p-3 bg-white border border-[#E3E3E3] rounded-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
                    {confirming.report.companyInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#1A1A1A] text-sm truncate">{confirming.report.companyName}</div>
                    <div className="text-[#8A8A8A] text-xs truncate">
                      {t(confirming.report.reason)} · {t(confirming.report.severity)}
                    </div>
                  </div>
                </div>
                {actionMeta.tone === 'danger' && (
                  <p className="mt-4 text-[#B91C1C] text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {t('This action can be reversed from the company detail page.')}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F3F3]">
                <button
                  onClick={() => setConfirming(null)}
                  className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={applyAction}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    actionMeta.tone === 'danger'
                      ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                      : actionMeta.tone === 'warning'
                        ? 'bg-[#B45309] text-white hover:bg-[#92400E]'
                        : 'bg-[#1A1A1A] text-white hover:bg-[#303030]'
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

function ReportDrawerBody({
  report,
  onClose,
  onNavigate,
  onAction,
}: {
  report: Report;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onAction: (action: RowAction) => void;
}) {
  const { t } = useTranslation();
  const statusStyle = getStatusStyles(report.status);
  const sevStyle = getSeverityStyles(report.severity);
  const isOpen = report.status === 'New' || report.status === 'Under review';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#F3F3F3] flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <DrawerTitle className="text-base font-medium text-[#1A1A1A]">
            {t('Report')} {report.id.toUpperCase()}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-[#8A8A8A] mt-0.5">
            {t('Submitted')}{' '}
            {formatDistanceToNow(new Date(report.submittedAt), { addSuffix: true })}
          </DrawerDescription>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0"
          aria-label={t('Close')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Badges strip */}
      <div className="px-6 py-4 border-b border-[#F3F3F3] flex items-center gap-2 flex-wrap shrink-0">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${statusStyle.badge}`}>
          <statusStyle.Icon className="w-3 h-3" />
          {t(report.status)}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${sevStyle.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dot}`} />
          {t(report.severity)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full ${getReasonStyles(report.reason)}`}>
          {t(report.reason)}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Reported company */}
        <section className="px-6 py-5 border-b border-[#F3F3F3]">
          <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-3">
            {t('Reported company')}
          </h3>
          <button
            onClick={() => onNavigate(`/companies/${report.companyId.toLowerCase()}`)}
            className="w-full flex items-center gap-3 p-3 bg-white border border-[#E3E3E3] rounded-md hover:bg-[#FAFAFA] transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-md bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
              {report.companyInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[#1A1A1A] truncate">{report.companyName}</div>
              <div className="text-xs text-[#8A8A8A] truncate">{report.companyId.toUpperCase()}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#8A8A8A] shrink-0" />
          </button>
        </section>

        {/* Reported by */}
        <section className="px-6 py-5 border-b border-[#F3F3F3]">
          <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-3">
            {t('Reported by')}
          </h3>
          <button
            onClick={() => onNavigate(`/respondents/${report.respondentId.toLowerCase()}`)}
            className="w-full flex items-center gap-3 p-3 bg-white border border-[#E3E3E3] rounded-md hover:bg-[#FAFAFA] transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center text-sm font-medium shrink-0">
              {report.respondentInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[#1A1A1A] truncate">{report.respondentName}</div>
              <div className="text-xs text-[#8A8A8A] truncate">{report.respondentId.toUpperCase()}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#8A8A8A] shrink-0" />
          </button>
        </section>

        {/* Survey reference */}
        {report.surveyId && report.surveyTitle && (
          <section className="px-6 py-5 border-b border-[#F3F3F3]">
            <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-3">
              {t('Related survey')}
            </h3>
            <button
              onClick={() => onNavigate(`/surveys/${report.surveyId!.toLowerCase()}`)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-[#E3E3E3] rounded-md hover:bg-[#FAFAFA] transition-colors cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-md bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[#1A1A1A] truncate">{report.surveyTitle}</div>
                <div className="text-xs text-[#8A8A8A] truncate">{report.surveyId.toUpperCase()}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8A8A8A] shrink-0" />
            </button>
          </section>
        )}

        {/* Description */}
        <section className="px-6 py-5 border-b border-[#F3F3F3]">
          <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-3">
            {t('Report description')}
          </h3>
          <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </section>

        {/* Admin notes */}
        <section className="px-6 py-5 border-b border-[#F3F3F3]">
          <AdminNotes
            storageKey={`report-${report.id}`}
            seedNotes={reportNoteSeedFor(report.id)}
            title={t('Investigation notes')}
            description={t('Your team-only log for this report')}
            placeholder={t('Log what you found, who you contacted...')}
          />
        </section>

        {/* Resolution */}
        {!isOpen && (
          <section className="px-6 py-5">
            <h3 className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider mb-3">
              {t('Resolution')}
            </h3>
            <div className="p-3 bg-[#FAFAFA] border border-[#F3F3F3] rounded-md space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A8A8A]">{t('Outcome')}</span>
                <span className="font-medium text-[#1A1A1A]">
                  {report.resolution ? t(report.resolution) : '—'}
                </span>
              </div>
              {report.resolvedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A8A8A]">{t('Resolved')}</span>
                  <span className="font-medium text-[#1A1A1A] tabular-nums">
                    {format(new Date(report.resolvedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer actions */}
      {isOpen && (
        <div className="px-6 py-4 border-t border-[#F3F3F3] bg-white shrink-0 flex items-center gap-2">
          <button
            onClick={() => onAction('dismiss')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            {t('Dismiss')}
          </button>
          <button
            onClick={() => onAction('warn')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-[#B45309] bg-white border border-[#FDE68A] rounded-md hover:bg-[#FFFBEB] transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            {t('Warn')}
          </button>
          <button
            onClick={() => onAction('suspend')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-[#B91C1C] bg-white border border-[#FECACA] rounded-md hover:bg-[#FEF2F2] transition-colors cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            {t('Suspend')}
          </button>
        </div>
      )}
    </div>
  );
}

