// components/HeroSection.tsx
// Uses Tailwind only and a11y-safe links

import React from "react";

const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div {...props} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button {...props} className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}>{children}</button>
);

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[92vh] overflow-hidden text-gray-900"
      aria-label="Colorectal cancer screening call to action"
      style={{ backgroundImage: `url(/assets/hero-bg-v2.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* soft overlays */}
      <div className="absolute inset-0 bg-white/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/85" />
      <div className="absolute -top-32 -left-24 h-[60vh] w-[60vh] rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-[60vh] w-[60vh] rounded-full bg-sky-300/25 blur-3xl" />

      {/* CHANGED: added top padding so the red chip sits lower under the header */}
      <Container className="relative z-10 flex min-h-[92vh] items-center justify-center pt-4 sm:pt-6 md:pt-8">
        <div className="w-full max-w-6xl mx-auto text-center">

          {/* CRC alert */}
          <div className="mb-4 flex justify-center">
            {/* 
              CHANGED:
              - grew padding: px-5→px-6 (sm:px-6→sm:px-8), py-2.5→py-3 (sm:py-3→sm:py-3.5)
              - grew text: text-sm→text-base (sm:text-base→sm:text-lg)
              - added ring-offset to create a visible "border gap" from background (ring-offset-2 ring-offset-white)
              - slightly stronger ring color (ring-red-700/50) and shadow
            */}
            <span className="inline-flex items-center gap-3 rounded-full bg-red-600 px-6 sm:px-8 py-3 sm:py-3.5
                             text-base sm:text-lg text-white font-extrabold tracking-[0.18em] uppercase
                             shadow-lg ring-2 ring-red-700/50 ring-offset-2 ring-offset-white">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
              Colorectal Cancer
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          </div>

          {/* taglines */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold tracking-wide">
              Where Treatment Begins While Screening
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-900 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold tracking-wide">
              SCOPED IN TIME | SAVED IN TIME
            </span>
          </div>

          {/* headline */}
          <h1 className="mx-auto max-w-[22ch] text-[30px] sm:text-5xl md:text-6xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight">
            <span className="block">SCREENING SAVES LIVES - EVIDENCE PROVES IT.</span>
            <span className="mt-2 block text-emerald-700 text-[24px] sm:text-4xl md:text-5xl lg:text-[42px] font-extrabold">
              Modeling shows ~26 lives saved per 1,000 screened.*
            </span>
          </h1>

          {/* subhead */}
          <p className="mt-4 mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
            Every day, <span className="font-bold text-red-700">3 Singaporeans are diagnosed late</span>.
            Early screening with timely colonoscopy can shift detection earlier and improve survival.
          </p>

          {/* evidence strip */}
          <div className="mt-6 mx-auto grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <a
              href="https://divisionofresearch.kaiserpermanente.org/colorectal-cancer-screen-program/"
              target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">Real-World Program</p>
              <p className="mt-1 text-sm font-semibold">Kaiser Permanente (1.1M): screening doubled; mortality halved.</p>
              <span className="mt-1 inline-block text-xs text-emerald-700 group-hover:underline">View evidence ↗</span>
            </a>

            <a
              href="https://academic.oup.com/jnci/advance-article/doi/10.1093/jnci/djaf202/8219467"
              target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">Peer-Reviewed Modeling</p>
              <p className="mt-1 text-sm font-semibold">JNCI 2025: "Triple Effect"-saves lives, reduces costs, narrows gaps.</p>
              <span className="mt-1 inline-block text-xs text-emerald-700 group-hover:underline">Read article ↗</span>
            </a>

            <a
              href="/evidence/colonaiq-hsa"
              className="group rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">Singapore-Ready</p>
              <p className="mt-1 text-sm font-semibold">ColonAiQ®: HSA Class C listed (DE0510590); high patient acceptability.</p>
              <span className="mt-1 inline-block text-xs text-emerald-700 group-hover:underline">See details ↗</span>
            </a>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <a href="/get-screened" aria-label="Get screened now">
              <Button className="px-7 py-4 text-base sm:text-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl hover:from-sky-700 hover:to-indigo-700 hover:scale-[1.02] focus:ring-sky-700">
                Get Screened Now
              </Button>
            </a>
            <a href="/signup/champion" aria-label="Join the movement">
              <Button className="px-6 py-4 text-base bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-700">
                Join the Movement
              </Button>
            </a>
            <a href="/evidence/colonaiq-hsa" aria-label="See evidence">
              <Button className="px-5 py-3.5 text-sm bg-white border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-400">
                See Evidence
              </Button>
            </a>
          </div>

          {/* movement badge */}
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-900 px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-wide">
              Clinician-Led National Movement
            </span>
          </div>

          {/* impact tiles */}
          <div className="mt-7 grid w-full max-w-5xl mx-auto grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">National Target</p>
              <p className="mt-1 text-2xl font-extrabold">80% <span className="text-gray-600 font-semibold text-base">screening uptake</span></p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Outcome Goal</p>
              <p className="mt-1 text-2xl font-extrabold">50% <span className="text-gray-600 font-semibold text-base">mortality reduction</span></p>
              <p className="text-[11px] text-gray-500 mt-1">Goal informed by long-run program results.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Our Approach</p>
              <p className="mt-1 text-base font-semibold leading-snug text-gray-800">
                Colonoscopy remains the gold standard. Evidence-supported blood tests help increase uptake and triage more people to timely scoping.
              </p>
            </div>
          </div>

          {/* trust notes */}
          <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
              🔍 <span className="font-semibold text-gray-900">Transparent evidence:</span> see sources above and our full Evidence Brief.
            </div>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
              ✅ Public-private collaboration • Led by Singapore clinicians
            </div>
          </div>

          {/* footnote */}
          <p className="mt-4 text-xs text-gray-500">
            * Estimate from peer-reviewed modeling (JNCI 2025). Real-world impact depends on screening uptake and timely colonoscopy follow-up.
          </p>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
