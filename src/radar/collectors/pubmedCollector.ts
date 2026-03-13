/**
 * PubMed Collector — fetches recent CRC research papers from PubMed E-utilities API
 */

export interface PubMedResult {
  title: string;
  authors: string;
  journal: string;
  publication_date: string;
  link: string;
  abstract: string;
  source: string;
}

const PUBMED_QUERIES = [
  'colorectal cancer screening',
  'ctDNA screening colorectal',
  'DNA methylation colorectal cancer',
  'liquid biopsy colorectal cancer',
];

async function searchPubMed(query: string, maxResults = 5): Promise<string[]> {
  const url =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi' +
    `?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&sort=pub+date&retmode=json`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.esearchresult?.idlist ?? [];
}

async function fetchSummaries(ids: string[]): Promise<PubMedResult[]> {
  if (!ids.length) return [];

  const url =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi' +
    `?db=pubmed&id=${ids.join(',')}&retmode=json`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
  });
  if (!res.ok) return [];
  const data = await res.json();

  // Also fetch abstracts
  const abstractUrl =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi' +
    `?db=pubmed&id=${ids.join(',')}&retmode=xml&rettype=abstract`;
  let abstractMap: Record<string, string> = {};
  try {
    const absRes = await fetch(abstractUrl, {
      headers: { 'User-Agent': 'COLONAiVE/RadarCollector' },
    });
    if (absRes.ok) {
      const xml = await absRes.text();
      // Simple XML extraction for abstracts
      const articles = xml.split('<PubmedArticle>');
      for (const article of articles) {
        const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
        const abstractMatch = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
        if (pmidMatch?.[1] && abstractMatch?.[1]) {
          abstractMap[pmidMatch[1]] = abstractMatch[1].replace(/<[^>]+>/g, '').trim();
        }
      }
    }
  } catch {
    // abstracts are optional enrichment
  }

  return ids
    .map((id) => {
      const meta = data?.result?.[id];
      if (!meta?.title) return null;

      const authors = Array.isArray(meta.authors)
        ? meta.authors.map((a: { name?: string }) => a?.name).filter(Boolean).join(', ')
        : '';

      return {
        title: meta.title,
        authors,
        journal: meta.fulljournalname || meta.source || '',
        publication_date: meta.pubdate || meta.epubdate || new Date().toISOString(),
        link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        abstract: abstractMap[id] || '',
        source: 'PubMed',
      };
    })
    .filter(Boolean) as PubMedResult[];
}

export async function collectPubMed(): Promise<PubMedResult[]> {
  const allIds = new Set<string>();

  for (const query of PUBMED_QUERIES) {
    const ids = await searchPubMed(query, 5);
    ids.forEach((id) => allIds.add(id));
  }

  return fetchSummaries([...allIds]);
}
