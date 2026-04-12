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

  const handleTap = useCallback(() => {
    triggerHaptic();
  }, []);

  return (
    <div
      className="md:hidden fixed bottom-4 left-4 right-4 flex justify-center hide-on-keyboard"
      style={{ zIndex: 100, pointerEvents: 'auto' }}
    >
      <nav
        className="flex items-center gap-1 rounded-full px-1.5 py-1.5"
        style={{
          background: '#1A1A2E',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {TABS.map(({ label, href, icon: Icon, isAI }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

          /* ── AI tab — center orb ── */
          if (isAI) {
            return (
              <Link
                key={href}
                href={href}
                onClick={handleTap}
                className="relative shrink-0 flex items-center justify-center active:scale-90 transition-transform duration-150"
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
              onClick={handleTap}
              className="shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-full transition-all duration-200 relative active:scale-90"
              style={{
                background: active ? 'rgba(157,99,246,0.15)' : 'transparent',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.5}
                style={{
                  color: active ? '#9D63F6' : 'rgba(255,255,255,0.45)',
                }}
              />
              <span
                className="text-[8px] font-semibold mt-0.5 leading-none"
                style={{ color: active ? '#9D63F6' : 'rgba(255,255,255,0.45)' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
