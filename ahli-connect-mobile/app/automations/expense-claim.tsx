'use client';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Receipt,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock,
  Shield,
  Zap,
  Camera,
  Sparkles,
  AlertCircle,
  DollarSign,
  Tag,
  Calendar,
  Building2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
} from 'lucide-react-native';
import {
  createRun,
  addStep,
  completeRun,
  notifySlack,
  syncSuccessFactors,
  sendEmail,
} from '@/lib/automationEngine';

const SAMPLE_RECEIPTS = [
  {
    id: 'r1',
    label: 'Business Dinner',
    thumbnail: '🍽️',
    extracted: {
      vendor: 'Zuma Restaurant, DIFC',
      amount: 420,
      currency: 'AED',
      date: '31 Mar 2026',
      category: 'Client Entertainment',
      confidence: 98.5,
      items: ['Set Menu x2 — AED 340', 'Beverages — AED 60', 'Service Charge — AED 20'],
    },
  },
  {
    id: 'r2',
    label: 'Taxi Receipts',
    thumbnail: '🚕',
    extracted: {
      vendor: 'Careem Business',
      amount: 87.5,
      currency: 'AED',
      date: '01 Apr 2026',
      category: 'Transport',
      confidence: 99.2,
      items: ['Office → Client site — AED 45', 'Client site → Office — AED 42.50'],
    },
  },
  {
    id: 'r3',
    label: 'Office Supplies',
    thumbnail: '📦',
    extracted: {
      vendor: 'IKEA Abu Dhabi',
      amount: 235,
      currency: 'AED',
      date: '28 Mar 2026',
      category: 'Office Supplies',
      confidence: 97.8,
      items: ['Desk organiser — AED 89', 'Monitor riser — AED 119', 'Cable management kit — AED 27'],
    },
  },
];

const POLICY_LIMITS: Record<string, number> = {
  'Client Entertainment': 500,
  'Transport': 200,
  'Office Supplies': 300,
  'Conference & Events': 2000,
  'Meals': 150,
};

interface StepState {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

export default function ExpenseClaimPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedReceipt, setSelectedReceipt] = useState<(typeof SAMPLE_RECEIPTS)[0] | null>(null);
  const [phase, setPhase] = useState<'upload' | 'scanning' | 'review' | 'processing' | 'complete' | 'error'>('upload');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  }

  function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function simulateAIScan(receipt: (typeof SAMPLE_RECEIPTS)[0]) {
    setSelectedReceipt(receipt);
    setPhase('scanning');
    setScanProgress(0);

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

    const run = await createRun(
      'expense-claim',
      `${ex.category} — AED ${ex.amount}`,
      user?.name ?? 'Unknown',
      user?.department ?? 'Unknown',
      user?.company ?? 'IHC Group',
      { vendor: ex.vendor, amount: ex.amount, category: ex.category, receiptDate: ex.date }
    );

    try {
      await addStep(run.id, {
        id: 's1',
        name: 'AI receipt extraction',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `Extracted: ${ex.vendor}, AED ${ex.amount}`,
      });

      updateStep('categorise', 'running');
      await delay(600);
      await addStep(run.id, {
        id: 's2',
        name: 'Auto-categorise',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `Category: ${ex.category}`,
      });
      updateStep('categorise', 'completed', `Category: ${ex.category} ✓`);

      updateStep('policy', 'running');
      await delay(800);
      await addStep(run.id, {
        id: 's3',
        name: 'Policy compliance',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: withinPolicy ? `Within AED ${limit} limit` : `Exceeds AED ${limit} limit`,
      });
      updateStep('policy', 'completed', withinPolicy ? `Within AED ${limit} limit ✓` : `⚠ Exceeds AED ${limit} limit`);

      updateStep('duplicate', 'running');
      await delay(500);
      await addStep(run.id, {
        id: 's4',
        name: 'Duplicate detection',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'No duplicates found',
      });
      updateStep('duplicate', 'completed', 'No duplicates in last 90 days ✓');

      updateStep('submit', 'running');
      await delay(600);
      await addStep(run.id, {
        id: 's5',
        name: 'Submit for approval',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'Auto-routed to finance',
      });
      updateStep('submit', 'completed', 'Routed to finance team ✓');

      updateStep('sync', 'running');
      const expRef = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await syncSuccessFactors(`Created expense entry ${expRef}`, { amount: ex.amount, category: ex.category, vendor: ex.vendor }, run.id);
      await addStep(run.id, {
        id: 's6',
        name: 'Sync to finance',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: expRef,
      });
      updateStep('sync', 'completed', `Reference: ${expRef} ✓`);

      updateStep('notify', 'running');
      await Promise.all([
        notifySlack('finance-claims', `💳 New expense: ${ex.vendor} — AED ${ex.amount} by ${user?.name}`, run.id),
        sendEmail(user?.email ?? '', `Expense submitted: AED ${ex.amount} (${ex.category})`, run.id),
      ]);
      await addStep(run.id, {
        id: 's7',
        name: 'Notifications',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      await completeRun(run.id, 'completed', { vendor: ex.vendor, amount: ex.amount, category: ex.category, policyCompliant: withinPolicy, reference: expRef });
      setPhase('complete');
    } catch {
      await completeRun(run.id, 'failed');
      setPhase('error');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4EFE8]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5 mb-6"
        >
          <ArrowLeft size={16} color="#6B7280" />
          <Text className="text-sm text-[#6B7280] font-medium">
            Back to Automations
          </Text>
        </TouchableOpacity>

        {/* Header Card */}
        <View className="rounded-2xl p-5 mb-6 overflow-hidden" style={{ backgroundColor: '#1B3A6B' }}>
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Receipt size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                AI Expense Processor
              </Text>
              <Text className="text-xs text-blue-200/70 mt-0.5">
                Snap a receipt — AI does the rest
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Sparkles size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">Claude AI Vision</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Shield size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">Policy auto-check</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">less than 2 min</Text>
            </View>
          </View>
        </View>

        {/* Upload Phase */}
        {phase === 'upload' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl border-2 border-dashed border-[#C8973A] bg-[#FEF9F0] p-8 items-center">
              <Camera size={36} color="#C8973A" />
              <Text className="text-sm font-bold text-[#92702D] mt-3">
                Snap or Upload Receipt
              </Text>
              <Text className="text-xs text-[#B8962E] mt-1">
                AI will extract all details automatically
              </Text>
            </View>

            {/* Sample receipts */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <View className="flex-row items-center gap-1.5 mb-3">
                <Sparkles size={11} color="#C8973A" />
                <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                  Demo Receipts (tap to scan)
                </Text>
              </View>
              <View className="gap-2">
                {SAMPLE_RECEIPTS.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => simulateAIScan(r)}
                    className="flex-row items-center gap-3 p-3.5 rounded-2xl bg-[#F4EFE8] border border-[#E8E2D9]"
                  >
                    <Text className="text-2xl">{r.thumbnail}</Text>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-[#1A1A2E]">
                        {r.label}
                      </Text>
                      <Text className="text-xs text-[#9CA3AF]">
                        AED {r.extracted.amount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Before/After */}
            <View className="rounded-2xl bg-[#FEF9F0] border border-[#F5E6C8] p-4">
              <View className="flex-row items-center gap-1.5 mb-3">
                <Zap size={12} color="#92702D" />
                <Text className="text-xs font-bold text-[#92702D] uppercase tracking-wide">
                  Before vs After
                </Text>
              </View>
              <View className="gap-3">
                <View>
                  <Text className="text-xs font-bold text-red-600 mb-1">
                    Before (Manual)
                  </Text>
                  {[
                    'Collect paper receipts',
                    'Open Excel, type each line',
                    'Look up policy category',
                    'Scan & email to finance',
                    'Finance re-enters into ERP',
                    'TP 30 min per claim',
                  ].map((s, i) => (
                    <Text key={i} className="text-xs text-[#6B7280]">
                      • {s}
                    </Text>
                  ))}
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#059669] mb-1">
                    After (AI-Powered)
                  </Text>
                  {[
                    'Snap photo of receipt',
                    'AI extracts everything',
                    'Auto-categorise + policy',
                    'One-tap submit',
                  ].map((s, i) => (
                    <Text key={i} className="text-xs text-[#6B7280]">
                      • {s}
                    </Text>
                  ))}
                  <Text className="text-xs font-bold text-[#059669] mt-2">
                    TP less than 2 minutes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Scanning Phase */}
        {phase === 'scanning' && selectedReceipt && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-6 items-center overflow-hidden">
              <Text className="text-5xl mb-4">{selectedReceipt.thumbnail}</Text>
              <View className="flex-row items-center gap-2 mb-3">
                <Sparkles size={16} color="#C8973A" />
                <Text className="text-sm font-bold text-[#1B3A6B]">
                  Claude AI Analyzing Receipt...
                </Text>
              </View>
              <View className="w-full h-2 rounded-full bg-[#E8E2D9] overflow-hidden mb-2">
                <View
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${scanProgress}%`,
                    backgroundColor: scanProgress < 100 ? '#C8973A' : '#059669',
                  }}
                />
              </View>
              <Text className="text-xs text-[#9CA3AF]">
                {scanProgress < 30
                  ? 'Detecting text regions...'
                  : scanProgress < 60
                    ? 'Extracting vendor & amounts...'
                    : scanProgress < 90
                      ? 'Categorizing expense...'
                      : 'Verifying accuracy...'}
              </Text>
            </View>
          </View>
        )}

        {/* Review Phase */}
        {phase === 'review' && selectedReceipt && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-4 flex-row items-center gap-3">
              <Sparkles size={18} color="#059669" />
              <View>
                <Text className="text-sm font-bold text-[#065F46]">
                  AI Extraction Complete
                </Text>
                <Text className="text-xs text-[#047857]">
                  {selectedReceipt.extracted.confidence}% confidence score
                </Text>
              </View>
            </View>

            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4 gap-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                Extracted Data
              </Text>

              <View className="gap-3">
                <View className="flex-row items-start gap-2">
                  <Building2 size={14} color="#C8973A" />
                  <View className="flex-1">
                    <Text className="text-xs text-[#9CA3AF]">Vendor</Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      {selectedReceipt.extracted.vendor}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-2">
                  <DollarSign size={14} color="#C8973A" />
                  <View className="flex-1">
                    <Text className="text-xs text-[#9CA3AF]">Amount</Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      {selectedReceipt.extracted.currency}{' '}
                      {selectedReceipt.extracted.amount}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-2">
                  <Calendar size={14} color="#C8973A" />
                  <View className="flex-1">
                    <Text className="text-xs text-[#9CA3AF]">Date</Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      {selectedReceipt.extracted.date}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-2">
                  <Tag size={14} color="#C8973A" />
                  <View className="flex-1">
                    <Text className="text-xs text-[#9CA3AF]">Category</Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      {selectedReceipt.extracted.category}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Line items */}
              <View>
                <Text className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">
                  Line Items
                </Text>
                {selectedReceipt.extracted.items.map((item, i) => (
                  <View key={i} className="flex-row items-center gap-2 py-1.5">
                    <CheckCircle2 size={12} color="#059669" />
                    <Text className="text-xs text-[#4B5563]">{item}</Text>
                  </View>
                ))}
              </View>

              {/* Policy check */}
              {(() => {
                const limit = POLICY_LIMITS[selectedReceipt.extracted.category] ?? 500;
                const ok = selectedReceipt.extracted.amount <= limit;
                return (
                  <View
                    className={`rounded-2xl p-3 flex-row items-start gap-2.5 ${
                      ok
                        ? 'bg-[#F0FDF4] border border-[#BBF7D0]'
                        : 'bg-[#FEF2F2] border border-[#FECACA]'
                    }`}
                  >
                    {ok ? (
                      <FileCheck size={16} color="#059669" />
                    ) : (
                      <AlertTriangle size={16} color="#DC2626" />
                    )}
                    <View className="flex-1">
                      <Text
                        className={`text-xs font-bold ${
                          ok ? 'text-[#065F46]' : 'text-[#991B1B]'
                        }`}
                      >
                        {ok ? 'Policy Compliant' : 'Exceeds Policy Limit'}
                      </Text>
                      <Text
                        className={`text-xs ${
                          ok ? 'text-[#047857]' : 'text-[#DC2626]'
                        }`}
                      >
                        {selectedReceipt.extracted.category} limit: AED{' '}
                        {limit} | Claimed: AED{' '}
                        {selectedReceipt.extracted.amount}
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </View>

            {/* Actions */}
            <View className="gap-2">
              <TouchableOpacity
                onPress={() => {
                  setPhase('upload');
                  setSelectedReceipt(null);
                }}
                className="bg-white rounded-2xl py-3.5 items-center border border-[#E8E2D9]"
              >
                <Text className="text-sm font-bold text-[#6B7280]">Re-scan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitClaim}
                className="bg-[#1B3A6B] rounded-2xl py-3.5 items-center justify-center flex-row gap-2"
              >
                <Zap size={16} color="white" />
                <Text className="text-sm font-bold text-white">Submit Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Processing Phase */}
        {phase === 'processing' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-5">
              <Text className="text-base font-bold text-[#1A1A2E] mb-4">
                Processing Pipeline
              </Text>
              <View className="gap-3">
                {steps.map((step) => (
                  <View key={step.id} className="flex-row items-start gap-3">
                    <View className="mt-0.5">
                      {step.status === 'completed' && (
                        <CheckCircle2 size={18} color="#059669" />
                      )}
                      {step.status === 'running' && (
                        <ActivityIndicator size={18} color="#1B3A6B" />
                      )}
                      {step.status === 'pending' && (
                        <View className="w-4.5 h-4.5 rounded-full border-2 border-[#E8E2D9]" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color:
                            step.status === 'completed'
                              ? '#059669'
                              : step.status === 'running'
                                ? '#1B3A6B'
                                : '#9CA3AF',
                        }}
                      >
                        {step.name}
                      </Text>
                      {step.detail && step.status === 'completed' && (
                        <Text className="text-xs text-[#9CA3AF] mt-0.5">
                          {step.detail}
                        </Text>
                      )}
                      {step.status === 'running' && (
                        <View className="mt-1.5 h-1 rounded-full bg-[#E8E2D9] overflow-hidden">
                          <View
                            className="h-full rounded-full bg-[#1B3A6B]"
                            style={{ width: '70%' }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Complete Phase */}
        {phase === 'complete' && selectedReceipt && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-5 items-center">
              <View className="w-14 h-14 rounded-full bg-[#059669] items-center justify-center mb-3">
                <CheckCircle2 size={28} color="white" />
              </View>
              <Text className="text-base font-bold text-[#065F46]">
                Expense Submitted
              </Text>
              <Text className="text-sm text-[#047857] mt-1">
                {selectedReceipt.extracted.vendor} — AED{' '}
                {selectedReceipt.extracted.amount}
              </Text>
              <Text className="text-xs text-[#6B7280] mt-1">
                Estimated reimbursement: 1-2 business days
              </Text>
            </View>

            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Pipeline Summary
              </Text>
              <View className="gap-1">
                {steps.map((step) => (
                  <View key={step.id} className="flex-row items-center gap-2.5">
                    <CheckCircle2 size={14} color="#059669" />
                    <Text className="text-xs text-[#4B5563] flex-1">
                      {step.name}
                    </Text>
                    {step.detail && (
                      <Text className="text-xs text-[#9CA3AF]">{step.detail}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setPhase('upload');
                setSelectedReceipt(null);
                setSteps([]);
              }}
              className="bg-[#F4EFE8] rounded-2xl py-3 items-center border border-[#E8E2D9]"
            >
              <View className="flex-row items-center gap-2">
                <RefreshCw size={14} color="#6B7280" />
                <Text className="text-xs font-semibold text-[#6B7280]">
                  Submit Another Expense
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Phase */}
        {phase === 'error' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-red-50 border border-red-200 p-5 items-center">
              <AlertCircle size={32} color="#DC2626" />
              <Text className="text-base font-bold text-red-700 mt-3">
                Submission Failed
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPhase('upload');
                setSteps([]);
              }}
              className="bg-[#1B3A6B] rounded-2xl py-4 items-center"
            >
              <Text className="text-base font-bold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
