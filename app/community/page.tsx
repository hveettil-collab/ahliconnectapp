'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { COMPANIES, COLLEAGUES } from '@/lib/mockData';
import {
  Users, MessageCircle, Heart, Send, Image as ImageIcon,
  X, Star, Trophy, Flame, Calendar, MapPin,
  Plus, Share2, Bookmark, MoreHorizontal, Crown,
  Sparkles, TrendingUp, Award, Zap, Building2, Globe, CheckCircle2,
  UserPlus, Bell, BellOff, Hash, Pin, Eye, MessageSquare, Camera,
  ChevronDown, Smile, Link2, AtSign, Trash2, AlertCircle, Copy, Check,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */

/* Community animations are now in globals.css — no inline <style> needed */

/* ═══════════════════════════════════════════
   TYPES
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

type PostType = 'discussion' | 'achievement' | 'event' | 'idea' | 'help';

interface Comment {
  id: string;
  postId: string;
  author: { name: string; avatar: string; image?: string };
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  communityId: string;
  author: { name: string; title: string; company: string; avatar: string; image: string };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  commentCount: number;
  shares: number;
  timestamp: string;
  isPinned?: boolean;
  tags?: string[];
  type: PostType;
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

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

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

const SEED_COMMENTS: Record<string, Comment[]> = {
  p001: [
    { id: 'c001', postId: 'p001', author: { name: 'Sara Ahmed', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' }, content: 'This is incredible! So proud to be part of IHC Group. The culture here is truly one of a kind.', timestamp: '1h ago', likes: 24 },
    { id: 'c002', postId: 'p001', author: { name: 'Omar Al Hashimi', avatar: 'OH', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }, content: 'Well deserved! Every subsidiary played a role in this achievement.', timestamp: '45m ago', likes: 18 },
    { id: 'c003', postId: 'p001', author: { name: 'Layla Ibrahim', avatar: 'LI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' }, content: 'Best workplace ever! The wellness programmes alone make a huge difference.', timestamp: '30m ago', likes: 12 },
  ],
  p002: [
    { id: 'c004', postId: 'p002', author: { name: 'Sara Ahmed', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' }, content: 'From 48 hours to 8 seconds — this is the kind of innovation that puts us ahead of every competitor!', timestamp: '3h ago', likes: 15 },
    { id: 'c005', postId: 'p002', author: { name: 'Ahmed Al Rashidi', avatar: 'AR', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' }, content: 'Impressive work by the Shory engineering team. This is exactly the innovation spirit we want across IHC.', timestamp: '2h ago', likes: 31 },
  ],
  p003: [
    { id: 'c006', postId: 'p003', author: { name: 'Khalid Mansoor', avatar: 'KM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' }, content: 'Count me in! Will the Ghitha team be providing the post-run snacks? Asking for a friend...', timestamp: '5h ago', likes: 8 },
  ],
  p005: [
    { id: 'c007', postId: 'p005', author: { name: 'Faris Al Nuaimi', avatar: 'FN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' }, content: 'Mental health days would be a game changer. Also, onsite counselling sessions would be amazing.', timestamp: '20h ago', likes: 45 },
    { id: 'c008', postId: 'p005', author: { name: 'Maryam Jaber', avatar: 'MJ', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' }, content: 'Subsidized therapy is such an important benefit. Would love to see this across all IHC subsidiaries.', timestamp: '18h ago', likes: 38 },
  ],
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'p001', communityId: 'ihc-community',
    author: { name: 'Ahmed Al Rashidi', title: 'Chief Strategy Officer', company: 'IHC Group', avatar: 'AR', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' },
    content: 'Thrilled to announce that IHC Group has been ranked #1 in the Middle East for employee satisfaction! This is all thanks to every single one of you. Let\'s keep building an amazing workplace together.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    likes: 342, comments: SEED_COMMENTS['p001'] || [], commentCount: 56, shares: 28, timestamp: '2h ago', isPinned: true,
    tags: ['Achievement', 'Culture'], type: 'achievement',
  },
  {
    id: 'p002', communityId: 'shory-community',
    author: { name: 'Faris Al Nuaimi', title: 'Engineering Lead', company: 'Shory', avatar: 'FN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
    content: 'Just shipped our new AI-powered claims processing engine! Processing time reduced from 48 hours to under 8 seconds. Massive shoutout to the entire engineering team. This is what happens when a team truly collaborates.',
    likes: 189, comments: SEED_COMMENTS['p002'] || [], commentCount: 34, shares: 12, timestamp: '4h ago',
    tags: ['Tech', 'Innovation', 'AI'], type: 'achievement',
  },
  {
    id: 'p003', communityId: 'palms-community',
    author: { name: 'Layla Ibrahim', title: 'Fitness Coach', company: 'Palms Sports', avatar: 'LI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    content: 'Who\'s joining the Palms Sports 10K Run Challenge this weekend? We already have 230 registrations! Free sports gear for all participants, plus the top 3 finishers get AED 5,000 in prizes. Sign up through the app before Friday.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
    likes: 156, comments: SEED_COMMENTS['p003'] || [], commentCount: 67, shares: 45, timestamp: '6h ago',
    tags: ['Sports', 'Challenge', 'Fitness'], type: 'event',
  },
  {
    id: 'p004', communityId: 'aldar-community',
    author: { name: 'Maryam Jaber', title: 'Head of Leasing', company: 'Aldar Properties', avatar: 'MJ', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
    content: 'Exciting news for the Aldar community! We\'re launching an employee-exclusive viewing of the new Saadiyat Grove development this Saturday. First 50 employees get priority booking with special payment plans. Who\'s interested?',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    likes: 234, comments: [], commentCount: 89, shares: 34, timestamp: '8h ago',
    tags: ['Property', 'Exclusive', 'Investment'], type: 'event',
  },
  {
    id: 'p005', communityId: 'purehealth-community',
    author: { name: 'Dr. Hind Al Shamsi', title: 'Medical Director', company: 'PureHealth', avatar: 'HS', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    content: 'I\'d love your input on our new employee wellness programme. We\'re thinking of adding mental health days, meditation rooms, and subsidized therapy sessions. What would make the biggest difference for you? Drop your ideas below.',
    likes: 278, comments: SEED_COMMENTS['p005'] || [], commentCount: 124, shares: 56, timestamp: '1d ago',
    tags: ['Wellness', 'Mental Health', 'Ideas'], type: 'idea',
  },
  {
    id: 'p006', communityId: 'shory-community',
    author: { name: 'Sara Ahmed', title: 'Senior Product Manager', company: 'Shory', avatar: 'SA', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    content: 'Looking for teammates for the upcoming IHC Innovation Hackathon (Apr 18-20). We need 1 designer and 1 data scientist. Our idea: AI-powered insurance risk assessment using satellite imagery. DM me if interested!',
    likes: 98, comments: [], commentCount: 41, shares: 15, timestamp: '1d ago',
    tags: ['Hackathon', 'Team', 'AI'], type: 'help',
  },
  {
    id: 'p007', communityId: 'ihc-community',
    author: { name: 'Omar Al Hashimi', title: 'VP Innovation', company: 'IHC Group', avatar: 'OH', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    content: 'The Innovation Lab results are in: 47 ideas submitted across 12 subsidiaries, 8 selected for incubation, and 3 already generating revenue. The IHC Innovation Fund will be allocating AED 10M for the next cohort. Submit your ideas before May 15!',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    likes: 412, comments: [], commentCount: 78, shares: 92, timestamp: '2d ago', isPinned: true,
    tags: ['Innovation', 'Funding', 'Ideas'], type: 'achievement',
  },
  {
    id: 'p008', communityId: 'ghitha-community',
    author: { name: 'Khalid Mansoor', title: 'Executive Chef', company: 'Ghitha', avatar: 'KM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
    content: 'Our new employee cafeteria menu launches next week! We\'ve added 12 new dishes inspired by cuisines from across the IHC Group family. Come try our Emirati-fusion specials — trust me, the luqaimat cheesecake is going to be your new favourite.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    likes: 203, comments: [], commentCount: 95, shares: 41, timestamp: '3h ago',
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

const POST_TYPE_CONFIG: Record<PostType, { label: string; color: string; icon: typeof MessageCircle }> = {
  discussion: { label: 'Discussion', color: '#9D63F6', icon: MessageCircle },
  achievement: { label: 'Achievement', color: '#FFBD4C', icon: Trophy },
  event: { label: 'Event', color: '#40C4AA', icon: Calendar },
  idea: { label: 'Idea', color: '#54B6ED', icon: Sparkles },
  help: { label: 'Looking for Help', color: '#DF1C41', icon: Users },
};

const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
];

/* ═══════════════════════════════════════════
   STORY CIRCLE COMPONENT
   ═══════════════════════════════════════════ */

function StoryCircle({ community, isActive, hasUnread, onClick }: {
  community: Community; isActive: boolean; hasUnread: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
      <div className="relative">
        <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center"
          style={{ background: hasUnread ? `linear-gradient(135deg, ${community.color}, #9D63F6, #FFBD4C)` : isActive ? community.color : '#DFE1E6', padding: '2.5px' }}>
          <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
            <img src={community.logo} alt="" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>
        {hasUnread && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DF1C41] border-2 border-white flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">{community.channels.reduce((s, ch) => s + ch.unread, 0)}</span>
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
   CREATE POST COMPOSER (Full-screen modal)
   ═══════════════════════════════════════════ */

function CreatePostComposer({ user, communities, onPost, onClose, initialImage }: {
  user: { name: string; avatar: string; company?: string; title?: string };
  communities: Community[];
  onPost: (post: { content: string; communityId: string; type: PostType; image?: string; tags: string[] }) => void;
  onClose: () => void;
  initialImage?: string | null;
}) {
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(communities.find(c => c.isJoined)?.id || communities[0]?.id || '');
  const [postType, setPostType] = useState<PostType>('discussion');
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const joinedCommunities = communities.filter(c => c.isJoined);
  const chosen = communities.find(c => c.id === selectedCommunity);
  const canPost = content.trim().length > 0 && selectedCommunity;

  function handleAddTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  }

  function handlePost() {
    if (!canPost) return;
    setPosting(true);
    setTimeout(() => {
      onPost({ content: content.trim(), communityId: selectedCommunity, type: postType, image: selectedImage || undefined, tags });
      setPosting(false);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col scale-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F1F3]">
        <button onClick={onClose} className="text-[14px] font-medium text-[#666D80]">Cancel</button>
        <p className="text-[15px] font-bold text-[#15161E]">New Post</p>
        <button onClick={handlePost} disabled={!canPost || posting}
          className="px-4 py-1.5 rounded-full text-[13px] font-bold text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ background: canPost ? 'linear-gradient(135deg, #9D63F6, #7C3AED)' : '#DFE1E6' }}>
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Author + Community selector */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-[#9D63F6]/10 flex items-center justify-center">
          <span className="text-[12px] font-bold text-[#9D63F6]">{user.avatar}</span>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-[#15161E]">{user.name}</p>
          <button onClick={() => setShowCommunityPicker(!showCommunityPicker)}
            className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full border border-[#DFE1E6] bg-[#F8F9FB]">
            {chosen && <div className="w-3.5 h-3.5 rounded-full overflow-hidden"><img src={chosen.logo} alt="" className="w-full h-full object-contain" /></div>}
            <span className="text-[10px] font-semibold text-[#666D80]">{chosen?.shortName || 'Select community'}</span>
            <ChevronDown size={10} className="text-[#A4ABB8]" />
          </button>
        </div>
        <button onClick={() => setShowTypePicker(!showTypePicker)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFE1E6]"
          style={{ background: POST_TYPE_CONFIG[postType].color + '10' }}>
          {(() => { const Icon = POST_TYPE_CONFIG[postType].icon; return <Icon size={11} style={{ color: POST_TYPE_CONFIG[postType].color }} />; })()}
          <span className="text-[10px] font-bold" style={{ color: POST_TYPE_CONFIG[postType].color }}>{POST_TYPE_CONFIG[postType].label}</span>
          <ChevronDown size={10} style={{ color: POST_TYPE_CONFIG[postType].color }} />
        </button>
      </div>

      {/* Community picker dropdown */}
      {showCommunityPicker && (
        <div className="mx-4 mb-2 rounded-[14px] border border-[#DFE1E6] bg-white shadow-lg overflow-hidden scale-in">
          {joinedCommunities.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-[12px] text-[#A4ABB8]">Join a community first to post</p>
            </div>
          )}
          {joinedCommunities.map(c => (
            <button key={c.id} onClick={() => { setSelectedCommunity(c.id); setShowCommunityPicker(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F9FB] transition-colors"
              style={{ background: selectedCommunity === c.id ? c.color + '08' : undefined }}>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DFE1E6]"><img src={c.logo} alt="" className="w-full h-full object-contain" /></div>
              <div className="flex-1 text-left">
                <p className="text-[12px] font-semibold text-[#15161E]">{c.name}</p>
                <p className="text-[9px] text-[#A4ABB8]">{c.members.toLocaleString()} members</p>
              </div>
              {selectedCommunity === c.id && <CheckCircle2 size={16} style={{ color: c.color }} />}
            </button>
          ))}
        </div>
      )}

      {/* Type picker dropdown */}
      {showTypePicker && (
        <div className="mx-4 mb-2 rounded-[14px] border border-[#DFE1E6] bg-white shadow-lg overflow-hidden scale-in">
          {(Object.entries(POST_TYPE_CONFIG) as [PostType, typeof POST_TYPE_CONFIG['discussion']][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button key={key} onClick={() => { setPostType(key); setShowTypePicker(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F9FB] transition-colors"
                style={{ background: postType === key ? cfg.color + '08' : undefined }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: cfg.color + '15' }}>
                  <Icon size={14} style={{ color: cfg.color }} />
                </div>
                <span className="text-[12px] font-semibold text-[#15161E]">{cfg.label}</span>
                {postType === key && <CheckCircle2 size={14} className="ml-auto" style={{ color: cfg.color }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* Text area */}
      <div className="flex-1 px-4 overflow-y-auto">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind? Share an update, idea, or question..."
          className="w-full h-32 bg-transparent text-[15px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none resize-none leading-relaxed"
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[11px] font-semibold text-[#9D63F6] bg-[#9D63F6]/10 px-2 py-0.5 rounded-full">
                #{tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))}><X size={10} className="text-[#9D63F6]/60" /></button>
              </span>
            ))}
          </div>
        )}

        {/* Selected image preview */}
        {selectedImage && (
          <div className="relative rounded-[14px] overflow-hidden mb-3">
            <img src={selectedImage} alt="" className="w-full aspect-[16/9] object-cover" />
            <button onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <X size={14} className="text-white" />
            </button>
          </div>
        )}

        {/* Image picker */}
        {showImagePicker && (
          <div className="rounded-[14px] border border-[#DFE1E6] p-3 mb-3 scale-in">
            <p className="text-[11px] font-semibold text-[#666D80] mb-2">Choose a cover image</p>
            <div className="grid grid-cols-3 gap-2">
              {STOCK_IMAGES.map((img, i) => (
                <button key={i} onClick={() => { setSelectedImage(img); setShowImagePicker(false); }}
                  className="rounded-[10px] overflow-hidden aspect-square active:scale-95 transition-all border-2"
                  style={{ borderColor: selectedImage === img ? '#9D63F6' : 'transparent' }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-[#F0F1F3] px-4 py-3">
        {/* Tag input */}
        <div className="flex items-center gap-2 mb-3">
          <Hash size={14} className="text-[#A4ABB8]" />
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
            placeholder={tags.length < 5 ? 'Add a tag (press Enter)' : 'Max 5 tags'}
            disabled={tags.length >= 5}
            className="flex-1 bg-transparent text-[12px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none"
          />
          {tagInput.trim() && (
            <button onClick={handleAddTag} className="text-[11px] font-bold text-[#9D63F6]">Add</button>
          )}
        </div>
        {/* Hidden file input for image upload inside composer */}
        <input
          ref={composerFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setSelectedImage(reader.result as string);
              reader.readAsDataURL(file);
            }
            e.target.value = '';
          }}
        />
        <div className="flex items-center gap-1">
          <button onClick={() => composerFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all"
            style={{ touchAction: 'manipulation' }}>
            <Camera size={16} className="text-[#9D63F6]" />
            <span className="text-[11px] font-semibold text-[#666D80]">Camera</span>
          </button>
          <button onClick={() => setShowImagePicker(!showImagePicker)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all"
            style={{ touchAction: 'manipulation' }}>
            <ImageIcon size={16} className="text-[#40C4AA]" />
            <span className="text-[11px] font-semibold text-[#666D80]">Gallery</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F8F9FB] border border-[#DFE1E6]"
            style={{ touchAction: 'manipulation' }}>
            <AtSign size={16} className="text-[#54B6ED]" />
            <span className="text-[11px] font-semibold text-[#666D80]">Mention</span>
          </button>
          <div className="ml-auto text-[10px] text-[#A4ABB8]">{content.length}/2000</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMENT SHEET (Bottom sheet)
   ═══════════════════════════════════════════ */

function CommentSheet({ post, user, onClose, onAddComment }: {
  post: Post;
  user: { name: string; avatar: string };
  onClose: () => void;
  onAddComment: (postId: string, content: string) => void;
}) {
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
    /* Lock background scroll while comments are open */
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleSend() {
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ touchAction: 'none' }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[75vh] flex flex-col scale-in" style={{ touchAction: 'pan-y' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F1F3]">
          <div>
            <p className="text-[14px] font-bold text-[#15161E]">Comments</p>
            <p className="text-[10px] text-[#A4ABB8]">{post.commentCount + post.comments.length} total</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center">
            <X size={16} className="text-[#666D80]" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {post.comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-[#DFE1E6] mx-auto mb-2" />
              <p className="text-[13px] font-semibold text-[#A4ABB8]">No comments yet</p>
              <p className="text-[11px] text-[#D1D5DB]">Be the first to share your thoughts!</p>
            </div>
          )}
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-2.5 fade-up">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                {comment.author.image
                  ? <img src={comment.author.image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-[#9D63F6]/10 flex items-center justify-center"><span className="text-[9px] font-bold text-[#9D63F6]">{comment.author.avatar}</span></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-[#F8F9FB] rounded-[14px] rounded-tl-[4px] px-3 py-2">
                  <p className="text-[12px] font-bold text-[#15161E]">{comment.author.name}</p>
                  <p className="text-[12px] text-[#353849] leading-relaxed mt-0.5">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                  <span className="text-[9px] text-[#A4ABB8]">{comment.timestamp}</span>
                  <button onClick={() => {
                    setLikedComments(prev => { const n = new Set(prev); if (n.has(comment.id)) n.delete(comment.id); else n.add(comment.id); return n; });
                  }} className="text-[9px] font-bold" style={{ color: likedComments.has(comment.id) ? '#DF1C41' : '#A4ABB8' }}>
                    {comment.likes + (likedComments.has(comment.id) ? 1 : 0)} likes
                  </button>
                  <button className="text-[9px] font-bold text-[#A4ABB8]">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-[#F0F1F3] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#9D63F6]/10 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-[#9D63F6]">{user.avatar}</span>
          </div>
          <div className="flex-1 flex items-center bg-[#F8F9FB] border border-[#DFE1E6] rounded-full px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-[13px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none"
            />
            <button onClick={() => setNewComment(prev => prev + ' 👍')} className="mx-1">
              <Smile size={18} className="text-[#A4ABB8]" />
            </button>
          </div>
          <button onClick={handleSend} disabled={!newComment.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
            style={{ background: newComment.trim() ? 'linear-gradient(135deg, #9D63F6, #7C3AED)' : '#DFE1E6' }}>
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARE SHEET
   ═══════════════════════════════════════════ */

function ShareSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareOptions = [
    { icon: Copy, label: copied ? 'Copied!' : 'Copy link', color: '#9D63F6', action: handleCopy },
    { icon: Send, label: 'Send in chat', color: '#54B6ED', action: onClose },
    { icon: MessageSquare, label: 'Share to community', color: '#40C4AA', action: onClose },
    { icon: Bookmark, label: 'Save to collection', color: '#FFBD4C', action: onClose },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] scale-in pb-8">
        <div className="w-10 h-1 bg-[#DFE1E6] rounded-full mx-auto mt-3 mb-2" />
        <div className="flex items-center justify-between px-4 mb-3">
          <p className="text-[15px] font-bold text-[#15161E]">Share Post</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center">
            <X size={16} className="text-[#666D80]" />
          </button>
        </div>
        <div className="px-4 space-y-1">
          {shareOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <button key={opt.label} onClick={opt.action}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] hover:bg-[#F8F9FB] active:scale-[0.98] transition-all">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: opt.color + '15' }}>
                  <Icon size={18} style={{ color: opt.color }} />
                </div>
                <span className="text-[13px] font-semibold text-[#15161E]">{opt.label}</span>
                {opt.label === 'Copied!' && <Check size={16} className="ml-auto text-[#40C4AA]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   POST CARD
   ═══════════════════════════════════════════ */

function FeedPostCard({ post, community, onLike, onComment, onShare, onDelete, onToggleSave, isOwn, isSaved }: {
  post: Post; community?: Community;
  onLike: (id: string) => void; onComment: (id: string) => void; onShare: (id: string) => void;
  onDelete?: (id: string) => void; onToggleSave?: (id: string) => void; isOwn?: boolean; isSaved?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const saved = isSaved ?? false;
  const [showHeart, setShowHeart] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;

  const handleDoubleTap = () => {
    if (!liked) { setLiked(true); onLike(post.id); }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const contentTruncated = post.content.length > 120;
  const displayContent = expanded ? post.content : post.content.slice(0, 120);

  return (
    <div className="bg-white slide-up relative">
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full overflow-hidden"
          style={{ boxShadow: `0 0 0 2px ${community?.color || '#9D63F6'}, 0 0 0 3.5px white` }}>
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
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50">
            <MoreHorizontal size={18} className="text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div className="absolute right-4 top-14 z-20 bg-white rounded-[12px] border border-[#DFE1E6] shadow-lg overflow-hidden scale-in w-44">
          <button onClick={() => { onToggleSave?.(post.id); setShowMenu(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#F8F9FB] text-left">
            <Bookmark size={14} className="text-[#666D80]" />
            <span className="text-[12px] text-[#15161E]">{saved ? 'Unsave' : 'Save post'}</span>
          </button>
          <button onClick={() => { onShare(post.id); setShowMenu(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#F8F9FB] text-left">
            <Share2 size={14} className="text-[#666D80]" />
            <span className="text-[12px] text-[#15161E]">Share</span>
          </button>
          {isOwn && onDelete && (
            <button onClick={() => { onDelete(post.id); setShowMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#FEF2F2] text-left border-t border-[#F0F1F3]">
              <Trash2 size={14} className="text-[#DF1C41]" />
              <span className="text-[12px] text-[#DF1C41]">Delete post</span>
            </button>
          )}
        </div>
      )}

      {/* Post image */}
      {post.image && (
        <div className="relative w-full" onDoubleClick={handleDoubleTap}>
          <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart size={80} fill="white" className="text-white double-tap-heart drop-shadow-lg" />
            </div>
          )}
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
          <button onClick={() => { setLiked(!liked); if (!liked) onLike(post.id); }}
            className={`transition-transform ${liked ? 'heart-pop' : ''}`}>
            <Heart size={24} strokeWidth={1.8} fill={liked ? '#DF1C41' : 'none'} style={{ color: liked ? '#DF1C41' : '#15161E' }} />
          </button>
          <button onClick={() => onComment(post.id)}>
            <MessageCircle size={24} strokeWidth={1.8} className="text-[#15161E]" />
          </button>
          <button onClick={() => onShare(post.id)}>
            <Send size={22} strokeWidth={1.8} className="text-[#15161E]" />
          </button>
        </div>
        <button onClick={() => onToggleSave?.(post.id)}>
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
        {post.tags && post.tags.length > 0 && (expanded || !contentTruncated) && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {post.tags.map(tag => (
              <span key={tag} className="text-[12px] font-medium text-[#9D63F6]">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Comments preview */}
      {(post.commentCount > 0 || post.comments.length > 0) && (
        <button onClick={() => onComment(post.id)} className="px-4 pb-1">
          <span className="text-[12px] text-[#A4ABB8]">
            {post.comments.length > 0
              ? `View all ${post.commentCount + post.comments.length} comments`
              : `View all ${post.commentCount} comments`}
          </span>
        </button>
      )}

      {/* Latest comment preview */}
      {post.comments.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-[12px] text-[#15161E]">
            <span className="font-bold">{post.comments[post.comments.length - 1].author.name.split(' ')[0].toLowerCase()}</span>{' '}
            {post.comments[post.comments.length - 1].content.slice(0, 60)}
            {post.comments[post.comments.length - 1].content.length > 60 ? '...' : ''}
          </p>
        </div>
      )}

      {/* No-image pinned badge */}
      {!post.image && post.isPinned && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#9D63F6]">
            <Pin size={10} /> Pinned
          </div>
        </div>
      )}

      <div className="h-[1px] bg-[#F0F1F3] mx-4 mb-0" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY DETAIL SHEET
   ═══════════════════════════════════════════ */

function CommunitySheet({ community, posts, onClose, onJoin, onLike, onComment, onShare, onToggleSave, savedPostIds }: {
  community: Community; posts: Post[]; onClose: () => void;
  onJoin: (id: string) => void; onLike: (id: string) => void; onComment: (id: string) => void; onShare: (id: string) => void;
  onToggleSave?: (id: string) => void; savedPostIds?: Set<string>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] max-h-[90vh] overflow-y-auto scale-in">
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
        <div className="p-4 border-b border-[#F0F1F3]">
          <p className="text-[12px] text-[#666D80] leading-relaxed mb-3">{community.description}</p>
          <div className="flex gap-2">
            <button onClick={() => onJoin(community.id)}
              className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
              style={{ background: community.isJoined ? '#F8F9FB' : community.color, color: community.isJoined ? '#666D80' : '#FFFFFF', border: community.isJoined ? '1px solid #DFE1E6' : 'none' }}>
              {community.isJoined ? <><CheckCircle2 size={14} /> Joined</> : <><UserPlus size={14} /> Join Community</>}
            </button>
          </div>
          <div className="flex gap-1.5 mt-3">
            {community.tags.map(tag => (
              <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: community.color + '12', color: community.color }}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="pb-8">
          {posts.length > 0 ? posts.map(post => (
            <FeedPostCard key={post.id} post={post} community={community} onLike={onLike} onComment={onComment} onShare={onShare} onToggleSave={onToggleSave} isSaved={savedPostIds?.has(post.id)} />
          )) : (
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
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [filterCommunity, setFilterCommunity] = useState<string | null>(null);
  const [postLikes, setPostLikes] = useState<Set<string>>(new Set());
  const [rewardToast, setRewardToast] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composerInitialImage, setComposerInitialImage] = useState<string | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const feedFileInputRef = useRef<HTMLInputElement>(null);

  useBodyScrollLock(!!selectedCommunity || showComposer || !!commentingPostId || !!sharingPostId);

  if (!user) return null;

  // After null guard, user is guaranteed non-null — alias for closures
  const currentUser = user;

  const allPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const filteredPosts = filterCommunity === 'saved'
    ? allPosts.filter(p => savedPostIds.has(p.id))
    : filterCommunity ? allPosts.filter(p => p.communityId === filterCommunity)
    : allPosts;
  const commentingPost = commentingPostId ? posts.find(p => p.id === commentingPostId) : null;
  const sharingPost = sharingPostId ? posts.find(p => p.id === sharingPostId) : null;

  function showToast(msg: string) {
    setRewardToast(msg);
    setTimeout(() => setRewardToast(null), 3000);
  }

  function handleJoin(communityId: string) {
    setCommunities(prev => prev.map(c =>
      c.id === communityId ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c
    ));
    const community = communities.find(c => c.id === communityId);
    if (community && !community.isJoined) {
      wallet.addRewardPoints(50, `Joined ${community.name}`, 'engagement');
      showToast('+50 points for joining!');
    }
    setSelectedCommunity(prev => {
      if (prev && prev.id === communityId) return { ...prev, isJoined: !prev.isJoined, members: prev.isJoined ? prev.members - 1 : prev.members + 1 };
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
    setCommentingPostId(postId);
  }

  function handleShare(postId: string) {
    setSharingPostId(postId);
  }

  function handleAddComment(postId: string, content: string) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const newComment: Comment = {
        id: `c_${Date.now()}`,
        postId,
        author: { name: currentUser.name, avatar: currentUser.avatar || currentUser.name.split(' ').map(w => w[0]).join('') },
        content,
        timestamp: 'Just now',
        likes: 0,
      };
      return { ...p, comments: [...p.comments, newComment] };
    }));
    wallet.addRewardPoints(10, 'Commented on a post', 'engagement');
    showToast('+10 points for engaging!');
  }

  function handleCreatePost(data: { content: string; communityId: string; type: PostType; image?: string; tags: string[] }) {
    const newPost: Post = {
      id: `p_${Date.now()}`,
      communityId: data.communityId,
      author: {
        name: currentUser.name,
        title: currentUser.title || 'Employee',
        company: currentUser.company || 'IHC Group',
        avatar: currentUser.avatar || currentUser.name.split(' ').map(w => w[0]).join(''),
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
      },
      content: data.content,
      image: data.image,
      likes: 0,
      comments: [],
      commentCount: 0,
      shares: 0,
      timestamp: 'Just now',
      tags: data.tags.length > 0 ? data.tags : undefined,
      type: data.type,
    };
    setPosts(prev => [newPost, ...prev]);
    setShowComposer(false);
    setFilterCommunity(null);
    wallet.addRewardPoints(25, 'Created a community post', 'engagement');
    setPostSuccess(true);
    showToast('+25 points for posting!');
    setTimeout(() => setPostSuccess(false), 3000);
  }

  function handleDeletePost(postId: string) {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setSavedPostIds(prev => { const next = new Set(prev); next.delete(postId); return next; });
    showToast('Post deleted');
  }

  function handleToggleSave(postId: string) {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        showToast('Post removed from saved');
      } else {
        next.add(postId);
        showToast('Post saved');
      }
      return next;
    });
  }

  const communityPosts = selectedCommunity ? posts.filter(p => p.communityId === selectedCommunity.id) : [];

  return (
    <AppShell title="Community" subtitle="">
      {/* Reward toast */}
      {rewardToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full bg-[#15161E] text-white text-[12px] font-bold flex items-center gap-2 shadow-lg scale-in">
          <Star size={14} className="text-[#FFBD4C]" />
          {rewardToast}
        </div>
      )}

      {/* Post success banner */}
      {postSuccess && (
        <div className="mb-3 rounded-[14px] p-3 flex items-center gap-3 scale-in" style={{ background: 'linear-gradient(135deg, #40C4AA15, #059669 15)' }}>
          <CheckCircle2 size={20} className="text-[#40C4AA] shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-[#15161E]">Post published!</p>
            <p className="text-[10px] text-[#666D80]">Your post is now live in the community feed</p>
          </div>
        </div>
      )}

      {/* Stories row */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-1 px-1">
        <button onClick={() => setFilterCommunity(null)} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
          <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center" style={{ background: !filterCommunity ? '#9D63F6' : '#DFE1E6', padding: '2.5px' }}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Globe size={22} style={{ color: !filterCommunity ? '#9D63F6' : '#A4ABB8' }} />
            </div>
          </div>
          <span className={`text-[10px] leading-tight ${!filterCommunity ? 'font-bold text-[#15161E]' : 'font-medium text-[#666D80]'}`}>All</span>
        </button>

        <button onClick={() => setFilterCommunity('saved')} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
          <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center" style={{ background: filterCommunity === 'saved' ? '#15161E' : '#DFE1E6', padding: '2.5px' }}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative">
              <Bookmark size={22} style={{ color: filterCommunity === 'saved' ? '#15161E' : '#A4ABB8' }} />
              {savedPostIds.size > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#9D63F6] text-white text-[8px] font-bold flex items-center justify-center">{savedPostIds.size > 9 ? '9+' : savedPostIds.size}</span>
              )}
            </div>
          </div>
          <span className={`text-[10px] leading-tight ${filterCommunity === 'saved' ? 'font-bold text-[#15161E]' : 'font-medium text-[#666D80]'}`}>Saved</span>
        </button>

        {communities.map(c => (
          <StoryCircle key={c.id} community={c} isActive={filterCommunity === c.id}
            hasUnread={c.isJoined && c.channels.reduce((s, ch) => s + ch.unread, 0) > 0}
            onClick={() => { if (filterCommunity === c.id) setSelectedCommunity(c); else setFilterCommunity(c.id); }} />
        ))}

        <button onClick={() => setFilterCommunity('discover')} className="shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
          <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center border-2 border-dashed border-[#9D63F6]/40 bg-[#9D63F6]/5">
            <Plus size={22} className="text-[#9D63F6]" />
          </div>
          <span className="text-[10px] font-medium text-[#9D63F6] leading-tight">Discover</span>
        </button>
      </div>

      <div className="h-[1px] bg-[#F0F1F3] -mx-4 mb-4" />

      {/* SAVED VIEW EMPTY STATE — handled inline via filteredPosts */}

      {/* DISCOVER VIEW */}
      {filterCommunity === 'discover' ? (
        <div className="space-y-4 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#9D63F6]" />
            <p className="text-[14px] font-bold text-[#15161E]">Discover Communities</p>
          </div>
          {communities.map(c => (
            <button key={c.id} onClick={() => setSelectedCommunity(c)}
              className="w-full text-left rounded-[18px] overflow-hidden border border-[#DFE1E6] bg-white active:scale-[0.98] transition-all slide-up">
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
                  {c.isJoined && <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">Joined</span>}
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
        /* FEED VIEW */
        <div className="space-y-0 -mx-4">
          {/* Create post bar */}
          {/* Hidden file input for camera/image upload */}
          <input
            ref={feedFileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setComposerInitialImage(reader.result as string);
                  setShowComposer(true);
                };
                reader.readAsDataURL(file);
              }
              e.target.value = '';
            }}
          />
          <div className="w-full flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F0F1F3]">
            <div className="w-9 h-9 rounded-full bg-[#9D63F6]/10 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-[#9D63F6]">{currentUser.avatar || currentUser.name?.split(' ').map(w => w[0]).join('')}</span>
            </div>
            <button
              onClick={() => { setComposerInitialImage(null); setShowComposer(true); }}
              className="flex-1 py-2 px-3.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] text-left active:bg-[#F0F1F3] transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <p className="text-[12px] text-[#A4ABB8]">What&apos;s happening in your community?</p>
            </button>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => { setComposerInitialImage(null); setShowComposer(true); }}
                className="w-10 h-10 rounded-full bg-[#40C4AA]/10 flex items-center justify-center active:scale-90 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <ImageIcon size={16} className="text-[#40C4AA]" />
              </button>
              <button
                onClick={() => feedFileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-[#9D63F6]/10 flex items-center justify-center active:scale-90 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <Camera size={16} className="text-[#9D63F6]" />
              </button>
            </div>
          </div>

          {/* Top Contributors */}
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
            filteredPosts.map(post => {
              const community = communities.find(c => c.id === post.communityId);
              const isOwn = post.author.name === currentUser.name;
              return (
                <FeedPostCard key={post.id} post={post} community={community}
                  onLike={handleLike} onComment={handleComment} onShare={handleShare}
                  onDelete={handleDeletePost} onToggleSave={handleToggleSave}
                  isOwn={isOwn} isSaved={savedPostIds.has(post.id)} />
              );
            })
          ) : filterCommunity === 'saved' ? (
            <div className="text-center py-16 px-4">
              <Bookmark size={40} className="text-[#DFE1E6] mx-auto mb-3" />
              <p className="text-[15px] font-bold text-[#15161E] mb-1">No saved posts</p>
              <p className="text-[12px] text-[#A4ABB8] mb-4">Bookmark posts to find them here later</p>
              <button onClick={() => setFilterCommunity(null)}
                className="px-5 py-2.5 rounded-full text-[13px] font-bold text-white active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)' }}>
                Browse Feed
              </button>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <MessageCircle size={40} className="text-[#DFE1E6] mx-auto mb-3" />
              <p className="text-[15px] font-bold text-[#15161E] mb-1">No posts yet</p>
              <p className="text-[12px] text-[#A4ABB8] mb-4">Be the first to share something!</p>
              <button onClick={() => setShowComposer(true)}
                className="px-5 py-2.5 rounded-full text-[13px] font-bold text-white active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)' }}>
                Create a Post
              </button>
            </div>
          )}

          {/* End of feed */}
          {filteredPosts.length > 0 && (
            <div className="py-8 text-center bg-white">
              <CheckCircle2 size={32} className="text-[#DFE1E6] mx-auto mb-2" />
              <p className="text-[12px] font-semibold text-[#A4ABB8]">You&apos;re all caught up</p>
              <p className="text-[10px] text-[#D1D5DB]">You&apos;ve seen all recent posts</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Create Post Button */}
      {filterCommunity !== 'discover' && !showComposer && (
        <button onClick={() => setShowComposer(true)}
          className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all hide-on-keyboard"
          style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)', boxShadow: '0 6px 24px rgba(124,58,237,0.4)' }}>
          <Plus size={24} className="text-white" />
        </button>
      )}

      {/* Modals */}
      {showComposer && (
        <CreatePostComposer user={{ name: currentUser.name, avatar: currentUser.avatar || currentUser.name.split(' ').map(w => w[0]).join(''), company: currentUser.company, title: currentUser.title }}
          communities={communities} onPost={handleCreatePost} onClose={() => { setShowComposer(false); setComposerInitialImage(null); }}
          initialImage={composerInitialImage} />
      )}

      {commentingPost && (
        <CommentSheet post={commentingPost} user={{ name: currentUser.name, avatar: currentUser.avatar || currentUser.name.split(' ').map(w => w[0]).join('') }}
          onClose={() => setCommentingPostId(null)} onAddComment={handleAddComment} />
      )}

      {sharingPost && <ShareSheet post={sharingPost} onClose={() => setSharingPostId(null)} />}

      {selectedCommunity && (
        <CommunitySheet community={selectedCommunity} posts={communityPosts}
          onClose={() => setSelectedCommunity(null)} onJoin={handleJoin}
          onLike={handleLike} onComment={handleComment} onShare={handleShare}
          onToggleSave={handleToggleSave} savedPostIds={savedPostIds} />
      )}
    </AppShell>
  );
}
