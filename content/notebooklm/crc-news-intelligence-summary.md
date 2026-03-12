# CRC News Intelligence — NotebookLM Summary

## What This Covers

The CRC News Intelligence system is an automated pipeline that monitors, curates, and translates colorectal cancer research news into actionable content for the COLONAiVE movement and ColonAiQ marketing.

## How It Works

1. **Automated Collection**: A scheduled Netlify function (`fetch_crc_news`) runs every 5 minutes, pulling CRC-related articles from RSS feeds and PubMed into a Supabase `crc_news_feed` table.

2. **Cockpit Display**: The CEO Cockpit fetches the top 5 most relevant articles via `list_crc_news` and displays them with source, summary, and suggested marketing actions.

3. **Content Generation**: The CRC News Intelligence agent skill (`agent/skills/crc-news-intelligence.md`) provides templates for translating research news into LinkedIn posts, clinic bulletins, and patient education snippets.

## Editorial Rules

All content generated from CRC news must follow strict editorial guardrails:

- **No diagnostic claims**: ColonAiQ is a screening test, not a diagnostic tool
- **IFU compliance**: Positive results do not equal diagnosis; negative results do not rule out CRC
- **No promotional language**: Research summaries educate, they do not sell
- **Patient empowerment**: Use encouraging language focused on early detection benefits
- **Source attribution**: Every claim must reference its published source
- **Screening advocacy**: Always reinforce the 2-step model (blood test + colonoscopy follow-up)

## Content Output Types

| Type | Audience | Purpose |
|------|----------|---------|
| LinkedIn post draft | HCPs, corporate wellness | Professional engagement, thought leadership |
| Clinic email bulletin | GP clinics, specialists | Monthly research digest with practical implications |
| Patient education snippet | General public | Plain-language screening awareness content |

## Key Data Points for Context

- ColonAiQ uses multi-gene methylation PCR detection (5 markers in Singapore/China, 6 markers for India/EU)
- Clinical evidence: ~86% sensitivity / 92% specificity for CRC detection (Gastroenterology 2021)
- Postoperative recurrence risk stratification published in JAMA Oncology 2023
- Singapore target: increase national CRC screening uptake through the COLONAiVE movement

## Integration Points

- News feed stored in Supabase `crc_news_feed` table
- CEO Cockpit displays latest 5 items with relevance scoring
- Agent skill generates marketing content from high-relevance items
- NotebookLM ingests this summary for broader knowledge context
