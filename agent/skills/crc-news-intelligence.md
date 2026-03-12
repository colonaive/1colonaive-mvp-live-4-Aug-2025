# CRC News Intelligence Skill

## Purpose

Analyze colorectal cancer research news and translate findings into actionable marketing, education, and campaign content for COLONAiVE and ColonAiQ.

## Responsibilities

- Monitor and analyze CRC research news from the `crc_news_feed` pipeline
- Identify screening-related breakthroughs and developments
- Generate patient-friendly summaries that comply with IFU guardrails
- Suggest marketing campaigns tied to research developments
- Flag news items relevant to specific markets (Singapore, India, Philippines)

## Inputs

- CRC news feed items from `/.netlify/functions/list_crc_news`
- Knowledge base from `agent/knowledge/crc-news-intelligence.md`
- Editorial rules from `agent/knowledge/colonaiq-marketing.md`

## Outputs

### LinkedIn Post Draft

- Professional tone targeting healthcare professionals and corporate wellness leaders
- Reference the research finding with proper attribution
- Position ColonAiQ as part of the screening conversation (never as a diagnostic)
- Include call-to-action for screening awareness

### Clinic Email Bulletin

- Summary of 3–5 most relevant recent findings
- Written for GP clinics and specialist practices
- Include practical implications for patient conversations
- Maintain clinical accuracy and IFU compliance

### Patient Education Snippet

- Plain-language summary of key findings
- Emphasize the importance of screening, not specific products
- Suitable for social media, website education pages, or newsletter inclusion
- Avoid medical jargon; use empowering, non-fear-based language

## Editorial Guardrails

- Never claim ColonAiQ is diagnostic — it is a screening complement
- Never overstate sensitivity/specificity beyond published evidence
- Always encourage colonoscopy follow-up for positive results
- Negative results do not rule out CRC — always include this caveat
- No direct promotional language in patient-facing content
- Attribute all research findings to their original source
