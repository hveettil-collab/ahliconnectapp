'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import AppShell from '@/components/layout/AppShell';
import {
  IHC_ANNOUNCEMENTS, COMPANY_ANNOUNCEMENTS, OFFERS,
  MARKET_DATA, COMPANIES, COLLEAGUES
} from '@/lib/mockData';
import {
  ArrowRight, TrendingUp, TrendingDown,
  Calendar, Bell, Sparkles, Sun,
  Compass, Heart, Shield, GraduationCap, Gift, Zap,
  Plane, Users, UtensilsCrossed,
  Timer, Receipt, Award, X, ExternalLink,
  CreditCard, Building2, Briefcase, Wallet, Star, ChevronRight, MapPin, Footprints,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import { useStockPrice } from '@/hooks/useStockPrice';
import { useNotifications } from '@/context/NotificationContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const wallet = useWallet();
  const router = useRouter();
  const greeting = useGreeting();
  const time = useLiveTime();
  const { stock, loading: stockLoading } = useStockPrice();
  const { unreadCount, togglePanel } = useNotifications();
  const [mounted, setMounted] = useState(false);

  const [showStockAction, setShowStockAction] = useState<'buy' | 'sell' | null>(null);
  const [stockShares, setStockShares] = useState('');
  const [stockConfirmed, setStockConfirmed] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState<number | null>(null);
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  const hoursSaved = useCountUp(347, 2000, 600);
  const employees = useCountUp(45, 2000, 800);
  const benefitsVal = useCountUp(85, 2000, 1000);

  useEffect(() => { setMounted(true); }, []);

  /* Show "use mobile" modal only on desktop screens — cannot be dismissed */
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) setShowDesktopModal(true);
  }, []);

  const sd = stock ?? {
    ...MARKET_DATA, live: false, updatedAt: '',
    prevClose: MARKET_DATA.price - MARKET_DATA.change,
  };

  if (!user) return null;

  const company = COMPANIES.find(c => c.id === user.companyId);
  const relevantOffers = OFFERS.filter(o => o.relevantFor.includes(user.companyId)).slice(0, 6);
  const onlineColleagues = COLLEAGUES.filter(c => c.online);

  return (
    <AppShell title="Home" subtitle={time} hideTopBar>

      {/* ══════════════════════════════════════════
          DESKTOP MODAL — Scan QR for mobile experience
          ══════════════════════════════════════════ */}
      {showDesktopModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded-[28px] shadow-2xl max-w-[420px] w-full mx-4 overflow-hidden"
            style={{ animation: 'card-pop 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Top gradient accent */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #9D63F6 0%, #7C3AED 50%, #40C4AA 100%)' }} />

            <div className="px-8 pt-8 pb-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #F3EEFF, #E8DBFE)' }}>
                <Sparkles size={28} className="text-[#9D63F6]" strokeWidth={1.8} />
              </div>

              <h2 className="text-[22px] font-bold text-[#15161E] leading-tight mb-2">
                Best on Mobile
              </h2>
              <p className="text-[14px] text-[#666D80] leading-relaxed mb-6">
                Ahli Connect is designed for mobile. Scan the QR code below to open it on your phone for the best experience.
              </p>

              {/* QR Code */}
              <div className="bg-[#F8F9FB] rounded-[20px] p-5 border border-[#DFE1E6] mb-5">
                <img src="/qr-mobile.png" alt="Scan to open on mobile" className="w-[180px] h-[180px] mx-auto" />
              </div>

              <p className="text-[11px] text-[#A4ABB8]">
                Or open <span className="font-semibold text-[#9D63F6]">ahliconnectapp.vercel.app</span> on your mobile browser
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          HERO — Immersive gradient with greeting
          ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 52vh, 420px)' }}>
        {/* Animated mesh gradient background — smooth violet to white */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #9D63F6 0%, #B07AF8 25%, #C9A4FB 45%, #E2CBF9 60%, #F0E0FC 72%, #F8F9FB 88%)',
        }}>
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-20" style={{
            background: 'radial-gradient(circle, rgba(235,195,127,0.8) 0%, rgba(255,189,76,0) 70%)',
            top: '-80px', right: '-60px',
            animation: 'float 8s ease-in-out infinite',
          }} />
          <div className="absolute w-[250px] h-[250px] rounded-full opacity-15" style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
            top: '10%', left: '-30px',
            animation: 'float 6s ease-in-out infinite reverse',
          }} />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Top bar */}
        <div className="relative z-20 px-5 pt-5">
          {/* Row 1: Avatar + Name + Bell */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user.image}
                alt={user.name}
                className="w-[48px] h-[48px] rounded-full object-cover shrink-0"
                style={{
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                }}
              />
              <div className="min-w-0">
                <p className="text-white/60 text-[11px] font-medium tracking-wide">{greeting}</p>
                <p className="text-white text-[16px] font-bold leading-tight truncate">{user.name.split(' ')[0]}</p>
              </div>
            </div>
            {/* Notification Bell */}
            <button onClick={togglePanel} className="relative shrink-0 ml-3">
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
          {/* Row 2: Steps + Points badges */}
          <div className="flex items-center gap-2 mt-3">
            <Link href="/steps" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <Footprints size={13} className="text-[#40C4AA]" />
              <span className="text-[12px] font-bold text-white">7,432</span>
            </Link>
            <Link href="/offers" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <Star size={14} className="text-[#FFBD4C]" fill="#FFBD4C" strokeWidth={0} />
              <span className="text-[12px] font-bold text-white">2,450</span>
              <span className="text-[9px] text-white/50 font-medium">pts</span>
            </Link>
          </div>
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
            <span style={{ color: '#000000' }}>supercharged.</span>
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-[14px] mt-2 leading-relaxed max-w-[280px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}>
            AI-powered benefits, automations & perks for {company?.name || 'IHC Group'}
          </p>
        </div>

        {/* USP Stats Strip */}
        <div className="relative z-20 flex items-center gap-3 px-5 mt-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}>
          {[
            { value: `${hoursSaved}`, suffix: 'hrs', label: 'Saved weekly', icon: Timer },
            { value: `${employees}K`, suffix: '+', label: 'Employees', icon: Users },
            { value: `${benefitsVal}K`, suffix: '+', label: 'Benefits AED', icon: Award },
          ].map(({ value, suffix, label, icon: Icon }) => (
            <div key={label} className="flex-1 bg-white rounded-[32px] py-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Icon size={13} className="text-black/40" strokeWidth={2} />
                <p className="text-black text-[20px] font-bold tabular-nums leading-none">
                  {value}<span className="text-black/55 text-[12px]">{suffix}</span>
                </p>
              </div>
              <p className="text-black text-[10px] font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* AI Assistant CTA */}
        <div className="relative z-20 px-5 mt-5 pb-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
          }}>
          <Link href="/services" className="block">
            <div className="relative rounded-[20px] overflow-hidden" style={{
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(157,99,246,0.2)',
              boxShadow: '0 2px 16px rgba(157,99,246,0.08)',
            }}>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
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
                  <p className="text-[#15161E] text-[14px] font-bold">Ask AI anything</p>
                  <p className="text-[#666D80] text-[12px] mt-0.5">Salary certs, leaves, expenses — instant</p>
                </div>
                <ArrowRight size={18} className="text-[#9D63F6] shrink-0" />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#F8F9FB] rounded-t-[24px]" />
      </div>

      {/* ═══════════════════════════════════════
          SMART AUTOMATIONS — 1×3 Bento Grid
          ═══════════════════════════════════════ */}
      <div className="px-4 -mt-1 pb-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#FFBD4C]" strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-[#15161E]">Smart Automations</h3>
          </div>
          <span className="text-[10px] font-semibold text-[#9D63F6] bg-[#9D63F6]/8 px-2.5 py-1 rounded-full">AI-Powered</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            {
              title: 'Salary Certificate',
              lottie: '/lottie-salary-v3.lottie',
              gradient: 'linear-gradient(135deg, #F3EEFF 0%, #E8DBFE 50%, #D4BFFC 100%)',
              stat: '<30s',
              statLabel: 'avg. time',
              accent: '#9D63F6',
              href: '/automations/salary-certificate',
            },
            {
              title: 'Smart Leave',
              lottie: '/lottie-leave-v4.lottie',
              gradient: 'linear-gradient(135deg, #E7FEF8 0%, #C6F7E9 50%, #A7F0DA 100%)',
              stat: '1-tap',
              statLabel: 'approval',
              accent: '#40C4AA',
              href: '/automations/leave-request',
            },
            {
              title: 'ExpenseClaim',
              lottie: '/lottie-expense-v2.lottie',
              gradient: 'linear-gradient(135deg, #FFF8EB 0%, #FFEFC7 50%, #FFE4A0 100%)',
              stat: '98%',
              statLabel: 'accuracy',
              accent: '#FFBD4C',
              href: '/automations/expense-claim',
            },
          ].map((card, i) => (
              <Link key={card.title} href={card.href}
                className="block rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white hover:shadow-lg transition-all active:scale-[0.96]"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.9 + i * 0.12}s`,
                }}>
                {/* Visual — Lottie animation on gradient */}
                <div className="w-full flex flex-col items-center pt-4 pb-2 overflow-hidden" style={{ background: card.gradient }}>
                  <div className="w-[56px] h-[56px] mb-2">
                    <DotLottieReact src={card.lottie} loop autoplay style={{ width: '100%', height: '100%' }} />
                  </div>
                  <p className="text-[11px] font-bold leading-none text-center" style={{ color: card.accent }}>{card.title}</p>
                </div>
                {/* Stat */}
                <div className="px-2.5 py-2 bg-white">
                  <p className="text-[15px] font-bold leading-none" style={{ color: card.accent }}>{card.stat}</p>
                  <p className="text-[9px] text-[#A4ABB8] mt-0.5">{card.statLabel}</p>
                </div>
              </Link>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          QUICK ACCESS BENTO
          ═══════════════════════════════════════ */}
      <div className="px-4 pt-4 pb-1">
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
          <div className="relative bg-[#1E2030] rounded-[20px] p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E2030 0%, #2A2D45 50%, #1E2030 100%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
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
              <div className="w-[90px] h-[90px] shrink-0 -mr-1">
                <DotLottieReact src="/lottie-ai-assistant.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>
        </Link>

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
              <button key={offer.id} onClick={() => router.push('/offers')} className="shrink-0 w-48 bg-white rounded-[16px] border border-[#DFE1E6] overflow-hidden text-left active:scale-[0.97] transition-all hover:shadow-md" style={{ scrollSnapAlign: 'start' }}>
                <div className="relative h-24">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: offer.color }}>
                    {offer.company}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#15161E] line-clamp-1 mb-1">{offer.title}</p>
                  <p className="text-[11px] font-bold" style={{ color: offer.color }}>{offer.value}</p>
                </div>
              </button>
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
            <Link href="/people-map" className="text-[11px] font-bold text-white bg-[#15161E] px-3 py-1.5 rounded-full">
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
          {/* People Map CTA */}
          <Link href="/people-map" className="mt-3 flex items-center gap-3 p-3 rounded-[14px] bg-[#F5F0FF] border border-[#E9DEFF] active:scale-[0.98] transition-all">
            <div className="w-9 h-9 rounded-[10px] bg-[#9D63F6]/15 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-[#9D63F6]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#15161E]">People Map</p>
              <p className="text-[10px] text-[#666D80]">See nearby IHC colleagues on the map</p>
            </div>
            <ChevronRight size={14} className="text-[#9D63F6] shrink-0" />
          </Link>
        </div>

        {/* ── Community Quick Widget ── */}
        <Link href="/community" className="no-underline block">
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden active:scale-[0.98] transition-transform">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: '#9D63F6' + '12' }}>
                    <Users size={18} style={{ color: '#9D63F6' }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#15161E]">My Communities</p>
                    <p className="text-[10px] text-[#A4ABB8]">3 active · 20 new posts today</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#A4ABB8]" />
              </div>
              <div className="flex gap-2">
                {[
                  { name: 'IHC Group', color: '#1B3A6B', unread: 12, image: '/logos/ihc.svg' },
                  { name: 'Shory', color: '#0D9488', unread: 5, image: '/logos/shory.svg' },
                  { name: 'Palms Sports', color: '#EA580C', unread: 3, image: '/logos/palms-sports.svg' },
                ].map(c => (
                  <div key={c.name} className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-[12px] border border-[#DFE1E6]">
                    <div className="w-7 h-7 rounded-[8px] overflow-hidden shrink-0">
                      <img src={c.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#15161E] truncate">{c.name}</p>
                      {c.unread > 0 && <p className="text-[8px] font-semibold" style={{ color: '#DF1C41' }}>{c.unread} new</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>

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
            <button onClick={() => { setShowStockAction('buy'); setStockShares(''); setStockConfirmed(false); }} className="flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-white bg-green-600 active:scale-[0.97] transition-all">
              <TrendingUp size={15} /> Buy
            </button>
            <button onClick={() => { setShowStockAction('sell'); setStockShares(''); setStockConfirmed(false); }} className="flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-white bg-red-500 active:scale-[0.97] transition-all">
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
            <div className="flex items-center gap-2">
              <Sun size={13} className="text-yellow-500" />
              <span className="text-[10px] text-[#A4ABB8] font-medium">36°C · {new Date().toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { time: '10:00 AM', title: 'Team Standup', tag: 'Meeting', tagColor: '#9D63F6', location: 'Conference Room 3A', attendees: 'Ahmed, Maryam, Faris, +4 others', duration: '30 min' },
              { time: '02:00 PM', title: 'Q2 Budget Review', tag: 'Finance', tagColor: '#FFBD4C', location: 'Board Room · Tower B', attendees: 'Finance Team', duration: '1 hour' },
              { time: '04:30 PM', title: 'Gaming Tournament — FIFA', tag: 'Social', tagColor: '#DC2626', location: 'IHC Lounge · Ground Floor', attendees: '32 registered players', duration: '2 hours' },
            ].map((evt, i) => (
              <button key={i} onClick={() => setShowEventDetail(showEventDetail === i ? null : i)} className="w-full text-left">
                <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-[12px] px-3 py-2.5 border border-[#DFE1E6] active:scale-[0.98] transition-all">
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
                {showEventDetail === i && (
                  <div className="mt-1 mb-1.5 px-3 py-2.5 rounded-[12px] bg-white border border-[#DFE1E6] space-y-1.5" style={{ animation: 'fadeSlideDown 0.2s ease-out' }}>
                    <div className="flex items-center gap-2 text-[11px] text-[#666D80]">
                      <Building2 size={11} className="text-[#A4ABB8]" /> {evt.location}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#666D80]">
                      <Users size={11} className="text-[#A4ABB8]" /> {evt.attendees}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#666D80]">
                      <Timer size={11} className="text-[#A4ABB8]" /> {evt.duration}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════
          STOCK TRADE BOTTOM SHEET
          ═══════════════════════════════════════ */}
      {showStockAction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setShowStockAction(null)}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-5 shadow-2xl relative" onClick={e => e.stopPropagation()} style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-4" />
            <button onClick={() => { setShowStockAction(null); setStockConfirmed(false); setStockShares(''); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            {!stockConfirmed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: showStockAction === 'buy' ? '#05966915' : '#DC262615' }}>
                    {showStockAction === 'buy' ? <TrendingUp size={18} className="text-green-600" /> : <TrendingDown size={18} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#15161E]">{showStockAction === 'buy' ? 'Buy' : 'Sell'} IHC Shares</p>
                    <p className="text-[12px] text-[#A4ABB8]">ADX · AED {sd.price.toFixed(2)} per share</p>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Number of Shares</label>
                  <input type="number" value={stockShares} onChange={e => setStockShares(e.target.value)} placeholder="e.g. 100"
                    className="w-full mt-2 bg-white border-2 border-[#DFE1E6] rounded-[14px] px-4 py-3 text-[16px] font-bold text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#9D63F6] transition-colors text-center" />
                </div>
                {stockShares && parseInt(stockShares) > 0 && (
                  <div className="p-3 rounded-[14px] bg-[#F8F9FB] space-y-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#666D80]">{stockShares} shares × AED {sd.price.toFixed(2)}</span>
                      <span className="font-bold text-[#15161E]">AED {(parseInt(stockShares) * sd.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#666D80]">Brokerage (0.15%)</span>
                      <span className="font-bold text-[#15161E]">AED {(parseInt(stockShares) * sd.price * 0.0015).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#DFE1E6] pt-2 flex justify-between text-[14px] font-extrabold">
                      <span>Total</span>
                      <span style={{ color: showStockAction === 'buy' ? '#059669' : '#DC2626' }}>AED {(parseInt(stockShares) * sd.price * 1.0015).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { if (stockShares && parseInt(stockShares) > 0) setStockConfirmed(true); }}
                  className="w-full py-3.5 rounded-[14px] text-[14px] font-bold text-white active:scale-[0.97] transition-all"
                  style={{ background: stockShares && parseInt(stockShares) > 0 ? (showStockAction === 'buy' ? '#059669' : '#DC2626') : '#DFE1E6', boxShadow: stockShares && parseInt(stockShares) > 0 ? '0 4px 16px rgba(0,0,0,0.15)' : 'none' }}>
                  {showStockAction === 'buy' ? 'Buy' : 'Sell'} {stockShares || '0'} Shares
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: showStockAction === 'buy' ? '#F0FDF4' : '#FEF2F2' }}>
                  {showStockAction === 'buy' ? <TrendingUp size={30} className="text-green-600" /> : <TrendingDown size={30} className="text-red-500" />}
                </div>
                <p className="text-[18px] font-bold text-[#15161E]">Order Placed!</p>
                <p className="text-[13px] text-[#666D80]">{showStockAction === 'buy' ? 'Buy' : 'Sell'} order for {stockShares} IHC shares at AED {sd.price.toFixed(2)}</p>
                <p className="text-[11px] text-[#A4ABB8]">Order #ADX-{Math.floor(Math.random() * 900000 + 100000)} · Pending execution</p>
                <button onClick={() => setShowStockAction(null)} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-[0.97] transition-all">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Float animation keyframes */}
    </AppShell>
  );
}
