// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.1.0';
const allowedOrigins = [
  'https://1colonaive-mvp-live4aug2025.netlify.app',
  'https://www.colonaive.ai'
];
console.log('✅ "send-contact-email" function initialized');
serve(async (req)=>{
  const origin = req.headers.get('origin') || '';
  const allowOrigin = allowedOrigins.includes(origin)
  ? origin
  : "https://1colonaive-mvp-live4aug2025.netlify.app"; // fallback for safety
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { fullName, name, email, subject, message } = await req.json();
      // Use fullName if available, otherwise fall back to name
      const senderName = fullName || name;
      if (!senderName || !email || !subject || !message) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields: fullName/name, email, subject, message'
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          }
        });
      }
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      const response = await resend.emails.send({
        from: 'Project COLONAiVE <noreply@colonaive.ai>',
        to: 'info@colonaive.ai',
        subject: `[${subject}] New Contact Form Submission`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${senderName}
          Email: ${email}
          Subject: ${subject}
          
          Message:
          ${message}
        `
      });
      return new Response(JSON.stringify({
        success: true,
        messageId: response.data?.id
      }), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        }
      });
    }
  }
  // Handle unsupported methods
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed'
  }), {
    status: 405,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }
  });
});
