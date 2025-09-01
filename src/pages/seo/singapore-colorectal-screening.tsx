import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function SingaporeColorectalScreening() {
  const url = "https://www.colonaive.ai/seo/singapore-colorectal-screening";
  return (
    <main className="pt-28">
      <Helmet>
        <title>Colorectal Cancer Screening in Singapore | COLONAiVE</title>
        <meta
          name="description"
          content="Who should be screened, screening options available in Singapore (FIT/FOBT stool tests, colonoscopy, and blood-based tests), how to get started, and access considerations."
        />
        <link rel="canonical" href={url} />
        {/* MedicalWebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "url": url,
            "inLanguage": "en"
          })}
        </script>
        {/* FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What age should I start screening?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "In Singapore, average-risk adults are generally advised to start screening at age 45. Higher-risk individuals-such as those with a strong family history or certain medical conditions-may need earlier and/or more frequent screening as advised by their clinician."
                }
              },
              {
                "@type": "Question",
                "name": "Which tests are available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Common options include FIT/FOBT stool tests (non-invasive annual checks), colonoscopy (gold standard that can also remove precancerous polyps), and newer blood-based tests. Your clinician can help match the approach to your risk and preferences."
                }
              },
              {
                "@type": "Question",
                "name": "Is a blood test enough?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Blood-based tests can improve participation and detect risk signals, but colonoscopy remains the gold standard for detecting and removing polyps. Positive non-invasive tests typically require a follow-up colonoscopy."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I screen if results are normal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Intervals depend on the test and your risk profile. FIT is commonly annual when normal; colonoscopy intervals are often 10 years after a normal exam, per clinician guidance."
                }
              },
              {
                "@type": "Question",
                "name": "When should I see a specialist?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "If you have symptoms such as rectal bleeding, unexplained weight loss, persistent changes in bowel habits, or a positive screening result, seek specialist evaluation."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Colorectal Cancer Screening in Singapore
          </h1>
          <p className="text-lg opacity-95">
            Early detection saves lives. This guide outlines who should get screened,
            the screening options available locally, and how to take the next step.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-4xl py-12 prose prose-lg">
        <h2>Who should get screened?</h2>
        <p>
          Average-risk adults are generally advised to begin screening at age 45.
          Individuals with higher risk-such as a family history of colorectal cancer
          or certain inherited conditions-may need to start earlier and screen more
          frequently. Screening is intended for people without symptoms; anyone with
          symptoms should seek medical evaluation promptly.
        </p>

        <h2>Screening options in Singapore (stool / colonoscopy / blood-based)</h2>
        <p>
          <strong>FIT/FOBT stool tests</strong> are non-invasive, quick, and typically
          performed yearly when results are normal. A positive result usually leads to
          <strong>colonoscopy</strong>, the gold standard that can detect and remove
          precancerous polyps in the same procedure. <strong>Blood-based</strong>
          screening can improve participation and detect risk signals for people who
          may avoid stool-based testing; however, it does not replace colonoscopy.
          Discuss the right approach with your clinician.
        </p>

        <h2>How to get started</h2>
        <p>
          Speak with your GP or a screening clinic to select a suitable option based on
          your age, risk profile, and preferences. Public polyclinics and private providers
          can help arrange stool testing or colonoscopy, and guide follow-up if results
          are positive. Learn more in our{" "}
          <Link to="/education/patients/screening">screening guide</Link> and{" "}
          <Link to="/education/patients/colorectal-cancer">Colorectal Cancer 101</Link>. Visit the{" "}
          <Link to="/seo">SEO hub</Link> for location-specific resources.
        </p>

        <h2>Costs & access</h2>
        <p>
          Access pathways include public polyclinics and private clinics. Financial support
          mechanisms may apply for eligible patients; speak to your provider about what is
          available for your situation. Costs vary by test type, facility, and clinical needs-
          your clinician can advise which route is most appropriate.
        </p>
      </section>
    </main>
  );
}
