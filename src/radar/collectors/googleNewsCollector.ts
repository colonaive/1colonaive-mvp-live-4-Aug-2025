/**
 * Google News RSS Collector — fetches CRC-related media mentions
 */

// We use a lightweight approach: fetch RSS XML and parse manually (no rss-parser dep in frontend)
export interface GoogleNewsResult {
  title: string;
  publication: string;
  link: string;
  summary: string;
  published_at: string;
}

const NEWS_KEYWORDS = [
  'colorectal cancer screening',
  'blood test colorectal cancer',
  'liquid biopsy colorectal cancer',
];

function extractItems(xml: string): Array<{ title: string; link: string; pubDate: string; source: string }> {
  const items: Array<{ title: string; link: string; pubDate: string; source: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim() || 'Google News';

    if (title && link) {
      items.push({ title, link, pubDate, source });
    }
  }
  return items;
}

export async function collectGoogleNews(): Promise<GoogleNewsResult[]> {
  const results: GoogleNewsResult[] = [];
  const seenLinks = new Set<string>();

  for (const keyword of NEWS_KEYWORDS) {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=en&gl=US&ceid=US:en`;
      const res = await fetch(rssUrl, {
        headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
      });
      if (!res.ok) continue;

      const xml = await res.text();
      const items = extractItems(xml).slice(0, 8);

      for (const item of items) {
        if (seenLinks.has(item.link)) continue;
        seenLinks.add(item.link);

        results.push({
          title: item.title,
          publication: item.source,
          link: item.link,
          summary: '',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        });
      }
    } catch {
      continue;
    }
  }

  return results;
}
