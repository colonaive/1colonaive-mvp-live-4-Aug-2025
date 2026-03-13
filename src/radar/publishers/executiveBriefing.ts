/**
 * Executive Briefing Generator — produces daily CRC intelligence briefing
 */

export interface DailyBriefing {
  date: string;
  top_signal: {
    title: string;
    headline: string;
    radar_score: number;
    link: string;
    key_finding: string;
  } | null;
  top_trial: {
    trial_id: string;
    title: string;
    status: string;
    link: string;
  } | null;
  top_policy: {
    country: string;
    policy_title: string;
    source_link: string;
  } | null;
  full_briefing: string;
}

export async function generateExecutiveBriefing(
  signals: Array<{ title: string; headline?: string; radar_score: number; link: string; key_finding?: string; created_at: string }>,
  trials: Array<{ trial_id: string; title: string; status: string; link: string; created_at: string }>,
  policies: Array<{ country: string; policy_title: string; source_link: string; created_at: string }>,
  openaiKey?: string
): Promise<DailyBriefing> {
  const today = new Date().toISOString().split('T')[0];

  // Sort by radar_score descending, take top signal
  const topSignal = signals.sort((a, b) => b.radar_score - a.radar_score)[0] || null;
  const topTrial = trials[0] || null;
  const topPolicy = policies[0] || null;

  let fullBriefing = '';

  if (openaiKey && (topSignal || topTrial || topPolicy)) {
    try {
      const context = [
        topSignal ? `TOP RESEARCH: "${topSignal.title}" (Score: ${topSignal.radar_score}) — ${topSignal.key_finding || 'N/A'}` : '',
        topTrial ? `TOP TRIAL: "${topTrial.title}" (${topTrial.status}) — ${topTrial.link}` : '',
        topPolicy ? `TOP POLICY: ${topPolicy.country} — "${topPolicy.policy_title}"` : '',
      ].filter(Boolean).join('\n\n');

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: 'You are an executive intelligence analyst. Write a concise 3-paragraph morning briefing for a CEO who leads a colorectal cancer screening movement. Cover: (1) top research signal and its strategic implication, (2) clinical trial landscape update, (3) policy or regulatory developments. Keep it under 200 words. Be direct and actionable.',
            },
            { role: 'user', content: `Today's intelligence for ${today}:\n\n${context}` },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        fullBriefing = data.choices?.[0]?.message?.content?.trim() || '';
      }
    } catch {
      // fallback below
    }
  }

  if (!fullBriefing) {
    const parts: string[] = [];
    if (topSignal) parts.push(`Research: "${topSignal.title}" scored ${topSignal.radar_score} on the radar.`);
    if (topTrial) parts.push(`Trial: "${topTrial.title}" is currently ${topTrial.status}.`);
    if (topPolicy) parts.push(`Policy: ${topPolicy.country} — "${topPolicy.policy_title}".`);
    fullBriefing = parts.join(' ') || 'No new intelligence signals today.';
  }

  return {
    date: today,
    top_signal: topSignal ? {
      title: topSignal.title,
      headline: topSignal.headline || topSignal.title,
      radar_score: topSignal.radar_score,
      link: topSignal.link,
      key_finding: topSignal.key_finding || '',
    } : null,
    top_trial: topTrial ? {
      trial_id: topTrial.trial_id,
      title: topTrial.title,
      status: topTrial.status,
      link: topTrial.link,
    } : null,
    top_policy: topPolicy ? {
      country: topPolicy.country,
      policy_title: topPolicy.policy_title,
      source_link: topPolicy.source_link,
    } : null,
    full_briefing: fullBriefing,
  };
}
