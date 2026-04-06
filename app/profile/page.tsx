'use client';
import { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { COMPANIES, MARKETPLACE_LISTINGS, OFFERS } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Mail, Briefcase, Building2, Hash, Edit2, Shield, Tag, ShoppingBag, Settings, Bell, LogOut, Share2, QrCode, Phone, Globe, Link2, Copy, Check, RotateCcw, Car, Home, Clock, AlertTriangle, ChevronRight, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Star, Gift, Sparkles, TrendingUp, Zap, X, CreditCard, Heart, Users, GraduationCap, Plane } from 'lucide-react';

/* ═══════════════════════════════════════════
   COUNTDOWN HOOK
   ═══════════════════════════════════════════ */

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

/* ═══════════════════════════════════════════
   WALLET & REWARDS SECTION
   ═══════════════════════════════════════════ */

function WalletSection() {
  const wallet = useWallet();
  const [showFund, setShowFund] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [showAllTx, setShowAllTx] = useState(false);
  const [fundSuccess, setFundSuccess] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  useBodyScrollLock(showFund || showRedeem || showAllTx);

  const REWARD_CATEGORIES: Record<string, { icon: typeof Star; color: string; bg: string }> = {
    performance: { icon: TrendingUp, color: '#9D63F6', bg: '#F7F1FF' },
    innovation: { icon: Zap, color: '#FFBD4C', bg: '#FFF6E0' },
    engagement: { icon: Star, color: '#54B6ED', bg: '#EEF8FD' },
    recognition: { icon: Gift, color: '#40C4AA', bg: '#E7FEF8' },
    referral: { icon: Sparkles, color: '#EC4899', bg: '#FDF2F8' },
  };

  const handleFund = () => {
    const amt = parseFloat(fundAmount);
    if (amt > 0) {
      wallet.fundWallet(amt);
      setFundSuccess(true);
      setTimeout(() => { setFundSuccess(false); setShowFund(false); setFundAmount(''); }, 1500);
    }
  };

  const handleRedeem = () => {
    const pts = parseInt(redeemAmount);
    if (pts > 0 && wallet.redeemPoints(pts)) {
      setRedeemSuccess(true);
      setTimeout(() => { setRedeemSuccess(false); setShowRedeem(false); setRedeemAmount(''); }, 1500);
    }
  };

  const visibleTx = showAllTx ? wallet.transactions : wallet.transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* ── Wallet Balance Card ── */}
      <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
        <div className="p-5" style={{ background: 'linear-gradient(135deg, #15161E 0%, #1E3A5F 50%, #2D1B69 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Wallet size={17} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] text-white/50 font-medium">Ahli Wallet</p>
                <p className="text-[10px] text-[#40C4AA] font-semibold">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <CreditCard size={10} className="text-white/50" />
              <span className="text-[9px] text-white/50 font-medium">Virtual Card</span>
            </div>
          </div>

          <p className="text-[11px] text-white/40 font-medium mb-1">Available Balance</p>
          <p className="text-[32px] font-extrabold text-white tracking-tight leading-none mb-1">
            AED {wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setShowFund(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[12px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'rgba(157,99,246,0.4)', border: '1px solid rgba(157,99,246,0.3)' }}
            >
              <Plus size={14} /> Fund Wallet
            </button>
            <button
              onClick={() => setShowRedeem(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[12px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'rgba(64,196,170,0.3)', border: '1px solid rgba(64,196,170,0.25)' }}
            >
              <Gift size={14} /> Redeem Points
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[#15161E]">Recent Transactions</p>
            <button onClick={() => setShowAllTx(!showAllTx)} className="text-[11px] font-semibold text-[#9D63F6]">
              {showAllTx ? 'Show Less' : 'View All'}
            </button>
          </div>
          <div className="space-y-1.5">
            {visibleTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 py-2.5 px-3 rounded-[12px] hover:bg-[#F8F9FB] transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-[#E7FEF8]' : 'bg-[#FEF2F2]'}`}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={14} className="text-[#40C4AA]" /> : <ArrowUpRight size={14} className="text-[#DF1C41]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#15161E] truncate">{tx.label}</p>
                  <p className="text-[10px] text-[#A4ABB8]">{tx.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <p className={`text-[13px] font-bold ${tx.type === 'credit' ? 'text-[#40C4AA]' : 'text-[#15161E]'}`}>
                  {tx.type === 'credit' ? '+' : '-'}AED {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reward Points Card ── */}
      <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
        <div className="p-5" style={{ background: `linear-gradient(135deg, ${wallet.rewardTierColor}15 0%, ${wallet.rewardTierColor}08 100%)` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: `${wallet.rewardTierColor}20` }}>
                <Star size={17} style={{ color: wallet.rewardTierColor }} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#15161E]">Reward Points</p>
                <p className="text-[10px] font-semibold" style={{ color: wallet.rewardTierColor }}>{wallet.rewardTier} Tier</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-extrabold" style={{ color: wallet.rewardTierColor }}>{wallet.rewardPoints.toLocaleString()}</p>
              <p className="text-[9px] text-[#A4ABB8] font-medium">= AED {wallet.getPointsValue(wallet.rewardPoints).toLocaleString()}</p>
            </div>
          </div>

          {/* Tier progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-[#666D80] font-medium">Next: {wallet.rewardTierNext}</p>
              <p className="text-[10px] font-bold" style={{ color: wallet.rewardTierColor }}>{Math.round(wallet.rewardProgress)}%</p>
            </div>
            <div className="h-2 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${wallet.rewardProgress}%`, background: `linear-gradient(90deg, ${wallet.rewardTierColor}, ${wallet.rewardTierColor}90)` }} />
            </div>
          </div>
        </div>

        {/* How to earn */}
        <div className="p-4">
          <p className="text-[12px] font-bold text-[#15161E] mb-3">How You Earn Points</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Performance Reviews', pts: 'Up to 1,000', cat: 'performance' as const },
              { label: 'Innovation Ideas', pts: 'Up to 2,000', cat: 'innovation' as const },
              { label: 'Platform Engagement', pts: '50-250/mo', cat: 'engagement' as const },
              { label: 'Colleague Referrals', pts: '100 each', cat: 'referral' as const },
            ].map(item => {
              const catStyle = REWARD_CATEGORIES[item.cat];
              const Icon = catStyle.icon;
              return (
                <div key={item.label} className="flex items-center gap-2 p-2.5 rounded-[12px]" style={{ background: catStyle.bg }}>
                  <Icon size={14} style={{ color: catStyle.color }} />
                  <div>
                    <p className="text-[10px] font-semibold text-[#15161E]">{item.label}</p>
                    <p className="text-[9px] font-bold" style={{ color: catStyle.color }}>{item.pts}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent rewards */}
          <p className="text-[12px] font-bold text-[#15161E] mt-4 mb-2.5">Recent Rewards</p>
          <div className="space-y-1.5">
            {wallet.rewardHistory.slice(0, 4).map(r => {
              const catStyle = REWARD_CATEGORIES[r.category] || REWARD_CATEGORIES.engagement;
              const Icon = catStyle.icon;
              return (
                <div key={r.id} className="flex items-center gap-3 py-2 px-2.5 rounded-[10px] hover:bg-[#F8F9FB] transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: catStyle.bg }}>
                    <Icon size={12} style={{ color: catStyle.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[#15161E] truncate">{r.reason}</p>
                    <p className="text-[9px] text-[#A4ABB8]">{r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: catStyle.color }}>+{r.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fund Wallet Bottom Sheet ── */}
      {showFund && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setShowFund(false)}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-5" />
            <button onClick={() => setShowFund(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            {fundSuccess ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#E7FEF8] flex items-center justify-center mb-3">
                  <CheckCircle2 size={32} className="text-[#40C4AA]" />
                </div>
                <p className="text-lg font-bold text-[#15161E]">Wallet Funded!</p>
                <p className="text-sm text-[#666D80]">AED {parseFloat(fundAmount).toLocaleString()} added</p>
              </div>
            ) : (
              <>
                <h3 className="text-[16px] font-bold text-[#15161E] mb-1">Fund Your Wallet</h3>
                <p className="text-[13px] text-[#666D80] mb-5">Add money to use for in-app purchases</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[500, 1000, 2000].map(amt => (
                    <button key={amt} onClick={() => setFundAmount(String(amt))}
                      className="py-3 rounded-[12px] text-[13px] font-bold border transition-all active:scale-95"
                      style={{
                        borderColor: fundAmount === String(amt) ? '#9D63F6' : '#DFE1E6',
                        backgroundColor: fundAmount === String(amt) ? '#F7F1FF' : 'white',
                        color: fundAmount === String(amt) ? '#9D63F6' : '#15161E',
                      }}
                    >
                      AED {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full bg-white border border-[#DFE1E6] rounded-[14px] px-4 py-3.5 text-sm text-[#15161E] placeholder:text-[#A4ABB8] mb-4 outline-none focus:border-[#9D63F6] transition-colors"
                />

                <button onClick={handleFund}
                  className="w-full py-3.5 rounded-[14px] text-sm font-bold text-white active:scale-[0.97] transition-all"
                  style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)' }}
                >
                  Fund AED {fundAmount ? parseFloat(fundAmount).toLocaleString() : '0'}
                </button>
                <button onClick={() => setShowFund(false)} className="w-full mt-2 py-3 text-sm font-medium text-[#666D80]">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Redeem Points Bottom Sheet ── */}
      {showRedeem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setShowRedeem(false)}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-5" />
            <button onClick={() => setShowRedeem(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            {redeemSuccess ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#F7F1FF] flex items-center justify-center mb-3">
                  <Sparkles size={32} className="text-[#9D63F6]" />
                </div>
                <p className="text-lg font-bold text-[#15161E]">Points Redeemed!</p>
                <p className="text-sm text-[#666D80]">AED {wallet.getPointsValue(parseInt(redeemAmount)).toLocaleString()} added to wallet</p>
              </div>
            ) : (
              <>
                <h3 className="text-[16px] font-bold text-[#15161E] mb-1">Redeem Points</h3>
                <p className="text-[13px] text-[#666D80] mb-1">Convert reward points to wallet balance</p>
                <p className="text-[12px] font-semibold text-[#9D63F6] mb-5">Available: {wallet.rewardPoints.toLocaleString()} pts = AED {wallet.getPointsValue(wallet.rewardPoints).toLocaleString()}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[500, 1000, 2000].map(pts => (
                    <button key={pts} onClick={() => setRedeemAmount(String(pts))}
                      disabled={pts > wallet.rewardPoints}
                      className="py-3 rounded-[12px] text-center border transition-all active:scale-95 disabled:opacity-30"
                      style={{
                        borderColor: redeemAmount === String(pts) ? '#40C4AA' : '#DFE1E6',
                        backgroundColor: redeemAmount === String(pts) ? '#E7FEF8' : 'white',
                      }}
                    >
                      <p className="text-[13px] font-bold" style={{ color: redeemAmount === String(pts) ? '#40C4AA' : '#15161E' }}>{pts.toLocaleString()} pts</p>
                      <p className="text-[9px] text-[#A4ABB8]">= AED {wallet.getPointsValue(pts)}</p>
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  value={redeemAmount}
                  onChange={e => setRedeemAmount(e.target.value)}
                  placeholder="Enter points to redeem"
                  className="w-full bg-white border border-[#DFE1E6] rounded-[14px] px-4 py-3.5 text-sm text-[#15161E] placeholder:text-[#A4ABB8] mb-2 outline-none focus:border-[#40C4AA] transition-colors"
                />
                {redeemAmount && <p className="text-[11px] text-[#666D80] mb-4 ml-1">You&apos;ll receive AED {wallet.getPointsValue(parseInt(redeemAmount) || 0).toLocaleString()} in your wallet</p>}

                <button onClick={handleRedeem}
                  className="w-full py-3.5 rounded-[14px] text-sm font-bold text-white active:scale-[0.97] transition-all"
                  style={{ background: 'linear-gradient(135deg, #40C4AA, #059669)' }}
                >
                  Redeem {redeemAmount ? parseInt(redeemAmount).toLocaleString() : '0'} Points
                </button>
                <button onClick={() => setShowRedeem(false)} className="w-full mt-2 py-3 text-sm font-medium text-[#666D80]">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   YOUR BENEFITS SECTION
   ═══════════════════════════════════════════ */

function BenefitsSection() {
  const [showBenefitDetail, setShowBenefitDetail] = useState<string | null>(null);
  const router = useRouter();

  useBodyScrollLock(!!showBenefitDetail);

  const benefits = [
    { key: 'medical', label: 'Medical', icon: Heart, color: '#EF4444', bg: 'bg-red-50', value: 'AED 85,000' },
    { key: 'education', label: 'Education', icon: GraduationCap, color: '#FFBD4C', bg: 'bg-[#FEF3C7]', value: 'AED 20,000' },
    { key: 'flights', label: 'Flights', icon: Plane, color: '#40C4AA', bg: 'bg-[#D1FAE5]', value: 'Annual return' },
    { key: 'life', label: 'Life Cover', icon: Shield, color: '#7C3AED', bg: 'bg-[#EDE9FE]', value: '24x salary' },
  ];

  return (
    <>
      <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F8F9FB]">
          <div className="flex items-center gap-2">
            <Gift size={15} className="text-[#9D63F6]" strokeWidth={1.8} />
            <p className="text-sm font-bold text-[#15161E]">Your Benefits</p>
          </div>
        </div>
        <div className="p-4">
          {/* Medical Insurance Feature Card */}
          <button onClick={() => setShowBenefitDetail('medical')} className="w-full mb-3 rounded-[16px] p-4 text-left active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FECDD3 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-white/70 flex items-center justify-center">
                <Heart size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#15161E]">Medical Insurance</p>
                <p className="text-[11px] text-[#666D80] mt-0.5">Daman Enhanced · Family Plan</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold text-red-600">AED 85K</p>
                <p className="text-[10px] text-[#A4ABB8]">Annual value</p>
              </div>
            </div>
          </button>

          {/* 3-column grid: Education, Flights, Life Cover */}
          <div className="grid grid-cols-3 gap-2">
            {benefits.filter(b => b.key !== 'medical').map(b => (
              <button key={b.key} onClick={() => setShowBenefitDetail(b.key)} className="rounded-[14px] p-3 text-center active:scale-[0.96] transition-all bg-[#F8F9FB]">
                <div className={`w-9 h-9 rounded-[10px] ${b.bg} flex items-center justify-center mx-auto mb-2`}>
                  <b.icon size={16} style={{ color: b.color }} />
                </div>
                <p className="text-[11px] font-bold text-[#15161E]">{b.label}</p>
                <p className="text-[9px] text-[#A4ABB8] mt-0.5">{b.value}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Benefit Detail Bottom Sheet */}
      {showBenefitDetail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setShowBenefitDetail(null)}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-5 shadow-2xl max-h-[85vh] overflow-y-auto relative" onClick={e => e.stopPropagation()} style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-4" />
            <button onClick={() => setShowBenefitDetail(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>

            {showBenefitDetail === 'medical' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-red-50 flex items-center justify-center"><Heart size={22} className="text-red-500" /></div>
                  <div>
                    <p className="text-[16px] font-bold text-[#15161E]">Medical Insurance</p>
                    <p className="text-[12px] text-[#FFBD4C] font-semibold">Daman Enhanced · Family Plan</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Annual Value', value: 'AED 85,000' },
                    { label: 'Provider', value: 'Daman Health' },
                    { label: 'Coverage', value: 'Employee + Family' },
                    { label: 'Network', value: 'Enhanced (All UAE)' },
                    { label: 'Dental', value: 'Included' },
                    { label: 'Optical', value: 'AED 1,500/yr' },
                    { label: 'Maternity', value: 'Full coverage' },
                    { label: 'Wellness', value: 'Annual checkup free' },
                  ].map(item => (
                    <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                      <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowBenefitDetail(null); router.push('/services?prompt=Tell+me+about+my+medical+insurance+benefits'); }} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#9D63F6] active:scale-[0.97] transition-all" style={{ boxShadow: '0 4px 16px rgba(157,99,246,0.3)' }}>
                  <Sparkles size={14} className="inline mr-1.5" />Ask AI for Details
                </button>
              </div>
            )}

            {showBenefitDetail === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#FEF3C7] flex items-center justify-center"><GraduationCap size={22} className="text-[#FFBD4C]" /></div>
                  <div>
                    <p className="text-[16px] font-bold text-[#15161E]">Education Allowance</p>
                    <p className="text-[12px] text-[#FFBD4C] font-semibold">AED 20,000 per year</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Annual Limit', value: 'AED 20,000' },
                    { label: 'Used This Year', value: 'AED 5,200' },
                    { label: 'Remaining', value: 'AED 14,800' },
                    { label: 'Covers', value: 'Tuition + books' },
                    { label: 'Children', value: 'Up to 3 children' },
                    { label: 'Age Limit', value: 'Up to 18 years' },
                  ].map(item => (
                    <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                      <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-[#F8F9FB] rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#FFBD4C]" style={{ width: '26%' }} />
                </div>
                <p className="text-[11px] text-[#A4ABB8] text-center">26% used · AED 14,800 remaining</p>
                <button onClick={() => { setShowBenefitDetail(null); router.push('/services?prompt=How+do+I+claim+my+education+allowance'); }} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#9D63F6] active:scale-[0.97] transition-all" style={{ boxShadow: '0 4px 16px rgba(157,99,246,0.3)' }}>
                  <Sparkles size={14} className="inline mr-1.5" />Claim via AI
                </button>
              </div>
            )}

            {showBenefitDetail === 'flights' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#D1FAE5] flex items-center justify-center"><Plane size={22} className="text-[#40C4AA]" /></div>
                  <div>
                    <p className="text-[16px] font-bold text-[#15161E]">Annual Flight Benefit</p>
                    <p className="text-[12px] text-[#40C4AA] font-semibold">Return flight home for you + family</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Entitlement', value: 'Annual return' },
                    { label: 'Class', value: 'Economy (upgradeable)' },
                    { label: 'Coverage', value: 'Employee + family' },
                    { label: 'This Year', value: 'Not yet used' },
                    { label: 'Etihad Discount', value: '15% off' },
                    { label: 'Emirates Discount', value: '10% off' },
                  ].map(item => (
                    <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                      <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowBenefitDetail(null); router.push('/services?prompt=I+want+to+book+a+flight'); }} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#40C4AA] active:scale-[0.97] transition-all" style={{ boxShadow: '0 4px 16px rgba(64,196,170,0.3)' }}>
                  <Plane size={14} className="inline mr-1.5" />Book Flight with AI
                </button>
              </div>
            )}

            {showBenefitDetail === 'life' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#EDE9FE] flex items-center justify-center"><Shield size={22} className="text-[#7C3AED]" /></div>
                  <div>
                    <p className="text-[16px] font-bold text-[#15161E]">Life Insurance</p>
                    <p className="text-[12px] text-[#7C3AED] font-semibold">24x monthly salary coverage</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Coverage', value: '24x salary' },
                    { label: 'Provider', value: 'IHC Group Life' },
                    { label: 'Type', value: 'Term life' },
                    { label: 'Beneficiary', value: 'As per HR file' },
                    { label: 'Accidental Death', value: '48x salary' },
                    { label: 'Status', value: 'Active' },
                  ].map(item => (
                    <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                      <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowBenefitDetail(null); router.push('/services?prompt=Tell+me+about+my+life+insurance+coverage'); }} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#7C3AED] active:scale-[0.97] transition-all" style={{ boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                  <Sparkles size={14} className="inline mr-1.5" />Ask AI for Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   MY ASSETS SECTION
   ═══════════════════════════════════════════ */

function MyAssetsSection() {
  const CAR_DATA = {
    make: 'Toyota', model: 'Land Cruiser', year: '2023', color: 'Pearl White',
    plate: 'Abu Dhabi · 12345', vin: 'JTMHY7AJ5N5...', regExpiry: 'Dec 2026',
  };

  return (
    <div className="space-y-4">
      {/* ── Car Details ── */}
      <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
        <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #15161E 0%, #2D1B69 100%)' }}>
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Car size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-white">My Vehicle</p>
            <p className="text-[11px] text-white/50">{CAR_DATA.plate}</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-[#40C4AA]/20 text-[#40C4AA]">Registered</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Make / Model', value: `${CAR_DATA.make} ${CAR_DATA.model}` },
              { label: 'Year', value: CAR_DATA.year },
              { label: 'Color', value: CAR_DATA.color },
              { label: 'Plate', value: CAR_DATA.plate },
              { label: 'VIN', value: CAR_DATA.vin },
              { label: 'Reg. Expiry', value: CAR_DATA.regExpiry },
            ].map(item => (
              <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Car Insurance ── */}
      <Link href="/insurance" className="block no-underline">
        <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden active:scale-[0.98] transition-transform">
          <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">Car Insurance</p>
              <p className="text-[11px] text-white/60">Comprehensive Plan</p>
            </div>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white">Active</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Policy No.', value: 'SHR-2025-78432' },
                { label: 'Vehicle', value: 'Toyota Land Cruiser' },
                { label: 'Premium', value: 'AED 1,274/yr' },
                { label: 'Expiry', value: 'May 22, 2026' },
              ].map(item => (
                <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                  <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#059669]">
                <Shield size={13} /> Manage Policy <ChevronRight size={13} />
              </div>
              <p className="text-[9px] text-[#A4ABB8] font-semibold">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Health Insurance ── */}
      <Link href="/insurance" className="block no-underline">
        <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden active:scale-[0.98] transition-transform">
          <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9D63F6 100%)' }}>
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Heart size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white">Health Insurance</p>
              <p className="text-[11px] text-white/60">Gold Family Plan · Daman</p>
            </div>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white">Active</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Network', value: 'Enhanced' },
                { label: 'Annual Limit', value: 'AED 500,000' },
                { label: 'Copay', value: '20%' },
                { label: 'Expiry', value: 'Dec 31, 2026' },
              ].map(item => (
                <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                  <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Dependents */}
            <div className="rounded-[14px] px-3 py-2.5" style={{ background: '#F5F0FF' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={12} className="text-[#7C3AED]" />
                <p className="text-[10px] font-bold text-[#7C3AED]">Dependents</p>
              </div>
              <div className="flex gap-2">
                {[
                  { name: 'Fatima A.', relation: 'Spouse' },
                  { name: 'Omar A.', relation: 'Child' },
                  { name: 'Sara A.', relation: 'Child' },
                ].map(dep => (
                  <div key={dep.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded-[8px] bg-white/80">
                    <div className="w-5 h-5 rounded-full bg-[#9D63F6] flex items-center justify-center text-[8px] font-bold text-white">{dep.name[0]}</div>
                    <p className="text-[10px] font-semibold text-[#15161E]">{dep.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#7C3AED]">
                <Heart size={13} /> View Details <ChevronRight size={13} />
              </div>
              <p className="text-[9px] text-[#A4ABB8] font-semibold">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [locationVisible, setLocationVisible] = useState(true);
  const [locationMode, setLocationMode] = useState<'off' | 'nearby' | 'company' | 'all'>('nearby');

  useBodyScrollLock(showLogout || showShareSheet);

  if (!user) return null;
  const company = COMPANIES.find(c => c.id === user.companyId);
  const myListings = MARKETPLACE_LISTINGS.slice(0, 2);
  const savedOffers = OFFERS.slice(0, 3);

  const SETTINGS = [
    { icon: Bell, label: 'Notification Preferences', desc: 'Manage alerts & emails' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, 2FA, sessions' },
    { icon: Settings, label: 'App Preferences', desc: 'Language, theme, display' },
  ];

  return (
    <AppShell title="My Profile" subtitle={user.employeeId}>
      <div className="grid grid-cols-1 gap-4">
        {/* Left: Profile card */}
        <div className="space-y-4">
          {/* Main card */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-[#9D63F6] to-[#7B4FB5]" />
            <div className="px-5 pb-5">
              <div className="-mt-8 mb-4 flex items-end justify-between">
                <div className="ring-4 ring-white rounded-full">
                  <Avatar initials={user.avatar} color={company?.color || '#9D63F6'} size="xl" image={user.image} />
                </div>
                <button className="flex items-center gap-1.5 bg-[#F8F9FB] text-[#9D63F6] text-xs font-semibold px-3 py-2 rounded-[10px] hover:bg-[#F7F1FF] transition-colors mt-2">
                  <Edit2 size={12} /> Edit
                </button>
              </div>

              <h2 className="text-lg font-bold text-[#15161E] mb-0.5">{user.name}</h2>
              <p className="text-sm text-[#666D80] mb-3">{user.title}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Verified Employee
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F7F1FF] text-[#9D63F6] text-xs font-semibold px-3 py-1 rounded-full">
                  {company?.short}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Building2, value: user.company },
                  { icon: Briefcase, value: user.department },
                  { icon: Hash, value: user.employeeId },
                  { icon: Mail, value: user.email },
                  { icon: MapPin, value: user.location },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2.5 text-sm text-[#666D80]">
                    <Icon size={14} className="text-[#A4ABB8] shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              DIGITAL BUSINESS CARD — Redesigned
              ═══════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode size={15} className="text-[#9D63F6]" strokeWidth={2} />
                <h3 className="text-[15px] font-bold text-[#15161E]">Digital Business Card</h3>
              </div>
              <button
                onClick={() => setShowShareSheet(true)}
                className="flex items-center gap-1.5 bg-[#9D63F6] text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:bg-[#7C3AED] transition-colors active:scale-95"
              >
                <Share2 size={12} /> Share
              </button>
            </div>

            {/* Card — front only */}
            <div className="relative w-full rounded-[20px] overflow-hidden shadow-lg" style={{ aspectRatio: '1.7/1' }}>
                  {/* Premium gradient background */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(145deg, #0F0F1A 0%, #1B1340 35%, #3B1F8E 70%, #7C3AED 100%)',
                  }}>
                    {/* Decorative circles */}
                    <div className="absolute" style={{ top: '-15%', right: '-10%', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(157,99,246,0.25) 0%, transparent 70%)' }} />
                    <div className="absolute" style={{ bottom: '-10%', left: '-8%', width: '45%', height: '45%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(64,196,170,0.15) 0%, transparent 70%)' }} />
                    {/* Fine dot grid */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }} />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    {/* Top — Logo + NFC */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(8px)',
                        }}>
                          <span className="text-[9px] font-extrabold text-white tracking-widest">IHC</span>
                        </div>
                        <div>
                          <p className="text-white/90 text-[11px] font-semibold">{user.company}</p>
                          <p className="text-white/40 text-[9px] font-medium">{company?.short || 'IHC Group'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{
                        background: 'rgba(64,196,170,0.15)',
                        border: '1px solid rgba(64,196,170,0.2)',
                      }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#40C4AA] animate-pulse" />
                        <span className="text-[8px] text-[#40C4AA] font-bold tracking-wide">NFC</span>
                      </div>
                    </div>

                    {/* Middle — Name & Title */}
                    <div className="flex-1 flex flex-col justify-center py-2">
                      <h3 className="text-white text-[22px] font-bold leading-tight tracking-tight">{user.name}</h3>
                      <p className="text-[13px] font-semibold mt-1" style={{ color: '#FFBD4C' }}>{user.title}</p>
                    </div>

                    {/* Bottom — Contact details + QR */}
                    <div className="flex items-end justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <Mail size={8} className="text-white/50" />
                          </div>
                          <p className="text-white/65 text-[10px]">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <Phone size={8} className="text-white/50" />
                          </div>
                          <p className="text-white/65 text-[10px]">+971 50 XXX XXXX</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <MapPin size={8} className="text-white/50" />
                          </div>
                          <p className="text-white/65 text-[10px]">{user.location}</p>
                        </div>
                      </div>
                      {/* Mini QR */}
                      <div className="w-12 h-12 rounded-[8px] p-1.5 bg-white/95 shrink-0">
                        <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1.5px]">
                          {[1,1,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,1,1].map((f, i) => (
                            <div key={i} className="rounded-[0.5px]" style={{ background: f ? '#15161E' : 'transparent' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
            </div>

            {/* Quick share actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${user.name} | ${user.title} | ${user.company} | ${user.email}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] border border-[#DFE1E6] bg-white text-[11px] font-semibold text-[#15161E] hover:bg-[#F8F9FB] transition-all active:scale-[0.97]"
              >
                {copied ? <Check size={13} className="text-[#40C4AA]" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy details'}
              </button>
              <button
                onClick={() => setShowShareSheet(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] bg-[#15161E] text-[11px] font-bold text-white hover:bg-[#2D1B69] transition-all active:scale-[0.97]"
              >
                <Share2 size={13} /> Share card
              </button>
            </div>
          </div>

          {/* Share Bottom Sheet */}
          {showShareSheet && (
            <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
              <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-5" />
                <button onClick={() => setShowShareSheet(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
                <h3 className="text-[16px] font-bold text-[#15161E] mb-1">Share Business Card</h3>
                <p className="text-[13px] text-[#666D80] mb-5">Send your digital card to colleagues within IHC Group</p>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: Mail, label: 'Email', color: '#9D63F6', bg: '#F7F1FF' },
                    { icon: Copy, label: 'Copy Link', color: '#40C4AA', bg: '#E7FEF8' },
                    { icon: QrCode, label: 'QR Code', color: '#15161E', bg: '#F8F9FB' },
                    { icon: Share2, label: 'More', color: '#FFBD4C', bg: '#FFF6E0' },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <button key={label} onClick={() => {
                      if (label === 'Email') { window.location.href = `mailto:?subject=Business Card - ${user?.name || 'IHC Employee'}&body=View my digital business card at Ahli Connect`; setShowShareSheet(false); }
                      else if (label === 'Copy Link') { navigator.clipboard.writeText(`https://ahliconnect.ihcgroup.ae/card/${user?.employeeId || '10234'}`); setShowShareSheet(false); }
                      else if (label === 'QR Code') { setShowShareSheet(false); setCardFlipped(true); }
                      else { if (navigator.share) navigator.share({ title: `${user?.name} - Business Card`, url: `https://ahliconnect.ihcgroup.ae/card/${user?.employeeId || '10234'}` }); setShowShareSheet(false); }
                    }} className="flex flex-col items-center gap-2 py-3 rounded-[14px] hover:bg-[#F8F9FB] transition-colors active:scale-[0.95]">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: bg }}>
                        <Icon size={20} style={{ color }} strokeWidth={1.8} />
                      </div>
                      <p className="text-[10px] font-semibold text-[#15161E]">{label}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowShareSheet(false)}
                  className="w-full border border-[#DFE1E6] text-[#666D80] font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#F8F9FB] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              WALLET & REWARDS
              ═══════════════════════════════════════ */}
          <WalletSection />

          {/* ═══════════════════════════════════════
              YOUR BENEFITS
              ═══════════════════════════════════════ */}
          <BenefitsSection />

          {/* ═══════════════════════════════════════
              MY ASSETS — Car, Home & Insurance
              ═══════════════════════════════════════ */}
          <MyAssetsSection />

          {/* Location & Privacy */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F8F9FB]">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#9D63F6]" strokeWidth={1.8} />
                <p className="text-sm font-bold text-[#15161E]">Location & Privacy</p>
              </div>
            </div>
            <div className="px-5 py-4 border-b border-[#F8F9FB]">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-[#15161E]">Show me on People Map</p>
                  <p className="text-xs text-[#A4ABB8]">Nearby IHC colleagues can see your location</p>
                </div>
                <button
                  onClick={() => setLocationVisible(!locationVisible)}
                  className="relative w-[44px] h-[24px] rounded-full transition-colors duration-200"
                  style={{ background: locationVisible ? '#9D63F6' : '#DFE1E6' }}
                >
                  <div className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200"
                    style={{ transform: locationVisible ? 'translateX(22px)' : 'translateX(2px)' }} />
                </button>
              </div>
              {locationVisible && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {[
                    { id: 'nearby' as const, label: 'Nearby only' },
                    { id: 'company' as const, label: 'Same company' },
                    { id: 'all' as const, label: 'All IHC employees' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setLocationMode(opt.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: locationMode === opt.id ? '#9D63F6' : '#F8F9FB',
                        color: locationMode === opt.id ? '#fff' : '#666D80',
                        border: locationMode === opt.id ? 'none' : '1px solid #DFE1E6',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {!locationVisible && (
                <p className="text-xs text-[#A4ABB8] mt-2 italic">You won&apos;t appear on the People Map when this is off.</p>
              )}
            </div>
            <Link href="/people-map" className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F9FB] transition-colors text-left">
              <div className="w-9 h-9 rounded-[10px] bg-[#F5F0FF] flex items-center justify-center shrink-0">
                <MapPin size={15} className="text-[#9D63F6]" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#15161E]">Open People Map</p>
                <p className="text-xs text-[#A4ABB8]">See nearby IHC colleagues</p>
              </div>
              <ChevronRight size={14} className="text-[#A4ABB8]" />
            </Link>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F8F9FB]">
              <p className="text-sm font-bold text-[#15161E]">Settings</p>
            </div>
            {SETTINGS.map(({ icon: Icon, label, desc }) => (
              <button key={label} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F9FB] transition-colors text-left border-b border-[#F8F9FB] last:border-0">
                <div className="w-9 h-9 rounded-[10px] bg-[#F8F9FB] flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-[#666D80]" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#15161E]">{label}</p>
                  <p className="text-xs text-[#A4ABB8]">{desc}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-red-50 flex items-center justify-center shrink-0">
                <LogOut size={15} className="text-red-500" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium text-red-500">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right: Activity */}
        <div className="space-y-4">
          {/* Saved Offers */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-[#9D63F6]" strokeWidth={1.8} />
              <h3 className="text-sm font-bold text-[#15161E]">Saved Offers</h3>
            </div>
            <div className="space-y-3">
              {savedOffers.map(offer => (
                <div key={offer.id} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6]">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: offer.color }}>
                    {offer.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#15161E] truncate">{offer.title}</p>
                    <p className="text-xs font-medium" style={{ color: offer.color }}>{offer.value}</p>
                  </div>
                  <span className="text-xs text-[#A4ABB8] shrink-0">{offer.company}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Listings */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#9D63F6]" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-[#15161E]">My Listings</h3>
              </div>
              <span className="text-xs text-[#A4ABB8] bg-[#F8F9FB] px-2.5 py-1 rounded-full">{myListings.length} active</span>
            </div>
            <div className="space-y-3">
              {myListings.map(listing => (
                <div key={listing.id} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6]">
                  <img src={listing.image} alt={listing.title} className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#15161E] truncate">{listing.title}</p>
                    <p className="text-sm font-bold text-[#9D63F6]">{listing.price}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout bottom sheet */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl relative">
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-6" />
            <button onClick={() => setShowLogout(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <LogOut size={28} className="text-red-500" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-[#15161E] mb-2">Sign Out?</h3>
              <p className="text-sm text-[#666D80]">You'll need to sign in again to access Ahli Connect.</p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={logout}
                className="w-full bg-[#9D63F6] text-white font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#152E56] transition-all"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="w-full border border-[#DFE1E6] text-[#666D80] font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#F8F9FB] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
