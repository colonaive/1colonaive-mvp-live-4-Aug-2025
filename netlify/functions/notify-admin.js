// netlify/functions/notify-admin.js
// Uses SendGrid to send email invites/notifications
// Env vars you must set in Netlify → Site settings → Environment variables:
//   SENDGRID_API_KEY = <your SendGrid API key>
//   SENDGRID_FROM    = info@colonaive.ai   (or another verified sender)

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { to, subject, html, text } = JSON.parse(event.body || "{}");

    if (!to || !subject || (!html && !text)) {
      return { statusCode: 400, body: "Missing to/subject/body" };
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.SENDGRID_FROM || "info@colonaive.ai";

    if (!apiKey) {
      return { statusCode: 500, body: "SENDGRID_API_KEY not set" };
    }

    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: "COLONAiVE" },
        subject,
        content: [
          html ? { type: "text/html", value: html } : null,
          text ? { type: "text/plain", value: text } : null,
        ].filter(Boolean),
      }),
    });

    if (!resp.ok) {
      const msg = await resp.text();
      return { statusCode: 502, body: `SendGrid error: ${msg}` };
    }

    return { statusCode: 200, body: "Sent" };
  } catch (e) {
    return { statusCode: 500, body: String(e) };
  }
}
