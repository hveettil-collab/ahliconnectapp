'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';
import {
  IHC_ANNOUNCEMENTS, COMPANY_ANNOUNCEMENTS, OFFERS,
  MARKET_DATA, COMPANIES, COLLEAGUES
} from '@/lib/mockData';
import {
  ArrowRight, TrendingUp, TrendingDown, CheckCircle2,
  Calendar, Clock, Bell, Sparkles, ChevronRight, Sun,
  Compass, Heart, Shield, GraduationCap, Gift, Zap, Star,
  Plane, Car, Gamepad2, Users, Globe, UtensilsCrossed,
  CreditCard, MapPin, Palmtree, Menu, RefreshCw,
  Dumbbell, Activity, Coffee, FileText, Timer, Brain,
  Wallet, Receipt, Award, ArrowUpRight, Play
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { useStockPrice } from '@/hooks/useStockPrice';
import { useNotifications } from '@/context/NotificationContext';

/* ──── Helpers ──── */

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function useLiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(new Intl.DateTimeFormat('en-AE', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dubai',
      }).format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ──── Animated Counter Hook ──── */
function useCountUp(target: number, duration = 1800, delay = 300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ════════════════ DASHBOARD ════════════════ */

export default function DashboardPage() {
  const { user } = useAuth();
  const greeting = useGreeting();
  const time = useLiveTime();
  const { stock, loading: stockLoading, refetch: refetchStock } = useStockPrice();
  const { unreadCount, togglePanel } = useNotifications();
  const [mounted, setMounted] = useState(false);

  // Animated counters for USP stats
  const hoursSaved = useCountUp(347, 2000, 600);
  const employees = useCountUp(45, 2000, 800);
  const benefitsVal = useCountUp(85, 2000, 1000);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Merge live stock data with fallback
  const sd = stock ?? {
    ...MARKET_DATA,
    live: false,
    updatedAt: '',
    prevClose: MARKET_DATA.price - MARKET_DATA.change,
  };

  if (!user) return null;

  const company = COMPANIES.find(c => c.id === user.companyId);
  const companyAnns = COMPANY_ANNOUNCEMENTS[user.companyId] || [];
  const relevantOffers = OFFERS.filter(o => o.relevantFor.includes(user.companyId)).slice(0, 6);
  const allAnns = [...IHC_ANNOUNCEMENTS, ...companyAnns].slice(0, 3);
  const onlineColleagues = COLLEAGUES.filter(c => c.online);

  return (
    <AppShell title="Home" subtitle={time} hideTopBar>

      {/* ══════════════════════════════════════════
          HERO — Immersive gradient with greeting
          ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 52vh, 420px)' }}>
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 30%, #54B6ED 70%, #40C4AA 100%)',
        }}>
          {/* Floating orbs for depth */}
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-30" style={{
            background: 'radial-gradient(circle, #FFBD4C 0%, transparent 70%)',
            top: '-80px', right: '-60px',
            animation: 'float 8s ease-in-out infinite',
          }} />
          <div className="absolute w-[200px] h-[200px] rounded-full opacity-20" style={{
            background: 'radial-gradient(circle, #54B6ED 0%, transparent 70%)',
            bottom: '20px', left: '-40px',
            animation: 'float 6s ease-in-out infinite reverse',
          }} />
          <div className="absolute w-[150px] h-[150px] rounded-full opacity-15" style={{
            background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
            top: '40%', left: '50%',
            animation: 'float 10s ease-in-out infinite',
          }} />
        </div>

        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Top bar — avatar + bell */}
        <div className="relative z-20 flex items-start justify-between px-5 pt-5">
          <div className="flex items-center gap-3">
            <img
              src={user.image}
              alt={user.name}
              className="w-[48px] h-[48px] rounded-full object-cover"
              style={{
                border: '2.5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}
            />
            <div>
              <p className="text-white/60 text-[11px] font-medium tracking-wide">{greeting}</p>
              <p className="text-white text-[16px] font-bold leading-tight">{user.name.split(' ')[0]}</p>
            </div>
          </div>
          <button onClick={togglePanel} className="relative">
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
              <Bell size={18} className="text-white" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-[#DF1C41] flex items-center justify-center px-1 shadow-md">
                <span className="text-[9px] font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </button>
        </div>

        {/* Hero tagline */}
        <div className="relative z-20 px-5 mt-6">
          <h1 className="text-white leading-[1.1] tracking-tight"
            style={{
              fontSize: 'clamp(28px, 7vw, 36px)',
              fontWeight: 800,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
            Your work life,{'\n'}
            <span style={{ color: '#FFBD4C' }}>supercharged.</span>
          </h1>
          <p className="text-white/60 text-[14px] mt-2 leading-relaxed max-w-[280px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}>
            AI-powered benefits, automations & perks for {company?.name || 'IHC Group'}
          </p>
        </div>

        {/* USP Stats Strip — Animated Counters */}
        <div className="relative z-20 flex items-center justify-between px-5 mt-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}>
          {[
            { value: `${hoursSaved}`, suffix: 'hrs', label: 'Saved weekly', icon: Timer },
            { value: `${employees}K`, suffix: '+', label: 'Employees', icon: Users },
            { value: `${benefitsVal}K`, suffix: '+', label: 'Benefits AED', icon: Award },
          ].map(({ value, suffix, label, icon: Icon }, i) => (
            <div key={label} className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Icon size={13} className="text-white/50" strokeWidth={2} />
                <p className="text-white text-[20px] font-bold tabular-nums leading-none">
                  {value}<span className="text-white/50 text-[12px]">{suffix}</span>
                </p>
              </div>
              <p className="text-white/40 text-[10px] font-medium">{label}</p>
              {i < 2 && <div className="hidden" />}
            </div>
          ))}
        </div>

        {/* AI Assistant — Floating CTA */}
        <div className="relative z-20 px-5 mt-5 pb-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
          }}>
          <Link href="/services" className="block">
            <div className="relative rounded-[20px] overflow-hidden" style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                {/* Pulsing AI orb */}
                <div className="relative w-[44px] h-[44px] shrink-0">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{
                    background: 'linear-gradient(135deg, #FFBD4C, #9D63F6)',
                    animationDuration: '2s',
                  }} />
                  <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #FFBD4C 0%, #9D63F6 100%)',
                    boxShadow: '0 4px 20px rgba(157,99,246,0.4)',
                  }}>
                    <Sparkles size={20} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[14px] font-bold">Ask AI anything</p>
                  <p className="text-white/50 text-[12px] mt-0.5">Salary certs, leaves, expenses — instant</p>
                </div>
                <ArrowRight size={18} className="text-white/40 shrink-0" />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#F8F9FB] rounded-t-[24px]" />
      </div>

      {/* ═══════════════════════════════════════
          SMART AUTOMATIONS — The hero USP cards
          ═══════════════════════════════════════ */}
      <div className="px-4 -mt-1 pb-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#FFBD4C]" strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-[#15161E]">Smart Automations</h3>
          </div>
          <span className="text-[10px] font-semibold text-[#9D63F6] bg-[#9D63F6]/8 px-2.5 py-1 rounded-full">AI-Powered</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollSnapType: 'x mandatory' }}>
          {[
            {
              title: 'Salary Certificate',
              subtitle: 'Generated in under 30 seconds',
              icon: FileText,
              gradient: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 100%)',
              stat: '<30s',
              statLabel: 'avg. time',
              href: '/automations/salary-certificate',
            },
            {
              title: 'Smart Leave',
              subtitle: 'AI suggests best dates for you',
              icon: Calendar,
              gradient: 'linear-gradient(135deg, #40C4AA 0%, #059669 100%)',
              stat: '1-tap',
              statLabel: 'approval',
              href: '/automations/leave-request',
            },
            {
              title: 'Expense Claim',
              subtitle: 'Scan receipt, auto-categorize',
              icon: Receipt,
              gradient: 'linear-gradient(135deg, #FFBD4C 0%, #EA580C 100%)',
              stat: '98%',
              statLabel: 'accuracy',
              href: '/automations/expense-claim',
            },
          ].map((card, i) => (
            <Link key={card.title} href={card.href}
              className="shrink-0 rounded-[20px] overflow-hidden active:scale-[0.97] transition-transform"
              style={{
                width: 'clamp(200px, 52vw, 240px)',
                scrollSnapAlign: 'start',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.9 + i * 0.1}s`,
              }}>
              <div className="relative p-4 pb-3" style={{ background: card.gradient }}>
                {/* Decorative circles */}
                <div className="absolute top-3 right-3 w-16 h-16 rounded-full opacity-10" style={{ background: 'white' }} />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5" style={{ background: 'white' }} />
                <card.icon size={24} className="text-white mb-3" strokeWidth={1.8} />
                <p className="text-white text-[14px] font-bold leading-tight">{card.title}</p>
                <p className="text-white/60 text-[11px] mt-1 leading-snug">{card.subtitle}</p>
              </div>
              <div className="bg-white border border-[#DFE1E6] border-t-0 rounded-b-[20px] px-4 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-[#15161E] leading-none">{card.stat}</p>
                  <p className="text-[10px] text-[#A4ABB8] mt-0.5">{card.statLabel}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center">
                  <ArrowRight size={14} className="text-[#15161E]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          QUICK ACCESS BENTO — Redesigned
          ═══════════════════════════════════════ */}
      <div className="px-4 pt-3 pb-1">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Gift, label: 'Benefits', href: '/offers', bg: '#F7F1FF', color: '#9D63F6' },
            { icon: Compass, label: 'Explore', href: '/explore', bg: '#E7FEF8', color: '#40C4AA' },
            { icon: UtensilsCrossed, label: 'Market', href: '/marketplace', bg: '#FFF6E0', color: '#FFBD4C' },
            { icon: Users, label: 'Chat', href: '/chat', bg: '#EBF5FF', color: '#54B6ED' },
          ].map(({ icon: Icon, label, href, bg, color }) => (
            <Link key={label} href={href}
              className="flex flex-col items-center gap-1.5 py-3 rounded-[16px] border border-[#DFE1E6] bg-white hover:shadow-md transition-all active:scale-[0.96]">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} strokeWidth={1.8} />
              </div>
              <p className="text-[10px] font-semibold text-[#15161E]">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Rest of dashboard content ── */}
      <div className="px-4 space-y-3 pb-4 pt-2">

        {/* ── Featured Event Banner ── */}
        <Link href="/explore" className="block">
          <div className="relative bg-[#15161E] rounded-[20px] p-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{
              background: 'radial-gradient(circle, #9D63F6, transparent)',
            }} />
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[10px] text-white/40 font-medium">Upcoming Event</p>
            </div>
            <p className="text-[15px] font-bold text-white leading-snug">Sports Day Yas Island</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-[22px] font-bold text-white leading-none">22 May</p>
              <div className="w-px h-6 bg-white/15" />
              <p className="text-[11px] text-white/40">Yas Sports Complex</p>
            </div>
          </div>
        </Link>

        {/* ── Benefits Highlight ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#15161E]">Your Benefits</h3>
            <Link href="/offers" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#FFBD4C]/10 to-[#FFBD4C]/5 rounded-[18px] border border-[#FFBD4C]/20 p-4 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-red-50 flex items-center justify-center shrink-0">
                <Heart size={22} className="text-red-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#15161E]">Medical Insurance</p>
                <p className="text-[11px] font-semibold text-[#FFBD4C]">Daman Enhanced · Family</p>
                <p className="text-[10px] text-[#A4ABB8]">Full coverage for you + dependents</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#FFBD4C]">AED 85K</p>
                <p className="text-[9px] text-[#A4ABB8]">Total value/yr</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: GraduationCap, color: '#FFBD4C', bg: '#FEF3C7', title: 'Education', value: 'AED 20K/yr' },
              { icon: Plane, color: '#40C4AA', bg: '#D1FAE5', title: 'Flights', value: 'Return home' },
              { icon: Shield, color: '#7C3AED', bg: '#EDE9FE', title: 'Life Cover', value: '24x salary' },
            ].map(({ icon: Icon, color, bg, title, value }) => (
              <div key={title} className="rounded-[14px] p-3 bg-white border border-[#DFE1E6] text-center">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} strokeWidth={2} />
                </div>
                <p className="text-[11px] font-bold text-[#15161E]">{title}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lifestyle & Travel ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#15161E]">Lifestyle & Travel</h3>
            <Link href="/explore" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { Icon: Plane, label: 'Book Flights', sub: 'AED 2,100 deals', color: '#40C4AA', bg: '#E7FEF8' },
              { Icon: Car, label: 'Book Rides', sub: 'Careem Business', color: '#7C3AED', bg: '#F7F1FF' },
              { Icon: Palmtree, label: 'Vacations', sub: 'Group trips', color: '#EA580C', bg: '#FFF6E0' },
              { Icon: Gamepad2, label: 'Gaming', sub: 'FIFA, Padel, COD', color: '#DC2626', bg: '#FEEFF2' },
            ].map(({ Icon, label, sub, color, bg }) => (
              <Link key={label} href="/services"
                className="flex items-center gap-3 rounded-[16px] border border-[#DFE1E6] p-3 hover:shadow-md transition-all active:scale-[0.97]"
                style={{ backgroundColor: bg }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                  <Icon size={20} style={{ color }} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#15161E]">{label}</p>
                  <p className="text-[10px] font-medium" style={{ color }}>{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Exclusive Offers scroll ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#15161E]">Exclusive Offers</h3>
            <Link href="/offers" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollSnapType: 'x mandatory' }}>
            {relevantOffers.map(offer => (
              <div key={offer.id} className="shrink-0 w-48 bg-white rounded-[16px] border border-[#DFE1E6] overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
                <div className="relative h-24">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: offer.color }}>
                    {offer.company}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#15161E] line-clamp-1 mb-1">{offer.title}</p>
                  <p className="text-[11px] font-bold" style={{ color: offer.color }}>{offer.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Perks strip ── */}
        <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-[#EA580C]" strokeWidth={2} />
            <h3 className="text-sm font-bold text-[#15161E]">Perks & Wellness</h3>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { Icon: Dumbbell, label: 'Palms Sports', value: 'AED 150/mo', color: '#EA580C' },
              { Icon: Activity, label: 'Health', value: 'Free Annual', color: '#059669' },
              { Icon: UtensilsCrossed, label: 'Meals', value: '25% Off', color: '#DC2626' },
              { Icon: Car, label: 'EasyLease', value: 'AED 1,299', color: '#7C3AED' },
              { Icon: Coffee, label: 'Cafe', value: 'AED 500/mo', color: '#FFBD4C' },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} className="rounded-[12px] bg-[#F8F9FB] border border-[#DFE1E6] p-2 text-center">
                <div className="flex justify-center mb-0.5"><Icon size={18} style={{ color }} strokeWidth={1.8} /></div>
                <p className="text-[9px] font-bold text-[#15161E] leading-tight">{label}</p>
                <p className="text-[9px] font-semibold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Network ── */}
        <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#9D63F6]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#15161E]">Network</h3>
              <span className="text-[9px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{onlineColleagues.length} online</span>
            </div>
            <Link href="/chat" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {COLLEAGUES.map(col => (
              <Link key={col.id} href="/chat" className="shrink-0 flex flex-col items-center gap-1.5 w-16">
                <div className="relative">
                  <Avatar initials={col.avatar} color="#666D80" size="lg" image={col.image} />
                  {col.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <p className="text-[10px] font-semibold text-[#15161E] text-center leading-tight truncate w-full">{col.name.split(' ')[0]}</p>
                <p className="text-[9px] text-[#A4ABB8] truncate w-full text-center">{col.company.split(' ')[0]}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Weather ── */}
        <div className="flex items-center gap-2.5 bg-gradient-to-br from-[#9D63F6] to-[#2A5298] rounded-[16px] px-4 py-3 text-white">
          <Sun size={18} className="text-yellow-300 shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-blue-200">Abu Dhabi</p>
            <p className="text-sm font-bold">36°C</p>
          </div>
          <p className="text-[10px] text-blue-200 ml-auto">{new Date().toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>

        {/* ── IHC Stock Trading Card — Live ── */}
        <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-[#9D63F6] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white tracking-wide">IHC</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[14px] font-bold text-[#15161E] leading-tight">{sd.ticker} · ADX</p>
                    {sd.live && (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A4ABB8] mt-0.5">International Holding Co.</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {stockLoading && !stock ? (
                  <div className="h-5 w-20 bg-[#DFE1E6] rounded animate-pulse" />
                ) : (
                  <>
                    <p className="text-[16px] font-bold text-[#15161E] tabular-nums leading-tight">AED {sd.price.toFixed(2)}</p>
                    <div className={`inline-flex items-center gap-0.5 mt-1 text-[11px] font-semibold ${sd.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {sd.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {sd.change >= 0 ? '+' : ''}{sd.change.toFixed(2)} ({sd.changePct}%)
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-end gap-1.5">
              {sd.chartData.map((d, i) => {
                const prices = sd.chartData.map(x => x.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                const h = max === min ? 48 : ((d.price - min) / (max - min)) * 40 + 10;
                const isLast = i === sd.chartData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full rounded-[4px] transition-all duration-500" style={{ height: `${h}px`, background: isLast ? '#9D63F6' : '#DFE1E6' }} />
                    <span className="text-[8px] text-[#A4ABB8] font-medium mt-1.5 leading-none">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center border-t border-[#F8F9FB] px-4 py-3">
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#A4ABB8] font-semibold uppercase tracking-wide">Mkt Cap</p>
              <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{sd.marketCap}</p>
            </div>
            <div className="w-px h-6 bg-[#DFE1E6]" />
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#A4ABB8] font-semibold uppercase tracking-wide">Volume</p>
              <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{sd.volume}</p>
            </div>
            <div className="w-px h-6 bg-[#DFE1E6]" />
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#A4ABB8] font-semibold uppercase tracking-wide">52W Range</p>
              <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{sd.low52w}–{sd.high52w}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 px-4 pb-4 pt-1.5">
            <button className="flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-white bg-green-600 active:scale-[0.97] transition-all">
              <TrendingUp size={15} /> Buy
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-white bg-red-500 active:scale-[0.97] transition-all">
              <TrendingDown size={15} /> Sell
            </button>
          </div>
        </div>

        {/* ── Today's Schedule ── */}
        <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#9D63F6]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#15161E]">Today</h3>
            </div>
            <span className="text-[10px] text-[#A4ABB8] font-medium">{new Date().toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="space-y-2">
            {[
              { time: '10:00 AM', title: 'Team Standup', tag: 'Meeting', tagColor: '#9D63F6' },
              { time: '02:00 PM', title: 'Q2 Budget Review', tag: 'Finance', tagColor: '#FFBD4C' },
              { time: '04:30 PM', title: 'Gaming Tournament — FIFA', tag: 'Social', tagColor: '#DC2626' },
            ].map((evt, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#F8F9FB] rounded-[12px] px-3 py-2.5 border border-[#DFE1E6]">
                <div className="w-[48px] shrink-0">
                  <p className="text-[11px] font-bold text-[#15161E] tabular-nums">{evt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#15161E] truncate">{evt.title}</p>
                </div>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: evt.tagColor + '12', color: evt.tagColor }}>
                  {evt.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-[#7C3AED]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#15161E]">Recent</h3>
            </div>
            <span className="text-[10px] text-[#9D63F6] font-semibold">View all</span>
          </div>
          <div className="space-y-2">
            {[
              { icon: CheckCircle2, color: '#059669', text: 'Annual leave approved — Apr 15–17', time: '2h ago' },
              { icon: Gift, color: '#FFBD4C', text: 'New offer: 15% off Yas Island units', time: '5h ago' },
              { icon: Gamepad2, color: '#DC2626', text: 'FIFA Tournament — Round 2 starts today', time: '8h ago' },
              { icon: Plane, color: '#40C4AA', text: 'Flight deal: Abu Dhabi to London AED 2,100', time: '1d ago' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-[#F8F9FB] rounded-[12px] px-3 py-2.5 border border-[#DFE1E6]">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: n.color + '15' }}>
                  <n.icon size={14} style={{ color: n.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#15161E] leading-snug">{n.text}</p>
                  <p className="text-[10px] text-[#A4ABB8] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Announcements ── */}
        <div className="bg-white rounded-[18px] border border-[#DFE1E6] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#15161E]">Announcements</h3>
            <Link href="/announcements" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          {allAnns.map(ann => {
            const colors: Record<string, string> = {
              Financial: '#9D63F6', HR: '#7C3AED', Events: '#40C4AA',
              Compliance: '#DC2626', Offers: '#FFBD4C', Property: '#FFBD4C',
              Wellness: '#059669', Rewards: '#EA580C',
            };
            const color = colors[ann.category] || '#9D63F6';
            return (
              <div key={ann.id} className="flex items-start gap-3 py-2.5 border-b border-[#F8F9FB] last:border-0">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#15161E] leading-snug line-clamp-1">{ann.title}</p>
                  <p className="text-[10px] text-[#A4ABB8] mt-0.5">{ann.date} · {ann.tag}</p>
                </div>
                {ann.urgent && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full shrink-0">Urgent</span>}
              </div>
            );
          })}
        </div>

      </div>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </AppShell>
  );
}
