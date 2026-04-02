'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { COMPANIES } from '@/lib/mockData';
import { Suspense } from 'react';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<'idle' | 'loading' | 'authenticated'>('idle');
  const verified = searchParams.get('verified') === '1';

  const DEMO_USERS = [
    { email: 'sara.ahmed@shory.ae', label: 'Sara Ahmed · Shory' },
    { email: 'khalid.mansouri@aldar.ae', label: 'Khalid Al Mansouri · Aldar' },
    { email: 'noura.hassan@purehealth.ae', label: 'Noura Hassan · PureHealth' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStage('loading');
    await new Promise(r => setTimeout(r, 1800));
    login(form.email);
    setStage('authenticated');
    await new Promise(r => setTimeout(r, 2000));
    router.push('/dashboard');
  };

  const user = COMPANIES.find(() => true); // just for display mock

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#F4EFE8' }}>
      <div className="w-full max-w-md">
        <Link href="/landing" className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors mb-6">
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="bg-white rounded-[24px] border border-[#E8E2D9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 md:p-8">

          {/* IDLE / FORM */}
          {stage === 'idle' && (
            <>
              <div className="mb-8">
                <div className="mb-5 flex justify-center">
                  <Image src="/logo-login.svg" alt="Ahli Connect" width={172} height={46} priority />
                </div>
                <p className="text-base font-bold text-[#1A1A2E]">
                  {verified ? 'Account Ready — Sign In' : 'Welcome Back'}
                </p>
                <p className="text-xs text-[#9CA3AF]">Ahli Connect · IHC Group</p>
              </div>

              {verified && (
                <div className="flex items-center gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[12px] px-4 py-3 mb-6">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">Account verified successfully</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Work Email</label>
                  <input
                    type="email"
                    placeholder="you@company.ae"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                    className={`w-full border rounded-[14px] bg-[#E8F0FE] text-[#1A1A2E] placeholder:text-[#9CA3AF] px-4 py-3 text-sm outline-none transition-all
                      ${errors.email ? 'border-red-400' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[#374151]">Password</label>
                    <button type="button" className="text-xs text-[#1B3A6B] hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                      className={`w-full border rounded-[14px] bg-[#E8F0FE] text-[#1A1A2E] placeholder:text-[#9CA3AF] px-4 py-3 pr-11 text-sm outline-none transition-all
                        ${errors.password ? 'border-red-400' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}`}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E2D9] accent-[#1B3A6B]"
                  />
                  <label htmlFor="remember" className="text-sm text-[#6B7280]">Remember me</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B3A6B] text-white font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#152E56] transition-all active:scale-[0.98] mt-1"
                >
                  Sign In
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-[#E8E2D9]" />
                  <span className="text-xs text-[#9CA3AF]">Demo accounts</span>
                  <div className="flex-1 h-px bg-[#E8E2D9]" />
                </div>
                <div className="space-y-2">
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.email}
                      onClick={() => setForm({ email: u.email, password: 'demo1234' })}
                      className="w-full text-left bg-[#F9F6F1] hover:bg-[#F4EFE8] border border-[#E8E2D9] rounded-[12px] px-4 py-2.5 transition-colors"
                    >
                      <p className="text-sm font-medium text-[#1A1A2E]">{u.label}</p>
                      <p className="text-xs text-[#9CA3AF]">{u.email}</p>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-[#9CA3AF] mt-5">
                New to Ahli Connect?{' '}
                <Link href="/signup" className="text-[#1B3A6B] font-medium hover:underline">Create account</Link>
              </p>
            </>
          )}

          {/* LOADING */}
          {stage === 'loading' && (
            <div className="flex flex-col items-center py-10">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#E8EFF8]" />
                <div className="absolute inset-0 rounded-full border-4 border-[#1B3A6B] border-t-transparent animate-spin" />
                <div className="w-20 h-20 flex items-center justify-center">
                  <Logo size="lg" showText={false} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Authenticating</h3>
              <p className="text-sm text-[#9CA3AF]">Verifying your employee credentials...</p>
            </div>
          )}

          {/* AUTHENTICATED */}
          {stage === 'authenticated' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-5">
                <CheckCircle2 size={36} className="text-[#059669]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Welcome Back</h3>
              <p className="text-sm text-[#6B7280] mb-5">Identity confirmed</p>
              <div className="w-full bg-[#F9F6F1] rounded-[16px] p-4 border border-[#E8E2D9] text-center space-y-1">
                <p className="text-sm font-bold text-[#1A1A2E]">{form.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                <span className="inline-flex items-center gap-1.5 bg-[#E8EFF8] text-[#1B3A6B] text-xs font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Verified Employee
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-4 animate-pulse">Loading your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
