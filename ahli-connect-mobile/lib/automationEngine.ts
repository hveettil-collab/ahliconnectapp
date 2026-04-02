/**
 * Automation Engine — Core infrastructure for Ahli Connect automations (React Native)
 * Handles logging, audit trail, integration hooks, and ROI tracking.
 * Uses AsyncStorage instead of localStorage for persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

export type AutomationId = 'salary-certificate' | 'leave-request' | 'expense-claim';
export type AutomationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'approved' | 'rejected';

export interface AutomationRun {
  id: string;
  automationId: AutomationId;
  title: string;
  status: AutomationStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  triggeredBy: string;
  department: string;
  company: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  steps: AutomationStep[];
  integrations: IntegrationLog[];
  error?: string;
}

export interface AutomationStep {
  id: string;
  name: string;
  status: AutomationStatus;
  startedAt: string;
  completedAt?: string;
  detail?: string;
}

export interface IntegrationLog {
  system: string;
  action: string;
  status: 'success' | 'failed' | 'skipped';
  timestamp: string;
  detail?: string;
}

/* ═══════════════════════════════════════════
   ROI METRICS
   ═══════════════════════════════════════════ */

export interface ROIMetric {
  automationId: AutomationId;
  label: string;
  beforeTime: string;
  afterTime: string;
  beforeSteps: number;
  afterSteps: number;
  timeSavedPerRun: number;
  runsPerWeek: number;
  weeklyHoursSaved: number;
  errorReductionPct: number;
  complianceImprovement: string;
}

export const ROI_METRICS: ROIMetric[] = [
  {
    automationId: 'salary-certificate',
    label: 'HR Document Generation',
    beforeTime: '3-5 business days',
    afterTime: '< 30 seconds',
    beforeSteps: 7,
    afterSteps: 2,
    timeSavedPerRun: 45,
    runsPerWeek: 120,
    weeklyHoursSaved: 90,
    errorReductionPct: 98,
    complianceImprovement: 'Auto-stamped with digital signatures; tamper-proof audit trail',
  },
  {
    automationId: 'leave-request',
    label: 'Leave Management',
    beforeTime: '2-3 days (email)',
    afterTime: '< 2 minutes',
    beforeSteps: 5,
    afterSteps: 2,
    timeSavedPerRun: 35,
    runsPerWeek: 200,
    weeklyHoursSaved: 117,
    errorReductionPct: 95,
    complianceImprovement: 'Policy auto-enforced; manager routing rules; audit log',
  },
  {
    automationId: 'expense-claim',
    label: 'Expense Processing',
    beforeTime: '30 min manual entry',
    afterTime: '< 2 minutes',
    beforeSteps: 8,
    afterSteps: 3,
    timeSavedPerRun: 28,
    runsPerWeek: 300,
    weeklyHoursSaved: 140,
    errorReductionPct: 92,
    complianceImprovement: 'AI policy check; duplicate detection; auto-categorisation',
  },
];

export const TOTAL_WEEKLY_HOURS_SAVED = ROI_METRICS.reduce((s, m) => s + m.weeklyHoursSaved, 0);
export const TOTAL_ANNUAL_HOURS_SAVED = TOTAL_WEEKLY_HOURS_SAVED * 52;
export const AVG_ERROR_REDUCTION = Math.round(ROI_METRICS.reduce((s, m) => s + m.errorReductionPct, 0) / ROI_METRICS.length);

/* ═══════════════════════════════════════════
   AUTOMATION LOGGER — In-memory + AsyncStorage
   ═══════════════════════════════════════════ */

const STORAGE_KEY = 'ahli_automation_logs';

async function loadLogs(): Promise<AutomationRun[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLogs(logs: AutomationRun[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-100)));
  } catch {
    // Silently handle save errors
  }
}

export async function getAllLogs(): Promise<AutomationRun[]> {
  const logs = await loadLogs();
  return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getLogsByAutomation(id: AutomationId): Promise<AutomationRun[]> {
  const allLogs = await getAllLogs();
  return allLogs.filter(l => l.automationId === id);
}

export async function createRun(
  automationId: AutomationId,
  title: string,
  triggeredBy: string,
  department: string,
  company: string,
  input: Record<string, unknown>,
): Promise<AutomationRun> {
  const run: AutomationRun = {
    id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    automationId,
    title,
    status: 'running',
    startedAt: new Date().toISOString(),
    triggeredBy,
    department,
    company,
    input,
    steps: [],
    integrations: [],
  };
  const logs = await loadLogs();
  logs.push(run);
  await saveLogs(logs);
  return run;
}

export async function updateRun(runId: string, updates: Partial<AutomationRun>): Promise<AutomationRun | null> {
  const logs = await loadLogs();
  const idx = logs.findIndex(l => l.id === runId);
  if (idx === -1) return null;
  logs[idx] = { ...logs[idx], ...updates };
  await saveLogs(logs);
  return logs[idx];
}

export async function addStep(runId: string, step: AutomationStep): Promise<void> {
  const logs = await loadLogs();
  const idx = logs.findIndex(l => l.id === runId);
  if (idx === -1) return;
  logs[idx].steps.push(step);
  await saveLogs(logs);
}

export async function addIntegration(runId: string, log: IntegrationLog): Promise<void> {
  const logs = await loadLogs();
  const idx = logs.findIndex(l => l.id === runId);
  if (idx === -1) return;
  logs[idx].integrations.push(log);
  await saveLogs(logs);
}

export async function completeRun(
  runId: string,
  status: AutomationStatus,
  output?: Record<string, unknown>,
  error?: string,
): Promise<AutomationRun | null> {
  const now = new Date().toISOString();
  const logs = await loadLogs();
  const idx = logs.findIndex(l => l.id === runId);
  if (idx === -1) return null;
  const started = new Date(logs[idx].startedAt).getTime();
  logs[idx] = {
    ...logs[idx],
    status,
    completedAt: now,
    durationMs: Date.now() - started,
    output: output ?? logs[idx].output,
    error,
  };
  await saveLogs(logs);
  return logs[idx];
}

/* ═══════════════════════════════════════════
   INTEGRATION HOOKS — Mock Slack, SuccessFactors, Email
   ═══════════════════════════════════════════ */

export async function notifySlack(channel: string, message: string, runId: string): Promise<IntegrationLog> {
  await new Promise(r => setTimeout(r, 300));
  const log: IntegrationLog = {
    system: 'Slack',
    action: `Posted to #${channel}: "${message.slice(0, 60)}..."`,
    status: 'success',
    timestamp: new Date().toISOString(),
    detail: `Webhook delivered to #${channel}`,
  };
  await addIntegration(runId, log);
  return log;
}

export async function syncSuccessFactors(
  action: string,
  data: Record<string, unknown>,
  runId: string,
): Promise<IntegrationLog> {
  await new Promise(r => setTimeout(r, 400));
  const log: IntegrationLog = {
    system: 'SAP SuccessFactors',
    action,
    status: 'success',
    timestamp: new Date().toISOString(),
    detail: `Synced: ${JSON.stringify(data).slice(0, 80)}`,
  };
  await addIntegration(runId, log);
  return log;
}

export async function sendEmail(to: string, subject: string, runId: string): Promise<IntegrationLog> {
  await new Promise(r => setTimeout(r, 200));
  const log: IntegrationLog = {
    system: 'Email (SMTP)',
    action: `Sent "${subject}" to ${to}`,
    status: 'success',
    timestamp: new Date().toISOString(),
  };
  await addIntegration(runId, log);
  return log;
}

export async function syncGoogleDrive(fileName: string, runId: string): Promise<IntegrationLog> {
  await new Promise(r => setTimeout(r, 350));
  const log: IntegrationLog = {
    system: 'Google Drive',
    action: `Uploaded "${fileName}" to HR Documents folder`,
    status: 'success',
    timestamp: new Date().toISOString(),
  };
  await addIntegration(runId, log);
  return log;
}

/* ═══════════════════════════════════════════
   AUTOMATION DEFINITIONS — metadata for hub
   ═══════════════════════════════════════════ */

export interface AutomationDef {
  id: AutomationId;
  title: string;
  description: string;
  category: string;
  icon: string;
  href: string;
  beforeProcess: string[];
  afterProcess: string[];
  integrations: string[];
  status: 'active' | 'beta' | 'coming-soon';
}

export const AUTOMATION_DEFS: AutomationDef[] = [
  {
    id: 'salary-certificate',
    title: 'Salary Certificate Generator',
    description: 'Instant PDF generation with digital verification, company letterhead, and multi-language support.',
    category: 'HR Documents',
    icon: 'FileText',
    href: '/automations/salary-certificate',
    beforeProcess: [
      'Employee emails HR requesting certificate',
      'HR verifies employee details in SuccessFactors',
      'HR manually creates document in Word template',
      'HR prints, stamps, and signs the certificate',
      'Employee collects from HR office',
      'Average turnaround: 3-5 business days',
      'Error rate: ~12% (wrong salary, outdated template)',
    ],
    afterProcess: [
      'Employee opens Ahli Connect → Salary Certificate',
      'Selects purpose, clicks "Generate"',
      'System auto-pulls data from SuccessFactors, generates PDF',
      'Digital signature applied, audit log created',
      'PDF ready for download in < 30 seconds',
      'Error rate: < 0.2% (data pulled live from source)',
    ],
    integrations: ['SAP SuccessFactors', 'Google Drive', 'Email', 'Slack'],
    status: 'active',
  },
  {
    id: 'leave-request',
    title: 'Smart Leave Manager',
    description: 'AI-powered leave routing with auto-balance calculation, policy enforcement, and manager approval pipeline.',
    category: 'Workflow',
    icon: 'Calendar',
    href: '/automations/leave-request',
    beforeProcess: [
      'Employee sends email to manager requesting leave',
      'Manager checks team calendar manually',
      'Manager forwards to HR for balance verification',
      'HR checks SuccessFactors for leave balance',
      'HR replies to manager with balance info',
      'Manager replies to employee with approval/rejection',
      'Average turnaround: 2-3 days',
      'Conflicts discovered after approval: ~18%',
    ],
    afterProcess: [
      'Employee opens Ahli Connect → Leave Request',
      'Selects dates — balance auto-calculated, conflicts shown',
      'Policy rules auto-enforced (min notice, blackout dates)',
      'Submitted → auto-routed to correct manager',
      'Manager approves/rejects in-app with one tap',
      'SuccessFactors synced, calendar updated, team notified',
      'Turnaround: < 2 minutes. Conflict rate: 0%',
    ],
    integrations: ['SAP SuccessFactors', 'Google Calendar', 'Slack', 'Email'],
    status: 'active',
  },
  {
    id: 'expense-claim',
    title: 'AI Expense Processor',
    description: 'Upload a receipt — AI extracts vendor, amount, date, and category. Auto-validates against company policy.',
    category: 'Finance',
    icon: 'Receipt',
    href: '/automations/expense-claim',
    beforeProcess: [
      'Employee collects physical receipts',
      'Opens Excel spreadsheet, manually enters each line item',
      'Looks up company expense policy for each category',
      'Attaches scanned receipts to email',
      'Sends to finance team for review',
      'Finance team re-enters data into ERP',
      'Finance verifies each receipt against policy',
      'Average processing: 30 min per claim, 5-7 day reimbursement',
      'Error rate: ~23% (wrong category, missing receipts)',
    ],
    afterProcess: [
      'Employee snaps photo of receipt in Ahli Connect',
      'AI extracts vendor, amount, date, category in 2 seconds',
      'Auto-validates against company expense policy',
      'Flags duplicates, over-limit items, missing info',
      'One-tap submit → auto-routed for approval',
      'Turnaround: < 2 minutes. Reimbursement: 1-2 days',
      'Error rate: < 3% (AI validation + policy engine)',
    ],
    integrations: ['Claude AI (Vision)', 'SAP SuccessFactors', 'Email', 'Slack'],
    status: 'active',
  },
];

/* ═══════════════════════════════════════════
   SEED DATA — pre-populate demo logs
   ═══════════════════════════════════════════ */

export async function seedDemoLogs(): Promise<void> {
  const existing = await loadLogs();
  if (existing.length > 0) return;

  const now = Date.now();
  const demoLogs: AutomationRun[] = [
    {
      id: 'demo_001',
      automationId: 'salary-certificate',
      title: 'Salary Certificate — Bank Loan',
      status: 'completed',
      startedAt: new Date(now - 86400000 * 2).toISOString(),
      completedAt: new Date(now - 86400000 * 2 + 4200).toISOString(),
      durationMs: 4200,
      triggeredBy: 'Sara Ahmed',
      department: 'Product & Innovation',
      company: 'Shory',
      input: { purpose: 'Bank Loan', language: 'English' },
      output: { fileSize: '42 KB', pages: 1 },
      steps: [
        {
          id: 's1',
          name: 'Fetch employee data',
          status: 'completed',
          startedAt: new Date(now - 86400000 * 2).toISOString(),
          completedAt: new Date(now - 86400000 * 2 + 800).toISOString(),
        },
        {
          id: 's2',
          name: 'Generate PDF document',
          status: 'completed',
          startedAt: new Date(now - 86400000 * 2 + 800).toISOString(),
          completedAt: new Date(now - 86400000 * 2 + 2400).toISOString(),
        },
        {
          id: 's3',
          name: 'Apply digital signature',
          status: 'completed',
          startedAt: new Date(now - 86400000 * 2 + 2400).toISOString(),
          completedAt: new Date(now - 86400000 * 2 + 3200).toISOString(),
        },
        {
          id: 's4',
          name: 'Sync to Google Drive',
          status: 'completed',
          startedAt: new Date(now - 86400000 * 2 + 3200).toISOString(),
          completedAt: new Date(now - 86400000 * 2 + 4200).toISOString(),
        },
      ],
      integrations: [
        {
          system: 'SAP SuccessFactors',
          action: 'Fetched employee record SHR-2847',
          status: 'success',
          timestamp: new Date(now - 86400000 * 2 + 800).toISOString(),
        },
        {
          system: 'Google Drive',
          action: 'Uploaded SalaryCert_SHR2847_2026.pdf',
          status: 'success',
          timestamp: new Date(now - 86400000 * 2 + 4200).toISOString(),
        },
        {
          system: 'Slack',
          action: 'Notified #hr-documents',
          status: 'success',
          timestamp: new Date(now - 86400000 * 2 + 4200).toISOString(),
        },
      ],
    },
    {
      id: 'demo_002',
      automationId: 'leave-request',
      title: 'Annual Leave — 5 days',
      status: 'approved',
      startedAt: new Date(now - 86400000).toISOString(),
      completedAt: new Date(now - 86400000 + 65000).toISOString(),
      durationMs: 65000,
      triggeredBy: 'Khalid Al Mansouri',
      department: 'Asset Management',
      company: 'Aldar Properties',
      input: { type: 'Annual', startDate: '2026-04-10', endDate: '2026-04-16', days: 5 },
      output: { approvedBy: 'Ahmed Al Rashidi', remainingBalance: 17 },
      steps: [
        {
          id: 's1',
          name: 'Validate leave balance',
          status: 'completed',
          startedAt: new Date(now - 86400000).toISOString(),
          completedAt: new Date(now - 86400000 + 500).toISOString(),
        },
        {
          id: 's2',
          name: 'Check team conflicts',
          status: 'completed',
          startedAt: new Date(now - 86400000 + 500).toISOString(),
          completedAt: new Date(now - 86400000 + 1200).toISOString(),
          detail: 'No conflicts found',
        },
        {
          id: 's3',
          name: 'Route to manager',
          status: 'completed',
          startedAt: new Date(now - 86400000 + 1200).toISOString(),
          completedAt: new Date(now - 86400000 + 1500).toISOString(),
        },
        {
          id: 's4',
          name: 'Manager approval',
          status: 'completed',
          startedAt: new Date(now - 86400000 + 1500).toISOString(),
          completedAt: new Date(now - 86400000 + 60000).toISOString(),
          detail: 'Approved by Ahmed Al Rashidi',
        },
        {
          id: 's5',
          name: 'Sync to SuccessFactors',
          status: 'completed',
          startedAt: new Date(now - 86400000 + 60000).toISOString(),
          completedAt: new Date(now - 86400000 + 65000).toISOString(),
        },
      ],
      integrations: [
        {
          system: 'SAP SuccessFactors',
          action: 'Verified balance: 22 days remaining',
          status: 'success',
          timestamp: new Date(now - 86400000 + 500).toISOString(),
        },
        {
          system: 'SAP SuccessFactors',
          action: 'Deducted 5 days, new balance: 17',
          status: 'success',
          timestamp: new Date(now - 86400000 + 65000).toISOString(),
        },
        {
          system: 'Slack',
          action: 'Notified #aldar-team: Khalid on leave Apr 10-16',
          status: 'success',
          timestamp: new Date(now - 86400000 + 65000).toISOString(),
        },
        {
          system: 'Email (SMTP)',
          action: 'Confirmation sent to khalid.mansouri@aldar.ae',
          status: 'success',
          timestamp: new Date(now - 86400000 + 65000).toISOString(),
        },
      ],
    },
    {
      id: 'demo_003',
      automationId: 'expense-claim',
      title: 'Business Dinner — AED 420',
      status: 'completed',
      startedAt: new Date(now - 3600000 * 5).toISOString(),
      completedAt: new Date(now - 3600000 * 5 + 8500).toISOString(),
      durationMs: 8500,
      triggeredBy: 'Noura Hassan',
      department: 'Healthcare Operations',
      company: 'PureHealth',
      input: { receiptImage: 'dinner_receipt.jpg' },
      output: { vendor: 'Zuma Restaurant', amount: 420, currency: 'AED', category: 'Client Entertainment', policyCompliant: true },
      steps: [
        {
          id: 's1',
          name: 'AI receipt analysis',
          status: 'completed',
          startedAt: new Date(now - 3600000 * 5).toISOString(),
          completedAt: new Date(now - 3600000 * 5 + 2200).toISOString(),
          detail: 'Extracted: Zuma Restaurant, AED 420, 31-Mar-2026',
        },
        {
          id: 's2',
          name: 'Auto-categorise expense',
          status: 'completed',
          startedAt: new Date(now - 3600000 * 5 + 2200).toISOString(),
          completedAt: new Date(now - 3600000 * 5 + 3000).toISOString(),
          detail: 'Category: Client Entertainment',
        },
        {
          id: 's3',
          name: 'Policy compliance check',
          status: 'completed',
          startedAt: new Date(now - 3600000 * 5 + 3000).toISOString(),
          completedAt: new Date(now - 3600000 * 5 + 4500).toISOString(),
          detail: 'Within AED 500 limit ✓ | Not duplicate ✓ | Valid receipt ✓',
        },
        {
          id: 's4',
          name: 'Submit for approval',
          status: 'completed',
          startedAt: new Date(now - 3600000 * 5 + 4500).toISOString(),
          completedAt: new Date(now - 3600000 * 5 + 5000).toISOString(),
        },
        {
          id: 's5',
          name: 'Sync to finance system',
          status: 'completed',
          startedAt: new Date(now - 3600000 * 5 + 5000).toISOString(),
          completedAt: new Date(now - 3600000 * 5 + 8500).toISOString(),
        },
      ],
      integrations: [
        {
          system: 'Claude AI (Vision)',
          action: 'Extracted receipt data with 98.5% confidence',
          status: 'success',
          timestamp: new Date(now - 3600000 * 5 + 2200).toISOString(),
        },
        {
          system: 'SAP SuccessFactors',
          action: 'Created expense entry EXP-2026-1847',
          status: 'success',
          timestamp: new Date(now - 3600000 * 5 + 8500).toISOString(),
        },
        {
          system: 'Email (SMTP)',
          action: 'Receipt confirmation sent to noura.hassan@purehealth.ae',
          status: 'success',
          timestamp: new Date(now - 3600000 * 5 + 8500).toISOString(),
        },
      ],
    },
  ];
  await saveLogs(demoLogs);
}
