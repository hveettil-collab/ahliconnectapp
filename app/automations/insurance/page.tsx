'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  Shield, ArrowLeft, Car, CheckCircle2, Loader2, ChevronRight,
  CreditCard, FileText, AlertCircle, Star, Zap, Clock, Download,
  Hash, Calendar, Fuel, Gauge, CircleDollarSign, Lock, Sparkles,
} from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════
   SHORY INSURANCE — In-app purchase flow
   ═══════════════════════════════════════════ */

const STEP_STYLES = `
  @keyframes step-check { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes progress-fill { from { width: 0%; } to { width: 100%; } }
  @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes card-appear { from { opacity: 0; transform: scale(0.95) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .step-check { animation: step-check 0.3s ease-out; }
  .fade-up { animation: fade-up 0.35s ease-out both; }
  .card-appear { animation: card-appear 0.5s ease-out both; }
  .card-appear-1 { animation-delay: 0.1s; }
  .card-appear-2 { animation-delay: 0.2s; }
  .card-appear-3 { animation-delay: 0.3s; }
  .shimmer-bg {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s ease-in-out infinite;
  }
`;

/* Mock vehicle data resolved from plate number */
const MOCK_VEHICLES: Record<string, { make: string; model: string; year: number; color: string; cylinders: number; value: number; chassisNo: string; }> = {
  'default': { make: 'Toyota', model: 'Camry', year: 2023, color: 'Pearl White', cylinders: 4, value: 95000, chassisNo: '6T1BF3EK5PU••••92' },
};

/* Insurance plans */
interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  logo: string;
  price: number;
  originalPrice: number;
  features: string[];
  popular?: boolean;
  rating: number;
}

const PLANS: InsurancePlan[] = [
  {
    id: 'basic',
    name: 'Third Party',
    provider: 'Shory',
    logo: 'S',
    price: 799,
    originalPrice: 940,
    features: ['Third party liability', 'Natural disaster cover', '24/7 roadside assistance'],
    rating: 4.2,
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    provider: 'Shory',
    logo: 'S',
    price: 1499,
    originalPrice: 1760,
    features: ['Full vehicle damage cover', 'Theft & total loss', 'Agency repair network', 'Replacement car — 15 days', '24/7 roadside assistance'],
    popular: true,
    rating: 4.7,
  },
  {
    id: 'premium',
    name: 'Flexi Comp.',
    provider: 'Shory',
    logo: 'S',
    price: 2199,
    originalPrice: 2590,
    features: ['Zero depreciation', 'Worldwide cover', 'Agency repair — unlimited', 'Replacement car — 30 days', 'Personal accident cover', 'Windshield — no excess'],
    rating: 4.9,
  },
];

type Phase = 'plate' | 'fetching' | 'vehicle' | 'plans' | 'payment' | 'processing' | 'complete';

export default function InsurancePage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('plate');
  const [plateNumber, setPlateNumber] = useState('');
  const [plateCity, setPlateCity] = useState('Abu Dhabi');
  const [vehicle, setVehicle] = useState(MOCK_VEHICLES['default']);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  if (!user) return null;

  /* Simulate fetching vehicle data from plate */
  const handleFetchVehicle = () => {
    if (!plateNumber.trim()) return;
    setPhase('fetching');
    setTimeout(() => {
      setVehicle(MOCK_VEHICLES['default']);
      setPhase('vehicle');
    }, 2000);
  };

  /* Simulate payment processing */
  const handlePayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvv) return;
    setPhase('processing');
    setTimeout(() => {
      setPolicyNumber(`SHR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
      setPhase('complete');
    }, 3000);
  };

  const discount = selectedPlan ? selectedPlan.originalPrice - selectedPlan.price : 0;

  return (
    <AppShell title="Motor Insurance" subtitle="Powered by Shory" hideTopBar>
      <style>{STEP_STYLES}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 sticky top-0 z-10 bg-white/90 border-b border-[#DFE1E6]" style={{ backdropFilter: 'blur(12px)' }}>
        <Link href="/explore" className="p-1.5 rounded-lg text-[#666D80] hover:text-[#15161E] hover:bg-[#F8F9FB] transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-md">
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#15161E]">Motor Insurance</p>
            <p className="text-[10px] text-[#A4ABB8] font-medium">Powered by Shory</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {['plate', 'vehicle', 'plans', 'payment', 'complete'].map((step, i) => {
            const steps: Phase[] = ['plate', 'vehicle', 'plans', 'payment', 'complete'];
            const currentIdx = steps.indexOf(phase === 'fetching' ? 'plate' : phase === 'processing' ? 'payment' : phase);
            return (
              <div key={step} className="w-2 h-2 rounded-full transition-all duration-300" style={{
                background: i <= currentIdx ? '#7C3AED' : '#DFE1E6',
                width: i === currentIdx ? 16 : 8,
              }} />
            );
          })}
        </div>
      </div>

      <div className="px-4 py-5">

        {/* ═══════════════════════════════════════
            PHASE 1 — Enter plate number
            ═══════════════════════════════════════ */}
        {phase === 'plate' && (
          <div className="fade-up">
            {/* Shory branding hero */}
            <div className="relative rounded-[20px] overflow-hidden mb-6" style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #9D63F6 50%, #B182F8 100%)',
              padding: '24px 20px',
            }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{
                background: 'radial-gradient(circle, #FFBD4C, transparent)',
                transform: 'translate(20%, -30%)',
              }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">S</span>
                  </div>
                  <span className="text-white/60 text-[11px] font-semibold">SHORY INSURANCE</span>
                </div>
                <h2 className="text-white text-[20px] font-bold leading-tight">Get insured in<br/>under 2 minutes</h2>
                <p className="text-white/50 text-[12px] mt-2">Enter your plate number to get instant quotes with 15% IHC corporate discount</p>
              </div>
            </div>

            {/* Plate number input */}
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#15161E] mb-2 block">Emirate</label>
              <div className="flex gap-2 mb-3">
                {['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman'].map(city => (
                  <button
                    key={city}
                    onClick={() => setPlateCity(city)}
                    className="flex-1 py-2.5 rounded-[12px] text-[11px] font-semibold transition-all border"
                    style={{
                      background: plateCity === city ? '#7C3AED' : 'white',
                      color: plateCity === city ? 'white' : '#666D80',
                      borderColor: plateCity === city ? '#7C3AED' : '#DFE1E6',
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[12px] font-semibold text-[#15161E] mb-2 block">Plate Number</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Hash size={16} className="text-[#A4ABB8]" />
                </div>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full h-[52px] pl-10 pr-4 rounded-[14px] border border-[#DFE1E6] text-[15px] font-semibold text-[#15161E] placeholder:text-[#A4ABB8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-3 mb-5">
              {[
                { icon: Lock, text: 'Secure' },
                { icon: Zap, text: '60s quotes' },
                { icon: Star, text: '4.8 rated' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[10px] text-[#A4ABB8] font-medium">
                  <Icon size={12} className="text-[#7C3AED]" />
                  {text}
                </div>
              ))}
            </div>

            <button
              onClick={handleFetchVehicle}
              disabled={!plateNumber.trim()}
              className="w-full py-4 rounded-[16px] text-[14px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: plateNumber.trim() ? 'linear-gradient(135deg, #7C3AED, #9D63F6)' : '#DFE1E6' }}
            >
              Get Instant Quotes
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 2 — Fetching vehicle data
            ═══════════════════════════════════════ */}
        {phase === 'fetching' && (
          <div className="flex flex-col items-center justify-center py-16 fade-up">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-[#DFE1E6]" />
              <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-[#F7F1FF] flex items-center justify-center">
                <Car size={24} className="text-[#7C3AED]" />
              </div>
            </div>
            <p className="text-[15px] font-bold text-[#15161E] mb-1">Looking up your vehicle</p>
            <p className="text-[12px] text-[#A4ABB8]">{plateCity} · Plate {plateNumber}</p>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 3 — Vehicle confirmation
            ═══════════════════════════════════════ */}
        {phase === 'vehicle' && (
          <div className="fade-up">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-[#40C4AA]" />
              <p className="text-[14px] font-bold text-[#15161E]">Vehicle Found</p>
            </div>

            <div className="bg-white rounded-[20px] border border-[#DFE1E6] p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-[16px] bg-[#F7F1FF] flex items-center justify-center">
                  <Car size={26} className="text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#15161E]">{vehicle.make} {vehicle.model}</p>
                  <p className="text-[12px] text-[#A4ABB8]">{vehicle.year} · {vehicle.color}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Hash, label: 'Plate', value: `${plateCity} ${plateNumber}` },
                  { icon: Calendar, label: 'Year', value: `${vehicle.year}` },
                  { icon: Fuel, label: 'Cylinders', value: `${vehicle.cylinders} Cyl` },
                  { icon: CircleDollarSign, label: 'Value', value: `AED ${vehicle.value.toLocaleString()}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-[12px] p-3 border border-[#DFE1E6]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-[#A4ABB8]" />
                      <p className="text-[10px] text-[#A4ABB8] font-medium">{label}</p>
                    </div>
                    <p className="text-[12px] font-bold text-[#15161E]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 bg-[#F8F9FB] rounded-[12px] p-3 border border-[#DFE1E6]">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText size={12} className="text-[#A4ABB8]" />
                  <p className="text-[10px] text-[#A4ABB8] font-medium">Chassis No.</p>
                </div>
                <p className="text-[12px] font-bold text-[#15161E] font-mono">{vehicle.chassisNo}</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={() => setPhase('plate')}
                className="flex-1 py-3.5 rounded-[14px] border border-[#DFE1E6] text-[13px] font-semibold text-[#666D80] active:scale-[0.97] transition-all">
                Not my car
              </button>
              <button onClick={() => setPhase('plans')}
                className="flex-[2] py-3.5 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)' }}>
                Confirm & View Plans
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 4 — Choose a plan
            ═══════════════════════════════════════ */}
        {phase === 'plans' && (
          <div className="fade-up">
            <p className="text-[14px] font-bold text-[#15161E] mb-1">Choose Your Plan</p>
            <p className="text-[12px] text-[#A4ABB8] mb-4">All plans include 15% IHC corporate discount</p>

            <div className="space-y-3 mb-5">
              {PLANS.map((plan, i) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`card-appear card-appear-${i + 1} w-full text-left rounded-[20px] border-2 p-4 transition-all active:scale-[0.98] relative overflow-hidden`}
                  style={{
                    borderColor: selectedPlan?.id === plan.id ? '#7C3AED' : '#DFE1E6',
                    background: selectedPlan?.id === plan.id ? '#FAFAFF' : 'white',
                  }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#7C3AED] text-white text-[9px] font-bold px-3 py-1 rounded-bl-[12px]">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{
                      background: selectedPlan?.id === plan.id ? '#7C3AED' : '#F7F1FF',
                    }}>
                      <span className="text-[14px] font-bold" style={{
                        color: selectedPlan?.id === plan.id ? 'white' : '#7C3AED',
                      }}>S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-bold text-[#15161E]">{plan.name}</p>
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="text-[#FFBD4C]" fill="#FFBD4C" />
                          <span className="text-[10px] text-[#A4ABB8] font-medium">{plan.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-[20px] font-bold text-[#7C3AED]">AED {plan.price.toLocaleString()}</p>
                        <p className="text-[12px] text-[#A4ABB8] line-through">AED {plan.originalPrice.toLocaleString()}</p>
                        <span className="text-[9px] font-bold text-[#40C4AA] bg-[#E7FEF8] px-1.5 py-0.5 rounded-full">-15%</span>
                      </div>
                      <div className="space-y-1">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-1.5">
                            <CheckCircle2 size={11} className="text-[#40C4AA] shrink-0" />
                            <p className="text-[11px] text-[#666D80]">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedPlan && setPhase('payment')}
              disabled={!selectedPlan}
              className="w-full py-4 rounded-[16px] text-[14px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: selectedPlan ? 'linear-gradient(135deg, #7C3AED, #9D63F6)' : '#DFE1E6' }}
            >
              {selectedPlan ? `Continue — AED ${selectedPlan.price.toLocaleString()}/yr` : 'Select a plan'}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 5 — Payment
            ═══════════════════════════════════════ */}
        {phase === 'payment' && selectedPlan && (
          <div className="fade-up">
            {/* Order summary */}
            <div className="bg-[#F8F9FB] rounded-[18px] border border-[#DFE1E6] p-4 mb-5">
              <p className="text-[11px] font-semibold text-[#A4ABB8] uppercase tracking-wide mb-2">Order Summary</p>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[13px] text-[#15161E]">Shory {selectedPlan.name}</p>
                <p className="text-[13px] text-[#A4ABB8] line-through">AED {selectedPlan.originalPrice.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[13px] text-[#40C4AA] font-semibold">IHC Corporate Discount (15%)</p>
                <p className="text-[13px] text-[#40C4AA] font-semibold">-AED {discount}</p>
              </div>
              <div className="border-t border-[#DFE1E6] mt-2 pt-2 flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#15161E]">Total</p>
                <p className="text-[18px] font-bold text-[#7C3AED]">AED {selectedPlan.price.toLocaleString()}</p>
              </div>
              <p className="text-[10px] text-[#A4ABB8] mt-1">{vehicle.make} {vehicle.model} {vehicle.year} · {plateCity} {plateNumber}</p>
            </div>

            <p className="text-[14px] font-bold text-[#15161E] mb-3">Payment Details</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-semibold text-[#666D80] mb-1.5 block">Card Number</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A4ABB8]" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                    placeholder="1234 5678 9012 3456"
                    className="w-full h-[48px] pl-10 pr-4 rounded-[12px] border border-[#DFE1E6] text-[14px] font-medium text-[#15161E] placeholder:text-[#A4ABB8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#666D80] mb-1.5 block">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCardExpiry(v);
                    }}
                    placeholder="MM/YY"
                    className="w-full h-[48px] px-4 rounded-[12px] border border-[#DFE1E6] text-[14px] font-medium text-[#15161E] placeholder:text-[#A4ABB8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#666D80] mb-1.5 block">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    className="w-full h-[48px] px-4 rounded-[12px] border border-[#DFE1E6] text-[14px] font-medium text-[#15161E] placeholder:text-[#A4ABB8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4 text-[10px] text-[#A4ABB8]">
              <Lock size={11} className="text-[#40C4AA]" />
              Secured by Shory · 256-bit SSL encryption
            </div>

            <button
              onClick={handlePayment}
              disabled={!cardNumber || !cardExpiry || !cardCvv}
              className="w-full py-4 rounded-[16px] text-[14px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: (cardNumber && cardExpiry && cardCvv) ? 'linear-gradient(135deg, #7C3AED, #9D63F6)' : '#DFE1E6' }}
            >
              Pay AED {selectedPlan.price.toLocaleString()}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 6 — Processing payment
            ═══════════════════════════════════════ */}
        {phase === 'processing' && (
          <div className="flex flex-col items-center justify-center py-16 fade-up">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-[#DFE1E6]" />
              <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-[#F7F1FF] flex items-center justify-center">
                <CreditCard size={24} className="text-[#7C3AED]" />
              </div>
            </div>
            <p className="text-[15px] font-bold text-[#15161E] mb-1">Processing payment</p>
            <p className="text-[12px] text-[#A4ABB8]">Issuing your policy — almost done...</p>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE 7 — Complete — Digital Policy Card
            ═══════════════════════════════════════ */}
        {phase === 'complete' && selectedPlan && (
          <div className="fade-up">
            {/* Success header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#E7FEF8] flex items-center justify-center mb-3">
                <CheckCircle2 size={32} className="text-[#40C4AA]" />
              </div>
              <p className="text-[18px] font-bold text-[#15161E]">You're Insured!</p>
              <p className="text-[12px] text-[#A4ABB8] mt-0.5">Your policy is active immediately</p>
            </div>

            {/* Digital policy card */}
            <div className="relative rounded-[22px] overflow-hidden mb-5" style={{
              background: 'linear-gradient(135deg, #15161E 0%, #2D1B69 40%, #7C3AED 100%)',
              padding: '20px',
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{
                background: 'radial-gradient(circle, #FFBD4C, transparent)',
                transform: 'translate(20%, -30%)',
              }} />

              <div className="relative z-10">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-white">S</span>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] font-semibold tracking-wider uppercase">SHORY INSURANCE</p>
                      <p className="text-white text-[12px] font-bold">{selectedPlan.name} Plan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#40C4AA]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#40C4AA] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#40C4AA]">ACTIVE</span>
                  </div>
                </div>

                {/* Policy details */}
                <div className="mb-4">
                  <p className="text-white/40 text-[9px] font-medium mb-0.5">POLICY NUMBER</p>
                  <p className="text-white text-[14px] font-bold font-mono tracking-wide">{policyNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-white/40 text-[9px] font-medium mb-0.5">INSURED</p>
                    <p className="text-white text-[12px] font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] font-medium mb-0.5">VEHICLE</p>
                    <p className="text-white text-[12px] font-semibold">{vehicle.make} {vehicle.model} {vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] font-medium mb-0.5">PLATE</p>
                    <p className="text-white text-[12px] font-semibold">{plateCity} {plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[9px] font-medium mb-0.5">VALID UNTIL</p>
                    <p className="text-white text-[12px] font-semibold">Apr 2, 2027</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <p className="text-white/40 text-[10px]">IHC Employee Benefit</p>
                  <p className="text-[#FFBD4C] text-[13px] font-bold">AED {selectedPlan.price.toLocaleString()}/yr</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-[14px] border border-[#DFE1E6] bg-white text-[12px] font-semibold text-[#15161E] active:scale-[0.97] transition-all">
                <Download size={15} /> Download PDF
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-[14px] border border-[#DFE1E6] bg-white text-[12px] font-semibold text-[#15161E] active:scale-[0.97] transition-all">
                <CreditCard size={15} /> Add to Wallet
              </button>
            </div>

            <Link href="/dashboard"
              className="block w-full py-3.5 rounded-[14px] text-center text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)' }}>
              Back to Home
            </Link>
          </div>
        )}

      </div>
    </AppShell>
  );
}
