'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar, ArrowLeft, CheckCircle2, Loader2, Clock, Shield,
  AlertTriangle, Users, Zap, ChevronRight, AlertCircle, XCircle,
  CalendarDays, CalendarCheck, Sun, Stethoscope, Baby, Plane,
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
  @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,0.3)} 50%{box-shadow:0 0 0 8px rgba(5,150,105,0)} }
  .step-check { animation: step-check 0.3s ease-out; }
  .fade-up { animation: fade-up 0.35s ease-out both; }
`;

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

interface StepState { id: string; name: string; status: 'pending' | 'running' | 'completed' | 'failed'; detail?: string; }

// Simple calendar helper
function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function LeaveRequestPage() {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [phase, setPhase] = useState<'form' | 'processing' | 'approved' | 'error'>('form');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [calMonth, setCalMonth] = useState(3); // April (0-indexed)
  const [calYear] = useState(2026);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [approver, setApprover] = useState(MANAGERS[0]);

  const selectedType = LEAVE_TYPES.find(t => t.id === leaveType) ?? LEAVE_TYPES[0];

  // Calculate days
  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };
  const requestedDays = calcDays();
  const remainingAfter = selectedType.balance - requestedDays;

  // Conflict check (simulate)
  const conflictTeamMembers = requestedDays > 0 && requestedDays <= 3 ? [] : requestedDays > 3 ? ['Saif Khalifa (Apr 14-16)'] : [];

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, detail: detail ?? s.detail } : s));
  }
  function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  async function runAutomation() {
    if (!startDate || !endDate || requestedDays <= 0) return;

    setPhase('processing');
    const pipelineSteps: StepState[] = [
      { id: 'balance', name: 'Validating leave balance', status: 'pending' },
      { id: 'policy', name: 'Checking company policy rules', status: 'pending' },
      { id: 'conflicts', name: 'Scanning team calendar for conflicts', status: 'pending' },
      { id: 'route', name: 'Routing to manager for approval', status: 'pending' },
      { id: 'approval', name: `Awaiting manager approval`, status: 'pending' },
      { id: 'sync', name: 'Syncing to SuccessFactors & calendar', status: 'pending' },
      { id: 'notify', name: 'Sending notifications', status: 'pending' },
    ];
    setSteps(pipelineSteps);

    const run = createRun('leave-request', `${selectedType.label} — ${requestedDays} days`, user?.name ?? 'Unknown', user?.department ?? 'Unknown', user?.company ?? 'IHC Group',
      { type: leaveType, startDate, endDate, days: requestedDays, reason });

    try {
      // Step 1: Balance validation
      updateStep('balance', 'running');
      await delay(700);
      await syncSuccessFactors(`Verified balance: ${selectedType.balance} days remaining`, { leaveType, balance: selectedType.balance }, run.id);
      addStep(run.id, { id: 's1', name: 'Validate leave balance', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `${selectedType.balance} days available` });
      updateStep('balance', 'completed', `${selectedType.balance} days available, ${requestedDays} requested ✓`);

      // Step 2: Policy check
      updateStep('policy', 'running');
      await delay(600);
      addStep(run.id, { id: 's2', name: 'Check company policy', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: 'All policies met' });
      updateStep('policy', 'completed', 'Min notice period met ✓ | No blackout dates ✓');

      // Step 3: Team conflict scan
      updateStep('conflicts', 'running');
      await delay(900);
      const hasConflicts = conflictTeamMembers.length > 0;
      addStep(run.id, { id: 's3', name: 'Scan team conflicts', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: hasConflicts ? `Warning: ${conflictTeamMembers.length} overlap` : 'No conflicts' });
      setConflicts(conflictTeamMembers);
      updateStep('conflicts', 'completed', hasConflicts ? `⚠ ${conflictTeamMembers.length} team overlap detected` : 'No team conflicts ✓');

      // Step 4: Route to manager
      updateStep('route', 'running');
      await delay(500);
      const mgr = MANAGERS[Math.floor(Math.random() * MANAGERS.length)];
      setApprover(mgr);
      addStep(run.id, { id: 's4', name: 'Route to manager', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Routed to ${mgr.name}` });
      updateStep('route', 'completed', `Sent to ${mgr.name} (${mgr.title})`);

      // Step 5: Manager approval (simulate 3s wait)
      updateStep('approval', 'running');
      await delay(3000);
      addStep(run.id, { id: 's5', name: 'Manager approval', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Approved by ${mgr.name}` });
      updateStep('approval', 'completed', `Approved by ${mgr.name} ✓`);

      // Step 6: Sync
      updateStep('sync', 'running');
      await syncSuccessFactors(`Deducted ${requestedDays} days, new balance: ${remainingAfter}`, { requestedDays, remainingAfter }, run.id);
      addStep(run.id, { id: 's6', name: 'Sync to SuccessFactors', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
      updateStep('sync', 'completed', `Balance updated: ${remainingAfter} days remaining ✓`);

      // Step 7: Notifications
      updateStep('notify', 'running');
      await Promise.all([
        notifySlack(`${user?.company?.toLowerCase().replace(/\s+/g, '-')}-team`, `🏖 ${user?.name} on ${selectedType.label}: ${startDate} to ${endDate}`, run.id),
        sendEmail(user?.email ?? '', `Leave Approved: ${selectedType.label} (${startDate} to ${endDate})`, run.id),
      ]);
      addStep(run.id, { id: 's7', name: 'Send notifications', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      completeRun(run.id, 'approved', { approvedBy: mgr.name, remainingBalance: remainingAfter });
      setPhase('approved');
    } catch {
      completeRun(run.id, 'failed', undefined, 'Automation pipeline error');
      setPhase('error');
    }
  }

  // Calendar renderer
  function renderCalendar() {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isInRange = (day: number) => {
      if (!startDate || !endDate) return false;
      const d = new Date(calYear, calMonth, day);
      return d >= new Date(startDate) && d <= new Date(endDate);
    };
    const isStart = (day: number) => startDate === `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isEnd = (day: number) => endDate === `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const handleDayClick = (day: number) => {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!startDate || (startDate && endDate)) {
        setStartDate(dateStr);
        setEndDate('');
      } else {
        if (new Date(dateStr) < new Date(startDate)) {
          setStartDate(dateStr);
        } else {
          setEndDate(dateStr);
        }
      }
    };

    return (
      <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-4" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCalMonth(m => m > 0 ? m - 1 : 11)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8]">←</button>
          <p className="text-[14px] font-bold text-[#1A1A2E]">{MONTH_NAMES[calMonth]} {calYear}</p>
          <button onClick={() => setCalMonth(m => m < 11 ? m + 1 : 0)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4EFE8]">→</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <p key={d} className="text-[10px] font-bold text-[#9CA3AF] py-1">{d}</p>
          ))}
          {cells.map((day, i) => day === null ? <div key={`e${i}`} /> : (
            <button key={day} onClick={() => handleDayClick(day)}
              className="w-9 h-9 rounded-full text-[12px] font-semibold transition-all flex items-center justify-center mx-auto"
              style={{
                background: isStart(day) || isEnd(day) ? '#1B3A6B' : isInRange(day) ? '#E8EFF8' : 'transparent',
                color: isStart(day) || isEnd(day) ? '#fff' : isInRange(day) ? '#1B3A6B' : day < new Date().getDate() && calMonth === new Date().getMonth() ? '#D1D5DB' : '#1A1A2E',
              }}>
              {day}
            </button>
          ))}
        </div>
        {requestedDays > 0 && (
          <div className="mt-3 flex items-center justify-between px-2 py-2 rounded-[12px] bg-[#F4EFE8]">
            <span className="text-[12px] text-[#6B7280]">Selected: <strong className="text-[#1B3A6B]">{requestedDays} day{requestedDays > 1 ? 's' : ''}</strong></span>
            <span className="text-[12px] text-[#6B7280]">Balance after: <strong className={remainingAfter >= 0 ? 'text-[#059669]' : 'text-red-600'}>{remainingAfter} days</strong></span>
          </div>
        )}
      </div>
    );
  }

  return (
    <AppShell title="Leave Request" subtitle="Workflow Automation">
      <style>{STEP_STYLES}</style>
      <div className="space-y-5 max-w-lg mx-auto">

        <Link href="/automations" className="flex items-center gap-1.5 text-[13px] text-[#6B7280] font-medium hover:text-[#1B3A6B] transition-colors">
          <ArrowLeft size={15} /> Back to Automations
        </Link>

        {/* Header */}
        <div className="rounded-[20px] p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 60%, #1B3A6B 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 85% 20%, rgba(200,151,58,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <CalendarCheck size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold">Smart Leave Manager</h2>
                <p className="text-[12px] text-blue-200/70">Auto-balance, conflict check, instant approval</p>
              </div>
            </div>
            <div className="flex gap-4 text-[11px] text-blue-200/60">
              <span className="flex items-center gap-1"><Clock size={11} /> &lt; 2 minutes</span>
              <span className="flex items-center gap-1"><Users size={11} /> Conflict detection</span>
              <span className="flex items-center gap-1"><Shield size={11} /> Policy enforced</span>
            </div>
          </div>
        </div>

        {/* ═══ FORM ═══ */}
        {phase === 'form' && (
          <div className="space-y-4 fade-up">
            {/* Leave type */}
            <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-4" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Leave Type</p>
              <div className="space-y-2">
                {LEAVE_TYPES.map(t => {
                  const TIcon = t.icon;
                  const active = leaveType === t.id;
                  return (
                    <button key={t.id} onClick={() => setLeaveType(t.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-[14px] transition-all active:scale-[0.98] text-left"
                      style={{ background: active ? `${t.color}10` : 'transparent', border: active ? `2px solid ${t.color}` : '1px solid #E8E2D9' }}>
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${t.color}15` }}>
                        <TIcon size={17} style={{ color: t.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-[#1A1A2E]">{t.label}</p>
                        <p className="text-[11px] text-[#9CA3AF]">Balance: {t.balance} days</p>
                      </div>
                      {active && <CheckCircle2 size={18} style={{ color: t.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendar */}
            {renderCalendar()}

            {/* Reason */}
            <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-4" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Reason (optional)</p>
              <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Brief reason for leave..."
                className="w-full bg-[#F4EFE8] border border-[#E8E2D9] rounded-[12px] px-3 py-2.5 text-[13px] outline-none focus:border-[#1B3A6B] resize-none h-20 placeholder:text-[#B8B3A9]" />
            </div>

            {/* Before/After */}
            <div className="rounded-[18px] bg-[#FEF9F0] border border-[#F5E6C8] p-4">
              <p className="text-[11px] font-bold text-[#92702D] uppercase tracking-wider mb-3 flex items-center gap-1.5"><Zap size={12} /> Before vs After</p>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="font-bold text-red-600 mb-1">Before (Manual)</p>
                  <p className="text-[#6B7280]">• Email manager</p>
                  <p className="text-[#6B7280]">• Manager checks calendar</p>
                  <p className="text-[#6B7280]">• Forward to HR</p>
                  <p className="text-[#6B7280]">• HR checks balance</p>
                  <p className="text-[#6B7280]">• Reply chain approval</p>
                  <p className="font-bold text-red-600 mt-2">⏱ 2-3 days</p>
                </div>
                <div>
                  <p className="font-bold text-[#059669] mb-1">After (Automated)</p>
                  <p className="text-[#6B7280]">• Pick dates on calendar</p>
                  <p className="text-[#6B7280]">• Auto-balance + conflicts</p>
                  <p className="text-[#6B7280]">• One-tap manager approval</p>
                  <p className="text-[#6B7280]">• Auto-sync everything</p>
                  <p className="text-[#6B7280]">&nbsp;</p>
                  <p className="font-bold text-[#059669] mt-2">⚡ &lt; 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button onClick={runAutomation} disabled={requestedDays <= 0 || remainingAfter < 0}
              className="w-full py-4 rounded-[16px] text-[15px] font-bold text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5AA0 100%)', boxShadow: '0 4px 16px rgba(27,58,107,0.3)' }}>
              <Zap size={18} /> Submit Leave Request
            </button>
          </div>
        )}

        {/* ═══ PROCESSING ═══ */}
        {phase === 'processing' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-5" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[14px] font-bold text-[#1A1A2E] mb-4">Approval Pipeline</p>
              <div className="space-y-3">
                {steps.map(step => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.status === 'completed' && <CheckCircle2 size={18} className="text-[#059669] step-check" />}
                      {step.status === 'running' && <Loader2 size={18} className="text-[#1B3A6B] animate-spin" />}
                      {step.status === 'pending' && <div className="w-[18px] h-[18px] rounded-full border-2 border-[#E8E2D9]" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[13px] font-semibold ${step.status === 'completed' ? 'text-[#059669]' : step.status === 'running' ? 'text-[#1B3A6B]' : 'text-[#9CA3AF]'}`}>
                        {step.name}
                      </p>
                      {step.detail && step.status === 'completed' && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{step.detail}</p>}
                      {step.status === 'running' && (
                        <div className="mt-1.5 h-1 rounded-full bg-[#E8E2D9] overflow-hidden">
                          <div className="h-full rounded-full bg-[#1B3A6B]" style={{ animation: `progress-fill ${step.id === 'approval' ? '3s' : '1s'} ease-out forwards` }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ APPROVED ═══ */}
        {phase === 'approved' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[18px] bg-[#F0FDF4] border border-[#BBF7D0] p-5 text-center">
              <div className="w-14 h-14 rounded-full bg-[#059669] flex items-center justify-center mx-auto mb-3 step-check">
                <CheckCircle2 size={28} className="text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-[#065F46]">Leave Approved</h3>
              <p className="text-[13px] text-[#047857] mt-1">
                {selectedType.label}: {startDate} to {endDate} ({requestedDays} days)
              </p>
              <p className="text-[12px] text-[#6B7280] mt-2">Approved by {approver.name}</p>
            </div>

            <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-4" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Pipeline Summary</p>
              {steps.map(step => (
                <div key={step.id} className="flex items-center gap-2.5 text-[12px] py-1">
                  <CheckCircle2 size={14} className="text-[#059669] shrink-0" />
                  <span className="text-[#4B5563] flex-1">{step.name}</span>
                  <span className="text-[#9CA3AF] text-[10px]">{step.detail}</span>
                </div>
              ))}
            </div>

            <div className="rounded-[18px] bg-white border border-[#E8E2D9] p-4" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Integrations Triggered</p>
              {['SAP SuccessFactors — Balance deducted, calendar updated', 'Slack — Team notified of absence', 'Email — Confirmation sent to employee'].map(i => (
                <div key={i} className="flex items-center gap-2.5 text-[12px] py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  <span className="text-[#4B5563]">{i}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { setPhase('form'); setSteps([]); setStartDate(''); setEndDate(''); setReason(''); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-semibold text-[#6B7280] bg-[#F4EFE8] border border-[#E8E2D9] active:scale-[0.97] transition-all">
              Submit Another Request
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[18px] bg-red-50 border border-red-200 p-5 text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-[16px] font-bold text-red-700">Request Failed</h3>
            </div>
            <button onClick={() => { setPhase('form'); setSteps([]); }} className="w-full py-3.5 rounded-[16px] text-[14px] font-bold text-white bg-[#1B3A6B]">Try Again</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
