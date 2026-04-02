'use client';
import { useState, useEffect } from 'react';
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
  Zap,
  FileText,
  Calendar,
  Receipt,
  ChevronRight,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle2,
  Activity,
  Building2,
  Layers,
} from 'lucide-react-native';
import {
  AUTOMATION_DEFS,
  ROI_METRICS,
  TOTAL_WEEKLY_HOURS_SAVED,
  TOTAL_ANNUAL_HOURS_SAVED,
  AVG_ERROR_REDUCTION,
  getAllLogs,
  seedDemoLogs,
  type AutomationRun,
} from '@/lib/automationEngine';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  FileText,
  Calendar,
  Receipt,
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function statusColor(s: string) {
  if (s === 'completed' || s === 'approved')
    return { bg: '#F0FDF4', text: '#059669', border: '#BBF7D0' };
  if (s === 'running')
    return { bg: '#EFF6FF', text: '#1B3A6B', border: '#BFDBFE' };
  if (s === 'failed' || s === 'rejected')
    return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
  return { bg: '#F4EFE8', text: '#6B7280', border: '#E8E2D9' };
}

export default function AutomationsHub() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBeforeAfter, setShowBeforeAfter] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await seedDemoLogs();
        const allLogs = await getAllLogs();
        setLogs(allLogs);
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRuns = logs.length;
  const successRuns = logs.filter(
    (l) => l.status === 'completed' || l.status === 'approved'
  ).length;
  const avgDuration =
    totalRuns > 0
      ? Math.round(
          logs.reduce((s, l) => s + (l.durationMs ?? 0), 0) / totalRuns
        )
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F4EFE8]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1A1A2E]">Automations</Text>
          <Text className="text-sm text-[#6B7280] mt-1">
            HR · Finance · Workflow
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color="#1B3A6B" />
          </View>
        ) : (
          <>
            {/* Hero Card — ROI Impact */}
            <View
              className="rounded-2xl p-6 mb-6 overflow-hidden"
              style={{
                backgroundColor: '#1B3A6B',
              }}
            >
              <View className="flex-row items-center gap-3 mb-4">
                <View
                  className="w-10 h-10 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(200,151,58,0.2)' }}
                >
                  <Zap size={18} color="#C8973A" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-white">
                    Automation Impact
                  </Text>
                  <Text className="text-xs text-blue-200/60 mt-0.5">
                    Real-time ROI across all automations
                  </Text>
                </View>
              </View>

              {/* Big numbers */}
              <View className="gap-4 mb-5">
                <View>
                  <Text className="text-3xl font-extrabold text-white">
                    {TOTAL_WEEKLY_HOURS_SAVED}
                  </Text>
                  <Text className="text-xs text-blue-200/60 font-semibold mt-1 uppercase tracking-wide">
                    hrs/week saved
                  </Text>
                </View>
                <View>
                  <Text className="text-3xl font-extrabold text-white">
                    {AVG_ERROR_REDUCTION}%
                  </Text>
                  <Text className="text-xs text-blue-200/60 font-semibold mt-1 uppercase tracking-wide">
                    error reduction
                  </Text>
                </View>
                <View>
                  <Text className="text-3xl font-extrabold text-white">
                    {(TOTAL_ANNUAL_HOURS_SAVED / 1000).toFixed(1)}K
                  </Text>
                  <Text className="text-xs text-blue-200/60 font-semibold mt-1 uppercase tracking-wide">
                    hrs/year saved
                  </Text>
                </View>
              </View>

              {/* Per-automation bars */}
              <View className="flex-row gap-2">
                {ROI_METRICS.map((m) => (
                  <View key={m.automationId} className="flex-1">
                    <View className="flex-row items-end gap-1 h-14 mb-1.5">
                      <View
                        className="flex-1 rounded-t"
                        style={{
                          backgroundColor: 'rgba(200,151,58,0.5)',
                          height: `${(m.weeklyHoursSaved / 140) * 100}%`,
                        }}
                      />
                      <View
                        className="flex-1 rounded-t"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          height: `${(m.runsPerWeek / 300) * 100}%`,
                        }}
                      />
                    </View>
                    <Text className="text-xs text-blue-200/50 font-semibold">
                      {m.label.split(' ')[0]}
                    </Text>
                    <Text className="text-xs font-bold text-white">
                      {m.weeklyHoursSaved}h/wk
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Automation Cards */}
            <View className="mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Layers size={16} color="#C8973A" />
                <Text className="text-sm font-bold text-[#1A1A2E]">
                  Automations
                </Text>
              </View>

              <View className="gap-3">
                {AUTOMATION_DEFS.map((def) => {
                  const IconComp = ICON_MAP[def.icon] ?? FileText;
                  const metric = ROI_METRICS.find(
                    (m) => m.automationId === def.id
                  );
                  const routeMap: Record<string, string> = {
                    'salary-certificate':
                      '/automations/salary-certificate',
                    'leave-request': '/automations/leave-request',
                    'expense-claim': '/automations/expense-claim',
                  };
                  return (
                    <View key={def.id}>
                      <TouchableOpacity
                        onPress={() => router.push(routeMap[def.id])}
                        activeOpacity={0.7}
                        className="flex-row items-start gap-3 rounded-2xl bg-white p-4 border border-[#E8E2D9]"
                      >
                        <View
                          className="w-12 h-12 rounded-2xl items-center justify-center"
                          style={{ backgroundColor: '#1B3A6B' }}
                        >
                          <IconComp size={20} color="white" />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="text-sm font-bold text-[#1A1A2E]">
                              {def.title}
                            </Text>
                            <View
                              className="rounded-full px-2 py-0.5"
                              style={{ backgroundColor: '#F0FDF4' }}
                            >
                              <Text className="text-xs font-bold text-[#059669] uppercase">
                                {def.status}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xs text-[#6B7280] mt-1">
                            {def.description}
                          </Text>

                          {metric && (
                            <View className="flex-row gap-3 mt-2">
                              <View className="flex-row items-center gap-1">
                                <Clock size={10} color="#9CA3AF" />
                                <Text className="text-xs text-[#9CA3AF]">
                                  {metric.afterTime}
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                <TrendingUp size={10} color="#9CA3AF" />
                                <Text className="text-xs text-[#9CA3AF]">
                                  {metric.weeklyHoursSaved}h/wk
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                <Shield size={10} color="#9CA3AF" />
                                <Text className="text-xs text-[#9CA3AF]">
                                  {metric.errorReductionPct}% fewer
                                </Text>
                              </View>
                            </View>
                          )}

                          <View className="flex-row gap-1.5 mt-2 flex-wrap">
                            {def.integrations.map((int) => (
                              <View
                                key={int}
                                className="rounded-full px-2 py-0.5 bg-[#F4EFE8] border border-[#E8E2D9]"
                              >
                                <Text className="text-xs text-[#6B7280] font-medium">
                                  {int}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        <ChevronRight size={18} color="#C8973A" />
                      </TouchableOpacity>

                      {/* Before/After toggle */}
                      <TouchableOpacity
                        onPress={() =>
                          setShowBeforeAfter(
                            showBeforeAfter === def.id ? null : def.id
                          )
                        }
                        className="mt-1 items-center justify-center py-1.5"
                      >
                        <Text className="text-xs font-semibold text-[#C8973A]">
                          {showBeforeAfter === def.id ? 'Hide' : 'View'} Before
                          vs After
                        </Text>
                      </TouchableOpacity>

                      {showBeforeAfter === def.id && (
                        <View
                          className="rounded-2xl bg-[#FEF9F0] border border-[#F5E6C8] p-4 mt-1"
                        >
                          <View className="gap-4">
                            <View>
                              <Text className="text-xs font-bold text-red-600 mb-2">
                                Before (Manual)
                              </Text>
                              {def.beforeProcess.map((s, j) => (
                                <Text
                                  key={j}
                                  className="text-xs text-[#6B7280] leading-relaxed"
                                >
                                  • {s}
                                </Text>
                              ))}
                            </View>
                            <View>
                              <Text className="text-xs font-bold text-[#059669] mb-2">
                                After (Automated)
                              </Text>
                              {def.afterProcess.map((s, j) => (
                                <Text
                                  key={j}
                                  className="text-xs text-[#6B7280] leading-relaxed"
                                >
                                  • {s}
                                </Text>
                              ))}
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Recent Runs */}
            <View className="mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Activity size={16} color="#C8973A" />
                <Text className="text-sm font-bold text-[#1A1A2E]">
                  Recent Runs
                </Text>
                <Text className="text-xs text-[#9CA3AF] ml-auto">
                  {totalRuns} total • {successRuns} successful
                </Text>
              </View>

              <View className="gap-2">
                {logs.slice(0, 6).map((log) => {
                  const sc = statusColor(log.status);
                  const isSuccess =
                    log.status === 'completed' || log.status === 'approved';
                  return (
                    <View
                      key={log.id}
                      className="flex-row items-center gap-3 rounded-2xl bg-white p-3 border border-[#E8E2D9]"
                    >
                      <View
                        className="w-9 h-9 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: sc.bg }}
                      >
                        {isSuccess && (
                          <CheckCircle2 size={16} color={sc.text} />
                        )}
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-xs font-semibold text-[#1A1A2E]">
                          {log.title}
                        </Text>
                        <Text className="text-xs text-[#9CA3AF] mt-0.5">
                          {log.triggeredBy} • {log.company}
                        </Text>
                      </View>
                      <View className="items-end">
                        <View
                          className="rounded-full px-2 py-0.5"
                          style={{ backgroundColor: sc.bg }}
                        >
                          <Text
                            className="text-xs font-bold uppercase"
                            style={{ color: sc.text }}
                          >
                            {log.status}
                          </Text>
                        </View>
                        {log.durationMs && (
                          <Text className="text-xs text-[#9CA3AF] mt-1">
                            {formatDuration(log.durationMs)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
                {logs.length === 0 && (
                  <View className="items-center justify-center py-8">
                    <Activity size={24} color="#9CA3AF" />
                    <Text className="text-xs text-[#9CA3AF] mt-2">
                      No automation runs yet. Try one above!
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Integrations */}
            <View className="mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <Building2 size={16} color="#C8973A" />
                <Text className="text-sm font-bold text-[#1A1A2E]">
                  Connected Integrations
                </Text>
              </View>

              <View className="gap-2">
                {[
                  {
                    name: 'SAP SuccessFactors',
                    desc: 'Employee data, leave, payroll',
                  },
                  { name: 'Google Drive', desc: 'Document storage & sync' },
                  { name: 'Slack', desc: 'Notifications & alerts' },
                  { name: 'Email (SMTP)', desc: 'Confirmations & reports' },
                  { name: 'Claude AI', desc: 'Vision, NLP, extraction' },
                  { name: 'Google Calendar', desc: 'Leave & events sync' },
                ].map((int) => (
                  <View
                    key={int.name}
                    className="rounded-2xl bg-white border border-[#E8E2D9] p-3"
                  >
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#059669' }}
                      />
                      <Text className="text-xs font-bold text-[#1A1A2E]">
                        {int.name}
                      </Text>
                    </View>
                    <Text className="text-xs text-[#9CA3AF]">{int.desc}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Footer CTA */}
            <View className="rounded-2xl bg-[#F4EFE8] border border-[#E8E2D9] p-4 mb-6">
              <Text className="text-xs text-[#9CA3AF] font-medium text-center">
                Available to{' '}
                <Text className="font-bold text-[#1B3A6B]">45,000+</Text>{' '}
                employees across{' '}
                <Text className="font-bold text-[#1B3A6B]">30+</Text> IHC
                subsidiaries
              </Text>
              <Text className="text-xs text-[#9CA3AF] mt-1 text-center">
                Estimated annual savings:{' '}
                <Text className="font-bold text-[#C8973A]">AED 2.4M</Text> in
                operational costs
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
