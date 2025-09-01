// src/services/crcNewsFeedService.ts
// Minimal stub so dailyNewsFetch.ts compiles and runs.
// Replace the TODO section with your real fetch logic when ready.

export type Article = {
  id: string;
  title: string;
  url: string;
  publishedAt: string; // ISO 8601
  source?: string;
  summary?: string;
};

// Named export (and default) so either import style works.
export async function crcNewsFeedService(): Promise<Article[]> {
  // TODO: pull latest CRC research/news here, e.g. fetch from RSS/HTTP
  // Return an empty list for now — keeps build green.
  return [];
}

export default crcNewsFeedService;
