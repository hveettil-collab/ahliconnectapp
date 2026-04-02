'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useAuth } from '@/context/AuthContext';
import { useViewMode } from '@/context/ViewModeContext';

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  hideTopBar?: boolean;
}

export default function AppShell({ children, title, subtitle, hideTopBar }: AppShellProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setMobilePreview } = useViewMode();

  // Always set mobile preview mode
  useEffect(() => {
    setMobilePreview(true);
  }, [setMobilePreview]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1B3A6B] to-[#0D1F3C]">
      {/* Phone frame */}
      <div className="relative" style={{ width: 400, height: 820 }}>
        {/* Phone bezel */}
        <div
          className="absolute inset-0 rounded-[50px] shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
          }}
        />
        {/* Screen area */}
        <div
          className="absolute rounded-[40px] overflow-hidden"
          style={{ top: 12, left: 12, right: 12, bottom: 12 }}
        >
          {/* App content — relative container so BottomNav absolute works */}
          <div className="relative w-full h-full bg-[#F4EFE8]">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="min-h-full pb-24">
                {!hideTopBar && <TopBar title={title} subtitle={subtitle} onMenuToggle={() => setSidebarOpen(true)} />}
                <div className={hideTopBar ? '' : 'p-4'}>
                  {children}
                </div>
              </div>
            </div>
            {/* Bottom nav — inside the phone frame */}
            <BottomNav />
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[130px] h-[4px] rounded-full bg-gray-600" />
      </div>

      {/* Sidebar overlay — renders over the phone frame when open */}
      {sidebarOpen && (
        <div className="absolute inset-0 z-[60]" style={{ width: 400, height: 820, position: 'absolute' }}>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]" style={{ width: 376, height: 796 }}>
            <div className="w-full h-full rounded-[40px] overflow-hidden">
              <Sidebar mobileOpen={true} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
