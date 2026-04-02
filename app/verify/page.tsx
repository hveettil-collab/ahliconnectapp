'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type Stage = 'input' | 'verifying' | 'success';

export default function VerifyPage() {
  const router = useRouter();
  const { pendingEmail, login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [stage, setStage] = useState<Stage>('input');
  const [error, setError] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      refs.current[5]?.focus();
    }
  };

  const verify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setStage('verifying');
    await new Promise(r => setTimeout(r, 2200));
    setStage('success');
    login(pendingEmail || 'sara.ahmed@shory.ae');
    await new Promise(r => setTimeout(r, 1800));
    router.push('/login?verified=1');
  };

  const email = pendingEmail || 'your work email';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#F4EFE8' }}>
      <div className="w-full max-w-md">
        <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors mb-6">
          <ArrowLeft size={15} /> Back
        </Link>

        <div className="bg-white rounded-[24px] border border-[#E8E2D9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 md:p-8">

          {/* INPUT STAGE */}
          {stage === 'input' && (
            <div>
              <div className="w-14 h-14 rounded-[16px] bg-[#E8EFF8] flex items-center justify-center mb-6">
                <Shield size={26} className="text-[#1B3A6B]" strokeWidth={1.8} />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Verify Your Identity</h2>
              <p className="text-sm text-[#6B7280] mb-1">
                We sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-[#1A1A2E] mb-8">{email}</p>

              <div className="flex gap-1.5 justify-center mb-6" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    className="w-10 h-10 text-center text-lg font-semibold border border-[#E8E2D9] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-500 text-center mb-4">{error}</p>}

              <button
                onClick={verify}
                className="w-full bg-[#1B3A6B] text-white font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#152E56] transition-all active:scale-[0.98]"
              >
                Verify & Continue
              </button>

              <div className="flex items-center justify-center gap-1 mt-5 text-sm">
                <span className="text-[#9CA3AF]">Didn't receive it?</span>
                <button className="text-[#1B3A6B] font-medium hover:underline">Resend code</button>
              </div>

              <div className="mt-6 bg-[#F9F6F1] rounded-[12px] p-3.5 border border-[#E8E2D9]">
                <p className="text-xs text-[#9CA3AF] text-center">
                  <strong className="text-[#6B7280]">Demo tip:</strong> Enter any 6 digits to proceed
                </p>
              </div>
            </div>
          )}

          {/* VERIFYING STAGE */}
          {stage === 'verifying' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#E8EFF8]" />
                <div className="absolute inset-0 rounded-full border-4 border-[#1B3A6B] border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={24} className="text-[#1B3A6B]" strokeWidth={1.8} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Verifying Your Identity</h3>
              <p className="text-sm text-[#9CA3AF] text-center max-w-xs">
                Authenticating your employee credentials with IHC systems...
              </p>
              <div className="mt-6 flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#1B3A6B]"
                    style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-8px); opacity: 1; }
                }
              `}</style>
            </div>
          )}

          {/* SUCCESS STAGE */}
          {stage === 'success' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-[#D1FAE5] animate-[ping_1s_ease_1]" />
                <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center relative z-10">
                  <CheckCircle2 size={36} className="text-[#059669]" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Verified Successfully</h3>
              <p className="text-sm text-[#6B7280] text-center mb-6">
                Your employee profile has been created and verified.
              </p>
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[14px] px-5 py-4 w-full text-center">
                <p className="text-xs text-[#6B7280] mb-0.5">Verified employee profile</p>
                <p className="text-sm font-semibold text-[#065F46]">✓ Identity confirmed via IHC directory</p>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-5 animate-pulse">Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
