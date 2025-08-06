import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Support
            </h1>
            <p className="text-xl text-gray-600">
              We're here to help you on your colorectal cancer screening journey
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-600 mb-6">
                  Have questions about screening or our movement? Get in touch with our support team.
                </p>
                <Link to="/contact">
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>

            {/* Find Healthcare Provider */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Healthcare Providers</h3>
                <p className="text-gray-600 mb-6">
                  Need help finding a GP or specialist for screening? We can help you locate providers.
                </p>
                <div className="space-y-3">
                  <Link to="/find-a-gp" className="block">
                    <Button variant="outline" className="w-full">
                      Find a GP
                    </Button>
                  </Link>
                  <Link to="/find-a-specialist" className="block">
                    <Button variant="outline" className="w-full">
                      Find a Specialist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Educational Resources */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Resources</h3>
                <p className="text-gray-600 mb-6">
                  Learn more about colorectal cancer screening, symptoms, and prevention.
                </p>
                <Link to="/education">
                  <Button variant="outline" className="w-full">
                    View Resources
                  </Button>
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
                <p className="text-gray-600 mb-6">
                  Find answers to common questions about screening and our services.
                </p>
                <Link to="/education/faqs">
                  <Button variant="outline" className="w-full">
                    View FAQs
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Medical Emergency?</h3>
            <p className="text-red-700 mb-4">
              If you're experiencing severe abdominal pain, rectal bleeding, or other urgent symptoms, 
              please contact your healthcare provider immediately or call emergency services.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-red-800">Singapore Emergency: 995</p>
              <p className="font-semibold text-red-800">Non-Emergency Medical Advice: 1777</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button variant="outline">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SupportPage;