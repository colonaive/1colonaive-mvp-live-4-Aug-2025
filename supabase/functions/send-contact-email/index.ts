// supabase/functions/send-contact-email/index.ts
import { Resend } from "npm:resend@1.1.0";

// Define allowed origins for CORS
const allowedOrigins = [
  'https://1colonaive-mvp-live4aug2025.netlify.app',
  'https://colonaive.ai',
  'https://www.colonaive.ai',
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative dev server
];

// Function to get CORS headers based on request origin
function getCorsHeaders(origin: string | null) {
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

console.log('✅ "send-contact-email" function initialized');

Deno.serve(async (req) => {
  // Get the origin from the request headers
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  console.log(`🌐 Request from origin: ${origin || 'null'}`);
  console.log(`✅ CORS headers set for: ${corsHeaders['Access-Control-Allow-Origin']}`);
  
  // Respond to CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Resend with the secret API key from your Supabase secrets
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // 2. Get the data from the request sent by the frontend
    const { fullName, email, subject, message } = await req.json();
    console.log(`📨 Received contact form submission from: ${fullName} <${email}>`);

    // 3. Validate that we received all the necessary data
    if (!fullName || !email || !subject || !message) {
      throw new Error("Missing required fields: 'fullName', 'email', 'subject', or 'message'");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

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

    // 4. Create the beautiful HTML for the email body
    const html = `
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
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #333;">${fullName}</span>
                </div>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${email}" style="color: #0052CC; text-decoration: none;">${email}</a>
                </div>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Category:</strong>
                  <span style="color: #333;">${readableSubject}</span>
                </div>
                <div>
                  <strong style="color: #002D72; display: inline-block; width: 120px;">Date:</strong>
                  <span style="color: #333;">${currentDate}</span>
                </div>
              </div>
            </div>
            
            <!-- Message Content -->
            <div style="margin: 25px 0;">
              <h4 style="color: #002D72; margin-bottom: 15px; font-size: 18px;">Message:</h4>
              <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 6px; line-height: 1.6;">
                <p style="color: #555; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <!-- Priority Badge -->
            ${subject === 'media' ? `
            <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #DC2626; font-weight: bold; text-align: center;">
                🚨 MEDIA INQUIRY - Priority Response Required (Same Day)
              </p>
            </div>
            ` : ''}

          </div>
        </div>

        <!-- Action Section -->
        <div style="background: #002D72; color: white; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px;">Action Required</h3>
          <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">
            ${getResponseTimeMessage(subject)}
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
    `;

    // Plain text version for email clients that don't support HTML
    const textContent = `
New Contact Form Message - COLONAiVE™

From: ${fullName}
Email: ${email}
Subject: ${readableSubject}
Date: ${currentDate}

Message:
${message}

---
${getResponseTimeMessage(subject)}
Reply directly to ${email} to respond.

This message was sent from the contact form at colonaive.ai
    `.trim();

    // 5. Use the Resend SDK to send the email
    const { data, error } = await resend.emails.send({
      from: 'COLONAiVE Contact Form <info@colonaive.ai>',
      to: ['info@colonaive.ai'],
      subject: `New Contact Message: ${readableSubject} - ${fullName}`,
      html: html,
      text: textContent,
      reply_to: email, // This allows direct reply to the person who sent the message
    });

    if (error) {
      console.error('Resend Error:', error);
      throw error;
    }
    
    console.log('🎉 Contact email sent successfully!', data);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Contact email sent successfully',
      id: data?.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-contact-email function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Helper function to get response time message based on subject
function getResponseTimeMessage(subject: string): string {
  const responseMap: { [key: string]: string } = {
    'general': 'Please respond within 1-2 business days.',
    'clinical': 'Clinical partnerships require response within 3-5 business days.',
    'media': 'URGENT: Media requests require same-day response.',
    'sponsorship': 'Sponsorship inquiries should be responded to within 2-3 business days.',
    'other': 'Please respond within 1-2 business days.'
  };
  
  return responseMap[subject] || 'Please respond within 1-2 business days.';
}