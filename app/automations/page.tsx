'use client';
import { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Zap, FileText, Calendar, Receipt, ChevronRight, Clock,
  TrendingUp, Shield, CheckCircle2, AlertCircle, BarChart3,
  Users, Building2, Sparkles, ArrowRight, Activity,
  Timer, Target, ArrowDown, ArrowUp, Layers, Play,
} from 'lucide-react';
import {
  AUTOMATION_DEFS, ROI_METRICS, TOTAL_WEEKLY_HOURS_SAVED,
  TOTAL_ANNUAL_HOURS_SAVED, AVG_ERROR_REDUCTION,
  getAllLogs, seedDemoLogs, type AutomationRun,
} from '@/lib/automationEngine';

const HUB_STYLES = `
  @keyframes counter-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bar-grow { from { height: 0; } to { height: var(--bar-h); } }
  @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,0.3)} 50%{box-shadow:0 0 0 6px rgba(5,150,105,0)} }
  .counter-up { animation: counter-up 0.5s ease-out both; }
  .fade-up { animation: fade-up 0.35s ease-out both; }
  .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s} .d4{animation-delay:.2s} .d5{animation-delay:.25s}
`;

const ICON_MAP: Record<string, typeof FileText> = {
  FileText, Calendar, Receipt,
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function statusColor(s: string) {
  if (s === 'completed' || s === 'approved') return { bg: '#F0FDF4', text: '#059669', border: '#BBF7D0' };
  if (s === 'running') return { bg: '#EFF6FF', text: '#1B3A6B', border: '#BFDBFE' };
  if (s === 'failed' || s === 'rejected') return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
  return { bg: '#F4EFE8', text: '#6B7280', border: '#E8E2D9' };
}

export default function AutomationsHub() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AutomationRun[]>([]);
  const [showBeforeAfter, setShowBeforeAfter] = useState<string | null>(null);

  useEffect(() => {
    seedDemoLogs();
    setLogs(getAllLogs());
  }, []);

  const totalRuns = logs.length;
  const successRuns = logs.filter(l => l.status === 'completed' || l.status === 'approved').length;
  const avgDuration = totalRuns > 0 ? Math.round(logs.reduce((s, l) => s + (l.durationMs ?? 0), 0) / totalRuns) : 0;

  return (
    <AppShell title="Automations" subtitle="HR · Finance · Workflow">
      <style>{HUB_STYLES}</style>

      <div className="space-y-6">

        {/* ═══════════════════════════════════
           HERO — ROI Impact Dashboard
           ═══════════════════════════════════ */}
        <div className="rounded-[22px] p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 50%, #1B3A6B 100%)', boxShadow: '0 8px 32px rgba(27,58,107,0.2)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 30%, rgba(200,151,58,0.15) 0%, transparent 50%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(5,150,105,0.1) 0%, transparent 40%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(200,151,58,0.2)', border: '1px solid rgba(200,151,58,0.3)' }}>
                <Zap size={16} className="text-[#C8973A]" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold">Automation Impact</h2>
                <p className="text-[11px] text-blue-200/60">Real-time ROI across all automations</p>
              </div>
            </div>

            {/* Big numbers */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="counter-up d1">
                <p className="text-[28px] font-extrabold tracking-tight">{TOTAL_WEEKLY_HOURS_SAVED}</p>
                <p className="text-[10px] text-blue-200/60 font-medium uppercase tracking-wider">hrs/week saved</p>
              </div>
              <div className="counter-up d2">
                <p className="text-[28px] font-extrabold tracking-tight">{AVG_ERROR_REDUCTION}%</p>
                <p className="text-[10px] text-blue-200/60 font-medium uppercase tracking-wider">error reduction</p>
              </div>
              <div className="counter-up d3">
                <p className="text-[28px] font-extrabold tracking-tight">{(TOTAL_ANNUAL_HOURS_SAVED / 1000).toFixed(1)}K</p>
                <p className="text-[10px] text-blue-200/60 font-medium uppercase tracking-wider">hrs/year saved</p>
              </div>
            </div>

            {/* Per-automation bars */}
            <div className="grid grid-cols-3 gap-3">
              {ROI_METRICS.map((m, i) => (
                <div key={m.automationId} className="counter-up" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
                  <div className="flex items-end gap-1 h-12 mb-1.5">
                    <div className="flex-1 rounded-t-[4px]" style={{ background: 'rgba(200,151,58,0.5)', height: `${(m.weeklyHoursSaved / 140) * 100}%`, transition: 'height 0.6s ease-out' }} />
                    <div className="flex-1 rounded-t-[4px]" style={{ background: 'rgba(255,255,255,0.2)', height: `${(m.runsPerWeek / 300) * 100}%`, transition: 'height 0.6s ease-out' }} />
                  </div>
                  <p className="text-[10px] text-blue-200/50 font-medium truncate">{m.label}</p>
                  <p className="text-[12px] font-bold">{m.weeklyHoursSaved}h/wk</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════
           AUTOMATION CARDS — Quick launch
           ═══════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Layers size={15} className="text-[#C8973A]" />
            <p className="text-[14px] font-bold text-[#1A1A2E]">Automations</p>
            <div className="flex-1 h-px bg-gradient-to-r from-[#E8E2D9] to-transparent ml-2" />
          </div>

          <div className="space-y-3">
            {AUTOMATION_DEFS.map((def, i) => {
              const IconComp = ICON_MAP[def.icon] ?? FileText;
              const metric = ROI_METRICS.find(m => m.automationId === def.id);
              return (
                <div key={def.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <Link href={def.href}
                    className="block rounded-[18px] bg-white border border-[#E8E2D9] p-4 active:scale-[0.98] transition-all"
                    style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1B3A6B, #2D5AA0)' }}>
                        <IconComp size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[14px] font-bold text-[#1A1A2E]">{def.title}</h3>
                          <span className="text-[9px] font-bold text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded-full uppercase">{def.status}</span>
                        </div>
                        <p className="text-[12px] text-[#6B7280] mt-0.5 line-clamp-2">{def.description}</p>

                        {/* Metrics strip */}
                        {metric && (
                          <div className="flex items-center gap-3 mt-2.5">
                            <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                              <Clock size={10} /> {metric.afterTime}
                            </span>
                            <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                              <TrendingUp size={10} /> {metric.weeklyHoursSaved}h/wk saved
                            </span>
                            <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                              <Shield size={10} /> {metric.errorReductionPct}% fewer errors
                            </span>
                          </div>
                        )}

                        {/* Integration badges */}
                        <div className="flex gap-1.5 mt-2.5 flex-wrap">
                          {def.integrations.map(int => (
                            <span key={int} className="text-[9px] font-medium text-[#6B7280] bg-[#F4EFE8] border border-[#E8E2D9] px-2 py-0.5 rounded-full">{int}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[#C8973A] shrink-0 mt-1" />
                    </div>
                  </Link>

                  {/* Before/After toggle */}
                  <button onClick={() => setShowBeforeAfter(showBeforeAfter === def.id ? null : def.id)}
                    className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-[#C8973A] hover:text-[#92702D] transition-colors">
                    <BarChart3 size={12} /> {showBeforeAfter === def.id ? 'Hide' : 'View'} Before vs After
                  </button>

                  {showBeforeAfter === def.id && (
                    <div className="rounded-[14px] bg-[#FEF9F0] border border-[#F5E6C8] p-4 mt-1 fade-up">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-bold text-red-600 mb-2 flex items-center gap-1"><ArrowDown size={10} /> Before (Manual)</p>
                          {def.beforeProcess.map((s, j) => (
                            <p key={j} className="text-[11px] text-[#6B7280] leading-relaxed">• {s}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#059669] mb-2 flex items-center gap-1"><ArrowUp size={10} /> After (Automated)</p>
                          {def.afterProcess.map((s, j) => (
                            <p key={j} className="text-[11px] text-[#6B7280] leading-relaxed">• {s}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════
           ROI BREAKDOWN TABLE
           ═══════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Target size={15} className="text-[#C8973A]" />
            <p className="text-[14px] font-bold text-[#1A1A2E]">ROI Breakdown</p>
          </div>
          <div className="rounded-[18px] bg-white border border-[#E8E2D9] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
            <div className="grid grid-cols-4 gap-0 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider bg-[#F4EFE8] px-4 py-2.5 border-b border-[#E8E2D9]">
              <span>Automation</span>
              <span className="text-center">Before</span>
              <span className="text-center">After</span>
              <span className="text-right">Saved/wk</span>
            </div>
            {ROI_METRICS.map(m => (
              <div key={m.automationId} className="grid grid-cols-4 gap-0 px-4 py-3 border-b border-[#F4EFE8] last:border-0 items-center">
                <span className="text-[12px] font-semibold text-[#1A1A2E]">{m.label}</span>
                <span className="text-[11px] text-red-500 text-center font-medium">{m.beforeTime}</span>
                <span className="text-[11px] text-[#059669] text-center font-bold">{m.afterTime}</span>
                <span className="text-[12px] font-bold text-[#1B3A6B] text-right">{m.weeklyHoursSaved}h</span>
              </div>
            ))}
            <div className="grid grid-cols-4 gap-0 px-4 py-3 bg-[#1B3A6B] text-white">
              <span className="text-[12px] font-bold">Total Impact</span>
              <span className="text-[11px] text-center text-blue-200/70">~45 days</span>
              <span className="text-[11px] text-center text-[#C8973A] font-bold">&lt; 5 min</span>
              <span className="text-[13px] font-extrabold text-right">{TOTAL_WEEKLY_HOURS_SAVED}h</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
           RECENT AUTOMATION RUNS
           ═══════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={15} className="text-[#C8973A]" />
            <p className="text-[14px] font-bold text-[#1A1A2E]">Recent Runs</p>
            <p className="text-[11px] text-[#9CA3AF] ml-auto">{totalRuns} total • {successRuns} successful</p>
          </div>
          <div className="space-y-2">
            {logs.slice(0, 6).map(log => {
              const sc = statusColor(log.status);
              return (
                <div key={log.id} className="rounded-[14px] bg-white border border-[#E8E2D9] px-4 py-3 flex items-center gap-3" style={{ boxShadow: '0 1px 4px rgba(27,58,107,0.03)' }}>
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                    {(log.status === 'completed' || log.status === 'approved') && <CheckCircle2 size={16} style={{ color: sc.text }} />}
                    {log.status === 'running' && <Timer size={16} style={{ color: sc.text }} />}
                    {log.status === 'failed' && <AlertCircle size={16} style={{ color: sc.text }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#1A1A2E] truncate">{log.title}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{log.triggeredBy} • {log.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                      {log.status}
                    </span>
                    {log.durationMs && <p className="text-[9px] text-[#9CA3AF] mt-1">{formatDuration(log.durationMs)}</p>}
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="text-center py-8 text-[#9CA3AF]">
                <Play size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-[13px]">No automation runs yet. Try one above!</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════
           INTEGRATION STATUS
           ═══════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={15} className="text-[#C8973A]" />
            <p className="text-[14px] font-bold text-[#1A1A2E]">Connected Integrations</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { name: 'SAP SuccessFactors', status: 'Connected', desc: 'Employee data, leave, payroll' },
              { name: 'Google Drive', status: 'Connected', desc: 'Document storage & sync' },
              { name: 'Slack', status: 'Connected', desc: 'Notifications & alerts' },
              { name: 'Email (SMTP)', status: 'Connected', desc: 'Confirmations & reports' },
              { name: 'Claude AI', status: 'Connected', desc: 'Vision, NLP, extraction' },
              { name: 'Google Calendar', status: 'Connected', desc: 'Leave & events sync' },
            ].map(int => (
              <div key={int.name} className="rounded-[14px] bg-white border border-[#E8E2D9] p-3" style={{ boxShadow: '0 1px 4px rgba(27,58,107,0.03)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" style={{ animation: 'pulse-green 2s ease-in-out infinite' }} />
                  <p className="text-[11px] font-bold text-[#1A1A2E]">{int.name}</p>
                </div>
                <p className="text-[10px] text-[#9CA3AF]">{int.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA — cross-department */}
        <div className="rounded-[18px] bg-[#F4EFE8] border border-[#E8E2D9] p-4 text-center">
          <p className="text-[11px] text-[#9CA3AF] font-medium">
            Available to <strong className="text-[#1B3A6B]">45,000+</strong> employees across <strong className="text-[#1B3A6B]">30+</strong> IHC subsidiaries
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-1">Estimated annual savings: <strong className="text-[#C8973A]">AED 2.4M</strong> in operational costs</p>
        </div>
      </div>
    </AppShell>
  );
}
