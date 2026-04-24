import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Info,
  Building2,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { isAuthed, signIn } from '@/shared/lib/auth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthed()) {
    return <Navigate to="/" replace />;
  }

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !submitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      signIn();
      navigate('/', { replace: true });
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex font-sans text-[#1A1A1A] bg-[#FAFAFA]">
      {/* Left — brand panel */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[56%] relative overflow-hidden bg-[#1A1A1A] text-white">
        {/* Subtle gradient accent */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 80% at 100% 0%, rgba(255,60,33,0.25) 0%, rgba(255,60,33,0.08) 30%, transparent 60%)',
          }}
        />
        {/* Grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full px-12 xl:px-16 py-12">
          {/* Top — logo */}
          <div className="flex items-center gap-3">
            <div
              aria-label="Logo placeholder"
              className="h-9 w-24 border border-dashed border-white/20 bg-white/5 rounded-md flex items-center justify-center text-[10px] font-medium tracking-wide text-white/60 select-none"
            >
              LOGO
            </div>
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              {t('Admin')}
            </span>
          </div>

          {/* Middle — headline */}
          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-serif leading-[1.05] tracking-tight">
              {t('The control room for iDap.')}
            </h1>
            <p className="text-base text-white/60 mt-6 leading-relaxed max-w-md">
              {t(
                'Review companies and surveys, release payouts, and keep the platform safe for every respondent.',
              )}
            </p>

            {/* Mini stat strip */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat Icon={Building2} label={t('Companies')} value="12" />
              <Stat Icon={UsersRound} label={t('Respondents')} value="2.4K" />
              <Stat Icon={Wallet} label={t('Paid out')} value="₮38M" />
            </div>
          </div>

          {/* Bottom — meta */}
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>© 2026 iDap Operations</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('Internal tool · Admin access only')}
            </span>
          </div>
        </div>
      </aside>

      {/* Right — form */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo (shown only when left panel is hidden) */}
          <div className="flex lg:hidden justify-center mb-8">
            <div
              aria-label="Logo placeholder"
              className="h-10 w-24 border border-dashed border-[#D4D4D4] bg-[#F3F3F3] rounded-md flex items-center justify-center text-[11px] font-medium tracking-wide text-[#8A8A8A] select-none"
            >
              LOGO
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight">
              {t('Sign in')}
            </h2>
            <p className="text-sm text-[#8A8A8A] mt-2">
              {t('Use your admin credentials to continue.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#4A4A4A] mb-1.5 block">
                {t('Email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@idap.mn"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#4A4A4A]">
                  {t('Password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#4A4A4A] hover:text-[#FF3C21] transition-colors cursor-pointer"
                >
                  {t('Forgot?')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#8A8A8A] hover:text-[#1A1A1A] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
                  aria-label={showPassword ? t('Hide password') : t('Show password')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-4 h-4 rounded border border-[#D4D4D4] bg-white peer-checked:bg-[#FF3C21] peer-checked:border-[#FF3C21] flex items-center justify-center transition-colors">
                {remember && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 5l3.5 3.5L11 1.5" />
                  </svg>
                )}
              </span>
              <span className="text-xs text-[#4A4A4A]">{t('Keep me signed in on this device')}</span>
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {t('Signing in...')}
                </>
              ) : (
                <>
                  {t('Sign in')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 flex items-start gap-2 p-3 rounded-md bg-[#FFF1EE] border border-[#FFDED5]">
            <Info className="w-3.5 h-3.5 text-[#C2410C] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#C2410C] leading-relaxed">
              {t(
                'Demo login — any email and password will work. Session stays on this browser only.',
              )}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Stat({
  Icon,
  label,
  value,
}: {
  Icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-white/40 text-xs">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-xl font-medium text-white mt-1.5 tabular-nums">{value}</div>
    </div>
  );
}
