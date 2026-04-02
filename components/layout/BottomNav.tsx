'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Sparkles, ShoppingBag, User } from 'lucide-react';

const LEFT_TABS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Community', href: '/community', icon: Users, isNew: true },
];

const RIGHT_TABS = [
  { label: 'Market', href: '/marketplace', icon: ShoppingBag },
  { label: 'Profile', href: '/profile', icon: User },
];

const AI_TAB = { label: 'AI', href: '/services', icon: Sparkles };

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on AI page
  if (pathname === '/services') return null;

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <style>{`
        @keyframes center-orb-glow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(100, 80, 220, 0.35), 0 0 40px rgba(100, 80, 220, 0.15);
          }
          50% {
            box-shadow: 0 6px 28px rgba(100, 80, 220, 0.5), 0 0 50px rgba(100, 80, 220, 0.2);
          }
        }
        @keyframes center-orb-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .center-orb-glow {
          animation: center-orb-glow 3s ease-in-out infinite;
        }
        .center-orb-shimmer {
          animation: center-orb-shimmer 4s ease-in-out infinite;
          background-size: 200% 200%;
        }
      `}</style>

      <div className="relative flex items-end justify-center px-4 pb-3 pt-0">

        {/* ── Left pill ── */}
        <div
          className="flex items-center gap-1 rounded-full px-2 py-2"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          {LEFT_TABS.map(({ label, href, icon: Icon, isNew }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative shrink-0 flex flex-col items-center justify-center w-[52px] h-[48px] rounded-full transition-all duration-200"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.4}
                  style={{ color: active ? '#15161E' : '#C4C9D4' }}
                />
                {active && (
                  <div className="w-1 h-1 rounded-full mt-1" style={{ background: '#6450DC' }} />
                )}
                {isNew && !active && (
                  <span
                    className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#6450DC', boxShadow: '0 0 4px rgba(100,80,220,0.5)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Center floating AI orb ── */}
        <div className="relative mx-3 -mb-0.5" style={{ marginTop: '-18px' }}>
          {/* Glow backdrop */}
          <div
            className="absolute inset-0 rounded-full center-orb-glow"
            style={{
              width: 62, height: 62,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(100,80,220,0.25) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
          <Link
            href={AI_TAB.href}
            className="relative block"
          >
            <div
              className="center-orb-shimmer w-[58px] h-[58px] rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8B6CF6 0%, #6450DC 35%, #3B82F6 65%, #818CF8 100%)',
                boxShadow: '0 4px 20px rgba(100,80,220,0.35), 0 0 0 3px rgba(255,255,255,0.8), inset 0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              <Sparkles size={24} className="text-white" strokeWidth={2} />
            </div>
          </Link>
        </div>

        {/* ── Right pill ── */}
        <div
          className="flex items-center gap-1 rounded-full px-2 py-2"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          {RIGHT_TABS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="shrink-0 flex flex-col items-center justify-center w-[52px] h-[48px] rounded-full transition-all duration-200"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.4}
                  style={{ color: active ? '#15161E' : '#C4C9D4' }}
                />
                {active && (
                  <div className="w-1 h-1 rounded-full mt-1" style={{ background: '#6450DC' }} />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
