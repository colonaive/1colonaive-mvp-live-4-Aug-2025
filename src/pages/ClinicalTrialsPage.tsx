import React from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { TestTube, Info, Lock } from 'lucide-react';

const ClinicalTrialsPage: React.FC = () => {
  return (
    <div className="pt-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Clinical Trials Participation</h1>
          <p className="text-gray-600 mb-10">
            Our clinical trials offer opportunities to contribute to science, receive sponsored testing, and advance colorectal cancer screening research.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-4 mb-3">
                  <TestTube className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">Trial Overview</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Learn how CRC screening trials help validate new tools and improve early detection across age groups and risk categories.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-4 mb-3">
                  <Info className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">Eligibility & Benefits</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Find out if you're eligible. Some trials offer free testing or follow-up care as part of participation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-4 mb-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">Privacy Commitment</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  All information shared is securely stored and used only for trial-related communication under approved ethics protocols.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-left">
                <div className="flex items-center gap-4 mb-3">
                  <TestTube className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">Upcoming Trials</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Coming soon - blood-based screening studies and colonoscopy comparison trials across selected Singapore hospitals.
                </p>
              </CardContent>
            </Card>
          </div>

          <Link to="/signup-trial">
            <Button className="text-white mb-3">Express Interest in a Trial</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default ClinicalTrialsPage;