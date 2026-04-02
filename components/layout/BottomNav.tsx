'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, ShoppingBag, User } from 'lucide-react';

const TABS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'AI', href: '/services', icon: Sparkles, isAI: true },
  { label: 'Market', href: '/marketplace', icon: ShoppingBag },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on AI page
  if (pathname === '/services') return null;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center">
      {/* Inline keyframes for AI orb animation */}
      <style>{`
        @keyframes ai-orb-glow {
          0%, 100% {
            box-shadow: 0 6px 18px 0 rgba(27, 58, 107, 0.25);
          }
          50% {
            box-shadow: 0 8px 24px 0 rgba(200, 151, 58, 0.35), 0 0 12px 2px rgba(200, 151, 58, 0.15);
          }
        }
        @keyframes ai-icon-rock {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(6deg) scale(1.08); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-6deg) scale(1.08); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .ai-orb-glow {
          animation: ai-orb-glow 2.4s ease-in-out infinite;
        }
        .ai-icon-rock {
          animation: ai-icon-rock 3s ease-in-out infinite;
        }
      `}</style>

      <nav
        className="flex items-center gap-1.5 rounded-full px-1.5 py-1.5"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
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
                className="relative shrink-0 flex items-center justify-center"
              >
                <div
                  className="ai-orb-glow w-[52px] h-[52px] rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 50%, #C8973A 100%)',
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
              className="shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-full transition-all duration-200"
              style={{
                background: active ? '#F4EFE8' : 'transparent',
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                style={{
                  color: active ? '#1B3A6B' : '#9CA3AF',
                }}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
