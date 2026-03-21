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
  resolved_at: string | null;
  last_updated_at: string | null;
  recurrence_count: number;
  is_recurring: boolean;
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

  // Generate events from groups (with recurrence detection)
  const events: Omit<CEOEvent, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (const group of groups) {
    const { score, riskLevel } = computePriorityScore(group);
    const eventName = generateEventName(group);

    // Detect recurrence against past resolved events
    const recurrence = await detectRecurrence(eventName, group.eventType);

    events.push({
      event_name: eventName,
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
      resolved_at: null,
      last_updated_at: new Date().toISOString(),
      recurrence_count: recurrence.recurrence_count,
      is_recurring: recurrence.is_recurring,
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

  // Log history for newly created events
  if (persistedEvents) {
    for (const evt of persistedEvents) {
      await logEventHistory(evt.id, 'created', null, evt as unknown as Record<string, unknown>);
    }
  }

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
 * Logs history entry with previous state.
 */
export async function resolveEvent(eventId: string): Promise<void> {
  const now = new Date().toISOString();

  // Fetch current state for history
  const { data: current } = await supabase
    .from('ceo_events')
    .select('*')
    .eq('id', eventId)
    .single();

  await supabase
    .from('ceo_events')
    .update({
      status: 'resolved',
      resolved_at: now,
      last_updated_at: now,
      updated_at: now,
    })
    .eq('id', eventId);

  // Log history
  if (current) {
    await logEventHistory(eventId, 'resolved', current, {
      ...current,
      status: 'resolved',
      resolved_at: now,
    });
  }
}

/**
 * Transition event status (e.g. open → in_progress).
 */
export async function updateEventStatus(eventId: string, newStatus: EventStatus): Promise<void> {
  const now = new Date().toISOString();

  const { data: current } = await supabase
    .from('ceo_events')
    .select('*')
    .eq('id', eventId)
    .single();

  const updatePayload: Record<string, string> = {
    status: newStatus,
    last_updated_at: now,
    updated_at: now,
  };
  if (newStatus === 'resolved') {
    updatePayload.resolved_at = now;
  }

  await supabase
    .from('ceo_events')
    .update(updatePayload)
    .eq('id', eventId);

  if (current) {
    await logEventHistory(
      eventId,
      newStatus === 'resolved' ? 'resolved' : 'status_change',
      current,
      { ...current, status: newStatus },
    );
  }
}

/* ── Event History ── */

/**
 * Log a history entry for an event change.
 */
async function logEventHistory(
  eventId: string,
  changeType: 'created' | 'updated' | 'resolved' | 'status_change',
  previousState: Record<string, unknown> | null,
  newState: Record<string, unknown> | null,
): Promise<void> {
  try {
    await supabase.from('ceo_event_history').insert({
      event_id: eventId,
      change_type: changeType,
      previous_state: previousState,
      new_state: newState,
    });
  } catch {
    // Silent fail — history is non-blocking
  }
}

/* ── Recurrence Detection ── */

/**
 * Check past resolved events for similarity to a new event.
 * Matching rules:
 * 1. Similar event_name (normalized substring match)
 * 2. Same entity keywords (UPS, Angsana, investor names, etc.)
 * 3. Same keyword cluster / event_type
 *
 * Returns recurrence_count and last_occurrence_date if match found.
 */
async function detectRecurrence(
  eventName: string,
  eventType: EventType,
): Promise<{ recurrence_count: number; is_recurring: boolean; last_occurrence_date: string | null }> {
  // Fetch past resolved events of the same type
  const { data: pastEvents } = await supabase
    .from('ceo_events')
    .select('id, event_name, event_type, resolved_at, created_at, recurrence_count')
    .eq('status', 'resolved')
    .order('created_at', { ascending: false })
    .limit(100);

  if (!pastEvents || pastEvents.length === 0) {
    return { recurrence_count: 0, is_recurring: false, last_occurrence_date: null };
  }

  // Normalize event name for comparison
  const normalizedName = eventName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const nameWords = normalizedName.split(/\s+/).filter((w) => w.length > 3);

  // Extract entity keywords from the event name
  const entityKeywords = [
    'ups', 'dhl', 'fedex', 'angsana', 'singlera', 'ktph', 'hsa', 'fda',
    'nmpa', 'cdsco', 'investor', 'shipment', 'clearance', 'customs',
  ];
  const nameEntities = entityKeywords.filter((ek) => normalizedName.includes(ek));

  let matchCount = 0;
  let lastOccurrence: string | null = null;

  for (const past of pastEvents) {
    const pastNormalized = past.event_name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // Rule 1: Significant word overlap (3+ shared words of length > 3)
    const pastWords = pastNormalized.split(/\s+/).filter((w: string) => w.length > 3);
    const sharedWords = nameWords.filter((w) => pastWords.includes(w));
    const wordMatch = sharedWords.length >= 2;

    // Rule 2: Same entity keyword match
    const pastEntities = entityKeywords.filter((ek) => pastNormalized.includes(ek));
    const sharedEntities = nameEntities.filter((e) => pastEntities.includes(e));
    const entityMatch = sharedEntities.length > 0;

    // Rule 3: Same event type
    const typeMatch = past.event_type === eventType;

    // Match requires: (word overlap OR entity match) AND same type
    if ((wordMatch || entityMatch) && typeMatch) {
      matchCount += 1 + (past.recurrence_count || 0);
      if (!lastOccurrence) {
        lastOccurrence = past.resolved_at || past.created_at;
      }
    }
  }

  return {
    recurrence_count: matchCount,
    is_recurring: matchCount >= 2,
    last_occurrence_date: lastOccurrence,
  };
}

/**
 * Fetch recurring events for the Founder Intelligence "Recurring Issues" section.
 */
export async function getRecurringEvents(): Promise<CEOEvent[]> {
  const { data } = await supabase
    .from('ceo_events')
    .select('*')
    .eq('is_recurring', true)
    .in('status', ['open', 'in_progress'])
    .order('recurrence_count', { ascending: false })
    .limit(10);

  return (data || []) as CEOEvent[];
}
