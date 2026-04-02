'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { COMPANIES, COLLEAGUES } from '@/lib/mockData';
import {
  Users, MessageCircle, Heart, Send, Image as ImageIcon,
  X, Star, Trophy, Flame, Calendar, MapPin,
  Plus, Share2, Bookmark, MoreHorizontal, Crown,
  Sparkles, TrendingUp, Award, Zap, Building2, Globe, CheckCircle2,
  UserPlus, Bell, BellOff, Hash, Pin, Eye, MessageSquare, Camera,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */

const COMMUNITY_STYLES = `
  @keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes heart-pop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
  @keyframes story-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes double-tap-heart { 0% { opacity: 0; transform: scale(0); } 40% { opacity: 1; transform: scale(1.2); } 70% { opacity: 1; transform: scale(0.95); } 100% { opacity: 0; transform: scale(1); } }
  .fade-up { animation: fade-up 0.4s ease-out both; }
  .scale-in { animation: scale-in 0.3s ease-out both; }
  .heart-pop { animation: heart-pop 0.3s ease-out; }
  .slide-up { animation: slide-up 0.35s ease-out both; }
  .double-tap-heart { animation: double-tap-heart 0.8s ease-out forwards; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface Community {
  id: string;
  name: string;
  shortName: string;
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
    id: 'shory-community', name: 'Shory Community', shortName: 'Shory', companyId: 'shory',
    description: 'Insurance innovators connecting, sharing ideas, and building the future of digital insurance in the UAE.',
    members: 2847, posts: 1256, color: '#0D9488',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    logo: '/logos/shory.svg',
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
    id: 'aldar-community', name: 'Aldar Community', shortName: 'Aldar', companyId: 'aldar',
    description: 'The hub for Aldar Properties employees — real estate insights, project updates, and community events.',
    members: 5234, posts: 2890, color: '#C8973A',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    logo: '/logos/aldar.svg',
    tags: ['Real Estate', 'Community', 'Abu Dhabi'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'project-updates', icon: Building2, unread: 0 },
      { name: 'social-events', icon: Calendar, unread: 0 },
    ],
  },
  {
    id: 'purehealth-community', name: 'PureHealth Community', shortName: 'PureHealth', companyId: 'purehealth',
    description: 'Healthcare professionals united — share best practices, wellness tips, and breakthrough research.',
    members: 8912, posts: 4320, color: '#059669',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    logo: '/logos/purehealth.svg',
    tags: ['Healthcare', 'Wellness', 'Research'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'wellness-tips', icon: Heart, unread: 0 },
      { name: 'research', icon: Globe, unread: 0 },
    ],
  },
  {
    id: 'easylease-community', name: 'EasyLease Community', shortName: 'EasyLease', companyId: 'easylease',
    description: 'Mobility solutions team — fleet management insights, auto trends, and employee perks.',
    members: 1456, posts: 678, color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=800&h=400&fit=crop',
    logo: '/logos/easylease.svg',
    tags: ['Automotive', 'Fleet', 'Leasing'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'new-arrivals', icon: Zap, unread: 0 },
    ],
  },
  {
    id: 'ghitha-community', name: 'Ghitha Community', shortName: 'Ghitha', companyId: 'ghitha',
    description: 'Food & beverage colleagues — recipes, restaurant reviews, and culinary innovation at Ghitha.',
    members: 3210, posts: 1890, color: '#DC2626',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    logo: '/logos/ghitha.svg',
    tags: ['F&B', 'Culinary', 'Innovation'],
    isJoined: false,
    channels: [
      { name: 'general', icon: Hash, unread: 0 },
      { name: 'recipes', icon: Star, unread: 0 },
    ],
  },
  {
    id: 'palms-community', name: 'Palms Sports Community', shortName: 'Palms', companyId: 'palms',
    description: 'Sports & fitness enthusiasts — training tips, tournament updates, and fitness challenges.',
    members: 4567, posts: 3456, color: '#EA580C',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    logo: '/logos/palms-sports.svg',
    tags: ['Sports', 'Fitness', 'Wellness'],
    isJoined: true,
    channels: [
      { name: 'general', icon: Hash, unread: 3 },
      { name: 'challenges', icon: Trophy, unread: 1 },
      { name: 'tournaments', icon: Award, unread: 0 },
    ],
  },
  {
    id: 'ihc-community', name: 'IHC Group Community', shortName: 'IHC Group', companyId: 'ihc',
    description: 'The cross-company hub for all IHC Group employees. Stay connected across 30+ subsidiaries.',
    members: 20000, posts: 8765, color: '#1B3A6B',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    logo: '/logos/ihc.svg',
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
    content: 'Who\'s joining the Palms Sports 10K Run Challenge this weekend? We already have 230 registrations! Free sports gear for all participants, plus the top 3 finishers get AED 5,000 in prizes. Sign up through the app before Friday. 🏃‍♀️',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
    likes: 156, comments: 67, shares: 45, timestamp: '6h ago',
    tags: ['Sports', 'Challenge', 'Fitness'], type: 'event',
  },
  {
    id: 'p004', communityId: 'aldar-community',
    author: { name: 'Maryam Jaber', title: 'Head of Leasing', company: 'Aldar Properties', avatar: 'MJ', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
    content: 'Exciting news for the Aldar community! We\'re launching an employee-exclusive viewing of the new Saadiyat Grove development this Saturday. First 50 employees get priority booking with special payment plans. Who\'s interested? 🏠',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    likes: 234, comments: 89, shares: 34, timestamp: '8h ago',
    tags: ['Property', 'Exclusive', 'Investment'], type: 'event',
  },
  {
    id: 'p005', communityId: 'purehealth-community',
    author: { name: 'Dr. Hind Al Shamsi', title: 'Medical Director', company: 'PureHealth', avatar: 'HS', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    content: 'I\'d love your input on our new employee wellness programme. We\'re thinking of adding mental health days, meditation rooms, and subsidized therapy sessions. What would make the biggest difference for you? Drop your ideas below. 💭',
    likes: 278, comments: 124, shares: 56, timestamp: '1d ago',
    tags: ['Wellness', 'Mental Health', 'Ideas'], type: 'idea',
  },
  {
    id: 'p006', communityId: 'shory-community',
    author: { name: 'Sara Ahmed', title: 'Senior Product Manager', company: 'Shory', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    content: 'Looking for teammates for the upcoming IHC Innovation Hackathon (Apr 18-20). We need 1 designer and 1 data scientist. Our idea: AI-powered insurance risk assessment using satellite imagery. DM me if interested! 🤖',
    likes: 98, comments: 41, shares: 15, timestamp: '1d ago',
    tags: ['Hackathon', 'Team', 'AI'], type: 'help',
  },
  {
    id: 'p007', communityId: 'ihc-community',
    author: { name: 'Omar Al Hashimi', title: 'VP Innovation', company: 'IHC Group', avatar: 'OH', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    content: 'The Innovation Lab results are in: 47 ideas submitted across 12 subsidiaries, 8 selected for incubation, and 3 already generating revenue. The IHC Innovation Fund will be allocating AED 10M for the next cohort. Submit your ideas before May 15! 💡',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    likes: 412, comments: 78, shares: 92, timestamp: '2d ago', isPinned: true,
    tags: ['Innovation', 'Funding', 'Ideas'], type: 'achievement',
  },
  {
    id: 'p008', communityId: 'ghitha-community',
    author: { name: 'Khalid Mansoor', title: 'Executive Chef', company: 'Ghitha', avatar: 'KM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
    content: 'Our new employee cafeteria menu launches next week! We\'ve added 12 new dishes inspired by cuisines from across the IHC Group family. Come try our Emirati-fusion specials — trust me, the luqaimat cheesecake is going to be your new favourite. 🍽️',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    likes: 203, comments: 95, shares: 41, timestamp: '3h ago',
    tags: ['Food', 'New Menu', 'Cafeteria'], type: 'discussion',
  },
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
   STORY CIRCLE COMPONENT (Instagram-style)
   ═══════════════════════════════════════════ */

function StoryCircle({ community, isActive, hasUnread, onClick }: {
  community: Community;
  isActive: boolean;
  hasUnread: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
      <div className="relative">
        {/* Gradient ring */}
        <div
          className="w-[62px] h-[62px] rounded-full flex items-center justify-center"
          style={{
            background: hasUnread
              ? `linear-gradient(135deg, ${community.color}, #9D63F6, #FFBD4C)`
              : isActive
                ? community.color
                : '#DFE1E6',
            padding: '2.5px',
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
            <img src={community.logo} alt="" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>
        {hasUnread && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DF1C41] border-2 border-white flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">
              {community.channels.reduce((s, ch) => s + ch.unread, 0)}
            </span>
          </div>
        )}
      </div>
      <span className={`text-[10px] leading-tight text-center truncate w-full ${isActive ? 'font-bold text-[#15161E]' : 'font-medium text-[#666D80]'}`}>
        {community.shortName}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════
   INSTAGRAM-STYLE POST CARD
   ═══════════════════════════════════════════ */

function FeedPostCard({ post, community, onLike, onComment }: {
  post: Post;
  community?: Community;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      onLike(post.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const contentTruncated = post.content.length > 120;
  const displayContent = expanded ? post.content : post.content.slice(0, 120);

  return (
    <div className="bg-white slide-up">
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-full overflow-hidden"
          style={{ boxShadow: `0 0 0 2px ${community?.color || '#9D63F6'}, 0 0 0 3.5px white` }}
        >
          <img src={post.author.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-bold text-[#15161E]">{post.author.name}</p>
            {community && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: community.color + '15', color: community.color }}>
                {community.shortName}
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#A4ABB8]">{post.author.title} · {post.timestamp}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: typeConfig.color + '15', color: typeConfig.color }}>
            <TypeIcon size={8} className="inline mr-0.5" style={{ verticalAlign: '-1px' }} />
            {typeConfig.label}
          </span>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50">
            <MoreHorizontal size={18} className="text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Post image — Instagram-style full-width */}
      {post.image && (
        <div className="relative w-full" onDoubleClick={handleDoubleTap}>
          <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
          {/* Double-tap heart animation */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart size={80} fill="white" className="text-white double-tap-heart drop-shadow-lg" />
            </div>
          )}
          {/* Pinned badge */}
          {post.isPinned && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Pin size={10} className="text-[#FFBD4C]" />
              <span className="text-[9px] font-bold text-white">Pinned</span>
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setLiked(!liked); if (!liked) onLike(post.id); }}
            className={`transition-transform ${liked ? 'heart-pop' : ''}`}
          >
            <Heart size={24} strokeWidth={1.8} fill={liked ? '#DF1C41' : 'none'} style={{ color: liked ? '#DF1C41' : '#15161E' }} />
          </button>
          <button onClick={() => onComment(post.id)}>
            <MessageCircle size={24} strokeWidth={1.8} className="text-[#15161E]" />
          </button>
          <button>
            <Send size={22} strokeWidth={1.8} className="text-[#15161E]" />
          </button>
        </div>
        <button onClick={() => setSaved(!saved)}>
          <Bookmark size={24} strokeWidth={1.8} fill={saved ? '#15161E' : 'none'} className="text-[#15161E]" />
        </button>
      </div>

      {/* Likes count */}
      <div className="px-4 pb-1">
        <p className="text-[13px] font-bold text-[#15161E]">
          {(post.likes + (liked ? 1 : 0)).toLocaleString()} likes
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-[13px] text-[#15161E] leading-relaxed">
          <span className="font-bold">{post.author.name.split(' ')[0].toLowerCase()}</span>{' '}
          {displayContent}
          {contentTruncated && !expanded && (
            <button onClick={() => setExpanded(true)} className="text-[#A4ABB8] ml-1">...more</button>
          )}
        </p>
        {post.tags && expanded && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {post.tags.map(tag => (
              <span key={tag} className="text-[12px] font-medium text-[#9D63F6]">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Comments preview */}
      {post.comments > 0 && (
        <button className="px-4 pb-1">
          <span className="text-[12px] text-[#A4ABB8]">View all {post.comments} comments</span>
        </button>
      )}

      {/* No-image posts get their content shown differently */}
      {!post.image && (
        <div className="px-4 pb-3">
          {post.isPinned && (
            <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-[#9D63F6]">
              <Pin size={10} /> Pinned
            </div>
          )}
        </div>
      )}

      {/* Thin divider */}
      <div className="h-[1px] bg-[#F0F1F3] mx-4 mb-0" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY DETAIL SHEET
   ═══════════════════════════════════════════ */

function CommunitySheet({ community, posts, onClose, onJoin, onLike, onComment }: {
  community: Community;
  posts: Post[];
  onClose: () => void;
  onJoin: (id: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto scale-in">
        {/* Header */}
        <div className="relative h-[140px] rounded-t-[28px] overflow-hidden">
          <img src={community.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <X size={16} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] border-2 border-white overflow-hidden bg-white">
              <img src={community.logo} alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-white">{community.name}</h2>
              <p className="text-[11px] text-white/70">{community.members.toLocaleString()} members · {community.posts.toLocaleString()} posts</p>
            </div>
          </div>
        </div>

        {/* Info + Actions */}
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
          </div>
          {/* Tags */}
          <div className="flex gap-1.5 mt-3">
            {community.tags.map(tag => (
              <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: community.color + '12', color: community.color }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="pb-8">
          {posts.length > 0 ? (
            posts.map(post => (
              <FeedPostCard key={post.id} post={post} community={community} onLike={onLike} onComment={onComment} />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={32} className="text-[#DFE1E6] mx-auto mb-2" />
              <p className="text-[13px] font-semibold text-[#A4ABB8]">No posts yet</p>
              <p className="text-[11px] text-[#D1D5DB]">Join to be the first to post!</p>
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
  const [filterCommunity, setFilterCommunity] = useState<string | null>(null);
  const [postLikes, setPostLikes] = useState<Set<string>>(new Set());
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  if (!user) return null;

  const myCommunities = communities.filter(c => c.isJoined);
  const allPosts = POSTS.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  const filteredPosts = filterCommunity
    ? allPosts.filter(p => p.communityId === filterCommunity)
    : allPosts;

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

  return (
    <AppShell title="Community" subtitle="">
      <style>{COMMUNITY_STYLES}</style>

      {/* ═══ REWARD TOAST ═══ */}
      {rewardToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#15161E] text-white text-[12px] font-bold flex items-center gap-2 shadow-lg scale-in">
          <Star size={14} className="text-[#FFBD4C]" />
          {rewardToast}
        </div>
      )}

      {/* ═══ STORIES ROW — Instagram-style ═══ */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-1 px-1">
        {/* "All" filter */}
        <button
          onClick={() => setFilterCommunity(null)}
          className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]"
        >
          <div
            className="w-[62px] h-[62px] rounded-full flex items-center justify-center"
            style={{
              background: !filterCommunity ? '#9D63F6' : '#DFE1E6',
              padding: '2.5px',
            }}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Globe size={22} style={{ color: !filterCommunity ? '#9D63F6' : '#A4ABB8' }} />
            </div>
          </div>
          <span className={`text-[10px] leading-tight ${!filterCommunity ? 'font-bold text-[#15161E]' : 'font-medium text-[#666D80]'}`}>
            All
          </span>
        </button>

        {communities.map(c => (
          <StoryCircle
            key={c.id}
            community={c}
            isActive={filterCommunity === c.id}
            hasUnread={c.isJoined && c.channels.reduce((s, ch) => s + ch.unread, 0) > 0}
            onClick={() => {
              if (filterCommunity === c.id) {
                setSelectedCommunity(c);
              } else {
                setFilterCommunity(c.id);
              }
            }}
          />
        ))}

        {/* Discover more */}
        <button
          onClick={() => setFilterCommunity('discover')}
          className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]"
        >
          <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center border-2 border-dashed border-[#9D63F6]/40 bg-[#9D63F6]/5">
            <Plus size={22} className="text-[#9D63F6]" />
          </div>
          <span className="text-[10px] font-medium text-[#9D63F6] leading-tight">Discover</span>
        </button>
      </div>

      {/* Thin separator */}
      <div className="h-[1px] bg-[#F0F1F3] -mx-4 mb-4" />

      {/* ═══ DISCOVER VIEW ═══ */}
      {filterCommunity === 'discover' ? (
        <div className="space-y-4 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#9D63F6]" />
            <p className="text-[14px] font-bold text-[#15161E]">Discover Communities</p>
          </div>

          {communities.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCommunity(c)}
              className="w-full text-left rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all slide-up"
            >
              <div className="relative h-[100px]">
                <img src={c.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-[10px] border-2 border-white overflow-hidden bg-white">
                      <img src={c.logo} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">{c.name}</p>
                      <p className="text-[9px] text-white/70">{c.members.toLocaleString()} members</p>
                    </div>
                  </div>
                  {c.isJoined && (
                    <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">Joined</span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-[#666D80] leading-relaxed line-clamp-2 mb-2">{c.description}</p>
                <div className="flex gap-1.5">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.color + '12', color: c.color }}>{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}

          {/* CTA card */}
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
      ) : (
        /* ═══ FEED VIEW — Instagram-style ═══ */
        <div className="space-y-0 -mx-4">
          {/* Create post bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F0F1F3]">
            <div className="w-9 h-9 rounded-full bg-[#9D63F6]/10 flex items-center justify-center">
              <span className="text-[11px] font-bold text-[#9D63F6]">{user.avatar}</span>
            </div>
            <div className="flex-1 py-2 px-3.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6]">
              <p className="text-[12px] text-[#A4ABB8]">What&apos;s happening in your community?</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#9D63F6]/10 flex items-center justify-center">
              <Camera size={18} className="text-[#9D63F6]" />
            </button>
          </div>

          {/* Top Contributors mini strip */}
          <div className="bg-white border-b border-[#F0F1F3] px-4 py-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Trophy size={13} className="text-[#FFBD4C]" />
              <span className="text-[11px] font-bold text-[#15161E]">Top Contributors</span>
              <span className="text-[9px] text-[#A4ABB8] ml-auto">This week</span>
            </div>
            <div className="flex gap-4">
              {TOP_CONTRIBUTORS.slice(0, 5).map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2" style={{ borderColor: i === 0 ? '#FFBD4C' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#DFE1E6' }}>
                      <img src={c.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                      style={{ background: i === 0 ? '#FFBD4C' : i === 1 ? '#94A3B8' : i === 2 ? '#CD7F32' : '#A4ABB8' }}>
                      {c.rank}
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[9px] font-semibold text-[#15161E] leading-tight">{c.name.split(' ')[0]}</p>
                    <p className="text-[7px] text-[#A4ABB8]">{c.points.toLocaleString()} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts feed */}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => {
              const community = communities.find(c => c.id === post.communityId);
              return (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  community={community}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              );
            })
          ) : (
            <div className="text-center py-16 px-4">
              <MessageCircle size={40} className="text-[#DFE1E6] mx-auto mb-3" />
              <p className="text-[15px] font-bold text-[#15161E] mb-1">No posts yet</p>
              <p className="text-[12px] text-[#A4ABB8]">Be the first to share something!</p>
            </div>
          )}

          {/* End of feed indicator */}
          <div className="py-8 text-center bg-white">
            <CheckCircle2 size={32} className="text-[#DFE1E6] mx-auto mb-2" />
            <p className="text-[12px] font-semibold text-[#A4ABB8]">You&apos;re all caught up</p>
            <p className="text-[10px] text-[#D1D5DB]">You&apos;ve seen all recent posts</p>
          </div>
        </div>
      )}

      {/* Community Detail Sheet */}
      {selectedCommunity && (
        <CommunitySheet
          community={selectedCommunity}
          posts={communityPosts}
          onClose={() => setSelectedCommunity(null)}
          onJoin={handleJoin}
          onLike={handleLike}
          onComment={handleComment}
        />
      )}
    </AppShell>
  );
}
