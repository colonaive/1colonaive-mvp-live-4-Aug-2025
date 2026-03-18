import React, { useState, useEffect } from 'react';
import {
  Beaker,
  TrendingUp,
  Activity,
  ExternalLink,
  FlaskConical,
  Microscope,
  Dna,
  Heart,
} from 'lucide-react';
import {
  competitiveIntelligenceService,
  type TechnologyTrend,
} from '@/services/competitiveIntelligenceService';
import { radarService, type RadarSignal } from '@/services/radarService';

const TechnologyLandscape: React.FC = () => {
  const [trends, setTrends] = useState<TechnologyTrend[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s] = await Promise.all([
          competitiveIntelligenceService.fetchTechnologyTrends(),
          radarService.fetchTopSignals(30, 12),
        ]);
        setTrends(t);
        setSignals(s);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const techCategories = [
    {
      title: 'Blood-Based Screening',
      icon: <FlaskConical size={24} className="text-red-500" />,
      description: 'Non-invasive blood tests that detect colorectal cancer biomarkers through a simple blood draw. These tests analyse cell-free DNA, methylation patterns, and protein markers to identify early-stage cancer.',
      examples: ['ctDNA methylation panels', 'Multi-gene methylation PCR', 'Cell-free DNA analysis', 'Protein biomarker panels'],
    },
    {
      title: 'Liquid Biopsy Technologies',
      icon: <Dna size={24} className="text-blue-500" />,
      description: 'Advanced molecular diagnostics that detect circulating tumour DNA and other cancer-derived molecules in blood. Liquid biopsies are transforming cancer screening by enabling minimally invasive, repeatable testing.',
      examples: ['Circulating tumour DNA (ctDNA)', 'Fragmentomics', 'Multi-cancer early detection (MCED)', 'Minimal residual disease (MRD) monitoring'],
    },
    {
      title: 'Stool-Based Testing',
      icon: <Microscope size={24} className="text-amber-600" />,
      description: 'Home-based tests that analyse stool samples for DNA mutations and blood markers associated with colorectal cancer and advanced adenomas. These tests offer convenience for population-wide screening programs.',
      examples: ['Faecal immunochemical test (FIT)', 'Multi-target stool DNA (mt-sDNA)', 'FIT-fecal DNA combination tests'],
    },
    {
      title: 'Emerging Research',
      icon: <Beaker size={24} className="text-teal-600" />,
      description: 'Next-generation approaches in development including AI-assisted colonoscopy, microbiome-based screening, and multiomics platforms combining genomic, proteomic, and metabolomic data.',
      examples: ['AI-assisted colonoscopy', 'Microbiome-based biomarkers', 'Multiomics platforms', 'Exosome-based detection'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            CRC Screening Technology Landscape
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            An educational overview of current and emerging technologies for colorectal cancer screening.
            This overview is for informational purposes only and does not endorse any specific product or company.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Technology Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Screening Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  {cat.icon}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cat.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.examples.map((ex) => (
                    <span
                      key={ex}
                      className="text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Trends */}
        {trends.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp size={24} className="text-teal-600" /> Technology Trends
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Trends detected from analysis of recent research publications. Updated automatically every 6 hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trends.map((trend) => (
                <div
                  key={trend.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{trend.trend_name}</h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                      {trend.trend_score}%
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">{trend.description}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {trend.evidence_count} research signal(s) detected
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest Research */}
        {!loading && signals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity size={24} className="text-blue-600" /> Latest Research Signals
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              High-relevance research papers detected by our CRC Research Radar.
            </p>
            <div className="space-y-3">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={sig.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                      >
                        {sig.headline || sig.title}
                        <ExternalLink size={12} className="flex-shrink-0" />
                      </a>
                      {sig.key_finding && (
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {sig.key_finding}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                        {sig.journal && <span>{sig.journal}</span>}
                        {sig.publication_date && <span>{new Date(sig.publication_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <span className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded ${
                      sig.radar_score >= 12
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : sig.radar_score >= 8
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      Score: {sig.radar_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why Early Screening */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-[#0A385A] to-[#0F766E] rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={28} />
              <h2 className="text-2xl font-bold">Why Early Screening Matters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-3xl font-bold mb-1">90%+</p>
                <p className="text-sm text-white/80">
                  Five-year survival rate when colorectal cancer is detected at an early, localised stage.
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">2nd</p>
                <p className="text-sm text-white/80">
                  Colorectal cancer is the second leading cause of cancer-related death worldwide.
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">45+</p>
                <p className="text-sm text-white/80">
                  Updated guidelines now recommend screening from age 45, reflecting rising early-onset rates.
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70 mt-6 italic">
              Screening tests help identify individuals who should undergo colonoscopy, which remains the gold standard for diagnosis and prevention.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-4 border-t border-gray-200 dark:border-gray-700">
          This overview provides educational information about CRC screening technologies. It does not constitute medical advice,
          endorse specific products, or make diagnostic claims. Consult a healthcare professional for screening decisions.
        </div>
      </div>
    </div>
  );
};

export default TechnologyLandscape;
