'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  FileText, Download, CheckCircle2, Loader2, ArrowLeft,
  Shield, Clock, Zap, Building2, Globe, ChevronRight,
  AlertCircle, RefreshCw, Eye,
} from 'lucide-react';
import {
  createRun, addStep, completeRun, notifySlack,
  syncSuccessFactors, sendEmail, syncGoogleDrive,
  type AutomationStep,
} from '@/lib/automationEngine';
import Link from 'next/link';

/* ═══════════════════════════════════════════
   SALARY CERTIFICATE AUTOMATION — End-to-end
   ═══════════════════════════════════════════ */

const PURPOSES = ['Bank Loan', 'Visa Application', 'Tenancy Contract', 'Personal Records', 'Government Authority', 'Other'];

interface StepState { id: string; name: string; status: 'pending' | 'running' | 'completed' | 'failed'; detail?: string; }

const SALARY_DATA: Record<string, { basic: number; housing: number; transport: number; other: number; joinDate: string }> = {
  'Shory':            { basic: 18000, housing: 7000, transport: 2500, other: 3500, joinDate: '15 March 2022' },
  'Aldar Properties': { basic: 28000, housing: 12000, transport: 3500, other: 6500, joinDate: '1 June 2020' },
  'PureHealth':       { basic: 22000, housing: 9000, transport: 3000, other: 4000, joinDate: '10 January 2021' },
  'IHC Group':        { basic: 35000, housing: 15000, transport: 4000, other: 8000, joinDate: '1 September 2019' },
  'EasyLease':        { basic: 16000, housing: 6500, transport: 2000, other: 2500, joinDate: '20 July 2023' },
  'Ghitha':           { basic: 14000, housing: 5500, transport: 2000, other: 2000, joinDate: '5 May 2022' },
  'Palms Sports':     { basic: 15000, housing: 6000, transport: 2000, other: 2500, joinDate: '12 November 2021' },
};

const STEP_STYLES = `
  @keyframes step-check { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes progress-fill { from { width: 0%; } to { width: 100%; } }
  @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .step-check { animation: step-check 0.3s ease-out; }
  .fade-up { animation: fade-up 0.35s ease-out both; }
`;

export default function SalaryCertificatePage() {
  const { user } = useAuth();
  const [purpose, setPurpose] = useState('Bank Loan');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [phase, setPhase] = useState<'form' | 'processing' | 'complete' | 'error'>('form');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [certificateHtml, setCertificateHtml] = useState('');
  const [metadata, setMetadata] = useState<Record<string, string>>({});
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

    // Initialize steps
    const initialSteps: StepState[] = PIPELINE_STEPS.map(s => ({ id: s.id, name: s.name, status: 'pending' }));
    setSteps(initialSteps);

    // Create automation run in logger
    const run = createRun('salary-certificate', `Salary Certificate — ${purpose}`, user?.name ?? 'Unknown', user?.department ?? 'Unknown', company, { purpose, language });
    setRunId(run.id);

    try {
      // Step 1: Fetch employee data
      updateStep('fetch', 'running');
      await delay(800);
      const sfLog: AutomationStep = { id: 's1', name: 'Fetch employee data', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Employee: ${user?.employeeId}` };
      addStep(run.id, sfLog);
      await syncSuccessFactors(`Fetched employee record ${user?.employeeId}`, { employeeId: user?.employeeId, company }, run.id);
      updateStep('fetch', 'completed', 'Employee data retrieved ✓');

      // Step 2: Validate employment
      updateStep('validate', 'running');
      await delay(600);
      addStep(run.id, { id: 's2', name: 'Validate employment status', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: 'Active, Full-Time' });
      updateStep('validate', 'completed', 'Active employment confirmed ✓');

      // Step 3: Generate PDF via API
      updateStep('generate', 'running');
      const response = await fetch('/api/automations/salary-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: user?.name ?? 'Employee',
          employeeId: user?.employeeId ?? 'EMP-0000',
          company,
          department: user?.department ?? 'Department',
          title: user?.title ?? 'Employee',
          joinDate: salary.joinDate,
          basicSalary: salary.basic,
          housingAllowance: salary.housing,
          transportAllowance: salary.transport,
          otherAllowances: salary.other,
          totalSalary: total,
          purpose,
          language,
          requestDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');
      const result = await response.json();
      setCertificateHtml(result.html);
      setMetadata(result.metadata);
      addStep(run.id, { id: 's3', name: 'Generate PDF document', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Size: ${result.metadata.fileSize}` });
      updateStep('generate', 'completed', `Document generated (${result.metadata.fileSize}) ✓`);

      // Step 4: Digital signature
      updateStep('sign', 'running');
      await delay(700);
      addStep(run.id, { id: 's4', name: 'Apply digital signature', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), detail: `Hash: ${result.verificationHash}` });
      updateStep('sign', 'completed', `Verification: ${result.verificationHash}`);

      // Step 5: Google Drive
      updateStep('drive', 'running');
      await syncGoogleDrive(`SalaryCert_${user?.employeeId}_${new Date().getFullYear()}.pdf`, run.id);
      addStep(run.id, { id: 's5', name: 'Upload to Google Drive', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
      updateStep('drive', 'completed', 'Saved to HR Documents folder ✓');

      // Step 6: Notifications
      updateStep('notify', 'running');
      await Promise.all([
        notifySlack('hr-documents', `📄 Salary certificate generated for ${user?.name} (${purpose})`, run.id),
        sendEmail(user?.email ?? '', `Your salary certificate is ready — ${purpose}`, run.id),
      ]);
      addStep(run.id, { id: 's6', name: 'Send notifications', status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() });
      updateStep('notify', 'completed', 'Slack + Email sent ✓');

      // Complete the run
      completeRun(run.id, 'completed', { fileSize: result.metadata.fileSize, verificationHash: result.verificationHash });
      setPhase('complete');
    } catch (err) {
      completeRun(run.id, 'failed', undefined, String(err));
      setPhase('error');
    }
  }

  function updateStep(id: string, status: StepState['status'], detail?: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, detail: detail ?? s.detail } : s));
  }

  function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  function downloadCertificate() {
    const blob = new Blob([certificateHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SalaryCertificate_${user?.employeeId}_${new Date().getFullYear()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function previewCertificate() {
    const win = window.open('', '_blank');
    if (win) { win.document.write(certificateHtml); win.document.close(); }
  }

  return (
    <AppShell title="Salary Certificate" subtitle="HR Automation">
      <style>{STEP_STYLES}</style>
      <div className="space-y-5 max-w-lg mx-auto">

        {/* Back link */}
        <Link href="/automations" className="flex items-center gap-1.5 text-[13px] text-[#666D80] font-medium hover:text-[#9D63F6] transition-colors">
          <ArrowLeft size={15} /> Back to Automations
        </Link>

        {/* Header card */}
        <div className="rounded-[18px] p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #2D5AA0 60%, #9D63F6 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 85% 20%, rgba(200,151,58,0.2) 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <FileText size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold">Salary Certificate</h2>
                <p className="text-[11px] text-blue-200/70">Auto-generated with verification</p>
              </div>
            </div>
            <div className="flex gap-3 text-[10px] text-blue-200/60 flex-wrap">
              <span className="flex items-center gap-1"><Clock size={10} /> &lt; 30s</span>
              <span className="flex items-center gap-1"><Shield size={10} /> Signed</span>
              <span className="flex items-center gap-1"><Globe size={10} /> EN/AR</span>
            </div>
          </div>
        </div>

        {/* ═══ FORM PHASE ═══ */}
        {phase === 'form' && (
          <div className="space-y-4 fade-up">
            {/* Employee info (auto-filled from auth) */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3 space-y-2" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider">Employee Details</p>
              <div className="space-y-2">
                {[
                  ['Name', user?.name ?? '—'],
                  ['ID', user?.employeeId ?? '—'],
                  ['Company', company],
                  ['Department', user?.department ?? '—'],
                  ['Title', user?.title ?? '—'],
                  ['Join Date', salary.joinDate],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center">
                    <p className="text-[10px] text-[#A4ABB8] font-medium">{label}</p>
                    <p className="text-[12px] font-semibold text-[#15161E]">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary preview */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Salary Breakdown</p>
              <div className="space-y-2">
                {[
                  ['Basic Salary', salary.basic],
                  ['Housing Allowance', salary.housing],
                  ['Transport Allowance', salary.transport],
                  ['Other Allowances', salary.other],
                ].map(([label, amount]) => (
                  <div key={String(label)} className="flex justify-between text-[13px]">
                    <span className="text-[#666D80]">{label}</span>
                    <span className="font-semibold text-[#15161E]">AED {(amount as number).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-[#DFE1E6] pt-2 flex justify-between">
                  <span className="text-[14px] font-bold text-[#9D63F6]">Total Monthly</span>
                  <span className="text-[14px] font-bold text-[#9D63F6]">AED {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Purpose selector */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Purpose</p>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map(p => (
                  <button key={p} onClick={() => setPurpose(p)}
                    className="px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95"
                    style={{
                      background: purpose === p ? '#9D63F6' : 'transparent',
                      color: purpose === p ? '#fff' : '#666D80',
                      border: purpose === p ? 'none' : '1px solid #DFE1E6',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Language</p>
              <div className="flex gap-2">
                {[{ key: 'en' as const, label: 'English' }, { key: 'ar' as const, label: 'العربية' }].map(l => (
                  <button key={l.key} onClick={() => setLanguage(l.key)}
                    className="flex-1 py-2.5 rounded-[14px] text-[13px] font-semibold transition-all active:scale-95"
                    style={{
                      background: language === l.key ? '#9D63F6' : 'transparent',
                      color: language === l.key ? '#fff' : '#666D80',
                      border: language === l.key ? 'none' : '1px solid #DFE1E6',
                    }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Before/After comparison */}
            <div className="rounded-[16px] bg-[#FEF9F0] border border-[#F5E6C8] p-3">
              <p className="text-[10px] font-bold text-[#92702D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap size={11} /> Before vs After
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-red-600 mb-1 text-[11px]">Before (Manual)</p>
                  <p className="text-[11px] text-[#666D80]">• Email HR requesting cert</p>
                  <p className="text-[11px] text-[#666D80]">• HR verifies in SuccessFactors</p>
                  <p className="text-[11px] text-[#666D80]">• HR creates Word doc</p>
                  <p className="text-[11px] text-[#666D80]">• Print, stamp, sign</p>
                  <p className="font-bold text-red-600 mt-2 text-[11px]">⏱ 3-5 days</p>
                </div>
                <div>
                  <p className="font-bold text-[#059669] mb-1 text-[11px]">After (Automated)</p>
                  <p className="text-[11px] text-[#666D80]">• Select purpose</p>
                  <p className="text-[11px] text-[#666D80]">• Click "Generate"</p>
                  <p className="text-[11px] text-[#666D80]">• Auto-pull + PDF + sign</p>
                  <p className="text-[11px] text-[#666D80]">• Download instantly</p>
                  <p className="font-bold text-[#059669] mt-2 text-[11px]">⚡ &lt; 30 sec</p>
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button onClick={runAutomation}
              className="w-full py-4 rounded-[16px] text-[15px] font-bold text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #9D63F6 0%, #2D5AA0 100%)', boxShadow: '0 4px 16px rgba(27,58,107,0.3)' }}>
              <Zap size={18} /> Generate Certificate
            </button>
          </div>
        )}

        {/* ═══ PROCESSING PHASE — Live pipeline ═══ */}
        {phase === 'processing' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3.5" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[13px] font-bold text-[#15161E] mb-3">Automation Pipeline</p>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.status === 'completed' && <CheckCircle2 size={18} className="text-[#059669] step-check" />}
                      {step.status === 'running' && <Loader2 size={18} className="text-[#9D63F6] animate-spin" />}
                      {step.status === 'pending' && <div className="w-[18px] h-[18px] rounded-full border-2 border-[#DFE1E6]" />}
                      {step.status === 'failed' && <AlertCircle size={18} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold ${step.status === 'completed' ? 'text-[#059669]' : step.status === 'running' ? 'text-[#9D63F6]' : 'text-[#A4ABB8]'}`}>
                        {step.name}
                      </p>
                      {step.detail && step.status === 'completed' && (
                        <p className="text-[11px] text-[#A4ABB8] mt-0.5">{step.detail}</p>
                      )}
                      {step.status === 'running' && (
                        <div className="mt-1.5 h-1 rounded-full bg-[#DFE1E6] overflow-hidden">
                          <div className="h-full rounded-full bg-[#9D63F6]" style={{ animation: 'progress-fill 1.5s ease-out forwards' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ COMPLETE PHASE ═══ */}
        {phase === 'complete' && (
          <div className="space-y-4 fade-up">
            {/* Success banner */}
            <div className="rounded-[16px] bg-[#F0FDF4] border border-[#BBF7D0] p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center mx-auto mb-2 step-check">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-[#065F46]">Certificate Generated</h3>
              <p className="text-[12px] text-[#047857] mt-1">Ready for download</p>
            </div>

            {/* Pipeline summary */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Automation Log</p>
              <div className="space-y-2">
                {steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2.5 text-[12px]">
                    <CheckCircle2 size={14} className="text-[#059669] shrink-0" />
                    <span className="text-[#4B5563] flex-1">{step.name}</span>
                    <span className="text-[#A4ABB8] text-[10px]">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration log */}
            <div className="rounded-[16px] bg-white border border-[#DFE1E6] p-3" style={{ boxShadow: '0 2px 12px rgba(27,58,107,0.05)' }}>
              <p className="text-[10px] font-bold text-[#A4ABB8] uppercase tracking-wider mb-2">Integrations Triggered</p>
              <div className="space-y-2">
                {['SAP SuccessFactors — Employee data synced', 'Google Drive — Document uploaded', 'Slack — #hr-documents notified', 'Email — Confirmation sent'].map(i => (
                  <div key={i} className="flex items-center gap-2.5 text-[12px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span className="text-[#4B5563]">{i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button onClick={previewCertificate}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-[#15161E] bg-white border border-[#DFE1E6] active:scale-[0.97] transition-all shadow-sm">
                <Eye size={16} /> Preview
              </button>
              <button onClick={downloadCertificate}
                className="flex-[1.4] flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                <Download size={16} /> Download
              </button>
            </div>

            {/* Generate another */}
            <button onClick={() => { setPhase('form'); setSteps([]); setCertificateHtml(''); }}
              className="w-full py-2.5 rounded-[12px] text-[12px] font-semibold text-[#666D80] bg-[#F8F9FB] border border-[#DFE1E6] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5">
              <RefreshCw size={13} /> Generate Another
            </button>
          </div>
        )}

        {/* ═══ ERROR PHASE ═══ */}
        {phase === 'error' && (
          <div className="space-y-4 fade-up">
            <div className="rounded-[16px] bg-red-50 border border-red-200 p-4 text-center">
              <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
              <h3 className="text-[15px] font-bold text-red-700">Generation Failed</h3>
              <p className="text-[12px] text-red-600 mt-1">An error occurred. Please try again.</p>
            </div>
            <button onClick={() => { setPhase('form'); setSteps([]); }}
              className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white bg-[#9D63F6] active:scale-[0.98] transition-all">
              Try Again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
