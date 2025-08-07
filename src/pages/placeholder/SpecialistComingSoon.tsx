// Generic Specialist Directory Coming Soon Page
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { 
  UserCheck, 
  Calendar, 
  ArrowLeft, 
  BookOpen, 
  Newspaper,
  Search,
  Stethoscope,
  Award
} from 'lucide-react';

const SpecialistComingSoon: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-700 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Specialist Directory Coming Soon
              </h1>
              <p className="text-xl text-cyan-100">
                Connect with qualified gastroenterologists and colorectal specialists
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-6">
                <Stethoscope className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Find Colorectal Cancer Specialists
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Our specialist directory will connect you with board-certified gastroenterologists, 
                colorectal surgeons, and oncologists specializing in colorectal cancer prevention, 
                diagnosis, and treatment in your region.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full font-semibold">
                <Calendar className="h-5 w-5 mr-2" />
                Expected Launch: Early 2025
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What We're Building */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Specialist Features Coming Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Search className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
                  <p className="text-gray-600">
                    Filter by specialty, location, languages spoken, insurance accepted, 
                    and patient ratings.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Verified Credentials</h3>
                  <p className="text-gray-600">
                    All specialists are verified for board certification, hospital 
                    affiliations, and specialization in colorectal care.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Online Consultations</h3>
                  <p className="text-gray-600">
                    Book in-person appointments or virtual consultations with 
                    specialists based on your needs and preferences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Specialty Types */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Types of Specialists We'll Feature
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gastroenterologists</h3>
                  <p className="text-gray-600 text-sm">
                    Specialists in digestive system disorders and colorectal cancer screening procedures.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Colorectal Surgeons</h3>
                  <p className="text-gray-600 text-sm">
                    Surgical specialists for colorectal cancer treatment and complex procedures.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Oncologists</h3>
                  <p className="text-gray-600 text-sm">
                    Cancer specialists focusing on colorectal cancer treatment and care coordination.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preventive Medicine</h3>
                  <p className="text-gray-600 text-sm">
                    Specialists in screening programs and preventive colorectal cancer care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Temporary Singapore Link */}
      <section className="py-16 bg-gray-50 border-t">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Currently Available in Singapore
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              While we build our global specialist network, you can explore our Singapore 
              specialist directory to see the type of comprehensive profiles we're creating.
            </p>
            <a href="/find-a-specialist">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                <UserCheck className="mr-2 h-5 w-5" />
                View Singapore Specialists
              </Button>
            </a>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Learn More While You Wait
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Explore our educational resources to learn about colorectal cancer prevention 
              and the importance of specialist care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Homepage
                </Button>
              </a>
              <a href="/education">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn About CRC
                </Button>
              </a>
              <a href="/newsroom/crc-news-feed">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Newspaper className="mr-2 h-5 w-5" />
                  Latest Research
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SpecialistComingSoon;