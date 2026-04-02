'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  Receipt, ArrowLeft, CheckCircle2, Loader2, Clock, Shield,
  Zap, Camera, Sparkles, AlertCircle, Upload, Eye,
  DollarSign, Tag, Calendar, Building2, AlertTriangle,
  FileCheck, XCircle, RefreshCw,
} from 'lucide-react';
import {
  createRun, addStep, completeRun, notifySlack,
  syncSuccessFactors, sendEmail,
} from '@/lib/automationEngine';
import Link from 'next/link';

const STEP_STYLES = `
  @keyframes step-check { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes progress-fill { from { width: 0%; } to { width: 100%; } }
  @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ai-scan { 0%{background-position: -200% 0} 100%{background-position: 200% 0} }
  .step-check { animation: step-check 0.3s ease-out; }
  .fade-up { animation: fade-up 0.35s ease-out both; }
  .ai-scan { background: linear-gradient(90deg, transparent 30%, rgba(200,151,58,0.15) 50%, transparent 70%); background-size: 200% 100%; animation: ai-scan 2s ease-in-out infinite; }
`;

// Pre-built receipt templates for demo
const SAMPLE_RECEIPTS = [
  {
    id: 'r1', label: 'Business Dinner', thumbnail: '🍽️',
    extracted: { vendor: 'Zuma Restaurant, DIFC', amount: 420, currency: 'AED', date: '31 Mar 2026', category: 'Client Entertainment', confidence: 98.5, items: ['Set Menu x2 — AED 340', 'Beverages — AED 60', 'Service Charge — AED 20'] },
  },
  {
    id: 'r2', label: 'Taxi Receipts', thumbnail: '🚕',
    extracted: { vendor: 'Careem Business', amount: 87.50, currency: 'AED', date: '01 Apr 2026', category: 'Transport', confidence: 99.2, items: ['Office → Client site — AED 45', 'Client site → Office — AED 42.50'] },
  },
  {
    id: 'r3', label: 'Office Supplies', thumbnail: '📦',
    extracted: { vendor: 'IKEA Abu Dhabi', amount: 235, currency: 'AED', date: '28 Mar 2026', category: 'Office Supplies', confidence: 97.8, items: ['Desk organiser — AED 89', 'Monitor riser — AED 119', 'Cable management kit — AED 27'] },
  },
  {
    id: 'r4', label: 'Conference Pass', thumbnail: '🎟️',
    extracted: { vendor: 'GITEX Global 2026', amount: 1500, currency: 'AED', date: '25 Mar 2026', category: 'Conference & Events', confidence: 96.1, items: ['3-Day Premium Pass — AED 1,500'] },
  },
];

const POLICY_LIMITS: Record<string, number> = {
  'Client Entertainment': 500,
  'Transport': 200,
  'Office Supplies': 300,
  'Conference & Events': 2000,
  'Meals': 150,
  'Software & Tools': 500,
};

interface StepState { id: string; name: string; status: 'pending' | 'running' | 'completed' | 'failed'; detail?: string; }

export default function ExpenseClaimPage() {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<typeof SAMPLE_RECEIPTS[0] | null>(null);
  const [phase, setPhase] = useState<'upload' | 'scanning' | 'review' | 'processing' | 'complete' | 'error'>('upload');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, detail: detail ?? s.detail } : s));
  }
  function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  async function simulateAIScan(receipt: typeof SAMPLE_RECEIPTS[0]) {
    setSelectedReceipt(receipt);
    setPhase('scanning');
    setScanProgress(0);

    // Simulate AI vision processing with progress
    for (let i = 0; i <= 100; i += 5) {
      setScanProgress(i);
      await delay(80);
    }
    await delay(400);
    setPhase('review');
  }

  async function submitClaim() {
    if (!selectedReceipt) return;
    setPhase('processing');

    const ex = selectedReceipt.extracted;
    const limit = POLICY_LIMITS[ex.category] ?? 500;
    const withinPolicy = ex.amount <= limit;

    const pipelineSteps: StepState[] = [
      { id: 'extract', name: 'AI receipt data extraction', status: 'completed', detail: `${ex.confidence}% confidence` },
      { id: 'categorise', name: 'Auto-categorise expense', status: 'pending' },
      { id: 'policy', name: 'Policy compliance check', status: 'pending' },
      { id: 'duplicate', name: 'Duplicate detection', status: 'pending' },
      { id: 'submit', name: 'Submit for approval', status: 'pending' },
      { id: 'sync', name: 'Sync to finance system', status: 'pending' },
      { id: 'notify', name: 'Send confirmations', status: 'pending' },
    ];
    setSteps(pipelineSteps);

    const run = createRun('expense-claim', `${ex.category} — AED ${ex.amount}`, user?.name ?? 'Unknown', user?.department ?? 'Unknown', user?.company ?? 'IHC Group',
      { vendor: ex.vendor, amount: ex.amount, category: ex.category, receiptDate: ex.date });

    try {
      addStep(run.id, { id: 's1', name: 'AI receipt extraction', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Extracted: ${ex.vendor}, AED ${ex.amount}` });

      // Step 2: Auto-categorise
      updateStep('categorise', 'running');
      await delay(600);
      addStep(run.id, { id: 's2', name: 'Auto-categorise', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Category: ${ex.category}` });
      updateStep('categorise', 'completed', `Category: ${ex.category} ✓`);

      // Step 3: Policy check
      updateStep('policy', 'running');
      await delay(800);
      addStep(run.id, { id: 's3', name: 'Policy compliance', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: withinPolicy ? `Within AED ${limit} limit` : `Exceeds AED ${limit} limit — flagged` });
      updateStep('policy', 'completed', withinPolicy
        ? `Within AED ${limit} limit ✓ | Valid receipt ✓ | Date within 30 days ✓`
        : `⚠ Exceeds AED ${limit} limit — requires VP approval`);

      // Step 4: Duplicate check
      updateStep('duplicate', 'running');
      await delay(500);
      addStep(run.id, { id: 's4', name: 'Duplicate detection', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: 'No duplicates found' });
      updateStep('duplicate', 'completed', 'No duplicates in last 90 days ✓');

      // Step 5: Submit
      updateStep('submit', 'running');
      await delay(600);
      addStep(run.id, { id: 's5', name: 'Submit for approval', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: 'Auto-routed to finance' });
      updateStep('submit', 'completed', 'Routed to finance team ✓');

      // Step 6: Sync
      updateStep('sync', 'running');
      const expRef = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await syncSuccessFactors(`Created expense entry ${expRef}`, { amount: ex.amount, category: ex.category, vendor: ex.vendor }, run.id);
      addStep(run.id, { id: 's6', name: 'Sync to finance', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: expRef });
      updateStep('sync', 'completed', `Reference: ${expRef} ✓`);

      // Step 7: Notify
      updateStep('notify', 'running');
      await Promise.all([
        notifySlack('finance-claims', `💳 New expense: ${ex.vendor} — AED ${ex.amount} by ${user?.name}`, run.id),
        sendEmail(user?.email ?? '', `Expense submitted: AED ${ex.amount} (${ex.category})`, run.id),
      ]);
      addStep(run.id, { id: 's7', name: 'Notifications', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      completeRun(run.id, 'completed', { vendor: ex.vendor, amount: ex.amount, category: ex.category, policyCompliant: withinPolicy, reference: expRef });
      setPhase('complete');
    } catch {
      completeRun(run.id, 'failed');
      setPhase('error');
    }
  }

  return (
    <AppShell title="Expense Claim" subtitle="AI Automation">
      <style>{STEP_STYLES}</style>
      <div className="space-y-5 max-w-lg mx-auto">

        <Link href="/automations" className="flex items-center gap-1.5 text-[13px] text-[#666D80] font-medium hover:text-[#9D63F6] transition-colors">
          <ArrowLeft size={15} /> Back to Automations
        </Link>

        {/* Header */}
        <div className="rounded-[18px] p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #6D4AAC 60%, #9D63F6 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 85% 20%, rgba(200,151,58,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Receipt size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold">AI Expense Processor</h2>
                <p className="text-[11px] text-blue-200/70">Snap receipt, AI handles it</p>
              </div>
            </div>
            <div className="flex gap-3 text-[10px] text-blue-200/60 flex-wrap">
              <span className="flex items-center gap-1"><Sparkles size={10} /> AI Vision</span>
              <span className="flex items-center gap-1"><Shield size={10} /> Policy</span>
              <span className="flex items-center gap-1"><Clock size={10} /> &lt; 2 min</span>
            </div>
          </div>
        </div>

        {/* ═══ UPLOAD PHASE ═══ */}
        {phase === 'upload' && (
          <div className="space-y-4 fade-up">
            {/* Upload area */}
            <div className="rounded-[16px] border-2 border-dashed border-[#FFBD4C] bg-[#FEF9F0] p-5 text-center">
              <Camera size={32} className="text-[#FFBD4C] mx-auto mb-2" />
              <p className="text-[13px] font-bold text-[#92702D]">Snap or Upload Receipt</p>
              <p className="text-[11px] text-[#FFBD4C] mt-1">AI extracts details automatically</p>
            </div>

            {/* Sample receipts for demo */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={10} className="text-[#FFBD4C]" /> Demo Receipts
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_RECEIPTS.map(r => (
                  <button key={r.id} onClick={() => simulateAIScan(r)}
                    className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F8F9FB] border border-[#DFE1E6] text-left active:scale-[0.97] transition-all hover:border-[#FFBD4C]">
                    <span className="text-3xl shrink-0">{r.thumbnail}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#15161E]">{r.label}</p>
                      <p className="text-[11px] text-[#A4ABB8]">AED {r.extracted.amount}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Before/After */}
            <div className="rounded-[16px] bg-[#FEF9F0] border border-[#F5E6C8] p-3">
              <p className="text-[10px] font-bold text-[#92702D] uppercase tracking-wider mb-2 flex items-center gap-1"><Zap size={11} /> Before vs After</p>
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-red-600 mb-1 text-[11px]">Before (Manual)</p>
                  <p className="text-[11px] text-[#666D80]">• Collect receipts</p>
                  <p className="text-[11px] text-[#666D80]">• Open Excel, type</p>
                  <p className="text-[11px] text-[#666D80]">• Look up category</p>
                  <p className="text-[11px] text-[#666D80]">• Scan & email</p>
                  <p className="text-[11px] text-[#666D80]">• Finance re-enters</p>
                  <p className="font-bold text-red-600 mt-2 text-[11px]">⏱ 30 min</p>
                </div>
                <div>
                  <p className="font-bold text-[#059669] mb-1 text-[11px]">After (AI-Powered)</p>
                  <p className="text-[11px] text-[#666D80]">• Snap receipt</p>
                  <p className="text-[11px] text-[#666D80]">• AI extracts</p>
                  <p className="text-[11px] text-[#666D80]">• Auto-categorise</p>
                  <p className="text-[11px] text-[#666D80]">• Policy check ✓</p>
                  <p className="text-[11px] text-[#666D80]">• One-tap submit</p>
                  <p className="font-bold text-[#059669] mt-2 text-[11px]">⚡ &lt; 2 min</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SCANNING PHASE — AI Vision ═══ */}
        {phase === 'scanning' && selectedReceipt && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-5 text-center relative overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <div className="ai-scan absolute inset-0 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-5xl mb-3">{selectedReceipt.thumbnail}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={15} className="text-[#FFBD4C] animate-pulse" />
                  <p className="text-[13px] font-bold text-[#9D63F6]">Claude AI Analyzing...</p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#DFE1E6] overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-100" style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, #9D63F6, #FFBD4C)' }} />
                </div>
                <p className="text-[10px] text-[#A4ABB8]">
                  {scanProgress < 30 ? 'Detecting...' : scanProgress < 60 ? 'Extracting...' : scanProgress < 90 ? 'Categorizing...' : 'Verifying...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ REVIEW PHASE — AI extraction results ═══ */}
        {phase === 'review' && selectedReceipt && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] p-3 flex items-center gap-2.5">
              <Sparkles size={16} className="text-[#059669] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#065F46]">AI Extraction Complete</p>
                <p className="text-[10px] text-[#047857]">{selectedReceipt.extracted.confidence}% confidence</p>
              </div>
            </div>

            {/* Extracted data card */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3 space-y-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider">Extracted Data</p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Building2 size={14} className="text-[#FFBD4C] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#A4ABB8]">Vendor</p>
                    <p className="text-[12px] font-semibold text-[#15161E] truncate">{selectedReceipt.extracted.vendor}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign size={14} className="text-[#FFBD4C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#A4ABB8]">Amount</p>
                    <p className="text-[12px] font-semibold text-[#15161E]">{selectedReceipt.extracted.currency} {selectedReceipt.extracted.amount}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="text-[#FFBD4C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#A4ABB8]">Date</p>
                    <p className="text-[12px] font-semibold text-[#15161E]">{selectedReceipt.extracted.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Tag size={14} className="text-[#FFBD4C] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#A4ABB8]">Category</p>
                    <p className="text-[12px] font-semibold text-[#15161E] truncate">{selectedReceipt.extracted.category}</p>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div>
                <p className="text-[9px] text-[#A4ABB8] font-bold uppercase tracking-wider mb-1.5">Line Items</p>
                {selectedReceipt.extracted.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 py-1 text-[11px] text-[#4B5563] border-b border-[#F8F9FB] last:border-0">
                    <CheckCircle2 size={11} className="text-[#059669] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              {/* Policy check preview */}
              {(() => {
                const limit = POLICY_LIMITS[selectedReceipt.extracted.category] ?? 500;
                const ok = selectedReceipt.extracted.amount <= limit;
                return (
                  <div className={`rounded-[10px] p-2.5 flex items-start gap-2 ${ok ? 'bg-[#F0FDF4] border border-[#BBF7D0]' : 'bg-[#FEF2F2] border border-[#FECACA]'}`}>
                    {ok ? <FileCheck size={14} className="text-[#059669] shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="text-[#DC2626] shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold ${ok ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
                        {ok ? 'Policy OK' : 'Exceeds Limit'}
                      </p>
                      <p className={`text-[10px] ${ok ? 'text-[#047857]' : 'text-[#DC2626]'} truncate`}>
                        {selectedReceipt.extracted.category}: AED {limit} limit
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => { setPhase('upload'); setSelectedReceipt(null); }}
                className="flex-1 py-3 rounded-[14px] text-[13px] font-bold text-[#666D80] bg-white border border-[#DFE1E6] active:scale-[0.97] transition-all">
                Re-scan
              </button>
              <button onClick={submitClaim}
                className="flex-[1.4] py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #6D4AAC 100%)', boxShadow: '0 4px 16px rgba(27,58,107,0.3)' }}>
                <Zap size={15} /> Submit Claim
              </button>
            </div>
          </div>
        )}

        {/* ═══ PROCESSING ═══ */}
        {phase === 'processing' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3.5" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[13px] font-bold text-[#15161E] mb-3">Processing Pipeline</p>
              <div className="space-y-3">
                {steps.map(step => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.status === 'completed' && <CheckCircle2 size={18} className="text-[#059669] step-check" />}
                      {step.status === 'running' && <Loader2 size={18} className="text-[#9D63F6] animate-spin" />}
                      {step.status === 'pending' && <div className="w-[18px] h-[18px] rounded-full border-2 border-[#DFE1E6]" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[13px] font-semibold ${step.status === 'completed' ? 'text-[#059669]' : step.status === 'running' ? 'text-[#9D63F6]' : 'text-[#A4ABB8]'}`}>
                        {step.name}
                      </p>
                      {step.detail && step.status === 'completed' && <p className="text-[11px] text-[#A4ABB8] mt-0.5">{step.detail}</p>}
                      {step.status === 'running' && (
                        <div className="mt-1.5 h-1 rounded-full bg-[#DFE1E6] overflow-hidden">
                          <div className="h-full rounded-full bg-[#9D63F6]" style={{ animation: 'progress-fill 1s ease-out forwards' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ COMPLETE ═══ */}
        {phase === 'complete' && selectedReceipt && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center mx-auto mb-2 step-check">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-[#065F46]">Expense Submitted</h3>
              <p className="text-[12px] text-[#047857] mt-1 truncate">{selectedReceipt.extracted.vendor}</p>
              <p className="text-[11px] text-[#666D80] mt-1">AED {selectedReceipt.extracted.amount} • 1-2 days</p>
            </div>

            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Pipeline Summary</p>
              {steps.map(step => (
                <div key={step.id} className="flex items-center gap-2.5 text-[12px] py-1">
                  <CheckCircle2 size={14} className="text-[#059669] shrink-0" />
                  <span className="text-[#4B5563] flex-1">{step.name}</span>
                  <span className="text-[#A4ABB8] text-[10px] max-w-[45%] truncate text-right">{step.detail}</span>
                </div>
              ))}
            </div>

            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Integrations</p>
              {['Claude AI (Vision) — Receipt data extracted at 98.5% confidence', 'SAP SuccessFactors — Expense entry created', 'Slack — #finance-claims notified', 'Email — Confirmation sent'].map(i => (
                <div key={i} className="flex items-center gap-2.5 text-[12px] py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  <span className="text-[#4B5563]">{i}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { setPhase('upload'); setSelectedReceipt(null); setSteps([]); }}
              className="w-full py-2.5 rounded-[12px] text-[12px] font-semibold text-[#666D80] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5">
              <RefreshCw size={13} /> Submit Another
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-red-50 border border-red-200 p-4 text-center">
              <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
              <h3 className="text-[15px] font-bold text-red-700">Submission Failed</h3>
            </div>
            <button onClick={() => { setPhase('upload'); setSteps([]); }} className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#9D63F6]">Try Again</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
