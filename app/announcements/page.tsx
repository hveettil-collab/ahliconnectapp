'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { IHC_ANNOUNCEMENTS, COMPANY_ANNOUNCEMENTS, COMPANIES } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { Megaphone, Building2, Users } from 'lucide-react';

const ALL_ANNS = [
  ...IHC_ANNOUNCEMENTS,
  ...Object.values(COMPANY_ANNOUNCEMENTS).flat(),
];

const TABS = [
  { label: 'All', value: 'all', icon: Megaphone },
  { label: 'IHC Group', value: 'group', icon: Users },
  { label: 'My Company', value: 'company', icon: Building2 },
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('all');

  const companyAnns = COMPANY_ANNOUNCEMENTS[user?.companyId || ''] || [];

  const filtered = ALL_ANNS.filter(a => {
    if (tab === 'all') return a.type === 'group' || a.tag === user?.company;
    if (tab === 'group') return a.type === 'group';
    if (tab === 'company') return a.tag === user?.company;
    return true;
  });

  const colors: Record<string, string> = {
    Financial: '#9D63F6', HR: '#7C3AED', Events: '#40C4AA',
    Compliance: '#DC2626', Offers: '#FFBD4C', Property: '#FFBD4C',
    Wellness: '#40C4AA', Rewards: '#EA580C',
  };

  return (
    <AppShell title="Announcements" subtitle="Group & company updates">
      <div className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-[14px] border border-[#DFE1E6] p-1.5 w-fit">
          {TABS.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
                tab === value ? 'bg-[#9D63F6] text-white shadow-sm' : 'text-[#666D80] hover:bg-[#F8F9FB]'
              }`}
            >
              <Icon size={14} strokeWidth={tab === value ? 2.2 : 1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-[#A4ABB8]">{filtered.length} announcement{filtered.length !== 1 ? 's' : ''}</p>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map(ann => {
            const color = colors[ann.category] || '#9D63F6';
            return (
              <div key={ann.id} className="bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden hover:shadow-md transition-all cursor-pointer">
                {ann.image && (
                  <img src={ann.image} alt={ann.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0" style={{ background: color + '15' }}>
                    <Megaphone size={18} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: color + '15', color }}>
                        {ann.tag}
                      </span>
                      <span className="text-xs text-[#A4ABB8] bg-[#F8F9FB] px-2 py-0.5 rounded-full">{ann.category}</span>
                      {ann.urgent && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Urgent</span>}
                    </div>
                    <h3 className="text-base font-bold text-[#15161E] mb-1.5">{ann.title}</h3>
                    <p className="text-sm text-[#666D80] leading-relaxed">{ann.summary}</p>
                    <p className="text-xs text-[#A4ABB8] mt-3">{ann.date}</p>
                  </div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
