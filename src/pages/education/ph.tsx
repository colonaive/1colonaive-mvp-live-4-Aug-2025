// Philippines CRC Education Page - English & Tagalog Support
import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { BookOpen, Users, Shield, ArrowRight, Globe, Heart, AlertCircle, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

type Language = 'en' | 'tl';

const PhilippinesCRCEducation: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const schema = generateMedicalOrganizationSchema('Philippines');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/education/ph',
    currentLanguage,
    'Philippines',
    'colorectal cancer education philippines'
  );

  const content = {
    en: {
      title: 'Understand Colorectal Cancer in the Philippines',
      subtitle: 'Comprehensive education about colorectal cancer prevention, screening, and early detection tailored for Filipinos',
      crc101: {
        title: 'CRC 101: Understanding Colorectal Cancer',
        whatIs: {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer (CRC) develops in the colon or rectum, parts of the large intestine. In the Philippines, CRC cases have increased by 40% over the past 15 years, with over 12,000 new cases diagnosed annually.'
        },
        progression: {
          title: 'From Polyps to Cancer: How CRC Develops',
          content: 'Most colorectal cancers start as small growths called polyps. Over 5-10 years, some polyps can become cancerous. Regular screening can detect and remove polyps before they become cancer.'
        },
        screening: {
          title: 'Why Early Screening Matters in the Philippines',
          content: '75% of CRC cases in the Philippines are diagnosed at advanced stages due to limited screening programs. Early detection can increase survival rates from 30% to over 90%.'
        }
      },
      localStats: {
        title: 'CRC in the Philippines: Key Statistics',
        stats: [
          { label: 'New cases annually', value: '12,000+' },
          { label: 'Late-stage diagnosis rate', value: '75%' },
          { label: 'Current 5-year survival rate', value: '30%' },
          { label: 'Potential survival with early detection', value: '90%+' }
        ]
      },
      riskFactors: {
        title: 'Growing Risk Factors in the Philippines',
        factors: [
          'Increased consumption of processed foods and red meat',
          'Sedentary lifestyle in urban areas',
          'Rising rates of obesity and diabetes',
          'Environmental factors and pollution',
          'Limited access to preventive healthcare'
        ]
      },
      healthcareAccess: {
        title: 'Healthcare Access & PhilHealth Coverage',
        content: 'The Department of Health (DOH) recognizes the importance of CRC screening. PhilHealth provides partial coverage for screening and treatment.',
        regions: 'Screening services are available in major hospitals across Metro Manila, Cebu, Davao, and other urban centers. Rural areas have limited access but mobile screening programs are expanding.',
        coverage: 'PhilHealth covers colonoscopy and treatment costs. HMO plans may provide additional coverage for advanced screening methods.'
      },
      cta: {
        title: 'Kumukilos Ngayon - Take Action Today',
        subtitle: 'Early detection saves lives. Find screening options across the Philippines.',
        buttons: {
          clinic: 'Find a Screening Center',
          bloodTest: 'Book a Blood Test',
          specialist: 'Consult a Specialist'
        }
      },
      footer: 'Part of the COLONAiVE™ Movement. For Lives, Not For Profits.'
    },
    tl: {
      title: 'Intindihin ang Colorectal Cancer sa Pilipinas',
      subtitle: 'Komprehensibong edukasyon tungkol sa pag-iwas, pag-screen, at magang pagkakatukoy ng colorectal cancer para sa mga Pilipino',
      crc101: {
        title: 'CRC 101: Pag-unawa sa Colorectal Cancer',
        whatIs: {
          title: 'Ano ang Colorectal Cancer?',
          content: 'Ang colorectal cancer (CRC) ay umuusbong sa colon o rectum, mga bahagi ng malaking bituka. Sa Pilipinas, ang mga kaso ng CRC ay tumaas ng 40% sa nakaraang 15 taon, na may higit sa 12,000 bagong kaso na na-diagnose bawat taon.'
        },
        progression: {
          title: 'Mula sa Polyps hanggang sa Cancer: Paano Umuusbong ang CRC',
          content: 'Karamihan sa mga colorectal cancer ay nagsisimula bilang maliliit na paglaki na tinatawag na polyps. Sa loob ng 5-10 taon, ang ilang polyps ay maaaring maging cancer. Ang regular na pag-screen ay maaaring makita at maalis ang mga polyps bago pa sila maging cancer.'
        },
        screening: {
          title: 'Bakit Mahalaga ang Magang Pag-screen sa Pilipinas',
          content: '75% ng mga kaso ng CRC sa Pilipinas ay na-diagnose sa mga advanced stage dahil sa limitadong mga programa ng screening. Ang magang pagkakatukoy ay maaaring magtaas ng survival rates mula sa 30% hanggang sa mahigit 90%.'
        }
      },
      localStats: {
        title: 'CRC sa Pilipinas: Mga Pangunahing Estatistika',
        stats: [
          { label: 'Bagong kaso bawat taon', value: '12,000+' },
          { label: 'Late-stage diagnosis rate', value: '75%' },
          { label: 'Kasalukuyang 5-taong survival rate', value: '30%' },
          { label: 'Potensyal na survival sa magang detection', value: '90%+' }
        ]
      },
      riskFactors: {
        title: 'Tumataas na Risk Factors sa Pilipinas',
        factors: [
          'Pagtaas ng pagkain ng processed foods at red meat',
          'Sedentary lifestyle sa mga urban area',
          'Tumataas na rates ng obesity at diabetes',
          'Environmental factors at polusyon',
          'Limitadong access sa preventive healthcare'
        ]
      },
      healthcareAccess: {
        title: 'Healthcare Access at PhilHealth Coverage',
        content: 'Kinikilala ng Department of Health (DOH) ang kahalagahan ng CRC screening. Nagbibigay ang PhilHealth ng partial coverage para sa screening at treatment.',
        regions: 'Available ang mga screening services sa mga major hospital sa buong Metro Manila, Cebu, Davao, at iba pang urban centers. Limitado ang access sa rural areas pero lumalawak ang mga mobile screening programs.',
        coverage: 'Sinaklaw ng PhilHealth ang colonoscopy at treatment costs. Ang mga HMO plan ay maaaring magbigay ng additional coverage para sa advanced screening methods.'
      },
      cta: {
        title: 'Kumukilos Ngayon - Take Action Today',
        subtitle: 'Ang magang pagkakatukoy ay nagsasalba ng buhay. Hanapin ang mga screening options sa buong Pilipinas.',
        buttons: {
          clinic: 'Hanapin ang Screening Center',
          bloodTest: 'Mag-book ng Blood Test',
          specialist: 'Makipag-consult sa Specialist'
        }
      },
      footer: 'Bahagi ng COLONAiVE™ Movement. Para sa Buhay, Hindi para sa Kita.'
    }
  } as const;

  const currentContent = content[currentLanguage];

  const LanguageSwitcher = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm text-gray-600 mr-2">Wika / Language:</span>
      {Object.entries({
        en: 'English',
        tl: 'Filipino'
      }).map(([lang, label]) => (
        <button
          key={lang}
          onClick={() => setCurrentLanguage(lang as Language)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            currentLanguage === lang
              ? 'bg-blue-600 text-white'
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
        <section className="bg-gradient-to-r from-blue-900 via-red-700 to-yellow-600 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <LanguageSwitcher />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentContent.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
              <div className="flex items-center justify-center space-x-4 text-blue-200">
                <BookOpen className="h-6 w-6" />
                <span>Educational Resource</span>
                <Globe className="h-6 w-6" />
                <span>DOH Guidelines Aligned</span>
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
                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-blue-600 mb-4" />
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
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-8 text-center">
                <div className="w-full h-64 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">Colon & Polyp Development Diagram</p>
                    <p className="text-sm text-blue-500">Interactive visual showing polyp-to-cancer progression</p>
                    <p className="text-xs text-blue-400 mt-2">Available in English and Filipino</p>
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
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
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

        {/* Healthcare Access */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-800 to-red-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <MapPin className="h-8 w-8 mr-3" />
                  {currentContent.healthcareAccess.title}
                </h2>
                <p className="text-lg text-blue-100 mb-4">
                  {currentContent.healthcareAccess.content}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-blue-200 mb-2">Regional Availability:</h4>
                    <p className="text-blue-100 text-sm">
                      {currentContent.healthcareAccess.regions}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-200 mb-2">Insurance Coverage:</h4>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-100 text-sm">
                        {currentContent.healthcareAccess.coverage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-800 to-red-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {currentContent.cta.title}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
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
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                    {currentContent.cta.buttons.bloodTest}
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-800">
                    {currentContent.cta.buttons.specialist}
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-blue-700">
                <p className="text-blue-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/patients/colorectal-cancer" className="text-blue-200 hover:text-white underline">
                    Understanding Colorectal Cancer
                  </a>
                  <a href="/get-screened" className="text-blue-200 hover:text-white underline">
                    Get Screened
                  </a>
                  <a href="/specialists" className="text-blue-200 hover:text-white underline">
                    Find Specialists
                  </a>
                  <a href="/movement-pillars" className="text-blue-200 hover:text-white underline">
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

export default PhilippinesCRCEducation;