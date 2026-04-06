'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Wallet, CreditCard, Building2, Plus, Check, X,
  ChevronRight, Clock, ArrowUpRight, ArrowDownLeft, Shield,
} from 'lucide-react';

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500];

export default function WalletPage() {
  const wallet = useWallet();
  const router = useRouter();
  const [showFund, setShowFund] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'bank' | null>(null);
  const [fundSuccess, setFundSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useBodyScrollLock(showFund);

  const handleFund = () => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0 || !paymentMethod) return;
    setProcessing(true);
    setTimeout(() => {
      wallet.fundWallet(amount);
      setProcessing(false);
      setFundSuccess(true);
    }, 1500);
  };

  const resetFundFlow = () => {
    setShowFund(false);
    setFundAmount('');
    setPaymentMethod(null);
    setFundSuccess(false);
    setProcessing(false);
  };

  return (
    <AppShell title="Wallet" subtitle="" hideTopBar>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .slide-up { animation: slide-up 0.35s cubic-bezier(0.23,1,0.32,1); }
        @keyframes check-pop { from { transform: scale(0); } to { transform: scale(1); } }
        .check-pop { animation: check-pop 0.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
      `}</style>

      <div style={{ overscrollBehaviorX: 'none' }}>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #9D63F6 0%, #7C3AED 40%, #6D28D9 70%, #F8F9FB 100%)', minHeight: 280 }}>
          <div className="relative z-20 flex items-center px-5 pt-5">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h2 className="text-[16px] font-bold text-white ml-3">My Wallet</h2>
          </div>

          <div className="relative z-10 flex flex-col items-center mt-8 pb-10">
            <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Wallet size={24} className="text-white" />
            </div>
            <p className="text-[12px] text-white/60 font-medium">Available Balance</p>
            <p className="text-[38px] font-extrabold text-white leading-none mt-1">AED {wallet.balance.toLocaleString()}</p>
            <button onClick={() => setShowFund(true)} className="mt-5 flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold text-[#9D63F6] bg-white active:scale-[0.97] transition-all shadow-lg">
              <Plus size={16} /> Add Funds
            </button>
          </div>
        </div>

        <div className="px-5 -mt-4 relative z-20 space-y-4 pb-32">
          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="flex-1 p-4 rounded-[18px] bg-white border border-[#DFE1E6] shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownLeft size={14} className="text-[#059669]" />
                <span className="text-[10px] text-[#A4ABB8] font-medium">Total Funded</span>
              </div>
              <p className="text-[17px] font-bold text-[#15161E]">AED {wallet.transactions.filter(t => t.category === 'fund').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
            </div>
            <div className="flex-1 p-4 rounded-[18px] bg-white border border-[#DFE1E6] shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight size={14} className="text-[#DF1C41]" />
                <span className="text-[10px] text-[#A4ABB8] font-medium">Total Spent</span>
              </div>
              <p className="text-[17px] font-bold text-[#15161E]">AED {wallet.transactions.filter(t => t.category === 'purchase').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[11px] font-bold text-[#A4ABB8] uppercase tracking-wider">Recent Transactions</p>
            </div>
            <div className="divide-y divide-[#F8F9FB]">
              {wallet.transactions.slice(0, 8).map(tx => (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={14} className="text-[#059669]" /> : <ArrowUpRight size={14} className="text-[#DF1C41]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#15161E] truncate">{tx.label}</p>
                    <p className="text-[10px] text-[#A4ABB8]">{tx.timestamp.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <p className={`text-[14px] font-bold ${tx.type === 'credit' ? 'text-[#059669]' : 'text-[#15161E]'}`}>
                    {tx.type === 'credit' ? '+' : '-'} AED {tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fund Wallet Sheet ── */}
      {showFund && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={resetFundFlow}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-5 py-5 space-y-5 slide-up max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />

            {fundSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto check-pop">
                  <Check size={28} className="text-[#059669]" />
                </div>
                <p className="text-[17px] font-bold text-[#15161E]">Funds Added!</p>
                <p className="text-[13px] text-[#666D80]">AED {parseFloat(fundAmount).toLocaleString()} has been added to your wallet via {paymentMethod === 'apple' ? 'Apple Pay' : 'Bank Transfer'}.</p>
                <button onClick={resetFundFlow} className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white bg-[#9D63F6] active:scale-[0.98] transition-all mt-3">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-bold text-[#15161E]">Add Funds</h3>
                  <button onClick={resetFundFlow} className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center"><X size={16} className="text-[#666D80]" /></button>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Amount (AED)</label>
                  <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} placeholder="Enter amount"
                    className="w-full mt-2 bg-white border-2 border-[#DFE1E6] rounded-[16px] px-4 py-3.5 text-[18px] font-bold text-[#15161E] outline-none focus:border-[#9D63F6] transition-colors" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {QUICK_AMOUNTS.map(amt => (
                    <button key={amt} onClick={() => setFundAmount(String(amt))}
                      className={`px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95 ${fundAmount === String(amt) ? 'bg-[#9D63F6] text-white border-[#9D63F6]' : 'bg-white text-[#15161E] border-[#DFE1E6]'}`}>
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Payment Method</label>
                  <div className="space-y-2.5 mt-2">
                    <button onClick={() => setPaymentMethod('apple')}
                      className={`w-full flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all active:scale-[0.98] ${paymentMethod === 'apple' ? 'border-[#15161E] bg-[#FAFAF8]' : 'border-[#DFE1E6] bg-white'}`}>
                      <div className="w-10 h-10 rounded-[12px] bg-black flex items-center justify-center shrink-0">
                        <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M14.94 11.58c-.02-2.27 1.86-3.37 1.94-3.42-1.06-1.55-2.7-1.76-3.28-1.78-1.39-.14-2.73.82-3.44.82-.72 0-1.82-.8-2.99-.78-1.53.02-2.95.9-3.74 2.27-1.6 2.77-.41 6.87 1.14 9.12.76 1.1 1.67 2.33 2.86 2.29 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.71 1.24-.02 2.02-1.11 2.76-2.22.87-1.27 1.23-2.51 1.25-2.57-.03-.01-2.4-.92-2.42-3.66l-.04-.04zM12.67 4.68c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.78 1.02.08 2.05-.52 2.68-1.25z" fill="white"/></svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-bold text-[#15161E]">Apple Pay</p>
                        <p className="text-[11px] text-[#A4ABB8]">Instant transfer</p>
                      </div>
                      {paymentMethod === 'apple' && <Check size={18} className="text-[#059669]" />}
                    </button>

                    <button onClick={() => setPaymentMethod('bank')}
                      className={`w-full flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all active:scale-[0.98] ${paymentMethod === 'bank' ? 'border-[#9D63F6] bg-[#FAFAF8]' : 'border-[#DFE1E6] bg-white'}`}>
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)' }}>
                        <Building2 size={18} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-bold text-[#15161E]">Bank Transfer</p>
                        <p className="text-[11px] text-[#A4ABB8]">1–2 business days</p>
                      </div>
                      {paymentMethod === 'bank' && <Check size={18} className="text-[#9D63F6]" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#A4ABB8]">
                  <Shield size={12} className="shrink-0" />
                  <span>256-bit encrypted · Regulated by ADGM</span>
                </div>

                <button onClick={handleFund} disabled={!fundAmount || !paymentMethod || processing}
                  className={`w-full py-3.5 rounded-[16px] text-[14px] font-bold transition-all active:scale-[0.98] ${
                    !fundAmount || !paymentMethod ? 'bg-[#DFE1E6] text-[#A4ABB8] cursor-not-allowed'
                    : paymentMethod === 'apple' ? 'bg-black text-white' : 'bg-[#9D63F6] text-white'
                  }`}
                  style={fundAmount && paymentMethod ? { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } : {}}>
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : paymentMethod === 'apple' ? (
                    <span>Pay with Apple Pay</span>
                  ) : (
                    <span>Transfer AED {fundAmount ? parseFloat(fundAmount).toLocaleString() : '0'}</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
