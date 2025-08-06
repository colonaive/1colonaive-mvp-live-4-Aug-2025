# CORS Fix for Contact Form - Deployment Instructions

## 🚨 Issue Fixed
The contact form was failing due to CORS (Cross-Origin Resource Sharing) errors when calling the Supabase Edge Function from the Netlify production domain.

## 🔧 Changes Made

### Updated `supabase/functions/send-contact-email/index.ts`

**Before:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
```

**After:**
```typescript
// Define allowed origins for CORS
const allowedOrigins = [
  'https://1colonaive-mvp-live4aug2025.netlify.app',
  'https://colonaive.ai',
  'https://www.colonaive.ai',
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative dev server
];

// Dynamic CORS headers based on request origin
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
```

### Key Improvements:
✅ **Explicit Domain Allowlist**: Only allows specific trusted domains  
✅ **Production Domain**: `https://1colonaive-mvp-live4aug2025.netlify.app`  
✅ **Future Domains**: `colonaive.ai` and `www.colonaive.ai`  
✅ **Development Support**: Local development servers  
✅ **Enhanced Headers**: Added Supabase-specific headers and credentials support  
✅ **Debug Logging**: Added console logs to troubleshoot CORS issues  

## 🚀 Deployment Steps

### 1. Deploy the Updated Function
```bash
cd "C:\Users\M Chandramohan\OneDrive\1Project COLONAiVE\1colonaive-mvp-live 4 Aug 2025"
supabase functions deploy send-contact-email
```

### 2. Verify Environment Variables
Make sure these are still set in Supabase:
```bash
supabase secrets list
```

If `RESEND_API_KEY` is not set:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 3. Test from Production
1. Go to: https://1colonaive-mvp-live4aug2025.netlify.app/contact
2. Fill out the contact form
3. Submit and check:
   - Browser console for any errors
   - `info@colonaive.ai` inbox for the email
   - Supabase Edge Function logs for success messages

## 🔍 Debugging CORS Issues

### Check Browser Console
Look for these error messages:
- ❌ `Access to fetch blocked by CORS policy`
- ❌ `Origin not allowed by Access-Control-Allow-Origin`
- ✅ `✅ Contact form email sent successfully!`

### Check Supabase Logs
In Supabase Dashboard → Edge Functions → send-contact-email → Logs:
```
✅ "send-contact-email" function initialized
🌐 Request from origin: https://1colonaive-mvp-live4aug2025.netlify.app
✅ CORS headers set for: https://1colonaive-mvp-live4aug2025.netlify.app
🔄 Handling CORS preflight request (if OPTIONS request)
📨 Received contact form submission from: [Name] <[Email]>
🎉 Contact email sent successfully!
```

### Common Solutions

1. **Function Not Deployed**:
   ```bash
   supabase functions deploy send-contact-email
   ```

2. **Wrong Domain in Allowlist**:
   - Check the exact Netlify URL matches what's in `allowedOrigins`
   - Make sure there are no trailing slashes or typos

3. **API Key Issues**:
   ```bash
   supabase secrets set RESEND_API_KEY=your_actual_api_key
   ```

4. **Caching Issues**:
   - Clear browser cache
   - Try incognito/private browsing mode
   - Wait a few minutes for edge function deployment

## 🧪 Testing Checklist

- [ ] Deploy function: `supabase functions deploy send-contact-email`
- [ ] Verify secrets: `supabase secrets list`
- [ ] Test form submission from: https://1colonaive-mvp-live4aug2025.netlify.app/contact
- [ ] Check browser console for success message
- [ ] Check `info@colonaive.ai` for received email
- [ ] Check Supabase function logs for execution details

## 📝 Next Steps

If the CORS issue persists after deployment:

1. **Check Exact Domain**: Ensure the Netlify URL in the allowlist matches exactly
2. **Add Wildcard Support**: If needed, can add `*.netlify.app` to allow any Netlify domain
3. **Verify Function Deployment**: Check Supabase dashboard to confirm function is deployed
4. **Test with Postman**: Use Postman to test the function directly and isolate frontend issues

The CORS fix should resolve the contact form issues! 🎉