import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Download, MoreHorizontal, ArrowUpRight, ArrowDownRight, Building, Building2, CreditCard, CheckCircle2, Clock, MapPin, Receipt } from 'lucide-react';

export default function FundingDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock database mapping IDs to detailed transaction data
  const fundingDatabase: Record<string, any> = {
    'TRX-99382': {
      id: 'TRX-99382',
      date: 'March 15, 2026',
      time: '14:30 EST',
      description: 'Series A Funding Round',
      type: 'Inbound',
      amount: '$2,500,000.00',
      status: 'Completed',
      account: 'Main Operations',
      senderName: 'Sequoia Capital Partners',
      senderBank: 'Silicon Valley Bank',
      senderAccount: '**** 8842',
      recipientBank: 'JPMorgan Chase',
      recipientAccount: '**** 1120',
      reference: 'Series A Tranche 1/1',
      fee: '$0.00',
      netAmount: '$2,500,000.00'
    },
    'TRX-99381': {
      id: 'TRX-99381',
      date: 'March 12, 2026',
      time: '09:15 EST',
      description: 'Q1 Cloud Infrastructure',
      type: 'Outbound',
      amount: '$12,450.00',
      status: 'Completed',
      account: 'USD Operating',
      senderName: 'Acme Corp',
      senderBank: 'JPMorgan Chase',
      senderAccount: '**** 1120',
      recipientBank: 'Bank of America',
      recipientAccount: '**** 5591',
      reference: 'AWS Invoice INV-202603',
      fee: '$15.00',
      netAmount: '$12,465.00'
    },
    'TRX-99380': {
      id: 'TRX-99380',
      date: 'March 10, 2026',
      time: '16:45 EST',
      description: 'Enterprise License - Acme Corp',
      type: 'Inbound',
      amount: '$45,000.00',
      status: 'Pending',
      account: 'Main Operations',
      senderName: 'Acme Corporation',
      senderBank: 'Wells Fargo',
      senderAccount: '**** 2201',
      recipientBank: 'JPMorgan Chase',
      recipientAccount: '**** 1120',
      reference: 'Annual Enterprise License 2026',
      fee: '$0.00',
      netAmount: '$45,000.00'
    },
    'TRX-99379': {
      id: 'TRX-99379',
      date: 'March 08, 2026',
      time: '11:20 EST',
      description: 'Payroll Funding March',
      type: 'Outbound',
      amount: '$142,500.00',
      status: 'Completed',
      account: 'USD Operating',
      senderName: 'Acme Corp',
      senderBank: 'JPMorgan Chase',
      senderAccount: '**** 1120',
      recipientBank: 'Gusto Payroll Services',
      recipientAccount: '**** 9934',
      reference: 'March 2026 Payroll Fund',
      fee: '$25.00',
      netAmount: '$142,525.00'
    },
    'TRX-99378': {
      id: 'TRX-99378',
      date: 'March 05, 2026',
      time: '08:00 EST',
      description: 'International Wire - Failed',
      type: 'Outbound',
      amount: '$8,500.00',
      status: 'Failed',
      account: 'EUR Operating',
      senderName: 'Acme Corp',
      senderBank: 'JPMorgan Chase',
      senderAccount: '**** 1120',
      recipientBank: 'Deutsche Bank',
      recipientAccount: '**** 4432',
      reference: 'Contractor Payment - EU Team',
      fee: '$45.00',
      netAmount: '$0.00',
      failureReason: 'Invalid IBAN provided. Funds reversed.'
    }
  };

  // Find the specific transaction or fallback to a default
  const upperId = id?.toUpperCase() || 'TRX-99382';
  const trx = fundingDatabase[upperId] || fundingDatabase['TRX-99382'];
  const isInbound = trx.type === 'Inbound';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-[#ECFDF5] text-[#065F46]';
      case 'Pending': return 'bg-[#FFFBEB] text-[#92400E]';
      case 'Failed': return 'bg-[#FEF2F2] text-[#991B1B]';
      default: return 'bg-[#F4F4F5] text-[#52525B]';
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
            onClick={() => navigate('/funding')}
            className="p-2 -ml-2 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-[#0A0A0A]">{trx.id}</h1>
              <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusBadge(trx.status)}`}>
                {t(trx.status)}
              </span>
            </div>
            <p className="text-[#71717A] text-sm">{t(trx.description)} • {trx.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-md text-sm font-medium hover:bg-white transition-colors">
            <Download className="w-4 h-4 text-[#71717A]" />
            {t('Download Receipt')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-md text-sm font-medium hover:bg-white transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#71717A]" />
            {t('More')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Amount Card */}
          <div className="bg-white rounded-md border border-[#F4F4F5] p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decorative element */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 ${isInbound ? 'bg-[#047857]' : 'bg-[#FF3C21]'}`}></div>
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isInbound ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#F4F4F5] text-[#0A0A0A]'}`}>
              {isInbound ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            
            <p className="text-sm font-medium text-[#71717A] mb-2">{isInbound ? t('Total Received') : t('Total Sent')}</p>
            <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isInbound ? 'text-[#047857]' : 'text-[#0A0A0A]'}`}>
              {isInbound ? '+' : '-'}{trx.amount}
            </h2>
            <p className="text-sm text-[#71717A]">{t('on')} {trx.date} {t('at')} {trx.time}</p>
            
            {trx.status === 'Failed' && trx.failureReason && (
              <div className="mt-6 px-4 py-3 bg-[#FEF2F2] text-[#991B1B] text-sm rounded border border-[#F5D5D5] w-full max-w-md text-center">
                {t(trx.failureReason)}
              </div>
            )}
          </div>

          {/* Transaction Flow Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sender Details */}
            <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F4F4F5] bg-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{isInbound ? t('Sender') : t('From Account')}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Name')}</p>
                  <p className="text-sm font-medium text-[#0A0A0A]">{trx.senderName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Institution')}</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#D4D4D8]" />
                    <p className="text-sm text-[#0A0A0A]">{trx.senderBank}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Account Info')}</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D4D4D8]" />
                    <p className="text-sm text-[#52525B]">{trx.senderAccount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F4F4F5] bg-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{isInbound ? t('To Account') : t('Recipient')}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Account')}</p>
                  <p className="text-sm font-medium text-[#0A0A0A]">{trx.account}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Institution')}</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#D4D4D8]" />
                    <p className="text-sm text-[#0A0A0A]">{trx.recipientBank}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Account Info')}</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D4D4D8]" />
                    <p className="text-sm text-[#52525B]">{trx.recipientAccount}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Breakdown & Metadata */}
          <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F4F4F5] bg-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#71717A]" />
              <h3 className="text-sm font-semibold text-[#0A0A0A]">{t('Transaction Breakdown')}</h3>
            </div>
            <div className="p-6">
              
              <div className="space-y-3 mb-6 pb-6 border-b border-[#F4F4F5]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#52525B]">{t('Transfer Amount')}</span>
                  <span className="text-[#0A0A0A] font-medium">{trx.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#52525B]">{t('Processing Fees')}</span>
                  <span className="text-[#0A0A0A]">{trx.fee}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-[#F4F4F5] font-medium">
                  <span className="text-[#0A0A0A]">{t('Total Net Impact')}</span>
                  <span className="text-[#0A0A0A]">{trx.netAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Transaction ID')}</p>
                  <p className="text-sm text-[#0A0A0A] font-mono">{trx.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Reference Note')}</p>
                  <p className="text-sm text-[#0A0A0A]">{t(trx.reference)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">{t('Status Updated')}</p>
                  <div className="flex items-center gap-1.5">
                    {trx.status === 'Completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#065F46]" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-[#92400E]" />
                    )}
                    <p className="text-sm text-[#52525B]">{trx.date}</p>
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