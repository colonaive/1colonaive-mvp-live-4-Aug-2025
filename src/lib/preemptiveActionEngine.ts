/**
 * Pre-emptive Action Engine — CTW-COCKPIT-02D.9
 *
 * Converts predictions into suggested pre-emptive actions.
 * Maps known event patterns to concrete, executable actions.
 *
 * Core principle: prediction alone is not enough —
 * the system must answer "What should I do NOW to prevent this?"
 */

import { supabase } from '@/supabase';
import type { EventType, CEOEvent } from '@/lib/eventConsolidationEngine';
import { acquireEventLock, releaseEventLock } from '@/lib/eventConsolidationEngine';

/* ── Types ── */

export type ActionType = 'email' | 'follow-up' | 'check' | 'escalation';

export interface PreemptiveAction {
  recommended_action: string;
  action_type: ActionType;
  risk_context: string;
  quick_options: QuickOption[];
}

export interface QuickOption {
  label: string;
  type: 'draft_email' | 'create_task' | 'log_check';
  prompt: string;
}

/* ── Action Rules ── */

interface ActionRule {
  /** Keywords to match in the predicted event name (lowercased) */
  keywords: string[];
  /** Event type to match (optional — if omitted, matches any type with keyword hit) */
  event_type?: EventType;
  action: string;
  action_type: ActionType;
  risk: string;
  quick_options: QuickOption[];
}

const ACTION_RULES: ActionRule[] = [
  // Logistics — shipment / courier delays
  {
    keywords: ['ups', 'dhl', 'fedex', 'shipment', 'courier', 'logistics', 'delivery'],
    event_type: 'logistics',
    action: 'Confirm shipment status with courier and verify cold chain integrity',
    action_type: 'check',
    risk: 'Cold chain exposure or customs delay',
    quick_options: [
      { label: 'Draft status check email', type: 'draft_email', prompt: 'Draft an email to the courier asking for current shipment status, expected delivery date, and cold chain confirmation.' },
      { label: 'Create tracking task', type: 'create_task', prompt: 'Create a task to monitor shipment clearance status daily until delivery is confirmed.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that shipment status was checked today. Note current status and any concerns.' },
    ],
  },
  {
    keywords: ['customs', 'clearance', 'import'],
    event_type: 'logistics',
    action: 'Verify customs documentation completeness and clearance timeline',
    action_type: 'check',
    risk: 'Customs hold or documentation gap',
    quick_options: [
      { label: 'Draft customs inquiry', type: 'draft_email', prompt: 'Draft an email to the customs broker asking for clearance status and any outstanding documentation requirements.' },
      { label: 'Create clearance task', type: 'create_task', prompt: 'Create a task to follow up on customs clearance status and ensure all documentation is submitted.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that customs clearance status was checked. Note any pending items.' },
    ],
  },

  // Regulatory — HSA, FDA, CDSCO, NMPA
  {
    keywords: ['hsa', 'regulatory', 'fda', 'cdsco', 'nmpa', 'approval', 'submission'],
    event_type: 'regulatory',
    action: 'Check submission status and confirm regulatory timeline with consultant',
    action_type: 'follow-up',
    risk: 'Regulatory deadline slip or missing documentation',
    quick_options: [
      { label: 'Draft follow-up email', type: 'draft_email', prompt: 'Draft an email to the regulatory consultant asking for current submission status, any queries from the authority, and updated timeline.' },
      { label: 'Create deadline tracker', type: 'create_task', prompt: 'Create a task to track the regulatory submission milestone and key dates.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that regulatory status was reviewed. Note current stage and any blockers.' },
    ],
  },

  // Investor follow-ups
  {
    keywords: ['investor', 'funding', 'pitch', 'follow-up'],
    event_type: 'investor',
    action: 'Send investor update or schedule follow-up call',
    action_type: 'email',
    risk: 'Loss of investor momentum or missed funding window',
    quick_options: [
      { label: 'Draft investor update', type: 'draft_email', prompt: 'Draft a brief investor update email covering recent milestones, traction metrics, and next steps. Keep it concise and professional.' },
      { label: 'Schedule follow-up', type: 'create_task', prompt: 'Create a task to schedule a follow-up call with the investor within the next 5 business days.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that investor follow-up status was reviewed. Note last contact date and next planned touchpoint.' },
    ],
  },

  // Clinical / Lab
  {
    keywords: ['angsana', 'lab', 'validation', 'clinical', 'trial', 'ktph', 'sample'],
    event_type: 'clinical',
    action: 'Check lab readiness and confirm validation timeline',
    action_type: 'check',
    risk: 'Lab delay or sample availability issue',
    quick_options: [
      { label: 'Draft lab status email', type: 'draft_email', prompt: 'Draft an email to the lab partner asking for current validation progress, sample availability, and expected completion timeline.' },
      { label: 'Create milestone task', type: 'create_task', prompt: 'Create a task to track clinical validation milestones and follow up on any pending items.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that lab/clinical status was checked. Note current progress and any delays.' },
    ],
  },

  // Product issues
  {
    keywords: ['product', 'bug', 'issue', 'error', 'outage'],
    event_type: 'product',
    action: 'Review system status and verify product stability',
    action_type: 'check',
    risk: 'Product downtime or user-facing issue',
    quick_options: [
      { label: 'Draft status report', type: 'draft_email', prompt: 'Draft an internal status report on the product issue, including impact assessment and resolution plan.' },
      { label: 'Create fix task', type: 'create_task', prompt: 'Create a task to investigate and resolve the product issue with clear priority and deadline.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that product status was reviewed. Note any active issues or recent resolutions.' },
    ],
  },

  // Partnership
  {
    keywords: ['partner', 'partnership', 'mou', 'agreement', 'collaboration'],
    event_type: 'partnership',
    action: 'Follow up on partnership status and next milestones',
    action_type: 'follow-up',
    risk: 'Partnership stall or misaligned expectations',
    quick_options: [
      { label: 'Draft partner email', type: 'draft_email', prompt: 'Draft a follow-up email to the partner checking on agreement status, next steps, and any blockers from their side.' },
      { label: 'Create follow-up task', type: 'create_task', prompt: 'Create a task to follow up on partnership milestones and document any changes in scope or timeline.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that partnership status was reviewed. Note current stage and action items.' },
    ],
  },

  // Singlera-specific
  {
    keywords: ['singlera'],
    action: 'Confirm Singlera delivery schedule and technical support status',
    action_type: 'check',
    risk: 'Supply chain disruption or technical support gap',
    quick_options: [
      { label: 'Draft Singlera email', type: 'draft_email', prompt: 'Draft an email to Singlera confirming delivery schedule, reagent availability, and any upcoming technical support sessions.' },
      { label: 'Create tracking task', type: 'create_task', prompt: 'Create a task to track Singlera delivery and support milestones.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that Singlera status was checked. Note delivery timeline and support schedule.' },
    ],
  },
];

/* ── Fallback for unmatched patterns ── */

const FALLBACK_BY_TYPE: Record<string, PreemptiveAction> = {
  logistics: {
    recommended_action: 'Review logistics pipeline and confirm delivery timelines',
    action_type: 'check',
    risk_context: 'Potential logistics disruption',
    quick_options: [
      { label: 'Draft inquiry', type: 'draft_email', prompt: 'Draft an email inquiring about current logistics status and expected timelines.' },
      { label: 'Create task', type: 'create_task', prompt: 'Create a task to monitor logistics status.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that logistics status was reviewed.' },
    ],
  },
  regulatory: {
    recommended_action: 'Review regulatory submission status and key deadlines',
    action_type: 'follow-up',
    risk_context: 'Potential regulatory timeline risk',
    quick_options: [
      { label: 'Draft follow-up', type: 'draft_email', prompt: 'Draft an email following up on regulatory submission status.' },
      { label: 'Create task', type: 'create_task', prompt: 'Create a task to track regulatory milestones.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that regulatory status was reviewed.' },
    ],
  },
  investor: {
    recommended_action: 'Prepare investor communication or schedule check-in',
    action_type: 'email',
    risk_context: 'Investor relationship maintenance needed',
    quick_options: [
      { label: 'Draft update', type: 'draft_email', prompt: 'Draft a brief investor update email.' },
      { label: 'Schedule call', type: 'create_task', prompt: 'Create a task to schedule an investor call.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that investor status was reviewed.' },
    ],
  },
  clinical: {
    recommended_action: 'Confirm clinical/lab progress and timeline',
    action_type: 'check',
    risk_context: 'Potential clinical study or lab delay',
    quick_options: [
      { label: 'Draft inquiry', type: 'draft_email', prompt: 'Draft an email checking on clinical/lab progress.' },
      { label: 'Create task', type: 'create_task', prompt: 'Create a task to track clinical milestones.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that clinical status was reviewed.' },
    ],
  },
  general: {
    recommended_action: 'Review situation and determine next action',
    action_type: 'check',
    risk_context: 'Recurring issue pattern detected',
    quick_options: [
      { label: 'Draft email', type: 'draft_email', prompt: 'Draft an email addressing the recurring issue.' },
      { label: 'Create task', type: 'create_task', prompt: 'Create a task to investigate and address the issue.' },
      { label: 'Log check', type: 'log_check', prompt: 'Log that the issue was reviewed.' },
    ],
  },
};

/* ── Public API ── */

/**
 * Generate a pre-emptive action for a prediction.
 * Matches against known patterns — no hallucinated actions.
 * Logs unmatched predictions for future training.
 */
export function generatePreemptiveAction(
  predictedEventName: string,
  eventType: string,
  predictionId?: string,
): PreemptiveAction {
  const nameLower = predictedEventName.toLowerCase();

  // Try to match a specific rule
  for (const rule of ACTION_RULES) {
    // Check keyword match
    const hasKeyword = rule.keywords.some((kw) => nameLower.includes(kw));
    if (!hasKeyword) continue;

    // If rule specifies event_type, it must match
    if (rule.event_type && rule.event_type !== eventType) continue;

    return {
      recommended_action: rule.action,
      action_type: rule.action_type,
      risk_context: rule.risk,
      quick_options: rule.quick_options,
    };
  }

  // No rule match — log to ceo_unmatched_predictions for future training
  logUnmatchedPrediction(predictionId || null, eventType, predictedEventName);

  // Fallback: universal safe action
  const fallback = FALLBACK_BY_TYPE[eventType] || FALLBACK_BY_TYPE.general;
  return {
    ...fallback,
    recommended_action: fallback.recommended_action || 'Review situation and determine next step',
  };
}

/**
 * Log an unmatched prediction for future rule development.
 */
function logUnmatchedPrediction(
  predictionId: string | null,
  eventType: string,
  predictedEventName: string,
): void {
  try {
    supabase.from('ceo_unmatched_predictions').insert({
      prediction_id: predictionId,
      event_type: eventType,
      predicted_event_name: predictedEventName,
    });
  } catch {
    // Silent fail — logging is non-blocking
  }
}

/**
 * Update an event with locking protection (used by quick action execution).
 * Acquires lock → applies update → releases lock.
 */
export async function updateEventWithLock(
  eventId: string,
  updates: Partial<CEOEvent>,
  sourceSystem: string,
): Promise<boolean> {
  const locked = await acquireEventLock(eventId, sourceSystem);
  if (!locked) return false;

  try {
    await supabase
      .from('ceo_events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', eventId);
    return true;
  } finally {
    await releaseEventLock(eventId);
  }
}

/**
 * Get action type display label.
 */
export function getActionTypeLabel(actionType: ActionType): { label: string; color: string } {
  switch (actionType) {
    case 'email':
      return { label: 'Send Email', color: 'text-blue-600 dark:text-blue-400' };
    case 'follow-up':
      return { label: 'Follow Up', color: 'text-amber-600 dark:text-amber-400' };
    case 'check':
      return { label: 'Status Check', color: 'text-teal-600 dark:text-teal-400' };
    case 'escalation':
      return { label: 'Escalate', color: 'text-red-600 dark:text-red-400' };
    default:
      return { label: 'Action', color: 'text-gray-600 dark:text-gray-400' };
  }
}
