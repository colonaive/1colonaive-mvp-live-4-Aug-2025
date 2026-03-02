// @ts-nocheck

import { createClient } from "@supabase/supabase-js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const UPDATE_CHUNK_SIZE = 25;

const SCREENING_AND_POLICY_KEYWORDS = [
  "screening",
  "guideline",
  "uspstf",
  "nccn",
  "fit",
  "fobt",
  "colonoscopy",
  "surveillance",
  "program",
  "reimbursement",
  "policy",
  "ministry",
  "recommendation",
  "age 45",
  "population screening",
];

const CLINICAL_RESEARCH_KEYWORDS = [
  "trial",
  "study",
  "cohort",
  "randomized",
  "meta-analysis",
  "journal",
  "biomarker",
  "methylation",
  "genomics",
  "mutation",
  "mechanism",
  "outcomes",
  "efficacy",
  "sensitivity",
  "specificity",
];

const AWARENESS_AND_ADVOCACY_KEYWORDS = [
  "awareness",
  "campaign",
  "survivor",
  "fundraising",
  "community",
  "advocacy",
  "charity",
  "public health",
  "colorectal cancer month",
  "march",
];

function clampLimit(rawValue: unknown) {
  const parsed = Number.parseInt(String(rawValue ?? DEFAULT_LIMIT), 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function normalizeHeaderValue(value: unknown) {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
}

function getProvidedSecret(event: any) {
  const headers = event?.headers || {};

  return (
    normalizeHeaderValue(headers["x-backfill-secret"]) ||
    normalizeHeaderValue(headers["X-Backfill-Secret"]) ||
    normalizeHeaderValue(event?.queryStringParameters?.secret)
  );
}

function isBlankCategory(value: unknown) {
  return value == null || String(value).trim() === "";
}

function includesAnyKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyCategory(row: any) {
  const text = `${row?.title ?? ""} ${row?.summary ?? ""} ${row?.source ?? ""}`.toLowerCase();

  if (includesAnyKeyword(text, SCREENING_AND_POLICY_KEYWORDS)) {
    return "Screening & Policy";
  }

  if (includesAnyKeyword(text, CLINICAL_RESEARCH_KEYWORDS)) {
    return "Clinical Research";
  }

  if (includesAnyKeyword(text, AWARENESS_AND_ADVOCACY_KEYWORDS)) {
    return "Awareness & Advocacy";
  }

  return "Uncategorized";
}

async function selectBlankBatch(supabase: any, limit: number) {
  const rows: any[] = [];
  const pageSize = Math.min(500, Math.max(limit * 2, 100));
  let offset = 0;

  while (rows.length < limit) {
    const { data, error } = await supabase
      .from("crc_news_feed")
      .select("id,title,summary,source,category")
      .order("date_published", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(`Supabase select failed: ${error.message}`);
    }

    if (!data?.length) {
      break;
    }

    for (const row of data) {
      if (isBlankCategory(row?.category)) {
        rows.push(row);
      }

      if (rows.length >= limit) {
        break;
      }
    }

    if (data.length < pageSize) {
      break;
    }

    offset += data.length;
  }

  return rows;
}

async function countRemainingBlankRows(supabase: any) {
  let remaining = 0;
  let offset = 0;
  const pageSize = 500;

  while (true) {
    const { data, error } = await supabase
      .from("crc_news_feed")
      .select("id,category")
      .order("date_published", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(`Supabase count failed: ${error.message}`);
    }

    if (!data?.length) {
      break;
    }

    for (const row of data) {
      if (isBlankCategory(row?.category)) {
        remaining += 1;
      }
    }

    if (data.length < pageSize) {
      break;
    }

    offset += data.length;
  }

  return remaining;
}

async function updateChunk(supabase: any, rows: any[]) {
  const perCategoryCounts: Record<string, number> = {};
  let updated = 0;

  await Promise.all(
    rows.map(async (row) => {
      const nextCategory = classifyCategory(row);
      let query = supabase
        .from("crc_news_feed")
        .update({ category: nextCategory })
        .eq("id", row.id);

      if (row.category == null) {
        query = query.is("category", null);
      } else {
        query = query.eq("category", row.category);
      }

      const { data, error } = await query.select("id");

      if (error) {
        throw new Error(`Supabase update failed: ${error.message}`);
      }

      if (Array.isArray(data) && data.length > 0) {
        updated += 1;
        perCategoryCounts[nextCategory] = (perCategoryCounts[nextCategory] || 0) + 1;
      }
    }),
  );

  return { updated, perCategoryCounts };
}

function mergeCategoryCounts(target: Record<string, number>, source: Record<string, number>) {
  for (const [category, count] of Object.entries(source)) {
    target[category] = (target[category] || 0) + count;
  }
}

export async function handler(event: any) {
  try {
    const expectedSecret = String(process.env.LIVE_NEWS_BACKFILL_SECRET ?? "").trim();
    const providedSecret = getProvidedSecret(event);

    if (!expectedSecret) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "server_configuration_error" }),
      };
    }

    if (!providedSecret || providedSecret !== expectedSecret) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "unauthorized" }),
      };
    }

    const supabaseUrl = String(process.env.SUPABASE_URL ?? "").trim();
    const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "server_configuration_error" }),
      };
    }

    const requestedLimit = clampLimit(event?.queryStringParameters?.limit);
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const batch = await selectBlankBatch(supabase, requestedLimit);
    const perCategoryCounts: Record<string, number> = {};
    let updated = 0;

    for (let index = 0; index < batch.length; index += UPDATE_CHUNK_SIZE) {
      const chunk = batch.slice(index, index + UPDATE_CHUNK_SIZE);
      const chunkResult = await updateChunk(supabase, chunk);

      updated += chunkResult.updated;
      mergeCategoryCounts(perCategoryCounts, chunkResult.perCategoryCounts);
    }

    const remainingUncategorizedEstimate = await countRemainingBlankRows(supabase);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        scanned: batch.length,
        updated,
        per_category_counts: perCategoryCounts,
        remaining_uncategorized_estimate: remainingUncategorizedEstimate,
        run_id: new Date().toISOString(),
      }),
    };
  } catch (error: any) {
    console.error("Backfill category function error:", error?.message);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "server_error" }),
    };
  }
}
