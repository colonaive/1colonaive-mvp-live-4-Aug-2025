// Preview-only: Upgraded HeroSection (centered & responsive)
import React from "react";

// Lightweight stubs for preview
const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div {...props} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button {...props} className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all ${className}`}>{children}</button>
);

const HeroPreview: React.FC = () => {
  return (
    <section
      className="relative w-full min-h-[92vh] overflow-hidden text-gray-900"
      style={{
        backgroundImage: `url(/assets/hero-bg-v2.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-white/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/85" />
      <div className="absolute -top-32 -left-24 h-[60vh] w-[60vh] rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-[60vh] w-[60vh] rounded-full bg-sky-300/25 blur-3xl" />

      <Container className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center text-center lg:items-start lg:text-left">
        {/* Badges */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
          <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-900 px-4 py-2 text-xs font-semibold tracking-wide">
            Clinician-Led National Movement
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 px-4 py-2 text-xs font-semibold tracking-wide">
            Where Treatment Begins While Screening
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-6xl text-[36px] sm:text-6xl lg:text-7xl font-extrabold leading-[1.03] tracking-tight">
          <span className="block">SCREENING SAVES LIVES.</span>
          <span className="mt-2 block text-emerald-700">
            New study shows 26 lives saved per 1,000 screened.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 max-w-3xl text-lg sm:text-xl text-gray-800 leading-relaxed">
          Every day, <span className="font-bold text-red-700">3 Singaporeans</span> are diagnosed with
          late-stage colorectal cancer. Early screening and timely colonoscopy offer up to a
          <span className="font-bold text-emerald-700"> 95% survival chance</span>.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
          <a href="/get-screened">
            <Button className="px-8 py-5 text-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl hover:from-sky-700 hover:to-indigo-700 hover:scale-[1.02]">
              Get Screened Now
            </Button>
          </a>
          <a href="/signup/champion">
            <Button className="px-7 py-5 text-base bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:from-emerald-600 hover:to-green-700">
              Join the Movement
            </Button>
          </a>
          <a href="/how-it-works">
            <Button className="px-6 py-4 text-sm bg-white border border-gray-300 text-gray-900 hover:bg-gray-100">
              How It Works
            </Button>
          </a>
        </div>

        {/* Impact strip */}
        <div className="mt-10 grid w-full max-w-5xl grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">National Targets</p>
            <p className="mt-1 text-2xl font-extrabold">
              80% <span className="text-gray-600 font-semibold text-base">screening by 2030</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Outcome Goal</p>
            <p className="mt-1 text-2xl font-extrabold">
              80% <span className="text-gray-600 font-semibold text-base">mortality reduction by 2035</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Our Approach</p>
            <p className="mt-1 text-base font-semibold leading-snug text-gray-800">
              Colonoscopy is the gold standard. Validated blood-based tests help increase screening uptake and triage more patients to timely scoping.
            </p>
          </div>
        </div>

        {/* Trust notes */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
            🔄 <span className="font-semibold text-gray-900">Lives Saved</span> counter coming soon, backed by verified screenings.
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow">
            ✅ Public–private collaboration • Led by Singapore’s medical experts
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
};

export default HeroPreview;
