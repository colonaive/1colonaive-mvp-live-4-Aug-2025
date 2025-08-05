// SEO Landing Page: Bowel Cancer Screening Australia
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

const AustraliaBowelCancerScreening: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('Australia');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/seo/australia-bowel-cancer-screening',
    'en',
    'Australia',
    'bowel cancer screening australia'
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
                Bowel Cancer Screening Australia
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Advanced blood-based screening for bowel cancer with 95% accuracy. 
                Complement your National Bowel Cancer Screening Program with modern technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-screened">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Book Blood Test Screening
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/education/patients/colorectal-cancer">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-800">
                    Learn About NBCSP
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Australia-Specific Stats */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Bowel Cancer in Australia: Key Facts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Second Most Deadly Cancer:</strong> Bowel cancer is the second leading 
                        cause of cancer death in Australia, claiming over 5,000 lives annually.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Rising in Younger Adults:</strong> Cases in people under 50 have 
                        increased by 9% over the past decade.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>NBCSP Participation:</strong> Only 44% of eligible Australians 
                        complete their free FOBT screening kit.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Preventable Deaths:</strong> Up to 90% of bowel cancer deaths 
                        could be prevented with regular screening.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">National Statistics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">15,604</div>
                      <p className="text-gray-700 text-sm">New cases annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">5,315</div>
                      <p className="text-gray-700 text-sm">Deaths annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">68.9%</div>
                      <p className="text-gray-700 text-sm">5-year survival rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">1 in 13</div>
                      <p className="text-gray-700 text-sm">Lifetime risk</p>
                    </div>
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
                <Card className="border-t-4 border-orange-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Blood-Based Test</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced screening with 95% accuracy. No bowel preparation required. 
                      Results in 7-10 days.
                    </p>
                    <div className="text-lg font-bold text-orange-600 mb-2">AUD $250-$350</div>
                    <p className="text-sm text-gray-500">Private health insurance may cover</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">FOBT (NBCSP)</h3>
                    <p className="text-gray-600 mb-4">
                      Free immunochemical faecal occult blood test sent by 
                      government every 2 years.
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">FREE</div>
                    <p className="text-sm text-gray-500">Ages 50-74, mailed automatically</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Colonoscopy</h3>
                    <p className="text-gray-600 mb-4">
                      Gold standard diagnostic test. Requires bowel preparation 
                      and sedation.
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-2">AUD $1,000-$2,500</div>
                    <p className="text-sm text-gray-500">Medicare rebate available</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* NBCSP Information */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-green-800 to-blue-800 text-white rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold mb-4">National Bowel Cancer Screening Program (NBCSP)</h2>
                <p className="text-lg text-green-100">
                  The Australian Government provides free bowel cancer screening for people aged 50-74. 
                  However, participation rates remain low at just 44%.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Participation is Low</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Handling stool samples is unpleasant and inconvenient
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      False positive rates lead to unnecessary anxiety
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Test must be completed within specific timeframe
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Many people never receive or lose the kit
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Blood Test Advantages</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Simple blood draw at any pathology clinic
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      95% accuracy - higher than FOBT
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      No handling of stool samples required
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Can be done during routine health checks
                    </li>
                  </ul>
                </div>
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
                <a href="/get-screened">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Book Your Blood Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-800">
                    Find Nearest Clinic
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-green-700">
                <p className="text-green-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/au" className="text-green-200 hover:text-white underline">
                    Australia Bowel Cancer Education
                  </a>
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
      </div>
    </>
  );
};

export default AustraliaBowelCancerScreening;