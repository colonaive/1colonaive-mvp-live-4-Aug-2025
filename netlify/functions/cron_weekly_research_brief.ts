// @ts-nocheck
// Scheduled Netlify Function: Weekly Research Brief
// Runs every Monday at 08:00 SGT (00:00 UTC Monday)
// Compiles top research signals into a research-focused brief.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(_req, _context) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  // Fetch top research signals from the past week
  const { data: signals } = await supabase
    .from("crc_research_signals")
    .select("*")
    .gte("created_at", weekStart.toISOString())
    .order("radar_score", { ascending: false })
    .limit(20);

  // Fetch policy updates
  const { data: policies } = await supabase
    .from("crc_policy_updates")
    .select("*")
    .gte("created_at", weekStart.toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch competitor signals
  const { data: compSignals } = await supabase
    .from("competitor_signals")
    .select("*")
    .gte("created_at", weekStart.toISOString())
    .order("impact_score", { ascending: false })
    .limit(10);

  const sections = [];

  // Top research findings
  if (signals && signals.length > 0) {
    sections.push({
      heading: "Top Research Findings",
      items: signals.slice(0, 5).map(
        (s: { radar_score: number; headline?: string; title?: string; journal?: string; source?: string }) =>
          `[Score: ${s.radar_score}] ${s.headline || s.title} — ${s.journal || s.source}`
      ),
    });
  }

  // Policy developments
  if (policies && policies.length > 0) {
    sections.push({
      heading: "Policy Developments",
      items: policies.map(
        (p: { title: string; jurisdiction?: string }) =>
          `${p.title}${p.jurisdiction ? ` (${p.jurisdiction})` : ""}`
      ),
    });
  }

  // Competitive intelligence
  if (compSignals && compSignals.length > 0) {
    sections.push({
      heading: "Competitive Intelligence",
      items: compSignals.slice(0, 5).map(
        (c: { company_name: string; title: string }) =>
          `${c.company_name}: ${c.title}`
      ),
    });
  }

  // Store the brief
  const { error } = await supabase.from("executive_briefings").insert({
    briefing_type: "weekly_research",
    date: now.toISOString().split("T")[0],
    sections,
    summary: `Weekly Research Brief: ${signals?.length || 0} signals, ${policies?.length || 0} policy updates, ${compSignals?.length || 0} competitive signals.`,
    created_at: now.toISOString(),
  });

  if (error) {
    console.error("Failed to store research brief:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      signalCount: signals?.length || 0,
      policyCount: policies?.length || 0,
      competitiveCount: compSignals?.length || 0,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export const config = {
  schedule: "0 0 * * 1", // Every Monday 00:00 UTC = Monday 08:00 SGT
};
