import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Heart } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>About COLONAiVE™ | National Movement to Outsmart Colorectal Cancer</title>
        <meta name="description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta name="keywords" content="COLONAiVE, colorectal cancer prevention, colonoscopy, Singapore, national movement, early detection" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://colonaive.com/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About COLONAiVE™ | National Movement to Outsmart Colorectal Cancer" />
        <meta property="og:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://colonaive.com/about" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About COLONAiVE™ | National Movement to Outsmart Colorectal Cancer" />
        <meta name="twitter:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="text-xl mb-0">
              Learn about the founding vision, mission, and human spirit behind Project COLONAiVE™.
            </p>
          </div>
        </Container>
      </div>

      {/* Brand Story Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">The Story Behind Our Name</h2>
              <p className="text-lg text-gray-600">
                Every great mission deserves a name that embodies its purpose and vision.
              </p>
            </div>

            {/* Brand Etymology Card */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-12 border border-blue-100">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-900 mb-4">
                  COLON<span className="text-teal-600">AiVE</span>™
                </div>
                <p className="text-lg text-gray-700 font-medium">
                  More than just a name - it's our mission statement
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    COLON
                  </div>
                  <h3 className="font-bold text-blue-900 mb-2">Target</h3>
                  <p className="text-sm text-gray-600">
                    Our focus: outsmarting colorectal cancer through early detection and prevention
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    Ai
                  </div>
                  <h3 className="font-bold text-teal-900 mb-2">Technology</h3>
                  <p className="text-sm text-gray-600">
                    Harnessing artificial intelligence to enhance screening accuracy and accessibility
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    VE
                  </div>
                  <h3 className="font-bold text-red-900 mb-2">Lives</h3>
                  <p className="text-sm text-gray-600">
                    Every life saved validates our mission and drives our continued innovation
                  </p>
                </div>
              </div>

              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-xl font-semibold text-gray-800">
                  To Outsmart '<span className="text-blue-600">COLON</span>' cancer using '<span className="text-teal-600">Ai</span>' to save li'<span className="text-red-500">VE</span>'s
                </p>
              </div>
            </div>

            {/* Mission Taglines - Using simple divs instead of Card components */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Scoped In Time</h3>
                  <p className="text-blue-100">
                    Early detection through advanced screening technology and clinical excellence
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-600 to-orange-500 text-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Saved In Time</h3>
                  <p className="text-orange-100">
                    Where screening meets treatment in a single procedure - the ultimate in preventive medicine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* About COLONAiVE Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
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
          </div>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              A Singapore where colorectal cancer is no longer a life-threatening disease, through screening and timely referral to colonoscopy for early detection and polyp removal - united by national action.
            </p>
          </div>
        </Container>
      </section>

      {/* Story Section - Five Pillars Narrative */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              In the fight against colorectal cancer (CRC), no single group can achieve victory alone. Clinicians, with all their skill and knowledge, can only treat patients who come forward. Patients, no matter how informed, can only take action if they have access to the right screening options and understand the life-saving value of early detection. Governments can set guidelines and allocate funds, but they cannot enforce healthy habits or ensure every individual gets screened.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              This is why Project COLONAiVE™ is built on five interconnected pillars - a unified, nationwide movement where every stakeholder has a role to play:
            </p>
            <ul className="space-y-4 text-left">
              <li><strong>RID-CRC PUB™ (Public Awareness):</strong> Empowering the public with clear, accurate information on CRC, dispelling fears, and motivating them to take action.</li>
              <li><strong>RID-CRC SGP™ (Clinician Engagement):</strong> Partnering with senior clinicians to champion CRC screening as a national priority.</li>
              <li><strong>RID-CRC GOV™ (Policy Alignment):</strong> Collaborating with government agencies to align policies with our mission.</li>
              <li><strong>RID-CRC CSR™ (Corporate Sponsorships):</strong> Engaging corporations to support awareness and screening initiatives.</li>
              <li><strong>RID-CRC EDU™ (Public Education):</strong> Providing accurate, accessible CRC information to empower every individual.</li>
            </ul>
            <p className="text-xl text-gray-700 leading-relaxed mt-8">
              Project COLONAiVE™ is a clinician-led movement, but it thrives on collective action. Together, we are building a culture of prevention and early intervention that will save lives.
            </p>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Movement</h2>
            <p className="text-xl text-gray-600 mb-8">
              Together, we can eliminate colorectal cancer as a major health threat in Singapore by 2035.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/join-the-movement">
                <Button variant="primary" className="w-full sm:w-auto">Join as a Champion</Button>
              </Link>
              <Link to="/vision2035">
                <Button variant="teal" className="w-full sm:w-auto">Learn About Our Vision</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default AboutUsPage;