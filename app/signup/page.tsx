'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Building2, Shield, Heart, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const DEMO_ACCOUNTS = [
  {
    name: 'Ahmed',
    fullName: 'Khalid Al Mansouri',
    email: 'khalid.mansouri@aldar.ae',
    company: 'Aldar Properties',
    companyId: 'aldar',
    role: 'Real Estate Director',
    icon: Building2,
    color: '#40C4AA',
    gradient: 'linear-gradient(135deg, #40C4AA 0%, #059669 100%)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    emphasis: 'Property & Lifestyle',
  },
  {
    name: 'Sara',
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@shory.ae',
    company: 'Shory',
    companyId: 'shory',
    role: 'Senior Product Manager',
    icon: Shield,
    color: '#9D63F6',
    gradient: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 100%)',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    emphasis: 'Insurance & Benefits',
  },
  {
    name: 'Fatima',
    fullName: 'Noura Hassan',
    email: 'noura.hassan@purehealth.ae',
    company: 'PureHealth',
    companyId: 'purehealth',
    role: 'Clinical Operations Lead',
    icon: Heart,
    color: '#DF1C41',
    gradient: 'linear-gradient(135deg, #DF1C41 0%, #BE123C 100%)',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    emphasis: 'Wellness & Healthcare',
  },
  {
    name: 'Ali',
    fullName: 'Ali Rashid',
    email: 'ali.rashid@ihcgroup.ae',
    company: 'IHC Group',
    companyId: 'ihc',
    role: 'Group Strategy Manager',
    icon: Briefcase,
    color: '#1B3A6B',
    gradient: 'linear-gradient(135deg, #1B3A6B 0%, #15161E 100%)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    emphasis: 'Group-wide Experience',
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setSelected(account.email);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login(account.email);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8" style={{ backgroundColor: '#F8F9FB' }}>
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(157,99,246,0.4); } 70% { box-shadow: 0 0 0 10px rgba(157,99,246,0); } 100% { box-shadow: 0 0 0 0 rgba(157,99,246,0); } }
      `}</style>

      <div className="w-full max-w-md">
        {/* Back */}
        <Link href="/landing" className="inline-flex items-center gap-1.5 text-sm text-[#A4ABB8] hover:text-[#15161E] transition-colors mb-8 no-underline">
          <ArrowLeft size={15} /> Back
        </Link>

        {/* Logo — large & prominent */}
        <div className="flex justify-center mb-8 fade-up">
          <Image src="/logo-login.svg" alt="Ahli Connect" width={200} height={53} priority />
        </div>

        {/* Title */}
        <div className="text-center mb-8 fade-up fade-up-1">
          <h1 className="text-[22px] font-bold text-[#15161E] leading-tight">Choose a Demo Account</h1>
          <p className="text-[13px] text-[#A4ABB8] mt-1.5">Sign in instantly to explore Ahli Connect</p>
        </div>

        {/* Demo Account Cards */}
        <div className="space-y-3 mb-8">
          {DEMO_ACCOUNTS.map((account, i) => {
            const Icon = account.icon;
            const isSelected = selected === account.email;
            const isLoading = isSelected && loading;

            return (
              <button
                key={account.email}
                onClick={() => !loading && handleSelect(account)}
                disabled={loading && !isSelected}
                className={`fade-up fade-up-${i + 1} w-full flex items-center gap-4 p-4 rounded-[20px] border-2 transition-all active:scale-[0.98] text-left ${
                  isSelected
                    ? 'border-[#9D63F6] bg-white shadow-lg'
                    : loading
                    ? 'border-[#DFE1E6] bg-white opacity-40 cursor-not-allowed'
                    : 'border-[#DFE1E6] bg-white hover:border-[#A4ABB8] hover:shadow-md'
                }`}
                style={isSelected ? { animation: 'pulse-ring 1.5s ease-out infinite', boxShadow: '0 8px 32px rgba(157,99,246,0.15)' } : { boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={account.image}
                    alt={account.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: isSelected ? '2.5px solid #9D63F6' : '2px solid #DFE1E6' }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: account.gradient }}>
                    <Icon size={10} className="text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-[#15161E]">{account.fullName}</p>
                  </div>
                  <p className="text-[12px] text-[#666D80]">{account.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: account.color + '15', color: account.color }}>
                      {account.company}
                    </span>
                    <span className="text-[10px] text-[#A4ABB8]">{account.emphasis}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isLoading ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#9D63F6] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isSelected ? '#9D63F6' : '#F8F9FB' }}>
                      <ChevronRight size={16} className={isSelected ? 'text-white' : 'text-[#A4ABB8]'} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Already have account */}
        <p className="text-center text-[12px] text-[#A4ABB8] mb-3">
          Already have an account?{' '}
          <Link href="/login" className="text-[#9D63F6] font-semibold no-underline">Sign in</Link>
        </p>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#A4ABB8]/60">
          For demo purposes only
        </p>
      </div>
    </div>
  );
}
