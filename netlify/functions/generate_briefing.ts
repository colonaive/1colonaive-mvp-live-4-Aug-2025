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

async function fetchActionableEmails(supabase: any): Promise<{ takeAction: string[]; watch: string[] }> {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: actionEmails } = await supabase
      .from('ceo_emails')
      .select('sender_name, subject, classification_reason, keyword_matches')
      .eq('classification', 'take_action')
      .gte('received_at', yesterday)
      .order('received_at', { ascending: false })
      .limit(10);

    const { data: watchEmails } = await supabase
      .from('ceo_emails')
      .select('sender_name, subject, classification_reason')
      .eq('classification', 'investigate')
      .gte('received_at', yesterday)
      .order('received_at', { ascending: false })
      .limit(10);

    const takeAction = (actionEmails || []).map((m: any) => {
      const keywords = m.keyword_matches?.length ? ` [${m.keyword_matches.join(', ')}]` : '';
      return `⚡ ${m.sender_name} — ${m.subject}${keywords}`;
    });

    const watch = (watchEmails || []).map((m: any) =>
      `👁 ${m.sender_name} — ${m.subject}`,
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
      .select('title, priority, created_at')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!tasks?.length) return ['No open tasks'];
    return tasks.map((t: any) => `[${t.priority.toUpperCase()}] ${t.title}`);
  } catch {
    return ['Tasks unavailable'];
  }
}

async function fetchOpenRisks(supabase: any): Promise<string[]> {
  try {
    const { data: risks } = await supabase
      .from('ceo_risks')
      .select('title, severity')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!risks?.length) return ['No open risks'];
    return risks.map((r: any) => `[${r.severity.toUpperCase()}] ${r.title}`);
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

function getProjectUpdates(): string[] {
  return [
    'KTPH Investigator Study — proposed (Dr Daniel Lee)',
    'SCRS Engagement — proposed (Singapore Cancer Registry Society)',
    'Temasek Research Partnership — proposed',
    'SMILES Multi-Centre Study — proposed (Prof Lawrence Ho)',
  ];
}

/* ---------- briefing assembly ---------- */

interface BriefingSection {
  heading: string;
  items: string[];
}

function buildBriefingText(date: string, sections: BriefingSection[]): string {
  let text = `Daily Executive Briefing\nDate: ${date}\n`;
  for (const s of sections) {
    text += `\n${s.heading}\n`;
    for (const item of s.items) {
      text += `• ${item}\n`;
    }
  }
  return text;
}

function buildBriefingHtml(date: string, sections: BriefingSection[]): string {
  let html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">`;
  html += `<h2 style="color:#0A385A;border-bottom:2px solid #0F766E;padding-bottom:8px;">Daily Executive Briefing</h2>`;
  html += `<p style="color:#666;font-size:14px;">Date: ${date}</p>`;
  for (const s of sections) {
    html += `<h3 style="color:#0F766E;margin-top:20px;">${s.heading}</h3><ul style="color:#333;font-size:14px;line-height:1.6;">`;
    for (const item of s.items) {
      html += `<li>${item}</li>`;
    }
    html += `</ul>`;
  }
  html += `<hr style="margin-top:24px;border:none;border-top:1px solid #ddd;"/>`;
  html += `<p style="color:#999;font-size:12px;">COLONAiVE CEO Cockpit — Automated Daily Briefing</p></div>`;
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

    // TODAY (Execute) — take_action emails
    if (actionableEmails) {
      sections.push({ heading: 'TODAY — Execute Now', items: actionableEmails.takeAction });
      sections.push({ heading: 'WATCH — Monitor', items: actionableEmails.watch });
    } else {
      sections.push({ heading: 'Inbox Highlights', items: inbox });
    }

    sections.push({ heading: 'Open Tasks', items: tasks });
    sections.push({ heading: 'Open Risks', items: risks });
    sections.push({ heading: 'CRC Intelligence', items: crc });
    sections.push({ heading: 'Regulatory Status', items: getRegulatoryStatus() });
    sections.push({ heading: 'Clinical & Project Updates', items: getProjectUpdates() });

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
    const emailSubject = `ColonAiVE Daily Executive Briefing — ${dateStr}`;
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
