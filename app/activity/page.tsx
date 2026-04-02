'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  LogIn,
  FileText,
  ShoppingCart,
  MessageSquare,
  User,
  Gift,
  Sparkles,
  Download
} from 'lucide-react';

interface ActivityEntry {
  id: string;
  action: string;
  category: 'login' | 'service' | 'marketplace' | 'chat' | 'profile' | 'offer' | 'ai';
  timestamp: Date;
  details?: string;
}

// Generate mock activity data for the last 7 days
const generateMockActivity = (): ActivityEntry[] => {
  const now = new Date(2026, 3, 1, 15, 30); // April 1, 2026
  const activities: ActivityEntry[] = [
    {
      id: '1',
      action: 'Logged in from iPhone 15 Pro, Abu Dhabi',
      category: 'login',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      details: 'iOS device'
    },
    {
      id: '2',
      action: 'Used AI Listing Assistant',
      category: 'ai',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      details: 'Generated marketplace listing'
    },
    {
      id: '3',
      action: 'Listed "Toyota Land Cruiser 2022" on marketplace',
      category: 'marketplace',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      details: 'Premium vehicle listing'
    },
    {
      id: '4',
      action: 'Sent message to Khalid Al Mansouri',
      category: 'chat',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      details: 'Private message'
    },
    {
      id: '5',
      action: 'Updated profile information',
      category: 'profile',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      details: 'Personal details updated'
    },
    // Yesterday
    {
      id: '6',
      action: 'Requested Salary Certificate',
      category: 'service',
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000), // yesterday afternoon
      details: 'Document request submitted'
    },
    {
      id: '7',
      action: 'Viewed 3 marketplace listings',
      category: 'marketplace',
      timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      details: 'Real estate properties'
    },
    {
      id: '8',
      action: 'Claimed "Aldar Employee Housing" offer',
      category: 'offer',
      timestamp: new Date(now.getTime() - 22 * 60 * 60 * 1000),
      details: 'Housing benefit claimed'
    },
    {
      id: '9',
      action: 'Used AI HR Assistant',
      category: 'ai',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      details: 'Generated HR query response'
    },
    {
      id: '10',
      action: 'Submitted IT Support ticket',
      category: 'service',
      timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000),
      details: 'Technical support requested'
    },
    // March 30
    {
      id: '11',
      action: 'Changed notification preferences',
      category: 'profile',
      timestamp: new Date(now.getTime() - 32 * 60 * 60 * 1000),
      details: 'Push notifications disabled'
    },
    {
      id: '12',
      action: 'Logged in from MacBook Pro, Dubai',
      category: 'login',
      timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000),
      details: 'Desktop device'
    },
    {
      id: '13',
      action: 'Used voice input for marketplace listing',
      category: 'ai',
      timestamp: new Date(now.getTime() - 40 * 60 * 60 * 1000),
      details: 'Voice-to-text for listing'
    },
    {
      id: '14',
      action: 'Viewed marketplace category: Electronics',
      category: 'marketplace',
      timestamp: new Date(now.getTime() - 44 * 60 * 60 * 1000),
      details: 'Browsed 5 listings'
    },
    {
      id: '15',
      action: 'Sent message to Sarah Johnson',
      category: 'chat',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      details: 'Work discussion'
    },
    // March 29
    {
      id: '16',
      action: 'Requested Leave Approval',
      category: 'service',
      timestamp: new Date(now.getTime() - 60 * 60 * 60 * 1000),
      details: 'Annual leave request'
    },
    {
      id: '17',
      action: 'Logged in from iPhone 15 Pro, Dubai',
      category: 'login',
      timestamp: new Date(now.getTime() - 68 * 60 * 60 * 1000),
      details: 'Mobile device'
    },
    {
      id: '18',
      action: 'Claimed "Emirates Airline Miles" offer',
      category: 'offer',
      timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      details: 'Travel miles claimed'
    },
    {
      id: '19',
      action: 'Updated professional summary',
      category: 'profile',
      timestamp: new Date(now.getTime() - 84 * 60 * 60 * 1000),
      details: 'Bio section edited'
    },
    {
      id: '20',
      action: 'Sent message to Team Leadership',
      category: 'chat',
      timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000),
      details: 'Group message'
    },
  ];

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const CATEGORY_CONFIG = {
  login: { label: 'Login', color: '#9D63F6', icon: LogIn, bg: '#F7F1FF' },
  service: { label: 'Services', color: '#059669', icon: FileText, bg: '#D1FAE5' },
  marketplace: { label: 'Marketplace', color: '#D97706', icon: ShoppingCart, bg: '#FEF3C7' },
  chat: { label: 'Chat', color: '#7C3AED', icon: MessageSquare, bg: '#EDE9FE' },
  profile: { label: 'Profile', color: '#2563EB', icon: User, bg: '#DBEAFE' },
  offer: { label: 'Offers', color: '#DC2626', icon: Gift, bg: '#FEE2E2' },
  ai: { label: 'AI', color: '#8B5CF6', icon: Sparkles, bg: '#F3E8FF' },
};

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'login', label: 'Login' },
  { value: 'service', label: 'Services' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'chat', label: 'Chat' },
  { value: 'profile', label: 'Profile' },
  { value: 'offer', label: 'Offers' },
  { value: 'ai', label: 'AI' },
];

const getRelativeTime = (date: Date): string => {
  const now = new Date(2026, 3, 1, 15, 30);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDateGroup = (date: Date): string => {
  const now = new Date(2026, 3, 1, 15, 30);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const groupActivitiesByDate = (activities: ActivityEntry[]): Record<string, ActivityEntry[]> => {
  const grouped: Record<string, ActivityEntry[]> = {};

  activities.forEach(activity => {
    const dateGroup = getDateGroup(activity.timestamp);
    if (!grouped[dateGroup]) {
      grouped[dateGroup] = [];
    }
    grouped[dateGroup].push(activity);
  });

  return grouped;
};

export default function ActivityPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const allActivities = generateMockActivity();

  const filtered = allActivities.filter(a =>
    selectedCategory === 'all' || a.category === selectedCategory
  );

  const grouped = groupActivitiesByDate(filtered);
  const dateGroups = Object.keys(grouped);

  const handleExportLog = () => {
    // Toast-like notification
    const toast = document.createElement('div');
    toast.textContent = 'Activity log exported successfully';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #9D63F6;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 50;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <AppShell title="Activity Log" subtitle="Your complete audit trail and account history">
      <div className="space-y-6">
        {/* Header with export button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#A4ABB8] font-medium">
              {filtered.length} activity {filtered.length !== 1 ? 'entries' : 'entry'} available
            </p>
          </div>
          <button
            onClick={handleExportLog}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#9D63F6] text-white rounded-[12px] text-sm font-semibold hover:bg-[#152a52] transition-all active:scale-[0.98]"
          >
            <Download size={16} />
            Export Log
          </button>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelectedCategory(opt.value)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all ${
                selectedCategory === opt.value
                  ? 'bg-[#9D63F6] text-white'
                  : 'bg-white border border-[#DFE1E6] text-[#666D80] hover:bg-[#F8F9FB]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Activity entries grouped by date */}
        <div className="space-y-6">
          {dateGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#A4ABB8]">No activities found</p>
            </div>
          ) : (
            dateGroups.map(dateGroup => (
              <div key={dateGroup}>
                {/* Date separator */}
                <h3 className="text-xs font-bold text-[#15161E] uppercase tracking-wider mb-3 px-1">
                  {dateGroup}
                </h3>

                {/* Activities for this date */}
                <div className="space-y-2">
                  {grouped[dateGroup].map(activity => {
                    const config = CATEGORY_CONFIG[activity.category];
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={activity.id}
                        className="bg-white rounded-[18px] border border-[#DFE1E6] p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon container */}
                          <div
                            className="flex items-center justify-center rounded-[12px] flex-shrink-0 w-10 h-10"
                            style={{ backgroundColor: config.bg }}
                          >
                            <IconComponent
                              size={20}
                              style={{ color: config.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-semibold text-[#15161E]">
                                {activity.action}
                              </p>
                              <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                                style={{ backgroundColor: config.bg, color: config.color }}
                              >
                                {config.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              {activity.details && (
                                <p className="text-xs text-[#A4ABB8]">
                                  {activity.details}
                                </p>
                              )}
                              <p className="text-xs text-[#A4ABB8] font-medium">
                                {getRelativeTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </AppShell>
  );
}
