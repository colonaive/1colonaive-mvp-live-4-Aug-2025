import React from 'react';
import { ArrowLeft, Shield, FlaskConical, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cockpitService } from '@/services/cockpitService';

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    proposed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${colors[status] || colors.proposed}`}>
      {status}
    </span>
  );
};

export default function RegulatoryTrackerPage() {
  const navigate = useNavigate();
  const regulatory = cockpitService.getRegulatoryStatus();
  const trials = cockpitService.getClinicalTrials();
  const investors = cockpitService.getInvestorHistory();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/admin/ceo-cockpit')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Regulatory Tracker</h1>
            <p className="text-sm text-white/60">Approvals, clinical trials & investor history</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Regulatory Status */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-[#0F766E]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Regulatory Status</h2>
            <span className="text-xs text-gray-400 ml-auto">March 2026</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regulatory.map((r) => (
              <div key={r.jurisdiction} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{r.jurisdiction}</span>
                  {statusBadge(r.status.toLowerCase().includes('approved') || r.status.toLowerCase().includes('registered') ? 'active' : 'proposed')}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.classType}</p>
                <p className="text-xs text-gray-400 mt-1">{r.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Trials */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={16} className="text-[#0F766E]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Clinical Trials</h2>
            <span className="text-xs text-gray-400 ml-auto">March 2026</span>
          </div>
          <div className="space-y-3">
            {trials.map((t) => (
              <div key={t.name} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</span>
                  {statusBadge(t.status)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.lead} — {t.institution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Investor History */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#0F766E]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Investor History</h2>
          </div>
          <div className="space-y-4">
            {investors.map((round) => (
              <div key={round.phase} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                <p className="font-medium text-sm text-gray-900 dark:text-white mb-2">{round.phase}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Valuation: <strong className="text-gray-700 dark:text-gray-300">{round.valuation}</strong></span>
                  <span>Raised: <strong className="text-gray-700 dark:text-gray-300">{round.totalRaised}</strong></span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {round.investors.map((inv) => (
                    <span key={inv.name} className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded">
                      {inv.name}{inv.amount ? ` (${inv.amount})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
