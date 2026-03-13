// @ts-nocheck
/**
 * LinkedIn OAuth Callback — Netlify Function
 *
 * Handles the OAuth 2.0 authorization code exchange.
 *
 * Flow:
 *   1. User authorizes at LinkedIn → redirected here with ?code=AUTH_CODE
 *   2. This function exchanges the code for an access token
 *   3. Fetches the user's profile to get their person URN
 *   4. Displays the token and URN for the admin to copy into Netlify env vars
 *
 * Required env vars:
 *   LINKEDIN_CLIENT_ID      — from LinkedIn Developer App
 *   LINKEDIN_CLIENT_SECRET   — from LinkedIn Developer App
 *
 * Redirect URL (must match LinkedIn app config):
 *   https://colonaive.ai/.netlify/functions/linkedin_callback
 */

const REDIRECT_URI = 'https://colonaive.ai/.netlify/functions/linkedin_callback';

export async function handler(event: any) {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;
  const errorDescription = event.queryStringParameters?.error_description;

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  // Handle LinkedIn error response
  if (error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Authorization Failed', `
        <p class="error">LinkedIn returned an error: <strong>${escapeHtml(error)}</strong></p>
        ${errorDescription ? `<p>${escapeHtml(errorDescription)}</p>` : ''}
        <p>Please try again or check your LinkedIn Developer App settings.</p>
      `),
    };
  }

  // If no code, show the authorization start page
  if (!code) {
    if (!clientId) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: renderPage('Configuration Required', `
          <p class="error">LINKEDIN_CLIENT_ID is not set in environment variables.</p>
          <p>Set it in Netlify Dashboard → Environment Variables, then redeploy.</p>
        `),
      };
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_liteprofile%20w_member_social`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Connect LinkedIn', `
        <p>Click the button below to authorize the COLONAiVE Cockpit to publish posts on your behalf.</p>
        <a href="${authUrl}" class="btn">Authorize with LinkedIn</a>
        <p class="note">You will be redirected to LinkedIn to grant permission, then returned here with your access token.</p>
      `),
    };
  }

  // Exchange authorization code for access token
  if (!clientId || !clientSecret) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Configuration Required', `
        <p class="error">LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in environment variables.</p>
      `),
    };
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('LinkedIn token exchange failed:', tokenRes.status, errText);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: renderPage('Token Exchange Failed', `
          <p class="error">LinkedIn rejected the authorization code.</p>
          <p>Status: ${tokenRes.status}</p>
          <p>This usually means the code has expired (codes are valid for 30 seconds). Try authorizing again.</p>
        `),
      };
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // seconds

    // Step 2: Fetch profile to get person URN
    let personUrn = '(could not retrieve — set manually)';
    let displayName = '';
    try {
      const profileRes = await fetch('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        personUrn = `urn:li:person:${profile.id}`;
        displayName = `${profile.localizedFirstName || ''} ${profile.localizedLastName || ''}`.trim();
      }
    } catch (profileErr) {
      console.error('Profile fetch failed:', profileErr);
    }

    const expiryDays = Math.round((expiresIn || 5184000) / 86400);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('LinkedIn Connected', `
        <p class="success">Authorization successful${displayName ? ` for <strong>${escapeHtml(displayName)}</strong>` : ''}.</p>

        <h3>Your Credentials</h3>
        <p>Copy these values into <strong>Netlify → Environment Variables</strong>, then trigger a redeploy.</p>

        <div class="credential">
          <label>LINKEDIN_ACCESS_TOKEN</label>
          <input type="text" value="${escapeHtml(accessToken)}" readonly onclick="this.select()" />
        </div>

        <div class="credential">
          <label>LINKEDIN_PERSON_URN</label>
          <input type="text" value="${escapeHtml(personUrn)}" readonly onclick="this.select()" />
        </div>

        <p class="note">Token expires in ~${expiryDays} days. Re-authorize before expiry to maintain publishing access.</p>

        <h3>Next Steps</h3>
        <ol>
          <li>Copy the values above</li>
          <li>Go to Netlify Dashboard → Site Settings → Environment Variables</li>
          <li>Add/update LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN</li>
          <li>Trigger a redeploy</li>
          <li>Return to the <a href="/admin/linkedin-intelligence">LinkedIn Intelligence</a> page and publish a post</li>
        </ol>
      `),
    };
  } catch (err: any) {
    console.error('LinkedIn callback error:', err?.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Error', `
        <p class="error">An unexpected error occurred during the authorization process.</p>
        <p>${escapeHtml(err?.message || 'Unknown error')}</p>
      `),
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPage(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — COLONAiVE LinkedIn Integration</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .container { max-width: 600px; width: 100%; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 1.5rem; color: #0A385A; margin-bottom: 0.5rem; }
    h3 { font-size: 1rem; color: #0A385A; margin: 1.5rem 0 0.75rem; }
    p { margin-bottom: 0.75rem; line-height: 1.6; font-size: 0.95rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #0F766E; }
    .logo span { font-weight: 700; color: #0A385A; font-size: 1.1rem; }
    .success { color: #059669; background: #ecfdf5; padding: 0.75rem 1rem; border-radius: 8px; border-left: 4px solid #059669; }
    .error { color: #dc2626; background: #fef2f2; padding: 0.75rem 1rem; border-radius: 8px; border-left: 4px solid #dc2626; }
    .note { color: #64748b; font-size: 0.85rem; font-style: italic; }
    .credential { margin-bottom: 1rem; }
    .credential label { display: block; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .credential input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace; font-size: 0.85rem; background: #f8fafc; cursor: pointer; }
    .credential input:focus { outline: 2px solid #0F766E; border-color: transparent; }
    .btn { display: inline-block; background: #0077B5; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; margin: 0.5rem 0; }
    .btn:hover { background: #006097; }
    ol { padding-left: 1.5rem; margin-bottom: 1rem; }
    ol li { margin-bottom: 0.5rem; font-size: 0.9rem; line-height: 1.5; }
    a { color: #0077B5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span>COLONAiVE</span>
      <span style="color: #64748b; font-weight: 400; font-size: 0.85rem;">LinkedIn Integration</span>
    </div>
    <h1>${title}</h1>
    ${content}
  </div>
</body>
</html>`;
}
