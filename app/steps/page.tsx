'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, Footprints, Trophy, Flame, Target, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';

export default function StepsPage() {
  const wallet = useWallet();
  const router = useRouter();
  const [claimed, setClaimed] = useState(false);

  // Mock data
  const currentSteps = 7432;
  const dailyGoal = 10000;
  const stepsRemaining = dailyGoal - currentSteps;
  const progress = (currentSteps / dailyGoal) * 100;
  const calories = Math.round(currentSteps * 0.04);
  const distance = (currentSteps * 0.0008).toFixed(1);
  const activeMinutes = 42;
  const goalReached = currentSteps >= dailyGoal;

  // SVG circle math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Hourly data (mock)
  const hourlySteps = [
    { hour: '6 AM', steps: 120 },
    { hour: '7 AM', steps: 1850 },
    { hour: '8 AM', steps: 2340 },
    { hour: '9 AM', steps: 680 },
    { hour: '10 AM', steps: 420 },
    { hour: '11 AM', steps: 310 },
    { hour: '12 PM', steps: 890 },
    { hour: '1 PM', steps: 520 },
    { hour: '2 PM', steps: 302 },
  ];
  const maxHourly = Math.max(...hourlySteps.map(h => h.steps));

  return (
    <AppShell title="Steps" subtitle="" hideTopBar>
      <div style={{ touchAction: 'pan-y pinch-zoom', overscrollBehavior: 'none' }}>
        {/* Hero gradient header */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #059669 0%, #047857 30%, #065F46 60%, #F8F9FB 100%)', minHeight: 420 }}>
          {/* Back button */}
          <div className="relative z-20 flex items-center px-5 pt-5">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h2 className="text-[16px] font-bold text-white ml-3">Daily Steps</h2>
          </div>

          {/* Progress Ring */}
          <div className="relative z-10 flex flex-col items-center mt-6">
            <div className="relative" style={{ width: 220, height: 220 }}>
              <svg width="220" height="220" className="transform -rotate-90">
                <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
                <circle cx="110" cy="110" r={radius} fill="none" stroke="#FFBD4C" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Footprints size={20} className="text-white/60 mb-1" />
                <p className="text-[36px] font-extrabold text-white leading-none">{currentSteps.toLocaleString()}</p>
                <p className="text-[12px] text-white/60 mt-1">of {dailyGoal.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-[14px] font-semibold text-white/80 mt-3">
              {goalReached ? '🎉 Goal reached!' : `${stepsRemaining.toLocaleString()} steps to go`}
            </p>
          </div>
        </div>

        <div className="px-5 -mt-8 relative z-20 space-y-4 pb-32">
          {/* Stats row */}
          <div className="flex gap-3">
            {[
              { icon: Flame, label: 'Calories', value: `${calories}`, color: '#DF1C41' },
              { icon: Target, label: 'Distance', value: `${distance} km`, color: '#9D63F6' },
              { icon: Zap, label: 'Active', value: `${activeMinutes} min`, color: '#FFBD4C' },
            ].map(stat => (
              <div key={stat.label} className="flex-1 p-3.5 rounded-[18px] bg-white border border-[#DFE1E6] shadow-sm text-center">
                <stat.icon size={18} className="mx-auto mb-1.5" style={{ color: stat.color }} />
                <p className="text-[16px] font-bold text-[#15161E]">{stat.value}</p>
                <p className="text-[10px] text-[#A4ABB8] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Reward card */}
          <div className="rounded-[20px] overflow-hidden relative" style={{ boxShadow: '0 8px 32px rgba(27,58,107,0.08)' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)' }} />
            <div className="relative z-10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,189,76,0.2)' }}>
                  <Trophy size={18} className="text-[#FFBD4C]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#15161E]">Daily Steps Reward</p>
                  <p className="text-[11px] text-[#666D80]">Walk 10,000 steps to earn</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-extrabold text-[#FFBD4C]">500</p>
                  <p className="text-[9px] text-[#A4ABB8] font-medium">points</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-white/80 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg, #FFBD4C, #F59E0B)' }} />
              </div>
              <p className="text-[10px] text-[#A4ABB8] mt-1.5">{Math.round(progress)}% complete</p>

              <button
                disabled={!goalReached || claimed}
                onClick={() => {
                  wallet.addRewardPoints(500, '10K Daily Steps Goal', 'engagement');
                  setClaimed(true);
                }}
                className={`w-full mt-3 py-3 rounded-[14px] text-[13px] font-bold transition-all active:scale-[0.98] ${
                  claimed ? 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                  : goalReached ? 'bg-[#059669] text-white shadow-md'
                  : 'bg-[#DFE1E6] text-[#A4ABB8] cursor-not-allowed'
                }`}>
                {claimed ? '✓ Points Claimed!' : goalReached ? 'Claim 500 Points' : `${stepsRemaining.toLocaleString()} steps remaining`}
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] p-5 shadow-sm">
            <p className="text-[11px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-4">Today&apos;s Activity</p>
            <div className="space-y-3">
              {hourlySteps.map((h) => (
                <div key={h.hour} className="flex items-center gap-3">
                  <span className="text-[11px] text-[#A4ABB8] font-medium w-12 shrink-0">{h.hour}</span>
                  <div className="flex-1 h-[6px] rounded-full bg-[#F8F9FB] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(h.steps / maxHourly) * 100}%`, background: h.steps > 1000 ? '#059669' : '#A4ABB8' }} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#15161E] w-12 text-right">{h.steps.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly trend */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-[#A4ABB8] uppercase tracking-wider">This Week</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                <TrendingUp size={12} /> +12%
              </div>
            </div>
            <div className="flex items-end gap-2 h-[80px]">
              {[6200, 8100, 9400, 7800, 10200, 8900, 7432].map((s, i) => {
                const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const isToday = i === 6;
                const h = (s / 12000) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-[6px] transition-all" style={{
                      height: `${h}%`,
                      background: isToday ? 'linear-gradient(180deg, #059669, #047857)' : s >= 10000 ? '#BBF7D0' : '#F8F9FB',
                      border: isToday ? 'none' : '1px solid #DFE1E6',
                    }} />
                    <span className={`text-[9px] font-medium ${isToday ? 'text-[#059669]' : 'text-[#A4ABB8]'}`}>{dayLabels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
