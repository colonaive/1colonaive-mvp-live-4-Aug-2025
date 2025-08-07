// Generic Clinic Finder Coming Soon Page
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  BookOpen, 
  Newspaper,
  Search,
  Building2
} from 'lucide-react';

const ClinicFinderComingSoon: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Clinic Directory Coming Soon
              </h1>
              <p className="text-xl text-blue-100">
                We're building a comprehensive network of certified screening clinics
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Find Certified Screening Clinics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Our clinic directory will help you find qualified healthcare providers 
                offering colorectal cancer screening services in your area. We're currently 
                partnering with clinics worldwide to ensure quality and accessibility.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold">
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
              What You Can Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
                  <p className="text-gray-600">
                    Find clinics by location, screening type, insurance acceptance, 
                    and appointment availability.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Verified Providers</h3>
                  <p className="text-gray-600">
                    All clinics are verified for quality standards and proper 
                    certification for colorectal cancer screening.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
                  <p className="text-gray-600">
                    Book appointments directly through our platform with 
                    real-time availability and confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Temporary Singapore Link */}
      <section className="py-16 bg-white border-t">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Currently Available in Singapore
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              While we build our global network, you can explore our Singapore clinic directory 
              as a preview of what's coming to your region.
            </p>
            <a href="/find-a-gp">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <MapPin className="mr-2 h-5 w-5" />
                View Singapore Clinics
              </Button>
            </a>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Explore While You Wait
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Learn about colorectal cancer screening and prevention while we build 
              our comprehensive clinic network.
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

export default ClinicFinderComingSoon;