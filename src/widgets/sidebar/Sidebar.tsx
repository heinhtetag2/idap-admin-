import React from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  FileText, 
  Layers, 
  CheckSquare, 
  Library, 
  Globe, 
  Users, 
  Settings,
  HelpCircle,
  Bell,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  LayoutDashboard,
  Wallet,
  Receipt,
  Banknote,
  UsersRound,
  PiggyBank,
  CalendarDays,
  LineChart,
  ArrowRightLeft,
  ClipboardList,
  X
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import logo from '@/assets/iDaplogo.png';

export function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const { t } = useTranslation();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 68 : 240 }}
        className={cn(
          "h-full bg-[#FAF9F6] border-r border-[#EAE5E3] flex flex-col flex-shrink-0 transition-all duration-300 relative z-20",
          isCollapsed ? "w-[68px]" : "w-[240px] xl:w-[260px] 2xl:w-[280px]"
        )}
      >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 shrink-0">
        <div className={cn("flex items-center transition-all duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <img src={logo} alt="iDap" className="h-8 w-auto object-contain select-none" />
        </div>
        <button 
          onClick={onToggle}
          className={cn(
            "p-1.5 text-[#8A8284] hover:bg-[#F5F2F0] rounded-md transition-all",
            isCollapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* New Session Button */}
      <div className={cn("px-4 mb-4 mt-2", isCollapsed ? "px-2" : "")}>
        <button className={cn(
          "w-full flex items-center justify-center gap-2 bg-[#4C2D33] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3D2328] transition-colors",
          isCollapsed ? "px-0 py-2 h-10" : "px-4"
        )}>
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">New session</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 overflow-x-hidden">
        
        {/* Main */}
        <div>
          <div className={cn(
            "mb-2 text-[11px] font-semibold text-[#8A8284] uppercase tracking-wider transition-all duration-300",
            isCollapsed ? "opacity-0 h-0 overflow-hidden text-center" : "px-3 opacity-100 h-auto"
          )}>
            {t("MAIN")}
          </div>
          {isCollapsed && <div className="h-4" />}
          <div className="space-y-0.5">
            <NavItem icon={LayoutDashboard} label={t("Dashboard")} path="/" isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* Financial Operations */}
        <div>
          <div className={cn(
            "mb-2 text-[11px] font-semibold text-[#8A8284] uppercase tracking-wider transition-all duration-300",
            isCollapsed ? "opacity-0 h-0 overflow-hidden text-center" : "px-3 opacity-100 h-auto"
          )}>
            {t("FINANCIAL OPERATIONS")}
          </div>
          {isCollapsed && <div className="h-4" />}
          <div className="space-y-0.5">
            <NavItem icon={ClipboardList} label={t("Surveys")} path="/surveys" isCollapsed={isCollapsed} />
            <NavItem icon={Wallet} label={t("Funding")} path="/funding" isCollapsed={isCollapsed} />
            <NavItem icon={Receipt} label={t("Expenses")} path="/expenses" isCollapsed={isCollapsed} />
            <NavItem icon={Banknote} label={t("Payroll")} path="/payroll" isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* Community (Legacy) */}
        <div>
          <div className={cn(
            "mb-2 text-[11px] font-semibold text-[#8A8284] uppercase tracking-wider transition-all duration-300",
            isCollapsed ? "opacity-0 h-0 overflow-hidden text-center" : "px-3 opacity-100 h-auto"
          )}>
            {t("Community")}
          </div>
          {isCollapsed && <div className="h-4" />}
          <div className="space-y-0.5">
            <NavItem icon={Globe} label={t("Templates")} path="/community/templates" isCollapsed={isCollapsed} />
            <NavItem icon={Users} label={t("Team")} path="/team" isCollapsed={isCollapsed} />
            <NavItem icon={Settings} label={t("Settings")} path="/settings" isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#EAE5E3] space-y-0.5 shrink-0">
        <NavItem icon={HelpCircle} label={t("Help")} path="/help" isCollapsed={isCollapsed} />
        <NavButton 
          icon={({ className }) => (
            <div className="relative inline-flex">
              <Bell className={className} />
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#4C2D33] rounded-full border border-white"></span>
              )}
            </div>
          )}
          label={t("Notifications")} 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
          isCollapsed={isCollapsed} 
        />
        
        {/* User Profile */}
        <div className="relative group">
          <div className={cn(
            "mt-4 flex items-center hover:bg-[#F5F2F0] rounded-md cursor-pointer transition-colors w-full",
            isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-2 py-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-[#4C2D33] text-white flex items-center justify-center text-xs font-medium shrink-0">
              H
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-[#2C2627] truncate text-left">Hein Htet</span>
                <span className="text-xs text-[#8A8284] truncate text-left">heincise@gmail.com</span>
              </div>
            )}
          </div>
          
          {/* Profile Menu Dropdown */}
          <div className="absolute left-full bottom-0 ml-2 w-56 bg-[#FCFBF9] border border-[#EAE5E3] rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5 flex flex-col gap-0.5">
            <div className="px-2.5 py-2 mb-1">
              <span className="block text-sm font-medium text-[#2C2627] truncate">Hein Htet</span>
              <span className="block text-xs text-[#8A8284] truncate">heincise@gmail.com</span>
            </div>
            
            <div className="h-px bg-[#EAE5E3] mx-1 mb-1"></div>
            
            <button className="w-full text-left px-2.5 py-1.5 text-sm font-medium text-[#4A4345] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-sm transition-colors flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-[#8A8284]" />
              Account Settings
            </button>
            <button className="w-full text-left px-2.5 py-1.5 text-sm font-medium text-[#4A4345] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-sm transition-colors flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#8A8284]" />
              Support
            </button>
            
            <div className="h-px bg-[#EAE5E3] mx-1 my-1"></div>
            
            <button className="w-full text-left px-2.5 py-1.5 text-sm font-medium text-[#8A8284] hover:text-[#2C2627] hover:bg-[#F5F2F0] rounded-sm transition-colors flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </motion.aside>

      {/* Notifications Sliding Panel */}
      <AnimatePresence>
      {isNotificationsOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full bg-white border-r border-[#EAE5E3] overflow-hidden z-10 flex-shrink-0 relative"
        >
          <div className="w-[320px] h-full flex flex-col">
            {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#EAE5E3] shrink-0">
            <h2 className="text-base font-semibold text-[#2C2627] tracking-tight">{t("Notifications")}</h2>
            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-[#8A8284] hover:bg-[#F5F2F0] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content area - Notifications List */}
          <div className="flex-1 overflow-y-auto bg-[#FAF9F6]">
            {/* Unread Section */}
            {hasUnread && (
              <div className="px-5 py-3">
                <h3 className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-3">
                  {t("New")}
                </h3>
                <div className="space-y-2">
                  {/* Notification Item 1 */}
                  <NavLink to="/payroll" className="group block text-left p-3 rounded-md bg-white border border-[#EAE5E3] hover:border-[#EAE5E3] transition-colors relative cursor-pointer">
                    <div className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-[#4C2D33]" />
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                        <Banknote className="w-4 h-4 text-[#4C2D33]" />
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-[#2C2627] leading-snug">
                          <span className="font-medium">{t("Payroll")}</span> {t("for March 2026 has been successfully processed.")}
                        </p>
                        <span className="text-xs text-[#8A8284] mt-1.5 block">
                          {t("10 mins ago")}
                        </span>
                      </div>
                    </div>
                  </NavLink>

                  {/* Notification Item 2 */}
                  <NavLink to="/tasks" className="group block text-left p-3 rounded-md bg-white border border-[#EAE5E3] hover:border-[#EAE5E3] transition-colors relative cursor-pointer">
                    <div className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-[#4C2D33]" />
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckSquare className="w-4 h-4 text-[#4C2D33]" />
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-[#2C2627] leading-snug">
                          {t("Sarah Jenkins assigned a new task: ")}
                          <span className="font-medium">"{t("Q1 Expense Review")}"</span>
                        </p>
                        <span className="text-xs text-[#8A8284] mt-1.5 block">
                          {t("1 hour ago")}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            )}

            {/* Earlier Section */}
            <div className={cn("px-5 py-3", hasUnread ? "border-t border-[#EAE5E3]" : "")}>
              <h3 className="text-xs font-semibold text-[#8A8284] uppercase tracking-wider mb-3">
                {hasUnread ? t("Earlier") : t("Recent")}
              </h3>
              <div className="space-y-2">
                {!hasUnread && (
                  <>
                    {/* Notification Item 1 (Moved) */}
                    <NavLink to="/payroll" className="group block text-left p-3 rounded-md bg-transparent hover:bg-white border border-transparent hover:border-[#EAE5E3] transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                          <Banknote className="w-4 h-4 text-[#5A5254]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#5A5254] leading-snug">
                            <span className="font-medium text-[#2C2627]">{t("Payroll")}</span> {t("for March 2026 has been successfully processed.")}
                          </p>
                          <span className="text-xs text-[#8A8284] mt-1.5 block">
                            {t("10 mins ago")}
                          </span>
                        </div>
                      </div>
                    </NavLink>

                    {/* Notification Item 2 (Moved) */}
                    <NavLink to="/tasks" className="group block text-left p-3 rounded-md bg-transparent hover:bg-white border border-transparent hover:border-[#EAE5E3] transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckSquare className="w-4 h-4 text-[#5A5254]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#5A5254] leading-snug">
                            {t("Sarah Jenkins assigned a new task: ")}
                            <span className="font-medium text-[#2C2627]">"{t("Q1 Expense Review")}"</span>
                          </p>
                          <span className="text-xs text-[#8A8284] mt-1.5 block">
                            {t("1 hour ago")}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </>
                )}
                {/* Notification Item 3 */}
                <NavLink to="/monthly-closing" className="group block text-left p-3 rounded-md bg-transparent hover:bg-white border border-transparent hover:border-[#EAE5E3] transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-[#5A5254]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#5A5254] leading-snug">
                        <span className="font-medium text-[#2C2627]">{t("Monthly Closing")}</span> {t("report for February is ready to review.")}
                      </p>
                      <span className="text-xs text-[#8A8284] mt-1.5 block">
                        {t("Yesterday")}
                      </span>
                    </div>
                  </div>
                </NavLink>

                {/* Notification Item 4 */}
                <NavLink to="/employee-management" className="group block text-left p-3 rounded-md bg-transparent hover:bg-white border border-transparent hover:border-[#EAE5E3] transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F2F0] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-[#5A5254]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#5A5254] leading-snug">
                        {t("New team member ")}
                        <span className="font-medium text-[#2C2627]">Alex Chen</span>
                        {t(" joined the Engineering department.")}
                      </p>
                      <span className="text-xs text-[#8A8284] mt-1.5 block">
                        {t("Mar 15")}
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          {hasUnread && (
            <div className="p-4 border-t border-[#EAE5E3] bg-white mt-auto shrink-0">
              <button 
                onClick={() => setHasUnread(false)}
                className="w-full py-2 px-4 bg-transparent border border-[#EAE5E3] text-[#4C2D33] text-sm font-medium rounded-md hover:bg-[#F5F2F0] transition-colors"
              >
                {t("Mark all as read")}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon: Icon, label, path, isCollapsed }: { icon: React.ElementType, label: string, path: string, isCollapsed?: boolean }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => cn(
        "flex items-center rounded-md text-sm font-medium transition-colors group",
        isCollapsed ? "justify-center p-2 h-10 w-10 mx-auto" : "gap-3 px-3 py-2 w-full",
        isActive 
          ? "bg-[#F0EBE9] text-[#4C2D33]"
          : "text-[#5A5254] hover:bg-[#F5F2F0] hover:text-[#2C2627]"
      )}
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", isActive ? "text-[#4C2D33]" : "text-[#8A8284] group-hover:text-[#5A5254]")} />
          {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

function NavButton({ icon: Icon, label, isActive, onClick, isCollapsed }: { icon: React.ElementType, label: string, isActive?: boolean, onClick: () => void, isCollapsed?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md text-sm font-medium transition-colors group",
        isCollapsed ? "justify-center p-2 h-10 w-10 mx-auto" : "gap-3 px-3 py-2 w-full",
        isActive 
          ? "bg-[#F0EBE9] text-[#4C2D33]"
          : "text-[#5A5254] hover:bg-[#F5F2F0] hover:text-[#2C2627]"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", isActive ? "text-[#4C2D33]" : "text-[#8A8284] group-hover:text-[#5A5254]")} />
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
