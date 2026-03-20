// @ts-nocheck
//
// Email Intelligence Ingestion — CTW-COCKPIT-02D.1
//
// Fetches emails from Microsoft Graph, stores in ceo_emails,
// classifies each email, and extracts tasks + risks.
//
// Endpoints:
//   POST / (or scheduled) → full ingest cycle
//   GET ?action=status    → ingestion stats
//   GET ?action=actionable → classified take_action + investigate emails (last 24h)

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

/* ---------- Classification keywords ---------- */

const TAKE_ACTION_KEYWORDS = [
  'ups', 'shipment', 'customs', 'clearance', 'recall', 'cold chain',
  'urgent', 'action required', 'immediate', 'deadline', 'overdue',
  'payment due', 'invoice', 'approval needed', 'sign', 'signature required',
  'expiry', 'expiring', 'renewal', 'compliance', 'violation',
  'hsa', 'cdsco', 'fda', 'nmpa', 'regulatory',
];

const INVESTIGATE_KEYWORDS = [
  'follow up', 'follow-up', 'pending', 'awaiting', 'update',
  'proposal', 'quote', 'quotation', 'contract', 'agreement',
  'meeting', 'schedule', 'confirm', 'review', 'feedback',
  'lab result', 'validation', 'clinical', 'trial', 'study',
  'singlera', 'angsana', 'ktph', 'colonaiq',
];

const IGNORE_KEYWORDS = [
  'unsubscribe', 'newsletter', 'no-reply', 'noreply', 'donotreply',
  'promotional', 'marketing', 'survey', 'feedback request',
  'out of office', 'auto-reply', 'autoreply', 'automatic reply',
];

/* ---------- UPS / Logistics critical keywords ---------- */

const LOGISTICS_CRITICAL_KEYWORDS = [
  'ups', 'shipment', 'customs', 'clearance', 'recall', 'cold chain',
  'dhl', 'fedex', 'freight', 'cargo', 'import permit', 'export',
  'temperature excursion', 'delivery failed', 'held at customs',
];

/* ---------- Helpers ---------- */

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

async function getAccessToken(): Promise<string> {
  const tenant = process.env.OUTLOOK_TENANT_ID;
  const clientId = process.env.OUTLOOK_CLIENT_ID;
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
  if (!tenant || !clientId || !clientSecret) {
    throw new Error('Outlook credentials not configured');
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('grant_type', 'client_credentials');

  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    { method: 'POST', body: params },
  );
  const data: any = await res.json();
  if (!data.access_token) throw new Error('Outlook auth failed');
  return data.access_token;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- Classification engine ---------- */

interface ClassificationResult {
  classification: 'take_action' | 'investigate' | 'informational' | 'ignore';
  reason: string;
  keywordMatches: string[];
}

function classifyEmail(subject: string, bodyPreview: string, senderEmail: string): ClassificationResult {
  const text = `${subject} ${bodyPreview} ${senderEmail}`.toLowerCase();
  const matchedKeywords: string[] = [];

  // Check ignore first (newsletters, auto-replies)
  for (const kw of IGNORE_KEYWORDS) {
    if (text.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }
  if (matchedKeywords.length > 0) {
    return {
      classification: 'ignore',
      reason: `Auto-detected: ${matchedKeywords.join(', ')}`,
      keywordMatches: matchedKeywords,
    };
  }

  // Check logistics/critical keywords (always take_action)
  const logisticsMatches: string[] = [];
  for (const kw of LOGISTICS_CRITICAL_KEYWORDS) {
    if (text.includes(kw)) {
      logisticsMatches.push(kw);
    }
  }
  if (logisticsMatches.length > 0) {
    return {
      classification: 'take_action',
      reason: `Logistics/critical: ${logisticsMatches.join(', ')}`,
      keywordMatches: logisticsMatches,
    };
  }

  // Check take_action keywords
  const actionMatches: string[] = [];
  for (const kw of TAKE_ACTION_KEYWORDS) {
    if (text.includes(kw)) {
      actionMatches.push(kw);
    }
  }
  if (actionMatches.length >= 1) {
    return {
      classification: 'take_action',
      reason: `Action required: ${actionMatches.join(', ')}`,
      keywordMatches: actionMatches,
    };
  }

  // Check investigate keywords
  const investigateMatches: string[] = [];
  for (const kw of INVESTIGATE_KEYWORDS) {
    if (text.includes(kw)) {
      investigateMatches.push(kw);
    }
  }
  if (investigateMatches.length >= 1) {
    return {
      classification: 'investigate',
      reason: `Needs review: ${investigateMatches.join(', ')}`,
      keywordMatches: investigateMatches,
    };
  }

  // Default: informational
  return {
    classification: 'informational',
    reason: 'No action keywords detected',
    keywordMatches: [],
  };
}

/* ---------- Task & Risk extraction ---------- */

function extractTaskFromEmail(
  emailId: string,
  subject: string,
  classification: ClassificationResult,
): { title: string; description: string; priority: string } | null {
  if (classification.classification !== 'take_action') return null;

  const isLogistics = classification.keywordMatches.some((kw) =>
    LOGISTICS_CRITICAL_KEYWORDS.includes(kw),
  );

  return {
    title: subject,
    description: `Auto-extracted from email. ${classification.reason}`,
    priority: isLogistics ? 'critical' : 'high',
  };
}

function extractRiskFromEmail(
  emailId: string,
  subject: string,
  classification: ClassificationResult,
): { title: string; description: string; severity: string } | null {
  // Only create risks for logistics/critical or regulatory matches
  const riskKeywords = ['recall', 'customs', 'clearance', 'cold chain', 'violation',
    'expiry', 'expiring', 'compliance', 'regulatory', 'temperature excursion',
    'delivery failed', 'held at customs'];

  const hasRiskKeyword = classification.keywordMatches.some((kw) =>
    riskKeywords.includes(kw),
  );

  if (!hasRiskKeyword) return null;

  const isCritical = classification.keywordMatches.some((kw) =>
    ['recall', 'cold chain', 'temperature excursion', 'violation'].includes(kw),
  );

  return {
    title: `Risk: ${subject}`,
    description: `Auto-detected risk from email. Matched: ${classification.keywordMatches.join(', ')}`,
    severity: isCritical ? 'critical' : 'high',
  };
}

/* ---------- Main ingestion ---------- */

async function ingestEmails(supabase: any) {
  const token = await getAccessToken();
  const mailbox = 'admin@saversmed.com';

  // Fetch last 24 hours of emails — no artificial limit
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const filter = `receivedDateTime ge ${yesterday.toISOString()}`;

  const fields = '$select=id,subject,from,receivedDateTime,isRead,bodyPreview,body';
  const url = `https://graph.microsoft.com/v1.0/users/${mailbox}/messages?$top=50&${fields}&$filter=${encodeURIComponent(filter)}&$orderby=receivedDateTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data: any = await res.json();
  const messages: any[] = data.value || [];

  let ingested = 0;
  let actionable = 0;
  let tasksCreated = 0;
  let risksCreated = 0;

  for (const m of messages) {
    const graphId = m.id;
    const senderEmail = m.from?.emailAddress?.address || '';
    const senderName = m.from?.emailAddress?.name || senderEmail;
    const subject = m.subject || '(no subject)';
    const bodyPreview = m.bodyPreview || '';
    const receivedAt = m.receivedDateTime;
    const isRead = m.isRead ?? true;

    // Skip if already ingested
    const { data: existing } = await supabase
      .from('ceo_emails')
      .select('id')
      .eq('graph_id', graphId)
      .limit(1);

    if (existing && existing.length > 0) continue;

    // Classify
    const classification = classifyEmail(subject, bodyPreview, senderEmail);

    // Insert email
    const { data: inserted, error: insertError } = await supabase
      .from('ceo_emails')
      .insert({
        graph_id: graphId,
        sender_name: senderName,
        sender_email: senderEmail,
        subject,
        body_preview: bodyPreview.slice(0, 500),
        received_at: receivedAt,
        is_read: isRead,
        classification: classification.classification,
        classification_reason: classification.reason,
        keyword_matches: classification.keywordMatches,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(`Failed to insert email ${graphId}:`, insertError.message);
      continue;
    }

    ingested++;

    if (classification.classification === 'take_action' || classification.classification === 'investigate') {
      actionable++;
    }

    const emailId = inserted.id;

    // Extract task
    const task = extractTaskFromEmail(emailId, subject, classification);
    if (task) {
      const { error: taskError } = await supabase.from('ceo_tasks').insert({
        source_type: 'email',
        source_id: emailId,
        title: task.title,
        description: task.description,
        priority: task.priority,
      });
      if (!taskError) tasksCreated++;
    }

    // Extract risk
    const risk = extractRiskFromEmail(emailId, subject, classification);
    if (risk) {
      const { error: riskError } = await supabase.from('ceo_risks').insert({
        source_type: 'email',
        source_id: emailId,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
      });
      if (!riskError) risksCreated++;
    }
  }

  return {
    totalFetched: messages.length,
    ingested,
    actionable,
    tasksCreated,
    risksCreated,
  };
}

/* ---------- Handler ---------- */

export async function handler(event: any) {
  const action = event.queryStringParameters?.action;

  const headers = { 'Content-Type': 'application/json' };

  // Status endpoint
  if (action === 'status') {
    try {
      const supabase = getSupabase();
      const { count: totalEmails } = await supabase
        .from('ceo_emails')
        .select('*', { count: 'exact', head: true });

      const { count: actionCount } = await supabase
        .from('ceo_emails')
        .select('*', { count: 'exact', head: true })
        .in('classification', ['take_action', 'investigate']);

      const { count: openTasks } = await supabase
        .from('ceo_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      const { count: openRisks } = await supabase
        .from('ceo_risks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ totalEmails, actionCount, openTasks, openRisks }),
      };
    } catch (e: any) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e?.message }) };
    }
  }

  // Actionable emails endpoint (for briefing consumption)
  if (action === 'actionable') {
    try {
      const supabase = getSupabase();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: takeAction } = await supabase
        .from('ceo_emails')
        .select('*')
        .eq('classification', 'take_action')
        .gte('received_at', yesterday)
        .order('received_at', { ascending: false });

      const { data: investigate } = await supabase
        .from('ceo_emails')
        .select('*')
        .eq('classification', 'investigate')
        .gte('received_at', yesterday)
        .order('received_at', { ascending: false });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          takeAction: takeAction || [],
          investigate: investigate || [],
        }),
      };
    } catch (e: any) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e?.message }) };
    }
  }

  // Ingest endpoint (POST or scheduled)
  try {
    const supabase = getSupabase();
    const result = await ingestEmails(supabase);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, ...result }),
    };
  } catch (e: any) {
    console.error('Email ingest error:', e?.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: e?.message }),
    };
  }
}
