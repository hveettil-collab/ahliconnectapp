'use client';
import { useState } from 'react';
import { Bell, Search, MessageCircle, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
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
  const { unreadCount, togglePanel } = useNotifications();
  const company = COMPANIES.find(c => c.id === user?.companyId);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-14 md:h-16 bg-white border-b border-[#DFE1E6] flex items-center px-4 md:px-6 gap-3 md:gap-4 sticky top-0 z-20">
        {/* Hamburger - mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-1 rounded-[10px] text-[#666D80] hover:bg-[#F8F9FB] transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm md:text-base font-bold text-[#15161E] leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-[10px] md:text-xs text-[#A4ABB8] leading-tight mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Search - triggers AI Smart Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center bg-[#F8F9FB] rounded-[12px] px-3.5 py-2 gap-2.5 w-56 hover:bg-[#F8F9FB] transition-colors cursor-pointer"
        >
          <Search size={15} className="text-[#A4ABB8] shrink-0" strokeWidth={1.8} />
          <span className="text-sm text-[#A4ABB8] flex-1 text-left">AI Search...</span>
          <kbd className="text-[10px] text-[#A4ABB8] bg-white border border-[#DFE1E6] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
        </button>

        {/* Mobile search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden w-8 h-8 rounded-[10px] flex items-center justify-center text-[#666D80] hover:bg-[#F8F9FB] transition-colors"
        >
          <Search size={17} strokeWidth={1.8} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Link href="/chat" className="relative w-8 h-8 md:w-9 md:h-9 rounded-[10px] flex items-center justify-center text-[#666D80] hover:bg-[#F8F9FB] transition-colors">
            <MessageCircle size={17} strokeWidth={1.8} />
          </Link>
          <button
            onClick={togglePanel}
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-[10px] flex items-center justify-center text-[#666D80] hover:bg-[#F8F9FB] transition-colors"
          >
            <Bell size={17} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">{unreadCount}</span>
              </span>
            )}
          </button>
          {user && (
            <Link href="/profile" className="ml-0.5 md:ml-1">
              <Avatar initials={user.avatar} image={user.image} color={company?.color || '#9D63F6'} size="sm" />
            </Link>
          )}
        </div>
      </header>

      {/* AI Smart Search Overlay */}
      <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
