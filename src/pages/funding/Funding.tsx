import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarUI } from '@/shared/ui/calendar';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download, 
  Plus,
  MoreHorizontal,
  TrendingUp,
  X,
  Calendar,
  ChevronDown,
  Check,
  Pencil,
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'Inbound' | 'Outbound';
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  account: string;
}

export default function Funding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [senderFilter, setSenderFilter] = useState('All Send/Receive');
  const [methodFilter, setMethodFilter] = useState('Method');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TRX-001', date: 'Oct 24, 2023', description: 'Wire Transfer - Main Operations', type: 'Inbound', amount: '+ ₩24,500,000', status: 'Completed', account: 'Main Operations' },
    { id: 'TRX-002', date: 'Oct 22, 2023', description: 'ACH Transfer - Payroll', type: 'Outbound', amount: '- ₩12,400,000', status: 'Completed', account: 'Main Operations' },
    { id: 'TRX-003', date: 'Oct 19, 2023', description: 'Wire Transfer - Investment', type: 'Inbound', amount: '+ ₩50,000,000', status: 'Pending', account: 'Reserve' },
    { id: 'TRX-004', date: 'Oct 15, 2023', description: 'Credit Card - Software', type: 'Outbound', amount: '- ₩1,200,000', status: 'Failed', account: 'USD Operating' },
    { id: 'TRX-005', date: 'Oct 10, 2023', description: 'Wire Transfer - Client Invoice', type: 'Inbound', amount: '+ ₩8,500,000', status: 'Completed', account: 'Receivables' },
    { id: 'TRX-006', date: 'Oct 05, 2023', description: 'ACH Transfer - Rent', type: 'Outbound', amount: '- ₩4,500,000', status: 'Completed', account: 'Main Operations' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#ECFDF5] text-[#047857] border border-[#D1FAE5]';
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]';
      case 'Failed':
        return 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]';
      default:
        return 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]';
    }
  };

  const getTypeBadge = (type: Transaction['type']) => {
    return type === 'Inbound' 
      ? 'text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-sm text-xs font-medium'
      : 'text-[#52525B] bg-[#F4F4F5] px-2 py-0.5 rounded-sm text-xs font-medium';
  };

  const hasActiveFilters = statusFilter !== 'All' || searchQuery !== '' || senderFilter !== 'All Send/Receive' || methodFilter !== 'Method' || dateRange !== undefined;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSenderFilter('All Send/Receive');
    setMethodFilter('Method');
    setDateRange(undefined);
    setSelectedPreset(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto w-full px-6 md:px-8 xl:px-12 py-8 bg-[#FAFAFA]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#0A0A0A]">{t('Funding')}</h1>
          <p className="text-sm text-[#71717A] mt-1">{t('Manage your accounts, inbound capital, and cash flow.')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] rounded-md text-sm font-medium text-[#0A0A0A] hover:bg-[#F4F4F5] transition-colors bg-white shadow-none cursor-pointer">
            <Download className="w-4 h-4" />
            {t('Export CSV')}
          </button>
          <button 
            onClick={() => setIsAddFundsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF3C21] rounded-md text-sm font-medium text-white hover:bg-[#E63419] transition-colors shadow-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('Add Funds')}
          </button>
        </div>
      </div>

      {/* Summary Cards (4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Remitted KRW',
            icon: <ArrowUpRight className="w-4 h-4 text-[#D4D4D8]" />,
            value: '₩29,980,000',
            trend: <span className="text-[#047857] flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> 12.5%</span>,
            subtitle: 'Total 3 transactions'
          },
          {
            title: 'Total Received',
            icon: <Download className="w-4 h-4 text-[#D4D4D8]" />,
            value: '80,520,000 K',
            trend: <span className="text-[#047857] flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> 8.3%</span>,
            subtitle: 'Approx. ₩29,822,222'
          },
          {
            title: 'Avg Exchange Rate',
            icon: <TrendingUp className="w-4 h-4 text-[#D4D4D8]" />,
            value: '2.69',
            trend: <span className="text-[#047857] flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> 0.8%</span>,
            subtitle: 'MMK/KRW'
          },
          {
            title: 'Total Transactions',
            icon: <Plus className="w-4 h-4 text-[#D4D4D8]" />,
            value: '3',
            subtitle: 'This month: 1'
          }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white rounded-md border border-[#E4E4E7] p-5"
          >
            <div className="text-sm text-[#71717A] font-medium mb-1 flex justify-between items-center">
              {t(card.title)}
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A] tracking-tight mb-2">{card.value}</div>
            <div className="text-xs flex items-center gap-2 font-medium text-[#52525B]">
              {card.trend && <>{card.trend}<span className="text-[#D4D4D8]">•</span></>}
              <span>{t(card.subtitle)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Table */}
      <div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center flex-wrap">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search transactions...')} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#71717A]"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto flex-wrap">
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors shadow-none cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#71717A]" />
                {dateRange?.from 
                  ? (dateRange.to ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}` : format(dateRange.from, 'MMM d, yyyy')) 
                  : t('Date Range')}
              </button>
              
              {isDateRangeOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-[#E4E4E7] rounded-md z-10 flex shadow-none">
                  <div className="w-48 border-r border-[#E4E4E7] p-2 flex flex-col gap-1">
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
                            ? 'bg-[#F4F4F5] text-[#0A0A0A] font-medium' 
                            : 'text-[#52525B] hover:bg-white'
                        }`}
                      >
                        {t(preset)}
                        {selectedPreset === preset && <Check className="w-4 h-4 text-[#0A0A0A]" />}
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
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#F4F4F5]">
                      <button 
                        onClick={() => {
                          setDateRange(undefined);
                          setSelectedPreset('Custom date range');
                          setIsDateRangeOpen(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none cursor-pointer"
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

            <div className="relative">
              <select
                value={senderFilter}
                onChange={(e) => setSenderFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
              >
                <option value="All Send/Receive">{t('All Send/Receive')}</option>
                <option value="Inbound">{t('Inbound Only')}</option>
                <option value="Outbound">{t('Outbound Only')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
              >
                <option value="Method">{t('Method')}</option>
                <option value="Wire Transfer">{t('Wire Transfer')}</option>
                <option value="ACH">{t('ACH')}</option>
                <option value="Credit Card">{t('Credit Card')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
              >
                <option value="All">{t('All Statuses')}</option>
                <option value="Completed">{t('Completed')}</option>
                <option value="Pending">{t('Pending')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center w-9 h-9 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-full transition-colors border border-transparent hover:border-[#E4E4E7] shadow-none cursor-pointer flex-shrink-0"
                title={t('Clear filters')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#F4F4F5] text-[#71717A] font-medium bg-[#FAFAFA]">
                  <th className="px-6 py-4 font-medium">{t('Transaction')}</th>
                  <th className="px-6 py-4 font-medium">{t('Date')}</th>
                  <th className="px-6 py-4 font-medium">{t('Account')}</th>
                  <th className="px-6 py-4 font-medium">{t('Type')}</th>
                  <th className="px-6 py-4 font-medium">{t('Status')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('Amount')}</th>
                  <th className="px-6 py-4 font-medium">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#71717A]">
                      {t('Loading transactions...')}
                    </td>
                  </tr>
                ) : transactions.map((trx, index) => (
                  <motion.tr 
                    key={trx.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-white transition-colors group cursor-pointer"
                    onClick={() => navigate(`/funding/${trx.id.toLowerCase()}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0A0A0A]">{trx.description}</div>
                      <div className="text-xs text-[#71717A] mt-0.5">{trx.id}</div>
                    </td>
                    <td className="px-6 py-4 text-[#52525B]">{trx.date}</td>
                    <td className="px-6 py-4 text-[#52525B]">{trx.account}</td>
                    <td className="px-6 py-4 text-[#52525B]">{t(trx.type)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-md shadow-none ${getStatusBadge(trx.status)}`}>
                        {t(trx.status)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${trx.type === 'Inbound' ? 'text-[#047857]' : 'text-[#0A0A0A]'}`}>
                      {trx.amount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingTransaction(trx); }}
                          className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer" 
                          title={t('Edit')}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeletingTransaction(trx); }}
                          className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors cursor-pointer" 
                          title={t('Delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#F4F4F5] bg-white">
            <span className="text-sm text-[#71717A]">
              {t('Showing')} 1 {t('to')} 6 {t('of')} 142 {t('entries')}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#71717A] hover:bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('Previous')}
              </button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-medium border border-[#FF3C21] rounded-md bg-[#FF3C21] text-white tabular-nums cursor-default">
                1
              </button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer tabular-nums">
                2
              </button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer tabular-nums">
                3
              </button>
              <span className="px-1 text-[#71717A] text-sm">…</span>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer tabular-nums">
                24
              </button>
              <button className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer">
                {t('Next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0A]/30 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-md w-full max-w-2xl shadow-none border border-[#F4F4F5] flex flex-col max-h-[90vh] overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A]">{t('Edit Transaction')}</h2>
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                    <input
                      type="text"
                      defaultValue={editingTransaction.date}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Transaction ID')}</label>
                  <input
                    type="text"
                    defaultValue={editingTransaction.id}
                    disabled
                    className="w-full px-3 py-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-md text-sm text-[#71717A] focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Description')}</label>
                <input
                  type="text"
                  defaultValue={editingTransaction.description}
                  className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Type')}</label>
                  <div className="relative">
                    <select
                      defaultValue={editingTransaction.type}
                      className="appearance-none w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] cursor-pointer"
                    >
                      <option value="Inbound">{t('Inbound')}</option>
                      <option value="Outbound">{t('Outbound')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Account')}</label>
                  <div className="relative">
                    <select
                      defaultValue={editingTransaction.account}
                      className="appearance-none w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] cursor-pointer"
                    >
                      <option value="Main Operations">{t('Main Operations')}</option>
                      <option value="USD Operating">{t('USD Operating')}</option>
                      <option value="Receivables">{t('Receivables')}</option>
                      <option value="Reserve">{t('Reserve')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Amount')}</label>
                  <input
                    type="text"
                    defaultValue={editingTransaction.amount}
                    className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Status')}</label>
                  <div className="relative">
                    <select
                      defaultValue={editingTransaction.status}
                      className="appearance-none w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] cursor-pointer"
                    >
                      <option value="Completed">{t('Completed')}</option>
                      <option value="Pending">{t('Pending')}</option>
                      <option value="Failed">{t('Failed')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button
                onClick={() => setEditingTransaction(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none cursor-pointer"
              >
                <X className="w-4 h-4" />
                {t('Cancel')}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none cursor-pointer"
                onClick={() => {
                  setTransactions(transactions.map(t => t.id === editingTransaction.id ? editingTransaction : t));
                  setEditingTransaction(null);
                }}
              >
                <Save className="w-4 h-4" />
                {t('Save Changes')}
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingTransaction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0A]/30 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-md w-full max-w-sm shadow-none border border-[#F4F4F5] flex flex-col overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A] flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#DC2626]" />
                {t('Delete Transaction')}
              </h2>
              <button
                onClick={() => setDeletingTransaction(null)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-white">
              <p className="text-[#52525B] text-sm leading-relaxed">
                {t('Are you sure you want to delete this transaction?')}
              </p>
              <div className="mt-3 p-3 bg-white border border-[#E4E4E7] rounded-md">
                <div className="font-medium text-[#0A0A0A] text-sm">
                  {t(deletingTransaction.description)}
                </div>
                <div className="text-[#71717A] text-xs mt-1">
                  {deletingTransaction.date} • <span className="font-medium text-[#0A0A0A]">{deletingTransaction.amount}</span>
                </div>
              </div>
              <p className="mt-4 text-[#DC2626] text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {t('This action cannot be undone. This will permanently remove the record.')}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button
                onClick={() => setDeletingTransaction(null)}
                className="px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-md hover:bg-[#B91C1C] transition-colors shadow-none cursor-pointer"
                onClick={() => {
                  setTransactions(transactions.filter(t => t.id !== deletingTransaction.id));
                  setDeletingTransaction(null);
                }}
              >
                {t('Delete Permanently')}
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Add Funds Modal */}
      <AnimatePresence>
      {isAddFundsModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0A0A0A]/30 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-xl shadow-none border border-[#F4F4F5] flex flex-col max-h-[90vh] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A]">{t('Add Funds')}</h2>
              <button
                onClick={() => setIsAddFundsModalOpen(false)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="bg-white border border-[#E4E4E7] rounded-md p-4 mb-2">
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {t('Use this form to record incoming capital or transfers into your accounts. This creates a new inbound transaction record.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Amount')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] text-sm">₩</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                    <input
                      type="text"
                      defaultValue={format(new Date(), 'MMM dd, yyyy')}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Description')}</label>
                <input
                  type="text"
                  placeholder={t('e.g., Wire Transfer - Q3 Investment')}
                  className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Destination Account')}</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] cursor-pointer text-[#0A0A0A]"
                    >
                      <option value="Main Operations">{t('Main Operations')}</option>
                      <option value="Reserve">{t('Reserve')}</option>
                      <option value="Receivables">{t('Receivables')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52525B] mb-1.5">{t('Transfer Method')}</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] cursor-pointer text-[#0A0A0A]"
                    >
                      <option value="Wire Transfer">{t('Wire Transfer')}</option>
                      <option value="ACH">{t('ACH')}</option>
                      <option value="Internal Transfer">{t('Internal Transfer')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button
                onClick={() => setIsAddFundsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none cursor-pointer"
                onClick={() => {
                  // Mock adding funds - in a real app this would use form state
                  const newTransaction: Transaction = {
                    id: `TRX-00${transactions.length + 1}`,
                    date: format(new Date(), 'MMM dd, yyyy'),
                    description: 'New Fund Deposit',
                    type: 'Inbound',
                    amount: '+ ₩0',
                    status: 'Completed',
                    account: 'Main Operations'
                  };
                  setTransactions([newTransaction, ...transactions]);
                  setIsAddFundsModalOpen(false);
                }}
              >
                <Plus className="w-4 h-4" />
                {t('Add Funds')}
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
