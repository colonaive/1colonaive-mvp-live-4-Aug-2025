// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.1.0';

console.log('✅ COLONAiVE Contact Email Function - Initialized');

// CORS headers for frontend requests
const getCorsHeaders = (origin?: string) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
  'Access-Control-Max-Age': '86400'
});

serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  console.log(`🌐 ${req.method} request from: ${origin || 'unknown'}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed. Use POST.'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON format'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const { fullName, email, subject, message } = body;

    // Server-side validation
    const missingFields = [];
    if (!fullName?.trim()) missingFields.push('fullName');
    if (!email?.trim()) missingFields.push('email');
    if (!subject?.trim()) missingFields.push('subject');
    if (!message?.trim()) missingFields.push('message');

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields.join(', '));
      return new Response(JSON.stringify({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('❌ Invalid email format:', email);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get Resend API key from Supabase secrets
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('🔑 Resend API Key check:', resendApiKey ? 'Found' : 'Missing');
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found in environment');
      return new Response(JSON.stringify({
        success: false,
        error: 'Email service not configured'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`📨 Processing contact form: ${fullName} <${email}>, Subject: ${subject}`);
    
    // Test Resend API key format
    console.log('🔑 Resend API key format check:', {
      hasKey: !!resendApiKey,
      keyPrefix: resendApiKey ? resendApiKey.substring(0, 8) + '...' : 'none',
      keyLength: resendApiKey ? resendApiKey.length : 0
    });

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Subject mapping for professional display
    const subjectMap: Record<string, string> = {
      'general': 'General Inquiry',
      'clinical': 'Clinical Partnership',
      'media': 'Media & Press',
      'sponsorship': 'Sponsorship & CSR',
      'other': 'Other'
    };

    const displaySubject = subjectMap[subject] || subject;
    const timestamp = new Date().toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create professional HTML email
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>COLONAiVE Contact Form</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">COLONAiVE™</h1>
            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Contact Form Submission</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            
            <!-- Priority Badge -->
            ${subject === 'media' ? `
            <div style="background-color: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center;">
              <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 16px;">🚨 URGENT: Media Inquiry - Same Day Response Required</p>
            </div>
            ` : ''}
            
            <!-- Subject Header -->
            <div style="background: linear-gradient(90deg, #1e3a8a, #3b82f6); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="margin: 0; font-size: 24px;">${displaySubject}</h2>
              <p style="margin: 5px 0 0; opacity: 0.9;">New message from ${fullName}</p>
            </div>
            
            <!-- Contact Details -->
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 25px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #374151;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">Category:</td>
                  <td style="padding: 8px 0; color: #374151;">${displaySubject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">Submitted:</td>
                  <td style="padding: 8px 0; color: #374151;">${timestamp}</td>
                </tr>
              </table>
            </div>
            
            <!-- Message -->
            <div style="margin: 30px 0;">
              <h3 style="color: #1e3a8a; margin-bottom: 15px; font-size: 20px;">Message:</h3>
              <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px;">
                <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1e3a8a; color: white; padding: 30px; text-align: center;">
            <h3 style="margin: 0 0 15px; font-size: 20px;">Action Required</h3>
            <p style="margin: 0 0 20px; opacity: 0.9;">
              ${getResponseTimeMessage(subject)}
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">
                <strong>Reply directly to:</strong><br>
                <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none; font-size: 18px;">${email}</a>
              </p>
            </div>
            
            <p style="margin: 20px 0 0; font-size: 12px; opacity: 0.8;">
              Sent from COLONAiVE Contact Form • colonaive.ai
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textEmail = `
COLONAiVE™ Contact Form Submission

${subject === 'media' ? '🚨 URGENT: Media Inquiry - Same Day Response Required\n\n' : ''}

Category: ${displaySubject}
From: ${fullName}
Email: ${email}
Submitted: ${timestamp}

Message:
${message}

---
${getResponseTimeMessage(subject)}

Reply directly to: ${email}

Sent from COLONAiVE Contact Form
colonaive.ai
    `.trim();

    // Send email via Resend
    console.log('📤 Sending email via Resend...');
    
    const emailPayload = {
      from: 'COLONAiVE Contact Form <onboarding@resend.dev>',
      to: ['info@colonaive.ai'],
      subject: `[${displaySubject}] ${fullName} - New Contact Message`,
      html: htmlEmail,
      text: textEmail,
      reply_to: email
    };
    
    console.log('📧 Email payload:', {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      reply_to: emailPayload.reply_to,
      hasHtml: !!emailPayload.html,
      hasText: !!emailPayload.text
    });
    
    let emailResult;
    try {
      emailResult = await resend.emails.send(emailPayload);
    } catch (resendError) {
      console.error('❌ Resend API call threw exception:', {
        error: resendError,
        errorMessage: resendError?.message,
        errorName: resendError?.name,
        errorStack: resendError?.stack
      });
      
      return new Response(JSON.stringify({
        success: false,
        error: `Resend API exception: ${resendError?.message || 'Unknown error'}`
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('📧 Resend response:', {
      success: !emailResult.error,
      id: emailResult.data?.id,
      error: emailResult.error?.message
    });

    if (emailResult.error) {
      console.error('❌ Resend API error details:', {
        error: emailResult.error,
        errorType: typeof emailResult.error,
        errorMessage: emailResult.error?.message,
        fullError: JSON.stringify(emailResult.error)
      });
      
      const errorMsg = emailResult.error?.message || 
                       (typeof emailResult.error === 'string' ? emailResult.error : 'Unknown Resend API error');
      
      return new Response(JSON.stringify({
        success: false,
        error: `Email service error: ${errorMsg}`
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (!emailResult.data?.id) {
      console.error('❌ No email ID returned from Resend');
      return new Response(JSON.stringify({
        success: false,
        error: 'Email service did not confirm delivery'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`✅ Email sent successfully! ID: ${emailResult.data.id}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact email sent successfully',
      id: emailResult.data.id
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(JSON.stringify({
      success: false,
      error: `Server error: ${errorMessage}`
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

// Helper function for response time messages
function getResponseTimeMessage(subject: string): string {
  const messages: Record<string, string> = {
    'general': 'Please respond within 1-2 business days.',
    'clinical': 'Clinical partnerships require response within 3-5 business days.',
    'media': 'URGENT: Media requests require same-day response.',
    'sponsorship': 'Sponsorship inquiries should be responded to within 2-3 business days.',
    'other': 'Please respond within 1-2 business days.'
  };
  
  return messages[subject] || 'Please respond within 1-2 business days.';
}