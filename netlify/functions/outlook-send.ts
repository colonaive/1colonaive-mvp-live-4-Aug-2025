// @ts-nocheck
// Netlify Function: Send email via Microsoft Graph API
// Uses the same Outlook client credentials as outlook-inbox.ts
// Logs all sent emails to Supabase email_activity table.

import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const tenant = process.env.OUTLOOK_TENANT_ID;
const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", clientId || "");
  params.append("client_secret", clientSecret || "");
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const res = await fetch(url, { method: "POST", body: params });
  const data = await res.json();
  return data.access_token;
}

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { to, cc, subject, body: emailBody, context_source } = payload;

  if (!to || !subject || !emailBody) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields: to, subject, body" }),
    };
  }

  const mailbox = "admin@saversmed.com";

  // Build recipients
  const toRecipients = to.split(",").map((addr) => ({
    emailAddress: { address: addr.trim() },
  }));

  const ccRecipients = cc
    ? cc.split(",").map((addr) => ({
        emailAddress: { address: addr.trim() },
      }))
    : [];

  const message = {
    message: {
      subject,
      body: {
        contentType: "HTML",
        content: emailBody.replace(/\n/g, "<br>"),
      },
      toRecipients,
      ...(ccRecipients.length > 0 ? { ccRecipients } : {}),
    },
  };

  // Send via Microsoft Graph
  let sendSuccess = false;
  let sendError = null;

  try {
    const token = await getAccessToken();

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${mailbox}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    );

    if (res.status === 202 || res.status === 200) {
      sendSuccess = true;
    } else {
      const errorData = await res.json().catch(() => ({}));
      sendError = errorData.error?.message || `HTTP ${res.status}`;
    }
  } catch (err) {
    sendError = err instanceof Error ? err.message : "Unknown send error";
  }

  // Log to Supabase email_activity table
  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  await supabase.from("email_activity").insert({
    direction: "outbound",
    to_address: to,
    cc_address: cc || null,
    subject,
    body: emailBody,
    status: sendSuccess ? "sent" : "failed",
    context_source: context_source || "ceo-cockpit",
    sent_at: sendSuccess ? now : null,
    created_at: now,
  });

  if (!sendSuccess) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: sendError }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      message: `Email sent to ${to}`,
      sent_at: now,
    }),
  };
}
