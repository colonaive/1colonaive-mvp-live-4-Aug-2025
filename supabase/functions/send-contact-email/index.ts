// Supabase Edge Function - Contact Form Email Handler
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.1.0';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://www.colonaive.ai',
  'https://1colonaive-mvp-live4aug2025.netlify.app'
];

// Subject shortcode mapping
const SUBJECT_MAP: Record<string, string> = {
  'general': 'General Inquiry',
  'media': 'Media Inquiry',
  'partnership': 'Partnership Inquiry',
  'clinical': 'Clinical Collaboration',
  'research': 'Research Collaboration',
  'support': 'Technical Support',
  'feedback': 'Feedback & Suggestions'
};

// Get response time message based on subject
function getResponseTimeMessage(subject: string): string {
  const responseMap: Record<string, string> = {
    'general': 'We typically respond to general inquiries within 1-2 business days.',
    'media': 'Media inquiries are prioritized and typically receive responses within 4-6 hours during business hours.',
    'partnership': 'Partnership inquiries are reviewed by our business development team and typically receive responses within 2-3 business days.',
    'clinical': 'Clinical collaboration inquiries are reviewed by our medical team and typically receive responses within 3-5 business days.',
    'research': 'Research collaboration inquiries are reviewed by our research team and typically receive responses within 3-5 business days.',
    'support': 'Technical support requests are typically responded to within 4-8 hours during business hours.',
    'feedback': 'We appreciate your feedback and typically respond within 1-2 business days.'
  };
  
  return responseMap[subject] || responseMap['general'];
}

// CORS headers helper
function getCorsHeaders(origin: string) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[1]; // Default to Netlify domain

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
    'Access-Control-Max-Age': '86400'
  };
}

// Main edge function handler
serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log(`❌ Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const { fullName, email, subject, message } = await req.json();
    
    console.log('📥 Received contact form data:', {
      fullName: fullName || '[not provided]',
      email: email || '[not provided]',
      subject: subject || '[not provided]',
      messageLength: message ? message.length : 0
    });

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      console.log('❌ Validation failed: Missing required fields');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: fullName, email, subject, message'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable not found');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service configuration error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Map subject to readable format
    const readableSubject = SUBJECT_MAP[subject] || subject;
    const responseTimeMessage = getResponseTimeMessage(subject);

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Prepare email content
    const emailSubject = `New Contact Message: ${readableSubject} - ${fullName}`;
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COLONAiVE Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">COLONAiVE Contact Form</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Message Received</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h2>
                <p style="margin: 8px 0;"><strong>Name:</strong> ${fullName}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>Subject:</strong> ${readableSubject}</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">Message</h2>
                <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
                </div>
            </div>

            <!-- Response Information -->
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #155724; font-size: 14px;">
                    <strong>📋 Response Information:</strong><br>
                    ${responseTimeMessage}
                </p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0; font-size: 12px; color: #6c757d; text-align: center;">
                    This email was sent from the COLONAiVE contact form.<br>
                    Reply directly to respond to ${fullName} at ${email}
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;

    const textBody = `
COLONAiVE Contact Form - New Message Received

Contact Details:
Name: ${fullName}
Email: ${email}
Subject: ${readableSubject}

Message:
${message}

Response Information:
${responseTimeMessage}

---
This email was sent from the COLONAiVE contact form.
Reply directly to respond to ${fullName} at ${email}
    `.trim();

    // Send email
    console.log('📤 Sending email via Resend...');
    const response = await resend.emails.send({
      from: 'COLONAiVE Contact Form <info@colonaive.ai>',
      to: 'info@colonaive.ai',
      replyTo: email,
      subject: emailSubject,
      html: htmlBody,
      text: textBody
    });

    if (response.error) {
      console.error('❌ Resend API error:', response.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Email service error: ${response.error.message}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Email sent successfully:', {
      id: response.data?.id,
      to: 'info@colonaive.ai',
      subject: readableSubject
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact email sent successfully',
        id: response.data?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});