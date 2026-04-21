import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Download, FileText, Check, Paperclip, MoreHorizontal, MessageSquare, History } from 'lucide-react';

export default function ExpenseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock database mapping IDs to detailed expense data
  const expenseDatabase: Record<string, any> = {
    'EXP-1045': {
      id: 'EXP-1045',
      date: '03/15/2026',
      description: 'Monthly Software Subscriptions',
      category: 'Software',
      amount: '$450.00',
      status: 'Paid',
      merchant: 'Acme SaaS Corp',
      employee: 'Sarah Jenkins',
      department: 'Engineering',
      paymentMethod: 'Corporate Card ending in 4421',
      notes: "Monthly renewal for the team's project management tools and design software.",
      reviewerNote: 'Approved as per the quarterly budget allocation.',
    },
    'EXP-1046': {
      id: 'EXP-1046',
      date: '03/12/2026',
      description: 'Client Dinner - Acme Corp',
      category: 'Meals & Entertainment',
      amount: '$124.50',
      status: 'Pending',
      merchant: 'Oceana Seafood',
      employee: 'Michael Chen',
      department: 'Sales',
      paymentMethod: 'Corporate Card ending in 8892',
      notes: 'Dinner with Acme Corp executives to discuss Q3 partnership opportunities. 3 attendees.',
      reviewerNote: 'Pending receipt verification.',
    },
    'EXP-1047': {
      id: 'EXP-1047',
      date: '03/10/2026',
      description: 'Office Supplies - Printer Ink',
      category: 'Office Supplies',
      amount: '$85.20',
      status: 'Approved',
      merchant: 'Staples',
      employee: 'Jessica Wong',
      department: 'Operations',
      paymentMethod: 'Reimbursement',
      notes: 'Black and color ink cartridges for the main office printer.',
      reviewerNote: 'Looks good. Will be included in the next payroll run.',
    },
    'EXP-1048': {
      id: 'EXP-1048',
      date: '03/08/2026',
      description: 'Flight to Annual Conference',
      category: 'Travel',
      amount: '$540.00',
      status: 'Paid',
      merchant: 'Delta Airlines',
      employee: 'David Miller',
      department: 'Marketing',
      paymentMethod: 'Corporate Card ending in 4421',
      notes: 'Round trip flight to Las Vegas for the Annual SaaS Growth Conference.',
      reviewerNote: 'Approved under travel budget.',
    },
    'EXP-1049': {
      id: 'EXP-1049',
      date: '03/05/2026',
      description: 'Hotel Stay - 3 Nights',
      category: 'Travel',
      amount: '$420.00',
      status: 'Paid',
      merchant: 'Marriott Downtown',
      employee: 'David Miller',
      department: 'Marketing',
      paymentMethod: 'Corporate Card ending in 4421',
      notes: 'Accommodation for the Annual SaaS Growth Conference. 3 nights at $140/night.',
      reviewerNote: 'Approved under travel budget.',
    },
    'EXP-1050': {
      id: 'EXP-1050',
      date: '03/02/2026',
      description: 'Facebook Ad Spend',
      category: 'Marketing',
      amount: '$1,200.00',
      status: 'Pending',
      merchant: 'Meta Platforms Inc.',
      employee: 'Amanda Roberts',
      department: 'Marketing',
      paymentMethod: 'Corporate Card ending in 1105',
      notes: 'March ad campaign targeting new enterprise clients in the healthcare sector.',
      reviewerNote: 'Requires Marketing Director approval due to amount exceeding $1,000.',
    },
    'EXP-1051': {
      id: 'EXP-1051',
      date: '02/28/2026',
      description: 'Team Building Workshop',
      category: 'Team & Culture',
      amount: '$350.00',
      status: 'Approved',
      merchant: 'Escape Room Downtown',
      employee: 'Sarah Jenkins',
      department: 'Engineering',
      paymentMethod: 'Corporate Card ending in 4421',
      notes: 'Quarterly team building event for the core engineering team (8 people).',
      reviewerNote: 'Approved. Great initiative.',
    },
    'EXP-1052': {
      id: 'EXP-1052',
      date: '02/25/2026',
      description: 'Internet Service Provider',
      category: 'Utilities',
      amount: '$120.00',
      status: 'Paid',
      merchant: 'Comcast Business',
      employee: 'Jessica Wong',
      department: 'Operations',
      paymentMethod: 'Corporate Card ending in 3328',
      notes: 'Monthly high-speed internet service for the downtown office.',
      reviewerNote: 'Standard monthly recurring expense.',
    },
  };

  // Find the specific expense or fallback to a default
  const upperId = id?.toUpperCase() || 'EXP-1045';
  const expense = expenseDatabase[upperId] || expenseDatabase['EXP-1045'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#ECFDF5] text-[#065F46]';
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#92400E]';
      case 'Approved':
        return 'bg-[#EFF6FF] text-[#1D4ED8]';
      case 'Rejected':
        return 'bg-[#FEF2F2] text-[#991B1B]';
      default:
        return 'bg-[#F4F4F5] text-[#52525B]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#F4F4F5] bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/expenses')}
            className="p-2 -ml-2 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-[#0A0A0A]">{expense.id}</h1>
              <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusColor(expense.status)}`}>
                {t(expense.status)}
              </span>
            </div>
            <p className="text-[#71717A] text-sm">{expense.merchant} • {expense.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-md text-sm font-medium hover:bg-white transition-colors">
            <Download className="w-4 h-4 text-[#71717A]" />
            {t('Download PDF')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-md text-sm font-medium hover:bg-white transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#71717A]" />
            {t('More Actions')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto flex gap-8">
          
          {/* Main Details Column */}
          <div className="flex-1 space-y-6">
            
            {/* Amount Banner */}
            <div className="bg-white rounded-md border border-[#F4F4F5] p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#71717A] mb-1">{t('Total Amount')}</p>
                <h2 className="text-3xl font-bold text-[#0A0A0A]">{expense.amount}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#71717A] mb-1">{t('Category')}</p>
                <span className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-[#F4F4F5] text-[#52525B]">
                  {t(expense.category)}
                </span>
              </div>
            </div>

            {/* Expense Info Card */}
            <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F4F4F5] bg-white">
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{t('Expense Details')}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                      {t('Description')}
                    </label>
                    <p className="text-sm text-[#0A0A0A]">{t(expense.description)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                      {t('Employee')}
                    </label>
                    <p className="text-sm text-[#0A0A0A]">{expense.employee}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                      {t('Department')}
                    </label>
                    <p className="text-sm text-[#0A0A0A]">{t(expense.department)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                      {t('Payment Method')}
                    </label>
                    <p className="text-sm text-[#0A0A0A]">{t(expense.paymentMethod)}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                      {t('Notes')}
                    </label>
                    <p className="text-sm text-[#0A0A0A] bg-white p-4 rounded border border-[#F4F4F5]">
                      {t(expense.notes)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Note */}
            {expense.reviewerNote && (
              <div className="bg-white rounded-md border border-[#F4F4F5] p-6 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0 border border-[#D5E8D2]">
                  <Check className="w-4 h-4 text-[#065F46]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0A0A0A] mb-1">{t('Reviewer Note')}</h4>
                  <p className="text-sm text-[#52525B]">{t(expense.reviewerNote)}</p>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="w-80 space-y-6 shrink-0">
            
            {/* Receipt Attachment */}
            <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F4F4F5] bg-white flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{t('Receipts')}</h3>
              </div>
              <div className="p-5">
                <div className="w-full aspect-[3/4] bg-[#F4F4F5] rounded border border-[#E4E4E7] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-[#F4F4F5] transition-colors group">
                  <FileText className="w-8 h-8 text-[#71717A] mb-3 group-hover:text-[#0A0A0A] transition-colors" />
                  <p className="text-sm font-medium text-[#0A0A0A] mb-1">{t('receipt_scan_001.pdf')}</p>
                  <p className="text-xs text-[#71717A]">{t('1.2 MB')}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F4F4F5] bg-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{t('Timeline')}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-3 relative">
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-[#F4F4F5]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 border border-[#E4E4E7] relative z-10">
                    <Check className="w-3 h-3 text-[#0A0A0A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">{t('Payment Processed')}</p>
                    <p className="text-xs text-[#71717A] mt-0.5">Mar 18, 2026 at 10:24 AM</p>
                  </div>
                </div>
                <div className="flex gap-3 relative">
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-[#F4F4F5]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 border border-[#E4E4E7] relative z-10">
                    <MessageSquare className="w-3 h-3 text-[#52525B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">{t('Approved by Finance')}</p>
                    <p className="text-xs text-[#71717A] mt-0.5">Mar 16, 2026 at 2:15 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 border border-[#E4E4E7] relative z-10">
                    <FileText className="w-3 h-3 text-[#52525B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">{t('Expense Submitted')}</p>
                    <p className="text-xs text-[#71717A] mt-0.5">Mar 15, 2026 at 9:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}