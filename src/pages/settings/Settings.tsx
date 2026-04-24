import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  ShieldCheck,
  Bell,
  Globe,
  Monitor,
  Smartphone,
  Search,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Info,
  X,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/shared/ui/drawer';
import { BrandSelect } from '@/shared/ui/brand-select';
import { cn } from '@/shared/lib/cn';
import { PLATFORM_FEE, REWARD, WITHDRAWAL, TRUST_LEVELS } from '@/shared/config/business';
import { signOut } from '@/shared/lib/auth';
import { useNavigate } from 'react-router';

type SectionId = 'account' | 'admins' | 'policies' | 'notifications' | 'region' | 'sessions';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAVIGATION: NavGroup[] = [
  { group: 'Personal',           items: [{ id: 'account',       label: 'Account',           icon: User }] },
  { group: 'Workspace',          items: [{ id: 'admins',        label: 'Admins & Roles',    icon: Users }] },
  { group: 'Platform',           items: [{ id: 'policies',      label: 'Policies',          icon: ShieldCheck }] },
  {
    group: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications',     icon: Bell },
      { id: 'region',        label: 'Language & region', icon: Globe },
    ],
  },
  { group: 'Privacy & Security', items: [{ id: 'sessions',      label: 'Sessions',          icon: Monitor }] },
];

const SECTION_META: Record<SectionId, { group: string; title: string; description?: string }> = {
  account:       { group: 'Personal',           title: 'Account',           description: 'Your profile and how you sign in' },
  admins:        { group: 'Workspace',          title: 'Admins & Roles',    description: 'Manage team access to the admin console' },
  policies:      { group: 'Platform',           title: 'Policies',          description: 'Fees, rewards, and quality gates for every company and respondent' },
  notifications: { group: 'Preferences',        title: 'Notifications',     description: 'Which moderation events should alert you' },
  region:        { group: 'Preferences',        title: 'Language & region', description: 'Display language, timezone, and date format' },
  sessions:      { group: 'Privacy & Security', title: 'Sessions',          description: 'Devices currently signed in to your admin account' },
};

export default function Settings() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SectionId>('account');
  const [search, setSearch] = useState('');

  const filteredNav = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return NAVIGATION;
    return NAVIGATION
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.label.toLowerCase().includes(q) || g.group.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [search]);

  const meta = SECTION_META[activeSection];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full bg-[#FAFAFA] overflow-hidden"
    >
      {/* Left nav */}
      <aside className="w-72 shrink-0 border-r border-[#E3E3E3] bg-white overflow-y-auto flex flex-col">
        <div className="px-5 pt-8 pb-4 shrink-0">
          <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">{t('Settings')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search')}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 pb-6 space-y-5">
          {filteredNav.length === 0 ? (
            <p className="px-3 text-xs text-[#8A8A8A]">{t('No settings match your search.')}</p>
          ) : filteredNav.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-2 text-[11px] font-medium text-[#8A8A8A] tracking-wider uppercase">
                {t(group.group)}
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
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer text-left',
                        isActive
                          ? 'bg-[#FFF1EE] text-[#FF3C21] font-medium'
                          : 'text-[#4A4A4A] hover:bg-[#F3F3F3] hover:text-[#1A1A1A]',
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#FF3C21]' : 'text-[#8A8A8A]')} />
                      {t(item.label)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">
          <header className="mb-10">
            <p className="text-sm text-[#8A8A8A] mb-1">{t(meta.group)}</p>
            <h1 className="text-3xl font-serif text-[#1A1A1A]">{t(meta.title)}</h1>
            {meta.description && (
              <p className="text-sm text-[#8A8A8A] mt-3 max-w-2xl leading-relaxed">{t(meta.description)}</p>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 pb-16"
            >
              {activeSection === 'account'       && <AccountSection />}
              {activeSection === 'admins'        && <AdminsSection />}
              {activeSection === 'policies'      && <PoliciesSection />}
              {activeSection === 'notifications' && <NotificationsSection />}
              {activeSection === 'region'        && <RegionSection />}
              {activeSection === 'sessions'      && <SessionsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────── Account ────────────────────────────────────────────── */

function AccountSection() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('Hein');
  const [lastName, setLastName] = useState('Htet');
  const [jobTitle, setJobTitle] = useState('Platform Moderator');
  const [country, setCountry] = useState('mn');
  const [city, setCity] = useState('Ulaanbaatar');
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);

  return (
    <>
      <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-2xl -mt-4">
        {t('By using iDap you acknowledge and agree to abide by the')}{' '}
        <a href="#" className="font-medium underline inline-flex items-center gap-1 hover:text-[#1A1A1A] transition-colors">
          {t('Usage Policy')}
          <ExternalLink className="w-3 h-3" />
        </a>
        {' '}{t('and')}{' '}
        <a href="#" className="font-medium underline inline-flex items-center gap-1 hover:text-[#1A1A1A] transition-colors">
          {t('Terms of Use')}
          <ExternalLink className="w-3 h-3" />
        </a>.
      </p>

      {/* Profile */}
      <FormSection title={t('Profile')}>
        <div className="space-y-6">
          {/* Profile image */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-3">{t('Profile image')}</label>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-[#FF3C21] text-white flex items-center justify-center text-lg font-medium shrink-0">
                H
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#8A8A8A] mb-3 max-w-sm leading-relaxed">
                  {t('Upload a JPG or PNG up to 5MB. Shown next to your name to teammates.')}
                </p>
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#8A8A8A]" />
                  {t('Upload image')}
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('First name')}>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Field>
            <Field label={t('Last name')}>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Field>
          </div>

          {/* Job title */}
          <Field label={t('Job title')}>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </Field>

          {/* Country / City */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('Country')}>
              <BrandSelect
                value={country}
                onValueChange={setCountry}
                options={[
                  { value: 'mn',    label: 'Mongolia' },
                  { value: 'kr',    label: 'South Korea' },
                  { value: 'jp',    label: 'Japan' },
                  { value: 'cn',    label: 'China' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </Field>
            <Field label={t('City')}>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </Field>
          </div>
        </div>
      </FormSection>

      {/* Login details */}
      <FormSection title={t('Login details')}>
        <div className="divide-y divide-[#E3E3E3]">
          {/* Email */}
          <div className="py-6 first:pt-0">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{t('Email')}</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 px-3 py-2 bg-[#F3F3F3] rounded-md text-sm text-[#8A8A8A] truncate">
                hein@idap.mn
              </div>
              <button
                onClick={() => setEmailDrawerOpen(true)}
                className="px-4 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              >
                {t('Change email')}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="py-6 last:pb-0 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1A1A1A]">{t('Password')}</div>
              <p className="text-sm text-[#8A8A8A] mt-1">{t('Last changed 3 months ago.')}</p>
            </div>
            <button
              onClick={() => setPasswordDrawerOpen(true)}
              className="px-4 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              {t('Change password')}
            </button>
          </div>
        </div>
      </FormSection>

      {/* Sign out */}
      <SignOutRow />

      {/* Delete account */}
      <section>
        <h3 className="text-lg font-medium text-[#DC2626] mb-4">{t('Delete account')}</h3>
        <div className="bg-white border border-[#E3E3E3] rounded-md p-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#DC2626]">{t('Danger zone')}</div>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {t('Permanently delete your account, surveys, and all associated data.')}
            </p>
          </div>
          <button
            onClick={() => setDeleteDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#DC2626] border border-[#E3E3E3] rounded-md hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            {t('Delete my account')}
          </button>
        </div>
      </section>

      <ChangeEmailDrawer open={emailDrawerOpen} onOpenChange={setEmailDrawerOpen} />
      <ChangePasswordDrawer open={passwordDrawerOpen} onOpenChange={setPasswordDrawerOpen} />
      <DeleteAccountDrawer open={deleteDrawerOpen} onOpenChange={setDeleteDrawerOpen} />
    </>
  );
}

function SignOutRow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <section>
        <h3 className="text-lg font-medium text-[#1A1A1A] mb-4">{t('Session')}</h3>
        <div className="bg-white border border-[#E3E3E3] rounded-md p-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#1A1A1A]">{t('Sign out')}</div>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {t('End your session on this device. You will be returned to the login page.')}
            </p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 text-[#8A8A8A]" />
            {t('Sign out')}
          </button>
        </div>
      </section>

      <SettingsConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('Sign out of this device?')}
        description={t('You will need to sign in again to access the admin console.')}
        confirmLabel={t('Sign out')}
        onConfirm={handleConfirm}
      />
    </>
  );
}

/* ─────────────────────────────────────── Language & region ──────────────────────────────────────────── */

function RegionSection() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [timezone, setTimezone] = useState('Asia/Ulaanbaatar');
  const [dateFormat, setDateFormat] = useState('mdy');

  const handleLang = (v: string) => {
    setLang(v);
    i18n.changeLanguage(v);
  };

  return (
    <FormSection title={t('Display preferences')}>
      <div className="space-y-6">
        <Field
          label={t('Display language')}
          description={t('Change the language used in the admin console.')}
        >
          <BrandSelect
            value={lang}
            onValueChange={handleLang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Español' },
              { value: 'fr', label: 'Français' },
              { value: 'ko', label: '한국어' },
            ]}
          />
        </Field>

        <Field
          label={t('Timezone')}
          description={t('All timestamps across the admin console use this timezone.')}
        >
          <BrandSelect
            value={timezone}
            onValueChange={setTimezone}
            options={[
              { value: 'Asia/Ulaanbaatar', label: 'Ulaanbaatar (GMT+8)' },
              { value: 'Asia/Tokyo',       label: 'Tokyo (GMT+9)' },
              { value: 'Asia/Singapore',   label: 'Singapore (GMT+8)' },
              { value: 'Europe/London',    label: 'London (GMT)' },
              { value: 'America/New_York', label: 'New York (GMT-5)' },
            ]}
          />
        </Field>

        <Field
          label={t('Date format')}
          description={t('How dates are displayed in tables and timelines.')}
        >
          <BrandSelect
            value={dateFormat}
            onValueChange={setDateFormat}
            options={[
              { value: 'mdy', label: 'Apr 24, 2026' },
              { value: 'dmy', label: '24 Apr 2026' },
              { value: 'iso', label: '2026-04-24' },
            ]}
          />
        </Field>
      </div>
    </FormSection>
  );
}

/* ──────────────────────────────────────────── Sessions ──────────────────────────────────────────────── */

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: React.ElementType;
}

const SESSIONS: Session[] = [
  { id: 's1', device: 'MacBook Pro · Chrome', location: 'Ulaanbaatar, MN', lastActive: 'Active now',  current: true,  icon: Monitor    },
  { id: 's2', device: 'iPhone 15 · Safari',   location: 'Ulaanbaatar, MN', lastActive: '2 hours ago', current: false, icon: Smartphone },
  { id: 's3', device: 'Windows · Firefox',    location: 'Seoul, KR',       lastActive: '3 days ago',  current: false, icon: Monitor    },
];

function SessionsSection() {
  const { t } = useTranslation();
  const [signOutSessionId, setSignOutSessionId] = useState<string | null>(null);
  const [signOutAllOpen, setSignOutAllOpen] = useState(false);
  const sessionToSignOut = SESSIONS.find((s) => s.id === signOutSessionId) ?? null;

  return (
    <>
      <FormSection title={t('Active sessions')} noPadding>
        <div className="divide-y divide-[#E3E3E3]">
          {SESSIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-3 px-6 py-4">
                <div className="w-9 h-9 rounded-md bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#1A1A1A]">{s.device}</span>
                    {s.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-medium">
                        {t('This device')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">
                    {s.location} · {t(s.lastActive)}
                  </div>
                </div>
                {!s.current && (
                  <button
                    onClick={() => setSignOutSessionId(s.id)}
                    className="text-sm font-medium text-[#4A4A4A] hover:text-[#B91C1C] transition-colors cursor-pointer shrink-0"
                  >
                    {t('Sign out')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </FormSection>

      <section>
        <h3 className="text-lg font-medium text-[#DC2626] mb-4">{t('Sign out everywhere')}</h3>
        <div className="bg-white border border-[#E3E3E3] rounded-md p-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#1A1A1A]">{t('Other sessions')}</div>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {t('Signs out every device except this one. You stay signed in here.')}
            </p>
          </div>
          <button
            onClick={() => setSignOutAllOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#DC2626] border border-[#E3E3E3] rounded-md hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            {t('Sign out all')}
          </button>
        </div>
      </section>

      <SignOutSessionModal
        session={sessionToSignOut}
        open={Boolean(signOutSessionId)}
        onOpenChange={(o) => !o && setSignOutSessionId(null)}
      />
      <SignOutAllModal open={signOutAllOpen} onOpenChange={setSignOutAllOpen} />
    </>
  );
}

/* ─────────────────────────────────────────── Notifications ──────────────────────────────────────────── */

type NotificationKey =
  | 'companyApplied'
  | 'companyFlagged'
  | 'surveyDraft'
  | 'surveyRejected'
  | 'respondentFraud'
  | 'respondentWarned'
  | 'payoutFailed'
  | 'payoutHighValue';

interface NotificationRow {
  key: NotificationKey;
  label: string;
  description: string;
  defaultEmail: boolean;
  defaultInApp: boolean;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  { key: 'companyApplied',   label: 'New company application',     description: 'When a company signs up and needs review',            defaultEmail: true,  defaultInApp: true  },
  { key: 'companyFlagged',   label: 'Company flagged',             description: 'Billing disputes or repeated policy violations',     defaultEmail: true,  defaultInApp: true  },
  { key: 'surveyDraft',      label: 'Survey submitted for review', description: 'A company publishes a draft that needs moderation',  defaultEmail: false, defaultInApp: true  },
  { key: 'surveyRejected',   label: 'Survey auto-rejected',        description: 'System detected policy violations in questions',     defaultEmail: true,  defaultInApp: true  },
  { key: 'respondentFraud',  label: 'Respondent fraud signal',     description: 'Fast completion, straight-lining, device anomalies', defaultEmail: true,  defaultInApp: true  },
  { key: 'respondentWarned', label: 'Warning issued',              description: 'Any admin warned a respondent',                      defaultEmail: false, defaultInApp: true  },
  { key: 'payoutFailed',     label: 'Payout failed',               description: 'Gateway rejection or processing error',              defaultEmail: true,  defaultInApp: true  },
  { key: 'payoutHighValue',  label: 'High-value payout requested', description: 'Requests over ₮100K — require second approver',      defaultEmail: true,  defaultInApp: true  },
];

function NotificationsSection() {
  const { t } = useTranslation();
  const [masterEmail, setMasterEmail] = useState(true);
  const [masterInApp, setMasterInApp] = useState(true);
  const [rows, setRows] = useState<Record<NotificationKey, { email: boolean; inApp: boolean }>>(
    () =>
      NOTIFICATION_ROWS.reduce((acc, r) => {
        acc[r.key] = { email: r.defaultEmail, inApp: r.defaultInApp };
        return acc;
      }, {} as Record<NotificationKey, { email: boolean; inApp: boolean }>),
  );

  const toggle = (key: NotificationKey, channel: 'email' | 'inApp') =>
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], [channel]: !prev[key][channel] } }));

  return (
    <>
      <FormSection title={t('Channels')}>
        <div className="divide-y divide-[#E3E3E3]">
          <div className="py-6 first:pt-0 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1A1A1A]">{t('Email')}</div>
              <p className="text-sm text-[#8A8A8A] mt-1">{t('Sent to hein@idap.mn')}</p>
            </div>
            <Toggle checked={masterEmail} onChange={() => setMasterEmail((v) => !v)} />
          </div>
          <div className="py-6 last:pb-0 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1A1A1A]">{t('In-app')}</div>
              <p className="text-sm text-[#8A8A8A] mt-1">{t('Appear in the bell menu on the sidebar')}</p>
            </div>
            <Toggle checked={masterInApp} onChange={() => setMasterInApp((v) => !v)} />
          </div>
        </div>
      </FormSection>

      <FormSection title={t('Events')} noPadding>
        <div className="hidden sm:grid grid-cols-[1fr_80px_80px] gap-4 px-6 pt-5 pb-3 text-xs font-medium text-[#8A8A8A]">
          <span>{t('Event')}</span>
          <span className="text-center">{t('Email')}</span>
          <span className="text-center">{t('In-app')}</span>
        </div>
        <div className="divide-y divide-[#E3E3E3] border-t border-[#E3E3E3]">
          {NOTIFICATION_ROWS.map((r) => (
            <div key={r.key} className="grid grid-cols-[1fr_80px_80px] gap-4 px-6 py-4 items-center">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#1A1A1A]">{t(r.label)}</div>
                <div className="text-xs text-[#8A8A8A] mt-0.5">{t(r.description)}</div>
              </div>
              <div className="flex justify-center">
                <Toggle
                  checked={masterEmail && rows[r.key].email}
                  onChange={() => toggle(r.key, 'email')}
                  disabled={!masterEmail}
                />
              </div>
              <div className="flex justify-center">
                <Toggle
                  checked={masterInApp && rows[r.key].inApp}
                  onChange={() => toggle(r.key, 'inApp')}
                  disabled={!masterInApp}
                />
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <SaveBar />
    </>
  );
}

/* ──────────────────────────────────────────── Admins & Roles ────────────────────────────────────────── */

type AdminRole = 'Super admin' | 'Moderator' | 'Read-only';
type AdminStatus = 'Active' | 'Invited';

interface Admin {
  id: string;
  name: string;
  email: string;
  initial: string;
  role: AdminRole;
  status: AdminStatus;
  lastActive: string;
  isYou?: boolean;
}

const ADMINS: Admin[] = [
  { id: 'a1', name: 'Hein Htet',           email: 'hein@idap.mn',      initial: 'H', role: 'Super admin', status: 'Active',  lastActive: 'Active now',    isYou: true },
  { id: 'a2', name: 'Tserenbat Ochirbat',  email: 'tserenbat@idap.mn', initial: 'T', role: 'Moderator',   status: 'Active',  lastActive: '15 min ago' },
  { id: 'a3', name: 'Oyunsuren Dashzeveg', email: 'oyuna@idap.mn',     initial: 'O', role: 'Moderator',   status: 'Active',  lastActive: '2 hours ago' },
  { id: 'a4', name: 'Bat-Erdene Munkhbat', email: 'bate@idap.mn',      initial: 'B', role: 'Read-only',   status: 'Active',  lastActive: 'Yesterday' },
  { id: 'a5', name: 'Anudari Sukhbaatar',  email: 'anudari@idap.mn',   initial: 'A', role: 'Moderator',   status: 'Invited', lastActive: 'Invited 2 days ago' },
];

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  'Super admin': 'Full access, including admin and policy management',
  'Moderator':   'Approve, pause, reject across moderation flows',
  'Read-only':   'View only — no state changes or exports',
};

function AdminsSection() {
  const { t } = useTranslation();
  const [inviteOpen, setInviteOpen] = useState(false);
  const activeCount = ADMINS.filter((a) => a.status === 'Active').length;
  const invitedCount = ADMINS.filter((a) => a.status === 'Invited').length;

  return (
    <>
      <FormSection
        title={t('Team members')}
        subtitle={`${activeCount} ${t('active')} · ${invitedCount} ${t('pending invite')}`}
        action={
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('Invite admin')}
          </button>
        }
        noPadding
      >
        <div className="divide-y divide-[#E3E3E3]">
          {ADMINS.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-6 py-4">
              <div className="w-9 h-9 rounded-full bg-[#FFF1EE] text-[#FF3C21] flex items-center justify-center text-sm font-medium shrink-0">
                {a.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#1A1A1A]">{a.name}</span>
                  {a.isYou && <span className="text-xs text-[#8A8A8A]">({t('you')})</span>}
                  {a.status === 'Invited' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] text-xs font-medium">
                      {t('Invite pending')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#8A8A8A] mt-0.5 truncate">{a.email}</div>
              </div>
              <div className="hidden md:block text-xs text-[#8A8A8A] shrink-0 tabular-nums w-28 text-right">
                {t(a.lastActive)}
              </div>
              <div className="shrink-0">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  a.role === 'Super admin' ? 'bg-[#FFF1EE] text-[#C2410C]'
                    : a.role === 'Moderator' ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                      : 'bg-[#F3F3F3] text-[#4A4A4A]',
                )}>
                  {t(a.role)}
                </span>
              </div>
              <button
                disabled={a.isYou}
                className="p-1.5 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={t('More actions')}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title={t('Role permissions')} subtitle={t('What each role can do across the admin console')}>
        <div className="divide-y divide-[#E3E3E3]">
          {(Object.keys(ROLE_DESCRIPTIONS) as AdminRole[]).map((role) => (
            <div key={role} className="flex items-center justify-between gap-6 py-6 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#1A1A1A]">{t(role)}</div>
                <div className="text-sm text-[#8A8A8A] mt-1">{t(ROLE_DESCRIPTIONS[role])}</div>
              </div>
              <span className="text-xs text-[#8A8A8A] tabular-nums shrink-0">
                {ADMINS.filter((a) => a.role === role).length} {t('members')}
              </span>
            </div>
          ))}
        </div>
      </FormSection>

      <InviteAdminDrawer open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}

/* ────────────────────────────────────────────── Policies ────────────────────────────────────────────── */

const QUALITY_BANDS = [
  { threshold: 80, label: 'Paid instantly',    detail: 'Reward released immediately on submit', tone: 'bg-[#ECFDF5] text-[#047857]' },
  { threshold: 50, label: 'Held 24 hours',     detail: 'Reward held pending review window',     tone: 'bg-[#FFFBEB] text-[#B45309]' },
  { threshold: 20, label: 'Invalidated',       detail: 'Reward not paid, response not counted', tone: 'bg-[#FEF2F2] text-[#B91C1C]' },
  { threshold: 0,  label: 'Flagged for fraud', detail: 'Escalated for admin review',            tone: 'bg-[#FEF2F2] text-[#B91C1C]' },
];

const GATEWAY_OPTIONS = [
  { id: 'qpay',   name: 'QPay',          blurb: 'Mongolian mobile wallet',  enabled: true  },
  { id: 'bonum',  name: 'Bonum',         blurb: 'Mobile wallet',            enabled: true  },
  { id: 'social', name: 'Social Pay',    blurb: 'Social Pay wallet',        enabled: true  },
  { id: 'bank',   name: 'Bank Transfer', blurb: 'Direct deposit, T+1',      enabled: false },
];

function PoliciesSection() {
  const { t } = useTranslation();
  const [feePct, setFeePct]               = useState<number>(PLATFORM_FEE.defaultPct);
  const [minReward, setMinReward]         = useState<number>(REWARD.minMnt);
  const [maxReward, setMaxReward]         = useState<number>(REWARD.maxMnt);
  const [holdHours, setHoldHours]         = useState<number>(REWARD.holdWindowHours);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(WITHDRAWAL.minMnt);
  const [gateways, setGateways] = useState(
    GATEWAY_OPTIONS.reduce((acc, g) => {
      acc[g.id] = g.enabled;
      return acc;
    }, {} as Record<string, boolean>),
  );

  return (
    <>
      <div className="flex items-start gap-3 p-4 rounded-md bg-[#FFFBEB]">
        <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <div className="font-medium text-[#1A1A1A]">{t('Platform-wide settings')}</div>
          <div className="text-[#8A8A8A] mt-0.5">
            {t('Changes here affect every company and respondent. Only Super admins can edit.')}
          </div>
        </div>
      </div>

      <FormSection title={t('Platform fee')} subtitle={t('Deducted from every survey reward pool')}>
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#1A1A1A]">{t('Platform fee')}</div>
            <div className="text-sm text-[#8A8A8A] mt-1">
              {t('Range')} {PLATFORM_FEE.minPct}–{PLATFORM_FEE.maxPct}% · {t('Default')} {PLATFORM_FEE.fallbackPct}%
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Input
              type="number"
              min={PLATFORM_FEE.minPct}
              max={PLATFORM_FEE.maxPct}
              step={0.5}
              value={feePct}
              onChange={(e) => setFeePct(Number(e.target.value) || 0)}
              className="w-20 tabular-nums"
            />
            <span className="text-sm text-[#8A8A8A]">%</span>
          </div>
        </div>
      </FormSection>

      <FormSection title={t('Rewards')} subtitle={t('Bounds companies must stay within when pricing a survey')}>
        <div className="divide-y divide-[#E3E3E3]">
          <PolicyRow label={t('Min reward per response')} >
            <MntInput value={minReward} onChange={setMinReward} />
          </PolicyRow>
          <PolicyRow label={t('Max reward per response')}>
            <MntInput value={maxReward} onChange={setMaxReward} />
          </PolicyRow>
          <PolicyRow
            label={t('Hold window')}
            description={t('Medium-quality responses sit on hold before auto-release')}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                value={holdHours}
                onChange={(e) => setHoldHours(Number(e.target.value) || 0)}
                className="w-20 tabular-nums"
              />
              <span className="text-sm text-[#8A8A8A]">{t('hours')}</span>
            </div>
          </PolicyRow>
        </div>
      </FormSection>

      <FormSection title={t('Quality thresholds')} subtitle={t('How scored responses map to reward outcomes')} noPadding>
        <div className="divide-y divide-[#E3E3E3]">
          {QUALITY_BANDS.map((band) => (
            <div key={band.label} className="flex items-center gap-3 px-6 py-4">
              <div className={cn('px-2 py-0.5 rounded-full text-xs font-medium tabular-nums shrink-0', band.tone)}>
                {band.threshold === 0 ? `< 20` : `≥ ${band.threshold}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#1A1A1A]">{t(band.label)}</div>
                <div className="text-xs text-[#8A8A8A] mt-0.5">{t(band.detail)}</div>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 px-6 py-4 text-xs text-[#8A8A8A]">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {t('Thresholds are platform-wide — editing moves existing surveys to the new bands.')}
          </div>
        </div>
      </FormSection>

      <FormSection title={t('Withdrawals & gateways')} subtitle={t('Respondent payout controls')}>
        <div className="divide-y divide-[#E3E3E3]">
          <PolicyRow
            label={t('Minimum withdrawal')}
            description={t('Respondents must reach this before requesting a payout')}
           
          >
            <MntInput value={minWithdrawal} onChange={setMinWithdrawal} />
          </PolicyRow>
          {GATEWAY_OPTIONS.map((g) => (
            <PolicyRow key={g.id} label={g.name} description={t(g.blurb)}>
              <Toggle
                checked={gateways[g.id]}
                onChange={() => setGateways((prev) => ({ ...prev, [g.id]: !prev[g.id] }))}
              />
            </PolicyRow>
          ))}
        </div>
      </FormSection>

      <FormSection title={t('Trust levels')} subtitle={t('Eligibility gates used by survey publishing')} noPadding>
        <div className="divide-y divide-[#E3E3E3]">
          {TRUST_LEVELS.map((lvl) => (
            <div key={lvl.level} className="flex items-center gap-3 px-6 py-4">
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      n <= lvl.level ? 'bg-[#FF3C21]' : 'bg-[#E3E3E3]',
                    )}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#1A1A1A]">
                  {t('Level')} {lvl.level} · {t(lvl.label)}
                </div>
                <div className="text-xs text-[#8A8A8A] mt-0.5">
                  {lvl.minResponses} {t('responses')}
                  {lvl.minAvgQuality !== null && ` · ${t('quality')} ≥ ${lvl.minAvgQuality}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <SaveBar />
    </>
  );
}

/* ──────────────────────────────────────── Shared building blocks ────────────────────────────────────── */

function FormSection({
  title,
  subtitle,
  action,
  children,
  noPadding,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-medium text-[#1A1A1A]">{title}</h3>
          {subtitle && <p className="text-sm text-[#8A8A8A] mt-1">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn('bg-white border border-[#E3E3E3] rounded-md', !noPadding && 'p-6')}>
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">{label}</label>
      {description && <p className="text-sm text-[#8A8A8A] mb-3">{description}</p>}
      {children}
    </div>
  );
}

function PolicyRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-6 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
        {description && <div className="text-sm text-[#8A8A8A] mt-1">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] placeholder:text-[#8A8A8A]',
        'focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors',
        className,
      )}
    />
  );
}

function MntInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8A8A8A]">₮</span>
      <Input
        type="number"
        min={0}
        step={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="pl-7 w-36 tabular-nums"
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        checked ? 'bg-[#FF3C21]' : 'bg-[#E3E3E3]',
      )}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  );
}

function SaveBar() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button className="px-4 py-2 text-sm font-medium text-[#4A4A4A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer">
        {t('Reset')}
      </button>
      <button className="px-4 py-2 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] transition-colors cursor-pointer">
        {t('Save changes')}
      </button>
    </div>
  );
}

/* ──────────────────────────────────────── Drawers & confirm modals ──────────────────────────────────── */

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryTone?: 'brand' | 'danger';
  onPrimary: () => void;
  primaryDisabled?: boolean;
  children: React.ReactNode;
}

function SettingsDrawer({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel,
  primaryTone = 'brand',
  onPrimary,
  primaryDisabled,
  children,
}: SettingsDrawerProps) {
  const { t } = useTranslation();
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-md data-[vaul-drawer-direction=right]:sm:!max-w-md bg-white border-l border-[#E3E3E3] p-0">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E3E3E3] flex items-start justify-between gap-4 shrink-0">
            <div className="min-w-0">
              <DrawerTitle className="text-base font-medium text-[#1A1A1A]">{title}</DrawerTitle>
              {description && (
                <DrawerDescription className="text-sm text-[#8A8A8A] mt-0.5">
                  {description}
                </DrawerDescription>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer shrink-0"
              aria-label={t('Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

          <div className="px-6 py-4 border-t border-[#E3E3E3] bg-white shrink-0 flex items-center justify-end gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              onClick={onPrimary}
              disabled={primaryDisabled}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                primaryTone === 'danger'
                  ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                  : 'bg-[#FF3C21] hover:bg-[#E63419]',
              )}
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface SettingsConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmTone?: 'danger' | 'brand';
  onConfirm: () => void;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
}

function SettingsConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmTone = 'danger',
  onConfirm,
  confirmDisabled,
  children,
}: SettingsConfirmModalProps) {
  const { t } = useTranslation();
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1A1A1A]/30 flex items-center justify-center z-50 p-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white rounded-md w-full max-w-sm border border-[#E3E3E3] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E3E3]">
              <h2 className="text-base font-medium text-[#1A1A1A]">{title}</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] rounded-md transition-colors cursor-pointer"
                aria-label={t('Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {description && <p className="text-sm text-[#4A4A4A] leading-relaxed">{description}</p>}
              {children}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#E3E3E3]">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={onConfirm}
                disabled={confirmDisabled}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  confirmTone === 'danger'
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                    : 'bg-[#FF3C21] hover:bg-[#E63419]',
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? '••••••••••••'}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ──────────────────────────────────────── Change password ───────────────────────────────────────────── */

function ChangePasswordDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const reset = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  const canSubmit =
    current.length > 0 && next.length >= 12 && confirm.length > 0 && next === confirm;

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title={t('Change password')}
      description={t('You will need to sign in again on other devices.')}
      primaryLabel={t('Update password')}
      onPrimary={() => {
        reset();
        onOpenChange(false);
      }}
      primaryDisabled={!canSubmit}
    >
      <div className="space-y-6">
        <Field label={t('Current password')}>
          <PasswordInput value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field
          label={t('New password')}
          description={t('At least 12 characters with a mix of letters, numbers, and symbols.')}
        >
          <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
        <Field label={t('Confirm new password')}>
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {confirm.length > 0 && next !== confirm && (
            <p className="text-xs text-[#B91C1C] mt-1.5">{t("Passwords don't match.")}</p>
          )}
        </Field>
      </div>
    </SettingsDrawer>
  );
}

/* ──────────────────────────────────────── Change email ──────────────────────────────────────────────── */

function ChangeEmailDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const reset = () => {
    setEmail('');
    setPassword('');
  };
  const canSubmit = email.includes('@') && email.length > 3 && password.length > 0;

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title={t('Change email')}
      description={t("We'll send a verification link to the new address.")}
      primaryLabel={t('Send verification')}
      onPrimary={() => {
        reset();
        onOpenChange(false);
      }}
      primaryDisabled={!canSubmit}
    >
      <div className="space-y-6">
        <Field label={t('Current email')}>
          <Input
            value="hein@idap.mn"
            readOnly
            className="bg-[#F3F3F3] text-[#8A8A8A] cursor-not-allowed"
          />
        </Field>
        <Field
          label={t('New email')}
          description={t('Your sign-in email will change once verified.')}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label={t('Current password')} description={t('Confirm this is you.')}>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
      </div>
    </SettingsDrawer>
  );
}

/* ──────────────────────────────────────── Delete account ────────────────────────────────────────────── */

function DeleteAccountDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  const reset = () => {
    setConfirmText('');
    setAcknowledged(false);
  };
  const canSubmit = confirmText === 'DELETE' && acknowledged;

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title={t('Delete account')}
      description={t('This removes every trace of your admin account.')}
      primaryLabel={t('Delete my account')}
      primaryTone="danger"
      onPrimary={() => {
        reset();
        onOpenChange(false);
      }}
      primaryDisabled={!canSubmit}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 rounded-md bg-[#FEF2F2]">
          <AlertTriangle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <div className="font-medium text-[#1A1A1A]">{t('This cannot be undone')}</div>
            <ul className="text-[#4A4A4A] mt-2 space-y-1 list-disc list-inside marker:text-[#B5B5B5]">
              <li>{t('Your admin account and sign-in credentials')}</li>
              <li>{t('Your access to every workspace and audit log')}</li>
              <li>{t('Personal preferences and saved filters')}</li>
            </ul>
            <p className="text-[#8A8A8A] mt-2">
              {t('Platform data (companies, surveys, respondents) stays on the platform.')}
            </p>
          </div>
        </div>

        <Field
          label={t('Type DELETE to confirm')}
          description={t('Case-sensitive. This prevents accidental deletion.')}
        >
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </Field>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#D4D4D4] text-[#FF3C21] accent-[#DC2626] cursor-pointer"
          />
          <span className="text-sm text-[#4A4A4A] leading-relaxed">
            {t('I understand this will sign me out of every device and cannot be reversed.')}
          </span>
        </label>
      </div>
    </SettingsDrawer>
  );
}

/* ──────────────────────────────────────── Invite admin ──────────────────────────────────────────────── */

function InviteAdminDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Moderator');
  const [note, setNote] = useState('');

  const reset = () => {
    setEmail('');
    setRole('Moderator');
    setNote('');
  };
  const canSubmit = email.includes('@') && email.length > 3;

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title={t('Invite admin')}
      description={t("They'll receive an email to join the admin console.")}
      primaryLabel={t('Send invite')}
      onPrimary={() => {
        reset();
        onOpenChange(false);
      }}
      primaryDisabled={!canSubmit}
    >
      <div className="space-y-6">
        <Field label={t('Email address')}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
          />
        </Field>
        <Field label={t('Role')} description={t('What they can do once they accept.')}>
          <BrandSelect
            value={role}
            onValueChange={(v) => setRole(v as AdminRole)}
            options={[
              { value: 'Super admin', label: t('Super admin — full access') },
              { value: 'Moderator',   label: t('Moderator — approve / pause / reject') },
              { value: 'Read-only',   label: t('Read-only — view only') },
            ]}
          />
        </Field>
        <Field label={t('Personal note')} description={t('Optional — appears in the invite email.')}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('Add a short message for your teammate...')}
            rows={4}
            className="w-full px-3 py-2 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] transition-colors resize-none"
          />
        </Field>
      </div>
    </SettingsDrawer>
  );
}

/* ──────────────────────────────────────── Sign-out confirms ─────────────────────────────────────────── */

function SignOutSessionModal({
  session,
  open,
  onOpenChange,
}: {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleConfirm = () => {
    if (session?.current) {
      signOut();
      navigate('/login', { replace: true });
      return;
    }
    onOpenChange(false);
  };
  if (!session) {
    return (
      <SettingsConfirmModal
        open={open}
        onOpenChange={onOpenChange}
        title={t('Sign out session?')}
        confirmLabel={t('Sign out')}
        onConfirm={() => onOpenChange(false)}
      />
    );
  }
  return (
    <SettingsConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title={session.current ? t('Sign out of this device?') : t('Sign out this session?')}
      description={t('The device will need to sign in again to access the admin console.')}
      confirmLabel={t('Sign out')}
      onConfirm={handleConfirm}
    >
      <div className="mt-4 p-3 bg-[#FAFAFA] border border-[#E3E3E3] rounded-md flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-[#F3F3F3] text-[#4A4A4A] flex items-center justify-center shrink-0">
          <session.icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#1A1A1A] truncate">{session.device}</div>
          <div className="text-xs text-[#8A8A8A] mt-0.5 truncate">
            {session.location} · {t(session.lastActive)}
          </div>
        </div>
      </div>
    </SettingsConfirmModal>
  );
}

function SignOutAllModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const otherCount = SESSIONS.filter((s) => !s.current).length;
  return (
    <SettingsConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('Sign out every other device?')}
      description={t("You'll stay signed in on this device. All other active sessions will end immediately.")}
      confirmLabel={t('Sign out all')}
      onConfirm={() => onOpenChange(false)}
    >
      <p className="mt-4 text-xs text-[#8A8A8A] tabular-nums">
        {otherCount} {t('active sessions will be signed out')}
      </p>
    </SettingsConfirmModal>
  );
}
