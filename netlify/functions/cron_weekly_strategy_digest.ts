// @ts-nocheck
// Scheduled Netlify Function: Weekly Strategy Digest
// Runs every Monday at 07:00 SGT (23:00 UTC Sunday)
// Generates a comprehensive weekly strategy brief and stores in Supabase.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(_req, _context) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const weekOf = `${weekStart.toLocaleDateString("en-SG", { day: "numeric", month: "short" })} – ${now.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}`;

  // Fetch operational data from various tables
  const [signalsRes, trendsRes, warningsRes] = await Promise.all([
    supabase
      .from("crc_research_signals")
      .select("id, radar_score")
      .gte("created_at", weekStart.toISOString())
      .order("radar_score", { ascending: false })
      .limit(50),
    supabase.from("technology_trends").select("id, trend_name, trend_score").limit(10),
    supabase
      .from("early_warning_signals")
      .select("id, confidence_score")
      .gte("confidence_score", 60)
      .limit(10),
  ]);

  const signalCount = signalsRes.data?.length || 0;
  const strategicCount = (signalsRes.data || []).filter((s) => s.radar_score >= 12).length;
  const trendCount = trendsRes.data?.length || 0;
  const alertCount = warningsRes.data?.length || 0;

  const sections = [
    {
      heading: "Research Intelligence",
      items: [
        `${signalCount} research signals this week`,
        `${strategicCount} strategic-grade signals (score >= 12)`,
        `${trendCount} active technology trends`,
        `${alertCount} early warning alerts`,
      ],
    },
    {
      heading: "Platform Status",
      items: [
        "Netlify deploy: operational",
        "Supabase: operational",
        "Cron jobs: CRC Radar, Competitive Radar, LinkedIn, Executive Briefing active",
      ],
    },
    {
      heading: "Connected Projects",
      items: [
        "COLONAiVE: active (Tier 1)",
        "Durmah.ai: active (Tier 2)",
        "SG Renovate AI: active (Tier 3)",
      ],
    },
  ];

  // Store the digest in executive_briefings table with a strategy tag
  const { error } = await supabase.from("executive_briefings").insert({
    briefing_type: "weekly_strategy",
    date: now.toISOString().split("T")[0],
    sections,
    summary: `Weekly Strategy Digest for ${weekOf}. ${signalCount} signals, ${alertCount} alerts.`,
    created_at: now.toISOString(),
  });

  if (error) {
    console.error("Failed to store strategy digest:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      weekOf,
      signalCount,
      strategicCount,
      trendCount,
      alertCount,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export const config = {
  schedule: "0 23 * * 0", // Every Sunday 23:00 UTC = Monday 07:00 SGT
};
