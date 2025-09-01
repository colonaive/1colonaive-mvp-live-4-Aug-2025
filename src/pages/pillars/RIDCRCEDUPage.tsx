// /home/project/src/pages/pillars/RIDCRCEDUPage.tsx

import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Stethoscope, Youtube, AlertTriangle, Heart, Users, TrendingUp } from 'lucide-react';

const RIDCRCEDUPage: React.FC = () => {
  return (
    <div className="pt-20">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">RID-CRC EDU™</h1>
            <p className="text-xl mb-4">
              Education That Saves Lives — For Patients, Clinicians, and the Nation
            </p>
            <p className="text-lg opacity-90">
              Knowledge is the first line of defense against Singapore's #1 cancer
            </p>
          </div>
        </Container>
      </div>

      {/* Urgent Problem Statement */}
      <Container>
        <div className="py-16 max-w-5xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-8 mb-8 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-4">The Silent Crisis That Education Can Stop</h2>
                <p className="text-red-700 mb-4 text-lg">
                  <strong>Every day in Singapore, lives are lost not because colorectal cancer cannot be treated — but because people don't know what to look out for, when to screen, or where to go.</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">60%+</div>
                    <div className="text-sm text-red-700">Diagnosed at late stages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">70%</div>
                    <div className="text-sm text-red-700">Skip recommended screening</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">90%</div>
                    <div className="text-sm text-red-700">Survival rate when caught early</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-6">Why Education Is Our Most Powerful Weapon</h2>
            <p className="text-gray-700 mb-4 text-lg">
              The RID-CRC EDU™ pillar delivers credible, up-to-date information that transforms awareness into life-saving action. When people understand their risk and options, they act. When they act early, they live.
            </p>
            <p className="text-blue-600 font-semibold text-lg">
              Education is the bridge between awareness and the action that saves lives.
            </p>
          </div>
        </div>
      </Container>

      {/* Impact Statistics */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 py-12">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">The Power of Informed Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">50%</div>
                <div className="text-sm text-gray-600">Of CRC cases are preventable with screening</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">25%</div>
                <div className="text-sm text-gray-600">Better preparation quality with educational videos</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">1M+</div>
                <div className="text-sm text-gray-600">CRC survivors in the US thanks to early detection</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">45</div>
                <div className="text-sm text-gray-600">Recommended screening age (lowered from 50)</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Interactive Educational Content - No External Links */}
      <Container>
        <div className="py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Essential Knowledge: Understanding Colorectal Cancer</h2>
          <p className="text-gray-600 mb-8">
            Learn the fundamentals of colorectal cancer prevention and early detection through our comprehensive educational content.
          </p>

          {/* Educational Cards Instead of Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Card 1: What is Colorectal Cancer */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">What is Colorectal Cancer?</h3>
                <div className="text-left space-y-3 text-gray-700">
                  <p><strong>Singapore's #1 Cancer:</strong> CRC affects the colon and rectum, parts of the large intestine.</p>
                  <p><strong>How it develops:</strong> Most CRC starts as small growths called polyps that can become cancerous over 10+ years.</p>
                  <p><strong>The good news:</strong> When caught early through screening, CRC has a 90% survival rate.</p>
                  <p><strong>Prevention is possible:</strong> Regular screening can find and remove polyps before they become cancer.</p>
                </div>
                <div className="mt-6">
                  <Link to="/education/patients/colorectal-cancer">
                    <Button className="w-full">Learn More Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Colonoscopy Preparation */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Colonoscopy Preparation</h3>
                <div className="text-left space-y-3 text-gray-700">
                  <p><strong>Why preparation matters:</strong> Proper prep ensures doctors can see clearly and catch any issues.</p>
                  <p><strong>Key steps:</strong> Follow dietary restrictions, take prescribed medications, stay hydrated.</p>
                  <p><strong>Timing:</strong> Usually starts 1-2 days before your procedure.</p>
                  <p><strong>Success rate:</strong> Good preparation leads to better results and fewer repeat procedures.</p>
                </div>
                <div className="mt-6">
                  <Link to="/education/patients/colonoscopy-gold-standard">
                    <Button className="w-full" variant="outline">Complete Prep Guide</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Facts Section */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">Key Facts That Could Save Your Life</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-sm text-blue-700">of CRC cases are preventable with screening</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">45</div>
                <div className="text-sm text-green-700">Starting age for screening (lowered from 50)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10 yrs</div>
                <div className="text-sm text-purple-700">How long polyps take to become cancer</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Why This Matters for Singapore</h3>
            <p className="text-blue-700">
              With CRC being Singapore's most common cancer, understanding these basics can literally save your life or the life of someone you love. Knowledge shared is lives saved.
            </p>
          </div>
        </div>
      </Container>

      {/* Patient Education Section */}
      <Container>
        <div className="py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">For Patients & Families: Knowledge That Protects</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Empower yourself and your loved ones with evidence-based information. Every person who understands their risk becomes a potential life-saver.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/education/patients/colorectal-cancer">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <BookOpen className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">What is Colorectal Cancer?</h3>
                      <p className="text-gray-600">Learn what CRC is, how it develops, and why screening matters. Knowledge starts here.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/early-symptoms-of-crc">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Early Warning Signs</h3>
                      <p className="text-gray-600">Don't ignore the signs — even mild symptoms may be warning flags that save lives.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/colonoscopy-gold-standard">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Stethoscope className="h-8 w-8 text-green-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Colonoscopy: The Gold Standard</h3>
                      <p className="text-gray-600">Understand why colonoscopy is the most effective tool for CRC detection and prevention.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/patients/how-crc-develops-from-polyps">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <TrendingUp className="h-8 w-8 text-purple-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">From Polyps to Cancer</h3>
                      <p className="text-gray-600">See how early polyps become dangerous — and how intervention stops the progression.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </Container>

      {/* Preparation Education Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Colonoscopy Preparation: Knowledge That Improves Outcomes</h2>
            <p className="text-gray-600 mb-8">
              Proper preparation is crucial for effective screening. Education has been proven to improve preparation quality by up to 25%.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-800">25%</div>
                  <div className="text-sm text-gray-600">Better preparation quality with education</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-800">90%</div>
                  <div className="text-sm text-gray-600">Don't need repeat procedures</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-800">All</div>
                  <div className="text-sm text-gray-600">Education levels benefit equally</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-green-50 p-6 rounded-lg text-left">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Research-Proven Benefits of Patient Education:</h3>
              <ul className="text-green-700 space-y-2">
                <li>• <strong>Significantly improved</strong> bowel preparation quality</li>
                <li>• <strong>Reduced need</strong> for repeat procedures</li>
                <li>• <strong>Better patient understanding</strong> across all education levels</li>
                <li>• <strong>Increased confidence</strong> and reduced anxiety</li>
                <li>• <strong>Higher screening compliance</strong> rates</li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Clinician Education Section */}
      <Container>
        <div className="py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">For Clinicians & Healthcare Professionals</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Equip yourself with the latest guidelines and evidence-based practices to maximize screening effectiveness in Singapore.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/education/clinicians/clinical-guidelines">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <GraduationCap className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Updated Clinical Guidelines</h3>
                      <p className="text-gray-600">Stay aligned with latest CRC screening guidelines and evidence-based referral practices.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/education/clinicians/case-studies">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Stethoscope className="h-8 w-8 text-teal-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Case Studies & Lessons</h3>
                      <p className="text-gray-600">Real-world examples of missed cases, early interventions, and life-saving outcomes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </Container>

      {/* Call to Action for Champions */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Become a Champion of Life-Saving Education</h2>
            <p className="text-xl mb-8 opacity-90">
              Every person you educate about CRC screening could be the one who gets screened early, catches polyps before they become cancer, and lives to see their grandchildren grow up.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Share Knowledge</h3>
                <p className="text-sm opacity-90">Spread evidence-based information in your community</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <Heart className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Save Lives</h3>
                <p className="text-sm opacity-90">Your education efforts directly prevent cancer deaths</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-2">Build Movement</p>
                <p className="text-sm opacity-90">Join thousands working toward CRC-free Singapore</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/signup/champion">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                  Join as Champion - Start Saving Lives Today
                </Button>
              </Link>
              <p className="text-sm opacity-75">
                Free to join • Access exclusive resources • Make a real difference
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Coming Soon / Additional Resources */}
      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Growing Library of Life-Saving Content</h2>
              <p className="text-gray-600 mb-6">
                We're actively collaborating with Singapore's leading clinicians, patients, and educators to build a comprehensive CRC education library. New videos, guides, and interactive content are added regularly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup/champion">
                  <Button>Become a Champion for Early Access</Button>
                </Link>
                <Link to="/movement-pillars">
                  <Button variant="outline">Explore All Pillars</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

    </div>
  );
};

export default RIDCRCEDUPage;