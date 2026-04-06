'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { OFFERS } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import {
  Tag, Clock, ArrowRight, CheckCircle2, X, Star, Sparkles,
  Shield, Heart, Car, Home, UtensilsCrossed, Dumbbell,
  ChevronRight, Bookmark, BookmarkCheck, Share2, Wallet,
  ExternalLink, Gift,
} from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { label: 'All', icon: Sparkles },
  { label: 'Property', icon: Home },
  { label: 'Insurance', icon: Shield },
  { label: 'Healthcare', icon: Heart },
  { label: 'Mobility', icon: Car },
  { label: 'Wellness', icon: Dumbbell },
  { label: 'Food & Dining', icon: UtensilsCrossed },
];

export default function OffersPage() {
  const { user } = useAuth();
  const wallet = useWallet();
  const [cat, setCat] = useState('All');
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selectedOffer, setSelectedOffer] = useState<typeof OFFERS[0] | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useBodyScrollLock(!!selectedOffer);

  const filtered = OFFERS.filter(o => cat === 'All' || o.category === cat);
  const featured = filtered.filter(o => o.featured);
  const regular = cat === 'All' ? filtered.filter(o => !o.featured) : filtered;

  const handleClaim = (offerId: string) => {
    setClaimed(prev => new Set(prev).add(offerId));
    setClaimSuccess(true);
    // Award bonus points for claiming offers
    wallet.addRewardPoints(25, 'Offer Claimed — Engagement Bonus', 'engagement');
    setTimeout(() => setClaimSuccess(false), 2000);
  };

  const toggleSave = (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation();
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(offerId)) next.delete(offerId);
      else next.add(offerId);
      return next;
    });
  };

  return (
    <AppShell title="Offers" subtitle="Exclusive benefits">
      <div className="space-y-5">

        {/* ═══ WALLET BANNER ═══ */}
        <Link href="/profile" className="no-underline block">
          <div className="rounded-[18px] p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #15161E 0%, #2D1B69 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(157,99,246,0.2)' }}>
                <Wallet size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 font-medium">Pay with Ahli Wallet</p>
                <p className="text-[16px] font-bold text-white">AED {wallet.balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${wallet.rewardTierColor}25` }}>
              <Star size={10} style={{ color: wallet.rewardTierColor }} />
              <span className="text-[10px] font-bold" style={{ color: wallet.rewardTierColor }}>{wallet.rewardPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </Link>

        {/* ═══ CATEGORY CHIPS ═══ */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map(c => {
            const isActive = cat === c.label;
            const CIcon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => setCat(c.label)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95"
                style={{
                  background: isActive ? '#9D63F6' : 'white',
                  color: isActive ? '#FFFFFF' : '#666D80',
                  border: isActive ? 'none' : '1px solid #DFE1E6',
                }}
              >
                <CIcon size={13} strokeWidth={isActive ? 2.2 : 1.6} />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#A4ABB8] font-medium">{filtered.length} offer{filtered.length !== 1 ? 's' : ''} available</p>
          <div className="flex items-center gap-1">
            <Gift size={12} className="text-[#9D63F6]" />
            <p className="text-[11px] font-semibold text-[#9D63F6]">+25 pts per claim</p>
          </div>
        </div>

        {/* ═══ FEATURED OFFERS ═══ */}
        {cat === 'All' && featured.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#FFBD4C]" />
              <h3 className="text-[14px] font-bold text-[#15161E]">Featured</h3>
            </div>

            <div className="space-y-3">
              {featured.map(offer => {
                const isClaimed = claimed.has(offer.id);
                const isSaved = saved.has(offer.id);
                return (
                  <div key={offer.id} onClick={() => setSelectedOffer(offer)}
                    className="rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all cursor-pointer">
                    {/* Image with overlay */}
                    <div className="relative h-[160px]">
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Save button */}
                      <button onClick={(e) => toggleSave(e, offer.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md"
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        {isSaved ? <BookmarkCheck size={14} className="text-[#FFBD4C]" /> : <Bookmark size={14} className="text-white" />}
                      </button>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-bold text-white px-2.5 py-1 rounded-full backdrop-blur-md"
                          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {offer.category}
                        </span>
                      </div>
                      {/* Bottom info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-white/60 font-medium">{offer.company}</p>
                          <p className="text-[15px] font-bold text-white leading-snug">{offer.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <p className="text-[12px] text-[#666D80] leading-relaxed mb-3 line-clamp-2">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[15px] font-bold" style={{ color: offer.color }}>{offer.value}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock size={10} className="text-[#A4ABB8]" />
                            <span className="text-[10px] text-[#A4ABB8]">{offer.expires}</span>
                          </div>
                        </div>
                        {isClaimed ? (
                          <div className="flex items-center gap-1.5 bg-[#E7FEF8] text-[#059669] px-3 py-1.5 rounded-full">
                            <CheckCircle2 size={13} />
                            <span className="text-[11px] font-bold">Claimed</span>
                          </div>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleClaim(offer.id); }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold text-white active:scale-95 transition-all"
                            style={{ background: offer.color }}>
                            Claim <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ ALL / FILTERED OFFERS ═══ */}
        <section>
          {cat === 'All' && <h3 className="text-[14px] font-bold text-[#15161E] mb-3">All Offers</h3>}
          <div className="space-y-2.5">
            {regular.map(offer => {
              const isClaimed = claimed.has(offer.id);
              const isSaved = saved.has(offer.id);
              return (
                <div key={offer.id} onClick={() => setSelectedOffer(offer)}
                  className="bg-white rounded-[18px] border border-[#DFE1E6] p-3.5 flex gap-3.5 active:scale-[0.98] transition-all cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative w-[88px] h-[88px] rounded-[14px] overflow-hidden shrink-0">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5">
                      <div className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[8px] font-bold text-white" style={{ background: offer.color }}>
                        {offer.company.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#A4ABB8] font-medium">{offer.company} · {offer.category}</p>
                          <p className="text-[13px] font-bold text-[#15161E] leading-snug mt-0.5 line-clamp-1">{offer.title}</p>
                        </div>
                        <button onClick={(e) => toggleSave(e, offer.id)} className="shrink-0 mt-0.5">
                          {isSaved ? <BookmarkCheck size={16} className="text-[#FFBD4C]" /> : <Bookmark size={16} className="text-[#DFE1E6]" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[12px] font-bold" style={{ color: offer.color }}>{offer.value}</p>
                      {isClaimed ? (
                        <span className="text-[10px] font-bold text-[#059669] bg-[#E7FEF8] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Claimed
                        </span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleClaim(offer.id); }}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white active:scale-95 transition-all"
                          style={{ background: offer.color }}>
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ═══ OFFER DETAIL BOTTOM SHEET ═══ */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOffer(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto">
            {/* Hero */}
            <div className="relative h-52 overflow-hidden rounded-t-[28px]">
              <img src={selectedOffer.image} alt={selectedOffer.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button onClick={() => setSelectedOffer(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: selectedOffer.color }}>{selectedOffer.category}</span>
                <span className="text-[10px] font-medium text-white/70 px-2.5 py-1 rounded-full border border-white/20"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                  Employee Exclusive
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[9px] font-bold text-white" style={{ background: selectedOffer.color }}>
                    {selectedOffer.company.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-white/60 text-[11px] font-medium">{selectedOffer.company}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">{selectedOffer.title}</h2>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Value highlight */}
              <div className="rounded-[16px] p-4 text-center" style={{ background: `${selectedOffer.color}08`, border: `1px solid ${selectedOffer.color}20` }}>
                <p className="text-[10px] text-[#A4ABB8] font-medium uppercase tracking-wider mb-1">Your Employee Benefit</p>
                <p className="text-[22px] font-extrabold" style={{ color: selectedOffer.color }}>{selectedOffer.value}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-[13px] font-bold text-[#15161E] mb-2">About This Offer</h3>
                <p className="text-[13px] text-[#666D80] leading-relaxed">{selectedOffer.description}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Provider', value: selectedOffer.company },
                  { label: 'Category', value: selectedOffer.category },
                  { label: 'Expires', value: selectedOffer.expires },
                  { label: 'Eligibility', value: 'All IHC Employees' },
                ].map(d => (
                  <div key={d.label} className="bg-[#F8F9FB] rounded-[12px] p-3 border border-[#DFE1E6]">
                    <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{d.label}</p>
                    <p className="text-[12px] font-bold text-[#15161E] mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Terms */}
              <div className="bg-[#FFF9EC] rounded-[14px] p-3.5 border border-[#FDE68A]">
                <p className="text-[10px] font-semibold text-[#92400E] mb-1">Terms & Conditions</p>
                <p className="text-[10px] text-[#92400E]/70 leading-relaxed">Valid for verified IHC Group employees only. Cannot be combined with other offers. Subject to availability. The company reserves the right to modify or withdraw this offer.</p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pb-4">
                {!claimed.has(selectedOffer.id) ? (
                  <button onClick={() => handleClaim(selectedOffer.id)}
                    className="w-full py-3.5 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: selectedOffer.color }}>
                    Claim This Offer <ArrowRight size={15} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 bg-[#E7FEF8] border border-[#A7F3D0] rounded-[14px] px-4 py-3.5">
                    <CheckCircle2 size={20} className="text-[#059669] shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-[#059669]">Offer Claimed!</p>
                      <p className="text-[10px] text-[#059669]/70">Check your email for the voucher code. +25 reward points earned.</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={(e) => { toggleSave(e, selectedOffer.id); }}
                    className="flex-1 py-2.5 rounded-[14px] text-[12px] font-semibold border border-[#DFE1E6] bg-white text-[#15161E] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all">
                    {saved.has(selectedOffer.id) ? <BookmarkCheck size={14} className="text-[#FFBD4C]" /> : <Bookmark size={14} />}
                    {saved.has(selectedOffer.id) ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 py-2.5 rounded-[14px] text-[12px] font-semibold border border-[#DFE1E6] bg-white text-[#15161E] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
