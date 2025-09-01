import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Microscope, Activity, AlertCircle } from 'lucide-react';
import { ChampionChoiceModal } from '../components/ChampionChoiceModal';
import { useChampionChoice } from '../hooks/useChampionChoice';

const ScreeningPage: React.FC = () => {
  const { showModal, setShowModal, handleChoice } = useChampionChoice();

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Get Screened for Colorectal Cancer</h1>
            <p className="text-xl mb-0">
              Choose the screening option that suits you best - blood test or colonoscopy. Early action saves lives.
            </p>
          </div>
        </Container>
      </div>

      {/* Information Section */}
      <section className="py-12 bg-white">
        <Container>
          <Card className="bg-blue-50 border-l-4 border-blue-600">
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto text-gray-800 text-lg leading-relaxed space-y-4">
                <p>
                  If you're aged 50 or older, or have symptoms or risk indicators, it's important to go straight to a specialist for colonoscopy consultation. Colonoscopy remains the gold standard for early detection and prevention.
                </p>
                <p>
                  If you're not due for a colonoscopy - or if you're younger but have risk factors - a blood-based screening test may be right for you. It's a modern, non-invasive option approved for early triage.
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* Screening Options Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Option 1: GP for Blood-Based Screening */}
            <Card className="hover:shadow-lg transition duration-300 border-t-4 border-teal-600">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <Activity className="h-12 w-12 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">Blood-Based Screening via GP</h2>
                <p className="text-gray-600 mb-6 text-center flex-grow">
                  For individuals not due for colonoscopy, or those looking for a first-step screening option.
                </p>
                <Link to="/find-a-gp">
                  <Button variant="indigo" className="w-full text-lg">Get Screened - GP</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Option 2: Specialist for Blood-Based Screening */}
            <Card className="hover:shadow-lg transition duration-300 border-t-4 border-amber-600">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <Activity className="h-12 w-12 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">Blood-Based Screening via Specialist</h2>
                <p className="text-gray-600 mb-6 text-center flex-grow">
                  Prefer to consult directly with a Specialist for your screening? You can request the blood test directly with them.
                </p>
                <Link to="/find-a-specialist">
                  <Button variant="teal" className="w-full text-base">Get Screened - Specialist</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Option 3: Colonoscopy Consultation */}
            <Card className="hover:shadow-lg transition duration-300 border-t-4 border-blue-600">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <Microscope className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">Colonoscopy Consultation</h2>
                <p className="text-gray-600 mb-6 text-center flex-grow">
                  Recommended for adults aged 50+ or those with symptoms or family history. Colonoscopy removes polyps before they turn into cancer.
                </p>
                <Link to="/find-a-specialist">
                  <Button variant="primary" className="w-full text-lg">Get Scoped</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-blue-50">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">
                  Not Sure Which Option is Right for You?
                </h2>
                <p className="text-lg text-center text-gray-700 mb-8">
                  Let our support team help you decide based on your age, symptoms, or risk factors.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="primary"
                    className="w-full sm:w-auto text-base sm:text-lg lg:text-xl"
                    onClick={() => setShowModal(true)}>
                    Talk to Us
                  </Button>
                  <Link to="/clinics">
                    <Button variant="teal"
                      className="w-full sm:w-auto text-base sm:text-lg lg:text-xl">
                      View Screening Locations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Modal */}
      {showModal && (
        <ChampionChoiceModal
          type="screening"
          onClose={() => setShowModal(false)}
          onChoice={(hasDoctor) => handleChoice('screening', hasDoctor)}
        />
      )}
    </div>
  );
};

export default ScreeningPage;
