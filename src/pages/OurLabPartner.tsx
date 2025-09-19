// src/pages/OurLabPartner.tsx
import React, { useEffect } from "react";
import { Container } from "../components/ui/Container";
import {
  Microscope,
  Award,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Building,
  MapPin,
  Star,
  Globe,
  Shield,
  Heart,
  ExternalLink,
  ArrowDownRight,
  Activity,
  FileCheck2,
} from "lucide-react";

const OurLabPartnerPage: React.FC = () => {
  useEffect(() => {
    document.title =
      "Our Exclusive Lab Partner | Archerfish Precision Diagnostics | Project COLONAiVE™";
  }, []);

  const features = [
    {
      icon: <Microscope className="h-8 w-8 text-blue-600" />,
      title: "Advanced Technology",
      description:
        "Molecular diagnostics and precision PCR workflows with disciplined quality controls.",
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "ISO 15189 Certified",
      description:
        "Accredited medical laboratory quality system aligned to international best practices.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Fast Turnaround",
      description:
        "Efficient logistics and predictable TAT for timely care decisions and early referrals.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Team",
      description:
        "Experienced laboratory professionals with deep practice in cancer diagnostics.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Data Security",
      description:
        "PDPA-aligned data handling with privacy-by-design safeguards across the pipeline.",
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Patient-Focused",
      description:
        "A shared commitment to earlier detection and better outcomes for families in Singapore.",
    },
  ];

  const services = [
    {
      title: "Molecular Oncology",
      description:
        "Precision PCR and methylation-based workflows to support screening and surveillance use cases.",
    },
    {
      title: "Allergy & Molecular Testing",
      description:
        "Advanced molecular techniques for allergen identification and personalized management.",
    },
    {
      title: "Nasopharyngeal Screening",
      description:
        "Evidence-led early detection pathways for nasopharyngeal carcinoma (NPC).",
    },
    {
      title: "ColonAiQ® Processing",
      description:
        "Exclusive laboratory processing for COLONAiVE™ blood-based screening pathway.",
    },
  ];

  const partnership = [
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Exclusive Laboratory Partner for Singapore" },
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Comprehensive Quality Management System" },
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Validated Standard Operating Procedures" },
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Dedicated ColonAiQ® Processing Facility" },
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Real-time Quality Control Monitoring" },
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Secure Sample Receipt & Result Delivery" },
  ];

  // regulatory chips (kept short so they don't truncate; wraps on small screens)
  const regChips: string[] = ["CE IVD", "NMPA Class III", "HSA-cleared"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-[#0B1E3B] to-[#004F8C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo with format fallbacks */}
            <div className="flex justify-center mb-8">
              <div className="rounded-2xl bg-white/0 p-0">
                <picture>
                  <source type="image/avif" srcSet="/assets/images/logo/archerfish-logo-white.avif" />
                  <source type="image/webp" srcSet="/assets/images/logo/archerfish-logo-white.webp" />
                  <img
                    src="/assets/images/logo/archerfish-logo-white.png"
                    alt="Archerfish Precision Diagnostics"
                    className="h-20 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
                    width={320}
                    height={80}
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Exclusive <span className="text-teal-400">Lab Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Archerfish Precision Diagnostics — delivering precise, adaptable, and
              scientifically-driven diagnostics in support of Project COLONAiVE™.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.archerfishdx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Visit Archerfish Website
                <ExternalLink className="h-5 w-5" />
              </a>
              <a
                href="/get-screened"
                className="border-2 border-white text-white hover:bg-white hover:text-[#0B1E3B] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Get Screened Now
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Container>

        {/* lab banner images */}
        <div className="mt-10">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 px-6 md:px-8">
            {[
              { src: "/assets/images/lab/lab-plasma-pipetting.webp", alt: "Plasma pipetting inside a biosafety cabinet" },
              { src: "/assets/images/lab/lab-qpcr-plate-d.webp", alt: "Sealed 96-well PCR plate being loaded into a qPCR instrument" },
              { src: "/assets/images/lab/lab-centrifuge-plasma-d.webp", alt: "EDTA tube with pale plasma layer above a centrifuge rotor" },
            ].map((img) => (
              <div
                key={img.src}
                className="relative h-40 md:h-44 overflow-hidden rounded-xl border border-white/10"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                  width={1600}
                  height={900}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Empowering Healthcare, <span className="text-blue-600">Improving Lives</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We partner exclusively with Archerfish Precision Diagnostics DX for blood-based colorectal
                cancer screening test processing in Singapore. Together, we deliver high-quality insights
                that help healthcare providers make informed decisions and accelerate timely colonoscopy
                for those who need it.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Partnership Excellence</h3>
                  <p className="text-gray-700 mb-6">
                    Archerfish serves as our dedicated lab, operating validated, quality-controlled
                    workflows that align with COLONAiVE™’s clinician-led national movement ethos.
                  </p>
                  <div className="space-y-3">
                    {partnership.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Singapore Facility</h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">StarHub Green, 67 Ubi Avenue 1</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">#06-06, Singapore 408942</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Archerfish */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-blue-600">Archerfish?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cutting-edge molecular workflows, rigorous quality standards, and an unwavering focus on
              patient outcomes—right here in Singapore.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <article
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive <span className="text-blue-600">Diagnostic Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From early detection to molecular testing, Archerfish supports patient care with disciplined,
              high-reliability diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 hover:border-blue-200 transition-colors duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Regulatory & Clinical Journey (neutral, factual) */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
              Safe, Validated & Patient-Journey Aligned
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Regulatory facts + chips */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Regulatory Facts</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <FileCheck2 className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      CE Marked, China NMPA registered and <strong>Singapore HSA-cleared</strong> blood-based
                      screening test processed by our partner lab.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck2 className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      Per movement policy, we communicate this as a <em>validated option</em> offered to eligible
                      individuals to support timely colonoscopy.
                    </span>
                  </li>
                </ul>

                {/* non-truncating chips */}
                <ul className="mt-6 flex flex-wrap gap-3">
                  {regChips.map((label: string) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-200
                                 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                      <span className="whitespace-nowrap">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical journey */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Intended Use & Clinical Journey</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Screening & early detection for eligible, average-risk adults.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Post-treatment relapse risk monitoring and surveillance support.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowDownRight className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>
                      Those flagged as high-risk are referred for timely colonoscopy — where <em>treatment begins
                      while screening</em>.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Inline workflow */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                How the Lab Workflow Supports You
              </h4>
              <div className="overflow-x-auto">
                <div className="min-w-[720px] mx-auto grid grid-cols-4 gap-6 items-center">
                  {[
                    { title: "Blood Draw", desc: "Single tube at clinic" },
                    { title: "Plasma Prep", desc: "Centrifugation & QC" },
                    { title: "PCR Analysis", desc: "Validated methylation workflow" },
                    { title: "Clinical Report", desc: "Results to your doctor" },
                  ].map((step, idx) => (
                    <div key={idx} className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 border border-teal-200 flex items-center justify-center">
                        <span className="text-teal-700 font-bold">{idx + 1}</span>
                      </div>
                      <p className="mt-3 font-semibold text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ColonAiQ Focus */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-10 shadow-xl border border-teal-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-teal-100 rounded-full px-6 py-3 mb-4">
                  <Star className="h-6 w-6 text-teal-600 mr-2" />
                  <span className="text-teal-800 font-semibold">Flagship Partnership</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  ColonAiQ® Processing <span className="text-teal-600">Excellence</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  As our exclusive laboratory partner, Archerfish processes ColonAiQ® tests using
                  validated, tightly controlled workflows that put patient safety first.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Microscope className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Advanced Processing</h4>
                  <p className="text-gray-600 text-sm">Modern instruments & validated SOPs</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Quality Assurance</h4>
                  <p className="text-gray-600 text-sm">Rigorous QC & continuous monitoring</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Rapid Results</h4>
                  <p className="text-gray-600 text-sm">Predictable turnaround times</p>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="/get-screened"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                >
                  Start Your ColonAiQ® Journey
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0B1E3B] text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get <span className="text-teal-400">Screened?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Experience the assurance of a validated, clinician-led pathway supported by our exclusive
              laboratory partnership in Singapore.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">For Patients</h3>
                <p className="text-blue-100 mb-4">
                  Book your screening and take a confident step toward early detection.
                </p>
                <a
                  href="/get-screened"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center gap-2"
                >
                  Book Screening
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">For Healthcare Providers</h3>
                <p className="text-blue-100 mb-4">
                  Join our trusted network and offer modern blood-based screening to your patients.
                </p>
                <a
                  href="/find-a-specialist"
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2"
                >
                  Find Specialists
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-6 border border-teal-400/20">
              <p className="text-lg font-semibold text-teal-300 mb-2">🌟 Partnership Excellence Since 2025</p>
              <p className="text-blue-100">
                Archerfish Precision Diagnostics DX × Project COLONAiVE™ —{" "}
                <strong className="text-white">Scoped in Time, Saved in Time</strong>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default OurLabPartnerPage;
