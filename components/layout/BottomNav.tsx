'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Compass, Sparkles, Users, Store } from 'lucide-react';

const LEFT_TABS = [
  { label: 'Home', href: '/dashboard', icon: LayoutGrid },
  { label: 'Explore', href: '/explore', icon: Compass },
];

const RIGHT_TABS = [
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Market', href: '/marketplace', icon: Store },
];

const AI_TAB = { label: 'AI', href: '/services', icon: Sparkles };

export default function BottomNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const check = () => {
      const overlays = document.querySelectorAll('.fixed.inset-0, [data-modal-overlay]');
      setHidden(overlays.length > 0);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (pathname === '/services') return null;
  if (hidden) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center hide-on-keyboard"
      style={{ zIndex: 100, pointerEvents: 'none', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Floating AI center button — sits above the bar */}
      <Link
        href={AI_TAB.href}
        className="absolute flex items-center justify-center"
        style={{
          top: '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'auto',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Outer dark ring */}
        <div
          className="w-[62px] h-[62px] rounded-full flex items-center justify-center"
          style={{
            background: '#1A1A2E',
            boxShadow: '0 -2px 16px rgba(157,99,246,0.25)',
          }}
        >
          {/* Inner gradient orb */}
          <div
            className="w-[44px] h-[44px] rounded-full flex items-center justify-center ai-orb-glow"
            style={{
              background: 'linear-gradient(135deg, #9D63F6 0%, #B182F8 50%, #FFBD4C 100%)',
            }}
          >
            <Sparkles size={20} className="text-white ai-icon-rock" strokeWidth={2.2} />
          </div>
        </div>
      </Link>

      {/* Main dark nav bar */}
      <nav
        className="relative w-full mx-3 mb-2 flex items-center justify-between rounded-[22px] px-2"
        style={{
          background: '#1A1A2E',
          height: '68px',
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {/* Left tabs */}
        <div className="flex items-center gap-1 flex-1 justify-around pr-8">
          {LEFT_TABS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  background: active ? 'rgba(157,99,246,0.15)' : 'transparent',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.5}
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.5)' }}
                />
                <span
                  className="text-[9px] font-semibold mt-1 leading-none"
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.5)' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center spacer for the floating button */}
        <div className="w-[62px] shrink-0" />

        {/* Right tabs */}
        <div className="flex items-center gap-1 flex-1 justify-around pl-8">
          {RIGHT_TABS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  background: active ? 'rgba(157,99,246,0.15)' : 'transparent',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.5}
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.5)' }}
                />
                <span
                  className="text-[9px] font-semibold mt-1 leading-none"
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.5)' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
