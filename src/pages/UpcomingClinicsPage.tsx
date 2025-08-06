import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { MapPin, Mail, User, Globe, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';

const UpcomingClinicsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - replace with actual implementation
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const countries = [
    'Australia',
    'India', 
    'Philippines',
    'Japan',
    'Malaysia',
    'Thailand',
    'Vietnam',
    'Indonesia',
    'United States',
    'United Kingdom',
    'Canada',
    'Other'
  ];

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <Container className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Interest!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We've received your inquiry and will contact you as soon as we have 
              screening partners available in {formData.country}.
            </p>
            <div className="space-y-4">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  Return to Homepage
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Want to get screened in Singapore now?{' '}
                <Link to="/get-screened" className="text-blue-600 hover:text-blue-800 underline">
                  View Singapore options
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Upcoming List of Participating Clinics
            </h1>
            <p className="text-xl mb-4">
              We're expanding our screening network globally. Let us know where you'd like to get screened.
            </p>
            <p className="text-lg opacity-90">
              Currently available in Singapore • Expanding to your country soon
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Left Column: Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Coming Soon to Your Country
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Globe className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Global Expansion</h3>
                      <p className="text-gray-600">
                        We're partnering with healthcare providers worldwide to bring 
                        life-saving colorectal cancer screening to your area.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Quality Standards</h3>
                      <p className="text-gray-600">
                        All partner clinics meet our strict quality and evidence-based 
                        screening standards, ensuring the best care for our community.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Priority Notification</h3>
                      <p className="text-gray-600">
                        Submit your details and we'll notify you as soon as screening 
                        becomes available in your country.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Singapore CTA */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Want to get screened in Singapore?
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Our screening services are fully available in Singapore with 
                    multiple GP clinics and specialist centers.
                  </p>
                  <Link to="/get-screened">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      View Singapore Options
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div>
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Get Notified When We Launch
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Country Field */}
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="h-4 w-4 inline mr-2" />
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select your country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          <MessageSquare className="h-4 w-4 inline mr-2" />
                          Message / Inquiry
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about your screening needs or ask any questions..."
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'Sending...' : 'Notify Me When Available'}
                      </Button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      We respect your privacy and will only contact you about 
                      screening availability in your area.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Back Navigation */}
      <section className="py-8 border-t border-gray-200">
        <Container>
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default UpcomingClinicsPage;