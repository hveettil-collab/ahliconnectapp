'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Compass, Sparkles, Users, Store } from 'lucide-react';

const TABS = [
  { label: 'Home', href: '/dashboard', icon: LayoutGrid },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'AI', href: '/services', icon: Sparkles, isAI: true },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Market', href: '/marketplace', icon: Store },
];

/* ── Light haptic feedback ── */
function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
  try {
    const el = document.getElementById('haptic-trigger') as HTMLInputElement | null;
    if (el) {
      el.style.display = 'block';
      el.focus();
      el.style.display = 'none';
      el.blur();
    }
  } catch {}
}

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

  useEffect(() => {
    if (!document.getElementById('haptic-trigger')) {
      const input = document.createElement('input');
      input.id = 'haptic-trigger';
      input.type = 'text';
      input.readOnly = true;
      input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;width:0;height:0;pointer-events:none;';
      document.body.appendChild(input);
    }
  }, []);

  if (pathname === '/services') return null;
  if (hidden) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  const handleTap = useCallback(() => {
    triggerHaptic();
  }, []);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center hide-on-keyboard"
      style={{ zIndex: 100, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
    >
      <nav
        className="relative flex items-stretch rounded-[28px]"
        style={{
          background: '#1A1A2E',
          height: '64px',
          width: 'calc(100% - 40px)',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {TABS.map(({ label, href, icon: Icon, isAI }) => {
          const active = isActive(href);

          /* ── AI center orb ── */
          if (isAI) {
            return (
              <Link
                key={href}
                href={href}
                onClick={handleTap}
                className="relative flex items-center justify-center active:scale-90 transition-transform duration-150"
                style={{
                  flex: '1 1 0',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                {/* Raised orb */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{ top: '-24px' }}
                >
                  <div
                    className="w-[68px] h-[68px] rounded-full flex items-center justify-center"
                    style={{
                      background: '#1A1A2E',
                      boxShadow: '0 -4px 20px rgba(157,99,246,0.2)',
                    }}
                  >
                    <div
                      className="w-[48px] h-[48px] rounded-full flex items-center justify-center ai-orb-glow"
                      style={{
                        background: 'linear-gradient(135deg, #9D63F6 0%, #B182F8 50%, #FFBD4C 100%)',
                      }}
                    >
                      <Sparkles size={22} className="text-white ai-icon-rock" strokeWidth={2.2} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          }

          /* ── Regular tab ── */
          return (
            <Link
              key={href}
              href={href}
              onClick={handleTap}
              className="flex flex-col items-center justify-center active:scale-90 transition-all duration-150"
              style={{
                flex: '1 1 0',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  padding: '6px 12px',
                  background: active ? 'rgba(157,99,246,0.12)' : 'transparent',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.5}
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.45)' }}
                />
                <span
                  className="text-[9px] font-semibold mt-0.5 leading-none"
                  style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.45)' }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
