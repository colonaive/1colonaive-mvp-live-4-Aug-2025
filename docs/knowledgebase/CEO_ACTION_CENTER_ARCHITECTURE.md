# CEO Action Center Architecture

## Overview

The CEO Action Center is a two-way AI communication interface embedded in the CEO Cockpit. It enables the CEO to interact with the Chief-of-Staff intelligence system through text and voice, with automatic action routing, prompt generation, email drafting, and task creation.

## Module Structure

```
src/chief-of-staff/action-center/
  index.ts                : Barrel export
  chatEngine.ts           : Conversation state and transcript management
  voiceInput.ts           : Browser speech recognition
  actionRouter.ts         : Intelligent message to action routing
  promptGenerator.ts      : AG prompt generation
  emailComposer.ts        : Email drafting and contact resolution

src/components/cockpit/
  ActionCenterChat.tsx    : React UI component
```

## Components

### 1. Chat Engine (`chatEngine.ts`)
Manages the conversation state:
- CEO and assistant message handling
- Transcript save/archive functionality
- Message history with context tags
- Session persistence

### 2. Voice Input (`voiceInput.ts`)
Browser-based speech recognition:
- Uses `SpeechRecognition` / `webkitSpeechRecognition`
- Language: `en-SG`
- Voice → text → chat input pipeline
- Graceful fallback if not supported

### 3. Action Router (`actionRouter.ts`)
Intelligent routing of CEO messages to actions:

| Action Type | Trigger Keywords | Result |
|-------------|-----------------|--------|
| Create Task | "create task", "implement", "fix" | Adds to Chief-of-Staff Task Engine |
| Draft Email | "send email", "write to", "email" | Creates email draft |
| Generate AG Prompt | "generate prompt", "AG prompt" | Creates structured AG prompt |
| Add Roadmap | "add roadmap", "plan feature" | Suggests roadmap entry |
| LinkedIn Post | "linkedin", "share on linkedin" | Routes to LinkedIn Intelligence |
| Strategy Note | "strategy", "memo", "briefing" | Creates strategy note |
| Meeting Note | "meeting note", "call summary" | Exports meeting note |
| Save Transcript | Default | Saves current conversation |

### 4. AG Prompt Generator (`promptGenerator.ts`)
Converts chat context into structured Antigravity prompts:
- Extracts CEO instructions from conversation
- Formats with title, context, objective, steps, constraints
- Tracks prompt history (generated/copied/sent status)

### 5. Email Composer (`emailComposer.ts`)
Email drafting and management:
- Natural language instruction parsing
- Known contacts resolution (Kevin → kevin@angsana.com.sg, etc.)
- Draft lifecycle: draft → ready → sent
- Integrates with Outlook monitoring system

### 6. Action Center Chat UI (`ActionCenterChat.tsx`)
React component with:
- Collapsed bar: "Ask the Chief-of-Staff AI"
- Expanded panel: full chat interface
- Voice dictation button (microphone)
- Quick action dropdown (8 action types)
- Generated prompt display with copy button
- Email draft preview panel
- Auto-scrolling message history

## Dashboard Widgets

Three new widgets added to CEO Cockpit:
1. **Recent CEO Chats:** Last 5 messages from the current session
2. **Generated Prompts:** Recent AG prompts with status
3. **Draft Emails:** Pending email drafts with recipient and status

## Database Tables

### `ceo_chat_transcripts`
- `id` (uuid): primary key
- `timestamp` (timestamptz): creation time
- `messages` (jsonb): array of ChatMessage objects
- `summary` (text): optional transcript summary
- `context_tags` (text[]): categorization tags
- `archived` (boolean): archive flag

### `email_activity`
- `id` (uuid): primary key
- `direction` (text): 'outbound' or 'inbound'
- `to_address`, `cc_address` (text): recipients
- `subject`, `body` (text): email content
- `status` (text): draft/ready/sent/failed/received
- `context_source` (text): originating instruction
- `sent_at` (timestamptz): send timestamp

## Data Flow

```
CEO Voice/Text → Chat Engine → Action Router
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              Task Engine    Email Composer    Prompt Generator
                    ↓               ↓               ↓
            Chief-of-Staff   Outlook API     AG Prompt Output
                    ↓               ↓
            Strategy Digest  Email Activity
```

## Email Intelligence Loop

1. CEO drafts email via Action Center
2. Email sent via Outlook API (future integration)
3. `email_activity` table logs the outbound message
4. Outlook inbox monitoring captures replies
5. Replies appear in CEO Cockpit "Inbox Intelligence" widget
6. Full loop: CEO instruction → email → reply → intelligence

## Known Contacts

| Name | Email |
|------|-------|
| Kevin | kevin@angsana.com.sg |
| Aaron | aaron@singleragenomics.com |
| Qiang | qiang.liu@singleragenomics.com |
| Manish | manish@skvsolutions.com |
| Daniel | daniel.lee@ktph.com.sg |

## Integration Points

- **Chief-of-Staff Task Engine:** tasks created from Action Center
- **Roadmap Engine:** roadmap items suggested from Action Center
- **Strategy Digest:** strategy notes feed into weekly digest
- **LinkedIn Intelligence:** LinkedIn actions route to `/admin/linkedin-intelligence`
- **Outlook Integration:** email loop connects to existing inbox monitoring
