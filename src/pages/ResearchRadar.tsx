import React, { useState, useEffect } from 'react';
import {
  Search,
  FlaskConical,
  Globe,
  BookOpen,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { radarService, type RadarSignal, type RadarTrial, type RadarPolicy } from '@/services/radarService';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ResearchRadar: React.FC = () => {
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [trials, setTrials] = useState<RadarTrial[]>([]);
  const [policies, setPolicies] = useState<RadarPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'research' | 'trials' | 'policy' | 'why'>('research');
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, t, p] = await Promise.all([
          radarService.fetchTopSignals(30, 20),
          radarService.fetchTrials(10),
          radarService.fetchPolicies(10),
        ]);
        setSignals(s.filter((s) => s.radar_score >= 5));
        setTrials(t);
        setPolicies(p);
      } catch (err) {
        console.error('Research radar load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sections = [
    { key: 'research' as const, label: 'Latest Research', icon: <Search size={16} /> },
    { key: 'trials' as const, label: 'Clinical Trials', icon: <FlaskConical size={16} /> },
    { key: 'policy' as const, label: 'Policy Developments', icon: <Globe size={16} /> },
    { key: 'why' as const, label: 'Why Early Screening Matters', icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A385A] via-[#0F766E] to-[#34D399] px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">CRC Research Radar</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            A public knowledge hub tracking the latest colorectal cancer research, clinical trials, and policy developments worldwide. Designed for clinicians, researchers, and informed patients.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === s.key
                    ? 'bg-[#0A385A] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading research data...</span>
          </div>
        ) : (
          <>
            {/* Latest Research */}
            {activeSection === 'research' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Latest CRC Research</h2>
                {signals.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No research signals available yet. Check back soon.</p>
                ) : (
                  <div className="space-y-4">
                    {signals.map((signal) => (
                      <div
                        key={signal.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <a
                              href={signal.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-semibold text-gray-900 dark:text-white hover:text-[#0F766E] dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                            >
                              {signal.headline || signal.title}
                              <ExternalLink size={14} className="shrink-0 opacity-40" />
                            </a>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {signal.journal && (
                                <span className="text-sm text-[#0F766E] dark:text-emerald-400 font-medium">{signal.journal}</span>
                              )}
                              {signal.authors && (
                                <span className="text-xs text-gray-500 truncate max-w-[300px]">{signal.authors}</span>
                              )}
                              {signal.publication_date && (
                                <span className="text-xs text-gray-400">{formatDate(signal.publication_date)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {signal.public_summary && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                            {signal.public_summary}
                          </p>
                        )}

                        {(signal.key_finding || signal.abstract) && (
                          <button
                            onClick={() => setExpandedSignal(expandedSignal === signal.id ? null : signal.id)}
                            className="flex items-center gap-1 mt-3 text-xs text-[#0F766E] dark:text-emerald-400 hover:underline"
                          >
                            {expandedSignal === signal.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {expandedSignal === signal.id ? 'Show less' : 'Read more'}
                          </button>
                        )}

                        {expandedSignal === signal.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            {signal.key_finding && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Key Finding</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{signal.key_finding}</p>
                              </div>
                            )}
                            {signal.abstract && (
                              <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase">Abstract</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{signal.abstract}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {signal.topic_tags && signal.topic_tags.length > 0 && (
                          <div className="flex gap-1.5 mt-3 flex-wrap">
                            {signal.topic_tags.map((tag) => (
                              <span key={tag} className="inline-block bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[11px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Clinical Trials */}
            {activeSection === 'trials' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Clinical Trials</h2>
                {trials.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No clinical trials data available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {trials.map((trial) => (
                      <div
                        key={trial.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                      >
                        <a
                          href={trial.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-semibold text-gray-900 dark:text-white hover:text-[#0F766E] transition-colors flex items-center gap-1"
                        >
                          {trial.title}
                          <ExternalLink size={14} className="shrink-0 opacity-40" />
                        </a>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                            {trial.trial_id}
                          </span>
                          {trial.phase && (
                            <span className="text-xs text-gray-500">{trial.phase}</span>
                          )}
                          {trial.status && (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                              {trial.status}
                            </span>
                          )}
                          {trial.country && (
                            <span className="text-xs text-gray-500">{trial.country}</span>
                          )}
                        </div>
                        {trial.institution && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{trial.institution}</p>
                        )}
                        {trial.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{trial.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Policy Developments */}
            {activeSection === 'policy' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Policy Developments</h2>
                {policies.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No policy updates available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {policies.map((policy) => (
                      <div
                        key={policy.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                            {policy.country}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(policy.created_at)}</span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{policy.policy_title}</p>
                        {policy.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{policy.description}</p>
                        )}
                        {policy.source_link && (
                          <a href={policy.source_link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0F766E] dark:text-emerald-400 hover:underline mt-2 inline-flex items-center gap-1">
                            View Source <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Why Early Screening Matters */}
            {activeSection === 'why' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Why Early Screening Matters</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-gradient-to-br from-[#0A385A]/5 to-[#0F766E]/5 dark:from-[#0A385A]/20 dark:to-[#0F766E]/20 rounded-xl p-8 mb-8">
                    <h3 className="text-lg font-semibold text-[#0A385A] dark:text-white mt-0">The Science is Clear</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Colorectal cancer (CRC) is the third most common cancer worldwide and the second leading cause of cancer death. Yet when detected early — at Stage I — the 5-year survival rate exceeds 90%. By Stage IV, this drops below 15%.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Screening is the single most effective intervention to bridge this gap. Regular screening can detect precancerous polyps before they become malignant, and catch early-stage cancers when treatment is most effective.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Screening Methods</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span><strong>Colonoscopy</strong> — Gold standard. Detects and removes polyps in one procedure.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span><strong>FIT / FOBT</strong> — Stool-based tests that detect hidden blood. Non-invasive but less sensitive.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span><strong>Blood-based tests</strong> — Emerging screening options using ctDNA or methylation biomarkers. More acceptable to patients who decline stool or invasive tests.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Who Should Be Screened?</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span>Adults aged <strong>45 and above</strong> at average risk (updated guidelines)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span>Earlier if family history of CRC or hereditary conditions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0F766E] mt-0.5">&#9679;</span>
                          <span>Individuals with persistent GI symptoms should consult a doctor regardless of age</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                    <h4 className="text-base font-semibold text-amber-800 dark:text-amber-300 mb-2">The Screening Gap</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed mb-0">
                      Despite proven benefits, screening uptake remains low in many countries. In Singapore, less than 30% of eligible adults have been screened for colorectal cancer. This gap represents preventable deaths and late-stage diagnoses that could have been caught earlier.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This page provides educational information about colorectal cancer research and screening. It is not medical advice.
            Always consult your healthcare provider for screening decisions. Data sourced from PubMed, ClinicalTrials.gov, and public news feeds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchRadar;
