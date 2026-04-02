'use client';
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { SERVICES, COLLEAGUES, COMPANIES } from '@/lib/mockData';
import {
  Calendar, MapPin, Users, Clock, ChevronRight, X, Check, Send, Search,
  Sparkles, Trophy, Heart, GraduationCap, Zap, Shield, Building2, Globe,
  FileText, Monitor, BookOpen, Receipt, Plane, Briefcase, Star,
  ArrowRight, UserPlus, Share2, CheckCircle2, Bell, MessageCircle,
  Tag, ShoppingBag, Flame, UtensilsCrossed, Gamepad2, Car, Palmtree,
  Coffee, Dumbbell, Ticket, TrendingUp, Gift, Bookmark,
} from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════
   INLINE ANIMATIONS
   ═══════════════════════════════════════════ */

const EXPLORE_STYLES = `
  @keyframes card-rise {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .card-rise { animation: card-rise 0.5s ease-out both; }
  .card-rise-1 { animation-delay: 0.05s; }
  .card-rise-2 { animation-delay: 0.1s; }
  .card-rise-3 { animation-delay: 0.15s; }
  .card-rise-4 { animation-delay: 0.2s; }
  .card-rise-5 { animation-delay: 0.25s; }
  .card-rise-6 { animation-delay: 0.3s; }
  .shimmer-bg {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════
   FILTER CHIPS
   ═══════════════════════════════════════════ */

const FILTER_CHIPS = [
  { label: 'For You', icon: Sparkles, active: true },
  { label: 'Trending', icon: TrendingUp },
  { label: 'Wellness', icon: Heart },
  { label: 'Offers', icon: Gift },
  { label: 'Events', icon: Calendar },
  { label: 'Learning', icon: GraduationCap },
  { label: 'Sports', icon: Trophy },
];

/* ═══════════════════════════════════════════
   FEATURED HERO DATA
   ═══════════════════════════════════════════ */

const FEATURED_HEROES = [
  {
    id: 'hero1',
    title: 'Employee Wellness Week',
    subtitle: 'Free health screenings, yoga & nutrition talks',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
    tag: 'Wellness',
    tagColor: '#059669',
    cta: 'Register Now',
    countdown: 'Starts Apr 25',
    spots: '313 / 500 registered',
  },
  {
    id: 'hero2',
    title: 'IHC Innovation Hackathon',
    subtitle: '48-hour cross-company AI hackathon — AED 50K prizes',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    tag: 'Innovation',
    tagColor: '#7C3AED',
    cta: 'Join Now',
    countdown: 'Apr 18–20',
    spots: '97 / 120 spots filled',
  },
];

/* ═══════════════════════════════════════════
   BENTO CATEGORIES (modular grid)
   ═══════════════════════════════════════════ */

interface BentoItem {
  icon: typeof Heart;
  label: string;
  desc: string;
  image: string;
  href: string;
  size: 'large' | 'medium' | 'small';
  accent: string;
}

const BENTO_LIFESTYLE: BentoItem[] = [
  { icon: UtensilsCrossed, label: 'Dining', desc: '25% off at 40+ restaurants', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop', href: '/services', size: 'large', accent: '#C8973A' },
  { icon: Heart, label: 'Healthcare', desc: 'Daman Enhanced coverage', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#DC2626' },
  { icon: Dumbbell, label: 'Fitness', desc: 'Palms Sports — AED 150/mo', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#0D9488' },
  { icon: Palmtree, label: 'Leisure', desc: 'Yas Island 40% off', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#1B3A6B' },
  { icon: Coffee, label: 'Café', desc: 'Daily coffee perks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#92400E' },
  { icon: Calendar, label: 'Events', desc: '5 upcoming this month', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop', href: '/explore', size: 'small', accent: '#7C3AED' },
];

const BENTO_BUSINESS: BentoItem[] = [
  { icon: GraduationCap, label: 'IHC Academy', desc: 'Courses & certifications', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=500&h=500&fit=crop', href: '/services', size: 'large', accent: '#1B3A6B' },
  { icon: Globe, label: 'IHC Portals', desc: 'All group platforms', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#0D9488' },
  { icon: FileText, label: 'HR Services', desc: 'Certificates & requests', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#C8973A' },
  { icon: Building2, label: 'Directory', desc: '45,000+ employees', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#1B3A6B' },
  { icon: Briefcase, label: 'Business Centres', desc: 'Meeting rooms & co-work', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#059669' },
];

/* ═══════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { icon: Plane, label: 'Flights', color: '#1B3A6B', href: '/services' },
  { icon: Car, label: 'Rides', color: '#0D9488', href: '/services' },
  { icon: ShoppingBag, label: 'Marketplace', color: '#C8973A', href: '/marketplace' },
  { icon: Gamepad2, label: 'Gaming', color: '#DC2626', href: '/services' },
  { icon: Shield, label: 'Insurance', color: '#7C3AED', href: '/services' },
  { icon: Receipt, label: 'Payslip', color: '#059669', href: '/services' },
];

/* ═══════════════════════════════════════════
   EVENTS DATA
   ═══════════════════════════════════════════ */

interface CompanyEvent {
  id: string; title: string; description: string; longDescription: string;
  date: string; time: string; location: string; category: string;
  color: string; icon: typeof Trophy; image: string;
  spots: number; spotsLeft: number; organizer: string; organizerCompany: string;
  tags: string[]; agenda: { time: string; item: string }[];
}

const EVENTS: CompanyEvent[] = [
  {
    id: 'evt001', title: 'IHC Innovation Hackathon 2026',
    description: '48-hour cross-company hackathon to build AI-powered solutions.',
    longDescription: 'Join teams across 30+ IHC subsidiaries for an intense 48-hour hackathon. Build AI-powered solutions addressing real business challenges. Top 3 teams win AED 50,000 in prizes.',
    date: 'Apr 18–20, 2026', time: '9:00 AM – 6:00 PM', location: 'IHC Tower, Abu Dhabi',
    category: 'Hackathon', color: '#7C3AED', icon: Trophy,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    spots: 120, spotsLeft: 23, organizer: 'Ahmed Al Rashidi', organizerCompany: 'IHC Group',
    tags: ['AI', 'Innovation', 'Prizes'], agenda: [
      { time: 'Day 1', item: 'Opening & team formation' }, { time: 'Day 2', item: 'Build day' },
      { time: 'Day 3', item: 'Presentations & awards' },
    ],
  },
  {
    id: 'evt002', title: 'Employee Wellness Week',
    description: 'Health screenings, yoga sessions, mental health workshops.',
    longDescription: 'PureHealth and IHC Group present Wellness Week — free health screenings, daily yoga, expert-led workshops on stress management, and nutrition consultations.',
    date: 'Apr 25–29, 2026', time: '8:00 AM – 5:00 PM', location: 'PureHealth HQ',
    category: 'Wellness', color: '#059669', icon: Heart,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    spots: 500, spotsLeft: 187, organizer: 'Noura Hassan', organizerCompany: 'PureHealth',
    tags: ['Health', 'Free', 'Family'], agenda: [
      { time: 'Mon', item: 'Health screenings' }, { time: 'Wed', item: 'Mental health workshop' },
      { time: 'Fri', item: 'Fitness challenge & awards' },
    ],
  },
  {
    id: 'evt003', title: 'AI & Automation Masterclass',
    description: 'Hands-on workshop on using AI tools at work.',
    longDescription: 'Learn how to leverage AI and automation tools to streamline your daily work. Covers prompt engineering, workflow automation, and building custom GPT assistants.',
    date: 'May 5, 2026', time: '10:00 AM – 3:00 PM', location: 'Virtual (MS Teams)',
    category: 'Training', color: '#1B3A6B', icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    spots: 200, spotsLeft: 64, organizer: 'Faris Al Nuaimi', organizerCompany: 'Shory',
    tags: ['AI', 'Virtual', 'Certificate'], agenda: [
      { time: '10 AM', item: 'Intro to AI' }, { time: '1 PM', item: 'Hands-on build' },
      { time: '2:30 PM', item: 'Demo & certificates' },
    ],
  },
  {
    id: 'evt004', title: 'Cross-Company Sports Day',
    description: 'Annual inter-subsidiary sports tournament at Yas Island.',
    longDescription: 'The biggest sporting event of the year! Football, basketball, padel, and volleyball. Register as a team or individual.',
    date: 'May 22, 2026', time: '7:00 AM – 4:00 PM', location: 'Yas Sports Complex',
    category: 'Sports', color: '#DC2626', icon: Zap,
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=600&h=400&fit=crop',
    spots: 300, spotsLeft: 88, organizer: 'Palms Sports', organizerCompany: 'Palms Sports',
    tags: ['Sports', 'Teams', 'Family'], agenda: [
      { time: '8 AM', item: 'Opening ceremony' }, { time: '1 PM', item: 'Finals' },
      { time: '3:30 PM', item: 'Awards' },
    ],
  },
];

/* ═══════════════════════════════════════════
   PARTNER COMPANIES
   ═══════════════════════════════════════════ */

const PARTNERS = [
  { name: 'Aldar', logo: '/logos/aldar.svg', color: '#C8973A' },
  { name: 'PureHealth', logo: '/logos/purehealth.svg', color: '#059669' },
  { name: 'Palms Sports', logo: '/logos/palms-sports.svg', color: '#EA580C' },
  { name: 'Shory', logo: '/logos/shory.svg', color: '#6B21A8' },
  { name: 'Multiply', logo: '/logos/multiply.svg', color: '#C8973A' },
];

/* ═══════════════════════════════════════════
   EVENT DETAIL MODAL
   ═══════════════════════════════════════════ */

function EventDetailModal({ event, onClose }: { event: CompanyEvent; onClose: () => void }) {
  const [registered, setRegistered] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredColleagues = COLLEAGUES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleInvite = (colId: string) => setInviteSent(prev => [...prev, colId]);
  const spotsPercent = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[92vh] overflow-y-auto animate-slide-in-up">
        <div className="relative h-52 overflow-hidden rounded-t-[28px]">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <X size={16} className="text-white" />
          </button>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: event.color }}>{event.category}</span>
            {event.spotsLeft < 100 && (
              <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full bg-red-500/90 flex items-center gap-1">
                <Flame size={10} /> {event.spotsLeft} spots left
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-lg font-bold text-white leading-snug mb-1">{event.title}</h2>
            <div className="flex items-center gap-3 text-white/80 text-[11px]">
              <span className="flex items-center gap-1"><Calendar size={11} /> {event.date}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {event.location.split(',')[0]}</span>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Clock, label: 'Time', value: event.time.split('–')[0] },
              { icon: Users, label: 'Capacity', value: `${spotsPercent}% Full` },
              { icon: Building2, label: 'By', value: event.organizerCompany },
            ].map(({ icon: IC, label, value }) => (
              <div key={label} className="bg-[#F9F6F1] rounded-[14px] p-3 text-center border border-[#E8E2D9]">
                <IC size={15} className="mx-auto text-[#6B7280] mb-1" />
                <p className="text-[10px] text-[#9CA3AF]">{label}</p>
                <p className="text-[11px] font-bold text-[#1A1A2E] truncate">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                style={{ color: event.color, borderColor: event.color + '30', background: event.color + '08' }}>{tag}</span>
            ))}
          </div>
          <div className="bg-white rounded-[14px] border border-[#E8E2D9] p-4">
            <h3 className="text-xs font-bold text-[#1A1A2E] mb-1.5">About this event</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{event.longDescription}</p>
          </div>
          <div className="bg-[#F9F6F1] rounded-[16px] border border-[#E8E2D9] p-4">
            <h3 className="text-xs font-bold text-[#1A1A2E] mb-3">Agenda</h3>
            <div className="space-y-2.5">
              {event.agenda.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: event.color }} />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold" style={{ color: event.color }}>{item.time}</p>
                    <p className="text-xs text-[#1A1A2E]">{item.item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showInvite && (
            <div className="bg-[#F9F6F1] rounded-[16px] border border-[#E8E2D9] p-4">
              <h3 className="text-xs font-bold text-[#1A1A2E] mb-2.5">Invite Colleagues</h3>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type="text" placeholder="Search colleagues..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded-[10px] outline-none focus:border-[#1B3A6B]" />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredColleagues.map(col => {
                  const sent = inviteSent.includes(col.id);
                  return (
                    <div key={col.id} className="flex items-center gap-2.5 bg-white rounded-[10px] px-3 py-2 border border-[#E8E2D9]">
                      <Avatar initials={col.avatar} color="#6B7280" size="sm" image={col.image} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A2E] truncate">{col.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{col.company}</p>
                      </div>
                      <button onClick={() => handleInvite(col.id)} disabled={sent}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${sent ? 'bg-green-50 text-green-600 border border-green-200' : 'text-white border border-transparent'}`}
                        style={!sent ? { background: event.color } : undefined}>
                        {sent ? <span className="flex items-center gap-1"><Check size={10} /> Sent</span> : <span className="flex items-center gap-1"><Send size={10} /> Invite</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="space-y-2 pb-4">
            {!registered ? (
              <button onClick={() => setRegistered(true)} className="w-full py-3 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.98]" style={{ background: event.color }}>
                Register for this Event
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-[14px] px-4 py-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-green-700">You&apos;re registered!</p>
                  <p className="text-[10px] text-green-600">Confirmation sent to your email</p>
                </div>
              </div>
            )}
            <button onClick={() => setShowInvite(!showInvite)} className="w-full py-2.5 rounded-[14px] text-xs font-semibold border border-[#E8E2D9] text-[#1A1A2E] bg-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <UserPlus size={14} /> {showInvite ? 'Hide Invites' : 'Invite Colleagues'}
            </button>
            <button className="w-full py-2.5 rounded-[14px] text-xs font-semibold text-[#9CA3AF] flex items-center justify-center gap-2">
              <Share2 size={14} /> Share Event Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BENTO GRID COMPONENT
   ═══════════════════════════════════════════ */

function BentoGrid({ items }: { items: BentoItem[] }) {
  const large = items.find(i => i.size === 'large');
  const mediums = items.filter(i => i.size === 'medium');
  const smalls = items.filter(i => i.size === 'small');

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* Large card — spans full width */}
      {large && (
        <Link href={large.href} className="col-span-2 card-rise relative rounded-[20px] overflow-hidden h-[160px] group active:scale-[0.98] transition-transform">
          <img src={large.image} alt={large.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: large.accent }}>
                <large.icon size={16} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">{large.label}</span>
            </div>
            <p className="text-white text-[15px] font-bold leading-snug">{large.desc}</p>
          </div>
          <div className="absolute top-4 right-4">
            <ArrowRight size={18} className="text-white/50 group-hover:text-white transition-colors" />
          </div>
        </Link>
      )}

      {/* Medium cards — 1 column each */}
      {mediums.map((item, i) => (
        <Link key={item.label} href={item.href}
          className={`card-rise card-rise-${i + 1} relative rounded-[18px] overflow-hidden h-[140px] group active:scale-[0.97] transition-transform`}>
          <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
          <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
              <item.icon size={14} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">{item.label}</p>
              <p className="text-white/70 text-[10px] mt-0.5">{item.desc}</p>
            </div>
          </div>
        </Link>
      ))}

      {/* Small cards — 3-up or fill remaining */}
      {smalls.map((item, i) => (
        <Link key={item.label} href={item.href}
          className={`card-rise card-rise-${i + 3} rounded-[16px] overflow-hidden p-3.5 flex items-center gap-3 border border-[#E8E2D9] active:scale-[0.97] transition-all ${smalls.length === 3 && i === 2 ? 'col-span-2' : ''}`}
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: item.accent + '12' }}>
            <item.icon size={18} style={{ color: item.accent }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#1A1A2E]">{item.label}</p>
            <p className="text-[10px] text-[#9CA3AF] truncate">{item.desc}</p>
          </div>
          <ChevronRight size={14} className="text-[#D1D5DB] shrink-0" />
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════ */

function SectionHeader({ title, count, href }: { title: string; count?: number; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[17px] font-bold text-[#1A1A2E]">{title}</h2>
        {count !== undefined && (
          <span className="text-[10px] font-bold bg-[#1B3A6B] text-white px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {href && (
        <Link href={href} className="text-[11px] font-semibold text-[#1B3A6B] flex items-center gap-1">
          See all <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPLORE PAGE
   ═══════════════════════════════════════════ */

export default function ExplorePage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [selectedEvent, setSelectedEvent] = useState<CompanyEvent | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);

  if (!user) return null;

  const hero = FEATURED_HEROES[heroIdx];

  return (
    <AppShell title="Explore" subtitle="">
      <style>{EXPLORE_STYLES}</style>

      <div className="space-y-6">

        {/* ═══ SMART FILTER CHIPS ═══ */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {FILTER_CHIPS.map(chip => {
            const ChipIcon = chip.icon;
            const isActive = activeFilter === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => setActiveFilter(chip.label)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95"
                style={{
                  background: isActive ? '#1B3A6B' : 'rgba(255,255,255,0.85)',
                  color: isActive ? '#FFFFFF' : '#666D80',
                  border: isActive ? 'none' : '1px solid #E8E2D9',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                <ChipIcon size={13} strokeWidth={isActive ? 2.2 : 1.6} />
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* ═══ FEATURED HERO — large swipeable CTA card ═══ */}
        <section className="card-rise">
          <div className="relative rounded-[24px] overflow-hidden h-[200px] group">
            <img src={hero.image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer-bg pointer-events-none" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: hero.tagColor }}>{hero.tag}</span>
              <span className="text-[10px] font-medium text-white/70 px-2.5 py-1 rounded-full border border-white/20"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                {hero.countdown}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-[18px] font-bold text-white leading-snug mb-1">{hero.title}</h3>
              <p className="text-[12px] text-white/75 mb-3 leading-relaxed">{hero.subtitle}</p>
              <div className="flex items-center justify-between">
                <button className="px-5 py-2.5 rounded-full text-[12px] font-bold text-[#1A1A2E] bg-white active:scale-95 transition-transform">
                  {hero.cta}
                </button>
                <span className="text-[10px] text-white/50 font-medium">{hero.spots}</span>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-5 right-5 flex gap-1.5">
              {FEATURED_HEROES.map((_, i) => (
                <button key={i} onClick={() => setHeroIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === heroIdx ? 18 : 6, height: 6,
                    background: i === heroIdx ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ QUICK ACTIONS — icon grid ═══ */}
        <section>
          <div className="grid grid-cols-6 gap-1">
            {QUICK_ACTIONS.map((action, i) => {
              const AIcon = action.icon;
              return (
                <Link key={action.label} href={action.href}
                  className={`card-rise card-rise-${i} flex flex-col items-center gap-1.5 py-3 rounded-[16px] active:scale-95 transition-transform`}>
                  <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: action.color + '10' }}>
                    <AIcon size={20} style={{ color: action.color }} strokeWidth={1.7} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#666D80]">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══ LIFESTYLE — bento grid ═══ */}
        <section>
          <SectionHeader title="Lifestyle" href="/offers" />
          <BentoGrid items={BENTO_LIFESTYLE} />
        </section>

        {/* ═══ UPCOMING EVENTS — vertical stack ═══ */}
        <section>
          <SectionHeader title="Upcoming Events" count={EVENTS.length} href="/explore" />
          <div className="space-y-3">
            {EVENTS.slice(0, 3).map((event, i) => {
              const EIcon = event.icon;
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#E8E2D9] active:scale-[0.98] transition-all`}
                  style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/15" />
                    <div className="absolute bottom-1.5 left-1.5">
                      <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: event.color }}>
                        <EIcon size={12} className="text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: event.color + '12', color: event.color }}>
                        {event.category}
                      </span>
                      {event.spotsLeft < 100 && (
                        <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5">
                          <Flame size={9} /> {event.spotsLeft} left
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-bold text-[#1A1A2E] leading-snug truncate">{event.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-[#9CA3AF]">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {event.date.split(',')[0]}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {event.location.split(',')[0]}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ BUSINESS — bento grid ═══ */}
        <section>
          <SectionHeader title="Business" href="/services" />
          <BentoGrid items={BENTO_BUSINESS} />
        </section>

        {/* ═══ GAMING & ACTIVITIES — immersive cards ═══ */}
        <section>
          <SectionHeader title="Gaming & Activities" />
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => setSelectedEvent(EVENTS[3])}
              className="col-span-1 row-span-2 rounded-[20px] text-left flex flex-col justify-between min-h-[210px] active:scale-[0.98] transition-all relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=400&h=500&fit=crop" alt="Sports" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />
              <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] text-white/50 font-semibold uppercase tracking-wider">Event</p>
                  <p className="text-[13px] font-bold text-white leading-snug mt-0.5">Sports Day<br />Yas Island</p>
                  <div className="mt-2 inline-block px-2.5 py-1 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <p className="text-[14px] font-bold text-white leading-none">22 May</p>
                  </div>
                </div>
              </div>
            </button>
            <Link href="/services" className="rounded-[18px] overflow-hidden relative min-h-[100px] active:scale-[0.97] transition-all">
              <img src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop" alt="FIFA" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <Gamepad2 size={14} className="text-white" strokeWidth={2} />
                <p className="text-[11px] font-bold text-white">FIFA League</p>
              </div>
            </Link>
            <Link href="/services" className="rounded-[18px] overflow-hidden relative min-h-[100px] active:scale-[0.97] transition-all">
              <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop" alt="Padel" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <Trophy size={14} className="text-white" strokeWidth={2} />
                <p className="text-[11px] font-bold text-white">Padel Cup</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══ OUR COMPANIES ═══ */}
        <section>
          <SectionHeader title="Our Companies" href="/about" />
          <div className="grid grid-cols-5 gap-2">
            {PARTNERS.map(p => (
              <div key={p.name} className="flex flex-col items-center gap-2 py-3 rounded-[16px] border border-[#E8E2D9]" style={{ background: 'rgba(255,255,255,0.85)' }}>
                <img src={p.logo} alt={p.name} className="w-11 h-11 rounded-[12px]" />
                <p className="text-[9px] font-bold text-[#1A1A2E] text-center leading-tight">{p.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ PEOPLE ═══ */}
        <section>
          <SectionHeader title="People" href="/profile" />
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {COLLEAGUES.map(col => (
              <Link key={col.id} href="/profile" className="shrink-0 flex flex-col items-center gap-1.5 w-16">
                <div className="relative">
                  <Avatar initials={col.avatar} color="#6B7280" size="lg" image={col.image} />
                  {col.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <p className="text-[10px] font-semibold text-[#1A1A2E] text-center leading-tight truncate w-full">{col.name.split(' ')[0]}</p>
                <p className="text-[9px] text-[#9CA3AF] truncate w-full text-center">{col.company.split(' ')[0]}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </AppShell>
  );
}
