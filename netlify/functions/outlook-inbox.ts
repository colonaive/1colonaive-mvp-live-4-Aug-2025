import fetch from "node-fetch";

const tenant = process.env.OUTLOOK_TENANT_ID;
const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;

function stripHtml(html: string): string {
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function extractPreview(body: { content?: string; contentType?: string } | undefined, maxLen = 200): string {
    if (!body?.content) return "";
    const text = body.contentType === "html" ? stripHtml(body.content) : body.content;
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

    const params = new URLSearchParams();
    params.append("client_id", clientId || "");
    params.append("client_secret", clientSecret || "");
    params.append("scope", "https://graph.microsoft.com/.default");
    params.append("grant_type", "client_credentials");

    const res = await fetch(url, {
        method: "POST",
        body: params
    });

    const data: any = await res.json();
    return data.access_token;
}

export async function handler() {
    const token = await getAccessToken();

    const mailbox = "admin@saversmed.com";

    const fields = "$select=id,subject,from,receivedDateTime,isRead,bodyPreview,body";
    const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${mailbox}/messages?$top=10&${fields}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data: any = await res.json();
    const messages: any[] = data.value || [];

    const cleaned = messages.map((m: any) => ({
        id: m.id,
        sender: m.from?.emailAddress?.name || m.from?.emailAddress?.address || "Unknown",
        subject: m.subject || "(no subject)",
        receivedDateTime: m.receivedDateTime,
        isRead: m.isRead ?? true,
        preview: m.bodyPreview || extractPreview(m.body),
    }));

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: cleaned })
    };
}
