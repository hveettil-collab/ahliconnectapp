'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SERVICES, OFFERS, COLLEAGUES, COMPANIES } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';
import {
  Sparkles, Send, ArrowRight, Plane, Car, Gamepad2,
  Heart, Shield, GraduationCap, Gift, MapPin, Users,
  Calendar, FileText, Clock, CheckCircle2, CreditCard,
  Palmtree, ShoppingBag, UtensilsCrossed, Ticket, Globe,
  HelpCircle, TrendingUp, Briefcase, DollarSign, Monitor,
  BookOpen, Receipt, Star, Zap, Trophy, ArrowLeft, Mic,
  Paperclip,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   AI RESPONSE ENGINE
   ═══════════════════════════════════════════ */

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  cards?: ActionCard[];
  typing?: boolean;
}

interface ActionCard {
  type: 'action' | 'info' | 'offer' | 'booking' | 'social';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  image?: string;
  link?: string;
}

function generateAIResponse(text: string, userName: string, companyId: string): { content: string; cards?: ActionCard[] } {
  const t = text.toLowerCase();

  if (t.includes('flight') || t.includes('fly') || t.includes('travel') || t.includes('airport') || t.includes('airline')) {
    return {
      content: `Great, ${userName}! I found some employee-exclusive flight deals:\n\n• **Abu Dhabi to London** — from AED 2,100 return\n• **Abu Dhabi to Mumbai** — from AED 890 return\n• **Abu Dhabi to Cairo** — from AED 1,200 return\n\nIHC employees get up to **15% off** with Etihad and **10% off** with Emirates.`,
      cards: [
        { type: 'booking', icon: Plane, title: 'Book a Flight', subtitle: 'Employee-discounted rates via Etihad & Emirates', color: '#40C4AA' },
        { type: 'info', icon: Globe, title: 'Travel Policy', subtitle: 'Annual return flight benefit for you + family', color: '#9D63F6' },
        { type: 'offer', icon: CreditCard, title: 'Airport Lounge Access', subtitle: 'Free entry with IHC corporate card', color: '#FFBD4C' },
      ]
    };
  }

  if (t.includes('ride') || t.includes('taxi') || t.includes('cab') || t.includes('careem') || t.includes('uber') || t.includes('transport')) {
    return {
      content: `I can help you get a ride! As an IHC employee:\n\n• **Careem Business** — Up to 30% off\n• **Airport Transfers** — AED 50 flat rate\n• **Office Shuttle** — Free daily routes\n• **EasyLease** — Monthly car lease from AED 1,299`,
      cards: [
        { type: 'booking', icon: Car, title: 'Book a Ride', subtitle: 'Careem Business — 30% off', color: '#9D63F6' },
        { type: 'info', icon: MapPin, title: 'Shuttle Schedule', subtitle: '6 pickup points · Every 30 min', color: '#40C4AA' },
      ]
    };
  }

  if (t.includes('vacation') || t.includes('holiday') || t.includes('trip') || t.includes('getaway') || t.includes('beach') || t.includes('resort')) {
    return {
      content: `Time for a getaway! IHC vacation perks:\n\n• **Yas Island Staycation** — 40% off\n• **Jebel Akhdar Group Trip** — AED 450/person\n• **Maldives Package** — AED 3,200 all-inclusive`,
      cards: [
        { type: 'booking', icon: Palmtree, title: 'Book Yas Staycation', subtitle: '40% IHC employee discount', color: '#FFBD4C' },
        { type: 'social', icon: Users, title: 'Join Group Trip', subtitle: 'Jebel Akhdar — 8/12 spots filled', color: '#40C4AA' },
      ]
    };
  }

  if (t.includes('game') || t.includes('gaming') || t.includes('fifa') || t.includes('tournament') || t.includes('play') || t.includes('league')) {
    return {
      content: `Here's what's happening in IHC Gaming!\n\n• **FIFA Tournament** — Round 2 starts today\n• **Padel League** — Sign up by Apr 5\n• **Call of Duty League** — 48/64 slots filled`,
      cards: [
        { type: 'social', icon: Trophy, title: 'FIFA Tournament', subtitle: 'Round 2 today — 32 players', color: '#DC2626' },
        { type: 'social', icon: Gamepad2, title: 'COD League', subtitle: '48/64 slots — Register now', color: '#9D63F6' },
      ]
    };
  }

  if (t.includes('benefit') || t.includes('insurance') || t.includes('medical') || t.includes('health') || t.includes('wellness')) {
    return {
      content: `Your benefits summary, ${userName}:\n\n• **Medical** — Daman Enhanced (family)\n• **Life Insurance** — 24x monthly salary\n• **Gym** — AED 150/month at Palms Sports\n• **Education** — AED 20,000/year\n\nTotal value: ~**AED 85,000/year**!`,
      cards: [
        { type: 'info', icon: Heart, title: 'Medical Coverage', subtitle: 'Daman Enhanced · Family plan', color: '#DC2626' },
        { type: 'info', icon: Shield, title: 'Life Insurance', subtitle: '24× salary · Group coverage', color: '#9D63F6' },
        { type: 'offer', icon: Gift, title: 'All 12 Benefits', subtitle: 'View complete package', color: '#FFBD4C' },
      ]
    };
  }

  if (t.includes('offer') || t.includes('discount') || t.includes('deal') || t.includes('save') || t.includes('promo')) {
    return {
      content: `Best employee offers right now:\n\n• **Aldar** — 15% off Yas Island residences\n• **Shory** — Motor insurance from AED 799/year\n• **PureHealth** — Health screening AED 299\n• **Ghitha** — 25% meal subsidy`,
      cards: OFFERS.slice(0, 3).map(offer => ({
        type: 'offer' as const, icon: Gift, title: offer.title,
        subtitle: `${offer.company} · ${offer.value}`, color: offer.color || '#FFBD4C', image: offer.image,
      })),
    };
  }

  if (t.includes('sell') || t.includes('marketplace') || t.includes('buy') || t.includes('listing')) {
    return {
      content: `The IHC Marketplace connects 45,000+ employees!\n\n• **Active listings**: 234 items\n• **Trending**: Cars, electronics, furniture`,
      cards: [
        { type: 'action', icon: ShoppingBag, title: 'Sell Something', subtitle: 'AI writes your listing from a photo', color: '#40C4AA' },
        { type: 'action', icon: Star, title: 'Browse Marketplace', subtitle: '234 items from verified employees', color: '#FFBD4C' },
      ]
    };
  }

  if (t.includes('leave') || t.includes('vacation day') || t.includes('days off') || t.includes('annual leave') || t.includes('sick leave') || t.includes('time off')) {
    return {
      content: `Your leave summary:\n\n• **Annual Leave**: **22 days** remaining\n• **Sick Leave**: 10 days available\n• **Emergency Leave**: 5 days/incident\n\n**NEW:** You can now submit leave requests instantly using our **Smart Leave Manager** automation — no more email chains!`,
      cards: [
        { type: 'action', icon: Zap, title: 'Submit Leave Request', subtitle: 'Automated — instant approval pipeline', color: '#40C4AA', link: '/automations/leave-request' },
        { type: 'info', icon: Calendar, title: 'Leave Balance', subtitle: '22 annual · 10 sick · 5 emergency', color: '#9D63F6' },
        { type: 'action', icon: TrendingUp, title: 'View All Automations', subtitle: '347 hrs/week saved across IHC', color: '#FFBD4C', link: '/automations' },
      ]
    };
  }

  if (t.includes('salary') || t.includes('payslip') || t.includes('certificate') || t.includes('pay')) {
    return {
      content: `Salary options:\n\n• **March payslip** ready to download\n• **Salary certificates** — now **instant** with automation!\n• **Next salary credit**: April 28th\n\n**No more waiting 3-5 days!** Generate your salary certificate in under 30 seconds with digital verification.`,
      cards: [
        { type: 'action', icon: Zap, title: 'Generate Salary Certificate', subtitle: 'Automated — ready in < 30 seconds', color: '#40C4AA', link: '/automations/salary-certificate' },
        { type: 'info', icon: DollarSign, title: 'View Payslip', subtitle: 'March 2026', color: '#40C4AA' },
        { type: 'action', icon: TrendingUp, title: 'View All Automations', subtitle: '347 hrs/week saved across IHC', color: '#FFBD4C', link: '/automations' },
      ]
    };
  }

  if (t.includes('expense') || t.includes('receipt') || t.includes('reimburse') || t.includes('claim') || t.includes('reimbursement')) {
    return {
      content: `Expense management:\n\n• **AI Expense Processor** — snap a receipt, AI does the rest!\n• **Pending claims**: 0\n• **Last reimbursement**: AED 420 (31 Mar)\n\nNo more manual Excel entry. Our AI extracts vendor, amount, date & category automatically and validates against company policy.`,
      cards: [
        { type: 'action', icon: Zap, title: 'Submit Expense Claim', subtitle: 'AI-powered — receipt to reimbursement in 2 min', color: '#40C4AA', link: '/automations/expense-claim' },
        { type: 'info', icon: Receipt, title: 'Expense History', subtitle: '3 claims this month · AED 1,142', color: '#9D63F6' },
        { type: 'action', icon: TrendingUp, title: 'View All Automations', subtitle: '347 hrs/week saved across IHC', color: '#FFBD4C', link: '/automations' },
      ]
    };
  }

  if (t.includes('automat') || t.includes('workflow') || t.includes('process')) {
    return {
      content: `Here are the automations available to you:\n\n• **Salary Certificate** — Instant PDF with digital verification\n• **Smart Leave Manager** — Auto-balance, conflict check, approval pipeline\n• **AI Expense Processor** — Receipt scanning with policy compliance\n\nTogether these save **347 hours/week** across IHC with a **95% error reduction**.`,
      cards: [
        { type: 'action', icon: FileText, title: 'Salary Certificate', subtitle: 'Generate in < 30 seconds', color: '#9D63F6', link: '/automations/salary-certificate' },
        { type: 'action', icon: Calendar, title: 'Leave Request', subtitle: 'Automated approval pipeline', color: '#40C4AA', link: '/automations/leave-request' },
        { type: 'action', icon: Receipt, title: 'Expense Claim', subtitle: 'AI receipt extraction', color: '#FFBD4C', link: '/automations/expense-claim' },
      ]
    };
  }

  return {
    content: `I'm your AI assistant for everything at IHC! I can help with:\n\n• Book flights with employee discounts\n• Book rides & check shuttle schedules\n• Plan vacations & join group trips\n• Join gaming tournaments & leagues\n• View benefits, offers & discounts\n\nJust ask me anything, ${userName}!`,
    cards: [
      { type: 'booking', icon: Plane, title: 'Book a Flight', subtitle: 'Employee-discounted rates', color: '#40C4AA' },
      { type: 'booking', icon: Palmtree, title: 'Plan a Vacation', subtitle: 'Group trips & staycations', color: '#FFBD4C' },
      { type: 'social', icon: Gamepad2, title: 'Gaming & Activities', subtitle: 'Tournaments & leagues', color: '#DC2626' },
      { type: 'offer', icon: Gift, title: 'My Benefits', subtitle: 'AED 85K+ in annual benefits', color: '#FFBD4C' },
    ]
  };
}

/* ═══════════════════════════════════════════
   SUGGESTION CARDS
   ═══════════════════════════════════════════ */

const SUGGESTIONS = [
  {
    icon: Zap,
    label: 'Automations',
    prompt: 'Show me available automations',
    color: '#40C4AA',
  },
  {
    icon: FileText,
    label: 'Salary Certificate',
    prompt: 'I need a salary certificate for a bank loan',
    color: '#9D63F6',
  },
  {
    icon: Receipt,
    label: 'Expense Claim',
    prompt: 'I need to submit an expense receipt',
    color: '#FFBD4C',
  },
  {
    icon: Calendar,
    label: 'Leave Request',
    prompt: 'I want to apply for annual leave',
    color: '#40C4AA',
  },
];

/* ═══════════════════════════════════════════
   MAIN PAGE — Dark premium AI interface
   ═══════════════════════════════════════════ */

export default function ServicesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = user?.name?.split(' ')[0] || 'there';
  const companyId = user?.companyId || 'ihc';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || inputValue.trim();
    if (!msg) return;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setMessages(prev => [...prev, { role: 'ai', content: '', typing: true }]);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const response = generateAIResponse(msg, userName, companyId);
    setMessages(prev => [
      ...prev.filter(m => !m.typing),
      { role: 'ai', content: response.content, cards: response.cards },
    ]);
  };

  if (!user) return null;
  const company = COMPANIES.find(c => c.id === user.companyId);

  /* ── Chat mode ── */
  if (messages.length > 0) {
    return (
      <AppShell title="Ahli AI" subtitle="Online" hideTopBar>
        <style>{`
          @keyframes typing-bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 sticky top-0 z-10" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #DFE1E6' }}>
          <button onClick={() => setMessages([])} className="p-1.5 rounded-lg text-[#666D80] hover:text-[#15161E] hover:bg-[#F8F9FB] transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center shadow-md">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#15161E]">Ahli AI</p>
              <p className="text-[10px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="px-3 md:px-6 py-4 space-y-3 max-w-4xl mx-auto w-full">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div className="max-w-md md:max-w-lg lg:max-w-2xl">
                {msg.typing ? (
                  <div className="bg-white border border-[#DFE1E6] rounded-[16px] rounded-bl-[4px] px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-[#9D63F6]/40"
                          style={{ animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-[#9D63F6] text-white rounded-[16px] rounded-br-[4px]'
                          : 'bg-white text-[#15161E] rounded-[16px] rounded-bl-[4px] border border-[#DFE1E6] shadow-sm'
                      }`}
                    >
                      {msg.content.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                      )}
                    </div>

                    {msg.cards && msg.cards.length > 0 && (
                      <div className="mt-2 space-y-2 flex flex-col">
                        {msg.cards.map((card, ci) => {
                          const IconComp = card.icon;
                          return (
                            <button
                              key={ci}
                              onClick={() => { if (card.link) router.push(card.link); }}
                              className="w-full flex items-center gap-3 bg-white border border-[#DFE1E6] rounded-[14px] p-3 text-left hover:shadow-md md:hover:shadow-lg active:scale-[0.98] transition-all"
                            >
                              {card.image ? (
                                <img src={card.image} alt={card.title} className="w-10 h-10 rounded-[10px] object-cover shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                  style={{ background: card.color + '15' }}>
                                  <IconComp size={18} style={{ color: card.color }} strokeWidth={1.8} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-[#15161E]">{card.title}</p>
                                <p className="text-[11px] text-[#A4ABB8]">{card.subtitle}</p>
                              </div>
                              <ArrowRight size={14} className="text-[#A4ABB8] shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick chips */}
        {messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && !messages[messages.length - 1]?.typing && (
          <div className="px-3 md:px-6 lg:px-8 pb-2 shrink-0 max-w-4xl mx-auto w-full">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['Flights', 'Benefits', 'Gaming', 'Offers', 'Rides'].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip.split(' ')[0])}
                  className="shrink-0 text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-white text-[#9D63F6] border border-[#DFE1E6] transition-all active:scale-95 hover:shadow-md md:hover:bg-white/90"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="sticky bottom-0 px-3 md:px-6 py-3" style={{ background: 'rgba(248,249,251,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid #DFE1E6' }}>
          <div className="flex items-center gap-2 rounded-[16px] px-3 py-2 bg-white border border-[#DFE1E6] max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Message Ahli AI"
              className="flex-1 bg-transparent text-sm text-[#15161E] placeholder:text-[#A4ABB8] py-3 outline-none"
            />
            <button className="text-[#A4ABB8] hover:text-[#666D80] transition-colors p-1">
              <Paperclip size={18} />
            </button>
            {inputValue.trim() ? (
              <button
                onClick={() => handleSend()}
                className="w-8 h-8 rounded-full bg-[#9D63F6] flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
              >
                <Send size={14} />
              </button>
            ) : (
              <button className="text-[#A4ABB8] hover:text-[#666D80] transition-colors p-1">
                <Mic size={18} />
              </button>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  /* ── Welcome state ── */
  return (
    <AppShell title="AI Assistant" subtitle="Ask me anything" hideTopBar>

      {/* Inline CSS for all animations */}
      <style>{`
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float-dot-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(8px, -12px); opacity: 1; }
        }
        @keyframes float-dot-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(-10px, 8px); opacity: 0.8; }
        }
        @keyframes float-dot-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(6px, 10px); opacity: 0.9; }
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.1); }
        }
        @keyframes zigzag-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-6px) rotate(5deg); opacity: 1; }
        }
        @keyframes card-appear {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-star { animation: star-pulse 3s ease-in-out infinite; }
        .ai-orbit { animation: orbit-spin 12s linear infinite; }
        .ai-orbit-reverse { animation: orbit-spin-reverse 16s linear infinite; }
        .ai-dot-1 { animation: float-dot-1 4s ease-in-out infinite; }
        .ai-dot-2 { animation: float-dot-2 5s ease-in-out infinite; }
        .ai-dot-3 { animation: float-dot-3 3.5s ease-in-out infinite; }
        .ai-glow-breathe { animation: glow-breathe 4s ease-in-out infinite; }
        .ai-zigzag { animation: zigzag-float 3s ease-in-out infinite; }
        .suggestion-card { animation: card-appear 0.5s ease-out both; }
        .suggestion-card:nth-child(2) { animation-delay: 0.1s; }
        .suggestion-card:nth-child(3) { animation-delay: 0.2s; }
        .suggestion-card:nth-child(4) { animation-delay: 0.3s; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 relative sticky top-0 z-10" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(223,225,230,0.6)' }}>
        <Link href="/dashboard" className="absolute left-4 p-1.5 rounded-lg text-[#666D80] hover:text-[#15161E] hover:bg-[#F8F9FB] transition-all">
          <ArrowLeft size={20} />
        </Link>
        <p className="text-[15px] font-bold text-[#15161E]">Ahli AI</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col max-w-3xl mx-auto w-full px-4 md:px-6">

        {/* ── Animated star visual ── */}
        <div className="relative flex items-center justify-center pt-8 md:pt-12 pb-8" style={{ height: '280px' }}>

          {/* Large soft glow behind star */}
          <div className="absolute ai-glow-breathe" style={{
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157,99,246,0.12) 0%, rgba(157,99,246,0.03) 50%, transparent 70%)',
          }} />

          {/* Outer orbit ring */}
          <div className="absolute ai-orbit" style={{
            width: 180, height: 180, borderRadius: '50%',
            border: '1px solid rgba(157,99,246,0.1)',
          }} />

          {/* Inner orbit ring — reverse */}
          <div className="absolute ai-orbit-reverse" style={{
            width: 130, height: 130, borderRadius: '50%',
            border: '1px solid rgba(157,99,246,0.12)',
          }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#9D63F6]/40" />
          </div>

          {/* Central star */}
          <div className="ai-star relative z-10">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z" fill="#9D63F6" />
              <path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z" fill="url(#star-grad-light)" fillOpacity="0.3" />
              <defs>
                <radialGradient id="star-grad-light" cx="50%" cy="50%"><stop offset="0%" stopColor="#B182F8" /><stop offset="100%" stopColor="#9D63F6" /></radialGradient>
              </defs>
            </svg>
          </div>

          {/* Floating accent dots */}
          <div className="absolute ai-dot-1" style={{ top: '22%', left: '32%' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#9D63F6]/50" />
          </div>
          <div className="absolute ai-dot-2" style={{ top: '30%', right: '28%' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1 L9 7 L15 8 L9 9 L8 15 L7 9 L1 8 L7 7 Z" fill="#9D63F6" fillOpacity="0.4" />
            </svg>
          </div>
          <div className="absolute ai-dot-3" style={{ bottom: '28%', left: '28%' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#9D63F6]/30" />
          </div>

          {/* Zigzag accent */}
          <div className="absolute ai-zigzag" style={{ bottom: '22%', right: '26%' }}>
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path d="M2 14 L8 4 L14 12 L20 4 L26 14" stroke="#FFBD4C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── Greeting text ── */}
        <div className="pb-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#15161E] leading-snug mb-2">
            I am here to simplify your work.
          </h1>
          <p className="text-base md:text-lg text-[#A4ABB8] font-medium">
            How can I help you?
          </p>
        </div>

        {/* ── Suggestion cards — responsive grid ── */}
        <div className="pb-20 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTIONS.map((s, i) => {
              const SIcon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(s.prompt)}
                  className="suggestion-card text-left rounded-[18px] p-4 border border-[#DFE1E6]/60 active:scale-[0.97] transition-all hover:shadow-md md:hover:shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
                    style={{ background: s.color + '12' }}
                  >
                    <SIcon size={17} style={{ color: s.color }} strokeWidth={2} />
                  </div>
                  <p className="text-[13px] font-semibold text-[#15161E] mb-1">{s.label}</p>
                  <p className="text-[11px] text-[#A4ABB8] leading-snug">{s.prompt}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="sticky bottom-0 px-3 md:px-6 py-3" style={{ background: 'rgba(248,249,251,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(223,225,230,0.6)' }}>
        <div className="flex items-center gap-2 rounded-[16px] px-3 py-2 bg-white border border-[#DFE1E6] max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Message Ahli AI"
            className="flex-1 bg-transparent text-sm text-[#15161E] placeholder:text-[#A4ABB8] py-3 outline-none"
          />
          <button className="text-[#A4ABB8] hover:text-[#666D80] transition-colors p-1">
            <Paperclip size={18} />
          </button>
          {inputValue.trim() ? (
            <button
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-full bg-[#9D63F6] flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
            >
              <Send size={14} />
            </button>
          ) : (
            <button className="text-[#A4ABB8] hover:text-[#666D80] transition-colors p-1">
              <Mic size={18} />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
