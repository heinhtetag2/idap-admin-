import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, User, Globe, Plus, Pencil, Star, UploadCloud, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

const tableData = [
  { name: 'SOAP Progress Note', type: 'Note', edited: '01/29/2026', used: '03/05/2026', creator: 'Me', visibility: 'Just me' },
  { name: 'Patient Explainer Letter', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Allied Health Team Meeting Note', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Board / Executive Meeting Minutes', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Business Meeting', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Case Review / Clinical Supervision Note', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Clinical Governance Meeting Note', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
  { name: 'Departmental Team Meeting Note', type: 'Note', edited: '-', used: '-', creator: 'iDap', visibility: 'Just me' },
];

export default function Templates() {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto w-full px-6 md:px-8 xl:px-12 py-8"
    >
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0A0A0A]">{t('My Templates')}</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] rounded-md text-sm font-medium text-[#0A0A0A] hover:bg-[#F4F4F5] transition-colors bg-white">
            <Globe className="w-4 h-4" />
            {t('Browse community')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FF3C21] rounded-md text-sm font-medium text-white hover:bg-[#E63419] transition-colors">
            <Plus className="w-4 h-4" />
            {t('Create template')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#E4E4E7] mb-8 text-sm font-medium">
        <button className="pb-3 border-b-2 border-[#FF3C21] text-[#0A0A0A]">{t('All')}</button>
        <button className="pb-3 text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1.5"><FileIcon /> {t('Notes')}</button>
        <button className="pb-3 text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1.5"><DocIcon /> {t('Docs')}</button>
        <button className="pb-3 text-[#71717A] hover:text-[#0A0A0A] flex items-center gap-1.5"><FormIcon /> {t('Forms')}</button>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">{t('Overview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Templates',
              value: '24',
              icon: <Star className="w-4 h-4" />,
              trend: '12.5%',
              trendUp: true,
              subtitle: 'All active templates'
            },
            {
              title: 'Templates Used',
              value: '1,284',
              icon: <Calendar className="w-4 h-4" />,
              trend: '8.3%',
              trendUp: true,
              subtitle: 'Compared to last month'
            },
            {
              title: 'Avg Time Saved',
              value: '2.69h',
              icon: <Globe className="w-4 h-4" />,
              trend: '0.8%',
              trendUp: true,
              subtitle: 'Per active user'
            },
            {
              title: 'Shared Templates',
              value: '3',
              icon: <UploadCloud className="w-4 h-4" />,
              subtitle: 'This month: 1 added'
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white rounded-md border border-[#F4F4F5] p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-[#0A0A0A]">
                  {card.icon}
                </div>
                {card.trend && (
                  <div className="flex items-center text-[#10B981] text-xs font-semibold gap-0.5">
                    {card.trendUp && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
                    )}
                    {card.trend}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-[#71717A] font-medium mb-1">{t(card.title)}</div>
                <div className="text-2xl font-bold text-[#0A0A0A] tracking-tight mb-1">{card.value}</div>
                <div className="text-[11px] text-[#71717A]">{t(card.subtitle)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Library Section */}
      <div>
        <h2 className="text-lg font-semibold text-[#0A0A0A] mb-4">{t('Library')}</h2>
        
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input 
              type="text" 
              placeholder={t('Search for a template')} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#71717A]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
            <Calendar className="w-4 h-4" />
            {t('Date')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E4E4E7] bg-white rounded-md text-sm font-medium text-[#52525B] hover:bg-[#F4F4F5] transition-colors">
            <User className="w-4 h-4" />
            {t('Created by')}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md border border-[#F4F4F5] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#F4F4F5] text-[#71717A] font-medium bg-[#FAFAFA]">
                <th className="px-6 py-4 font-medium">{t('Template name')}</th>
                <th className="px-6 py-4 font-medium flex items-center gap-1 cursor-pointer hover:text-[#52525B]">{t('Last edited')} <ChevronDownIcon /></th>
                <th className="px-6 py-4 font-medium">{t('Last used')}</th>
                <th className="px-6 py-4 font-medium">{t('Creator')}</th>
                <th className="px-6 py-4 font-medium">{t('Visibility')}</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {tableData.map((row, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="hover:bg-white transition-colors group"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="font-medium text-[#0A0A0A]">{row.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#F4F4F5] text-[#71717A]">{t(row.type)}</span>
                  </td>
                  <td className="px-6 py-4 text-[#52525B]">{row.edited}</td>
                  <td className="px-6 py-4 text-[#52525B]">{row.used}</td>
                  <td className="px-6 py-4 font-medium text-[#0A0A0A]">{t(row.creator)}</td>
                  <td className="px-6 py-4 text-[#52525B]">{t(row.visibility)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md"><Star className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md"><UploadCloud className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#71717A] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] rounded-md"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// Icons specific to this design
function FileIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>; }
function DocIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>; }
function FormIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; }
function ChevronDownIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>; }
