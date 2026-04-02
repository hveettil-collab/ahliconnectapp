'use client';
import { useState, useEffect } from 'react';
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
  CreditCard, MapPin, Palmtree, Menu, RefreshCw
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

/* ════════════════ HERO CAROUSEL ════════════════ */

interface HeroSlide {
  image: string;
  label: string;
  branded?: boolean;  // Show IHC logo + tagline centered
}

const HERO_SLIDES: HeroSlide[] = [
  { image: '/1.jpg', label: 'IHC group', branded: true },
  { image: '/2.jpg', label: 'news', branded: true },
  { image: '/3.jpg', label: 'community', branded: true },
  { image: '/4.jpg', label: 'partnerships', branded: true },
];

/* ════════════════ DASHBOARD ════════════════ */

export default function DashboardPage() {
  const { user } = useAuth();
  const greeting = useGreeting();
  const time = useLiveTime();
  const [heroIdx, setHeroIdx] = useState(0);
  const { stock, loading: stockLoading, refetch: refetchStock } = useStockPrice();
  const { unreadCount, togglePanel } = useNotifications();

  // Merge live stock data with fallback to MARKET_DATA
  const sd = stock ?? {
    ...MARKET_DATA,
    live: false,
    updatedAt: '',
    prevClose: MARKET_DATA.price - MARKET_DATA.change,
  };

  /* Auto-advance carousel every 4 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const company = COMPANIES.find(c => c.id === user.companyId);
  const companyAnns = COMPANY_ANNOUNCEMENTS[user.companyId] || [];
  const relevantOffers = OFFERS.filter(o => o.relevantFor.includes(user.companyId)).slice(0, 6);
  const allAnns = [...IHC_ANNOUNCEMENTS, ...companyAnns].slice(0, 3);
  const onlineColleagues = COLLEAGUES.filter(c => c.online);

  return (
    <AppShell title="Home" subtitle={time} hideTopBar>
      {/* ══════════════════════════════════════════
          IMMERSIVE HERO CAROUSEL
          Full-bleed, editorial, premium feel
          ══════════════════════════════════════════ */}
      <div className="relative mx-1.5 mt-1 rounded-[32px] overflow-hidden" style={{ height: 'clamp(212px, 32vh, 260px)' }}>

        {/* ── Carousel images with crossfade ── */}
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.label}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === heroIdx ? 1 : 0,
              transform: i === heroIdx ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 800ms ease-in-out, transform 2000ms ease-out',
            }}
          />
        ))}

        {/* ── Layered gradient overlay — lighter for branded slide ── */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: HERO_SLIDES[heroIdx].branded
              ? 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.15) 100%)',
          }}
        />

        {/* ── Vertical side label (like ADGM "lifestyle") ── */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
          <p
            className="text-[11px] font-bold tracking-[0.2em] uppercase pl-2 transition-colors duration-500"
            style={{
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              color: HERO_SLIDES[heroIdx].branded ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
            }}
          >
            {HERO_SLIDES[heroIdx].label}
          </p>
        </div>

        {/* ── Floating top controls ── */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-20">
          {/* Profile avatar */}
          <img
            src={user.image}
            alt={user.name}
            className="w-[48px] h-[48px] rounded-full object-cover shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{ border: '2.5px solid rgba(255,255,255,0.25)' }}
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {/* Notification bell */}
            <button onClick={togglePanel} className="relative">
              <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                style={{
                  background: 'rgba(244, 239, 232, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <Bell size={18} className="text-[#1A1A2E]" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-[#EF4444] flex items-center justify-center px-1 shadow-md">
                  <span className="text-[9px] font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ── Hero text content — bottom region (hidden on branded slide) ── */}
        <div
          className="absolute bottom-16 left-6 right-16 z-20 transition-opacity duration-500"
          style={{ opacity: HERO_SLIDES[heroIdx].branded ? 0 : 1 }}
        >
          <p className="text-white/50 text-[13px] font-medium tracking-wide mb-2">
            {greeting}
          </p>
          <h1
            className="text-white leading-[1.08] tracking-tight mb-3"
            style={{ fontSize: 'clamp(24px, 6vw, 28px)', fontWeight: 700 }}
          >
            Unwind &<br />Indulge
          </h1>
          <p className="text-white/55 text-[15px] leading-relaxed">
            Explore the{' '}
            <Link
              href="/offers"
              className="text-white font-medium underline underline-offset-[3px] decoration-white/50 hover:decoration-white transition-colors"
            >
              top shopping &amp; lifestyle offers.
            </Link>
          </p>
        </div>

        {/* ── Carousel indicators — bottom right ── */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="rounded-full transition-all duration-500 ease-out"
              style={{
                width: i === heroIdx ? 24 : 7,
                height: 7,
                background: i === heroIdx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Quick-access bento grid — below hero ── */}
      <div className="px-4 pt-3 pb-1">
        <div className="grid grid-cols-2 gap-2" style={{ gridTemplateRows: 'auto auto' }}>
          {/* Row 1, Col 1 */}
          <Link href="/services" className="bg-white rounded-[18px] border border-[#E8E2D9] p-3.5 flex flex-col items-start justify-between min-h-[88px] hover:shadow-md transition-all active:scale-[0.97]">
            <Sparkles size={22} className="text-[#1A1A2E]" strokeWidth={1.5} />
            <p className="text-[11px] font-semibold text-[#1A1A2E]">Ask AI</p>
          </Link>
          {/* Row 1, Col 2 */}
          <Link href="/offers" className="bg-white rounded-[18px] border border-[#E8E2D9] p-3.5 flex flex-col items-start justify-between min-h-[88px] hover:shadow-md transition-all active:scale-[0.97]">
            <Gift size={22} className="text-[#1A1A2E]" strokeWidth={1.5} />
            <p className="text-[11px] font-semibold text-[#1A1A2E]">Benefits</p>
          </Link>
          {/* Event card — moved below other items for mobile */}
          <Link href="/explore" className="bg-[#1A1A2E] rounded-[18px] p-3.5 flex flex-col items-start justify-between col-span-2 hover:shadow-lg transition-all active:scale-[0.97]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
            <div>
              <p className="text-[9px] text-white/40 font-medium">Event</p>
              <p className="text-[11px] font-bold text-white leading-snug mt-0.5">Sports Day Yas Island</p>
              <p className="text-[20px] font-bold text-white mt-2 leading-none">22 May</p>
              <p className="text-[9px] text-white/40 mt-1">Yas Sports Complex</p>
            </div>
          </Link>
          {/* Row 2, Col 1 */}
          <Link href="/explore" className="bg-[#E8F5E9] rounded-[18px] border border-[#E8E2D9] p-3.5 flex flex-col items-start justify-between min-h-[88px] hover:shadow-md transition-all active:scale-[0.97]">
            <Compass size={22} className="text-[#1A1A2E]" strokeWidth={1.5} />
            <p className="text-[11px] font-semibold text-[#1A1A2E]">Explore</p>
          </Link>
          {/* Row 2, Col 2 */}
          <Link href="/marketplace" className="bg-white rounded-[18px] border border-[#E8E2D9] p-3.5 flex flex-col items-start justify-between min-h-[88px] hover:shadow-md transition-all active:scale-[0.97]">
            <UtensilsCrossed size={22} className="text-[#1A1A2E]" strokeWidth={1.5} />
            <p className="text-[11px] font-semibold text-[#1A1A2E]">Market</p>
          </Link>
        </div>
      </div>

      {/* ── Rest of dashboard content ── */}
      <div className="px-4 space-y-3 pb-4">

        {/* ── Benefits Highlight ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Your Benefits</h3>
            <Link href="/offers" className="text-[11px] font-bold text-white bg-[#1A1A2E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#C8973A]/10 to-[#C8973A]/5 rounded-[18px] border border-[#C8973A]/20 p-4 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-red-50 flex items-center justify-center shrink-0">
                <Heart size={22} className="text-red-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#1A1A2E]">Medical Insurance</p>
                <p className="text-[11px] font-semibold text-[#C8973A]">Daman Enhanced · Family</p>
                <p className="text-[10px] text-[#9CA3AF]">Full coverage for you + dependents</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#C8973A]">AED 85K</p>
                <p className="text-[9px] text-[#9CA3AF]">Total value/yr</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: GraduationCap, color: '#C8973A', bg: '#FEF3C7', title: 'Education', value: 'AED 20K/yr' },
              { icon: Plane, color: '#0D9488', bg: '#D1FAE5', title: 'Flights', value: 'Return home' },
              { icon: Shield, color: '#7C3AED', bg: '#EDE9FE', title: 'Life Cover', value: '24× salary' },
            ].map(({ icon: Icon, color, bg, title, value }) => (
              <div key={title} className="rounded-[14px] p-3 bg-white border border-[#E8E2D9] text-center">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} strokeWidth={2} />
                </div>
                <p className="text-[11px] font-bold text-[#1A1A2E]">{title}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lifestyle & Travel ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Lifestyle & Travel</h3>
            <Link href="/explore" className="text-[11px] font-bold text-white bg-[#1A1A2E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '✈️', label: 'Book Flights', sub: 'AED 2,100 deals', color: '#0D9488', bg: 'from-teal-50 to-emerald-50' },
              { emoji: '🚗', label: 'Book Rides', sub: 'Careem Business', color: '#7C3AED', bg: 'from-violet-50 to-purple-50' },
              { emoji: '🏝️', label: 'Vacations', sub: 'Group trips', color: '#EA580C', bg: 'from-orange-50 to-amber-50' },
              { emoji: '🎮', label: 'Gaming', sub: 'FIFA, Padel, COD', color: '#DC2626', bg: 'from-red-50 to-rose-50' },
            ].map(({ emoji, label, sub, color, bg }) => (
              <Link key={label} href="/services"
                className={`flex items-center gap-3 bg-gradient-to-br ${bg} rounded-[16px] border border-[#E8E2D9] p-3 hover:shadow-md transition-all active:scale-[0.97]`}>
                <span className="text-2xl">{emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1A1A2E]">{label}</p>
                  <p className="text-[10px] font-medium" style={{ color }}>{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Exclusive Offers scroll ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-bold text-[#1A1A2E]">Exclusive Offers</h3>
            <Link href="/offers" className="text-[11px] font-bold text-white bg-[#1A1A2E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollSnapType: 'x mandatory' }}>
            {relevantOffers.map(offer => (
              <div key={offer.id} className="shrink-0 w-48 bg-white rounded-[16px] border border-[#E8E2D9] overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
                <div className="relative h-24">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: offer.color }}>
                    {offer.company}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#1A1A2E] line-clamp-1 mb-1">{offer.title}</p>
                  <p className="text-[11px] font-bold" style={{ color: offer.color }}>{offer.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Perks strip ── */}
        <div className="bg-white rounded-[18px] border border-[#E8E2D9] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-[#EA580C]" strokeWidth={2} />
            <h3 className="text-sm font-bold text-[#1A1A2E]">Perks & Wellness</h3>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { emoji: '🏋️', label: 'Palms Sports', value: 'AED 150/mo', color: '#EA580C' },
              { emoji: '🏥', label: 'Health', value: 'Free Annual', color: '#059669' },
              { emoji: '🍽️', label: 'Meals', value: '25% Off', color: '#DC2626' },
              { emoji: '🚗', label: 'EasyLease', value: 'AED 1,299', color: '#7C3AED' },
              { emoji: '☕', label: 'Café', value: 'AED 500/mo', color: '#C8973A' },
            ].map(({ emoji, label, value, color }) => (
              <div key={label} className="rounded-[12px] bg-[#F9F6F1] border border-[#E8E2D9] p-2 text-center">
                <span className="text-lg block mb-0.5">{emoji}</span>
                <p className="text-[9px] font-bold text-[#1A1A2E] leading-tight">{label}</p>
                <p className="text-[9px] font-semibold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Network ── */}
        <div className="bg-white rounded-[18px] border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#1B3A6B]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#1A1A2E]">Network</h3>
              <span className="text-[9px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{onlineColleagues.length} online</span>
            </div>
            <Link href="/chat" className="text-[11px] font-bold text-white bg-[#1A1A2E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {COLLEAGUES.map(col => (
              <Link key={col.id} href="/chat" className="shrink-0 flex flex-col items-center gap-1.5 w-16">
                <div className="relative">
                  <Avatar initials={col.avatar} color="#6B7280" size="lg" image={col.image} />
                  {col.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <p className="text-[10px] font-semibold text-[#1A1A2E] text-center leading-tight truncate w-full">{col.name.split(' ')[0]}</p>
                <p className="text-[9px] text-[#9CA3AF] truncate w-full text-center">{col.company.split(' ')[0]}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Weather ── */}
        <div className="flex items-center gap-2.5 bg-gradient-to-br from-[#1B3A6B] to-[#2A5298] rounded-[16px] px-4 py-3 text-white">
          <Sun size={18} className="text-yellow-300 shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-blue-200">Abu Dhabi</p>
            <p className="text-sm font-bold">36°C ☀️</p>
          </div>
          <p className="text-[10px] text-blue-200 ml-auto">{new Date().toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>

        {/* ── IHC Stock Trading Card — Live ── */}
        <div className="bg-white rounded-[20px] border border-[#E8E2D9] overflow-hidden">
          {/* Stock header */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-[#1B3A6B] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white tracking-wide">IHC</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[14px] font-bold text-[#1A1A2E] leading-tight">{sd.ticker} · ADX</p>
                    {sd.live && (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">International Holding Co.</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {stockLoading && !stock ? (
                  <div className="h-5 w-20 bg-[#E8E2D9] rounded animate-pulse" />
                ) : (
                  <>
                    <p className="text-[16px] font-bold text-[#1A1A2E] tabular-nums leading-tight">AED {sd.price.toFixed(2)}</p>
                    <div className={`inline-flex items-center gap-0.5 mt-1 text-[11px] font-semibold ${sd.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {sd.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {sd.change >= 0 ? '+' : ''}{sd.change.toFixed(2)} ({sd.changePct}%)
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Mini chart — bars sit on a baseline with labels below */}
            <div className="flex items-end gap-1.5">
              {sd.chartData.map((d, i) => {
                const prices = sd.chartData.map(x => x.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                const h = max === min ? 48 : ((d.price - min) / (max - min)) * 40 + 10;
                const isLast = i === sd.chartData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full rounded-[4px] transition-all duration-500" style={{ height: `${h}px`, background: isLast ? '#1B3A6B' : '#E8E2D9' }} />
                    <span className="text-[8px] text-[#9CA3AF] font-medium mt-1.5 leading-none">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Stats row */}
          <div className="flex items-center border-t border-[#F4EFE8] px-4 py-3">
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Mkt Cap</p>
              <p className="text-[12px] font-bold text-[#1A1A2E] mt-0.5">{sd.marketCap}</p>
            </div>
            <div className="w-px h-6 bg-[#E8E2D9]" />
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Volume</p>
              <p className="text-[12px] font-bold text-[#1A1A2E] mt-0.5">{sd.volume}</p>
            </div>
            <div className="w-px h-6 bg-[#E8E2D9]" />
            <div className="flex-1 text-center">
              <p className="text-[9px] text-[#9CA3AF] font-semibold uppercase tracking-wide">52W Range</p>
              <p className="text-[12px] font-bold text-[#1A1A2E] mt-0.5">{sd.low52w}–{sd.high52w}</p>
            </div>
          </div>
          {/* Trade buttons */}
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
        <div className="bg-white rounded-[18px] border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#1B3A6B]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#1A1A2E]">Today</h3>
            </div>
            <span className="text-[10px] text-[#9CA3AF] font-medium">{new Date().toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="space-y-2">
            {[
              { time: '10:00 AM', title: 'Team Standup', tag: 'Meeting', tagColor: '#1B3A6B' },
              { time: '02:00 PM', title: 'Q2 Budget Review', tag: 'Finance', tagColor: '#C8973A' },
              { time: '04:30 PM', title: 'Gaming Tournament — FIFA', tag: 'Social', tagColor: '#DC2626' },
            ].map((evt, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#F9F6F1] rounded-[12px] px-3 py-2.5 border border-[#E8E2D9]">
                <div className="w-[48px] shrink-0">
                  <p className="text-[11px] font-bold text-[#1A1A2E] tabular-nums">{evt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A2E] truncate">{evt.title}</p>
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
        <div className="bg-white rounded-[18px] border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-[#7C3AED]" strokeWidth={2} />
              <h3 className="text-sm font-bold text-[#1A1A2E]">Recent</h3>
            </div>
            <span className="text-[10px] text-[#1B3A6B] font-semibold">View all</span>
          </div>
          <div className="space-y-2">
            {[
              { icon: CheckCircle2, color: '#059669', text: 'Annual leave approved — Apr 15–17', time: '2h ago' },
              { icon: Gift, color: '#C8973A', text: 'New offer: 15% off Yas Island units', time: '5h ago' },
              { icon: Gamepad2, color: '#DC2626', text: 'FIFA Tournament — Round 2 starts today', time: '8h ago' },
              { icon: Plane, color: '#0D9488', text: 'Flight deal: Abu Dhabi → London AED 2,100', time: '1d ago' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-[#F9F6F1] rounded-[12px] px-3 py-2.5 border border-[#E8E2D9]">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: n.color + '15' }}>
                  <n.icon size={14} style={{ color: n.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#1A1A2E] leading-snug">{n.text}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Announcements ── */}
        <div className="bg-white rounded-[18px] border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Announcements</h3>
            <Link href="/announcements" className="text-[11px] font-bold text-white bg-[#1A1A2E] px-3 py-1.5 rounded-full">
              See more
            </Link>
          </div>
          {allAnns.map(ann => {
            const colors: Record<string, string> = {
              Financial: '#1B3A6B', HR: '#7C3AED', Events: '#0D9488',
              Compliance: '#DC2626', Offers: '#C8973A', Property: '#B8962E',
              Wellness: '#059669', Rewards: '#EA580C',
            };
            const color = colors[ann.category] || '#1B3A6B';
            return (
              <div key={ann.id} className="flex items-start gap-3 py-2.5 border-b border-[#F4EFE8] last:border-0">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A2E] leading-snug line-clamp-1">{ann.title}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{ann.date} · {ann.tag}</p>
                </div>
                {ann.urgent && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full shrink-0">Urgent</span>}
              </div>
            );
          })}
        </div>

      </div>
    </AppShell>
  );
}
