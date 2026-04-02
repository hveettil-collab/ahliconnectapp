'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  Tag,
  ShoppingBag,
  Users,
  Wrench,
} from 'lucide-react';
import {
  IHC_ANNOUNCEMENTS,
  COMPANY_ANNOUNCEMENTS,
  OFFERS,
  MARKETPLACE_LISTINGS,
  SERVICES,
  COLLEAGUES,
} from '@/lib/mockData';

interface SearchResult {
  id: string;
  title: string;
  category: 'announcements' | 'offers' | 'marketplace' | 'services' | 'people';
  description?: string;
  icon?: React.ReactNode;
}

interface AISuggestion {
  title: string;
  description: string;
  action: string;
  related: SearchResult[];
}

const CATEGORY_ICONS = {
  announcements: <FileText size={18} />,
  offers: <Tag size={18} />,
  marketplace: <ShoppingBag size={18} />,
  services: <Wrench size={18} />,
  people: <Users size={18} />,
};

const CATEGORY_LABELS = {
  announcements: 'Announcements',
  offers: 'Offers',
  marketplace: 'Marketplace',
  services: 'Services',
  people: 'People',
};

const CATEGORY_COLORS = {
  announcements: 'bg-blue-50',
  offers: 'bg-purple-50',
  marketplace: 'bg-amber-50',
  services: 'bg-green-50',
  people: 'bg-pink-50',
};

export default function SmartSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // This would typically toggle the search - handled by parent
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Get AI suggestions based on query
  const getAISuggestion = useCallback((searchQuery: string): AISuggestion | null => {
    const query_lower = searchQuery.toLowerCase();

    // Leave/Vacation/Time off
    if (query_lower.match(/leave|vacation|time off|days off|holiday/)) {
      const leaveService = SERVICES.find((s) =>
        s.title.toLowerCase().includes('leave')
      );
      return {
        title: 'Leave Portal',
        description:
          'Submit and manage your leave requests quickly. Check your remaining days and get approvals instantly.',
        action: 'Access Leave Portal',
        related: leaveService ? [{ id: leaveService.id, title: leaveService.title, category: 'services' as const, description: leaveService.description }] : [],
      };
    }

    // Car/Vehicle
    if (query_lower.match(/car|vehicle|automobile|transport|driving/)) {
      const vehicles = MARKETPLACE_LISTINGS.filter(
        (item) =>
          item.title.toLowerCase().includes('car') ||
          item.description.toLowerCase().includes('car')
      );
      const shoryOffer = OFFERS.find((o) =>
        o.title.toLowerCase().includes('shory')
      );
      return {
        title: 'Vehicle Search',
        description:
          'Browse available cars in the marketplace or check out Shory offers for special discounts.',
        action: 'Browse Vehicles',
        related: [...vehicles.slice(0, 2).map(v => ({ id: v.id, title: v.title, category: 'marketplace' as const, description: v.description })), ...(shoryOffer ? [{ id: shoryOffer.id, title: shoryOffer.title, category: 'offers' as const, description: shoryOffer.description }] : [])],
      };
    }

    // Salary/Certificate
    if (query_lower.match(/salary|certificate|letter|wage|compensation/)) {
      const salaryService = SERVICES.find((s) =>
        s.title.toLowerCase().includes('salary')
      );
      return {
        title: 'Salary Certificate',
        description:
          'Generate and download your salary certificate or work letter instantly.',
        action: 'Get Certificate',
        related: salaryService ? [{ id: salaryService.id, title: salaryService.title, category: 'services' as const, description: salaryService.description }] : [],
      };
    }

    // Health/Medical/Insurance
    if (query_lower.match(/health|medical|insurance|wellness|doctor|hospital/)) {
      const pureHealthOffers = OFFERS.filter((o) =>
        o.title.toLowerCase().includes('purehealth')
      );
      const healthService = SERVICES.find((s) =>
        s.title.toLowerCase().includes('health')
      );
      return {
        title: 'Healthcare & Wellness',
        description:
          'Access PureHealth benefits and comprehensive health insurance coverage for you and your family.',
        action: 'View Health Options',
        related: [...pureHealthOffers.slice(0, 1).map(o => ({ id: o.id, title: o.title, category: 'offers' as const, description: o.description })), ...(healthService ? [{ id: healthService.id, title: healthService.title, category: 'services' as const, description: healthService.description }] : [])],
      };
    }

    // Property/Apartment/Rent
    if (query_lower.match(/apartment|property|rent|housing|home|real estate/)) {
      const properties = MARKETPLACE_LISTINGS.filter(
        (item) =>
          item.title.toLowerCase().includes('apartment') ||
          item.title.toLowerCase().includes('property')
      );
      const aldarOffer = OFFERS.find((o) =>
        o.title.toLowerCase().includes('aldar')
      );
      return {
        title: 'Real Estate & Housing',
        description:
          'Explore available properties in the marketplace or get exclusive Aldar offers.',
        action: 'Browse Properties',
        related: [...properties.slice(0, 2).map(p => ({ id: p.id, title: p.title, category: 'marketplace' as const, description: p.description })), ...(aldarOffer ? [{ id: aldarOffer.id, title: aldarOffer.title, category: 'offers' as const, description: aldarOffer.description }] : [])],
      };
    }

    // Default suggestion
    if (searchQuery.trim()) {
      return {
        title: 'AI Assistant Ready',
        description:
          'Try asking me about HR services, employee benefits, or marketplace items.',
        action: 'Ask Me Anything',
        related: [],
      };
    }

    return null;
  }, []);

  // Search across all data
  const searchResults = useMemo(() => {
    if (!query.trim()) return {};

    const query_lower = query.toLowerCase();
    const results: Record<string, SearchResult[]> = {
      announcements: [],
      offers: [],
      marketplace: [],
      services: [],
      people: [],
    };

    // Search announcements
    const announcements = [...IHC_ANNOUNCEMENTS, ...Object.values(COMPANY_ANNOUNCEMENTS).flat()];
    results.announcements = announcements
      .filter(
        (a) =>
          a.title.toLowerCase().includes(query_lower) ||
          a.summary.toLowerCase().includes(query_lower)
      )
      .map((a) => ({
        id: a.id,
        title: a.title,
        category: 'announcements' as const,
        description: a.summary.substring(0, 100),
      }))
      .slice(0, 3);

    // Search offers
    results.offers = OFFERS.filter(
      (o) =>
        o.title.toLowerCase().includes(query_lower) ||
        o.description.toLowerCase().includes(query_lower)
    )
      .map((o) => ({
        id: o.id,
        title: o.title,
        category: 'offers' as const,
        description: o.description,
      }))
      .slice(0, 3);

    // Search marketplace
    results.marketplace = MARKETPLACE_LISTINGS.filter(
      (m) =>
        m.title.toLowerCase().includes(query_lower) ||
        m.description.toLowerCase().includes(query_lower)
    )
      .map((m) => ({
        id: m.id,
        title: m.title,
        category: 'marketplace' as const,
        description: m.description,
      }))
      .slice(0, 3);

    // Search services
    results.services = SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(query_lower) ||
        s.description.toLowerCase().includes(query_lower)
    )
      .map((s) => ({
        id: s.id,
        title: s.title,
        category: 'services' as const,
        description: s.description,
      }))
      .slice(0, 3);

    // Search people
    results.people = COLLEAGUES.filter(
      (c) =>
        c.name.toLowerCase().includes(query_lower) ||
        c.company.toLowerCase().includes(query_lower)
    )
      .map((c) => ({
        id: c.id,
        title: c.name,
        category: 'people' as const,
        description: c.company,
      }))
      .slice(0, 3);

    return results;
  }, [query]);

  const aiSuggestion = useMemo(() => getAISuggestion(query), [query, getAISuggestion]);

  const hasResults =
    Object.values(searchResults).some((arr) => arr.length > 0) ||
    aiSuggestion;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-[20px] bg-white shadow-2xl"
      >
        {/* Header - Search Input */}
        <div className="border-b border-[#E8E2D9] p-6">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <Search size={20} className="absolute left-3 text-[#9CA3AF]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search announcements, offers, people, services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-3 pl-10 pr-10 text-[#1A1A2E] placeholder-[#9CA3AF] outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
          <div className="mt-3 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Search across all data</span>
            <kbd className="rounded bg-[#F4EFE8] px-2 py-1 font-mono">⌘K</kbd>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() ? (
            <div className="p-6 space-y-6">
              {/* AI Suggestion Card */}
              {aiSuggestion && (
                <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-[#1B3A6B] to-[#2d5a8c] p-5 text-white">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-[#FFA500]/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-400" />
                        <h3 className="text-sm font-semibold">AI Suggestion</h3>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold mb-2">{aiSuggestion.title}</h2>
                    <p className="text-sm text-white/90 mb-4">
                      {aiSuggestion.description}
                    </p>
                    <button className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors">
                      {aiSuggestion.action}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Search Results by Category */}
              {hasResults && query.trim() ? (
                <div className="space-y-5">
                  {Object.entries(searchResults).map(([category, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={category}>
                        <h3 className="mb-2 text-xs font-semibold uppercase text-[#9CA3AF]">
                          {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} group cursor-pointer rounded-[14px] border border-[#E8E2D9] p-4 transition-all duration-200 hover:border-[#1B3A6B] hover:shadow-md`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[#1B3A6B]">
                                      {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                                    </span>
                                    <h4 className="font-semibold text-[#1A1A2E] truncate group-hover:text-[#1B3A6B] transition-colors">
                                      {item.title}
                                    </h4>
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-[#9CA3AF] line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={18}
                                  className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* No Results */}
              {!hasResults && query.trim() && (
                <div className="py-12 text-center">
                  <Search size={40} className="mx-auto mb-4 text-[#E8E2D9]" />
                  <p className="text-[#9CA3AF]">No results found for "{query}"</p>
                  <p className="text-sm text-[#9CA3AF] mt-2">
                    Try searching for announcements, offers, people, or services
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-[#9CA3AF]">
                    <Clock size={14} />
                    Recent Searches
                  </h3>
                  <div className="space-y-2 mb-6">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentClick(search)}
                        className="w-full text-left rounded-[14px] border border-[#E8E2D9] bg-[#F4EFE8] px-4 py-3 text-[#1A1A2E] transition-all duration-200 hover:border-[#1B3A6B] hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{search}</span>
                          <ArrowRight size={14} className="text-[#9CA3AF]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase text-[#9CA3AF]">
                  What you can search
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        Announcements
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Company updates & news</p>
                  </div>
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-purple-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-purple-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        Offers
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Partner benefits & deals</p>
                  </div>
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag size={16} className="text-amber-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        Marketplace
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Items for sale</p>
                  </div>
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench size={16} className="text-green-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        Services
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">HR & employee tools</p>
                  </div>
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-pink-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-pink-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        People
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Find colleagues</p>
                  </div>
                  <div className="rounded-[14px] border border-[#E8E2D9] bg-yellow-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-yellow-600" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">
                        AI Assistant
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Smart suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
