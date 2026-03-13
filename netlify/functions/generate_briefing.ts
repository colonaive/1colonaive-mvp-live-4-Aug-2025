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
import sgMail from '@sendgrid/mail';

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

/* ---------- email sender ---------- */

async function sendBriefingEmail(subject: string, text: string, html: string): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM || 'info@colonaive.ai';
  const to = process.env.EXEC_BRIEFING_TO || 'admin@saversmed.com';

  if (!apiKey) {
    console.error('SENDGRID_API_KEY not set — cannot send briefing email');
    return false;
  }

  if (!from) {
    console.error('SENDGRID_FROM not set — cannot send briefing email');
    return false;
  }

  console.log(`Sending briefing email to: ${to}, from: ${from}`);

  try {
    sgMail.setApiKey(apiKey);

    const msg = {
      to,
      from: { email: from, name: 'COLONAiVE' },
      subject,
      text,
      html,
    };

    const [response] = await sgMail.send(msg);
    console.log(`SendGrid response status: ${response.statusCode}`);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('Briefing email sent successfully');
      return true;
    }

    console.error(`SendGrid unexpected status: ${response.statusCode}`);
    return false;
  } catch (e: any) {
    console.error('SendGrid email error:', e?.message);
    if (e?.response?.body) {
      console.error('SendGrid error body:', JSON.stringify(e.response.body));
    }
    return false;
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

    const [inbox, crc] = await Promise.all([
      fetchInboxHighlights(),
      fetchCRCHighlights(supabase),
    ]);

    const sections: BriefingSection[] = [
      { heading: 'Inbox Highlights', items: inbox },
      { heading: 'CRC Intelligence', items: crc },
      { heading: 'Regulatory Status', items: getRegulatoryStatus() },
      { heading: 'Clinical & Project Updates', items: getProjectUpdates() },
    ];

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
    const emailSent = await sendBriefingEmail(emailSubject, content, html);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        date: dateISO,
        emailSent,
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
