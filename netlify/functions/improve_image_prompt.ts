// @ts-nocheck
/**
 * Improve Image Prompt — Netlify Function
 *
 * Input (POST):  { prompt: string, style?: string }
 * Output:        { success: true, improved_prompt: string }
 *
 * Uses OpenAI GPT-4o-mini to enhance a basic image prompt into a
 * detailed, professional prompt for medical/healthcare image generation.
 */

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { prompt, style } = body;
  if (!prompt || typeof prompt !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };
  }

  const styleContext = style
    ? `The image should follow this style: "${style}".`
    : '';

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert image prompt engineer for medical and healthcare LinkedIn content. Given a basic image description, transform it into a detailed, professional prompt that will produce a stunning, LinkedIn-ready image. Focus on:
- Clean, modern medical illustration style
- Appropriate color palettes (teal, navy, white, clinical tones)
- No text overlays, no faces, no photos of real people
- Abstract scientific or medical aesthetics
- Professional corporate healthcare feel
- Suitable for LinkedIn posts about colorectal cancer screening awareness
${styleContext}
Return ONLY the improved prompt text, nothing else. Keep it under 200 words.`,
          },
          {
            role: 'user',
            content: `Improve this image prompt: "${prompt.slice(0, 500)}"`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenAI prompt improvement failed:', res.status, errText);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Prompt improvement failed' }),
      };
    }

    const data = await res.json();
    const improved = data?.choices?.[0]?.message?.content?.trim();

    if (!improved) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No improved prompt returned' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, improved_prompt: improved }),
    };
  } catch (e: any) {
    console.error('Prompt improvement error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e?.message || 'Internal error' }),
    };
  }
}
