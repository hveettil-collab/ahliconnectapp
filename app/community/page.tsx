'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { COMPANIES, COLLEAGUES } from '@/lib/mockData';
import {
  Users, MessageCircle, Heart, ThumbsUp, Send, Image as ImageIcon,
  ChevronRight, X, Star, Trophy, Flame, Calendar, MapPin,
  ArrowRight, Plus, Share2, Bookmark, MoreHorizontal, Crown,
  Sparkles, TrendingUp, Award, Zap, Building2, Globe, CheckCircle2,
  UserPlus, Bell, BellOff, Hash, Pin, Eye, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */

const COMMUNITY_STYLES = `
  @keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes heart-pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
  .fade-up { animation: fade-up 0.4s ease-out both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.1s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.2s; }
  .scale-in { animation: scale-in 0.3s ease-out both; }
  .heart-pop { animation: heart-pop 0.3s ease-out; }
`;

/* ═══════════════════════════════════════════
   COMMUNITY DATA
   ═══════════════════════════════════════════ */

interface Community {
  id: string;
  name: string;
  companyId: string;
  description: string;
  members: number;
  posts: number;
  color: string;
  image: string;
  logo: string;
  tags: string[];
  isJoined: boolean;
  channels: { name: string; icon: typeof Hash; unread: number }[];
}

interface Post {
  id: string;
  communityId: string;
  author: { name: string; title: string; company: string; avatar: string; image: string };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isPinned?: boolean;
  tags?: string[];
  type: 'discussion' | 'achievement' | 'event' | 'idea' | 'help';
}

interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
  color: string;
}

interface TopContributor {
  name: string;
  company: string;
  avatar: string;
  image: string;
  points: number;
  rank: number;
  badge: string;
}

const COMMUNITIES: Community[] = [
  {
    id: 'shory-community', name: 'Shory Community', companyId: 'shory',
    description: 'Insurance innovators connecting, sharing ideas, and building the future of digital insurance in the UAE.',
    members: 2847, posts: 1256, color: '#0D9488',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
    tags: ['InsurTech', 'Innovation', 'Digital'],
    isJoined: true,
    channels: [
      { name: 'general', icon: Hash, unread: 5 },
      { name: 'innovation-lab', icon: Sparkles, unread: 2 },
      { name: 'social', icon: Heart, unread: 0 },
      { name: 'tech-talks', icon: Zap, unread: 8 },
    ],
  },
  {
    id: 'aldar-community', name: 'Aldar Community', companyId: 'aldar',
    description: 'The hub for Aldar Properties employees — real estate insights, project updates, and community events.',
    members: 5234, posts: 2890, color: '#C8973A',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop',
    tags: ['Real Estate', 'Community', 'Abu Dhabi'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'project-updates', icon: Building2, unread: 0 },
      { name: 'social-events', icon: Calendar, unread: 0 },
    ],
  },
  {
    id: 'purehealth-community', name: 'PureHealth Community', companyId: 'purehealth',
    description: 'Healthcare professionals united — share best practices, wellness tips, and breakthrough research.',
    members: 8912, posts: 4320, color: '#059669',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&h=100&fit=crop',
    tags: ['Healthcare', 'Wellness', 'Research'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'wellness-tips', icon: Heart, unread: 0 },
      { name: 'research', icon: Globe, unread: 0 },
    ],
  },
  {
    id: 'easylease-community', name: 'EasyLease Community', companyId: 'easylease',
    description: 'Mobility solutions team — fleet management insights, auto trends, and employee perks.',
    members: 1456, posts: 678, color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&h=100&fit=crop',
    tags: ['Automotive', 'Fleet', 'Leasing'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'new-arrivals', icon: Zap, unread: 0 },
    ],
  },
  {
    id: 'ghitha-community', name: 'Ghitha Community', companyId: 'ghitha',
    description: 'Food & beverage colleagues — recipes, restaurant reviews, and culinary innovation at Ghitha.',
    members: 3210, posts: 1890, color: '#DC2626',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop',
    tags: ['F&B', 'Culinary', 'Innovation'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'recipes', icon: Star, unread: 0 },
    ],
  },
  {
    id: 'palms-community', name: 'Palms Sports Community', companyId: 'palms',
    description: 'Sports & fitness enthusiasts — training tips, tournament updates, and fitness challenges.',
    members: 4567, posts: 3456, color: '#EA580C',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    tags: ['Sports', 'Fitness', 'Wellness'],
    isJoined: true,
    channels: [
      { name: 'general', icon: Hash, unread: 3 },
      { name: 'challenges', icon: Trophy, unread: 1 },
      { name: 'tournaments', icon: Award, unread: 0 },
    ],
  },
  {
    id: 'ihc-community', name: 'IHC Group Community', companyId: 'ihc',
    description: 'The cross-company hub for all IHC Group employees. Stay connected across 30+ subsidiaries.',
    members: 20000, posts: 8765, color: '#1B3A6B',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    tags: ['All Employees', 'Cross-Company', 'Networking'],
    isJoined: true,
    channels: [
      { name: 'general', icon: Hash, unread: 12 },
      { name: 'announcements', icon: Bell, unread: 3 },
      { name: 'innovation', icon: Sparkles, unread: 7 },
      { name: 'careers', icon: TrendingUp, unread: 2 },
      { name: 'social', icon: Heart, unread: 4 },
    ],
  },
];

const POSTS: Post[] = [
  {
    id: 'p001', communityId: 'ihc-community',
    author: { name: 'Ahmed Al Rashidi', title: 'Chief Strategy Officer', company: 'IHC Group', avatar: 'AR', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' },
    content: 'Thrilled to announce that IHC Group has been ranked #1 in the Middle East for employee satisfaction! This is all thanks to every single one of you. Let\'s keep building an amazing workplace together. 🎉',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    likes: 342, comments: 56, shares: 28, timestamp: '2h ago', isPinned: true,
    tags: ['Achievement', 'Culture'], type: 'achievement',
  },
  {
    id: 'p002', communityId: 'shory-community',
    author: { name: 'Faris Al Nuaimi', title: 'Engineering Lead', company: 'Shory', avatar: 'FN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
    content: 'Just shipped our new AI-powered claims processing engine! Processing time reduced from 48 hours to under 8 seconds. Massive shoutout to the entire engineering team. 🚀 This is what happens when a team truly collaborates.',
    likes: 189, comments: 34, shares: 12, timestamp: '4h ago',
    tags: ['Tech', 'Innovation', 'AI'], type: 'achievement',
  },
  {
    id: 'p003', communityId: 'palms-community',
    author: { name: 'Layla Ibrahim', title: 'Fitness Coach', company: 'Palms Sports', avatar: 'LI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    content: 'Who\'s joining the Palms Sports 10K Run Challenge this weekend? We already have 230 registrations! Free sports gear for all participants, plus the top 3 finishers get AED 5,000 in prizes. Sign up through the app before Friday.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
    likes: 156, comments: 67, shares: 45, timestamp: '6h ago',
    tags: ['Sports', 'Challenge', 'Fitness'], type: 'event',
  },
  {
    id: 'p004', communityId: 'aldar-community',
    author: { name: 'Maryam Jaber', title: 'Head of Leasing', company: 'Aldar Properties', avatar: 'MJ', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
    content: 'Exciting news for the Aldar community! We\'re launching an employee-exclusive viewing of the new Saadiyat Grove development this Saturday. First 50 employees get priority booking with special payment plans. Who\'s interested?',
    likes: 234, comments: 89, shares: 34, timestamp: '8h ago',
    tags: ['Property', 'Exclusive', 'Investment'], type: 'event',
  },
  {
    id: 'p005', communityId: 'purehealth-community',
    author: { name: 'Dr. Hind Al Shamsi', title: 'Medical Director', company: 'PureHealth', avatar: 'HS', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    content: 'I\'d love your input on our new employee wellness programme. We\'re thinking of adding mental health days, meditation rooms, and subsidized therapy sessions. What would make the biggest difference for you? Drop your ideas below.',
    likes: 278, comments: 124, shares: 56, timestamp: '1d ago',
    tags: ['Wellness', 'Mental Health', 'Ideas'], type: 'idea',
  },
  {
    id: 'p006', communityId: 'shory-community',
    author: { name: 'Sara Ahmed', title: 'Senior Product Manager', company: 'Shory', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    content: 'Looking for teammates for the upcoming IHC Innovation Hackathon (Apr 18-20). We need 1 designer and 1 data scientist. Our idea: AI-powered insurance risk assessment using satellite imagery. DM me if interested!',
    likes: 98, comments: 41, shares: 15, timestamp: '1d ago',
    tags: ['Hackathon', 'Team', 'AI'], type: 'help',
  },
  {
    id: 'p007', communityId: 'ihc-community',
    author: { name: 'Omar Al Hashimi', title: 'VP Innovation', company: 'IHC Group', avatar: 'OH', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    content: 'The Innovation Lab results are in: 47 ideas submitted across 12 subsidiaries, 8 selected for incubation, and 3 already generating revenue. The IHC Innovation Fund will be allocating AED 10M for the next cohort. Submit your ideas before May 15!',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    likes: 412, comments: 78, shares: 92, timestamp: '2d ago', isPinned: true,
    tags: ['Innovation', 'Funding', 'Ideas'], type: 'achievement',
  },
];

const COMMUNITY_EVENTS: CommunityEvent[] = [
  { id: 'ce001', communityId: 'ihc-community', title: 'IHC Cross-Company Networking Night', date: 'Apr 10, 2026', location: 'Yas Marina Circuit', attendees: 450, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop', color: '#1B3A6B' },
  { id: 'ce002', communityId: 'palms-community', title: 'Palms Sports 10K Run', date: 'Apr 5, 2026', location: 'Corniche, Abu Dhabi', attendees: 230, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=250&fit=crop', color: '#EA580C' },
  { id: 'ce003', communityId: 'shory-community', title: 'Shory Tech Meetup: AI in Insurance', date: 'Apr 15, 2026', location: 'Shory HQ, ADGM', attendees: 85, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop', color: '#0D9488' },
  { id: 'ce004', communityId: 'aldar-community', title: 'Aldar Property Showcase', date: 'Apr 12, 2026', location: 'Aldar HQ, Al Raha', attendees: 320, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop', color: '#C8973A' },
];

const TOP_CONTRIBUTORS: TopContributor[] = [
  { name: 'Ahmed Al Rashidi', company: 'IHC Group', avatar: 'AR', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', points: 12500, rank: 1, badge: 'Thought Leader' },
  { name: 'Sara Ahmed', company: 'Shory', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', points: 9800, rank: 2, badge: 'Innovator' },
  { name: 'Dr. Hind Al Shamsi', company: 'PureHealth', avatar: 'HS', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', points: 8900, rank: 3, badge: 'Wellness Champion' },
  { name: 'Maryam Jaber', company: 'Aldar Properties', avatar: 'MJ', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face', points: 7600, rank: 4, badge: 'Community Builder' },
  { name: 'Faris Al Nuaimi', company: 'Shory', avatar: 'FN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', points: 6400, rank: 5, badge: 'Tech Guru' },
];

const POST_TYPE_CONFIG = {
  discussion: { label: 'Discussion', color: '#9D63F6', icon: MessageCircle },
  achievement: { label: 'Achievement', color: '#FFBD4C', icon: Trophy },
  event: { label: 'Event', color: '#40C4AA', icon: Calendar },
  idea: { label: 'Idea', color: '#54B6ED', icon: Sparkles },
  help: { label: 'Looking for Help', color: '#DF1C41', icon: Users },
};

/* ═══════════════════════════════════════════
   COMMUNITY CARD COMPONENT
   ═══════════════════════════════════════════ */

function CommunityCard({ community, onSelect, onJoin }: { community: Community; onSelect: (c: Community) => void; onJoin: (id: string) => void }) {
  return (
    <button onClick={() => onSelect(community)} className="w-full text-left rounded-[20px] overflow-hidden border border-[#DFE1E6] active:scale-[0.98] transition-all" style={{ background: 'rgba(255,255,255,0.9)' }}>
      {/* Cover */}
      <div className="relative h-[100px] overflow-hidden">
        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-[12px] border-2 border-white overflow-hidden">
              <img src={community.logo} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">{community.name}</p>
              <p className="text-[10px] text-white/70">{community.members.toLocaleString()} members</p>
            </div>
          </div>
          {community.isJoined && (
            <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">Joined</span>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-3.5">
        <p className="text-[11px] text-[#666D80] leading-relaxed line-clamp-2 mb-2.5">{community.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {community.tags.map(tag => (
              <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: community.color + '12', color: community.color }}>{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#A4ABB8]">
            <MessageSquare size={10} />
            {community.posts.toLocaleString()}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   POST CARD COMPONENT
   ═══════════════════════════════════════════ */

function PostCard({ post, onLike, onComment }: { post: Post; onLike: (id: string) => void; onComment: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="rounded-[20px] border border-[#DFE1E6] overflow-hidden fade-up" style={{ background: 'rgba(255,255,255,0.95)' }}>
      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 px-4 pt-3 text-[10px] font-semibold text-[#9D63F6]">
          <Pin size={10} /> Pinned Post
        </div>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className="relative">
          <Avatar initials={post.author.avatar} color="#666D80" size="md" image={post.author.image} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-bold text-[#15161E]">{post.author.name}</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: typeConfig.color + '15', color: typeConfig.color }}>
              <TypeIcon size={8} className="inline mr-0.5" style={{ verticalAlign: '-1px' }} />
              {typeConfig.label}
            </span>
          </div>
          <p className="text-[10px] text-[#A4ABB8]">{post.author.title} · {post.author.company} · {post.timestamp}</p>
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-50">
          <MoreHorizontal size={16} className="text-[#A4ABB8]" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[13px] text-[#15161E] leading-relaxed">{post.content}</p>
        {post.tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold text-[#9D63F6] bg-[#9D63F6]/8 px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img src={post.image} alt="" className="w-full h-[180px] object-cover rounded-[14px]" />
        </div>
      )}

      {/* Engagement stats */}
      <div className="flex items-center justify-between px-4 py-2 text-[10px] text-[#A4ABB8] border-t border-[#F0F1F3]">
        <span>{post.likes + (liked ? 1 : 0)} likes</span>
        <div className="flex gap-3">
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center border-t border-[#F0F1F3]">
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); if (!liked) onLike(post.id); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-all ${liked ? 'heart-pop' : ''}`}
          style={{ color: liked ? '#DF1C41' : '#666D80' }}
        >
          <Heart size={14} fill={liked ? '#DF1C41' : 'none'} /> Like
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onComment(post.id); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-[#666D80]"
        >
          <MessageCircle size={14} /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-[#666D80]">
          <Share2 size={14} /> Share
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="flex items-center justify-center px-3 py-2.5"
        >
          <Bookmark size={14} fill={saved ? '#9D63F6' : 'none'} style={{ color: saved ? '#9D63F6' : '#666D80' }} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY DETAIL MODAL
   ═══════════════════════════════════════════ */

function CommunityDetailModal({ community, posts, events, onClose, onJoin, onLike, onComment }: {
  community: Community;
  posts: Post[];
  events: CommunityEvent[];
  onClose: () => void;
  onJoin: (id: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'members'>('feed');
  const [notificationsOn, setNotificationsOn] = useState(community.isJoined);

  const tabs = [
    { key: 'feed' as const, label: 'Feed', count: posts.length },
    { key: 'events' as const, label: 'Events', count: events.length },
    { key: 'members' as const, label: 'Members', count: community.members },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[92vh] overflow-y-auto scale-in">
        {/* Cover */}
        <div className="relative h-[160px] rounded-t-[28px] overflow-hidden">
          <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <X size={16} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] border-2 border-white overflow-hidden">
                <img src={community.logo} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-white">{community.name}</h2>
                <p className="text-[11px] text-white/70">{community.members.toLocaleString()} members · {community.posts.toLocaleString()} posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description + Actions */}
        <div className="p-4 border-b border-[#F0F1F3]">
          <p className="text-[12px] text-[#666D80] leading-relaxed mb-3">{community.description}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onJoin(community.id)}
              className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
              style={{
                background: community.isJoined ? '#F8F9FB' : community.color,
                color: community.isJoined ? '#666D80' : '#FFFFFF',
                border: community.isJoined ? '1px solid #DFE1E6' : 'none',
              }}
            >
              {community.isJoined ? <><CheckCircle2 size={14} /> Joined</> : <><UserPlus size={14} /> Join Community</>}
            </button>
            <button
              onClick={() => setNotificationsOn(!notificationsOn)}
              className="w-10 h-10 rounded-[12px] flex items-center justify-center border border-[#DFE1E6]"
            >
              {notificationsOn ? <Bell size={16} style={{ color: community.color }} /> : <BellOff size={16} className="text-[#A4ABB8]" />}
            </button>
          </div>

          {/* Channels */}
          {community.isJoined && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {community.channels.map(ch => (
                <button key={ch.name} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border border-[#DFE1E6] bg-white">
                  <ch.icon size={10} style={{ color: community.color }} />
                  <span className="text-[#15161E]">{ch.name}</span>
                  {ch.unread > 0 && (
                    <span className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: '#DF1C41' }}>{ch.unread}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#F0F1F3]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 text-[12px] font-semibold transition-all relative"
              style={{ color: activeTab === tab.key ? community.color : '#A4ABB8' }}
            >
              {tab.label}
              {tab.key === 'feed' && <span className="ml-1 text-[9px] opacity-50">{tab.count}</span>}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{ background: community.color }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-3 pb-8">
          {activeTab === 'feed' && (
            <>
              {/* New post composer */}
              {community.isJoined && (
                <div className="flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6] bg-[#F8F9FB]">
                  <div className="w-8 h-8 rounded-full bg-[#9D63F6]/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#9D63F6]">SA</span>
                  </div>
                  <p className="text-[12px] text-[#A4ABB8] flex-1">Share something with the community...</p>
                  <ImageIcon size={16} className="text-[#A4ABB8]" />
                </div>
              )}
              {posts.map(post => (
                <PostCard key={post.id} post={post} onLike={onLike} onComment={onComment} />
              ))}
              {posts.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle size={32} className="text-[#DFE1E6] mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-[#A4ABB8]">No posts yet</p>
                  <p className="text-[11px] text-[#D1D5DB]">Join to be the first to post!</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'events' && (
            <>
              {events.map(event => (
                <div key={event.id} className="rounded-[16px] overflow-hidden border border-[#DFE1E6] fade-up">
                  <div className="relative h-[120px]">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[13px] font-bold text-white">{event.title}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-[#666D80]">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {event.location.split(',')[0]}</span>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: event.color }}>{event.attendees} attending</span>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-8">
                  <Calendar size={32} className="text-[#DFE1E6] mx-auto mb-2" />
                  <p className="text-[13px] font-semibold text-[#A4ABB8]">No upcoming events</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'members' && (
            <div className="space-y-2">
              {COLLEAGUES.map(col => (
                <div key={col.id} className="flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6] bg-white fade-up">
                  <Avatar initials={col.avatar} color="#666D80" size="md" image={col.image} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#15161E]">{col.name}</p>
                    <p className="text-[10px] text-[#A4ABB8]">{col.title} · {col.company}</p>
                  </div>
                  <button className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-[#DFE1E6]" style={{ color: community.color }}>
                    Connect
                  </button>
                </div>
              ))}
              <p className="text-center text-[10px] text-[#A4ABB8] pt-2">
                Showing {COLLEAGUES.length} of {community.members.toLocaleString()} members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMMUNITY PAGE
   ═══════════════════════════════════════════ */

export default function CommunityPage() {
  const { user } = useAuth();
  const wallet = useWallet();
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeView, setActiveView] = useState<'discover' | 'my' | 'feed'>('feed');
  const [postLikes, setPostLikes] = useState<Set<string>>(new Set());
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  if (!user) return null;

  const myCommunities = communities.filter(c => c.isJoined);
  const discoverCommunities = communities.filter(c => !c.isJoined);
  const feedPosts = POSTS.filter(p => myCommunities.some(c => c.id === p.communityId))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  function handleJoin(communityId: string) {
    setCommunities(prev => prev.map(c =>
      c.id === communityId ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c
    ));
    const community = communities.find(c => c.id === communityId);
    if (community && !community.isJoined) {
      wallet.addRewardPoints(50, `Joined ${community.name}`, 'engagement');
      setRewardToast('+50 points for joining!');
      setTimeout(() => setRewardToast(null), 3000);
    }
    // Update selected community if open
    setSelectedCommunity(prev => {
      if (prev && prev.id === communityId) {
        return { ...prev, isJoined: !prev.isJoined, members: prev.isJoined ? prev.members - 1 : prev.members + 1 };
      }
      return prev;
    });
  }

  function handleLike(postId: string) {
    if (!postLikes.has(postId)) {
      setPostLikes(prev => new Set(prev).add(postId));
      wallet.addRewardPoints(5, 'Liked a community post', 'engagement');
    }
  }

  function handleComment(postId: string) {
    wallet.addRewardPoints(10, 'Commented on a post', 'engagement');
    setRewardToast('+10 points for engaging!');
    setTimeout(() => setRewardToast(null), 3000);
  }

  const communityPosts = selectedCommunity
    ? POSTS.filter(p => p.communityId === selectedCommunity.id)
    : [];
  const communityEvents = selectedCommunity
    ? COMMUNITY_EVENTS.filter(e => e.communityId === selectedCommunity.id)
    : [];

  const totalUnread = myCommunities.reduce((sum, c) => sum + c.channels.reduce((s, ch) => s + ch.unread, 0), 0);

  return (
    <AppShell title="Community" subtitle="">
      <style>{COMMUNITY_STYLES}</style>

      <div className="space-y-5">

        {/* ═══ REWARD TOAST ═══ */}
        {rewardToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#15161E] text-white text-[12px] font-bold flex items-center gap-2 shadow-lg scale-in">
            <Star size={14} className="text-[#FFBD4C]" />
            {rewardToast}
          </div>
        )}

        {/* ═══ TAB SWITCHER ═══ */}
        <div className="flex gap-1 p-1 rounded-[14px] bg-[#F8F9FB] border border-[#DFE1E6]">
          {[
            { key: 'feed' as const, label: 'Feed', icon: MessageCircle },
            { key: 'my' as const, label: 'My Communities', icon: Users },
            { key: 'discover' as const, label: 'Discover', icon: Globe },
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[11px] font-semibold transition-all"
                style={{
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#15161E' : '#A4ABB8',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <TabIcon size={13} />
                {tab.label}
                {tab.key === 'feed' && totalUnread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#DF1C41] text-white text-[8px] font-bold flex items-center justify-center">{totalUnread}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══ FEED VIEW ═══ */}
        {activeView === 'feed' && (
          <>
            {/* My communities pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {myCommunities.map(c => (
                <button key={c.id} onClick={() => setSelectedCommunity(c)}
                  className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border border-[#DFE1E6] bg-white active:scale-95 transition-all">
                  <div className="w-6 h-6 rounded-[6px] overflow-hidden">
                    <img src={c.logo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#15161E]">{c.name.replace(' Community', '')}</span>
                  {c.channels.reduce((s, ch) => s + ch.unread, 0) > 0 && (
                    <span className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: '#DF1C41' }}>
                      {c.channels.reduce((s, ch) => s + ch.unread, 0)}
                    </span>
                  )}
                </button>
              ))}
              <button onClick={() => setActiveView('discover')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-dashed border-[#9D63F6] text-[#9D63F6] bg-[#9D63F6]/5 active:scale-95">
                <Plus size={12} />
                <span className="text-[11px] font-semibold">Join More</span>
              </button>
            </div>

            {/* Leaderboard mini card */}
            <div className="rounded-[18px] p-4 border border-[#DFE1E6]" style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 100%)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-[#FFBD4C]" />
                  <span className="text-[12px] font-bold text-white">Top Contributors This Week</span>
                </div>
                <span className="text-[10px] text-white/60 font-medium">Earn points by engaging!</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {TOP_CONTRIBUTORS.slice(0, 5).map((contributor, i) => (
                  <div key={contributor.name} className="shrink-0 flex flex-col items-center gap-1.5 min-w-[60px]">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: i === 0 ? '#FFBD4C' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.3)' }}>
                        <img src={contributor.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ background: i === 0 ? '#FFBD4C' : i === 1 ? '#94A3B8' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.2)' }}>
                        {contributor.rank}
                      </div>
                    </div>
                    <p className="text-[9px] font-semibold text-white/90 text-center leading-tight">{contributor.name.split(' ')[0]}</p>
                    <p className="text-[8px] text-white/50">{contributor.points.toLocaleString()} pts</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts feed */}
            <div className="space-y-3">
              {feedPosts.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
              ))}
            </div>
          </>
        )}

        {/* ═══ MY COMMUNITIES VIEW ═══ */}
        {activeView === 'my' && (
          <div className="space-y-3">
            {myCommunities.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Users size={40} className="text-[#DFE1E6] mx-auto mb-3" />
                <p className="text-[15px] font-bold text-[#15161E] mb-1">No communities yet</p>
                <p className="text-[12px] text-[#A4ABB8] mb-4">Discover and join communities to connect with colleagues</p>
                <button onClick={() => setActiveView('discover')} className="px-6 py-2.5 rounded-full bg-[#9D63F6] text-white text-[12px] font-bold active:scale-95">
                  Discover Communities
                </button>
              </div>
            ) : (
              myCommunities.map(c => (
                <CommunityCard key={c.id} community={c} onSelect={setSelectedCommunity} onJoin={handleJoin} />
              ))
            )}
          </div>
        )}

        {/* ═══ DISCOVER VIEW ═══ */}
        {activeView === 'discover' && (
          <div className="space-y-4">
            {/* Suggestion header */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#9D63F6]" />
              <p className="text-[13px] font-bold text-[#15161E]">Recommended for You</p>
            </div>

            {/* All communities */}
            <div className="space-y-3">
              {communities.map(c => (
                <CommunityCard key={c.id} community={c} onSelect={setSelectedCommunity} onJoin={handleJoin} />
              ))}
            </div>

            {/* Cross-company CTA */}
            <div className="rounded-[18px] p-5 text-center" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 100%)' }}>
              <Globe size={28} className="text-white/80 mx-auto mb-2" />
              <p className="text-[14px] font-bold text-white mb-1">Connect Across IHC Group</p>
              <p className="text-[11px] text-white/60 mb-3">Join communities from any subsidiary to network with 20,000+ colleagues</p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40">
                <Star size={10} className="text-[#FFBD4C]" />
                Earn 50 reward points for each community you join
              </div>
            </div>
          </div>
        )}

        {/* ═══ UPCOMING COMMUNITY EVENTS ═══ */}
        {activeView === 'feed' && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-[#15161E]">Community Events</h2>
              <span className="text-[10px] font-semibold text-[#9D63F6]">{COMMUNITY_EVENTS.length} upcoming</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {COMMUNITY_EVENTS.map(event => (
                <div key={event.id} className="shrink-0 w-[260px] rounded-[16px] overflow-hidden border border-[#DFE1E6] bg-white fade-up">
                  <div className="relative h-[100px]">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-[11px] font-bold text-white">{event.title}</p>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] text-[#666D80]">
                      <span className="flex items-center gap-0.5"><Calendar size={9} /> {event.date.split(',')[0]}</span>
                      <span className="flex items-center gap-0.5"><Users size={9} /> {event.attendees}</span>
                    </div>
                    <button className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: event.color }}>
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Community Detail Modal */}
      {selectedCommunity && (
        <CommunityDetailModal
          community={selectedCommunity}
          posts={communityPosts}
          events={communityEvents}
          onClose={() => setSelectedCommunity(null)}
          onJoin={handleJoin}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </AppShell>
  );
}
