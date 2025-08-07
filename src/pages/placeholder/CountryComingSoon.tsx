// Country-Specific Coming Soon Placeholder Component
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { 
  MapPin, 
  Calendar, 
  Bell, 
  ArrowLeft, 
  BookOpen, 
  Newspaper,
  Mail,
  Globe
} from 'lucide-react';

interface CountryComingSoonProps {
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
  estimatedLaunch: string;
  primaryColor: string;
  accentColor: string;
}

const CountryComingSoon: React.FC<CountryComingSoonProps> = ({
  country,
  countryCode,
  flag,
  currency,
  estimatedLaunch,
  primaryColor,
  accentColor
}) => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${primaryColor} text-white py-16`}>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={flag} 
                alt={`${country} flag`} 
                className="w-16 h-16 rounded-full mr-4 shadow-lg"
              />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  COLONAiVE™ is Coming to {country}
                </h1>
                <p className="text-lg mt-2 opacity-90">
                  Revolutionary colorectal cancer screening solutions
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className={`inline-flex items-center justify-center w-20 h-20 ${accentColor} rounded-full mb-6`}>
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Launching Soon in {country}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We're working hard to bring our advanced colorectal cancer screening solutions to {country}. 
                Our comprehensive platform will include local clinics, specialists, and culturally-relevant 
                education materials designed specifically for the {country} healthcare landscape.
              </p>
              <div className={`inline-flex items-center px-6 py-3 ${accentColor} text-white rounded-full font-semibold`}>
                <Calendar className="h-5 w-5 mr-2" />
                Estimated Launch: {estimatedLaunch}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What's Coming */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What We're Building for {country}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${accentColor} rounded-lg mb-4`}>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Local Clinic Network</h3>
                  <p className="text-gray-600">
                    A comprehensive directory of certified clinics and healthcare providers 
                    offering colorectal cancer screening services across {country}.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${accentColor} rounded-lg mb-4`}>
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Specialist Directory</h3>
                  <p className="text-gray-600">
                    Connect with qualified gastroenterologists and oncologists 
                    specializing in colorectal cancer prevention and treatment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${accentColor} rounded-lg mb-4`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Localized Education</h3>
                  <p className="text-gray-600">
                    Educational content tailored to {country}'s healthcare system, 
                    cultural context, and local screening guidelines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Get Notified */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Bell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Be the First to Know
              </h2>
              <p className="text-lg text-gray-600">
                Subscribe to get notified when COLONAiVE™ launches in {country}. 
                We'll also send you valuable information about colorectal cancer prevention.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className={`${accentColor} hover:opacity-90 px-6 py-3 whitespace-nowrap`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${primaryColor} text-white`}>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              While You Wait, Explore Our Resources
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Learn about colorectal cancer prevention and stay updated with the latest research.
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

export default CountryComingSoon;