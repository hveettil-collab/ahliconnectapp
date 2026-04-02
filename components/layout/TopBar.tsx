'use client';
import { useState } from 'react';
import { Bell, Search, MessageCircle, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useViewMode } from '@/context/ViewModeContext';
import Avatar from '@/components/ui/Avatar';
import { COMPANIES } from '@/lib/mockData';
import Link from 'next/link';
import SmartSearch from '@/components/ui/SmartSearch';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export default function TopBar({ title, subtitle, onMenuToggle }: TopBarProps) {
  const { user } = useAuth();
  const { isMobilePreview } = useViewMode();
  const company = COMPANIES.find(c => c.id === user?.companyId);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-14 md:h-16 bg-white border-b border-[#E8E2D9] flex items-center px-4 md:px-6 gap-3 md:gap-4 sticky top-0 z-20">
        {/* Hamburger - mobile only (or mobile preview) */}
        <button
          onClick={onMenuToggle}
          className={isMobilePreview ? "p-2 -ml-1 rounded-[10px] text-[#6B7280] hover:bg-[#F4EFE8] transition-colors shrink-0" : "md:hidden p-2 -ml-1 rounded-[10px] text-[#6B7280] hover:bg-[#F4EFE8] transition-colors shrink-0"}
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm md:text-base font-bold text-[#1A1A2E] leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-[10px] md:text-xs text-[#9CA3AF] leading-tight mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Search - triggers AI Smart Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center bg-[#F9F6F1] rounded-[12px] px-3.5 py-2 gap-2.5 w-56 hover:bg-[#F4EFE8] transition-colors cursor-pointer"
        >
          <Search size={15} className="text-[#9CA3AF] shrink-0" strokeWidth={1.8} />
          <span className="text-sm text-[#9CA3AF] flex-1 text-left">AI Search...</span>
          <kbd className="text-[10px] text-[#9CA3AF] bg-white border border-[#E8E2D9] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
        </button>

        {/* Mobile search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden w-8 h-8 rounded-[10px] flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8] transition-colors"
        >
          <Search size={17} strokeWidth={1.8} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Link href="/chat" className="relative w-8 h-8 md:w-9 md:h-9 rounded-[10px] flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8] transition-colors">
            <MessageCircle size={17} strokeWidth={1.8} />
          </Link>
          <button className="relative w-8 h-8 md:w-9 md:h-9 rounded-[10px] flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8] transition-colors">
            <Bell size={17} strokeWidth={1.8} />
            <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          {user && (
            <Link href="/profile" className="ml-0.5 md:ml-1">
              <Avatar initials={user.avatar} image={user.image} color={company?.color || '#1B3A6B'} size="sm" />
            </Link>
          )}
        </div>
      </header>

      {/* AI Smart Search Overlay */}
      <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
