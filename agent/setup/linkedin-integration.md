# LinkedIn Developer Integration — COLONAiVE Cockpit Publisher

> Setup guide for enabling direct LinkedIn publishing from the CEO Cockpit LinkedIn Intelligence page.

---

## Step 1 — Create LinkedIn Developer Application

Go to: https://www.linkedin.com/developers/apps

Click **Create App** and fill in:

| Field | Value |
|-------|-------|
| **App name** | COLONAiVE Cockpit Publisher |
| **LinkedIn Page** | Project COLONAiVE™ |
| **App logo** | Use existing COLONAiVE logo (`public/colonaive-logo.png`) |
| **Privacy policy URL** | https://colonaive.com/privacy |
| **Terms of service URL** | https://colonaive.com/terms |

### Request Products & Permissions

After creating the app, go to the **Products** tab and request:

- **Share on LinkedIn** (grants `w_member_social`)
- **Sign In with LinkedIn using OpenID Connect** (grants `r_liteprofile`, `openid`, `email`)

Then go to the **Auth** tab and verify these **OAuth 2.0 scopes** are available:

- `r_liteprofile`
- `w_member_social`
- `r_organization_social` (if publishing as organization page)
- `w_organization_social` (if publishing as organization page)

### Set Redirect URL

In the **Auth** tab under **Authorized redirect URLs for your app**, add:

```
https://colonaive.ai/.netlify/functions/linkedin_callback
```

### Record Credentials

From the **Auth** tab, copy:

- **Client ID** → `LINKEDIN_CLIENT_ID`
- **Client Secret** → `LINKEDIN_CLIENT_SECRET`

---

## Step 2 — Obtain Access Token (One-Time OAuth Flow)

### 2a. Generate Authorization URL

Open this URL in your browser (replace `YOUR_CLIENT_ID`):

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=https://colonaive.ai/.netlify/functions/linkedin_callback&scope=r_liteprofile%20w_member_social
```

### 2b. Authorize the App

- Log in with the LinkedIn account that will publish posts
- Click **Allow** to grant permissions
- LinkedIn redirects to the callback URL with an authorization `code` parameter
- The `linkedin_callback` function exchanges this code for an access token and displays it

### 2c. Copy the Access Token

The callback page will display the access token. Copy it — this is your `LINKEDIN_ACCESS_TOKEN`.

### 2d. Get Your Person URN

The callback also returns your LinkedIn member ID. Your person URN is:

```
urn:li:person:YOUR_MEMBER_ID
```

This is your `LINKEDIN_PERSON_URN`.

---

## Step 3 — Set Environment Variables

### Netlify Dashboard

Go to: **Netlify → Project Settings → Environment Variables**

Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `LINKEDIN_CLIENT_ID` | (from Step 1) | LinkedIn app Client ID |
| `LINKEDIN_CLIENT_SECRET` | (from Step 1) | LinkedIn app Client Secret |
| `LINKEDIN_ACCESS_TOKEN` | (from Step 2c) | OAuth 2.0 bearer token |
| `LINKEDIN_PERSON_URN` | (from Step 2d) | e.g. `urn:li:person:XXXXX` |

### Local Development (optional)

Add to `.env.local`:

```
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_PERSON_URN=
```

---

## Step 4 — Netlify Functions

Two serverless functions handle the LinkedIn integration:

### `linkedin_callback` (OAuth token exchange)

- **Path:** `netlify/functions/linkedin_callback.ts`
- **Purpose:** Receives authorization code from LinkedIn, exchanges it for an access token
- **Endpoint:** `GET /.netlify/functions/linkedin_callback?code=AUTH_CODE`
- **Flow:** Authorization code → POST to LinkedIn token endpoint → returns access token + member profile

### `linkedin_publish` (Post publishing)

- **Path:** `netlify/functions/linkedin_publish.ts`
- **Purpose:** Publishes posts to LinkedIn via UGC API
- **Endpoint:** `POST /.netlify/functions/linkedin_publish`
- **Input:** `{ post_id, text, article_url?, image_url? }`
- **API:** `POST https://api.linkedin.com/v2/ugcPosts`
- **Headers:** `Authorization: Bearer LINKEDIN_ACCESS_TOKEN`
- **On success:** Updates `linkedin_posts` table with `status=posted`, `posted_at`, `linkedin_url`

---

## Step 5 — Test Workflow

1. Open CEO Cockpit → LinkedIn Intelligence (`/admin/linkedin-intelligence`)
2. Click **Generate From CRC News** to create post drafts
3. Select a post → edit title, content, hashtags in the editor
4. Click the image button to generate a DALL-E 3 image
5. Review the live preview panel
6. Click **Publish to LinkedIn**
7. Verify the post appears on your LinkedIn feed
8. Confirm the post status updates to "posted" in the cockpit
9. Confirm `linkedin_url` is stored in Supabase `linkedin_posts` table

---

## Token Refresh

LinkedIn access tokens expire after **60 days**. When a token expires:

1. Repeat Step 2 (OAuth authorization flow) to get a new token
2. Update `LINKEDIN_ACCESS_TOKEN` in Netlify environment variables
3. Trigger a redeploy (or wait for next deploy)

Future improvement: implement automatic token refresh using the refresh token grant.

---

## Architecture Overview

```
CEO Cockpit UI
    │
    ├── Generate posts (linkedin_posts?action=generate)
    │       └── Scans crc_news_feed → creates linkedin_posts drafts
    │
    ├── Edit & preview (client-side, live sync)
    │
    ├── Generate image (generate_post_image)
    │       └── DALL-E 3 → stores image_url
    │
    └── Publish (linkedin_publish)
            ├── POST → LinkedIn UGC API
            └── Update linkedin_posts (status, posted_at, linkedin_url)
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "LinkedIn credentials not configured" | Set `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` in Netlify env vars |
| 401 Unauthorized from LinkedIn API | Token expired — re-authorize via OAuth flow |
| 403 Forbidden | App doesn't have `w_member_social` scope — check Products tab |
| Post not appearing on LinkedIn | Check Netlify function logs for API response details |
