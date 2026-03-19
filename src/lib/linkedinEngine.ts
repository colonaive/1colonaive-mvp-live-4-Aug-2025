/**
 * LinkedIn Relationship Intelligence Engine — CTW-COCKPIT-03A
 *
 * Follow-up scheduling, activity logging, and contact management.
 * No auto-sending. No scraping. All messages require manual approval.
 */

import { supabase } from '@/supabase';

/* ── Types ── */

export type ContactRole = 'professor' | 'investor' | 'clinician' | 'regulator' | 'partner' | 'other';
export type ContactProject = 'colonaive' | 'durmah' | 'sciencehod' | 'sgrenovate';
export type ContactStatus = 'new' | 'contacted' | 'replied' | 'warm' | 'advisor' | 'inactive';
export type ActivityType = 'connect' | 'message' | 'reply' | 'followup' | 'meeting';

export interface LinkedInContact {
  id: string;
  name: string;
  role: ContactRole;
  organisation: string | null;
  project: ContactProject;
  status: ContactStatus;
  last_contact_date: string | null;
  next_followup_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LinkedInActivity {
  id: string;
  contact_id: string;
  activity_type: ActivityType;
  summary: string | null;
  created_at: string;
}

export interface ContactWithActivities extends LinkedInContact {
  activities: LinkedInActivity[];
}

/* ── Contact CRUD ── */

export async function createContact(
  contact: Omit<LinkedInContact, 'id' | 'created_at' | 'updated_at'>
): Promise<LinkedInContact | null> {
  const { data, error } = await supabase
    .from('linkedin_contacts')
    .insert(contact)
    .select()
    .single();
  if (error) { console.error('createContact error:', error); return null; }
  return data as LinkedInContact;
}

export async function updateContact(
  id: string,
  updates: Partial<Omit<LinkedInContact, 'id' | 'created_at' | 'updated_at'>>
): Promise<LinkedInContact | null> {
  const { data, error } = await supabase
    .from('linkedin_contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateContact error:', error); return null; }
  return data as LinkedInContact;
}

export async function deleteContact(id: string): Promise<boolean> {
  const { error } = await supabase.from('linkedin_contacts').delete().eq('id', id);
  if (error) { console.error('deleteContact error:', error); return false; }
  return true;
}

export async function fetchContacts(filters?: {
  project?: ContactProject;
  status?: ContactStatus;
  role?: ContactRole;
}): Promise<LinkedInContact[]> {
  let query = supabase
    .from('linkedin_contacts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters?.project) query = query.eq('project', filters.project);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.role) query = query.eq('role', filters.role);

  const { data, error } = await query;
  if (error) { console.error('fetchContacts error:', error); return []; }
  return (data || []) as LinkedInContact[];
}

export async function fetchContactWithActivities(id: string): Promise<ContactWithActivities | null> {
  const { data: contact, error: ce } = await supabase
    .from('linkedin_contacts')
    .select('*')
    .eq('id', id)
    .single();
  if (ce || !contact) return null;

  const { data: activities } = await supabase
    .from('linkedin_activity_log')
    .select('*')
    .eq('contact_id', id)
    .order('created_at', { ascending: false })
    .limit(50);

  return { ...(contact as LinkedInContact), activities: (activities || []) as LinkedInActivity[] };
}

/* ── Activity Logging ── */

export async function logActivity(
  contact_id: string,
  activity_type: ActivityType,
  summary?: string
): Promise<LinkedInActivity | null> {
  const { data, error } = await supabase
    .from('linkedin_activity_log')
    .insert({ contact_id, activity_type, summary: summary || null })
    .select()
    .single();
  if (error) { console.error('logActivity error:', error); return null; }

  // Update last_contact_date on the contact
  await supabase
    .from('linkedin_contacts')
    .update({ last_contact_date: new Date().toISOString() })
    .eq('id', contact_id);

  return data as LinkedInActivity;
}

/* ── Follow-up Engine ── */

export async function getUpcomingFollowups(days: number = 7): Promise<LinkedInContact[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabase
    .from('linkedin_contacts')
    .select('*')
    .not('next_followup_date', 'is', null)
    .lte('next_followup_date', futureDate.toISOString())
    .gte('next_followup_date', new Date().toISOString())
    .neq('status', 'inactive')
    .order('next_followup_date', { ascending: true });

  if (error) { console.error('getUpcomingFollowups error:', error); return []; }
  return (data || []) as LinkedInContact[];
}

export async function getOverdueFollowups(): Promise<LinkedInContact[]> {
  const { data, error } = await supabase
    .from('linkedin_contacts')
    .select('*')
    .not('next_followup_date', 'is', null)
    .lt('next_followup_date', new Date().toISOString())
    .neq('status', 'inactive')
    .order('next_followup_date', { ascending: true });

  if (error) { console.error('getOverdueFollowups error:', error); return []; }
  return (data || []) as LinkedInContact[];
}

export async function scheduleFollowup(
  contact_id: string,
  date: string
): Promise<LinkedInContact | null> {
  return updateContact(contact_id, { next_followup_date: date });
}

/* ── High-value Contacts ── */

export async function getHighValueContacts(): Promise<LinkedInContact[]> {
  const { data, error } = await supabase
    .from('linkedin_contacts')
    .select('*')
    .in('status', ['warm', 'advisor'])
    .order('updated_at', { ascending: false });

  if (error) { console.error('getHighValueContacts error:', error); return []; }
  return (data || []) as LinkedInContact[];
}

/* ── Message Draft Engine ── */

export type MessageType = 'first_outreach' | 'follow_up' | 'reminder_after_delay' | 'advisory_board_invitation';

const PROJECT_LABELS: Record<ContactProject, string> = {
  colonaive: 'COLONAiVE / ColonAiQ',
  durmah: 'Durmah.ai',
  sciencehod: 'MyScienceHOD',
  sgrenovate: 'SG Renovate AI',
};

export function generateLinkedInMessage(
  contact: LinkedInContact,
  messageType: MessageType,
  context?: string
): string {
  const projectLabel = PROJECT_LABELS[contact.project];
  const firstName = contact.name.split(' ')[0];

  switch (messageType) {
    case 'first_outreach':
      return [
        `Dear ${contact.name},`,
        '',
        `I came across your work${contact.organisation ? ` at ${contact.organisation}` : ''} and was impressed by your contributions${contact.role === 'clinician' ? ' in clinical practice' : contact.role === 'professor' ? ' in academia' : ''}.`,
        '',
        `I'm working on ${projectLabel}${contact.project === 'colonaive' ? ', a national movement to increase colorectal cancer screening uptake in Singapore through non-invasive blood testing' : ''}.`,
        '',
        context ? `${context}\n` : '',
        `I'd welcome the opportunity to connect and share perspectives. Would you be open to a brief conversation?`,
        '',
        'Best regards,',
        'Chandra',
      ].filter(Boolean).join('\n');

    case 'follow_up':
      return [
        `Hi ${firstName},`,
        '',
        `I hope this message finds you well. Following up on our earlier conversation${context ? ` about ${context}` : ''}.`,
        '',
        `I wanted to check in and see if there are any developments on your end, or if there's anything I can share that would be helpful.`,
        '',
        `Looking forward to staying connected.`,
        '',
        'Best,',
        'Chandra',
      ].join('\n');

    case 'reminder_after_delay':
      return [
        `Dear ${contact.name},`,
        '',
        `It's been a while since we last connected, and I wanted to reach out again.`,
        '',
        `${projectLabel} has been making progress${context ? ` — ${context}` : ''}, and I thought of you given your expertise${contact.role === 'clinician' ? ' in the clinical space' : contact.role === 'investor' ? ' in healthcare investment' : ''}.`,
        '',
        `Would you have time for a brief catch-up? I'd value your perspective.`,
        '',
        'Warm regards,',
        'Chandra',
      ].join('\n');

    case 'advisory_board_invitation':
      return [
        `Dear ${contact.name},`,
        '',
        `I'm reaching out with an invitation that I hope you'll find meaningful.`,
        '',
        `As ${projectLabel} continues to grow, we are assembling an advisory board of distinguished professionals who share our vision${contact.project === 'colonaive' ? ' for improving colorectal cancer screening outcomes in Singapore and the region' : ''}.`,
        '',
        `Given your track record${contact.organisation ? ` at ${contact.organisation}` : ''} and your expertise${contact.role === 'clinician' ? ' in clinical practice' : contact.role === 'professor' ? ' in academic research' : contact.role === 'investor' ? ' in healthcare investment' : ''}, I believe your guidance would be invaluable.`,
        '',
        `The advisory role is lightweight — quarterly conversations, strategic input on key decisions, and the opportunity to shape a meaningful healthcare initiative.`,
        '',
        `Would you be open to discussing this further?`,
        '',
        'With respect,',
        'Chandra',
      ].join('\n');

    default:
      return `Hi ${firstName}, I'd like to connect regarding ${projectLabel}.`;
  }
}

/* ── Summary Stats ── */

export interface RelationshipStats {
  totalContacts: number;
  overdueFollowups: number;
  upcomingFollowups: number;
  highValueContacts: number;
  byProject: Record<ContactProject, number>;
  byStatus: Record<ContactStatus, number>;
}

export async function getRelationshipStats(): Promise<RelationshipStats> {
  const [all, overdue, upcoming, highValue] = await Promise.all([
    fetchContacts(),
    getOverdueFollowups(),
    getUpcomingFollowups(7),
    getHighValueContacts(),
  ]);

  const byProject: Record<ContactProject, number> = {
    colonaive: 0, durmah: 0, sciencehod: 0, sgrenovate: 0,
  };
  const byStatus: Record<ContactStatus, number> = {
    new: 0, contacted: 0, replied: 0, warm: 0, advisor: 0, inactive: 0,
  };

  for (const c of all) {
    byProject[c.project] = (byProject[c.project] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  }

  return {
    totalContacts: all.length,
    overdueFollowups: overdue.length,
    upcomingFollowups: upcoming.length,
    highValueContacts: highValue.length,
    byProject,
    byStatus,
  };
}
