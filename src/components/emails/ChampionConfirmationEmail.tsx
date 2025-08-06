import React from 'react';
import { Container } from '../ui/Container';
import { Card, CardContent } from '../ui/Card';

interface ChampionConfirmationEmailProps {
  championName: string;
  appointmentDetails?: {
    clinic: string;
    date: string;
    time: string;
  };
}

const ChampionConfirmationEmail: React.FC<ChampionConfirmationEmailProps> = ({
  championName,
  appointmentDetails
}) => {
  return (
    <Container className="py-8 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Thank You, Champion {championName}!
            </h1>
            <p className="text-gray-600">
              Your screening journey begins here.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <p className="text-gray-700">
              We have received your appointment request and our Champion Support Team 
              is already preparing the next steps.
            </p>

            {appointmentDetails && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="font-semibold text-gray-900 mb-4">Appointment Details</h2>
                <div className="space-y-2 text-gray-700">
                  <p>Clinic: {appointmentDetails.clinic}</p>
                  <p>Date: {appointmentDetails.date}</p>
                  <p>Time: {appointmentDetails.time}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="font-semibold text-blue-900 mb-4">What happens next?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Our Champion Support Team will review your request
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  We'll contact you within 1 business day to confirm details
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  You'll receive final confirmation with preparation instructions
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-gray-700 mb-4">
                While waiting, you can explore more resources on our portal:
              </p>
              <div className="space-y-2">
                <a 
                  href="/education/patients"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Patient Education Hub →
                </a>
                <a 
                  href="/early-symptoms"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Understanding Early Symptoms →
                </a>
                <a 
                  href="/get-screened"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Screening Options →
                </a>
              </div>
            </div>

            <div className="text-center text-gray-700">
              <p className="mb-2">
                Stay strong, Champion! 🌟
              </p>
              <p>
                Together, we are building a CRC-safe future.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Project COLONAiVE™ - Together, We Outsmart CRC</p>
            <p className="mt-2">
              Questions? Contact our Champion Support Team at{' '}
              <a 
                href="mailto:info@colonaive.ai"
                className="text-blue-600 hover:text-blue-800"
              >
                info@colonaive.ai
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ChampionConfirmationEmail;