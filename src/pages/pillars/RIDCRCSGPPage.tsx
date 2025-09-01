import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stethoscope, Users, ArrowRightLeft, Star, UserPlus, Heart, Trophy, Shield, BookOpen, Target, Award } from 'lucide-react';

const RIDCRCSGPPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-700 to-sky-500 text-white py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Stethoscope className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">RID-CRC SGP™</h1>
            <p className="text-2xl mb-4">
              Specialist & GP Engagement Pillar
            </p>
            <p className="text-xl opacity-90">
              Clinician Leadership Against Colorectal Cancer - The Backbone of Our National Mission
            </p>
            <div className="mt-8 flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6 text-red-300" />
              <span className="text-lg">Honoring Our Medical Heroes</span>
              <Heart className="h-6 w-6 text-red-300" />
            </div>
          </div>
        </Container>
      </div>

      {/* Tribute to Medical Heroes */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 text-gray-800">The Heroes Behind the Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Every life saved from colorectal cancer bears the fingerprints of dedicated clinicians. You are the guardians at the gate, 
              the skilled hands that heal, the compassionate voices that guide patients through their darkest moments, and the brilliant 
              minds that push the boundaries of medical excellence. Without you, no screening program, no awareness campaign, 
              no technological advancement can truly save lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-blue-800">The Guardians</h3>
                <p className="text-gray-700">
                  General Practitioners who serve as the first line of defense, detecting early warning signs and 
                  guiding patients toward timely screening with wisdom born of experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-teal-500">
              <CardContent className="p-6">
                <Target className="h-10 w-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-teal-800">The Specialists</h3>
                <p className="text-gray-700">
                  Gastroenterologists and Colorectal Surgeons who wield precision instruments and cutting-edge techniques 
                  to diagnose, treat, and cure with unmatched expertise.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-purple-800">The Innovators</h3>
                <p className="text-gray-700">
                  Researchers and academic clinicians who advance the science of colorectal cancer prevention, 
                  treatment, and care through tireless dedication to excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>

      {/* Historical Legacy */}
      <div className="bg-white py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Award className="h-12 w-12 text-amber-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6 text-gray-800">A Legacy of Excellence</h2>
              <p className="text-xl text-gray-600">
                Singapore's Journey to Becoming a Global Leader in Colorectal Care
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-amber-800">The Foundation Years (1989)</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                In 1989, a visionary decision was made that would forever change Singapore's medical landscape. 
                The Department of Colorectal Surgery was established at Singapore General Hospital - a strategic move 
                that recognized the growing threat of colorectal cancer and the need for specialized expertise to combat it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                As then-Minister for Health Khaw Boon Wan reflected, "I knew the significance of that decision and the strategic intent of that move. 
                Subsequent developments confirmed the wisdom of that policy decision."
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">The Pioneer Leaders</h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-xl font-semibold text-blue-700">Dr. Goh Hak Su</h4>
                      <p className="text-gray-700">
                        <strong>Pioneer Leader (1989-1997)</strong> - Led the first generation of colorectal surgeons, 
                        laying the foundation for what would become world-class colorectal care in Singapore.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h4 className="text-xl font-semibold text-teal-700">Dr. Francis Seow Choen</h4>
                      <p className="text-gray-700">
                        <strong>Expansion Era (1997-2003)</strong> - Advanced the department's clinical excellence and 
                        began establishing Singapore's reputation in the international colorectal surgery community.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-xl font-semibold text-purple-700">Prof. Eu Kong Weng</h4>
                      <p className="text-gray-700">
                        <strong>Academic Excellence Era (2003-present)</strong> - Elevated the field by integrating 
                        research and academic excellence with clinical services, forging international collaborations 
                        that have made Singapore proud.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-white rounded-lg border border-blue-200">
                    <p className="text-gray-700 italic">
                      "Together, they have trained many of our best colorectal surgeons. With each passing decade, 
                      they have moved colorectal surgery to higher levels, adding research and academic excellence to clinical services, 
                      while forging important ties and research collaborations internationally. They have done Singapore proud."
                    </p>
                    <p className="text-sm text-gray-600 mt-2">- Minister Khaw Boon Wan, 2009</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* The Challenge We Face Together */}
      <div className="bg-red-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-red-800">The Challenge We Face Together</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-700">The Rising Threat</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Colorectal cancer is now the <strong>most common cancer</strong> in Singapore</li>
                    <li>• <strong>1,500 new cases</strong> diagnosed annually</li>
                    <li>• Incidence continues to rise with our aging population</li>
                    <li>• Mysteriously higher rates among Chinese Singaporeans vs. other Chinese populations</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-700">The Critical Gap</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>60% of cases</strong> detected too late, at advanced stages</li>
                    <li>• Screening rates remain critically low</li>
                    <li>• Only <strong>1 in 9 men</strong> and <strong>1 in 13 women</strong> aged 50-70 have had colonoscopy</li>
                    <li>• Our 5-year survival rate lags behind OECD averages</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                <strong>Your expertise and leadership are essential to closing this gap and saving lives.</strong>
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Why Clinicians Matter */}
      <Container>
        <div className="max-w-4xl mx-auto py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Your Role is Irreplaceable</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">Trust & Influence</h3>
              <p className="text-gray-700 text-lg mb-6">
                Patients trust their doctors above all other sources of health information. Your recommendation for screening 
                carries more weight than any public campaign, advertisement, or government initiative. When you speak, lives change.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4 text-teal-700">Clinical Judgment</h3>
              <p className="text-gray-700 text-lg">
                Your ability to assess risk factors, interpret symptoms, and determine appropriate screening strategies 
                is irreplaceable. Technology may advance, but the human touch of clinical expertise remains paramount.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-700">Early Detection</h3>
              <p className="text-gray-700 text-lg mb-6">
                Whether recommending timely colonoscopies, interpreting screening results, or recognizing subtle early symptoms, 
                you are the critical link between health and disease, between early detection and late-stage diagnosis.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4 text-amber-700">Compassionate Care</h3>
              <p className="text-gray-700 text-lg">
                Beyond technical expertise, you provide the human connection that helps patients navigate fear, 
                understand complex information, and make informed decisions about their health.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Referral & Access Pathways */}
      <div className="bg-gray-50 py-16">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Streamlined Care Pathways
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            We've designed flexible pathways that respect both patient autonomy and clinical judgment, 
            ensuring every Singaporean can access the care they need.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-blue-800">Path A: Patient-Initiated</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-center text-lg font-semibold text-blue-700">
                    Patient → Specialist → Colonoscopy
                  </p>
                </div>
                <p className="text-gray-700 mb-6">
                  Individuals aged 50+ or with symptoms can directly access specialist care. 
                  This pathway empowers patients while ensuring they receive expert evaluation and appropriate screening.
                </p>
                <div className="text-center">
                  <Link to="/find-a-specialist">
                    <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50">
                      Specialist Directory
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-teal-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Stethoscope className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-teal-800">Path B: Clinician-Guided</h3>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <p className="text-center text-lg font-semibold text-teal-700">
                    GP → Risk Assessment → Screening → Colonoscopy
                  </p>
                </div>
                <p className="text-gray-700 mb-6">
                  For patients under 50 or those uncertain about their risk, your clinical expertise guides 
                  appropriate risk stratification using advanced screening tools before recommending colonoscopy.
                </p>
                <div className="text-center">
                  <Link to="/get-screened#clinics">
                    <Button variant="outline" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                      Find Partner Clinics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>

      {/* Comprehensive Support */}
      <Container>
        <div className="max-w-5xl mx-auto py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Comprehensive Support for Your Practice</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Educational Resources</h3>
                <p className="text-sm text-gray-600">Patient brochures, screening guidelines, and clinical protocols</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">CME Programs</h3>
                <p className="text-sm text-gray-600">Accredited webinars and learning sessions on latest developments</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <ArrowRightLeft className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Referral Tools</h3>
                <p className="text-sm text-gray-600">Streamlined templates and standardized operating procedures</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Recognition</h3>
                <p className="text-sm text-gray-600">National acknowledgment for your contribution to CRC prevention</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/clinician-education">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3">
                Access Complete Resource Library
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* Clinician Champions Gallery */}
      <div className="bg-slate-100 py-16">
        <Container>
          <h2 className="text-3xl font-bold mb-6 text-center">Clinician Champions</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Celebrating the dedicated professionals who go above and beyond in the fight against colorectal cancer. 
            These champions embody the spirit of excellence and compassion that defines Singapore's medical community.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <Card key={id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-500 rounded-full mx-auto flex items-center justify-center">
                      <Users className="text-white" size={36} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                      <Star className="text-white" size={16} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Dr. Champion {id}</h3>
                  <p className="text-sm text-gray-500 mb-3">Gastroenterologist / Colorectal Surgeon</p>
                  <p className="text-sm text-gray-600 italic">
                    "Leading by example in early detection and patient care excellence."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/join-the-movement#nominate-clinician">
              <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
                Nominate a Champion Clinician
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Call to Join Panel */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <UserPlus className="mx-auto mb-6 text-white" size={48} />
            <h2 className="text-4xl font-bold mb-6">Join the COLONAiVE™ Clinical Panel</h2>
            <p className="text-xl mb-4 opacity-90">
              Be part of Singapore's most ambitious healthcare initiative
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-3xl mx-auto">
              Your expertise can help shape national screening guidelines, influence policy decisions, 
              and directly impact thousands of lives. Together, we can make Singapore a global model 
              for colorectal cancer prevention and care.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For General Practitioners</h3>
                <p className="text-sm opacity-90">
                  Lead community screening efforts and be the trusted voice that guides patients toward life-saving early detection.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Specialists</h3>
                <p className="text-sm opacity-90">
                  Advance clinical protocols, mentor the next generation, and pioneer innovative approaches to colorectal care.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register/clinic">
                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg min-w-[220px]">
                  Join as GP Partner
                </Button>
              </Link>
              <Link to="/find-a-specialist">
                <Button variant="teal" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg min-w-[220px]">
                  Find Project Partner Clinics
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm opacity-75">
              * Partnership includes recognition, resources, and direct involvement in national health policy development
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default RIDCRCSGPPage;