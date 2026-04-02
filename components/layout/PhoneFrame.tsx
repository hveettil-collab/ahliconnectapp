'use client';
import { ReactNode } from 'react';

/**
 * Wraps content in the iPhone-style phone frame.
 * Used for pages that don't use AppShell (landing, login, signup, verify).
 */
export default function PhoneFrame({ children, bgColor = '#F4EFE8' }: { children: ReactNode; bgColor?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1B3A6B] to-[#0D1F3C]">
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
          {/* Status bar */}
          <div className="relative z-50 flex items-center justify-between px-6" style={{ height: 44, paddingTop: 12, backgroundColor: bgColor }}>
            <span className="text-xs font-semibold text-[#1A1A2E]">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><rect x="0" y="4" width="3" height="7" rx="0.5" fill="#1A1A2E"/><rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" fill="#1A1A2E"/><rect x="9" y="1" width="3" height="10" rx="0.5" fill="#1A1A2E"/><rect x="13" y="0" width="3" height="11" rx="0.5" fill="#1A1A2E"/></svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M7.5 2.5C9.43 2.5 11.18 3.32 12.42 4.63L13.84 3.21C12.27 1.56 10.01 0.5 7.5 0.5C4.99 0.5 2.73 1.56 1.16 3.21L2.58 4.63C3.82 3.32 5.57 2.5 7.5 2.5ZM7.5 5.5C8.62 5.5 9.64 5.94 10.41 6.65L11.83 5.23C10.7 4.17 9.18 3.5 7.5 3.5C5.82 3.5 4.3 4.17 3.17 5.23L4.59 6.65C5.36 5.94 6.38 5.5 7.5 5.5ZM7.5 8.5C6.95 8.5 6.45 8.72 6.09 9.09L7.5 10.5L8.91 9.09C8.55 8.72 8.05 8.5 7.5 8.5Z" fill="#1A1A2E"/></svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0" y="1" width="22" height="10" rx="2" stroke="#1A1A2E" strokeWidth="1"/><rect x="1.5" y="2.5" width="17" height="7" rx="1" fill="#1A1A2E"/><rect x="23" y="4" width="2" height="4" rx="0.5" fill="#1A1A2E"/></svg>
            </div>
          </div>
          {/* Content */}
          <div className="w-full overflow-y-auto" style={{ height: 'calc(100% - 44px)', backgroundColor: bgColor }}>
            {children}
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[130px] h-[4px] rounded-full bg-gray-600" />
      </div>
    </div>
  );
}
