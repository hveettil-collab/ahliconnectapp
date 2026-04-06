'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Shield, Heart, Home, PawPrint, ChevronRight, Plus,
  Users, Car, Calendar, CreditCard, FileText, Clock, X, Download,
  Phone, Mail, MapPin, Cake,
} from 'lucide-react';

interface Dependent {
  name: string;
  relation: string;
  initial: string;
  dob: string;
  gender: string;
  emiratesId: string;
  cardNo: string;
  network: string;
  status: string;
}

const DEPENDENTS: Dependent[] = [
  { name: 'Fatima A.', relation: 'Spouse', initial: 'FA', dob: 'March 15, 1992', gender: 'Female', emiratesId: '784-1992-XXXXXXX-X', cardNo: 'DAM-2025-98761', network: 'Enhanced', status: 'Active' },
  { name: 'Omar A.', relation: 'Child · Age 8', initial: 'OA', dob: 'June 22, 2017', gender: 'Male', emiratesId: '784-2017-XXXXXXX-X', cardNo: 'DAM-2025-98762', network: 'Enhanced', status: 'Active' },
  { name: 'Sara A.', relation: 'Child · Age 5', initial: 'SA', dob: 'Nov 3, 2020', gender: 'Female', emiratesId: '784-2020-XXXXXXX-X', cardNo: 'DAM-2025-98763', network: 'Enhanced', status: 'Active' },
];

export default function InsurancePage() {
  const router = useRouter();
  const [selectedDep, setSelectedDep] = useState<Dependent | null>(null);

  useBodyScrollLock(!!selectedDep);

  return (
    <AppShell title="Insurance" subtitle="" hideTopBar>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .slide-up { animation: slide-up 0.35s cubic-bezier(0.23,1,0.32,1); }
      `}</style>

      <div style={{ overscrollBehaviorX: 'none' }}>
        {/* Hero header */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #059669 0%, #047857 40%, #065F46 70%, #F8F9FB 100%)', minHeight: 180 }}>
          <div className="relative z-20 flex items-center px-5 pt-5">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h2 className="text-[16px] font-bold text-white ml-3">My Insurance</h2>
          </div>
          <div className="relative z-10 px-5 mt-5 pb-10">
            <p className="text-[28px] font-extrabold text-white leading-tight">2 Active</p>
            <p className="text-[13px] text-white/60">Insurance Policies</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-20 space-y-4 pb-32">

          {/* ═══ Car Insurance ═══ */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm">
            <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Car size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-white">Car Insurance</p>
                <p className="text-[11px] text-white/60">Comprehensive Plan</p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white">Active</span>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Policy No.', value: 'SHR-2025-78432' },
                  { label: 'Provider', value: 'Shory Insurance' },
                  { label: 'Vehicle', value: 'Toyota Land Cruiser' },
                  { label: 'Coverage', value: 'Comprehensive' },
                  { label: 'Premium', value: 'AED 1,274/yr' },
                  { label: 'Expiry', value: 'May 22, 2026' },
                ].map(item => (
                  <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                    <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold text-white active:scale-[0.97] transition-all" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                    <Download size={13} /> Policy Certificate
                  </button>
                  <Link href="/services?prompt=I+need+to+renew+my+car+insurance" className="flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold text-[#15161E] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-[0.97] transition-all no-underline">
                    <Shield size={13} /> Renew
                  </Link>
                </div>
                <p className="text-[9px] text-[#A4ABB8] font-semibold">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
              </div>
            </div>
          </div>

          {/* ═══ Health Insurance ═══ */}
          <div className="rounded-[20px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm">
            <div className="p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9D63F6 100%)' }}>
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Heart size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-white">Health Insurance</p>
                <p className="text-[11px] text-white/60">Gold Family Plan</p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white">Active</span>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Provider', value: 'Daman' },
                  { label: 'Plan', value: 'Gold Family' },
                  { label: 'Network', value: 'Enhanced' },
                  { label: 'Annual Limit', value: 'AED 500,000' },
                  { label: 'Copay', value: '20%' },
                  { label: 'Expiry', value: 'Dec 31, 2026' },
                ].map(item => (
                  <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                    <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Dependents - clickable */}
              <div className="rounded-[16px] p-4" style={{ background: 'linear-gradient(135deg, #F5F0FF, #EDE8FF)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-[#7C3AED]" />
                  <p className="text-[12px] font-bold text-[#7C3AED]">My Dependents</p>
                </div>
                <div className="space-y-2">
                  {DEPENDENTS.map(dep => (
                    <button key={dep.name} onClick={() => setSelectedDep(dep)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-white/80 active:scale-[0.98] transition-all text-left">
                      <div className="w-8 h-8 rounded-full bg-[#9D63F6] flex items-center justify-center text-[10px] font-bold text-white">{dep.initial}</div>
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-[#15161E]">{dep.name}</p>
                        <p className="text-[10px] text-[#666D80]">{dep.relation}</p>
                      </div>
                      <ChevronRight size={12} className="text-[#A4ABB8]" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold text-white active:scale-[0.97] transition-all" style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)' }}>
                  <Download size={13} /> Policy Certificate
                </button>
                <p className="text-[9px] text-[#A4ABB8] font-semibold">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
              </div>
            </div>
          </div>

          {/* ═══ Home Insurance (Add) ═══ */}
          <div className="rounded-[20px] bg-white border-2 border-dashed border-[#DFE1E6] overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-3" style={{ background: '#40C4AA15' }}>
                <Home size={24} className="text-[#40C4AA]" />
              </div>
              <p className="text-[14px] font-bold text-[#15161E]">Home Insurance</p>
              <p className="text-[12px] text-[#A4ABB8] mt-1">Protect your home and belongings</p>
              <button className="mt-4 flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] text-[12px] font-bold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] active:scale-[0.97] transition-all">
                <Plus size={14} /> Get Quote
              </button>
              <p className="text-[9px] text-[#A4ABB8] font-semibold mt-3">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
            </div>
          </div>

          {/* ═══ Pet Insurance (Add) ═══ */}
          <div className="rounded-[20px] bg-white border-2 border-dashed border-[#DFE1E6] overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-3" style={{ background: '#FFBD4C15' }}>
                <PawPrint size={24} className="text-[#FFBD4C]" />
              </div>
              <p className="text-[14px] font-bold text-[#15161E]">Pet Insurance</p>
              <p className="text-[12px] text-[#A4ABB8] mt-1">Protect your furry friends</p>
              <button className="mt-4 flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] text-[12px] font-bold text-[#FFBD4C] bg-[#FFFBEB] border border-[#FDE68A] active:scale-[0.97] transition-all">
                <Plus size={14} /> Get Quote
              </button>
              <p className="text-[9px] text-[#A4ABB8] font-semibold mt-3">Powered by <span className="text-[#059669] font-bold">Shory</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Dependent Detail Modal ── */}
      {selectedDep && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setSelectedDep(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white rounded-t-[28px] px-5 py-5 space-y-4 slide-up max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-[#DFE1E6] mx-auto" />
            <button onClick={() => setSelectedDep(null)} className="absolute top-4 right-5 w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center z-10">
              <X size={16} className="text-[#666D80]" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#9D63F6] to-[#B182F8] flex items-center justify-center text-[18px] font-bold text-white shadow-lg">
                {selectedDep.initial}
              </div>
              <div className="flex-1">
                <p className="text-[17px] font-bold text-[#15161E]">{selectedDep.name}</p>
                <p className="text-[13px] text-[#666D80]">{selectedDep.relation}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />
                  <p className="text-[10px] text-[#059669] font-semibold">{selectedDep.status}</p>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Date of Birth', value: selectedDep.dob },
                { label: 'Gender', value: selectedDep.gender },
                { label: 'Emirates ID', value: selectedDep.emiratesId },
                { label: 'Card Number', value: selectedDep.cardNo },
                { label: 'Network', value: selectedDep.network },
                { label: 'Status', value: selectedDep.status },
              ].map(item => (
                <div key={item.label} className="px-3 py-2.5 rounded-[12px] bg-[#F8F9FB]">
                  <p className="text-[9px] text-[#A4ABB8] uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-[13px] font-bold text-[#15161E] mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Coverage info */}
            <div className="rounded-[14px] p-4 bg-[#F5F0FF]">
              <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-2">Coverage Details</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666D80]">Plan</span>
                  <span className="text-[12px] font-bold text-[#15161E]">Gold Family</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666D80]">Provider</span>
                  <span className="text-[12px] font-bold text-[#15161E]">Daman</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666D80]">Annual Limit</span>
                  <span className="text-[12px] font-bold text-[#15161E]">AED 500,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666D80]">Copay</span>
                  <span className="text-[12px] font-bold text-[#15161E]">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666D80]">Valid Until</span>
                  <span className="text-[12px] font-bold text-[#15161E]">Dec 31, 2026</span>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedDep(null)} className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, #7C3AED, #9D63F6)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
