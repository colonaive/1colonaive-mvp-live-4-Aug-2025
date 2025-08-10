// /src/pages/HowItWorksPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import {
  Stethoscope,
  TestTubes,
  ArrowRight,
  ShieldCheck,
  CalendarCheck2,
  Building2,
  Activity,
} from "lucide-react";

const Dot = () => <span className="mx-2 text-gray-400">•</span>;

const StepCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
    <div className="flex items-start gap-4">
      <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-600">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  </div>
);

const HowItWorksPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <section className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 text-white">
        <Container className="py-14">
          <p className="text-white/80 text-sm">
            <Link to="/">{`← Back to Home`}</Link>
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold">How It Works</h1>
          <p className="mt-4 max-w-3xl text-white/90 text-base sm:text-lg">
            Simple pathway, strong outcomes. We help more people get screened on time, triage those at
            higher risk to colonoscopy, and catch colorectal cancer early—when it’s most treatable.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
              Clinician‑Led • Neutral & Non‑Commercial
            </span>
            <Dot />
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
              Colonoscopy = Gold Standard
            </span>
            <Dot />
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
              Validated Blood Tests for Triage
            </span>
          </div>
        </Container>
      </section>

      {/* Quick Pathways */}
      <section className="-mt-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">Path A — Go Straight to Colonoscopy</h2>
              <p className="mt-2 text-gray-600">
                If you’re 50+, have symptoms, or have a family history, your doctor may recommend
                colonoscopy directly. It both <strong>diagnoses and treats</strong> by removing polyps early.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/find-a-specialist">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Book a Specialist <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/education/article/colonoscopy-gold-standard">
                  <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100 border-gray-300">
                    Why Colonoscopy?
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">Path B — Start with a Validated Blood Test</h2>
              <p className="mt-2 text-gray-600">
                For many people, a modern, high‑sensitivity blood‑based screening test is an
                accessible first step. Positive results are triaged to timely colonoscopy.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/get-screened">
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                    Find a Screening Site <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/education/patients">
                  <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100 border-gray-300">
                    Patient Education
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5‑Step Flow */}
      <section className="py-12">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The 5‑Step Flow</h2>
          <p className="mt-2 text-gray-600">
            A clinician‑guided journey designed to boost screening uptake and get high‑risk people scoped earlier.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StepCard
              icon={<Stethoscope className="h-5 w-5" />}
              title="1) Quick Risk Review"
              text="Age, symptoms, and family history inform whether you go straight to colonoscopy or begin with a non‑invasive blood test."
            />
            <StepCard
              icon={<TestTubes className="h-5 w-5" />}
              title="2) Screening Test"
              text="Validated blood‑based test at participating clinics/labs. Clear instructions and fast turnaround."
            />
            <StepCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="3) Results & Triage"
              text="Negative → Routine follow‑up. Positive → Guided referral for timely colonoscopy with a specialist."
            />
            <StepCard
              icon={<Building2 className="h-5 w-5" />}
              title="4) Colonoscopy (Gold Standard)"
              text="Direct visualization and polyp removal in the same procedure—diagnosis and early treatment combined."
            />
            <StepCard
              icon={<CalendarCheck2 className="h-5 w-5" />}
              title="5) Follow‑Up Plan"
              text="Your clinician advises the next screening interval and any lifestyle or family‑screening recommendations."
            />
            <StepCard
              icon={<Activity className="h-5 w-5" />}
              title="Quality & Safety"
              text="Clinician‑led, neutral & non‑commercial. We work with accredited sites and evidence‑based guidance."
            />
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="py-10 bg-white border-t border-gray-200">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Ready to take the first step?</h3>
            <p className="text-gray-600">Early screening saves lives. Choose your best next action below.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/get-screened">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Find Screening</Button>
            </Link>
            <Link to="/find-a-specialist">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Book Colonoscopy</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer reassurance strip */}
      <section className="py-6 bg-gray-100 border-t border-gray-200">
        <Container className="text-sm text-gray-600">
          ✅ Neutral & non‑commercial · Public–private collaboration · Led by Singapore’s medical experts
        </Container>
      </section>
    </main>
  );
};

export default HowItWorksPage;
