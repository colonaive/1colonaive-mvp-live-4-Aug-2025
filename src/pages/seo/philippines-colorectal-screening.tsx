// SEO Landing Page: Colorectal Cancer Screening Philippines
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

const PhilippinesColorectalScreening: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('Philippines');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/seo/philippines-colorectal-screening',
    'en',
    'Philippines',
    'colorectal cancer screening philippines'
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Colorectal Cancer Screening sa Pilipinas
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Advanced blood-based screening para sa colorectal cancer. 94% accurate, 
                walang colonoscopy na kailangan para sa initial screening.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Mag-book ng Screening Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-800">
                  Hanapin ang Nearest Clinic
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Philippines-Specific Context */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Colorectal Cancer: Tumataas na Problema sa Pilipinas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Rising Cases:</strong> Colorectal cancer cases sa Pilipinas have 
                        increased by 40% over the past 15 years, especially sa Metro Manila.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Late Detection:</strong> 75% ng mga cases ay diagnosed sa advanced 
                        stages dahil sa limited screening programs.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Dietary Changes:</strong> Increasing Western diet consumption 
                        and processed foods contribute sa rising rates.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Healthcare Access:</strong> Limited access sa colonoscopy sa rural areas 
                        makes blood-based screening more practical.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">CRC Statistics sa Pilipinas</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">12,000+</div>
                      <p className="text-gray-700 text-sm">New cases annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">8,500+</div>
                      <p className="text-gray-700 text-sm">Deaths annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">75%</div>
                      <p className="text-gray-700 text-sm">Late-stage diagnosis</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                      <p className="text-gray-700 text-sm">5-year survival rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Screening Options in Philippines */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                CRC Screening Options Available sa Pilipinas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-t-4 border-green-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      RECOMMENDED
                    </span>
                  </div>
                  <CardContent className="p-6 pt-8">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Blood-Based Test</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced screening with 94% accuracy. Simple blood draw sa kahit 
                      anong diagnostic center. Walang preparation needed.
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">₱4,000 - ₱6,500</div>
                    <p className="text-sm text-gray-500">One-time test, results in 7-10 days</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">FIT Test</h3>
                    <p className="text-gray-600 mb-4">
                      Stool-based test available sa most laboratories. 
                      Home collection possible.
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-2">₱300 - ₱800</div>
                    <p className="text-sm text-gray-500">Annual testing recommended</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-purple-500">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Colonoscopy</h3>
                    <p className="text-gray-600 mb-4">
                      Gold standard test available sa major hospitals. 
                      Requires bowel preparation and sedation.
                    </p>
                    <div className="text-lg font-bold text-purple-600 mb-2">₱15,000 - ₱35,000</div>
                    <p className="text-sm text-gray-500">Every 10 years if normal</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* PhilHealth Coverage */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-800 to-red-800 text-white rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold mb-4">PhilHealth Coverage and Healthcare Access</h2>
                <p className="text-lg text-blue-100">
                  Colorectal cancer screening ay partially covered ng PhilHealth, pero blood-based 
                  testing provides better accessibility across the Philippines.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Heart className="h-8 w-8 text-red-500 mr-3" />
                    Risk Factors sa Filipino Population
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Increased consumption ng processed foods and red meat
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Sedentary lifestyle sa urban areas
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Rising rates ng obesity and diabetes
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Genetic predisposition sa certain Filipino populations
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Limited access sa preventive healthcare
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Benefits ng Blood-Based Screening</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Available sa lahat ng major cities sa Pilipinas
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      No cultural barriers - simple blood test lang
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Higher accuracy compared sa traditional stool tests
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      HMO coverage possible depending sa plan
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
                Accessible Healthcare Across the Philippines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <p className="text-gray-700">Partner diagnostic centers</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">17</div>
                  <p className="text-gray-700">Regions covered</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-purple-600 mb-2">80+</div>
                  <p className="text-gray-700">Cities with access</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                  <p className="text-gray-700">Online booking support</p>
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
                Alagaan Mo ang Inyong Kalusugan Ngayon
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Early detection saves lives. Mag-screening na with our advanced 
                blood-based testing para sa complete peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Book Your Test Ngayon
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-800">
                  Kausapin ang Aming Specialists
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-6">
                Available in English, Filipino, at regional languages
              </p>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default PhilippinesColorectalScreening;