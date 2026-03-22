/**
 * Founder Decision Engine — AG-FOUNDER-BRIEF-02
 *
 * Upgrades the founder briefing from a narrow "urgent email detector"
 * into a 4-layer Founder Decision Engine:
 *
 * 1. TODAY — EXECUTE: Urgent, time-bound, immediate action items.
 * 2. MOMENTUM — PUSH FORWARD: Dormant threads, stalled conversations, follow-up nudges.
 * 3. WATCH — TRACK CLOSELY: Operational entities requiring monitoring (shipments, regulatory, replies).
 * 4. OPPORTUNITY — USE YOUR TIME: High-leverage optional work when capacity exists.
 *
 * GUARDRAILS PRESERVED:
 * - No fabrication of contacts, tasks, or events.
 * - No noise or self-referential system loops surfaced.
 * - Strict source tagging and inference labeling.
 * - Truth layer and verified facts remain authoritative.
 */

import { supabase } from '@/supabase';
import { aggregateAllSignals, type ProjectSignal } from '@/lib/projectSignals';

/* ── Types ── */

export type BriefingItemLabel = 'verified_fact' | 'inferred_follow_up' | 'strategic_opportunity';

export interface BriefingItem {
  id: string;
  title: string;
  rationale: string;
  source: string;
  label: BriefingItemLabel;
  suggested_action?: string;
  score: number;
  icon?: string;
}

export interface FounderDecisionBriefing {
  generatedAt: string;
  today: BriefingItem[];
  momentum: BriefingItem[];
  watch: BriefingItem[];
  opportunity: BriefingItem[];
  layerSummary: {
    todayCount: number;
    momentumCount: number;
    watchCount: number;
    opportunityCount: number;
  };
}

/* ── Constants ── */

const TRUSTED_SOURCES = ['direct_email', 'manual_entry'];

/** Dormancy thresholds in hours */
const DORMANCY_THRESHOLDS = {
  operational: 48,
  business: 72,
  strategic: 120, // 5 days
} as const;

/** Minimum significance score to surface a follow-up (prevents noise) */
const MIN_SIGNIFICANCE_SCORE = 25;

/** Strategic keywords that boost opportunity relevance */
const STRATEGIC_KEYWORDS = [
  'screening', 'crc', 'colorectal', 'colonaiq', 'colonoscopy',
  'linkedin', 'investor', 'partnership', 'regulatory', 'revenue',
  'awareness', 'movement', 'pilot', 'clinical', 'validation',
];

/* ── Scoring Helpers ── */

function computeSignificanceScore(text: string, ageHours: number, classification?: string): number {
  let score = 30; // baseline
  const lower = text.toLowerCase();

  // Keyword boosts
  const importantKeywords = [
    'shipment', 'customs', 'clearance', 'delivery', 'regulatory', 'approval',
    'hsa', 'cdsco', 'fda', 'nmpa', 'investor', 'partnership', 'angsana',
    'singlera', 'ktph', 'lab', 'validation', 'clinical', 'urgent', 'deadline',
  ];
  for (const kw of importantKeywords) {
    if (lower.includes(kw)) score += 8;
  }

  // Classification boost
  if (classification === 'take_action') score += 20;
  if (classification === 'investigate') score += 10;

  // Recency (newer = slightly more important for follow-up)
  if (ageHours < 48) score += 10;
  else if (ageHours < 96) score += 5;

  return Math.min(100, score);
}

function getAgeHours(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
}

/* ── Layer 1: TODAY — EXECUTE ── */

async function generateTodayItems(): Promise<BriefingItem[]> {
  const items: BriefingItem[] = [];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Fetch take_action emails from last 24h (trusted sources only)
  const { data: actionEmails } = await supabase
    .from('ceo_emails')
    .select('id, sender_name, subject, classification_reason, keyword_matches, received_at, confidence_level')
    .eq('classification', 'take_action')
    .in('source_origin', TRUSTED_SOURCES)
    .gte('received_at', yesterday)
    .order('received_at', { ascending: false })
    .limit(5);

  for (const email of actionEmails || []) {
    const keywords = email.keyword_matches?.length ? ` [${email.keyword_matches.join(', ')}]` : '';
    items.push({
      id: `today-email-${email.id}`,
      title: `${email.sender_name} — ${email.subject}`,
      rationale: email.classification_reason || 'Action required based on email classification.',
      source: `Email${keywords}`,
      label: 'verified_fact',
      suggested_action: 'Review and respond',
      score: 90,
      icon: 'zap',
    });
  }

  // Fetch critical/high open tasks (trusted sources)
  const { data: urgentTasks } = await supabase
    .from('ceo_tasks')
    .select('id, title, description, priority')
    .eq('status', 'open')
    .in('source_origin', TRUSTED_SOURCES)
    .in('priority', ['critical', 'high'])
    .order('created_at', { ascending: false })
    .limit(3);

  for (const task of urgentTasks || []) {
    items.push({
      id: `today-task-${task.id}`,
      title: task.title,
      rationale: task.description?.slice(0, 150) || 'High-priority open task.',
      source: `Task [${task.priority.toUpperCase()}]`,
      label: 'verified_fact',
      suggested_action: 'Execute or delegate',
      score: task.priority === 'critical' ? 95 : 85,
      icon: 'alert-triangle',
    });
  }

  // Fetch high-severity open risks
  const { data: urgentRisks } = await supabase
    .from('ceo_risks')
    .select('id, title, description, severity')
    .eq('status', 'open')
    .in('source_origin', TRUSTED_SOURCES)
    .in('severity', ['critical', 'high'])
    .order('created_at', { ascending: false })
    .limit(2);

  for (const risk of urgentRisks || []) {
    items.push({
      id: `today-risk-${risk.id}`,
      title: `Risk: ${risk.title}`,
      rationale: risk.description?.slice(0, 150) || 'Critical risk requiring attention.',
      source: `Risk [${risk.severity.toUpperCase()}]`,
      label: 'verified_fact',
      suggested_action: 'Assess and mitigate',
      score: risk.severity === 'critical' ? 92 : 82,
      icon: 'shield-alert',
    });
  }

  return items.sort((a, b) => b.score - a.score).slice(0, 5);
}

/* ── Layer 2: MOMENTUM — PUSH FORWARD ── */

async function generateMomentumItems(): Promise<BriefingItem[]> {
  const items: BriefingItem[] = [];

  // D1: Detect dormant outreach — take_action emails older than 48h
  // These represent threads where founder took action but no follow-up is visible
  const twoDaysAgo = new Date(Date.now() - DORMANCY_THRESHOLDS.operational * 60 * 60 * 1000).toISOString();
  const fiveDaysAgo = new Date(Date.now() - DORMANCY_THRESHOLDS.strategic * 60 * 60 * 1000).toISOString();

  const { data: dormantEmails } = await supabase
    .from('ceo_emails')
    .select('id, sender_name, subject, classification_reason, keyword_matches, received_at, classification')
    .in('source_origin', TRUSTED_SOURCES)
    .in('classification', ['take_action', 'investigate'])
    .lte('received_at', twoDaysAgo)
    .gte('received_at', fiveDaysAgo)
    .order('received_at', { ascending: true })
    .limit(10);

  for (const email of dormantEmails || []) {
    const ageHours = getAgeHours(email.received_at);
    const ageDays = Math.round(ageHours / 24);
    const significance = computeSignificanceScore(
      `${email.subject} ${email.classification_reason || ''} ${(email.keyword_matches || []).join(' ')}`,
      ageHours,
      email.classification,
    );

    if (significance < MIN_SIGNIFICANCE_SCORE) continue;

    items.push({
      id: `momentum-email-${email.id}`,
      title: `${email.sender_name} — ${email.subject}`,
      rationale: `Thread dormant for ${ageDays} day${ageDays !== 1 ? 's' : ''}. ${email.classification === 'take_action' ? 'Action was required — check if resolved.' : 'Was flagged for investigation.'}`,
      source: 'Email follow-up',
      label: 'inferred_follow_up',
      suggested_action: ageDays >= 3 ? 'Consider follow-up or close out' : 'Check status and nudge if needed',
      score: significance,
      icon: 'clock',
    });
  }

  // Stale CEO events (no action for 72h+) — these represent real tracked work going cold
  const { data: staleEvents } = await supabase
    .from('ceo_events')
    .select('id, event_name, event_type, next_action, last_updated_at, priority_score')
    .eq('is_stale', true)
    .in('status', ['open', 'in_progress'])
    .order('priority_score', { ascending: false })
    .limit(5);

  for (const evt of staleEvents || []) {
    const ageHours = getAgeHours(evt.last_updated_at || evt.id);
    const ageDays = Math.round(ageHours / 24);
    items.push({
      id: `momentum-event-${evt.id}`,
      title: evt.event_name,
      rationale: `Event stale for ${ageDays}+ days. Last action: ${evt.next_action || 'none recorded'}.`,
      source: `CEO Event [${evt.event_type}]`,
      label: 'inferred_follow_up',
      suggested_action: 'Re-engage or resolve',
      score: Math.max(30, evt.priority_score * 0.7),
      icon: 'rotate-cw',
    });
  }

  // Open tasks aging beyond 48h (medium priority — not urgent but losing momentum)
  const { data: agingTasks } = await supabase
    .from('ceo_tasks')
    .select('id, title, description, priority, created_at')
    .eq('status', 'open')
    .in('source_origin', TRUSTED_SOURCES)
    .eq('priority', 'medium')
    .lte('created_at', twoDaysAgo)
    .order('created_at', { ascending: true })
    .limit(3);

  for (const task of agingTasks || []) {
    const ageDays = Math.round(getAgeHours(task.created_at) / 24);
    items.push({
      id: `momentum-task-${task.id}`,
      title: task.title,
      rationale: `Open for ${ageDays} days. Medium priority — may need a push.`,
      source: 'Task',
      label: 'inferred_follow_up',
      suggested_action: 'Progress or re-prioritize',
      score: 40 + Math.min(20, ageDays * 2),
      icon: 'trending-up',
    });
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/* ── Layer 3: WATCH — TRACK CLOSELY ── */

async function generateWatchItems(): Promise<BriefingItem[]> {
  const items: BriefingItem[] = [];

  // Tracked entities from DB (if table exists) — shipments, regulatory, etc.
  try {
    const { data: trackedEntities } = await supabase
      .from('tracked_entities')
      .select('*')
      .eq('is_active', true)
      .order('state_updated_at', { ascending: true })
      .limit(5);

    for (const entity of trackedEntities || []) {
      const ageHours = getAgeHours(entity.state_updated_at || entity.created_at);
      const ageDays = Math.round(ageHours / 24);
      const isOverdue = entity.expected_next_state && ageDays > 2;

      items.push({
        id: `watch-entity-${entity.id}`,
        title: entity.title,
        rationale: `State: ${entity.state}${isOverdue ? ` (${ageDays} days in this state)` : ''}. ${entity.requires_update_to ? `Update ${entity.requires_update_to}.` : ''}`,
        source: `${entity.entity_type} [${entity.owner_project || 'general'}]`,
        label: 'verified_fact',
        suggested_action: entity.requires_update_to
          ? `Track closely and update ${entity.requires_update_to}`
          : 'Monitor progression',
        score: isOverdue ? 75 : 55,
        icon: entity.entity_type === 'shipment' ? 'truck' : entity.entity_type === 'regulatory' ? 'file-check' : 'eye',
      });
    }
  } catch {
    // Table may not exist yet — graceful fallback
  }

  // Logistics-type CEO events (shipments, customs, delivery)
  const { data: logisticsEvents } = await supabase
    .from('ceo_events')
    .select('id, event_name, event_type, next_action, risk_summary, last_updated_at, priority_score')
    .eq('event_type', 'logistics')
    .in('status', ['open', 'in_progress'])
    .order('priority_score', { ascending: false })
    .limit(3);

  for (const evt of logisticsEvents || []) {
    items.push({
      id: `watch-logistics-${evt.id}`,
      title: evt.event_name,
      rationale: evt.risk_summary || evt.next_action || 'Logistics event in progress.',
      source: 'CEO Event [logistics]',
      label: 'verified_fact',
      suggested_action: evt.next_action || 'Track delivery status',
      score: evt.priority_score * 0.8,
      icon: 'truck',
    });
  }

  // Regulatory-type CEO events
  const { data: regulatoryEvents } = await supabase
    .from('ceo_events')
    .select('id, event_name, event_type, next_action, risk_summary, last_updated_at, priority_score')
    .eq('event_type', 'regulatory')
    .in('status', ['open', 'in_progress'])
    .order('priority_score', { ascending: false })
    .limit(3);

  for (const evt of regulatoryEvents || []) {
    items.push({
      id: `watch-regulatory-${evt.id}`,
      title: evt.event_name,
      rationale: evt.risk_summary || evt.next_action || 'Regulatory milestone in progress.',
      source: 'CEO Event [regulatory]',
      label: 'verified_fact',
      suggested_action: evt.next_action || 'Monitor regulatory timeline',
      score: evt.priority_score * 0.85,
      icon: 'file-check',
    });
  }

  // Investigate-classified emails from last 48h (watch-worthy signals)
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: watchEmails } = await supabase
    .from('ceo_emails')
    .select('id, sender_name, subject, classification_reason, received_at')
    .eq('classification', 'investigate')
    .in('source_origin', TRUSTED_SOURCES)
    .gte('received_at', twoDaysAgo)
    .order('received_at', { ascending: false })
    .limit(3);

  for (const email of watchEmails || []) {
    items.push({
      id: `watch-email-${email.id}`,
      title: `${email.sender_name} — ${email.subject}`,
      rationale: email.classification_reason || 'Flagged for investigation.',
      source: 'Email [investigate]',
      label: 'verified_fact',
      suggested_action: 'Monitor and investigate if needed',
      score: 45,
      icon: 'eye',
    });
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/* ── Layer 4: OPPORTUNITY — USE YOUR TIME ── */

async function generateOpportunityItems(): Promise<BriefingItem[]> {
  const items: BriefingItem[] = [];

  // CRC news with high relevance = LinkedIn posting opportunity
  try {
    const { data: crcNews } = await supabase
      .from('crc_news_feed')
      .select('id, title, relevance_score, date_published, source')
      .gte('relevance_score', 60)
      .order('relevance_score', { ascending: false })
      .order('date_published', { ascending: false })
      .limit(3);

    for (const news of crcNews || []) {
      const text = (news.title || '').toLowerCase();
      const isRelevant = STRATEGIC_KEYWORDS.some((kw) => text.includes(kw));
      if (!isRelevant && (news.relevance_score || 0) < 75) continue;

      items.push({
        id: `opp-linkedin-${news.id}`,
        title: `LinkedIn opportunity: ${news.title}`,
        rationale: `CRC news with ${news.relevance_score}% relevance. Good foundation for a thought leadership post.`,
        source: news.source || 'CRC News Feed',
        label: 'strategic_opportunity',
        suggested_action: 'Draft LinkedIn post on this topic',
        score: Math.min(70, (news.relevance_score || 50) * 0.7),
        icon: 'pen-line',
      });
    }
  } catch {
    // Silent fail
  }

  // Cross-project opportunities from Master Brain priorities
  try {
    const allProjects = aggregateAllSignals();
    for (const proj of allProjects) {
      const opportunities = proj.signals.filter(
        (s: ProjectSignal) => s.type === 'opportunity' && (s.severity === 'high' || s.severity === 'medium'),
      );

      for (const opp of opportunities.slice(0, 1)) {
        items.push({
          id: `opp-project-${opp.id}`,
          title: `${proj.label}: ${opp.title}`,
          rationale: opp.description.slice(0, 150),
          source: `Cross-project [${proj.label}]`,
          label: 'strategic_opportunity',
          suggested_action: 'Progress if bandwidth allows',
          score: opp.severity === 'high' ? 55 : 40,
          icon: 'lightbulb',
        });
      }
    }
  } catch {
    // Silent fail
  }

  // Early warnings with opportunity angle (competitive intelligence)
  try {
    const { data: earlyWarnings } = await supabase
      .from('ceo_early_warnings')
      .select('id, title, analysis, market_implication, recommended_action, confidence_score')
      .gte('confidence_score', 50)
      .order('confidence_score', { ascending: false })
      .limit(3);

    for (const ew of earlyWarnings || []) {
      const text = `${ew.title} ${ew.analysis || ''} ${ew.market_implication || ''}`.toLowerCase();
      const isOpportunity = text.includes('opportunity') || text.includes('partnership') || text.includes('collaboration');
      if (!isOpportunity) continue;

      items.push({
        id: `opp-ew-${ew.id}`,
        title: ew.title,
        rationale: ew.market_implication || ew.analysis || 'Strategic opportunity detected.',
        source: 'Competitive Intelligence',
        label: 'strategic_opportunity',
        suggested_action: ew.recommended_action || 'Evaluate and act if aligned',
        score: Math.min(60, (ew.confidence_score || 50) * 0.6),
        icon: 'target',
      });
    }
  } catch {
    // Silent fail
  }

  // Low-effort, medium-impact radar signals (research worth sharing)
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: radarSignals } = await supabase
      .from('crc_research_signals')
      .select('id, title, summary, radar_score, strategic_relevance, created_at')
      .gte('created_at', sevenDaysAgo)
      .gte('radar_score', 60)
      .order('radar_score', { ascending: false })
      .limit(2);

    for (const signal of radarSignals || []) {
      items.push({
        id: `opp-radar-${signal.id}`,
        title: `Research: ${signal.title}`,
        rationale: signal.strategic_relevance || signal.summary?.slice(0, 120) || 'High-relevance CRC research.',
        source: 'CRC Radar',
        label: 'strategic_opportunity',
        suggested_action: 'Review for content or stakeholder sharing',
        score: Math.min(55, (signal.radar_score || 50) * 0.55),
        icon: 'microscope',
      });
    }
  } catch {
    // Silent fail
  }

  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/* ── D4: Empty-Brief Prevention ── */

/**
 * If TODAY is empty, ensure at least 1 MOMENTUM, 1 WATCH, and 1 OPPORTUNITY item.
 * Uses fallback search across broader time windows and lower thresholds.
 */
async function applyEmptyBriefPrevention(
  today: BriefingItem[],
  momentum: BriefingItem[],
  watch: BriefingItem[],
  opportunity: BriefingItem[],
): Promise<{
  momentum: BriefingItem[];
  watch: BriefingItem[];
  opportunity: BriefingItem[];
}> {
  const todayEmpty = today.length === 0;

  // If today has items and other layers have items, no fallback needed
  if (!todayEmpty && momentum.length > 0 && watch.length > 0 && opportunity.length > 0) {
    return { momentum, watch, opportunity };
  }

  // Fallback MOMENTUM: widen to 7-day window for dormant emails
  if (momentum.length === 0) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: olderEmails } = await supabase
        .from('ceo_emails')
        .select('id, sender_name, subject, received_at, classification')
        .in('source_origin', TRUSTED_SOURCES)
        .in('classification', ['take_action', 'investigate'])
        .lte('received_at', new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString())
        .gte('received_at', sevenDaysAgo)
        .order('received_at', { ascending: false })
        .limit(2);

      for (const email of olderEmails || []) {
        const ageDays = Math.round(getAgeHours(email.received_at) / 24);
        momentum.push({
          id: `momentum-fallback-${email.id}`,
          title: `${email.sender_name} — ${email.subject}`,
          rationale: `Thread from ${ageDays} days ago. Worth checking if resolved.`,
          source: 'Email follow-up (extended search)',
          label: 'inferred_follow_up',
          suggested_action: 'Check status',
          score: 30,
          icon: 'clock',
        });
      }
    } catch { /* silent */ }
  }

  // Fallback WATCH: check for any open events regardless of type
  if (watch.length === 0) {
    try {
      const { data: anyOpenEvents } = await supabase
        .from('ceo_events')
        .select('id, event_name, event_type, next_action, priority_score')
        .in('status', ['open', 'in_progress'])
        .order('priority_score', { ascending: false })
        .limit(2);

      for (const evt of anyOpenEvents || []) {
        watch.push({
          id: `watch-fallback-${evt.id}`,
          title: evt.event_name,
          rationale: `Open ${evt.event_type} event with priority ${evt.priority_score}.`,
          source: `CEO Event [${evt.event_type}]`,
          label: 'verified_fact',
          suggested_action: evt.next_action || 'Monitor',
          score: 35,
          icon: 'eye',
        });
      }
    } catch { /* silent */ }
  }

  // Fallback OPPORTUNITY: always surface at least one from cross-project
  if (opportunity.length === 0) {
    try {
      const allProjects = aggregateAllSignals();
      for (const proj of allProjects) {
        const opps = proj.signals.filter((s: ProjectSignal) => s.type === 'opportunity');
        if (opps.length > 0) {
          opportunity.push({
            id: `opp-fallback-${opps[0].id}`,
            title: `${proj.label}: ${opps[0].title}`,
            rationale: opps[0].description.slice(0, 150),
            source: `Cross-project [${proj.label}]`,
            label: 'strategic_opportunity',
            suggested_action: 'Progress if bandwidth allows',
            score: 30,
            icon: 'lightbulb',
          });
          break;
        }
      }
    } catch { /* silent */ }
  }

  return { momentum, watch, opportunity };
}

/* ── Main Engine ── */

/**
 * Generate the full 4-layer Founder Decision Briefing.
 *
 * Each layer runs independently. Empty-brief prevention ensures
 * the briefing is rarely blank when useful work exists.
 */
export async function generateFounderDecisionBriefing(): Promise<FounderDecisionBriefing> {
  // Run all 4 layers in parallel
  const [today, momentumRaw, watchRaw, opportunityRaw] = await Promise.all([
    generateTodayItems().catch(() => []),
    generateMomentumItems().catch(() => []),
    generateWatchItems().catch(() => []),
    generateOpportunityItems().catch(() => []),
  ]);

  // Apply empty-brief prevention (D4)
  const { momentum, watch, opportunity } = await applyEmptyBriefPrevention(
    today, momentumRaw, watchRaw, opportunityRaw,
  );

  return {
    generatedAt: new Date().toISOString(),
    today,
    momentum,
    watch,
    opportunity,
    layerSummary: {
      todayCount: today.length,
      momentumCount: momentum.length,
      watchCount: watch.length,
      opportunityCount: opportunity.length,
    },
  };
}
