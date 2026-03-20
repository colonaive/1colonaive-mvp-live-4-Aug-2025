/**
 * Relationship Priority Engine — CTW-COCKPIT-03B
 *
 * Rule-based scoring engine for CEO contacts.
 * No ML. Deterministic scoring across 6 dimensions (incl. execution weight).
 *
 * Doctrine guardrail: COLONAiVE contacts must use movement-first tone,
 * no hard-sell, colonoscopy remains gold standard.
 */

import { supabase } from '@/supabase';

/* ── Types ── */

export type CEOContactRole =
  | 'investor' | 'regulator' | 'kol' | 'clinician'
  | 'partner' | 'corporate' | 'government' | 'academic' | 'other';

export type ProjectTag = 'COLONAiVE' | 'Durmah' | 'SG Renovate' | 'MyScienceHOD';

export type PriorityLevel = 'critical' | 'active' | 'warm' | 'passive';

export type FollowUpAction = 'follow_up' | 'nurture' | 'convert' | 'hold';

export type FollowUpMessageType = 'strategic' | 'update' | 'ask' | 'relationship';

export interface CEOContact {
  id: string;
  name: string;
  organisation: string | null;
  role: CEOContactRole;
  project_tags: string[];
  last_interaction_at: string | null;
  responsiveness_score: number;
  strategic_value_score: number;
  recency_score: number;
  momentum_score: number;
  cross_project_score: number;
  execution_weight: number;
  total_score: number;
  priority_level: PriorityLevel;
  follow_up_action: FollowUpAction | null;
  follow_up_message_type: FollowUpMessageType | null;
  is_verified: boolean;
  source_email_count: number;
  source_linkedin: boolean;
  source_manual: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/* ── Scoring Engine ── */

/**
 * Strategic Value (0–40)
 * Investor / Regulator / KOL / Government → 35–40
 * Clinician / Partner → 20–30
 * Corporate / Academic → 10–20
 * Other → 5
 */
function computeStrategicValue(role: CEOContactRole): number {
  const scores: Record<CEOContactRole, number> = {
    investor: 38,
    regulator: 40,
    kol: 36,
    government: 35,
    clinician: 28,
    partner: 25,
    corporate: 18,
    academic: 15,
    other: 5,
  };
  return scores[role] ?? 5;
}

/**
 * Recency Score (0–15)
 * Based on days since last interaction.
 */
function computeRecency(lastInteraction: string | null): number {
  if (!lastInteraction) return 0;
  const daysSince = Math.floor(
    (Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSince <= 3) return 15;
  if (daysSince <= 7) return 12;
  if (daysSince <= 14) return 10;
  if (daysSince <= 30) return 7;
  if (daysSince <= 60) return 4;
  return 1;
}

/**
 * Cross-Project Score (0–10)
 * Based on number of project tags.
 */
function computeCrossProject(projectTags: string[]): number {
  const count = projectTags.length;
  if (count >= 4) return 10;
  if (count === 3) return 8;
  if (count === 2) return 5;
  if (count === 1) return 2;
  return 0;
}

/**
 * Execution Weight (0–20)
 * Reflects real-world urgency and revenue leverage.
 * MyScienceHOD + high momentum → 15–20
 * Investor + high momentum → 15–20
 * COLONAiVE → 5–10
 * Others → 0–5
 */
function computeExecutionWeight(
  role: CEOContactRole,
  projectTags: string[],
  momentumScore: number
): number {
  if (projectTags.includes('MyScienceHOD') && momentumScore >= 10) return 18;
  if (role === 'investor' && momentumScore >= 10) return 17;
  if (projectTags.includes('MyScienceHOD')) return 12;
  if (role === 'investor') return 10;
  if (projectTags.includes('COLONAiVE')) return 8;
  return 3;
}

/**
 * Classify priority level from total score.
 * Updated thresholds for 120-point scale.
 */
function classifyPriority(totalScore: number): PriorityLevel {
  if (totalScore >= 90) return 'critical';
  if (totalScore >= 70) return 'active';
  if (totalScore >= 50) return 'warm';
  return 'passive';
}

/**
 * Determine follow-up action based on priority and recency.
 */
function determineFollowUpAction(
  priority: PriorityLevel,
  recencyScore: number
): FollowUpAction {
  if (priority === 'critical' && recencyScore <= 7) return 'follow_up';
  if (priority === 'critical') return 'convert';
  if (priority === 'active' && recencyScore <= 4) return 'follow_up';
  if (priority === 'active') return 'nurture';
  if (priority === 'warm') return 'nurture';
  return 'hold';
}

/**
 * Determine message type based on role and priority.
 */
function determineMessageType(
  role: CEOContactRole,
  priority: PriorityLevel
): FollowUpMessageType {
  if (role === 'investor' || role === 'regulator' || role === 'government') return 'strategic';
  if (priority === 'critical') return 'ask';
  if (priority === 'active') return 'update';
  return 'relationship';
}

/**
 * Compute all scores for a contact and return updates.
 */
export function computeScores(contact: {
  role: CEOContactRole;
  project_tags: string[];
  last_interaction_at: string | null;
  responsiveness_score: number;
  momentum_score: number;
}): {
  strategic_value_score: number;
  recency_score: number;
  cross_project_score: number;
  execution_weight: number;
  total_score: number;
  priority_level: PriorityLevel;
  follow_up_action: FollowUpAction;
  follow_up_message_type: FollowUpMessageType;
} {
  const strategic_value_score = computeStrategicValue(contact.role);
  const recency_score = computeRecency(contact.last_interaction_at);
  const cross_project_score = computeCrossProject(contact.project_tags);
  const execution_weight = computeExecutionWeight(contact.role, contact.project_tags, contact.momentum_score);

  const total_score = Math.min(
    120,
    strategic_value_score +
      contact.responsiveness_score +
      recency_score +
      contact.momentum_score +
      cross_project_score +
      execution_weight
  );

  const priority_level = classifyPriority(total_score);
  const follow_up_action = determineFollowUpAction(priority_level, recency_score);
  const follow_up_message_type = determineMessageType(contact.role, priority_level);

  return {
    strategic_value_score,
    recency_score,
    cross_project_score,
    execution_weight,
    total_score,
    priority_level,
    follow_up_action,
    follow_up_message_type,
  };
}

/* ── CRUD ── */

export async function fetchCEOContacts(): Promise<CEOContact[]> {
  const { data, error } = await supabase
    .from('ceo_contacts')
    .select('*')
    .order('total_score', { ascending: false });
  if (error) { console.error('fetchCEOContacts error:', error); return []; }
  return (data || []) as CEOContact[];
}

export async function getTopPriorityContacts(limit: number = 5): Promise<CEOContact[]> {
  const { data, error } = await supabase
    .from('ceo_contacts')
    .select('*')
    .eq('is_verified', true)
    .order('total_score', { ascending: false })
    .limit(limit);
  if (error) { console.error('getTopPriorityContacts error:', error); return []; }
  return (data || []) as CEOContact[];
}

export async function createCEOContact(
  contact: Omit<CEOContact, 'id' | 'created_at' | 'updated_at' | 'total_score' | 'priority_level' | 'strategic_value_score' | 'recency_score' | 'cross_project_score' | 'follow_up_action' | 'follow_up_message_type'>
): Promise<CEOContact | null> {
  const scores = computeScores({
    role: contact.role,
    project_tags: contact.project_tags,
    last_interaction_at: contact.last_interaction_at,
    responsiveness_score: contact.responsiveness_score,
    momentum_score: contact.momentum_score,
  });

  const { data, error } = await supabase
    .from('ceo_contacts')
    .insert({ ...contact, ...scores })
    .select()
    .single();
  if (error) { console.error('createCEOContact error:', error); return null; }
  return data as CEOContact;
}

export async function updateCEOContact(
  id: string,
  updates: Partial<Omit<CEOContact, 'id' | 'created_at' | 'updated_at'>>
): Promise<CEOContact | null> {
  // If scoring-relevant fields changed, recompute
  const { data: existing } = await supabase
    .from('ceo_contacts')
    .select('*')
    .eq('id', id)
    .single();
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const scores = computeScores({
    role: merged.role,
    project_tags: merged.project_tags,
    last_interaction_at: merged.last_interaction_at,
    responsiveness_score: merged.responsiveness_score,
    momentum_score: merged.momentum_score,
  });

  const { data, error } = await supabase
    .from('ceo_contacts')
    .update({ ...updates, ...scores })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateCEOContact error:', error); return null; }
  return data as CEOContact;
}

export async function toggleContactVerified(id: string, isVerified: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('ceo_contacts')
    .update({ is_verified: isVerified, source_manual: isVerified })
    .eq('id', id);
  if (error) { console.error('toggleContactVerified error:', error); return false; }
  return true;
}

/**
 * Auto-verify contacts with source_email_count >= threshold.
 * Returns count of newly auto-verified contacts.
 */
export async function autoVerifyByEmailCount(threshold: number = 3): Promise<number> {
  const { data, error } = await supabase
    .from('ceo_contacts')
    .update({ is_verified: true })
    .eq('is_verified', false)
    .gte('source_email_count', threshold)
    .select('id');
  if (error) { console.error('autoVerifyByEmailCount error:', error); return 0; }
  return data?.length ?? 0;
}

/**
 * Log a real interaction to email_activity and link to contact.
 */
export async function logInteraction(contactName: string, subject: string, direction: 'inbound' | 'outbound' = 'outbound'): Promise<boolean> {
  const { error } = await supabase
    .from('email_activity')
    .insert({
      direction,
      to_address: contactName,
      subject,
      status: 'sent',
      context_source: 'cockpit-manual',
      sent_at: new Date().toISOString(),
    });
  if (error) { console.error('logInteraction error:', error); return false; }
  return true;
}

/**
 * Sync email intelligence: cross-reference email_activity with ceo_contacts.
 * Updates source_email_count, applies auto-verification, boosts responsiveness.
 * Returns summary of changes.
 */
export async function syncEmailIntelligence(): Promise<{
  synced: number;
  autoVerified: string[];
  emailCounts: Record<string, number>;
}> {
  const result = { synced: 0, autoVerified: [] as string[], emailCounts: {} as Record<string, number> };

  // Fetch all contacts and emails
  const contacts = await fetchCEOContacts();
  const { data: emails, error: emailError } = await supabase
    .from('email_activity')
    .select('to_address, cc_address, subject, sent_at');
  if (emailError || !emails) return result;

  for (const contact of contacts) {
    // Match emails where contact name appears in to_address, cc_address, or subject
    const matched = emails.filter(e =>
      (e.to_address && e.to_address.toLowerCase().includes(contact.name.toLowerCase())) ||
      (e.cc_address && e.cc_address.toLowerCase().includes(contact.name.toLowerCase())) ||
      (e.subject && e.subject.toLowerCase().includes(contact.name.toLowerCase()))
    );

    const emailCount = matched.length;
    result.emailCounts[contact.name] = emailCount;

    // Compute responsiveness boost from email frequency
    let responsivenessBoost = 0;
    if (emailCount >= 5) responsivenessBoost = 5;
    else if (emailCount >= 3) responsivenessBoost = 3;
    else if (emailCount >= 1) responsivenessBoost = 1;

    const newResponsiveness = Math.min(20, contact.responsiveness_score + responsivenessBoost);

    // Find most recent email for recency
    const mostRecent = matched
      .filter(e => e.sent_at)
      .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];

    // Update last_interaction_at if email is more recent
    const updates: Record<string, unknown> = {
      source_email_count: emailCount,
      responsiveness_score: newResponsiveness,
    };

    if (mostRecent?.sent_at) {
      const emailDate = new Date(mostRecent.sent_at);
      const currentLast = contact.last_interaction_at ? new Date(contact.last_interaction_at) : new Date(0);
      if (emailDate > currentLast) {
        updates.last_interaction_at = mostRecent.sent_at;
      }
    }

    // Auto-verify if email count >= 3
    if (emailCount >= 3 && !contact.is_verified) {
      updates.is_verified = true;
      result.autoVerified.push(contact.name);
    }

    const { error } = await supabase
      .from('ceo_contacts')
      .update(updates)
      .eq('id', contact.id);
    if (!error) result.synced++;
  }

  // Recalculate all scores after sync
  await recalculateAllScores();

  return result;
}

export async function deleteCEOContact(id: string): Promise<boolean> {
  const { error } = await supabase.from('ceo_contacts').delete().eq('id', id);
  if (error) { console.error('deleteCEOContact error:', error); return false; }
  return true;
}

/**
 * Recalculate scores for ALL contacts (batch refresh).
 */
export async function recalculateAllScores(): Promise<number> {
  const contacts = await fetchCEOContacts();
  let updated = 0;

  for (const contact of contacts) {
    const scores = computeScores({
      role: contact.role as CEOContactRole,
      project_tags: contact.project_tags,
      last_interaction_at: contact.last_interaction_at,
      responsiveness_score: contact.responsiveness_score,
      momentum_score: contact.momentum_score,
    });

    const { error } = await supabase
      .from('ceo_contacts')
      .update(scores)
      .eq('id', contact.id);

    if (!error) updated++;
  }

  return updated;
}

/* ── Doctrine Guardrail ── */

/**
 * Returns true if contact is COLONAiVE-tagged (doctrine restrictions apply).
 * COLONAiVE contacts: no hard-sell, movement-first tone, colonoscopy = gold standard.
 */
export function isColonAiVEContact(contact: CEOContact): boolean {
  return contact.project_tags.includes('COLONAiVE');
}

/**
 * Get doctrine-safe follow-up guidance for a contact.
 */
export function getDoctrineGuidance(contact: CEOContact): string | null {
  if (!isColonAiVEContact(contact)) return null;
  return 'COLONAiVE Doctrine: Movement-first tone. No hard-sell. Colonoscopy remains gold standard. Blood test is complementary screening, not replacement.';
}
