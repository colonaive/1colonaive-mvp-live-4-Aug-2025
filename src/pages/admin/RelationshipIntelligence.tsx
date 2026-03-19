import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Clock,
  AlertTriangle,
  Star,
  ArrowLeft,
  RefreshCw,
  Send,
  MessageSquare,
  Calendar,
  Building2,
  Copy,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  PenLine,
  Trash2,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  logActivity,
  scheduleFollowup,
  getOverdueFollowups,
  getUpcomingFollowups,
  getHighValueContacts,
  getRelationshipStats,
  generateLinkedInMessage,
  type LinkedInContact,
  type ContactRole,
  type ContactProject,
  type ContactStatus,
  type ActivityType,
  type MessageType,
  type RelationshipStats,
} from '@/lib/linkedinEngine';

/* ── Constants ── */

const ROLE_OPTIONS: { value: ContactRole; label: string }[] = [
  { value: 'professor', label: 'Professor' },
  { value: 'investor', label: 'Investor' },
  { value: 'clinician', label: 'Clinician' },
  { value: 'regulator', label: 'Regulator' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
];

const PROJECT_OPTIONS: { value: ContactProject; label: string }[] = [
  { value: 'colonaive', label: 'COLONAiVE' },
  { value: 'durmah', label: 'Durmah.ai' },
  { value: 'sciencehod', label: 'MyScienceHOD' },
  { value: 'sgrenovate', label: 'SG Renovate AI' },
];

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'warm', label: 'Warm' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'inactive', label: 'Inactive' },
];

const MESSAGE_TYPES: { value: MessageType; label: string }[] = [
  { value: 'first_outreach', label: 'First Outreach' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'reminder_after_delay', label: 'Reminder After Delay' },
  { value: 'advisory_board_invitation', label: 'Advisory Board Invitation' },
];

const STATUS_COLORS: Record<ContactStatus, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  contacted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  replied: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  warm: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  advisor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const ROLE_COLORS: Record<ContactRole, string> = {
  professor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  investor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  clinician: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  regulator: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  partner: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

/* ── Helper Components ── */

const Badge: React.FC<{ text: string; colorClass: string }> = ({ text, colorClass }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${colorClass}`}>
    {text}
  </span>
);

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const daysFromNow = (iso: string | null): number | null => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
};

/* ── Add/Edit Contact Modal ── */

interface ContactFormData {
  name: string;
  role: ContactRole;
  organisation: string;
  project: ContactProject;
  status: ContactStatus;
  next_followup_date: string;
  notes: string;
}

const emptyForm: ContactFormData = {
  name: '', role: 'other', organisation: '', project: 'colonaive', status: 'new', next_followup_date: '', notes: '',
};

const ContactModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContactFormData) => Promise<void>;
  initialData?: ContactFormData;
  title: string;
}> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const [form, setForm] = useState<ContactFormData>(initialData || emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialData || emptyForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as ContactRole })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none">
                {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
              <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value as ContactProject })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none">
                {PROJECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Organisation</label>
            <input type="text" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContactStatus })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Next Follow-up</label>
              <input type="date" value={form.next_followup_date} onChange={(e) => setForm({ ...form, next_followup_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none resize-none"
              placeholder="Paste conversation summary, meeting notes, etc." />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()}
            className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Message Draft Modal ── */

const MessageDraftModal: React.FC<{
  contact: LinkedInContact | null;
  onClose: () => void;
}> = ({ contact, onClose }) => {
  const [messageType, setMessageType] = useState<MessageType>('first_outreach');
  const [context, setContext] = useState('');
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (contact) {
      setDraft(generateLinkedInMessage(contact, messageType, context || undefined));
    }
  }, [contact, messageType, context]);

  if (!contact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Draft Message</h3>
            <p className="text-xs text-gray-500">For {contact.name} — manual approval required</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message Type</label>
              <select value={messageType} onChange={(e) => setMessageType(e.target.value as MessageType)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none">
                {MESSAGE_TYPES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Context (optional)</label>
              <input type="text" value={context} onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. KTPH study, FDA submission"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Draft Message</label>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={12}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none font-mono resize-none" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs text-amber-700 dark:text-amber-300">This is a draft only. Copy and send manually via LinkedIn. No auto-sending.</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Close</button>
          <button onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-sm font-medium transition-colors">
            {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy to Clipboard</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Log Activity Modal ── */

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'connect', label: 'Connection Request' },
  { value: 'message', label: 'Message Sent' },
  { value: 'reply', label: 'Reply Received' },
  { value: 'followup', label: 'Follow-up' },
  { value: 'meeting', label: 'Meeting' },
];

const LogActivityModal: React.FC<{
  contact: LinkedInContact | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ contact, onClose, onSaved }) => {
  const [activityType, setActivityType] = useState<ActivityType>('message');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);

  if (!contact) return null;

  const handleSave = async () => {
    setSaving(true);
    await logActivity(contact.id, activityType, summary || undefined);
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Log Activity — {contact.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Type</label>
            <select value={activityType} onChange={(e) => setActivityType(e.target.value as ActivityType)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none">
              {ACTIVITY_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3}
              placeholder="Paste conversation summary..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] outline-none resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Log Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Contact Card ── */

const ContactCard: React.FC<{
  contact: LinkedInContact;
  onDraft: (c: LinkedInContact) => void;
  onLogActivity: (c: LinkedInContact) => void;
  onEdit: (c: LinkedInContact) => void;
  onDelete: (c: LinkedInContact) => void;
  onSchedule: (c: LinkedInContact) => void;
}> = ({ contact, onDraft, onLogActivity, onEdit, onDelete, onSchedule }) => {
  const [expanded, setExpanded] = useState(false);
  const followupDays = daysFromNow(contact.next_followup_date);
  const isOverdue = followupDays !== null && followupDays < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A385A] to-[#0F766E] flex items-center justify-center text-white font-semibold text-sm">
              {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{contact.name}</h4>
              {contact.organisation && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Building2 size={10} /> {contact.organisation}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge text={contact.role} colorClass={ROLE_COLORS[contact.role]} />
            <Badge text={contact.status} colorClass={STATUS_COLORS[contact.status]} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={10} /> Last: {formatDate(contact.last_contact_date)}
          </span>
          {contact.next_followup_date && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
              <Calendar size={10} />
              Next: {formatDate(contact.next_followup_date)}
              {isOverdue && ` (${Math.abs(followupDays!)}d overdue)`}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => onDraft(contact)} title="Draft Message"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-[11px] font-medium transition-colors">
            <Send size={10} /> Draft Message
          </button>
          <button onClick={() => onLogActivity(contact)} title="Log Activity"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors">
            <MessageSquare size={10} /> Log Activity
          </button>
          <button onClick={() => onSchedule(contact)} title="Schedule Follow-up"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-[11px] font-medium transition-colors">
            <Calendar size={10} /> Follow-up
          </button>
          <button onClick={() => setExpanded(!expanded)} title="Details"
            className="ml-auto px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 text-[11px] transition-colors">
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            {contact.notes && (
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(contact)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-[#0F766E] transition-colors">
                <PenLine size={10} /> Edit
              </button>
              <button onClick={() => onDelete(contact)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={10} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Page ── */

const RelationshipIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<LinkedInContact[]>([]);
  const [overdueContacts, setOverdueContacts] = useState<LinkedInContact[]>([]);
  const [upcomingContacts, setUpcomingContacts] = useState<LinkedInContact[]>([]);
  const [highValueContacts, setHighValueContacts] = useState<LinkedInContact[]>([]);
  const [stats, setStats] = useState<RelationshipStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterProject, setFilterProject] = useState<ContactProject | ''>('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editContact, setEditContact] = useState<LinkedInContact | null>(null);
  const [draftContact, setDraftContact] = useState<LinkedInContact | null>(null);
  const [logActivityContact, setLogActivityContact] = useState<LinkedInContact | null>(null);
  const [scheduleContact, setScheduleContact] = useState<LinkedInContact | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const filters: { project?: ContactProject; status?: ContactStatus } = {};
    if (filterProject) filters.project = filterProject;
    if (filterStatus) filters.status = filterStatus;

    const [allContacts, overdue, upcoming, highValue, relStats] = await Promise.all([
      fetchContacts(filters),
      getOverdueFollowups(),
      getUpcomingFollowups(7),
      getHighValueContacts(),
      getRelationshipStats(),
    ]);

    setContacts(allContacts);
    setOverdueContacts(overdue);
    setUpcomingContacts(upcoming);
    setHighValueContacts(highValue);
    setStats(relStats);
    setLoading(false);
  }, [filterProject, filterStatus]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateContact = async (data: ContactFormData) => {
    await createContact({
      name: data.name,
      role: data.role,
      organisation: data.organisation || null,
      project: data.project,
      status: data.status,
      last_contact_date: null,
      next_followup_date: data.next_followup_date ? new Date(data.next_followup_date).toISOString() : null,
      notes: data.notes || null,
    });
    loadData();
  };

  const handleEditContact = async (data: ContactFormData) => {
    if (!editContact) return;
    await updateContact(editContact.id, {
      name: data.name,
      role: data.role,
      organisation: data.organisation || null,
      project: data.project,
      status: data.status,
      next_followup_date: data.next_followup_date ? new Date(data.next_followup_date).toISOString() : null,
      notes: data.notes || null,
    });
    setEditContact(null);
    loadData();
  };

  const handleDeleteContact = async (contact: LinkedInContact) => {
    if (!window.confirm(`Delete ${contact.name}? This cannot be undone.`)) return;
    await deleteContact(contact.id);
    loadData();
  };

  const handleScheduleFollowup = async (contact: LinkedInContact) => {
    const dateStr = window.prompt('Schedule follow-up date (YYYY-MM-DD):', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    if (!dateStr) return;
    await scheduleFollowup(contact.id, new Date(dateStr).toISOString());
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/ceo-cockpit')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Users size={22} /> Relationship Intelligence
                </h1>
                <p className="text-sm text-white/70 mt-0.5">LinkedIn contact management — manual input, AI-assisted drafts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
                <Filter size={14} /> Filters
              </button>
              <button onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
                <RefreshCw size={14} /> Refresh
              </button>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0A385A] text-sm font-medium hover:bg-white/90 transition-colors">
                <UserPlus size={14} /> Add Contact
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
              <select value={filterProject} onChange={(e) => setFilterProject(e.target.value as ContactProject | '')}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white focus:ring-2 focus:ring-white/50 outline-none">
                <option value="" className="text-gray-900">All Projects</option>
                {PROJECT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ContactStatus | '')}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white focus:ring-2 focus:ring-white/50 outline-none">
                <option value="" className="text-gray-900">All Statuses</option>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>)}
              </select>
              {(filterProject || filterStatus) && (
                <button onClick={() => { setFilterProject(''); setFilterStatus(''); }}
                  className="text-xs text-white/70 hover:text-white underline">Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Strip */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContacts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Contacts</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${stats.overdueFollowups > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {stats.overdueFollowups}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue Follow-ups</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.upcomingFollowups}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming (7 days)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.highValueContacts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">High-Value (Warm/Advisor)</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading contacts...</span>
          </div>
        ) : (
          <>
            {/* Overdue Follow-ups */}
            {overdueContacts.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} /> Overdue Follow-ups ({overdueContacts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {overdueContacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onDraft={setDraftContact} onLogActivity={setLogActivityContact}
                      onEdit={setEditContact} onDelete={handleDeleteContact} onSchedule={handleScheduleFollowup} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Follow-ups */}
            {upcomingContacts.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
                  <Clock size={14} /> Upcoming Follow-ups ({upcomingContacts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {upcomingContacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onDraft={setDraftContact} onLogActivity={setLogActivityContact}
                      onEdit={setEditContact} onDelete={handleDeleteContact} onSchedule={handleScheduleFollowup} />
                  ))}
                </div>
              </section>
            )}

            {/* High-Value Contacts */}
            {highValueContacts.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
                  <Star size={14} /> High-Value Contacts ({highValueContacts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highValueContacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onDraft={setDraftContact} onLogActivity={setLogActivityContact}
                      onEdit={setEditContact} onDelete={handleDeleteContact} onSchedule={handleScheduleFollowup} />
                  ))}
                </div>
              </section>
            )}

            {/* All Contacts */}
            <section>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Users size={14} /> All Contacts ({contacts.length})
              </h2>
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No contacts yet. Click "Add Contact" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onDraft={setDraftContact} onLogActivity={setLogActivityContact}
                      onEdit={setEditContact} onDelete={handleDeleteContact} onSchedule={handleScheduleFollowup} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Modals */}
      <ContactModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleCreateContact} title="Add Contact" />
      <ContactModal isOpen={!!editContact} onClose={() => setEditContact(null)} onSave={handleEditContact} title="Edit Contact"
        initialData={editContact ? {
          name: editContact.name, role: editContact.role, organisation: editContact.organisation || '',
          project: editContact.project, status: editContact.status,
          next_followup_date: editContact.next_followup_date ? editContact.next_followup_date.split('T')[0] : '',
          notes: editContact.notes || '',
        } : undefined} />
      <MessageDraftModal contact={draftContact} onClose={() => setDraftContact(null)} />
      <LogActivityModal contact={logActivityContact} onClose={() => setLogActivityContact(null)} onSaved={loadData} />
    </div>
  );
};

export default RelationshipIntelligence;
