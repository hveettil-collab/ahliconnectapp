'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, Star, TrendingUp, Zap, Gift, Sparkles, ChevronRight, Award, Trophy, Target, Crown, CheckCircle2, ArrowRight, Flame, Clock } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';

const REWARD_CATEGORIES: Record<string, { icon: typeof Star; color: string; bg: string; label: string }> = {
  performance: { icon: TrendingUp, color: '#9D63F6', bg: '#F7F1FF', label: 'Performance' },
  innovation: { icon: Zap, color: '#FFBD4C', bg: '#FFF6E0', label: 'Innovation' },
  engagement: { icon: Star, color: '#54B6ED', bg: '#EEF8FD', label: 'Engagement' },
  recognition: { icon: Gift, color: '#40C4AA', bg: '#E7FEF8', label: 'Recognition' },
  referral: { icon: Sparkles, color: '#EC4899', bg: '#FDF2F8', label: 'Referral' },
};

const TIERS = [
  { name: 'Bronze', min: 0, max: 1999, color: '#CD7F32', icon: Award },
  { name: 'Silver', min: 2000, max: 4999, color: '#A4ABB8', icon: Trophy },
  { name: 'Gold', min: 5000, max: 9999, color: '#FFBD4C', icon: Crown },
  { name: 'Platinum', min: 10000, max: 99999, color: '#9D63F6', icon: Sparkles },
];

const HOW_TO_EARN = [
  { label: 'Performance Reviews', desc: 'Quarterly evaluations', pts: 'Up to 1,000', cat: 'performance' },
  { label: 'Innovation Ideas', desc: 'Submit & get implemented', pts: 'Up to 2,000', cat: 'innovation' },
  { label: 'Platform Engagement', desc: 'Use Ahli Connect daily', pts: '50-250/mo', cat: 'engagement' },
  { label: 'Colleague Referrals', desc: 'Refer new hires', pts: '100 each', cat: 'referral' },
  { label: 'Peer Recognition', desc: 'Get kudos from colleagues', pts: '50-500', cat: 'recognition' },
  { label: 'Community Posts', desc: 'Share knowledge & ideas', pts: '25 each', cat: 'engagement' },
];

const REDEEM_OPTIONS = [
  { title: 'Ahli Wallet Credit', desc: 'Convert points to AED', value: '1 pt = AED 0.10', color: '#9D63F6', icon: Gift },
  { title: 'Extra Leave Day', desc: 'Add 1 day to your balance', value: '5,000 pts', color: '#40C4AA', icon: Star },
  { title: 'Dining Voucher', desc: 'Zuma, Nobu, and more', value: '2,000 pts', color: '#FFBD4C', icon: Trophy },
  { title: 'Yas Island Pass', desc: 'Theme parks for 4', value: '8,000 pts', color: '#DC2626', icon: Flame },
];

export default function RewardsPage() {
  const wallet = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'redeem'>('overview');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const currentTier = TIERS.find(t => wallet.rewardPoints >= t.min && wallet.rewardPoints <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

  // SVG circle for tier progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (wallet.rewardProgress / 100) * circumference;

  // Category stats
  const catStats = Object.entries(REWARD_CATEGORIES).map(([key, val]) => ({
    key,
    ...val,
    total: wallet.rewardHistory.filter(r => r.category === key).reduce((s, r) => s + r.points, 0),
    count: wallet.rewardHistory.filter(r => r.category === key).length,
  }));

  const filteredHistory = filterCat === 'all' ? wallet.rewardHistory : wallet.rewardHistory.filter(r => r.category === filterCat);

  return (
    <AppShell title="Rewards" subtitle="" hideTopBar>
      <div style={{ overscrollBehaviorX: 'none' }}>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${currentTier.color} 0%, ${currentTier.color}DD 30%, ${currentTier.color}99 55%, #F8F9FB 100%)`, minHeight: 400 }}>
          {/* Decorative shapes */}
          <div className="absolute top-10 right-[-30px] w-[120px] h-[120px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute top-40 left-[-20px] w-[80px] h-[80px] rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

          {/* Back + Title */}
          <div className="relative z-20 flex items-center justify-between px-5 pt-5">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full active:scale-95 transition-transform" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <ArrowLeft size={18} className="text-white" />
              </button>
              <h2 className="text-[16px] font-bold text-white ml-3">Rewards</h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
              <currentTier.icon size={13} className="text-white" />
              <span className="text-[11px] font-bold text-white">{currentTier.name}</span>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative z-10 flex flex-col items-center mt-5">
            <div className="relative" style={{ width: 200, height: 200 }}>
              <svg width="200" height="200" className="transform -rotate-90">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle cx="100" cy="100" r={radius} fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Star size={22} className="text-white/80 mb-1" fill="rgba(255,255,255,0.8)" strokeWidth={0} />
                <p className="text-[32px] font-extrabold text-white leading-none">{wallet.rewardPoints.toLocaleString()}</p>
                <p className="text-[11px] text-white/60 font-medium mt-1">reward points</p>
              </div>
            </div>

            {/* Value + Next tier */}
            <div className="flex items-center gap-4 mt-3 mb-6">
              <div className="text-center px-4 py-2 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <p className="text-[14px] font-bold text-white">AED {wallet.getPointsValue(wallet.rewardPoints).toLocaleString()}</p>
                <p className="text-[9px] text-white/50 font-medium">Cash Value</p>
              </div>
              {nextTier && (
                <div className="text-center px-4 py-2 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                  <p className="text-[14px] font-bold text-white">{(nextTier.min - wallet.rewardPoints).toLocaleString()}</p>
                  <p className="text-[9px] text-white/50 font-medium">To {nextTier.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-4 -mt-3 relative z-20">
          <div className="flex gap-1 p-1 rounded-[16px] bg-white border border-[#DFE1E6]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {([['overview', 'Overview'], ['history', 'History'], ['redeem', 'Redeem']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold transition-all"
                style={{
                  background: activeTab === key ? currentTier.color : 'transparent',
                  color: activeTab === key ? '#FFFFFF' : '#A4ABB8',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-5 pb-8 space-y-4">

          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === 'overview' && (
            <>
              {/* Tier Journey */}
              <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
                <p className="text-[13px] font-bold text-[#15161E] mb-3">Tier Journey</p>
                <div className="flex items-center gap-1.5">
                  {TIERS.map((t, i) => {
                    const TIcon = t.icon;
                    const isCurrent = t.name === currentTier.name;
                    const isPast = wallet.rewardPoints > t.max;
                    return (
                      <div key={t.name} className="flex-1 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all ${isCurrent ? 'scale-110' : ''}`}
                          style={{
                            background: isPast || isCurrent ? t.color : '#F0F0F0',
                            boxShadow: isCurrent ? `0 4px 16px ${t.color}40` : 'none',
                          }}>
                          <TIcon size={16} style={{ color: isPast || isCurrent ? '#fff' : '#A4ABB8' }} />
                        </div>
                        <p className="text-[9px] font-bold" style={{ color: isPast || isCurrent ? t.color : '#A4ABB8' }}>{t.name}</p>
                        <p className="text-[8px] text-[#A4ABB8]">{t.min.toLocaleString()}+</p>
                        {i < TIERS.length - 1 && (
                          <div className="absolute" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Points by Category */}
              <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
                <p className="text-[13px] font-bold text-[#15161E] mb-3">Points by Category</p>
                <div className="space-y-2.5">
                  {catStats.filter(c => c.total > 0).map(c => {
                    const CIcon = c.icon;
                    const pct = wallet.rewardPoints > 0 ? Math.round((c.total / wallet.rewardPoints) * 100) : 0;
                    return (
                      <div key={c.key} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: c.bg }}>
                          <CIcon size={16} style={{ color: c.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-semibold text-[#15161E]">{c.label}</p>
                            <p className="text-[11px] font-bold" style={{ color: c.color }}>{c.total.toLocaleString()} pts</p>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F0F0F0] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How to Earn */}
              <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
                <p className="text-[13px] font-bold text-[#15161E] mb-3">How to Earn More</p>
                <div className="space-y-2">
                  {HOW_TO_EARN.map(item => {
                    const catStyle = REWARD_CATEGORIES[item.cat];
                    const EIcon = catStyle.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6] bg-[#F8F9FB]">
                        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: catStyle.bg }}>
                          <EIcon size={15} style={{ color: catStyle.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-[#15161E]">{item.label}</p>
                          <p className="text-[9px] text-[#A4ABB8]">{item.desc}</p>
                        </div>
                        <span className="text-[10px] font-bold shrink-0" style={{ color: catStyle.color }}>{item.pts}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ═══ HISTORY TAB ═══ */}
          {activeTab === 'history' && (
            <>
              {/* Category filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                <button onClick={() => setFilterCat('all')}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
                  style={{ background: filterCat === 'all' ? currentTier.color : '#F0F0F0', color: filterCat === 'all' ? '#fff' : '#666D80' }}>
                  All
                </button>
                {Object.entries(REWARD_CATEGORIES).map(([key, val]) => (
                  <button key={key} onClick={() => setFilterCat(key)}
                    className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
                    style={{ background: filterCat === key ? val.color : '#F0F0F0', color: filterCat === key ? '#fff' : '#666D80' }}>
                    {val.label}
                  </button>
                ))}
              </div>

              {/* History list */}
              <div className="bg-white rounded-[18px] border border-[#DFE1E6] overflow-hidden">
                {filteredHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <Star size={28} className="mx-auto text-[#DFE1E6] mb-2" />
                    <p className="text-[12px] text-[#A4ABB8]">No rewards in this category yet</p>
                  </div>
                ) : (
                  filteredHistory.map((r, i) => {
                    const catStyle = REWARD_CATEGORIES[r.category] || REWARD_CATEGORIES.engagement;
                    const HIcon = catStyle.icon;
                    return (
                      <div key={r.id} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-[#F0F0F0]' : ''}`}>
                        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: catStyle.bg }}>
                          <HIcon size={16} style={{ color: catStyle.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#15161E] truncate">{r.reason}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[#A4ABB8] flex items-center gap-1"><Clock size={9} /> {r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>{catStyle.label}</span>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold shrink-0" style={{ color: catStyle.color }}>+{r.points}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* ═══ REDEEM TAB ═══ */}
          {activeTab === 'redeem' && (
            <>
              <div className="flex items-center gap-2 p-3.5 rounded-[16px] border border-[#DFE1E6] bg-white">
                <Star size={18} style={{ color: currentTier.color }} fill={currentTier.color} strokeWidth={0} />
                <p className="text-[13px] font-bold text-[#15161E]">{wallet.rewardPoints.toLocaleString()} pts</p>
                <p className="text-[11px] text-[#A4ABB8]">available to redeem</p>
              </div>

              <div className="space-y-3">
                {REDEEM_OPTIONS.map(opt => {
                  const RIcon = opt.icon;
                  const isRedeemed = redeemed === opt.title;
                  return (
                    <div key={opt.title} className="bg-white rounded-[18px] border border-[#DFE1E6] overflow-hidden">
                      <div className="flex items-center gap-3.5 p-4">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: opt.color + '12' }}>
                          <RIcon size={22} style={{ color: opt.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#15161E]">{opt.title}</p>
                          <p className="text-[10px] text-[#A4ABB8] mt-0.5">{opt.desc}</p>
                          <p className="text-[10px] font-bold mt-1" style={{ color: opt.color }}>{opt.value}</p>
                        </div>
                        {!isRedeemed ? (
                          <button onClick={() => setRedeemed(opt.title)}
                            className="px-4 py-2 rounded-[12px] text-[11px] font-bold text-white shrink-0 active:scale-95 transition-all"
                            style={{ background: opt.color }}>
                            Redeem
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600 shrink-0">
                            <CheckCircle2 size={16} />
                            <span className="text-[11px] font-bold">Done</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
