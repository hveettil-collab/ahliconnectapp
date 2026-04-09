'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useModalHistory } from '@/hooks/useModalHistory';
import AppShell from '@/components/layout/AppShell';
import {
  IHC_ANNOUNCEMENTS, COMPANY_ANNOUNCEMENTS, OFFERS, CORPORATE_NEWS,
  MARKET_DATA, COMPANIES, COLLEAGUES
} from '@/lib/mockData';
import {
  ArrowRight, TrendingUp, TrendingDown,
  Calendar, Bell, Sparkles, Sun,
  Compass, Heart, Shield, GraduationCap, Gift, Zap,
  Plane, Users, UtensilsCrossed,
  Timer, Receipt, Award, X, ExternalLink,
  CreditCard, Building2, Briefcase, Wallet, Star, ChevronRight, MapPin, Footprints,
  Clock, Newspaper, MessageCircle, Tag, Play,
  ArrowLeft, CheckCircle2, Trophy, Dumbbell, Send, UserPlus, Share2, Search, Flame,
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

/* ════════════════ THE LATEST — CAROUSEL ════════════════ */

interface OfferItem { id: string; title: string; image: string; company: string; color: string; value: string; }

function LatestCarousel({ offers, onSlideClick }: { offers: OfferItem[]; onSlideClick: (slide: 'sports' | 'news' | 'offers' | 'dining') => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const TOTAL_SLIDES = 4;
  const AUTO_INTERVAL = 5000;

  const goTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    el.scrollTo({ left: idx * w, behavior: 'smooth' });
    setActiveSlide(idx);
  }, []);

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % TOTAL_SLIDES;
        const el = scrollRef.current;
        if (el) el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
        return next;
      });
    }, AUTO_INTERVAL);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, []);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % TOTAL_SLIDES;
        const el = scrollRef.current;
        if (el) el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
        return next;
      });
    }, AUTO_INTERVAL);
  }, []);

  // Sync active dot on manual scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const idx = Math.round(el.scrollLeft / w);
    if (idx !== activeSlide && idx >= 0 && idx < TOTAL_SLIDES) {
      setActiveSlide(idx);
      resetAutoPlay();
    }
  }, [activeSlide, resetAutoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const next = diff > 0 ? Math.min(activeSlide + 1, TOTAL_SLIDES - 1) : Math.max(activeSlide - 1, 0);
      goTo(next);
      resetAutoPlay();
    }
  };

  const news = CORPORATE_NEWS[0];
  const topOffers = offers.slice(0, 3);
  const SLIDE_LABELS = ['Events', 'News', 'Offers', 'Trending'];

  return (
    <div>
      {/* Header + dots */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-extrabold text-[#15161E]">The Latest</h3>
        <div className="flex items-center gap-1.5">
          {SLIDE_LABELS.map((label, i) => (
            <button key={label} onClick={() => { goTo(i); resetAutoPlay(); }}
              className="transition-all duration-300"
              style={{
                width: activeSlide === i ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: activeSlide === i ? '#9D63F6' : '#DFE1E6',
              }}
            />
          ))}
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* ── Slide 1: Upcoming Event ── */}
        <div className="shrink-0 w-full pr-2" style={{ scrollSnapAlign: 'start' }}>
          <button onClick={() => onSlideClick('sports')} className="block w-full text-left">
            <div className="relative rounded-[20px] overflow-hidden" style={{ height: 240 }}>
              <img src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop" alt="Sports Day"
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Yas Island</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Sports</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(64,196,170,0.2)', backdropFilter: 'blur(8px)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#40C4AA] animate-pulse" />
                <span className="text-[9px] font-bold text-[#40C4AA]">Upcoming</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-white/60">
                    <Calendar size={10} />
                    <span className="text-[10px] font-medium">22 May 2026</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <MapPin size={10} />
                    <span className="text-[10px] font-medium">Yas Sports Complex</span>
                  </div>
                </div>
                <p className="text-[17px] font-extrabold text-white leading-tight">IHC Group Sports Day</p>
              </div>
            </div>
          </button>
        </div>

        {/* ── Slide 2: Corporate Announcements ── */}
        <div className="shrink-0 w-full pr-2" style={{ scrollSnapAlign: 'start' }}>
          <button onClick={() => onSlideClick('news')} className="block w-full text-left">
            <div className="relative rounded-[20px] overflow-hidden" style={{ height: 240 }}>
              <img src={news.image} alt={news.title}
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
              {/* Tags */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {news.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>{tag}</span>
                ))}
              </div>
              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">{news.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <Calendar size={10} />
                    <span className="text-[10px] font-medium">{news.date}</span>
                  </div>
                </div>
                <p className="text-[16px] font-extrabold text-white leading-tight line-clamp-2">{news.title}</p>
              </div>
            </div>
          </button>
        </div>

        {/* ── Slide 3: Offers ── */}
        <div className="shrink-0 w-full pr-2" style={{ scrollSnapAlign: 'start' }}>
          <button onClick={() => onSlideClick('offers')} className="block w-full text-left">
            <div className="relative rounded-[20px] overflow-hidden" style={{ height: 240 }}>
              <img src={topOffers[0]?.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop'} alt="Offers"
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
              {/* Tags */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Exclusive</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Offers</span>
              </div>
              {/* Count badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,189,76,0.2)', backdropFilter: 'blur(8px)' }}>
                <Tag size={10} className="text-[#FFBD4C]" />
                <span className="text-[9px] font-bold text-[#FFBD4C]">{offers.length} deals</span>
              </div>
              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {topOffers.slice(0, 3).map(o => (
                    <span key={o.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: o.color + 'CC' }}>{o.company}</span>
                  ))}
                </div>
                <p className="text-[17px] font-extrabold text-white leading-tight">Exclusive Employee Perks</p>
                <p className="text-[11px] text-white/60 mt-0.5">Special deals from {topOffers[0]?.company || 'partners'} & more</p>
              </div>
            </div>
          </button>
        </div>

        {/* ── Slide 4: Trending Deal ── */}
        <div className="shrink-0 w-full" style={{ scrollSnapAlign: 'start' }}>
          <button onClick={() => onSlideClick('dining')} className="block w-full text-left">
            <div className="relative rounded-[20px] overflow-hidden" style={{ height: 240 }}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop" alt="Dining"
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Trending</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>Dining</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,189,76,0.2)', backdropFilter: 'blur(8px)' }}>
                <UtensilsCrossed size={10} className="text-[#FFBD4C]" />
                <span className="text-[9px] font-bold text-[#FFBD4C]">25% off</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: 'rgba(255,189,76,0.7)' }}>Zuma</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: 'rgba(255,189,76,0.7)' }}>Nobu</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: 'rgba(255,189,76,0.7)' }}>+38 more</span>
                </div>
                <p className="text-[17px] font-extrabold text-white leading-tight">Dining at 40+ Restaurants</p>
                <p className="text-[11px] text-white/60 mt-0.5">Exclusive IHC employee rates · 8.2K redeemed</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Slide label */}
      <div className="flex items-center justify-center mt-2">
        <span className="text-[10px] font-semibold text-[#A4ABB8]">{SLIDE_LABELS[activeSlide]}</span>
      </div>
    </div>
  );
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

  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const [showStockAction, setShowStockAction] = useState<'buy' | 'sell' | null>(null);
  const [stockShares, setStockShares] = useState('');
  const [stockConfirmed, setStockConfirmed] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState<number | null>(null);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showCarouselDetail, setShowCarouselDetail] = useState<'sports' | 'news' | 'offers' | 'dining' | null>(null);
  const [carouselRegistered, setCarouselRegistered] = useState(false);

  useBodyScrollLock(!!showStockAction || showEventDetail !== null || showDesktopModal || !!showCarouselDetail);

  // History integration for iOS/Android back on modals
  const closeCarouselDetail = useModalHistory(!!showCarouselDetail, () => { setShowCarouselDetail(null); setCarouselRegistered(false); }, 'dashboard-carousel');

  const hoursSaved = useCountUp(347, 2000, 600);
  const employees = useCountUp(45, 2000, 800);
  const benefitsVal = useCountUp(85, 2000, 1000);

  useEffect(() => { setMounted(true); }, []);

  /* Splash screen — show for 5 seconds then fade out */
  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 4500);
    const hideTimer = setTimeout(() => setShowSplash(false), 5200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

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
  const topNews = CORPORATE_NEWS[0];
  const topOffers = relevantOffers.slice(0, 3);

  /* ═══ SPLASH SCREEN ═══ */
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: '#000000',
          opacity: splashFading ? 0 : 1,
          transition: 'opacity 0.7s ease-out',
        }}>

        {/* Content centered */}
        <div className="relative z-10 flex flex-col items-center gap-8"
          style={{
            opacity: splashFading ? 0 : 1,
            transform: splashFading ? 'scale(0.97)' : 'scale(1)',
            transition: 'all 0.5s ease-out',
          }}>

          {/* Ahli Connect logo — globe + text */}
          <div className="flex items-center gap-3" style={{ animation: 'splash-logo-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            {/* Globe SVG — red dotted sphere */}
            <div className="relative shrink-0">
              {/* Animated gradient glow behind globe */}
              <div className="absolute -inset-4 overflow-hidden rounded-full" style={{ filter: 'blur(20px)', opacity: 0.4 }}>
                <div style={{
                  position: 'absolute',
                  inset: '-100%',
                  width: '300%',
                  height: '300%',
                  background: 'conic-gradient(from 0deg at 50% 50%, #8B1A1A 0deg, #C62828 60deg, #2E7D32 120deg, #1B5E20 180deg, #C62828 240deg, #8B1A1A 300deg, #8B1A1A 360deg)',
                  animation: 'splash-gradient-spin 4s linear infinite',
                }} />
              </div>
              <svg className="relative z-10" width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#splash-clip)">
                  <path d="M16.6398 16.0953C16.6398 15.153 17.3821 14.3896 18.2982 14.3896C19.2144 14.3896 19.9567 15.153 19.9567 16.0953C19.9567 17.0375 19.2144 17.8009 18.2982 17.8009C17.3821 17.8009 16.6398 17.0375 16.6398 16.0953ZM27.5312 16.0873C27.5312 15.4878 27.2125 14.9708 26.7433 14.6888C26.3454 14.9834 26.0834 15.4614 26.0834 16.0047C26.0834 16.6042 26.4022 17.1212 26.8714 17.4032C27.2693 17.1086 27.5312 16.6306 27.5312 16.0873ZM23.2647 17.7585C23.9145 17.4937 24.3748 16.8449 24.3748 16.0827C24.3748 15.2115 23.7752 14.4859 22.9783 14.3151C22.3285 14.5799 21.867 15.2287 21.867 15.991C21.867 16.8621 22.4667 17.5877 23.2636 17.7585H23.2647ZM24.6858 21.5022C25.4448 21.3463 26.0177 20.6574 26.0177 19.8298C26.0177 19.3369 25.8115 18.8968 25.4871 18.585C24.7281 18.7409 24.1552 19.4298 24.1552 20.2574C24.1552 20.7503 24.3614 21.1905 24.6858 21.5022ZM22.1635 20.0476C22.1635 19.5742 21.983 19.1478 21.6932 18.8257C21.4926 18.7432 21.2741 18.695 21.0445 18.695C20.0748 18.695 19.288 19.5043 19.288 20.5015C19.288 20.975 19.4685 21.4014 19.7583 21.7235C19.9589 21.806 20.1774 21.8541 20.407 21.8541C21.3766 21.8541 22.1635 21.046 22.1635 20.0476ZM15.9967 22.0135C16.9128 22.0135 17.6551 21.2501 17.6551 20.3078C17.6551 19.3656 16.9128 18.6022 15.9967 18.6022C15.0805 18.6022 14.3382 19.3656 14.3382 20.3078C14.3382 21.2501 15.0805 22.0135 15.9967 22.0135ZM23.939 23.5862C23.939 23.3661 23.8955 23.1575 23.8209 22.9637C23.7105 22.9397 23.5957 22.9259 23.4776 22.9259C22.5614 22.9259 21.8191 23.6893 21.8191 24.6316C21.8191 24.8516 21.8626 25.0603 21.9373 25.254C22.0476 25.2781 22.1624 25.2918 22.2806 25.2918C23.1967 25.2918 23.939 24.5284 23.939 23.5862ZM16.846 24.6327C16.846 24.6591 16.8526 24.6843 16.8538 24.7095C17.158 25.0637 17.5972 25.2918 18.0931 25.2918C19.0093 25.2918 19.7516 24.5284 19.7516 23.5862C19.7516 23.5598 19.7449 23.5346 19.7438 23.5094C19.4395 23.1552 19.0004 22.9271 18.5044 22.9271C17.5882 22.9271 16.846 23.6905 16.846 24.6327ZM21.2195 26.4874C21.0345 26.4014 20.8294 26.3521 20.6132 26.3521C19.8909 26.3521 19.2902 26.8828 19.1564 27.5844C19.3415 27.6703 19.5465 27.7196 19.7628 27.7196C20.485 27.7196 21.0857 27.1889 21.2195 26.4874ZM15.9967 27.7196C16.5138 27.7196 16.9674 27.4479 17.2338 27.0353C16.9674 26.6238 16.5138 26.351 15.9967 26.351C15.4795 26.351 15.0259 26.6226 14.7595 27.0353C15.0259 27.4468 15.4795 27.7196 15.9967 27.7196ZM24.1552 12.0042C24.1552 12.8307 24.727 13.5196 25.4871 13.6767C25.8115 13.3649 26.0177 12.9247 26.0177 12.4318C26.0177 11.6053 25.4459 10.9164 24.6858 10.7594C24.3614 11.0712 24.1552 11.5113 24.1552 12.0042ZM20.407 10.4086C20.1774 10.4086 19.9589 10.4568 19.7583 10.5393C19.4685 10.8614 19.288 11.289 19.288 11.7612C19.288 12.7585 20.0737 13.5678 21.0445 13.5678C21.2741 13.5678 21.4926 13.5196 21.6932 13.4371C21.983 13.115 22.1635 12.6874 22.1635 12.2152C22.1635 11.2179 21.3778 10.4086 20.407 10.4086ZM14.3382 11.955C14.3382 12.8972 15.0805 13.6606 15.9967 13.6606C16.9128 13.6606 17.6551 12.8972 17.6551 11.955C17.6551 11.0127 16.9128 10.2493 15.9967 10.2493C15.0805 10.2493 14.3382 11.0127 14.3382 11.955ZM22.2806 6.97C22.1624 6.97 22.0487 6.98 21.9373 7.01C21.8637 7.2 21.8191 7.41 21.8191 7.63C21.8191 8.57 22.5614 9.34 23.4776 9.34C23.5957 9.34 23.7094 9.32 23.8209 9.3C23.8944 9.1 23.939 8.9 23.939 8.68C23.939 7.73 23.1967 6.97 22.2806 6.97ZM18.5044 9.34C19.0004 9.34 19.4395 9.11 19.7438 8.75C19.7438 8.73 19.7516 8.7 19.7516 8.68C19.7516 7.73 19.0093 6.97 18.0931 6.97C17.5972 6.97 17.158 7.2 16.8538 7.55C16.8526 7.58 16.846 7.6 16.846 7.63C16.846 8.57 17.5882 9.34 18.5044 9.34ZM19.7639 4.54C19.5476 4.54 19.3437 4.59 19.1576 4.68C19.2913 5.38 19.892 5.91 20.6143 5.91C20.8305 5.91 21.0345 5.86 21.2206 5.77C21.0869 5.07 20.4861 4.54 19.7639 4.54ZM14.7595 5.23C15.0259 5.64 15.4795 5.91 15.9967 5.91C16.5138 5.91 16.9674 5.64 17.2338 5.23C16.9674 4.81 16.5138 4.54 15.9967 4.54C15.4795 4.54 15.0259 4.81 14.7595 5.23ZM13.7018 14.46C12.7856 14.46 12.0433 15.22 12.0433 16.17C12.0433 17.11 12.7856 17.87 13.7018 17.87C14.6179 17.87 15.3602 17.11 15.3602 16.17C15.3602 15.22 14.6179 14.46 13.7018 14.46ZM4.469 16.17C4.469 16.77 4.788 17.29 5.257 17.57C5.655 17.28 5.917 16.8 5.917 16.26C5.917 15.66 5.598 15.14 5.129 14.86C4.731 15.15 4.469 15.63 4.469 16.17ZM8.735 14.5C8.086 14.77 7.624 15.42 7.624 16.18C7.624 17.05 8.224 17.78 9.021 17.95C9.67 17.68 10.132 17.03 10.132 16.27C10.132 15.4 9.532 14.67 8.735 14.5ZM7.314 10.76C6.555 10.92 5.982 11.61 5.982 12.43C5.982 12.93 6.189 13.37 6.513 13.68C7.272 13.52 7.845 12.83 7.845 12.01C7.845 11.51 7.639 11.07 7.314 10.76ZM9.836 12.22C9.836 12.69 10.017 13.12 10.307 13.44C10.507 13.52 10.726 13.57 10.956 13.57C11.925 13.57 12.712 12.76 12.712 11.76C12.712 11.29 12.532 10.86 12.242 10.54C12.041 10.46 11.823 10.41 11.593 10.41C10.623 10.41 9.836 11.22 9.836 12.22ZM8.061 8.68C8.061 8.9 8.104 9.1 8.179 9.3C8.289 9.32 8.404 9.34 8.522 9.34C9.439 9.34 10.181 8.57 10.181 7.63C10.181 7.41 10.137 7.2 10.063 7.01C9.952 6.98 9.838 6.97 9.719 6.97C8.803 6.97 8.061 7.73 8.061 8.68ZM15.154 7.63C15.154 7.6 15.147 7.58 15.146 7.55C14.842 7.2 14.403 6.97 13.907 6.97C12.991 6.97 12.248 7.73 12.248 8.68C12.248 8.7 12.255 8.73 12.256 8.75C12.561 9.11 13 9.33 13.496 9.33C14.412 9.33 15.154 8.57 15.154 7.63ZM10.781 5.78C10.966 5.86 11.171 5.91 11.387 5.91C12.109 5.91 12.71 5.38 12.844 4.68C12.659 4.59 12.454 4.54 12.237 4.54C11.515 4.54 10.914 5.07 10.781 5.78ZM7.845 20.26C7.845 19.43 7.273 18.74 6.513 18.59C6.189 18.9 5.982 19.34 5.982 19.83C5.982 20.66 6.554 21.35 7.314 21.5C7.639 21.19 7.845 20.75 7.845 20.26ZM11.593 21.85C11.823 21.85 12.041 21.8 12.242 21.72C12.532 21.4 12.712 20.97 12.712 20.5C12.712 19.5 11.926 18.69 10.956 18.69C10.726 18.69 10.507 18.74 10.307 18.82C10.017 19.15 9.836 19.57 9.836 20.05C9.836 21.04 10.622 21.85 11.593 21.85ZM9.719 25.29C9.838 25.29 9.951 25.28 10.063 25.25C10.136 25.06 10.181 24.85 10.181 24.63C10.181 23.69 9.439 22.93 8.522 22.93C8.404 22.93 8.291 22.94 8.179 22.96C8.106 23.16 8.061 23.37 8.061 23.59C8.061 24.53 8.803 25.29 9.719 25.29ZM13.496 22.93C13 22.93 12.561 23.16 12.256 23.51C12.255 23.54 12.248 23.56 12.248 23.59C12.248 24.53 12.991 25.29 13.907 25.29C14.403 25.29 14.842 25.06 15.146 24.71C15.147 24.68 15.154 24.66 15.154 24.63C15.154 23.69 14.412 22.93 13.496 22.93ZM12.236 27.72C12.452 27.72 12.656 27.67 12.842 27.58C12.709 26.88 12.108 26.35 11.386 26.35C11.17 26.35 10.966 26.4 10.779 26.49C10.913 27.19 11.514 27.72 12.236 27.72ZM27.145 22.82C27.145 22.63 27.106 22.44 27.042 22.28C26.38 22.44 25.887 23.04 25.887 23.75C25.887 23.95 25.926 24.13 25.99 24.3C26.652 24.13 27.145 23.53 27.145 22.82ZM29.067 19.45C29.067 19.13 28.968 18.83 28.801 18.59C28.412 18.86 28.155 19.32 28.155 19.83C28.155 20.15 28.255 20.45 28.422 20.69C28.811 20.42 29.067 19.96 29.067 19.45ZM30 16.09C30 15.72 29.856 15.39 29.626 15.13C29.432 15.38 29.31 15.68 29.31 16.02C29.31 16.39 29.454 16.73 29.685 16.98C29.879 16.74 30 16.43 30 16.09ZM23.706 27.72C24.549 27.72 25.231 27.03 25.231 26.19C24.388 26.19 23.706 26.87 23.706 27.72ZM25.99 7.97C25.926 8.14 25.887 8.32 25.887 8.51C25.887 9.22 26.38 9.82 27.042 9.99C27.106 9.82 27.145 9.64 27.145 9.45C27.145 8.73 26.652 8.13 25.99 7.97ZM28.423 11.57C28.256 11.81 28.157 12.11 28.157 12.43C28.157 12.95 28.413 13.4 28.802 13.68C28.969 13.43 29.068 13.13 29.068 12.81C29.068 12.3 28.812 11.85 28.423 11.57ZM25.231 6.07C25.231 5.23 24.548 4.54 23.706 4.54C23.706 5.39 24.389 6.07 25.231 6.07ZM4.856 9.45C4.856 9.64 4.895 9.82 4.958 9.99C5.62 9.82 6.113 9.22 6.113 8.51C6.113 8.32 6.074 8.14 6.01 7.97C5.348 8.13 4.856 8.73 4.856 9.45ZM2.933 12.81C2.933 13.13 3.032 13.43 3.199 13.68C3.588 13.4 3.845 12.95 3.845 12.43C3.845 12.11 3.745 11.81 3.578 11.57C3.189 11.85 2.933 12.3 2.933 12.81ZM2 16.17C2 16.54 2.144 16.87 2.374 17.13C2.568 16.89 2.69 16.58 2.69 16.24C2.69 15.87 2.546 15.54 2.315 15.28C2.121 15.53 2 15.83 2 16.17ZM8.294 4.54C7.451 4.54 6.769 5.23 6.769 6.07C7.612 6.07 8.294 5.39 8.294 4.54ZM6.01 24.3C6.074 24.13 6.113 23.95 6.113 23.75C6.113 23.04 5.62 22.44 4.958 22.28C4.895 22.44 4.856 22.63 4.856 22.82C4.856 23.53 5.348 24.13 6.01 24.3ZM3.577 20.69C3.744 20.45 3.843 20.15 3.843 19.83C3.843 19.32 3.588 18.86 3.198 18.59C3.031 18.83 2.932 19.13 2.932 19.45C2.932 19.96 3.188 20.42 3.577 20.69ZM6.769 26.19C6.769 27.04 7.452 27.72 8.294 27.72C8.294 26.88 7.611 26.19 6.769 26.19ZM22.78 3.36C22.534 2.9 22.055 2.59 21.499 2.59C21.343 2.59 21.195 2.62 21.055 2.66C21.301 3.12 21.779 3.44 22.335 3.44C22.491 3.44 22.639 3.41 22.78 3.36ZM16.888 2.37C17.167 2.67 17.565 2.87 18.012 2.87C18.399 2.87 18.747 2.72 19.016 2.48C18.737 2.17 18.34 1.98 17.893 1.98C17.506 1.98 17.157 2.13 16.888 2.37ZM9.659 3.44C10.215 3.44 10.694 3.12 10.94 2.66C10.798 2.62 10.651 2.59 10.495 2.59C9.939 2.59 9.461 2.9 9.215 3.36C9.356 3.41 9.503 3.44 9.659 3.44ZM14.1 1.98C13.653 1.98 13.255 2.17 12.976 2.48C13.245 2.72 13.594 2.87 13.98 2.87C14.427 2.87 14.825 2.67 15.104 2.37C14.835 2.13 14.486 1.98 14.1 1.98ZM9.213 28.9C9.46 29.36 9.938 29.68 10.494 29.68C10.65 29.68 10.798 29.65 10.939 29.6C10.693 29.14 10.214 28.83 9.658 28.83C9.502 28.83 9.354 28.86 9.213 28.9ZM15.105 29.9C14.826 29.59 14.429 29.4 13.982 29.4C13.595 29.4 13.246 29.55 12.977 29.79C13.256 30.09 13.654 30.29 14.101 30.29C14.488 30.29 14.836 30.14 15.105 29.9ZM22.334 28.83C21.778 28.83 21.3 29.14 21.053 29.6C21.195 29.65 21.342 29.68 21.498 29.68C22.054 29.68 22.532 29.36 22.779 28.9C22.637 28.86 22.49 28.83 22.334 28.83ZM17.894 30.29C18.341 30.29 18.739 30.09 19.017 29.79C18.749 29.55 18.4 29.4 18.013 29.4C17.566 29.4 17.168 29.59 16.889 29.9C17.158 30.14 17.507 30.29 17.894 30.29Z" fill="url(#splash-grad)"/>
                </g>
                <defs>
                  <linearGradient id="splash-grad" x1="2" y1="16.13" x2="30" y2="16.13" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C62828"/>
                    <stop offset="0.35" stopColor="#8B1A1A"/>
                    <stop offset="0.65" stopColor="#4E342E"/>
                    <stop offset="1" stopColor="#C62828"/>
                  </linearGradient>
                  <clipPath id="splash-clip">
                    <rect width="28" height="28.31" fill="white" transform="translate(2 1.98)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* "ahli connect" text */}
            <div className="flex flex-col leading-none">
              <span className="text-[28px] font-black tracking-tight" style={{ color: '#2E7D32' }}>ahli</span>
              <span className="text-[28px] font-black tracking-tight">
                <span style={{ color: '#2E7D32' }}>conn</span><span style={{ color: '#C62828' }}>e</span><span style={{ color: '#9E9E9E' }}>ct</span>
              </span>
            </div>
          </div>

          {/* Arabic + English tagline */}
          <div className="flex flex-col items-center gap-1" style={{
            animation: 'splash-fade-in 0.6s ease-out 0.7s both',
          }}>
            <p className="text-white text-[26px] font-extrabold leading-tight" style={{ direction: 'rtl' }}>
              إماراتنا، فخرنا
            </p>
            <p className="text-white/50 text-[12px] font-bold tracking-[0.3em] uppercase">
              OUR PRIDE. OUR UAE.
            </p>
          </div>
        </div>

        {/* Splash animations */}
        <style>{`
          @keyframes splash-gradient-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes splash-logo-in {
            from { opacity: 0; transform: scale(0.7) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes splash-fade-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AppShell title="Home" subtitle={time} hideTopBar>

      {/* ══════════════════════════════════════════
          DESKTOP MODAL — Install PWA on mobile
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
                Install the App
              </h2>
              <p className="text-[14px] text-[#666D80] leading-relaxed mb-6">
                Ahli Connect works best as a mobile app. Scan the QR code to install it directly on your phone — no app store needed.
              </p>

              {/* QR Code */}
              <div className="bg-[#F8F9FB] rounded-[20px] p-5 border border-[#DFE1E6] mb-5">
                <img src="/qr-mobile.png" alt="Scan to install Ahli Connect" className="w-[180px] h-[180px] mx-auto" />
              </div>

              <p className="text-[12px] text-[#666D80] leading-relaxed mb-1">
                Open on your phone, then tap <span className="font-bold text-[#15161E]">&quot;Add to Home Screen&quot;</span>
              </p>
              <p className="text-[11px] text-[#A4ABB8]">
                <span className="font-semibold text-[#9D63F6]">ahliconnectapp.vercel.app</span>
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
              <Link href="/profile" className="shrink-0 active:scale-95 transition-transform">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-[48px] h-[48px] rounded-full object-cover"
                  style={{
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                  }}
                />
              </Link>
              <div className="min-w-0">
                <p className="text-white/60 text-[11px] font-medium tracking-wide">{greeting}</p>
                <p className="text-white text-[16px] font-bold leading-tight truncate">{user.name.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              {/* Weather */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <Sun size={14} className="text-yellow-300" />
                <span className="text-[11px] font-semibold text-white/90">36°</span>
                <span className="text-[9px] text-white/50">Abu Dhabi</span>
              </div>
              {/* Notification Bell */}
              <button onClick={togglePanel} className="relative shrink-0">
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
          </div>
          {/* Row 2: Steps + Points badges */}
          <div className="flex items-center gap-2 mt-3">
            <Link href="/steps" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <Footprints size={13} className="text-[#40C4AA]" />
              <span className="text-[12px] font-bold text-white">7,432</span>
            </Link>
            <Link href="/rewards" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
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
              fontSize: 'clamp(26px, 6.5vw, 34px)',
              fontWeight: 800,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
            Your work life,{'\n'}
            <span style={{ color: '#000000' }}>supercharged.</span>
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-[13px] mt-2 leading-relaxed max-w-[260px]"
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
          SMART AUTOMATIONS — Scrollable 6-card row
          ═══════════════════════════════════════ */}
      <div className="-mt-1 pb-1">
        <div className="flex items-center justify-between mb-3 px-4">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#FFBD4C]" strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-[#15161E]">Smart Automations</h3>
          </div>
          <Link href="/services" className="text-[11px] font-semibold text-[#9D63F6] no-underline active:opacity-70 transition-opacity">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2.5 px-4">
          {[
            {
              title: 'Salary Certificate',
              lottie: '/lottie-auto-salary.lottie',
              gradient: 'linear-gradient(135deg, #F3EEFF 0%, #E8DBFE 50%, #D4BFFC 100%)',
              stat: '<30s',
              statLabel: 'avg. time',
              accent: '#9D63F6',
              href: '/automations/salary-certificate',
            },
            {
              title: 'Smart Leave',
              lottie: '/lottie-auto-leave2.lottie',
              gradient: 'linear-gradient(135deg, #E7FEF8 0%, #C6F7E9 50%, #A7F0DA 100%)',
              stat: '1-tap',
              statLabel: 'approval',
              accent: '#40C4AA',
              href: '/automations/leave-request',
            },
            {
              title: 'Expense Claim',
              lottie: '/lottie-auto-expense.lottie',
              gradient: 'linear-gradient(135deg, #FFF8EB 0%, #FFEFC7 50%, #FFE4A0 100%)',
              stat: '98%',
              statLabel: 'accuracy',
              accent: '#FFBD4C',
              href: '/automations/expense-claim',
            },
            {
              title: 'Insurance',
              lottie: '/lottie-auto-insurance.lottie',
              gradient: 'linear-gradient(135deg, #EDFCFA 0%, #CCFBF1 50%, #99F6E4 100%)',
              stat: '15%',
              statLabel: 'discount',
              accent: '#0D9488',
              href: '/services?prompt=I+need+insurance',
            },
            {
              title: 'Sell Item',
              lottie: '/lottie-auto-sell.lottie',
              gradient: 'linear-gradient(135deg, #FFF4EC 0%, #FFE4CC 50%, #FFD4AA 100%)',
              stat: '45K+',
              statLabel: 'buyers',
              accent: '#EA580C',
              href: '/services?prompt=I+want+to+sell+something',
            },
            {
              title: 'Plan Vacation',
              lottie: '/lottie-auto-vacation.lottie',
              gradient: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 50%, #A5F3FC 100%)',
              stat: '30+',
              statLabel: 'destinations',
              accent: '#06B6D4',
              href: '/services?prompt=Help+me+plan+a+vacation',
            },
          ].map((card, i) => (
              <Link key={card.title} href={card.href}
                className="block rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white hover:shadow-lg transition-all active:scale-[0.96]"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.9 + i * 0.08}s`,
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


      {/* ── Rest of dashboard content ── */}
      <div className="px-4 space-y-3 pb-4 pt-2">

        {/* ══════════════════════════════════════════
            THE LATEST — 4-SLIDE AUTO-SCROLL CAROUSEL
            ══════════════════════════════════════════ */}
        <LatestCarousel offers={relevantOffers} onSlideClick={(slide) => {
          if (slide === 'news') {
            router.push(`/news?id=${topNews.id}`);
          } else {
            setShowCarouselDetail(slide);
          }
        }} />

        {/* ── Benefits & Offers ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Gift size={15} className="text-[#C8973A]" strokeWidth={2} />
              <h3 className="text-[15px] font-extrabold text-[#15161E]">Benefits & Offers</h3>
              <span className="text-[9px] font-bold text-[#C8973A] bg-[#C8973A]/10 px-2 py-0.5 rounded-full">{relevantOffers.length} available</span>
            </div>
            <Link href="/offers" className="text-[11px] font-bold text-[#9D63F6] flex items-center gap-0.5">
              See all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {relevantOffers.filter(o => o.featured).slice(0, 3).map(offer => (
              <Link key={offer.id} href="/offers"
                className="flex gap-3 p-2.5 rounded-[16px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all">
                <div className="relative w-[72px] h-[72px] rounded-[12px] overflow-hidden shrink-0">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: offer.color }}>
                      {offer.category}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-[10px] text-[#A4ABB8] font-medium">{offer.company}</p>
                  <p className="text-[12px] font-bold text-[#15161E] leading-snug mt-0.5 line-clamp-1">{offer.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-bold" style={{ color: offer.color }}>{offer.value}</span>
                    <span className="text-[9px] text-[#A4ABB8] flex items-center gap-0.5"><Clock size={9} /> {offer.expires}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Communities ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[15px] font-extrabold text-[#15161E]">Communities</h3>
            <Link href="/community" className="text-[11px] font-bold text-[#9D63F6]">See all</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {[
              { name: 'IHC Group', members: '20K', posts: 12, color: '#1B3A6B', logo: '/logos/ihc.svg', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop' },
              { name: 'Shory', members: '2.8K', posts: 5, color: '#0D9488', logo: '/logos/shory.svg', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop' },
              { name: 'Palms Sports', members: '4.5K', posts: 3, color: '#EA580C', logo: '/logos/palms-sports.svg', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
              { name: 'PureHealth', members: '8.9K', posts: 8, color: '#059669', logo: '/logos/purehealth.svg', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop' },
              { name: 'Aldar', members: '5.2K', posts: 2, color: '#C8973A', logo: '/logos/aldar.svg', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop' },
            ].map(c => (
              <Link key={c.name} href="/community" className="shrink-0 w-[130px] rounded-[16px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all">
                <div className="relative h-[72px]">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {c.posts > 0 && (
                    <div className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1" style={{ background: c.color }}>
                      <span className="text-[8px] font-bold text-white">{c.posts}</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                    <img src={c.logo} alt="" className="w-5 h-5 rounded-[4px]" />
                    <span className="text-[10px] font-bold text-white leading-tight">{c.name}</span>
                  </div>
                </div>
                <div className="px-2.5 py-2 flex items-center justify-between">
                  <span className="text-[9px] text-[#A4ABB8] flex items-center gap-1"><Users size={9} /> {c.members}</span>
                  <span className="text-[9px] font-semibold" style={{ color: c.color }}>Open</span>
                </div>
              </Link>
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

      {/* ═══════════════════════════════════════
          CAROUSEL DETAIL BOTTOM SHEET
          ═══════════════════════════════════════ */}
      {showCarouselDetail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[92vh] overflow-y-auto" style={{ animation: 'slideUp 0.3s ease-out' }}>

            {/* ── Sports Day Detail ── */}
            {showCarouselDetail === 'sports' && (
              <>
                <div className="relative h-52 overflow-hidden rounded-t-[28px]">
                  <img src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop" alt="Sports Day" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <button onClick={closeCarouselDetail} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <ArrowLeft size={18} className="text-white" />
                  </button>
                  <div className="absolute top-14 left-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-[#DC2626]">Sports</span>
                    <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-red-500/90 flex items-center gap-1">
                      <Flame size={10} /> 88 spots left
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg font-bold text-white leading-snug mb-1">IHC Group Sports Day</h2>
                    <div className="flex items-center gap-3 text-white/80 text-[11px]">
                      <span className="flex items-center gap-1"><Calendar size={11} /> 22 May 2026</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> Yas Sports Complex</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Clock, label: 'Time', value: '7 AM – 4 PM' },
                      { icon: Users, label: 'Capacity', value: '71% Full' },
                      { icon: Building2, label: 'By', value: 'Palms Sports' },
                    ].map(({ icon: IC, label, value }) => (
                      <div key={label} className="bg-[#F8F9FB] rounded-[14px] p-3 text-center border border-[#DFE1E6]">
                        <IC size={15} className="mx-auto text-[#666D80] mb-1" />
                        <p className="text-[10px] text-[#A4ABB8]">{label}</p>
                        <p className="text-[11px] font-bold text-[#15161E] truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Sports', 'Teams', 'Family', 'Yas Island'].map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border" style={{ color: '#DC2626', borderColor: '#DC262630', background: '#DC262608' }}>{tag}</span>
                    ))}
                  </div>
                  <div className="bg-white rounded-[14px] border border-[#DFE1E6] p-4">
                    <h3 className="text-xs font-bold text-[#15161E] mb-1.5">About this event</h3>
                    <p className="text-xs text-[#666D80] leading-relaxed">The biggest sporting event of the year! Football, basketball, padel, and volleyball tournaments across all IHC subsidiaries. Register as a team or as an individual — we&apos;ll match you with a team. Open to all employees and their families.</p>
                  </div>
                  <div className="bg-[#F8F9FB] rounded-[16px] border border-[#DFE1E6] p-4">
                    <h3 className="text-xs font-bold text-[#15161E] mb-3">Schedule</h3>
                    <div className="space-y-2.5">
                      {[
                        { time: '7:00 AM', item: 'Registration & warm-up' },
                        { time: '8:00 AM', item: 'Opening ceremony' },
                        { time: '9:00 AM', item: 'Group matches begin' },
                        { time: '1:00 PM', item: 'Semi-finals & finals' },
                        { time: '3:30 PM', item: 'Awards ceremony' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#DC2626]" />
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-[#DC2626]">{item.time}</p>
                            <p className="text-xs text-[#15161E]">{item.item}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pb-4">
                    {!carouselRegistered ? (
                      <button onClick={() => setCarouselRegistered(true)} className="w-full py-3 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.98] bg-[#DC2626]">
                        Register for Sports Day
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-[14px] px-4 py-3">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-green-700">You&apos;re registered!</p>
                          <p className="text-[10px] text-green-600">Confirmation sent to {user.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Offers Detail ── */}
            {showCarouselDetail === 'offers' && (
              <>
                <div className="relative h-48 overflow-hidden rounded-t-[28px]">
                  <img src={topOffers[0]?.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop'} alt="Offers" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <button onClick={closeCarouselDetail} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <ArrowLeft size={18} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg font-bold text-white leading-snug">Exclusive Employee Perks</h2>
                    <p className="text-[11px] text-white/70 mt-1">{relevantOffers.length} offers available for you</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {relevantOffers.slice(0, 5).map(offer => (
                    <div key={offer.id} className="flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6] bg-[#FAFBFC]">
                      <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0">
                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#15161E] truncate">{offer.title}</p>
                        <p className="text-[10px] text-[#A4ABB8]">{offer.company} · {offer.value}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: (offer.color || '#FFBD4C') + '15' }}>
                        <Gift size={14} style={{ color: offer.color || '#FFBD4C' }} />
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2 pt-2 pb-4">
                    <Link href="/offers" onClick={closeCarouselDetail} className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-bold text-white no-underline transition-all active:scale-[0.98] bg-[#FFBD4C]">
                      View All {relevantOffers.length} Offers <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* ── Dining Detail ── */}
            {showCarouselDetail === 'dining' && (
              <>
                <div className="relative h-52 overflow-hidden rounded-t-[28px]">
                  <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop" alt="Dining" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <button onClick={closeCarouselDetail} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <ArrowLeft size={18} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-[#FFBD4C]/20">
                        <UtensilsCrossed size={16} className="text-[#FFBD4C]" />
                      </div>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Dining Program</span>
                    </div>
                    <h2 className="text-lg font-bold text-white leading-snug">Dining at 40+ Restaurants</h2>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-[13px] font-semibold text-[#FFBD4C]">25% off at premium restaurants across the UAE</p>
                  <p className="text-[13px] text-[#666D80] leading-relaxed">Enjoy exclusive IHC employee discounts at over 40 premium restaurants including Zuma, Nobu, La Petite Maison, and many more. Simply show your Ahli Connect digital card at participating venues. New restaurants added weekly.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Restaurants', value: '40+' },
                      { label: 'Max Discount', value: '25%' },
                      { label: 'Redeemed', value: '8.2K' },
                      { label: 'Valid Until', value: 'Dec 2026' },
                    ].map(h => (
                      <div key={h.label} className="bg-[#F8F9FB] rounded-[14px] p-3 text-center border border-[#DFE1E6]">
                        <p className="text-[16px] font-bold text-[#FFBD4C]">{h.value}</p>
                        <p className="text-[10px] text-[#A4ABB8] font-medium mt-0.5">{h.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6] p-4">
                    <h3 className="text-xs font-bold text-[#15161E] mb-2">Featured Restaurants</h3>
                    <div className="space-y-2">
                      {['Zuma — Japanese fine dining · 25% off', 'Nobu — Modern Japanese · 20% off', 'La Petite Maison — French bistro · 25% off', 'Hakkasan — Cantonese · 20% off'].map(r => (
                        <div key={r} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FFBD4C]" />
                          <p className="text-[11px] text-[#4B5563]">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pb-4">
                    <Link href="/offers" onClick={closeCarouselDetail} className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-bold text-white no-underline transition-all active:scale-[0.98] bg-[#FFBD4C]">
                      Browse Dining Offers <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Float animation keyframes */}
    </AppShell>
  );
}
