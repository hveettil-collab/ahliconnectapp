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
  { icon: UtensilsCrossed, label: 'Dining', desc: '25% off at 40+ restaurants', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop', href: '/services', size: 'large', accent: '#FFBD4C',
    detail: { title: 'Employee Dining Program', subtitle: 'Exclusive restaurant discounts across the UAE', description: 'Enjoy 25% off at over 40 premium restaurants including Zuma, Nobu, La Petite Maison, and more. Simply show your Ahli Connect digital card at participating venues. New restaurants added weekly.', highlights: [{ label: 'Restaurants', value: '40+' }, { label: 'Max Discount', value: '25%' }, { label: 'Avg Saving', value: 'AED 85/visit' }, { label: 'Valid Until', value: 'Dec 2026' }], cta: 'Browse Restaurants', ctaHref: '/services?prompt=Show+me+dining+offers' } },
  { icon: Heart, label: 'Healthcare', desc: 'Daman Enhanced coverage', image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#DC2626',
    detail: { title: 'Enhanced Healthcare Plan', subtitle: 'Daman Platinum — fully covered by IHC Group', description: 'Your IHC employee healthcare covers 100% of in-network medical expenses, dental, optical, and mental health support. Access 500+ clinics and hospitals across the UAE with zero co-pay.', highlights: [{ label: 'Network', value: '500+ clinics' }, { label: 'Coverage', value: '100%' }, { label: 'Co-Pay', value: 'AED 0' }, { label: 'Dental', value: 'Included' }], cta: 'View My Coverage', ctaHref: '/services?prompt=Show+me+my+health+insurance+details' } },
  { icon: Dumbbell, label: 'Fitness', desc: 'Palms Sports — AED 150/mo', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', href: '/services', size: 'medium', accent: '#40C4AA',
    detail: { title: 'Palms Sports Membership', subtitle: 'Corporate rate — 60% off standard pricing', description: 'Access all Palms Sports facilities across Abu Dhabi including gyms, swimming pools, padel courts, and group fitness classes. Family add-on available at AED 100/member.', highlights: [{ label: 'Monthly', value: 'AED 150' }, { label: 'Locations', value: '8 venues' }, { label: 'Family', value: '+AED 100' }, { label: 'Savings', value: '60% off' }], cta: 'Activate Membership', ctaHref: '/services?prompt=I+want+to+join+Palms+Sports+gym' } },
  { icon: Palmtree, label: 'Leisure', desc: 'Yas Island 40% off', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#9D63F6',
    detail: { title: 'Yas Island Leisure Pass', subtitle: 'Theme parks & attractions at employee rates', description: 'Get 40% off Ferrari World, Yas Waterworld, and Warner Bros. World. Includes weekday priority access and 20% off F&B. Valid for employee + 3 guests.', highlights: [{ label: 'Discount', value: '40% off' }, { label: 'Parks', value: '3 parks' }, { label: 'Guests', value: 'Up to 3' }, { label: 'F&B', value: '20% off' }], cta: 'Get Passes', ctaHref: '/services?prompt=I+want+Yas+Island+tickets' } },
  { icon: Coffee, label: 'Café', desc: 'Daily coffee perks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', href: '/services', size: 'small', accent: '#92400E',
    detail: { title: 'Daily Coffee Benefit', subtitle: 'Free daily coffee at 25+ locations', description: 'Enjoy one complimentary coffee per day at partnered cafés including Starbucks, %Arabica, and Tim Hortons. Simply scan your Ahli Connect QR at the counter.', highlights: [{ label: 'Daily Limit', value: '1 free' }, { label: 'Cafés', value: '25+' }, { label: 'Value', value: 'AED 600/yr' }, { label: 'Method', value: 'QR scan' }], cta: 'Find Nearby Café', ctaHref: '/services?prompt=Show+me+nearby+coffee+offers' } },
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

function BentoDetailModal({ item, onClose }: { item: BentoItem; onClose: () => void }) {
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
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
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
              <Link href={item.detail.ctaHref} onClick={() => { setActionTaken(true); onClose(); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold text-white no-underline transition-all active:scale-[0.98]"
                style={{ background: item.accent }}>
                {item.detail.cta} <ArrowRight size={15} />
              </Link>
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
  id: string; name: string; type: 'event' | 'offer' | 'wellness' | 'office';
  lat: number; lng: number; address: string; color: string;
  icon: typeof MapPin; detail: string;
}

const MAP_LOCATIONS: MapLocation[] = [
  { id: 'ml1', name: 'IHC Tower', type: 'event', lat: 24.4539, lng: 54.3773, address: 'Al Maryah Island, Abu Dhabi', color: '#7C3AED', icon: Building2, detail: 'Hackathon · Apr 18–20' },
  { id: 'ml2', name: 'PureHealth HQ', type: 'wellness', lat: 24.4672, lng: 54.3650, address: 'Al Reem Island, Abu Dhabi', color: '#059669', icon: Heart, detail: 'Wellness Week · Apr 25–29' },
  { id: 'ml3', name: 'Yas Sports Complex', type: 'event', lat: 24.4899, lng: 54.6062, address: 'Yas Island, Abu Dhabi', color: '#DC2626', icon: Trophy, detail: 'Sports Day · May 22' },
  { id: 'ml4', name: 'Palms Sports', type: 'wellness', lat: 24.4457, lng: 54.4104, address: 'Khalifa City, Abu Dhabi', color: '#EA580C', icon: Dumbbell, detail: 'Gym · AED 150/mo' },
  { id: 'ml5', name: 'Zuma Restaurant', type: 'offer', lat: 24.4530, lng: 54.3290, address: 'The Galleria, Al Maryah Island', color: '#FFBD4C', icon: UtensilsCrossed, detail: '25% dining discount' },
  { id: 'ml6', name: 'Yas Waterworld', type: 'offer', lat: 24.4881, lng: 54.6071, address: 'Yas Island, Abu Dhabi', color: '#9D63F6', icon: Palmtree, detail: '40% off entry' },
  { id: 'ml7', name: '%Arabica Café', type: 'offer', lat: 24.4535, lng: 54.3810, address: 'Al Maryah Island, Abu Dhabi', color: '#92400E', icon: Coffee, detail: 'Free daily coffee' },
  { id: 'ml8', name: 'Cleveland Clinic', type: 'wellness', lat: 24.4495, lng: 54.3947, address: 'Al Maryah Island, Abu Dhabi', color: '#059669', icon: Shield, detail: 'Free health screening' },
];

/* ═══════════════════════════════════════════
   TRENDING DATA
   ═══════════════════════════════════════════ */

const TRENDING_ITEMS = [
  { id: 't1', title: 'IHC Innovation Hackathon', desc: '97/120 spots filled — 3 days left to register!', tag: 'Hot', tagColor: '#DC2626', icon: Trophy, color: '#7C3AED', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', engagement: '2.4K interested', href: '/explore' },
  { id: 't2', title: 'Palms Sports Membership', desc: '340 employees signed up this week', tag: 'Trending', tagColor: '#FFBD4C', icon: Dumbbell, color: '#40C4AA', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', engagement: '1.8K members', href: '/services?prompt=I+want+to+join+Palms+Sports+gym' },
  { id: 't3', title: 'FIFA Tournament Season 3', desc: 'Registration closing soon — 64 teams max', tag: 'Popular', tagColor: '#9D63F6', icon: Gamepad2, color: '#DC2626', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop', engagement: '890 players', href: '/services?prompt=Show+me+gaming+tournaments' },
  { id: 't4', title: 'New: AI Expense Claims', desc: '98% accuracy — scan receipts with your camera', tag: 'New', tagColor: '#059669', icon: Receipt, color: '#FFBD4C', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop', engagement: '12K claims/mo', href: '/automations/expense-claim' },
  { id: 't5', title: 'Yas Island Employee Pass', desc: 'Most redeemed offer this quarter', tag: 'Top', tagColor: '#7C3AED', icon: Ticket, color: '#9D63F6', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', engagement: '5.6K redeemed', href: '/services?prompt=I+want+Yas+Island+tickets' },
];

/* ═══════════════════════════════════════════
   WELLNESS DATA
   ═══════════════════════════════════════════ */

const WELLNESS_ITEMS = [
  { id: 'w1', title: 'Employee Wellness Week', desc: 'Free health screenings, yoga & nutrition talks', date: 'Apr 25–29', location: 'PureHealth HQ', color: '#059669', icon: Heart, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', spots: '187 spots left', href: '/explore' },
  { id: 'w2', title: 'Mental Health Support', desc: '24/7 counseling — 100% confidential & free', date: 'Always available', location: 'Virtual', color: '#7C3AED', icon: Shield, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop', spots: 'Unlimited', href: '/services?prompt=I+need+mental+health+support' },
  { id: 'w3', title: 'Palms Sports Gym', desc: 'Corporate rate AED 150/mo — 60% off', date: 'Ongoing', location: '8 locations', color: '#EA580C', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', spots: 'Open enrollment', href: '/services?prompt=I+want+to+join+Palms+Sports+gym' },
  { id: 'w4', title: 'Nutrition Consultation', desc: 'Free monthly session with certified dietitian', date: 'Monthly', location: 'PureHealth clinics', color: '#40C4AA', icon: Heart, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop', spots: 'Book anytime', href: '/services?prompt=Book+nutrition+consultation' },
  { id: 'w5', title: 'Yoga & Meditation', desc: 'Weekly sessions at all major offices', date: 'Every Wednesday', location: 'All offices', color: '#9D63F6', icon: Sparkles, image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop', spots: '30/class', href: '/services?prompt=Join+yoga+class' },
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

function MapView({ locations }: { locations: MapLocation[] }) {
  const [selectedPin, setSelectedPin] = useState<MapLocation | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? locations : locations.filter(l => l.type === filter);

  /* Abu Dhabi-centered static map, pins overlaid */
  return (
    <div className="relative rounded-[20px] overflow-hidden border border-[#DFE1E6]" style={{ height: 280 }}>
      {/* Map background — stylized Abu Dhabi */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #E8EDF5 0%, #D4DCE8 30%, #C9D6E8 50%, #BCCEE0 70%, #D4DCE8 100%)',
      }}>
        {/* Water areas */}
        <div className="absolute" style={{ top: '10%', right: 0, width: '45%', height: '40%', background: 'rgba(96,165,250,0.15)', borderRadius: '0 0 0 60%' }} />
        <div className="absolute" style={{ bottom: 0, left: 0, width: '30%', height: '25%', background: 'rgba(96,165,250,0.12)', borderRadius: '0 40% 0 0' }} />
        {/* Island shapes */}
        <div className="absolute" style={{ top: '25%', left: '20%', width: '55%', height: '50%', background: 'rgba(209,213,219,0.4)', borderRadius: '40% 30% 50% 25%' }} />
        <div className="absolute" style={{ top: '15%', left: '55%', width: '25%', height: '30%', background: 'rgba(209,213,219,0.3)', borderRadius: '50%' }} />
        {/* Road lines */}
        <div className="absolute" style={{ top: '48%', left: '10%', width: '80%', height: 1, background: 'rgba(156,163,175,0.3)' }} />
        <div className="absolute" style={{ top: '20%', left: '45%', width: 1, height: '60%', background: 'rgba(156,163,175,0.25)' }} />
        <div className="absolute" style={{ top: '35%', left: '25%', width: '50%', height: 1, background: 'rgba(156,163,175,0.2)', transform: 'rotate(-15deg)' }} />
      </div>

      {/* Map label */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(223,225,230,0.6)' }}>
        <MapPin size={12} className="text-[#9D63F6]" />
        <span className="text-[10px] font-bold text-[#15161E]">Abu Dhabi</span>
        <span className="text-[9px] text-[#A4ABB8] ml-1">{filtered.length} locations</span>
      </div>

      {/* Filter pills */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        {(['all', 'event', 'offer', 'wellness'] as const).map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelectedPin(null); }}
            className="text-[9px] font-bold px-2 py-1 rounded-full transition-all"
            style={{
              background: filter === f ? '#9D63F6' : 'rgba(255,255,255,0.85)',
              color: filter === f ? '#fff' : '#666D80',
              border: filter === f ? 'none' : '1px solid rgba(223,225,230,0.6)',
            }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Pins positioned on the map */}
      {filtered.map((loc, i) => {
        const Icon = loc.icon;
        /* Spread pins across the map area */
        const positions = [
          { top: '42%', left: '38%' }, { top: '30%', left: '52%' }, { top: '55%', left: '68%' },
          { top: '48%', left: '25%' }, { top: '38%', left: '60%' }, { top: '60%', left: '50%' },
          { top: '35%', left: '30%' }, { top: '45%', left: '48%' },
        ];
        const pos = positions[i % positions.length];
        const isSelected = selectedPin?.id === loc.id;

        return (
          <button key={loc.id} onClick={() => setSelectedPin(isSelected ? null : loc)}
            className="absolute z-10 transition-all duration-200"
            style={{ top: pos.top, left: pos.left, transform: isSelected ? 'scale(1.3) translateY(-4px)' : 'scale(1)' }}>
            <div className="relative">
              {isSelected && (
                <div className="absolute -inset-2 rounded-full animate-ping" style={{ background: loc.color + '20' }} />
              )}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style={{ background: loc.color }}>
                <Icon size={14} className="text-white" strokeWidth={2} />
              </div>
            </div>
          </button>
        );
      })}

      {/* Selected pin detail card */}
      {selectedPin && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-3 p-3 rounded-[14px] shadow-lg"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(223,225,230,0.5)' }}>
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: selectedPin.color + '15' }}>
            <selectedPin.icon size={20} style={{ color: selectedPin.color }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#15161E] truncate">{selectedPin.name}</p>
            <p className="text-[10px] text-[#A4ABB8] truncate">{selectedPin.address}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: selectedPin.color }}>{selectedPin.detail}</p>
          </div>
          <button onClick={() => setSelectedPin(null)} className="p-1.5 rounded-full hover:bg-gray-100">
            <X size={14} className="text-[#A4ABB8]" />
          </button>
        </div>
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
  const [selectedBento, setSelectedBento] = useState<BentoItem | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);

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
                    <Link key={item.id} href={item.href}
                      className={`card-rise card-rise-${i + 1} flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] active:scale-[0.98] transition-all`}
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
                    </Link>
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
                    <Link key={item.id} href={item.href}
                      className={`card-rise card-rise-${i + 1} flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all`}>
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
                    </Link>
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
                    <Link key={offer.id} href={`/services?prompt=${encodeURIComponent(offer.title)}`}
                      className={`card-rise card-rise-${i + 1} rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all`}>
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
                    </Link>
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
                    <Link key={course.title} href="/services?prompt=Show+me+available+courses"
                      className={`card-rise card-rise-${i + 1} flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all`}>
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
                    </Link>
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
                    <Link key={sport.title} href="/services?prompt=Show+me+gaming+tournaments"
                      className={`card-rise card-rise-${i + 1} rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.97] transition-all`}>
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
                    </Link>
                  );
                })}
              </div>
            </section>
            <section>
              <SectionHeader title="Gym & Fitness" />
              <Link href="/services?prompt=I+want+to+join+Palms+Sports+gym"
                className="card-rise flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: '#EA580C12' }}>
                  <Dumbbell size={24} className="text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#15161E]">Palms Sports Membership</p>
                  <p className="text-[10px] text-[#A4ABB8]">8 locations · AED 150/mo · 60% off</p>
                  <p className="text-[10px] font-semibold text-[#EA580C] mt-1">Activate Now</p>
                </div>
                <ChevronRight size={16} className="text-[#D1D5DB] shrink-0 self-center" />
              </Link>
            </section>
          </>
        );

      /* ──────── FOR YOU (default) ──────── */
      default:
        return (
          <>
            {/* Featured Hero */}
            <section className="card-rise">
              <div className="relative rounded-[24px] overflow-hidden h-[200px] group">
                <img src={hero.image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 shimmer-bg pointer-events-none" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: hero.tagColor }}>{hero.tag}</span>
                  <span className="text-[10px] font-medium text-white/70 px-2.5 py-1 rounded-full border border-white/20" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>{hero.countdown}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[18px] font-bold text-white leading-snug mb-1">{hero.title}</h3>
                  <p className="text-[12px] text-white/75 mb-3 leading-relaxed">{hero.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <button className="px-5 py-2.5 rounded-full text-[12px] font-bold text-[#15161E] bg-white active:scale-95 transition-transform">{hero.cta}</button>
                    <span className="text-[10px] text-white/50 font-medium">{hero.spots}</span>
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 flex gap-1.5">
                  {FEATURED_HEROES.map((_, i) => (
                    <button key={i} onClick={() => setHeroIdx(i)} className="rounded-full transition-all" style={{ width: i === heroIdx ? 18 : 6, height: 6, background: i === heroIdx ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }} />
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((action, i) => {
                  const AIcon = action.icon;
                  return (
                    <Link key={action.label} href={action.href} className={`card-rise card-rise-${i} flex flex-col items-center gap-1.5 py-3 rounded-[16px] active:scale-95 transition-transform`}>
                      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: action.color + '10' }}>
                        <AIcon size={20} style={{ color: action.color }} strokeWidth={1.7} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#666D80]">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Lifestyle */}
            <section>
              <SectionHeader title="Lifestyle" href="/offers" />
              <BentoGrid items={BENTO_LIFESTYLE} onSelect={setSelectedBento} />
            </section>

            {/* Upcoming Events */}
            <section>
              <SectionHeader title="Upcoming Events" count={EVENTS.length} />
              <div className="space-y-3">
                {EVENTS.slice(0, 3).map((event, i) => {
                  const EIcon = event.icon;
                  return (
                    <button key={event.id} onClick={() => setSelectedEvent(event)}
                      className={`card-rise card-rise-${i + 1} w-full text-left flex gap-3.5 p-3 rounded-[18px] border border-[#DFE1E6] active:scale-[0.98] transition-all`}
                      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
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

            {/* Communities */}
            <section>
              <SectionHeader title="Communities" count={7} href="/community" />
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {[
                  { name: 'IHC Group', members: '20K', color: '#1B3A6B', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop', logo: '/logos/ihc.svg', unread: 12 },
                  { name: 'Shory', members: '2.8K', color: '#0D9488', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop', logo: '/logos/shory.svg', unread: 5 },
                  { name: 'Palms Sports', members: '4.5K', color: '#EA580C', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop', logo: '/logos/palms-sports.svg', unread: 3 },
                  { name: 'Aldar', members: '5.2K', color: '#C8973A', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop', logo: '/logos/aldar.svg', unread: 0 },
                  { name: 'PureHealth', members: '8.9K', color: '#059669', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop', logo: '/logos/purehealth.svg', unread: 0 },
                ].map((c, i) => (
                  <Link key={c.name} href="/community" className={`card-rise card-rise-${i} shrink-0 w-[140px] rounded-[16px] overflow-hidden border border-[#DFE1E6] active:scale-[0.97] transition-all`}>
                    <div className="relative h-[80px]">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {c.unread > 0 && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#DF1C41] flex items-center justify-center"><span className="text-[8px] font-bold text-white">{c.unread}</span></div>}
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                        <img src={c.logo} alt="" className="w-5 h-5 rounded-[4px]" />
                        <span className="text-[11px] font-bold text-white">{c.name}</span>
                      </div>
                    </div>
                    <div className="px-2.5 py-2 flex items-center justify-between">
                      <span className="text-[9px] text-[#A4ABB8] flex items-center gap-1"><Users size={9} /> {c.members}</span>
                      <span className="text-[9px] font-semibold" style={{ color: c.color }}>View</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Business */}
            <section>
              <SectionHeader title="Business" href="/services" />
              <BentoGrid items={BENTO_BUSINESS} onSelect={setSelectedBento} />
            </section>

            {/* Gaming & Activities */}
            <section>
              <SectionHeader title="Gaming & Activities" />
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => setSelectedEvent(EVENTS[3])}
                  className="col-span-1 row-span-2 rounded-[20px] text-left flex flex-col justify-between min-h-[210px] active:scale-[0.98] transition-all relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1461896836934-bd45ba8b2d36?w=400&h=500&fit=crop" alt="Sports" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
                <Link href="/services?prompt=Show+me+gaming+tournaments" className="rounded-[18px] overflow-hidden relative min-h-[100px] active:scale-[0.97] transition-all">
                  <img src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop" alt="FIFA" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <Gamepad2 size={14} className="text-white" strokeWidth={2} />
                    <p className="text-[11px] font-bold text-white">FIFA League</p>
                  </div>
                </Link>
                <Link href="/services?prompt=Show+me+gaming+tournaments" className="rounded-[18px] overflow-hidden relative min-h-[100px] active:scale-[0.97] transition-all">
                  <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop" alt="Padel" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <Trophy size={14} className="text-white" strokeWidth={2} />
                    <p className="text-[11px] font-bold text-white">Padel Cup</p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Companies & People */}
            <section>
              <SectionHeader title="Our Companies" href="/about" />
              <div className="grid grid-cols-2 gap-2">
                {PARTNERS.map(p => (
                  <div key={p.name} className="flex flex-col items-center gap-2 py-3 rounded-[16px] border border-[#DFE1E6]" style={{ background: 'rgba(255,255,255,0.85)' }}>
                    <img src={p.logo} alt={p.name} className="w-11 h-11 rounded-[12px]" />
                    <p className="text-[9px] font-bold text-[#15161E] text-center leading-tight">{p.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="People" href="/community" />
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {COLLEAGUES.map(col => (
                  <Link key={col.id} href="/profile" className="shrink-0 flex flex-col items-center gap-1.5 w-16">
                    <div className="relative">
                      <Avatar initials={col.avatar} color="#666D80" size="lg" image={col.image} />
                      {col.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <p className="text-[10px] font-semibold text-[#15161E] text-center leading-tight truncate w-full">{col.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-[#A4ABB8] truncate w-full text-center">{col.company.split(' ')[0]}</p>
                  </Link>
                ))}
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

          {/* Map toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95"
            style={{
              background: showMap ? '#15161E' : 'rgba(255,255,255,0.85)',
              color: showMap ? '#FFFFFF' : '#666D80',
              border: showMap ? 'none' : '1px solid #DFE1E6',
            }}
          >
            <MapPin size={13} strokeWidth={showMap ? 2.2 : 1.6} />
            Map
          </button>
        </div>

        {/* ═══ MAP VIEW ═══ */}
        {showMap && (
          <section className="card-rise">
            <MapView locations={MAP_LOCATIONS} />
          </section>
        )}

        {/* ═══ TAB CONTENT ═══ */}
        {renderTabContent()}

      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {selectedBento && <BentoDetailModal item={selectedBento} onClose={() => setSelectedBento(null)} />}
    </AppShell>
  );
}
