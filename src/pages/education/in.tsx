// India CRC Education Page - English & Hindi Support
import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { BookOpen, Users, Shield, ArrowRight, Globe, Heart, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

type Language = 'en' | 'hi';

const IndiaCRCEducation: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const schema = generateMedicalOrganizationSchema('India');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/education/in',
    currentLanguage,
    'India',
    'colorectal cancer education india'
  );

  const content = {
    en: {
      title: 'Understand Colorectal Cancer in India',
      subtitle: 'Comprehensive education about colorectal cancer prevention, screening, and early detection tailored for Indians',
      crc101: {
        title: 'CRC 101: Understanding Colorectal Cancer',
        whatIs: {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer (CRC) develops in the colon or rectum, parts of the large intestine. In India, CRC cases have increased by 35% over the past decade, with over 57,000 new cases diagnosed annually.'
        },
        progression: {
          title: 'From Polyps to Cancer: How CRC Develops',
          content: 'Most colorectal cancers start as small growths called polyps. Over 5-10 years, some polyps can become cancerous. Early detection through screening can prevent this progression entirely.'
        },
        screening: {
          title: 'Why Early Screening Matters in India',
          content: 'In India, 60% of CRC cases occur in people under 50 years of age, unlike Western countries. Only 20% of Indians undergo regular CRC screening, leading to 70% of cases being diagnosed at advanced stages.'
        }
      },
      localStats: {
        title: 'CRC in India: Key Statistics',
        stats: [
          { label: 'New cases annually', value: '57,000+' },
          { label: 'Cases under age 50', value: '60%' },
          { label: 'Screening participation', value: '<20%' },
          { label: '5-year survival rate', value: '35%' }
        ]
      },
      riskFactors: {
        title: 'Growing Risk Factors in India',
        factors: [
          'Increasing Western diet consumption',
          'Sedentary lifestyle in urban areas',
          'Rising rates of obesity and diabetes',
          'Environmental factors and pollution',
          'Genetic predisposition in certain populations'
        ]
      },
      nationalGuidelines: {
        title: 'India Screening Guidelines & Healthcare Access',
        content: 'The Indian Council of Medical Research (ICMR) recommends CRC screening for high-risk individuals from age 40-45. Given the younger age demographics, early awareness and screening are crucial.',
        coverage: 'Screening is available through AIIMS network, private hospitals, and various insurance schemes including ESI, CGHS, and private health insurance.'
      },
      cta: {
        title: 'Take Action Today',
        subtitle: 'Early detection saves lives. Find screening options across India.',
        buttons: {
          clinic: 'Find a Screening Center',
          bloodTest: 'Book a Blood Test',
          specialist: 'Consult an Oncologist'
        }
      },
      footer: 'Part of the COLONAiVE™ Movement. For Lives, Not For Profits.'
    },
    hi: {
      title: 'भारत में कोलोरेक्टल कैंसर को समझें',
      subtitle: 'भारतीयों के लिए तैयार किए गए कोलोरेक्टल कैंसर की रोकथाम, जांच और शीघ्र पहचान के बारे में व्यापक शिक्षा',
      crc101: {
        title: 'CRC 101: कोलोरेक्टल कैंसर को समझना',
        whatIs: {
          title: 'कोलोरेक्टल कैंसर क्या है?',
          content: 'कोलोरेक्टल कैंसर (CRC) बड़ी आंत के हिस्सों कोलन या मलाशय में विकसित होता है। भारत में, पिछले दशक में CRC के मामले 35% बढ़े हैं, सालाना 57,000 से अधिक नए मामले निदान होते हैं।'
        },
        progression: {
          title: 'पॉलिप्स से कैंसर तक: CRC कैसे विकसित होता है',
          content: 'अधिकांश कोलोरेक्टल कैंसर पॉलिप्स नामक छोटी वृद्धि के रूप में शुरू होते हैं। 5-10 साल में, कुछ पॉलिप्स कैंसर बन सकते हैं। स्क्रीनिंग के माध्यम से शीघ्र पहचान इस प्रगति को पूरी तरह से रोक सकती है।'
        },
        screening: {
          title: 'भारत में शीघ्र स्क्रीनिंग क्यों महत्वपूर्ण है',
          content: 'भारत में, CRC के 60% मामले 50 साल से कम उम्र के लोगों में होते हैं, पश्चिमी देशों के विपरीत। केवल 20% भारतीय नियमित CRC स्क्रीनिंग कराते हैं, जिससे 70% मामले उन्नत चरणों में निदान होते हैं।'
        }
      },
      localStats: {
        title: 'भारत में CRC: मुख्य आंकड़े',
        stats: [
          { label: 'सालाना नए मामले', value: '57,000+' },
          { label: '50 साल से कम उम्र के मामले', value: '60%' },
          { label: 'स्क्रीनिंग भागीदारी', value: '<20%' },
          { label: '5-साल जीवित रहने की दर', value: '35%' }
        ]
      },
      riskFactors: {
        title: 'भारत में बढ़ते जोखिम कारक',
        factors: [
          'पश्चिमी आहार की बढ़ती खपत',
          'शहरी क्षेत्रों में गतिहीन जीवनशैली',
          'मोटापे और मधुमेह की बढ़ती दर',
          'पर्यावरणीय कारक और प्रदूषण',
          'कुछ आबादी में आनुवंशिक प्रवृत्ति'
        ]
      },
      nationalGuidelines: {
        title: 'भारत स्क्रीनिंग दिशानिर्देश और स्वास्थ्य सेवा पहुंच',
        content: 'भारतीय चिकित्सा अनुसंधान परिषद (ICMR) उच्च जोखिम वाले व्यक्तियों के लिए 40-45 साल की उम्र से CRC स्क्रीनिंग की सिफारिश करती है। कम उम्र की जनसांख्यिकी को देखते हुए, शीघ्र जागरूकता और स्क्रीनिंग महत्वपूर्ण है।',
        coverage: 'स्क्रीनिंग AIIMS नेटवर्क, निजी अस्पतालों और ESI, CGHS और निजी स्वास्थ्य बीमा सहित विभिन्न बीमा योजनाओं के माध्यम से उपलब्ध है।'
      },
      cta: {
        title: 'आज ही कार्रवाई करें',
        subtitle: 'शीघ्र पहचान जीवन बचाती है। पूरे भारत में स्क्रीनिंग विकल्प खोजें।',
        buttons: {
          clinic: 'स्क्रीनिंग केंद्र खोजें',
          bloodTest: 'रक्त परीक्षण बुक करें',
          specialist: 'ऑन्कोलॉजिस्ट से सलाह लें'
        }
      },
      footer: 'COLONAiVE™ आंदोलन का हिस्सा। जीवन के लिए, लाभ के लिए नहीं।'
    }
  } as const;

  const currentContent = content[currentLanguage];

  const LanguageSwitcher = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm text-gray-600 mr-2">Language:</span>
      {Object.entries({
        en: 'English',
        hi: 'हिन्दी'
      }).map(([lang, label]) => (
        <button
          key={lang}
          onClick={() => setCurrentLanguage(lang as Language)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            currentLanguage === lang
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hreflang Tags */}
      {hreflangTags.map((tag, index) => (
        <link
          key={`hreflang-${index}`}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.url}
        />
      ))}

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-800 via-red-700 to-pink-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <LanguageSwitcher />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentContent.title}
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
              <div className="flex items-center justify-center space-x-4 text-orange-200">
                <BookOpen className="h-6 w-6" />
                <span>Educational Resource</span>
                <Globe className="h-6 w-6" />
                <span>ICMR Guidelines Aligned</span>
              </div>
            </div>
          </Container>
        </section>

        {/* CRC 101 Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {currentContent.crc101.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="border-t-4 border-orange-500">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.whatIs.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.whatIs.content}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-red-500">
                  <CardContent className="p-6">
                    <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.progression.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.progression.content}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.screening.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.screening.content}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Aid Placeholder */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 text-center">
                <div className="w-full h-64 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-orange-400 mx-auto mb-2" />
                    <p className="text-orange-600 font-medium">Colon & Polyp Development Diagram</p>
                    <p className="text-sm text-orange-500">Interactive visual showing polyp-to-cancer progression</p>
                    <p className="text-xs text-orange-400 mt-2">Available in Hindi and English</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Local Statistics */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {currentContent.localStats.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {currentContent.localStats.stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                    <p className="text-gray-700">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Risk Factors */}
              <Card className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                    {currentContent.riskFactors.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentContent.riskFactors.factors.map((factor, index) => (
                      <div key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* National Guidelines */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-orange-800 to-red-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4">
                  {currentContent.nationalGuidelines.title}
                </h2>
                <p className="text-lg text-orange-100 mb-4">
                  {currentContent.nationalGuidelines.content}
                </p>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-orange-100">
                    {currentContent.nationalGuidelines.coverage}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-800 to-red-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {currentContent.cta.title}
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                {currentContent.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/specialists">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    {currentContent.cta.buttons.clinic}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/get-screened">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {currentContent.cta.buttons.bloodTest}
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-800">
                    {currentContent.cta.buttons.specialist}
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-orange-700">
                <p className="text-orange-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/patients/colorectal-cancer" className="text-orange-200 hover:text-white underline">
                    Understanding Colorectal Cancer
                  </a>
                  <a href="/get-screened" className="text-orange-200 hover:text-white underline">
                    Get Screened
                  </a>
                  <a href="/specialists" className="text-orange-200 hover:text-white underline">
                    Find Specialists
                  </a>
                  <a href="/movement-pillars" className="text-orange-200 hover:text-white underline">
                    Movement Pillars
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <Container>
            <div className="text-center">
              <p className="text-gray-300">
                {currentContent.footer}
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default IndiaCRCEducation;