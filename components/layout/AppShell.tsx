'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useAuth } from '@/context/AuthContext';
import NotificationPanel from '@/components/ui/NotificationPanel';

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

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#F8F9FB]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        {!hideTopBar && <TopBar title={title} subtitle={subtitle} onMenuToggle={() => setSidebarOpen(true)} />}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className={hideTopBar ? 'max-w-6xl mx-auto' : 'p-4 md:p-6 max-w-6xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
      <NotificationPanel />
    </div>
  );
}
