'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Sparkles, ShoppingBag, User } from 'lucide-react';

const TABS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Community', href: '/community', icon: Users, isNew: true },
  { label: 'AI', href: '/services', icon: Sparkles, isAI: true },
  { label: 'Market', href: '/marketplace', icon: ShoppingBag },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  // Hide nav when any modal/overlay (fixed inset-0 z-30+/z-50+) is open
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

  // Hide bottom nav on AI page
  if (pathname === '/services') return null;
  if (hidden) return null;

  return (
    <div
      className="md:hidden fixed bottom-4 left-4 right-4 flex justify-center hide-on-keyboard"
      style={{ zIndex: 100, pointerEvents: 'auto' }}
    >
      <nav
        className="flex items-center gap-1 rounded-full px-1.5 py-1.5"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {TABS.map(({ label, href, icon: Icon, isAI, isNew }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

          /* ── AI tab — center orb ── */
          if (isAI) {
            return (
              <Link
                key={href}
                href={href}
                className="relative shrink-0 flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <div
                  className="ai-orb-glow w-[52px] h-[52px] rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #9D63F6 0%, #B182F8 50%, #FFBD4C 100%)',
                  }}
                >
                  <Sparkles size={22} className="text-white ai-icon-rock" strokeWidth={2} />
                </div>
              </Link>
            );
          }

          /* ── Regular tabs ── */
          return (
            <Link
              key={href}
              href={href}
              className="shrink-0 flex flex-col items-center justify-center w-[56px] h-[56px] rounded-full transition-all duration-200 relative"
              style={{
                background: active ? '#F8F9FB' : 'transparent',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                style={{
                  color: active ? '#9D63F6' : '#A4ABB8',
                }}
              />
              {isNew && !active && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: '#9D63F6', boxShadow: '0 0 6px rgba(157,99,246,0.5)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
