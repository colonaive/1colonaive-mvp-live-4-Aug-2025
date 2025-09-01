import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import { RegionalScreeningCTA } from '../../../components/SEOPageList';

const ColorectalCancerPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Understanding Colorectal Cancer | COLONAiVE™ Patient Education</title>
        <meta name="description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta name="keywords" content="colorectal cancer, symptoms, risk factors, prevention, early detection, COLONAiVE" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.colonaive.ai/education/patients/colorectal-cancer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Understanding Colorectal Cancer | COLONAiVE™ Patient Education" />
        <meta property="og:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.colonaive.ai/education/patients/colorectal-cancer" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Understanding Colorectal Cancer | COLONAiVE™ Patient Education" />
        <meta name="twitter:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
      
      <script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Colorectal Cancer: Overview",
  "url": "https://www.colonaive.ai/education/patients/colorectal-cancer",
  "about": [{
    "@type": "MedicalCondition",
    "name": "Colorectal cancer"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "Project COLONAiVE",
    "url": "https://www.colonaive.ai"
  }
}, null, 2)}
</script>

<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Education", "item": "https://www.colonaive.ai/education" },
    { "@type": "ListItem", "position": 2, "name": "Patients",  "item": "https://www.colonaive.ai/education/patients" },
    { "@type": "ListItem", "position": 3, "name": "Colorectal Cancer" }
  ]
}, null, 2)}
</script>


      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Understanding Colorectal Cancer</h1>
            <p className="text-xl mb-0">
              Learn about what colorectal cancer is, how it develops, and why early detection matters.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">

              <h2>Introduction</h2>
              <p>
                Colorectal cancer is a common and potentially life-threatening disease that begins in the colon or rectum.
                It typically develops slowly over several years and often starts as non-cancerous polyps. 
                Detecting and removing these polyps early can prevent the development of cancer.
              </p>

              <h2>Symptoms</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Persistent changes in bowel habits</li>
                <li>Rectal bleeding or blood in stool</li>
                <li>Abdominal pain or cramps</li>
                <li>Unexplained weight loss</li>
                <li>Fatigue or weakness</li>
              </ul>

              <h2>Risk Factors</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Age over 50</li>
                <li>Family history of colorectal cancer</li>
                <li>Inflammatory bowel disease (IBD)</li>
                <li>Low-fiber, high-fat diet</li>
                <li>Smoking and heavy alcohol use</li>
                <li>Sedentary lifestyle</li>
              </ul>

              <h2>Prevention</h2>
              <p>
                Preventive strategies include regular screening (such as stool tests, colonoscopy, or blood-based screening),
                a healthy high-fiber diet, regular physical activity, avoiding tobacco, and limiting alcohol intake.
              </p>

              <h2>Importance of Early Detection</h2>
              <p>
                When detected early, colorectal cancer is highly treatable and often curable.
                Routine screening helps identify cancer at an earlier stage - or even before it develops -
                significantly improving treatment outcomes and survival rates.
              </p>

              <h2>Treatment Options</h2>
              <p>
                Treatment depends on the cancer's stage and location. Options may include surgery to remove tumors,
                chemotherapy, radiation therapy, or targeted therapies. Early-stage cancers may be resolved with
                less invasive procedures and fewer long-term complications.
              </p>

              <h2 className="text-xl font-semibold mb-2">🧠 About COLONAiVE™</h2>
              <p>
                COLONAiVE™ is a national movement to outsmart colorectal cancer and reduce CRC-related
                mortality through early detection, inclusive education, and access to clinically validated
                screening technologies. Founded in Singapore, the movement champions colonoscopy as the
                gold standard - the only screening method that both detects and removes precancerous
                polyps, making it the only true preventive option. COLONAiVE™ also supports HSA-cleared,
                blood-based screening tools to help more people get tested before symptoms appear. Guided
                by leading specialists and driven by partnerships across Asia-Pacific, the initiative
                empowers individuals to know when and how to screen - turning awareness into life-saving
                action. Its foundation is built on clinical evidence, real-world health impact, and
                multilingual tools that reach underserved and younger populations.
              </p>

              <h2>Support & Resources</h2>
              <p>
                Project COLONAiVE™ is committed to supporting individuals with information, access to screening,
                and connections to trusted clinicians. You're not alone - whether you're learning, screening, or recovering,
                we're with you every step of the way.
              </p>

              <div className="text-center border-t border-gray-200 pt-12 mt-12">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Knowledge saves lives.
                </p>
                <p className="text-lg text-blue-600 font-bold">
                  Begin your colorectal cancer prevention journey today with Project COLONAiVE™.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* Regional Screening Options */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <RegionalScreeningCTA />
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ColorectalCancerPage;
