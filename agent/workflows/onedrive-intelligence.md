# OneDrive Intelligence Workflow

## Purpose

Systematically scan, classify, and curate essential corporate documents from OneDrive into a strategic vault structure.

## Steps

### 1. Scan OneDrive Folders

- Authenticate via Microsoft Graph API
- Enumerate files across target OneDrive folders
- Record filename, path, size, modified date, file type

### 2. Classify Documents

- Apply category labels:
  - `regulatory` — HSA, CDSCO, CE IVDR, NMPA certificates and submissions
  - `contracts` — distribution agreements, NDAs, MOUs, service agreements
  - `clinical-trials` — protocols, ethics approvals, study results, lab reports
  - `investor` — term sheets, cap tables, pitch decks, valuations
  - `marketing` — brochures, presentations, campaign assets, brand guidelines
  - `government-engagement` — MOH correspondence, policy submissions, meeting notes
  - `templates` — reusable document templates

### 3. Detect Duplicates

- Hash-based comparison for exact duplicates
- Filename similarity analysis for near-duplicates
- Flag duplicates for review (do not auto-delete)

### 4. Identify Latest Versions

- Group documents by base name
- Sort by modified date
- Mark latest version as primary
- Mark older versions as candidates for archival

### 5. Propose Strategic Vault Structure

- Map classified documents to `content/strategic-vault/` subfolders
- Generate proposed folder mapping report
- Flag any documents that span multiple categories

### 6. Copy Essential Documents into Vault

- Copy (never move) latest versions of essential files
- Maintain original OneDrive location untouched
- Record source path and vault destination in manifest

### 7. Generate Cleanup Report

- List exact duplicates with recommendation to archive
- List outdated versions with recommendation to archive
- List unclassified files requiring manual review
- **No automatic deletion — all actions are recommendations only**

### 8. Generate Window Closure Record

- Save WCR to `project-memory/WCR-{timestamp}-ONEDRIVE-INTELLIGENCE.md`
- Include: files scanned, classified, duplicates found, vault items copied, issues flagged
