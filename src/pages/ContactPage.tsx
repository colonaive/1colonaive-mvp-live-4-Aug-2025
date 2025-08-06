import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'clinical', label: 'Clinical Partnership' },
    { value: 'media', label: 'Media & Press' },
    { value: 'sponsorship', label: 'Sponsorship & CSR' },
    { value: 'other', label: 'Other' }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll just console.log the data
      // This can be replaced with Supabase or Netlify Forms later
      console.log('Contact form submission:', {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});

    } catch (error) {
      console.error('Error submitting form:', error);
      // In a real implementation, you'd show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32">
        <Helmet>
          <title>Thank You | Contact COLONAiVE™</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow-md p-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
                <p className="text-lg text-gray-600 mb-6">
                  We've received your message and will be in touch soon.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Our team typically responds within 1-2 business days.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="primary">
                  Send Another Message
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-32">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Contact Us | COLONAiVE™ - Get in Touch</title>
        <meta name="description" content="Contact the COLONAiVE™ team for clinical partnerships, media inquiries, sponsorship opportunities, or general questions about colorectal cancer screening." />
        <meta name="keywords" content="contact COLONAiVE, clinical partnership, media inquiry, sponsorship, colorectal cancer screening contact" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://colonaive.com/contact" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Us | COLONAiVE™ - Get in Touch" />
        <meta property="og:description" content="Contact the COLONAiVE™ team for clinical partnerships, media inquiries, sponsorship opportunities, or general questions about colorectal cancer screening." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://colonaive.com/contact" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Us | COLONAiVE™ - Get in Touch" />
        <meta name="twitter:description" content="Contact the COLONAiVE™ team for clinical partnerships, media inquiries, sponsorship opportunities, or general questions about colorectal cancer screening." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl mb-0">
              Get in touch with the COLONAiVE™ team for partnerships, inquiries, or support.
            </p>
          </div>
        </Container>
      </div>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                    
                    <form onSubmit={handleSubmit} name="contact" method="POST" data-netlify="true">
                      {/* Netlify form detection */}
                      <input type="hidden" name="form-name" value="contact" />
                      
                      <InputField
                        id="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        error={errors.fullName}
                        autoComplete="name"
                      />

                      <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        error={errors.email}
                        autoComplete="email"
                      />

                      <InputField
                        id="subject"
                        label="Subject"
                        type="select"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Select inquiry type"
                        required
                        error={errors.subject}
                        options={subjectOptions}
                      />

                      <InputField
                        id="message"
                        label="Message"
                        textarea
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        required
                        error={errors.message}
                        className="mb-6"
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        variant="primary"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">
                    We'd love to hear from you. Choose the best way to reach our team for your specific inquiry.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@colonaive.com</p>
                      <p className="text-sm text-gray-500">We typically respond within 1-2 business days</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Singapore Medical District</p>
                      <p className="text-gray-600">Central Region, Singapore</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Partnership Inquiries</h3>
                      <p className="text-gray-600">For clinical partnerships and collaborations</p>
                      <p className="text-sm text-gray-500">Use the contact form for fastest response</p>
                    </div>
                  </div>
                </div>

                {/* Response Times */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Response Times</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>General Inquiries:</strong> 1-2 business days</li>
                    <li><strong>Clinical Partnerships:</strong> 3-5 business days</li>
                    <li><strong>Media Requests:</strong> Same day (urgent)</li>
                    <li><strong>Sponsorship:</strong> 2-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;