import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  Target,
  Microscope,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse
} from 'lucide-react';

const HowCRCDevelopsFromPolyps: React.FC = () => {
  const polypTypes = [
    {
      icon: <Target className="h-6 w-6 text-danger-500" />,
      title: "Adenomatous Polyps (Adenomas)",
      description: "Most likely to become cancerous. Primary targets for screening and removal.",
      details: [
        "Can take 5-10 years to become cancerous",
        "Most common type of precancerous polyp",
        "Removal prevents cancer development"
      ]
    },
    {
      icon: <Activity className="h-6 w-6 text-info-500" />,
      title: "Hyperplastic and Inflammatory Polyps",
      description: "Usually benign but still require monitoring.",
      details: [
        "Generally not precancerous",
        "May indicate other health issues",
        "Regular monitoring recommended"
      ]
    }
  ];

  const preventionBenefits = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-success-500" />,
      title: "Prevention",
      description: "Removing adenomas during colonoscopy prevents cancer development"
    },
    {
      icon: <Microscope className="h-6 w-6 text-indigo-500" />,
      title: "Reduced Treatment Needs",
      description: "Early intervention avoids need for aggressive treatments"
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-info-500" />,
      title: "Better Outcomes",
      description: "Early detection dramatically improves survival rates"
    }
  ];

  return (
    <div className="pt-32">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">How Colorectal Cancer Develops from Polyps</h1>
            <p className="text-xl mb-0">
              Understanding the progression from polyps to cancer and why early detection matters.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8">
                Most colorectal cancers begin as small, benign growths called polyps inside the colon or rectum.
                Understanding this progression is key to prevention.
              </p>

              <h2 className="text-2xl font-bold mb-6">What Are Polyps?</h2>
              <div className="grid grid-cols-1 gap-6 mb-12">
                {polypTypes.map((type, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1">{type.icon}</div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                          <p className="text-gray-600 mb-4">{type.description}</p>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {type.details.map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6">How Polyps Become Cancer</h2>
              <Card className="bg-gradient-to-r from-blue-50 to-white mb-8 border border-blue-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-4">The Progression Timeline</h3>
                      <p className="text-gray-700 mb-4">
                        The transformation from a benign polyp to a cancerous tumor typically takes
                        <span className="font-semibold"> 5-10 years</span> — providing a critical
                        window for early detection and prevention.
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-gray-600">
                          Left untreated, some polyps can undergo abnormal changes in their DNA and
                          gradually grow into invasive cancer. This slow progression is why regular
                          screening is so effective at prevention.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-12">
                <h3 className="text-lg font-bold text-amber-800 mb-2">Important Note</h3>
                <p className="text-amber-700">
                  Regular screening, especially colonoscopy, identifies and removes these polyps
                  <span className="font-bold"> before</span> they become dangerous. This is why
                  colonoscopy is considered both a screening and prevention tool.
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-6">Why Early Polyp Removal Saves Lives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {preventionBenefits.map((benefit, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">{benefit.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-8 mb-12">
                <div className="flex items-center justify-center mb-6">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Don't Let a Small Problem Become a Big One</h2>
                <p className="text-lg text-center mb-8">
                  Most colorectal cancers start as small, harmless polyps.<br />
                  <strong>Detecting and removing them early is the key to prevention.</strong>
                </p>
                <div className="space-y-4 max-w-lg mx-auto">
                  <h3 className="text-xl font-bold text-center mb-6">Take the first step today:</h3>
                  <Link to="/screening/find-specialist" className="block">
                    <Button variant="primary" className="w-full py-3 text-lg group">
                      Book a Colonoscopy Consultation
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/screening/find-gp" className="block">
                    <Button variant="outline" className="w-full py-3 text-lg">
                      Explore Screening Options with a GP
                    </Button>
                  </Link>
                </div>
                <p className="text-center mt-8 text-gray-700 italic">
                  Project COLONAiVE™ is here to support you on your journey toward early detection, prevention, and peace of mind.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HowCRCDevelopsFromPolyps;