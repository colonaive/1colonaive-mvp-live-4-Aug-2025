// SEO Landing Page: Colorectal Cancer Screening Japan
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight, Heart, Target } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';
import ScreeningEligibilityWizard from '../../components/ScreeningEligibilityWizard';

const JapanColorectalScreening: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('Japan');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/seo/japan-colorectal-screening',
    'en',
    'Japan',
    'colorectal cancer screening japan'
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
        <section className="bg-gradient-to-r from-red-900 via-red-800 to-orange-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                大腸がん検診 | Colorectal Cancer Screening Japan
              </h1>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                Advanced blood-based screening for colorectal cancer with 94% accuracy. 
                Complement Japan's national screening program with modern technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-screened">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    血液検査を予約 | Book Blood Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-800">
                    最寄りのクリニック | Find Clinic
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Japan-Specific Context */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                日本における大腸がん：重要な事実 | Colorectal Cancer in Japan: Key Facts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Most Common Cancer:</strong> Colorectal cancer is the most diagnosed 
                        cancer in Japan, with over 147,000 new cases annually.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Aging Population:</strong> With Japan's aging society, CRC cases 
                        are expected to increase by 15% over the next decade.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Screening Participation:</strong> Only 45% participation rate in 
                        national screening programs, below WHO recommendations.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Western Diet Impact:</strong> Increasing westernization of diet 
                        contributes to rising CRC rates in younger populations.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">日本の統計 | Japan Statistics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">147,000+</div>
                      <p className="text-gray-700 text-sm">New cases annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">53,000+</div>
                      <p className="text-gray-700 text-sm">Deaths annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">72.9%</div>
                      <p className="text-gray-700 text-sm">5-year survival rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">45%</div>
                      <p className="text-gray-700 text-sm">Screening participation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Screening Options in Japan */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                日本で利用可能な検診オプション | CRC Screening Options Available in Japan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-t-4 border-blue-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      推奨 | RECOMMENDED
                    </span>
                  </div>
                  <CardContent className="p-6 pt-8">
                    <Shield className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">血液検査 | Blood-Based Test</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced screening with 94% accuracy. Simple blood draw at any 
                      diagnostic center. No preparation required.
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-2">¥20,000 - ¥30,000</div>
                    <p className="text-sm text-gray-500">One-time test, results in 7-10 days</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">便潜血検査 | FOBT</h3>
                    <p className="text-gray-600 mb-4">
                      Part of national screening program. Home collection possible. 
                      Covered by National Health Insurance.
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">¥500 - ¥1,000</div>
                    <p className="text-sm text-gray-500">Annual testing, NHI covered</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-red-500">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">大腸内視鏡 | Colonoscopy</h3>
                    <p className="text-gray-600 mb-4">
                      Gold standard test available at major hospitals. 
                      Requires bowel preparation and sedation.
                    </p>
                    <div className="text-lg font-bold text-red-600 mb-2">¥15,000 - ¥40,000</div>
                    <p className="text-sm text-gray-500">Every 10 years if normal</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* National Health Insurance Information */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-red-800 to-orange-800 text-white rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold mb-4">国民健康保険と検診 | National Health Insurance & Screening</h2>
                <p className="text-lg text-red-100">
                  Japan's National Health Insurance covers basic CRC screening, but advanced 
                  blood-based testing provides enhanced accuracy and convenience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Heart className="h-8 w-8 text-red-500 mr-3" />
                    日本人集団のリスク要因 | Risk Factors in Japanese Population
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Aging population with increased cancer risk
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Westernization of diet with more processed foods
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Reduced physical activity in urban areas
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Genetic predisposition in certain populations
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      High work stress and irregular eating patterns
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">血液検査の利点 | Benefits of Blood-Based Screening</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Available at all major clinics and hospitals in Japan
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      No cultural barriers - simple blood test
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Higher accuracy than traditional FOBT
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Compatible with annual health check-ups (健康診断)
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Can detect cancer before symptoms appear
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Healthcare Network */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                日本全国でアクセス可能 | Accessible Healthcare Across Japan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-red-600 mb-2">2,000+</div>
                  <p className="text-gray-700">Partner medical facilities</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                  <p className="text-gray-700">Prefectures covered</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-orange-600 mb-2">300+</div>
                  <p className="text-gray-700">Cities with access</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <p className="text-gray-700">Online booking support</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Embedded Screening Eligibility Wizard */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-red-50" id="eligibility-check">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  検診が必要ですか？| Are You Eligible for Screening in Japan?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Take our personalized assessment to determine if you should get screened for colorectal cancer in Japan. 
                  Get recommendations based on MHLW guidelines and your individual risk profile.
                </p>
              </div>
              
              <ScreeningEligibilityWizard />
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-red-800 to-orange-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                今すぐ健康管理を始めましょう | Take Charge of Your Health Today
              </h2>
              <p className="text-xl text-red-100 mb-8">
                Early detection saves lives. Get screened with our advanced 
                blood-based testing for complete peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-screened">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    今すぐ予約 | Book Your Test Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-800">
                    専門医に相談 | Consult Specialists
                  </Button>
                </a>
              </div>
              <p className="text-sm text-red-200 mt-6">
                日本語・英語対応 | Available in Japanese and English
              </p>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-red-700">
                <p className="text-red-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/jp" className="text-red-200 hover:text-white underline">
                    Japan CRC Education
                  </a>
                  <a href="/education/patients/colorectal-cancer" className="text-red-200 hover:text-white underline">
                    Understanding Colorectal Cancer
                  </a>
                  <a href="/get-screened" className="text-red-200 hover:text-white underline">
                    Get Screened
                  </a>
                  <a href="/specialists" className="text-red-200 hover:text-white underline">
                    Find Specialists
                  </a>
                  <a href="/movement-pillars" className="text-red-200 hover:text-white underline">
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

export default JapanColorectalScreening;