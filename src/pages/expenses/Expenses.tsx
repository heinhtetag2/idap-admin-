import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Filter, Plus, FileText, Download, MoreHorizontal, ArrowUpRight, Pencil, Trash2, X, Paperclip, Camera, Upload, Lightbulb, Image as ImageIcon, Save, Check, Folder, Tag, DollarSign, CreditCard, Building, ChevronDown } from 'lucide-react';
import { Calendar as CalendarUI } from '@/shared/ui/calendar';
import { format, subDays, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export default function Expenses() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<any[]>([
    { id: 'EXP-1045', vendor: 'Amazon Web Services', date: 'Oct 23, 2023', amount: '₩2,450,000', category: 'Software', paymentMethod: 'Corporate Card', status: 'Paid', submitter: 'Jane Doe' },
    { id: 'EXP-1046', vendor: 'WeWork', date: 'Oct 22, 2023', amount: '₩4,200,000', category: 'Office', paymentMethod: 'ACH Transfer', status: 'Approved', submitter: 'John Smith' },
    { id: 'EXP-1047', vendor: 'Delta Airlines', date: 'Oct 20, 2023', amount: '₩850,000', category: 'Travel', paymentMethod: 'Corporate Card', status: 'Pending', submitter: 'Alice Johnson' },
    { id: 'EXP-1048', vendor: 'Stripe', date: 'Oct 19, 2023', amount: '₩125,000', category: 'Software', paymentMethod: 'Corporate Card', status: 'Paid', submitter: 'Bob Brown' },
    { id: 'EXP-1049', vendor: 'Blue Bottle Coffee', date: 'Oct 15, 2023', amount: '₩180,000', category: 'Office', paymentMethod: 'Corporate Card', status: 'Paid', submitter: 'Jane Doe' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [deletingExpense, setDeletingExpense] = useState<any>(null);
  const [verifyingExpense, setVerifyingExpense] = useState<any>(null);
  const [reviewerNote, setReviewerNote] = useState('');
  const [reviewerNoteError, setReviewerNoteError] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom date range');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setPaymentMethodFilter('');
    setStatusFilter('');
    setDateRange(undefined);
    setSelectedPreset('Custom date range');
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== '' || paymentMethodFilter !== '' || statusFilter !== '' || dateRange !== undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#ECFDF5] text-[#047857]'; // subtle green
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#B45309]'; // subtle orange
      case 'Approved':
        return 'bg-[#E3F2FD] text-[#1D4ED8]'; // subtle blue
      default:
        return 'bg-[#F4F4F5] text-[#71717A]';
    }
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
          <h1 className="text-3xl font-serif text-[#0A0A0A]">{t('Expenses')}</h1>
          <p className="text-sm text-[#71717A] mt-1">{t('Manage and track your company expenses.')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] rounded-md text-sm font-medium text-[#0A0A0A] hover:bg-[#F4F4F5] transition-colors bg-white">
            <Download className="w-4 h-4" />
            {t('Export')}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#FF3C21] rounded-md text-sm font-medium text-white hover:bg-[#E63419] transition-colors shadow-none"
            onClick={() => setIsCreatingExpense(true)}
          >
            <Plus className="w-4 h-4" />
            {t('New expense')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: 'Total Pending',
            value: '$1,324.50',
            trend: <span className="text-[#B45309] flex items-center gap-1 font-medium">2 {t('expenses require approval')}</span>
          },
          {
            title: 'Total Approved',
            value: '$435.20',
            trend: <span className="text-[#1D4ED8] flex items-center gap-1 font-medium">2 {t('expenses waiting for payment')}</span>
          },
          {
            title: 'Total Paid (This Month)',
            value: '$1,530.00',
            trend: <span className="text-[#047857] flex items-center gap-1 font-medium"><ArrowUpRight className="w-3 h-3" /> 12% {t('vs last month')}</span>
          }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white rounded-md border border-[#F4F4F5] p-5"
          >
            <div className="text-sm text-[#71717A] font-medium mb-1">{t(card.title)}</div>
            <div className="text-2xl font-bold text-[#0A0A0A] tracking-tight mb-2">{card.value}</div>
            <div className="text-xs">{card.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search expenses...')} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#71717A]"
            />
          </div>
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
            >
              <option value="">{t('Category: All')}</option>
              <option value="Software">{t('Software')}</option>
              <option value="Meals & Entertainment">{t('Meals & Entertainment')}</option>
              <option value="Office Supplies">{t('Office Supplies')}</option>
              <option value="Travel">{t('Travel')}</option>
              <option value="Marketing">{t('Marketing')}</option>
              <option value="Team & Culture">{t('Team & Culture')}</option>
              <option value="Utilities">{t('Utilities')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
            >
              <option value="">{t('Payment Method: All')}</option>
              <option value="Credit Card">{t('Credit Card')}</option>
              <option value="Bank Transfer">{t('Bank Transfer')}</option>
              <option value="Cash">{t('Cash')}</option>
              <option value="Reimbursement">{t('Reimbursement')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors cursor-pointer"
            >
              <option value="">{t('Status: All')}</option>
              <option value="Pending">{t('Status: Pending')}</option>
              <option value="Approved">{t('Status: Approved')}</option>
              <option value="Paid">{t('Status: Paid')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center justify-center w-9 h-9 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-full transition-colors border border-transparent hover:border-[#E4E4E7] shadow-none cursor-pointer flex-shrink-0"
              title={t('Clear filters')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#F4F4F5] text-[#71717A] font-medium bg-[#FAFAFA]">
                  <th className="px-6 py-4 font-medium">{t('Expense ID')}</th>
                  <th className="px-6 py-4 font-medium">{t('Date')}</th>
                  <th className="px-6 py-4 font-medium">{t('Description')}</th>
                  <th className="px-6 py-4 font-medium">{t('Category')}</th>
                  <th className="px-6 py-4 font-medium">{t('Amount')}</th>
                  <th className="px-6 py-4 font-medium">{t('Status')}</th>
                  <th className="px-6 py-4 font-medium">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#71717A]">
                      {t('Loading expenses...')}
                    </td>
                  </tr>
                ) : expenses.map((expense, index) => (
                  <motion.tr 
                    key={expense.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-white transition-colors group cursor-pointer"
                    onClick={() => navigate(`/expenses/${expense.id.toLowerCase()}`)}
                  >
                    <td className="px-6 py-4 font-medium text-[#52525B]">
                      {expense.id}
                    </td>
                    <td className="px-6 py-4 text-[#52525B]">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0A0A0A]">
                      {t(expense.description)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#F4F4F5] text-[#52525B]">
                        {t(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0A0A0A]">
                      {expense.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusColor(expense.status)}`}>
                        {t(expense.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md" 
                          title={t('Verify Expense')}
                          onClick={() => {
                            setVerifyingExpense(expense);
                            setReviewerNote('');
                            setReviewerNoteError(false);
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md" 
                          title={t('Edit')}
                          onClick={() => setEditingExpense(expense)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md" 
                          title={t('Delete')}
                          onClick={() => setDeletingExpense(expense)}
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
              {t('Showing')} 1 {t('to')} 8 {t('of')} 24 {t('entries')}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#71717A] hover:bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('Previous')}
              </button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-medium border border-[#FF3C21] rounded-md bg-[#FF3C21] text-white tabular-nums cursor-default">1</button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer tabular-nums">2</button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer tabular-nums">3</button>
              <button className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#E4E4E7] rounded-md bg-white text-[#52525B] hover:bg-[#F4F4F5] transition-colors cursor-pointer">{t('Next')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Expense Modal */}
      <AnimatePresence>
      {isCreatingExpense && (
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
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A]">{t('New Expense')}</h2>
              <button 
                onClick={() => setIsCreatingExpense(false)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Add Receipt */}
              <div className="space-y-3">
                 <h3 className="text-sm font-medium text-[#0A0A0A] flex items-center gap-2">
                   <Camera className="w-4 h-4 text-[#71717A]" />
                   {t('Capture Receipt')}
                 </h3>
                 <button className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] hover:border-[#FF3C21] transition-colors rounded-md text-[#0A0A0A] group">
                    <Camera className="w-8 h-8 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium text-sm">{t('Capture New Receipt')}</span>
                    <span className="text-xs text-[#71717A] mt-1">{t('Tap to capture immediately')}</span>
                 </button>
                 <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] transition-colors rounded-md text-sm font-medium text-[#52525B] shadow-none">
                   <Upload className="w-4 h-4" />
                   {t('Select from Gallery')}
                 </button>
              </div>

              {/* Tip */}
              <div className="bg-white border border-[#FAFAFA] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#B45309]">
                 <Lightbulb className="w-4 h-4 text-[#B45309] mt-0.5 shrink-0" />
                 <p className="leading-snug">{t('Tip: Capture the receipt and AI will automatically read the amount and item')}</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#71717A]" /> {t('Date')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="date" 
                        id="new-expense-date"
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-[#71717A]" /> {t('Category')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          id="new-expense-category"
                          className="w-full pl-3 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] appearance-none"
                        >
                          <option value="Software">Software</option>
                          <option value="Meals & Entertainment">Meals & Entertainment</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Travel">Travel</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Team & Culture">Team & Culture</option>
                          <option value="Utilities">Utilities</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#71717A]" /> {t('Item')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="new-expense-item"
                        placeholder={t('e.g. Client Dinner')}
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#71717A]" /> {t('Amount')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="new-expense-amount"
                        placeholder="0.00"
                        className="w-full px-3 py-2 font-semibold bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#71717A]" /> {t('Payment Method')}
                      </label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] appearance-none">
                          <option>Corporate Card</option>
                          <option>Cash</option>
                          <option>Personal Card</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#71717A]" /> {t('Recipient')}
                      </label>
                      <input 
                        type="text" 
                        placeholder={t('e.g. Acme Corp')}
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#71717A]" /> {t('Memo')}
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder={t('Add any extra details...')}
                      className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] resize-none"
                    />
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button 
                onClick={() => setIsCreatingExpense(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none"
              >
                <X className="w-4 h-4" />
                {t('Cancel')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none"
                onClick={() => {
                  const dateVal = (document.getElementById('new-expense-date') as HTMLInputElement)?.value || '03/17/2026';
                  const formattedDate = dateVal.includes('-') ? `${dateVal.split('-')[1]}/${dateVal.split('-')[2]}/${dateVal.split('-')[0]}` : dateVal;
                  const itemVal = (document.getElementById('new-expense-item') as HTMLInputElement)?.value || 'New Expense Item';
                  const categoryVal = (document.getElementById('new-expense-category') as HTMLSelectElement)?.value || 'Software';
                  const amountVal = (document.getElementById('new-expense-amount') as HTMLInputElement)?.value || '0.00';
                  
                  const newExpense = {
                    id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
                    vendor: itemVal,
                    date: formattedDate,
                    category: categoryVal,
                    paymentMethod: 'Corporate Card',
                    amount: amountVal.includes('₩') ? amountVal : `₩${amountVal}`,
                    status: 'Pending',
                    submitter: 'Current User'
                  };
                  
                  setExpenses([newExpense, ...expenses]);
                  setIsCreatingExpense(false);
                }}
              >
                <Plus className="w-4 h-4" />
                {t('Create Expense')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Edit Expense Modal */}
      <AnimatePresence>
      {editingExpense && (
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
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A]">{t('Edit Expense')}</h2>
              <button 
                onClick={() => setEditingExpense(null)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Existing Receipt */}
              <div className="border border-[#E8DCC4] bg-white rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-[#52525B] font-medium text-sm">
                    <Paperclip className="w-4 h-4 text-[#71717A]" />
                    {t('Existing Receipt')}
                  </div>
                  <span className="text-[10px] font-semibold bg-[#F5E6CC] text-[#8C6220] px-2 py-1 rounded uppercase tracking-wider">{t('Registered')}</span>
                </div>
                <div className="bg-white border border-[#E4E4E7] rounded-md p-3 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                   <div className="flex items-center gap-3 w-full">
                     <div className="w-12 h-12 bg-[#F4F4F5] rounded-md flex items-center justify-center text-[#71717A] shrink-0">
                       <ImageIcon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-sm font-medium text-[#0A0A0A] truncate">
                         {t('receipt')}_{editingExpense.date.replace(/\//g, '-')}.jpg
                       </div>
                       <div className="text-xs text-[#047857] flex items-center gap-1 font-medium mt-0.5">
                         {t('OCR Accuracy')}: 94.2%
                       </div>
                       <div className="text-[11px] text-[#71717A] mt-0.5">
                         Admin • {editingExpense.date}
                       </div>
                     </div>
                   </div>
                   <button className="text-[#71717A] hover:text-[#0A0A0A] p-1.5 hover:bg-[#F4F4F5] rounded-md transition-colors self-end sm:self-center">
                     <X className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Replace/Add Receipt */}
              <div className="space-y-3">
                 <h3 className="text-sm font-medium text-[#0A0A0A] flex items-center gap-2">
                   <Camera className="w-4 h-4 text-[#71717A]" />
                   {t('Replace/Add Receipt')}
                 </h3>
                 <button className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D4D4D8] bg-white hover:bg-[#F4F4F5] hover:border-[#FF3C21] transition-colors rounded-md text-[#0A0A0A] group">
                    <Camera className="w-8 h-8 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium text-sm">{t('Recapture Receipt')}</span>
                    <span className="text-xs text-[#71717A] mt-1">{t('Tap to capture immediately')}</span>
                 </button>
                 <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] transition-colors rounded-md text-sm font-medium text-[#52525B] shadow-none">
                   <Upload className="w-4 h-4" />
                   {t('Select from Gallery')}
                 </button>
              </div>

              {/* Tip */}
              <div className="bg-white border border-[#FAFAFA] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#B45309]">
                 <Lightbulb className="w-4 h-4 text-[#B45309] mt-0.5 shrink-0" />
                 <p className="leading-snug">{t('Tip: Capture the receipt and AI will automatically read the amount and item')}</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#71717A]" /> {t('Date')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="date" 
                        defaultValue="2026-03-10" 
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-[#71717A]" /> {t('Category')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          defaultValue={editingExpense.category}
                          className="w-full pl-3 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] appearance-none"
                        >
                          <option value="Software">Software</option>
                          <option value="Meals & Entertainment">Meals & Entertainment</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Travel">Travel</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Team & Culture">Team & Culture</option>
                          <option value="Utilities">Utilities</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#71717A]" /> {t('Item')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="text" 
                        defaultValue={editingExpense.description} 
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#71717A]" /> {t('Amount')} <span className="text-[#DC2626]">*</span>
                      </label>
                      <input 
                        type="text" 
                        defaultValue={editingExpense.amount.replace('$', '')} 
                        className="w-full px-3 py-2 font-semibold bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#71717A]" /> {t('Payment Method')}
                      </label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-10 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] appearance-none">
                          <option>Cash</option>
                          <option>Corporate Card</option>
                          <option>Personal Card</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#71717A]" /> {t('Recipient')}
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Acme Corp" 
                        className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21]"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#71717A]" /> {t('Memo')}
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder={t('Add any extra details...')}
                      className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] resize-none"
                    />
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button 
                onClick={() => setEditingExpense(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none"
              >
                <X className="w-4 h-4" />
                {t('Cancel')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none"
                onClick={() => {
                  setExpenses(expenses.map(e => e.id === editingExpense.id ? editingExpense : e));
                  setEditingExpense(null);
                }}
              >
                <Save className="w-4 h-4" />
                {t('Update Complete')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
      {deletingExpense && (
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
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0">
              <h2 className="text-lg font-bold text-[#0A0A0A] flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#DC2626]" />
                {t('Delete Expense')}
              </h2>
              <button 
                onClick={() => setDeletingExpense(null)}
                className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-white">
              <p className="text-[#52525B] text-sm leading-relaxed">
                {t('Are you sure you want to delete this expense?')}
              </p>
              <div className="mt-3 p-3 bg-white border border-[#E4E4E7] rounded-md">
                <div className="font-medium text-[#0A0A0A] text-sm">
                  {t(deletingExpense.description)}
                </div>
                <div className="text-[#71717A] text-xs mt-1">
                  {deletingExpense.date} • <span className="font-medium text-[#0A0A0A]">{deletingExpense.amount}</span>
                </div>
              </div>
              <p className="mt-4 text-[#DC2626] text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                {t('This action cannot be undone.')}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
              <button 
                onClick={() => setDeletingExpense(null)}
                className="px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none"
              >
                {t('Cancel')}
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-md hover:bg-[#B91C1C] transition-colors shadow-none"
                onClick={() => {
                  setExpenses(expenses.filter(e => e.id !== deletingExpense.id));
                  setDeletingExpense(null);
                }}
              >
                {t('Delete')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Verify Expense Modal */}
      <AnimatePresence>
      {verifyingExpense && (
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
            className="bg-white rounded-md w-full max-w-4xl shadow-none border border-[#F4F4F5] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
          >
            
            {/* Left Side: Receipt Image */}
            <div className="md:w-[45%] bg-white border-b md:border-b-0 md:border-r border-[#E8DCC4] flex flex-col items-center justify-center p-8 relative min-h-[300px]">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[#52525B] font-medium text-sm">
                <Paperclip className="w-4 h-4 text-[#71717A]" />
                {t('Receipt Details')}
              </div>
              <div className="w-full max-w-sm aspect-[3/4] bg-white border border-[#E4E4E7] rounded-md shadow-none flex flex-col items-center justify-center text-[#71717A]">
                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">{t('No receipt attached')}</p>
                <p className="text-xs mt-1 text-[#71717A]">{t('Verification can proceed without receipt')}</p>
              </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="md:w-[55%] flex flex-col bg-white overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F5] shrink-0 bg-white">
                <h2 className="text-lg font-bold text-[#0A0A0A]">
                  {t('Verify Expense')}
                </h2>
                <button 
                  onClick={() => setVerifyingExpense(null)}
                  className="text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-6">
                
                {/* Expense Summary */}
                <div>
                  <div className="text-sm text-[#71717A] font-medium mb-1">{t('Total Amount')}</div>
                  <div className="text-4xl font-bold text-[#0A0A0A] tracking-tight">{verifyingExpense.amount}</div>
                  <div className="text-lg font-medium text-[#0A0A0A] mt-2">{t(verifyingExpense.description)}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 p-4 bg-white border border-[#F4F4F5] rounded-md text-sm">
                  <div>
                    <div className="text-[#71717A] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {t('Date')}
                    </div>
                    <div className="font-medium text-[#0A0A0A]">{verifyingExpense.date}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] mb-1.5 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" /> {t('Category')}
                    </div>
                    <div className="font-medium text-[#0A0A0A]">{t(verifyingExpense.category)}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> {t('Payment Method')}
                    </div>
                    <div className="font-medium text-[#0A0A0A]">{t('Corporate Card')}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> {t('Status')}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusColor(verifyingExpense.status)}`}>
                      {t(verifyingExpense.status)}
                    </span>
                  </div>
                </div>

                {/* Warning/Info Block */}
                <div className="bg-white border border-[#FAFAFA] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#B45309]">
                  <Lightbulb className="w-4 h-4 text-[#B45309] mt-0.5 shrink-0" />
                  <p className="leading-snug">{t('Please ensure the receipt matches the submitted amount and complies with the company\'s expense policy before approving.')}</p>
                </div>

                {/* Reviewer Note */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#71717A]" /> {t('Reviewer Note')} 
                    {reviewerNoteError && (
                      <span className="text-[#DC2626] font-medium ml-auto text-xs">{t('You must provide a reason to request a revision')}</span>
                    )}
                  </label>
                  <textarea 
                    rows={3} 
                    value={reviewerNote}
                    onChange={(e) => {
                      setReviewerNote(e.target.value);
                      if (e.target.value.trim() !== '') {
                        setReviewerNoteError(false);
                      }
                    }}
                    placeholder={t('Add a reason if you are requesting a revision...')}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 resize-none transition-colors ${
                      reviewerNoteError 
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]' 
                        : 'border-[#E4E4E7] focus:border-[#FF3C21] focus:ring-[#FF3C21]'
                    }`}
                  />
                </div>

              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5] bg-white shrink-0">
                <button 
                  onClick={() => setVerifyingExpense(null)}
                  className="px-4 py-2 text-sm font-medium text-[#52525B] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#F4F4F5] transition-colors shadow-none"
                >
                  {t('Cancel')}
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-[#DC2626] bg-white border border-[#F4D8DA] rounded-md hover:bg-[#FDF2F3] transition-colors shadow-none"
                  onClick={() => {
                    if (reviewerNote.trim() === '') {
                      setReviewerNoteError(true);
                    } else {
                      setVerifyingExpense(null);
                    }
                  }}
                >
                  {t('Request Revision')}
                </button>
                <button 
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors shadow-none"
                  onClick={() => setVerifyingExpense(null)}
                >
                  <Check className="w-4 h-4" />
                  {t('Approve Expense')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}