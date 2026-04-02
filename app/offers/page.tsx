'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { OFFERS } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { Tag, Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Property', 'Insurance', 'Healthcare', 'Mobility', 'Wellness', 'Food & Dining'];

export default function OffersPage() {
  const { user } = useAuth();
  const [cat, setCat] = useState('All');

  const filtered = OFFERS.filter(o => {
    const matchCat = cat === 'All' || o.category === cat;
    return matchCat;
  });

  return (
    <AppShell title="Employee Offers" subtitle="Exclusive benefits for IHC employees">
      <div className="space-y-5">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${
                cat === c ? 'bg-[#1B3A6B] text-white' : 'bg-white border border-[#E8E2D9] text-[#6B7280] hover:bg-[#F4EFE8]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="text-sm text-[#9CA3AF]">{filtered.length} offer{filtered.length !== 1 ? 's' : ''} available</p>

        {/* Featured */}
        {cat === 'All' && (
          <>
            <h3 className="text-sm font-bold text-[#1A1A2E]">Featured Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {filtered.filter(o => o.featured).map(offer => (
                <div key={offer.id} className="rounded-[20px] overflow-hidden border border-[#E8E2D9] bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: offer.color }}>
                        {offer.company.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#1B3A6B] bg-[#E8EFF8] px-2.5 py-1 rounded-full shrink-0">
                        Employee Only
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1A1A2E] mb-1">{offer.title}</h3>
                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold" style={{ color: offer.color }}>{offer.value}</span>
                      <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                        <Clock size={11} /> {offer.expires}
                      </div>
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-sm font-semibold text-white transition-all active:scale-[0.98]"
                      style={{ background: offer.color }}>
                      Claim Offer <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-bold text-[#1A1A2E] mt-4">All Offers</h3>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(cat === 'All' ? filtered.filter(o => !o.featured) : filtered).map(offer => (
            <div key={offer.id} className="bg-white rounded-[20px] border border-[#E8E2D9] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <img src={offer.image} alt={offer.title} className="w-full h-32 object-cover" />
              <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: offer.color }}>
                  {offer.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">{offer.company}</p>
                  <p className="text-xs font-semibold" style={{ color: offer.color }}>{offer.category}</p>
                </div>
              </div>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-1">{offer.title}</h3>
              <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{offer.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: offer.color }}>{offer.value}</span>
                <span className="text-xs font-semibold text-[#1B3A6B] bg-[#E8EFF8] px-2 py-0.5 rounded-full">Claim →</span>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
