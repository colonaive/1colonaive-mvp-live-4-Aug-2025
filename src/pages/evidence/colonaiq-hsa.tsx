// src/pages/evidence/colonaiq-hsa.tsx
import React from "react";
import { Link } from 'react-router-dom';

const Pill: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = "", children, ...props }) => (
  <span {...props} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>
);

export default function ColonAiQHSAEvidencePage() {
  return (
    <main aria-labelledby="page-title" className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li aria-hidden>›</li>
              <li><Link to="/evidence" className="hover:underline">Evidence</Link></li>
              <li aria-hidden>›</li>
              <li className="text-gray-700 font-medium">ColonAiQ® – HSA & Evidence</li>
            </ol>
          </nav>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <h1 id="page-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              ColonAiQ® – Regulatory Status & Clinical Evidence (Singapore)
            </h1>
            <Pill className="bg-blue-50 text-blue-900 border border-blue-100">Clinician-Led Movement</Pill>
          </div>

          <p className="mt-2 max-w-3xl text-gray-700">
            This page provides citation-backed information on ColonAiQ® relevant to Singapore’s screening ecosystem, in support of COLONAiVE™ - a clinician-led national movement.</p>
        </div>
      </section>

      {/* quick facts */}
      <section className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Regulatory</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">HSA Class C (IVD)</p>
              <p className="text-sm text-gray-700 mt-1">Device Listing: <span className="font-semibold">DE0510590</span> (11 Apr 2025).</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Intended Use</p>
              <p className="mt-1 text-sm text-gray-700">
                Blood-based screening test to help identify individuals who may benefit from further evaluation with colonoscopy.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Program Role</p>
              <p className="mt-1 text-sm text-gray-700">
                Complements FIT and colonoscopy to improve screening uptake and triage more people to timely scoping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* performance & evidence */}
      <section className="py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">Published Performance (summary)</h2>
            <p className="mt-1 text-sm text-gray-600">
              High-level metrics below; consult the peer-reviewed sources for full details and study populations.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-700">CRC Sensitivity</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">~86%</p>
                <p className="text-[11px] text-slate-700/80 mt-1">Across stages in reported studies.</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-700">Specificity</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">~92%</p>
                <p className="text-[11px] text-slate-700/80 mt-1">Low false-positive rate supports triage.</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-700">Patient Preference</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">80%+</p>
                <p className="text-[11px] text-slate-700/80 mt-1">Surveys report strong preference for blood tests vs stool tests.</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-gray-500">
              Metrics above are indicative; real-world effectiveness depends on uptake and timely colonoscopy. Always interpret with study design and population.
            </p>

            {/* citations */}
            <div className="mt-5">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900">Key References</h3>
              <ul className="mt-2 space-y-2 text-sm text-emerald-700">
                <li>
                  • Kaiser Permanente (program evaluation): screening doubled; mortality halved.{" "}
                  <a className="underline" href="https://divisionofresearch.kaiserpermanente.org/colorectal-cancer-screen-program/" target="_blank" rel="noopener noreferrer">View</a>
                </li>
                <li>
                  • JNCI 2025 “Triple Effect” microsimulation: lives saved, costs reduced, disparities narrowed.{" "}
                  <a className="underline" href="https://academic.oup.com/jnci/advance-article/doi/10.1093/jnci/djaf202/8219467" target="_blank" rel="noopener noreferrer">Read</a>
                </li>
                <li>
                  • HSA Singapore device listing (Class C IVD): ColonAiQ®, Listing <strong>DE0510590</strong> (11 Apr 2025). {/* link your public proof or PDF if available */}
                </li>
                <li>
                  • Published performance summaries (peer-reviewed). {/* add your specific article links if public */}
                </li>
              </ul>
            </div>

            {/* neutral handoff */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              
              <a
                href="https://www.colonaiq-asia.com"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Visit ColonAiQ® (Learn More About Blood-based CRC Screening)
              </a>
            </div>

            <p className="mt-3 text-[11px] text-gray-500">
              Disclaimer: This page is informational only and does not constitute medical advice. Screening decisions should follow national guidelines and clinician judgment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
