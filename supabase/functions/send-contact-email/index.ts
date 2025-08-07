// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from "npm:resend@1.1.0";

console.log('✅ "send-contact-email" function initialized');

// Define CORS headers for public access
const getCorsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
  'Access-Control-Max-Age': '86400'
});

serve(async (req) => {
  const origin = req.headers.get('origin') || '*';
  const corsHeaders = getCorsHeaders(origin);

  console.log(`🌐 Request received: ${req.method} from origin: ${origin}`);

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request');
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST requests for the actual form submission
  if (req.method !== 'POST') {
    console.log(`❌ Unsupported method: ${req.method}`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('📥 Processing POST request to send-contact-email');

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

    const { fullName, email, subject, message } = requestBody;

    console.log('📋 Form data received:', {
      fullName: fullName ? '✓' : '✗',
      email: email ? '✓' : '✗',
      subject: subject ? '✓' : '✗',
      message: message ? `✓ (${message.length} chars)` : '✗'
    });

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      console.log('❌ Validation failed - missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: fullName, email, subject, message'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check for RESEND_API_KEY
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('🔑 RESEND_API_KEY present:', resendApiKey ? 'YES' : 'NO');

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

    // Map subject codes to readable names
    const subjectMap: { [key: string]: string } = {
      'general': 'General Inquiry',
      'clinical': 'Clinical Partnership',
      'media': 'Media & Press',
      'sponsorship': 'Sponsorship & CSR',
      'other': 'Other'
    };
    
    const readableSubject = subjectMap[subject] || subject;
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Singapore'
    });

    // Prepare email data
    const emailData = {
      from: 'COLONAiVE Contact Form <info@colonaive.ai>',
      to: ['info@colonaive.ai'],
      subject: `[${readableSubject}] New Contact Form Submission - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #002D72 0%, #0052CC 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">COLONAiVE™</h1>
            <h2 style="margin: 10px 0 0; font-size: 24px; font-weight: bold;">New Contact Form Message</h2>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">From ${fullName}</p>
          </div>

          <!-- Main Content -->
          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Subject Header -->
              <div style="background: linear-gradient(90deg, #002D72, #0052CC); color: white; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px;">
                <h3 style="margin: 0; font-size: 20px;">${readableSubject}</h3>
              </div>
              
              <!-- Contact Details -->
              <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #002D72;">
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #333;">${fullName}</span>
                </div><br>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${email}" style="color: #0052CC; text-decoration: none;">${email}</a>
                </div><br>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Category:</strong>
                  <span style="color: #333;">${readableSubject}</span>
                </div><br>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Date:</strong>
                  <span style="color: #333;">${currentDate}</span>
                </div>
              </div>
              
              <!-- Message Content -->
              <div style="margin: 25px 0;">
                <h4 style="color: #002D72; margin-bottom: 15px; font-size: 18px;">Message:</h4>
                <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 6px; line-height: 1.6;">
                  <p style="color: #555; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Section -->
          <div style="background: #002D72; color: white; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px;">Action Required</h3>
            <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">
              Please respond within 1-2 business days.
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Reply directly to:</strong> 
                <a href="mailto:${email}" style="color: #60A5FA; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
              This message was sent from the contact form at colonaive.ai
            </p>
          </div>
        </div>
      `,
      text: `
New Contact Form Message - COLONAiVE™

From: ${fullName}
Email: ${email}
Subject: ${readableSubject}
Date: ${currentDate}

Message:
${message}

---
Please respond within 1-2 business days.
Reply directly to ${email} to respond.

This message was sent from the contact form at colonaive.ai
      `.trim(),
      reply_to: email // This allows direct reply to the person who sent the message
    };

    console.log('📧 Email data prepared:', {
      from: emailData.from,
      to: emailData.to[0],
      subject: emailData.subject,
      replyTo: emailData.reply_to
    });

    console.log('🚀 Sending email via Resend API...');

    let response;
    try {
      response = await resend.emails.send(emailData);
      console.log('📬 Resend API response received');
    } catch (sendError) {
      console.error('❌ Error during resend.emails.send():', sendError);
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
      message: 'Contact email sent successfully',
      id: response.data.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Unexpected error in send-contact-email function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});