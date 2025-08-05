// Australia CRC Education Page - English Only
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { BookOpen, Users, Shield, ArrowRight, Globe, Heart, AlertCircle, CheckCircle, TrendingUp, Building, Award } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

const AustraliaCRCEducation: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('Australia');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/education/au',
    'en',
    'Australia',
    'colorectal cancer education australia'
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
        <section className="bg-gradient-to-r from-green-900 via-blue-800 to-teal-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Understand Bowel Cancer in Australia
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Comprehensive education about bowel cancer prevention, screening, and early detection tailored for Australians
              </p>
              <div className="flex items-center justify-center space-x-4 text-green-200">
                <BookOpen className="h-6 w-6" />
                <span>Educational Resource</span>
                <Globe className="h-6 w-6" />
                <span>Australian Government Guidelines</span>
              </div>
            </div>
          </Container>
        </section>

        {/* CRC 101 Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Bowel Cancer 101: Understanding the Disease
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      What is Bowel Cancer?
                    </h3>
                    <p className="text-gray-600">
                      Bowel cancer (also called colorectal cancer) develops in the colon or rectum. 
                      It's the second leading cause of cancer death in Australia, with over 15,600 
                      new cases diagnosed annually.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <AlertCircle className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      From Polyps to Cancer: How It Develops
                    </h3>
                    <p className="text-gray-600">
                      Most bowel cancers start as small growths called polyps. Over 5-10 years, 
                      some polyps can become cancerous. Regular screening can detect and remove 
                      polyps before they become cancer.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-orange-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      Why Early Screening Matters
                    </h3>
                    <p className="text-gray-600">
                      When detected early, bowel cancer has a 90% survival rate. However, only 44% 
                      of eligible Australians complete their free National Bowel Cancer Screening 
                      Program kit.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Aid Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 text-center">
                <div className="w-full h-64 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-green-400 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Bowel & Polyp Development Diagram</p>
                    <p className="text-sm text-green-500">Interactive visual showing polyp-to-cancer progression</p>
                    <p className="text-xs text-green-400 mt-2">Australian-specific medical terminology</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Australian Statistics */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Bowel Cancer in Australia: Key Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">15,604</div>
                  <p className="text-gray-700">New cases annually</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5,315</div>
                  <p className="text-gray-700">Deaths annually</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">68.9%</div>
                  <p className="text-gray-700">5-year survival rate</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">1 in 13</div>
                  <p className="text-gray-700">Lifetime risk</p>
                </div>
              </div>

              {/* Risk Factors */}
              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
                    Growing Risk Factors in Australia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Aging population with increased cancer risk</span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">High consumption of processed and red meat</span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Sedentary lifestyle and reduced physical activity</span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Rising rates of obesity and Type 2 diabetes</span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Genetic factors in certain populations</span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Environmental factors and lifestyle changes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* NBCSP Information */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-green-800 to-blue-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Award className="h-8 w-8 mr-3" />
                  National Bowel Cancer Screening Program (NBCSP)
                </h2>
                <p className="text-lg text-green-100 mb-6">
                  The Australian Government provides free bowel cancer screening for people aged 50-74. 
                  The program uses faecal immunochemical tests (FIT) sent by mail every two years.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-200 mb-2">NBCSP Coverage:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Free FIT kits posted every 2 years</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Ages 50-74 automatically enrolled</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Follow-up colonoscopy if abnormal</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-200 mb-2">Enhanced Options:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Blood-based screening (95% accuracy)</p>
                      </div>
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Private health insurance may cover</p>
                      </div>
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-green-100 text-sm">Available at pathology clinics nationwide</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NBCSP Participation Challenge */}
                <div className="mt-8 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
                  <h4 className="font-semibold text-blue-200 mb-2">Participation Challenge:</h4>
                  <p className="text-blue-100 text-sm mb-2">
                    Despite being free and accessible, only 44% of eligible Australians complete their NBCSP kit.
                  </p>
                  <div className="text-sm text-blue-200">
                    <strong>Common barriers:</strong> Handling stool samples, forgetting about the kit, 
                    false positive concerns, and lack of awareness about the importance of screening.
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Screening Options */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Bowel Cancer Screening Options in Australia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">FOBT/FIT (NBCSP)</h3>
                    <p className="text-gray-600 mb-4">
                      Free immunochemical faecal occult blood test sent by government 
                      every 2 years. Home collection, Medicare covered.
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">FREE</div>
                    <p className="text-sm text-gray-500">Ages 50-74, mailed automatically</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-blue-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ENHANCED
                    </span>
                  </div>
                  <CardContent className="p-6 pt-8">
                    <Users className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Blood-Based Test</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced screening with 95% accuracy. No bowel preparation required. 
                      Results in 7-10 days.
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-2">$250-$350</div>
                    <p className="text-sm text-gray-500">Private health insurance may cover</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-purple-500">
                  <CardContent className="p-6">
                    <Building className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Colonoscopy</h3>
                    <p className="text-gray-600 mb-4">
                      Gold standard diagnostic test. Requires bowel preparation 
                      and sedation. Medicare rebate available.
                    </p>
                    <div className="text-lg font-bold text-purple-600 mb-2">$1,000-$2,500</div>
                    <p className="text-sm text-gray-500">Medicare rebate available</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-800 to-blue-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Don't Wait for Symptoms - Screen Today
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Early detection saves lives. Complement your NBCSP screening with 
                advanced blood-based testing for complete peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/specialists">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Find Screening Centers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/get-screened">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Book Blood Test
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-800">
                    Consult Specialists
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-green-700">
                <p className="text-green-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/patients/colorectal-cancer" className="text-green-200 hover:text-white underline">
                    Understanding Bowel Cancer
                  </a>
                  <a href="/get-screened" className="text-green-200 hover:text-white underline">
                    Get Screened
                  </a>
                  <a href="/specialists" className="text-green-200 hover:text-white underline">
                    Find Specialists
                  </a>
                  <a href="/movement-pillars" className="text-green-200 hover:text-white underline">
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
                Part of the COLONAiVE™ Movement. For Lives, Not For Profits.
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default AustraliaCRCEducation;