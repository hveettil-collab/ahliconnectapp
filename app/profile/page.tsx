'use client';
import { useState, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { COMPANIES, MARKETPLACE_LISTINGS, OFFERS } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import { CheckCircle2, MapPin, Mail, Briefcase, Building2, Hash, Edit2, Shield, Tag, ShoppingBag, Settings, Bell, LogOut, Share2, QrCode, Phone, Globe, Link2, Copy, Check, RotateCcw } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  if (!user) return null;
  const company = COMPANIES.find(c => c.id === user.companyId);
  const myListings = MARKETPLACE_LISTINGS.slice(0, 2);
  const savedOffers = OFFERS.slice(0, 3);

  const SETTINGS = [
    { icon: Bell, label: 'Notification Preferences', desc: 'Manage alerts & emails' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, 2FA, sessions' },
    { icon: Settings, label: 'App Preferences', desc: 'Language, theme, display' },
  ];

  return (
    <AppShell title="My Profile" subtitle={user.employeeId}>
      <div className="grid grid-cols-1 gap-4">
        {/* Left: Profile card */}
        <div className="space-y-4">
          {/* Main card */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-[#9D63F6] to-[#7B4FB5]" />
            <div className="px-5 pb-5">
              <div className="-mt-8 mb-4 flex items-end justify-between">
                <div className="ring-4 ring-white rounded-full">
                  <Avatar initials={user.avatar} color={company?.color || '#9D63F6'} size="xl" image={user.image} />
                </div>
                <button className="flex items-center gap-1.5 bg-[#F8F9FB] text-[#9D63F6] text-xs font-semibold px-3 py-2 rounded-[10px] hover:bg-[#F7F1FF] transition-colors mt-2">
                  <Edit2 size={12} /> Edit
                </button>
              </div>

              <h2 className="text-lg font-bold text-[#15161E] mb-0.5">{user.name}</h2>
              <p className="text-sm text-[#666D80] mb-3">{user.title}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Verified Employee
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F7F1FF] text-[#9D63F6] text-xs font-semibold px-3 py-1 rounded-full">
                  {company?.short}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Building2, value: user.company },
                  { icon: Briefcase, value: user.department },
                  { icon: Hash, value: user.employeeId },
                  { icon: Mail, value: user.email },
                  { icon: MapPin, value: user.location },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2.5 text-sm text-[#666D80]">
                    <Icon size={14} className="text-[#A4ABB8] shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              DIGITAL BUSINESS CARD — Ultra Modern
              ═══════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode size={15} className="text-[#9D63F6]" strokeWidth={2} />
                <h3 className="text-[15px] font-bold text-[#15161E]">Digital Business Card</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="w-8 h-8 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-center hover:bg-[#F7F1FF] transition-colors"
                >
                  <RotateCcw size={13} className="text-[#666D80]" />
                </button>
                <button
                  onClick={() => setShowShareSheet(true)}
                  className="flex items-center gap-1.5 bg-[#9D63F6] text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:bg-[#7C3AED] transition-colors"
                >
                  <Share2 size={12} /> Share
                </button>
              </div>
            </div>

            {/* Card container with 3D flip */}
            <div className="relative" style={{ perspective: '1200px', height: '220px' }}>
              <div
                className="absolute inset-0 transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* ── FRONT SIDE ── */}
                <div
                  className="absolute inset-0 rounded-[22px] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, #15161E 0%, #2D1B69 40%, #9D63F6 100%)',
                  }}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{
                      background: 'radial-gradient(circle, #FFBD4C, transparent)',
                      transform: 'translate(30%, -30%)',
                    }} />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-8" style={{
                      background: 'radial-gradient(circle, #54B6ED, transparent)',
                      transform: 'translate(-20%, 20%)',
                    }} />
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }} />
                  </div>

                  {/* Card content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    {/* Top row — Logo + company */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <span className="text-[8px] font-bold text-white tracking-wider">IHC</span>
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px] font-medium tracking-wide uppercase">{company?.short || 'IHC Group'}</p>
                          <p className="text-white/70 text-[10px] font-semibold">{user.company}</p>
                        </div>
                      </div>
                      {/* NFC indicator */}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#40C4AA] animate-pulse" />
                        <span className="text-[8px] text-white/50 font-semibold">NFC</span>
                      </div>
                    </div>

                    {/* Middle — Name & title */}
                    <div>
                      <h3 className="text-white text-[20px] font-bold leading-tight tracking-tight">{user.name}</h3>
                      <p className="text-[#FFBD4C] text-[12px] font-semibold mt-0.5">{user.title}</p>
                    </div>

                    {/* Bottom row — Contact info */}
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail size={10} className="text-white/40" />
                          <p className="text-white/60 text-[10px]">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={10} className="text-white/40" />
                          <p className="text-white/60 text-[10px]">+971 50 XXX XXXX</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-white/40" />
                          <p className="text-white/60 text-[10px]">{user.location}</p>
                        </div>
                      </div>
                      {/* Mini QR placeholder */}
                      <div className="w-14 h-14 rounded-[10px] p-1.5 flex items-center justify-center" style={{
                        background: 'rgba(255,255,255,0.95)',
                      }}>
                        <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1px]">
                          {/* Simplified QR pattern */}
                          {[
                            1,1,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,1,1
                          ].map((filled, idx) => (
                            <div key={idx} className="rounded-[1px]" style={{
                              background: filled ? '#15161E' : 'transparent',
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BACK SIDE ── */}
                <div
                  className="absolute inset-0 rounded-[22px] overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, #F8F9FB 0%, #fff 50%, #F7F1FF 100%)',
                  }}>
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: 'linear-gradient(rgba(157,99,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(157,99,246,0.2) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                  </div>

                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-5" style={{
                    border: '1px solid #DFE1E6',
                    borderRadius: '22px',
                  }}>
                    {/* Large QR Code */}
                    <div className="w-28 h-28 rounded-[14px] p-2 bg-white shadow-sm border border-[#DFE1E6] mb-3">
                      <div className="w-full h-full grid grid-cols-9 grid-rows-9 gap-[1px]">
                        {[
                          1,1,1,1,1,0,1,1,1,
                          1,0,0,0,1,0,1,0,1,
                          1,0,1,0,1,0,1,0,1,
                          1,0,0,0,1,0,1,0,1,
                          1,1,1,1,1,0,1,1,1,
                          0,0,0,0,0,0,0,0,0,
                          1,1,1,0,1,0,1,0,1,
                          0,1,0,1,0,1,0,1,0,
                          1,0,1,1,1,0,1,1,1,
                        ].map((filled, idx) => (
                          <div key={idx} className="rounded-[1px]" style={{
                            background: filled ? '#15161E' : '#F8F9FB',
                          }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#15161E] text-[13px] font-bold">Scan to connect</p>
                    <p className="text-[#A4ABB8] text-[10px] mt-0.5">Ahli Connect · {user.employeeId}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-7 h-7 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-center">
                        <Mail size={12} className="text-[#666D80]" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-center">
                        <Phone size={12} className="text-[#666D80]" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-center">
                        <Link2 size={12} className="text-[#666D80]" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-center">
                        <Globe size={12} className="text-[#666D80]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick share actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${user.name} | ${user.title} | ${user.company} | ${user.email}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] border border-[#DFE1E6] bg-white text-[11px] font-semibold text-[#15161E] hover:bg-[#F8F9FB] transition-all active:scale-[0.97]"
              >
                {copied ? <Check size={13} className="text-[#40C4AA]" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy details'}
              </button>
              <button
                onClick={() => setShowShareSheet(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] bg-[#15161E] text-[11px] font-bold text-white hover:bg-[#2D1B69] transition-all active:scale-[0.97]"
              >
                <Share2 size={13} /> Share card
              </button>
            </div>
          </div>

          {/* Share Bottom Sheet */}
          {showShareSheet && (
            <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
              <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-5" />
                <h3 className="text-[16px] font-bold text-[#15161E] mb-1">Share Business Card</h3>
                <p className="text-[13px] text-[#666D80] mb-5">Send your digital card to colleagues within IHC Group</p>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: Mail, label: 'Email', color: '#9D63F6', bg: '#F7F1FF' },
                    { icon: Copy, label: 'Copy Link', color: '#40C4AA', bg: '#E7FEF8' },
                    { icon: QrCode, label: 'QR Code', color: '#15161E', bg: '#F8F9FB' },
                    { icon: Share2, label: 'More', color: '#FFBD4C', bg: '#FFF6E0' },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <button key={label} className="flex flex-col items-center gap-2 py-3 rounded-[14px] hover:bg-[#F8F9FB] transition-colors active:scale-[0.95]">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: bg }}>
                        <Icon size={20} style={{ color }} strokeWidth={1.8} />
                      </div>
                      <p className="text-[10px] font-semibold text-[#15161E]">{label}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowShareSheet(false)}
                  className="w-full border border-[#DFE1E6] text-[#666D80] font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#F8F9FB] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F8F9FB]">
              <p className="text-sm font-bold text-[#15161E]">Settings</p>
            </div>
            {SETTINGS.map(({ icon: Icon, label, desc }) => (
              <button key={label} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F9FB] transition-colors text-left border-b border-[#F8F9FB] last:border-0">
                <div className="w-9 h-9 rounded-[10px] bg-[#F8F9FB] flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-[#666D80]" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#15161E]">{label}</p>
                  <p className="text-xs text-[#A4ABB8]">{desc}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-red-50 flex items-center justify-center shrink-0">
                <LogOut size={15} className="text-red-500" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium text-red-500">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right: Activity */}
        <div className="space-y-4">
          {/* Saved Offers */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-[#9D63F6]" strokeWidth={1.8} />
              <h3 className="text-sm font-bold text-[#15161E]">Saved Offers</h3>
            </div>
            <div className="space-y-3">
              {savedOffers.map(offer => (
                <div key={offer.id} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6]">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: offer.color }}>
                    {offer.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#15161E] truncate">{offer.title}</p>
                    <p className="text-xs font-medium" style={{ color: offer.color }}>{offer.value}</p>
                  </div>
                  <span className="text-xs text-[#A4ABB8] shrink-0">{offer.company}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Listings */}
          <div className="bg-white rounded-[20px] border border-[#DFE1E6] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#9D63F6]" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-[#15161E]">My Listings</h3>
              </div>
              <span className="text-xs text-[#A4ABB8] bg-[#F8F9FB] px-2.5 py-1 rounded-full">{myListings.length} active</span>
            </div>
            <div className="space-y-3">
              {myListings.map(listing => (
                <div key={listing.id} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6]">
                  <img src={listing.image} alt={listing.title} className="w-11 h-11 rounded-[12px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#15161E] truncate">{listing.title}</p>
                    <p className="text-sm font-bold text-[#9D63F6]">{listing.price}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout bottom sheet */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white w-full max-w-md rounded-t-[28px] p-6 shadow-2xl">
            <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mb-6" />
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <LogOut size={28} className="text-red-500" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-[#15161E] mb-2">Sign Out?</h3>
              <p className="text-sm text-[#666D80]">You'll need to sign in again to access Ahli Connect.</p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={logout}
                className="w-full bg-[#9D63F6] text-white font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#152E56] transition-all"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="w-full border border-[#DFE1E6] text-[#666D80] font-semibold py-3.5 rounded-[14px] text-sm hover:bg-[#F8F9FB] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
