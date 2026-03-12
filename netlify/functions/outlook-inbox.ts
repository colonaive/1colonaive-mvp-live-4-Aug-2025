import fetch from "node-fetch";

const tenant = process.env.OUTLOOK_TENANT_ID;
const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("scope", "https://graph.microsoft.com/.default");
    params.append("grant_type", "client_credentials");

    const res = await fetch(url, {
        method: "POST",
        body: params
    });

    const data = await res.json();
    return data.access_token;
}

export async function handler() {
    const token = await getAccessToken();

    const mailbox = "admin@saversmed.com";

    const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${mailbox}/messages?$top=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await res.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}