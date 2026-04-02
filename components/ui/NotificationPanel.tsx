'use client';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { X, CheckCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';

function NotificationItem({ n, onRead, onClear }: { n: Notification; onRead: () => void; onClear: () => void }) {
  const content = (
    <div
      className={`flex items-start gap-3 p-3 rounded-[14px] transition-colors ${n.read ? 'bg-white' : 'bg-[#F0EDFF]'}`}
      onClick={onRead}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base"
        style={{ background: `${n.color}15` }}
      >
        {n.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[13px] leading-tight ${n.read ? 'font-medium text-[#6B7280]' : 'font-semibold text-[#1A1A2E]'}`}>
            {n.title}
          </p>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
            className="shrink-0 p-1 rounded-md hover:bg-[#F4EFE8] text-[#9CA3AF] hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
        <p className="text-[11px] text-[#9CA3AF] leading-snug mt-0.5 line-clamp-2">{n.body}</p>
        <p className="text-[10px] text-[#C0B8A8] mt-1">{n.time}</p>
      </div>
      {!n.read && (
        <div className="w-2 h-2 rounded-full bg-[#1B3A6B] shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (n.link) {
    return <Link href={n.link} className="block">{content}</Link>;
  }
  return content;
}

export default function NotificationPanel() {
  const { notifications, unreadCount, isOpen, closePanel, markAsRead, markAllRead, clearNotification } = useNotifications();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[80]" onClick={closePanel} />

      {/* Panel — slides up from bottom like a mobile sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[90] flex justify-center pointer-events-none">
        <div
          className="w-full max-w-[376px] pointer-events-auto bg-white rounded-t-[24px] shadow-2xl flex flex-col"
          style={{ maxHeight: '85vh', animation: 'slideUp 0.3s ease-out' }}
        >
          <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#F4EFE8]">
            <div>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#1B3A6B] bg-[#E8EFF8] px-2.5 py-1.5 rounded-full hover:bg-[#D6E4F5] transition-colors"
                >
                  <CheckCheck size={12} />
                  Read all
                </button>
              )}
              <button
                onClick={closePanel}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-3xl mb-3">🔔</div>
                <p className="text-sm font-medium text-[#6B7280]">All caught up!</p>
                <p className="text-xs text-[#9CA3AF] mt-1">No notifications right now.</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  onRead={() => { markAsRead(n.id); if (n.link) closePanel(); }}
                  onClear={() => clearNotification(n.id)}
                />
              ))
            )}
          </div>

          {/* Handle bar */}
          <div className="flex justify-center pb-3 pt-1">
            <div className="w-10 h-1 rounded-full bg-[#E8E2D9]" />
          </div>
        </div>
      </div>
    </>
  );
}
