import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, ExternalLink, ChevronDown, Upload, Trash2, ShieldAlert,
  UserCircle, CreditCard, Cpu, MonitorPlay, Database, Settings as SettingsIcon,
  Bell, FileText, FlaskConical, Zap, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/cn';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('Account');

  const navigation = [
    {
      category: t('Personal'),
      items: [
        { id: 'Account', label: t('Account'), icon: UserCircle },
        { id: 'Billing', label: t('Billing'), icon: CreditCard },
        { id: 'Memory', label: t('Memory'), icon: Cpu },
        { id: 'Display controls', label: t('Display controls'), icon: MonitorPlay },
        { id: 'Data management', label: t('Data management'), icon: Database },
        { id: 'Defaults', label: t('Defaults'), icon: SettingsIcon },
        { id: 'Notifications', label: t('Notifications'), icon: Bell },
        { id: 'Evidence', label: t('Evidence'), icon: FileText },
        { id: 'iDap Labs', label: t('iDap Labs'), icon: FlaskConical },
      ]
    },
    {
      category: t('Integrations'),
      items: [
        { id: 'EMR integrations', label: t('EMR integrations'), icon: Zap },
        { id: 'Coding', label: t('Coding'), icon: Code },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full bg-[#FAFAF9] flex-col md:flex-row overflow-hidden w-full max-w-none"
    >
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-64 border-r border-[#EAE5E3] bg-white flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="p-4 shrink-0">
          <h2 className="text-lg font-medium text-[#2C2627] mb-4">{t('Settings')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284]" />
            <input 
              type="text" 
              placeholder={t('Search')} 
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] placeholder:text-[#8A8284] focus:outline-none focus:border-[#4C2D33] transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 px-2 pb-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.category}>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#8A8284] uppercase tracking-wider">
                {group.category}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3",
                        isActive
                          ? "bg-[#F0EBE9] text-[#4C2D33] font-medium"
                          : "text-[#4A4345] hover:bg-[#F5F2F0]"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4",
                        isActive ? "text-[#4C2D33]" : "text-[#8A8284]"
                      )} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <span className="text-sm text-[#8A8284] font-medium">{navigation.find(g => g.items.some(i => i.id === activeSection))?.category}</span>
            <h1 className="text-3xl font-serif text-[#2C2627] mt-1">{t(activeSection)}</h1>
            
            {activeSection === 'Account' && (
              <p className="text-sm text-[#8A8284] mt-8 leading-relaxed max-w-3xl">
                By using iDap you acknowledge and agree to abide by the <a href="#" className="font-medium underline hover:text-[#2C2627] transition-colors flex inline-flex items-center gap-1">Usage Policy <ExternalLink className="w-3 h-3" /></a> and <a href="#" className="font-medium underline hover:text-[#2C2627] transition-colors flex inline-flex items-center gap-1">Terms of Use <ExternalLink className="w-3 h-3" /></a>. For more information, see our Regulatory Information page.
              </p>
            )}
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
          {activeSection === 'Account' ? (
            <div className="space-y-8 pb-20">
              
              {/* About You Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2C2627] mb-4">{t('About you')}</h3>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-6">
                  
                  {/* Profile Image */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-[#2C2627] mb-3">{t('Profile image')}</label>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full border border-[#EAE5E3] bg-white flex items-center justify-center text-[#2C2627] text-xl font-medium shrink-0">
                        HH
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs text-[#8A8284]">{t('Upload a JPG or PNG image up to 5MB. Shows in the template community.')}</p>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] hover:bg-[#F5F2F0] transition-colors">
                          <Upload className="w-4 h-4 text-[#8A8284]" />
                          {t('Upload image')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Row: Title, First, Last */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Title')}</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                          <option>Select a title</option>
                          <option>Dr.</option>
                          <option>Mr.</option>
                          <option>Ms.</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('First name')}</label>
                      <input 
                        type="text" 
                        defaultValue="Hein"
                        className="w-full px-3 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Last name')}</label>
                      <input 
                        type="text" 
                        defaultValue="Htet"
                        className="w-full px-3 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Specialty')}</label>
                    <div className="relative">
                      <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                        <option>Accident and Emergency Nurse</option>
                        <option>General Practitioner</option>
                        <option>Cardiologist</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                    </div>
                  </div>

                  {/* Mid Row: Org, Size, Role */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Organisation name')}</label>
                      <input 
                        type="text" 
                        defaultValue="Hein's Org"
                        className="w-full px-3 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Company size')}</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                          <option>Just me</option>
                          <option>2-10 employees</option>
                          <option>11-50 employees</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Your role')}</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                          <option>Individual clinician</option>
                          <option>Practice manager</option>
                          <option>Admin</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Country, State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-[#2C2627]">{t('Country')}</label>
                        <button className="text-[11px] text-[#8A8284] hover:text-[#2C2627] transition-colors">Why can't I change this?</button>
                      </div>
                      <input 
                        type="text" 
                        value="United States of America"
                        readOnly
                        className="w-full px-3 py-2.5 bg-[#F5F2F0] border border-transparent rounded-md text-sm text-[#8A8284] cursor-not-allowed"
                      />
                      <a href="#" className="flex items-center gap-1 text-[11px] text-[#8A8284] mt-2 hover:text-[#2C2627] transition-colors inline-flex">
                        Privacy Policy for my country <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('State/Region')}</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                          <option>Alaska</option>
                          <option>California</option>
                          <option>New York</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Login Details Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2C2627] mb-4">{t('Login details')}</h3>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-6 space-y-8">
                  
                  {/* Email Row */}
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#2C2627] mb-2">{t('Email')}</label>
                      <input 
                        type="email" 
                        value="heincise@gmail.com"
                        readOnly
                        className="w-full px-3 py-2.5 bg-[#F5F2F0] border border-transparent rounded-md text-sm text-[#8A8284] cursor-not-allowed"
                      />
                    </div>
                    <button className="px-4 py-2.5 border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] hover:bg-[#F5F2F0] transition-colors shrink-0 whitespace-nowrap">
                      {t('Change Email')}
                    </button>
                  </div>

                  <div className="h-px w-full bg-[#EAE5E3]"></div>

                  {/* MFA Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-[#2C2627]">{t('Multi-Factor Authentication (MFA)')}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FFF5F5] text-[#C84C4C] text-[10px] font-bold uppercase tracking-wider">{t('Not enabled')}</span>
                      </div>
                      <p className="text-sm text-[#8A8284]">{t('Add an extra layer of security when signing in to your account.')}</p>
                    </div>
                    <button className="px-4 py-2.5 border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] hover:bg-[#F5F2F0] transition-colors shrink-0 whitespace-nowrap">
                      {t('Enable MFA')}
                    </button>
                  </div>

                </div>
              </div>

              {/* Language & time Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2C2627] mb-4">{t('Language & time')}</h3>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-1">{t('Display language')}</label>
                      <p className="text-sm text-[#8A8284] mb-3">{t('Change the language used in the iDap interface.')}</p>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer"
                          value={i18n.language}
                          onChange={(e) => i18n.changeLanguage(e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="ko">한국어</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2627] mb-[26px]">Date format</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white border border-[#EAE5E3] rounded-md text-sm text-[#2C2627] focus:outline-none focus:border-[#4C2D33] transition-colors cursor-pointer">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8284] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral link Section */}
              <div>
                <h3 className="text-lg font-medium text-[#2C2627] mb-4">{t('Referral link')}</h3>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="block text-sm font-medium text-[#2C2627] mb-1">{t('Refer your network')}</span>
                    <p className="text-sm text-[#8A8284]">Earn $50 per paid user. T&Cs apply.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#EAE5E3] rounded-md text-sm font-medium text-[#2C2627] hover:bg-[#F5F2F0] transition-colors shrink-0 whitespace-nowrap">
                    {t('Get my referral link')}
                    <ExternalLink className="w-4 h-4 text-[#8A8284]" />
                  </button>
                </div>
              </div>

              {/* Delete account Section */}
              <div>
                <h3 className="text-lg font-medium text-[#C84C4C] mb-4">{t('Delete account')}</h3>
                <div className="bg-white border border-[#EAE5E3] rounded-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors hover:border-[#F5DBDB]">
                  <div>
                    <span className="block text-sm font-medium text-[#C84C4C] mb-1">{t('Danger zone')}</span>
                    <p className="text-sm text-[#8A8284]">Permanently delete your account, and all the resources within it.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#F5F2F0] rounded-md text-sm font-medium text-[#C84C4C] hover:bg-[#FFF5F5] hover:border-[#F5DBDB] transition-all shrink-0 whitespace-nowrap">
                    <Trash2 className="w-4 h-4" />
                    {t('Delete my account')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-[#F5F2F0] rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-[#8A8284]" />
              </div>
              <h2 className="text-xl font-medium text-[#2C2627] mb-2">{activeSection} settings</h2>
              <p className="text-[#8A8284]">This section is currently under construction.</p>
            </div>
          )}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
