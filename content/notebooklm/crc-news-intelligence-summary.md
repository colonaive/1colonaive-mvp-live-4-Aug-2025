# CRC News Intelligence NotebookLM Summary

## Scope
The CRC News Intelligence system is an automated workflow that monitors colorectal cancer research and translates relevant developments into usable internal content for the COLONAiVE movement.

## Workflow
The pipeline begins with scheduled collection. A Netlify function named `fetch_crc_news` runs every five minutes and pulls colorectal cancer related items from RSS feeds and PubMed into the Supabase `crc_news_feed` table. The CEO Cockpit then retrieves the most relevant items through `list_crc_news` and presents them with source information, summaries, and suggested downstream actions. Supporting templates in `agent/skills/crc-news-intelligence.md` help convert those items into LinkedIn drafts, clinic bulletins, and patient education snippets.

## Editorial Guardrails
All downstream content must remain clinically accurate and non-promotional. ColonAiQ should be described as a screening test rather than a diagnostic tool. Positive results do not establish a diagnosis, and negative results do not exclude colorectal cancer. Research summaries should stay educational, use encouraging but restrained language, cite their sources clearly, and reinforce the two-step pathway of screening followed by colonoscopy when clinically indicated.

## Key Context for Generated Content
ColonAiQ uses multi-gene methylation PCR detection, with five markers in Singapore and China and a six-marker configuration planned for India and Europe. Published evidence reports approximately 86% sensitivity and 92% specificity for colorectal cancer detection in the Gastroenterology 2021 study, and postoperative recurrence risk stratification was reported in JAMA Oncology in 2023. Within Singapore, the broader strategic aim is to improve screening participation through the COLONAiVE movement.

## Integration Points
The news feed is stored in Supabase, surfaced in the CEO Cockpit, and used by the CRC News Intelligence skill to create derivative content. NotebookLM uses this summary as a compact orientation document rather than as a standalone source of evidence.
