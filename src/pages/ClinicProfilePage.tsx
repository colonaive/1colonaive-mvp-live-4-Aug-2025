import React from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Stethoscope, 
  Globe,
  Mail,
  Languages,
  Shield,
  ArrowRight,
  Calendar
} from 'lucide-react';

const ClinicProfilePage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Thomson Family Clinic</h1>
            </div>
            <p className="text-xl mb-4">Trusted CRC Screening Provider</p>
            <div className="flex gap-4">
              <Button variant="secondary">Book Appointment</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Contact Clinic
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-600">10 Jalan Bukit Merah</p>
                    <p className="text-gray-600">#01-01</p>
                    <p className="text-gray-600">Singapore 159456</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-teal-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Opening Hours</h3>
                    <p className="text-gray-600">Mon–Fri: 8am – 6pm</p>
                    <p className="text-gray-600">Sat: 8am – 1pm</p>
                    <p className="text-gray-600">Sun & PH: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-gray-600">+65 6123 4567</p>
                    <a href="mailto:info@thomsonclinic.sg" className="text-blue-600 hover:underline">
                      info@thomsonclinic.sg
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold">Available Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Blood-based CRC Screening (HSA-cleared test)',
                  'Consultation on gastrointestinal symptoms',
                  'Health screening packages for age 40+',
                  'Pre-colonoscopy consultation',
                  'FIT Test',
                  'Specialist referrals'
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Doctor Profile */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Dr. Mark Lee</h2>
                  <p className="text-gray-600 mb-2">Family Physician, MBBS (Singapore)</p>
                  <p className="text-gray-600 mb-4">
                    Over 15 years of experience managing chronic conditions and preventive screening.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Languages className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">English, Mandarin, Hokkien</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-none">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
                <p className="text-gray-700 mb-6">
                  Book your CRC screening appointment today and take a proactive step towards prevention.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button className="group">
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline">
                    Learn About Screening Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ClinicProfilePage;