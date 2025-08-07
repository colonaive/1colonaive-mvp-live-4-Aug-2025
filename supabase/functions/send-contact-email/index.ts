// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.1.0';

const allowedOrigins = [
  'https://1colonaive-mvp-live4aug2025.netlify.app',
  'https://www.colonaive.ai'
];

console.log('✅ "send-contact-email" function initialized');

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://1colonaive-mvp-live4aug2025.netlify.app"; // fallback for safety
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization'
      }
    });
  }
  
  // Handle POST request
  if (req.method === 'POST') {
    try {
      console.log('📥 Received POST request to send-contact-email');
      
      // Check authorization
      const authHeader = req.headers.get('Authorization');
      const expectedAuth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlya2ZybHZkZGt5aml6dXZyaXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMDA5NTMsImV4cCI6MjA0MDU3Njk1M30.5uYcn2_wJhtLkHTKZcaU4dGs2FZ67kYiVUDUb1yI6Lc';
      if (!authHeader || authHeader !== expectedAuth) {
        return new Response("Unauthorized", { status: 401 });
      }
      
      const { fullName, name, email, subject, message } = await req.json();
      
      // Use fullName if available, otherwise fall back to name
      const senderName = fullName || name;
      
      console.log('📋 Form data received:', {
        senderName: senderName ? '✓' : '✗',
        email: email ? '✓' : '✗',
        subject: subject ? '✓' : '✗',
        message: message ? message.length + ' chars' : '✗'
      });
      
      if (!senderName || !email || !subject || !message) {
        console.log('❌ Validation failed - missing required fields');
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields: fullName/name, email, subject, message'
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('📧 Initializing Resend...');
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      console.log('📤 Sending email...');
      const response = await resend.emails.send({
        from: 'Project COLONAiVE <noreply@colonaive.ai>',
        to: 'info@colonaive.ai',
        subject: `[${subject}] New Contact Form Submission - ${senderName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${senderName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Message:</h3>
              <div style="background-color: #f1f5f9; padding: 15px; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              This email was sent from the COLONAiVE contact form.<br>
              Reply directly to this email to respond to ${senderName} at ${email}
            </p>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${senderName}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the COLONAiVE contact form.
Reply directly to this email to respond to ${senderName} at ${email}
        `
      });
      
      if (response.error) {
        console.error('❌ Resend API error:', response.error);
        return new Response(JSON.stringify({
          success: false,
          error: `Email service error: ${response.error.message}`
        }), {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('✅ Email sent successfully:', response.data?.id);
      
      return new Response(JSON.stringify({
        success: true,
        messageId: response.data?.id,
        message: 'Email sent successfully'
      }), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
          'Content-Type': 'application/json'
        }
      });
      
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred'
      }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
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
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Content-Type': 'application/json'
    }
  });
});