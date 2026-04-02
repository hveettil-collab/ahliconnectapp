'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { COMPANIES } from '@/lib/mockData';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ company: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company) e.company = 'Please select your company';
    if (!form.email || !form.email.includes('@')) e.email = 'Enter a valid work email';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setAuth(form.email, form.company);
    await new Promise(r => setTimeout(r, 800));
    router.push('/verify');
  };

  const passwordStrength = () => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  };
  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#F4EFE8' }}>
      <div className="w-full max-w-md">
        {/* Back */}
        <Link href="/landing" className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors mb-6">
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="bg-white rounded-[24px] border border-[#E8E2D9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 md:p-8">
          {/* Logo */}
          <div className="mb-6">
            <div className="mb-4 flex justify-center">
              <Image src="/logo-login.svg" alt="Ahli Connect" width={140} height={37} priority />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">Create Account</p>
            <p className="text-xs text-[#9CA3AF]">Ahli Connect · IHC Group</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company select */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Your Company *</label>
              <div className="relative">
                <select
                  value={form.company}
                  onChange={e => { setForm(f => ({ ...f, company: e.target.value })); setErrors(er => ({ ...er, company: '' })); }}
                  className={`w-full appearance-none border rounded-[14px] bg-white text-[#1A1A2E] px-4 py-3 text-sm transition-all outline-none pr-10
                    ${errors.company ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}
                    ${!form.company ? 'text-[#9CA3AF]' : ''}`}
                >
                  <option value="" disabled>Select your company</option>
                  {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Work Email *</label>
              <input
                type="email"
                placeholder="you@company.ae"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                className={`w-full border rounded-[14px] bg-[#E8F0FE] text-[#1A1A2E] placeholder:text-[#9CA3AF] px-4 py-3 text-sm outline-none transition-all
                  ${errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  className={`w-full border rounded-[14px] bg-white text-[#1A1A2E] placeholder:text-[#9CA3AF] px-4 py-3 pr-11 text-sm outline-none transition-all
                    ${errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}`}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor[strength] : '#E8E2D9' }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: '' })); }}
                  className={`w-full border rounded-[14px] bg-white text-[#1A1A2E] placeholder:text-[#9CA3AF] px-4 py-3 pr-11 text-sm outline-none transition-all
                    ${errors.confirm ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E8E2D9] focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10'}`}
                />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3A6B] text-white font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#152E56] transition-all active:scale-[0.98] disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
              ) : 'Create Account & Verify'}
            </button>
          </form>

          <p className="text-center text-xs text-[#9CA3AF] mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1B3A6B] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#9CA3AF]">
          For authorised IHC Group employees only
        </p>
      </div>
    </div>
  );
}
