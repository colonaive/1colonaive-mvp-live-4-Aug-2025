// /src/pages/triage/index.tsx
import React from 'react';
import { Container } from '../../components/ui/Container';
import ScreeningUrgencyWidget from '../../components/ScreeningUrgencyWidget';

const TriagePage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Screening Triage Assessment</h1>
            <p className="text-xl mb-8">
              Get personalized guidance on your colorectal cancer screening needs based on your age, symptoms, and risk factors.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm max-w-2xl mx-auto">
              <p className="mb-2">
                <strong>Evidence-Based Assessment:</strong> This tool uses clinical guidelines from USPSTF, AGA, and Singapore's health authorities.
              </p>
              <p className="text-xs opacity-90">
                Results connect you directly to appropriate healthcare providers in Singapore.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Triage Widget Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <ScreeningUrgencyWidget />
          </div>
        </Container>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Use Our Triage Tool?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Evidence-Based</h3>
                <p className="text-sm text-gray-600">
                  Based on international screening guidelines and Singapore clinical standards
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Immediate Results</h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations instantly with direct referral paths
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Your responses are not stored and remain completely confidential
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