/**
 * Radar Service — frontend API layer for CRC Research Radar data
 */

export interface RadarSignal {
  id: string;
  source: string;
  title: string;
  authors: string | null;
  journal: string | null;
  publication_date: string | null;
  link: string;
  abstract: string | null;
  summary: string | null;
  topic_tags: string[] | null;
  radar_score: number;
  signal_type: string | null;
  headline: string | null;
  key_finding: string | null;
  strategic_relevance: string | null;
  public_summary: string | null;
  created_at: string;
}

export interface RadarTrial {
  id: string;
  trial_id: string;
  title: string;
  institution: string | null;
  phase: string | null;
  status: string | null;
  country: string | null;
  link: string | null;
  summary: string | null;
  created_at: string;
}

export interface RadarPolicy {
  id: string;
  country: string;
  policy_title: string;
  description: string | null;
  source_link: string | null;
  created_at: string;
}

export interface RadarMediaMention {
  id: string;
  title: string;
  publication: string | null;
  link: string | null;
  summary: string | null;
  created_at: string;
}

export interface RadarBriefing {
  id: string;
  date: string;
  top_signal: Record<string, unknown> | null;
  top_trial: Record<string, unknown> | null;
  top_policy: Record<string, unknown> | null;
  full_briefing: string | null;
  created_at: string;
}

import { supabase } from '@/supabase';

export const radarService = {
  fetchTopSignals: async (days = 7, limit = 10): Promise<RadarSignal[]> => {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('crc_research_signals')
      .select('*')
      .gte('created_at', since)
      .order('radar_score', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as RadarSignal[];
  },

  fetchAllSignals: async (limit = 50): Promise<RadarSignal[]> => {
    const { data, error } = await supabase
      .from('crc_research_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as RadarSignal[];
  },

  fetchTrials: async (limit = 20): Promise<RadarTrial[]> => {
    const { data, error } = await supabase
      .from('crc_trials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as RadarTrial[];
  },

  fetchPolicies: async (limit = 10): Promise<RadarPolicy[]> => {
    const { data, error } = await supabase
      .from('crc_policy_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as RadarPolicy[];
  },

  fetchMediaMentions: async (limit = 15): Promise<RadarMediaMention[]> => {
    const { data, error } = await supabase
      .from('crc_media_mentions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as RadarMediaMention[];
  },

  fetchLatestBriefing: async (): Promise<RadarBriefing | null> => {
    const { data, error } = await supabase
      .from('executive_briefings')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single();
    if (error) return null;
    return data as RadarBriefing;
  },

  triggerRadarScan: async (): Promise<{ ok: boolean; stats?: Record<string, number> }> => {
    try {
      const res = await fetch('/.netlify/functions/cron-crc-radar');
      if (!res.ok) return { ok: false };
      return res.json();
    } catch {
      return { ok: false };
    }
  },
};
