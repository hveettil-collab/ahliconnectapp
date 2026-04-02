'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Megaphone, Tag, ShoppingBag, Sparkles, MessageCircle, User, LogOut, ChevronRight, X, Activity, Info, Compass, Gift, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Logo from '@/components/ui/Logo';
import { COMPANIES } from '@/lib/mockData';

const NAV = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'AI Assistant', href: '/services', icon: Sparkles },
  { label: 'Automations', href: '/automations', icon: Zap },
  { label: 'Benefits & Offers', href: '/offers', icon: Gift },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { label: 'Chat', href: '/chat', icon: MessageCircle },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Activity Log', href: '/activity', icon: Activity },
  { label: 'About', href: '/about', icon: Info },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const company = COMPANIES.find(c => c.id === user?.companyId);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#F8F9FB] flex items-center justify-between">
        <Logo size="md" subtextColor="#A4ABB8" />
        {/* Close button - mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-[10px] text-[#666D80] hover:bg-[#F8F9FB] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User summary */}
      {user && (
        <div className="px-4 py-4 border-b border-[#F8F9FB]">
          <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-[14px] p-3">
            <Avatar initials={user.avatar} image={user.image} color={company?.color || '#9D63F6'} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#15161E] truncate">{user.name}</p>
              <p className="text-xs text-[#A4ABB8] truncate">{user.company}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#A4ABB8] uppercase tracking-widest px-3 mb-3">Navigation</p>
        <ul className="space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-150 group',
                    active
                      ? 'bg-[#9D63F6] text-white shadow-sm'
                      : 'text-[#666D80] hover:bg-[#F8F9FB] hover:text-[#15161E]'
                  )}
                >
                  <Icon size={17} className={clsx(active ? 'text-white' : 'text-[#A4ABB8] group-hover:text-[#15161E]')} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="text-white/60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#F8F9FB]">
        <button
          onClick={() => { logout(); onClose?.(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[#A4ABB8] hover:bg-red-50 hover:text-red-500 transition-all duration-150 w-full"
        >
          <LogOut size={17} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-[#DFE1E6] flex-col z-30 shadow-[1px_0_0_rgba(0,0,0,0.04)]">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <aside className="md:hidden fixed left-0 top-0 h-full w-72 bg-white flex flex-col z-50 shadow-xl animate-slide-in-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
