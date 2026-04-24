import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  UsersRound,
  Wallet,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { isAuthed } from '@/shared/lib/auth';

export default function ForgotPassword() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  if (isAuthed()) {
    return <Navigate to="/" replace />;
  }

  const canSubmit = email.trim().length > 0 && !submitting && cooldown === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      startCooldown();
    }, 500);
  };

  const startCooldown = () => {
    setCooldown(30);
    const interval = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (cooldown !== 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      startCooldown();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex font-sans text-[#1A1A1A] bg-[#FAFAFA]">
      {/* Left — brand panel */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-[56%] relative overflow-hidden bg-[#1A1A1A] text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 80% at 100% 0%, rgba(255,60,33,0.25) 0%, rgba(255,60,33,0.08) 30%, transparent 60%)',
          }}
        />
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

          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-serif leading-[1.05] tracking-tight">
              {t('Back in,')}
              <br />
              {t('in a minute.')}
            </h1>
            <p className="text-base text-white/60 mt-6 leading-relaxed max-w-md">
              {t(
                "We'll send a secure link to your admin email. Only you can open it.",
              )}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat Icon={Building2} label={t('Companies')} value="12" />
              <Stat Icon={UsersRound} label={t('Respondents')} value="2.4K" />
              <Stat Icon={Wallet} label={t('Paid out')} value="₮38M" />
            </div>
          </div>

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
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div
              aria-label="Logo placeholder"
              className="h-10 w-24 border border-dashed border-[#D4D4D4] bg-[#F3F3F3] rounded-md flex items-center justify-center text-[11px] font-medium tracking-wide text-[#8A8A8A] select-none"
            >
              LOGO
            </div>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('Back to sign in')}
          </Link>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight">
                    {t('Reset your password')}
                  </h2>
                  <p className="text-sm text-[#8A8A8A] mt-2 leading-relaxed">
                    {t(
                      "Enter the email on your admin account and we'll send a reset link. It expires in 30 minutes.",
                    )}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-[#4A4A4A] mb-1.5 block">
                      {t('Admin email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                      <input
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@idap.mn"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E3E3E3] rounded-md text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FF3C21] focus:ring-1 focus:ring-[#FF3C21] placeholder:text-[#8A8A8A]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#FF3C21] rounded-md hover:bg-[#E63419] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t('Sending...')}
                      </>
                    ) : (
                      <>
                        {t('Send reset link')}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 w-10 h-10 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-serif text-[#1A1A1A] leading-tight mt-4">
                  {t('Check your email')}
                </h2>
                <p className="text-sm text-[#4A4A4A] mt-3 leading-relaxed">
                  {t('We sent a reset link to')}{' '}
                  <span className="font-medium text-[#1A1A1A]">{email}</span>.{' '}
                  {t("Click the link to set a new password. It'll expire in 30 minutes.")}
                </p>

                <div className="mt-6 p-4 bg-[#FAFAFA] border border-[#E3E3E3] rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-white border border-[#E3E3E3] flex items-center justify-center text-[#4A4A4A] shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1A1A1A]">
                        {t("Didn't get it?")}
                      </div>
                      <p className="text-xs text-[#8A8A8A] mt-0.5 leading-relaxed">
                        {t(
                          'Check spam or try a different email. You can request a new link after the cooldown.',
                        )}
                      </p>
                      <button
                        onClick={handleResend}
                        disabled={cooldown !== 0 || submitting}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#FF3C21] hover:text-[#E63419] disabled:text-[#8A8A8A] disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {cooldown > 0
                          ? t('Resend in {{n}}s', { n: cooldown })
                          : submitting
                            ? t('Sending...')
                            : t('Resend link')}
                      </button>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1A1A1A] bg-white border border-[#E3E3E3] rounded-md hover:bg-[#F3F3F3] transition-colors cursor-pointer"
                >
                  {t('Back to sign in')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo hint */}
          <div className="mt-6 text-[11px] text-[#8A8A8A] text-center">
            {t('Demo — no email is actually sent.')}
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
