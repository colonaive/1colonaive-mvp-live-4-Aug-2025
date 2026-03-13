// Chief-of-Staff — Email Composer
// Drafts, manages, and tracks email communications from the CEO Cockpit.

export type EmailStatus = 'draft' | 'ready' | 'sent' | 'failed';

export interface EmailDraft {
  id: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
  status: EmailStatus;
  createdAt: string;
  sentAt?: string;
  contextSource?: string;
}

let emailDrafts: EmailDraft[] = [];

// Known contacts for quick addressing
const KNOWN_CONTACTS: Record<string, string> = {
  kevin: 'kevin@angsana.com.sg',
  aaron: 'aaron@singleragenomics.com',
  qiang: 'qiang.liu@singleragenomics.com',
  manish: 'manish@skvsolutions.com',
  daniel: 'daniel.lee@ktph.com.sg',
};

export const emailComposer = {
  /** Create a new email draft from CEO instruction */
  createDraft(instruction: string): EmailDraft {
    const parsed = parseEmailInstruction(instruction);

    const draft: EmailDraft = {
      id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      to: parsed.to,
      cc: parsed.cc,
      subject: parsed.subject,
      body: parsed.body,
      status: 'draft',
      createdAt: new Date().toISOString(),
      contextSource: instruction,
    };

    emailDrafts.push(draft);
    return draft;
  },

  /** Create a draft with explicit fields */
  createExplicitDraft(fields: { to: string; subject: string; body: string; cc?: string }): EmailDraft {
    const draft: EmailDraft = {
      id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...fields,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    emailDrafts.push(draft);
    return draft;
  },

  /** Update a draft */
  updateDraft(draftId: string, fields: Partial<Pick<EmailDraft, 'to' | 'cc' | 'subject' | 'body'>>): EmailDraft | null {
    const draft = emailDrafts.find((d) => d.id === draftId);
    if (!draft) return null;
    Object.assign(draft, fields);
    return draft;
  },

  /** Mark as ready to send */
  markReady(draftId: string): boolean {
    const draft = emailDrafts.find((d) => d.id === draftId);
    if (!draft) return false;
    draft.status = 'ready';
    return true;
  },

  /** Mark as sent (after actual send via Outlook/API) */
  markSent(draftId: string): boolean {
    const draft = emailDrafts.find((d) => d.id === draftId);
    if (!draft) return false;
    draft.status = 'sent';
    draft.sentAt = new Date().toISOString();
    return true;
  },

  /** Send an email via the Outlook send Netlify function */
  async sendEmail(draftId: string): Promise<{ success: boolean; error?: string }> {
    const draft = emailDrafts.find((d) => d.id === draftId);
    if (!draft) return { success: false, error: 'Draft not found' };
    if (!draft.to) return { success: false, error: 'No recipient specified' };

    try {
      const res = await fetch('/.netlify/functions/outlook-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: draft.to,
          cc: draft.cc || undefined,
          subject: draft.subject,
          body: draft.body,
          context_source: draft.contextSource || 'ceo-cockpit',
        }),
      });

      const data = await res.json();

      if (data.success) {
        draft.status = 'sent';
        draft.sentAt = new Date().toISOString();
        return { success: true };
      } else {
        draft.status = 'failed';
        return { success: false, error: data.error || 'Send failed' };
      }
    } catch (err) {
      draft.status = 'failed';
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  /** Get all drafts */
  getAllDrafts(): EmailDraft[] {
    return [...emailDrafts];
  },

  /** Get drafts by status */
  getDraftsByStatus(status: EmailStatus): EmailDraft[] {
    return emailDrafts.filter((d) => d.status === status);
  },

  /** Get pending (unsent) drafts */
  getPendingDrafts(): EmailDraft[] {
    return emailDrafts.filter((d) => d.status !== 'sent');
  },

  /** Resolve a contact name to email */
  resolveContact(name: string): string | null {
    const key = name.toLowerCase().trim();
    return KNOWN_CONTACTS[key] || null;
  },

  /** Get known contacts */
  getKnownContacts(): Record<string, string> {
    return { ...KNOWN_CONTACTS };
  },

  /** Delete a draft */
  deleteDraft(draftId: string): boolean {
    const idx = emailDrafts.findIndex((d) => d.id === draftId);
    if (idx === -1) return false;
    emailDrafts.splice(idx, 1);
    return true;
  },

  /** Get stats */
  getStats(): { total: number; drafts: number; sent: number; ready: number } {
    return {
      total: emailDrafts.length,
      drafts: emailDrafts.filter((d) => d.status === 'draft').length,
      sent: emailDrafts.filter((d) => d.status === 'sent').length,
      ready: emailDrafts.filter((d) => d.status === 'ready').length,
    };
  },

  /** Clear all */
  reset(): void {
    emailDrafts = [];
  },
};

// --- Helpers ---

function parseEmailInstruction(instruction: string): {
  to: string;
  cc?: string;
  subject: string;
  body: string;
} {
  // Try to extract recipient: "send to [name]", "email [name]", "write to [name]"
  let to = '';
  const recipientMatch = instruction.match(
    /(?:send|email|write|reach out)\s+(?:to|an?\s+email\s+to)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i
  );
  if (recipientMatch) {
    const name = recipientMatch[1];
    to = KNOWN_CONTACTS[name.toLowerCase()] || name;
  }

  // Try to extract subject: "about [topic]", "regarding [topic]", "re: [topic]"
  let subject = '';
  const subjectMatch = instruction.match(/(?:about|regarding|re:?)\s+(.+?)(?:\.|$)/i);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
  } else {
    subject = instruction.split(/[.!?\n]/)[0].trim().slice(0, 80);
  }

  // Body is the full instruction as context
  const body = `Dear ${to ? to.split('@')[0] : 'Team'},\n\n${instruction}\n\nBest regards,\nChandra\nSaver's Med Pte Ltd`;

  return { to, subject, body };
}
