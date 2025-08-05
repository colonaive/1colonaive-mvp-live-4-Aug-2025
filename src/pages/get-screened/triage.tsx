// /src/pages/get-screened/triage.tsx - Dedicated Screening Triage Route
import React from 'react';
import { Container } from '../../components/ui/Container';
import ScreeningEligibilityWizard from '../../components/ScreeningEligibilityWizard';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Target, Globe, Users, Activity } from 'lucide-react';

const GetScreenedTriagePage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <Container>
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/get-screened" className="text-blue-600 hover:text-blue-800 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Get Screened
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Eligibility Wizard</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Screening Path
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Our intelligent wizard analyzes your profile and location to recommend the most suitable 
              colorectal cancer screening approach for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                Multi-Country Support
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                Personalized Results
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Activity className="h-4 w-4 mr-2" />
                Instant Recommendations
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Wizard Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <ScreeningEligibilityWizard />
          </div>
        </Container>
      </section>

      {/* Additional Context Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Backed by International Guidelines
              </h2>
              <p className="text-gray-600">
                Our screening recommendations are based on evidence from leading health organizations worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇺🇸 USPSTF Guidelines</h3>
                <p className="text-gray-600">U.S. Preventive Services Task Force recommendations</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇸🇬 MOH Singapore</h3>
                <p className="text-gray-600">Ministry of Health screening protocols</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇦🇺 NBCSP Australia</h3>
                <p className="text-gray-600">National Bowel Cancer Screening Program</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇮🇳 ICMR Guidelines</h3>
                <p className="text-gray-600">Indian Council of Medical Research protocols</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇵🇭 DOH Philippines</h3>
                <p className="text-gray-600">Department of Health screening standards</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🇯🇵 MHLW Japan</h3>
                <p className="text-gray-600">Ministry of Health screening recommendations</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Don't wait for symptoms. Early detection saves lives and our wizard makes it easy to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/specialists">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Find Healthcare Providers
                </Button>
              </a>
              <a href="/education/patients/colorectal-cancer">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                  Learn More About CRC
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default GetScreenedTriagePage;