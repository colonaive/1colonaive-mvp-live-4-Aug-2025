// src/pages/education/patients/CRC-Singapore Story.tsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from '../../../components/ui/Container';
import { Link } from 'react-router-dom';
import CRCAwarenessImage from '../../../assets/images/crc-awareness.webp';

const CRCSingaporeStory: React.FC = () => {
  return (
    <div className="pt-32">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Colorectal Cancer in Singapore - Project COLONAiVE™</title>
        <meta
          name="description"
          content="Discover the impact of colorectal cancer in Singapore, its symptoms, screening methods, and how Project COLONAiVE™ is driving awareness and early detection."
        />
        <meta
          name="keywords"
          content="colorectal cancer Singapore, CRC screening, Project COLONAiVE, colorectal cancer awareness, CRC symptoms"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.colonaive.ai/education/patients/CRC-Singapore-Story" />

        {/* Open Graph (OG) Tags for Social Sharing */}
        <meta property="og:title" content="Colorectal Cancer in Singapore - Project COLONAiVE™" />
        <meta property="og:description" content="Learn about colorectal cancer in Singapore, its impact, risk factors, symptoms, screening methods, and how Project COLONAiVE™ is making a difference." />
        <meta property="og:image" content="https://www.colonaive.ai/assets/images/crc-awareness.webp" />
        <meta property="og:url" content="https://www.colonaive.ai/education/patients/CRC-Singapore-Story" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Colorectal Cancer in Singapore - Project COLONAiVE™" />
        <meta name="twitter:description" content="Discover the impact of colorectal cancer in Singapore and how Project COLONAiVE™ is making a difference." />
        <meta name="twitter:image" content="https://www.colonaive.ai/assets/images/crc-awareness.webp" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Colorectal Cancer - The Singapore Story</h1>
            <p className="text-xl mb-0">
              Understanding the impact of colorectal cancer in Singapore and how Project COLONAiVE™ is making a difference.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-lg text-gray-700">
            <h2>The Reality of Colorectal Cancer in Singapore</h2>
            <img 
              src={CRCAwarenessImage} 
              alt="Colorectal Cancer Awareness in Singapore - Learn and Get Screened" 
              className="my-6 rounded-md shadow-lg" 
              loading="lazy" 
              width="800" 
              height="450" 
            />
            <p>Colorectal cancer is the second-leading cause of cancer deaths in Singapore, following only lung cancer in men and breast cancer in women.</p>
            
            <h3>Key Statistics</h3>
            <ul>
              <li><strong>Men:</strong> Approximately 16.2% of all new cancer cases.</li>
              <li><strong>Women:</strong> Approximately 12.9% of all new cancer cases.</li>
              <li><strong>Overall:</strong> Second only to prostate cancer in men and breast cancer in women.</li>
            </ul>

            <h2>Common Symptoms of Colorectal Cancer</h2>
            <ul>
              <li>Changes in bowel habits, Blood in stool, Abdominal discomfort</li>
              <li>Weakness, Weight loss, Anemia</li>
            </ul>

            <h2>Colorectal Cancer Screening in Singapore</h2>
            <p>Screening methods include Colonoscopy, FIT, and the new HSA-Registered Blood-Based Test (ColonAiQ®).</p>
            <Link to="/get-screened" className="text-blue-600 underline">Get Screened Now</Link>

            <h2>How Project COLONAiVE™ is Making a Difference</h2>
            <p>Project COLONAiVE™ is driving awareness, early detection, and improved screening rates through <strong>RID-CRC™ initiatives</strong>.</p>
            <Link to="/join-the-movement" className="text-blue-600 underline">Join the Movement</Link>

            <h2>Your Role: Get Screened, Stay Safe</h2>
            <p>Early detection saves lives. Begin screening at age 50, or earlier if you have risk factors.</p>

            <h2>Disclaimer</h2>
            <p>The above statistics are based on Singapore’s national cancer data (Singapore Cancer Registry Annual Report 2022) covering the years up to 2022.</p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CRCSingaporeStory;
