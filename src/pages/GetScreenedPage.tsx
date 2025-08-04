import React, { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChampionChoiceModal } from '../components/ChampionChoiceModal';
import { useNavigate } from 'react-router-dom';
import { Activity, Microscope } from 'lucide-react';

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
                  <h2 className="text-2xl font-bold text-center mb-4">
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
                  <h2 className="text-2xl font-bold text-center mb-4">
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

            {/* Additional Information */}
            <div className="mt-12 bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-center mb-4">
                Not Sure Which Option to Choose?
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Our clinician-backed Champion Support Team can help guide you to the most suitable screening option based on current clinical guidelines, your age, family history, and risk factors.
              </p>
              <div className="text-center text-sm text-gray-600 mt-4">
                <p><strong>Clinical Evidence:</strong> Non-invasive screening improves participation rates by 2.1-fold</p>
                <p className="text-xs mt-1">Early-onset CRC incidence rising 15% in adults under 50 (USPSTF 2021)</p>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => handleOpenModal('gp')}>
                  Get Personalized Guidance
                </Button>
              </div>
            </div>
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