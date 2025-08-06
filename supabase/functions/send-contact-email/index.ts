// supabase/functions/send-contact-email/index.ts
import { Resend } from 'resend';

// Define explicit CORS headers for Netlify production site
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://1colonaive-mvp-live4aug2025.netlify.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, authorization, x-client-info, apikey",
  "Access-Control-Max-Age": "86400"
};

console.log('✅ "send-contact-email" function initialized');

import { serve } from 'std/server';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, subject, message } = await req.json();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: 'Project COLONAiVE <noreply@colonaive.ai>',
      to: 'team@colonaive.ai',
      subject: `[${subject}] New Contact Form Submission`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
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