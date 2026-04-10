'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: '#F8F9FB' }}>
      <div className="w-20 h-20 rounded-full bg-[#F0EEFF] flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9D63F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h1 className="text-[22px] font-bold text-[#15161E] mb-2">You&apos;re Offline</h1>
      <p className="text-[14px] text-[#666D80] leading-relaxed mb-6 max-w-xs">
        It looks like you&apos;ve lost your internet connection. Please check your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-full text-[14px] font-bold text-white active:scale-95 transition-all"
        style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)', boxShadow: '0 4px 16px rgba(157,99,246,0.3)' }}
      >
        Try Again
      </button>
    </div>
  );
}
