export const handler = async (event: any) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const payload = JSON.parse(event.body);
        const { type, name, email, role, message, organisation, whatsapp, company, csrFocus, employeeCount, preferredState, city, state } = payload;

        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
        }

        // Determine email content based on type
        let subject = '';
        let htmlContent = '';

        if (type === 'partner') {
            subject = `[COLONAiVE India] New Partner Lead: ${name || email}`;
            htmlContent = `
        <h2>New India Partner Interest</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${role || 'N/A'}</p>
        <p><strong>Organisation:</strong> ${organisation || 'N/A'}</p>
        <p><strong>City/State:</strong> ${city || 'N/A'}, ${state || 'N/A'}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
      `;
        } else if (type === 'csr') {
            subject = `[COLONAiVE India] New CSR Lead: ${company || name || email}`;
            htmlContent = `
        <h2>New India CSR Interest</h2>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Contact Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Employee Count:</strong> ${employeeCount || 'N/A'}</p>
        <p><strong>CSR Focus:</strong> ${csrFocus || 'N/A'}</p>
        <p><strong>Preferred State(s):</strong> ${preferredState || 'N/A'}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
      `;
        } else if (type === 'join') {
            subject = `[COLONAiVE India] New Public Pledge: ${name || email}`;
            htmlContent = `
        <h2>New India Public Member Pledge</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
      `;
        } else {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid lead type' }) };
        }

        // Use SMTP environment variables
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
            console.error("Missing SMTP configuration for nodemailer.");
            // If no SMTP configured, we just return success in local/dev to not block the UI, 
            // but in production it means the email wasn't sent.
            return { statusCode: 200, body: JSON.stringify({ ok: true, note: "simulated success, no SMTP" }) };
        }

        const nodemailer = await import('nodemailer'); // dynamic import
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: parseInt(SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"COLONAiVE Portal" <${SMTP_FROM}>`,
            to: 'admin@savermed.com',
            subject,
            html: htmlContent,
        });

        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (error: any) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};
