import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, Calendar, UserCheck, TestTube } from 'lucide-react';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { SchemaGenerator } from '@/utils/schemaGenerator';
import HreflangGenerator from '@/utils/hreflangGenerator';

interface SEOLandingTemplateProps {
  keyword: string;
  language: string;
  region: string;
  intent: 'diagnosis' | 'early detection' | 'non-invasive' | 'mortality';
  category: string;
  content: {
    title: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    benefitsList: string[];
    ctaText: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    faqItems: Array<{
      question: string;
      answer: string;
    }>;
    localizedContent: {
      statsTitle: string;
      processTitle: string;
      processSteps: string[];
    };
  };
}

const SEOLandingTemplate: React.FC<SEOLandingTemplateProps> = ({
  keyword,
  language,
  region,
  intent,
  content
}) => {

  // Generate schema markup for the page
  const currentUrl = `https://colonaive.com/seo/${keyword.replace(/\s+/g, '-').toLowerCase()}`;
  const schemaPackage = SchemaGenerator.generateCompleteSchemaPackage({
    title: content.title,
    description: content.metaDescription,
    url: currentUrl,
    keyword,
    region,
    intent,
    faqItems: content.faqItems
  });

  // Generate hreflang tags for international SEO
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    `/seo/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
    language,
    region,
    keyword
  );

  const schemas = [
    schemaPackage.medicalOrganization,
    schemaPackage.medicalWebPage,
    schemaPackage.faqPage,
    schemaPackage.breadcrumb
  ];

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'diagnosis': return 'from-blue-600 to-teal-600';
      case 'early detection': return 'from-green-600 to-emerald-600';
      case 'non-invasive': return 'from-purple-600 to-indigo-600';
      case 'mortality': return 'from-red-600 to-pink-600';
      default: return 'from-blue-600 to-teal-600';
    }
  };

  const getCtaVariant = (type: 'primary' | 'secondary' | 'tertiary') => {
    switch (type) {
      case 'primary': return 'default';
      case 'secondary': return 'outline';
      case 'tertiary': return 'ghost';
    }
  };

  return (
    <div className="pt-20">
      {/* SEO Meta Tags and Schema Markup */}
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={keyword} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content="https://colonaive.com/images/colonaive-og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.metaDescription} />
        <meta name="twitter:image" content="https://colonaive.com/images/colonaive-twitter-card.jpg" />
        
        {/* Additional SEO */}
        <link rel="canonical" href={currentUrl} />
        <meta name="author" content="COLONAiVE Medical Team" />
        <meta name="language" content={language} />
        <meta name="geo.region" content={region} />
        <meta name="geo.placename" content={region} />
        
        {/* Hreflang tags for international SEO */}
        {hreflangTags.map((tag, index) => (
          <link key={index} rel="alternate" hrefLang={tag.hreflang} href={tag.url} />
        ))}
      </Helmet>
      
      {/* JSON-LD Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${getIntentColor(intent)} text-white py-24`}>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-xl mb-8 text-white/90">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                {content.ctaText.primary}
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                {content.ctaText.secondary}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Why Choose {keyword.charAt(0).toUpperCase() + keyword.slice(1)}?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {content.benefitsList.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {content.localizedContent.processTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.localizedContent.processSteps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {index === 0 && <Calendar className="h-12 w-12 text-blue-600 mx-auto" />}
                      {index === 1 && <TestTube className="h-12 w-12 text-green-600 mx-auto" />}
                      {index === 2 && <UserCheck className="h-12 w-12 text-purple-600 mx-auto" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Step {index + 1}</h3>
                    <p className="text-gray-600">{step}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {content.localizedContent.statsTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
                <p className="text-gray-600">Survival rate when caught early</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">26</div>
                <p className="text-gray-600">Lives saved per 1,000 screened</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <p className="text-gray-600">Recommended screening age</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {content.faqItems.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className={`bg-gradient-to-r ${getIntentColor(intent)} text-white py-16`}>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Don't wait – early detection saves lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/screening">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  {content.ctaText.primary}
                </Button>
              </Link>
              <Link to="/find-gp">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  {content.ctaText.secondary}
                </Button>
              </Link>
              <Link to="/newsroom/crc-news-feed">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/10">
                  {content.ctaText.tertiary}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SEOLandingTemplate;