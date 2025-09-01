import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container } from '../ui/Container';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  Users, 
  MapPin, 
  ExternalLink, 
  BookOpen,
  HelpCircle,
  Phone,
  FileText
} from 'lucide-react';

interface RegionalEducationProps {
  region: string;
  language: string;
  content: {
    title: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    crc101: {
      title: string;
      sections: Array<{
        title: string;
        content: string;
        imageAlt: string;
      }>;
    };
    statistics: {
      title: string;
      stats: Array<{
        number: string;
        label: string;
        source: string;
      }>;
    };
    screeningInfo: {
      title: string;
      methods: Array<{
        name: string;
        description: string;
        suitableFor: string;
      }>;
    };
    callsToAction: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    navigation: {
      faqs: string;
      findClinic: string;
      news: string;
      screening: string;
    };
  };
}

const RegionalEducationTemplate: React.FC<RegionalEducationProps> = ({
  region,
  language,
  content
}) => {
  const currentUrl = `https://colonaive.com/education/${region.toLowerCase()}`;

  return (
    <div className="pt-20">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={`colorectal cancer education, CRC screening, ${region}, colon cancer prevention`} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={language} />
        <meta name="geo.region" content={region} />
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">
                {content.heroTitle}
              </h1>
            </div>
            <p className="text-xl mb-8 text-blue-100">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                {content.callsToAction.primary}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {content.callsToAction.secondary}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CRC 101 Education Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {content.crc101.title}
            </h2>
            
            <div className="space-y-12">
              {content.crc101.sections.map((section, index) => (
                <div key={index} className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                      {section.title}
                    </h3>
                    <div className="prose prose-lg text-gray-700">
                      <p>{section.content}</p>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <FileText className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-sm font-medium">{section.imageAlt}</p>
                        <p className="text-xs mt-1">Medical diagram placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Regional Statistics */}
      <section className="py-16 bg-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {content.statistics.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.statistics.stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stat.number}
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{stat.label}</p>
                    <p className="text-xs text-gray-500">Source: {stat.source}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Screening Methods */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {content.screeningInfo.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.screeningInfo.methods.map((method, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="text-sm text-blue-600 font-medium">
                      Suitable for: {method.suitableFor}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Navigation Links */}  
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Learn More & Take Action
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/education/faqs" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <HelpCircle className="h-8 w-8 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-2">{content.navigation.faqs}</h3>
                    <p className="text-sm text-gray-600">Common questions answered</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/find-a-gp" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-2">{content.navigation.findClinic}</h3>
                    <p className="text-sm text-gray-600">Locate nearby clinics</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/get-screened" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-2">{content.navigation.screening}</h3>
                    <p className="text-sm text-gray-600">Start your screening journey</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/newsroom/crc-news-feed" className="group">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-2">{content.navigation.news}</h3>
                    <p className="text-sm text-gray-600">Latest medical news</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Early detection saves lives. Don't wait – start your screening journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-screened">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  {content.callsToAction.primary}
                </Button>
              </Link>
              <Link to="/find-a-gp">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {content.callsToAction.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default RegionalEducationTemplate;