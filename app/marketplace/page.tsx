'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { MARKETPLACE_LISTINGS } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import {
  Search, X, Car, Home, Smartphone, Sofa, Plus,
  Sparkles, ArrowLeft, Heart, Share2, MessageCircle, Shield,
  Eye, Tag, Send, SlidersHorizontal, ChevronRight, Flame,
  TrendingUp, Star, Clock, MapPin, BadgeCheck, Camera,
  Zap, Package, Filter, ChevronDown, ArrowUpDown,
  Mic, Scan, Bookmark, MoreHorizontal, PhoneCall,
  ShieldCheck, Award, Truck, RefreshCw, CircleDot, Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   2026 ANIMATIONS — Spatial · Haptic · Fluid
   ═══════════════════════════════════════════ */

const MARKETPLACE_STYLES = `
  @keyframes spatial-rise {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes float-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes pulse-soft {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.6; }
  }
  @keyframes glow-ring {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200,151,58,0.3); }
    50%      { box-shadow: 0 0 0 6px rgba(200,151,58,0); }
  }
  @keyframes tag-pop {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes depth-card {
    from { opacity: 0; transform: perspective(800px) rotateX(2deg) translateY(24px); }
    to   { opacity: 1; transform: perspective(800px) rotateX(0deg) translateY(0); }
  }
  .spatial-rise  { animation: spatial-rise 0.5s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .depth-card    { animation: depth-card 0.55s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .float-in      { animation: float-in 0.35s ease-out both; }
  .slide-up      { animation: slide-up 0.35s cubic-bezier(0.23, 1, 0.32, 1); }
  .tag-pop       { animation: tag-pop 0.3s ease-out both; }
  .d1 { animation-delay: 0.04s; }
  .d2 { animation-delay: 0.08s; }
  .d3 { animation-delay: 0.12s; }
  .d4 { animation-delay: 0.16s; }
  .d5 { animation-delay: 0.20s; }
  .d6 { animation-delay: 0.24s; }
  .shimmer-sweep::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: shimmer-sweep 2.4s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════
   ENRICHED DATA — AI tags, ratings, views
   ═══════════════════════════════════════════ */

interface EnrichedListing {
  id: string; title: string; category: string;
  price: string; seller: string; sellerCompany: string;
  condition: string; posted: string; featured: boolean;
  description: string; image: string;
  specs: Record<string, string>;
  // Enrichments
  rating: number; reviews: number; views: number; saves: number;
  aiTags: string[]; verified: boolean; negotiable: boolean;
  urgency?: string;
}

const ENRICHMENTS: Record<string, Partial<EnrichedListing>> = {
  mk001: { rating: 4.8, reviews: 24, views: 312, saves: 47, aiTags: ['Top Pick', 'Price Drop'], verified: true, negotiable: true, urgency: 'Hot' },
  mk002: { rating: 4.9, reviews: 18, views: 284, saves: 63, aiTags: ['Sea View', 'Furnished'], verified: true, negotiable: false, urgency: 'New' },
  mk003: { rating: 4.6, reviews: 9, views: 156, saves: 22, aiTags: ['Like New', 'Great Deal'], verified: true, negotiable: true },
  mk004: { rating: 4.3, reviews: 5, views: 89, saves: 11, aiTags: ['Moving Sale'], verified: true, negotiable: true },
  mk005: { rating: 4.5, reviews: 7, views: 134, saves: 19, aiTags: ['Must Go', 'Smart TV'], verified: true, negotiable: true, urgency: 'Urgent' },
  mk006: { rating: 4.9, reviews: 31, views: 467, saves: 78, aiTags: ['Agency Warranty', 'Low KM'], verified: true, negotiable: false, urgency: 'Hot' },
};

function enrichListing(l: typeof MARKETPLACE_LISTINGS[0]): EnrichedListing {
  const e = ENRICHMENTS[l.id] ?? {};
  // Clean specs — remove undefined values from union type
  const cleanSpecs: Record<string, string> = {};
  for (const [k, v] of Object.entries(l.specs)) {
    if (typeof v === 'string') cleanSpecs[k] = v;
  }
  return {
    ...l,
    specs: cleanSpecs,
    rating: e.rating ?? 4.5,
    reviews: e.reviews ?? 0,
    views: e.views ?? 0,
    saves: e.saves ?? 0,
    aiTags: e.aiTags ?? [],
    verified: e.verified ?? false,
    negotiable: e.negotiable ?? false,
    urgency: e.urgency,
  };
}

/* ═══════════════════════════════════════════
   CATEGORIES & SORT CONFIG
   ═══════════════════════════════════════════ */

const CATEGORIES = [
  { label: 'All', icon: Layers },
  { label: 'Cars', icon: Car },
  { label: 'Property', icon: Home },
  { label: 'Electronics', icon: Smartphone },
  { label: 'Furniture', icon: Sofa },
];

const SORT_OPTIONS = [
  { label: 'Smart Match', icon: Sparkles },
  { label: 'Newest', icon: Clock },
  { label: 'Price ↑', icon: ArrowUpDown },
  { label: 'Price ↓', icon: ArrowUpDown },
  { label: 'Most Popular', icon: TrendingUp },
];

/* ═══════════════════════════════════════════
   AI SEARCH SUGGESTIONS
   ═══════════════════════════════════════════ */

const AI_SUGGESTIONS = [
  'SUVs under 200k',
  '2BR apartments Yas Island',
  'iPhone deals',
  'Office furniture',
  'Family cars with warranty',
];

/* ═══════════════════════════════════════════
   URGENCY / CONDITION BADGE COLORS
   ═══════════════════════════════════════════ */

function urgencyStyle(urgency?: string) {
  switch (urgency) {
    case 'Hot':    return { bg: 'linear-gradient(135deg, #EF4444, #F97316)', text: '#fff' };
    case 'New':    return { bg: 'linear-gradient(135deg, #1B3A6B, #2D5AA0)', text: '#fff' };
    case 'Urgent': return { bg: 'linear-gradient(135deg, #DC2626, #B91C1C)', text: '#fff' };
    default:       return { bg: '#F4EFE8', text: '#6B7280' };
  }
}

function conditionColor(c: string) {
  switch (c) {
    case 'Excellent': return { bg: '#059669', text: '#fff' };
    case 'Like New':  return { bg: '#0D9488', text: '#fff' };
    case 'Good':      return { bg: '#C8973A', text: '#fff' };
    case 'New':       return { bg: '#1B3A6B', text: '#fff' };
    default:          return { bg: '#9CA3AF', text: '#fff' };
  }
}

/* ═══════════════════════════════════════════
   LISTING DETAIL — immersive 2026 view
   ═══════════════════════════════════════════ */

interface ChatMsg { id: string; from: 'me' | 'seller'; text: string; time: string; }

function ListingDetail({ listing, onClose }: { listing: EnrichedListing; onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [activeImageIdx] = useState(0);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', from: 'seller', text: `Hi! Thanks for your interest in the ${listing.title}. Feel free to ask me anything.`, time: '2:30 PM' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), from: 'me', text, time: timeStr }]);
    setChatInput('');
    setTimeout(() => {
      const replies = [
        'Sure, I can share more details. When would you like to see it?',
        'The price is slightly negotiable. Would you like to make an offer?',
        'It\'s still available! I can meet at the office if that works.',
        'Great question — I\'ll get back to you shortly.',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'seller', text: reply, time: replyTime }]);
    }, 1200);
  };

  const cc = conditionColor(listing.condition);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col">
      <style>{MARKETPLACE_STYLES}</style>

      {/* ── Frosted glass header ── */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 z-20" style={{ background: 'rgba(250,250,248,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(232,226,217,0.6)' }}>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#E8E2D9] text-[#6B7280] active:scale-95 transition-all">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-[14px] font-bold text-[#1A1A2E] flex-1 truncate">{listing.title}</h3>
        <button onClick={() => setSaved(!saved)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#E8E2D9] active:scale-95 transition-all">
          <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-[#9CA3AF]'} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#E8E2D9] active:scale-95 transition-all">
          <Share2 size={16} className="text-[#9CA3AF]" />
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero image with parallax-style gradient overlay */}
        <div className="relative">
          <img src={listing.image} alt={listing.title} className="w-full h-72 object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />

          {/* Floating badges — top */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {listing.category}
            </span>
            {listing.urgency && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: urgencyStyle(listing.urgency).bg, color: urgencyStyle(listing.urgency).text }}>
                <Zap size={9} /> {listing.urgency}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ background: cc.bg, color: cc.text }}>
              {listing.condition}
            </span>
          </div>

          {/* Bottom overlay — price + title */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-[26px] font-extrabold text-white tracking-tight">{listing.price}</p>
            <p className="text-[15px] font-semibold text-white/90 mt-0.5">{listing.title}</p>
          </div>

          {/* Image dots indicator */}
          <div className="absolute bottom-4 right-4 flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === activeImageIdx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* ── AI Smart Tags ── */}
          {listing.aiTags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {listing.aiTags.map((tag, i) => (
                <span key={tag} className="tag-pop flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F4EFE8] to-[#EDE8E0] text-[#1B3A6B] border border-[#E8E2D9]" style={{ animationDelay: `${i * 0.06}s` }}>
                  <Sparkles size={10} className="text-[#C8973A]" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Social proof strip ── */}
          <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
            <span className="flex items-center gap-1"><Star size={12} className="text-[#C8973A] fill-[#C8973A]" /> <strong className="text-[#1A1A2E]">{listing.rating}</strong> ({listing.reviews})</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {listing.views} views</span>
            <span className="flex items-center gap-1"><Heart size={11} /> {listing.saves} saved</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {listing.posted}</span>
          </div>

          {/* ── Spec pills — dimensional ── */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(listing.specs).map(([key, val]) => (
              <div key={key} className="px-3.5 py-2 rounded-2xl bg-white border border-[#E8E2D9] shadow-sm">
                <p className="text-[9px] text-[#9CA3AF] font-medium uppercase tracking-wider">{key}</p>
                <p className="text-[13px] font-bold text-[#1A1A2E] -mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* ── Description card ── */}
          <div className="rounded-[20px] bg-white border border-[#E8E2D9] p-5 shadow-sm">
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">About this listing</p>
            <p className="text-[14px] text-[#4B5563] leading-relaxed">{listing.description}</p>
            {listing.negotiable && (
              <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#059669]">
                <Tag size={12} /> Price is negotiable
              </div>
            )}
          </div>

          {/* ── Seller card — dimensional glassmorphism ── */}
          <div className="rounded-[22px] overflow-hidden relative" style={{ boxShadow: '0 8px 32px rgba(27,58,107,0.12)' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 60%, #1B3A6B 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(200,151,58,0.15) 0%, transparent 50%)' }} />
            <div className="relative z-10 p-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-[16px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {listing.seller.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-white">{listing.seller}</p>
                  <p className="text-[12px] text-blue-200/80">{listing.sellerCompany}</p>
                </div>
                {listing.verified && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <ShieldCheck size={11} /> Verified
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <PhoneCall size={13} /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Eye size={13} /> Profile
                </button>
              </div>
            </div>
          </div>

          {/* ── Safety tip ── */}
          <div className="flex items-start gap-3 p-4 rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0]">
            <Shield size={16} className="text-[#059669] shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-bold text-[#065F46]">Safety Tip</p>
              <p className="text-[11px] text-[#047857] leading-relaxed mt-0.5">Meet at IHC office locations for safe transactions. Never share personal financial details.</p>
            </div>
          </div>

          <div className="pb-24" />
        </div>
      </div>

      {/* ── Chat overlay ── */}
      {showChat && (
        <div className="absolute inset-0 z-30 bg-[#FAFAF8] flex flex-col slide-up">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E2D9] bg-white shrink-0">
            <button onClick={() => setShowChat(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F4EFE8] text-[#6B7280]">
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-[14px] bg-[#1B3A6B] flex items-center justify-center text-xs font-bold text-white">
              {listing.seller.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#1A1A2E]">{listing.seller}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[10px] text-green-600 font-medium">Online now</p>
              </div>
            </div>
          </div>
          {/* Listing context bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#E8E2D9]">
            <img src={listing.image} alt="" className="w-11 h-11 rounded-[12px] object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#1A1A2E] truncate">{listing.title}</p>
              <p className="text-[13px] font-bold text-[#1B3A6B]">{listing.price}</p>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'linear-gradient(180deg, #F9F6F1 0%, #FAFAF8 100%)' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-4 py-3 ${msg.from === 'me'
                  ? 'bg-[#1B3A6B] text-white rounded-[18px] rounded-br-[6px]'
                  : 'bg-white border border-[#E8E2D9] text-[#1A1A2E] rounded-[18px] rounded-bl-[6px] shadow-sm'}`}>
                  <p className="text-[13px] leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1.5 ${msg.from === 'me' ? 'text-white/40' : 'text-[#9CA3AF]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Quick replies */}
          <div className="px-4 pt-2 flex gap-1.5 overflow-x-auto bg-white">
            {['Is this still available?', 'Can you do a lower price?', 'Where can we meet?'].map(q => (
              <button key={q} onClick={() => { setChatInput(q); }} className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#F4EFE8] border border-[#E8E2D9] text-[#6B7280] active:scale-95 transition-all">
                {q}
              </button>
            ))}
          </div>
          <div className="shrink-0 border-t border-[#E8E2D9] bg-white px-4 py-3 flex items-center gap-2.5">
            <input type="text" placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-[#F4EFE8] border border-[#E8E2D9] rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-[#1B3A6B] placeholder:text-[#9CA3AF] transition-colors" />
            <button onClick={sendMessage} className="w-11 h-11 flex items-center justify-center bg-[#1B3A6B] text-white rounded-full active:scale-[0.92] transition-all" style={{ boxShadow: '0 4px 12px rgba(27,58,107,0.3)' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Make Offer overlay ── */}
      {showOffer && (
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setShowOffer(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] p-6 space-y-5 slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#E8E2D9] mx-auto" />
            <h3 className="text-[17px] font-bold text-[#1A1A2E]">Make an Offer</h3>
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F4EFE8]">
              <img src={listing.image} alt="" className="w-14 h-14 rounded-[12px] object-cover" />
              <div>
                <p className="text-[13px] font-semibold text-[#1A1A2E]">{listing.title}</p>
                <p className="text-[14px] font-bold text-[#1B3A6B]">Listed at {listing.price}</p>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Your Offer (AED)</label>
              <input type="text" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Enter amount"
                className="w-full mt-2 bg-white border-2 border-[#E8E2D9] rounded-[16px] px-4 py-3.5 text-[18px] font-bold text-[#1A1A2E] outline-none focus:border-[#1B3A6B] transition-colors" />
            </div>
            <button className="w-full py-4 rounded-[16px] text-[15px] font-bold text-white bg-[#1B3A6B] active:scale-[0.98] transition-all" style={{ boxShadow: '0 4px 16px rgba(27,58,107,0.25)' }}>
              Send Offer
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky bottom CTA — glassmorphism ── */}
      {!showChat && !showOffer && (
        <div className="shrink-0 px-5 py-4 z-20" style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(232,226,217,0.5)' }}>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[16px] text-[14px] font-bold text-[#1A1A2E] bg-white border border-[#E8E2D9] active:scale-[0.97] transition-all shadow-sm">
              <MessageCircle size={17} /> Chat
            </button>
            <button onClick={() => setShowOffer(true)}
              className="flex-[1.4] flex items-center justify-center gap-2 py-3.5 rounded-[16px] text-[14px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 100%)', boxShadow: '0 4px 16px rgba(27,58,107,0.3)' }}>
              <Tag size={17} /> Make Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MARKETPLACE PAGE — 2026 Spatial + AI UX
   ═══════════════════════════════════════════ */

export default function MarketplacePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Smart Match');
  const [showSort, setShowSort] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const allEnriched = useMemo(() => MARKETPLACE_LISTINGS.map(enrichListing), []);

  const filtered = useMemo(() => {
    let results = allEnriched.filter(l => {
      const matchCat = cat === 'All' || l.category === cat;
      const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase()) || l.aiTags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
    // Sorting
    if (sort === 'Newest') results = [...results].sort((a, b) => a.posted.localeCompare(b.posted));
    if (sort === 'Price ↑') results = [...results].sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    if (sort === 'Price ↓') results = [...results].sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    if (sort === 'Most Popular') results = [...results].sort((a, b) => b.views - a.views);
    return results;
  }, [allEnriched, cat, search, sort]);

  const featured = filtered.filter(l => l.featured);
  const rest = filtered.filter(l => !l.featured);

  return (
    <AppShell title="Marketplace" subtitle="">
      <style>{MARKETPLACE_STYLES}</style>

      <div className="space-y-5">

        {/* ═══════════════════════════════════
           AI-POWERED SEARCH — 2026 Smart Bar
           ═══════════════════════════════════ */}
        <div className="spatial-rise">
          <div className="relative">
            <div className="flex items-center gap-2.5 bg-white rounded-[20px] border border-[#E8E2D9] px-4 py-1 shadow-sm" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.06)' }}>
              <Search size={17} className="text-[#9CA3AF] shrink-0" />
              <input ref={searchRef} type="text" placeholder="Search or describe what you need..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowAISuggestions(true)}
                onBlur={() => setTimeout(() => setShowAISuggestions(false), 200)}
                className="flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-[#B8B3A9] text-[#1A1A2E]" />
              {search ? (
                <button onClick={() => setSearch('')} className="p-1.5 rounded-full hover:bg-[#F4EFE8] transition-colors">
                  <X size={15} className="text-[#9CA3AF]" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-full hover:bg-[#F4EFE8] transition-colors">
                    <Mic size={16} className="text-[#9CA3AF]" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#F4EFE8] transition-colors">
                    <Scan size={16} className="text-[#9CA3AF]" />
                  </button>
                </div>
              )}
            </div>

            {/* AI suggestion dropdown */}
            {showAISuggestions && !search && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[18px] border border-[#E8E2D9] shadow-lg overflow-hidden z-20" style={{ boxShadow: '0 8px 32px rgba(27,58,107,0.1)' }}>
                <div className="px-4 pt-3 pb-2">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={10} className="text-[#C8973A]" /> AI Suggestions
                  </p>
                </div>
                {AI_SUGGESTIONS.map((s, i) => (
                  <button key={s}
                    onMouseDown={() => { setSearch(s); setShowAISuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#4B5563] hover:bg-[#F4EFE8] transition-colors flex items-center gap-2.5 float-in"
                    style={{ animationDelay: `${i * 0.04}s` }}>
                    <Search size={13} className="text-[#C8973A]" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════
           SELL CTA — gradient banner
           ═══════════════════════════════════ */}
        <button className="spatial-rise d1 w-full flex items-center gap-3 p-3.5 rounded-[18px] active:scale-[0.98] transition-all overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 60%, #1B3A6B 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 90% 50%, rgba(200,151,58,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10 w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Camera size={20} className="text-white" />
          </div>
          <div className="relative z-10 flex-1 text-left">
            <p className="text-[14px] font-bold text-white">Sell to Colleagues</p>
            <p className="text-[11px] text-blue-200/70">Snap a photo and list in seconds</p>
          </div>
          <ChevronRight size={18} className="relative z-10 text-white/50" />
        </button>

        {/* ═══════════════════════════════════
           CATEGORY + SORT — Pill bar
           ═══════════════════════════════════ */}
        <div className="spatial-rise d2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map(c => {
              const CIcon = c.icon;
              const isActive = cat === c.label;
              return (
                <button key={c.label} onClick={() => setCat(c.label)}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all active:scale-95"
                  style={{
                    background: isActive ? '#1B3A6B' : 'rgba(255,255,255,0.9)',
                    color: isActive ? '#FFFFFF' : '#666D80',
                    border: isActive ? 'none' : '1px solid #E8E2D9',
                    boxShadow: isActive ? '0 2px 8px rgba(27,58,107,0.25)' : 'none',
                  }}>
                  <CIcon size={13} strokeWidth={isActive ? 2.2 : 1.6} />
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[12px] text-[#9CA3AF]">
              <span className="font-bold text-[#1A1A2E]">{filtered.length}</span> listings found
            </p>
            <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] active:scale-95 transition-all">
              <ArrowUpDown size={13} /> {sort}
              <ChevronDown size={12} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Sort dropdown */}
          {showSort && (
            <div className="mt-2 bg-white rounded-[16px] border border-[#E8E2D9] shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(27,58,107,0.08)' }}>
              {SORT_OPTIONS.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <button key={s.label} onClick={() => { setSort(s.label); setShowSort(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-colors float-in ${sort === s.label ? 'bg-[#F4EFE8] text-[#1B3A6B] font-bold' : 'text-[#4B5563] hover:bg-[#FAFAF8]'}`}
                    style={{ animationDelay: `${i * 0.03}s` }}>
                    <SIcon size={14} className={sort === s.label ? 'text-[#C8973A]' : 'text-[#9CA3AF]'} />
                    {s.label}
                    {sort === s.label && <div className="ml-auto w-2 h-2 rounded-full bg-[#C8973A]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════
           FEATURED — Dimensional hero cards
           ═══════════════════════════════════ */}
        {featured.length > 0 && (
          <section className="spatial-rise d3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-[8px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8973A, #E0B85C)' }}>
                <Flame size={13} className="text-white" />
              </div>
              <p className="text-[14px] font-bold text-[#1A1A2E]">Featured</p>
              <div className="flex-1 h-px bg-gradient-to-r from-[#E8E2D9] to-transparent ml-2" />
            </div>
            <div className="space-y-4">
              {featured.map((listing, i) => (
                <button key={listing.id} onClick={() => setSelectedListing(listing)}
                  className={`depth-card d${i + 1} w-full rounded-[22px] overflow-hidden text-left active:scale-[0.98] transition-all bg-white border border-[#E8E2D9]`}
                  style={{ boxShadow: '0 4px 24px rgba(27,58,107,0.08)' }}>
                  {/* Image section */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {listing.category}
                      </span>
                      <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #C8973A, #E0B85C)' }}>
                        <Award size={9} /> Featured
                      </span>
                    </div>
                    {listing.urgency && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: urgencyStyle(listing.urgency).bg, color: urgencyStyle(listing.urgency).text }}>
                          <Zap size={9} /> {listing.urgency}
                        </span>
                      </div>
                    )}

                    {/* Bottom overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[22px] font-extrabold text-white tracking-tight">{listing.price}</p>
                      <p className="text-[15px] font-semibold text-white/90">{listing.title}</p>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="px-4 py-3.5">
                    {/* AI Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.aiTags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold text-[#1B3A6B] bg-[#EDE8FF]/40 border border-[#E8E2D9] px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={8} className="text-[#C8973A]" /> {tag}
                        </span>
                      ))}
                      {Object.entries(listing.specs).slice(0, 2).map(([k, v]) => (
                        <span key={k} className="text-[10px] text-[#6B7280] bg-[#F4EFE8] px-2.5 py-1 rounded-full font-medium">{v}</span>
                      ))}
                    </div>

                    {/* Seller + social proof */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[12px] bg-[#1B3A6B] flex items-center justify-center text-[11px] font-bold text-white">
                        {listing.seller.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-[#1A1A2E]">{listing.seller}</p>
                          {listing.verified && <BadgeCheck size={13} className="text-[#059669]" />}
                        </div>
                        <p className="text-[10px] text-[#9CA3AF]">{listing.sellerCompany}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF]">
                        <span className="flex items-center gap-1"><Star size={10} className="text-[#C8973A] fill-[#C8973A]" /> {listing.rating}</span>
                        <span className="flex items-center gap-1"><Eye size={10} /> {listing.views}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════
           ALL LISTINGS — 2-col spatial grid
           ═══════════════════════════════════ */}
        {rest.length > 0 && (
          <section className="spatial-rise d4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[8px] bg-[#F4EFE8] flex items-center justify-center">
                  <Package size={13} className="text-[#6B7280]" />
                </div>
                <p className="text-[14px] font-bold text-[#1A1A2E]">All Listings</p>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">{rest.length} items</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {rest.map((listing, i) => {
                const cc2 = conditionColor(listing.condition);
                return (
                  <button key={listing.id} onClick={() => setSelectedListing(listing)}
                    className={`depth-card d${(i % 6) + 1} rounded-[18px] overflow-hidden text-left active:scale-[0.96] transition-all bg-white border border-[#E8E2D9]`}
                    style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
                    <div className="relative">
                      <img src={listing.image} alt={listing.title}
                        className={`w-full object-cover ${i % 3 === 0 ? 'h-[150px]' : 'h-[120px]'}`} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.25) 100%)' }} />
                      {/* Category pill */}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-bold text-white px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                        {listing.category}
                      </span>
                      {/* Condition */}
                      <span className="absolute top-2.5 right-2.5 text-[8px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cc2.bg, color: cc2.text }}>
                        {listing.condition}
                      </span>
                      {/* Urgency */}
                      {listing.urgency && (
                        <span className="absolute bottom-2 left-2.5 text-[8px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-0.5"
                          style={{ background: urgencyStyle(listing.urgency).bg }}>
                          <Zap size={7} /> {listing.urgency}
                        </span>
                      )}
                      {/* Save button */}
                      <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                        onClick={e => e.stopPropagation()}>
                        <Heart size={13} className="text-[#9CA3AF]" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[12px] font-bold text-[#1A1A2E] line-clamp-2 leading-snug mb-1.5">{listing.title}</p>
                      <p className="text-[15px] font-extrabold text-[#1B3A6B] mb-2">{listing.price}</p>

                      {/* AI tag (first only) */}
                      {listing.aiTags.length > 0 && (
                        <div className="mb-2">
                          <span className="text-[9px] font-semibold text-[#C8973A] bg-[#FEF9F0] border border-[#F5E6C8] px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <Sparkles size={7} /> {listing.aiTags[0]}
                          </span>
                        </div>
                      )}

                      {/* Seller + rating */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-[#F4EFE8]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-[6px] bg-[#F4EFE8] flex items-center justify-center text-[8px] font-bold text-[#6B7280] shrink-0">
                            {listing.seller.slice(0, 2)}
                          </div>
                          <p className="text-[10px] text-[#9CA3AF] truncate">{listing.seller}</p>
                          {listing.verified && <BadgeCheck size={10} className="text-[#059669] shrink-0" />}
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#9CA3AF] shrink-0">
                          <Star size={9} className="text-[#C8973A] fill-[#C8973A]" /> {listing.rating}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════
           EMPTY STATE
           ═══════════════════════════════════ */}
        {filtered.length === 0 && (
          <div className="spatial-rise text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#F4EFE8] flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#9CA3AF]" />
            </div>
            <p className="text-[16px] font-bold text-[#1A1A2E] mb-1">No listings found</p>
            <p className="text-[13px] text-[#9CA3AF]">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setCat('All'); }} className="mt-4 px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#1B3A6B] bg-[#F4EFE8] border border-[#E8E2D9] active:scale-95 transition-all">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Listing Detail Modal ── */}
      {selectedListing && (
        <ListingDetail listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
    </AppShell>
  );
}
