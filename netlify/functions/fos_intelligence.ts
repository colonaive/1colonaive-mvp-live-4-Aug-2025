// @ts-nocheck

/**
 * Unified Intelligence API — CTW-COCKPIT-02D.10 Part 7
 *
 * Returns consolidated intelligence across all systems:
 * - Active events (top 5)
 * - Active predictions (top 3, confidence >= 55)
 * - Recurring patterns
 * - Recent action logs
 *
 * Endpoint: GET /api/fos/intelligence
 * Query params:
 *   - source_system (optional): filter by source (colonaive | durmah | sciencehod | renovate)
 */

import { createClient } from '@supabase/supabase-js';

export async function handler(event: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'server_configuration_error' }),
      };
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const sourceSystem = event.queryStringParameters?.source_system?.trim() || null;

    // Fetch all intelligence data in parallel
    const [eventsRes, predictionsRes, recurringRes, actionLogsRes] = await Promise.all([
      // Active events (top 5) — source_system is jsonb array, use @> containment
      (() => {
        let q = supabase
          .from('ceo_events')
          .select('*')
          .in('status', ['open', 'in_progress'])
          .order('priority_score', { ascending: false })
          .limit(5);
        if (sourceSystem) q = q.contains('source_system', [sourceSystem]);
        return q;
      })(),

      // Active predictions (top 3, confidence >= 55)
      (() => {
        let q = supabase
          .from('ceo_predictions')
          .select('*')
          .eq('status', 'active')
          .gte('confidence_score', 55)
          .order('confidence_score', { ascending: false })
          .limit(3);
        if (sourceSystem) q = q.contains('source_system', [sourceSystem]);
        return q;
      })(),

      // Recurring patterns
      (() => {
        let q = supabase
          .from('ceo_events')
          .select('id, event_name, event_type, recurrence_count, is_recurring, source_system')
          .eq('is_recurring', true)
          .in('status', ['open', 'in_progress'])
          .order('recurrence_count', { ascending: false })
          .limit(10);
        if (sourceSystem) q = q.contains('source_system', [sourceSystem]);
        return q;
      })(),

      // Recent action logs (last 50)
      supabase
        .from('ceo_action_logs')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(50),
    ]);

    const response = {
      events: eventsRes.data || [],
      predictions: predictionsRes.data || [],
      recurring_patterns: recurringRes.data || [],
      action_logs: actionLogsRes.data || [],
      meta: {
        generated_at: new Date().toISOString(),
        source_filter: sourceSystem || 'all',
        event_count: (eventsRes.data || []).length,
        prediction_count: (predictionsRes.data || []).length,
        recurring_count: (recurringRes.data || []).length,
      },
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.error('FOS Intelligence error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'internal_error', message: err.message }),
    };
  }
}
