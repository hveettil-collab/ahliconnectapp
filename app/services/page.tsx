'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useListings } from '@/context/ListingsContext';
import { SERVICES, OFFERS, COLLEAGUES, COMPANIES } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';
import {
  Sparkles, Send, ArrowRight, Plane, Car, Gamepad2,
  Heart, Shield, GraduationCap, Gift, MapPin, Users,
  Calendar, FileText, Clock, CheckCircle2, CreditCard,
  Palmtree, ShoppingBag, UtensilsCrossed, Ticket, Globe,
  HelpCircle, TrendingUp, Briefcase, DollarSign, Monitor,
  BookOpen, Receipt, Star, Zap, Trophy, ArrowLeft, Mic,
  Paperclip, ChevronRight, Search, MapPinned, Navigation,
  CircleDot, Package, Utensils, Coffee, ShoppingCart,
  BadgeCheck, Download, Wallet, X, Check, Loader2,
  Camera, Eye, Share2, Building2, MessageCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  cards?: ActionCard[];
  typing?: boolean;
  flowType?: 'insurance' | 'rides' | 'food' | 'flights' | 'sell' | 'vacation' | 'gaming';
  sellCategory?: string;
}

let _msgId = 0;
function nextMsgId() { return `msg_${++_msgId}_${Date.now()}`; }

interface ActionCard {
  type: 'action' | 'info' | 'offer' | 'booking' | 'social';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  image?: string;
  link?: string;
  action?: string;
}

/* ═══════════════════════════════════════════
   INLINE FLOW: INSURANCE (Shory)
   ═══════════════════════════════════════════ */

function InsuranceFlow() {
  const [phase, setPhase] = useState<'plate' | 'fetching' | 'vehicle' | 'plans' | 'payment' | 'processing' | 'complete'>('plate');
  const [emirate, setEmirate] = useState('Abu Dhabi');
  const [plateNum, setPlateNum] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman'];
  const VEHICLE = { make: 'Toyota', model: 'Land Cruiser', year: '2023', color: 'Pearl White', vin: 'JTMHY7AJ5N...' };
  const PLANS = [
    { id: 'tp', name: 'Third Party', price: 799, discounted: 679, features: ['Basic liability', 'Legal requirement', 'Third party damage'] },
    { id: 'comp', name: 'Comprehensive', price: 1499, discounted: 1274, features: ['Full coverage', 'Own damage', 'Theft & fire', 'Roadside assist'], popular: true },
    { id: 'flexi', name: 'Flexi', price: 2199, discounted: 1869, features: ['Agency repair', 'Replacement car', 'Zero depreciation', 'GCC coverage'] },
  ];

  useEffect(() => {
    if (phase === 'fetching') {
      const t = setTimeout(() => setPhase('vehicle'), 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'processing') {
      const t = setTimeout(() => setPhase('complete'), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const chosen = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9D63F6 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">Shory Motor Insurance</p>
          <p className="text-[11px] text-white/70">Powered by Shory · IHC 15% discount</p>
        </div>
      </div>

      <div className="p-4">
        {/* Phase: Plate Entry */}
        {phase === 'plate' && (
          <div className="space-y-4">
            <p className="text-[13px] text-[#4B5563]">Enter your vehicle plate number to get started</p>
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Emirate</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {EMIRATES.map(e => (
                  <button key={e} onClick={() => setEmirate(e)}
                    className="px-3 py-2 rounded-[12px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: emirate === e ? '#7C3AED' : '#F8F9FB', color: emirate === e ? '#fff' : '#666D80', border: emirate === e ? 'none' : '1px solid #DFE1E6' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Plate Number</label>
              <input type="text" value={plateNum} onChange={e => setPlateNum(e.target.value)} placeholder="e.g. 12345"
                className="w-full mt-2 bg-white border-2 border-[#DFE1E6] rounded-[14px] px-4 py-3 text-[16px] font-bold text-[#15161E] outline-none focus:border-[#7C3AED] transition-colors text-center tracking-[0.3em]" />
            </div>
            <button onClick={() => { if (plateNum.trim()) setPhase('fetching'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: plateNum.trim() ? 'linear-gradient(135deg, #7C3AED, #9D63F6)' : '#DFE1E6', boxShadow: plateNum.trim() ? '0 4px 16px rgba(124,58,237,0.3)' : 'none' }}>
              <Search size={14} className="inline mr-1.5" />Look Up Vehicle
            </button>
          </div>
        )}

        {/* Phase: Fetching */}
        {phase === 'fetching' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#7C3AED] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Looking up vehicle...</p>
            <p className="text-[12px] text-[#A4ABB8]">{emirate} · Plate {plateNum}</p>
          </div>
        )}

        {/* Phase: Vehicle Found */}
        {phase === 'vehicle' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#059669]">
              <CheckCircle2 size={16} /> <p className="text-[13px] font-semibold">Vehicle Found</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(VEHICLE).map(([k, v]) => (
                <div key={k} className="px-3 py-2 rounded-[12px] bg-[#F8F9FB]">
                  <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider">{k}</p>
                  <p className="text-[13px] font-bold text-[#15161E]">{v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase('plans')}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              View Insurance Plans
            </button>
          </div>
        )}

        {/* Phase: Plan Selection */}
        {phase === 'plans' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Choose your insurance plan</p>
            {PLANS.map(plan => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                className="w-full text-left p-3.5 rounded-[16px] border-2 transition-all active:scale-[0.98]"
                style={{ borderColor: selectedPlan === plan.id ? '#7C3AED' : '#DFE1E6', background: selectedPlan === plan.id ? '#F5F0FF' : '#fff' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-[#15161E]">{plan.name}</p>
                    {plan.popular && <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full bg-[#7C3AED]">Popular</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#A4ABB8] line-through">AED {plan.price}</p>
                    <p className="text-[16px] font-extrabold text-[#7C3AED]">AED {plan.discounted}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.features.map(f => (
                    <span key={f} className="text-[10px] text-[#666D80] bg-[#F8F9FB] px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </button>
            ))}
            {selectedPlan && (
              <button onClick={() => setPhase('payment')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                Continue to Payment
              </button>
            )}
          </div>
        )}

        {/* Phase: Payment */}
        {phase === 'payment' && chosen && (
          <div className="space-y-4">
            <div className="p-3 rounded-[14px] bg-[#F8F9FB] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#A4ABB8]">{chosen.name} Plan</p>
                <p className="text-[18px] font-extrabold text-[#7C3AED]">AED {chosen.discounted}</p>
              </div>
              <span className="text-[10px] font-bold text-[#059669] bg-[#F0FDF4] px-2 py-1 rounded-full">15% IHC discount</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Card Number</label>
                <input type="text" value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="4242 4242 4242 4242"
                  className="w-full mt-1.5 bg-white border-2 border-[#DFE1E6] rounded-[12px] px-4 py-2.5 text-[14px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#7C3AED] transition-colors" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Expiry</label>
                  <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY"
                    className="w-full mt-1.5 bg-white border-2 border-[#DFE1E6] rounded-[12px] px-4 py-2.5 text-[14px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#7C3AED] transition-colors" />
                </div>
                <div className="w-24">
                  <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">CVV</label>
                  <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123"
                    className="w-full mt-1.5 bg-white border-2 border-[#DFE1E6] rounded-[12px] px-4 py-2.5 text-[14px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#7C3AED] transition-colors" />
                </div>
              </div>
            </div>
            <button onClick={() => setPhase('processing')}
              className="w-full py-3.5 rounded-[14px] text-[14px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              Pay AED {chosen.discounted}
            </button>
          </div>
        )}

        {/* Phase: Processing */}
        {phase === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#7C3AED] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Processing payment...</p>
            <p className="text-[12px] text-[#A4ABB8]">Generating your digital policy</p>
          </div>
        )}

        {/* Phase: Complete */}
        {phase === 'complete' && chosen && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-[#059669]" />
              </div>
              <p className="text-[16px] font-bold text-[#15161E]">You&apos;re Insured!</p>
              <p className="text-[12px] text-[#A4ABB8]">Policy activated instantly</p>
            </div>
            {/* Digital Policy Card */}
            <div className="rounded-[18px] p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(157,99,246,0.2) 0%, transparent 70%)' }} />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[#FFBD4C]" />
                  <span className="text-[12px] font-bold">SHORY</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-[13px] font-bold">{chosen.name} Plan</p>
              <p className="text-[11px] text-white/60 mt-0.5">Policy #SHR-2026-{Math.floor(Math.random() * 90000 + 10000)}</p>
              <div className="flex gap-4 mt-3 text-[10px] text-white/50">
                <div><p>Vehicle</p><p className="text-white font-semibold">Toyota Land Cruiser 2023</p></div>
                <div><p>Valid Until</p><p className="text-white font-semibold">Apr 2027</p></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#7C3AED] bg-[#F5F0FF] border border-[#E9DEFF] active:scale-95 transition-all">
                <Download size={13} className="inline mr-1" />PDF
              </button>
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all">
                <Wallet size={13} className="inline mr-1" />Add to Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: RIDES (Careem)
   ═══════════════════════════════════════════ */

function RidesFlow() {
  const [phase, setPhase] = useState<'pickup' | 'searching' | 'options' | 'confirmed' | 'arriving'>('pickup');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedRide, setSelectedRide] = useState('');

  const RIDES = [
    { id: 'economy', name: 'Economy', time: '4 min', price: 'AED 18', icon: '🚗', desc: 'Affordable rides' },
    { id: 'comfort', name: 'Comfort', time: '3 min', price: 'AED 28', icon: '🚙', desc: 'Extra legroom & AC' },
    { id: 'business', name: 'Business', time: '6 min', price: 'AED 45', icon: '🖤', desc: 'Premium sedans', popular: true },
  ];

  useEffect(() => {
    if (phase === 'searching') {
      const t = setTimeout(() => setPhase('options'), 1800);
      return () => clearTimeout(t);
    }
    if (phase === 'confirmed') {
      const t = setTimeout(() => setPhase('arriving'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #40C4AA 0%, #059669 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <Car size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">Book a Ride</p>
          <p className="text-[11px] text-white/70">Powered by Careem · IHC 30% discount</p>
        </div>
      </div>

      <div className="p-4">
        {phase === 'pickup' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-stretch">
              <div className="flex flex-col items-center py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#40C4AA]" />
                <div className="flex-1 w-px bg-[#DFE1E6] my-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup location"
                  className="w-full bg-white border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] outline-none focus:border-[#40C4AA] transition-colors placeholder:text-[#A4ABB8]" />
                <input type="text" value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Where to?"
                  className="w-full bg-white border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] outline-none focus:border-[#40C4AA] transition-colors placeholder:text-[#A4ABB8]" />
              </div>
            </div>
            <div className="flex gap-2">
              {['IHC HQ, Abu Dhabi', 'Al Maryah Island', 'Abu Dhabi Airport'].map(s => (
                <button key={s} onClick={() => !pickup ? setPickup(s) : setDropoff(s)}
                  className="text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-[#F8F9FB] border border-[#DFE1E6] text-[#666D80] active:scale-95 transition-all">
                  <MapPin size={9} className="inline mr-0.5" />{s.split(',')[0]}
                </button>
              ))}
            </div>
            <button onClick={() => { if (pickup && dropoff) setPhase('searching'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: (pickup && dropoff) ? 'linear-gradient(135deg, #40C4AA, #059669)' : '#DFE1E6', boxShadow: (pickup && dropoff) ? '0 4px 16px rgba(5,150,105,0.3)' : 'none' }}>
              Find Rides
            </button>
          </div>
        )}

        {phase === 'searching' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#40C4AA] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Finding nearby drivers...</p>
            <p className="text-[12px] text-[#A4ABB8]">{pickup} → {dropoff}</p>
          </div>
        )}

        {phase === 'options' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#059669] mb-1">
              <CheckCircle2 size={14} /> <p className="text-[12px] font-semibold">3 ride types available</p>
            </div>
            {RIDES.map(ride => (
              <button key={ride.id} onClick={() => setSelectedRide(ride.id)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-[14px] border-2 transition-all active:scale-[0.98]"
                style={{ borderColor: selectedRide === ride.id ? '#40C4AA' : '#DFE1E6', background: selectedRide === ride.id ? '#F0FDF4' : '#fff' }}>
                <span className="text-[22px]">{ride.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-[#15161E]">{ride.name}</p>
                    {ride.popular && <span className="text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full bg-[#40C4AA]">Best Value</span>}
                  </div>
                  <p className="text-[11px] text-[#A4ABB8]">{ride.desc} · {ride.time} away</p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-extrabold text-[#15161E]">{ride.price}</p>
                  <p className="text-[9px] text-[#059669] font-semibold">30% off</p>
                </div>
              </button>
            ))}
            {selectedRide && (
              <button onClick={() => setPhase('confirmed')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #40C4AA, #059669)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                Confirm Ride · {RIDES.find(r => r.id === selectedRide)?.price}
              </button>
            )}
          </div>
        )}

        {phase === 'confirmed' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#40C4AA] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Connecting with driver...</p>
          </div>
        )}

        {phase === 'arriving' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-[#059669]" />
              </div>
              <p className="text-[16px] font-bold text-[#15161E]">Ride Confirmed!</p>
            </div>
            <div className="rounded-[16px] p-4 bg-[#F8F9FB] border border-[#DFE1E6] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#40C4AA] flex items-center justify-center text-white text-[14px] font-bold">AK</div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#15161E]">Ahmed K.</p>
                  <div className="flex items-center gap-1"><Star size={10} className="text-[#FFBD4C] fill-[#FFBD4C]" /><span className="text-[11px] text-[#666D80]">4.9 · Toyota Camry · White</span></div>
                </div>
                <p className="text-[13px] font-bold text-[#40C4AA]">3 min</p>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#666D80]">
                <MapPin size={12} className="text-[#40C4AA]" /> Plate: AUH 54321
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] active:scale-95 transition-all">
                <MapPinned size={13} className="inline mr-1" />Track
              </button>
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all">
                <Send size={13} className="inline mr-1" />Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: FOOD (Noon)
   ═══════════════════════════════════════════ */

function FoodFlow() {
  const [phase, setPhase] = useState<'browse' | 'menu' | 'cart' | 'ordering' | 'confirmed'>('browse');
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof RESTAURANTS[0] | null>(null);
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([]);

  const RESTAURANTS = [
    { id: 'r1', name: 'Shawarma House', cuisine: 'Arabic', rating: 4.8, time: '20-30 min', image: '🥙', discount: '25% IHC', items: [
      { name: 'Chicken Shawarma Plate', price: 32 }, { name: 'Mixed Grill', price: 55 }, { name: 'Falafel Wrap', price: 22 }, { name: 'Hummus & Bread', price: 18 },
    ]},
    { id: 'r2', name: 'Sushi Lab', cuisine: 'Japanese', rating: 4.7, time: '25-35 min', image: '🍱', discount: '20% IHC', items: [
      { name: 'Salmon Sashimi Set', price: 65 }, { name: 'Dragon Roll (8pc)', price: 48 }, { name: 'Chicken Teriyaki Don', price: 38 }, { name: 'Miso Soup', price: 12 },
    ]},
    { id: 'r3', name: 'Burger Studio', cuisine: 'American', rating: 4.6, time: '15-25 min', image: '🍔', discount: '30% IHC', items: [
      { name: 'Classic Smash Burger', price: 35 }, { name: 'Truffle Fries', price: 18 }, { name: 'BBQ Chicken Burger', price: 42 }, { name: 'Milkshake', price: 22 },
    ]},
  ];

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const addToCart = (name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === name);
      if (existing) return prev.map(c => c.name === name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name, price, qty: 1 }];
    });
  };

  useEffect(() => {
    if (phase === 'ordering') {
      const t = setTimeout(() => setPhase('confirmed'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #FFBD4C 0%, #F59E0B 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <UtensilsCrossed size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">Order Food</p>
          <p className="text-[11px] text-white/70">Powered by Noon Food · IHC discounts</p>
        </div>
      </div>

      <div className="p-4">
        {phase === 'browse' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Popular restaurants near IHC HQ</p>
            {RESTAURANTS.map(r => (
              <button key={r.id} onClick={() => { setSelectedRestaurant(r); setPhase('menu'); }}
                className="w-full text-left flex items-center gap-3 p-3 rounded-[14px] border border-[#DFE1E6] hover:shadow-sm active:scale-[0.98] transition-all">
                <span className="text-[28px]">{r.image}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#15161E]">{r.name}</p>
                  <p className="text-[11px] text-[#A4ABB8]">{r.cuisine} · {r.time}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5"><Star size={10} className="text-[#FFBD4C] fill-[#FFBD4C]" /><span className="text-[12px] font-bold">{r.rating}</span></div>
                  <span className="text-[9px] font-bold text-[#F59E0B] bg-[#FEF9F0] px-1.5 py-0.5 rounded-full">{r.discount}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {phase === 'menu' && selectedRestaurant && (
          <div className="space-y-3">
            <button onClick={() => { setPhase('browse'); setSelectedRestaurant(null); setCart([]); }}
              className="text-[12px] text-[#9D63F6] font-semibold flex items-center gap-1">
              <ArrowLeft size={13} /> Back to restaurants
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[24px]">{selectedRestaurant.image}</span>
              <div>
                <p className="text-[15px] font-bold text-[#15161E]">{selectedRestaurant.name}</p>
                <p className="text-[11px] text-[#A4ABB8]">{selectedRestaurant.time} · {selectedRestaurant.discount}</p>
              </div>
            </div>
            {selectedRestaurant.items.map(item => {
              const inCart = cart.find(c => c.name === item.name);
              return (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-[12px] bg-[#F8F9FB]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#15161E]">{item.name}</p>
                    <p className="text-[13px] font-bold text-[#F59E0B]">AED {item.price}</p>
                  </div>
                  <button onClick={() => addToCart(item.name, item.price)}
                    className="px-3 py-1.5 rounded-[10px] text-[11px] font-bold active:scale-95 transition-all"
                    style={{ background: inCart ? '#F59E0B' : '#FEF9F0', color: inCart ? '#fff' : '#F59E0B', border: inCart ? 'none' : '1px solid #FDE68A' }}>
                    {inCart ? `${inCart.qty} added` : 'Add'}
                  </button>
                </div>
              );
            })}
            {cart.length > 0 && (
              <button onClick={() => setPhase('cart')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #FFBD4C, #F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                <ShoppingCart size={15} /> View Cart · AED {cartTotal}
              </button>
            )}
          </div>
        )}

        {phase === 'cart' && selectedRestaurant && (
          <div className="space-y-3">
            <p className="text-[14px] font-bold text-[#15161E]">Your Order</p>
            {cart.map(item => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <span className="text-[#4B5563]">{item.qty}x {item.name}</span>
                <span className="font-bold text-[#15161E]">AED {item.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-[#DFE1E6] pt-2 flex justify-between text-[14px]">
              <span className="text-[#666D80]">Delivery Fee</span>
              <span className="font-bold text-[#059669]">FREE (IHC)</span>
            </div>
            <div className="flex justify-between text-[16px] font-extrabold">
              <span>Total</span>
              <span className="text-[#F59E0B]">AED {cartTotal}</span>
            </div>
            <button onClick={() => setPhase('ordering')}
              className="w-full py-3.5 rounded-[14px] text-[14px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #FFBD4C, #F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
              Place Order · AED {cartTotal}
            </button>
          </div>
        )}

        {phase === 'ordering' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#F59E0B] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Placing your order...</p>
          </div>
        )}

        {phase === 'confirmed' && selectedRestaurant && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#FEF9F0] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-[#F59E0B]" />
              </div>
              <p className="text-[16px] font-bold text-[#15161E]">Order Placed!</p>
              <p className="text-[12px] text-[#A4ABB8]">Order #{Math.floor(Math.random() * 9000 + 1000)}</p>
            </div>
            <div className="rounded-[16px] p-4 bg-[#F8F9FB] border border-[#DFE1E6]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[24px]">{selectedRestaurant.image}</span>
                <div>
                  <p className="text-[14px] font-bold text-[#15161E]">{selectedRestaurant.name}</p>
                  <p className="text-[11px] text-[#059669] font-semibold">Estimated: {selectedRestaurant.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#A4ABB8]">
                <MapPin size={12} /> Delivering to IHC HQ, Abu Dhabi
              </div>
            </div>
            <button className="w-full py-2.5 rounded-[12px] text-[12px] font-bold text-[#F59E0B] bg-[#FEF9F0] border border-[#FDE68A] active:scale-95 transition-all">
              <Navigation size={13} className="inline mr-1" />Track Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: FLIGHTS
   ═══════════════════════════════════════════ */

function FlightsFlow() {
  const [phase, setPhase] = useState<'search' | 'searching' | 'results' | 'booking' | 'confirmed'>('search');
  const [from, setFrom] = useState('Abu Dhabi (AUH)');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [selectedFlight, setSelectedFlight] = useState('');

  const DESTINATIONS = ['London (LHR)', 'Mumbai (BOM)', 'Cairo (CAI)', 'Bangkok (BKK)', 'Istanbul (IST)'];
  const FLIGHTS = [
    { id: 'f1', airline: 'Etihad', depart: '08:30', arrive: '13:45', duration: '7h 15m', price: 2100, discount: 15, stops: 'Direct' },
    { id: 'f2', airline: 'Emirates', depart: '14:20', arrive: '19:50', duration: '7h 30m', price: 2350, discount: 10, stops: 'Direct' },
    { id: 'f3', airline: 'Etihad', depart: '22:00', arrive: '03:30+1', duration: '7h 30m', price: 1850, discount: 15, stops: 'Direct', cheapest: true },
  ];

  useEffect(() => {
    if (phase === 'searching') {
      const t = setTimeout(() => setPhase('results'), 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'booking') {
      const t = setTimeout(() => setPhase('confirmed'), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <Plane size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">Book a Flight</p>
          <p className="text-[11px] text-white/70">IHC employee rates · Up to 15% off</p>
        </div>
      </div>

      <div className="p-4">
        {phase === 'search' && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">From</label>
              <input type="text" value={from} onChange={e => setFrom(e.target.value)}
                className="w-full mt-1.5 border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] font-semibold text-[#15161E] outline-none focus:border-[#9D63F6] transition-colors bg-[#F8F9FB]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">To</label>
              <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="Select destination"
                className="w-full mt-1.5 bg-white border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#9D63F6] transition-colors" />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {DESTINATIONS.map(d => (
                  <button key={d} onClick={() => setTo(d)}
                    className="text-[10px] font-medium px-2.5 py-1.5 rounded-full active:scale-95 transition-all"
                    style={{ background: to === d ? '#9D63F6' : '#F8F9FB', color: to === d ? '#fff' : '#666D80', border: to === d ? 'none' : '1px solid #DFE1E6' }}>
                    {d.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full mt-1.5 bg-white border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] outline-none focus:border-[#9D63F6] transition-colors" />
              </div>
              <div className="w-20">
                <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Pax</label>
                <select value={passengers} onChange={e => setPassengers(e.target.value)}
                  className="w-full mt-1.5 border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] outline-none focus:border-[#9D63F6] transition-colors bg-white">
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => { if (to && date) setPhase('searching'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: (to && date) ? 'linear-gradient(135deg, #9D63F6, #7C3AED)' : '#DFE1E6', boxShadow: (to && date) ? '0 4px 16px rgba(157,99,246,0.3)' : 'none' }}>
              <Search size={14} className="inline mr-1.5" />Search Flights
            </button>
          </div>
        )}

        {phase === 'searching' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#9D63F6] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Searching flights...</p>
            <p className="text-[12px] text-[#A4ABB8]">{from} → {to}</p>
          </div>
        )}

        {phase === 'results' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-[#666D80]">{from.split('(')[0]}→ {to.split('(')[0]}</p>
              <p className="text-[11px] text-[#A4ABB8]">{FLIGHTS.length} flights found</p>
            </div>
            {FLIGHTS.map(flight => (
              <button key={flight.id} onClick={() => setSelectedFlight(flight.id)}
                className="w-full text-left p-3.5 rounded-[14px] border-2 transition-all active:scale-[0.98]"
                style={{ borderColor: selectedFlight === flight.id ? '#9D63F6' : '#DFE1E6', background: selectedFlight === flight.id ? '#F5F0FF' : '#fff' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-[#15161E]">{flight.airline}</p>
                    {flight.cheapest && <span className="text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full bg-[#40C4AA]">Cheapest</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-extrabold text-[#9D63F6]">AED {Math.round(flight.price * (1 - flight.discount / 100))}</p>
                    <p className="text-[9px] text-[#A4ABB8] line-through">AED {flight.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-[#15161E]">{flight.depart}</p>
                    <p className="text-[9px] text-[#A4ABB8]">{from.match(/\((\w+)\)/)?.[1]}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-px bg-[#DFE1E6]" />
                    <div className="text-center px-2">
                      <Plane size={10} className="text-[#A4ABB8] mx-auto" />
                      <p className="text-[9px] text-[#A4ABB8]">{flight.duration}</p>
                    </div>
                    <div className="flex-1 h-px bg-[#DFE1E6]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-[#15161E]">{flight.arrive}</p>
                    <p className="text-[9px] text-[#A4ABB8]">{to.match(/\((\w+)\)/)?.[1]}</p>
                  </div>
                </div>
                <p className="text-[10px] text-[#059669] font-semibold mt-1.5">{flight.stops} · {flight.discount}% IHC discount</p>
              </button>
            ))}
            {selectedFlight && (
              <button onClick={() => setPhase('booking')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)', boxShadow: '0 4px 16px rgba(157,99,246,0.3)' }}>
                Book Flight · AED {Math.round((FLIGHTS.find(f => f.id === selectedFlight)?.price || 0) * (1 - (FLIGHTS.find(f => f.id === selectedFlight)?.discount || 0) / 100))}
              </button>
            )}
          </div>
        )}

        {phase === 'booking' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#9D63F6] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Booking your flight...</p>
            <p className="text-[12px] text-[#A4ABB8]">Confirming with airline</p>
          </div>
        )}

        {phase === 'confirmed' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#F5F0FF] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-[#9D63F6]" />
              </div>
              <p className="text-[16px] font-bold text-[#15161E]">Flight Booked!</p>
              <p className="text-[12px] text-[#A4ABB8]">Booking Ref: IHC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            <div className="rounded-[16px] p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)' }}>
              <div className="flex items-center justify-between text-white mb-3">
                <p className="text-[13px] font-bold">{FLIGHTS.find(f => f.id === selectedFlight)?.airline}</p>
                <Plane size={16} className="text-[#FFBD4C]" />
              </div>
              <div className="flex items-center gap-3 text-white">
                <div>
                  <p className="text-[18px] font-extrabold">{from.match(/\((\w+)\)/)?.[1]}</p>
                  <p className="text-[10px] text-white/50">{FLIGHTS.find(f => f.id === selectedFlight)?.depart}</p>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-px bg-white/20" />
                  <Plane size={12} className="text-white/40" />
                  <div className="flex-1 h-px bg-white/20" />
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-extrabold">{to.match(/\((\w+)\)/)?.[1]}</p>
                  <p className="text-[10px] text-white/50">{FLIGHTS.find(f => f.id === selectedFlight)?.arrive}</p>
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-3">{date} · {passengers} passenger(s)</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#9D63F6] bg-[#F5F0FF] border border-[#E9DEFF] active:scale-95 transition-all">
                <Download size={13} className="inline mr-1" />E-Ticket
              </button>
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all">
                <Calendar size={13} className="inline mr-1" />Add to Calendar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: SELL LISTING
   ═══════════════════════════════════════════ */

/* Stable component defined OUTSIDE SellFlow to prevent re-mount on every render */
function SellFieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full mt-1.5 bg-white border border-[#DFE1E6] rounded-[12px] px-3 py-2.5 text-[13px] text-[#15161E] placeholder:text-[#A4ABB8] outline-none focus:border-[#40C4AA] transition-colors" />
    </div>
  );
}

function SellFlow({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const listings = useListings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<'category' | 'details' | 'photos' | 'preview' | 'publishing' | 'live'>(initialCategory ? 'details' : 'category');
  const [category, setCategory] = useState(initialCategory || '');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  /* ── Category-specific extra fields ── */
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carMileage, setCarMileage] = useState('');
  const [carLocation, setCarLocation] = useState('');

  const [elecBrand, setElecBrand] = useState('');
  const [elecStorage, setElecStorage] = useState('');

  const [furnMaterial, setFurnMaterial] = useState('');
  const [furnDimensions, setFurnDimensions] = useState('');

  const [propType, setPropType] = useState('');
  const [propBedrooms, setPropBedrooms] = useState('');
  const [propArea, setPropArea] = useState('');
  const [propLocation, setPropLocation] = useState('');

  /* ── Listing analytics (simulated) ── */
  const [views, setViews] = useState(0);
  const [inquiries, setInquiries] = useState(0);
  const [saves, setSaves] = useState(0);

  const CATEGORIES = [
    { id: 'cars', label: 'Cars', icon: '🚗' },
    { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'furniture', label: 'Furniture', icon: '🛋️' },
    { id: 'property', label: 'Property', icon: '🏠' },
    { id: 'other', label: 'Other', icon: '📦' },
  ];

  const CAR_CONDITIONS = ['Brand New', 'Excellent', 'Good', 'Fair'];
  const ELEC_CONDITIONS = ['Sealed / New', 'Like New', 'Good', 'Fair'];
  const FURN_CONDITIONS = ['New', 'Like New', 'Good', 'Used'];
  const PROP_TYPES = ['Apartment', 'Villa', 'Studio', 'Townhouse', 'Office'];
  const CONDITIONS_FOR = category === 'cars' ? CAR_CONDITIONS : category === 'electronics' ? ELEC_CONDITIONS : category === 'furniture' ? FURN_CONDITIONS : ['New', 'Like New', 'Excellent', 'Good'];

  const headerConfig: Record<string, { title: string; subtitle: string; gradient: string }> = {
    cars: { title: 'Sell Your Car', subtitle: 'AI car listing · 45K+ buyers', gradient: 'linear-gradient(135deg, #9D63F6 0%, #7C3AED 100%)' },
    electronics: { title: 'Sell Electronics', subtitle: 'AI listing · 45K+ buyers', gradient: 'linear-gradient(135deg, #54B6ED 0%, #2563EB 100%)' },
    furniture: { title: 'Sell Furniture', subtitle: 'AI listing · 45K+ buyers', gradient: 'linear-gradient(135deg, #FFBD4C 0%, #F59E0B 100%)' },
    property: { title: 'List Property', subtitle: 'AI listing · 45K+ employees', gradient: 'linear-gradient(135deg, #40C4AA 0%, #059669 100%)' },
    other: { title: 'Sell on Marketplace', subtitle: 'AI-powered listing · 45K+ employees', gradient: 'linear-gradient(135deg, #40C4AA 0%, #059669 100%)' },
  };
  const hdr = headerConfig[category] || headerConfig.other;

  /* ── Build smart title from fields ── */
  const buildTitle = () => {
    if (category === 'cars') return `${carYear} ${carMake} ${carModel}`.trim();
    if (category === 'electronics') return `${elecBrand} ${title}`.trim();
    return title;
  };

  /* ── Generate AI description per category ── */
  const generateDescription = () => {
    let desc = '';
    const finalTitle = buildTitle();
    if (category === 'cars') {
      desc = `${condition} ${carYear} ${carMake} ${carModel} for sale. ${carMileage ? `Mileage: ${carMileage} km. ` : ''}${carLocation ? `Located in ${carLocation}. ` : ''}Asking AED ${parseInt(price || '0').toLocaleString()}. Serious buyers only — contact me through the Ahli Connect app for a test drive.`;
    } else if (category === 'electronics') {
      desc = `${condition} ${elecBrand} ${title}${elecStorage ? ` (${elecStorage})` : ''} for sale. Asking AED ${parseInt(price || '0').toLocaleString()}. ${condition === 'Sealed / New' ? 'Factory sealed with warranty.' : 'Fully functional, no issues.'} Contact through the app.`;
    } else if (category === 'furniture') {
      desc = `${condition} ${title} for sale.${furnMaterial ? ` Material: ${furnMaterial}.` : ''}${furnDimensions ? ` Dimensions: ${furnDimensions}.` : ''} Asking AED ${parseInt(price || '0').toLocaleString()}. Pick-up available. Contact me through the app.`;
    } else if (category === 'property') {
      desc = `${propType}${propBedrooms ? ` — ${propBedrooms} bedroom(s)` : ''} available${propLocation ? ` in ${propLocation}` : ''}. ${propArea ? `Area: ${propArea} sq ft. ` : ''}Asking AED ${parseInt(price || '0').toLocaleString()}. Contact through Ahli Connect for viewing.`;
    } else {
      desc = `${condition} item for sale: ${title}. Asking AED ${parseInt(price || '0').toLocaleString()}. Contact me through the app for more details. Quick sale preferred.`;
    }
    setTitle(finalTitle);
    setDescription(desc);
    setPhase('preview');
  };

  /* ── Can continue from details? ── */
  const canContinue = () => {
    if (category === 'cars') return carMake && carModel && carYear && price && condition;
    if (category === 'electronics') return title && price && condition;
    if (category === 'furniture') return title && price && condition;
    if (category === 'property') return propType && price && propLocation;
    return title && price && condition;
  };

  useEffect(() => {
    if (phase === 'publishing') {
      const t = setTimeout(() => {
        const cat = CATEGORIES.find(c => c.id === category);
        const finalTitle = buildTitle() || title;
        listings.addListing({
          title: finalTitle,
          price: `AED ${parseInt(price || '0').toLocaleString()}`,
          category: cat?.label || 'Other',
          condition,
          description,
          images,
          seller: user?.name || 'You',
          sellerCompany: user?.company || 'IHC Group',
          specs: { condition, category: cat?.label || 'Other' },
        });
        setPhase('live');
        // Simulate live analytics
        const iv = setInterval(() => {
          setViews(p => p + Math.floor(Math.random() * 3) + 1);
          if (Math.random() > 0.6) setInquiries(p => p + 1);
          if (Math.random() > 0.7) setSaves(p => p + 1);
        }, 3000);
        return () => clearInterval(iv);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleImageUpload = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (images.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) setImages(prev => [...prev, ev.target!.result as string]); };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => { setImages(prev => prev.filter((_, i) => i !== idx)); };

  /* ── Input helper: uses SellFieldInput defined outside SellFlow ── */

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
      <div className="p-4 flex items-center gap-3" style={{ background: hdr.gradient }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          {category === 'cars' ? <Car size={18} className="text-white" /> : category === 'electronics' ? <Monitor size={18} className="text-white" /> : <ShoppingCart size={18} className="text-white" />}
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">{hdr.title}</p>
          <p className="text-[11px] text-white/70">{hdr.subtitle}</p>
        </div>
      </div>

      <div className="p-4">
        {/* ── CATEGORY SELECTION (only if no initialCategory) ── */}
        {phase === 'category' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">What are you selling?</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className="p-3 rounded-[14px] text-center transition-all active:scale-95"
                  style={{ background: category === cat.id ? '#40C4AA' : '#F8F9FB', color: category === cat.id ? '#fff' : '#15161E', border: category === cat.id ? 'none' : '1px solid #DFE1E6' }}>
                  <span className="text-[20px] block mb-1">{cat.icon}</span>
                  <p className="text-[11px] font-bold">{cat.label}</p>
                </button>
              ))}
            </div>
            {category && (
              <button onClick={() => setPhase('details')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #40C4AA, #059669)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                Continue
              </button>
            )}
          </div>
        )}

        {/* ── CATEGORY-SPECIFIC DETAILS ── */}
        {phase === 'details' && category === 'cars' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Tell us about your car</p>
            <div className="grid grid-cols-2 gap-2">
              <SellFieldInput label="Make" value={carMake} onChange={setCarMake} placeholder="e.g. Toyota" />
              <SellFieldInput label="Model" value={carModel} onChange={setCarModel} placeholder="e.g. Camry" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SellFieldInput label="Year" value={carYear} onChange={setCarYear} placeholder="e.g. 2022" />
              <SellFieldInput label="Mileage (km)" value={carMileage} onChange={setCarMileage} placeholder="e.g. 35000" />
            </div>
            <SellFieldInput label="Asking Price (AED)" value={price} onChange={setPrice} placeholder="e.g. 85000" />
            <SellFieldInput label="Location" value={carLocation} onChange={setCarLocation} placeholder="e.g. Abu Dhabi" />
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Condition</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {CONDITIONS_FOR.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className="px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: condition === c ? '#9D63F6' : '#F8F9FB', color: condition === c ? '#fff' : '#666D80', border: condition === c ? 'none' : '1px solid #DFE1E6' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (canContinue()) setPhase('photos'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: canContinue() ? 'linear-gradient(135deg, #9D63F6, #7C3AED)' : '#DFE1E6', boxShadow: canContinue() ? '0 4px 16px rgba(124,58,237,0.3)' : 'none' }}>
              Continue to Photos
            </button>
          </div>
        )}

        {phase === 'details' && category === 'electronics' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Tell us about your device</p>
            <SellFieldInput label="Brand" value={elecBrand} onChange={setElecBrand} placeholder="e.g. Apple, Samsung, Sony" />
            <SellFieldInput label="Product Name" value={title} onChange={setTitle} placeholder="e.g. iPhone 15 Pro Max 256GB" />
            <SellFieldInput label="Storage / Specs" value={elecStorage} onChange={setElecStorage} placeholder="e.g. 256GB, 16GB RAM" />
            <SellFieldInput label="Asking Price (AED)" value={price} onChange={setPrice} placeholder="e.g. 3500" />
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Condition</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {CONDITIONS_FOR.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className="px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: condition === c ? '#54B6ED' : '#F8F9FB', color: condition === c ? '#fff' : '#666D80', border: condition === c ? 'none' : '1px solid #DFE1E6' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (canContinue()) setPhase('photos'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: canContinue() ? 'linear-gradient(135deg, #54B6ED, #2563EB)' : '#DFE1E6', boxShadow: canContinue() ? '0 4px 16px rgba(37,99,235,0.3)' : 'none' }}>
              Continue to Photos
            </button>
          </div>
        )}

        {phase === 'details' && category === 'furniture' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Tell us about the furniture</p>
            <SellFieldInput label="Item Name" value={title} onChange={setTitle} placeholder="e.g. L-shaped Sofa, Office Desk" />
            <div className="grid grid-cols-2 gap-2">
              <SellFieldInput label="Material" value={furnMaterial} onChange={setFurnMaterial} placeholder="e.g. Leather, Wood" />
              <SellFieldInput label="Dimensions" value={furnDimensions} onChange={setFurnDimensions} placeholder="e.g. 200x90 cm" />
            </div>
            <SellFieldInput label="Asking Price (AED)" value={price} onChange={setPrice} placeholder="e.g. 1200" />
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Condition</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {CONDITIONS_FOR.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className="px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: condition === c ? '#FFBD4C' : '#F8F9FB', color: condition === c ? '#fff' : '#666D80', border: condition === c ? 'none' : '1px solid #DFE1E6' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (canContinue()) setPhase('photos'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: canContinue() ? 'linear-gradient(135deg, #FFBD4C, #F59E0B)' : '#DFE1E6', boxShadow: canContinue() ? '0 4px 16px rgba(245,158,11,0.3)' : 'none' }}>
              Continue to Photos
            </button>
          </div>
        )}

        {phase === 'details' && category === 'property' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Tell us about the property</p>
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Property Type</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {PROP_TYPES.map(p => (
                  <button key={p} onClick={() => setPropType(p)}
                    className="px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: propType === p ? '#40C4AA' : '#F8F9FB', color: propType === p ? '#fff' : '#666D80', border: propType === p ? 'none' : '1px solid #DFE1E6' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SellFieldInput label="Bedrooms" value={propBedrooms} onChange={setPropBedrooms} placeholder="e.g. 2" />
              <SellFieldInput label="Area (sq ft)" value={propArea} onChange={setPropArea} placeholder="e.g. 1200" />
            </div>
            <SellFieldInput label="Location" value={propLocation} onChange={setPropLocation} placeholder="e.g. Al Reem Island" />
            <SellFieldInput label="Asking Price (AED)" value={price} onChange={setPrice} placeholder="e.g. 950000" />
            <button onClick={() => { if (canContinue()) setPhase('photos'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: canContinue() ? 'linear-gradient(135deg, #40C4AA, #059669)' : '#DFE1E6', boxShadow: canContinue() ? '0 4px 16px rgba(5,150,105,0.3)' : 'none' }}>
              Continue to Photos
            </button>
          </div>
        )}

        {phase === 'details' && !['cars', 'electronics', 'furniture', 'property'].includes(category) && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">Tell us about your item</p>
            <SellFieldInput label="Title" value={title} onChange={setTitle} placeholder="e.g. Vintage Watch, Bicycle" />
            <SellFieldInput label="Asking Price (AED)" value={price} onChange={setPrice} placeholder="e.g. 500" />
            <div>
              <label className="text-[11px] font-semibold text-[#666D80] uppercase tracking-wider">Condition</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {CONDITIONS_FOR.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className="px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all active:scale-95"
                    style={{ background: condition === c ? '#40C4AA' : '#F8F9FB', color: condition === c ? '#fff' : '#666D80', border: condition === c ? 'none' : '1px solid #DFE1E6' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (canContinue()) setPhase('photos'); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: canContinue() ? 'linear-gradient(135deg, #40C4AA, #059669)' : '#DFE1E6', boxShadow: canContinue() ? '0 4px 16px rgba(5,150,105,0.3)' : 'none' }}>
              Continue to Photos
            </button>
          </div>
        )}

        {/* ── PHOTOS ── */}
        {phase === 'photos' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#4B5563]">
              {category === 'cars' ? 'Add photos of your car — exterior, interior, and mileage' :
               category === 'electronics' ? 'Add photos of your device — front, back, and any accessories' :
               category === 'property' ? 'Add photos — living area, kitchen, bedrooms, view' :
               'Add photos of your item'}
            </p>
            <p className="text-[11px] text-[#A4ABB8]">Items with photos sell 3x faster. Add up to 5 photos.</p>

            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden border border-[#DFE1E6]">
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-bold text-white bg-[#40C4AA] px-1.5 py-0.5 rounded-full">Cover</span>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button onClick={handleImageUpload}
                  className="aspect-square rounded-[12px] border-2 border-dashed border-[#DFE1E6] flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all hover:border-[#40C4AA] hover:bg-[#F0FDF4]">
                  <Camera size={20} className="text-[#A4ABB8]" />
                  <span className="text-[9px] font-semibold text-[#A4ABB8]">Add Photo</span>
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={handleImageUpload}
                className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                <Camera size={14} /> Upload from Gallery
              </button>
            </div>

            <button onClick={generateDescription}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: 'linear-gradient(135deg, #40C4AA, #059669)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
              <Sparkles size={14} className="inline mr-1.5" />{images.length > 0 ? 'Generate Listing with AI' : 'Skip Photos & Generate'}
            </button>
          </div>
        )}

        {/* ── AI PREVIEW ── */}
        {phase === 'preview' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#059669] mb-1">
              <Sparkles size={14} /> <p className="text-[12px] font-semibold">AI-generated listing preview</p>
            </div>
            <div className="p-3 rounded-[14px] bg-[#F8F9FB] border border-[#DFE1E6]">
              {images.length > 0 ? (
                <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <img key={i} src={img} alt={`Photo ${i + 1}`} className="w-20 h-20 rounded-[10px] object-cover shrink-0" />
                  ))}
                </div>
              ) : (
                <div className="w-full h-24 rounded-[10px] bg-[#DFE1E6] flex items-center justify-center text-[#A4ABB8] mb-3">
                  <Camera size={24} />
                </div>
              )}
              <p className="text-[15px] font-bold text-[#15161E]">{title}</p>
              <p className="text-[17px] font-extrabold text-[#40C4AA] mt-1">AED {parseInt(price || '0').toLocaleString()}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {condition && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#40C4AA] text-white">{condition}</span>}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8F9FB] text-[#666D80] border border-[#DFE1E6]">{CATEGORIES.find(c => c.id === category)?.label}</span>
                {category === 'cars' && carMileage && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8F9FB] text-[#666D80] border border-[#DFE1E6]">{parseInt(carMileage).toLocaleString()} km</span>}
                {category === 'cars' && carLocation && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8F9FB] text-[#666D80] border border-[#DFE1E6]">{carLocation}</span>}
                {category === 'property' && propBedrooms && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8F9FB] text-[#666D80] border border-[#DFE1E6]">{propBedrooms} BR</span>}
                {images.length > 0 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8F9FB] text-[#666D80] border border-[#DFE1E6]">{images.length} photo{images.length > 1 ? 's' : ''}</span>}
              </div>
              <p className="text-[12px] text-[#666D80] mt-2 leading-relaxed">{description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPhase('details')}
                className="px-4 py-3 rounded-[14px] text-[13px] font-bold text-[#666D80] border border-[#DFE1E6] active:scale-[0.97] transition-all">
                Edit
              </button>
              <button onClick={() => setPhase('publishing')}
                className="flex-1 py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #40C4AA, #059669)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                Publish Listing
              </button>
            </div>
          </div>
        )}

        {/* ── PUBLISHING ── */}
        {phase === 'publishing' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#40C4AA] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Publishing your listing...</p>
            <p className="text-[12px] text-[#A4ABB8]">Making it visible to 45,000+ employees</p>
          </div>
        )}

        {/* ── LIVE WITH ANALYTICS ── */}
        {phase === 'live' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-[#059669]" />
              </div>
              <p className="text-[16px] font-bold text-[#15161E]">Your listing is live!</p>
              <p className="text-[12px] text-[#A4ABB8]">Visible to 45,000+ IHC employees across 30+ companies</p>
            </div>

            {/* Listing card */}
            <div className="p-3 rounded-[14px] bg-[#F8F9FB] border border-[#DFE1E6]">
              {images.length > 0 && (
                <img src={images[0]} alt={title} className="w-full h-32 rounded-[10px] object-cover mb-2" />
              )}
              <p className="text-[14px] font-bold text-[#15161E]">{title}</p>
              <p className="text-[15px] font-extrabold text-[#40C4AA]">AED {parseInt(price || '0').toLocaleString()}</p>
            </div>

            {/* Live Analytics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-[14px] bg-[#F5F0FF] border border-[#E9DEFF] text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye size={13} className="text-[#9D63F6]" />
                </div>
                <p className="text-[18px] font-extrabold text-[#9D63F6]">{views}</p>
                <p className="text-[9px] font-semibold text-[#9D63F6]/60 uppercase">Views</p>
              </div>
              <div className="p-3 rounded-[14px] bg-[#EBF6FF] border border-[#C5E4FF] text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageCircle size={13} className="text-[#54B6ED]" />
                </div>
                <p className="text-[18px] font-extrabold text-[#54B6ED]">{inquiries}</p>
                <p className="text-[9px] font-semibold text-[#54B6ED]/60 uppercase">Inquiries</p>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FFF8EB] border border-[#FFE4A8] text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart size={13} className="text-[#FFBD4C]" />
                </div>
                <p className="text-[18px] font-extrabold text-[#F59E0B]">{saves}</p>
                <p className="text-[9px] font-semibold text-[#F59E0B]/60 uppercase">Saved</p>
              </div>
            </div>

            {inquiries > 0 && (
              <div className="p-3 rounded-[14px] bg-[#EDFAF6] border border-[#A7F3D0]">
                <p className="text-[12px] font-bold text-[#059669] mb-1">New interest from buyers!</p>
                <p className="text-[11px] text-[#059669]/70">{inquiries} employee{inquiries > 1 ? 's' : ''} sent you a message about this listing. Check your inbox.</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] active:scale-95 transition-all">
                <Share2 size={13} className="inline mr-1" />Share
              </button>
              <button onClick={() => router.push('/marketplace?tab=my')}
                className="flex-1 py-2.5 rounded-[12px] text-[12px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-95 transition-all">
                <Package size={13} className="inline mr-1" />My Listings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: VACATION BOOKING
   ═══════════════════════════════════════════ */

function VacationFlow() {
  const [phase, setPhase] = useState<'browse' | 'booking' | 'confirmed'>('browse');
  const [selected, setSelected] = useState('');

  const TRIPS = [
    { id: 'yas', name: 'Yas Island Staycation', location: 'Abu Dhabi', price: 'AED 850', originalPrice: 'AED 1,420', discount: '40% off', duration: '2 nights', image: '🏝️', rating: 4.8 },
    { id: 'jebel', name: 'Jebel Akhdar Group Trip', location: 'Oman', price: 'AED 450', originalPrice: 'AED 750', discount: 'Group rate', duration: '3 days', image: '⛰️', rating: 4.9, spots: '8/12 filled' },
    { id: 'maldives', name: 'Maldives All-Inclusive', location: 'Maldives', price: 'AED 3,200', originalPrice: 'AED 5,500', discount: 'IHC exclusive', duration: '5 nights', image: '🏖️', rating: 5.0 },
  ];

  useEffect(() => {
    if (phase === 'booking') {
      const t = setTimeout(() => setPhase('confirmed'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const chosen = TRIPS.find(t => t.id === selected);

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #FFBD4C 0%, #F59E0B 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Palmtree size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">IHC Travel & Vacations</p>
          <p className="text-[11px] text-white/70">Employee exclusive rates</p>
        </div>
      </div>
      <div className="p-4">
        {phase === 'browse' && (
          <div className="space-y-3">
            {TRIPS.map(trip => (
              <button key={trip.id} onClick={() => setSelected(trip.id)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-[14px] border-2 transition-all active:scale-[0.98]"
                style={{ borderColor: selected === trip.id ? '#F59E0B' : '#DFE1E6', background: selected === trip.id ? '#FEF9F0' : '#fff' }}>
                <span className="text-[28px]">{trip.image}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#15161E]">{trip.name}</p>
                  <p className="text-[11px] text-[#A4ABB8]">{trip.location} · {trip.duration}</p>
                  {trip.spots && <p className="text-[10px] text-[#DC2626] font-semibold mt-0.5">{trip.spots}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-[#A4ABB8] line-through">{trip.originalPrice}</p>
                  <p className="text-[15px] font-extrabold text-[#F59E0B]">{trip.price}</p>
                  <p className="text-[9px] text-[#059669] font-semibold">{trip.discount}</p>
                </div>
              </button>
            ))}
            {selected && (
              <button onClick={() => setPhase('booking')}
                className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #FFBD4C, #F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                Book Now · {chosen?.price}
              </button>
            )}
          </div>
        )}
        {phase === 'booking' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 size={32} className="text-[#F59E0B] mx-auto animate-spin" />
            <p className="text-[14px] font-semibold text-[#15161E]">Booking your trip...</p>
          </div>
        )}
        {phase === 'confirmed' && chosen && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FEF9F0] flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-[#F59E0B]" />
            </div>
            <p className="text-[16px] font-bold text-[#15161E]">Trip Booked!</p>
            <div className="p-3 rounded-[14px] bg-[#F8F9FB] border border-[#DFE1E6] text-left">
              <p className="text-[14px] font-bold text-[#15161E]">{chosen.name}</p>
              <p className="text-[12px] text-[#666D80]">{chosen.location} · {chosen.duration}</p>
              <p className="text-[15px] font-extrabold text-[#F59E0B] mt-1">{chosen.price}</p>
              <p className="text-[10px] text-[#A4ABB8] mt-1">Booking #IHC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            <button className="w-full py-2.5 rounded-[12px] text-[12px] font-bold text-[#F59E0B] bg-[#FEF9F0] border border-[#FDE68A] active:scale-95 transition-all">
              <Calendar size={13} className="inline mr-1" />Add to Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE FLOW: GAMING & TOURNAMENTS
   ═══════════════════════════════════════════ */

function GamingFlow() {
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const TOURNAMENTS = [
    { id: 'fifa', name: 'FIFA Tournament', status: 'Round 2 Today', players: '32 players', prize: 'AED 5,000', icon: '⚽', color: '#DC2626', spots: 'In progress' },
    { id: 'cod', name: 'Call of Duty League', status: 'Registration Open', players: '48/64 slots', prize: 'AED 3,000', icon: '🎯', color: '#9D63F6', spots: '16 spots left' },
    { id: 'padel', name: 'Padel League', status: 'Sign up by Apr 5', players: '24 teams', prize: 'AED 2,000', icon: '🎾', color: '#40C4AA', spots: 'Open' },
    { id: 'chess', name: 'Chess Championship', status: 'Starting Apr 10', players: '20/32 slots', prize: 'AED 1,500', icon: '♟️', color: '#15161E', spots: '12 spots left' },
  ];

  return (
    <div className="mt-2 rounded-[20px] overflow-hidden border border-[#DFE1E6] bg-white shadow-sm">
      <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}>
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <Trophy size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">IHC Gaming Hub</p>
          <p className="text-[11px] text-white/70">Tournaments · Leagues · Activities</p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {TOURNAMENTS.map(t => (
          <div key={t.id} className="p-3 rounded-[14px] border border-[#DFE1E6]">
            <div className="flex items-center gap-3">
              <span className="text-[24px]">{t.icon}</span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-[#15161E]">{t.name}</p>
                <p className="text-[11px] text-[#A4ABB8]">{t.status} · {t.players}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: t.color }}>Prize: {t.prize}</p>
              </div>
              <button
                onClick={() => setRegistered(prev => { const s = new Set(prev); s.has(t.id) ? s.delete(t.id) : s.add(t.id); return s; })}
                className="px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all active:scale-95"
                style={{ background: registered.has(t.id) ? '#059669' : t.color, color: '#fff' }}>
                {registered.has(t.id) ? 'Joined!' : t.id === 'fifa' ? 'View' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI RESPONSE ENGINE (updated with flow triggers)
   ═══════════════════════════════════════════ */

function generateAIResponse(text: string, userName: string, companyId: string): { content: string; cards?: ActionCard[]; flowType?: ChatMessage['flowType']; sellCategory?: string } {
  const t = text.toLowerCase();

  /* ═══════════════════════════════════════════
     SPECIFIC SELL SUB-INTENTS — must come first
     so "sell my car" never falls through to
     generic sell or insurance handlers
     ═══════════════════════════════════════════ */

  if ((t.includes('sell') || t.includes('list') || t.includes('post')) && (t.includes('car') || t.includes('vehicle') || t.includes('auto'))) {
    return {
      content: `Absolutely — I can help you sell your car! Just fill in the make, model, year, mileage, condition, and your asking price below. I'll generate a professional listing and push it to **45,000+ IHC employees** instantly.`,
      flowType: 'sell',
      sellCategory: 'cars',
    };
  }

  if ((t.includes('sell') || t.includes('list') || t.includes('post')) && (t.includes('electronic') || t.includes('phone') || t.includes('iphone') || t.includes('laptop') || t.includes('tablet') || t.includes('ipad') || t.includes('macbook') || t.includes('samsung') || t.includes('gadget'))) {
    return {
      content: `Sure thing! Let's get your device listed. Just provide the brand, model, storage/specs, condition, and price — I'll craft a listing that stands out to **45K+ potential buyers**.`,
      flowType: 'sell',
      sellCategory: 'electronics',
    };
  }

  if ((t.includes('sell') || t.includes('list') || t.includes('post')) && (t.includes('furniture') || t.includes('sofa') || t.includes('desk') || t.includes('chair') || t.includes('table') || t.includes('bed'))) {
    return {
      content: `Great — let's list your furniture! Fill in the item name, material, dimensions, condition, and price. AI will write a polished description for you.`,
      flowType: 'sell',
      sellCategory: 'furniture',
    };
  }

  if ((t.includes('sell') || t.includes('list') || t.includes('post') || t.includes('rent')) && (t.includes('property') || t.includes('apartment') || t.includes('villa') || t.includes('flat') || t.includes('house') || t.includes('room'))) {
    return {
      content: `I can help you list your property! Just tell me the type, bedrooms, area, location, and price — I'll create a professional listing visible to the entire IHC network.`,
      flowType: 'sell',
      sellCategory: 'property',
    };
  }

  /* ═══════════════════════════════════════════
     BOOKING & SERVICE INTENTS
     ═══════════════════════════════════════════ */

  if (t.includes('flight') || t.includes('fly') || t.includes('travel') || t.includes('airport') || t.includes('airline') || t.includes('book a flight')) {
    return {
      content: `Let me help you book a flight, ${userName}! IHC employees get up to **15% off** with Etihad and **10% off** with Emirates. Use the booking tool below:`,
      flowType: 'flights',
    };
  }

  if (t.includes('ride') || t.includes('taxi') || t.includes('cab') || t.includes('careem') || t.includes('uber') || t.includes('transport') || t.includes('book a ride')) {
    return {
      content: `I'll get you a ride right away! As an IHC employee, you get **30% off** on Careem Business rides plus **free airport transfers**. Book below:`,
      flowType: 'rides',
    };
  }

  if (t.includes('food') || t.includes('eat') || t.includes('lunch') || t.includes('dinner') || t.includes('order food') || t.includes('noon') || t.includes('hungry') || t.includes('restaurant') || t.includes('dining') || t.includes('café') || t.includes('cafe') || t.includes('coffee offer')) {
    return {
      content: `Let's get you some food! Noon Food has exclusive IHC discounts at top restaurants nearby, plus **free delivery** for IHC employees:`,
      flowType: 'food',
    };
  }

  if (t.includes('insurance') || t.includes('motor') || t.includes('car insurance') || t.includes('shory') || t.includes('vehicle') || t.includes('plate')) {
    return {
      content: `I can help you get car insurance through **Shory** — IHC's digital insurance platform. IHC employees get an exclusive **15% corporate discount** on all plans. Let's get started:`,
      flowType: 'insurance',
    };
  }

  if (t.includes('vacation') || t.includes('holiday') || t.includes('trip') || t.includes('getaway') || t.includes('beach') || t.includes('resort') || t.includes('staycation')) {
    return {
      content: `Time for a getaway, ${userName}! Here are IHC's exclusive travel deals. Book directly below:`,
      flowType: 'vacation',
    };
  }

  /* ── Sick leave — proactive medical support (must come before gaming) ── */
  if (t.includes('sick leave') || t.includes('sick day') || t.includes('not feeling well') || t.includes('unwell') || t.includes('feeling sick') || t.includes('medical leave') || (t.includes('sick') && (t.includes('leave') || t.includes('day off') || t.includes('rest')))) {
    return {
      content: `I'm sorry to hear that, ${userName}. I can help you submit a sick leave request right away. Your line manager will be notified and you'll get an update once it's reviewed.\n\nYou have **10 sick leave days** available. Under UAE labour law, you're entitled to up to **90 days** of medical leave per year.\n\nHere are some resources that may help:`,
      cards: [
        { type: 'action', icon: Zap, title: 'Submit Sick Leave', subtitle: 'Your manager will be notified for review', color: '#DC2626', link: '/automations/leave-request' },
        { type: 'info', icon: Heart, title: 'Cleveland Clinic Abu Dhabi', subtitle: '2.1 km away · Open 24/7', color: '#059669', action: 'Show me directions to Cleveland Clinic' },
        { type: 'info', icon: Heart, title: 'Mediclinic Al Noor', subtitle: '3.4 km away · Open 24/7', color: '#059669', action: 'Show me directions to Mediclinic' },
        { type: 'info', icon: Shield, title: 'Emergency: Call 998', subtitle: 'Ambulance & emergency services', color: '#DC2626', action: 'Show me emergency contacts' },
      ]
    };
  }

  /* ── General leave request (must come before gaming) ── */
  if (t.includes('leave') || t.includes('vacation day') || t.includes('days off') || t.includes('annual leave') || t.includes('time off') || (t.includes('play') && t.includes('leave'))) {
    return {
      content: `Here's your current leave balance, ${userName}:\n\n• **Annual Leave**: 22 days remaining\n• **Sick Leave**: 10 days available\n• **Emergency Leave**: 5 days per incident\n\nYou can submit a request below — your line manager will be notified and you'll receive an update once it's approved or rejected.`,
      cards: [
        { type: 'action', icon: Zap, title: 'Submit Leave Request', subtitle: 'Manager will be notified for review', color: '#40C4AA', link: '/automations/leave-request' },
        { type: 'info', icon: Calendar, title: 'Leave Balance', subtitle: '22 annual · 10 sick · 5 emergency', color: '#9D63F6', action: 'Show me my detailed leave balance' },
      ]
    };
  }

  if ((t.includes('game') || t.includes('gaming') || t.includes('fifa') || t.includes('tournament') || t.includes('league') || (t.includes('play') && !t.includes('leave') && !t.includes('sick'))) && !t.includes('leave') && !t.includes('sick')) {
    return {
      content: `Here's what's happening in IHC Gaming! Register for tournaments and leagues below:`,
      flowType: 'gaming',
    };
  }

  if (t.includes('gym') || t.includes('palms sports') || t.includes('fitness') || t.includes('membership')) {
    return {
      content: `Your **Palms Sports** corporate membership details:\n\n• **Monthly fee**: AED 150 (60% off standard)\n• **Locations**: 8 venues across Abu Dhabi\n• **Includes**: Gym, pool, padel, group classes\n• **Family add-on**: +AED 100/member\n\nYou're saving **AED 2,700/year** with your corporate rate!`,
      cards: [
        { type: 'action', icon: Heart, title: 'Activate Membership', subtitle: 'Palms Sports · AED 150/mo', color: '#EA580C', action: 'I want to activate my Palms Sports membership' },
        { type: 'info', icon: MapPin, title: 'Find Nearest Location', subtitle: '8 venues across Abu Dhabi', color: '#40C4AA', action: 'Show me Palms Sports locations near me' },
      ]
    };
  }

  if (t.includes('coffee') || t.includes('café nearby') || t.includes('nearby café') || t.includes('nearby coffee')) {
    return {
      content: `Your daily coffee benefit:\n\n• **1 free coffee per day** at 25+ cafés\n• Partners include **Starbucks**, **%Arabica**, **Tim Hortons**\n• Simply scan your **Ahli Connect QR** at the counter\n• Annual value: **AED 600+**`,
      cards: [
        { type: 'info', icon: Coffee, title: 'Nearest Starbucks', subtitle: '0.3 km · IHC Tower Lobby', color: '#92400E', action: 'Where is the nearest Starbucks' },
        { type: 'info', icon: Coffee, title: 'Nearest %Arabica', subtitle: '0.8 km · The Galleria', color: '#92400E', action: 'Where is the nearest Arabica café' },
      ]
    };
  }

  if (t.includes('course') || t.includes('learning') || t.includes('academy') || t.includes('certification') || t.includes('training')) {
    return {
      content: `Your **IHC Academy** education benefit:\n\n• **Budget**: AED 15,000/year (AED 9,800 remaining)\n• **Courses**: 2,000+ from LinkedIn Learning, Coursera\n• **Completed**: 4 courses this year\n• **Certificates**: Available for all completed courses`,
      cards: [
        { type: 'action', icon: GraduationCap, title: 'Browse All Courses', subtitle: '2,000+ courses · Online + IRL', color: '#9D63F6', link: '/explore' },
        { type: 'info', icon: Star, title: 'Recommended: AI Fundamentals', subtitle: '8 hours · Certificate included', color: '#FFBD4C', action: 'Tell me about the AI Fundamentals course' },
      ]
    };
  }

  if (t.includes('portal') || t.includes('oracle') || t.includes('sap') || t.includes('workday') || t.includes('it system') || t.includes('ihc portal')) {
    return {
      content: `Quick access to all IHC group systems:\n\n• **Oracle HR** — Payroll & leave\n• **SAP** — Finance & procurement\n• **Workday** — Performance & goals\n• **IT Helpdesk** — Tickets & support\n\nAll use **SSO** — single sign-on with your IHC credentials.`,
      cards: [
        { type: 'action', icon: Monitor, title: 'Open Oracle HR', subtitle: 'Payroll, leave, personal details', color: '#DC2626', link: '/explore' },
        { type: 'action', icon: Monitor, title: 'IT Helpdesk', subtitle: 'Raise tickets · 24/7 support', color: '#7C3AED', action: 'I need IT support' },
      ]
    };
  }

  if (/\bhr\b/.test(t) || t.includes('human resource') || t.includes('salary cert') || t.includes('leave request') || t.includes('payslip') || t.includes('noc letter') || t.includes('employment letter') || t.includes('onboarding') || t.includes('offboarding') || t.includes('transfer request') || t.includes('grievance') || t.includes('hr service') || t.includes('hr help') || t.includes('hr request') || t.includes('hr support')) {
    return {
      content: `Here are all the HR services available to you, ${userName}. Everything is AI-powered for instant processing:\n\n• **Salary Certificate** — auto-generated with digital QR verification\n• **Leave Management** — annual, sick, emergency, compassionate\n• **Expense Claims** — snap a receipt, AI does the rest\n• **Payslips** — download current or past months instantly\n• **NOC / Employment Letters** — ready in under 60 seconds\n• **Transfer Requests** — apply for internal mobility\n• **Grievance Portal** — confidential HR support\n\nWhat would you like to do?`,
      cards: [
        { type: 'action', icon: Zap, title: 'Generate Salary Certificate', subtitle: 'Instant PDF with QR verification', color: '#40C4AA', link: '/automations/salary-certificate' },
        { type: 'action', icon: Calendar, title: 'Submit Leave Request', subtitle: 'Smart approval pipeline', color: '#9D63F6', link: '/automations/leave-request' },
        { type: 'action', icon: Receipt, title: 'Submit Expense Claim', subtitle: 'AI receipt scanner · auto-process', color: '#FFBD4C', link: '/automations/expense-claim' },
        { type: 'action', icon: FileText, title: 'Download Payslip', subtitle: 'March 2026 · PDF ready', color: '#54B6ED', action: 'Show me my latest payslip' },
        { type: 'action', icon: Shield, title: 'NOC / Employment Letter', subtitle: 'Auto-generated in < 60 seconds', color: '#059669', action: 'I need an NOC letter' },
        { type: 'info', icon: Users, title: 'HR Helpdesk', subtitle: 'Chat with HR team directly', color: '#7C3AED', action: 'Connect me to HR helpdesk' },
      ]
    };
  }

  if (t.includes('people map') || t.includes('nearby colleague') || t.includes('who is nearby') || t.includes('around me') || t.includes('colleagues near') || t.includes('team map')) {
    return {
      content: `The **People Map** lets you see nearby IHC colleagues across all subsidiaries. You can filter by company, distance, or availability. Only colleagues who have enabled location sharing are visible — your privacy is always respected.`,
      cards: [
        { type: 'action', icon: MapPin, title: 'Open People Map', subtitle: 'See nearby IHC colleagues', color: '#9D63F6', link: '/people-map' },
        { type: 'info', icon: Shield, title: 'Privacy Settings', subtitle: 'Control your visibility', color: '#40C4AA', link: '/profile' },
      ]
    };
  }

  if (t.includes('directory') || t.includes('find someone') || t.includes('employee search') || t.includes('search employee') || t.includes('org chart')) {
    return {
      content: `Search the **IHC Employee Directory** with 45,000+ profiles across 30+ subsidiaries. You can find colleagues by name, department, or role.`,
      cards: [
        { type: 'action', icon: Users, title: 'Open Employee Directory', subtitle: '45,000+ employees · 30+ companies', color: '#9D63F6', link: '/explore' },
        { type: 'action', icon: Building2, title: 'View Org Chart', subtitle: 'Your team structure', color: '#54B6ED', action: 'Show me my team org chart' },
      ]
    };
  }

  if (t.includes('meeting room') || t.includes('book a room') || t.includes('co-work') || t.includes('hot desk') || t.includes('business centre')) {
    return {
      content: `Book workspace across **14 IHC locations** in Abu Dhabi and Dubai:\n\n• **Meeting rooms** — free for employees\n• **Hot desks** — instant booking\n• **Private offices** — for focused work\n• All include AV equipment & WiFi`,
      cards: [
        { type: 'action', icon: Briefcase, title: 'Book Meeting Room', subtitle: '14 locations · Free for employees', color: '#059669', action: 'I need a meeting room for tomorrow at 10am' },
        { type: 'action', icon: MapPin, title: 'View Locations', subtitle: 'Abu Dhabi & Dubai', color: '#7C3AED', link: '/explore' },
      ]
    };
  }

  if (t.includes('yas island') || t.includes('ticket') || t.includes('theme park') || t.includes('waterworld') || t.includes('ferrari world') || t.includes('warner')) {
    return {
      content: `Your **Yas Island Leisure Pass** benefits:\n\n• **40% off** Ferrari World, Yas Waterworld, Warner Bros. World\n• **Priority access** on weekdays\n• **20% off** F&B at all parks\n• Valid for you + **3 guests**\n\nBook through the app for instant digital tickets!`,
      cards: [
        { type: 'action', icon: Ticket, title: 'Get Yas Island Passes', subtitle: '40% off · Valid for 4 people', color: '#9D63F6', link: '/offers' },
        { type: 'info', icon: Star, title: 'Ferrari World', subtitle: 'World\'s fastest rollercoaster', color: '#DC2626', action: 'Tell me about Ferrari World Abu Dhabi' },
      ]
    };
  }

  if (t.includes('benefit') || t.includes('medical') || t.includes('health insurance') || t.includes('wellness')) {
    return {
      content: `Your benefits summary, ${userName}:\n\n• **Medical** — Daman Enhanced (family)\n• **Life Insurance** — 24x monthly salary\n• **Gym** — AED 150/month at Palms Sports\n• **Education** — AED 20,000/year\n\nTotal value: ~**AED 85,000/year**!`,
      cards: [
        { type: 'info', icon: Heart, title: 'Medical Coverage', subtitle: 'Daman Enhanced · Family plan', color: '#DC2626', action: 'Tell me about my medical insurance details' },
        { type: 'info', icon: Shield, title: 'Life Insurance', subtitle: '24x salary · Group coverage', color: '#9D63F6', action: 'Tell me about my life insurance coverage' },
        { type: 'offer', icon: Gift, title: 'All 12 Benefits', subtitle: 'View complete package', color: '#FFBD4C', link: '/offers' },
      ]
    };
  }

  if (t.includes('offer') || t.includes('discount') || t.includes('deal') || t.includes('save') || t.includes('promo')) {
    return {
      content: `Best employee offers right now:\n\n• **Aldar** — 15% off Yas Island residences\n• **Shory** — Motor insurance from AED 799/year\n• **PureHealth** — Health screening AED 299\n• **Ghitha** — 25% meal subsidy`,
      cards: OFFERS.slice(0, 3).map(offer => ({
        type: 'offer' as const, icon: Gift, title: offer.title,
        subtitle: `${offer.company} · ${offer.value}`, color: offer.color || '#FFBD4C', image: offer.image, link: '/offers',
      })),
    };
  }

  /* ── Events / Activities / What's happening ── */
  if (t.includes('event') || t.includes('happening') || t.includes('what\'s on') || t.includes('whats on') || t.includes('activities') || t.includes('things to do') || t.includes('what\'s going on') || t.includes('whats going on') || t.includes('upcoming') || t.includes('anything going on') || t.includes('what can i do') || /\bfun\b/.test(t) || t.includes('social')) {
    return {
      content: `Here's what's happening across IHC right now, ${userName}! 🎉\n\n**🏆 Gaming & Tournaments**\n• FIFA Tournament — Round 2 happening today (32 players)\n• Call of Duty League — 16 spots left, registration open\n• Chess Championship — Starting Apr 10\n\n**🏋️ Sports & Fitness**\n• Padel League — Sign up by Apr 5 (24 teams)\n• Palms Sports Corporate Challenge — Apr 12\n• Morning Yoga sessions — Every Tuesday & Thursday 7AM\n\n**🎓 Learning & Development**\n• AI Fundamentals Workshop — Apr 8, 10AM\n• Leadership Masterclass — Apr 15\n• Public Speaking Bootcamp — Apr 20\n\n**🎉 Social & Community**\n• IHC Town Hall — Apr 7, 2PM (Virtual + In-person)\n• Ramadan Iftar Gathering — Apr 9, 6:30PM\n• Earth Day Volunteering — Apr 22\n\nWant details on any of these?`,
      cards: [
        { type: 'action', icon: Gamepad2, title: 'Gaming Hub', subtitle: 'FIFA, COD, Chess & more', color: '#DC2626', action: 'Show me gaming tournaments' },
        { type: 'action', icon: Heart, title: 'Fitness & Sports', subtitle: 'Padel, Yoga, Gym deals', color: '#40C4AA', action: 'Tell me about fitness events' },
        { type: 'action', icon: GraduationCap, title: 'Learning Events', subtitle: 'Workshops & certifications', color: '#9D63F6', action: 'Show me learning courses' },
        { type: 'info', icon: Calendar, title: 'View Full Calendar', subtitle: 'All upcoming IHC events', color: '#54B6ED', link: '/explore' },
      ]
    };
  }

  /* ── Generic sell (no specific category detected) ── */
  if (t.includes('sell') || t.includes('list something') || t.includes('create listing') || t.includes('sell something')) {
    return {
      content: `Let's list your item on the IHC Marketplace! AI will help you create a professional listing in seconds:`,
      flowType: 'sell',
    };
  }

  if (t.includes('marketplace') || t.includes('buy') || t.includes('listing') || t.includes('browse')) {
    return {
      content: `The IHC Marketplace connects 45,000+ employees!\n\n• **Active listings**: 234 items\n• **Trending**: Cars, electronics, furniture`,
      cards: [
        { type: 'action', icon: ShoppingBag, title: 'Open Marketplace', subtitle: '234 items from verified employees', color: '#FFBD4C', link: '/marketplace' },
        { type: 'action', icon: Star, title: 'Sell Something', subtitle: 'AI writes your listing from a photo', color: '#40C4AA', action: 'I want to sell something on the marketplace' },
      ]
    };
  }

  /* ── Sick leave & general leave handlers moved above gaming intent ── */

  if (t.includes('salary') || t.includes('payslip') || t.includes('certificate') || t.includes('pay')) {
    return {
      content: `Salary options:\n\n• **March payslip** ready to download\n• **Salary certificates** — now instant with automation!\n• **Next salary credit**: April 28th`,
      cards: [
        { type: 'action', icon: Zap, title: 'Generate Salary Certificate', subtitle: 'Automated — ready in < 30 seconds', color: '#40C4AA', link: '/automations/salary-certificate' },
        { type: 'info', icon: DollarSign, title: 'View March Payslip', subtitle: 'Download PDF · March 2026', color: '#40C4AA', action: 'Show me my March 2026 payslip details' },
      ]
    };
  }

  if (t.includes('expense') || t.includes('receipt') || t.includes('reimburse') || t.includes('claim') || t.includes('reimbursement')) {
    return {
      content: `Expense management:\n\n• **AI Expense Processor** — snap a receipt, AI does the rest!\n• **Pending claims**: 0\n• **Last reimbursement**: AED 420 (31 Mar)`,
      cards: [
        { type: 'action', icon: Zap, title: 'Submit Expense Claim', subtitle: 'AI-powered — receipt to reimbursement in 2 min', color: '#40C4AA', link: '/automations/expense-claim' },
        { type: 'info', icon: Receipt, title: 'Expense History', subtitle: '3 claims this month · AED 1,142', color: '#9D63F6', action: 'Show me my expense history for this month' },
      ]
    };
  }

  if (t.includes('automat') || t.includes('workflow') || t.includes('process')) {
    return {
      content: `Here are the automations available to you:\n\n• **Salary Certificate** — Instant PDF with digital verification\n• **Smart Leave Manager** — Auto-balance, conflict check, approval pipeline\n• **AI Expense Processor** — Receipt scanning with policy compliance\n\nTogether these save **347 hours/week** across IHC.`,
      cards: [
        { type: 'action', icon: FileText, title: 'Salary Certificate', subtitle: 'Generate in < 30 seconds', color: '#9D63F6', link: '/automations/salary-certificate' },
        { type: 'action', icon: Calendar, title: 'Leave Request', subtitle: 'Automated approval pipeline', color: '#40C4AA', link: '/automations/leave-request' },
        { type: 'action', icon: Receipt, title: 'Expense Claim', subtitle: 'AI receipt extraction', color: '#FFBD4C', link: '/automations/expense-claim' },
      ]
    };
  }

  return {
    content: `I'm your AI assistant for everything at IHC! I can help with:\n\n• Book flights with employee discounts\n• Book rides via Careem\n• Order food from Noon\n• Get motor insurance via Shory\n• View benefits, offers & discounts\n\nJust ask me anything, ${userName}!`,
    cards: [
      { type: 'booking', icon: Plane, title: 'Book a Flight', subtitle: 'Employee-discounted rates', color: '#9D63F6', action: 'I want to book a flight' },
      { type: 'booking', icon: Car, title: 'Book a Ride', subtitle: 'Careem · 30% IHC discount', color: '#40C4AA', action: 'I need to book a ride' },
      { type: 'booking', icon: UtensilsCrossed, title: 'Order Food', subtitle: 'Noon Food · Free delivery', color: '#FFBD4C', action: 'I want to order food' },
      { type: 'booking', icon: Shield, title: 'Motor Insurance', subtitle: 'Shory · 15% IHC discount', color: '#7C3AED', action: 'I need car insurance' },
    ]
  };
}

/* ═══════════════════════════════════════════
   SUGGESTION CARDS
   ═══════════════════════════════════════════ */

const SUGGESTIONS = [
  { icon: Car, label: 'Sell My Car', prompt: 'I want to sell my car', color: '#9D63F6', bg: '#F3EEFF' },
  { icon: Monitor, label: 'Post Electronics', prompt: 'I want to post electronics for sale', color: '#40C4AA', bg: '#EDFAF6' },
  { icon: HelpCircle, label: 'Need Help', prompt: 'I need help with something', color: '#54B6ED', bg: '#EBF6FF' },
  { icon: Gift, label: 'Find Offers', prompt: 'Show me the best offers', color: '#FFBD4C', bg: '#FFF8EB' },
  { icon: Plane, label: 'Book Flight', prompt: 'I want to book a flight', color: '#7C3AED', bg: '#F0EAFF' },
  { icon: Shield, label: 'Insurance', prompt: 'I need motor insurance', color: '#0D9488', bg: '#EDFCFA' },
  { icon: ShoppingBag, label: 'Marketplace', prompt: 'Take me to the marketplace', color: '#EA580C', bg: '#FFF4EC' },
  { icon: Briefcase, label: 'HR Services', prompt: 'I need HR help', color: '#6366F1', bg: '#EEEEFF' },
];

/* ═══════════════════════════════════════════
   MAIN PAGE — Dark premium AI interface
   ═══════════════════════════════════════════ */

function ServicesPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const autoPromptSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const userName = user?.name?.split(' ')[0] || 'there';
  const companyId = user?.companyId || 'ihc';

  /* ── Speech Recognition helper ── */
  function createSpeechRecognition(): SpeechRecognition | null {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = 'en-US';
    return r;
  }

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition();
    }
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Voice input is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    let finalTranscript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setInputValue(finalTranscript || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        setTimeout(() => {
          handleSend(finalTranscript.trim());
          setInputValue('');
        }, 300);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (process.env.NODE_ENV === 'development') console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings.');
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscript = '';
      setInputValue('');
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || inputValue.trim();
    if (!msg) return;
    setInputValue('');
    const userMsgId = nextMsgId();
    const typingMsgId = nextMsgId();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: msg }]);
    setMessages(prev => [...prev, { id: typingMsgId, role: 'ai', content: '', typing: true }]);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const response = generateAIResponse(msg, userName, companyId);
    const aiMsgId = nextMsgId();
    setMessages(prev => [
      ...prev.filter(m => !m.typing),
      { id: aiMsgId, role: 'ai', content: response.content, cards: response.cards, flowType: response.flowType, sellCategory: response.sellCategory },
    ]);
  };

  /* Auto-trigger prompt from URL query param (e.g. ?prompt=Book+a+flight) */
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt && !autoPromptSentRef.current && user) {
      autoPromptSentRef.current = true;
      handleSend(prompt);
    }
  }, [searchParams, user]);

  if (!user) return null;
  const company = COMPANIES.find(c => c.id === user.companyId);

  /* ── Chat mode ── */
  if (messages.length > 0) {
    return (
      <div className="flex flex-col h-screen-safe bg-[#F8F9FB] overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 shrink-0 z-10 bg-white" style={{ borderBottom: '1px solid #DFE1E6' }}>
          <button onClick={() => setMessages([])} className="p-1.5 rounded-lg text-[#666D80] hover:text-[#15161E] hover:bg-[#F8F9FB] transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center shadow-md">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#15161E]">Ahli AI</p>
              <p className="text-[10px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>
        </div>

        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto">
        <div className="px-3 md:px-6 py-4 space-y-3 max-w-4xl mx-auto w-full pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div className="max-w-md md:max-w-lg lg:max-w-2xl">
                {msg.typing ? (
                  <div className="bg-white border border-[#DFE1E6] rounded-[16px] rounded-bl-[4px] px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-[#9D63F6]/40"
                          style={{ animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-[#9D63F6] text-white rounded-[16px] rounded-br-[4px]'
                          : 'bg-white text-[#15161E] rounded-[16px] rounded-bl-[4px] border border-[#DFE1E6] shadow-sm'
                      }`}
                    >
                      {msg.content.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                      )}
                    </div>

                    {/* Inline Interactive Flows */}
                    {msg.flowType === 'insurance' && <InsuranceFlow />}
                    {msg.flowType === 'rides' && <RidesFlow />}
                    {msg.flowType === 'food' && <FoodFlow />}
                    {msg.flowType === 'flights' && <FlightsFlow />}
                    {msg.flowType === 'sell' && <SellFlow initialCategory={msg.sellCategory} />}
                    {msg.flowType === 'vacation' && <VacationFlow />}
                    {msg.flowType === 'gaming' && <GamingFlow />}

                    {msg.cards && msg.cards.length > 0 && (
                      <div className="mt-2 space-y-2 flex flex-col">
                        {msg.cards.map((card, ci) => {
                          const IconComp = card.icon;
                          return (
                            <button
                              key={ci}
                              onClick={() => {
                                if (card.link) router.push(card.link);
                                else if (card.action) handleSend(card.action);
                              }}
                              className="w-full flex items-center gap-3 bg-white border border-[#DFE1E6] rounded-[14px] p-3 text-left hover:shadow-md md:hover:shadow-lg active:scale-[0.98] transition-all"
                            >
                              {card.image ? (
                                <img src={card.image} alt={card.title} className="w-10 h-10 rounded-[10px] object-cover shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                  style={{ background: card.color + '15' }}>
                                  <IconComp size={18} style={{ color: card.color }} strokeWidth={1.8} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-[#15161E]">{card.title}</p>
                                <p className="text-[11px] text-[#A4ABB8]">{card.subtitle}</p>
                              </div>
                              <ArrowRight size={14} className="text-[#A4ABB8] shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick chips */}
        {messages.length > 0 && messages[messages.length - 1]?.role === 'ai' && !messages[messages.length - 1]?.typing && (
          <div className="px-3 md:px-6 lg:px-8 pb-2 max-w-4xl mx-auto w-full">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['Flights', 'Rides', 'Food', 'Insurance', 'Benefits', 'Gaming', 'Offers'].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="shrink-0 text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-white text-[#9D63F6] border border-[#DFE1E6] transition-all active:scale-95 hover:shadow-md md:hover:bg-white/90"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
        </div>{/* end scrollable area */}

        {/* Input bar — fixed at bottom, outside scroll */}
        <div className="shrink-0 px-3 md:px-6 py-3 bg-white" style={{ borderTop: '1px solid #DFE1E6' }}>
          <div className="flex items-center gap-2 rounded-[16px] px-3 py-2 bg-[#F8F9FB] border border-[#DFE1E6] max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Message Ahli AI"
              className="flex-1 bg-transparent text-sm text-[#15161E] placeholder:text-[#A4ABB8] py-2.5 outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-full bg-[#9D63F6] flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
              style={{ display: inputValue.trim() ? 'flex' : 'none' }}
            >
              <Send size={14} />
            </button>
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-full transition-all ${isListening ? 'bg-red-50' : ''}`}
              style={{ display: inputValue.trim() ? 'none' : 'block' }}
            >
              <Mic size={18} className={isListening ? 'text-red-500 animate-pulse' : 'text-[#A4ABB8] hover:text-[#666D80]'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     WELCOME STATE — Premium AI Assistant Experience
     ══════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-screen-safe relative overflow-hidden">

      {/* ── Full-page pastel gradient background ── */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(165deg, #F4EFFF 0%, #EDE8FF 15%, #F0EEFF 25%, #EBF0FF 40%, #F2EDFF 55%, #FEECF4 75%, #F5EEFF 90%, #EBF3FF 100%)',
      }}>
        {/* Soft radial overlays for depth */}
        <div className="absolute" style={{ top: '-10%', right: '-20%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(177,130,248,0.12) 0%, transparent 70%)' }} />
        <div className="absolute" style={{ bottom: '5%', left: '-15%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(84,182,237,0.08) 0%, transparent 70%)' }} />
        <div className="absolute" style={{ top: '40%', right: '10%', width: '30%', height: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,189,76,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* ═══ HEADER ═══ */}
      <div className="relative z-10 shrink-0 flex items-center justify-center px-5 pt-[max(env(safe-area-inset-top),12px)] pb-3">
        <Link href="/dashboard" className="absolute left-4 top-[max(env(safe-area-inset-top),12px)] p-2 rounded-full text-[#666D80]/70 hover:text-[#15161E] hover:bg-white/50 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-1.5 ahli-fade">
          <Sparkles size={14} className="text-[#9D63F6]" />
          <p className="text-[14px] font-semibold text-[#3D3D5C]">Ahli AI</p>
        </div>
      </div>

      {/* ═══ SCROLLABLE MAIN CONTENT ═══ */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="flex flex-col items-center max-w-lg mx-auto px-5 pb-4">

          {/* ═══ GREETING ═══ */}
          <div className="text-center pt-4 pb-2 ahli-fade">
            <p className="text-[14px] text-[#9D63F6] font-medium mb-1">Hello, {userName}!</p>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#1E1E3A] leading-tight">
              How can I help you<br />today?
            </h1>
          </div>

          {/* ═══ ANIMATED ORB ═══ */}
          <div className="relative flex items-center justify-center my-6 ahli-fade-d1" style={{ width: 240, height: 240 }}>

            {/* Ambient glow */}
            <div className="absolute ahli-orb-glow" style={{
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(157,99,246,0.2) 0%, rgba(157,99,246,0.06) 40%, transparent 65%)',
              left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            }} />

            {/* Orbit ring 1 */}
            <div className="absolute ahli-orb-ring" style={{
              width: 230, height: 230, borderRadius: '50%',
              border: '1px solid rgba(157,99,246,0.08)',
              left: '50%', top: '50%', marginLeft: -115, marginTop: -115,
            }}>
              <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full" style={{ background: 'rgba(177,130,248,0.5)' }} />
            </div>

            {/* Orbit ring 2 */}
            <div className="absolute ahli-orb-ring-rev" style={{
              width: 200, height: 200, borderRadius: '50%',
              border: '1px dashed rgba(157,99,246,0.06)',
              left: '50%', top: '50%', marginLeft: -100, marginTop: -100,
            }}>
              <div className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(255,189,76,0.45)' }} />
            </div>

            {/* Floating particles */}
            <div className="absolute ahli-p1" style={{ top: '8%', left: '18%' }}>
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: 'rgba(157,99,246,0.35)' }} />
            </div>
            <div className="absolute ahli-p2" style={{ top: '18%', right: '14%' }}>
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(84,182,237,0.4)' }} />
            </div>
            <div className="absolute ahli-p3" style={{ bottom: '12%', left: '14%' }}>
              <div className="w-[4px] h-[4px] rounded-full" style={{ background: 'rgba(255,189,76,0.45)' }} />
            </div>

            {/* ── THE ORB ── */}
            <div className="ahli-orb-float relative" style={{ width: 150, height: 150 }}>
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
                <defs>
                  <radialGradient id="wo-main" cx="0.4" cy="0.35" r="0.65" fx="0.35" fy="0.3">
                    <stop offset="0%" stopColor="#F0ECFF" />
                    <stop offset="20%" stopColor="#DDD2FF" />
                    <stop offset="45%" stopColor="#B88DF8" />
                    <stop offset="70%" stopColor="#9D63F6" />
                    <stop offset="100%" stopColor="#7247C4" />
                  </radialGradient>
                  <radialGradient id="wo-hi" cx="0.33" cy="0.27" r="0.38" fx="0.28" fy="0.23">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="wo-rim" cx="0.73" cy="0.58" r="0.32">
                    <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="wo-depth" cx="0.5" cy="0.72" r="0.45">
                    <stop offset="0%" stopColor="#5B2FB0" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#5B2FB0" stopOpacity="0" />
                  </radialGradient>
                  <filter id="wo-noise" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch" result="n" />
                    <feColorMatrix type="saturate" values="0" in="n" result="gn" />
                    <feBlend in="SourceGraphic" in2="gn" mode="overlay" result="noisy" />
                    <feComposite in="noisy" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="wo-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>
                  <filter id="wo-shadow" x="-30%" y="-20%" width="160%" height="170%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
                    <feOffset dx="0" dy="10" />
                    <feColorMatrix values="0 0 0 0 0.38 0 0 0 0 0.24 0 0 0 0 0.76 0 0 0 0.18 0" />
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <g filter="url(#wo-shadow)">
                  <circle cx="75" cy="75" r="67" fill="url(#wo-main)" />
                  <circle cx="75" cy="75" r="67" fill="url(#wo-main)" filter="url(#wo-noise)" opacity="0.55" />
                  <circle cx="75" cy="75" r="67" fill="url(#wo-depth)" />
                  <circle cx="75" cy="75" r="67" fill="url(#wo-hi)" />
                  <circle cx="75" cy="75" r="67" fill="url(#wo-rim)" />
                  <ellipse cx="54" cy="44" rx="16" ry="11" fill="white" opacity="0.18" filter="url(#wo-blur)" />
                </g>
              </svg>

              {/* Rotating inner conic glow */}
              <div className="absolute inset-0" style={{
                width: 150, height: 150, borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(157,99,246,0) 0%, rgba(177,130,248,0.12) 25%, rgba(255,255,255,0.08) 50%, rgba(157,99,246,0) 75%)',
                mixBlendMode: 'overlay',
                clipPath: 'circle(44% at 50% 50%)',
                animation: 'ahli-orb-rotate 10s linear infinite',
              }} />

              {/* Drifting highlight */}
              <div className="absolute ahli-orb-highlight" style={{
                width: 55, height: 55, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)',
                top: '12%', left: '18%', filter: 'blur(10px)',
              }} />

              {/* Shimmer particle */}
              <div className="absolute ahli-shimmer" style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(255,255,255,0.75)',
                top: '50%', left: '50%', marginTop: -2.5, marginLeft: -2.5,
                filter: 'blur(0.5px)',
              }} />

              {/* Minimal abstract "face" — two tiny eye marks */}
              <div className="absolute flex gap-[14px] items-center justify-center" style={{ top: '43%', left: '50%', transform: 'translateX(-50%)' }}>
                <div className="w-[3px] h-[10px] rounded-full bg-white/40" />
                <div className="w-[3px] h-[10px] rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          {/* ═══ 2-COLUMN QUICK ACTION BENTO GRID ═══ */}
          <div className="w-full ahli-fade-d2">
            <p className="text-[11px] font-semibold text-[#9D63F6]/60 uppercase tracking-wider mb-3 text-center">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2.5">
              {SUGGESTIONS.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className="ahli-card text-left rounded-[16px] p-3.5 active:scale-[0.96] transition-all duration-200 group"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(157,99,246,0.04)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-[11px] flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: s.bg }}
                    >
                      <SIcon size={17} style={{ color: s.color }} strokeWidth={2} />
                    </div>
                    <p className="text-[12px] font-semibold text-[#1E1E3A] mb-0.5 leading-tight">{s.label}</p>
                    <p className="text-[10px] text-[#8E8EA9] leading-snug">{s.prompt}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spacer for input bar */}
          <div className="h-24" />
        </div>
      </div>

      {/* ═══ PREMIUM INPUT BAR ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-4" style={{
        background: 'linear-gradient(to top, rgba(240,236,255,0.98) 60%, rgba(240,236,255,0) 100%)',
      }}>
        <div className="max-w-lg mx-auto">
          <div
            className="flex items-center gap-2.5 rounded-full px-4 py-2 ahli-input-glow"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <Paperclip size={18} className="text-[#A4ABB8] shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-[14px] text-[#1E1E3A] placeholder:text-[#B4B4CC] py-2.5 outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shrink-0"
              style={{ background: 'linear-gradient(135deg, #9D63F6, #7C3AED)', boxShadow: '0 3px 12px rgba(157,99,246,0.35)', display: inputValue.trim() ? 'flex' : 'none' }}
            >
              <Send size={15} />
            </button>
            <button
              onClick={toggleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${isListening ? '' : 'ahli-mic-pulse'}`}
              style={{ background: isListening ? 'rgba(239,68,68,0.12)' : 'rgba(157,99,246,0.08)', display: inputValue.trim() ? 'none' : 'flex' }}
            >
              {isListening ? (
                <div className="flex items-center gap-[3px]">
                  <div className="w-[3px] h-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-[3px] h-4 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <div className="w-[3px] h-2.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              ) : (
                <Mic size={17} className="text-[#9D63F6]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesFallback() {
  return (
    <div className="flex flex-col h-screen-safe relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(165deg, #F4EFFF 0%, #EDE8FF 15%, #F0EEFF 25%, #EBF0FF 40%, #F2EDFF 55%, #FEECF4 75%, #F5EEFF 90%, #EBF3FF 100%)',
      }} />
      {/* Header */}
      <div className="relative z-10 shrink-0 flex items-center justify-center px-5 pt-[max(env(safe-area-inset-top),12px)] pb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#9D63F6]" />
          <p className="text-[14px] font-semibold text-[#3D3D5C]">Ahli AI</p>
        </div>
      </div>
      {/* Center loading */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#9D63F6]" size={32} />
      </div>
      {/* Input bar always visible */}
      <div className="relative z-20 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-4" style={{
        background: 'linear-gradient(to top, rgba(240,236,255,0.98) 60%, rgba(240,236,255,0) 100%)',
      }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 rounded-full px-4 py-2"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(157,99,246,0.06), 0 0 0 1px rgba(223,225,230,0.5)' }}>
            <Paperclip size={18} className="text-[#A4ABB8] shrink-0" />
            <input type="text" disabled placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-[14px] text-[#1E1E3A] placeholder:text-[#B4B4CC] py-2.5 outline-none" />
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(157,99,246,0.08)' }}>
              <Mic size={17} className="text-[#9D63F6]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesFallback />}>
      <ServicesPageContent />
    </Suspense>
  );
}
