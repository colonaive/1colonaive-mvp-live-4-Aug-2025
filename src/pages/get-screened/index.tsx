import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChampionChoiceModal } from '../../components/ChampionChoiceModal';
import ScreeningEligibilityWizard from '../../components/ScreeningEligibilityWizard';
import { RegionalScreeningCTA } from '../../components/SEOPageList';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Microscope, Target } from 'lucide-react';

const GetScreenedPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'gp' | 'specialist'>('gp');
  const navigate = useNavigate();

  const handleOpenModal = (type: 'gp' | 'specialist') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleChoice = (hasDoctor: boolean) => {
    setShowModal(false);
    if (hasDoctor) {
      navigate('/');
    } else {
      navigate('/clinics');
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Get Screened Today</h1>
            <p className="text-xl mb-6">
              Early detection can improve survival rates to over 90% for early-stage disease. Choose your preferred screening pathway based on evidence-backed options.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm">
              <p className="mb-2"><strong>Evidence-Based Benefit:</strong> Regular screening reduces CRC mortality by up to 62% in population studies</p>
              <p className="text-xs opacity-90">Source: Zhang et al. 2020 meta-analysis (PMC7477408)</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Screening Options */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* GP Card */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <Activity className="h-12 w-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4" id="blood-test">
                    Blood-Based Screening
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Modern blood-based screening technologies have demonstrated improved detection of early-stage disease compared to traditional methods in clinical studies. Advanced blood-based screening technologies are being evaluated by Singapore's Health Sciences Authority.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOpenModal('gp')}
                  >
                    Find a GP
                  </Button>
                </CardContent>
              </Card>

              {/* Specialist Card */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <Microscope className="h-12 w-12 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4" id="colonoscopy">
                    Colonoscopy Consultation
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Gold standard screening recommended for adults aged 45+, or earlier for those with family history or symptoms. Prevention through removal of precancerous lesions is highly cost-effective.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleOpenModal('specialist')}
                  >
                    Find a Specialist
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Screening Wizard CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 border border-blue-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <span className="text-2xl">🧪</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Not Sure Which Option to Choose?
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Try our new <strong>Screening Eligibility Wizard</strong> - an intelligent tool that provides personalized 
                  recommendations based on your age, location, family history, and symptoms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🌍</span>
                    Multi-country support
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🎯</span>
                    Smart risk assessment
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⚡</span>
                    Instant results
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#eligibility-check">
                    <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold">
                      Take Assessment Below
                    </Button>
                  </a>
                  <a href="/get-screened/triage">
                    <Button variant="outline">
                      Full Wizard Experience
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p className="mb-2"><strong>Clinical Evidence:</strong> Non-invasive screening improves participation rates by 2.1-fold</p>
              <p className="text-xs">Early-onset CRC incidence rising 15% in adults under 50 (USPSTF 2021)</p>
              <p className="mt-4">
                Have questions? <a href="/education/faqs" className="text-blue-600 hover:text-blue-800 underline">Visit our FAQ section</a>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Embedded Screening Eligibility Wizard */}
      <section className="py-16 bg-gray-50" id="eligibility-check">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🧪 Should You Get Screened? Take 1-Minute Assessment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get personalized screening recommendations based on your profile, location, and risk factors. 
                Our intelligent wizard guides you to the right screening approach.
              </p>
            </div>
            
            <ScreeningEligibilityWizard />
          </div>
        </Container>
      </section>

      {/* Regional Screening Options */}
      <section className="py-16 bg-white" id="clinics">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Healthcare Providers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with GPs and specialists in your area for colorectal cancer screening
              </p>
            </div>
            <RegionalScreeningCTA className="mb-12" />
          </div>
        </Container>
      </section>

      {/* Champion Choice Modal */}
      {showModal && (
        <ChampionChoiceModal
          type={modalType}
          onClose={() => setShowModal(false)}
          onChoice={handleChoice}
        />
      )}
    </div>
  );
};

export default GetScreenedPage;