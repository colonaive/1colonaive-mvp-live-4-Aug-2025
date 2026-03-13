/**
 * AI Research Summarizer — generates structured intelligence summaries from research signals
 */

export interface ResearchSummary {
  headline: string;
  key_finding: string;
  strategic_relevance: string;
  public_summary: string;
}

export async function summarizeResearch(
  title: string,
  abstract: string,
  openaiKey: string
): Promise<ResearchSummary> {
  if (!openaiKey || !abstract) {
    return fallbackSummary(title, abstract);
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
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a medical intelligence analyst for a colorectal cancer screening movement. Analyze research papers and produce structured intelligence summaries. Return a JSON object with exactly these fields:
- "headline": A compelling 1-line headline (max 120 chars)
- "key_finding": The core scientific finding in 1-2 sentences
- "strategic_relevance": How this impacts CRC screening strategy, industry positioning, or public health (1-2 sentences)
- "public_summary": A plain-language explanation suitable for public awareness (2-3 sentences, no jargon)

Keep all outputs neutral, evidence-based, and never overstate claims.`,
          },
          {
            role: 'user',
            content: `Title: ${title}\n\nAbstract: ${abstract.slice(0, 3000)}`,
          },
        ],
      }),
    });

    if (!res.ok) return fallbackSummary(title, abstract);

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallbackSummary(title, abstract);

    const parsed = JSON.parse(content);
    return {
      headline: parsed.headline || title,
      key_finding: parsed.key_finding || '',
      strategic_relevance: parsed.strategic_relevance || '',
      public_summary: parsed.public_summary || '',
    };
  } catch {
    return fallbackSummary(title, abstract);
  }
}

function fallbackSummary(title: string, abstract: string): ResearchSummary {
  const snippet = (abstract || '').split(/[.\n]/).slice(0, 2).join('. ').trim();
  return {
    headline: title,
    key_finding: snippet || 'See original publication for details.',
    strategic_relevance: 'Relevance assessment pending AI analysis.',
    public_summary: snippet || 'A new colorectal cancer research publication. Open the source for full details.',
  };
}
