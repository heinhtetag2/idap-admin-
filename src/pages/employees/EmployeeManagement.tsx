import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Briefcase, Building, CalendarDays, Clock, FileText, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { motion } from 'motion/react';

const mockEmployees = [
  {
    id: 1,
    name: "Mg Mg",
    subName: "마웅마웅",
    status: "Active",
    role: "Manager",
    department: "Management",
    hireDate: "2023-05-15",
    contract: "3 Years",
    expiry: "2026-05-15",
    baseSalary: "1,200,000",
    currentSalary: "1,200,000",
    currency: "K",
    avatarColor: "bg-[#E3F2FD] text-[#1D4ED8]",
    initial: "M"
  },
  {
    id: 2,
    name: "Aye Aye",
    subName: "에이에이",
    status: "Active",
    role: "Manager",
    department: "Management",
    hireDate: "2023-08-20",
    contract: "3 Years",
    expiry: "2026-08-20",
    baseSalary: "1,100,000",
    currentSalary: "1,100,000",
    currency: "K",
    avatarColor: "bg-[#ECFDF5] text-[#047857]",
    initial: "A"
  },
  {
    id: 3,
    name: "Ko Ko",
    subName: "코코",
    status: "Active",
    role: "Junior Developer",
    department: "Development",
    hireDate: "2024-01-10",
    contract: "3 Years",
    expiry: "2027-01-10",
    baseSalary: "800,000",
    currentSalary: "800,000",
    currency: "K",
    avatarColor: "bg-[#FFFBEB] text-[#B45309]",
    initial: "K"
  },
  {
    id: 4,
    name: "Thiri",
    subName: "티리",
    status: "Active",
    role: "Senior Developer",
    department: "Development",
    hireDate: "2023-03-05",
    contract: "3 Years",
    expiry: "2026-03-05",
    baseSalary: "1,300,000",
    currentSalary: "1,300,000",
    currency: "K",
    avatarColor: "bg-[#F3E5F5] text-[#7B1FA2]",
    initial: "T"
  },
  {
    id: 5,
    name: "Nway",
    subName: "느웨이",
    status: "Active",
    role: "Pro Designer",
    department: "Design",
    hireDate: "2024-02-28",
    contract: "3 Years",
    expiry: "2027-02-28",
    baseSalary: "750,000",
    currentSalary: "750,000",
    currency: "K",
    avatarColor: "bg-[#E0F7FA] text-[#00838F]",
    initial: "N"
  },
  {
    id: 6,
    name: "Soe",
    subName: "쏘",
    status: "Active",
    role: "Office Admin",
    department: "Admin",
    hireDate: "2023-11-12",
    contract: "3 Years",
    expiry: "2026-11-12",
    baseSalary: "950,000",
    currentSalary: "950,000",
    currency: "K",
    avatarColor: "bg-[#FFEBEE] text-[#C62828]",
    initial: "S"
  }
];

export default function EmployeeManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

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
          <h1 className="text-3xl font-serif text-[#0A0A0A]">{t('Employee Management')}</h1>
          <p className="text-sm text-[#71717A] mt-1">{t('Manage your team members and their details.')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FF3C21] text-white rounded-md text-sm font-medium hover:bg-[#E63419] transition-colors shadow-none cursor-pointer whitespace-nowrap">
            <Plus className="w-4 h-4" />
            {t('Add Employee')}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Number of Employees', value: '6', unit: 'Person', valueColor: 'text-[#0A0A0A]', unitColor: 'text-[#52525B]' },
          { title: 'New Hires This Month', value: '0', unit: 'Person', valueColor: 'text-[#047857]', unitColor: 'text-[#047857]' },
          { title: 'Average Tenure', value: '1.2', unit: 'Year', valueColor: 'text-[#0A0A0A]', unitColor: 'text-[#52525B]' },
          { title: 'Total Base Salary', value: '6,100,000', unit: 'K', valueColor: 'text-[#0A0A0A]', unitColor: 'text-[#52525B]' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white border border-[#E4E4E7] rounded-md p-5 flex flex-col justify-center shadow-none hover:border-[#D4D4D8] transition-colors"
          >
            <span className="text-xs font-medium text-[#71717A] mb-1.5">{t(stat.title)}</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-semibold ${stat.valueColor}`}>{stat.value}</span>
              <span className={`text-sm font-medium ${stat.unitColor}`}>{t(stat.unit)}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Grid Section */}
      <div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input 
              type="text" 
              placeholder={t('Search employees...')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E4E7] rounded-md text-sm focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#71717A] shadow-none transition-all"
            />
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockEmployees.map((emp, index) => (
          <motion.div 
            key={emp.id} 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-[#E4E4E7] rounded-md p-5 flex flex-col shadow-none group hover:border-[#D4D4D8] transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${emp.avatarColor}`}>
                  {emp.initial}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0A0A0A] leading-tight">{emp.name}</h3>
                  <span className="text-[13px] text-[#71717A] mt-0.5 block">{emp.subName}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide bg-[#ECFDF5] text-[#047857] rounded-md border border-[#D1FAE5] shadow-none">
                {t('Active')}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
                <Briefcase className="w-4 h-4 text-[#71717A]" />
                <span>{emp.role}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
                <Building className="w-4 h-4 text-[#71717A]" />
                <span>{emp.department}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
                <CalendarDays className="w-4 h-4 text-[#71717A]" />
                <span>{t('Hire Date')}: <span className="text-[#0A0A0A]">{emp.hireDate}</span></span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
                <Clock className="w-4 h-4 text-[#71717A]" />
                <span>{t('Contract')}: <span className="text-[#0A0A0A]">{emp.contract}</span></span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#52525B]">
                <FileText className="w-4 h-4 text-[#71717A]" />
                <span>{t('Expiry')}: <span className="text-[#0A0A0A]">{emp.expiry}</span></span>
              </div>
            </div>

            {/* Salary */}
            <div className="mt-auto border-t border-[#F4F4F5] pt-4 mb-5">
              <div className="flex justify-between items-center text-[13px] mb-2.5">
                <span className="text-[#71717A]">{t('Base Salary')}</span>
                <span className="font-semibold text-[#0A0A0A]">{emp.baseSalary} <span className="text-[#71717A] font-medium ml-0.5">{emp.currency}</span></span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#71717A]">{t('Current Salary')}</span>
                <span className="font-semibold text-[#0A0A0A]">{emp.currentSalary} <span className="text-[#71717A] font-medium ml-0.5">{emp.currency}</span></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-[#E4E4E7] rounded-md text-[13px] font-medium text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A] hover:border-[#D4D4D8] transition-all shadow-none cursor-pointer">
                <Eye className="w-4 h-4" />
                {t('View Details')}
              </button>
              <button className="flex items-center justify-center w-9 h-9 bg-white border border-[#E4E4E7] rounded-md text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#0A0A0A] hover:border-[#D4D4D8] transition-all shadow-none cursor-pointer">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center w-9 h-9 bg-white border border-[#E4E4E7] rounded-md text-[#d4183d] hover:bg-[#FEF2F2] hover:text-[#B91C1C] hover:border-[#FECACA] transition-all shadow-none cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  );
}