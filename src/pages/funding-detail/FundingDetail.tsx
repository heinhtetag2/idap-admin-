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
      case 'Completed': return 'bg-[#EDF5EC] text-[#2E5E2A]';
      case 'Pending': return 'bg-[#FFF9E5] text-[#8C6D1F]';
      case 'Failed': return 'bg-[#FBEBEB] text-[#8C1F1F]';
      default: return 'bg-[#F5F2F0] text-[#5A5254]';
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
            onClick={() => navigate('/funding')}
            className="p-2 -ml-2 text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-[#2C2627]">{trx.id}</h1>
              <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] uppercase tracking-wider font-semibold ${getStatusBadge(trx.status)}`}>
                {t(trx.status)}
              </span>
            </div>
            <p className="text-[#8A8284] text-sm">{t(trx.description)} • {trx.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE5E3] text-[#2C2627] rounded-md text-sm font-medium hover:bg-[#FCFBF9] transition-colors">
            <Download className="w-4 h-4 text-[#8A8284]" />
            {t('Download Receipt')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE5E3] text-[#2C2627] rounded-md text-sm font-medium hover:bg-[#FCFBF9] transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#8A8284]" />
            {t('More')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Amount Card */}
          <div className="bg-white rounded-md border border-[#F5F2F0] p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decorative element */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 ${isInbound ? 'bg-[#2E7D32]' : 'bg-[#2C2627]'}`}></div>
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isInbound ? 'bg-[#EDF5EC] text-[#2E7D32]' : 'bg-[#F5F2F0] text-[#2C2627]'}`}>
              {isInbound ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            
            <p className="text-sm font-medium text-[#8A8284] mb-2">{isInbound ? t('Total Received') : t('Total Sent')}</p>
            <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isInbound ? 'text-[#2E7D32]' : 'text-[#2C2627]'}`}>
              {isInbound ? '+' : '-'}{trx.amount}
            </h2>
            <p className="text-sm text-[#8A8284]">{t('on')} {trx.date} {t('at')} {trx.time}</p>
            
            {trx.status === 'Failed' && trx.failureReason && (
              <div className="mt-6 px-4 py-3 bg-[#FBEBEB] text-[#8C1F1F] text-sm rounded border border-[#F5D5D5] w-full max-w-md text-center">
                {t(trx.failureReason)}
              </div>
            )}
          </div>

          {/* Transaction Flow Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sender Details */}
            <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8A8284]" />
                <h3 className="text-sm font-semibold text-[#2C2627]">{isInbound ? t('Sender') : t('From Account')}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Name')}</p>
                  <p className="text-sm font-medium text-[#2C2627]">{trx.senderName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Institution')}</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#D5C9C6]" />
                    <p className="text-sm text-[#2C2627]">{trx.senderBank}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Account Info')}</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D5C9C6]" />
                    <p className="text-sm text-[#5A5254]">{trx.senderAccount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8A8284]" />
                <h3 className="text-sm font-semibold text-[#2C2627]">{isInbound ? t('To Account') : t('Recipient')}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Account')}</p>
                  <p className="text-sm font-medium text-[#2C2627]">{trx.account}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Institution')}</p>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#D5C9C6]" />
                    <p className="text-sm text-[#2C2627]">{trx.recipientBank}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Account Info')}</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D5C9C6]" />
                    <p className="text-sm text-[#5A5254]">{trx.recipientAccount}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Breakdown & Metadata */}
          <div className="bg-white rounded-md border border-[#F5F2F0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F5F2F0] bg-[#FCFBF9] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#8A8284]" />
              <h3 className="text-sm font-semibold text-[#2C2627]">{t('Transaction Breakdown')}</h3>
            </div>
            <div className="p-6">
              
              <div className="space-y-3 mb-6 pb-6 border-b border-[#F5F2F0]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5A5254]">{t('Transfer Amount')}</span>
                  <span className="text-[#2C2627] font-medium">{trx.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5A5254]">{t('Processing Fees')}</span>
                  <span className="text-[#2C2627]">{trx.fee}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-[#F5F2F0] font-medium">
                  <span className="text-[#2C2627]">{t('Total Net Impact')}</span>
                  <span className="text-[#2C2627]">{trx.netAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Transaction ID')}</p>
                  <p className="text-sm text-[#2C2627] font-mono">{trx.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Reference Note')}</p>
                  <p className="text-sm text-[#2C2627]">{t(trx.reference)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-1">{t('Status Updated')}</p>
                  <div className="flex items-center gap-1.5">
                    {trx.status === 'Completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5E2A]" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-[#8C6D1F]" />
                    )}
                    <p className="text-sm text-[#5A5254]">{trx.date}</p>
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