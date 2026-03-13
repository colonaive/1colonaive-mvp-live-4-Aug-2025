// CEO Decision Memory Engine
// Records, retrieves, and manages decision events from the CEO Action Center.
// Persists to Supabase ceo_decision_memory table; in-memory cache for fast access.

import { supabase } from '@/supabase';

export interface DecisionEvent {
  id: string;
  action_type: string;
  entity: string | null;
  context_summary: string | null;
  outcome: string;
  confidence_score: number;
  frequency: number;
  last_used_at: string;
  created_at: string;
}

export interface RecordActionInput {
  action_type: string;
  entity?: string;
  context_summary?: string;
  outcome?: string;
}

// In-memory cache
let memoryCache: DecisionEvent[] = [];
let cacheLoaded = false;

export const decisionMemoryEngine = {
  /** Load all decision memory from Supabase into cache */
  async load(): Promise<void> {
    const { data } = await supabase
      .from('ceo_decision_memory')
      .select('*')
      .order('confidence_score', { ascending: false })
      .limit(200);
    memoryCache = (data || []) as DecisionEvent[];
    cacheLoaded = true;
  },

  /** Ensure cache is loaded (idempotent) */
  async ensureLoaded(): Promise<void> {
    if (!cacheLoaded) await this.load();
  },

  /** Record an action — upserts by (action_type + entity) */
  async recordAction(input: RecordActionInput): Promise<DecisionEvent | null> {
    await this.ensureLoaded();

    const entity = input.entity?.trim() || null;
    const contextSummary = input.context_summary?.trim() || null;

    // Check if we already have this action+entity combination
    const existing = memoryCache.find(
      (m) =>
        m.action_type === input.action_type &&
        (m.entity || '').toLowerCase() === (entity || '').toLowerCase()
    );

    if (existing) {
      // Increment frequency and update
      const newFreq = existing.frequency + 1;
      const newScore = Math.min(100, existing.confidence_score + 5);
      const now = new Date().toISOString();

      await supabase
        .from('ceo_decision_memory')
        .update({
          frequency: newFreq,
          confidence_score: newScore,
          context_summary: contextSummary || existing.context_summary,
          outcome: input.outcome || existing.outcome,
          last_used_at: now,
        })
        .eq('id', existing.id);

      existing.frequency = newFreq;
      existing.confidence_score = newScore;
      existing.last_used_at = now;
      if (contextSummary) existing.context_summary = contextSummary;

      return existing;
    }

    // Insert new
    const { data } = await supabase
      .from('ceo_decision_memory')
      .insert({
        action_type: input.action_type,
        entity,
        context_summary: contextSummary,
        outcome: input.outcome || 'completed',
        confidence_score: 50,
        frequency: 1,
      })
      .select()
      .single();

    if (data) {
      const event = data as DecisionEvent;
      memoryCache.push(event);
      return event;
    }
    return null;
  },

  /** Boost confidence when CEO accepts a suggestion */
  async boostConfidence(id: string, amount = 10): Promise<void> {
    const item = memoryCache.find((m) => m.id === id);
    if (!item) return;
    const newScore = Math.min(100, item.confidence_score + amount);
    await supabase
      .from('ceo_decision_memory')
      .update({ confidence_score: newScore })
      .eq('id', id);
    item.confidence_score = newScore;
  },

  /** Decay confidence when CEO ignores a suggestion */
  async decayConfidence(id: string, amount = 3): Promise<void> {
    const item = memoryCache.find((m) => m.id === id);
    if (!item) return;
    const newScore = Math.max(0, item.confidence_score - amount);
    await supabase
      .from('ceo_decision_memory')
      .update({ confidence_score: newScore })
      .eq('id', id);
    item.confidence_score = newScore;
  },

  /** Get top memories by confidence score */
  getTopMemories(limit = 10): DecisionEvent[] {
    return [...memoryCache]
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, limit);
  },

  /** Get memories for a specific action type */
  getByActionType(actionType: string): DecisionEvent[] {
    return memoryCache.filter((m) => m.action_type === actionType);
  },

  /** Find matching memory for a given entity */
  findByEntity(entity: string): DecisionEvent[] {
    const lower = entity.toLowerCase();
    return memoryCache.filter(
      (m) => m.entity && m.entity.toLowerCase().includes(lower)
    );
  },

  /** Get frequent contacts (entity with action_type email) */
  getFrequentContacts(limit = 5): DecisionEvent[] {
    return memoryCache
      .filter((m) => m.action_type === 'email' && m.entity)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  },

  /** Get most frequent action types */
  getFrequentActions(limit = 5): { action_type: string; total_frequency: number }[] {
    const map = new Map<string, number>();
    for (const m of memoryCache) {
      map.set(m.action_type, (map.get(m.action_type) || 0) + m.frequency);
    }
    return [...map.entries()]
      .map(([action_type, total_frequency]) => ({ action_type, total_frequency }))
      .sort((a, b) => b.total_frequency - a.total_frequency)
      .slice(0, limit);
  },

  /** Get dashboard stats */
  getStats(): {
    totalMemories: number;
    topEntity: string | null;
    topAction: string | null;
    avgConfidence: number;
  } {
    if (memoryCache.length === 0) {
      return { totalMemories: 0, topEntity: null, topAction: null, avgConfidence: 0 };
    }
    const topByFreq = [...memoryCache].sort((a, b) => b.frequency - a.frequency);
    const topEntity = topByFreq.find((m) => m.entity)?.entity || null;
    const actions = this.getFrequentActions(1);
    const topAction = actions[0]?.action_type || null;
    const avgConfidence = Math.round(
      memoryCache.reduce((s, m) => s + m.confidence_score, 0) / memoryCache.length
    );
    return { totalMemories: memoryCache.length, topEntity, topAction, avgConfidence };
  },

  /** Get cache (for testing/debug) */
  getAll(): DecisionEvent[] {
    return [...memoryCache];
  },

  /** Clear cache (for testing) */
  reset(): void {
    memoryCache = [];
    cacheLoaded = false;
  },
};
