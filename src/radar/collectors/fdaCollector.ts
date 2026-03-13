/**
 * FDA Announcements Collector — fetches cancer diagnostics / liquid biopsy announcements
 */

export interface FDAResult {
  country: string;
  policy_title: string;
  description: string;
  source_link: string;
  published_at: string;
}

const FDA_RSS_URL = 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml';

const FDA_KEYWORDS = /\b(cancer diagnostics?|liquid biopsy|ctdna|colorectal|colon cancer|screening test|ivd|in vitro diagnostic|companion diagnostic)\b/i;

function extractItems(xml: string): Array<{ title: string; link: string; description: string; pubDate: string }> {
  const items: Array<{ title: string; link: string; description: string; pubDate: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const description = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim() || '';
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';

    if (title && link) {
      items.push({ title, link, description, pubDate });
    }
  }
  return items;
}

export async function collectFDA(): Promise<FDAResult[]> {
  const results: FDAResult[] = [];

  try {
    const res = await fetch(FDA_RSS_URL, {
      headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
    });
    if (!res.ok) return results;

    const xml = await res.text();
    const items = extractItems(xml);

    for (const item of items) {
      const haystack = `${item.title} ${item.description}`;
      if (!FDA_KEYWORDS.test(haystack)) continue;

      results.push({
        country: 'United States',
        policy_title: item.title,
        description: item.description.replace(/<[^>]+>/g, '').slice(0, 500),
        source_link: item.link,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      });
    }
  } catch {
    // FDA feed may be unavailable
  }

  return results;
}
