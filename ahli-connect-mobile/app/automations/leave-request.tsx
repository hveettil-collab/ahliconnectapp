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
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Zap,
  AlertCircle,
  Sun,
  Stethoscope,
  Baby,
  Plane,
} from 'lucide-react-native';
import {
  createRun,
  addStep,
  completeRun,
  notifySlack,
  syncSuccessFactors,
  sendEmail,
} from '@/lib/automationEngine';

const LEAVE_TYPES = [
  { id: 'annual', label: 'Annual Leave', icon: Sun, balance: 22, color: '#1B3A6B' },
  { id: 'sick', label: 'Sick Leave', icon: Stethoscope, balance: 10, color: '#DC2626' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, balance: 5, color: '#EA580C' },
  { id: 'parental', label: 'Parental', icon: Baby, balance: 45, color: '#7C3AED' },
  { id: 'travel', label: 'Travel Leave', icon: Plane, balance: 3, color: '#0D9488' },
];

const MANAGERS = [
  { name: 'Ahmed Al Rashidi', title: 'Chief Strategy Officer', company: 'IHC Group' },
  { name: 'Maryam Jaber', title: 'Head of Leasing', company: 'Aldar Properties' },
  { name: 'Faris Al Nuaimi', title: 'Engineering Lead', company: 'Shory' },
];

interface StepState {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

export default function LeaveRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [phase, setPhase] = useState<'form' | 'processing' | 'approved' | 'error'>('form');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [approver, setApprover] = useState(MANAGERS[0]);

  const selectedType = LEAVE_TYPES.find((t) => t.id === leaveType) ?? LEAVE_TYPES[0];

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };

  const requestedDays = calcDays();
  const remainingAfter = selectedType.balance - requestedDays;

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  }

  function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runAutomation() {
    if (!startDate || !endDate || requestedDays <= 0) return;

    setPhase('processing');
    const pipelineSteps: StepState[] = [
      { id: 'balance', name: 'Validating leave balance', status: 'pending' },
      { id: 'policy', name: 'Checking company policy rules', status: 'pending' },
      { id: 'conflicts', name: 'Scanning team calendar for conflicts', status: 'pending' },
      { id: 'route', name: 'Routing to manager for approval', status: 'pending' },
      { id: 'approval', name: 'Awaiting manager approval', status: 'pending' },
      { id: 'sync', name: 'Syncing to SuccessFactors & calendar', status: 'pending' },
      { id: 'notify', name: 'Sending notifications', status: 'pending' },
    ];
    setSteps(pipelineSteps);

    const run = await createRun(
      'leave-request',
      `${selectedType.label} — ${requestedDays} days`,
      user?.name ?? 'Unknown',
      user?.department ?? 'Unknown',
      user?.company ?? 'IHC Group',
      { type: leaveType, startDate, endDate, days: requestedDays, reason }
    );

    try {
      updateStep('balance', 'running');
      await delay(700);
      await syncSuccessFactors(`Verified balance: ${selectedType.balance} days`, { leaveType, balance: selectedType.balance }, run.id);
      await addStep(run.id, {
        id: 's1',
        name: 'Validate leave balance',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `${selectedType.balance} days available`,
      });
      updateStep('balance', 'completed', `${selectedType.balance} days available, ${requestedDays} requested ✓`);

      updateStep('policy', 'running');
      await delay(600);
      await addStep(run.id, {
        id: 's2',
        name: 'Check company policy',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'All policies met',
      });
      updateStep('policy', 'completed', 'Min notice period met ✓ | No blackout dates ✓');

      updateStep('conflicts', 'running');
      await delay(900);
      await addStep(run.id, {
        id: 's3',
        name: 'Scan team conflicts',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: 'No conflicts',
      });
      updateStep('conflicts', 'completed', 'No team conflicts ✓');

      updateStep('route', 'running');
      await delay(500);
      const mgr = MANAGERS[Math.floor(Math.random() * MANAGERS.length)];
      setApprover(mgr);
      await addStep(run.id, {
        id: 's4',
        name: 'Route to manager',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `Routed to ${mgr.name}`,
      });
      updateStep('route', 'completed', `Sent to ${mgr.name}`);

      updateStep('approval', 'running');
      await delay(3000);
      await addStep(run.id, {
        id: 's5',
        name: 'Manager approval',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        detail: `Approved by ${mgr.name}`,
      });
      updateStep('approval', 'completed', `Approved by ${mgr.name} ✓`);

      updateStep('sync', 'running');
      await syncSuccessFactors(
        `Deducted ${requestedDays} days, new balance: ${remainingAfter}`,
        { requestedDays, remainingAfter },
        run.id
      );
      await addStep(run.id, {
        id: 's6',
        name: 'Sync to SuccessFactors',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      updateStep('sync', 'completed', `Balance updated: ${remainingAfter} days remaining ✓`);

      updateStep('notify', 'running');
      await Promise.all([
        notifySlack(
          `${user?.company?.toLowerCase().replace(/\s+/g, '-')}-team`,
          `🏖 ${user?.name} on ${selectedType.label}: ${startDate} to ${endDate}`,
          run.id
        ),
        sendEmail(user?.email ?? '', `Leave Approved: ${selectedType.label} (${startDate} to ${endDate})`, run.id),
      ]);
      await addStep(run.id, {
        id: 's7',
        name: 'Send notifications',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      await completeRun(run.id, 'approved', { approvedBy: mgr.name, remainingBalance: remainingAfter });
      setPhase('approved');
    } catch {
      await completeRun(run.id, 'failed', undefined, 'Automation pipeline error');
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
              <Calendar size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                Smart Leave Manager
              </Text>
              <Text className="text-xs text-blue-200/70 mt-0.5">
                Auto-balance, conflict check, instant approval
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Clock size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">less than 2 min</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Users size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">Conflict detection</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Shield size={11} color="#9CA3AF" />
              <Text className="text-xs text-blue-200/60">Policy enforced</Text>
            </View>
          </View>
        </View>

        {/* Form Phase */}
        {phase === 'form' && (
          <View className="gap-4 mb-6">
            {/* Leave Type */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-3">
                Leave Type
              </Text>
              <View className="gap-2">
                {LEAVE_TYPES.map((t) => {
                  const TIcon = t.icon;
                  const active = leaveType === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => setLeaveType(t.id)}
                      className="flex-row items-center gap-3 p-3 rounded-2xl"
                      style={{
                        backgroundColor: active ? `${t.color}15` : 'transparent',
                        borderWidth: 1,
                        borderColor: active ? t.color : '#E8E2D9',
                      }}
                    >
                      <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${t.color}15` }}>
                        <TIcon size={17} color={t.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-[#1A1A2E]">
                          {t.label}
                        </Text>
                        <Text className="text-xs text-[#9CA3AF]">
                          Balance: {t.balance} days
                        </Text>
                      </View>
                      {active && <CheckCircle2 size={18} color={t.color} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date inputs */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4 gap-3">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                Select Dates
              </Text>
              <View>
                <Text className="text-xs text-[#9CA3AF] font-medium mb-1">
                  Start Date
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onChangeText={setStartDate}
                  className="bg-[#F4EFE8] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm"
                  placeholderTextColor="#B8B3A9"
                />
              </View>
              <View>
                <Text className="text-xs text-[#9CA3AF] font-medium mb-1">
                  End Date
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onChangeText={setEndDate}
                  className="bg-[#F4EFE8] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm"
                  placeholderTextColor="#B8B3A9"
                />
              </View>
              {requestedDays > 0 && (
                <View className="rounded-2xl bg-[#F4EFE8] p-2 flex-row justify-between">
                  <Text className="text-xs text-[#6B7280]">
                    Selected: <Text className="font-bold text-[#1B3A6B]">{requestedDays} days</Text>
                  </Text>
                  <Text className="text-xs text-[#6B7280]">
                    Balance after: <Text className={remainingAfter >= 0 ? 'font-bold text-[#059669]' : 'font-bold text-red-600'}>{remainingAfter} days</Text>
                  </Text>
                </View>
              )}
            </View>

            {/* Reason */}
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-4">
              <Text className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
                Reason (optional)
              </Text>
              <TextInput
                placeholder="Brief reason for leave..."
                value={reason}
                onChangeText={setReason}
                className="bg-[#F4EFE8] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-sm"
                placeholderTextColor="#B8B3A9"
                multiline
              />
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
                  {['Email manager', 'Manager checks calendar', 'Forward to HR', 'HR checks balance', 'Reply chain approval', 'TP 2-3 days'].map((s, i) => (
                    <Text key={i} className="text-xs text-[#6B7280]">
                      • {s}
                    </Text>
                  ))}
                </View>
                <View>
                  <Text className="text-xs font-bold text-[#059669] mb-1">
                    After (Automated)
                  </Text>
                  {['Pick dates on calendar', 'Auto-balance + conflicts', 'One-tap manager approval', 'Auto-sync everything'].map((s, i) => (
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

            {/* Submit */}
            <TouchableOpacity
              onPress={runAutomation}
              disabled={requestedDays <= 0 || remainingAfter < 0}
              className="bg-[#1B3A6B] rounded-2xl py-4 items-center justify-center flex-row gap-2"
              style={{
                opacity: requestedDays <= 0 || remainingAfter < 0 ? 0.4 : 1,
              }}
              activeOpacity={0.8}
            >
              <Zap size={18} color="white" />
              <Text className="text-base font-bold text-white">
                Submit Leave Request
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Processing Phase */}
        {phase === 'processing' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-white border border-[#E8E2D9] p-5">
              <Text className="text-base font-bold text-[#1A1A2E] mb-4">
                Approval Pipeline
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
                            style={{ width: step.id === 'approval' ? '40%' : '70%' }}
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

        {/* Approved Phase */}
        {phase === 'approved' && (
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-5 items-center">
              <View className="w-14 h-14 rounded-full bg-[#059669] items-center justify-center mb-3">
                <CheckCircle2 size={28} color="white" />
              </View>
              <Text className="text-base font-bold text-[#065F46]">
                Leave Approved
              </Text>
              <Text className="text-sm text-[#047857] mt-1">
                {selectedType.label}: {startDate} to {endDate} ({requestedDays} days)
              </Text>
              <Text className="text-xs text-[#6B7280] mt-2">
                Approved by {approver.name}
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
                setPhase('form');
                setSteps([]);
                setStartDate('');
                setEndDate('');
                setReason('');
              }}
              className="bg-[#F4EFE8] rounded-2xl py-3 items-center border border-[#E8E2D9]"
            >
              <Text className="text-sm font-semibold text-[#6B7280]">
                Submit Another Request
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
                Request Failed
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
