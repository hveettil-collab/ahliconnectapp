'use client';
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useModalHistory } from '@/hooks/useModalHistory';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { SERVICES, COLLEAGUES, COMPANIES } from '@/lib/mockData';
import {
  Calendar, MapPin, Users, Clock, ChevronRight, X, Check, Send, Search,
  Sparkles, Trophy, Heart, GraduationCap, Zap, Shield, Building2, Globe,
  FileText, Monitor, BookOpen, Receipt, Plane, Briefcase, Star,
  ArrowRight, UserPlus, Share2, CheckCircle2, Bell, MessageCircle,
  Tag, ShoppingBag, Flame, UtensilsCrossed, Gamepad2, Car, Palmtree,
  Coffee, Dumbbell, Ticket, TrendingUp, Gift, Bookmark, ArrowLeft,
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
  detail: {
    title: string;
    subtitle: string;
    description: string;
    highlights: { label: string; value: string }[];
    cta: string;
    ctaHref: string;
  };
}

const BENTO_LIFESTYLE: BentoItem[] = [
  { icon: UtensilsCrossed, label: 'Dining', desc: '25% off at 40+ restaurants', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop', href: '/offers', size: 'large', accent: '#FFBD4C',
    detail: { title: 'Employee Dining Program', subtitle: 'Exclusive restaurant discounts across the UAE', description: 'Enjoy 25% off at over 40 premium restaurants including Zuma, Nobu, La Petite Maison, and more. Simply show your Ahli Connect digital card at participating venues. New restaurants added weekly.', highlights: [{ label: 'Restaurants', value: '40+' }, { label: 'Max Discount', value: '25%' }, { label: 'Avg Saving', value: 'AED 85/visit' }, { label: 'Valid Until', value: 'Dec 2026' }], cta: 'Browse Dining Offers', ctaHref: '/offers' } },
  { icon: Heart, label: 'Healthcare', desc: 'Daman Enhanced coverage', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=400&fit=crop', href: '/offers', size: 'medium', accent: '#DC2626',
    detail: { title: 'Enhanced Healthcare Plan', subtitle: 'Daman Platinum — fully covered by IHC Group', description: 'Your IHC employee healthcare covers 100% of in-network medical expenses, dental, optical, and mental health support. Access 500+ clinics and hospitals across the UAE with zero co-pay.', highlights: [{ label: 'Network', value: '500+ clinics' }, { label: 'Coverage', value: '100%' }, { label: 'Co-Pay', value: 'AED 0' }, { label: 'Dental', value: 'Included' }], cta: 'View Healthcare Offers', ctaHref: '/offers' } },
  { icon: Dumbbell, label: 'Fitness', desc: 'Palms Sports — AED 150/mo', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', href: '/offers', size: 'medium', accent: '#40C4AA',
    detail: { title: 'Palms Sports Membership', subtitle: 'Corporate rate — 60% off standard pricing', description: 'Access all Palms Sports facilities across Abu Dhabi including gyms, swimming pools, padel courts, and group fitness classes. Family add-on available at AED 100/member.', highlights: [{ label: 'Monthly', value: 'AED 150' }, { label: 'Locations', value: '8 venues' }, { label: 'Family', value: '+AED 100' }, { label: 'Savings', value: '60% off' }], cta: 'View Wellness Offers', ctaHref: '/offers' } },
  { icon: Palmtree, label: 'Leisure', desc: 'Yas Island 40% off', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', href: '/offers', size: 'small', accent: '#9D63F6',
    detail: { title: 'Yas Island Leisure Pass', subtitle: 'Theme parks & attractions at employee rates', description: 'Get 40% off Ferrari World, Yas Waterworld, and Warner Bros. World. Includes weekday priority access and 20% off F&B. Valid for employee + 3 guests.', highlights: [{ label: 'Discount', value: '40% off' }, { label: 'Parks', value: '3 parks' }, { label: 'Guests', value: 'Up to 3' }, { label: 'F&B', value: '20% off' }], cta: 'View Leisure Offers', ctaHref: '/offers' } },
  { icon: Coffee, label: 'Café', desc: 'Daily coffee perks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', href: '/offers', size: 'small', accent: '#92400E',
    detail: { title: 'Daily Coffee Benefit', subtitle: 'Free daily coffee at 25+ locations', description: 'Enjoy one complimentary coffee per day at partnered cafés including Starbucks, %Arabica, and Tim Hortons. Simply scan your Ahli Connect QR at the counter.', highlights: [{ label: 'Daily Limit', value: '1 free' }, { label: 'Cafés', value: '25+' }, { label: 'Value', value: 'AED 600/yr' }, { label: 'Method', value: 'QR scan' }], cta: 'View Food & Dining Offers', ctaHref: '/offers' } },
  { icon: Calendar, label: 'Events', desc: '5 upcoming this month', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop', href: '/explore', size: 'small', accent: '#7C3AED',
    detail: { title: 'Company Events', subtitle: 'Networking, training & social gatherings', description: 'Browse and register for upcoming IHC Group events — hackathons, wellness days, sports tournaments, training sessions, and team socials across all subsidiaries.', highlights: [{ label: 'This Month', value: '5 events' }, { label: 'This Quarter', value: '18 events' }, { label: 'Categories', value: '6 types' }, { label: 'Free', value: 'Most events' }], cta: 'View All Events', ctaHref: '/explore' } },
];

const BENTO_BUSINESS: BentoItem[] = [
  { icon: GraduationCap, label: 'IHC Academy', desc: 'Courses & certifications', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=500&h=500&fit=crop', href: '/services', size: 'large', accent: '#9D63F6',
    detail: { title: 'IHC Academy', subtitle: 'AED 15,000 annual learning allowance', description: 'Access 2,000+ courses from LinkedIn Learning, Coursera, and IHC custom programs. Earn professional certifications in leadership, AI, finance, and more. Fully funded by your education benefit.', highlights: [{ label: 'Courses', value: '2,000+' }, { label: 'Budget', value: 'AED 15K/yr' }, { label: 'Certificates', value: 'Included' }, { label: 'Format', value: 'Online + IRL' }], cta: 'Browse Courses', ctaHref: '/services?prompt=Show+me+available+courses' } },
  { icon: Globe, label: 'IHC Portals', desc: 'All group platforms', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#40C4AA',
    detail: { title: 'IHC Group Portals', subtitle: 'Quick access to all internal platforms', description: 'One-click access to all IHC group systems — Oracle HR, SAP, Workday, IT helpdesk, expense portals, and subsidiary-specific platforms. Single sign-on enabled.', highlights: [{ label: 'Portals', value: '12 systems' }, { label: 'SSO', value: 'Enabled' }, { label: 'Access', value: 'All roles' }, { label: 'Support', value: '24/7 IT' }], cta: 'Open Portals', ctaHref: '/services?prompt=Show+me+IHC+portals' } },
  { icon: FileText, label: 'HR Services', desc: 'Certificates & requests', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#FFBD4C',
    detail: { title: 'HR Services Hub', subtitle: 'AI-powered HR requests in seconds', description: 'Generate salary certificates in 8 seconds, submit leave requests in 2 taps, file expense claims with auto-processing, and access all your HR documents instantly.', highlights: [{ label: 'Salary Cert', value: '8 seconds' }, { label: 'Leave', value: '2 taps' }, { label: 'Expense', value: 'Auto-process' }, { label: 'Payslips', value: 'Instant' }], cta: 'Open HR Services', ctaHref: '/services?prompt=I+need+HR+services' } },
  { icon: Building2, label: 'Directory', desc: '45,000+ employees', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#9D63F6',
    detail: { title: 'Employee Directory', subtitle: 'Find anyone across IHC Group', description: 'Search and connect with 45,000+ verified employees across all 30+ IHC subsidiaries. View profiles, org charts, and direct message colleagues instantly.', highlights: [{ label: 'Employees', value: '45,000+' }, { label: 'Companies', value: '30+' }, { label: 'Search', value: 'Instant' }, { label: 'Messaging', value: 'Direct' }], cta: 'Search Directory', ctaHref: '/services?prompt=Search+employee+directory' } },
  { icon: Briefcase, label: 'Business Centres', desc: 'Meeting rooms & co-work', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#059669',
    detail: { title: 'Business Centres', subtitle: 'Book meeting rooms & co-working spaces', description: 'Reserve meeting rooms, hot desks, and private offices across IHC Group buildings in Abu Dhabi and Dubai. Free for employees, equipment included.', highlights: [{ label: 'Locations', value: '14 sites' }, { label: 'Cost', value: 'Free' }, { label: 'Equipment', value: 'AV + WiFi' }, { label: 'Booking', value: 'Instant' }], cta: 'Book a Space', ctaHref: '/services?prompt=I+need+to+book+a+meeting+room' } },
];

/* ═══════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { icon: Plane, label: 'Flights', color: '#9D63F6', href: '/services?prompt=I+want+to+book+a+flight' },
  { icon: Car, label: 'Rides', color: '#40C4AA', href: '/services?prompt=I+need+to+book+a+ride' },
  { icon: ShoppingBag, label: 'Marketplace', color: '#FFBD4C', href: '/services?prompt=Show+me+the+marketplace' },
  { icon: Gamepad2, label: 'Gaming', color: '#DC2626', href: '/services?prompt=Show+me+gaming+tournaments' },
  { icon: Shield, label: 'Insurance', color: '#7C3AED', href: '/services?prompt=I+need+motor+insurance' },
  { icon: Receipt, label: 'Payslip', color: '#059669', href: '/services?prompt=Show+me+my+payslip' },
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
    category: 'Training', color: '#9D63F6', icon: GraduationCap,
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
  { name: 'Aldar', logo: '/logos/aldar.svg', color: '#FFBD4C' },
  { name: 'PureHealth', logo: '/logos/purehealth.svg', color: '#059669' },
  { name: 'Palms Sports', logo: '/logos/palms-sports.svg', color: '#EA580C' },
  { name: 'Shory', logo: '/logos/shory.svg', color: '#6B21A8' },
  { name: 'Multiply', logo: '/logos/multiply.svg', color: '#FFBD4C' },
];

/* ═══════════════════════════════════════════
   EVENT DETAIL MODAL
   ═══════════════════════════════════════════ */

function EventDetailModal({ event, onClose, onRegister }: { event: CompanyEvent; onClose: () => void; onRegister?: () => void }) {
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
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <ArrowLeft size={18} className="text-white" />
          </button>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <X size={16} className="text-white" />
          </button>
          <div className="absolute top-14 left-4 flex items-center gap-2">
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
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Clock, label: 'Time', value: event.time.split('–')[0] },
              { icon: Users, label: 'Capacity', value: `${spotsPercent}% Full` },
              { icon: Building2, label: 'By', value: event.organizerCompany },
            ].map(({ icon: IC, label, value }) => (
              <div key={label} className="bg-[#F8F9FB] rounded-[14px] p-3 text-center border border-[#DFE1E6]">
                <IC size={15} className="mx-auto text-[#666D80] mb-1" />
                <p className="text-[10px] text-[#A4ABB8]">{label}</p>
                <p className="text-[11px] font-bold text-[#15161E] truncate">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border"
                style={{ color: event.color, borderColor: event.color + '30', background: event.color + '08' }}>{tag}</span>
            ))}
          </div>
          <div className="bg-white rounded-[14px] border border-[#DFE1E6] p-4">
            <h3 className="text-xs font-bold text-[#15161E] mb-1.5">About this event</h3>
            <p className="text-xs text-[#666D80] leading-relaxed">{event.longDescription}</p>
          </div>
          <div className="bg-[#F8F9FB] rounded-[16px] border border-[#DFE1E6] p-4">
            <h3 className="text-xs font-bold text-[#15161E] mb-3">Agenda</h3>
            <div className="space-y-2.5">
              {event.agenda.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: event.color }} />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold" style={{ color: event.color }}>{item.time}</p>
                    <p className="text-xs text-[#15161E]">{item.item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showInvite && (
            <div className="bg-[#F8F9FB] rounded-[16px] border border-[#DFE1E6] p-4">
              <h3 className="text-xs font-bold text-[#15161E] mb-2.5">Invite Colleagues</h3>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4ABB8]" />
                <input type="text" placeholder="Search colleagues..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DFE1E6] rounded-[10px] outline-none focus:border-[#9D63F6]" />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredColleagues.map(col => {
                  const sent = inviteSent.includes(col.id);
                  return (
                    <div key={col.id} className="flex items-center gap-2.5 bg-white rounded-[10px] px-3 py-2 border border-[#DFE1E6]">
                      <Avatar initials={col.avatar} color="#666D80" size="sm" image={col.image} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#15161E] truncate">{col.name}</p>
                        <p className="text-[10px] text-[#A4ABB8]">{col.company}</p>
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
              <button onClick={() => { if (onRegister) { onRegister(); } else { setRegistered(true); } }} className="w-full py-3 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.98]" style={{ background: event.color }}>
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
            <button onClick={() => setShowInvite(!showInvite)} className="w-full py-2.5 rounded-[14px] text-xs font-semibold border border-[#DFE1E6] text-[#15161E] bg-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <UserPlus size={14} /> {showInvite ? 'Hide Invites' : 'Invite Colleagues'}
            </button>
            <button className="w-full py-2.5 rounded-[14px] text-xs font-semibold text-[#A4ABB8] flex items-center justify-center gap-2">
              <Share2 size={14} /> Share Event Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BENTO DETAIL MODAL
   ═══════════════════════════════════════════ */

function BentoDetailModal({ item, onClose, onRegister }: { item: BentoItem; onClose: () => void; onRegister?: () => void }) {
  const [actionTaken, setActionTaken] = useState(false);
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[88vh] overflow-y-auto">
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden rounded-t-[28px]">
          <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <ArrowLeft size={18} className="text-white" />
          </button>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <X size={16} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: item.accent }}>
                <Icon size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{item.label}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{item.detail.title}</h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Subtitle */}
          <p className="text-[13px] font-semibold" style={{ color: item.accent }}>{item.detail.subtitle}</p>

          {/* Description */}
          <p className="text-[13px] text-[#666D80] leading-relaxed">{item.detail.description}</p>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-2">
            {item.detail.highlights.map(h => (
              <div key={h.label} className="bg-[#F8F9FB] rounded-[14px] p-3 text-center border border-[#DFE1E6]">
                <p className="text-[16px] font-bold" style={{ color: item.accent }}>{h.value}</p>
                <p className="text-[10px] text-[#A4ABB8] font-medium mt-0.5">{h.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-2 pb-4">
            {!actionTaken ? (
              <button onClick={() => { if (onRegister) { onRegister(); } else { setActionTaken(true); } }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold text-white no-underline transition-all active:scale-[0.98]"
                style={{ background: item.accent }}>
                {item.detail.cta} <ArrowRight size={15} />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-[14px] px-4 py-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <p className="text-xs font-bold text-green-700">Action taken!</p>
              </div>
            )}
            <button onClick={onClose} className="w-full py-2.5 rounded-[14px] text-xs font-semibold text-[#A4ABB8]">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REGISTRATION MODAL — Auto-fill form
   ═══════════════════════════════════════════ */

interface RegistrationInfo {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  color: string;
  image: string;
  type: 'event' | 'hackathon' | 'wellness' | 'course' | 'general';
}

function RegistrationModal({ info, user, onClose }: { info: RegistrationInfo; user: { name: string; email: string; company: string; title: string; department: string; employeeId: string }; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-36 overflow-hidden rounded-t-[28px]">
          <img src={info.image} alt={info.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <X size={16} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">{info.type === 'hackathon' ? 'Hackathon Registration' : info.type === 'wellness' ? 'Wellness Registration' : info.type === 'course' ? 'Course Enrollment' : 'Event Registration'}</span>
            <h2 className="text-[16px] font-bold text-white leading-snug mt-0.5">{info.title}</h2>
          </div>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-4">
            {/* Event info pills */}
            <div className="flex flex-wrap gap-2">
              {info.date && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6]">
                  <Calendar size={12} className="text-[#666D80]" />
                  <span className="text-[10px] font-semibold text-[#15161E]">{info.date}</span>
                </div>
              )}
              {info.location && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6]">
                  <MapPin size={12} className="text-[#666D80]" />
                  <span className="text-[10px] font-semibold text-[#15161E]">{info.location}</span>
                </div>
              )}
            </div>

            {/* Auto-filled form */}
            <div className="space-y-3">
              <p className="text-[12px] font-bold text-[#15161E]">Your Details</p>
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Company', value: user.company },
                { label: 'Job Title', value: user.title },
                { label: 'Department', value: user.department },
                { label: 'Employee ID', value: user.employeeId },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-[9px] font-semibold text-[#A4ABB8] uppercase tracking-wider">{field.label}</label>
                  <div className="mt-1 px-3.5 py-2.5 rounded-[12px] bg-[#F8F9FB] border border-[#DFE1E6] flex items-center justify-between">
                    <span className="text-[12px] text-[#15161E] font-medium">{field.value}</span>
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="space-y-2 pt-2 pb-4">
              <button onClick={() => setStep('confirmed')}
                className="w-full py-3.5 rounded-[14px] text-[13px] font-bold text-white transition-all active:scale-[0.98]"
                style={{ background: info.color }}>
                {info.type === 'hackathon' ? 'Join Hackathon' : info.type === 'course' ? 'Enroll Now' : 'Register Now'}
              </button>
              <p className="text-[9px] text-center text-[#A4ABB8]">Your details are auto-filled from your Ahli Connect profile</p>
            </div>
          </div>
        ) : (
          <div className="p-5 pb-8 text-center space-y-4">
            {/* Success state */}
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mt-2" style={{ background: info.color + '15' }}>
              <CheckCircle2 size={36} style={{ color: info.color }} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#15161E]">You&apos;re In!</h3>
              <p className="text-[13px] text-[#666D80] mt-1.5 leading-relaxed">
                {info.type === 'hackathon'
                  ? 'Welcome to the hackathon! Team formation details will be shared soon.'
                  : info.type === 'wellness'
                  ? 'You\'re registered for Wellness Week. See you there!'
                  : info.type === 'course'
                  ? 'You\'re enrolled! Course access will be granted shortly.'
                  : 'You\'re all set for this event!'}
              </p>
            </div>

            <div className="bg-[#F8F9FB] rounded-[16px] border border-[#DFE1E6] p-4 text-left space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: info.color + '15' }}>
                  <Calendar size={15} style={{ color: info.color }} />
                </div>
                <div>
                  <p className="text-[10px] text-[#A4ABB8]">When</p>
                  <p className="text-[12px] font-semibold text-[#15161E]">{info.date || 'TBA'}</p>
                </div>
              </div>
              {info.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: info.color + '15' }}>
                    <MapPin size={15} style={{ color: info.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A4ABB8]">Where</p>
                    <p className="text-[12px] font-semibold text-[#15161E]">{info.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-green-50">
                  <Send size={15} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#A4ABB8]">Confirmation</p>
                  <p className="text-[12px] font-semibold text-[#15161E]">Sent to {user.email}</p>
                </div>
              </div>
            </div>

            <button onClick={onClose}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white transition-all active:scale-[0.98]"
              style={{ background: info.color }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GENERIC ITEM DETAIL MODAL
   ═══════════════════════════════════════════ */

interface GenericDetailItem {
  title: string;
  desc: string;
  image: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  category?: string;
  highlights?: { label: string; value: string }[];
  details?: string;
  cta?: string;
  ctaHref?: string;
}

function ItemDetailModal({ item, onClose, onRegister }: { item: GenericDetailItem; onClose: () => void; onRegister?: () => void }) {
  const [actionTaken, setActionTaken] = useState(false);
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto">
        {/* Hero */}
        <div className="relative h-52 overflow-hidden rounded-t-[28px]">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <ArrowLeft size={18} className="text-white" />
          </button>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <X size={16} className="text-white" />
          </button>
          {item.category && (
            <div className="absolute top-14 left-4">
              <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: item.color }}>{item.category}</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                <Icon size={16} className="text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{item.title}</h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[13px] text-[#666D80] leading-relaxed">{item.desc}</p>

          {item.details && (
            <div className="bg-[#F8F9FB] rounded-[14px] border border-[#DFE1E6] p-4">
              <p className="text-[13px] text-[#666D80] leading-relaxed">{item.details}</p>
            </div>
          )}

          {item.highlights && item.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {item.highlights.map(h => (
                <div key={h.label} className="bg-[#F8F9FB] rounded-[14px] p-3 text-center border border-[#DFE1E6]">
                  <p className="text-[16px] font-bold" style={{ color: item.color }}>{h.value}</p>
                  <p className="text-[10px] text-[#A4ABB8] font-medium mt-0.5">{h.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 pb-4">
            {!actionTaken ? (
              <button onClick={() => { if (onRegister) { onRegister(); } else { setActionTaken(true); } }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.98]"
                style={{ background: item.color }}>
                {item.cta || 'Interested'} <ArrowRight size={15} />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-[14px] px-4 py-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <p className="text-xs font-bold text-green-700">Done! Details sent to your email.</p>
              </div>
            )}
            <button onClick={onClose} className="w-full py-2.5 rounded-[14px] text-xs font-semibold text-[#A4ABB8]">
              Close
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

function BentoGrid({ items, onSelect }: { items: BentoItem[]; onSelect: (item: BentoItem) => void }) {
  const large = items.find(i => i.size === 'large');
  const mediums = items.filter(i => i.size === 'medium');
  const smalls = items.filter(i => i.size === 'small');

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* Large card — spans full width */}
      {large && (
        <button onClick={() => onSelect(large)} className="col-span-2 card-rise relative rounded-[20px] overflow-hidden h-[160px] group active:scale-[0.98] transition-transform text-left">
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
        </button>
      )}

      {/* Medium cards — 1 column each */}
      {mediums.map((item, i) => (
        <button key={item.label} onClick={() => onSelect(item)}
          className={`card-rise card-rise-${i + 1} relative rounded-[18px] overflow-hidden h-[140px] group active:scale-[0.97] transition-transform text-left`}>
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
        </button>
      ))}

      {/* Small cards — 3-up or fill remaining */}
      {smalls.map((item, i) => (
        <button key={item.label} onClick={() => onSelect(item)}
          className={`card-rise card-rise-${i + 3} rounded-[16px] overflow-hidden p-3.5 flex items-center gap-3 border border-[#DFE1E6] active:scale-[0.97] transition-all text-left ${smalls.length === 3 && i === 2 ? 'col-span-2' : ''}`}
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: item.accent + '12' }}>
            <item.icon size={18} style={{ color: item.accent }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#15161E]">{item.label}</p>
            <p className="text-[10px] text-[#A4ABB8] truncate">{item.desc}</p>
          </div>
          <ChevronRight size={14} className="text-[#D1D5DB] shrink-0" />
        </button>
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
        <h2 className="text-[17px] font-bold text-[#15161E]">{title}</h2>
        {count !== undefined && (
          <span className="text-[10px] font-bold bg-[#9D63F6] text-white px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {href && (
        <Link href={href} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
          See all <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAP LOCATIONS DATA
   ═══════════════════════════════════════════ */

interface MapLocation {
  id: string; name: string; type: 'event' | 'offer' | 'wellness' | 'sports' | 'learning';
  lat: number; lng: number; address: string; color: string;
  icon: typeof MapPin; detail: string;
  image?: string;
  modalData?: {
    title: string; desc: string; image: string; color: string;
    icon: typeof MapPin; category: string;
    highlights: { label: string; value: string }[];
    cta: string;
  };
}

const MAP_LOCATIONS: MapLocation[] = [
  /* ── Events ── */
  { id: 'ml1', name: 'IHC Innovation Hackathon', type: 'event', lat: 24.4539, lng: 54.3773, address: 'IHC Tower, Al Maryah Island', color: '#7C3AED', icon: Trophy, detail: 'Hackathon · Apr 18–20', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    modalData: { title: 'IHC Innovation Hackathon', desc: '48-hour cross-company AI hackathon — AED 50K prizes', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', color: '#7C3AED', icon: Trophy, category: 'Event', highlights: [{ label: 'Date', value: 'Apr 18–20' }, { label: 'Spots Left', value: '23' }, { label: 'Prizes', value: 'AED 50K' }, { label: 'Teams', value: '120 max' }], cta: 'Register Now' } },
  { id: 'ml2', name: 'Employee Wellness Week', type: 'event', lat: 24.4672, lng: 54.3650, address: 'PureHealth HQ, Al Reem Island', color: '#059669', icon: Heart, detail: 'Wellness Week · Apr 25–29', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    modalData: { title: 'Employee Wellness Week', desc: 'Free health screenings, yoga & nutrition talks', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', color: '#059669', icon: Heart, category: 'Wellness Event', highlights: [{ label: 'Date', value: 'Apr 25–29' }, { label: 'Spots Left', value: '187' }, { label: 'Cost', value: 'Free' }, { label: 'Open To', value: 'All employees' }], cta: 'Register Now' } },
  { id: 'ml3', name: 'AI & Automation Masterclass', type: 'event', lat: 24.4480, lng: 54.3580, address: 'Virtual (MS Teams)', color: '#9D63F6', icon: Monitor, detail: 'Training · May 5', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    modalData: { title: 'AI & Automation Masterclass', desc: 'Hands-on workshop on using AI tools at work', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', color: '#9D63F6', icon: Monitor, category: 'Training', highlights: [{ label: 'Date', value: 'May 5' }, { label: 'Duration', value: '5 hours' }, { label: 'Format', value: 'Virtual' }, { label: 'Spots', value: '200' }], cta: 'Register Now' } },

  /* ── Offers ── */
  { id: 'ml4', name: 'Yas Island 40% Off', type: 'offer', lat: 24.4881, lng: 54.6071, address: 'Yas Island, Abu Dhabi', color: '#9D63F6', icon: Palmtree, detail: '40% off entry', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    modalData: { title: 'Yas Island 40% Off', desc: 'Ferrari World, Waterworld & Warner Bros.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', color: '#9D63F6', icon: Palmtree, category: 'Entertainment', highlights: [{ label: 'Discount', value: '40%' }, { label: 'Parks', value: '3 parks' }, { label: 'Guests', value: 'Up to 3' }, { label: 'Valid', value: 'Until Dec 2026' }], cta: 'Redeem Offer' } },
  { id: 'ml5', name: 'Zuma Restaurant', type: 'offer', lat: 24.4530, lng: 54.3290, address: 'The Galleria, Al Maryah Island', color: '#FFBD4C', icon: UtensilsCrossed, detail: '25% dining discount', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    modalData: { title: 'Dining at 40+ Restaurants', desc: 'Zuma, Nobu, La Petite Maison & more', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', color: '#FFBD4C', icon: UtensilsCrossed, category: 'Food & Dining', highlights: [{ label: 'Discount', value: '25%' }, { label: 'Restaurants', value: '40+' }, { label: 'Valid', value: 'Until Dec 2026' }, { label: 'Redeemed', value: '8.2K' }], cta: 'View Offer' } },
  { id: 'ml6', name: '%Arabica Café', type: 'offer', lat: 24.4535, lng: 54.3810, address: 'Al Maryah Island, Abu Dhabi', color: '#92400E', icon: Coffee, detail: 'Free daily coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    modalData: { title: 'Free Daily Coffee', desc: 'Starbucks, %Arabica, Tim Hortons', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop', color: '#92400E', icon: Coffee, category: 'Café', highlights: [{ label: 'Discount', value: 'Free' }, { label: 'Cafés', value: '25+' }, { label: 'Value', value: 'AED 600/yr' }, { label: 'Method', value: 'QR scan' }], cta: 'View Offer' } },
  { id: 'ml7', name: 'Etihad Staff Fares', type: 'offer', lat: 24.4430, lng: 54.6510, address: 'Abu Dhabi International Airport', color: '#7C3AED', icon: Plane, detail: '50% off flights', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=300&fit=crop',
    modalData: { title: 'Etihad Staff Fares', desc: 'Up to 50% off on all Etihad routes', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop', color: '#7C3AED', icon: Plane, category: 'Travel', highlights: [{ label: 'Discount', value: '50%' }, { label: 'Routes', value: 'All' }, { label: 'Valid', value: 'Until Jun 2026' }, { label: 'Redeemed', value: '3.1K' }], cta: 'View Offer' } },
  { id: 'ml8', name: 'Sharaf DG Electronics', type: 'offer', lat: 24.4260, lng: 54.4750, address: 'Yas Mall, Abu Dhabi', color: '#DC2626', icon: Monitor, detail: '20% off electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
    modalData: { title: 'Electronics Discount', desc: 'Sharaf DG — exclusive corporate pricing', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop', color: '#DC2626', icon: Monitor, category: 'Shopping', highlights: [{ label: 'Discount', value: '20%' }, { label: 'Store', value: 'Sharaf DG' }, { label: 'Valid', value: 'Until Sep 2026' }, { label: 'Redeemed', value: '4.7K' }], cta: 'View Offer' } },

  /* ── Wellness ── */
  { id: 'ml9', name: 'Cleveland Clinic', type: 'wellness', lat: 24.4495, lng: 54.3947, address: 'Al Maryah Island, Abu Dhabi', color: '#059669', icon: Shield, detail: 'Free health screening', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop',
    modalData: { title: 'Free Health Screening', desc: 'Comprehensive health check at Cleveland Clinic Abu Dhabi', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop', color: '#059669', icon: Shield, category: 'Wellness', highlights: [{ label: 'Cost', value: 'Free' }, { label: 'Includes', value: 'Full checkup' }, { label: 'Location', value: 'Cleveland Clinic' }, { label: 'Booking', value: 'Anytime' }], cta: 'Book Now' } },
  { id: 'ml10', name: 'Nutrition Consultation', type: 'wellness', lat: 24.4600, lng: 54.3500, address: 'PureHealth Clinic, Al Reem Island', color: '#40C4AA', icon: Heart, detail: 'Free dietitian session', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    modalData: { title: 'Nutrition Consultation', desc: 'Free monthly session with certified dietitian', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop', color: '#40C4AA', icon: Heart, category: 'Wellness', highlights: [{ label: 'Cost', value: 'Free' }, { label: 'Frequency', value: 'Monthly' }, { label: 'Location', value: 'PureHealth clinics' }, { label: 'Duration', value: '45 min' }], cta: 'Book Now' } },
  { id: 'ml11', name: 'Yoga & Meditation', type: 'wellness', lat: 24.4550, lng: 54.3700, address: 'IHC Tower, Level 3', color: '#9D63F6', icon: Sparkles, detail: 'Weekly · Every Wednesday', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop',
    modalData: { title: 'Yoga & Meditation', desc: 'Weekly sessions at all major offices', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop', color: '#9D63F6', icon: Sparkles, category: 'Wellness', highlights: [{ label: 'Schedule', value: 'Every Wed' }, { label: 'Cost', value: 'Free' }, { label: 'Capacity', value: '30/class' }, { label: 'Location', value: 'All offices' }], cta: 'Join Session' } },

  /* ── Sports ── */
  { id: 'ml12', name: 'Yas Sports Complex', type: 'sports', lat: 24.4899, lng: 54.6062, address: 'Yas Island, Abu Dhabi', color: '#DC2626', icon: Trophy, detail: 'Sports Day · May 22', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=400&h=300&fit=crop',
    modalData: { title: 'Cross-Company Sports Day', desc: 'Annual inter-subsidiary sports tournament at Yas Island', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=600&h=400&fit=crop', color: '#DC2626', icon: Trophy, category: 'Sports', highlights: [{ label: 'Date', value: 'May 22' }, { label: 'Spots Left', value: '88' }, { label: 'Teams', value: '300' }, { label: 'Location', value: 'Yas Island' }], cta: 'Register Team' } },
  { id: 'ml13', name: 'Palms Sports Gym', type: 'sports', lat: 24.4457, lng: 54.4104, address: 'Khalifa City, Abu Dhabi', color: '#EA580C', icon: Dumbbell, detail: 'Gym · AED 150/mo', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    modalData: { title: 'Palms Sports Membership', desc: '8 locations — Corporate rate 60% off', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', color: '#EA580C', icon: Dumbbell, category: 'Fitness', highlights: [{ label: 'Discount', value: '60% off' }, { label: 'Price', value: 'AED 150/mo' }, { label: 'Locations', value: '8 gyms' }, { label: 'Access', value: 'Full' }], cta: 'Activate Now' } },
  { id: 'ml14', name: 'Padel Cup Venue', type: 'sports', lat: 24.4700, lng: 54.3850, address: 'Zayed Sports City, Abu Dhabi', color: '#FFBD4C', icon: Trophy, detail: 'Padel Cup · Apr 30', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
    modalData: { title: 'Padel Cup', desc: 'Doubles tournament — registration closing soon', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop', color: '#FFBD4C', icon: Trophy, category: 'Sports', highlights: [{ label: 'Format', value: 'Doubles' }, { label: 'Deadline', value: 'Apr 30' }, { label: 'Type', value: 'Tournament' }, { label: 'Status', value: 'Closing soon' }], cta: 'Register Now' } },

  /* ── Learning ── */
  { id: 'ml15', name: 'IHC Academy', type: 'learning', lat: 24.4560, lng: 54.3740, address: 'IHC Tower, Level 12', color: '#9D63F6', icon: GraduationCap, detail: '2,000+ courses', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop',
    modalData: { title: 'IHC Academy', desc: 'AED 15,000 annual education budget — 2,000+ courses', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop', color: '#9D63F6', icon: GraduationCap, category: 'Learning', highlights: [{ label: 'Courses', value: '2,000+' }, { label: 'Budget', value: 'AED 15K/yr' }, { label: 'Certificates', value: 'Included' }, { label: 'Format', value: 'Online + IRL' }], cta: 'Browse Courses' } },
  { id: 'ml16', name: 'Leadership Workshop', type: 'learning', lat: 24.4520, lng: 54.3900, address: 'Abu Dhabi Business Hub', color: '#40C4AA', icon: Star, detail: 'Leadership · 8hrs', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    modalData: { title: 'Leadership Essentials', desc: 'LinkedIn Learning — comprehensive leadership program', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', color: '#40C4AA', icon: Star, category: 'Learning', highlights: [{ label: 'Duration', value: '8 hours' }, { label: 'Level', value: 'All Levels' }, { label: 'Provider', value: 'LinkedIn Learning' }, { label: 'Budget', value: 'AED 15K/yr' }], cta: 'Enroll Now' } },
];

/* ═══════════════════════════════════════════
   TRENDING DATA
   ═══════════════════════════════════════════ */

const TRENDING_ITEMS = [
  { id: 't1', title: 'IHC Innovation Hackathon', desc: '97/120 spots filled — 3 days left to register!', tag: 'Hot', tagColor: '#DC2626', icon: Trophy, color: '#7C3AED', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', engagement: '2.4K interested', href: '/explore' },
  { id: 't2', title: 'Palms Sports Membership', desc: '340 employees signed up this week', tag: 'Trending', tagColor: '#FFBD4C', icon: Dumbbell, color: '#40C4AA', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', engagement: '1.8K members', href: '/offers' },
  { id: 't3', title: 'FIFA Tournament Season 3', desc: 'Registration closing soon — 64 teams max', tag: 'Popular', tagColor: '#9D63F6', icon: Gamepad2, color: '#DC2626', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop', engagement: '890 players', href: '/services?prompt=Show+me+gaming+tournaments' },
  { id: 't4', title: 'New: AI Expense Claims', desc: '98% accuracy — scan receipts with your camera', tag: 'New', tagColor: '#059669', icon: Receipt, color: '#FFBD4C', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop', engagement: '12K claims/mo', href: '/automations/expense-claim' },
  { id: 't5', title: 'Yas Island Employee Pass', desc: 'Most redeemed offer this quarter', tag: 'Top', tagColor: '#7C3AED', icon: Ticket, color: '#9D63F6', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', engagement: '5.6K redeemed', href: '/offers' },
];

/* ═══════════════════════════════════════════
   WELLNESS DATA
   ═══════════════════════════════════════════ */

const WELLNESS_ITEMS = [
  { id: 'w1', title: 'Employee Wellness Week', desc: 'Free health screenings, yoga & nutrition talks', date: 'Apr 25–29', location: 'PureHealth HQ', color: '#059669', icon: Heart, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', spots: '187 spots left', href: '/explore' },
  { id: 'w2', title: 'Mental Health Support', desc: '24/7 counseling — 100% confidential & free', date: 'Always available', location: 'Virtual', color: '#7C3AED', icon: Shield, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop', spots: 'Unlimited', href: '/services?prompt=I+need+mental+health+support' },
  { id: 'w3', title: 'Palms Sports Gym', desc: 'Corporate rate AED 150/mo — 60% off', date: 'Ongoing', location: '8 locations', color: '#EA580C', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', spots: 'Open enrollment', href: '/offers' },
  { id: 'w4', title: 'Nutrition Consultation', desc: 'Free monthly session with certified dietitian', date: 'Monthly', location: 'PureHealth clinics', color: '#40C4AA', icon: Heart, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop', spots: 'Book anytime', href: '/offers' },
  { id: 'w5', title: 'Yoga & Meditation', desc: 'Weekly sessions at all major offices', date: 'Every Wednesday', location: 'All offices', color: '#9D63F6', icon: Sparkles, image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop', spots: '30/class', href: '/offers' },
];

/* ═══════════════════════════════════════════
   OFFERS DATA
   ═══════════════════════════════════════════ */

const OFFERS_DATA = [
  { id: 'o1', title: 'Yas Island 40% Off', desc: 'Ferrari World, Waterworld & Warner Bros.', category: 'Entertainment', discount: '40%', color: '#9D63F6', icon: Palmtree, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', valid: 'Until Dec 2026', redeemed: '5.6K' },
  { id: 'o2', title: 'Dining at 40+ Restaurants', desc: 'Zuma, Nobu, La Petite Maison & more', category: 'Food & Dining', discount: '25%', color: '#FFBD4C', icon: UtensilsCrossed, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', valid: 'Until Dec 2026', redeemed: '8.2K' },
  { id: 'o3', title: 'Free Daily Coffee', desc: 'Starbucks, %Arabica, Tim Hortons', category: 'Café', discount: 'Free', color: '#92400E', icon: Coffee, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop', valid: 'Ongoing', redeemed: '22K' },
  { id: 'o4', title: 'Etihad Staff Fares', desc: 'Up to 50% off on all Etihad routes', category: 'Travel', discount: '50%', color: '#7C3AED', icon: Plane, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop', valid: 'Until Jun 2026', redeemed: '3.1K' },
  { id: 'o5', title: 'Car Insurance Discount', desc: 'Shory motor insurance — employee pricing', category: 'Insurance', discount: '30%', color: '#40C4AA', icon: Car, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop', valid: 'Ongoing', redeemed: '1.4K' },
  { id: 'o6', title: 'Electronics Discount', desc: 'Sharaf DG — exclusive corporate pricing', category: 'Shopping', discount: '20%', color: '#DC2626', icon: Monitor, image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop', valid: 'Until Sep 2026', redeemed: '4.7K' },
];

/* ═══════════════════════════════════════════
   MAP VIEW COMPONENT
   ═══════════════════════════════════════════ */

const MAP_FILTER_LABELS: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  all: { label: 'All', icon: MapPin, color: '#9D63F6' },
  event: { label: 'Events', icon: Calendar, color: '#7C3AED' },
  offer: { label: 'Offers', icon: Gift, color: '#FFBD4C' },
  wellness: { label: 'Wellness', icon: Heart, color: '#059669' },
  sports: { label: 'Sports', icon: Trophy, color: '#DC2626' },
  learning: { label: 'Learning', icon: GraduationCap, color: '#9D63F6' },
};

function MapView({ locations, onSelectItem }: { locations: MapLocation[]; onSelectItem: (data: MapLocation['modalData']) => void }) {
  const [selectedPin, setSelectedPin] = useState<MapLocation | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? locations : locations.filter(l => l.type === filter);

  /* Compute bounding box center & zoom for Google Maps embed */
  const centerLat = 24.46;
  const centerLng = 54.45;

  /* Google Maps embed URL — UAE centered, no API key needed for embed mode */
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${centerLat},${centerLng}&zoom=11&maptype=roadmap`;

  /* Project lat/lng to pixel positions on the map */
  const projectToMap = useCallback((lat: number, lng: number) => {
    /* These bounds cover the Abu Dhabi ↔ Yas Island area */
    const minLat = 24.40, maxLat = 24.52;
    const minLng = 54.28, maxLng = 54.68;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(88, y)) };
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Google Maps iframe background */}
      <iframe
        src={mapEmbedUrl}
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Abu Dhabi Map"
      />

      {/* Subtle overlay for pin visibility on dark map */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(21,22,30,0.25) 0%, transparent 30%, transparent 70%, rgba(21,22,30,0.3) 100%)' }} />

      {/* Top controls bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3">
        <div className="flex items-center justify-between mb-2">
          {/* Map label */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px]" style={{ background: 'rgba(21,22,30,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <MapPin size={13} className="text-[#9D63F6]" strokeWidth={2.5} />
            <span className="text-[11px] font-bold text-white">UAE</span>
            <span className="text-[9px] text-white/50 ml-1">{filtered.length} places</span>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {Object.entries(MAP_FILTER_LABELS).map(([key, { label, icon: FIcon, color }]) => {
            const isActive = filter === key;
            const count = key === 'all' ? locations.length : locations.filter(l => l.type === key).length;
            return (
              <button key={key} onClick={() => { setFilter(key); setSelectedPin(null); }}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition-all active:scale-95"
                style={{
                  background: isActive ? color : 'rgba(21,22,30,0.65)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: isActive ? `0 2px 8px ${color}40` : '0 1px 4px rgba(0,0,0,0.15)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}>
                <FIcon size={10} strokeWidth={2.5} />
                {label}
                <span className="ml-0.5 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive map pins overlay */}
      {filtered.map((loc) => {
        const Icon = loc.icon;
        const pos = projectToMap(loc.lat, loc.lng);
        const isSelected = selectedPin?.id === loc.id;

        return (
          <button key={loc.id}
            onClick={() => setSelectedPin(isSelected ? null : loc)}
            className="absolute z-10 transition-all duration-300 ease-out"
            style={{
              left: `${pos.x}%`, top: `${pos.y}%`,
              transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.35) translateY(-6px)' : 'scale(1)'}`,
              zIndex: isSelected ? 15 : 10,
            }}>
            <div className="relative">
              {/* Pulse ring for selected */}
              {isSelected && (
                <div className="absolute -inset-3 rounded-full" style={{ background: loc.color + '15', animation: 'pulse-ring 1.5s ease-out infinite' }} />
              )}
              {/* Pin marker */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-[2.5px] border-white/90 transition-shadow duration-200"
                  style={{ background: loc.color, boxShadow: isSelected ? `0 4px 20px ${loc.color}70, 0 0 30px ${loc.color}30` : `0 2px 10px rgba(0,0,0,0.4), 0 0 15px ${loc.color}25` }}>
                  <Icon size={15} className="text-white" strokeWidth={2.5} />
                </div>
                {/* Pin tail / bottom pointer */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `6px solid ${loc.color}` }} />
              </div>
            </div>
          </button>
        );
      })}

      {/* Selected pin detail card */}
      {selectedPin && (
        <div className="absolute bottom-3 left-3 right-3 z-20 card-rise"
          style={{ animation: 'card-rise 0.25s ease-out both' }}>
          <div className="flex items-center gap-3 p-3 rounded-[16px] shadow-xl"
            style={{ background: 'rgba(21,22,30,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            {/* Thumbnail */}
            {selectedPin.image ? (
              <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0 border border-white/10">
                <img src={selectedPin.image} alt={selectedPin.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: selectedPin.color + '20' }}>
                <selectedPin.icon size={24} style={{ color: selectedPin.color }} strokeWidth={1.8} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: selectedPin.color }}>
                  {selectedPin.type.charAt(0).toUpperCase() + selectedPin.type.slice(1)}
                </span>
              </div>
              <p className="text-[12px] font-bold text-white truncate leading-tight">{selectedPin.name}</p>
              <p className="text-[10px] text-white/50 truncate">{selectedPin.address}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: selectedPin.color }}>{selectedPin.detail}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              {/* View details button */}
              {selectedPin.modalData && (
                <button onClick={() => onSelectItem(selectedPin.modalData!)}
                  className="px-3 py-1.5 rounded-[10px] text-[10px] font-bold text-white transition-all active:scale-95"
                  style={{ background: selectedPin.color, boxShadow: `0 2px 8px ${selectedPin.color}40` }}>
                  View
                </button>
              )}
              <button onClick={() => setSelectedPin(null)} className="p-1 rounded-full hover:bg-white/10 self-center">
                <X size={12} className="text-white/50" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FULL-SCREEN MAP WITH BUILT-IN DETAIL
   ═══════════════════════════════════════════ */

function FullScreenMap({ locations, onClose }: { locations: MapLocation[]; onClose: () => void }) {
  const [mapDetailItem, setMapDetailItem] = useState<MapLocation['modalData'] | null>(null);
  const [detailActionTaken, setDetailActionTaken] = useState(false);

  const handleViewDetail = (data: MapLocation['modalData']) => {
    if (data) {
      setMapDetailItem(data);
      setDetailActionTaken(false);
    }
  };

  const closeDetail = () => {
    setMapDetailItem(null);
    setDetailActionTaken(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#15161E' }}>
      {/* Header bar — dark */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3"
        style={{ background: 'rgba(21,22,30,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#9D63F6]" strokeWidth={2.5} />
          <div>
            <h2 className="text-[16px] font-bold text-white">Explore Map</h2>
            <p className="text-[10px] text-white/40">{locations.length} locations across UAE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <X size={18} className="text-white/70" strokeWidth={2} />
        </button>
      </div>

      {/* Full-screen map */}
      <div className="flex-1 relative">
        <MapView locations={locations} onSelectItem={handleViewDetail} />
      </div>

      {/* ── Rich detail panel (slides up from bottom, map stays behind) ── */}
      {mapDetailItem && (() => {
        const DIcon = mapDetailItem.icon;
        return (
          <div className="absolute inset-0 z-30 flex items-end justify-center">
            {/* Backdrop — tapping it closes the detail */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDetail} />

            {/* Detail sheet */}
            <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[85vh] overflow-y-auto"
              style={{ animation: 'card-rise 0.3s ease-out both' }}>

              {/* Hero image */}
              <div className="relative h-56 overflow-hidden rounded-t-[28px]">
                <img src={mapDetailItem.image} alt={mapDetailItem.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Close & back buttons */}
                <button onClick={closeDetail} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ArrowLeft size={18} className="text-white" />
                </button>
                <button onClick={closeDetail} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center z-10 active:scale-95 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  <X size={16} className="text-white" />
                </button>

                {/* Category badge */}
                <div className="absolute top-14 left-4">
                  <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: mapDetailItem.color }}>
                    {mapDetailItem.category}
                  </span>
                </div>

                {/* Title area on hero */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                      <DIcon size={18} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h2 className="text-[20px] font-bold text-white leading-snug">{mapDetailItem.title}</h2>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 space-y-4">
                {/* Description */}
                <p className="text-[14px] text-[#666D80] leading-relaxed">{mapDetailItem.desc}</p>

                {/* Highlights grid */}
                {mapDetailItem.highlights && mapDetailItem.highlights.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {mapDetailItem.highlights.map(h => (
                      <div key={h.label} className="rounded-[16px] p-3.5 text-center border border-[#DFE1E6]" style={{ background: '#F8F9FB' }}>
                        <p className="text-[18px] font-bold" style={{ color: mapDetailItem.color }}>{h.value}</p>
                        <p className="text-[10px] text-[#A4ABB8] font-medium mt-1">{h.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick info bar */}
                <div className="flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6]" style={{ background: mapDetailItem.color + '08' }}>
                  <MapPin size={16} style={{ color: mapDetailItem.color }} strokeWidth={2} />
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-[#15161E]">Available for IHC Group employees</p>
                    <p className="text-[10px] text-[#A4ABB8]">Show your Ahli Connect digital card to redeem</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pb-6">
                  {!detailActionTaken ? (
                    <button onClick={() => setDetailActionTaken(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-[16px] text-[15px] font-bold text-white transition-all active:scale-[0.98]"
                      style={{ background: mapDetailItem.color, boxShadow: `0 4px 16px ${mapDetailItem.color}40` }}>
                      {mapDetailItem.cta || 'Interested'} <ArrowRight size={16} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-[16px] px-4 py-3.5">
                      <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold text-green-700">Done! Details sent to your email.</p>
                        <p className="text-[10px] text-green-600/70">Check your inbox for confirmation</p>
                      </div>
                    </div>
                  )}

                  {/* Share & Save row */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[14px] text-[12px] font-semibold text-[#666D80] border border-[#DFE1E6] active:scale-[0.97] transition-all">
                      <Share2 size={14} /> Share
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-[14px] text-[12px] font-semibold text-[#666D80] border border-[#DFE1E6] active:scale-[0.97] transition-all">
                      <Bookmark size={14} /> Save
                    </button>
                  </div>

                  <button onClick={closeDetail} className="w-full py-2.5 rounded-[14px] text-[12px] font-semibold text-[#A4ABB8]">
                    Back to Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
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
  const [selectedBento, setSelectedBento] = useState<BentoItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<GenericDetailItem | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showRegistration, setShowRegistration] = useState<RegistrationInfo | null>(null);

  useBodyScrollLock(!!selectedEvent || !!selectedBento || !!selectedItem || showMap || !!showRegistration);

  // History integration for iOS/Android back button on detail modals
  const closeEvent = useModalHistory(!!selectedEvent, () => setSelectedEvent(null), 'explore-event');
  const closeBento = useModalHistory(!!selectedBento, () => setSelectedBento(null), 'explore-bento');
  const closeItem = useModalHistory(!!selectedItem, () => setSelectedItem(null), 'explore-item');
  const closeRegistration = useModalHistory(!!showRegistration, () => setShowRegistration(null), 'explore-reg');

  if (!user) return null;

  const hero = FEATURED_HEROES[heroIdx];

  /* ── Render tab-specific content ── */
  const renderTabContent = () => {
    switch (activeFilter) {

      /* ──────── TRENDING ──────── */
      case 'Trending':
        return (
          <>
            <section>
              <SectionHeader title="What's Hot Right Now" />
              <div className="space-y-3">
                {TRENDING_ITEMS.map((item, i) => {
                  const TIcon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setSelectedItem({ title: item.title, desc: item.desc, image: item.image, color: item.color, icon: item.icon, category: item.tag, highlights: [{ label: 'Engagement', value: item.engagement }, { label: 'Status', value: item.tag }], cta: 'View Details' })}
                      className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] active:scale-[0.98] transition-all`}
                      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                      <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: item.color }}>
                            <TIcon size={12} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.tagColor }}>
                            {item.tag}
                          </span>
                          <span className="text-[9px] font-medium text-[#A4ABB8] flex items-center gap-0.5">
                            <TrendingUp size={9} /> {item.engagement}
                          </span>
                        </div>
                        <p className="text-[13px] font-bold text-[#15161E] leading-snug truncate">{item.title}</p>
                        <p className="text-[10px] text-[#A4ABB8] mt-0.5 truncate">{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Trending stats */}
            <section>
              <SectionHeader title="This Week's Numbers" />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Active Users', value: '28.4K', color: '#9D63F6', icon: Users },
                  { label: 'Events Joined', value: '1,240', color: '#40C4AA', icon: Calendar },
                  { label: 'Offers Redeemed', value: '3,890', color: '#FFBD4C', icon: Gift },
                ].map(s => {
                  const SIcon = s.icon;
                  return (
                    <div key={s.label} className="card-rise rounded-[16px] p-3.5 border border-[#DFE1E6] text-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
                      <SIcon size={18} style={{ color: s.color }} className="mx-auto mb-1.5" strokeWidth={1.8} />
                      <p className="text-[16px] font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[9px] text-[#A4ABB8] mt-0.5">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        );

      /* ──────── WELLNESS ──────── */
      case 'Wellness':
        return (
          <>
            {/* Wellness hero */}
            <section className="card-rise">
              <div className="relative rounded-[24px] overflow-hidden h-[180px]">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop" alt="Wellness" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#059669]/90 via-[#059669]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Heart size={14} className="text-white" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Your Wellness Hub</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-white leading-snug">Take care of yourself,</h3>
                  <p className="text-[13px] text-white/80">you deserve it.</p>
                </div>
              </div>
            </section>

            {/* Wellness quick stats */}
            <section>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Medical Coverage', value: '100%', sub: 'Daman Enhanced', color: '#059669', icon: Shield },
                  { label: 'Gym Discount', value: '60% off', sub: 'Palms Sports', color: '#EA580C', icon: Dumbbell },
                  { label: 'Mental Health', value: 'Free', sub: '24/7 counseling', color: '#7C3AED', icon: Heart },
                  { label: 'Dental & Optical', value: 'Included', sub: 'Full coverage', color: '#40C4AA', icon: CheckCircle2 },
                ].map(s => {
                  const SIcon = s.icon;
                  return (
                    <div key={s.label} className="card-rise rounded-[16px] p-3.5 border border-[#DFE1E6] bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: s.color + '12' }}>
                          <SIcon size={16} style={{ color: s.color }} strokeWidth={1.8} />
                        </div>
                      </div>
                      <p className="text-[15px] font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] font-semibold text-[#15161E] mt-0.5">{s.label}</p>
                      <p className="text-[9px] text-[#A4ABB8]">{s.sub}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Wellness programs */}
            <section>
              <SectionHeader title="Wellness Programs" count={WELLNESS_ITEMS.length} />
              <div className="space-y-3">
                {WELLNESS_ITEMS.map((item, i) => {
                  const WIcon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setSelectedItem({ title: item.title, desc: item.desc, image: item.image, color: item.color, icon: item.icon, category: 'Wellness', highlights: [{ label: 'Schedule', value: item.date }, { label: 'Location', value: item.location }, { label: 'Availability', value: item.spots }], cta: 'Join Now' })}
                      className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all`}>
                      <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: item.color }}>
                            <WIcon size={12} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-[13px] font-bold text-[#15161E] leading-snug truncate">{item.title}</p>
                        <p className="text-[10px] text-[#A4ABB8] mt-0.5 truncate">{item.desc}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#A4ABB8]">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {item.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {item.location}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        );

      /* ──────── OFFERS ──────── */
      case 'Offers':
        return (
          <>
            {/* Offers hero */}
            <section className="card-rise">
              <div className="rounded-[20px] p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(157,99,246,0.25) 0%, transparent 70%)' }} />
                <div className="flex items-center gap-1.5 mb-2">
                  <Gift size={14} className="text-[#FFBD4C]" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Employee Perks</span>
                </div>
                <h3 className="text-[20px] font-bold text-white leading-snug">Exclusive Offers</h3>
                <p className="text-[12px] text-white/60 mt-1">Save thousands with IHC employee benefits</p>
                <div className="flex gap-3 mt-3">
                  {[
                    { value: '40+', label: 'Partners' },
                    { value: 'AED 8K+', label: 'Avg. savings/yr' },
                    { value: '45K+', label: 'Redeemed' },
                  ].map(s => (
                    <div key={s.label} className="flex-1 text-center py-2 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-[14px] font-bold text-white">{s.value}</p>
                      <p className="text-[9px] text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Offer cards */}
            <section>
              <SectionHeader title="All Offers" count={OFFERS_DATA.length} />
              <div className="grid grid-cols-2 gap-2.5">
                {OFFERS_DATA.map((offer, i) => {
                  const OIcon = offer.icon;
                  return (
                    <button key={offer.id} onClick={() => setSelectedItem({ title: offer.title, desc: offer.desc, image: offer.image, color: offer.color, icon: offer.icon, category: offer.category, highlights: [{ label: 'Discount', value: offer.discount }, { label: 'Valid', value: offer.valid }, { label: 'Redeemed', value: offer.redeemed }, { label: 'Category', value: offer.category }], cta: 'Redeem Offer' })}
                      className={`card-rise card-rise-${i + 1} rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left`}>
                      <div className="relative h-[100px]">
                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: offer.color }}>
                          {offer.discount}
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                            <OIcon size={12} className="text-white" strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[12px] font-bold text-[#15161E] leading-snug truncate">{offer.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5 truncate">{offer.desc}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] font-semibold" style={{ color: offer.color }}>{offer.valid}</span>
                          <span className="text-[8px] text-[#A4ABB8]">{offer.redeemed} used</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        );

      /* ──────── EVENTS ──────── */
      case 'Events':
        return (
          <>
            <section>
              <SectionHeader title="Upcoming Events" count={EVENTS.length} />
              <div className="space-y-3">
                {EVENTS.map((event, i) => {
                  const EIcon = event.icon;
                  return (
                    <button key={event.id} onClick={() => setSelectedEvent(event)}
                      className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] active:scale-[0.98] transition-all`}
                      style={{ background: 'rgba(255,255,255,0.9)' }}>
                      <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: event.color }}>
                            <EIcon size={12} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: event.color + '12', color: event.color }}>{event.category}</span>
                          {event.spotsLeft < 100 && <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5"><Flame size={9} /> {event.spotsLeft} left</span>}
                        </div>
                        <p className="text-[13px] font-bold text-[#15161E] leading-snug truncate">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#A4ABB8]">
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
          </>
        );

      /* ──────── LEARNING ──────── */
      case 'Learning':
        return (
          <>
            <section className="card-rise">
              <div className="rounded-[20px] p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9D63F6 100%)' }}>
                <GraduationCap size={60} className="absolute -top-2 -right-2 text-white/10" strokeWidth={1} />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">IHC Academy</span>
                <h3 className="text-[20px] font-bold text-white leading-snug mt-1">Continue Learning</h3>
                <p className="text-[12px] text-white/70 mt-1">AED 15,000 annual education budget</p>
                <div className="flex gap-2 mt-3">
                  <div className="flex-1 bg-white/10 rounded-[10px] p-2.5 text-center">
                    <p className="text-[14px] font-bold text-white">2,000+</p>
                    <p className="text-[9px] text-white/60">Courses</p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-[10px] p-2.5 text-center">
                    <p className="text-[14px] font-bold text-white">3</p>
                    <p className="text-[9px] text-white/60">In Progress</p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-[10px] p-2.5 text-center">
                    <p className="text-[14px] font-bold text-white">7</p>
                    <p className="text-[9px] text-white/60">Completed</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <SectionHeader title="Recommended for You" />
              <div className="space-y-2.5">
                {[
                  { title: 'AI & Automation Masterclass', provider: 'IHC Group', duration: '5 hours', level: 'Intermediate', color: '#9D63F6', icon: Monitor, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop' },
                  { title: 'Leadership Essentials', provider: 'LinkedIn Learning', duration: '8 hours', level: 'All Levels', color: '#40C4AA', icon: Star, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop' },
                  { title: 'Financial Planning', provider: 'Coursera', duration: '12 hours', level: 'Beginner', color: '#FFBD4C', icon: TrendingUp, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop' },
                  { title: 'Project Management Pro', provider: 'IHC Academy', duration: '20 hours', level: 'Advanced', color: '#DC2626', icon: Briefcase, image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=300&fit=crop' },
                ].map((course, i) => {
                  const CIcon = course.icon;
                  return (
                    <button key={course.title} onClick={() => setSelectedItem({ title: course.title, desc: `${course.provider} · ${course.duration}`, image: course.image, color: course.color, icon: course.icon, category: 'Learning', highlights: [{ label: 'Duration', value: course.duration }, { label: 'Level', value: course.level }, { label: 'Provider', value: course.provider }, { label: 'Budget', value: 'AED 15K/yr' }], cta: 'Enroll Now' })}
                      className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all`}>
                      <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: course.color }}>
                            <CIcon size={12} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-[13px] font-bold text-[#15161E] leading-snug truncate">{course.title}</p>
                        <p className="text-[10px] text-[#A4ABB8] mt-0.5">{course.provider}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#A4ABB8]">
                          <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold" style={{ background: course.color + '12', color: course.color }}>{course.level}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        );

      /* ──────── SPORTS ──────── */
      case 'Sports':
        return (
          <>
            <section className="card-rise">
              <div className="relative rounded-[24px] overflow-hidden h-[180px]">
                <img src="https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=800&h=500&fit=crop" alt="Sports" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Trophy size={14} className="text-[#FFBD4C]" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">IHC Sports</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-white leading-snug">Sports Day 2026</h3>
                  <p className="text-[13px] text-white/80">May 22 · Yas Sports Complex</p>
                </div>
              </div>
            </section>
            <section>
              <SectionHeader title="Active Tournaments" />
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { title: 'FIFA League S3', desc: '64 teams · Registration open', icon: Gamepad2, color: '#DC2626', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', status: 'Open' },
                  { title: 'Padel Cup', desc: 'Doubles · Apr 30 deadline', icon: Trophy, color: '#FFBD4C', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop', status: 'Closing soon' },
                  { title: 'Basketball 3v3', desc: 'Cross-subsidiary · May 8', icon: Zap, color: '#9D63F6', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', status: 'Open' },
                  { title: 'Swimming Relay', desc: 'Team of 4 · May 15', icon: Star, color: '#40C4AA', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop', status: 'New' },
                ].map((sport, i) => {
                  const SIcon = sport.icon;
                  return (
                    <button key={sport.title} onClick={() => setSelectedItem({ title: sport.title, desc: sport.desc, image: sport.image, color: sport.color, icon: sport.icon, category: 'Sports', highlights: [{ label: 'Status', value: sport.status }, { label: 'Type', value: 'Tournament' }], cta: 'Register Now' })}
                      className={`card-rise card-rise-${i + 1} rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left`}>
                      <div className="relative h-[90px]">
                        <img src={sport.image} alt={sport.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: sport.color }}>{sport.status}</div>
                        <div className="absolute bottom-2 left-2">
                          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                            <SIcon size={12} className="text-white" strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[12px] font-bold text-[#15161E] truncate">{sport.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5">{sport.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
            <section>
              <SectionHeader title="Gym & Fitness" />
              <button onClick={() => setSelectedItem({ title: 'Palms Sports Membership', desc: '8 locations across Abu Dhabi & Dubai. Corporate rate AED 150/month — 60% off regular pricing. Full gym access, group classes, swimming pool, and more.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', color: '#EA580C', icon: Dumbbell, category: 'Fitness', highlights: [{ label: 'Discount', value: '60% off' }, { label: 'Price', value: 'AED 150/mo' }, { label: 'Locations', value: '8 gyms' }, { label: 'Access', value: 'Full' }], cta: 'Activate Now' })}
                className="card-rise w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: '#EA580C12' }}>
                  <Dumbbell size={24} className="text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#15161E]">Palms Sports Membership</p>
                  <p className="text-[10px] text-[#A4ABB8]">8 locations · AED 150/mo · 60% off</p>
                  <p className="text-[10px] font-semibold text-[#EA580C] mt-1">Activate Now</p>
                </div>
                <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
              </button>
            </section>
          </>
        );

      /* ──────── FOR YOU (default) — short previews of every section ──────── */
      default:
        return (
          <>
            {/* ── Trending Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-[#DC2626]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Trending</h2>
                </div>
                <button onClick={() => setActiveFilter('Trending')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {TRENDING_ITEMS.slice(0, 2).map((item, i) => {
                  const TIcon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setSelectedItem({ title: item.title, desc: item.desc, image: item.image, color: item.color, icon: item.icon, category: item.tag, highlights: [{ label: 'Engagement', value: item.engagement }, { label: 'Status', value: item.tag }], cta: 'View Details' })}
                      className="w-full text-left flex gap-3 p-3 rounded-[16px] border border-[#DFE1E6] active:scale-[0.98] transition-all bg-white">
                      <div className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute bottom-1 left-1">
                          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center" style={{ background: item.color }}>
                            <TIcon size={10} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.tagColor }}>{item.tag}</span>
                        <p className="text-[12px] font-bold text-[#15161E] leading-snug truncate mt-1">{item.title}</p>
                      </div>
                      <ChevronRight size={14} className="text-[#D1D5DB] shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Wellness Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart size={15} className="text-[#EC4899]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Wellness</h2>
                </div>
                <button onClick={() => setActiveFilter('Wellness')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
                {WELLNESS_ITEMS.slice(0, 3).map((item, i) => {
                  const WIcon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setSelectedItem({ title: item.title, desc: item.desc, image: item.image, color: item.color, icon: item.icon, category: 'Wellness', highlights: [{ label: 'When', value: item.date }, { label: 'Where', value: item.location }], cta: 'Learn More' })}
                      className="shrink-0 w-[150px] rounded-[16px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left">
                      <div className="relative h-[85px]">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center" style={{ background: item.color }}>
                            <WIcon size={10} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[#15161E] truncate">{item.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5 truncate">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Offers Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gift size={15} className="text-[#FFBD4C]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Offers</h2>
                </div>
                <button onClick={() => setActiveFilter('Offers')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {OFFERS_DATA.slice(0, 4).map((offer) => {
                  const OIcon = offer.icon;
                  return (
                    <button key={offer.id} onClick={() => setSelectedItem({ title: offer.title, desc: offer.desc, image: offer.image, color: offer.color, icon: offer.icon, category: offer.category, highlights: [{ label: 'Discount', value: offer.discount }, { label: 'Valid', value: offer.valid }], cta: 'Redeem Offer' })}
                      className="rounded-[14px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left">
                      <div className="relative h-[80px]">
                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: offer.color }}>{offer.discount}</div>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[#15161E] truncate">{offer.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5 truncate">{offer.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Events Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#9D63F6]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Events</h2>
                </div>
                <button onClick={() => setActiveFilter('Events')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {EVENTS.slice(0, 2).map((event) => {
                  const EIcon = event.icon;
                  return (
                    <button key={event.id} onClick={() => setSelectedEvent(event)}
                      className="w-full text-left flex gap-3 p-3 rounded-[16px] border border-[#DFE1E6] active:scale-[0.98] transition-all bg-white">
                      <div className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute bottom-1 left-1">
                          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center" style={{ background: event.color }}>
                            <EIcon size={10} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: event.color + '12', color: event.color }}>{event.category}</span>
                        <p className="text-[12px] font-bold text-[#15161E] leading-snug truncate mt-1">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-[9px] text-[#A4ABB8]">
                          <span className="flex items-center gap-1"><Calendar size={9} /> {event.date.split(',')[0]}</span>
                          <span className="flex items-center gap-1"><MapPin size={9} /> {event.location.split(',')[0]}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#D1D5DB] shrink-0 self-center" />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Learning Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap size={15} className="text-[#7C3AED]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Learning</h2>
                </div>
                <button onClick={() => setActiveFilter('Learning')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
                {[
                  { title: 'AI & Automation', provider: 'IHC Group', duration: '5 hrs', color: '#9D63F6', icon: Monitor, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop' },
                  { title: 'Leadership', provider: 'LinkedIn', duration: '8 hrs', color: '#40C4AA', icon: Star, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop' },
                  { title: 'Financial Planning', provider: 'Coursera', duration: '12 hrs', color: '#FFBD4C', icon: TrendingUp, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop' },
                ].map((course) => {
                  const CIcon = course.icon;
                  return (
                    <button key={course.title} onClick={() => setSelectedItem({ title: course.title, desc: `${course.provider} · ${course.duration}`, image: course.image, color: course.color, icon: course.icon, category: 'Learning', highlights: [{ label: 'Duration', value: course.duration }, { label: 'Provider', value: course.provider }], cta: 'Enroll Now' })}
                      className="shrink-0 w-[150px] rounded-[16px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left">
                      <div className="relative h-[85px]">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-1.5 left-1.5">
                          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center" style={{ background: course.color }}>
                            <CIcon size={10} className="text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[#15161E] truncate">{course.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5">{course.provider} · {course.duration}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Sports Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-[#DC2626]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Sports</h2>
                </div>
                <button onClick={() => setActiveFilter('Sports')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: 'FIFA League S3', desc: '64 teams · Open', icon: Gamepad2, color: '#DC2626', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', status: 'Open' },
                  { title: 'Padel Cup', desc: 'Doubles · Apr 30', icon: Trophy, color: '#FFBD4C', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop', status: 'Closing soon' },
                ].map((sport) => {
                  const SIcon = sport.icon;
                  return (
                    <button key={sport.title} onClick={() => setSelectedItem({ title: sport.title, desc: sport.desc, image: sport.image, color: sport.color, icon: sport.icon, category: 'Sports', highlights: [{ label: 'Status', value: sport.status }], cta: 'Register Now' })}
                      className="rounded-[14px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all text-left">
                      <div className="relative h-[80px]">
                        <img src={sport.image} alt={sport.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: sport.color }}>{sport.status}</div>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[#15161E] truncate">{sport.title}</p>
                        <p className="text-[9px] text-[#A4ABB8] mt-0.5">{sport.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Benefits & Offers Preview ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-[#40C4AA]" strokeWidth={2.5} />
                  <h2 className="text-[17px] font-bold text-[#15161E]">Benefits & Offers</h2>
                </div>
                <button onClick={() => setActiveFilter('Offers')} className="text-[11px] font-semibold text-[#9D63F6] flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Daman Health Insurance', desc: '100% covered · Zero co-pay · 500+ clinics', icon: Shield, color: '#DC2626', value: 'Platinum Plan' },
                  { title: 'Education Allowance', desc: 'AED 15,000/year for courses & certifications', icon: GraduationCap, color: '#9D63F6', value: 'AED 15K/yr' },
                  { title: 'Annual Air Tickets', desc: 'Return flights for you & family — fully covered', icon: Plane, color: '#7C3AED', value: 'Covered' },
                  { title: 'Palms Sports Gym', desc: 'Corporate rate — 60% off at 8 locations', icon: Dumbbell, color: '#EA580C', value: '60% Off' },
                ].map((benefit) => {
                  const BIcon = benefit.icon;
                  return (
                    <button key={benefit.title} onClick={() => setSelectedItem({ title: benefit.title, desc: benefit.desc, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop', color: benefit.color, icon: benefit.icon, category: 'Benefit', highlights: [{ label: 'Status', value: 'Active' }, { label: 'Value', value: benefit.value }], cta: 'View Details' })}
                      className="w-full flex items-center gap-3 p-3 rounded-[16px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all text-left">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: benefit.color + '12' }}>
                        <BIcon size={18} style={{ color: benefit.color }} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#15161E] truncate">{benefit.title}</p>
                        <p className="text-[10px] text-[#A4ABB8] mt-0.5 truncate">{benefit.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold shrink-0 px-2 py-1 rounded-full" style={{ background: benefit.color + '12', color: benefit.color }}>
                        {benefit.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

          </>
        );
    }
  };

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
                  background: isActive ? '#9D63F6' : 'rgba(255,255,255,0.85)',
                  color: isActive ? '#FFFFFF' : '#666D80',
                  border: isActive ? 'none' : '1px solid #DFE1E6',
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

        {/* ═══ TAB CONTENT ═══ */}
        {renderTabContent()}

      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeEvent} onRegister={() => {
        const evtType = selectedEvent.category === 'Hackathon' ? 'hackathon' : selectedEvent.category === 'Wellness' ? 'wellness' : selectedEvent.category === 'Training' ? 'course' : 'event';
        setShowRegistration({
          title: selectedEvent.title,
          subtitle: selectedEvent.description,
          date: selectedEvent.date,
          location: selectedEvent.location,
          color: selectedEvent.color,
          image: selectedEvent.image,
          type: evtType,
        });
        setSelectedEvent(null);
      }} />}
      {selectedBento && <BentoDetailModal item={selectedBento} onClose={closeBento} onRegister={() => {
        setShowRegistration({
          title: selectedBento.detail.title,
          subtitle: selectedBento.detail.subtitle,
          date: '',
          location: '',
          color: selectedBento.accent,
          image: selectedBento.image,
          type: 'general',
        });
        setSelectedBento(null);
      }} />}
      {selectedItem && <ItemDetailModal item={selectedItem} onClose={closeItem} onRegister={() => {
        setShowRegistration({
          title: selectedItem.title,
          subtitle: selectedItem.desc,
          date: selectedItem.highlights?.find(h => h.label === 'Date' || h.label === 'When')?.value || '',
          location: selectedItem.highlights?.find(h => h.label === 'Location' || h.label === 'Where')?.value || '',
          color: selectedItem.color,
          image: selectedItem.image,
          type: 'general',
        });
        setSelectedItem(null);
      }} />}
      {showRegistration && user && <RegistrationModal info={showRegistration} user={{ name: user.name, email: user.email, company: COMPANIES.find(c => c.id === user.companyId)?.name || '', title: user.title, department: user.department, employeeId: user.employeeId }} onClose={closeRegistration} />}

      {/* ═══ FLOATING MAP BUTTON — above bottom nav ═══ */}
      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="fixed z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl active:scale-95 transition-all"
          style={{
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#15161E',
            color: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <MapPin size={15} strokeWidth={2.5} />
          <span className="text-[13px] font-bold">Map</span>
          <span className="text-[10px] font-medium opacity-60">{MAP_LOCATIONS.length}</span>
        </button>
      )}

      {/* ═══ FULL-SCREEN MAP OVERLAY ═══ */}
      {showMap && (
        <FullScreenMap
          locations={MAP_LOCATIONS}
          onClose={() => setShowMap(false)}
        />
      )}
    </AppShell>
  );
}
