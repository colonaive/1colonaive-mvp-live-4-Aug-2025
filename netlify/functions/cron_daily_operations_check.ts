// @ts-nocheck
// Scheduled Netlify Function: Daily Operations Check
// Runs daily at 06:00 SGT (22:00 UTC previous day)
// Checks system health and creates alerts if issues detected.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(_req, _context) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const checks = [];

  // 1. Check Supabase connectivity
  try {
    const { error } = await supabase.from("crc_news_feed").select("id").limit(1);
    checks.push({
      system: "Supabase Database",
      status: error ? "degraded" : "healthy",
      message: error ? `Query error: ${error.message}` : "Connected and responsive",
    });
  } catch (err) {
    checks.push({
      system: "Supabase Database",
      status: "down",
      message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    });
  }

  // 2. Check CRC Radar freshness (should have signals within last 12 hours)
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("crc_research_signals")
      .select("id")
      .gte("created_at", twelveHoursAgo)
      .limit(1);

    if (error) {
      checks.push({ system: "CRC Radar", status: "degraded", message: error.message });
    } else if (!data || data.length === 0) {
      checks.push({ system: "CRC Radar", status: "degraded", message: "No new signals in 12 hours — cron may be stale" });
    } else {
      checks.push({ system: "CRC Radar", status: "healthy", message: "Signals arriving on schedule" });
    }
  } catch {
    checks.push({ system: "CRC Radar", status: "down", message: "Check failed" });
  }

  // 3. Check LinkedIn post generation freshness
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("linkedin_posts")
      .select("id")
      .gte("created_at", oneDayAgo)
      .limit(1);

    checks.push({
      system: "LinkedIn Intelligence",
      status: data && data.length > 0 ? "healthy" : "degraded",
      message: data && data.length > 0 ? "Posts generated recently" : "No new posts in 24 hours",
    });
  } catch {
    checks.push({ system: "LinkedIn Intelligence", status: "degraded", message: "Check failed" });
  }

  // 4. Check executive briefing freshness
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("executive_briefings")
      .select("id")
      .gte("created_at", twoDaysAgo)
      .limit(1);

    checks.push({
      system: "Executive Briefing",
      status: data && data.length > 0 ? "healthy" : "degraded",
      message: data && data.length > 0 ? "Briefings current" : "No briefing in 48 hours",
    });
  } catch {
    checks.push({ system: "Executive Briefing", status: "degraded", message: "Check failed" });
  }

  // Store results
  const overall = checks.some((c) => c.status === "down")
    ? "down"
    : checks.some((c) => c.status === "degraded")
      ? "degraded"
      : "healthy";

  const { error: insertError } = await supabase.from("executive_briefings").insert({
    briefing_type: "daily_operations",
    date: new Date().toISOString().split("T")[0],
    sections: [
      {
        heading: "System Health",
        items: checks.map((c) => `${c.system}: ${c.status.toUpperCase()} — ${c.message}`),
      },
    ],
    summary: `Daily Operations Check: ${overall.toUpperCase()}. ${checks.filter((c) => c.status === "healthy").length}/${checks.length} systems healthy.`,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Failed to store operations check:", insertError.message);
  }

  return new Response(
    JSON.stringify({ status: "ok", overall, checks }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export const config = {
  schedule: "0 22 * * *", // Daily 22:00 UTC = 06:00 SGT next day
};
