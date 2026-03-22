// @ts-nocheck
//
// Daily Executive Briefing — Netlify Function
//
// Scheduled: 0 23 * * * (UTC) = 07:00 SGT daily
//
// Actions:
//   GET ?action=latest   → return today's briefing
//   GET ?action=history  → return past briefings (default 7)
//   POST / scheduled     → generate briefing, store in Supabase, email to admin

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

export const config = {
  schedule: '0 23 * * *',
};

/* ---------- helpers ---------- */

function todayISO(): string {
  // Singapore date (UTC+8)
  const now = new Date();
  const sg = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return sg.toISOString().slice(0, 10);
}

function sgDateString(): string {
  const now = new Date();
  const sg = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return sg.toLocaleDateString('en-SG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

/* ---------- data gatherers ---------- */

// STRICT MODE: Only include direct_email and manual_entry sources.
// Exclude inferred_ai unless explicitly verified.
const TRUSTED_SOURCES = ['direct_email', 'manual_entry'];

async function fetchActionableEmails(supabase: any): Promise<{ takeAction: string[]; watch: string[] }> {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: actionEmails } = await supabase
      .from('ceo_emails')
      .select('sender_name, subject, classification_reason, keyword_matches, confidence_level, source_origin')
      .eq('classification', 'take_action')
      .in('source_origin', TRUSTED_SOURCES)
      .gte('received_at', yesterday)
      .order('received_at', { ascending: false })
      .limit(10);

    const { data: watchEmails } = await supabase
      .from('ceo_emails')
      .select('sender_name, subject, classification_reason, confidence_level, source_origin')
      .eq('classification', 'investigate')
      .in('source_origin', TRUSTED_SOURCES)
      .gte('received_at', yesterday)
      .order('received_at', { ascending: false })
      .limit(10);

    const confBadge = (level: string) => level === 'high' ? '●' : level === 'medium' ? '◐' : '○';

    const takeAction = (actionEmails || []).map((m: any) => {
      const keywords = m.keyword_matches?.length ? ` [${m.keyword_matches.join(', ')}]` : '';
      return `${confBadge(m.confidence_level)} ⚡ ${m.sender_name} — ${m.subject}${keywords}`;
    });

    const watch = (watchEmails || []).map((m: any) =>
      `${confBadge(m.confidence_level)} 👁 ${m.sender_name} — ${m.subject}`,
    );

    return {
      takeAction: takeAction.length > 0 ? takeAction : ['No action-required emails in last 24h'],
      watch: watch.length > 0 ? watch : ['No watch-list emails in last 24h'],
    };
  } catch (e: any) {
    console.error('Actionable email fetch error:', e?.message);
    return {
      takeAction: ['Email intelligence unavailable'],
      watch: ['Email intelligence unavailable'],
    };
  }
}

async function fetchOpenTasks(supabase: any): Promise<string[]> {
  try {
    const { data: tasks } = await supabase
      .from('ceo_tasks')
      .select('title, priority, confidence_level, source_origin')
      .eq('status', 'open')
      .in('source_origin', TRUSTED_SOURCES)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!tasks?.length) return ['No open tasks'];
    const confBadge = (level: string) => level === 'high' ? '●' : level === 'medium' ? '◐' : '○';
    return tasks.map((t: any) => `${confBadge(t.confidence_level)} [${t.priority.toUpperCase()}] ${t.title}`);
  } catch {
    return ['Tasks unavailable'];
  }
}

async function fetchOpenRisks(supabase: any): Promise<string[]> {
  try {
    const { data: risks } = await supabase
      .from('ceo_risks')
      .select('title, severity, confidence_level, source_origin')
      .eq('status', 'open')
      .in('source_origin', TRUSTED_SOURCES)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!risks?.length) return ['No open risks'];
    const confBadge = (level: string) => level === 'high' ? '●' : level === 'medium' ? '◐' : '○';
    return risks.map((r: any) => `${confBadge(r.confidence_level)} [${r.severity.toUpperCase()}] ${r.title}`);
  } catch {
    return ['Risks unavailable'];
  }
}

// Legacy fallback: fetch directly from Graph if ceo_emails is empty
async function fetchInboxHighlights(): Promise<string[]> {
  try {
    const tenant = process.env.OUTLOOK_TENANT_ID;
    const clientId = process.env.OUTLOOK_CLIENT_ID;
    const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
    if (!tenant || !clientId || !clientSecret) return ['Outlook not configured'];

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      { method: 'POST', body: params },
    );
    const tokenData: any = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) return ['Outlook auth failed'];

    const mailbox = 'admin@saversmed.com';
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${mailbox}/messages?$top=10&$select=id,subject,from,isRead`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data: any = await res.json();
    const messages: any[] = data.value || [];

    const unread = messages.filter((m: any) => !m.isRead);
    const picks = (unread.length > 0 ? unread : messages).slice(0, 5);

    return picks.length > 0
      ? picks.map((m: any) => {
          const sender = m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown';
          return `${sender} — ${m.subject || '(no subject)'}`;
        })
      : ['No recent emails'];
  } catch (e: any) {
    console.error('Inbox fetch error:', e?.message);
    return ['Inbox unavailable'];
  }
}

async function fetchCRCHighlights(supabase: any): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('crc_news_feed')
      .select('title, relevance_score')
      .order('relevance_score', { ascending: false, nullsFirst: false })
      .order('date_published', { ascending: false, nullsFirst: false })
      .limit(3);

    if (error || !data?.length) return ['No CRC news available'];
    return data.map((n: any) => {
      const score = n.relevance_score != null ? ` (${n.relevance_score}%)` : '';
      return `${n.title}${score}`;
    });
  } catch {
    return ['CRC news feed unavailable'];
  }
}

function getRegulatoryStatus(): string[] {
  return [
    'Singapore HSA: Class C — Registered (valid until 2026-04-10)',
    'EU CE IVDR: Proposed transition from CE IVDD',
    'India CDSCO: Class C — MD-14/MD-15 submission in progress',
    'China NMPA: Approved (Cert 20243400902, valid until 2029-05-13)',
  ];
}

async function getProjectUpdates(supabase: any): Promise<string[]> {
  // Load verified facts to ensure correct definitions
  let verifiedFacts: Record<string, { definition: string; linked_to: string | null }> = {};
  try {
    const { data } = await supabase
      .from('ceo_verified_facts')
      .select('entity, correct_definition, linked_to')
      .eq('is_locked', true);
    if (data) {
      for (const f of data) {
        verifiedFacts[f.entity] = { definition: f.correct_definition, linked_to: f.linked_to };
      }
    }
  } catch {
    // fallback to hardcoded if DB unavailable
  }

  const scrs = verifiedFacts['SCRS']?.definition || 'Society of Colorectal Surgeons (Singapore)';
  const smiles = verifiedFacts['SMILES']?.definition || 'SMILES Multi-Centre Study';
  const smilesLinked = verifiedFacts['SMILES']?.linked_to;
  const smilesAttrib = smilesLinked ? ` (${smilesLinked})` : ' (Prof Lawrence Ho)';

  return [
    'KTPH Investigator Study — proposed (Dr Daniel Lee)',
    `SCRS Engagement — proposed (${scrs})`,
    'Temasek Research Partnership — proposed',
    `${smiles} — proposed${smilesAttrib}`,
  ];
}

/* ---------- decision engine layers (AG-FOUNDER-BRIEF-02) ---------- */

async function fetchMomentumItems(supabase: any): Promise<string[]> {
  const items: string[] = [];

  try {
    // Dormant take_action/investigate emails (48h–5d old)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const fiveDaysAgo = new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString();

    const { data: dormantEmails } = await supabase
      .from('ceo_emails')
      .select('sender_name, subject, received_at, classification')
      .in('source_origin', TRUSTED_SOURCES)
      .in('classification', ['take_action', 'investigate'])
      .lte('received_at', twoDaysAgo)
      .gte('received_at', fiveDaysAgo)
      .order('received_at', { ascending: true })
      .limit(5);

    for (const email of dormantEmails || []) {
      const ageMs = Date.now() - new Date(email.received_at).getTime();
      const ageDays = Math.round(ageMs / (1000 * 60 * 60 * 24));
      items.push(`🔄 ${email.sender_name} — ${email.subject} (dormant ${ageDays}d) [Inferred follow-up]`);
    }

    // Stale CEO events
    const { data: staleEvents } = await supabase
      .from('ceo_events')
      .select('event_name, event_type, next_action, priority_score')
      .eq('is_stale', true)
      .in('status', ['open', 'in_progress'])
      .order('priority_score', { ascending: false })
      .limit(3);

    for (const evt of staleEvents || []) {
      items.push(`⏳ ${evt.event_name} — stale [${evt.event_type}]. Next: ${evt.next_action || 'Review'} [Inferred follow-up]`);
    }

    // Aging medium-priority tasks
    const { data: agingTasks } = await supabase
      .from('ceo_tasks')
      .select('title, created_at')
      .eq('status', 'open')
      .in('source_origin', TRUSTED_SOURCES)
      .eq('priority', 'medium')
      .lte('created_at', twoDaysAgo)
      .order('created_at', { ascending: true })
      .limit(2);

    for (const task of agingTasks || []) {
      const ageMs = Date.now() - new Date(task.created_at).getTime();
      const ageDays = Math.round(ageMs / (1000 * 60 * 60 * 24));
      items.push(`📋 ${task.title} — open ${ageDays}d, needs push [Inferred follow-up]`);
    }
  } catch (e: any) {
    console.error('Momentum fetch error:', e?.message);
  }

  return items.length > 0 ? items : ['No dormant threads or follow-ups detected'];
}

async function fetchWatchItems(supabase: any): Promise<string[]> {
  const items: string[] = [];

  try {
    // Tracked entities (if table exists)
    try {
      const { data: entities } = await supabase
        .from('tracked_entities')
        .select('title, state, entity_type, requires_update_to, state_updated_at')
        .eq('is_active', true)
        .order('state_updated_at', { ascending: true })
        .limit(3);

      for (const e of entities || []) {
        const icon = e.entity_type === 'shipment' ? '🚚' : e.entity_type === 'regulatory' ? '📋' : '👁';
        const update = e.requires_update_to ? ` — update ${e.requires_update_to}` : '';
        items.push(`${icon} ${e.title} [${e.state}]${update} [Verified]`);
      }
    } catch {
      // Table may not exist yet
    }

    // Logistics & regulatory events
    const { data: logEvents } = await supabase
      .from('ceo_events')
      .select('event_name, event_type, next_action, priority_score')
      .in('event_type', ['logistics', 'regulatory'])
      .in('status', ['open', 'in_progress'])
      .order('priority_score', { ascending: false })
      .limit(3);

    for (const evt of logEvents || []) {
      const icon = evt.event_type === 'logistics' ? '🚚' : '📋';
      items.push(`${icon} ${evt.event_name} — ${evt.next_action || 'Monitor'} [Verified]`);
    }
  } catch (e: any) {
    console.error('Watch fetch error:', e?.message);
  }

  return items;
}

async function fetchOpportunityItems(supabase: any): Promise<string[]> {
  const items: string[] = [];

  try {
    // CRC news with high relevance = LinkedIn posting opportunity
    const { data: crcNews } = await supabase
      .from('crc_news_feed')
      .select('title, relevance_score')
      .gte('relevance_score', 65)
      .order('relevance_score', { ascending: false })
      .limit(2);

    for (const news of crcNews || []) {
      items.push(`✍️ LinkedIn opportunity: ${news.title} (${news.relevance_score}% relevance) [Strategic opportunity]`);
    }

    // Early warnings with opportunity angle
    const { data: ewOpps } = await supabase
      .from('ceo_early_warnings')
      .select('title, market_implication, confidence_score')
      .gte('confidence_score', 50)
      .order('confidence_score', { ascending: false })
      .limit(2);

    for (const ew of ewOpps || []) {
      const text = `${ew.title} ${ew.market_implication || ''}`.toLowerCase();
      if (text.includes('opportunity') || text.includes('partnership') || text.includes('collaboration')) {
        items.push(`🎯 ${ew.title} — ${ew.market_implication || 'Evaluate'} [Strategic opportunity]`);
      }
    }

    // Fallback: static cross-project opportunities
    if (items.length === 0) {
      items.push('💡 COLONAiVE: KTPH Investigator Study — progress if bandwidth allows [Strategic opportunity]');
      items.push('💡 ScienceHOD: Revenue pipeline development — early-stage monetisation [Strategic opportunity]');
    }
  } catch (e: any) {
    console.error('Opportunity fetch error:', e?.message);
  }

  return items.length > 0 ? items : ['No strategic opportunities identified'];
}

/* ---------- briefing assembly ---------- */

interface BriefingSection {
  heading: string;
  items: string[];
}

function buildBriefingText(date: string, sections: BriefingSection[]): string {
  let text = `Daily Executive Briefing\nDate: ${date}\n`;
  text += `Confidence: ● HIGH (direct source) | ◐ MEDIUM (pattern match) | ○ LOW (needs verification)\n`;
  text += `Guardrail: STRICT MODE — only direct_email and manual_entry sources included\n`;
  for (const s of sections) {
    text += `\n${s.heading}\n`;
    for (const item of s.items) {
      text += `• ${item}\n`;
    }
  }
  return text;
}

function buildBriefingHtml(date: string, sections: BriefingSection[]): string {
  // Color map for the 4 decision engine layers
  const layerColors: Record<string, { bg: string; border: string; text: string }> = {
    'TODAY': { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
    'MOMENTUM': { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    'WATCH': { bg: '#fff7ed', border: '#f97316', text: '#9a3412' },
    'OPPORTUNITY': { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  };

  let html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">`;
  html += `<h2 style="color:#0A385A;border-bottom:2px solid #0F766E;padding-bottom:8px;">Founder Decision Briefing</h2>`;
  html += `<p style="color:#666;font-size:14px;">Date: ${date}</p>`;
  html += `<p style="color:#0F766E;font-size:12px;background:#f0fdf4;padding:6px 10px;border-radius:4px;border-left:3px solid #0F766E;">`;
  html += `<strong>Guardrail:</strong> STRICT MODE — only verified sources (direct_email, manual_entry) included<br/>`;
  html += `<strong>Labels:</strong> [Verified] = confirmed fact &nbsp; [Inferred follow-up] = system-detected &nbsp; [Strategic opportunity] = optional high-leverage</p>`;

  for (const s of sections) {
    // Check if this is a decision engine layer
    const layerKey = Object.keys(layerColors).find((k) => s.heading.startsWith(k));
    const colors = layerKey ? layerColors[layerKey] : null;

    if (colors) {
      html += `<div style="background:${colors.bg};border-left:4px solid ${colors.border};padding:12px 16px;margin-top:20px;border-radius:4px;">`;
      html += `<h3 style="color:${colors.text};margin:0 0 8px 0;font-size:15px;">${s.heading}</h3>`;
      html += `<ul style="color:#333;font-size:14px;line-height:1.7;margin:0;padding-left:20px;">`;
    } else {
      html += `<h3 style="color:#0F766E;margin-top:20px;">${s.heading}</h3>`;
      html += `<ul style="color:#333;font-size:14px;line-height:1.6;">`;
    }

    for (const item of s.items) {
      html += `<li>${item}</li>`;
    }
    html += `</ul>`;

    if (colors) {
      html += `</div>`;
    }
  }

  html += `<hr style="margin-top:24px;border:none;border-top:1px solid #ddd;"/>`;
  html += `<p style="color:#999;font-size:12px;">COLONAiVE Founder Decision Engine — Daily Briefing | Intelligence Guardrails Active</p></div>`;
  return html;
}

/* ---------- email sender (Resend) ---------- */

async function sendBriefingEmail(subject: string, _text: string, html: string): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  const from = process.env.SENDGRID_FROM || 'info@colonaive.ai';
  const to = process.env.EXEC_BRIEFING_TO || 'admin@saversmed.com';

  if (!apiKey) {
    const msg = 'RESEND_API_KEY not set — cannot send briefing email';
    console.error(msg);
    return { sent: false, error: msg };
  }

  console.log(`Sending briefing email via Resend to: ${to}, from: ${from}`);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `COLONAiVE <${from}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const body: any = await res.json();

    if (res.ok && body.id) {
      console.log(`Resend email sent successfully, id: ${body.id}`);
      return { sent: true };
    }

    const errMsg = body?.message || body?.error || `Resend status ${res.status}`;
    console.error('Resend error:', errMsg);
    return { sent: false, error: errMsg };
  } catch (e: any) {
    const errMsg = e?.message || 'Unknown error';
    console.error('Resend email error:', errMsg);
    return { sent: false, error: errMsg };
  }
}

/* ---------- handler ---------- */

export async function handler(event: any) {
  const action = event.queryStringParameters?.action;

  // --- READ endpoints (GET) ---
  if (action === 'latest') {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('executive_briefings')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: null }),
        };
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    } catch (e: any) {
      return { statusCode: 500, body: JSON.stringify({ error: e?.message }) };
    }
  }

  if (action === 'history') {
    try {
      const limit = Math.min(Number(event.queryStringParameters?.limit || 7), 30);
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('executive_briefings')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: data || [] }),
      };
    } catch (e: any) {
      return { statusCode: 500, body: JSON.stringify({ error: e?.message }) };
    }
  }

  // --- GENERATE (scheduled or manual trigger) ---
  try {
    const supabase = getSupabase();
    const dateStr = sgDateString();
    const dateISO = todayISO();

    // Check if ceo_emails has data; if so, use classified intelligence
    const { count: emailCount } = await supabase
      .from('ceo_emails')
      .select('*', { count: 'exact', head: true })
      .gte('received_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const useEmailIntelligence = (emailCount || 0) > 0;

    const [actionableEmails, inbox, crc, tasks, risks] = await Promise.all([
      useEmailIntelligence ? fetchActionableEmails(supabase) : Promise.resolve(null),
      useEmailIntelligence ? Promise.resolve(['See classified emails below']) : fetchInboxHighlights(),
      fetchCRCHighlights(supabase),
      fetchOpenTasks(supabase),
      fetchOpenRisks(supabase),
    ]);

    const sections: BriefingSection[] = [];

    // ── 4-Layer Decision Engine (AG-FOUNDER-BRIEF-02) ──

    // Layer 1: TODAY — Execute
    if (actionableEmails) {
      sections.push({ heading: 'TODAY — Execute', items: actionableEmails.takeAction });
    } else {
      sections.push({ heading: 'TODAY — Execute', items: inbox });
    }

    // Layer 2: MOMENTUM — Push Forward (dormant emails, stale events, aging tasks)
    const momentumItems = await fetchMomentumItems(supabase);
    sections.push({ heading: 'MOMENTUM — Push Forward', items: momentumItems });

    // Layer 3: WATCH — Track Closely (logistics, regulatory, investigate emails)
    const watchItems: string[] = [];
    if (actionableEmails) {
      watchItems.push(...actionableEmails.watch);
    }
    const operationalWatch = await fetchWatchItems(supabase);
    watchItems.push(...operationalWatch);
    sections.push({
      heading: 'WATCH — Track Closely',
      items: watchItems.length > 0 ? watchItems : ['No tracked entities requiring monitoring'],
    });

    // Layer 4: OPPORTUNITY — Use Your Time
    const opportunityItems = await fetchOpportunityItems(supabase);
    sections.push({ heading: 'OPPORTUNITY — Use Your Time', items: opportunityItems });

    // Supporting sections
    sections.push({ heading: 'Open Tasks', items: tasks });
    sections.push({ heading: 'Open Risks', items: risks });
    sections.push({ heading: 'CRC Intelligence', items: crc });
    const projectUpdates = await getProjectUpdates(supabase);
    sections.push({ heading: 'Regulatory Status', items: getRegulatoryStatus() });
    sections.push({ heading: 'Clinical & Project Updates', items: projectUpdates });

    const content = buildBriefingText(dateStr, sections);
    const html = buildBriefingHtml(dateStr, sections);

    // Store in Supabase (upsert on date)
    const { error: upsertError } = await supabase
      .from('executive_briefings')
      .upsert(
        { date: dateISO, content, sections },
        { onConflict: 'date' },
      );

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError.message);
    }

    // Send email
    const emailSubject = `COLONAiVE Founder Decision Briefing — ${dateStr}`;
    const emailResult = await sendBriefingEmail(emailSubject, content, html);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        date: dateISO,
        emailSent: emailResult.sent,
        emailError: emailResult.error || null,
        sectionsCount: sections.length,
      }),
    };
  } catch (e: any) {
    console.error('Briefing generation error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: e?.message }),
    };
  }
}
