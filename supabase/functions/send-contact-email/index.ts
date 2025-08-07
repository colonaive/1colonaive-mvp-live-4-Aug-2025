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
  
  console.log(`🌐 Request received: ${req.method} from origin: ${origin}`);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request');
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // Handle POST request
  if (req.method === 'POST') {
    try {
      console.log('📥 Received POST request to send-contact-email');
      
      // Check authorization
      const authHeader = req.headers.get('Authorization');
      console.log('🔐 Auth header present:', authHeader ? 'YES' : 'NO');
      
      const expectedAuth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlya2ZybHZkZGt5aml6dXZyaXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMDA5NTMsImV4cCI6MjA0MDU3Njk1M30.5uYcn2_wJhtLkHTKZcaU4dGs2FZ67kYiVUDUb1yI6Lc';
      
      if (!authHeader || authHeader !== expectedAuth) {
        console.log('❌ Unauthorized request - invalid or missing auth header');
        return new Response("Unauthorized", { status: 401 });
      }
      
      console.log('✅ Authorization validated');
      
      // Parse request body
      let requestBody;
      try {
        requestBody = await req.json();
        console.log('📋 Request body parsed successfully');
      } catch (parseError) {
        console.error('❌ Failed to parse request body:', parseError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const { fullName, name, email, subject, message } = requestBody;
      
      // Use fullName if available, otherwise fall back to name
      const senderName = fullName || name;
      
      console.log('📋 Form data received:', {
        senderName: senderName ? '✓' : '✗',
        email: email ? '✓' : '✗',
        subject: subject ? '✓' : '✗',
        message: message ? `✓ (${message.length} chars)` : '✗'
      });
      
      // Validate required fields
      if (!senderName || !email || !subject || !message) {
        console.log('❌ Validation failed - missing required fields');
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields: fullName/name, email, subject, message'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Check for RESEND_API_KEY
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      console.log('🔑 RESEND_API_KEY present:', resendApiKey ? 'YES' : 'NO');
      console.log('🔑 RESEND_API_KEY length:', resendApiKey ? resendApiKey.length : 0);
      console.log('🔑 RESEND_API_KEY starts with:', resendApiKey ? resendApiKey.substring(0, 7) + '...' : 'N/A');
      
      if (!resendApiKey) {
        console.error('❌ RESEND_API_KEY environment variable is not set');
        return new Response(JSON.stringify({
          success: false,
          error: 'Email service configuration error'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log('📧 Initializing Resend with API key...');
      const resend = new Resend(resendApiKey);
      
      console.log('📤 Preparing email data...');
      const emailData = {
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
        `.trim()
      };
      
      console.log('📧 Email data prepared:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        htmlLength: emailData.html.length,
        textLength: emailData.text.length
      });
      
      console.log('🚀 Sending email via Resend API...');
      
      let response;
      try {
        response = await resend.emails.send(emailData);
        console.log('📬 Resend API response received');
        console.log('📬 Response type:', typeof response);
        console.log('📬 Response keys:', Object.keys(response || {}));
        
        // Log the response safely
        if (response) {
          console.log('📬 Response.data present:', !!response.data);
          console.log('📬 Response.error present:', !!response.error);
          
          if (response.data) {
            console.log('📬 Response data:', {
              id: response.data.id,
              keys: Object.keys(response.data)
            });
          }
          
          if (response.error) {
            console.log('📬 Response error:', {
              message: response.error.message,
              name: response.error.name,
              keys: Object.keys(response.error)
            });
          }
        }
      } catch (sendError) {
        console.error('❌ Error during resend.emails.send():', sendError);
        console.error('❌ Send error type:', typeof sendError);
        console.error('❌ Send error name:', sendError.name);
        console.error('❌ Send error message:', sendError.message);
        console.error('❌ Send error stack:', sendError.stack);
        
        return new Response(JSON.stringify({
          success: false,
          error: `Email sending failed: ${sendError.message || 'Unknown error'}`
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Check for Resend API errors
      if (response && response.error) {
        console.error('❌ Resend API returned error:', response.error);
        return new Response(JSON.stringify({
          success: false,
          error: `Resend API error: ${response.error.message || 'Unknown Resend error'}`
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Check for successful response
      if (!response || !response.data) {
        console.error('❌ Resend API returned no data:', response);
        return new Response(JSON.stringify({
          success: false,
          error: 'Email service returned no data - check configuration'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log('✅ Email sent successfully:', response.data.id);
      
      return new Response(JSON.stringify({
        success: true,
        messageId: response.data.id,
        message: 'Email sent successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('❌ Unexpected error in POST handler:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Handle unsupported methods
  console.log(`❌ Unsupported method: ${req.method}`);
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed'
  }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});