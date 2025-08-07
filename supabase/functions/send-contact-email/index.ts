// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.1.0';

const allowedOrigins = [
  'https://1colonaive-mvp-live4aug2025.netlify.app',
  'https://www.colonaive.ai',
  'http://localhost:3000',
  'http://localhost:5173'
];

console.log('✅ "send-contact-email" function initialized');

// CORS headers helper
const getCorsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://1colonaive-mvp-live4aug2025.netlify.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
  'Access-Control-Max-Age': '86400'
});

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
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
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set');
      }
      
      const resend = new Resend(resendApiKey);
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
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr>
          <p><small>Sent from COLONAiVE Contact Form</small></p>
        `,
        text: `
New Contact Form Submission

Name: ${senderName}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from COLONAiVE Contact Form
        `
      });
      
      if (response.error) {
        throw new Error(`Resend API error: ${response.error.message}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        messageId: response.data?.id,
        message: 'Email sent successfully'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
      
    } catch (error) {
      console.error('Error sending email:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
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
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
});