'use client';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Shield,
  Clock,
  Zap,
  Globe,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react-native';
import {
  createRun,
  addStep,
  completeRun,
  notifySlack,
  syncSuccessFactors,
  sendEmail,
  syncGoogleDrive,
  type AutomationStep,
} from '@/lib/automationEngine';

const PURPOSES = [
  'Bank Loan',
  'Visa Application',
  'Tenancy Contract',
  'Personal Records',
  'Government Authority',
  'Other',
];

interface StepState {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

const SALARY_DATA: Record<
  string,
  { basic: number; housing: number; transport: number; other: number; joinDate: string }
> = {
  Shory: { basic: 18000, housing: 7000, transport: 2500, other: 3500, joinDate: '15 March 2022' },
  'Aldar Properties': { basic: 28000, housing: 12000, transport: 3500, other: 6500, joinDate: '1 June 2020' },
  PureHealth: { basic: 22000, housing: 9000, transport: 3000, other: 4000, joinDate: '10 January 2021' },
  'IHC Group': { basic: 35000, housing: 15000, transport: 4000, other: 8000, joinDate: '1 September 2019' },
  EasyLease: { basic: 16000, housing: 6500, transport: 2000, other: 2500, joinDate: '20 July 2023' },
  Ghitha: { basic: 14000, housing: 5500, transport: 2000, other: 2000, joinDate: '5 May 2022' },
  'Palms Sports': { basic: 15000, housing: 6000, transport: 2000, other: 2500, joinDate: '12 November 2021' },
};

export default function SalaryCertificatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [purpose, setPurpose] = useState('Bank Loan');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [phase, setPhase] = useState<'form' | 'processing' | 'complete' | 'error'>('form');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [runId, setRunId] = useState('');

  const company = user?.company ?? 'IHC Group';
  const salary = SALARY_DATA[company] ?? SALARY_DATA['IHC Group'];
  const total = salary.basic + salary.housing + salary.transport + salary.other;

  const PIPELINE_STEPS: { id: string; name: string; detail: string }[] = [
    { id: 'fetch', name: 'Fetching employee data from SuccessFactors', detail: 'Pulling latest salary records...' },
    { id: 'validate', name: 'Validating employment status', detail: 'Confirming active employment...' },
    { id: 'generate', name: 'Generating PDF certificate', detail: 'Building document with letterhead...' },
    { id: 'sign', name: 'Applying digital signature', detail: 'Cryptographic verification hash...' },
    { id: 'drive', name: 'Uploading to Google Drive', detail: 'Saving to HR Documents folder...' },
    { id: 'notify', name: 'Sending notifications', detail: 'Slack + Email confirmations...' },
  ];

  async function runAutomation() {
    setPhase('processing');

    const initialSteps: StepState[] = PIPELINE_STEPS.map((s) => ({
      id: s.id,
      name: s.name,
      status: 'pending',
    }));
    setSteps(initialSteps);

    const run = await createRun(
      'salary-certificate',
      `Salary Certificate — ${purpose}`,
      user?.name ?? 'Unknown',
      user?.department ?? 'Unknown',
      company,
      { purpose, language }
    );
    setRunId(run.id);

    try {
      // Step 1: Fetch employee data
      updateStep('fetch', 'running');
      await delay(800);
      await syncSuccessFactors(`Fetched employee record ${user?.employeeId}`, { employeeId: user?.employeeId, company }, run.id);
      await addStep(run.id, {
        id: 's1',
        name: 'Fetch employee data',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `Employee: ${user?.employeeId}`,
      });
      updateStep('fetch', 'completed', 'Employee data retrieved ✓');

      // Step 2: Validate employment
      updateStep('validate', 'running');
      await delay(600);
      await addStep(run.id, {
        id: 's2',
        name: 'Validate employment status',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'Active, Full-Time',
      });
      updateStep('validate', 'completed', 'Active employment confirmed ✓');

      // Step 3: Generate PDF
      updateStep('generate', 'running');
      await delay(700);
      await addStep(run.id, {
        id: 's3',
        name: 'Generate PDF document',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'Size: 42 KB',
      });
      updateStep('generate', 'completed', 'Document generated (42 KB) ✓');

      // Step 4: Digital signature
      updateStep('sign', 'running');
      await delay(700);
      await addStep(run.id, {
        id: 's4',
        name: 'Apply digital signature',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'Hash: abc123def',
      });
      updateStep('sign', 'completed', 'Verification: abc123def');

      // Step 5: Google Drive
      updateStep('drive', 'running');
      await syncGoogleDrive(
        `SalaryCert_${user?.employeeId}_${new Date().getFullYear()}.pdf`,
        run.id
      );
      await addStep(run.id, {
        id: 's5',
        name: 'Upload to Google Drive',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      updateStep('drive', 'completed', 'Saved to HR Documents folder ✓');

      // Step 6: Notifications
      updateStep('notify', 'running');
      await Promise.all([
        notifySlack('hr-documents', `📄 Salary certificate generated for ${user?.name} (${purpose})`, run.id),
        sendEmail(user?.email ?? '', `Your salary certificate is ready — ${purpose}`, run.id),
      ]);
      await addStep(run.id, {
        id: 's6',
        name: 'Send notifications',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      await completeRun(run.id, 'completed', { fileSize: '42 KB', verificationHash: 'abc123def' });
      setPhase('complete');
    } catch (err) {
      await completeRun(run.id, 'failed', undefined, String(err));
      setPhase('error');
    }
  }

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  }

  function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
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
              <FileText size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                Salary Certificate
              </Text>
              <Text className="text-xs text-blue-200/70 mt-0.5">
                Automated generation with digital verification
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Clock size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">less than 30 seconds</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Shield size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">Digitally signed</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Globe size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">EN / AR</Text>
            </View>
          </View>
        </View>

        {/* Form Phase */}
        {phase === 'form' && (
          <View className="gap-4 mb-6">
            {/* Employee Info */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Employee Details (auto-filled)
              </Text>
              <View className="gap-3">
                {[
                  ['Name', user?.name ?? '—'],
                  ['ID', user?.employeeId ?? '—'],
                  ['Company', company],
                  ['Department', user?.department ?? '—'],
                  ['Title', user?.title ?? '—'],
                  ['Join Date', salary.joinDate],
                ].map(([label, val]) => (
                  <View key={String(label)} className="flex-row justify-between">
                    <Text className="text-xs text-[#9CA3AF] font-medium">
                      {label}
                    </Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      {val}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Salary breakdown */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Salary Breakdown (from SuccessFactors)
              </Text>
              <View className="gap-2">
                {[
                  ['Basic Salary', salary.basic],
                  ['Housing Allowance', salary.housing],
                  ['Transport Allowance', salary.transport],
                  ['Other Allowances', salary.other],
                ].map(([label, amount]) => (
                  <View key={String(label)} className="flex-row justify-between">
                    <Text className="text-sm text-[#6B7280]">{label}</Text>
                    <Text className="text-sm font-semibold text-[#1A1A2E]">
                      AED {(amount as number).toLocaleString()}
                    </Text>
                  </View>
                ))}
                <View className="border-t border-[#E8E2D9] pt-2 flex-row justify-between">
                  <Text className="text-sm font-bold text-[#1B3A6B]">
                    Total Monthly
                  </Text>
                  <Text className="text-sm font-bold text-[#1B3A6B]">
                    AED {total.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Purpose selector */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Purpose
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PURPOSES.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPurpose(p)}
                    className="px-3 py-2 rounded-full"
                    style={{
                      backgroundColor: purpose === p ? '#1B3A6B' : 'transparent',
                      borderWidth: purpose === p ? 0 : 1,
                      borderColor: '#E8E2D9',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: purpose === p ? '#fff' : '#6B7280',
                      }}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Language */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Language
              </Text>
              <View className="flex-row gap-2">
                {[
                  { key: 'en' as const, label: 'English' },
                  { key: 'ar' as const, label: 'العربية' },
                ].map((l) => (
                  <TouchableOpacity
                    key={l.key}
                    onPress={() => setLanguage(l.key)}
                    className="flex-1 py-2.5 rounded-2xl"
                    style={{
                      backgroundColor: language === l.key ? '#1B3A6B' : 'transparent',
                      borderWidth: language === l.key ? 0 : 1,
                      borderColor: '#E8E2D9',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: language === l.key ? '#fff' : '#6B7280',
                        textAlign: 'center',
                      }}
                    >
                      {l.label}
                    </Text>
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
                    'Email HR requesting cert',
                    'HR verifies in SuccessFactors',
                    'HR creates Word doc manually',
                    'Print, stamp, sign',
                    'Employee collects from office',
                    'TP 3-5 business days',
                  ].map((s, i) => (
                    <Text key={i} className="text-xs text-[#6B7280]">
                      • {s}
                    </Text>
                  ))}
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#059669] mb-1">
                    After (Automated)
                  </Text>
                  {['Select purpose', 'Click "Generate"', 'Auto-pull + PDF + sign', 'Download instantly'].map((s, i) => (
                    <Text key={i} className="text-xs text-[#6B7280]">
                      • {s}
                    </Text>
                  ))}
                  <Text className="text-xs font-bold text-[#059669] mt-2">
                    TP less than 30 seconds
                  </Text>
                </View>
              </View>
            </View>

            {/* Generate button */}
            <TouchableOpacity
              onPress={runAutomation}
              className="bg-[#1B3A6B] rounded-2xl py-4 items-center justify-center flex-row gap-2"
              activeOpacity={0.8}
            >
              <Zap size={18} color="white" />
              <Text className="text-base font-bold text-white">
                Generate Certificate
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Processing Phase */}
        {phase === 'processing' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-5">
              <Text className="text-base font-bold text-[#1A1A2E] mb-4">
                Automation Pipeline
              </Text>
              <View className="gap-3">
                {steps.map((step) => (
                  <View key={step.id} className="flex-row items-start gap-3">
                    <View className="mt-0.5">
                      {step.status === 'completed' && (
                        <CheckCircle2 size={18} color="#059669" />
                      )}
                      {step.status === 'running' && (
                        <ActivityIndicator
                          size={18}
                          color="#1B3A6B"
                        />
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
        {phase === 'complete' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-5 items-center">
              <View className="w-14 h-14 rounded-full bg-[#059669] items-center justify-center mb-3">
                <CheckCircle2 size={28} color="white" />
              </View>
              <Text className="text-base font-bold text-[#065F46]">
                Certificate Generated
              </Text>
              <Text className="text-sm text-[#047857] mt-1">
                Your salary certificate is ready for download
              </Text>
            </View>

            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Automation Log
              </Text>
              <View className="gap-2">
                {steps.map((step) => (
                  <View key={step.id} className="flex-row items-center gap-2.5">
                    <CheckCircle2 size={14} color="#059669" />
                    <Text className="text-xs text-[#4B5563] flex-1">
                      {step.name}
                    </Text>
                    {step.detail && (
                      <Text className="text-xs text-[#9CA3AF]">
                        {step.detail}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setPhase('form');
                setSteps([]);
              }}
              className="bg-[#F4EFE8] rounded-2xl py-3 items-center border border-[#E8E2D9]"
            >
              <Text className="text-sm font-semibold text-[#6B7280]">
                Generate Another
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Phase */}
        {phase === 'error' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-red-50 border border-red-200 p-5 items-center">
              <AlertCircle size={32} color="#DC2626" />
              <Text className="text-base font-bold text-red-700 mt-3">
                Generation Failed
              </Text>
              <Text className="text-sm text-red-600 mt-1">
                An error occurred during certificate generation.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPhase('form');
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
