/**
 * Competitive Intelligence Service — frontend API layer
 */

import { supabase } from '@/supabase';

export interface CompetitorEntity {
  id: string;
  name: string;
  ticker: string | null;
  technology: string | null;
  products: string | null;
  headquarters: string | null;
  created_at: string;
}

export interface CompetitorSignal {
  id: string;
  company_name: string;
  title: string;
  description: string | null;
  source: string | null;
  source_link: string | null;
  signal_score: number;
  signal_type: string;
  created_at: string;
}

export interface TechnologyTrend {
  id: string;
  trend_name: string;
  trend_score: number;
  description: string | null;
  evidence_count: number;
  first_detected_at: string;
  created_at: string;
}

export interface EarlyWarningSignal {
  id: string;
  title: string;
  source: string;
  source_link: string | null;
  pubmed_id: string | null;
  confidence_score: number;
  signal_category: string;
  analysis: string | null;
  market_implication: string | null;
  recommended_action: string | null;
  in_media: boolean;
  detected_at: string;
  created_at: string;
}

export interface StrategyImplication {
  id: string;
  signal_title: string;
  analysis: string | null;
  market_implication: string | null;
  recommended_action: string | null;
  priority: string;
  created_at: string;
}

export const competitiveIntelligenceService = {
  fetchCompetitors: async (): Promise<CompetitorEntity[]> => {
    const { data, error } = await supabase
      .from('competitor_entities')
      .select('*')
      .order('name');
    if (error) throw new Error(error.message);
    return (data || []) as CompetitorEntity[];
  },

  fetchCompetitorSignals: async (limit = 20): Promise<CompetitorSignal[]> => {
    const { data, error } = await supabase
      .from('competitor_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as CompetitorSignal[];
  },

  fetchTechnologyTrends: async (): Promise<TechnologyTrend[]> => {
    const { data, error } = await supabase
      .from('technology_trends')
      .select('*')
      .order('trend_score', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as TechnologyTrend[];
  },

  fetchEarlyWarningSignals: async (limit = 15): Promise<EarlyWarningSignal[]> => {
    const { data, error } = await supabase
      .from('early_warning_signals')
      .select('*')
      .order('confidence_score', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as EarlyWarningSignal[];
  },

  fetchStrategyImplications: async (limit = 10): Promise<StrategyImplication[]> => {
    const { data, error } = await supabase
      .from('strategy_implications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as StrategyImplication[];
  },

  triggerCompetitiveRadar: async (): Promise<{ ok: boolean; stats?: Record<string, number> }> => {
    try {
      const res = await fetch('/.netlify/functions/cron_competitive_radar');
      if (!res.ok) return { ok: false };
      return res.json();
    } catch {
      return { ok: false };
    }
  },

  triggerEarlySignalScan: async (): Promise<{ ok: boolean; stats?: Record<string, number> }> => {
    try {
      const res = await fetch('/.netlify/functions/cron_early_signal_scan');
      if (!res.ok) return { ok: false };
      return res.json();
    } catch {
      return { ok: false };
    }
  },

  generateRadarLinkedInPosts: async (): Promise<{ ok: boolean; generated?: number; scanned?: number }> => {
    try {
      const res = await fetch('/.netlify/functions/radar_linkedin_generator');
      if (!res.ok) return { ok: false };
      return res.json();
    } catch {
      return { ok: false };
    }
  },
};
