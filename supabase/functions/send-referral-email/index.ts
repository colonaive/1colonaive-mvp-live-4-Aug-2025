// supabase/functions/send-referral-email/index.ts
import { Resend } from "npm:resend@1.1.0";

// Define CORS headers to allow requests from your website
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  // Respond to CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Check and initialize Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('🔑 Resend API Key check:', resendApiKey ? `${resendApiKey.substring(0, 8)}...` : 'MISSING');
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        details: 'RESEND_API_KEY missing from environment'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const resend = new Resend(resendApiKey);

    // 2. Get the data from the request sent by the frontend
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format',
        details: 'Request body must be valid JSON'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { to, referrerName, personalMessage, referralLink } = requestData;
    console.log(`📨 Processing referral email request:`, {
      to: to || 'MISSING',
      referrerName: referrerName || 'MISSING',
      hasPersonalMessage: !!personalMessage,
      referralLink: referralLink ? 'PROVIDED' : 'MISSING'
    });

    // 3. Validate that we received all the necessary data
    const missingFields = [];
    if (!to?.trim()) missingFields.push('to');
    if (!referrerName?.trim()) missingFields.push('referrerName');
    if (!referralLink?.trim()) missingFields.push('referralLink');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return new Response(JSON.stringify({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: 'All fields (to, referrerName, referralLink) are required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 4. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to.trim())) {
      console.error('❌ Invalid email format:', to);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        details: `Email address '${to}' is not valid`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 4. Create the beautiful HTML for the email body
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #002D72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">COLONAiVE</h1>
          <h2 style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">You're Invited to Join Our Movement!</h2>
          <p style="margin: 5px 0 0; font-size: 16px;">Outsmart Colorectal Cancer Together</p>
        </div>
        <div style="padding: 20px;">
          <h3 style="font-size: 20px;">Hi there,</h3>
          <p style="font-size: 16px;">
            <b>${referrerName}</b> has personally invited you to join <b>COLONAiVE</b>, Singapore's national movement to outsmart colorectal cancer through awareness, education, and early detection.
          </p>
          ${personalMessage ? `<p style="font-size: 16px; border-left: 3px solid #ccc; padding-left: 15px; font-style: italic;">${personalMessage}</p>` : ''}
          <h3 style="font-size: 20px; margin-top: 30px;">Why Join COLONAiVE?</h3>
          <ul style="font-size: 16px; line-height: 1.6;">
            <li>Learn life-saving facts about colorectal cancer prevention</li>
            <li>Access screening resources and find clinics near you</li>
            <li>Join a growing community of health-conscious Singaporeans</li>
            <li>Help spread awareness and potentially save lives</li>
            <li>Track your health journey with our interactive tools</li>
          </ul>
          <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px;">
              <b>Did you know?</b> Colorectal cancer is the #1 cancer in Singapore, but it's also one of the most preventable. With early detection, up to 90% of cases can be prevented or successfully treated.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${referralLink}" style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
              Join COLONAiVE Now
            </a>
          </div>
          <p style="text-align: center; font-size: 16px;">Together, we can change Singapore's cancer statistics, one person at a time.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
          <p>QUESTIONS? Visit us at <a href="https://www.colonaive.ai" style="color: #002D72;">colonaive.ai</a></p>
          <p>© 2025 COLONAiVE. A National Movement to Outsmart Colorectal Cancer.</p>
        </div>
      </div>
    `;

    // 5. Prepare email payload
    const emailPayload = {
      from: 'COLONAiVE <info@colonaive.ai>',
      to: [to.trim()],
      subject: `${referrerName.trim()} has invited you to join COLONAiVE™!`,
      html: html,
      reply_to: 'info@colonaive.ai',
    };

    console.log('📤 Preparing to send email via Resend...', {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      reply_to: emailPayload.reply_to,
      htmlLength: html.length
    });

    // 6. Send email via Resend
    let emailResult;
    try {
      emailResult = await resend.emails.send(emailPayload);
      console.log('📬 Raw Resend API response:', JSON.stringify(emailResult, null, 2));
    } catch (resendApiError) {
      console.error('❌ Resend API threw exception:', {
        error: resendApiError,
        message: resendApiError?.message,
        name: resendApiError?.name,
        stack: resendApiError?.stack
      });
      
      return new Response(JSON.stringify({ 
        error: 'Email service exception',
        details: resendApiError?.message || 'Unknown Resend API error'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // 7. Check for Resend API errors
    if (emailResult.error) {
      console.error('❌ Resend API returned error:', {
        error: emailResult.error,
        errorType: typeof emailResult.error,
        errorMessage: emailResult.error?.message,
        fullErrorData: JSON.stringify(emailResult.error, null, 2)
      });

      const errorMessage = emailResult.error?.message || 
                          (typeof emailResult.error === 'string' ? emailResult.error : 'Unknown Resend error');

      return new Response(JSON.stringify({ 
        error: 'Email sending failed',
        details: errorMessage,
        resendError: emailResult.error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // 8. Verify successful response
    const emailId = emailResult.data?.id || emailResult.id;
    if (!emailId) {
      console.error('❌ No email ID returned from Resend:', emailResult);
      return new Response(JSON.stringify({ 
        error: 'Email service did not confirm delivery',
        details: 'No email ID received from Resend API',
        response: emailResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('✅ Referral email sent successfully!', {
      id: emailId,
      to: to,
      referrerName: referrerName
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Referral email sent successfully',
      id: emailId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Unexpected error in function:', {
      error: error,
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    });

    return new Response(JSON.stringify({ 
      error: 'Server error',
      details: error?.message || 'Unknown error occurred'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});