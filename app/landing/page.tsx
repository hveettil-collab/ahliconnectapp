'use client';
import { useState } from 'react';
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
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';

const FEATURES = [
  {
    icon: Megaphone,
    label: 'Announcements',
    desc: 'Stay updated with group-wide and company-specific news and announcements.',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  {
    icon: Tag,
    label: 'Employee Offers',
    desc: 'Exclusive benefits, discounts, and deals curated just for IHC employees.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: ShoppingBag,
    label: 'Marketplace',
    desc: 'Buy, sell, and trade with colleagues across the entire IHC network.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: Briefcase,
    label: 'HR Services',
    desc: 'Request certificates, manage leave, and access support seamlessly.',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  {
    icon: Users,
    label: 'Colleagues',
    desc: 'Find and connect with team members across all IHC subsidiaries.',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
  },
  {
    icon: Shield,
    label: 'Verified Access',
    desc: 'Secure, verified employee identity ensures a trusted environment.',
    color: '#40C4AA',
    bgColor: 'rgba(13, 148, 136, 0.1)',
  },
];

const COMPANIES = [
  { name: 'Aldar', abbr: 'AL' },
  { name: 'Shory', abbr: 'SH' },
  { name: 'PureHealth', abbr: 'PH' },
  { name: 'EasyLease', abbr: 'EL' },
  { name: 'Ghitha', abbr: 'GH' },
  { name: 'Palms Sports', abbr: 'PS' },
];

const STATS = [
  { value: '20,000+', label: 'Employees', icon: Users },
  { value: '7', label: 'Subsidiaries', icon: Globe },
  { value: 'UAE', label: 'Based', icon: Sparkles },
  { value: '100%', label: 'Verified', icon: Shield },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* ==================== HEADER ==================== */}
      <header
        className="border-b sticky top-0 z-40"
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
          <div className="hidden md:flex items-center gap-2">
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
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2.5 rounded-xl no-underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl no-underline"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2">
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
            className="fixed top-0 right-0 bottom-0 w-[280px] z-50 p-6 flex flex-col shadow-2xl animate-slide-in-right"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Menu
              </span>
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
                { label: 'Home', href: '/landing' },
                { label: 'Sign In', href: '/login' },
                { label: 'Create Account', href: '/signup' },
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
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ==================== HERO SECTION ==================== */}
      <main className="flex-1 flex flex-col w-full">
        <section
          className="relative overflow-hidden w-full"
          style={{
            background: `linear-gradient(180deg, var(--bg-hero-gradient-from) 0%, var(--bg-hero-gradient-to) 100%)`,
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: 'var(--accent-teal)' }}
            />
          </div>

          <div className="relative text-center px-4 md:px-6 pt-12 md:pt-20 pb-12 landing-fade-in max-w-7xl mx-auto w-full">
            {/* Pill tag */}
            <div className="flex justify-center mb-6">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  borderColor: 'var(--border-accent)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                IHC Group Internal Platform
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Employee{' '}
              <span style={{ color: 'var(--accent)' }}>Ecosystem</span>
              <br />
              {' '}Across IHC
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Access group-wide announcements, exclusive employee offers,
              the internal marketplace, HR services, and connect with colleagues
              across all IHC subsidiaries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-10 max-w-md mx-auto">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 md:px-8 py-3 rounded-xl text-sm md:text-base w-full md:w-auto no-underline shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Create Account
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 font-semibold px-6 md:px-8 py-3 rounded-xl text-sm md:text-base border w-full md:w-auto no-underline hover:bg-opacity-50 transition-all"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                }}
              >
                Sign In
              </Link>
            </div>

            {/* Company pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {COMPANIES.map(({ name, abbr }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-full"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--pill-bg)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {abbr}
                  </span>
                  {name}
                </span>
              ))}
              <span
                className="text-xs border px-3 py-1.5 rounded-full"
                style={{
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--pill-bg)',
                  borderColor: 'var(--border)',
                }}
              >
                + more
              </span>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="w-full px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--accent)' }}
              >
                Everything you need
              </p>
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                One platform, all services
              </h2>
              <p
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Everything IHC employees need, unified in a single, modern platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map(({ icon: Icon, label, desc, color, bgColor }) => (
                <div
                  key={label}
                  className="rounded-xl border p-4 cursor-default"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon size={18} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== STATS SECTION ==================== */}
        <section
          className="w-full border-t border-b"
          style={{
            backgroundColor: 'var(--stats-bg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-light)' }}
                    >
                      <Icon size={14} style={{ color: 'var(--accent)' }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    {value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="w-full px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-lg font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to get connected?
            </h2>
            <p
              className="text-xs mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join thousands of IHC employees already using Ahli Connect.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-3 rounded-xl text-base no-underline shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Create Your Account
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="w-full border-t px-4 md:px-6 py-6 md:py-8 text-center mt-auto"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          &copy; 2025 IHC Group. Internal use only.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Ahli Connect v1.0
        </p>
      </footer>
    </div>
  );
}
