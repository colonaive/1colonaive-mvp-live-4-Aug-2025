/**
 * LinkedIn Post Generator — creates thought-leadership posts from high-score radar signals
 */

export interface LinkedInDraft {
  post_text: string;
  headline: string;
  supporting_link: string;
}

export async function generateLinkedInPost(
  signal: {
    title: string;
    headline?: string;
    key_finding?: string;
    strategic_relevance?: string;
    link: string;
    radar_score: number;
  },
  openaiKey: string
): Promise<LinkedInDraft> {
  if (!openaiKey) {
    return fallbackPost(signal);
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: `You write LinkedIn thought-leadership posts for a healthcare CEO who leads a colorectal cancer screening movement in Singapore.

Tone: Scientific, neutral, thought-provoking, non-promotional.
Length: 150-250 words.
Structure: Hook line → key insight → strategic reflection → call to awareness.
Include 3-5 relevant hashtags at the end.
Never promote any specific product or company. Focus on the science and the public health mission.`,
          },
          {
            role: 'user',
            content: `Write a LinkedIn post based on this research signal:
Title: ${signal.title}
Key Finding: ${signal.key_finding || 'N/A'}
Strategic Relevance: ${signal.strategic_relevance || 'N/A'}
Source: ${signal.link}`,
          },
        ],
      }),
    });

    if (!res.ok) return fallbackPost(signal);

    const data = await res.json();
    const postText = data.choices?.[0]?.message?.content?.trim();
    if (!postText) return fallbackPost(signal);

    return {
      post_text: postText,
      headline: signal.headline || signal.title,
      supporting_link: signal.link,
    };
  } catch {
    return fallbackPost(signal);
  }
}

function fallbackPost(signal: { title: string; link: string }): LinkedInDraft {
  return {
    post_text: `New research worth watching in colorectal cancer screening:\n\n"${signal.title}"\n\nEarly detection saves lives. The science continues to evolve.\n\n#ColorectalCancer #CRCScreening #EarlyDetection #PublicHealth`,
    headline: signal.title,
    supporting_link: signal.link,
  };
}
