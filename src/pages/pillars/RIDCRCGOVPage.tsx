import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Building2, BarChart3, Users, Lightbulb, Award, ShieldCheck, 
  TrendingUp, Heart, Globe, CheckCircle, ArrowRight
} from 'lucide-react';

const RIDCRCGOVPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <Building2 className="h-12 w-12 text-white mr-3" />
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6">RID-CRC GOV™</h1>
            <p className="text-2xl mb-4 text-blue-100">Government & Institutional Alignment</p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Partnering with Singapore's health leadership to transform CRC screening from aspiration to achievement
            </p>
          </div>
        </Container>
      </div>

      {/* Ministerial Quote Section */}
      <Container>
        <div className="max-w-5xl mx-auto py-16">
          <Card className="border-l-4 border-red-500 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <blockquote className="text-2xl font-medium text-gray-800 italic mb-4 leading-relaxed">
                    "Early screening is still best... but in Singapore, 60% of CRC cases are still diagnosed late."
                  </blockquote>
                  <div className="text-lg text-red-700 font-semibold">
                    — Health Minister Khaw Boon Wan, 2009
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <a href="https://www.moh.gov.sg/newsroom/early-screening-is-still-best" 
                       className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      MOH Newsroom Archives
                    </a> | 
                    <a href="https://albk2009.blogspot.com/2009/03/sti-stop-no-1-cancer.html" 
                       className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                      STI: Stop No. 1 Cancer
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* Historical Context & Acknowledgment */}
      <div className="bg-slate-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Singapore's Commitment: 15+ Years of Investment
            </h2>
            <p className="text-lg text-gray-600">
              Recognizing the dedication, funding, and frameworks already in place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Policy Framework</h3>
                <p className="text-gray-600 text-sm">
                  Clear national screening guidelines, subsidized services, and public health infrastructure established by MOH and HPB
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Generous Funding</h3>
                <p className="text-gray-600 text-sm">
                  Substantial government investment in CRC prevention, including subsidies for FIT tests and colonoscopy procedures
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Clinical Excellence</h3>
                <p className="text-gray-600 text-sm">
                  World-class colorectal specialists through SCRS and leading institutions, with AIC supporting community care
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>

      {/* The Real Challenge */}
      <Container>
        <div className="max-w-4xl mx-auto py-16">
          <Card className="border-l-4 border-amber-500">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                The Tool Limitation Challenge
              </h2>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Despite Singapore's exemplary policy framework and generous funding, screening uptake has remained suboptimal. 
                The challenge was never inadequate commitment from our health leadership — it was the inherent limitations 
                of the screening tools available until now.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Stool-Based Testing Challenges</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• High avoidance rates due to collection process</li>
                    <li>• Limited sensitivity for early-stage cancers</li>
                    <li>• Often seen as inconvenient, leading to missed participation</li>
                    <li>• Low uptake due to cultural barriers and stigma</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Colonoscopy Access Gaps</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• The gold standard for diagnosis and early treatment</li>
                    <li>• Yet often only pursued after symptoms appear</li>
                    <li>• Preparation requirements may cause patient delay</li>
                    <li>• Capacity challenges for widescale first-line screening</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-green-800 mb-2">The COLONAiVE™ Opportunity</h3>
                <p className="text-green-700 text-sm">
                  With validated blood-based CRC screening now available (CE-marked, HSA-cleared), we can finally 
                  bridge the gap between policy intention and population participation — directing high-risk individuals 
                  to timely colonoscopy when it matters most.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* Current Impact Stats */}
      <div className="bg-gradient-to-r from-gray-100 to-blue-50 py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Numbers Tell the Story</h2>
            <p className="text-gray-600">Evidence-based insights driving our collaborative approach</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-red-600 mb-3" />
              <div className="text-3xl font-bold text-gray-800">60%+</div>
              <div className="text-gray-600 text-sm">Late-stage CRC diagnosis rate (unchanged since 2009)</div>
            </div>
            
            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
              <Users className="h-12 w-12 mx-auto text-orange-600 mb-3" />
              <div className="text-3xl font-bold text-gray-800">70%</div>
              <div className="text-gray-600 text-sm">Of eligible Singaporeans avoid screening</div>
            </div>
            
            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-gray-800">3x</div>
              <div className="text-gray-600 text-sm">Uptake improvement in Kaiser Permanente blood test trials</div>
            </div>
            
            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
              <Globe className="h-12 w-12 mx-auto text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-gray-800">2035</div>
              <div className="text-gray-600 text-sm">Singapore's target year to lead CRC elimination</div>
            </div>
          </div>
        </Container>
      </div>

      {/* Collaboration Framework */}
      <Container>
        <div className="max-w-5xl mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              A Partnership Ready to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              RID-CRC GOV™ welcomes alignment with MOH, HPB, AIC, SCRS, and academic partners — 
              not to replace existing frameworks, but to amplify their impact through enhanced tools and unified messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-xl text-blue-800">Institutional Readiness</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Singapore's health institutions have established robust screening frameworks and generous subsidies. 
                  COLONAiVE™ now provides the missing piece — more acceptable screening tools that can finally 
                  translate policy into population participation.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <div>• MOH: Policy leadership and strategic direction</div>
                  <div>• HPB: Community health programming</div>
                  <div>• SCRS: Clinical expertise and standards</div>
                  <div>• AIC: Anchoring follow-up care, survivorship pathways, and community engagement for patients flagged through screening</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="font-semibold text-xl text-purple-800">Clinician-Led Credibility</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  This movement is guided by Singapore's most respected colorectal specialists — 
                  Dr. Francis Seow-Choen, Prof. Eu Kong Weng, and Prof. Lawrence Ho — who've dedicated 
                  decades to preventing and treating CRC. Their endorsement ensures clinical rigor and public trust.
                </p>
                <div className="text-xs text-purple-600 space-y-1">
                  <div>• Evidence-based approach to screening innovation</div>
                  <div>• Non-partisan, clinically-driven messaging</div>
                  <div>• Integration with existing care pathways</div>
                  <div>• Commitment to patient-centered outcomes</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="font-semibold text-xl text-green-800">Innovation Integration</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Blood-based CRC screening complements existing tools rather than replacing them. 
                  This creates a tiered approach: accessible blood tests for initial screening, 
                  colonoscopy for high-risk individuals and definitive diagnosis.
                </p>
                <div className="text-xs text-green-600 space-y-1">
                  <div>• CE-marked and HSA-cleared blood tests</div>
                  <div>• Seamless integration with current pathways</div>
                  <div>• Enhanced patient triage to colonoscopy</div>
                  <div>• Reduced burden on specialist resources</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-teal-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-teal-600 mr-3" />
                  <h3 className="font-semibold text-xl text-teal-800">Global Leadership Opportunity</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Singapore has the opportunity to demonstrate how innovative screening tools, 
                  combined with strong public health infrastructure, can achieve the WHO's goal 
                  of eliminating preventable cancer deaths.
                </p>
                <div className="text-xs text-teal-600 space-y-1">
                  <div>• Model for other developed nations</div>
                  <div>• Regional hub for CRC elimination expertise</div>
                  <div>• Academic and policy research opportunities</div>
                  <div>• International health diplomacy leadership</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>

      {/* Call to Partnership */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <ShieldCheck className="h-16 w-16 text-white mr-4" />
              <Globe className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Singapore Can Lead the World</h2>
            <p className="text-xl mb-6 text-blue-100 leading-relaxed">
              We invite Singapore's health leadership to engage with Project COLONAiVE™. 
              Together, we can transform 15+ years of commitment and investment into the breakthrough 
              that finally eliminates preventable colorectal cancer deaths.
            </p>
            <p className="text-lg mb-8 text-blue-200">
              This is Singapore's moment to show the world how vision, technology, and collaboration 
              can outsmart cancer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/government">
                <Button className="bg-white text-blue-700 font-semibold px-8 py-4 hover:bg-blue-50 flex items-center">
                  Initiate Dialogue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4">
                  Learn More About COLONAiVE™
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer Navigation */}
      <div className="py-12 bg-gray-50">
        <Container>
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Explore the Complete Movement</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/movement-pillars">
                <Button variant="outline" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  All Five Pillars
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  About COLONAiVE™
                </Button>
              </Link>
              <Link to="/about/advisors">
                <Button variant="outline" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Clinical Advisors
                </Button>
              </Link>
            </div>
            <div className="pt-4">
              <Link to="/">
                <Button variant="secondary" className="px-8">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default RIDCRCGOVPage;