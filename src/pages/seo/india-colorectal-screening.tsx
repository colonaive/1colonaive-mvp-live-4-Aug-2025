// SEO Landing Page: Colorectal Cancer Screening India
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

const IndiaColorectalScreening: React.FC = () => {
  const schema = generateMedicalOrganizationSchema('India');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/seo/india-colorectal-screening',
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
        <section className="bg-gradient-to-r from-orange-800 via-red-700 to-pink-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Colorectal Cancer Screening in India
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                Advanced blood-based screening for colorectal cancer now available in India. 
                94% accuracy, no colonoscopy required for initial screening.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-screened">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Book Screening Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-800">
                    Find Nearest Clinic
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* India-Specific Context */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Colorectal Cancer: A Growing Concern in India
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Rising Incidence:</strong> Colorectal cancer cases in India have 
                        increased by 35% over the past decade, especially in urban areas.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Age Demographics:</strong> Unlike Western countries, 60% of CRC 
                        cases in India occur in people under 50 years of age.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Late Detection:</strong> 70% of cases are diagnosed at advanced 
                        stages due to lack of screening programs.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        <strong>Dietary Factors:</strong> Increasing Western diet and processed 
                        food consumption contribute to rising rates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">CRC Statistics in India</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">57,000+</div>
                      <p className="text-gray-700 text-sm">New cases annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">41,000+</div>
                      <p className="text-gray-700 text-sm">Deaths annually</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">60%</div>
                      <p className="text-gray-700 text-sm">Cases under age 50</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">35%</div>
                      <p className="text-gray-700 text-sm">5-year survival rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Screening Options in India */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                CRC Screening Options Available in India
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
                      Advanced screening with 94% accuracy. Simple blood draw at any 
                      diagnostic center. No preparation required.
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">₹8,000 - ₹12,000</div>
                    <p className="text-sm text-gray-500">One-time test, results in 7-10 days</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <Users className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">FIT Test</h3>
                    <p className="text-gray-600 mb-4">
                      Stool-based test available at most pathology labs. 
                      Home collection possible.
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-2">₹500 - ₹1,500</div>
                    <p className="text-sm text-gray-500">Annual testing recommended</p>
                  </CardContent>
                </Card>
                
                <Card className="border-t-4 border-purple-500">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Colonoscopy</h3>
                    <p className="text-gray-600 mb-4">
                      Gold standard test available at major hospitals. 
                      Requires bowel preparation and sedation.
                    </p>
                    <div className="text-lg font-bold text-purple-600 mb-2">₹8,000 - ₹25,000</div>
                    <p className="text-sm text-gray-500">Every 10 years if normal</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Early Screening Matters in India */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-orange-800 to-red-800 text-white rounded-lg p-8 mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Early Screening is Critical in India</h2>
                <p className="text-lg text-orange-100">
                  With 60% of colorectal cancer cases occurring before age 50 in India, 
                  early screening is more important than ever.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Heart className="h-8 w-8 text-red-500 mr-3" />
                    Risk Factors in Indian Population
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Increased consumption of processed and red meat
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Sedentary lifestyle in urban areas
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Rising rates of obesity and diabetes
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Genetic predisposition in certain populations
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Environmental factors and pollution
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Blood-Based Screening</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      No cultural barriers - simple blood test
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Available at any diagnostic center across India
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Higher accuracy than traditional stool tests
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Suitable for younger age groups (40+ years)
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

        {/* Healthcare Access */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Accessible Healthcare Across India
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-orange-600 mb-2">1,000+</div>
                  <p className="text-gray-700">Partner diagnostic centers</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">28</div>
                  <p className="text-gray-700">States and UTs covered</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                  <p className="text-gray-700">Cities with access</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <p className="text-gray-700">Online booking support</p>
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
                Take Charge of Your Health Today
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                With 60% of CRC cases in India occurring before age 50, early screening 
                can save your life. Get tested with our advanced blood-based screening.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/get-screened">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Book Your Test Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-800">
                    Talk to Our Specialists
                  </Button>
                </a>
              </div>
              <p className="text-sm text-orange-200 mt-6">
                Available in Hindi, English, and regional languages
              </p>
              
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
      </div>
    </>
  );
};

export default IndiaColorectalScreening;