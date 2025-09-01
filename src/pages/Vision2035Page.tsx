import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Target, LineChart as ChartLineUp, Heart, BrainCircuit } from 'lucide-react';

const Vision2045Page: React.FC = () => {
  const navigate = useNavigate();

  const handleGetScreened = () => {
    navigate('/screening'); // Directly navigates to the Screening Page
  };

  return (
    <div className="pt-32">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our 10-Year National Vision — RID-CRC by 2035
            </h1>
            <p className="text-xl md:text-2xl">
              Project COLONAiVE™ is accelerating the fight with a 10-year target to eliminate colorectal cancer as a major public health threat in Singapore.
            </p>
          </div>
        </Container>
      </div>

      {/* Key Milestones Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Milestones to Achieve by 2035</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable targets that define our progress in outsmarting colorectal cancer nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card><CardContent><Target className="h-16 w-16 text-blue-600 mx-auto mb-4" /><div className="text-4xl font-bold text-blue-600">80%</div><h3>Screening Uptake</h3><p>National screening participation doubled by 2030.</p></CardContent></Card>
            <Card><CardContent><ChartLineUp className="h-16 w-16 text-teal-600 mx-auto mb-4" /><div className="text-4xl font-bold text-teal-600">50%</div><h3>Late-Stage CRC Drop</h3><p>Reduced Stage III/IV CRC diagnoses through early triage and timely colonoscopy.</p></CardContent></Card>
            <Card><CardContent><Heart className="h-16 w-16 text-red-600 mx-auto mb-4" /><div className="text-4xl font-bold text-red-600">80%</div><h3>Mortality Reduction</h3><p>Lives saved by reducing CRC-related deaths through early detection and timely treatment.</p></CardContent></Card>
            <Card><CardContent><BrainCircuit className="h-16 w-16 text-purple-600 mx-auto mb-4" /><div className="text-4xl font-bold text-purple-600">100%</div><h3>Public Awareness</h3><p>Every Singaporean knows that early screening can save lives.</p></CardContent></Card>
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Let's Outsmart Colorectal Cancer — Together.
            </h2>
            <p className="text-xl mb-8">
              Be part of Singapore's national effort to eliminate colorectal cancer through awareness, action, and access.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup/champion">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Join the Movement
                </Button>
              </Link>
              <Link to="/get-screened"> {/* Corrected Link */}
  <Button variant="indigo" size="lg" className="w-full sm:w-auto">
    Get Screened
  </Button>
</Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Vision2045Page;