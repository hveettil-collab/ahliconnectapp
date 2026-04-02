'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { COMPANIES, MARKETPLACE_LISTINGS, OFFERS } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import { CheckCircle2, MapPin, Mail, Briefcase, Building2, Hash, Edit2, Shield, Tag, ShoppingBag, Settings, Bell, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

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
