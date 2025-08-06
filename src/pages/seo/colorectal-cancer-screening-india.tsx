// SEO Landing Page: Colorectal Cancer Screening India
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight, Target } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';
import ScreeningEligibilityWizard from '../../components/ScreeningEligibilityWizard';

const ColorectalCancerScreeningIndia: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('India');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/seo/colorectal-cancer-screening-india',
    'en',
    'India',
    'colorectal cancer screening india'
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
        <section className="bg-gradient-to-r from-orange-900 via-red-800 to-pink-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Colorectal Cancer Screening in India
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                India faces rising CRC rates but screening remains low. Learn about screening options available today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/find-clinic">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600">
                    Get Screening Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/education/patients/colonoscopy-gold-standard">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-800">
                    Book Colonoscopy
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose Our CRC Screening Program?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Advanced Technology</h3>
                    <p className="text-gray-600">
                      Our blood-based screening test uses cutting-edge technology with 94% sensitivity 
                      for detecting colorectal cancer and advanced adenomas.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Non-Invasive Testing</h3>
                    <p className="text-gray-600">
                      Simple blood test - no bowel preparation, no sedation, no discomfort. 
                      Results available within 7-10 business days.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Early Detection Saves Lives</h3>
                    <p className="text-gray-600">
                      When detected early, colorectal cancer has a 90% survival rate. 
                      Our screening helps catch cancer before symptoms appear.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* India-Specific Information */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Colorectal Cancer in India
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p>
                        <strong>Rising Incidence:</strong> Colorectal cancer cases in India have 
                        increased by 40% over the past decade, particularly in urban areas.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p>
                        <strong>Late Detection:</strong> Over 70% of cases are diagnosed at advanced 
                        stages due to lack of screening programs.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p>
                        <strong>Screening Gap:</strong> Less than 20% of eligible Indians undergo regular 
                        CRC screening, well below global standards.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p>
                        <strong>Age Trend:</strong> Cases are increasingly seen in younger age groups, 
                        with 30% of patients under 50.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Screening Options in India</h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Blood-Based Test (Recommended)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Advanced screening with 94% accuracy, no preparation required
                      </p>
                      <p className="text-orange-600 font-medium mt-2">₹8,000 - ₹15,000</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900">FIT Test (Stool-Based)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Home collection, 70-80% accuracy, annual testing needed
                      </p>
                      <p className="text-green-600 font-medium mt-2">₹500 - ₹1,200</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Colonoscopy</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Gold standard, requires bowel prep and sedation
                      </p>
                      <p className="text-purple-600 font-medium mt-2">₹15,000 - ₹35,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                The Impact of Early Detection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
                  <p className="text-gray-700">Survival rate when detected early</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                  <p className="text-gray-700">Accuracy of blood-based screening</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
                  <p className="text-gray-700">Cases diagnosed at late stage</p>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">45+</div>
                  <p className="text-gray-700">Recommended screening age</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Embedded Screening Eligibility Wizard */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50" id="eligibility-check">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Check Your Risk for CRC in India
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Take our personalized assessment to determine if you're eligible for colorectal cancer screening in India. 
                  Get recommendations based on international guidelines and your individual risk profile.
                </p>
              </div>
              
              <ScreeningEligibilityWizard />
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-800 to-red-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Take Control of Your Health Today
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                Early detection is your best defense against colorectal cancer. 
                Book your advanced blood screening test now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/find-clinic">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600">
                    Schedule Your Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-800">
                    Speak with a Specialist
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-orange-700">
                <p className="text-orange-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/in" className="text-orange-200 hover:text-white underline">
                    India CRC Education
                  </a>
                  <a href="/education/patients/colorectal-cancer" className="text-orange-200 hover:text-white underline">
                    Understanding Colorectal Cancer
                  </a>
                  <a href="/find-clinic" className="text-orange-200 hover:text-white underline">
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
      </div>
    </>
  );
};

export default ColorectalCancerScreeningIndia;