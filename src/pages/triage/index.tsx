// /src/pages/triage/index.tsx
import React from 'react';
import { Container } from '../../components/ui/Container';
import ScreeningEligibilityWizard from '../../components/ScreeningEligibilityWizard';

const TriagePage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white py-20">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Advanced Screening Eligibility Wizard</h1>
            <p className="text-xl mb-8">
              Get personalized, country-specific guidance on your colorectal cancer screening needs with our Phase 4 intelligent triage system.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-sm max-w-3xl mx-auto">
              <p className="mb-3">
                <strong>🌍 Multi-Country Support:</strong> Adapted guidelines for Singapore, India, Philippines, Japan, and Australia
              </p>
              <p className="mb-3">
                <strong>🎯 Smart Triage Logic:</strong> Country-specific age thresholds and risk assessment algorithms
              </p>
              <p className="text-xs opacity-90">
                Instantly connects you to appropriate healthcare providers and screening options in your region.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Triage Wizard Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <ScreeningEligibilityWizard />
          </div>
        </Container>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Phase 4 Wizard Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="font-semibold mb-2">Multi-Country Logic</h3>
                <p className="text-sm text-gray-600">
                  Tailored algorithms for SG, IN, PH, JP, AU with country-specific thresholds
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Smart Risk Assessment</h3>
                <p className="text-sm text-gray-600">
                  Advanced triage with age-adjusted risk calculations per region
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Cost Information</h3>
                <p className="text-sm text-gray-600">
                  Real pricing data and insurance coverage info for each country
                </p>
              </div>
              <div className="p-6 bg-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="font-semibold mb-2">Direct CTAs</h3>
                <p className="text-sm text-gray-600">
                  Contextual next-step buttons based on risk level and location
                </p>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-sm text-gray-600">
                  Fully responsive design with keyboard navigation support
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Analytics Ready</h3>
                <p className="text-sm text-gray-600">
                  Built-in tracking hooks for engagement and conversion analysis
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600">
                  No data storage, complete anonymity with comprehensive disclaimers
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TriagePage;