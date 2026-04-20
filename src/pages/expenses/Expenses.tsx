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
        return 'bg-[#E8F5E9] text-[#2E7D32]'; // subtle green
      case 'Pending':
        return 'bg-[#FFF3E0] text-[#E65100]'; // subtle orange
      case 'Approved':
        return 'bg-[#E3F2FD] text-[#1565C0]'; // subtle blue
      default:
        return 'bg-[#F5F2F0] text-[#8A8284]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto w-full px-6 md:px-8 xl:px-12 py-8 bg-[#FAF9F6]"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#2C2627]">{t('Expenses')}</h1>
          <p className="text-sm text-[#8A8284] mt-1">{t('Manage and track your company expenses.')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] hover:bg-[#F5F2F0] transition-colors bg-white">
            <Download className="w-4 h-4" />
            {t('Export')}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#4C2D33] rounded-md text-sm font-medium text-white hover:bg-[#3D2328] transition-colors shadow-none"
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
            trend: <span className="text-[#E65100] flex items-center gap-1 font-medium">2 {t('expenses require approval')}</span>
          },
          {
            title: 'Total Approved',
            value: '$435.20',
            trend: <span className="text-[#1565C0] flex items-center gap-1 font-medium">2 {t('expenses waiting for payment')}</span>
          },
          {
            title: 'Total Paid (This Month)',
            value: '$1,530.00',
            trend: <span className="text-[#2E7D32] flex items-center gap-1 font-medium"><ArrowUpRight className="w-3 h-3" /> 12% {t('vs last month')}</span>
          }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white rounded-md border border-[#F5F2F0] p-5"
          >
            <div className="text-sm text-[#8A8284] font-medium mb-1">{t(card.title)}</div>
            <div className="text-2xl font-bold text-[#2C2627] tracking-tight mb-2">{card.value}</div>
            <div className="text-xs">{card.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search expenses...')} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] placeholder:text-[#8A8284]"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#EAE5E3] bg-white rounded-md text-sm font-medium text-[#5A5254] hover:bg-[#F5F2F0] focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] transition-colors shadow-none cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#8A8284]" />
              {dateRange?.from 
                ? (dateRange.to ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}` : format(dateRange.from, 'MMM d, yyyy')) 
                : t('Date Range')}
            </button>
            
            {isDateRangeOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#EAE5E3] rounded-md z-10 flex shadow-none">
                <div className="w-48 border-r border-[#EAE5E3] p-2 flex flex-col gap-1">
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
                          ? 'bg-[#F5F2F0] text-[#4C2D33] font-medium' 
                          : 'text-[#5A5254] hover:bg-[#FCFBF9]'
                      }`}
                    >
                      {t(preset)}
                      {selectedPreset === preset && <Check className="w-4 h-4 text-[#4C2D33]" />}
                    </button>
                  ))}
                </div>
                <div className="p-4" style={{ '--primary': '#4C2D33', '--primary-foreground': '#FFFFFF' } as React.CSSProperties}>
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
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#F5F2F0]">
                    <button 
                      onClick={() => {
                        setDateRange(undefined);
                        setSelectedPreset('Custom date range');
                        setIsDateRangeOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#5A5254] bg-white border border-[#EAE5E3] rounded-md hover:bg-[#F5F2F0] transition-colors shadow-none cursor-pointer"
                    >
                      {t('Clear')}
                    </button>
                    <button 
                      onClick={() => setIsDateRangeOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#4C2D33] rounded-md hover:bg-[#3D2328] transition-colors shadow-none cursor-pointer"
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
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#EAE5E3] bg-white rounded-md text-sm font-medium text-[#5A5254] hover:bg-[#F5F2F0] focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] transition-colors cursor-pointer"
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
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#EAE5E3] bg-white rounded-md text-sm font-medium text-[#5A5254] hover:bg-[#F5F2F0] focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] transition-colors cursor-pointer"
            >
              <option value="">{t('Payment Method: All')}</option>
              <option value="Credit Card">{t('Credit Card')}</option>
              <option value="Bank Transfer">{t('Bank Transfer')}</option>
              <option value="Cash">{t('Cash')}</option>
              <option value="Reimbursement">{t('Reimbursement')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-8 py-2 border border-[#EAE5E3] bg-white rounded-md text-sm font-medium text-[#5A5254] hover:bg-[#F5F2F0] focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] transition-colors cursor-pointer"
            >
              <option value="">{t('Status: All')}</option>
              <option value="Pending">{t('Status: Pending')}</option>
              <option value="Approved">{t('Status: Approved')}</option>
              <option value="Paid">{t('Status: Paid')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center justify-center w-9 h-9 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-full transition-colors border border-transparent hover:border-[#EAE5E3] shadow-none cursor-pointer flex-shrink-0"
              title={t('Clear filters')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#F5F2F0] text-[#8A8284] font-medium bg-[#FCFBF9]">
                  <th className="px-6 py-4 font-medium">{t('Expense ID')}</th>
                  <th className="px-6 py-4 font-medium">{t('Date')}</th>
                  <th className="px-6 py-4 font-medium">{t('Description')}</th>
                  <th className="px-6 py-4 font-medium">{t('Category')}</th>
                  <th className="px-6 py-4 font-medium">{t('Amount')}</th>
                  <th className="px-6 py-4 font-medium">{t('Status')}</th>
                  <th className="px-6 py-4 font-medium">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2F0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#8A8284]">
                      {t('Loading expenses...')}
                    </td>
                  </tr>
                ) : expenses.map((expense, index) => (
                  <motion.tr 
                    key={expense.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-[#FCFBF9] transition-colors group cursor-pointer"
                    onClick={() => navigate(`/expenses/${expense.id.toLowerCase()}`)}
                  >
                    <td className="px-6 py-4 font-medium text-[#5A5254]">
                      {expense.id}
                    </td>
                    <td className="px-6 py-4 text-[#5A5254]">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#2C2627]">
                      {t(expense.description)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#F5F2F0] text-[#5A5254]">
                        {t(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#2C2627]">
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
                          className="p-1.5 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md" 
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
                          className="p-1.5 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md" 
                          title={t('Edit')}
                          onClick={() => setEditingExpense(expense)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md" 
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#F5F2F0] bg-[#FCFBF9]">
            <span className="text-sm text-[#8A8284]">
              {t('Showing')} 1 {t('to')} 8 {t('of')} 24 {t('entries')}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#EAE5E3] rounded-md bg-white text-[#8A8284] hover:bg-[#F5F2F0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('Previous')}
              </button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-medium border border-[#4C2D33] rounded-md bg-[#4C2D33] text-white tabular-nums cursor-default">1</button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#EAE5E3] rounded-md bg-white text-[#5A5254] hover:bg-[#F5F2F0] transition-colors cursor-pointer tabular-nums">2</button>
              <button className="h-8 min-w-8 px-2 inline-flex items-center justify-center text-sm font-normal border border-[#EAE5E3] rounded-md bg-white text-[#5A5254] hover:bg-[#F5F2F0] transition-colors cursor-pointer tabular-nums">3</button>
              <button className="h-8 px-3 inline-flex items-center text-sm font-normal border border-[#EAE5E3] rounded-md bg-white text-[#5A5254] hover:bg-[#F5F2F0] transition-colors cursor-pointer">{t('Next')}</button>
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
          className="fixed inset-0 bg-[#2C2627]/40 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-2xl shadow-none border border-[#F5F2F0] flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2F0] shrink-0">
              <h2 className="text-lg font-bold text-[#2C2627]">{t('New Expense')}</h2>
              <button 
                onClick={() => setIsCreatingExpense(false)}
                className="text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Add Receipt */}
              <div className="space-y-3">
                 <h3 className="text-sm font-medium text-[#2C2627] flex items-center gap-2">
                   <Camera className="w-4 h-4 text-[#8A8284]" />
                   {t('Capture Receipt')}
                 </h3>
                 <button className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D5C9C6] bg-[#FCFBF9] hover:bg-[#F5F2F0] hover:border-[#4C2D33] transition-colors rounded-md text-[#4C2D33] group">
                    <Camera className="w-8 h-8 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium text-sm">{t('Capture New Receipt')}</span>
                    <span className="text-xs text-[#8A8284] mt-1">{t('Tap to capture immediately')}</span>
                 </button>
                 <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#EAE5E3] bg-white hover:bg-[#F5F2F0] transition-colors rounded-md text-sm font-medium text-[#5A5254] shadow-none">
                   <Upload className="w-4 h-4" />
                   {t('Select from Gallery')}
                 </button>
              </div>

              {/* Tip */}
              <div className="bg-[#FCFBF9] border border-[#FCFBF9] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#8C5A35]">
                 <Lightbulb className="w-4 h-4 text-[#D97736] mt-0.5 shrink-0" />
                 <p className="leading-snug">{t('Tip: Capture the receipt and AI will automatically read the amount and item')}</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Date')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="date" 
                        id="new-expense-date"
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Category')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          id="new-expense-category"
                          className="w-full pl-3 pr-10 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] appearance-none"
                        >
                          <option value="Software">Software</option>
                          <option value="Meals & Entertainment">Meals & Entertainment</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Travel">Travel</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Team & Culture">Team & Culture</option>
                          <option value="Utilities">Utilities</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Item')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="new-expense-item"
                        placeholder={t('e.g. Client Dinner')}
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Amount')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="new-expense-amount"
                        placeholder="0.00"
                        className="w-full px-3 py-2 font-semibold bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Payment Method')}
                      </label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-10 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] appearance-none">
                          <option>Corporate Card</option>
                          <option>Cash</option>
                          <option>Personal Card</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Recipient')}
                      </label>
                      <input 
                        type="text" 
                        placeholder={t('e.g. Acme Corp')}
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Memo')}
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder={t('Add any extra details...')}
                      className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] resize-none"
                    />
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5F2F0] bg-[#FCFBF9] shrink-0">
              <button 
                onClick={() => setIsCreatingExpense(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5A5254] bg-white border border-[#EAE5E3] rounded-md hover:bg-[#F5F2F0] transition-colors shadow-none"
              >
                <X className="w-4 h-4" />
                {t('Cancel')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4C2D33] rounded-md hover:bg-[#3D2328] transition-colors shadow-none"
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
          className="fixed inset-0 bg-[#2C2627]/40 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-2xl shadow-none border border-[#F5F2F0] flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2F0] shrink-0">
              <h2 className="text-lg font-bold text-[#2C2627]">{t('Edit Expense')}</h2>
              <button 
                onClick={() => setEditingExpense(null)}
                className="text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Existing Receipt */}
              <div className="border border-[#E8DCC4] bg-[#FCFBF9] rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-[#5A5254] font-medium text-sm">
                    <Paperclip className="w-4 h-4 text-[#8A8284]" />
                    {t('Existing Receipt')}
                  </div>
                  <span className="text-[10px] font-semibold bg-[#F5E6CC] text-[#8C6220] px-2 py-1 rounded uppercase tracking-wider">{t('Registered')}</span>
                </div>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-3 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                   <div className="flex items-center gap-3 w-full">
                     <div className="w-12 h-12 bg-[#F5F2F0] rounded-md flex items-center justify-center text-[#8A8284] shrink-0">
                       <ImageIcon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-sm font-medium text-[#2C2627] truncate">
                         {t('receipt')}_{editingExpense.date.replace(/\//g, '-')}.jpg
                       </div>
                       <div className="text-xs text-[#2E7D32] flex items-center gap-1 font-medium mt-0.5">
                         {t('OCR Accuracy')}: 94.2%
                       </div>
                       <div className="text-[11px] text-[#8A8284] mt-0.5">
                         Admin • {editingExpense.date}
                       </div>
                     </div>
                   </div>
                   <button className="text-[#8A8284] hover:text-[#2C2627] p-1.5 hover:bg-[#F5F2F0] rounded-md transition-colors self-end sm:self-center">
                     <X className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Replace/Add Receipt */}
              <div className="space-y-3">
                 <h3 className="text-sm font-medium text-[#2C2627] flex items-center gap-2">
                   <Camera className="w-4 h-4 text-[#8A8284]" />
                   {t('Replace/Add Receipt')}
                 </h3>
                 <button className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D5C9C6] bg-[#FCFBF9] hover:bg-[#F5F2F0] hover:border-[#4C2D33] transition-colors rounded-md text-[#4C2D33] group">
                    <Camera className="w-8 h-8 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium text-sm">{t('Recapture Receipt')}</span>
                    <span className="text-xs text-[#8A8284] mt-1">{t('Tap to capture immediately')}</span>
                 </button>
                 <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#EAE5E3] bg-white hover:bg-[#F5F2F0] transition-colors rounded-md text-sm font-medium text-[#5A5254] shadow-none">
                   <Upload className="w-4 h-4" />
                   {t('Select from Gallery')}
                 </button>
              </div>

              {/* Tip */}
              <div className="bg-[#FCFBF9] border border-[#FCFBF9] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#8C5A35]">
                 <Lightbulb className="w-4 h-4 text-[#D97736] mt-0.5 shrink-0" />
                 <p className="leading-snug">{t('Tip: Capture the receipt and AI will automatically read the amount and item')}</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Date')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="date" 
                        defaultValue="2026-03-10" 
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Category')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <div className="relative">
                        <select 
                          defaultValue={editingExpense.category}
                          className="w-full pl-3 pr-10 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] appearance-none"
                        >
                          <option value="Software">Software</option>
                          <option value="Meals & Entertainment">Meals & Entertainment</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Travel">Travel</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Team & Culture">Team & Culture</option>
                          <option value="Utilities">Utilities</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Item')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="text" 
                        defaultValue={editingExpense.description} 
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Amount')} <span className="text-[#D93D4A]">*</span>
                      </label>
                      <input 
                        type="text" 
                        defaultValue={editingExpense.amount.replace('$', '')} 
                        className="w-full px-3 py-2 font-semibold bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Payment Method')}
                      </label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-10 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] appearance-none">
                          <option>Cash</option>
                          <option>Corporate Card</option>
                          <option>Personal Card</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Recipient')}
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Acme Corp" 
                        className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33]"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Memo')}
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder={t('Add any extra details...')}
                      className="w-full px-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm focus:outline-none focus:border-[#4C2D33] focus:ring-1 focus:ring-[#4C2D33] resize-none"
                    />
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5F2F0] bg-[#FCFBF9] shrink-0">
              <button 
                onClick={() => setEditingExpense(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5A5254] bg-white border border-[#EAE5E3] rounded-md hover:bg-[#F5F2F0] transition-colors shadow-none"
              >
                <X className="w-4 h-4" />
                {t('Cancel')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4C2D33] rounded-md hover:bg-[#3D2328] transition-colors shadow-none"
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
          className="fixed inset-0 bg-[#2C2627]/40 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-sm shadow-none border border-[#F5F2F0] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2F0] shrink-0">
              <h2 className="text-lg font-bold text-[#2C2627] flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#D93D4A]" />
                {t('Delete Expense')}
              </h2>
              <button 
                onClick={() => setDeletingExpense(null)}
                className="text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-[#FCFBF9]">
              <p className="text-[#5A5254] text-sm leading-relaxed">
                {t('Are you sure you want to delete this expense?')}
              </p>
              <div className="mt-3 p-3 bg-white border border-[#EAE5E3] rounded-md">
                <div className="font-medium text-[#2C2627] text-sm">
                  {t(deletingExpense.description)}
                </div>
                <div className="text-[#8A8284] text-xs mt-1">
                  {deletingExpense.date} • <span className="font-medium text-[#2C2627]">{deletingExpense.amount}</span>
                </div>
              </div>
              <p className="mt-4 text-[#D93D4A] text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D93D4A]"></span>
                {t('This action cannot be undone.')}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5F2F0] bg-white shrink-0">
              <button 
                onClick={() => setDeletingExpense(null)}
                className="px-4 py-2 text-sm font-medium text-[#5A5254] bg-white border border-[#EAE5E3] rounded-md hover:bg-[#F5F2F0] transition-colors shadow-none"
              >
                {t('Cancel')}
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-[#D93D4A] rounded-md hover:bg-[#B8333E] transition-colors shadow-none"
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
          className="fixed inset-0 bg-[#2C2627]/40 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-4xl shadow-none border border-[#F5F2F0] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
          >
            
            {/* Left Side: Receipt Image */}
            <div className="md:w-[45%] bg-[#FCFBF9] border-b md:border-b-0 md:border-r border-[#E8DCC4] flex flex-col items-center justify-center p-8 relative min-h-[300px]">
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[#5A5254] font-medium text-sm">
                <Paperclip className="w-4 h-4 text-[#8A8284]" />
                {t('Receipt Details')}
              </div>
              <div className="w-full max-w-sm aspect-[3/4] bg-white border border-[#EAE5E3] rounded-md shadow-none flex flex-col items-center justify-center text-[#8A8284]">
                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">{t('No receipt attached')}</p>
                <p className="text-xs mt-1 text-[#8A8284]">{t('Verification can proceed without receipt')}</p>
              </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="md:w-[55%] flex flex-col bg-white overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F2F0] shrink-0 bg-[#FCFBF9]">
                <h2 className="text-lg font-bold text-[#2C2627]">
                  {t('Verify Expense')}
                </h2>
                <button 
                  onClick={() => setVerifyingExpense(null)}
                  className="text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-6">
                
                {/* Expense Summary */}
                <div>
                  <div className="text-sm text-[#8A8284] font-medium mb-1">{t('Total Amount')}</div>
                  <div className="text-4xl font-bold text-[#2C2627] tracking-tight">{verifyingExpense.amount}</div>
                  <div className="text-lg font-medium text-[#2C2627] mt-2">{t(verifyingExpense.description)}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 p-4 bg-[#FCFBF9] border border-[#F5F2F0] rounded-md text-sm">
                  <div>
                    <div className="text-[#8A8284] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {t('Date')}
                    </div>
                    <div className="font-medium text-[#2C2627]">{verifyingExpense.date}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8284] mb-1.5 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" /> {t('Category')}
                    </div>
                    <div className="font-medium text-[#2C2627]">{t(verifyingExpense.category)}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8284] mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> {t('Payment Method')}
                    </div>
                    <div className="font-medium text-[#2C2627]">{t('Corporate Card')}</div>
                  </div>
                  <div>
                    <div className="text-[#8A8284] mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> {t('Status')}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusColor(verifyingExpense.status)}`}>
                      {t(verifyingExpense.status)}
                    </span>
                  </div>
                </div>

                {/* Warning/Info Block */}
                <div className="bg-[#FCFBF9] border border-[#FCFBF9] rounded-md p-3.5 flex items-start gap-2.5 text-sm text-[#8C5A35]">
                  <Lightbulb className="w-4 h-4 text-[#D97736] mt-0.5 shrink-0" />
                  <p className="leading-snug">{t('Please ensure the receipt matches the submitted amount and complies with the company\'s expense policy before approving.')}</p>
                </div>

                {/* Reviewer Note */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#5A5254] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8A8284]" /> {t('Reviewer Note')} 
                    {reviewerNoteError && (
                      <span className="text-[#D93D4A] font-medium ml-auto text-xs">{t('You must provide a reason to request a revision')}</span>
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
                        ? 'border-[#D93D4A] focus:border-[#D93D4A] focus:ring-[#D93D4A]' 
                        : 'border-[#EAE5E3] focus:border-[#4C2D33] focus:ring-[#4C2D33]'
                    }`}
                  />
                </div>

              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5F2F0] bg-[#FCFBF9] shrink-0">
                <button 
                  onClick={() => setVerifyingExpense(null)}
                  className="px-4 py-2 text-sm font-medium text-[#5A5254] bg-white border border-[#EAE5E3] rounded-md hover:bg-[#F5F2F0] transition-colors shadow-none"
                >
                  {t('Cancel')}
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-[#D93D4A] bg-white border border-[#F4D8DA] rounded-md hover:bg-[#FDF2F3] transition-colors shadow-none"
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
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4C2D33] rounded-md hover:bg-[#3D2328] transition-colors shadow-none"
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