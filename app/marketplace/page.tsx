'use client';
import { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useModalHistory } from '@/hooks/useModalHistory';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { MARKETPLACE_LISTINGS } from '@/lib/mockData';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from '@/context/AuthContext';
import { useListings } from '@/context/ListingsContext';
import { useWallet } from '@/context/WalletContext';
import {
  Search, X, Car, Home, Smartphone, Sofa, Plus,
  Sparkles, ArrowLeft, Heart, Share2, MessageCircle, Shield,
  Eye, Tag, Send, SlidersHorizontal, ChevronRight, Flame,
  TrendingUp, Star, Clock, MapPin, BadgeCheck, Camera,
  Zap, Package, Filter, ChevronDown, ArrowUpDown,
  Mic, Scan, Bookmark, MoreHorizontal, PhoneCall,
  ShieldCheck, Award, Truck, RefreshCw, CircleDot, Layers, Wallet,
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
  isUserListing?: boolean;
}

const ENRICHMENTS: Record<string, Partial<EnrichedListing>> = {
  mk001: { rating: 4.8, reviews: 24, views: 312, saves: 47, aiTags: ['Top Pick', 'Price Drop'], verified: true, negotiable: true, urgency: 'Hot' },
  mk002: { rating: 4.9, reviews: 18, views: 284, saves: 63, aiTags: ['Sea View', 'Furnished'], verified: true, negotiable: false, urgency: 'New' },
  mk003: { rating: 4.6, reviews: 9, views: 156, saves: 22, aiTags: ['Like New', 'Great Deal'], verified: true, negotiable: true },
  mk004: { rating: 4.3, reviews: 5, views: 89, saves: 11, aiTags: ['Moving Sale'], verified: true, negotiable: true },
  mk005: { rating: 4.5, reviews: 7, views: 134, saves: 19, aiTags: ['Must Go', 'Smart TV'], verified: true, negotiable: true, urgency: 'Urgent' },
  mk006: { rating: 4.9, reviews: 31, views: 467, saves: 78, aiTags: ['Agency Warranty', 'Low KM'], verified: true, negotiable: false, urgency: 'Hot' },
  mk007: { rating: 4.9, reviews: 42, views: 523, saves: 91, aiTags: ['AppleCare+', 'Top Spec'], verified: true, negotiable: true, urgency: 'Hot' },
  mk008: { rating: 4.8, reviews: 27, views: 389, saves: 65, aiTags: ['AMG Line', 'Low KM'], verified: true, negotiable: true, urgency: 'Hot' },
  mk009: { rating: 4.5, reviews: 12, views: 198, saves: 34, aiTags: ['City View', 'Ready'], verified: true, negotiable: true },
  mk010: { rating: 4.4, reviews: 8, views: 145, saves: 18, aiTags: ['Bundle Deal', 'Gaming'], verified: true, negotiable: true },
  mk011: { rating: 4.6, reviews: 6, views: 87, saves: 14, aiTags: ['Premium Wood', 'Like New'], verified: true, negotiable: true },
  mk012: { rating: 4.7, reviews: 11, views: 112, saves: 28, aiTags: ['Barely Used', 'Full Kit'], verified: true, negotiable: false },
  mk013: { rating: 5.0, reviews: 38, views: 612, saves: 104, aiTags: ['Beach Access', 'Private Pool'], verified: true, negotiable: true, urgency: 'Hot' },
  mk014: { rating: 4.5, reviews: 9, views: 134, saves: 21, aiTags: ['Sports Watch', '3 Bands'], verified: true, negotiable: true },
  mk015: { rating: 4.9, reviews: 22, views: 345, saves: 56, aiTags: ['Under Warranty', 'Low KM'], verified: true, negotiable: false, urgency: 'New' },
  mk016: { rating: 4.3, reviews: 4, views: 76, saves: 9, aiTags: ['Moving Sale', 'Premium'], verified: true, negotiable: true, urgency: 'Urgent' },
  mk017: { rating: 4.8, reviews: 15, views: 203, saves: 38, aiTags: ['Pro Kit', 'Low Shutter'], verified: true, negotiable: true },
  mk018: { rating: 4.7, reviews: 14, views: 256, saves: 41, aiTags: ['Private Garden', 'Family'], verified: true, negotiable: true },
  mk019: { rating: 4.6, reviews: 10, views: 167, saves: 25, aiTags: ['Full Kit', 'Great Deal'], verified: true, negotiable: true },
  mk020: { rating: 4.4, reviews: 3, views: 54, saves: 7, aiTags: ['Fitness', 'Rarely Used'], verified: true, negotiable: true, urgency: 'Urgent' },
  mk021: { rating: 4.8, reviews: 19, views: 298, saves: 52, aiTags: ['M Sport', 'Full Warranty'], verified: true, negotiable: true },
  mk022: { rating: 4.9, reviews: 16, views: 178, saves: 43, aiTags: ['Ergonomic', 'Fully Loaded'], verified: true, negotiable: false },
  mk023: { rating: 4.7, reviews: 8, views: 143, saves: 22, aiTags: ['Fly More', 'Lightweight'], verified: true, negotiable: true },
  mk024: { rating: 4.9, reviews: 21, views: 412, saves: 73, aiTags: ['Sea View', 'Penthouse'], verified: true, negotiable: true, urgency: 'New' },
  mk025: { rating: 4.5, reviews: 7, views: 98, saves: 16, aiTags: ['Spatial Audio', 'ANC'], verified: true, negotiable: true },
  mk026: { rating: 4.9, reviews: 25, views: 378, saves: 61, aiTags: ['Fully Loaded', 'F Sport'], verified: true, negotiable: false, urgency: 'Hot' },
};

function enrichListing(l: { id: string; title: string; category: string; price: string; seller: string; sellerCompany: string; condition: string; posted: string; featured: boolean; description: string; image: string; specs: Record<string, string> }): EnrichedListing {
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
    case 'New':    return { bg: 'linear-gradient(135deg, #9D63F6, #B182F8)', text: '#fff' };
    case 'Urgent': return { bg: 'linear-gradient(135deg, #DC2626, #B91C1C)', text: '#fff' };
    default:       return { bg: '#F8F9FB', text: '#666D80' };
  }
}

function conditionColor(c: string) {
  switch (c) {
    case 'Excellent': return { bg: '#059669', text: '#fff' };
    case 'Like New':  return { bg: '#40C4AA', text: '#fff' };
    case 'Good':      return { bg: '#FFBD4C', text: '#fff' };
    case 'New':       return { bg: '#9D63F6', text: '#fff' };
    default:          return { bg: '#A4ABB8', text: '#fff' };
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
  const [offerSent, setOfferSent] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);
  const [showCallSheet, setShowCallSheet] = useState(false);
  const wallet = useWallet();
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyError, setBuyError] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', from: 'seller', text: `Hi! Thanks for your interest in the ${listing.title}. Feel free to ask me anything.`, time: '2:30 PM' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(showChat || showOffer || showSellerProfile || showCallSheet || showBuyConfirm);

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
  const numericPrice = parseFloat(listing.price.replace(/[^0-9.]/g, ''));

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col">
      <style>{MARKETPLACE_STYLES}</style>

      {/* ── Frosted glass header ── */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 z-20" style={{ background: 'rgba(250,250,248,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(232,226,217,0.6)' }}>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#DFE1E6] text-[#666D80] active:scale-95 transition-all">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-[14px] font-bold text-[#15161E] flex-1 truncate">{listing.title}</h3>
        <button onClick={() => setSaved(!saved)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#DFE1E6] active:scale-95 transition-all">
          <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-[#A4ABB8]'} />
        </button>
        <button onClick={async () => {
          const shareData = {
            title: listing.title,
            text: `${listing.title} — ${listing.price}\n${listing.description}`,
            url: window.location.href,
          };
          if (navigator.share) {
            try { await navigator.share(shareData); } catch {}
          } else {
            await navigator.clipboard.writeText(`${listing.title} — ${listing.price}\n${listing.description}\n${window.location.href}`);
            alert('Link copied to clipboard!');
          }
        }} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-[#DFE1E6] active:scale-95 transition-all">
          <Share2 size={16} className="text-[#A4ABB8]" />
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
                <span key={tag} className="tag-pop flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F8F9FB] to-[#EDE8E0] text-[#9D63F6] border border-[#DFE1E6]" style={{ animationDelay: `${i * 0.06}s` }}>
                  <Sparkles size={10} className="text-[#FFBD4C]" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Social proof strip ── */}
          <div className="flex items-center gap-4 text-[11px] text-[#A4ABB8]">
            <span className="flex items-center gap-1"><Star size={12} className="text-[#FFBD4C] fill-[#FFBD4C]" /> <strong className="text-[#15161E]">{listing.rating}</strong> ({listing.reviews})</span>
            <span className="flex items-center gap-1"><Eye size={11} /> {listing.views} views</span>
            <span className="flex items-center gap-1"><Heart size={11} /> {listing.saves} saved</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {listing.posted}</span>
          </div>

          {/* ── Spec pills — dimensional ── */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(listing.specs).map(([key, val]) => (
              <div key={key} className="px-3.5 py-2 rounded-2xl bg-white border border-[#DFE1E6] shadow-sm">
                <p className="text-[9px] text-[#A4ABB8] font-medium uppercase tracking-wider">{key}</p>
                <p className="text-[13px] font-bold text-[#15161E] -mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* ── Description card ── */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] p-5 shadow-sm">
            <p className="text-[11px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">About this listing</p>
            <p className="text-[14px] text-[#4B5563] leading-relaxed">{listing.description}</p>
            {listing.negotiable && (
              <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#059669]">
                <Tag size={12} /> Price is negotiable
              </div>
            )}
          </div>

          {/* ── Seller card — dimensional glassmorphism ── */}
          <div className="rounded-[22px] overflow-hidden relative" style={{ boxShadow: '0 8px 32px rgba(27,58,107,0.12)' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #B182F8 60%, #9D63F6 100%)' }} />
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
                <button onClick={() => setShowChat(true)} className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-bold text-white active:scale-95 transition-all" style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <MessageCircle size={13} /> Chat
                </button>
                <button onClick={() => setShowCallSheet(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-bold text-white active:scale-95 transition-all" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <PhoneCall size={13} /> Call
                </button>
                <button onClick={() => setShowSellerProfile(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-bold text-white active:scale-95 transition-all" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
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
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DFE1E6] bg-white shrink-0">
            <button onClick={() => setShowChat(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F9FB] text-[#666D80]">
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-[14px] bg-[#9D63F6] flex items-center justify-center text-xs font-bold text-white">
              {listing.seller.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#15161E]">{listing.seller}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[10px] text-green-600 font-medium">Online now</p>
              </div>
            </div>
          </div>
          {/* Listing context bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#DFE1E6]">
            <img src={listing.image} alt="" className="w-11 h-11 rounded-[12px] object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#15161E] truncate">{listing.title}</p>
              <p className="text-[13px] font-bold text-[#9D63F6]">{listing.price}</p>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'linear-gradient(180deg, #F8F9FB 0%, #FAFAF8 100%)' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-4 py-3 ${msg.from === 'me'
                  ? 'bg-[#9D63F6] text-white rounded-[18px] rounded-br-[6px]'
                  : 'bg-white border border-[#DFE1E6] text-[#15161E] rounded-[18px] rounded-bl-[6px] shadow-sm'}`}>
                  <p className="text-[13px] leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1.5 ${msg.from === 'me' ? 'text-white/40' : 'text-[#A4ABB8]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Quick replies */}
          <div className="px-4 pt-2 flex gap-1.5 overflow-x-auto bg-white">
            {['Is this still available?', 'Can you do a lower price?', 'Where can we meet?'].map(q => (
              <button key={q} onClick={() => { setChatInput(q); }} className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] text-[#666D80] active:scale-95 transition-all">
                {q}
              </button>
            ))}
          </div>
          <div className="shrink-0 border-t border-[#DFE1E6] bg-white px-4 py-3 flex items-center gap-2.5">
            <input type="text" placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-[#F8F9FB] border border-[#DFE1E6] rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-[#9D63F6] placeholder:text-[#A4ABB8] transition-colors" />
            <button onClick={sendMessage} className="w-11 h-11 flex items-center justify-center bg-[#9D63F6] text-white rounded-full active:scale-[0.92] transition-all" style={{ boxShadow: '0 4px 12px rgba(27,58,107,0.3)' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Make Offer overlay ── */}
      {showOffer && (
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setShowOffer(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-4 py-5 space-y-5 slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#15161E]">Make an Offer</h3>
              <button onClick={() => setShowOffer(false)} className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center"><X size={16} className="text-[#666D80]" /></button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F8F9FB]">
              <img src={listing.image} alt="" className="w-12 h-12 rounded-[12px] object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#15161E] truncate">{listing.title}</p>
                <p className="text-[13px] font-bold text-[#9D63F6]">Listed at {listing.price}</p>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Your Offer (AED)</label>
              <input type="text" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Enter amount"
                className="w-full mt-2 bg-white border-2 border-[#DFE1E6] rounded-[16px] px-4 py-3 text-[16px] font-bold text-[#15161E] outline-none focus:border-[#9D63F6] transition-colors" />
            </div>
            <button
              onClick={() => {
                if (!offerAmount.trim()) return;
                setOfferSent(true);
                setTimeout(() => { setShowOffer(false); setOfferSent(false); setOfferAmount(''); }, 2000);
              }}
              className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white bg-[#9D63F6] active:scale-[0.98] transition-all"
              style={{ boxShadow: '0 4px 16px rgba(27,58,107,0.25)' }}>
              {offerSent ? 'Offer Sent!' : 'Send Offer'}
            </button>
          </div>
        </div>
      )}

      {/* ── Seller Profile overlay ── */}
      {showSellerProfile && (
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setShowSellerProfile(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-5 py-5 space-y-4 slide-up max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />
            <button onClick={() => setShowSellerProfile(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center text-[20px] font-bold text-white shadow-lg">
                {listing.seller.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[17px] font-bold text-[#15161E]">{listing.seller}</p>
                  {listing.verified && <BadgeCheck size={16} className="text-[#059669]" />}
                </div>
                <p className="text-[13px] text-[#666D80]">{listing.sellerCompany}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-[11px] text-green-600 font-medium">Active now</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 text-center py-3 rounded-[14px] bg-[#F8F9FB]">
                <p className="text-[16px] font-bold text-[#15161E]">{listing.rating}</p>
                <p className="text-[10px] text-[#A4ABB8]">Rating</p>
              </div>
              <div className="flex-1 text-center py-3 rounded-[14px] bg-[#F8F9FB]">
                <p className="text-[16px] font-bold text-[#15161E]">{listing.reviews}</p>
                <p className="text-[10px] text-[#A4ABB8]">Reviews</p>
              </div>
              <div className="flex-1 text-center py-3 rounded-[14px] bg-[#F8F9FB]">
                <p className="text-[16px] font-bold text-[#15161E]">3</p>
                <p className="text-[10px] text-[#A4ABB8]">Listings</p>
              </div>
            </div>
            <div className="p-4 rounded-[16px] bg-[#F8F9FB] border border-[#DFE1E6]">
              <p className="text-[11px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Member Since</p>
              <p className="text-[13px] font-semibold text-[#15161E]">January 2024 · {listing.sellerCompany}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowSellerProfile(false); setShowChat(true); }} className="flex-1 py-3 rounded-[16px] text-[13px] font-bold text-white bg-[#9D63F6] active:scale-[0.97] transition-all" style={{ boxShadow: '0 4px 16px rgba(27,58,107,0.25)' }}>
                <MessageCircle size={14} className="inline mr-1.5" />Message
              </button>
              <button onClick={() => { setShowSellerProfile(false); setShowCallSheet(true); }} className="flex-1 py-3 rounded-[16px] text-[13px] font-bold text-[#15161E] bg-white border border-[#DFE1E6] active:scale-[0.97] transition-all">
                <PhoneCall size={14} className="inline mr-1.5" />Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Call Sheet ── */}
      {showCallSheet && (
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => setShowCallSheet(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-5 py-5 space-y-4 slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />
            <button onClick={() => setShowCallSheet(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10"><X size={16} className="text-[#666D80]" /></button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center text-[14px] font-bold text-white">
                {listing.seller.slice(0, 2)}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#15161E]">{listing.seller}</p>
                <p className="text-[12px] text-[#666D80]">{listing.sellerCompany}</p>
              </div>
            </div>
            <a href="tel:+97150123456" className="flex items-center gap-3 p-4 rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] active:scale-[0.98] transition-all">
              <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center">
                <PhoneCall size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#065F46]">+971 50 123 4567</p>
                <p className="text-[11px] text-[#047857]">Mobile · IHC Corporate Directory</p>
              </div>
            </a>
            <a href="tel:+97126543210" className="flex items-center gap-3 p-4 rounded-[16px] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-[0.98] transition-all">
              <div className="w-10 h-10 rounded-full bg-[#666D80] flex items-center justify-center">
                <PhoneCall size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#15161E]">+971 2 654 3210</p>
                <p className="text-[11px] text-[#A4ABB8]">Office · {listing.sellerCompany}</p>
              </div>
            </a>
            <button onClick={() => setShowCallSheet(false)} className="w-full py-3 rounded-[16px] text-[13px] font-bold text-[#666D80] bg-[#F8F9FB] active:scale-[0.97] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Buy Confirm overlay ── */}
      {showBuyConfirm && (
        <div className="absolute inset-0 z-30 flex items-end" onClick={() => { setShowBuyConfirm(false); setBuyError(false); }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-5 py-5 space-y-5 slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#15161E]">{buySuccess ? 'Purchase Complete!' : 'Confirm Purchase'}</h3>
              <button onClick={() => { setShowBuyConfirm(false); setBuySuccess(false); setBuyError(false); }} className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center"><X size={16} className="text-[#666D80]" /></button>
            </div>

            {buySuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto">
                  <ShieldCheck size={28} className="text-[#059669]" />
                </div>
                <p className="text-[15px] font-bold text-[#15161E]">Payment Successful</p>
                <p className="text-[13px] text-[#666D80]">AED {numericPrice.toLocaleString()} has been deducted from your wallet.</p>
                <p className="text-[12px] text-[#9D63F6] font-semibold">+{Math.floor(numericPrice / 10)} reward points earned!</p>
                <button onClick={() => { setShowBuyConfirm(false); setBuySuccess(false); onClose(); }} className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white bg-[#059669] active:scale-[0.98] transition-all mt-2">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F8F9FB]">
                  <img src={listing.image} alt="" className="w-12 h-12 rounded-[12px] object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#15161E] truncate">{listing.title}</p>
                    <p className="text-[13px] font-bold text-[#9D63F6]">{listing.price}</p>
                  </div>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F8F9FB] border border-[#DFE1E6]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#666D80]">Wallet Balance</span>
                    <span className="text-[14px] font-bold text-[#15161E]">AED {wallet.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#666D80]">Item Price</span>
                    <span className="text-[14px] font-bold text-[#DF1C41]">- AED {numericPrice.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-[#DFE1E6] pt-2 mt-2 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#666D80]">Remaining</span>
                    <span className={`text-[14px] font-bold ${wallet.balance >= numericPrice ? 'text-[#059669]' : 'text-[#DF1C41]'}`}>
                      AED {(wallet.balance - numericPrice).toLocaleString()}
                    </span>
                  </div>
                </div>

                {buyError && (
                  <div className="p-3 rounded-[14px] bg-[#FEF2F2] border border-[#FECACA] text-center">
                    <p className="text-[12px] font-semibold text-[#DC2626]">Insufficient balance. Please fund your wallet first.</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-[#A4ABB8]">
                  <Shield size={12} className="shrink-0" />
                  <span>Secure payment via Ahli Wallet · Earn {Math.floor(numericPrice / 10)} points</span>
                </div>

                <button
                  onClick={() => {
                    const success = wallet.makePayment(numericPrice, `Marketplace: ${listing.title}`);
                    if (success) {
                      setBuySuccess(true);
                      setBuyError(false);
                    } else {
                      setBuyError(true);
                    }
                  }}
                  className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                  <Wallet size={15} className="inline mr-1.5" /> Pay AED {numericPrice.toLocaleString()}
                </button>
              </>
            )}
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
  return (
    <Suspense fallback={<AppShell title="Marketplace" subtitle=""><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#9D63F6] border-t-transparent rounded-full animate-spin" /></div></AppShell>}>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { userListings } = useListings();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Smart Match');
  const [showSort, setShowSort] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedListing, setSelectedListing] = useState<EnrichedListing | null>(null);
  const [showMyListings, setShowMyListings] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useBodyScrollLock(!!selectedListing || showSort || showAISuggestions || showMyListings);

  // ── History integration for iOS back gesture / Android back button ──
  const closeListingWithHistory = useModalHistory(
    !!selectedListing,
    () => setSelectedListing(null),
    'marketplace-detail'
  );

  // Handle ?tab=my from sell flow redirect
  useEffect(() => {
    if (searchParams.get('tab') === 'my') {
      setShowMyListings(true);
    }
  }, [searchParams]);

  // Convert user listings into enriched format
  const userEnriched: EnrichedListing[] = useMemo(() => userListings.map(ul => ({
    ...enrichListing({
      id: ul.id,
      title: ul.title,
      category: ul.category,
      price: ul.price,
      seller: ul.seller,
      sellerCompany: ul.sellerCompany,
      condition: ul.condition,
      posted: ul.posted,
      featured: ul.featured,
      description: ul.description,
      image: ul.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=320&fit=crop',
      specs: ul.specs,
    }),
    isUserListing: true,
  })), [userListings]);

  const allEnriched = useMemo(() => [...userEnriched, ...MARKETPLACE_LISTINGS.map(l => enrichListing({ ...l, specs: l.specs as unknown as Record<string, string> }))], [userEnriched]);

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

      <div className="space-y-4">

        {/* ═══════════════════════════════════
           AI-POWERED SEARCH — 2026 Smart Bar
           ═══════════════════════════════════ */}
        <div className="spatial-rise">
          <div className="relative">
            <div className="flex items-center gap-2 bg-white rounded-[20px] border border-[#DFE1E6] px-3 py-1 shadow-sm" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.06)' }}>
              <Search size={16} className="text-[#A4ABB8] shrink-0" />
              <input ref={searchRef} type="text" placeholder="Search listings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowAISuggestions(true)}
                onBlur={() => setTimeout(() => setShowAISuggestions(false), 200)}
                className="flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-[#A4ABB8] text-[#15161E]" />
              {search ? (
                <button onClick={() => setSearch('')} className="p-1 rounded-full hover:bg-[#F8F9FB] transition-colors shrink-0">
                  <X size={14} className="text-[#A4ABB8]" />
                </button>
              ) : (
                <div className="flex items-center gap-0.5">
                  <button className="p-1.5 rounded-full hover:bg-[#F8F9FB] transition-colors shrink-0">
                    <Mic size={14} className="text-[#A4ABB8]" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-[#F8F9FB] transition-colors shrink-0">
                    <Scan size={14} className="text-[#A4ABB8]" />
                  </button>
                </div>
              )}
            </div>

            {/* AI suggestion dropdown */}
            {showAISuggestions && !search && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[18px] border border-[#DFE1E6] shadow-lg overflow-hidden z-20" style={{ boxShadow: '0 8px 32px rgba(27,58,107,0.1)' }}>
                <div className="px-4 pt-3 pb-2">
                  <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={10} className="text-[#FFBD4C]" /> AI Suggestions
                  </p>
                </div>
                {AI_SUGGESTIONS.map((s, i) => (
                  <button key={s}
                    onMouseDown={() => { setSearch(s); setShowAISuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#4B5563] hover:bg-[#F8F9FB] transition-colors flex items-center gap-2.5 float-in"
                    style={{ animationDelay: `${i * 0.04}s` }}>
                    <Search size={13} className="text-[#FFBD4C]" />
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
        <button onClick={() => router.push('/services?prompt=I+want+to+sell+something+on+the+marketplace')} className="spatial-rise d1 w-full flex items-center gap-2.5 p-3 rounded-[18px] active:scale-[0.98] transition-all overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #B182F8 60%, #9D63F6 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 90% 50%, rgba(200,151,58,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10 w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <DotLottieReact src="/lottie-sell-v2.lottie" loop autoplay style={{ width: 28, height: 28 }} />
          </div>
          <div className="relative z-10 flex-1 text-left min-w-0">
            <p className="text-[13px] font-bold text-white">Sell to Colleagues</p>
            <p className="text-[10px] text-blue-200/70">Snap a photo and list in seconds</p>
          </div>
          <ChevronRight size={16} className="relative z-10 text-white/50 shrink-0" />
        </button>

        {/* ═══════════════════════════════════
           CATEGORY + SORT — Pill bar
           ═══════════════════════════════════ */}
        <div className="spatial-rise d2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map(c => {
              const CIcon = c.icon;
              const isActive = cat === c.label;
              return (
                <button key={c.label} onClick={() => setCat(c.label)}
                  className="shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-full text-[11px] font-semibold transition-all active:scale-95"
                  style={{
                    background: isActive ? '#9D63F6' : 'rgba(255,255,255,0.9)',
                    color: isActive ? '#FFFFFF' : '#666D80',
                    border: isActive ? 'none' : '1px solid #DFE1E6',
                    boxShadow: isActive ? '0 2px 8px rgba(27,58,107,0.25)' : 'none',
                  }}>
                  <CIcon size={13} strokeWidth={isActive ? 2.2 : 1.6} />
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[11px] text-[#A4ABB8]">
              <span className="font-bold text-[#15161E]">{filtered.length}</span> listings
            </p>
            <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1 text-[11px] font-semibold text-[#666D80] active:scale-95 transition-all">
              <ArrowUpDown size={12} /> {sort}
              <ChevronDown size={11} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Sort dropdown */}
          {showSort && (
            <div className="mt-2 bg-white rounded-[16px] border border-[#DFE1E6] shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(27,58,107,0.08)' }}>
              {SORT_OPTIONS.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <button key={s.label} onClick={() => { setSort(s.label); setShowSort(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-colors float-in ${sort === s.label ? 'bg-[#F8F9FB] text-[#9D63F6] font-bold' : 'text-[#4B5563] hover:bg-[#FAFAF8]'}`}
                    style={{ animationDelay: `${i * 0.03}s` }}>
                    <SIcon size={14} className={sort === s.label ? 'text-[#FFBD4C]' : 'text-[#A4ABB8]'} />
                    {s.label}
                    {sort === s.label && <div className="ml-auto w-2 h-2 rounded-full bg-[#FFBD4C]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════
           MY LISTINGS — User created listings
           ═══════════════════════════════════ */}
        {(showMyListings || userEnriched.length > 0) && userEnriched.length > 0 && (
          <section className="spatial-rise d3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-[#40C4AA]" />
                <h3 className="text-[14px] font-bold text-[#15161E]">My Listings</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#40C4AA] text-white">{userEnriched.length}</span>
              </div>
              <button onClick={() => setShowMyListings(!showMyListings)} className="text-[11px] font-semibold text-[#9D63F6]">
                {showMyListings ? 'Hide' : 'Show All'}
              </button>
            </div>
            <div className="space-y-2">
              {userEnriched.map(listing => (
                <button key={listing.id} onClick={() => setSelectedListing(listing)}
                  className="w-full flex items-center gap-3 p-3 rounded-[16px] border-2 border-[#40C4AA]/30 bg-[#F0FDF4] text-left active:scale-[0.98] transition-all">
                  <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0 border border-[#DFE1E6]">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-bold text-white bg-[#40C4AA] px-1.5 py-0.5 rounded-full">YOUR LISTING</span>
                      <span className="text-[9px] text-[#A4ABB8]">{listing.posted}</span>
                    </div>
                    <p className="text-[13px] font-bold text-[#15161E] truncate">{listing.title}</p>
                    <p className="text-[12px] font-extrabold text-[#40C4AA]">{listing.price}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#A4ABB8] shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════
           FEATURED — Dimensional hero cards
           ═══════════════════════════════════ */}
        {featured.length > 0 && (
          <section className="spatial-rise d3">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-[6px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFBD4C, #E0B85C)' }}>
                <Flame size={11} className="text-white" />
              </div>
              <p className="text-[13px] font-bold text-[#15161E]">Featured</p>
              <div className="flex-1 h-px bg-gradient-to-r from-[#DFE1E6] to-transparent ml-2" />
            </div>
            <div className="space-y-3">
              {featured.map((listing, i) => (
                <button key={listing.id} onClick={() => setSelectedListing(listing)}
                  className={`depth-card d${i + 1} w-full rounded-[22px] overflow-hidden text-left active:scale-[0.98] transition-all bg-white border border-[#DFE1E6]`}
                  style={{ boxShadow: '0 4px 24px rgba(27,58,107,0.08)' }}>
                  {/* Image section */}
                  <div className="relative h-[160px] overflow-hidden">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {listing.category}
                      </span>
                      <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #FFBD4C, #E0B85C)' }}>
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
                        <span key={tag} className="text-[10px] font-semibold text-[#9D63F6] bg-[#EDE8FF]/40 border border-[#DFE1E6] px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={8} className="text-[#FFBD4C]" /> {tag}
                        </span>
                      ))}
                      {Object.entries(listing.specs).slice(0, 2).map(([k, v]) => (
                        <span key={k} className="text-[10px] text-[#666D80] bg-[#F8F9FB] px-2.5 py-1 rounded-full font-medium">{v}</span>
                      ))}
                    </div>

                    {/* Seller + social proof */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-[12px] bg-[#9D63F6] flex items-center justify-center text-[11px] font-bold text-white">
                        {listing.seller.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-[#15161E]">{listing.seller}</p>
                          {listing.verified && <BadgeCheck size={13} className="text-[#059669]" />}
                        </div>
                        <p className="text-[10px] text-[#A4ABB8]">{listing.sellerCompany}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#A4ABB8]">
                        <span className="flex items-center gap-1"><Star size={10} className="text-[#FFBD4C] fill-[#FFBD4C]" /> {listing.rating}</span>
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
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[6px] bg-[#F8F9FB] flex items-center justify-center">
                  <Package size={11} className="text-[#666D80]" />
                </div>
                <p className="text-[13px] font-bold text-[#15161E]">All Listings</p>
              </div>
              <p className="text-[10px] text-[#A4ABB8]">{rest.length} items</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {rest.map((listing, i) => {
                const cc2 = conditionColor(listing.condition);
                return (
                  <button key={listing.id} onClick={() => setSelectedListing(listing)}
                    className={`depth-card d${(i % 6) + 1} rounded-[18px] overflow-hidden text-left active:scale-[0.96] transition-all bg-white border border-[#DFE1E6]`}
                    style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
                    <div className="relative">
                      <img src={listing.image} alt={listing.title}
                        className="w-full h-[180px] object-cover" />
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
                      <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                        onClick={e => { e.stopPropagation(); const heart = e.currentTarget.querySelector('svg'); if (heart) { heart.classList.toggle('text-red-500'); heart.classList.toggle('fill-red-500'); heart.classList.toggle('text-[#A4ABB8]'); } }}>
                        <Heart size={13} className="text-[#A4ABB8]" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[12px] font-bold text-[#15161E] line-clamp-2 leading-snug mb-1.5">{listing.title}</p>
                      <p className="text-[15px] font-extrabold text-[#9D63F6] mb-2">{listing.price}</p>

                      {/* AI tag (first only) */}
                      {listing.aiTags.length > 0 && (
                        <div className="mb-2">
                          <span className="text-[9px] font-semibold text-[#FFBD4C] bg-[#FEF9F0] border border-[#F5E6C8] px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <Sparkles size={7} /> {listing.aiTags[0]}
                          </span>
                        </div>
                      )}

                      {/* Seller + rating */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-[#F8F9FB]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-[6px] bg-[#F8F9FB] flex items-center justify-center text-[8px] font-bold text-[#666D80] shrink-0">
                            {listing.seller.slice(0, 2)}
                          </div>
                          <p className="text-[10px] text-[#A4ABB8] truncate">{listing.seller}</p>
                          {listing.verified && <BadgeCheck size={10} className="text-[#059669] shrink-0" />}
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#A4ABB8] shrink-0">
                          <Star size={9} className="text-[#FFBD4C] fill-[#FFBD4C]" /> {listing.rating}
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
            <div className="w-16 h-16 rounded-full bg-[#F8F9FB] flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#A4ABB8]" />
            </div>
            <p className="text-[16px] font-bold text-[#15161E] mb-1">No listings found</p>
            <p className="text-[13px] text-[#A4ABB8]">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setCat('All'); }} className="mt-4 px-5 py-2.5 rounded-full text-[13px] font-semibold text-[#9D63F6] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Listing Detail Modal ── */}
      {selectedListing && (
        <ListingDetail listing={selectedListing} onClose={closeListingWithHistory} />
      )}
    </AppShell>
  );
}
