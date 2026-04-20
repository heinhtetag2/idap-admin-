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
        return 'bg-[#EDF5EC] text-[#2E5E2A]';
      case 'Pending':
        return 'bg-[#FFF9E5] text-[#8C6D1F]';
      case 'Approved':
        return 'bg-[#E5F0FF] text-[#1F5C8C]';
      case 'Rejected':
        return 'bg-[#FBEBEB] text-[#8C1F1F]';
      default:
        return 'bg-[#F5F2F0] text-[#5A5254]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full bg-[#FCFBF9]"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#F5F2F0] bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/expenses')}
            className="p-2 -ml-2 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-[#2C2627]">{expense.id}</h1>
              <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusColor(expense.status)}`}>
                {t(expense.status)}
              </span>
            </div>
            <p className="text-[#8A8284] text-sm">{expense.merchant} • {expense.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE5E3] text-[#2C2627] rounded-md text-sm font-medium hover:bg-[#FCFBF9] transition-colors">
            <Download className="w-4 h-4 text-[#8A8284]" />
            {t('Download PDF')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE5E3] text-[#2C2627] rounded-md text-sm font-medium hover:bg-[#FCFBF9] transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#8A8284]" />
            {t('More Actions')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto flex gap-8">
          
          {/* Main Details Column */}
          <div className="flex-1 space-y-6">
            
            {/* Amount Banner */}
            <div className="bg-white rounded-md border border-[#F5F2F0] p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8A8284] mb-1">{t('Total Amount')}</p>
                <h2 className="text-3xl font-bold text-[#2C2627]">{expense.amount}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#8A8284] mb-1">{t('Category')}</p>
                <span className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-[#F5F2F0] text-[#5A5254]">
                  {t(expense.category)}
                </span>
              </div>
            </div>

            {/* Expense Info Card */}
            <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9]">
                <h3 className="text-sm font-semibold text-[#2C2627]">{t('Expense Details')}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-2">
                      {t('Description')}
                    </label>
                    <p className="text-sm text-[#2C2627]">{t(expense.description)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-2">
                      {t('Employee')}
                    </label>
                    <p className="text-sm text-[#2C2627]">{expense.employee}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-2">
                      {t('Department')}
                    </label>
                    <p className="text-sm text-[#2C2627]">{t(expense.department)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-2">
                      {t('Payment Method')}
                    </label>
                    <p className="text-sm text-[#2C2627]">{t(expense.paymentMethod)}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-2">
                      {t('Notes')}
                    </label>
                    <p className="text-sm text-[#2C2627] bg-[#FCFBF9] p-4 rounded border border-[#F5F2F0]">
                      {t(expense.notes)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Note */}
            {expense.reviewerNote && (
              <div className="bg-[#FCFBF9] rounded-md border border-[#F5F2F0] p-6 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#EDF5EC] flex items-center justify-center shrink-0 border border-[#D5E8D2]">
                  <Check className="w-4 h-4 text-[#2E5E2A]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2C2627] mb-1">{t('Reviewer Note')}</h4>
                  <p className="text-sm text-[#5A5254]">{t(expense.reviewerNote)}</p>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="w-80 space-y-6 shrink-0">
            
            {/* Receipt Attachment */}
            <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9] flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#8A8284]" />
                <h3 className="text-sm font-semibold text-[#2C2627]">{t('Receipts')}</h3>
              </div>
              <div className="p-5">
                <div className="w-full aspect-[3/4] bg-[#F5F2F0] rounded border border-[#EAE5E3] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-[#F5F2F0] transition-colors group">
                  <FileText className="w-8 h-8 text-[#8A8284] mb-3 group-hover:text-[#4C2D33] transition-colors" />
                  <p className="text-sm font-medium text-[#2C2627] mb-1">{t('receipt_scan_001.pdf')}</p>
                  <p className="text-xs text-[#8A8284]">{t('1.2 MB')}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9] flex items-center gap-2">
                <History className="w-4 h-4 text-[#8A8284]" />
                <h3 className="text-sm font-semibold text-[#2C2627]">{t('Timeline')}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-3 relative">
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-[#F5F2F0]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 border border-[#EAE5E3] relative z-10">
                    <Check className="w-3 h-3 text-[#4C2D33]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2627]">{t('Payment Processed')}</p>
                    <p className="text-xs text-[#8A8284] mt-0.5">Mar 18, 2026 at 10:24 AM</p>
                  </div>
                </div>
                <div className="flex gap-3 relative">
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-[#F5F2F0]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 border border-[#EAE5E3] relative z-10">
                    <MessageSquare className="w-3 h-3 text-[#5A5254]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2627]">{t('Approved by Finance')}</p>
                    <p className="text-xs text-[#8A8284] mt-0.5">Mar 16, 2026 at 2:15 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 border border-[#EAE5E3] relative z-10">
                    <FileText className="w-3 h-3 text-[#5A5254]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2627]">{t('Expense Submitted')}</p>
                    <p className="text-xs text-[#8A8284] mt-0.5">Mar 15, 2026 at 9:00 AM</p>
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