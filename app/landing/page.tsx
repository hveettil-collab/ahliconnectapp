'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Megaphone,
  Tag,
  ShoppingBag,
  Users,
  Briefcase,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronRight,
  Sparkles,
  Bot,
  Car,
  Plane,
  UtensilsCrossed,
  Heart,
  TrendingUp,
  CheckCircle2,
  Star,
  Play,
  Zap,
  Clock,
  Award,
  Building2,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

/* ═══════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════════════ */
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  return { count, ref };
}

/* ═══════════════════════════════════════════
   SUBSIDIARY LOGOS DATA
   ═══════════════════════════════════════════ */
const SUBSIDIARIES = [
  { name: 'IHC Group', logo: '/logos/ihc.svg' },
  { name: 'Aldar Properties', logo: '/logos/aldar.svg' },
  { name: 'Shory', logo: '/logos/shory.svg' },
  { name: 'PureHealth', logo: '/logos/purehealth.svg' },
  { name: 'EasyLease', logo: '/logos/easylease.svg' },
  { name: 'Ghitha', logo: '/logos/ghitha.svg' },
  { name: 'Palms Sports', logo: '/logos/palms-sports.svg' },
  { name: 'Multiply', logo: '/logos/multiply.svg' },
];

/* ═══════════════════════════════════════════
   AI CAPABILITIES
   ═══════════════════════════════════════════ */
const AI_CAPABILITIES = [
  { icon: Car, label: 'Motor Insurance', desc: 'Get instant quotes and buy insurance in 60 seconds', color: '#9D63F6' },
  { icon: Plane, label: 'Flight Booking', desc: 'Compare and book flights with corporate rates', color: '#54B6ED' },
  { icon: UtensilsCrossed, label: 'Food Ordering', desc: 'Order from top restaurants with exclusive discounts', color: '#40C4AA' },
  { icon: ShoppingBag, label: 'Marketplace', desc: 'Buy and sell with 20,000+ verified colleagues', color: '#FFBD4C' },
  { icon: Briefcase, label: 'HR Services', desc: 'Salary certificates and leave in under 30 seconds', color: '#DF1C41' },
  { icon: Heart, label: 'Health & Wellness', desc: 'PureHealth benefits, gym access, and wellness programs', color: '#EC4899' },
];

/* ═══════════════════════════════════════════
   BENEFITS DATA
   ═══════════════════════════════════════════ */
const BENEFITS = [
  {
    icon: Tag,
    title: 'Exclusive Offers',
    desc: 'Up to 70% off on dining, travel, fitness, and lifestyle — exclusively for IHC employees.',
    stat: '500+',
    statLabel: 'Active Deals',
    color: '#F59E0B',
  },
  {
    icon: Shield,
    title: 'Comprehensive Insurance',
    desc: 'Motor, health, and life insurance from Shory with group rates 40% below market.',
    stat: '40%',
    statLabel: 'Below Market',
    color: '#40C4AA',
  },
  {
    icon: TrendingUp,
    title: 'IHC Stock Access',
    desc: 'Trade IHC shares with real-time ADX data, low brokerage, and employee stock plans.',
    stat: 'Live',
    statLabel: 'Market Data',
    color: '#9D63F6',
  },
  {
    icon: Award,
    title: 'Learning & Growth',
    desc: 'AED 15,000 annual education allowance for courses, certifications, and conferences.',
    stat: '15K',
    statLabel: 'AED / Year',
    color: '#54B6ED',
  },
];

/* ═══════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Fatima Al Mazrouei',
    role: 'Senior Analyst, Aldar Properties',
    text: 'Ahli Connect transformed how I manage my benefits. I renewed my car insurance in 60 seconds through the AI assistant — what used to take hours.',
    avatar: 'FA',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Omar Al Hashimi',
    role: 'Operations Manager, PureHealth',
    text: 'The marketplace is incredible. I sold my car to a colleague within a day. The verified employee network makes everything trustworthy.',
    avatar: 'OA',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Sara Al Kaabi',
    role: 'Marketing Lead, Shory',
    text: 'Getting my salary certificate used to require 3 emails and 5 days. Now I generate it instantly with AI. This is the future of employee platforms.',
    avatar: 'SA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
];

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [activeAI, setActiveAI] = useState(0);

  // Show "Install the App" modal on desktop after 5 seconds
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      const timer = setTimeout(() => setShowDesktopModal(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Rotate AI capabilities showcase
  useEffect(() => {
    const id = setInterval(() => setActiveAI(prev => (prev + 1) % AI_CAPABILITIES.length), 3000);
    return () => clearInterval(id);
  }, []);

  // Counter hooks for stats
  const employees = useCountUp(20000);
  const subsidiaries = useCountUp(7);
  const offers = useCountUp(500);
  const satisfaction = useCountUp(98);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ══════════════════════════════════════════
          DESKTOP MODAL — Install PWA (dismissable, 5s delay)
          ══════════════════════════════════════════ */}
      {showDesktopModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDesktopModal(false)} />
          <div className="relative bg-white rounded-[28px] shadow-2xl max-w-[420px] w-full mx-4 overflow-hidden"
            style={{ animation: 'card-pop 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Close button */}
            <button onClick={() => setShowDesktopModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10 hover:bg-[#DFE1E6] transition-colors">
              <X size={16} className="text-[#666D80]" />
            </button>
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

      {/* ==================== HEADER ==================== */}
      <header
        className="border-b sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3.5">
          <Link href="/landing" className="no-underline">
            <Image src="/logo-login.svg" alt="Ahli Connect" width={140} height={38} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium no-underline transition-colors" style={{ color: 'var(--text-secondary)' }}>Features</a>
            <a href="#benefits" className="text-sm font-medium no-underline transition-colors" style={{ color: 'var(--text-secondary)' }}>Benefits</a>
            <a href="#ai" className="text-sm font-medium no-underline transition-colors" style={{ color: 'var(--text-secondary)' }}>AI Assistant</a>
            <a href="#testimonials" className="text-sm font-medium no-underline transition-colors" style={{ color: 'var(--text-secondary)' }}>Reviews</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2.5 rounded-xl no-underline transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl no-underline shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Join IHC Connect
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border cursor-pointer"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-xl border cursor-pointer"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE MENU ==================== */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed top-0 right-0 bottom-0 w-[280px] z-50 p-6 flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--bg-card)', animation: 'slideInRight 0.3s ease' }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl cursor-pointer"
                style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-feature)' }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Benefits', href: '#benefits' },
                { label: 'AI Assistant', href: '#ai' },
                { label: 'Reviews', href: '#testimonials' },
                { label: 'Sign In', href: '/login' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium no-underline"
                  style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-feature)' }}
                >
                  {item.label}
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-white text-sm font-semibold px-5 py-3.5 rounded-xl no-underline"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Join IHC Connect
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col w-full">

        {/* ==================== HERO SECTION ==================== */}
        <section
          className="relative overflow-hidden w-full"
          style={{
            background: `linear-gradient(180deg, var(--bg-hero-gradient-from) 0%, var(--bg-hero-gradient-to) 50%, var(--bg) 100%)`,
          }}
        >
          {/* Decorative blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ backgroundColor: 'var(--accent)' }} />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]" style={{ backgroundColor: 'var(--accent-teal)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[120px]" style={{ backgroundColor: 'var(--accent-gold)' }} />
          </div>

          <div className="relative px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-16 max-w-7xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

              {/* Left: Copy */}
              <div className="text-center md:text-left">
                {/* Trust badge */}
                <div className="flex justify-center md:justify-start mb-5">
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      borderColor: 'var(--border-accent)',
                    }}
                  >
                    <Shield size={12} />
                    Trusted by 100K+ IHC Employees
                  </div>
                </div>

                {/* Headline */}
                <h1
                  className="text-3xl md:text-4xl lg:text-[52px] font-bold leading-[1.15] tracking-tight mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  One Platform for
                  <br />
                  <span style={{ color: 'var(--accent)' }}>Everything You Need</span>
                  <br />
                  at Work
                </h1>

                {/* Value proposition */}
                <p
                  className="text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto md:mx-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Insurance, HR services, exclusive deals, marketplace, and an AI assistant that handles it all — purpose-built for IHC Group employees across all subsidiaries.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl text-base w-full sm:w-auto no-underline shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Join the IHC Family
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={() => setShowDemoVideo(true)}
                    className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border w-full sm:w-auto transition-all active:scale-[0.97]"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <Play size={14} style={{ color: 'var(--accent)' }} />
                    Watch Demo
                  </button>
                </div>

                {/* Micro social proof */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 object-cover"
                        style={{ borderColor: 'var(--bg)' }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} fill="#FFBD4C" stroke="#FFBD4C" />
                      ))}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      4.9/5 from 2,800+ reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Hero image / App mockup */}
              <div className="relative flex justify-center">
                <div
                  className="relative w-full max-w-[380px] rounded-[28px] overflow-hidden border shadow-2xl"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Fake phone status bar */}
                  <div className="px-6 pt-4 pb-2 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: 'var(--text-muted)', opacity: 0.3 }} />
                      <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: 'var(--text-muted)', opacity: 0.5 }} />
                      <div className="w-6 h-3 rounded-sm border" style={{ borderColor: 'var(--text-muted)', opacity: 0.4 }}>
                        <div className="w-3/4 h-full rounded-sm" style={{ backgroundColor: 'var(--accent-teal)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Chat mockup */}
                  <div className="px-4 pb-4 space-y-3">
                    {/* AI greeting */}
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #9D63F6, #54B6ED)' }}>
                        <Bot size={14} className="text-white" />
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-md px-3.5 py-2.5 text-xs max-w-[85%] leading-relaxed"
                        style={{ backgroundColor: 'var(--bg-feature)', color: 'var(--text-primary)' }}
                      >
                        Hi! I&apos;m your AI assistant. I can help with insurance, flights, HR requests, and more. What do you need?
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex justify-end">
                      <div
                        className="rounded-2xl rounded-tr-md px-3.5 py-2.5 text-xs text-white max-w-[75%] leading-relaxed"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        I need motor insurance for my car
                      </div>
                    </div>

                    {/* AI response with card */}
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #9D63F6, #54B6ED)' }}>
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="space-y-2 max-w-[85%]">
                        <div
                          className="rounded-2xl rounded-tl-md px-3.5 py-2.5 text-xs leading-relaxed"
                          style={{ backgroundColor: 'var(--bg-feature)', color: 'var(--text-primary)' }}
                        >
                          I found the best rate for you through Shory:
                        </div>
                        <div
                          className="rounded-xl border p-3"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(64,196,170,0.1)' }}>
                              <Shield size={12} style={{ color: '#40C4AA' }} />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Shory Comprehensive</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>AED 1,240</span>
                            <span className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>AED 2,100</span>
                            <span className="text-[10px] font-bold" style={{ color: '#40C4AA' }}>-41%</span>
                          </div>
                          <button
                            className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                            style={{ backgroundColor: 'var(--accent)' }}
                          >
                            Buy Now — 60 Second Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="px-4 pb-4">
                    <div
                      className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
                    >
                      <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Ask me anything...</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div
                  className="absolute -left-4 md:-left-8 top-12 rounded-xl border px-3 py-2 shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    animation: 'floatBadge 3s ease-in-out infinite',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(64,196,170,0.15)' }}>
                      <CheckCircle2 size={12} style={{ color: '#40C4AA' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>Insurance Renewed</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Saved AED 860</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -right-4 md:-right-8 bottom-20 rounded-xl border px-3 py-2 shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    animation: 'floatBadge 3s ease-in-out infinite 1.5s',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(157,99,246,0.15)' }}>
                      <Zap size={12} style={{ color: '#9D63F6' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>Salary Certificate</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Generated in 8s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted by logos */}
          <div className="relative border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Powering employee experience across IHC subsidiaries
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                {SUBSIDIARIES.map(sub => (
                  <div key={sub.name} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    <Image src={sub.logo} alt={sub.name} width={28} height={28} className="rounded-md" />
                    <span className="text-xs font-medium hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{sub.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STATS BAR ==================== */}
        <section className="w-full" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { ref: employees.ref, count: employees.count, suffix: '+', label: 'Active Employees', icon: Users, color: '#9D63F6' },
                { ref: subsidiaries.ref, count: subsidiaries.count, suffix: '', label: 'IHC Subsidiaries', icon: Building2, color: '#54B6ED' },
                { ref: offers.ref, count: offers.count, suffix: '+', label: 'Exclusive Offers', icon: Tag, color: '#FFBD4C' },
                { ref: satisfaction.ref, count: satisfaction.count, suffix: '%', label: 'Satisfaction Rate', icon: Heart, color: '#40C4AA' },
              ].map((stat, i) => (
                <div key={i} ref={stat.ref} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stat.count.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section id="features" className="w-full px-4 md:px-6 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex justify-center mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <Sparkles size={10} />
                  Platform Features
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Everything Your Work Life Needs,{' '}
                <span style={{ color: 'var(--accent)' }}>In One Place</span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                From announcements to insurance, marketplace to HR — Ahli Connect replaces dozens of apps with one intelligent platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[
                { icon: Megaphone, label: 'Group Announcements', desc: 'Real-time news, policy updates, and company announcements from across the IHC network — never miss what matters.', color: '#3B82F6', metric: 'Real-time' },
                { icon: Tag, label: 'Exclusive Offers', desc: 'Curated deals from partner brands — dining, travel, fitness, electronics — with savings up to 70% for IHC employees.', color: '#F59E0B', metric: '500+ Deals' },
                { icon: ShoppingBag, label: 'Employee Marketplace', desc: 'A trusted marketplace where 20,000+ verified colleagues buy, sell, and trade — from cars to electronics.', color: '#10B981', metric: '20K+ Users' },
                { icon: Briefcase, label: 'Instant HR Services', desc: 'Salary certificates in 8 seconds, leave requests in 2 taps, expense claims auto-processed — HR, reimagined.', color: '#8B5CF6', metric: '8s Average' },
                { icon: Users, label: 'Colleague Network', desc: 'Search and connect with team members across all 7 IHC subsidiaries. Build your professional network internally.', color: '#EC4899', metric: '7 Companies' },
                { icon: Shield, label: 'Verified & Secure', desc: 'Every user is a verified IHC employee. Corporate-grade security with encrypted data and biometric access.', color: '#40C4AA', metric: '100% Verified' },
              ].map(({ icon: Icon, label, desc, color, metric }) => (
                <div
                  key={label}
                  className="group rounded-2xl border p-5 md:p-6 transition-all hover:shadow-lg cursor-default"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${color}12` }}
                    >
                      <Icon size={20} style={{ color }} strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${color}12`, color }}>
                      {metric}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BENEFITS SECTION ==================== */}
        <section
          id="benefits"
          className="w-full px-4 md:px-6 py-14 md:py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex justify-center mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(64,196,170,0.1)', color: '#40C4AA' }}
                >
                  <Award size={10} />
                  Employee Benefits
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Benefits That Actually{' '}
                <span style={{ color: 'var(--accent-teal)' }}>Save You Money</span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Being part of IHC Group means access to perks and savings you won&apos;t find anywhere else.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {BENEFITS.map(({ icon: Icon, title, desc, stat, statLabel, color }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-5 md:p-6 flex gap-4 transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={22} style={{ color }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold" style={{ color }}>{stat}</p>
                        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{statLabel}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== AI ASSISTANT SECTION ==================== */}
        <section id="ai" className="w-full px-4 md:px-6 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Content */}
              <div>
                <div className="flex justify-center md:justify-start mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    <Bot size={10} />
                    AI-Powered
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center md:text-left" style={{ color: 'var(--text-primary)' }}>
                  Your Personal AI Assistant{' '}
                  <span style={{ color: 'var(--accent)' }}>Does It All</span>
                </h2>
                <p className="text-sm md:text-base mb-8 text-center md:text-left" style={{ color: 'var(--text-secondary)' }}>
                  Just type what you need — insurance, flights, food delivery, salary certificates — and the AI handles everything end-to-end. No forms, no waiting.
                </p>

                {/* Capability cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AI_CAPABILITIES.map((cap, i) => (
                    <div
                      key={cap.label}
                      className="flex items-center gap-3 rounded-xl border p-3 transition-all cursor-default"
                      style={{
                        backgroundColor: i === activeAI ? `${cap.color}08` : 'var(--bg-card)',
                        borderColor: i === activeAI ? `${cap.color}40` : 'var(--border)',
                        boxShadow: i === activeAI ? `0 0 20px ${cap.color}10` : 'none',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cap.color}15` }}
                      >
                        <cap.icon size={16} style={{ color: cap.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{cap.label}</p>
                        <p className="text-[10px] leading-snug" style={{ color: 'var(--text-muted)' }}>{cap.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Live demo mockup */}
              <div className="flex justify-center">
                <div
                  className="w-full max-w-[360px] rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex items-center gap-3 border-b"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9D63F6, #54B6ED)' }}>
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>AI Assistant</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Always online</p>
                      </div>
                    </div>
                  </div>

                  {/* Animated conversation */}
                  <div className="p-4 space-y-3 min-h-[200px]">
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #9D63F6, #54B6ED)' }}>
                        <Bot size={11} className="text-white" />
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-md px-3 py-2 text-[11px] leading-relaxed"
                        style={{ backgroundColor: 'var(--bg-feature)', color: 'var(--text-primary)' }}
                      >
                        I can help you with:
                      </div>
                    </div>

                    {/* Rotating active capability */}
                    <div
                      className="ml-8 rounded-xl border p-3 transition-all duration-500"
                      style={{ borderColor: `${AI_CAPABILITIES[activeAI].color}40`, backgroundColor: `${AI_CAPABILITIES[activeAI].color}08` }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {(() => { const Cap = AI_CAPABILITIES[activeAI]; const Icon = Cap.icon; return <Icon size={14} style={{ color: Cap.color }} />; })()}
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {AI_CAPABILITIES[activeAI].label}
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {AI_CAPABILITIES[activeAI].desc}
                      </p>
                    </div>

                    {/* Speed indicator */}
                    <div className="ml-8 flex items-center gap-1.5">
                      <Clock size={10} style={{ color: 'var(--accent-teal)' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'var(--accent-teal)' }}>
                        Average response: 2 seconds
                      </span>
                    </div>
                  </div>

                  {/* CTA in mockup */}
                  <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white no-underline"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Try It Free <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section
          id="testimonials"
          className="w-full px-4 md:px-6 py-14 md:py-20"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex justify-center mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,189,76,0.1)', color: '#FFBD4C' }}
                >
                  <MessageSquare size={10} />
                  Employee Stories
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Loved by{' '}
                <span style={{ color: 'var(--accent-gold)' }}>Thousands</span>{' '}
                of Colleagues
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Real stories from IHC employees who transformed their work experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border p-5 md:p-6"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#FFBD4C" stroke="#FFBD4C" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-primary)' }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #9D63F6, #54B6ED)' }}
                      >
                        {t.avatar}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="w-full px-4 md:px-6 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]" style={{ backgroundColor: 'var(--accent)' }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]" style={{ backgroundColor: 'var(--accent-teal)' }} />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to Transform Your
              <br />
              <span style={{ color: 'var(--accent)' }}>Employee Experience?</span>
            </h2>
            <p className="text-sm md:text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join 20,000+ IHC employees who already use Ahli Connect to save time, save money, and stay connected across the group.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-base w-full sm:w-auto no-underline shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Become Part of IHC
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 font-medium px-6 py-4 rounded-xl text-sm border w-full sm:w-auto no-underline transition-all"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                }}
              >
                Already have an account? Sign In
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { icon: Shield, text: 'Enterprise Security' },
                { icon: Clock, text: 'Setup in 30 Seconds' },
                { icon: CheckCircle2, text: 'No Credit Card Required' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={13} style={{ color: 'var(--accent-teal)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="w-full border-t"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Image src="/logo-login.svg" alt="Ahli Connect" width={120} height={32} className="mb-3" />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                The unified employee platform for IHC Group — connecting 20,000+ people across 7 subsidiaries.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Platform</p>
              <div className="space-y-2">
                {['AI Assistant', 'Marketplace', 'Offers', 'HR Services'].map(item => (
                  <p key={item} className="text-xs" style={{ color: 'var(--text-muted)' }}>{item}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Company</p>
              <div className="space-y-2">
                {['About IHC', 'Careers', 'Contact', 'Support'].map(item => (
                  <p key={item} className="text-xs" style={{ color: 'var(--text-muted)' }}>{item}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Legal</p>
              <div className="space-y-2">
                {['Privacy Policy', 'Terms of Use', 'Data Protection', 'Accessibility'].map(item => (
                  <p key={item} className="text-xs" style={{ color: 'var(--text-muted)' }}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              &copy; 2025 International Holding Company PJSC. Internal use only.
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Ahli Connect v2.0 — Abu Dhabi, UAE
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== CSS ANIMATIONS ==================== */}
      <style jsx>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          DEMO VIDEO MODAL
          ═══════════════════════════════════════ */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }} onClick={() => setShowDemoVideo(false)}>
          <div className="relative w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowDemoVideo(false)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10 active:scale-95 transition-transform">
              <X size={20} className="text-white" />
            </button>
            <div className="rounded-[20px] overflow-hidden bg-black shadow-2xl" style={{ aspectRatio: '9/16' }}>
              <iframe
                src="https://app.heygen.com/embeds/f500efcd7aec47e29c63ea09d3723534"
                title="Ahli Connect Video"
                className="w-full h-full"
                allow="encrypted-media; fullscreen"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
