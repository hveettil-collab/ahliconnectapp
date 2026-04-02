'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'automation' | 'hr' | 'social' | 'offer' | 'system' | 'approval';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
  link?: string;
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'automation', title: 'Salary Certificate Ready', body: 'Your salary certificate has been generated and signed digitally.', time: '2 min ago', read: false, icon: '📄', color: '#9D63F6', link: '/automations/salary-certificate' },
  { id: 'n2', type: 'approval', title: 'Leave Approved', body: 'Your annual leave (Apr 10–14) has been approved by Ahmed K.', time: '15 min ago', read: false, icon: '✅', color: '#059669', link: '/automations/leave-request' },
  { id: 'n3', type: 'offer', title: 'New Offer: 40% Off Yas Island', body: 'Exclusive IHC employee staycation deal this weekend.', time: '1 hr ago', read: false, icon: '🏝️', color: '#FFBD4C', link: '/offers' },
  { id: 'n4', type: 'social', title: 'FIFA Tournament Update', body: 'You advanced to Round 3! Next match at 6 PM today.', time: '2 hrs ago', read: false, icon: '🎮', color: '#7C3AED' },
  { id: 'n5', type: 'automation', title: 'Expense Claim Processed', body: 'AED 347.50 business dinner expense approved and synced to finance.', time: '3 hrs ago', read: false, icon: '💰', color: '#40C4AA', link: '/automations/expense-claim' },
  { id: 'n6', type: 'hr', title: 'Payslip Available', body: 'Your March 2026 payslip is ready to view.', time: '5 hrs ago', read: true, icon: '💵', color: '#9D63F6' },
  { id: 'n7', type: 'system', title: 'App Update Available', body: 'Ahli Connect v2.1 includes new automation features.', time: '8 hrs ago', read: true, icon: '🚀', color: '#666D80' },
  { id: 'n8', type: 'social', title: 'Marketplace: New Message', body: 'Khalid replied to your iPhone listing.', time: '1 day ago', read: true, icon: '💬', color: '#9D63F6', link: '/chat' },
  { id: 'n9', type: 'offer', title: 'Careem: 30% Off Rides', body: 'Use code IHC30 for discounted business rides this week.', time: '1 day ago', read: true, icon: '🚗', color: '#DC2626' },
  { id: 'n10', type: 'hr', title: 'Training Reminder', body: 'Compliance training due by Apr 15. 2 modules remaining.', time: '2 days ago', read: true, icon: '📚', color: '#EA580C' },
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen(p => !p), []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, isOpen,
      openPanel, closePanel, togglePanel,
      markAsRead, markAllRead, clearNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
