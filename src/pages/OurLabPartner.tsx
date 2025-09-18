// src/pages/OurLabPartner.tsx
import React, { useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Microscope, Award, Users, Clock, CheckCircle, ArrowRight, Building, MapPin, Star, Globe, Shield, Heart, ExternalLink } from 'lucide-react';

const OurLabPartnerPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Our Exclusive Lab Partner | Archerfish Precision Diagnostics | Project COLONAiVE™';
  }, []);

  const features = [
    {
      icon: <Microscope className="h-8 w-8 text-blue-600" />,
      title: "Advanced Technology",
      description: "Next-Generation Sequencing and molecular diagnostics with precision-driven testing protocols."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "ISO 15189 Certified",
      description: "CAP-equivalent accreditation ensuring the highest quality standards in laboratory operations."
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Fast Turnaround",
      description: "Rapid processing with industry-leading turnaround times for timely patient care decisions."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Team",
      description: "Highly skilled laboratory professionals with extensive experience in precision diagnostics."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Data Security",
      description: "PDPA-compliant secure data handling with robust privacy protection measures."
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Patient-Focused",
      description: "Dedicated to improving patient outcomes through accurate and meaningful diagnostic insights."
    }
  ];

  const services = [
    {
      title: "Next-Generation Sequencing (NGS)",
      description: "Comprehensive genomic analysis identifying genetic mutations in tumors for personalized cancer treatment planning."
    },
    {
      title: "Molecular Allergy Testing",
      description: "Advanced molecular techniques for precise allergen identification and personalized allergy management."
    },
    {
      title: "Nasopharyngeal Carcinoma Screening",
      description: "Early detection screening for nasopharyngeal cancer at its most treatable stages."
    },
    {
      title: "ColonAiQ® Processing",
      description: "Exclusive laboratory processing for ColonAiQ® Multi-Gene Methylation Detection Test - our flagship colorectal cancer screening solution."
    }
  ];

  const partnership = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Exclusive Laboratory Partner for Singapore"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Comprehensive Quality Management System"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Validated Standard Operating Procedures"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Dedicated ColonAiQ® Processing Facility"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Real-time Quality Control Monitoring"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      text: "Secure Sample Receipt & Result Delivery"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#0B1E3B] to-[#004F8C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img 
                  src="/assets/images/logo/Archerfish Logo.avif" 
                  alt="Archerfish Precision Diagnostics"
                  className="h-20 mx-auto filter brightness-0 invert"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Exclusive <span className="text-teal-400">Lab Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Archerfish Precision Diagnostics DX - revolutionizing healthcare through precise, 
              adaptable, and scientifically driven diagnostic solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.archerfishdx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Visit Archerfish Website
                <ExternalLink className="h-5 w-5" />
              </a>
              <a 
                href="/get-screened"
                className="border-2 border-white text-white hover:bg-white hover:text-[#0B1E3B] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Screened Now
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Partnership Overview */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Empowering Healthcare, <span className="text-blue-600">Improving Lives</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are proud to partner exclusively with Archerfish Precision Diagnostics DX for ColonAiQ® 
                test processing in Singapore. Together, we deliver accurate and meaningful insights that 
                empower healthcare providers to make informed decisions and improve patient outcomes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Partnership Excellence</h3>
                  <p className="text-gray-700 mb-6">
                    Archerfish Precision Diagnostics serves as our trusted exclusive laboratory partner, 
                    providing world-class processing capabilities for the ColonAiQ® Multi-Gene Methylation 
                    Detection Test. Their commitment to precision and quality aligns perfectly with Project 
                    COLONAiVE™'s mission to save lives through early detection.
                  </p>
                  <div className="space-y-3">
                    {partnership.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Singapore Facility</h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">StarHub Green, 67 Ubi Avenue 1</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">#06-06, Singapore 408942</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-blue-600">Archerfish?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Archerfish Precision Diagnostics brings cutting-edge technology, 
              rigorous quality standards, and unwavering commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive <span className="text-blue-600">Diagnostic Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From early disease detection to Next-Generation Sequencing, Archerfish specializes 
              in cutting-edge diagnostics that aid in optimal patient care decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 hover:border-blue-200 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ColonAiQ Focus */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-10 shadow-xl border border-teal-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-teal-100 rounded-full px-6 py-3 mb-4">
                  <Star className="h-6 w-6 text-teal-600 mr-2" />
                  <span className="text-teal-800 font-semibold">Flagship Partnership</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  ColonAiQ® Processing <span className="text-teal-600">Excellence</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  As our exclusive laboratory partner, Archerfish processes all ColonAiQ® Multi-Gene 
                  Methylation Detection Tests with uncompromising precision and quality standards.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Microscope className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Advanced Processing</h4>
                  <p className="text-gray-600 text-sm">State-of-the-art equipment and validated protocols</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Quality Assurance</h4>
                  <p className="text-gray-600 text-sm">Rigorous QC and continuous monitoring</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Rapid Results</h4>
                  <p className="text-gray-600 text-sm">Fast turnaround for timely patient care</p>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href="/get-screened"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                >
                  Start Your ColonAiQ® Journey
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact & Next Steps */}
      <section className="py-16 bg-[#0B1E3B] text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get <span className="text-teal-400">Screened?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Experience the precision and quality of our exclusive laboratory partnership. 
              Join thousands who have chosen Project COLONAiVE™ for their colorectal cancer screening.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">For Patients</h3>
                <p className="text-blue-100 mb-4">
                  Book your ColonAiQ® screening test and experience advanced diagnostics 
                  processed by our trusted laboratory partner.
                </p>
                <a 
                  href="/get-screened"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 inline-flex items-center gap-2"
                >
                  Book Screening
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">For Healthcare Providers</h3>
                <p className="text-blue-100 mb-4">
                  Join our network of healthcare providers and offer your patients 
                  access to cutting-edge colorectal cancer screening.
                </p>
                <a 
                  href="/find-a-specialist"
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2"
                >
                  Find Specialists
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-6 border border-teal-400/20">
              <p className="text-lg font-semibold text-teal-300 mb-2">
                🌟 Partnership Excellence Since 2025
              </p>
              <p className="text-blue-100">
                Archerfish Precision Diagnostics DX × Project COLONAiVE™ - 
                <strong className="text-white"> Scoped in Time, Saved in Time</strong>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default OurLabPartnerPage;