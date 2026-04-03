'use client';
import { useState, useRef, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import { X, MessageCircle, User, MapPin, Briefcase, Building2, Navigation, Settings, ExternalLink } from 'lucide-react';

/* ═══════════════════════════════════════════
   MOCK DATA: NEARBY PEOPLE
   ═══════════════════════════════════════════ */

const NEARBY_PEOPLE = [
  {
    id: 'p1',
    name: 'Ahmed Al Rashidi',
    role: 'Chief Strategy Officer',
    company: 'IHC Group',
    distance: '0.3 km',
    status: 'In office',
    avatar: 'AR',
    position: { top: '35%', left: '45%' },
    color: '#9D63F6',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p2',
    name: 'Maryam Jaber',
    role: 'Head of Leasing',
    company: 'Aldar Properties',
    distance: '0.8 km',
    status: 'In office',
    avatar: 'MJ',
    position: { top: '42%', left: '62%' },
    color: '#40C4AA',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p3',
    name: 'Faris Al Nuaimi',
    role: 'Engineering Lead',
    company: 'Shory',
    distance: '1.2 km',
    status: 'In meeting',
    avatar: 'FN',
    position: { top: '28%', left: '72%' },
    color: '#54B6ED',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p4',
    name: 'Hind Al Shamsi',
    role: 'Medical Director',
    company: 'PureHealth',
    distance: '1.5 km',
    status: 'Remote',
    avatar: 'HS',
    position: { top: '55%', left: '35%' },
    color: '#FFBD4C',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p5',
    name: 'Saif Khalifa',
    role: 'Fleet Manager',
    company: 'EasyLease',
    distance: '0.6 km',
    status: 'In office',
    avatar: 'SK',
    position: { top: '50%', left: '52%' },
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p6',
    name: 'Layla Al Ketbi',
    role: 'Finance Director',
    company: 'IHC Group',
    distance: '0.5 km',
    status: 'In office',
    avatar: 'LK',
    position: { top: '45%', left: '38%' },
    color: '#40C4AA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p7',
    name: 'Mohammed Al Mansouri',
    role: 'Senior Developer',
    company: 'Ghitha',
    distance: '2.1 km',
    status: 'In office',
    avatar: 'MM',
    position: { top: '65%', left: '58%' },
    color: '#EC4899',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'p8',
    name: 'Amina Al Dhaheri',
    role: 'Operations Manager',
    company: 'Palms Sports',
    distance: '1.8 km',
    status: 'In office',
    avatar: 'AD',
    position: { top: '32%', left: '58%' },
    color: '#EA580C',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
];

type FilterType = 'all' | 'same-company' | 'nearby' | 'in-office';

/* ═══════════════════════════════════════════
   PEOPLE MAP PAGE
   ═══════════════════════════════════════════ */

export default function PeopleMapPage() {
  const { user } = useAuth();
  const [selectedPerson, setSelectedPerson] = useState<typeof NEARBY_PEOPLE[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showSheet, setShowSheet] = useState(false);

  const filteredPeople = NEARBY_PEOPLE.filter(person => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'same-company') return person.company === 'IHC Group';
    if (activeFilter === 'nearby') return parseFloat(person.distance) < 1;
    if (activeFilter === 'in-office') return person.status === 'In office';
    return true;
  });

  const handleSelectPerson = (person: typeof NEARBY_PEOPLE[0]) => {
    setSelectedPerson(person);
    setShowSheet(true);
  };

  const getStatusColor = (status: string) => {
    if (status === 'In office') return '#40C4AA';
    if (status === 'In meeting') return '#FFBD4C';
    return '#A4ABB8';
  };

  const getStatusBg = (status: string) => {
    if (status === 'In office') return '#E7FEF8';
    if (status === 'In meeting') return '#FFF6E0';
    return '#F2F4F7';
  };

  return (
    <AppShell title="People Map" subtitle="Nearby IHC colleagues">
      <div className="space-y-4">
        {/* ── Filter Pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'same-company', 'nearby', 'in-office'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-[#9D63F6] text-white shadow-md shadow-[#9D63F6]/20'
                  : 'bg-white border border-[#DFE1E6] text-[#666D80] hover:border-[#9D63F6]/30'
              }`}
            >
              {filter === 'all' && 'All'}
              {filter === 'same-company' && 'Same Company'}
              {filter === 'nearby' && 'Nearby (<1km)'}
              {filter === 'in-office' && 'In Office'}
            </button>
          ))}
        </div>

        {/* ── Count Badge ── */}
        <div className="flex items-center gap-2 px-3 py-1 w-fit bg-[#EEF8FD] rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#54B6ED]" />
          <span className="text-[12px] font-semibold text-[#054589]">{filteredPeople.length} people nearby</span>
        </div>

        {/* ── Map Container ── */}
        <div className="relative w-full bg-white rounded-[20px] border border-[#DFE1E6] overflow-hidden h-[60vh]">
          {/* Background Map */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Gradient background */}
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F0F4F8', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#E8F1F7', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#DFE1E6', stopOpacity: 1 }} />
              </linearGradient>

              {/* Grid pattern */}
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#DFE1E6" strokeWidth="0.5" opacity="0.3" />
              </pattern>

              {/* Roads */}
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#DFE1E6', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#F0F4F8', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#DFE1E6', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>

            {/* Background fill */}
            <rect width="1000" height="600" fill="url(#mapGradient)" />

            {/* Grid overlay */}
            <rect width="1000" height="600" fill="url(#grid)" />

            {/* Road lines */}
            <line x1="0" y1="150" x2="1000" y2="150" stroke="url(#roadGradient)" strokeWidth="8" />
            <line x1="0" y1="300" x2="1000" y2="300" stroke="url(#roadGradient)" strokeWidth="8" />
            <line x1="0" y1="450" x2="1000" y2="450" stroke="url(#roadGradient)" strokeWidth="8" />
            <line x1="250" y1="0" x2="250" y2="600" stroke="url(#roadGradient)" strokeWidth="6" />
            <line x1="500" y1="0" x2="500" y2="600" stroke="url(#roadGradient)" strokeWidth="6" />
            <line x1="750" y1="0" x2="750" y2="600" stroke="url(#roadGradient)" strokeWidth="6" />

            {/* Landmark areas (circles with opacity) */}
            <circle cx="200" cy="150" r="60" fill="#9D63F6" opacity="0.08" />
            <circle cx="750" cy="200" r="70" fill="#54B6ED" opacity="0.08" />
            <circle cx="500" cy="450" r="80" fill="#40C4AA" opacity="0.08" />

            {/* Landmark labels */}
            <text x="200" y="160" textAnchor="middle" fontSize="12" fill="#666D80" fontWeight="600" opacity="0.7">
              IHC Tower
            </text>
            <text x="750" y="210" textAnchor="middle" fontSize="12" fill="#666D80" fontWeight="600" opacity="0.7">
              Al Maryah
            </text>
            <text x="500" y="460" textAnchor="middle" fontSize="12" fill="#666D80" fontWeight="600" opacity="0.7">
              Reem Island
            </text>
          </svg>

          {/* Colleague Pins */}
          <div className="absolute inset-0">
            {filteredPeople.map(person => (
              <PinButton
                key={person.id}
                person={person}
                isSelected={selectedPerson?.id === person.id}
                onClick={() => handleSelectPerson(person)}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom Section: Privacy Notice ── */}
        <div className="bg-white rounded-[16px] border border-[#DFE1E6] p-3 flex items-start gap-3">
          <MapPin size={14} className="text-[#A4ABB8] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#666D80]">
              Only colleagues who have enabled location sharing are visible.{' '}
              <button className="text-[#9D63F6] font-semibold hover:underline">
                Manage in Settings
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Sheet ── */}
      {showSheet && selectedPerson && (
        <BottomSheet person={selectedPerson} onClose={() => setShowSheet(false)} />
      )}
    </AppShell>
  );
}

/* ═══════════════════════════════════════════
   PIN BUTTON COMPONENT
   ═══════════════════════════════════════════ */

function PinButton({
  person,
  isSelected,
  onClick,
}: {
  person: typeof NEARBY_PEOPLE[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none"
      style={{
        top: person.position.top,
        left: person.position.left,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Pulse rings */}
      <div className="absolute inset-0 w-12 h-12 rounded-full -m-1.5" style={{ background: person.color, opacity: 0.15 }}>
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          .pulse-ring { animation: pulse-ring 2.5s ease-out infinite; }
        `}</style>
        <div className="w-full h-full rounded-full pulse-ring" />
      </div>

      {/* Main avatar circle */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] transition-all duration-300 shadow-lg cursor-pointer border-2 ${
          isSelected ? 'scale-125 ring-4' : 'hover:scale-110'
        }`}
        style={{
          background: person.color,
          borderColor: 'white',
          ...(isSelected && { boxShadow: `0 8px 24px ${person.color}40, 0 0 0 4px ${person.color}20` }),
        }}
      >
        {person.avatar}
      </div>

      {/* Tooltip on hover */}
      <div
        className={`absolute bottom-full mb-2 -left-20 w-40 bg-[#15161E] text-white rounded-[12px] p-2 text-[11px] text-center font-semibold pointer-events-none transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {person.name}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   BOTTOM SHEET COMPONENT
   ═══════════════════════════════════════════ */

function BottomSheet({
  person,
  onClose,
}: {
  person: typeof NEARBY_PEOPLE[0];
  onClose: () => void;
}) {
  const getStatusColor = (status: string) => {
    if (status === 'In office') return '#40C4AA';
    if (status === 'In meeting') return '#FFBD4C';
    return '#A4ABB8';
  };

  const getStatusBg = (status: string) => {
    if (status === 'In office') return '#E7FEF8';
    if (status === 'In meeting') return '#FFF6E0';
    return '#F2F4F7';
  };

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* ── Sheet ── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .sheet { animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="fixed bottom-0 left-0 right-0 z-50 sheet">
        <div className="bg-white rounded-t-[24px] border-t border-x border-[#DFE1E6] shadow-xl">
          {/* ── Handle & Close ── */}
          <div className="flex items-center justify-between p-4 border-b border-[#DFE1E6]">
            <div className="w-12 h-1 rounded-full bg-[#DFE1E6]" />
            <button onClick={onClose} className="p-1 hover:bg-[#F8F9FB] rounded-full transition-colors">
              <X size={18} className="text-[#666D80]" />
            </button>
          </div>

          {/* ── Content ── */}
          <div className="p-5 space-y-4">
            {/* Avatar & Header */}
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-[16px] flex items-center justify-center text-white text-[20px] font-bold shadow-lg flex-shrink-0"
                style={{ background: person.color }}
              >
                {person.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-bold text-[#15161E] mb-1">{person.name}</p>
                <p className="text-[13px] text-[#666D80] mb-2">{person.role}</p>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{
                    background: getStatusBg(person.status),
                    color: getStatusColor(person.status),
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: getStatusColor(person.status) }} />
                  {person.status}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 py-2">
              <DetailRow
                icon={Building2}
                label="Company"
                value={person.company}
              />
              <DetailRow
                icon={MapPin}
                label="Distance"
                value={person.distance}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-semibold text-[13px] text-white transition-all active:scale-[0.97]" style={{ background: '#9D63F6' }}>
                <MessageCircle size={16} />
                Send Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-semibold text-[13px] text-[#9D63F6] bg-[#F7F1FF] transition-all active:scale-[0.97] hover:bg-[#f0e7ff]">
                <User size={16} />
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   DETAIL ROW COMPONENT
   ═══════════════════════════════════════════ */

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-[#F8F9FB]">
        <Icon size={16} className="text-[#9D63F6]" />
      </div>
      <div>
        <p className="text-[11px] text-[#A4ABB8] font-medium">{label}</p>
        <p className="text-[13px] font-semibold text-[#15161E]">{value}</p>
      </div>
    </div>
  );
}
