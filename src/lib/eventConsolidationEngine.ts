/**
 * Event Consolidation Engine — CTW-COCKPIT-02D.6
 *
 * Converts fragmented email/task/risk signals into unified CEO-level events.
 * Multiple related signals → ONE event.
 *
 * GROUPING RULES (STRICT MODE):
 * 1. Same tracking/reference number (e.g. UPS tracking)
 * 2. Strong keyword cluster (e.g. "UPS" + "shipment" + "clearance")
 * 3. Same email thread (matching graph_id prefix or subject thread)
 *
 * NO GUESSING. NO LOOSE GROUPING.
 */

import { supabase } from '@/supabase';

/* ── Types ── */

export interface CEOEvent {
  id: string;
  event_name: string;
  event_type: EventType;
  priority_score: number;
  risk_level: RiskLevel;
  status: EventStatus;
  related_email_ids: string[];
  related_task_ids: string[];
  related_risk_ids: string[];
  summary: string | null;
  next_action: string | null;
  risk_summary: string | null;
  created_at: string;
  updated_at: string;
}

export type EventType = 'logistics' | 'investor' | 'regulatory' | 'product' | 'clinical' | 'partnership' | 'general';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'open' | 'in_progress' | 'resolved';

interface RawEmail {
  id: string;
  subject: string;
  sender_name: string | null;
  body_preview: string | null;
  classification: string;
  keyword_matches: string[];
  received_at: string;
  graph_id: string | null;
}

interface RawTask {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  source_id: string | null;
}

interface RawRisk {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  source_id: string | null;
}

interface SignalGroup {
  emails: RawEmail[];
  tasks: RawTask[];
  risks: RawRisk[];
  groupKey: string;
  eventType: EventType;
}

/* ── Keyword Clusters for Event Type Detection ── */

const EVENT_TYPE_CLUSTERS: { type: EventType; keywords: string[] }[] = [
  { type: 'logistics', keywords: ['ups', 'shipment', 'clearance', 'customs', 'freight', 'delivery', 'tracking', 'courier', 'dhl', 'fedex', 'cold chain'] },
  { type: 'regulatory', keywords: ['hsa', 'fda', 'nmpa', 'cdsco', 'approval', 'clearance', 'submission', 'compliance', 'ivdr', 'ce mark', 'registration'] },
  { type: 'investor', keywords: ['investor', 'funding', 'pitch', 'valuation', 'term sheet', 'due diligence', 'round', 'capital'] },
  { type: 'clinical', keywords: ['clinical', 'trial', 'study', 'validation', 'ktph', 'samples', 'sensitivity', 'specificity', 'lab'] },
  { type: 'product', keywords: ['product', 'feature', 'bug', 'release', 'deploy', 'build', 'test', 'development'] },
  { type: 'partnership', keywords: ['partner', 'collaboration', 'mou', 'agreement', 'angsana', 'singlera', 'distributor'] },
];

/* ── Grouping Logic (STRICT MODE) ── */

/**
 * Extract tracking/reference numbers from text.
 * Matches patterns like: 1Z999AA10123456784 (UPS), JD014600003888009007 (JD), etc.
 */
function extractTrackingNumbers(text: string): string[] {
  const patterns = [
    /\b1Z[A-Z0-9]{16}\b/gi,           // UPS
    /\b\d{12,22}\b/g,                  // Generic long number
    /\b[A-Z]{2}\d{9}[A-Z]{2}\b/gi,    // International postal
  ];
  const matches: string[] = [];
  for (const p of patterns) {
    const found = text.match(p);
    if (found) matches.push(...found.map((m) => m.toUpperCase()));
  }
  return matches;
}

/**
 * Detect event type from combined text using keyword cluster matching.
 * Requires 2+ keyword hits from the same cluster.
 */
function detectEventType(texts: string[]): EventType {
  const combined = texts.join(' ').toLowerCase();
  let bestType: EventType = 'general';
  let bestHits = 0;

  for (const cluster of EVENT_TYPE_CLUSTERS) {
    const hits = cluster.keywords.filter((kw) => combined.includes(kw)).length;
    if (hits >= 2 && hits > bestHits) {
      bestHits = hits;
      bestType = cluster.type;
    }
  }

  return bestType;
}

/**
 * Compute a grouping key for an email based on strict rules:
 * 1. Tracking number match
 * 2. Email thread (graph_id prefix or Re:/Fwd: subject normalization)
 */
function getEmailGroupKey(email: RawEmail): string {
  // 1. Check for tracking numbers
  const searchText = `${email.subject} ${email.body_preview || ''}`;
  const trackingNums = extractTrackingNumbers(searchText);
  if (trackingNums.length > 0) {
    return `tracking:${trackingNums[0]}`;
  }

  // 2. Thread grouping — normalize subject
  const normalizedSubject = email.subject
    .replace(/^(re|fwd|fw):\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  if (email.graph_id) {
    // Use conversation thread ID (first part before any separator)
    const threadId = email.graph_id.split('/')[0];
    return `thread:${threadId}`;
  }

  return `subject:${normalizedSubject}`;
}

/**
 * Group signals into clusters based on strict matching rules.
 */
function groupSignals(emails: RawEmail[], tasks: RawTask[], risks: RawRisk[]): SignalGroup[] {
  const groups = new Map<string, SignalGroup>();

  // Group emails by key
  for (const email of emails) {
    const key = getEmailGroupKey(email);
    if (!groups.has(key)) {
      groups.set(key, { emails: [], tasks: [], risks: [], groupKey: key, eventType: 'general' });
    }
    groups.get(key)!.emails.push(email);
  }

  // Link tasks to groups via source_id (email ID)
  for (const task of tasks) {
    if (!task.source_id) continue;
    let linked = false;
    for (const group of groups.values()) {
      if (group.emails.some((e) => e.id === task.source_id)) {
        group.tasks.push(task);
        linked = true;
        break;
      }
    }
    if (!linked) {
      // Orphan task → own group
      const key = `task:${task.id}`;
      groups.set(key, { emails: [], tasks: [task], risks: [], groupKey: key, eventType: 'general' });
    }
  }

  // Link risks to groups via source_id
  for (const risk of risks) {
    if (!risk.source_id) continue;
    let linked = false;
    for (const group of groups.values()) {
      if (group.emails.some((e) => e.id === risk.source_id)) {
        group.risks.push(risk);
        linked = true;
        break;
      }
    }
    if (!linked) {
      const key = `risk:${risk.id}`;
      groups.set(key, { emails: [], tasks: [], risks: [risk], groupKey: key, eventType: 'general' });
    }
  }

  // Detect event types
  for (const group of groups.values()) {
    const texts = [
      ...group.emails.map((e) => `${e.subject} ${e.body_preview || ''} ${e.keyword_matches.join(' ')}`),
      ...group.tasks.map((t) => `${t.title} ${t.description || ''}`),
      ...group.risks.map((r) => `${r.title} ${r.description || ''}`),
    ];
    group.eventType = detectEventType(texts);
  }

  return Array.from(groups.values());
}

/* ── Event Generation ── */

/**
 * Generate an event name from a signal group.
 */
function generateEventName(group: SignalGroup): string {
  // Use highest-priority task title if available
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = [...group.tasks].sort(
    (a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3),
  );
  if (sortedTasks.length > 0) return sortedTasks[0].title;

  // Use first email subject (cleaned)
  if (group.emails.length > 0) {
    return group.emails[0].subject.replace(/^(re|fwd|fw):\s*/gi, '').trim();
  }

  // Use first risk title
  if (group.risks.length > 0) return group.risks[0].title;

  return 'Unnamed Event';
}

/**
 * Compute priority score: MAX(risk_score, urgency_score).
 * If ANY signal is critical → event is critical.
 */
function computePriorityScore(group: SignalGroup): { score: number; riskLevel: RiskLevel } {
  const priorityMap: Record<string, number> = { critical: 100, high: 80, medium: 50, low: 20 };
  const severityMap: Record<string, number> = { critical: 100, high: 80, medium: 50, low: 20 };

  let maxScore = 0;

  for (const task of group.tasks) {
    maxScore = Math.max(maxScore, priorityMap[task.priority] ?? 50);
  }
  for (const risk of group.risks) {
    maxScore = Math.max(maxScore, severityMap[risk.severity] ?? 50);
  }

  // Emails classified as take_action bump score
  for (const email of group.emails) {
    if (email.classification === 'take_action') {
      maxScore = Math.max(maxScore, 70);
    }
  }

  // Default minimum if we have signals
  if (maxScore === 0 && (group.emails.length > 0 || group.tasks.length > 0 || group.risks.length > 0)) {
    maxScore = 40;
  }

  // Determine risk level from score
  const riskLevel: RiskLevel = maxScore >= 90 ? 'critical' : maxScore >= 70 ? 'high' : maxScore >= 40 ? 'medium' : 'low';

  return { score: maxScore, riskLevel };
}

/**
 * Generate next_action from the group's highest-priority task or email.
 */
function generateNextAction(group: SignalGroup): string {
  // From tasks
  if (group.tasks.length > 0) {
    const topTask = group.tasks[0];
    return topTask.description?.slice(0, 120) || topTask.title;
  }

  // From emails
  if (group.emails.length > 0) {
    const actionEmails = group.emails.filter((e) => e.classification === 'take_action');
    if (actionEmails.length > 0) {
      return `Review and respond to email from ${actionEmails[0].sender_name || 'unknown sender'}`;
    }
    return `Review ${group.emails.length} related email${group.emails.length > 1 ? 's' : ''}`;
  }

  // From risks
  if (group.risks.length > 0) {
    return `Assess risk: ${group.risks[0].title}`;
  }

  return 'Review and take action';
}

/**
 * Generate risk_summary from the group's risks.
 */
function generateRiskSummary(group: SignalGroup): string {
  if (group.risks.length === 0) return 'No identified risks';

  const criticalRisks = group.risks.filter((r) => r.severity === 'critical' || r.severity === 'high');
  if (criticalRisks.length > 0) {
    return criticalRisks[0].description?.slice(0, 120) || criticalRisks[0].title;
  }

  return group.risks[0].title;
}

/* ── Public API ── */

/**
 * Run the full consolidation pipeline:
 * Fetch signals → Group → Generate events → Upsert to ceo_events → Return top events.
 */
export async function consolidateEvents(): Promise<CEOEvent[]> {
  // Fetch raw signals (last 48 hours)
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const [emailsRes, tasksRes, risksRes] = await Promise.all([
    supabase
      .from('ceo_emails')
      .select('id, subject, sender_name, body_preview, classification, keyword_matches, received_at, graph_id')
      .in('classification', ['take_action', 'investigate'])
      .gte('received_at', since)
      .order('received_at', { ascending: false }),
    supabase
      .from('ceo_tasks')
      .select('id, title, description, priority, status, source_id')
      .in('status', ['open', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('ceo_risks')
      .select('id, title, description, severity, status, source_id')
      .in('status', ['open'])
      .order('created_at', { ascending: false })
      .limit(30),
  ]);

  const emails = (emailsRes.data || []) as RawEmail[];
  const tasks = (tasksRes.data || []) as RawTask[];
  const risks = (risksRes.data || []) as RawRisk[];

  // Group signals
  const groups = groupSignals(emails, tasks, risks);

  // Generate events from groups
  const events: Omit<CEOEvent, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (const group of groups) {
    const { score, riskLevel } = computePriorityScore(group);
    events.push({
      event_name: generateEventName(group),
      event_type: group.eventType,
      priority_score: score,
      risk_level: riskLevel,
      status: 'open',
      related_email_ids: group.emails.map((e) => e.id),
      related_task_ids: group.tasks.map((t) => t.id),
      related_risk_ids: group.risks.map((r) => r.id),
      summary: `${group.emails.length} email${group.emails.length !== 1 ? 's' : ''}, ${group.tasks.length} task${group.tasks.length !== 1 ? 's' : ''}, ${group.risks.length} risk${group.risks.length !== 1 ? 's' : ''} consolidated.`,
      next_action: generateNextAction(group),
      risk_summary: generateRiskSummary(group),
    });
  }

  // Sort by priority (highest first), take top 5
  events.sort((a, b) => b.priority_score - a.priority_score);
  const topEvents = events.slice(0, 5);

  // Upsert to ceo_events: clear old open events, insert fresh
  try {
    await supabase
      .from('ceo_events')
      .delete()
      .eq('status', 'open');

    if (topEvents.length > 0) {
      await supabase
        .from('ceo_events')
        .insert(topEvents);
    }
  } catch {
    // Silent fail on persistence — still return computed events
  }

  // Fetch the persisted events (to get IDs)
  const { data: persistedEvents } = await supabase
    .from('ceo_events')
    .select('*')
    .eq('status', 'open')
    .order('priority_score', { ascending: false })
    .limit(5);

  return (persistedEvents || []) as CEOEvent[];
}

/**
 * Fetch current top events without re-consolidating.
 * Used for fast cockpit rendering.
 */
export async function getTopEvents(limit = 5): Promise<CEOEvent[]> {
  const { data } = await supabase
    .from('ceo_events')
    .select('*')
    .in('status', ['open', 'in_progress'])
    .order('priority_score', { ascending: false })
    .limit(limit);

  return (data || []) as CEOEvent[];
}

/**
 * Mark an event as resolved.
 */
export async function resolveEvent(eventId: string): Promise<void> {
  await supabase
    .from('ceo_events')
    .update({ status: 'resolved', updated_at: new Date().toISOString() })
    .eq('id', eventId);
}
