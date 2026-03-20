/**
 * Relationship Priority Engine — CTW-COCKPIT-03B
 * /admin/cockpit/relationships
 *
 * Displays scored CEO contacts sorted by priority.
 * Top 5 critical relationships highlighted.
 * Doctrine guardrail for COLONAiVE contacts.
 */

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Users, Crown, TrendingUp, RefreshCw, Plus, Trash2, Edit3, AlertTriangle, Star, Zap, Clock, Target, Flame, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CockpitCard from '@/components/cockpit/CockpitCard';
import CockpitSection from '@/components/cockpit/CockpitSection';
import {
  fetchCEOContacts,
  createCEOContact,
  updateCEOContact,
  deleteCEOContact,
  toggleContactVerified,
  recalculateAllScores,
  getDoctrineGuidance,
  type CEOContact,
  type CEOContactRole,
  type PriorityLevel,
  type FollowUpAction,
} from '@/lib/relationshipPriorityEngine';

/* ── Priority Config ── */

const PRIORITY_CONFIG: Record<PriorityLevel, { color: string; bg: string; label: string }> = {
  critical: { color: 'text-red-700', bg: 'bg-red-100', label: 'CRITICAL' },
  active: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'ACTIVE' },
  warm: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'WARM' },
  passive: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'PASSIVE' },
};

const ACTION_LABELS: Record<FollowUpAction, string> = {
  follow_up: 'Follow Up',
  nurture: 'Nurture',
  convert: 'Convert',
  hold: 'Hold',
};

const ROLE_OPTIONS: CEOContactRole[] = [
  'investor', 'regulator', 'kol', 'clinician', 'partner', 'corporate', 'government', 'academic', 'other',
];

const PROJECT_OPTIONS = ['COLONAiVE', 'Durmah', 'SG Renovate', 'MyScienceHOD'];

/* ── Contact Form Modal ── */

function ContactModal({
  contact,
  onSave,
  onClose,
}: {
  contact: CEOContact | null;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(contact?.name || '');
  const [organisation, setOrganisation] = useState(contact?.organisation || '');
  const [role, setRole] = useState<CEOContactRole>(contact?.role || 'other');
  const [projectTags, setProjectTags] = useState<string[]>(contact?.project_tags || []);
  const [responsiveness, setResponsiveness] = useState(contact?.responsiveness_score || 0);
  const [momentum, setMomentum] = useState(contact?.momentum_score || 0);
  const [lastInteraction, setLastInteraction] = useState(
    contact?.last_interaction_at ? contact.last_interaction_at.split('T')[0] : ''
  );
  const [notes, setNotes] = useState(contact?.notes || '');

  const toggleProject = (p: string) => {
    setProjectTags(prev => prev.includes(p) ? prev.filter(t => t !== p) : [...prev, p]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      organisation: organisation.trim() || null,
      role,
      project_tags: projectTags,
      responsiveness_score: responsiveness,
      momentum_score: momentum,
      last_interaction_at: lastInteraction ? new Date(lastInteraction).toISOString() : null,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {contact ? 'Edit Contact' : 'Add Contact'}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Organisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organisation</label>
            <input
              type="text"
              value={organisation}
              onChange={e => setOrganisation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as CEOContactRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          {/* Project Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projects</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_OPTIONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProject(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    projectTags.includes(p)
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Responsiveness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Responsiveness (0–20): {responsiveness}
            </label>
            <input
              type="range"
              min={0}
              max={20}
              value={responsiveness}
              onChange={e => setResponsiveness(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Momentum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Momentum (0–15): {momentum}
            </label>
            <input
              type="range"
              min={0}
              max={15}
              value={momentum}
              onChange={e => setMomentum(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Execution Weight (display only — auto-computed) */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Execution Weight: <span className="text-gray-900 dark:text-white">auto-computed from project + role + momentum</span>
            </div>
          </div>
          {/* Last Interaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Interaction</label>
            <input
              type="date"
              value={lastInteraction}
              onChange={e => setLastInteraction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
          >
            {contact ? 'Update' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Contact Card ── */

function ContactCard({
  contact,
  rank,
  onEdit,
  onDelete,
  onToggleVerified,
}: {
  contact: CEOContact;
  rank?: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVerified: () => void;
}) {
  const priority = PRIORITY_CONFIG[contact.priority_level];
  const doctrine = getDoctrineGuidance(contact);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {rank && (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs font-bold">
              {rank}
            </span>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h4>
            {contact.organisation && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{contact.organisation}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {contact.is_verified ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={10} /> Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
              <ShieldAlert size={10} /> Unverified
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priority.bg} ${priority.color}`}>
            {priority.label}
          </span>
          <button onClick={onToggleVerified} className={`${contact.is_verified ? 'text-emerald-500 hover:text-yellow-500' : 'text-yellow-500 hover:text-emerald-500'}`} title={contact.is_verified ? 'Mark Unverified' : 'Mark Verified'}>
            <ShieldCheck size={14} />
          </button>
          <button onClick={onEdit} className="text-gray-400 hover:text-teal-600" title="Edit">
            <Edit3 size={14} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Execution Weight Badge */}
      {contact.execution_weight >= 15 && (
        <div className="mb-2 flex items-center gap-1.5 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded text-[11px] font-bold text-orange-700 dark:text-orange-400">
          <Flame size={12} />
          High Execution Priority
        </div>
      )}

      {/* Score Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Score</span>
          <span className="font-bold text-gray-900 dark:text-white">{contact.total_score}/120</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              contact.total_score >= 90 ? 'bg-red-500' :
              contact.total_score >= 70 ? 'bg-amber-500' :
              contact.total_score >= 50 ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${Math.round((contact.total_score / 120) * 100)}%` }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-6 gap-1 mb-3 text-[10px] text-center">
        <div>
          <div className="text-gray-400">Strategic</div>
          <div className="font-bold text-gray-700 dark:text-gray-300">{contact.strategic_value_score}</div>
        </div>
        <div>
          <div className="text-gray-400">Response</div>
          <div className="font-bold text-gray-700 dark:text-gray-300">{contact.responsiveness_score}</div>
        </div>
        <div>
          <div className="text-gray-400">Recency</div>
          <div className="font-bold text-gray-700 dark:text-gray-300">{contact.recency_score}</div>
        </div>
        <div>
          <div className="text-gray-400">Momentum</div>
          <div className="font-bold text-gray-700 dark:text-gray-300">{contact.momentum_score}</div>
        </div>
        <div>
          <div className="text-gray-400">Cross-Proj</div>
          <div className="font-bold text-gray-700 dark:text-gray-300">{contact.cross_project_score}</div>
        </div>
        <div>
          <div className={`${contact.execution_weight >= 15 ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>Exec Wt</div>
          <div className={`font-bold ${contact.execution_weight >= 15 ? 'text-orange-600' : 'text-gray-700 dark:text-gray-300'}`}>{contact.execution_weight}</div>
        </div>
      </div>

      {/* Tags and Role */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
          {contact.role}
        </span>
        {contact.project_tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            {tag}
          </span>
        ))}
      </div>

      {/* Follow-up Action */}
      {contact.follow_up_action && (
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <Target size={12} />
          <span>
            <strong>Next:</strong> {ACTION_LABELS[contact.follow_up_action]}
            {contact.follow_up_message_type && ` (${contact.follow_up_message_type})`}
          </span>
        </div>
      )}

      {/* Last Interaction */}
      {contact.last_interaction_at && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Clock size={12} />
          <span>Last: {new Date(contact.last_interaction_at).toLocaleDateString()}</span>
        </div>
      )}

      {/* Doctrine Warning */}
      {doctrine && (
        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-2">
          <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
          <span>{doctrine}</span>
        </div>
      )}

      {/* Notes */}
      {contact.notes && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">{contact.notes}</p>
      )}
    </div>
  );
}

/* ── Main Page ── */

export default function RelationshipPriority() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<CEOContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [modalContact, setModalContact] = useState<CEOContact | null | 'new'>(null);
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const data = await fetchCEOContacts();
    setContacts(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    await recalculateAllScores();
    await loadContacts();
    setRecalculating(false);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (modalContact === 'new') {
      await createCEOContact(data as Parameters<typeof createCEOContact>[0]);
    } else if (modalContact) {
      await updateCEOContact(modalContact.id, data);
    }
    setModalContact(null);
    await loadContacts();
  };

  const handleDelete = async (id: string) => {
    await deleteCEOContact(id);
    await loadContacts();
  };

  const handleToggleVerified = async (contact: CEOContact) => {
    await toggleContactVerified(contact.id, !contact.is_verified);
    await loadContacts();
  };

  // Filter
  const verifiedFiltered = showVerifiedOnly
    ? contacts.filter(c => c.is_verified)
    : contacts;
  const filtered = filterProject === 'all'
    ? verifiedFiltered
    : verifiedFiltered.filter(c => c.project_tags.includes(filterProject));

  const verifiedContacts = contacts.filter(c => c.is_verified);
  const top5 = verifiedContacts.slice(0, 5);
  const criticalCount = verifiedContacts.filter(c => c.priority_level === 'critical').length;
  const activeCount = verifiedContacts.filter(c => c.priority_level === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/ceo-cockpit')}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Crown size={22} />
                  Relationship Priority Engine
                </h1>
                <p className="text-sm text-white/70">CTW-COCKPIT-03B — Rule-based contact scoring & prioritisation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={recalculating ? 'animate-spin' : ''} />
                Recalculate
              </button>
              <button
                onClick={() => setModalContact('new')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm transition-colors"
              >
                <Plus size={14} />
                Add Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <CockpitSection columns={3}>
          <CockpitCard title="Total Contacts" icon={<Users size={18} />} status="active">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{contacts.length}</div>
          </CockpitCard>
          <CockpitCard title="Critical Priority" icon={<Zap size={18} />} status={criticalCount > 0 ? 'active' : 'pending'}>
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-gray-500 mt-1">Score 90–120</div>
          </CockpitCard>
          <CockpitCard title="Active Priority" icon={<TrendingUp size={18} />} status={activeCount > 0 ? 'active' : 'pending'}>
            <div className="text-3xl font-bold text-amber-600">{activeCount}</div>
            <div className="text-xs text-gray-500 mt-1">Score 70–89</div>
          </CockpitCard>
        </CockpitSection>

        {/* Top 5 */}
        <CockpitSection title="Top 5 Priority Relationships" columns={1}>
          <CockpitCard
            title="Priority Rankings"
            subtitle="Highest-scored contacts requiring immediate attention"
            icon={<Star size={18} />}
            status={top5.length > 0 ? 'active' : 'pending'}
          >
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading contacts...</div>
            ) : top5.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No contacts yet. Add your first contact above.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {top5.map((c, i) => (
                  <ContactCard
                    key={c.id}
                    contact={c}
                    rank={i + 1}
                    onEdit={() => setModalContact(c)}
                    onDelete={() => handleDelete(c.id)}
                    onToggleVerified={() => handleToggleVerified(c)}
                  />
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* All Contacts */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">All Contacts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterProject('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filterProject === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              {PROJECT_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setFilterProject(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    filterProject === p ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showVerifiedOnly
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <ShieldCheck size={13} />
            {showVerifiedOnly ? 'Verified Only' : 'Show All'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No contacts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {filtered.map(c => (
              <ContactCard
                key={c.id}
                contact={c}
                onEdit={() => setModalContact(c)}
                onDelete={() => handleDelete(c.id)}
                onToggleVerified={() => handleToggleVerified(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalContact !== null && (
        <ContactModal
          contact={modalContact === 'new' ? null : modalContact}
          onSave={handleSave}
          onClose={() => setModalContact(null)}
        />
      )}
    </div>
  );
}
